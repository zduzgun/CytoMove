# Cytomove Validation Visual Sample Review

**Date:** 2026-04-29  
**Scope:** Representative visual review of 9 Tier 1 images selected from `docs/validation-inventory.csv`.  
**Raw image policy:** No raw images were copied into the repository. This document records only image IDs, relative paths, and review notes.

## Purpose

This review checks whether the current Duzgun lab archive is ready for early segmentation work and what preprocessing constraints should be treated as first-class requirements before algorithm validation.

## Reviewed Samples

| image_id | Group | Relative path | Dimensions | Review class | Notes |
|---|---|---|---:|---|---|
| `cytv-0258` | HUVEC Control, multi-timepoint curated | `wound healing/29.06.22/COMBINE/H-K-0-24-48/HK-0H-2.jpg` | 1800x1800 | Primary positive control | Clean curated crop, no black circular border, central wound, moderate illumination gradient. Best early segmentation smoke-test image. |
| `cytv-0254` | HUVEC Control, 0h | `wound healing/29.06.22/H-K-0H/IMG_2861.jpg` | 1574x2100 | Usable with preprocessing | Circular microscope field, black border, handwritten top label. Wound is visible; border and label must be masked/cropped. |
| `cytv-0324` | MDA-MB-231 Control, multi-timepoint curated | `wound healing/29.06.22/COMBINE/M-K-0-24-48/IMG_2894.jpg` | 1574x2100 | Usable with preprocessing | Circular field and label remain. Wound is mostly vertical/central; useful after field-of-view masking. |
| `cytv-0297` | MDA-MB-231 FDI-6 8 uM, multi-timepoint curated | `wound healing/29.06.22/COMBINE/M-8F-0H-24-48/IMG_2899.jpg` | 1574x2100 | Usable with preprocessing | Circular field, handwritten label, sparse cells/debris. Good representative of lower-contrast phone-eyepiece data. |
| `cytv-0276` | HUVEC Luteolin + Cisplatin, 0h | `wound healing/29.06.22/H-LC-0H/IMG_2888.jpg` | 1574x2100 | Usable with preprocessing | Centered circular field and visible wound. Label and border masking required. |
| `cytv-0341` | MDA-MB-231 Luteolin + Cisplatin, 0h | `wound healing/29.06.22/M-LC-0H/IMG_2918.jpg` | 1574x2100 | Usable with preprocessing | Similar to other 2022 phone-eyepiece images: centered circular field, label, visible wound area. |
| `cytv-0351` | HUVEC FDI-6, 24h | `wound healing/fdi/HUVEC/Huvec fdi 6 24 h/20211222_132757.jpg` | 4032x3024 | Edge case / exclude from primary set | Severe framing issue: actual microscopy field is mostly near the lower frame, with large black area above. Keep as hard case only after robust field-of-view detection or manual crop. |
| `cytv-0001` | Unresolved 24h timecourse pool | `wound healing/29.06.22/yara iyileşme deneyi/24h/IMG_2927.jpg` | 1574x2100 | Metadata review needed | In-image handwriting appears to encode condition/time, likely `M-K-24h`. Path metadata alone is insufficient; use manual visual mapping before validation inclusion. |
| `cytv-0099` | Unresolved 48h timecourse pool | `wound healing/29.06.22/yara iyileşme deneyi/48h/IMG_3030 (1).jpg` | 1574x2100 | Metadata review needed | In-image handwriting appears to encode condition/time, likely `H-K-48h`. Needs manual mapping if included in stratified validation set. |

## Findings

1. **Field-of-view preprocessing is required.** Most 2022 phone-eyepiece images have a circular microscope field, black border, and handwritten labels. A reliable MVP algorithm should detect/crop or mask the circular field before segmentation.
2. **Curated COMBINE crops are the safest first algorithm targets.** The 1800x1800 curated images are much cleaner and should be used for early segmentation smoke tests before the full archive.
3. **Some 2021 FDI frames are hard cases.** At least one reviewed 4032x3024 image has severe off-center framing. These images should not define the primary validation baseline until robust field detection or manual crop rules exist.
4. **Unresolved timecourse images may be recoverable.** Some condition/time information appears in the handwritten labels, but this requires manual review or explicit annotation rather than path parsing.
5. **Existing xlsx outputs remain condition-level evidence, not per-image ground truth.** The next validation step is still stratified per-image ImageJ re-measurement.

## Recommended Next Actions

1. Build the first segmentation prototype against the clean COMBINE crop subset, with `cytv-0258` as an early positive-control image.
2. Add preprocessing before broad validation: circular field-of-view detection, label/header masking, optional illumination correction.
3. Create a small visual-quality annotation column later (`primary`, `preprocess_required`, `edge_case`, `metadata_review`) if the validation CSV becomes the working sampling frame.
4. Select the first n ~= 50-80 ImageJ re-measurement set from visually usable images, while keeping a small reserved edge-case subset for robustness testing.
