# Cytomove Validation Dataset Protocol

**Document version:** 0.4 (draft)
**Status:** Pre-registered — Tier 1 archive identified and licence-cleared; collection workflow not yet started
**Last updated:** 2026-05-02
**Owner:** Z. Düzgün, Giresun University Faculty of Medicine, Department of Medical Biology
**Intended use:** This protocol is pre-registered prior to data collection. The text is written in IMRAD style so that the *Methods* and *Validation Dataset* sections of the planned bioRxiv preprint (Phase 3) can be excerpted from this document with minimal rewriting.

---

## 1. Purpose

To define, in advance of any image acquisition or algorithm tuning, the dataset that will be used to evaluate the analytical performance of Cytomove against the established manual ground truth (ImageJ-based measurement). Pre-registration of the protocol is intended to eliminate post-hoc selection of inclusion criteria, sample size, or evaluation metrics.

The dataset will support three downstream goals: (i) the Phase 2 MVP success criteria defined in `ROADMAP.md` (Pearson r > 0.9, mean wound-area error < 10 %, unedited acceptance rate ≥ 70 %); (ii) the comparative analysis against manual/consensus masks and established scratch-assay tools, prioritising the Wound Healing Size Tool (WHST), TScratch, PyScratch, and CSMA where technically feasible; and (iii) the bioRxiv preprint planned for Phase 3.

## 1.1 Three-Layer Validation Strategy

Cytomove validation is organised into three complementary layers. This replaces a single real-image-only validation strategy.

1. **Synthetic binary masks.** Purpose: prove mathematical correctness of geometry, area, width-profile, valid-row, and closure calculations. Inputs are binary masks without antialiasing, blur, noise, compression, or resizing. Expected values are generated analytically from the mask geometry. Required tolerance: zero for integer-valued geometric quantities, and exact equality within floating-point representation for derived means/percentages.
2. **Synthetic microscopy-like images.** Purpose: test robustness under controlled perturbations while preserving known ground truth. Images are generated from known masks and then degraded with documented perturbations such as blur, noise, uneven illumination, contrast change, debris, JPEG/PNG compression, and edge irregularity. Required tolerance: predefined low tolerance, not zero, because segmentation uncertainty is expected after image formation and preprocessing.
3. **Real microscopy images.** Purpose: demonstrate biological and workflow validity on actual scratch-assay data. Performance is compared with manual/consensus masks, ImageJ/Fiji, WHST, and other comparator tools where feasible. Tolerances are interpreted relative to expert/rater variability and comparator agreement.

This layered strategy supports the claim that Cytomove is mathematically correct on clean ground-truth masks, robust under controlled image perturbations, and valid on real microscopy images.

## 1.1.1 First-Wave Real-Image Validation Sources

The real-image validation layer will use a mixed acquisition strategy rather than a single "best" dataset. This is intentional because Cytomove should serve both professional time-lapse microscopy images and less standard phone-through-eyepiece images from everyday lab workflows.

| Source | Role in validation | Rationale | First-wave decision |
|--------|--------------------|-----------|---------------------|
| WHAD/CAMAD | Primary professional real-world validation | Public Zenodo dataset with professional scratch-assay imaging and frequent time-lapse acquisition; strongest candidate for the main real-image evidence base | Include as first-wave priority after manual inspection |
| CSMA dataset | Public comparator/workflow validation | Public wound-healing analysis dataset linked to a comparator tool; useful for checking Cytomove against an existing area/width-oriented workflow | Include as first-wave secondary set |
| Local Duzgun lab phone/eyepiece images | Real-world usability stress subset | Non-standard phone capture, circular FOV, crop/angle variability, and lower acquisition consistency represent the target user scenario Cytomove should handle with QC warnings | Keep as a selected usability subset, not the sole primary validation backbone |
| RQSA | Robustness/stress candidate | Designed for difficult conditions and deep-learning/robustness-style evaluation; valuable later but not needed for the first validation pass | Defer to Phase 2/3 |

Raw files for these sources should live outside git under `validation_ref_sets/raw/`. The working layout is documented in `docs/validation-dataset-layout.md`.

## 1.2 Synthetic Validation Sets

The synthetic validation suite contains four planned subsets:

| Subset | Purpose | Examples | Primary outputs |
|--------|---------|----------|-----------------|
| Simple geometry | Unit-test metric formulas | Straight vertical wound, tilted wound, V-shaped wound, sinusoidal wound boundary, partial bridges, fragmented wound islands | Exact wound area, mean/median/SD/CV width, min/max width, valid row count/fraction |
| Crop robustness | Quantify FOV/crop sensitivity | Same biological mask with central, shifted, top-truncated, bottom-truncated, narrow, wide, and aspect-ratio-varied crops | Variation of area fraction vs mean/median width |
| Noise robustness | Characterise segmentation limits | Low/medium/high noise, Gaussian blur, uneven illumination, low contrast, compression, debris | Area error, width error, failure modes |
| Time series | Verify closure calculations | Synthetic 0, 6, 12, 24 h series with known gap widths and closure percentages | Area-based closure, width-based closure, metric discordance |

The crop-robustness subset is a methodological priority because it directly tests the known risk that wound area divided by total image area changes when field-of-view or crop differs between time points. The expected outcome is that area fraction is more crop-sensitive, while horizontal mean/median wound width is more stable when the wound axis remains approximately vertical.

## 1.3 Error Tolerance Policy

| Test type | Expected tolerance | Rationale |
|-----------|-------------------|-----------|
| Binary synthetic mask geometric tests | 0 | There is no imaging uncertainty; the mask is the ground truth. |
| Clean synthetic rendered images | 0 or near-zero, depending on whether antialiasing/resizing is disabled | Pixel-perfect when rendered without antialiasing; low tolerance if rasterisation is involved. |
| Realistic synthetic microscopy-like images | Explicit low tolerance, e.g. area/closure error <= 1-2 %, width error <= 1 px or <= 1 %, depending on perturbation severity | Segmentation after blur/noise/compression is not mathematically exact. |
| Real microscopy images | Agreement against manual/consensus references and inter-rater variability | Biological images do not have perfect ground truth. |
| Crop robustness tests | Compare variance/sensitivity between metrics rather than requiring a single zero-error value | The question is whether width-based metrics are more stable than area fraction under FOV perturbation. |

## 2. Sample Size and Statistical Justification

The dataset size is set by the tightest of three precision requirements:

1. **Pearson correlation coefficient.** Detecting r ≥ 0.9 against a null of r = 0 at α = 0.05, power = 0.80 requires n ≈ 8. However, the operationally relevant question is the *width of the confidence interval* around r, not the rejection of the null. For an observed r = 0.90, a 95 % CI of approximately ±0.06 requires n ≈ 30; ±0.04 requires n ≈ 60.
2. **Bland–Altman limits of agreement.** Reliable estimation of the 95 % limits of agreement, with confidence intervals on the limits themselves, conventionally requires n ≥ 50.
3. **Diversity coverage.** The diversity matrix in §4 contains a minimum of approximately 24 condition cells (3 cell types × 2 imaging modalities × 2 magnifications × 2 scratch time points). At least one image per cell, and ideally two for within-cell variance, sets a floor of ~24–48 images.

**Target:** n = 50 images for the primary validation set, with a stretch goal of n = 100 if collection bandwidth permits. A minimum of n = 30 is acceptable for an initial MVP-evaluation pass, with the understanding that the bioRxiv submission will require expansion to ≥ 50 before release.

## 3. Inclusion and Exclusion Criteria

**Inclusion.** An image is eligible if it satisfies all of the following:
- Adherent mammalian cell monolayer scratch assay (also known as wound healing assay).
- Linear scratch performed with a pipette tip, cell scraper, or comparable mechanical means.
- Image captured by phase-contrast, brightfield, or fluorescence microscopy.
- Magnification between 4× and 20× (objective).
- Image resolution ≥ 800 × 600 pixels.
- Single field of view per image (no stitched mosaics in the primary set).
- Original raw or minimally compressed file (TIFF preferred; high-quality PNG/JPEG accepted with file-format flagged in metadata).

**Exclusion.** An image is excluded if any of the following apply:
- Out-of-focus to a degree that the wound edge cannot be confidently identified by an experienced observer.
- Severe vignetting, illumination gradient, or saturation that obscures > 25 % of the wound region.
- Non-linear or multi-directional scratches (e.g. cross scratches, stamp wounds).
- Floating debris or air bubbles that obscure > 10 % of the wound area.
- Images already used for algorithm tuning or training.

A separate **edge-case set** (n ≈ 10–20) will be retained for robustness reporting. It will contain images that *fail* the inclusion criteria above, to characterise where Cytomove is expected to underperform. Edge-case images will not contribute to the primary correlation/error statistics; they will be reported separately.

## 4. Diversity Matrix

The primary set will be stratified across the following axes. Empty cells are acceptable in v1 but should be flagged.

| Axis | Target levels |
|------|---------------|
| Cell type | Tier 1 confirmed: HUVEC (endothelial) + MDA-MB-231 (epithelial breast cancer). Stretch: add a third line (HeLa, MCF-7, A549, NIH/3T3, or HaCaT) from a public dataset (Tier 2) to broaden coverage. |
| Imaging modality | Tier 1 confirmed: brightfield via smartphone-through-eyepiece. This reflects Cytomove's primary target user. Stretch: add a phase-contrast set captured with a dedicated microscope camera (Tier 2/3) for generalisability. |
| Magnification | Tier 1 confirmed: ×10 objective throughout (per Düzgün et al. 2024, *Mol Divers* 29:1069). Stretch: add ×4 and/or ×20 from public sets. |
| Scratch quality | Clean (sharp linear edge); ragged (uneven edge); partially detached (cells lifted at edge). To be classified per image during inventory pass. |
| Time point relative to wounding | Tier 1 covers t = 0 h, 24 h, 48 h. Mid-closure (6–12 h) absent in Tier 1; deferred to public-dataset supplementation if a strong case for it emerges. |
| Microscope vendor / model | Tier 1: smartphone camera (iPhone, 2022 campaign; Samsung Galaxy, 2021 campaign) coupled to lab microscope eyepiece, ×10 objective. Specific microscope model **TBD — Düzgün lab inventory**. Tier 2 supplementation expected to add at least one dedicated-camera optical system. |

Each image is tagged with all axis values in the metadata schema (§7).

## 5. Image Acquisition Strategy

A four-tier sourcing strategy will be followed, in priority order. Provenance and licence are recorded per image.

### Tier 1 — Düzgün laboratory archive (target: 50–80 images, ample headroom from 442 raw)
Retrospective images from a wound-healing experimental campaign in the Department of Medical Biology, Giresun University Faculty of Medicine, conducted in 2021–2022. Two cell lines (HUVEC and MDA-MB-231), six conditions (untreated control; FDI-6 at 8 µM and 64 µM; cisplatin; luteolin; luteolin + cisplatin combination), three time points (0, 24, 48 h), ×10 objective throughout. Acquired by smartphone camera through the microscope eyepiece — a setup that mirrors the actual hardware profile of Cytomove's primary target users (under-resourced cell-biology labs). A subset of these images was published in Düzgün Z, Korkmaz FD, Akgün E. *Mol Divers* 2024;29(2):1069–1078, [10.1007/s11030-024-10891-z](https://doi.org/10.1007/s11030-024-10891-z), under a Creative Commons Attribution 4.0 International licence. The published subset is therefore redistributable under CC BY 4.0 by the licence terms; unpublished images in the archive are released under the same licence by author authority. Pre-existing manual ground-truth measurements obtained with the ImageJ Wound Healing plugin (Suarez-Arnedo et al. 2020) are available for the curated `COMBİNE/` subset, eliminating a substantial portion of the ground-truth re-measurement burden.

### Tier 2 — Public bioimage repositories (target: 10–20 images)
- **Image Data Resource (IDR)** — `idr.openmicroscopy.org`. Search terms: *scratch assay*, *wound healing assay*, *cell migration*. Filter for studies with permissive licensing.
- **Zenodo** — `zenodo.org`. Same search terms. Records typically carry explicit licence metadata.
- **Figshare** — `figshare.com`. Variable metadata quality; filter by file type (TIFF/PNG) and licence (CC-BY family).
- **Cell Image Library (CIL)** — `cellimagelibrary.org`. Older records; check active links.
- **Broad Bioimage Benchmark Collection (BBBC)** — `bbbc.broadinstitute.org`. No direct scratch assay set as of writing, but referenced as benchmark provenance for related cell-segmentation tasks.

Only images carrying a licence permitting redistribution and derivative works (CC0, CC-BY, CC-BY-SA) will be included. Public-domain status will be verified per image, not per repository.

### Tier 3 — Published paper supplementary material (target: 5–15 images)
Open-access wound-healing methodology papers and scratch-assay validation papers in *PLOS ONE*, *Scientific Reports*, *BMC Bioinformatics*, *Journal of Visualized Experiments*, and similar venues. Where supplementary images are not under an explicit redistribution licence, the corresponding author will be contacted for written permission. This step also opens dialogue that may yield citation paths post-preprint.

### Tier 4 — Collaborator outreach (target: 5–20 images, opportunistic)
Targeted requests to cell-biology PIs in Turkey and abroad, via direct e-mail and short academic social-media posts. Offered terms: anonymous donation accepted; donor lab acknowledged in the dataset citation block; co-authorship on the preprint not implied unless contribution exceeds image donation.

Total realistic primary set: **n ≈ 35–80**, comfortably exceeding the n = 30 minimum and approaching the n = 50 target.

## 6. Ground Truth Protocol

The reference measurement against which Cytomove output will be evaluated is **manual wound-area quantification in ImageJ/Fiji**. This is the de-facto community standard and the comparator most commonly cited in wound-healing methodology papers.

### 6.1 Procedure

For each eligible image:

1. Open in Fiji (ImageJ 1.54f or later, build recorded per image).
2. Apply standardised pre-processing: 8-bit grayscale conversion if not already; no contrast adjustment.
3. Identify the wound region using one of two protocols, recorded per image:
   - **Protocol A — MRI Wound Healing Tool macro** (variance-based automatic wound detection). Output: wound-area pixel count and percentage of total field.
   - **Protocol B — manual ROI tracing** with the polygon selection tool. Output: ROI area in pixels.
4. Save the binary mask as PNG alongside the original image.
5. Record measurements and macro/manual indicator in the metadata CSV.

### 6.2 Rater protocol

To estimate intra- and inter-rater reliability:

- A primary rater (Z. Düzgün or designated trained co-rater) measures all images.
- A subset of ≥ 20 % of images is independently re-measured by the primary rater after a ≥ 7-day washout (intra-rater reliability).
- A subset of ≥ 20 % of images is independently measured by a second trained rater (inter-rater reliability).
- Reliability is reported as intra-class correlation coefficient (ICC, two-way mixed, absolute agreement).

If a second rater is unavailable, intra-rater reliability is reported alone, and this limitation is declared in the preprint.

### 6.3 Pixel-to-physical-unit conversion

Where the source image carries a calibration scale bar or pixel-size metadata, area is also reported in µm². Where calibration is unavailable, area is reported only in pixels and the image is flagged as *uncalibrated*. Cytomove's primary metric, percentage wound closure, is dimensionless and unaffected by calibration.

### 6.4 Comparator tools

The comparator set is defined from the literature review in `docs/literature/tool-comparison-matrix.md`. Tools are prioritised by scientific relevance, metric compatibility, and practical ability to run on the validation images.

| Priority | Comparator | Role in validation | Required output |
|----------|------------|--------------------|-----------------|
| 1 | Manual or consensus wound masks | Primary ground truth for mask-level and area-level accuracy. If feasible, three independent manual masks are combined into a consensus mask; otherwise the protocol falls back to the rater procedure in §6.2. | Binary wound mask; wound area in pixels; rater ID |
| 2 | Wound Healing Size Tool (WHST; Suarez-Arnedo et al. 2020) | Primary tool comparator because its variance-filter, threshold, fill-hole, and wound-width workflow is closest to the current Cytomove algorithm. | Wound area; wound area fraction; average wound width; width SD; parameter settings |
| 3 | TScratch (Gebäck et al. 2009) | Classic high-citation comparator and precedent for reviewable segmentation, threshold adjustment, image exclusion, and manual correction. | Open area; 0 h / follow-up ratios where available; exported table; excluded-image flags |
| 4 | PyScratch (Garcia-Fossa et al. 2020) | Usability, time-course, and batch-analysis comparator if installation is stable. | Area/time table; normalized area; velocity if calibration metadata are available |
| 5 | CSMA (Pham et al. 2025 preprint) | Emerging comparator for difficult images with cells or cell islets inside the wound. Treated as an exploratory comparator rather than an MVP gate. | Wound area or width per time point; output boundary images; CSV/graph output |
| 6 | WimScratch / Wimasis | Product-landscape comparator for privacy and workflow positioning. Quantitative comparison is optional because it requires uploading images to a third-party service. | Vendor output if access and data-sharing permissions allow |

Comparator runs must record software version, operating system, parameter values, preprocessing, runtime, and any images excluded or manually corrected. Where a comparator cannot be installed or run reliably, this is recorded as a protocol deviation rather than silently omitted.

### 6.5 Metric rationale

The minimum metric set follows WHST because it is the closest ImageJ/Fiji reference for Cytomove's current explainable segmentation pipeline.

| Metric | Status | Rationale |
|--------|--------|-----------|
| Wound area | Required | Core metric across TScratch, WHST, MRI Wound Healing Tool, PyScratch, and CSMA. Primary MVP validation target. |
| Wound area percentage | Required | Normalises wound area to field/ROI area and supports comparison across crop sizes. |
| Average wound width | Required | WHST reports average wound width and corrects for inclination; Cytomove should support comparable width reporting. |
| Width standard deviation | Required | Captures wound-edge irregularity and scratch heterogeneity; WHST shows that width SD is not equivalent to sparse manual line measurements. |
| Closure percentage | Conditional | Report only when a valid 0 h baseline is linked to the follow-up image. Formula: `(area_0h - area_t) / area_0h * 100`. Do not report as a single-image metric. |
| Migration rate | Conditional | Report only when both elapsed time and pixel-to-physical calibration are available. Uncalibrated images may report pixel-based slope for internal analysis, but not µm/h or mm²/h. |
| Mask Dice / IoU | Required when masks exist | Required for mask-level validation against manual or consensus masks; area correlation alone cannot detect shape errors. |
| Runtime per image | Required | Needed to compare practical workflow burden against ImageJ/Fiji, TScratch, and PyScratch. |
| Manual correction / acceptance status | Required for user-facing evaluation | Operationalises the reviewable segmentation claim and the unedited acceptance criterion in `ROADMAP.md`. |

Correlation is reported but is not treated as sufficient evidence of agreement. Bland-Altman bias, MAE, MAPE, RMSE, and mask overlap metrics are required because two methods can correlate strongly while showing systematic bias.

## 7. Metadata Schema

A single CSV (`validation-set-metadata.csv`) accompanies the image set. One row per image. Field list:

| Field | Type | Notes |
|-------|------|-------|
| image_id | string | Stable identifier, e.g. `cytv-0001` |
| filename | string | Filename in the dataset bundle |
| source_tier | enum | 1 \| 2 \| 3 \| 4 (per §5) |
| source_provenance | string | Lab name, repository DOI, paper DOI, or donor identifier |
| licence | string | SPDX identifier (e.g. `CC-BY-4.0`, `CC0-1.0`) |
| cell_type | string | e.g. `HeLa`, `MCF-7`, `HUVEC` |
| imaging_modality | enum | `phase` \| `brightfield` \| `fluorescence` |
| objective_magnification | numeric | e.g. `4`, `10`, `20` |
| microscope_model | string | Vendor and model |
| scratch_method | enum | `pipette_tip` \| `scraper` \| `other` |
| scratch_quality | enum | `clean` \| `ragged` \| `partially_detached` |
| time_post_wounding_hours | numeric | `0`, `6`, `12`, `18`, `24`, etc. |
| pixel_size_um | numeric or null | Per-pixel physical size if calibrated |
| image_width_px | integer | |
| image_height_px | integer | |
| original_format | enum | `tiff` \| `png` \| `jpeg` |
| ground_truth_method | enum | `mri_macro` \| `manual_roi` |
| ground_truth_wound_area_px | integer | Primary reference measurement |
| ground_truth_wound_area_um2 | numeric or null | Secondary, only if calibrated |
| ground_truth_wound_area_pct | numeric | Wound area divided by analysed field/ROI area |
| ground_truth_width_mean_px | numeric or null | Required when width measurement is available |
| ground_truth_width_sd_px | numeric or null | Required when width measurement is available |
| ground_truth_mask_filename | string or null | Binary wound mask used for Dice/IoU analysis |
| baseline_image_id | string or null | Required for closure percentage; points to the 0 h image in the same series |
| replicate_id | string or null | Biological/technical replicate identifier where known |
| comparator_whst_area_px | integer or null | Optional comparator output |
| comparator_tscratch_area_px | integer or null | Optional comparator output |
| comparator_pyscratch_area_px | integer or null | Optional comparator output |
| comparator_csma_area_px | integer or null | Optional exploratory comparator output |
| cytomove_algorithm_version | string or null | Filled during Cytomove evaluation runs |
| cytomove_parameter_json | string or null | Serialized crop, threshold, radius, FOV, component, resolution, and contour settings |
| cytomove_runtime_ms | integer or null | Runtime per image for the final analysis pass |
| cytomove_manual_correction_status | enum or null | `none` \| `accepted_unedited` \| `edited` \| `rejected` |
| primary_rater | string | Initials |
| second_rater | string or null | Initials, if measured |
| measurement_date | ISO date | YYYY-MM-DD |
| in_primary_set | boolean | `true` for primary set; `false` for edge-case set |
| notes | free text | Any observation that affects interpretation |

## 8. Licensing

Following the decision recorded in `ROADMAP.md` (Phase 2): **derived measurements and binary masks are released under CC BY 4.0**. Raw images are released under CC BY 4.0 only where the source provenance permits; otherwise the dataset record links to the original repository entry without redistributing the raw file. The CSV metadata file is itself CC BY 4.0.

This split (open metadata + measurements; conditionally open raw images) follows the precedent of several IDR studies and avoids overstating redistribution rights for Tier 3 / Tier 4 images.

## 9. Zenodo Deposit Plan

The dataset is deposited on Zenodo as a versioned record:

- **v0.1 — Protocol only.** The current document, deposited at the time the first image is collected. Establishes a citable pre-registration.
- **v1.0 — Initial release.** Released alongside the bioRxiv preprint submission. Contains all primary-set images for which redistribution is permitted, all binary masks, and the metadata CSV.
- **Subsequent versions** — added as the set grows. Each version receives its own DOI; the concept DOI links all versions.

The Zenodo record cross-links to the GitHub repository and to the bioRxiv preprint once available.

## 10. Reporting Template

For each evaluation run of Cytomove against this dataset, the following will be reported:

- Synthetic binary-mask exactness: all expected geometric values, measured values, and zero-tolerance pass/fail status.
- Synthetic microscopy-like robustness: perturbation type/severity, expected value, measured value, predefined tolerance, and pass/fail status.
- Crop-robustness analysis: sensitivity of area fraction versus mean/median width under artificial crop perturbations of the same wound mask.
- n (primary set), n (edge-case set).
- Pearson and Spearman correlation with 95 % CI, on wound area percentage and, where available, percentage wound closure.
- Bland–Altman analysis: mean bias, 95 % limits of agreement, with CI on the limits.
- Intra-class correlation coefficient (two-way mixed, absolute agreement).
- Mean absolute error, mean absolute percentage error, and root-mean-square error in wound area.
- Dice coefficient and intersection-over-union (IoU) against manual or consensus masks where binary masks exist.
- Average wound width error and width SD error where comparator width measurements are available.
- Runtime per image for Cytomove and any comparator tools run locally.
- Full-resolution versus downsampled-analysis agreement, reported as area error and Bland–Altman bias. This is required because Cytomove uses a browser-first preview/final-analysis architecture.
- Fraction of images on which Cytomove output was accepted by a user without manual correction (operationalised by a separate user-study protocol, not this document).
- Stratified results by cell type, modality, and magnification to expose subgroup performance.

Failures, mis-segmentations, and edge-case behaviour are reported with example figures, not omitted.

## 11. Versioning and Updates

This document is versioned in lock-step with the dataset Zenodo record. Material changes (revised inclusion criteria, sample-size targets, ground-truth method) require a version bump and a dated changelog entry below.

### Changelog

- **v0.1 (2026-04-28)** — Initial draft. Pre-registered before any image collection.
- **v0.2 (2026-04-29)** — Tier 1 archive identified (442 images, two campaigns 2021–2022). Cell lines confirmed (HUVEC, MDA-MB-231). Magnification confirmed (×10). Ground-truth tool confirmed (ImageJ Wound Healing plugin, Suarez-Arnedo 2020). Licence confirmed (CC BY 4.0 via Düzgün et al. 2024, *Mol Divers* 29:1069). Diversity matrix updated with confirmed Tier 1 values and documented stretch goals.
- **v0.3 (2026-04-30)** — Literature review integrated. Comparator priority defined (manual/consensus masks, WHST, TScratch, PyScratch, CSMA, WimScratch). Metric rationale added for wound area, area percentage, width mean/SD, conditional closure percentage, conditional migration rate, Dice/IoU, runtime, and manual-correction status. Metadata schema and reporting template expanded to support comparator outputs, Cytomove analysis logs, full-resolution vs downsampled agreement, and mask-level validation.

---

## Open items requiring Düzgün-lab input

Most parameters previously marked TBD have now been resolved by reference to the published 2024 *Mol Divers* article and the recovered laboratory archive. The remaining open items are:

- **Specific Olympus microscope model** used for the 2021 and 2022 campaigns (brand confirmed: Olympus). Required only for completeness of the metadata field; does not block validation work.
- **Availability of a second rater** for inter-rater ICC. Acceptable fallback: intra-rater reliability only, declared as a limitation.
- **Co-author consent** for releasing the unpublished subset of the archive under CC BY 4.0 (Korkmaz, Akgün). Published subset already CC BY 4.0 by virtue of journal licence.

Resolved on 2026-04-29: `LC` = combined luteolin + cisplatin treatment.

Additional changelog note:
- **v0.4 (2026-05-02)** - Validation strategy revised to a three-layer design: synthetic binary masks for zero-tolerance mathematical correctness, synthetic microscopy-like images for controlled robustness testing with predefined tolerances, and real microscopy images for biological/workflow validity. Synthetic crop-robustness testing is now a core validation requirement for comparing area fraction and width-based metrics.
