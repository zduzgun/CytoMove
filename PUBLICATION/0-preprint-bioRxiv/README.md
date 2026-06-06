# Cytomove preprint package - bioRxiv

Prepared: 2026-06-03

This folder is the low-risk preprint and validation-data route while the CMPB
Original Software Publication path waits for institutional IP/TTO confirmation.
The current preprint manuscript is an IMRAD variant sourced from the updated
CMPB package, with the IP/licensing claims adjusted so they do not state that
public code relicensing is already complete. The current intended code-release
model is source-available, non-commercial academic/research use, with commercial
use requiring a separate written licence.

## Purpose

- Publish/confirm the Zenodo validation-data deposit first.
- Submit the current manuscript as a bioRxiv preprint after the Zenodo DOI
  resolves.
- Keep the CMPB OSP package separate under `PUBLICATION/1-Computer Methods and
  Programs in Biomedicine/`.

## Folder contents

| Folder/file | Purpose |
| --- | --- |
| `manuscript/` | Current CMPB-sourced preprint manuscript source, DOCX, and PDF |
| `figures/` | Updated submission figures copied from the CMPB package |
| `zenodo_validation_deposit/` | Validation artifact deposit payload |
| `Cytomove_zenodo_validation_deposit_2026-06-03.zip` | ZIP to upload to Zenodo after final check |
| `SUBMISSION_CHECKLIST.md` | bioRxiv sequence and metadata |
| `ZENODO_SUBMIT_INSTRUCTIONS.md` | Zenodo form guidance |

## Canonical sources

Do not edit generated DOCX/PDF files directly.

- Preprint source: `PUBLICATION/0-preprint-bioRxiv/manuscript/cytomove-preprint-biorxiv-imrad.md`
- CMPB source used for the update: `PUBLICATION/1-Computer Methods and Programs in Biomedicine/manuscript/cytomove-osp-cmpb.md`
- IMRAD source builder: `scripts/build_biorxiv_imrad_preprint.py`
- Manuscript builder used for the preprint DOCX: `scripts/build_biorxiv_imrad_docx.py`
- Current preprint DOCX: `PUBLICATION/0-preprint-bioRxiv/manuscript/Cytomove_preprint_bioRxiv_IMRAD.docx`
- Current preprint PDF: `PUBLICATION/0-preprint-bioRxiv/manuscript/Cytomove_preprint_bioRxiv_IMRAD.pdf`
- Validation deposit source folder: `docs/zenodo_deposit/`

If the manuscript changes, rebuild from the canonical source, then refresh this
package.

## Recommended sequence

1. Upload the Zenodo validation ZIP as a dataset record.
2. Publish the Zenodo record so DOI `10.5281/zenodo.20486820` resolves.
3. Update the manuscript wording from reserved/prepared DOI to published
   availability if needed.
4. Rebuild DOCX/PDF and refresh this folder.
5. Submit to bioRxiv as New Results / Bioinformatics / CC BY 4.0.
