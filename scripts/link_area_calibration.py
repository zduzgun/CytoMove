"""Link COMBINE ground-truth metrics into Cytomove calibration files.

Outputs:
- docs/area-calibration-set.csv: one-to-one image rows usable for early area-first calibration.
- docs/area-calibration-trends.csv: aggregate ORT rows usable for trend checks, not image validation.
- updates docs/ground-truth-sampling-plan.csv where a selected image already has COMBINE values.
"""

from __future__ import annotations

import csv
from collections import Counter
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
COMBINE_GT = ROOT / "docs" / "combine-ground-truth.csv"
SAMPLING_PLAN = ROOT / "docs" / "ground-truth-sampling-plan.csv"
OUT_SET = ROOT / "docs" / "area-calibration-set.csv"
OUT_TRENDS = ROOT / "docs" / "area-calibration-trends.csv"
OUT_SUMMARY = ROOT / "docs" / "area-calibration-summary.md"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as fh:
        return list(csv.DictReader(fh))


def write_csv(path: Path, fieldnames: Iterable[str], rows: list[dict[str, str]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(fieldnames))
        writer.writeheader()
        writer.writerows(rows)


def calibration_use(mapping_confidence: str) -> str:
    if mapping_confidence == "explicit_label":
        return "primary_one_to_one"
    if mapping_confidence == "inferred_from_folder_timepoint":
        return "provisional_one_to_one_verify_visually"
    return "trend_only"


def build_area_set(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    out = []
    idx = 1
    for row in rows:
        if row["source_kind"] != "main_table" or not row["matched_image_id"]:
            continue
        out.append(
            {
                "calibration_id": f"cal-{idx:03d}",
                "image_id": row["matched_image_id"],
                "relative_path": row["matched_relative_path"],
                "cell_line": row["cell_line"],
                "condition": row["condition"],
                "time_point_h": row["time_point_h"],
                "ground_truth_area_pixels2": row["area_pixels2"],
                "ground_truth_area_percent": row["area_percent"],
                "ground_truth_width_pixels": row["width_pixels"],
                "ground_truth_width_sd_pixels": row["standard_deviation_pixels"],
                "ground_truth_wound_closure_percent": row["wound_closure_percent"],
                "mapping_confidence": row["mapping_confidence"],
                "calibration_use": calibration_use(row["mapping_confidence"]),
                "source_xlsx": row["source_xlsx"],
                "matched_filename": row["matched_filename"],
                "notes": "Area-first calibration row from COMBINE Excel main table.",
            }
        )
        idx += 1
    return out


def build_trends(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    out = []
    idx = 1
    for row in rows:
        if row["source_kind"] != "replicate_average":
            continue
        out.append(
            {
                "trend_id": f"trend-{idx:03d}",
                "cell_line": row["cell_line"],
                "condition": row["condition"],
                "time_point_h": row["time_point_h"],
                "aggregate_area_pixels2": row["area_pixels2"],
                "aggregate_area_percent": row["area_percent"],
                "aggregate_wound_closure_percent": row["wound_closure_percent"],
                "replicate_count": row["replicate_count"],
                "source_xlsx": row["source_xlsx"],
                "notes": "Aggregate ORT row; use for trend calibration, not one-to-one image validation.",
            }
        )
        idx += 1
    return out


def update_sampling_plan(area_set: list[dict[str, str]]) -> int:
    if not SAMPLING_PLAN.exists():
        return 0
    rows = read_csv(SAMPLING_PLAN)
    by_image = {row["image_id"]: row for row in area_set}
    updated = 0
    for row in rows:
        gt = by_image.get(row["image_id"])
        if not gt:
            continue
        row["imagej_area_px2"] = gt["ground_truth_area_pixels2"]
        row["imagej_width_px"] = gt["ground_truth_width_pixels"]
        row["imagej_wound_closure_percent"] = gt["ground_truth_wound_closure_percent"]
        row["measurement_status"] = "seeded_from_combine_excel"
        note = (
            f"Seeded from {gt['source_xlsx']} ({gt['mapping_confidence']}); "
            f"use={gt['calibration_use']}"
        )
        row["notes"] = note if not row.get("notes") else row["notes"] + " | " + note
        updated += 1
    if rows:
        write_csv(SAMPLING_PLAN, rows[0].keys(), rows)
    return updated


def write_summary(area_set: list[dict[str, str]], trends: list[dict[str, str]], plan_updates: int) -> None:
    by_use = Counter(row["calibration_use"] for row in area_set)
    by_group = Counter((row["cell_line"], row["condition"]) for row in area_set)
    lines = [
        "# Cytomove Area Calibration Link — Summary",
        "",
        "**Generated by:** `scripts/link_area_calibration.py`  ",
        "**Input:** `docs/combine-ground-truth.csv`  ",
        "**One-to-one output:** `docs/area-calibration-set.csv`  ",
        "**Aggregate output:** `docs/area-calibration-trends.csv`",
        "",
        f"**One-to-one calibration rows:** {len(area_set)}",
        f"**Aggregate trend rows:** {len(trends)}",
        f"**Sampling-plan rows seeded:** {plan_updates}",
        "",
        "## One-to-one Use Class",
        "",
        "| Use class | n |",
        "|---|---:|",
    ]
    for key, value in sorted(by_use.items()):
        lines.append(f"| {key} | {value} |")
    lines.extend(["", "## One-to-one Groups", "", "| Cell line | Condition | n |", "|---|---|---:|"])
    for (cell, condition), value in sorted(by_group.items()):
        lines.append(f"| {cell} | {condition} | {value} |")
    lines.extend(
        [
            "",
            "## Usage Notes",
            "",
            "- Start the segmentation prototype with `primary_one_to_one` rows; they have explicit image labels in the Excel source.",
            "- Use `provisional_one_to_one_verify_visually` rows after confirming that folder/timepoint inference matches the actual image file.",
            "- Use `area_pixels2` as the first calibration target. Add `width_pixels` after the wound mask is stable enough to derive width consistently.",
            "- Aggregate trend rows are useful for checking monotonic closure behavior but should not be used for per-image Pearson/error metrics.",
        ]
    )
    OUT_SUMMARY.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    combine_rows = read_csv(COMBINE_GT)
    area_set = build_area_set(combine_rows)
    trends = build_trends(combine_rows)
    write_csv(
        OUT_SET,
        [
            "calibration_id",
            "image_id",
            "relative_path",
            "cell_line",
            "condition",
            "time_point_h",
            "ground_truth_area_pixels2",
            "ground_truth_area_percent",
            "ground_truth_width_pixels",
            "ground_truth_width_sd_pixels",
            "ground_truth_wound_closure_percent",
            "mapping_confidence",
            "calibration_use",
            "source_xlsx",
            "matched_filename",
            "notes",
        ],
        area_set,
    )
    write_csv(
        OUT_TRENDS,
        [
            "trend_id",
            "cell_line",
            "condition",
            "time_point_h",
            "aggregate_area_pixels2",
            "aggregate_area_percent",
            "aggregate_wound_closure_percent",
            "replicate_count",
            "source_xlsx",
            "notes",
        ],
        trends,
    )
    plan_updates = update_sampling_plan(area_set)
    write_summary(area_set, trends, plan_updates)
    print(f"Wrote {OUT_SET.relative_to(ROOT).as_posix()} ({len(area_set)} rows)")
    print(f"Wrote {OUT_TRENDS.relative_to(ROOT).as_posix()} ({len(trends)} rows)")
    print(f"Updated {SAMPLING_PLAN.relative_to(ROOT).as_posix()} ({plan_updates} seeded rows)")
    print(f"Wrote {OUT_SUMMARY.relative_to(ROOT).as_posix()}")


if __name__ == "__main__":
    main()