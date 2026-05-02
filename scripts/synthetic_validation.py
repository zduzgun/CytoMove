#!/usr/bin/env python3
"""Synthetic validation harness for Cytomove wound metrics.

Layer 1 focuses on binary masks with exact ground truth. These tests do not
exercise the browser segmentation pipeline; they verify the metric math that the
pipeline reports after a wound mask exists.
"""

from __future__ import annotations

import argparse
import csv
import html
import math
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
    for y in range(40):
        rows.append((y, 50, 79))  # 30 px
    for y in range(40, 80):
        rows.append((y, 45, 94))  # 50 px
    return Case("stepped_width", 3, 160, 80, tuple(rows), "Two horizontal regions with known 30/50 px widths.")


def tapered_case() -> Case:
    rows = []
    for y in range(100):
        width = 24 + round(y * 56 / 99)
        cx = 100
        x0 = cx - width // 2
        rows.append((y, x0, x0 + width - 1))
    return Case("linear_taper", 4, 200, 100, tuple(rows), "Width increases linearly from 24 px to 80 px.")


def sinusoidal_case() -> Case:
    rows = []
    for y in range(120):
        left = 52 + round(8 * math.sin(y / 9))
        right = 128 + round(10 * math.sin(y / 13 + 0.7))
        rows.append((y, left, right))
    return Case("sinusoidal_edges", 5, 190, 120, tuple(rows), "Both wound edges follow smooth sinusoidal boundaries.")


def v_shaped_case() -> Case:
    rows = []
    for y in range(120):
        d = abs(y - 60)
        width = 18 + round(d * 1.15)
        cx = 100
        x0 = cx - width // 2
        rows.append((y, x0, x0 + width - 1))
    return Case("v_shaped_gap", 6, 200, 120, tuple(rows), "V-shaped wound with narrow centre and wider top/bottom.")


def partial_closure_case() -> Case:
    rows = []
    for y in range(120):
        if 42 <= y <= 58 or 82 <= y <= 89:
            continue
        width = 52 if y < 70 else 34
        cx = 95 + round(4 * math.sin(y / 7))
        x0 = cx - width // 2
        rows.append((y, x0, x0 + width - 1))
    return Case("partial_closure_gaps", 7, 190, 120, tuple(rows), "Some rows have no wound pixels, mimicking local full closure.")


def fragmented_bridge_case() -> Case:
    rows = []
    for y in range(60):
        if 25 <= y <= 34:
            rows.extend([(y, 30, 44), (y, 65, 79)])
        else:
            rows.append((y, 30, 79))
    return Case("fragmented_bridge", 8, 120, 60, tuple(rows), "Rows 25-34 contain a cell bridge splitting the wound mask.")


def tilted_case() -> Case:
    rows = []
    for y in range(120):
        x0 = 38 + round(y * 0.45)
        rows.append((y, x0, x0 + 47))
    return Case("tilted_straight_gap", 9, 160, 120, tuple(rows), "Constant-width wound tilted across the field.")


def extreme_irregular_case() -> Case:
    rows = []
    for y in range(140):
        if y in {18, 19, 20, 77, 78, 121}:
            continue
        left = 46 + round(14 * math.sin(y / 5.5)) + (8 if 52 <= y <= 64 else 0)
        right = 148 + round(18 * math.sin(y / 8.0 + 1.3)) - (18 if 95 <= y <= 108 else 0)
        if 35 <= y <= 48 or 88 <= y <= 98:
            bridge_w = 10 + (y % 5)
            mid = (left + right) // 2
            rows.append((y, left, mid - bridge_w))
            rows.append((y, mid + bridge_w, right))
        else:
            rows.append((y, left, right))
    return Case("extreme_irregular_multibridge", 10, 220, 140, tuple(rows), "Irregular edges, missing rows, and multiple cell bridges.")


def synthetic_cases() -> list[Case]:
    return [
        constant_width_case("straight_vertical", 1, 200, 100, 70, 129, "Straight 60 px vertical wound."),
        constant_width_case("narrow_vertical", 2, 160, 100, 72, 91, "Narrow 20 px vertical wound."),
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


def svg_panel_case(case: Case, mask: list[list[int]], metrics: Metrics) -> str:
    scale = 3
    pad = 22
    label_h = 28
    panel_w = case.width * scale
    panel_h = case.height * scale
    total_w = panel_w * 3 + pad * 4
    total_h = panel_h + label_h + pad * 2 + 72
    panels = [
        ("A. Ground-truth binary mask", mask_rects(mask, scale, "#0f172a")),
        ("B. Synthetic microscopy-like image", synthetic_texture_rects(mask, scale)),
        ("C. Cytomove contour overlay", synthetic_texture_rects(mask, scale) + "\n" + boundary_rects(mask, scale, "#e11d48")),
    ]
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{total_w}" height="{total_h}" viewBox="0 0 {total_w} {total_h}">',
        '<rect width="100%" height="100%" fill="#ffffff"/>',
        '<style>text{font-family:Arial,sans-serif}.title{font-size:15px;font-weight:700;fill:#102027}.meta{font-size:12px;fill:#475569}.label{font-size:12px;font-weight:700;fill:#334155}</style>',
        f'<text class="title" x="{pad}" y="22">{html.escape(case.case_id)} synthetic validation panel</text>',
        f'<text class="meta" x="{pad}" y="42">Area {metrics.wound_area_px} px; mean width {metrics.mean_width_px:.2f} px; valid rows {metrics.valid_row_count}</text>',
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
    width, height = 720, 420
    left, right, top, bottom = 64, 32, 44, 58
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
        '<style>text{font-family:Arial,sans-serif;fill:#102027}.title{font-size:16px;font-weight:700}.axis{font-size:11px;fill:#475569}.legend{font-size:12px;font-weight:700}</style>',
        f'<text class="title" x="{left}" y="24">Crop robustness: same 40 px wound under different field widths</text>',
        f'<line x1="{left}" y1="{top + plot_h}" x2="{left + plot_w}" y2="{top + plot_h}" stroke="#334155"/>',
        f'<line x1="{left}" y1="{top}" x2="{left}" y2="{top + plot_h}" stroke="#334155"/>',
        f'<polyline points="{poly(area_vals)}" fill="none" stroke="#dc2626" stroke-width="3"/>',
        f'<polyline points="{poly(width_vals)}" fill="none" stroke="#0f9f8f" stroke-width="3"/>',
        f'<text class="legend" x="{left + 20}" y="{top + 18}" fill="#dc2626">Area fraction (%)</text>',
        f'<text class="legend" x="{left + 180}" y="{top + 18}" fill="#0f9f8f">Mean width (px)</text>',
    ]
    for i, row in enumerate(rows):
        x, _ = pt(i, 0)
        parts.append(f'<text class="axis" text-anchor="middle" x="{x:.1f}" y="{top + plot_h + 24}">{html.escape(row["field_width_px"])} px</text>')
        for value, color in ((area_vals[i], "#dc2626"), (width_vals[i], "#0f9f8f")):
            px, py = pt(i, value)
            parts.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="4" fill="{color}"/>')
    parts.append(f'<text class="axis" text-anchor="middle" x="{left + plot_w / 2}" y="{height - 14}">Field width / crop variant</text>')
    parts.append(f'<text class="axis" transform="translate(18,{top + plot_h / 2}) rotate(-90)" text-anchor="middle">Metric value</text>')
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
