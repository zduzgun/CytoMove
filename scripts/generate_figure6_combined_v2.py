"""Build Figure 6 (WHAD-MCF7) as a single vector matplotlib composite.

Mirrors the Figure 5 treatment: A-B quantitative time-course on top, a
frame-level visual audit (Raw / WHST / Cytomove, 3 rows x 11 frames) below,
in one figure. Distinct marker shapes per method, larger fonts, and every
tile loaded as RGB so imshow never colormaps single-channel grayscale frames.

Standalone (mirrors generate_figure5_combined_v2.py) to avoid sandbox sync
issues with the large pipeline module; the same logic also lives in
generate_manuscript_figures.figure_4_whad_timecourse for the canonical pipeline.
"""
from __future__ import annotations

import re
from pathlib import Path

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from PIL import Image, ImageOps
from matplotlib.gridspec import GridSpec, GridSpecFromSubplotSpec

ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "validation_sets" / "comparator_clean" / "results"
MASTER = RESULTS / "validation_master.xlsx"
OUT = ROOT / "docs" / "manuscript_figures"

COLORS = {"WHST": "#111827", "Cytomove": "#2D6CDF"}
MARKERS = {"WHST": "s", "Cytomove": "^"}


def setup_style() -> None:
    mpl.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 10,
            "axes.titlesize": 11,
            "axes.labelsize": 10,
            "xtick.labelsize": 8.5,
            "ytick.labelsize": 8.5,
            "legend.fontsize": 8.5,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "pdf.fonttype": 42,
            "ps.fonttype": 42,
            "svg.fonttype": "none",
        }
    )


def read_rgb(path: Path) -> np.ndarray:
    with Image.open(path) as im:
        return np.asarray(ImageOps.exif_transpose(im).convert("RGB"))


def extract_whad_time(filename: str) -> int:
    m = re.search(r"whad_mcf7_(\d+)", filename)
    return int(m.group(1)) if m else 0


def load_data() -> pd.DataFrame:
    paired = pd.read_excel(MASTER, sheet_name="paired_measurements")
    df = paired.loc[paired["dataset"] == "whad_mcf7_11"].copy()
    df["time_h"] = df["image"].map(extract_whad_time)
    return df.sort_values("time_h").reset_index(drop=True)


def audit_rows() -> list[tuple[str, list[Path]]]:
    raw_dir = ROOT / "validation_sets" / "comparator_clean" / "images_png" / "whad_mcf7_11"
    whst_dir = RESULTS / "whst" / "whad_mcf7_11"
    cyto_dir = RESULTS / "cytomove" / "whad_mcf7_11" / "cytomove_whad_mcf7_0_overlay_pngs"
    rows = [
        ("Raw image", sorted(raw_dir.glob("whad_mcf7_*.png"))),
        ("WHST", [whst_dir / f"{i}.png" for i in range(1, 12)]),
        ("Cytomove", sorted(cyto_dir.glob("cytomove_whad_mcf7_0_*_overlay_1920x1440px.png"))),
    ]
    for label, paths in rows:
        if len(paths) != 11 or not all(p.exists() for p in paths):
            raise RuntimeError(f"WHAD {label}: expected 11 existing files, got {len(paths)}")
    return rows


def build_figure() -> plt.Figure:
    df = load_data()
    rows = audit_rows()
    hours = df["time_h"].to_numpy()
    mk = dict(linewidth=1.8, markersize=5.5, markeredgecolor="white", markeredgewidth=0.6)

    fig = plt.figure(figsize=(12.4, 8.0))
    outer = GridSpec(
        2, 1, figure=fig, height_ratios=[3.0, 3.7], hspace=0.30,
        left=0.065, right=0.985, top=0.93, bottom=0.05,
    )

    top = GridSpecFromSubplotSpec(1, 2, subplot_spec=outer[0], wspace=0.22)
    axA = fig.add_subplot(top[0, 0])
    axB = fig.add_subplot(top[0, 1])

    axA.fill_between(hours, 0, 5, color="#FEF3C7", alpha=0.55, label="near-closure zone", zorder=0)
    axA.plot(hours, df["whst_area_percent"], marker=MARKERS["WHST"], color=COLORS["WHST"], label="WHST", **mk)
    axA.plot(hours, df["cytomove_area_percent"], marker=MARKERS["Cytomove"], color=COLORS["Cytomove"], label="Cytomove", **mk)
    axA.set_xlabel("Time / frame label (h)")
    axA.set_ylabel("Wound area fraction (%)")
    axA.set_title("A  Area time-course", loc="left", fontweight="bold")
    axA.legend(frameon=True)
    axA.grid(True, color="#E5E7EB", linewidth=0.6)
    axA.set_axisbelow(True)

    axB.plot(hours, df["whst_width_px"], marker=MARKERS["WHST"], color=COLORS["WHST"], label="WHST", **mk)
    axB.plot(hours, df["cytomove_width_px"], marker=MARKERS["Cytomove"], color=COLORS["Cytomove"], label="Cytomove", **mk)
    axB.set_xlabel("Time / frame label (h)")
    axB.set_ylabel("Mean wound width (px)")
    axB.set_title("B  Width time-course", loc="left", fontweight="bold")
    axB.legend(frameon=True)
    axB.grid(True, color="#E5E7EB", linewidth=0.6)
    axB.set_axisbelow(True)

    n_cols = len(hours)
    grid = GridSpecFromSubplotSpec(
        len(rows), n_cols + 1, subplot_spec=outer[1],
        width_ratios=[0.55] + [1] * n_cols, wspace=0.04, hspace=0.06,
    )
    d_top = outer[1].get_position(fig).y1
    fig.text(0.065, d_top + 0.012,
             "C  Frame-level visual audit: raw image, WHST output, and Cytomove overlay",
             fontweight="bold", fontsize=11, ha="left", va="bottom")

    for r, (row_label, paths) in enumerate(rows):
        lab = fig.add_subplot(grid[r, 0])
        lab.axis("off")
        lab.text(0.5, 0.5, row_label, rotation=90, ha="center", va="center",
                 fontweight="bold", fontsize=10.5, color="#0F172A")
        for c, path in enumerate(paths):
            ax = fig.add_subplot(grid[r, c + 1])
            ax.imshow(read_rgb(path))
            ax.set_xticks([]); ax.set_yticks([])
            for spine in ax.spines.values():
                spine.set_edgecolor("#CBD5E1")
                spine.set_linewidth(0.6)
                spine.set_visible(True)
            if r == 0:
                ax.set_title(f"{int(hours[c])} h", fontsize=8.5, color="#334155", pad=3)

    fig.suptitle("WHAD-MCF7 sample 11 two-method time-course and visual audit",
                 x=0.065, y=0.985, ha="left", fontweight="bold", fontsize=13)
    return fig


def main() -> None:
    setup_style()
    OUT.mkdir(parents=True, exist_ok=True)
    fig = build_figure()
    stem = "figure_4_whad_timecourse"
    for ext in ("png", "pdf", "svg"):
        kwargs = {"facecolor": "white"}
        if ext == "png":
            kwargs["dpi"] = 300
        fig.savefig(OUT / f"{stem}.{ext}", **kwargs)
        print(OUT / f"{stem}.{ext}")
    plt.close(fig)


if __name__ == "__main__":
    main()
