# Cytomove — bioRxiv Submission Checklist

**Prepared:** 2026-06-01  
**Target server:** bioRxiv  
**Article category:** New Results  
**Subject area:** Bioinformatics (alternative: Cell Biology)  
**License:** CC BY 4.0  
**Positioning:** methods/software research article with preliminary validation

---

## Active Submission Files

| Item | File / value | Status |
| --- | --- | --- |
| Source manuscript | `PUBLICATION/0-preprint-bioRxiv/manuscript/cytomove-preprint-biorxiv-imrad.md` | Ready, IMRAD variant sourced from current CMPB package |
| Submission Word file | `PUBLICATION/0-preprint-bioRxiv/manuscript/Cytomove_preprint_bioRxiv_IMRAD.docx` | Ready |
| Submission PDF | `PUBLICATION/0-preprint-bioRxiv/manuscript/Cytomove_preprint_bioRxiv_IMRAD.pdf` | Ready |
| References | `docs/references/cytomove-preprint.bib` | Ready |
| Figures | `PUBLICATION/0-preprint-bioRxiv/figures/Figure1.png ... Figure6.png, FigureS1.png` | Ready |
| Validation artifact package | `PUBLICATION/0-preprint-bioRxiv/Cytomove_zenodo_validation_deposit_2026-06-03.zip` | Ready after final ZIP verification |
| Zenodo metadata | `docs/zenodo_deposit/.zenodo.json` | Ready |
| Zenodo instructions | `docs/zenodo-submit-instructions.md` | Ready |

Old manuscript drafts have been archived under `docs/old/manuscript_drafts/`. Do not use the previous `literature_format_v4` files for submission.

---

## Scientific Readiness

- [x] IMRAD structure: Abstract, Introduction, Materials and Methods, Results, Discussion, Conclusion, plus required statements.
- [x] MAPE / median / maximum error metrics restored and framed conservatively.
- [x] Pearson r described as a trend statistic, not standalone frame-level accuracy proof.
- [x] WHAD-MCF7 15.0% area MAPE explained as near-closure sensitivity; median 6.6% retained.
- [x] Table redundancy removed; active manuscript has three tables.
- [x] Funding statement finalized: no external funding.
- [x] Competing interests finalized: author is the developer of Cytomove.
- [x] ORCID included: `0000-0001-6420-6292`.
- [x] Data/software availability includes GitHub and live site URLs, with public source-code licensing stated as pending institutional IP/TTO confirmation.
- [x] Reserved Zenodo validation-package DOI (10.5281/zenodo.20486820) inserted into Data and Code Availability.
- [x] Manuscript editorial review pass complete (2026-06-01): BT.709 luminance label fix, sequential figure numbering + Figure 3 callout, alphabetical references + full Schindelin author list, rounding fix, all em-dashes removed, impersonal single-author voice (no authorial "we"), WHAD-MCF7 caption naming.
- [ ] Publish/confirm the Zenodo deposit so the DOI resolves before bioRxiv posting.

---

## bioRxiv Metadata

| Field | Value |
| --- | --- |
| Title | Cytomove: a browser-local and reviewable workflow for scratch wound healing assay quantification |
| Author | Zekeriya Düzgün |
| Affiliation | Department of Medical Biology, Faculty of Medicine, Giresun University, Giresun, Türkiye |
| Corresponding e-mail | zekeriya.duzgun@giresun.edu.tr |
| ORCID | 0000-0001-6420-6292 |
| Article category | New Results |
| Subject area | Bioinformatics |
| License | CC BY 4.0 |
| Funding | No external funding |
| Competing interests | The author is the developer of Cytomove. No other competing interests are declared. |
| Data/code availability | GitHub URL + Cytomove live URL + Zenodo validation package DOI 10.5281/zenodo.20486820 |

---

## Zenodo Record A — Validation Artifacts

Rebuild and upload `docs/Cytomove_zenodo_deposit_enriched_doi.zip` as a dataset record.

Use metadata from `docs/zenodo_deposit/.zenodo.json`:

- Resource type: Dataset
- License: CC BY 4.0
- Creator: Düzgün, Zekeriya — Giresun University — ORCID `0000-0001-6420-6292`
- Related identifiers:
  - references `10.5281/zenodo.12806149` (WHAD/CAMAD)
  - references `10.1109/ACCESS.2025.3561607` (CSMA)
  - is supplement to `https://github.com/zduzgun/CytoMove`

Reserved DOI 10.5281/zenodo.20486820 already integrated (2026-06-01):

- [x] Updated `docs/manuscript-cytomove-submission.md`, Data and Code Availability.
- [x] Regenerated IMRAD preprint DOCX.
- [x] Regenerated IMRAD preprint PDF.
- [x] Refreshed `PUBLICATION/0-preprint-bioRxiv/zenodo_validation_deposit/Cytomove_manuscript_submission.pdf` from the current PDF.
- [ ] Publish the Zenodo validation-data record so the DOI resolves.

---

## Submission Sequence

1. Upload `PUBLICATION/0-preprint-bioRxiv/Cytomove_zenodo_validation_deposit_2026-06-03.zip` to Zenodo as Record A.
2. Publish the Zenodo record so the reserved DOI resolves.
3. After publication, change the manuscript availability sentence from "prepared for Zenodo deposition under the reserved DOI" to "available on Zenodo".
4. Rebuild the submission DOCX/PDF and Zenodo ZIP if any availability text changes before bioRxiv submission.
5. Submit to bioRxiv as New Results, Bioinformatics, CC BY 4.0.
6. After bioRxiv posting, add the bioRxiv DOI to Zenodo related identifiers if possible.
7. Add final DOI links to `README.md`, `cytomove.com`, and the IHSC abstract materials.

---

## Known Follow-Up

- `BİLDİRİ/` contains IHSC abstract material that may still use the older WHAD-MCF7 area MAPE value of 7.01%. Before congress submission, update it to the current discrepancy-reviewed framing: CSMA sample area MAPE 4.05%; WHAD-MCF7 area MAPE 15.03% driven by late near-closure frames, or omit the WHAD-MCF7 MAPE and report high area trend correlation with the near-closure caveat.
- bioRxiv preprints are persistent and citable. Do not submit until the Zenodo DOI and manuscript PDF are synchronized.
