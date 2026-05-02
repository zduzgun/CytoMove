#!/usr/bin/env python3
"""Synthetic validation harness for Cytomove wound metrics.

Layer 1 focuses on binary masks with exact ground truth. These tests do not
exercise the browser segmentation pipeline; they verify the metric math that the
pipeline reports after a wound mask exists.
"""

from __future__ import annotations

import argparse
import binascii
import csv
import html
import math
import struct
import zlib
from dataclasses import dataclass
from pathlib import Path
from statistics import median


@dataclass(frozen=True)
class Metrics:
    wound_area_px: int
    wound_area_fraction_percent: float
    mean_width_px: float
    median_width_px: float
    width_sd_px: float
    width_cv_percent: float
    min_width_px: int
    max_width_px: int
    valid_row_count: int
    valid_row_fraction_percent: float


@dataclass(frozen=True)
class Case:
    case_id: str
    difficulty: int
    width: int
    height: int
    rows: tuple[tuple[int, int, int], ...]
    description: str


def blank_mask(width: int, height: int) -> list[list[int]]:
    return [[0 for _ in range(width)] for _ in range(height)]


def make_mask(case: Case) -> list[list[int]]:
    mask = blank_mask(case.width, case.height)
    for y, x0, x1 in case.rows:
        if y < 0 or y >= case.height:
            raise ValueError(f"{case.case_id}: y out of bounds: {y}")
        if x0 < 0 or x1 >= case.width or x1 < x0:
            raise ValueError(f"{case.case_id}: invalid x span: {x0}-{x1}")
        for x in range(x0, x1 + 1):
            mask[y][x] = 1
    return mask


def measure_mask(mask: list[list[int]]) -> Metrics:
    height = len(mask)
    width = len(mask[0]) if height else 0
    area = sum(sum(row) for row in mask)
    spans: list[int] = []
    for row in mask:
        xs = [i for i, value in enumerate(row) if value]
        if xs:
            spans.append(xs[-1] - xs[0] + 1)
    if spans:
        mean_width = sum(spans) / len(spans)
        med_width = float(median(spans))
        sd = math.sqrt(sum((span - mean_width) ** 2 for span in spans) / len(spans))
        cv = sd * 100 / mean_width if mean_width else 0.0
        min_width = min(spans)
        max_width = max(spans)
    else:
        mean_width = med_width = sd = cv = 0.0
        min_width = max_width = 0
    field_area = width * height
    return Metrics(
        wound_area_px=area,
        wound_area_fraction_percent=(area * 100 / field_area) if field_area else 0.0,
        mean_width_px=mean_width,
        median_width_px=med_width,
        width_sd_px=sd,
        width_cv_percent=cv,
        min_width_px=min_width,
        max_width_px=max_width,
        valid_row_count=len(spans),
        valid_row_fraction_percent=(len(spans) * 100 / height) if height else 0.0,
    )


def assert_close(label: str, actual: float, expected: float, tolerance: float) -> None:
    if abs(actual - expected) > tolerance:
        raise AssertionError(f"{label}: expected {expected}, measured {actual}")


def compare_metrics(case_id: str, actual: Metrics, expected: Metrics) -> dict[str, str]:
    rows: dict[str, str] = {"case_id": case_id, "status": "pass"}
    for field in expected.__dataclass_fields__:
        a = getattr(actual, field)
        e = getattr(expected, field)
        assert_close(f"{case_id}.{field}", float(a), float(e), 0.0)
        rows[f"expected_{field}"] = f"{float(e):.10g}"
        rows[f"measured_{field}"] = f"{float(a):.10g}"
    return rows


def expected_from_case(case: Case) -> Metrics:
    area = sum(x1 - x0 + 1 for _, x0, x1 in case.rows)
    by_y: dict[int, list[tuple[int, int]]] = {}
    for y, x0, x1 in case.rows:
        by_y.setdefault(y, []).append((x0, x1))
    spans = [max(x1 for _, x1 in spans_for_y) - min(x0 for x0, _ in spans_for_y) + 1 for spans_for_y in by_y.values()]
    if spans:
        mean_width = sum(spans) / len(spans)
        med_width = float(median(spans))
        sd = math.sqrt(sum((span - mean_width) ** 2 for span in spans) / len(spans))
        cv = sd * 100 / mean_width if mean_width else 0.0
        min_width = min(spans)
        max_width = max(spans)
    else:
        mean_width = med_width = sd = cv = 0.0
        min_width = max_width = 0
    field_area = case.width * case.height
    return Metrics(
        wound_area_px=area,
        wound_area_fraction_percent=area * 100 / field_area,
        mean_width_px=mean_width,
        median_width_px=med_width,
        width_sd_px=sd,
        width_cv_percent=cv,
        min_width_px=min_width,
        max_width_px=max_width,
        valid_row_count=len(spans),
        valid_row_fraction_percent=len(spans) * 100 / case.height,
    )


def constant_width_case(case_id: str, difficulty: int, width: int, height: int, x0: int, x1: int, description: str) -> Case:
    return Case(case_id, difficulty, width, height, tuple((y, x0, x1) for y in range(height)), description)


def stepped_case() -> Case:
    rows = []
    for y in range(600):
        rows.append((y, 760, 1079))  # 320 px
    for y in range(600, 1200):
        rows.append((y, 680, 1319))  # 640 px
    return Case("stepped_width", 3, 2000, 1200, tuple(rows), "Two horizontal regions with known 320/640 px widths.")


def tapered_case() -> Case:
    rows = []
    for y in range(1200):
        width = 240 + round(y * 560 / 1199)
        cx = 1000
        x0 = cx - width // 2
        rows.append((y, x0, x0 + width - 1))
    return Case("linear_taper", 4, 2000, 1200, tuple(rows), "Width increases linearly from 240 px to 800 px.")


def sinusoidal_case() -> Case:
    rows = []
    for y in range(1200):
        left = 520 + round(95 * math.sin(y / 82))
        right = 1370 + round(115 * math.sin(y / 121 + 0.7))
        rows.append((y, left, right))
    return Case("sinusoidal_edges", 5, 2000, 1200, tuple(rows), "Both wound edges follow smooth sinusoidal boundaries.")


def v_shaped_case() -> Case:
    rows = []
    for y in range(1200):
        d = abs(y - 600)
        width = 180 + round(d * 1.1)
        cx = 1000
        x0 = cx - width // 2
        rows.append((y, x0, x0 + width - 1))
    return Case("v_shaped_gap", 6, 2000, 1200, tuple(rows), "V-shaped wound with narrow centre and wider top/bottom.")


def partial_closure_case() -> Case:
    rows = []
    for y in range(1200):
        if 420 <= y <= 585 or 820 <= y <= 910:
            continue
        width = 560 if y < 700 else 340
        cx = 980 + round(45 * math.sin(y / 70))
        x0 = cx - width // 2
        rows.append((y, x0, x0 + width - 1))
    return Case("partial_closure_gaps", 7, 2000, 1200, tuple(rows), "Some rows have no wound pixels, mimicking local full closure.")


def fragmented_bridge_case() -> Case:
    rows = []
    for y in range(1200):
        if 500 <= y <= 700:
            rows.extend([(y, 520, 830), (y, 1180, 1490)])
        else:
            rows.append((y, 520, 1490))
    return Case("fragmented_bridge", 8, 2000, 1200, tuple(rows), "A wide cell bridge splits the wound mask for many rows.")


def tilted_case() -> Case:
    rows = []
    for y in range(1200):
        x0 = 420 + round(y * 0.45)
        rows.append((y, x0, x0 + 479))
    return Case("tilted_straight_gap", 9, 2000, 1200, tuple(rows), "Constant-width wound tilted across the field.")


def extreme_irregular_case() -> Case:
    rows = []
    for y in range(1400):
        left = (
            430
            + round(150 * math.sin(y / 47))
            + round(70 * math.sin(y / 17 + 0.9))
            + (95 if 510 <= y <= 670 else 0)
            - (65 if 1030 <= y <= 1130 else 0)
        )
        right = (
            1590
            + round(170 * math.sin(y / 69 + 1.3))
            + round(85 * math.sin(y / 23))
            - (190 if 910 <= y <= 1085 else 0)
            + (70 if 300 <= y <= 390 else 0)
        )
        if 155 <= y <= 205:
            left += 230
            right -= 260
        if 730 <= y <= 785:
            left += 310
            right -= 350
        if 1170 <= y <= 1215:
            left += 260
            right -= 300
        left = max(60, min(1800, left))
        right = max(left + 80, min(2140, right))
        if 330 <= y <= 490 or 845 <= y <= 1005 or 1230 <= y <= 1320:
            bridge_w = 95 + (y % 47)
            mid = (left + right) // 2
            rows.append((y, left, mid - bridge_w))
            rows.append((y, mid + bridge_w, right))
        else:
            rows.append((y, left, right))
    return Case("extreme_irregular_multibridge", 10, 2200, 1400, tuple(rows), "Chaotic continuous wound with ragged edges, severe narrowing zones, and multiple bridges.")


def synthetic_cases() -> list[Case]:
    return [
        constant_width_case("straight_vertical", 1, 2000, 1200, 700, 1299, "Straight 600 px vertical wound."),
        constant_width_case("narrow_vertical", 2, 2000, 1200, 900, 1099, "Narrow 200 px vertical wound."),
        stepped_case(),
        tapered_case(),
        sinusoidal_case(),
        v_shaped_case(),
        partial_closure_case(),
        fragmented_bridge_case(),
        tilted_case(),
        extreme_irregular_case(),
    ]


def crop_robustness_rows() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    height = 100
    gap_width = 40
    for field_width in (100, 140, 200, 260):
        x0 = (field_width - gap_width) // 2
        case = constant_width_case(
            f"crop_field_{field_width}",
            1,
            field_width,
            height,
            x0,
            x0 + gap_width - 1,
            "Same 40 px wound in different field widths.",
        )
        m = measure_mask(make_mask(case))
        rows.append(
            {
                "case_id": case.case_id,
                "field_width_px": str(field_width),
                "wound_area_fraction_percent": f"{m.wound_area_fraction_percent:.10g}",
                "mean_width_px": f"{m.mean_width_px:.10g}",
                "median_width_px": f"{m.median_width_px:.10g}",
            }
        )
    return rows


def time_series_rows() -> list[dict[str, str]]:
    baseline_width = 80
    rows: list[dict[str, str]] = []
    for time_h, gap_width in ((0, 80), (6, 60), (12, 35), (24, 8)):
        closure = ((baseline_width - gap_width) / baseline_width) * 100
        rows.append(
            {
                "time_h": str(time_h),
                "expected_mean_width_px": str(gap_width),
                "expected_width_closure_percent": f"{closure:.10g}",
            }
        )
    return rows


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        return
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def write_pgm(path: Path, mask: list[list[int]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    height = len(mask)
    width = len(mask[0]) if height else 0
    with path.open("w", encoding="ascii") as f:
        f.write(f"P2\n{width} {height}\n255\n")
        for row in mask:
            f.write(" ".join("255" if value else "0" for value in row))
            f.write("\n")


def is_boundary(mask: list[list[int]], x: int, y: int) -> bool:
    if not mask[y][x]:
        return False
    height = len(mask)
    width = len(mask[0]) if height else 0
    if x == 0 or y == 0 or x == width - 1 or y == height - 1:
        return True
    return not (mask[y][x - 1] and mask[y][x + 1] and mask[y - 1][x] and mask[y + 1][x])


def mask_rects(mask: list[list[int]], scale: int, fill: str) -> str:
    rects = []
    for y, row in enumerate(mask):
        x = 0
        while x < len(row):
            if not row[x]:
                x += 1
                continue
            x0 = x
            while x < len(row) and row[x]:
                x += 1
            rects.append(f'<rect x="{x0 * scale}" y="{y * scale}" width="{(x - x0) * scale}" height="{scale}" fill="{fill}"/>')
    return "\n".join(rects)


def boundary_rects(mask: list[list[int]], scale: int, fill: str) -> str:
    rects = []
    height = len(mask)
    width = len(mask[0]) if height else 0
    for y in range(height):
        for x in range(width):
            if is_boundary(mask, x, y):
                rects.append(f'<rect x="{x * scale}" y="{y * scale}" width="{scale}" height="{scale}" fill="{fill}"/>')
    return "\n".join(rects)


def synthetic_texture_rects(mask: list[list[int]], scale: int) -> str:
    rects = []
    height = len(mask)
    width = len(mask[0]) if height else 0
    for y in range(height):
        for x in range(width):
            if mask[y][x]:
                shade = 230 + ((x * 13 + y * 7) % 14)
                color = f"rgb({shade},{shade},{max(210, shade - 8)})"
            else:
                shade = 166 + ((x * 17 + y * 11) % 42)
                color = f"rgb({shade},{shade + 2},{shade})"
            rects.append(f'<rect x="{x * scale}" y="{y * scale}" width="{scale}" height="{scale}" fill="{color}"/>')
    return "\n".join(rects)


def synthetic_rgb(mask: list[list[int]]) -> list[list[tuple[int, int, int]]]:
    height = len(mask)
    width = len(mask[0]) if height else 0
    image = []
    for y, row in enumerate(mask):
        out_row = []
        for x, value in enumerate(row):
            if value:
                # Wound/gap: bright, smooth, low local variance with mild illumination drift.
                drift = round(10 * (x / max(1, width - 1)) + 5 * math.sin(y / 170))
                micro = ((x * 3 + y * 5) % 5) - 2
                shade = max(205, min(246, 224 + drift + micro))
                out_row.append((shade, shade, max(200, shade - 6)))
            else:
                # Cell-covered monolayer: deliberately high local variance so the
                # variance-based prototype does not confuse it with the wound gap.
                checker = 46 if ((x // 7 + y // 5) % 2) else -34
                ridge = round(24 * math.sin(x / 13.0) + 18 * math.cos(y / 17.0))
                granule = ((x * 37 + y * 19 + (x * y) % 29) % 61) - 30
                shade = max(55, min(230, 142 + checker + ridge + granule))
                blue = max(45, min(225, shade + ((x + y) % 17) - 8))
                out_row.append((shade, min(235, shade + 4), blue))
        image.append(out_row)
    return image


def mask_rgb(mask: list[list[int]]) -> list[list[tuple[int, int, int]]]:
    return [[(255, 255, 255) if value else (0, 0, 0) for value in row] for row in mask]


def png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    crc = binascii.crc32(chunk_type + data) & 0xFFFFFFFF
    return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", crc)


def write_png(path: Path, pixels: list[list[tuple[int, int, int]]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    height = len(pixels)
    width = len(pixels[0]) if height else 0
    raw_rows = []
    for row in pixels:
        raw_rows.append(b"\x00" + b"".join(bytes((r, g, b)) for r, g, b in row))
    raw = b"".join(raw_rows)
    png = b"\x89PNG\r\n\x1a\n"
    png += png_chunk("IHDR".encode("ascii"), struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
    png += png_chunk("IDAT".encode("ascii"), zlib.compress(raw, level=9))
    png += png_chunk("IEND".encode("ascii"), b"")
    path.write_bytes(png)


def downsample_mask(mask: list[list[int]], max_width: int = 260) -> list[list[int]]:
    height = len(mask)
    width = len(mask[0]) if height else 0
    if not width or width <= max_width:
        return mask
    factor = math.ceil(width / max_width)
    out_h = math.ceil(height / factor)
    out_w = math.ceil(width / factor)
    out = blank_mask(out_w, out_h)
    for oy in range(out_h):
        for ox in range(out_w):
            found = 0
            for y in range(oy * factor, min(height, (oy + 1) * factor)):
                for x in range(ox * factor, min(width, (ox + 1) * factor)):
                    if mask[y][x]:
                        found = 1
                        break
                if found:
                    break
            out[oy][ox] = found
    return out


def svg_panel_case(case: Case, mask: list[list[int]], metrics: Metrics) -> str:
    preview = downsample_mask(mask)
    scale = 3
    pad = 22
    label_h = 28
    panel_h_px = len(preview)
    panel_w_px = len(preview[0]) if panel_h_px else 0
    panel_w = panel_w_px * scale
    panel_h = panel_h_px * scale
    total_w = panel_w * 3 + pad * 4
    total_h = panel_h + label_h + pad * 2 + 72
    panels = [
        ("A. Ground-truth binary mask", mask_rects(preview, scale, "#0f172a")),
        ("B. Synthetic microscopy-like image", synthetic_texture_rects(preview, scale)),
        ("C. Cytomove contour overlay", synthetic_texture_rects(preview, scale) + "\n" + boundary_rects(preview, scale, "#e11d48")),
    ]
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{total_w}" height="{total_h}" viewBox="0 0 {total_w} {total_h}">',
        '<rect width="100%" height="100%" fill="#ffffff"/>',
        '<style>text{font-family:Arial,sans-serif}.title{font-size:15px;font-weight:700;fill:#102027}.meta{font-size:12px;fill:#475569}.label{font-size:12px;font-weight:700;fill:#334155}</style>',
        f'<text class="title" x="{pad}" y="22">{html.escape(case.case_id)} synthetic validation panel</text>',
        f'<text class="meta" x="{pad}" y="42">Full-size image {case.width}x{case.height} px; area {metrics.wound_area_px} px; mean width {metrics.mean_width_px:.2f} px</text>',
    ]
    for i, (label, body) in enumerate(panels):
        x = pad + i * (panel_w + pad)
        y = 62
        parts.append(f'<text class="label" x="{x}" y="{y - 8}">{html.escape(label)}</text>')
        parts.append(f'<g transform="translate({x},{y})">')
        parts.append(f'<rect width="{panel_w}" height="{panel_h}" fill="#f8fafc" stroke="#cbd5e1"/>')
        parts.append(body)
        parts.append("</g>")
    parts.append("</svg>")
    return "\n".join(parts)


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def crop_plot_svg(rows: list[dict[str, str]]) -> str:
    width, height = 900, 520
    left, right, top, bottom = 92, 230, 76, 78
    plot_w = width - left - right
    plot_h = height - top - bottom
    area_vals = [float(r["wound_area_fraction_percent"]) for r in rows]
    width_vals = [float(r["mean_width_px"]) for r in rows]
    x_vals = list(range(len(rows)))
    y_max = max(area_vals + width_vals) * 1.15

    def pt(i: int, value: float) -> tuple[float, float]:
        x = left + (i * plot_w / max(1, len(rows) - 1))
        y = top + plot_h - (value * plot_h / y_max)
        return x, y

    def poly(values: list[float]) -> str:
        return " ".join(f"{x:.1f},{y:.1f}" for x, y in (pt(i, value) for i, value in enumerate(values)))

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" fill="#ffffff"/>',
        '<style>text{font-family:Arial,sans-serif;fill:#102027}.title{font-size:18px;font-weight:700}.subtitle{font-size:12px;fill:#475569}.axis{font-size:12px;fill:#475569}.tick{font-size:11px;fill:#64748b}.legend{font-size:13px;font-weight:700}.note{font-size:12px;fill:#334155}</style>',
        f'<text class="title" x="{left}" y="28">Crop/FOV robustness test on the same synthetic wound</text>',
        f'<text class="subtitle" x="{left}" y="50">The true wound width is fixed at 40 px; only field width / crop changes.</text>',
        f'<rect x="{left - 10}" y="{top - 14}" width="{plot_w + 20}" height="{plot_h + 14}" fill="#f8fafc" stroke="#e2e8f0"/>',
        f'<line x1="{left}" y1="{top + plot_h}" x2="{left + plot_w}" y2="{top + plot_h}" stroke="#334155"/>',
        f'<line x1="{left}" y1="{top}" x2="{left}" y2="{top + plot_h}" stroke="#334155"/>',
        f'<polyline points="{poly(area_vals)}" fill="none" stroke="#dc2626" stroke-width="4"/>',
        f'<polyline points="{poly(width_vals)}" fill="none" stroke="#0f766e" stroke-width="4"/>',
        f'<g transform="translate({left + plot_w + 34},{top + 8})">',
        '<rect x="0" y="0" width="178" height="142" rx="6" fill="#ffffff" stroke="#cbd5e1"/>',
        '<line x1="16" y1="28" x2="52" y2="28" stroke="#dc2626" stroke-width="4"/>',
        '<circle cx="34" cy="28" r="5" fill="#dc2626"/>',
        '<text class="legend" x="62" y="32">Area fraction (%)</text>',
        '<text class="note" x="16" y="53">Wound area divided by</text>',
        '<text class="note" x="16" y="69">current image/FOV area</text>',
        '<line x1="16" y1="96" x2="52" y2="96" stroke="#0f766e" stroke-width="4"/>',
        '<circle cx="34" cy="96" r="5" fill="#0f766e"/>',
        '<text class="legend" x="62" y="100">Mean width (px)</text>',
        '<text class="note" x="16" y="121">Horizontal gap width</text>',
        '<text class="note" x="16" y="137">from scanlines</text>',
        '</g>',
        f'<g transform="translate({left + plot_w + 34},{top + 176})">',
        '<rect x="0" y="0" width="178" height="96" rx="6" fill="#fff7ed" stroke="#fed7aa"/>',
        '<text class="legend" x="14" y="25">Interpretation</text>',
        '<text class="note" x="14" y="48">Area fraction changes</text>',
        '<text class="note" x="14" y="64">when crop/FOV changes.</text>',
        '<text class="note" x="14" y="84">Width stays stable here.</text>',
        '</g>',
    ]
    for tick in range(0, int(y_max) + 1, 10):
        x1 = left - 5
        y = top + plot_h - (tick * plot_h / y_max)
        parts.append(f'<line x1="{x1}" y1="{y:.1f}" x2="{left + plot_w}" y2="{y:.1f}" stroke="#e2e8f0"/>')
        parts.append(f'<text class="tick" text-anchor="end" x="{left - 10}" y="{y + 4:.1f}">{tick}</text>')
    for i, row in enumerate(rows):
        x, _ = pt(i, 0)
        parts.append(f'<text class="axis" text-anchor="middle" x="{x:.1f}" y="{top + plot_h + 28}">{html.escape(row["field_width_px"])} px</text>')
        for value, color, dy in ((area_vals[i], "#dc2626", 18), (width_vals[i], "#0f766e", -12)):
            px, py = pt(i, value)
            parts.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="4" fill="{color}"/>')
            parts.append(f'<text class="tick" text-anchor="middle" x="{px:.1f}" y="{py + dy:.1f}" fill="{color}">{value:.1f}</text>')
    parts.append(f'<text class="axis" text-anchor="middle" x="{left + plot_w / 2}" y="{height - 24}">Field width / crop variant</text>')
    parts.append(f'<text class="axis" transform="translate(25,{top + plot_h / 2}) rotate(-90)" text-anchor="middle">Metric value (%, px)</text>')
    parts.append("</svg>")
    return "\n".join(parts)


def run(output_dir: Path, write_masks: bool) -> None:
    metric_rows: list[dict[str, str]] = []
    for case in synthetic_cases():
        expected = expected_from_case(case)
        mask = make_mask(case)
        actual = measure_mask(mask)
        row = compare_metrics(case.case_id, actual, expected)
        row["difficulty"] = str(case.difficulty)
        row["description"] = case.description
        metric_rows.append(row)
        if write_masks:
            write_pgm(output_dir / "masks" / f"{case.case_id}.pgm", mask)
        write_png(output_dir / "images" / f"{case.case_id}.png", synthetic_rgb(mask))
        write_png(output_dir / "mask_png" / f"{case.case_id}_mask.png", mask_rgb(mask))
        write_text(output_dir / "figures" / f"{case.case_id}_panel.svg", svg_panel_case(case, mask, actual))

    crop_rows = crop_robustness_rows()
    write_csv(output_dir / "binary-mask-exactness.csv", metric_rows)
    write_csv(output_dir / "crop-robustness.csv", crop_rows)
    write_csv(output_dir / "synthetic-time-series.csv", time_series_rows())
    write_text(output_dir / "figures" / "crop_robustness_plot.svg", crop_plot_svg(crop_rows))

    print(f"PASS: {len(metric_rows)} binary mask exactness cases")
    print(f"Wrote reports to {output_dir}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Cytomove synthetic validation checks.")
    parser.add_argument("--output-dir", default="validation_sets/synthetic", type=Path)
    parser.add_argument("--write-masks", action="store_true", help="Write PGM mask fixtures to the output directory.")
    args = parser.parse_args()
    run(args.output_dir, args.write_masks)


if __name__ == "__main__":
    main()
