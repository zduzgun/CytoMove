"""Rebuild Figure 5 as a single, fully vector matplotlib composite.

Improvements over the previous PIL-stitched version:
  * One rendering pipeline -> consistent fonts, real vector PDF/SVG output.
  * Larger, journal-legible type sizes.
  * Quantitative panels (A-C) plotted against the *real* frame number so the
    temporal cadence is not distorted.
  * Distinct marker shapes per method (o / s / ^) so series remain separable
    in grayscale / for colour-vision-deficient readers.
  * Panel D (visual audit) embedded via imshow in the same figure instead of a
    separately rasterised grid; row labels and frame headers drawn natively.
"""
from __future__ import annotations

from pathlib import Path

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from PIL import Image, ImageOps
from matplotlib.gridspec import GridSpec, GridSpecFromSubplotSpec


def read_rgb(path: Path) -> np.ndarray:
    """Load any PNG as 3-channel RGB so imshow never colormaps grayscale tiles."""
    with Image.open(path) as im:
        return np.asarray(ImageOps.exif_transpose(im).convert("RGB"))

ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "validation_sets" / "comparator_clean" / "results"
MASTER = RESULTS / "validation_master.xlsx"
OUT = ROOT / "docs" / "manuscript_figures"

COLORS = {"CSMA native": "#008F7A", "WHST": "#111827", "Cytomove": "#2D6CDF"}
MARKERS = {"CSMA native": "o", "WHST": "s", "Cytomove": "^"}

FRAME_NUMBERS = [1, 2, 3, 10, 15, 20, 25, 35, 40, 45, 49]
FRAME_LABELS = [f"{n:03d}" for n in FRAME_NUMBERS]


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


def load_data() -> pd.DataFrame:
    paired = pd.read_excel(MASTER, sheet_name="paired_measurements")
    df = paired.loc[paired["dataset"] == "csma_sample_11"].copy().reset_index(drop=True)
    csma = pd.read_csv(
        RESULTS / "csma" / "csma_sample_11_native_run" / "results_area"
        / "quantification_by_area_raw_data.csv"
    )
    df["frame"] = FRAME_NUMBERS
    df["csma_area_px"] = csma["wound_area_in_pixel"].to_numpy()
    for col in ("csma_area_px", "whst_area_px", "cytomove_area_px"):
        df[f"{col}_pct"] = df[col] / df[col].iloc[0] * 100
    return df


def audit_rows() -> list[tuple[str, list[Path]]]:
    raw_dir = ROOT / "validation_sets" / "comparator_clean" / "images_png" / "csma_sample_11"
    csma_dir = RESULTS / "csma" / "csma_sample_11_native_run" / "results_area"
    whst_dir = RESULTS / "whst" / "csma_sample_11"
    cyto_dir = RESULTS / "cytomove" / "csma_sample_11" / "cytomove_csma_sample_11_overlay_pngs (1)"
    rows = [
        ("Raw image", sorted(raw_dir.glob("csma_sample_11_*_from_*.png"))),
        ("CSMA area", [csma_dir / f"timepoint_{i}.png" for i in range(11)]),
        ("WHST", [whst_dir / f"{i}.png" for i in range(1, 12)]),
        ("Cytomove", sorted(cyto_dir.glob("cytomove_csma_sample_11_*_overlay_1537x1537px.png"))),
    ]
    for label, paths in rows:
        if len(paths) != 11 or not all(p.exists() for p in paths):
            raise RuntimeError(f"{label}: expected 11 existing files, got {len(paths)}")
    return rows


def line_panel(ax, x, series, *, ylabel, title, logy=False):
    for label, y in series:
        ax.plot(
            x, y,
            marker=MARKERS[label], color=COLORS[label], label=label,
            linewidth=1.5, markersize=5, markeredgecolor="white", markeredgewidth=0.6,
        )
    ax.set_xlabel("CSMA frame number")
    ax.set_ylabel(ylabel)
    ax.set_title(title, loc="left", fontweight="bold")
    ax.set_xticks([1, 10, 20, 30, 40, 49])
    ax.set_xlim(-1, 51)
    ax.grid(True, color="#E5E7EB", linewidth=0.6)
    ax.set_axisbelow(True)
    if logy:
        ax.set_yscale("log")


def build_figure() -> plt.Figure:
    df = load_data()
    rows = audit_rows()
    frames = df["frame"].to_numpy()

    fig = plt.figure(figsize=(13.0, 9.2))
    outer = GridSpec(
        2, 1, figure=fig, height_ratios=[3.1, 5.4], hspace=0.30,
        left=0.055, right=0.985, top=0.935, bottom=0.045,
    )

    # ---- Top: quantitative panels A-C ----
    top = GridSpecFromSubplotSpec(1, 3, subplot_spec=outer[0], wspace=0.28)
    axA, axB, axC = (fig.add_subplot(top[0, i]) for i in range(3))

    line_panel(
        axA, frames,
        [("CSMA native", df["csma_area_px"] / 1e6),
         ("WHST", df["whst_area_px"] / 1e6),
         ("Cytomove", df["cytomove_area_px"] / 1e6)],
        ylabel="Wound area (Mpx)", title="A  Absolute wound area",
    )
    axA.legend(frameon=True, loc="upper right")

    line_panel(
        axB, frames,
        [("CSMA native", df["csma_area_px_pct"]),
         ("WHST", df["whst_area_px_pct"]),
         ("Cytomove", df["cytomove_area_px_pct"])],
        ylabel="Residual area (% of first frame)", title="B  Normalized residual area",
    )

    axC.axhline(0, color="#6B7280", linewidth=1.0, zorder=1)
    axC.plot(
        frames, (df["csma_area_px"] - df["whst_area_px"]) / df["whst_area_px"] * 100,
        marker=MARKERS["CSMA native"], color=COLORS["CSMA native"], label="CSMA vs WHST",
        linewidth=1.5, markersize=5, markeredgecolor="white", markeredgewidth=0.6,
    )
    axC.plot(
        frames, df["area_signed_error_percent"],
        marker=MARKERS["Cytomove"], color=COLORS["Cytomove"], label="Cytomove vs WHST",
        linewidth=1.5, markersize=5, markeredgecolor="white", markeredgewidth=0.6,
    )
    axC.set_xlabel("CSMA frame number")
    axC.set_ylabel("Area difference from WHST (%)")
    axC.set_title("C  Frame-level method difference", loc="left", fontweight="bold")
    axC.set_xticks([1, 10, 20, 30, 40, 49])
    axC.set_xlim(-1, 51)
    axC.grid(True, color="#E5E7EB", linewidth=0.6)
    axC.set_axisbelow(True)
    axC.legend(frameon=True, loc="upper left")

    # ---- Bottom: panel D visual audit grid ----
    n_cols = len(FRAME_LABELS)
    grid = GridSpecFromSubplotSpec(
        len(rows), n_cols + 1, subplot_spec=outer[1],
        width_ratios=[0.55] + [1] * n_cols, wspace=0.04, hspace=0.06,
    )

    # Panel D heading (figure-level text above the grid block)
    d_top = outer[1].get_position(fig).y1
    fig.text(0.055, d_top + 0.012, "D  Frame-level visual audit: raw images and comparator overlays",
             fontweight="bold", fontsize=11, ha="left", va="bottom")

    for r, (row_label, paths) in enumerate(rows):
        # row label cell
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
                ax.set_title(f"F{FRAME_LABELS[c]}", fontsize=8.5, color="#334155", pad=3)

    fig.suptitle("CSMA sample 11 three-method area trend", x=0.055, y=0.985,
                 ha="left", fontweight="bold", fontsize=13)
    return fig


def main() -> None:
    setup_style()
    OUT.mkdir(parents=True, exist_ok=True)
    fig = build_figure()
    stem = "figure_5_csma_three_method_combined"
    for ext in ("png", "pdf", "svg"):
        kwargs = {"facecolor": "white"}
        if ext == "png":
            kwargs["dpi"] = 400
        fig.savefig(OUT / f"{stem}.{ext}", **kwargs)
        print(OUT / f"{stem}.{ext}")
    plt.close(fig)


if __name__ == "__main__":
    main()
