# Validation Reference Inventory Summary

Generated from ignored raw datasets under `validation_ref_sets/raw/`.

Inventory CSV: `docs/validation-ref-inventory.csv`

| Dataset | Role | Files | Format | Resolution notes |
|---------|------|------:|--------|------------------|
| WHAD/CAMAD | Primary professional time-lapse validation | 83 | TIFF | Selected subset; example frames are 1920 x 1440 px |
| CSMA | Public comparator/workflow validation | 49 | JPEG | `sample_dataset`; frames are 1537 x 1537 px |
| Local phone/eyepiece | Real-world usability stress subset | 9 | JPG | HK/M8F/MK, 0h/24h/48h; frames are 1800 x 1800 px |
| RQSA | Deferred robustness/stress candidate | 0 | n/a | Not included in first-wave validation |

## Current First-Wave Counts

| Source role | Files |
|-------------|------:|
| Primary professional time-lapse | 83 |
| Public comparator workflow | 49 |
| Real-world usability stress | 9 |

## Next Manual Review Fields

Use `manual_review_status` and `notes` in `docs/validation-ref-inventory.csv` during image review.

Recommended labels:

- `include_primary`
- `include_secondary`
- `include_usability`
- `exclude_duplicate`
- `exclude_low_quality`
- `needs_ground_truth`
- `needs_timepoint_mapping`

The raw image files remain untracked by git. Only inventory, curated metadata, scripts, and small derived figures should be committed.
