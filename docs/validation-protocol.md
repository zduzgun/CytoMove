# Cytomove Validation Dataset Protocol

**Document version:** 0.1 (draft)
**Status:** Pre-registered — collection not yet started
**Last updated:** 2026-04-28
**Owner:** Z. Düzgün, Giresun University Faculty of Medicine, Department of Medical Biology
**Intended use:** This protocol is pre-registered prior to data collection. The text is written in IMRAD style so that the *Methods* and *Validation Dataset* sections of the planned bioRxiv preprint (Phase 3) can be excerpted from this document with minimal rewriting.

---

## 1. Purpose

To define, in advance of any image acquisition or algorithm tuning, the dataset that will be used to evaluate the analytical performance of Cytomove against the established manual ground truth (ImageJ-based measurement). Pre-registration of the protocol is intended to eliminate post-hoc selection of inclusion criteria, sample size, or evaluation metrics.

The dataset will support three downstream goals: (i) the Phase 2 MVP success criteria defined in `ROADMAP.md` (Pearson r > 0.9, mean wound-area error < 10 %, unedited acceptance rate ≥ 70 %); (ii) the comparative analysis against TScratch, the ImageJ MRI Wound Healing macro, and Wimasis planned for Phase 2; and (iii) the bioRxiv preprint planned for Phase 3.

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
| Cell type | At least 3 distinct lines spanning epithelial, fibroblast, and endothelial origins. Candidate set: HeLa, MCF-7, A549, HUVEC, NIH/3T3, HaCaT. **TBD — Düzgün lab availability.** |
| Imaging modality | Phase contrast (mandatory, ≥ 60 % of set); brightfield; fluorescence (cell-membrane or nuclear stain). |
| Magnification | 4×, 10×, 20× (at least two of three represented). |
| Scratch quality | Clean (sharp linear edge); ragged (uneven edge); partially detached (cells lifted at edge). |
| Time point relative to wounding | t = 0 h (baseline); t = 6–12 h (mid-closure); t = 18–24 h (late closure). |
| Microscope vendor / model | At least 2 distinct optical systems represented. **TBD — Düzgün lab inventory.** |

Each image is tagged with all axis values in the metadata schema (§7).

## 5. Image Acquisition Strategy

A four-tier sourcing strategy will be followed, in priority order. Provenance and licence are recorded per image.

### Tier 1 — Düzgün laboratory archive (target: 15–25 images)
Retrospective images from prior experiments and current ongoing assays in the Department of Medical Biology, Giresun University Faculty of Medicine. This tier provides the highest provenance certainty, full metadata access, and an unambiguous redistribution licence (CC BY 4.0 by founder authority, subject to co-author agreements where applicable). Images already published in peer-reviewed papers will require checking with the publisher for redistribution rights; unpublished images carry no such restriction.

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

- n (primary set), n (edge-case set).
- Pearson r with 95 % CI, on percentage wound closure, Cytomove vs ground truth.
- Bland–Altman analysis: mean bias, 95 % limits of agreement, with CI on the limits.
- Intra-class correlation coefficient (two-way mixed, absolute agreement).
- Mean absolute error and root-mean-square error in percentage wound area.
- Fraction of images on which Cytomove output was accepted by a user without manual correction (operationalised by a separate user-study protocol, not this document).
- Stratified results by cell type, modality, and magnification to expose subgroup performance.

Failures, mis-segmentations, and edge-case behaviour are reported with example figures, not omitted.

## 11. Versioning and Updates

This document is versioned in lock-step with the dataset Zenodo record. Material changes (revised inclusion criteria, sample-size targets, ground-truth method) require a version bump and a dated changelog entry below.

### Changelog

- **v0.1 (2026-04-28)** — Initial draft. Pre-registered before any image collection.

---

## Open items requiring Düzgün-lab input

The following parameters cannot be set without information about local lab capacity. Each is marked above as *TBD*.

- Available cell lines (Tier 1 candidates).
- Available microscope(s) and objective(s).
- Existing archive of usable scratch assay images (rough count, date range).
- Availability of a second rater for ICC.
- Whether any prior images have already appeared in published papers (affects redistribution).
