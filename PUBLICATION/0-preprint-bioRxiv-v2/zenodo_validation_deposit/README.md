# Cytomove v2 Validation Data, Figures, and Analysis Artifacts

This package contains the supporting validation artifacts for the Cytomove preprint,
*"Cytomove: a browser-local and reviewable workflow for scratch wound healing assay quantification"*
(Zekeriya Duzgun, Giresun University; ORCID 0000-0001-6420-6292).

It is the frozen numerical source of truth and figure set behind the reported
Cytomove-versus-WHST comparison, deposited so the results can be inspected and reproduced.

## Contents

| File / folder | Description |
| --- | --- |
| `validation_master.xlsx` | Paired WHST and Cytomove per-frame measurements, dataset-level diagnostics, discrepancy-resolution table, and manuscript notes. |
| `selected_input_manifest.csv` | Per-frame provenance table for the 31 validation measurements, including source dataset/origin, redistribution status, license/rights notes, and derived-output locations. |
| `input_images/author_phone/` | The 9 author-acquired smartphone-through-eyepiece raw JPG images used for the `cell_phone_HK`, `cell_phone_M8F`, and `cell_phone_MK` validation sets. |
| `derived_outputs/` | Frozen Cytomove group-metric exports and WHST/CSMA comparison workbooks used to build the paired validation summary. |
| `figures/` | Current v2 validation and manuscript figures generated from the validation workflow: Figure 1, Figure 2, Figure 3, Figure 4, Figure 5, Figure 6, and Supplementary Figure S1. |
| `.zenodo.json` and `zenodo_metadata.json` | Zenodo deposit metadata. |
| `deposit_file_manifest.csv` | File-level manifest with relative path, file size, and SHA-256 checksum. |

## Datasets and provenance

The five validation image sets comprise 31 paired measurements:

- `csma_sample_11` (n = 11): clean brightfield comparator time course.
- `whad_mcf7_11` (n = 11): phase-contrast MCF-7 near-closure time course.
- `cell_phone_HK`, `cell_phone_M8F`, `cell_phone_MK` (n = 3 each): author-acquired smartphone-through-eyepiece brightfield support/stress sets.

Image provenance:

- **WHAD-MCF7** source images were derived from the WHAD/CAMAD dataset: Iheme et al., 2024, Zenodo, CC BY 4.0, doi:10.5281/zenodo.12806149.
- **CSMA** sample images and output context were derived from the public CSMA WoundHealing repository and associated publication: Pham et al., 2025, IEEE Access, doi:10.1109/ACCESS.2025.3561607.
- **Smartphone-through-eyepiece** images were acquired by the author from established cell-line cultures.

Raw third-party WHAD/CAMAD and CSMA image archives are not redistributed here; readers should obtain raw third-party images from their original sources under their own licenses. Exact selected third-party frame identifiers are provided in `selected_input_manifest.csv`. The author-acquired phone images used in the validation are included.

## Licenses

The validation data, author-generated figures, and deposit metadata in this Zenodo package are released under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0), except where a third-party source retains its own license.

This dataset package does not redistribute the Cytomove source code. Cytomove source-code licensing is handled separately in the project repository.

## Software

The Cytomove project repository is maintained at <https://github.com/zduzgun/CytoMove>; a live web version is available at <https://cytomove.com>. The manuscript is submitted separately as a preprint and is not included in this lean reproducibility package.

## Citation

Duzgun, Z. (2026). *Cytomove: validation data, figures, and analysis artifacts for a browser-local scratch wound healing assay quantification workflow* [Data set]. Zenodo. https://doi.org/10.5281/zenodo.20486820
