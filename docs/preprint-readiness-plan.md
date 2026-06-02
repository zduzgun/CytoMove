# Cytomove Preprint Readiness Plan

**Target server:** bioRxiv  
**Positioning:** Methods/software research article with preliminary validation data  
**Current status:** Draft manuscript skeleton exists at `docs/manuscript-draft.md`

## Why bioRxiv

bioRxiv is the best fit because Cytomove is a biological image-analysis workflow for scratch wound healing assays, not clinical/public-health research. The preprint should be framed as a research manuscript with new validation data, not as a software announcement or protocol-only document.

Key bioRxiv implications from official guidance:

- bioRxiv screens for scope and article type; a research manuscript is acceptable, while narrative reviews, commentaries, opinion pieces, and step-by-step protocols are not.
- Bioinformatics tools and protocols should be written in the context of a research article and should contain data.
- Results can include use-case examples, outputs, or reanalysis of previously published data.
- Screening typically takes 24-48 hours, but may take longer.
- bioRxiv does not require a specific article format; author-created PDFs are accepted.

## Preprint Claim

Preferred main claim:

> Cytomove is a browser-based, local, reviewable, area-first workflow for scratch wound healing assay quantification, with preliminary validation against WHST.

Avoid:

- "AI-powered" as a main claim.
- "Fully automated" or "universal" segmentation claims.
- Overstating accuracy from small validation sets.
- Treating WHST agreement as absolute ground truth.

## Required Package Before Submission

1. **Manuscript PDF**
   - Source: `docs/manuscript-draft.md`, later exported to `.docx` and PDF.
   - Must include inline or end-of-document figures and tables.
   - Must include clear "preliminary validation" language.

2. **Figures**
   - Figure 1: Cytomove workflow.
   - Figure 2: representative overlays.
   - Figure 3: WHST vs Cytomove area agreement.
   - Figure 4: WHAD-MCF7 time-course behavior.
   - Supplementary figure: stress/limitation cases.
   - Supplementary figure: CSMA 11-frame visual audit with raw, CSMA area, WHST, and Cytomove rows.

3. **Tables**
   - Tool comparison table.
   - Dataset summary table.
   - Agreement metrics table.
   - Supplementary per-image measurements from `validation_master.xlsx`.

4. **Supplementary Files**
   - `validation_master.xlsx`
   - Representative overlay PNGs.
   - Optional: Cytomove export CSVs used in the master file.
   - Optional: source code / demo URL, once stable.

5. **Metadata Needed for Submission**
   - Title.
   - Author and affiliation.
   - Corresponding author e-mail.
   - Abstract.
   - Subject category: likely `Bioinformatics` or `Methods and Resources`; final choice should be made at submission.
   - License preference: recommended `CC-BY 4.0`.
   - Funding statement.
   - Competing interests statement.
   - Data/code availability statement.

## Immediate Writing Tasks

1. Expand `docs/manuscript-draft.md` from skeleton to full preprint draft.
2. Add references in journal style:
   - TScratch 2009.
   - WHST 2020.
   - PyScratch 2020.
   - CSMA preprint/tool paper.
   - MRI Wound Healing Tool documentation if cited.
3. Add a source-consistency paragraph explaining the WHAD-MCF7 discrepancy review.
4. Generate final figures from `validation_master.xlsx`.
5. Create a submission-ready abstract that matches the updated master values:
   - CSMA sample 11 area MAPE: 4.05%.
   - WHAD-MCF7 area MAPE: 15.03%.
   - WHAD-MCF7 width MAPE: 9.03%.

## Important Note: Congress Abstract

The current IHSC abstract draft was prepared before the discrepancy-reviewed master update and uses the older WHAD-MCF7 area MAPE value of 7.01%. Before congress submission, update it to either:

- use only the CSMA sample 11 value, avoiding the discrepancy-sensitive WHAD-MCF7 statistic; or
- use the updated WHAD-MCF7 values from `validation_master.xlsx`.

Recommended congress-safe wording:

> In preliminary WHST comparison, Cytomove showed strong area agreement in the CSMA sample subset (MAPE 4.05%; Pearson r = 0.9975). In a phase-contrast WHAD-MCF7 time-course set, Cytomove retained high area correlation (Pearson r = 0.9984), while late near-closure frames increased relative area error.

## Preprint Submission Sequence

1. Freeze validation source files and keep `validation_master.xlsx` as the single numerical source of truth.
2. Generate figures from the frozen master file.
3. Convert manuscript draft into polished IMRAD prose.
4. Add references, availability statements, and limitations.
5. Export a clean PDF.
6. Upload manuscript PDF and supplementary files to bioRxiv.
7. After posting, add the DOI to `README.md`, the web prototype, and the congress/poster materials.
