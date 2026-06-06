"""Rebuild Figure 3 (area agreement) with a statistically defensible panel B.

Previous panel B plotted (Cytomove - WHST)/WHST x 100 and reported a parametric
mean bias (3.2%) with 1.96*SD limits. That percentage normalisation divides by
one method (implicitly treating WHST as truth), explodes for near-closure frames
(tiny denominator), and the mean/SD are invalid because the differences are
skewed and include time-course (repeated-measures) frames.

This version plots the absolute difference (Mpx) and uses a non-parametric
summary: median difference and 2.5/97.5 percentile limits of agreement, which
are robust to skew and to the near-closure small-denominator artifact.
Standalone to avoid sandbox sync issues; the same logic also lives in
generate_manuscript_figures.figure_3_area_agreement.
"""
from __future__ import annotations

from pathlib import Path

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "validation_sets" / "comparator_clean" / "results"
MASTER = RESULTS / "validation_master.xlsx"
OUT = ROOT / "docs" / "manuscript_figures"

PALETTE = {
    "csma_sample_11": "#008F7A",
    "whad_mcf7_11": "#2D6CDF",
    "cell_phone_HK": "#F59E0B",
    "cell_phone_M8F": "#D97706",
    "cell_phone_MK": "#DC2626",
}
DISPLAY_NAMES = {
    "csma_sample_11": "CSMA sample (n=11)",
    "whad_mcf7_11": "WHAD-MCF7 (n=11)",
    "cell_phone_HK": "Phone HK (n=3)",
    "cell_phone_M8F": "Phone M8F (n=3)",
    "cell_phone_MK": "Phone MK stress (n=3)",
}
MARKERS = {
    "csma_sample_11": "o",
    "whad_mcf7_11": "^",
    "cell_phone_HK": "s",
    "cell_phone_M8F": "D",
    "cell_phone_MK": "v",
}


def setup_style() -> None:
    mpl.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 10,
            "axes.titlesize": 11,
            "axes.labelsize": 10,
            "xtick.labelsize": 8.5,
            "ytick.labelsize": 8.5,
            "legend.fontsize": 8,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "pdf.fonttype": 42,
            "ps.fonttype": 42,
            "svg.fonttype": "none",
        }
    )


def build_figure() -> plt.Figure:
    paired = pd.read_excel(MASTER, sheet_name="paired_measurements").copy()
    paired["whst_area_mpx"] = paired["whst_area_px"] / 1_000_000
    paired["cytomove_area_mpx"] = paired["cytomove_area_px"] / 1_000_000
    paired["mean_area_mpx"] = (paired["whst_area_mpx"] + paired["cytomove_area_mpx"]) / 2
    paired["diff_mpx"] = paired["cytomove_area_mpx"] - paired["whst_area_mpx"]

    fig, axes = plt.subplots(1, 2, figsize=(9.4, 4.1), constrained_layout=True)

    # ---- Panel A: identity scatter ----
    ax = axes[0]
    max_val = paired[["whst_area_mpx", "cytomove_area_mpx"]].to_numpy().max() * 1.05
    for dataset, df in paired.groupby("dataset"):
        ax.scatter(
            df["whst_area_mpx"], df["cytomove_area_mpx"], s=42,
            color=PALETTE.get(dataset, "#64748B"), marker=MARKERS.get(dataset, "o"),
            edgecolor="white", linewidth=0.6, label=DISPLAY_NAMES.get(dataset, dataset), alpha=0.92,
        )
    ax.plot([0, max_val], [0, max_val], color="#111827", linestyle="--", linewidth=1.1, label="identity")
    ax.set_xlabel("WHST wound area (Mpx)")
    ax.set_ylabel("Cytomove wound area (Mpx)")
    ax.set_title("A  Area agreement", loc="left", fontweight="bold")
    ax.set_xlim(0, max_val)
    ax.set_ylim(0, max_val)
    ax.legend(frameon=True, ncol=1, loc="upper left")
    ax.grid(True, color="#E5E7EB", linewidth=0.6)
    ax.set_axisbelow(True)

    # ---- Panel B: absolute-scale, non-parametric Bland-Altman ----
    ax = axes[1]
    diff = paired["diff_mpx"]
    median_diff = float(diff.median())
    lo, hi = np.percentile(diff, [2.5, 97.5])
    for dataset, df in paired.groupby("dataset"):
        ax.scatter(
            df["mean_area_mpx"], df["diff_mpx"], s=42,
            color=PALETTE.get(dataset, "#64748B"), marker=MARKERS.get(dataset, "o"),
            edgecolor="white", linewidth=0.6, alpha=0.92,
        )
    ax.axhline(0, color="#111827", linewidth=0.8)
    ax.axhline(median_diff, color="#0F766E", linewidth=1.3, label=f"median {median_diff:+.3f} Mpx")
    ax.axhline(hi, color="#94A3B8", linestyle="--", linewidth=1.0, label="2.5-97.5% limits")
    ax.axhline(lo, color="#94A3B8", linestyle="--", linewidth=1.0)
    ax.set_xlabel("Mean wound area (Mpx)")
    ax.set_ylabel("Cytomove − WHST area (Mpx)")
    ax.set_title("B  Bland-Altman (absolute, non-parametric)", loc="left", fontweight="bold")
    ax.legend(frameon=True, loc="lower right")
    ax.grid(True, color="#E5E7EB", linewidth=0.6)
    ax.set_axisbelow(True)
    return fig


def main() -> None:
    setup_style()
    OUT.mkdir(parents=True, exist_ok=True)
    fig = build_figure()
    stem = "figure_3_area_agreement"
    for ext in ("png", "pdf", "svg"):
        kwargs = {"facecolor": "white", "bbox_inches": "tight"}
        if ext == "png":
            kwargs["dpi"] = 450
        fig.savefig(OUT / f"{stem}.{ext}", **kwargs)
        print(OUT / f"{stem}.{ext}")
    plt.close(fig)


if __name__ == "__main__":
    main()
