#!/usr/bin/env python3
"""Build an inventory for external validation reference datasets.

This script scans ignored raw-image folders under validation_ref_sets/raw and
writes a lightweight metadata CSV that can be committed without committing the
large raw images themselves.
"""

from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
RAW_ROOT = PROJECT_ROOT / "validation_ref_sets" / "raw"
OUTPUT_CSV = PROJECT_ROOT / "docs" / "validation-ref-inventory.csv"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tif", ".tiff"}


DATASET_LABELS = {
    "whad_camad": "WHAD/CAMAD",
    "csma": "CSMA",
    "local_phone": "Local phone/eyepiece",
}


def infer_timepoint_hours(dataset_key: str, filename: str) -> str:
    stem = Path(filename).stem
    if dataset_key == "whad_camad":
        match = re.search(r"_t(\d+)_", stem, re.IGNORECASE)
        if match:
            return str(int(match.group(1)))
    if dataset_key == "csma":
        match = re.search(r"_(\d+)$", stem)
        if match:
            return str(int(match.group(1)))
        if stem.endswith("_0") or stem.endswith("new_0"):
            return "0"
    if dataset_key == "local_phone":
        match = re.search(r"(\d+)\s*h", stem, re.IGNORECASE)
        if match:
            return str(int(match.group(1)))
    return ""


def infer_group(dataset_key: str, rel_to_dataset: Path) -> str:
    parts = rel_to_dataset.parts
    if dataset_key == "whad_camad" and len(parts) >= 2 and parts[0] == "extracted":
        return parts[1]
    if dataset_key == "csma" and len(parts) >= 2 and parts[0] == "extracted":
        return parts[1]
    if dataset_key == "local_phone" and len(parts) >= 2 and parts[0] == "selected_images":
        return parts[1]
    return rel_to_dataset.parent.name


def image_info(path: Path) -> tuple[str, str, str]:
    try:
        suffix = path.suffix.lower()
        if suffix in {".jpg", ".jpeg"}:
            width, height = jpeg_size(path)
            return str(width), str(height), "JPEG"
        if suffix in {".tif", ".tiff"}:
            width, height = tiff_size(path)
            return str(width), str(height), "TIFF"
        if suffix == ".png":
            width, height = png_size(path)
            return str(width), str(height), "PNG"
        return "", "", "unsupported"
    except Exception as exc:  # pragma: no cover - inventory should keep going
        return "", "", f"ERROR: {exc}"


def png_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as fh:
        header = fh.read(24)
    if header[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG file")
    return int.from_bytes(header[16:20], "big"), int.from_bytes(header[20:24], "big")


def jpeg_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as fh:
        if fh.read(2) != b"\xff\xd8":
            raise ValueError("not a JPEG file")
        while True:
            marker_start = fh.read(1)
            if not marker_start:
                raise ValueError("JPEG SOF marker not found")
            if marker_start != b"\xff":
                continue
            marker = fh.read(1)
            while marker == b"\xff":
                marker = fh.read(1)
            marker_code = marker[0]
            if marker_code in {0xD8, 0xD9}:
                continue
            length_bytes = fh.read(2)
            if len(length_bytes) != 2:
                raise ValueError("truncated JPEG segment")
            length = int.from_bytes(length_bytes, "big")
            if marker_code in {
                0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF,
            }:
                data = fh.read(5)
                if len(data) != 5:
                    raise ValueError("truncated JPEG SOF")
                height = int.from_bytes(data[1:3], "big")
                width = int.from_bytes(data[3:5], "big")
                return width, height
            fh.seek(length - 2, 1)


def tiff_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as fh:
        endian = fh.read(2)
        if endian == b"II":
            byteorder = "little"
        elif endian == b"MM":
            byteorder = "big"
        else:
            raise ValueError("not a TIFF file")
        magic = int.from_bytes(fh.read(2), byteorder)
        if magic != 42:
            raise ValueError("unsupported TIFF magic")
        ifd_offset = int.from_bytes(fh.read(4), byteorder)
        fh.seek(ifd_offset)
        entry_count = int.from_bytes(fh.read(2), byteorder)
        width = height = None
        for _ in range(entry_count):
            entry = fh.read(12)
            if len(entry) != 12:
                raise ValueError("truncated TIFF IFD")
            tag = int.from_bytes(entry[0:2], byteorder)
            value_type = int.from_bytes(entry[2:4], byteorder)
            count = int.from_bytes(entry[4:8], byteorder)
            value_field = entry[8:12]
            if tag in {256, 257}:
                value = tiff_scalar_value(fh, value_type, count, value_field, byteorder)
                if tag == 256:
                    width = value
                else:
                    height = value
        if width is None or height is None:
            raise ValueError("TIFF width/height tags not found")
        return width, height


def tiff_scalar_value(fh, value_type: int, count: int, value_field: bytes, byteorder: str) -> int:
    type_sizes = {3: 2, 4: 4}
    size = type_sizes.get(value_type)
    if size is None or count < 1:
        raise ValueError(f"unsupported TIFF scalar type {value_type}")
    total = size * count
    if total <= 4:
        data = value_field[:size]
    else:
        here = fh.tell()
        offset = int.from_bytes(value_field, byteorder)
        fh.seek(offset)
        data = fh.read(size)
        fh.seek(here)
    return int.from_bytes(data, byteorder)


def iter_rows(raw_root: Path):
    inventory_id = 1
    for dataset_dir in sorted(raw_root.iterdir()):
        if not dataset_dir.is_dir():
            continue
        dataset_key = dataset_dir.name
        if dataset_key == "rqsa_deferred":
            continue
        dataset_label = DATASET_LABELS.get(dataset_key, dataset_key)
        for path in sorted(dataset_dir.rglob("*")):
            if not path.is_file() or path.suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            rel_project = path.relative_to(PROJECT_ROOT)
            rel_dataset = path.relative_to(dataset_dir)
            width, height, mode = image_info(path)
            yield {
                "inventory_id": f"ref-{inventory_id:04d}",
                "dataset_key": dataset_key,
                "dataset_label": dataset_label,
                "source_role": source_role(dataset_key),
                "group_id": infer_group(dataset_key, rel_dataset),
                "timepoint_index_or_hours": infer_timepoint_hours(dataset_key, path.name),
                "filename": path.name,
                "relative_path": rel_project.as_posix(),
                "extension": path.suffix.lower(),
                "width_px": width,
                "height_px": height,
                "image_mode": mode,
                "file_size_mb": f"{path.stat().st_size / 1024 / 1024:.3f}",
                "include_candidate": "yes",
                "manual_review_status": "pending",
                "notes": "",
            }
            inventory_id += 1


def source_role(dataset_key: str) -> str:
    return {
        "whad_camad": "primary_professional_time_lapse",
        "csma": "public_comparator_workflow",
        "local_phone": "real_world_usability_stress",
    }.get(dataset_key, "unclassified")


def write_csv(rows: list[dict], output_csv: Path) -> None:
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "inventory_id",
        "dataset_key",
        "dataset_label",
        "source_role",
        "group_id",
        "timepoint_index_or_hours",
        "filename",
        "relative_path",
        "extension",
        "width_px",
        "height_px",
        "image_mode",
        "file_size_mb",
        "include_candidate",
        "manual_review_status",
        "notes",
    ]
    with output_csv.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw-root", type=Path, default=RAW_ROOT)
    parser.add_argument("--output-csv", type=Path, default=OUTPUT_CSV)
    args = parser.parse_args()

    rows = list(iter_rows(args.raw_root))
    write_csv(rows, args.output_csv)
    print(f"Wrote {len(rows)} rows to {args.output_csv.relative_to(PROJECT_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
