from __future__ import annotations

import re
from pathlib import Path

import matplotlib as mpl
import matplotlib.image as mpimg
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch


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


def setup_style() -> None:
    mpl.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 9,
            "axes.titlesize": 10,
            "axes.labelsize": 9,
            "xtick.labelsize": 8,
            "ytick.labelsize": 8,
            "legend.fontsize": 8,
            "figure.titlesize": 12,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "pdf.fonttype": 42,
            "ps.fonttype": 42,
            "svg.fonttype": "none",
        }
    )
    sns.set_theme(style="whitegrid", rc={"grid.color": "#E5E7EB", "axes.edgecolor": "#CBD5E1"})


def savefig(fig: plt.Figure, stem: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for ext in ("svg", "pdf", "png"):
        kwargs = {"bbox_inches": "tight", "facecolor": "white"}
        if ext == "png":
            kwargs["dpi"] = 450
        fig.savefig(OUT / f"{stem}.{ext}", **kwargs)
    plt.close(fig)


def load_data() -> tuple[pd.DataFrame, pd.DataFrame]:
    paired = pd.read_excel(MASTER, sheet_name="paired_measurements")
    summary = pd.read_excel(MASTER, sheet_name="summary")
    return paired, summary


def figure_1_workflow() -> None:
    steps = [
        ("Import", "single image\nor time-course group"),
        ("Preset", "brightfield / phase\ncontrast settings"),
        ("Segment", "area-first wound\nmask detection"),
        ("Review", "overlay QC and\nlocal correction"),
        ("Export", "CSV/XLSX, plots,\noverlays, metadata"),
    ]
    fig, ax = plt.subplots(figsize=(8.2, 2.8))
    ax.set_axis_off()
    x_positions = np.linspace(0.08, 0.92, len(steps))
    y = 0.52
    box_w, box_h = 0.145, 0.48

    for i, (title, body) in enumerate(steps):
        x = x_positions[i]
        color = "#0F766E" if i in (2, 3) else "#0F172A"
        box = FancyBboxPatch(
            (x - box_w / 2, y - box_h / 2),
            box_w,
            box_h,
            boxstyle="round,pad=0.018,rounding_size=0.02",
            linewidth=1.2,
            edgecolor=color,
            facecolor="#F8FAFC",
        )
        ax.add_patch(box)
        ax.text(x, y + 0.08, title, ha="center", va="center", fontsize=10, weight="bold", color=color)
        ax.text(x, y - 0.08, body, ha="center", va="center", fontsize=7.7, color="#334155", linespacing=1.15)
        if i < len(steps) - 1:
            arrow = FancyArrowPatch(
                (x + box_w / 2 + 0.012, y),
                (x_positions[i + 1] - box_w / 2 - 0.012, y),
                arrowstyle="-|>",
                mutation_scale=12,
                linewidth=1.4,
                color="#64748B",
            )
            ax.add_patch(arrow)

    ax.text(
        0.5,
        0.12,
        "Cytomove keeps images local and makes segmentation review part of the quantification workflow.",
        ha="center",
        va="center",
        fontsize=8.5,
        color="#475569",
    )
    savefig(fig, "figure_1_workflow")


def figure_2_representative_overlays() -> None:
    overlay_paths = [
        (
            "Clean comparator\nCSMA sample",
            RESULTS
            / "cytomove"
            / "csma_sample_11"
            / "cytomove_csma_sample_11_overlay_pngs (1)"
            / "cytomove_csma_sample_11_01_1h_csma_sample_11_01_from_001_overlay_1537x1537px.png",
        ),
        (
            "Phase contrast\nWHAD-MCF7",
            RESULTS
            / "cytomove"
            / "whad_mcf7_11"
            / "cytomove_whad_mcf7_0_overlay_pngs"
            / "cytomove_whad_mcf7_0_05_17h_whad_mcf7_017_overlay_1920x1440px.png",
        ),
        (
            "Stress case\nphone capture",
            RESULTS
            / "cytomove"
            / "cell_phone"
            / "MK"
            / "cytomove_Local_group_1_overlay_pngs"
            / "cytomove_Local_group_1_03_48h_mk_48h_003_overlay_1800x1800px.png",
        ),
    ]
    fig, axes = plt.subplots(1, 3, figsize=(9.2, 3.1), constrained_layout=True)
    for ax, (title, path) in zip(axes, overlay_paths):
        img = mpimg.imread(path)
        ax.imshow(img)
        ax.set_title(title, loc="left", weight="bold")
        ax.set_xticks([])
        ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_visible(True)
            spine.set_color("#CBD5E1")
            spine.set_linewidth(0.8)
    fig.suptitle("Representative Cytomove segmentation overlays", x=0.02, ha="left", weight="bold")
    savefig(fig, "figure_2_representative_overlays")


def figure_3_area_agreement(paired: pd.DataFrame) -> None:
    fig, axes = plt.subplots(1, 2, figsize=(9.2, 4.0), constrained_layout=True)
    ax = axes[0]
    paired = paired.copy()
    paired["whst_area_mpx"] = paired["whst_area_px"] / 1_000_000
    paired["cytomove_area_mpx"] = paired["cytomove_area_px"] / 1_000_000
    max_val = paired[["whst_area_mpx", "cytomove_area_mpx"]].to_numpy().max() * 1.05
    for dataset, df in paired.groupby("dataset"):
        ax.scatter(
            df["whst_area_mpx"],
            df["cytomove_area_mpx"],
            s=42,
            color=PALETTE.get(dataset, "#64748B"),
            edgecolor="white",
            linewidth=0.6,
            label=DISPLAY_NAMES.get(dataset, dataset),
            alpha=0.92,
        )
    ax.plot([0, max_val], [0, max_val], color="#111827", linestyle="--", linewidth=1.1, label="identity")
    ax.set_xlabel("WHST wound area (Mpx)")
    ax.set_ylabel("Cytomove wound area (Mpx)")
    ax.set_title("A. Area agreement")
    ax.set_xlim(0, max_val)
    ax.set_ylim(0, max_val)
    ax.legend(frameon=True, ncol=1, loc="upper left")

    ax = axes[1]
    paired["mean_area_px"] = (paired["whst_area_px"] + paired["cytomove_area_px"]) / 2
    paired["mean_area_mpx"] = paired["mean_area_px"] / 1_000_000
    paired["area_diff_percent"] = (paired["cytomove_area_px"] - paired["whst_area_px"]) / paired["whst_area_px"] * 100
    bias = paired["area_diff_percent"].mean()
    loa = 1.96 * paired["area_diff_percent"].std(ddof=1)
    for dataset, df in paired.groupby("dataset"):
        ax.scatter(
            df["mean_area_mpx"],
            df["area_diff_percent"],
            s=42,
            color=PALETTE.get(dataset, "#64748B"),
            edgecolor="white",
            linewidth=0.6,
            alpha=0.92,
        )
    ax.axhline(0, color="#111827", linewidth=0.8)
    ax.axhline(bias, color="#0F766E", linewidth=1.1, label=f"bias {bias:.1f}%")
    ax.axhline(bias + loa, color="#94A3B8", linestyle="--", linewidth=1.0, label="95% limits")
    ax.axhline(bias - loa, color="#94A3B8", linestyle="--", linewidth=1.0)
    ax.set_xlabel("Mean wound area (Mpx)")
    ax.set_ylabel("Cytomove - WHST area (%)")
    ax.set_title("B. Bland-Altman style view")
    ax.legend(frameon=True, loc="lower right")
    savefig(fig, "figure_3_area_agreement")


def extract_whad_time(filename: str) -> int:
    match = re.search(r"whad_mcf7_(\d+)", filename)
    return int(match.group(1)) if match else 0


def figure_4_whad_timecourse(paired: pd.DataFrame) -> None:
    df = paired.loc[paired["dataset"] == "whad_mcf7_11"].copy()
    df["time_h"] = df["image"].map(extract_whad_time)
    df = df.sort_values("time_h")
    fig, axes = plt.subplots(1, 2, figsize=(9.0, 3.8), constrained_layout=True)

    ax = axes[0]
    ax.plot(df["time_h"], df["whst_area_percent"], marker="o", color="#111827", label="WHST", linewidth=1.8)
    ax.plot(df["time_h"], df["cytomove_area_percent"], marker="o", color="#2D6CDF", label="Cytomove", linewidth=1.8)
    ax.fill_between(df["time_h"], 0, 5, color="#FEF3C7", alpha=0.55, label="near-closure zone")
    ax.set_xlabel("Time / frame label (h)")
    ax.set_ylabel("Wound area fraction (%)")
    ax.set_title("A. Area time-course")
    ax.legend(frameon=True)

    ax = axes[1]
    ax.plot(df["time_h"], df["whst_width_px"], marker="o", color="#111827", label="WHST", linewidth=1.8)
    ax.plot(df["time_h"], df["cytomove_width_px"], marker="o", color="#2D6CDF", label="Cytomove", linewidth=1.8)
    ax.set_xlabel("Time / frame label (h)")
    ax.set_ylabel("Mean wound width (px)")
    ax.set_title("B. Width time-course")
    ax.legend(frameon=True)
    savefig(fig, "figure_4_whad_timecourse")


def metric_text(paired: pd.DataFrame, dataset: str, image: str) -> str:
    row = paired.loc[(paired["dataset"] == dataset) & (paired["image"] == image)].iloc[0]
    return (
        f"Area error: {row['area_abs_error_percent']:.1f}%\n"
        f"Width error: {row['width_abs_error_percent']:.1f}%\n\n"
        f"WHST area: {row['whst_area_px'] / 1_000_000:.3f} Mpx\n"
        f"Cytomove area: {row['cytomove_area_px'] / 1_000_000:.3f} Mpx\n\n"
        f"QC: {row['qc_class']}"
    )


def figure_5_visual_comparison(paired: pd.DataFrame) -> None:
    examples = [
        {
            "label": "Clean comparator\nCSMA sample 01",
            "dataset": "csma_sample_11",
            "image": "csma_sample_11_01_from_001.png",
            "whst": RESULTS / "whst" / "csma_sample_11" / "1.png",
            "cytomove": RESULTS
            / "cytomove"
            / "csma_sample_11"
            / "cytomove_csma_sample_11_overlay_pngs (1)"
            / "cytomove_csma_sample_11_01_1h_csma_sample_11_01_from_001_overlay_1537x1537px.png",
        },
        {
            "label": "Phase contrast\nWHAD-MCF7 17h",
            "dataset": "whad_mcf7_11",
            "image": "whad_mcf7_017.png",
            "whst": RESULTS / "whst" / "whad_mcf7_11" / "5.png",
            "cytomove": RESULTS
            / "cytomove"
            / "whad_mcf7_11"
            / "cytomove_whad_mcf7_0_overlay_pngs"
            / "cytomove_whad_mcf7_0_05_17h_whad_mcf7_017_overlay_1920x1440px.png",
        },
        {
            "label": "Phone brightfield\nHK 24h",
            "dataset": "cell_phone_HK",
            "image": "hk_24h_002.png",
            "whst": RESULTS / "whst" / "cell phone" / "HK" / "2.png",
            "cytomove": RESULTS
            / "cytomove"
            / "cell_phone"
            / "HK"
            / "cytomove_Local_group_1_overlay_pngs"
            / "cytomove_Local_group_1_02_24h_hk_24h_002_overlay_1800x1800px.png",
        },
    ]
    fig = plt.figure(figsize=(9.4, 7.2), constrained_layout=True)
    subfigs = fig.subfigures(len(examples), 1, hspace=0.06)
    for subfig, example in zip(subfigs, examples):
        axes = subfig.subplots(1, 3, gridspec_kw={"width_ratios": [1, 1, 0.46]})
        for ax, source, title in (
            (axes[0], example["whst"], "WHST comparator"),
            (axes[1], example["cytomove"], "Cytomove"),
        ):
            img = mpimg.imread(source)
            ax.imshow(img)
            ax.set_title(title, loc="left", fontsize=8.5, weight="bold")
            ax.set_xticks([])
            ax.set_yticks([])
            for spine in ax.spines.values():
                spine.set_visible(True)
                spine.set_color("#CBD5E1")
                spine.set_linewidth(0.8)

        axes[0].text(
            0.01,
            0.99,
            example["label"],
            transform=axes[0].transAxes,
            va="top",
            ha="left",
            fontsize=8.2,
            weight="bold",
            color="#111827",
            bbox={"facecolor": "white", "edgecolor": "none", "alpha": 0.78, "pad": 2.5},
        )
        axes[2].set_axis_off()
        axes[2].text(
            0.03,
            0.58,
            metric_text(paired, example["dataset"], example["image"]),
            ha="left",
            va="center",
            fontsize=8.1,
            color="#111827",
            linespacing=1.35,
        )

    fig.suptitle("Visual agreement between WHST comparator output and Cytomove overlays", x=0.01, ha="left", weight="bold")
    savefig(fig, "figure_5_visual_comparison")


def figure_s1_validation_summary(summary: pd.DataFrame) -> None:
    order = ["csma_sample_11", "whad_mcf7_11", "cell_phone_HK", "cell_phone_M8F", "cell_phone_MK"]
    summary = summary.set_index("dataset").loc[order].reset_index()
    summary["dataset_label"] = summary["dataset"].map(DISPLAY_NAMES).fillna(summary["dataset"])
    x = np.arange(len(summary))
    width = 0.36
    fig, ax = plt.subplots(figsize=(8.8, 4.0), constrained_layout=True)
    ax.bar(
        x - width / 2,
        summary["area_mape_percent"],
        width,
        label="Area MAPE",
        color="#0F766E",
        edgecolor="white",
    )
    ax.bar(
        x + width / 2,
        summary["width_mape_percent"],
        width,
        label="Width MAPE",
        color="#64748B",
        edgecolor="white",
    )
    ax.axhline(10, color="#F59E0B", linestyle="--", linewidth=1.1, label="10% reference")
    ax.axhline(20, color="#DC2626", linestyle=":", linewidth=1.1, label="20% reference")
    ax.set_xticks(x)
    ax.set_xticklabels(summary["dataset_label"], rotation=20, ha="right")
    ax.set_ylabel("Mean absolute percentage error (%)")
    ax.set_title("Validation summary by dataset")
    ax.legend(frameon=True, ncol=2)
    for i, row in summary.iterrows():
        ax.text(i - width / 2, row["area_mape_percent"] + 1.2, f"{row['area_mape_percent']:.1f}", ha="center", va="bottom", fontsize=7.5)
        ax.text(i + width / 2, row["width_mape_percent"] + 1.2, f"{row['width_mape_percent']:.1f}", ha="center", va="bottom", fontsize=7.5)
    savefig(fig, "figure_s1_validation_summary")


def figure_s2_csma_11_frame_visual_audit() -> None:
    raw_dir = ROOT / "validation_sets" / "comparator_clean" / "images_png" / "csma_sample_11"
    csma_dir = RESULTS / "csma" / "csma_sample_11_native_run" / "results_area"
    whst_dir = RESULTS / "whst" / "csma_sample_11"
    cytomove_dir = RESULTS / "cytomove" / "csma_sample_11" / "cytomove_csma_sample_11_overlay_pngs (1)"

    frame_ids = ["001", "002", "003", "010", "015", "020", "025", "035", "040", "045", "049"]
    raw_paths = sorted(raw_dir.glob("csma_sample_11_*_from_*.png"))
    csma_paths = [csma_dir / f"timepoint_{i}.png" for i in range(11)]
    whst_paths = [whst_dir / f"{i}.png" for i in range(1, 12)]
    cytomove_paths = sorted(cytomove_dir.glob("cytomove_csma_sample_11_*_overlay_1537x1537px.png"))

    rows = [
        ("Raw image", raw_paths),
        ("CSMA area", csma_paths),
        ("WHST", whst_paths),
        ("Cytomove", cytomove_paths),
    ]

    fig, axes = plt.subplots(4, 11, figsize=(17.2, 6.9), constrained_layout=True)
    for row_index, (row_label, paths) in enumerate(rows):
        for col_index, path in enumerate(paths):
            ax = axes[row_index, col_index]
            img = mpimg.imread(path)
            ax.imshow(img)
            ax.set_xticks([])
            ax.set_yticks([])
            if row_index == 0:
                ax.set_title(f"F{frame_ids[col_index]}", fontsize=8.2, weight="bold", pad=3)
            if col_index == 0:
                ax.set_ylabel(row_label, fontsize=8.5, weight="bold", rotation=0, labelpad=38, va="center")
            for spine in ax.spines.values():
                spine.set_visible(True)
                spine.set_color("#CBD5E1")
                spine.set_linewidth(0.55)

    fig.suptitle(
        "CSMA sample 11 visual audit: raw images and comparator overlays across the time-course",
        x=0.01,
        ha="left",
        weight="bold",
    )
    savefig(fig, "figure_s2_csma_11_frame_visual_audit")


def main() -> None:
    setup_style()
    paired, summary = load_data()
    figure_1_workflow()
    figure_2_representative_overlays()
    figure_3_area_agreement(paired)
    figure_4_whad_timecourse(paired)
    figure_5_visual_comparison(paired)
    figure_s1_validation_summary(summary)
    figure_s2_csma_11_frame_visual_audit()
    print(f"Wrote figures to {OUT}")


if __name__ == "__main__":
    main()
