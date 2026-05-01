# Cytomove Literature and Tool Comparison Matrix

Last updated: 2026-04-30

This matrix tracks scratch/wound-healing assay analysis tools that should shape Cytomove's validation protocol, product scope, and manuscript positioning.

## Download Status

| Key | Tool / paper | Status | Local PDF | Primary source |
| --- | --- | --- | --- | --- |
| TScratch-2009 | TScratch: a novel and simple software tool for automated analysis of monolayer wound healing assays | Downloaded manually; verified local PDF | `docs/literature/papers/tscratch-2009.pdf` | https://doi.org/10.2144/000113083 |
| WHST-2020 | An ImageJ plugin for the high throughput image analysis of in vitro scratch wound healing assays | Downloaded; verified PDF | `docs/literature/papers/whst-2020-plosone.pdf` | https://doi.org/10.1371/journal.pone.0232565 |
| MRI-WHT | MRI Wound Healing Tool | Tool documentation / macro reference only; no associated paper tracked | n/a | https://www.mri.cnrs.fr/en/data-analysis/software-and-tools/271-mri-tools/409-wound-healing-tool.html |
| PyScratch-2020 | PyScratch: An ease of use tool for analysis of scratch assays | Downloaded manually; verified local PDF | `docs/literature/papers/pyscratch-2020.pdf` | https://doi.org/10.1016/j.cmpb.2020.105476 |
| CSMA-2025 | CSMA: An ImageJ Plugin for the Analysis of Wound Healing Assays | Downloaded; verified PDF | `docs/literature/papers/csma-2025.pdf` | https://doi.org/10.32388/M01WL7 |
| WimScratch | WimScratch / Wimasis | Commercial web product; product page only | n/a | https://www.wimasis.com/index.php?idproduct=1&page=ProductInfo |

## Paper-Derived Comparison

| Tool | Platform | Core algorithm / workflow | Reported metrics | Validation approach | Cytomove lesson |
| --- | --- | --- | --- | --- | --- |
| TScratch | MATLAB GUI and standalone package | Fast discrete curvelet transform creates a detail/edge magnitude image; automated thresholding separates low-detail open area from cell-covered regions; small isolated regions can be relabeled; GUI supports group review, threshold adjustment, exclusion, and manual paint/erase/polygon correction | Open/wounded area, 24 h / 0 h open-area ratios, group means and SEM, tab-delimited output for spreadsheet analysis | Compared TScratch with manual open-area segmentation across LECs, MCF-7, PMEFs, and Py-4-1 cells; representative experiments used 8-10 replicates; one dataset had 7/96 images excluded after visual inspection; reported close agreement with manual results and about 12 min vs >=30 s/image manual workflow | Treat as classic comparator and design precedent for reviewable segmentation, exclusion flags, threshold adjustment, and manual correction |
| WHST | ImageJ/Fiji plugin | Contrast enhancement plus local variance filter; low-variance wound area segmented by user-defined threshold; fill-hole / morphological reconstruction includes cells or cell islets inside wound; largest connected wound component selected; optional inclination correction for width | Wound area, wound area fraction / coverage of total area, average wound width, width SD, migration rate, wound closure percentage | Validated on 30 images against MRI Wound Healing Tool, MiToBo ScratchAssayAnalyzer, and manual drawing; used paired t-tests and Two-Way ANOVA; reported WHST vs MiToBo area difference around -0.51% +/- 2.8, MRI/manual overestimation around 6.5% +/- 4.4 and 10.33% +/- 6.9; width compared with manual 10-line measurements; average width not significantly different, but width SD differed by about 36%; runtime 6-13 s/image and 5-8 min for 60 images | Align Cytomove metric vocabulary and first algorithm with WHST; include area, area %, width mean/SD, closure %, migration rate when calibrated; explicitly track parameter sensitivity |
| MRI Wound Healing Tool | ImageJ macro/toolset | Variance-based or edge-based stack analysis | Wound area on time-series stacks | Tool documentation; used as practical ImageJ reference | Useful reference for time-course and variance-filter lineage |
| PyScratch | Python software | Python 3.6 GUI using OpenCV, pandas, and PySide; automated batch processing of scratch-assay time series; user can monitor processed images, plots, and progress | Area in pixels, normalized area, time in minutes, velocity derived from area/time and pixel-to-micron conversion, plot and CSV database | Validated on wound-healing assays acquired every 15 min for 60 h on Cytation 5; compared with semi-automated Fiji MRI Wound Healing Tool on a 60 h experiment; used One-Way ANOVA/Tukey for cell-density experiments; tested PNT1A and PC-3 cells across seeding densities; reported no difference vs Fiji area measurements and about 6x faster analysis over 80 images | Cytomove should beat installation friction while preserving PyScratch's batch/time-course usability; pixel calibration and velocity require explicit metadata |
| CSMA | ImageJ plugin + source code | Two-stage workflow: first rough wound mask, then wound/cell edge detection; preprocessing, Canny edge detection with Otsu-derived lower threshold, morphological operations; explicitly detects migrating cells inside the wound; width mode removes cell-edge detection for speed | Wound area or width at every time point in pixels and percentage, wound closure graphs, output images with detected boundaries, CSV | Preprint compared CSMA with MRI and HTM tools on SW480-ADH 48 h time series and a public 769-P dataset; SW480-ADH imaging was 1 h intervals over 48 h with four replicates per condition; public dataset had 48 images over 23.5 h at 30 min intervals; reported final wound area differences under 1% between default and user-defined settings for SW480-ADH and 769-P; highlighted failures of HTM/MRI when cells appear in the wound middle | Treat as emerging comparator and Phase 2 target: wound-internal cell islands, time-course curves, output images, CSV, and parameterized edge detection |
| WimScratch | Commercial online service | Online automated upload-and-analyze workflow | Cell covered area, overview chart, speed of closure, acceleration characteristics, control image | Vendor claims; used in biomedical literature but not a direct open protocol | Cytomove's strongest contrast: browser-local images and reproducible export package |

## Cytomove Positioning Draft

Cytomove should be positioned as a browser-based, local-first, reviewable and publication-oriented scratch assay quantification workflow. The claim should not be that Cytomove invents a fundamentally new measurement concept; the defensible claim is that it provides ImageJ-comparable wound-healing measurements while reducing installation friction and improving reproducibility outputs.

Preferred claim language:

> Cytomove provides ImageJ-comparable scratch assay quantification in a browser-based, reviewable, and publication-oriented workflow.

Avoid early claims around AI, absolute accuracy, or universal closure-rate calculation until validation is complete.

## Minimum Feature Set Implied by Literature

| Feature / metric | Priority | Rationale |
| --- | --- | --- |
| Wound area | MVP | Core metric across TScratch, WHST, MRI Wound Healing Tool, PyScratch, CSMA |
| Wound area percentage | MVP | WHST-compatible normalization to field/ROI area |
| Average wound width | MVP | WHST-compatible, important for irregular scratches |
| Width standard deviation | MVP | Captures scratch heterogeneity and edge irregularity |
| Closure percentage | MVP when 0h reference exists | Requires timepoint grouping and baseline image |
| Migration rate | MVP only with time + pixel calibration | Requires reliable timepoint and spatial calibration metadata |
| Reviewable segmentation overlay | MVP | TScratch and WHST both support inspection; Cytomove must not output blind numbers |
| Manual correction | Early post-MVP | Needed for difficult real-world images and reviewer confidence |
| Analysis log | MVP | Cytomove differentiator: version, parameters, crop/ROI, resolution, timestamp, image hash |
| Methods text generator | MVP / manuscript-facing | Converts product output into publication-ready workflow |
| Batch/time-course summary | MVP endgame | Needed for replicate summaries and closure curves |
| Wound-internal cell island handling | Phase 2 | CSMA highlights this limitation in conventional tools |

## Comparator Priority

| Priority | Comparator | Why |
| --- | --- | --- |
| 1 | WHST | Closest algorithmic lineage to current Cytomove prototype: contrast/variance/threshold/fill holes/largest component, plus the metric vocabulary Cytomove should match |
| 2 | Manual / consensus masks | Required for a defensible accuracy claim; correlation alone is insufficient |
| 3 | TScratch | Classic, highly cited, reviewable/manual-correction precedent; validates Cytomove's UX direction |
| 4 | PyScratch | Useful for no-code/time-course/batch comparison and speed/usability framing |
| 5 | CSMA | Important emerging comparator for cell islands inside wound; likely Phase 2 rather than MVP gate |
| 6 | WimScratch | Commercial upload-based contrast for privacy/local-first positioning; include in product landscape, not necessarily quantitative validation |

## Validation Design Implications

1. Compare Cytomove against manual annotation and ImageJ/Fiji workflows.
2. Use WHST as the primary tool comparator because its metrics and variance-based algorithm align with Cytomove's current prototype.
3. Include TScratch as a classic comparator and as support for reviewable/manual-correction UX.
4. Treat PyScratch as a usability/time-course comparator; run it if installation is stable.
5. Treat CSMA as an emerging comparator focused on wound-internal cells; run it on difficult images if installation is stable.
6. Use Bland-Altman, MAE/MAPE/RMSE, Dice/IoU for masks, and correlation only as a secondary agreement signal.
7. Add a specific full-resolution vs downsampled-analysis experiment because Cytomove uses a browser-first preview/final-analysis workflow.
8. Track usability and reproducibility outputs, not only numerical agreement.

## Product Decisions From Literature Review

| Decision | Rationale |
| --- | --- |
| Keep the MVP algorithm explainable and ImageJ-comparable rather than AI-first | WHST, MRI, and TScratch are accepted around transparent image-processing workflows; AI would raise external-validation burden |
| Make overlay review mandatory before export | TScratch emphasizes visual inspection and manual adjustment; CSMA and WHST show parameter sensitivity and hard-image failure modes |
| Add manual correction after the current prototype stabilizes | TScratch already supports paint/erase/polygon correction; Cytomove needs an equivalent for reviewable claims |
| Record analysis parameters in CSV/log | WHST parameter sensitivity is explicit; Cytomove should export radius, threshold, crop, FOV, component settings, resolution, and version |
| Add pixel calibration before claiming migration rate | PyScratch converts pixels to microns using microscope/lens calibration; Cytomove should not infer microns without user calibration |
| Treat closure percentage as time-course dependent | WHST closure formula requires baseline area at t0; Cytomove should only report closure when a 0 h reference is linked |
| Include difficult images with internal cell islands in validation | WHST and CSMA both note cells/cell islets inside wound; this should become a named subset in validation |

## Manual Download Queue

These files were downloaded manually through a browser after scripted download failed:

1. `tscratch-2009.pdf`
   - Official article page: https://www.tandfonline.com/doi/full/10.2144/000113083
   - Direct PDF usually appears as: https://www.tandfonline.com/doi/pdf/10.2144/000113083
   - Status: downloaded manually.
2. `pyscratch-2020.pdf`
   - Official article page: https://www.sciencedirect.com/science/article/pii/S0169260719313914
   - DOI: https://doi.org/10.1016/j.cmpb.2020.105476
   - Status: downloaded manually.

MRI Wound Healing Tool is retained as a tool/macro reference rather than a paper. No `mri-wound-healing-tool.txt` paper is expected.
