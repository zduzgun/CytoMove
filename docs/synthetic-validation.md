# Cytomove Synthetic Validation

This document tracks the synthetic validation harness introduced after the v0.4 validation-strategy decision.

## Purpose

Cytomove validation now has three layers:

1. Synthetic binary masks for mathematical correctness.
2. Synthetic microscopy-like images for controlled robustness.
3. Real microscopy images for biological and workflow validity.

The first implemented layer is the binary-mask exactness harness in `scripts/synthetic_validation.py`.

## Current Harness

Run from the repository root:

```powershell
py -3 scripts/synthetic_validation.py --output-dir validation_sets/synthetic --write-masks
```

Generated outputs are written under `validation_sets/synthetic/`, which is ignored by git.

Current outputs:

- `binary-mask-exactness.csv`: zero-tolerance tests for wound area, area fraction, width profile, and valid row metrics.
- `crop-robustness.csv`: controlled crop/FOV perturbation showing area fraction changes while mean/median width stays stable for the same wound gap.
- `synthetic-time-series.csv`: expected width-based closure values for known gap widths.
- `masks/*.pgm`: optional generated binary mask fixtures.
- `figures/*_panel.svg`: reviewer-facing panels showing ground-truth mask, synthetic microscopy-like image, and detected contour overlay.
- `figures/crop_robustness_plot.svg`: manuscript-ready plot showing area-fraction sensitivity versus width stability under crop/FOV perturbation.

## Manuscript Evidence

The synthetic validation should be shown as evidence, not only reported as "tests passed".

Recommended manuscript/supplement layout:

- Figure panel A: ground-truth binary wound mask.
- Figure panel B: synthetic microscopy-like rendering generated from the same mask.
- Figure panel C: Cytomove contour overlay on the synthetic image.
- Figure panel D: crop/FOV perturbation examples.
- Figure panel E: crop robustness plot comparing wound area fraction and mean/median width.
- Supplementary table: expected versus measured metrics for every synthetic binary-mask case, all with zero tolerance.

The key methodological claim to support is:

> Synthetic binary-mask tests confirm exact geometric correctness, while crop-perturbation experiments show that area fraction is field-of-view dependent and horizontal wound-width metrics can remain stable for approximately vertical scratches.

## Current Exact Cases

The binary-mask suite currently contains 10 cases ordered from simple to difficult:

| Difficulty | Case | Purpose |
|------------|------|---------|
| 1 | `straight_vertical` | Constant-width vertical wound with exact area and width. |
| 2 | `narrow_vertical` | Narrow vertical wound to test small but valid gaps. |
| 3 | `stepped_width` | Two width regions to verify mean, median, SD, CV, min, and max width. |
| 4 | `linear_taper` | Width changes linearly across rows. |
| 5 | `sinusoidal_edges` | Smoothly wavy left and right wound edges. |
| 6 | `v_shaped_gap` | V-shaped wound with narrow centre and wider top/bottom. |
| 7 | `partial_closure_gaps` | Rows with no wound pixels to test valid row fraction. |
| 8 | `fragmented_bridge` | Wound rows split by a bridge; area changes while edge-span width remains stable. |
| 9 | `tilted_straight_gap` | Constant-width wound tilted across the field. |
| 10 | `extreme_irregular_multibridge` | Irregular edges, missing rows, and multiple bridges. |

## Tolerance Policy

- Binary synthetic masks: zero tolerance.
- Clean rendered synthetic images: zero or near-zero tolerance, depending on antialiasing/resizing.
- Realistic synthetic microscopy-like images: predefined low tolerance.
- Real microscopy images: compare against manual/consensus/ImageJ/WHST references and rater variability.

## Next Steps

- Add V-shaped, tilted, sinusoidal, and partially closed wound masks.
- Add image renderer for clean synthetic brightfield-like images.
- Add perturbation layers: noise, blur, uneven illumination, low contrast, debris, and compression.
- Add summary plots for crop robustness: area fraction sensitivity versus width stability.
