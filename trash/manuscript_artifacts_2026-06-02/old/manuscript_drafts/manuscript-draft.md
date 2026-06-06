# Cytomove Manuscript Draft

**Working title:** Cytomove: a browser-based, reviewable workflow for scratch wound healing assay quantification

**Status:** v0.2 expanded preprint draft  
**Last updated:** 2026-05-25  
**Primary data source:** `validation_sets/comparator_clean/results/validation_master.xlsx`  
**Reference source file:** `docs/references/cytomove-preprint.bib`  
**Preprint positioning:** bioRxiv methods/software research article with preliminary validation data

---

## Abstract

Scratch wound healing assays are widely used to evaluate collective cell migration, yet quantitative analysis often remains dependent on manual annotation, installation-specific desktop tools, or automated workflows whose segmentation results are difficult to inspect and reproduce. We developed Cytomove, a browser-based, local-first prototype for reviewable quantification of scratch wound healing images.

Cytomove supports single-image and grouped time-course review, semi-automated segmentation of brightfield and phase-contrast images, optional local correction, and export of wound area, wound area fraction, mean and median wound width, width variability, quality-control labels, overlay images, plots, and analysis metadata. The workflow emphasizes transparent review and publication-oriented outputs rather than fully opaque automation.

In preliminary validation, Cytomove measurements were compared with ImageJ/Fiji Wound Healing Size Tool (WHST) outputs across five image sets. In the CSMA sample subset (n = 11), Cytomove wound area and width measurements closely matched WHST across the full 11-frame sequence, with strong area trend correlation (Pearson r = 0.9975) and visually concordant overlays. In the WHAD-MCF7 phase-contrast time-course set (n = 11), Cytomove retained high area and width trend correlation (r = 0.9984 and r = 0.9986, respectively), while late near-closure frames showed that correlation alone is not sufficient to claim measurement agreement. External smartphone-through-eyepiece brightfield images were retained as support and stress examples, demonstrating the need for QC labels, visual overlay review, and optional manual correction in difficult images.

These findings support Cytomove as an installation-free, reviewable, area-first workflow for scratch assay quantification. Width metrics and late near-closure frames require quality-control interpretation and, in difficult images, visual review or manual correction.

## Keywords

scratch assay; wound healing assay; cell migration; image analysis; browser-based analysis; Cytomove; ImageJ; WHST

---

## 1. Introduction

The scratch wound healing assay is a simple and widely used in vitro method for studying collective cell migration. A gap is introduced into a confluent cell monolayer, microscopy images are acquired over time, and the rate or extent of gap closure is quantified. The assay remains popular because it is inexpensive, technically accessible, compatible with many cell types, and directly interpretable as a collective migration model **(Liang et al., 2007; Jonkman et al., 2014; Grada et al., 2017)**.

Despite this apparent simplicity, image quantification is still a practical bottleneck. Manual measurement can be subjective and slow, particularly when experiments include multiple fields, time points, replicates, or treatment groups. General-purpose image-analysis environments such as ImageJ and Fiji are powerful and widely adopted **(Schneider et al., 2012; Schindelin et al., 2012)**, but many scratch-assay workflows still require plugin installation, local configuration, parameter tuning, and careful bookkeeping to make results reproducible.

Several dedicated tools have addressed parts of this problem. TScratch provided an early automated scratch-assay analysis workflow with visual review and manual correction, emphasizing that segmentation should remain inspectable rather than purely black-box **(Gebäck et al., 2009)**. The Wound Healing Size Tool (WHST) implemented an ImageJ/Fiji plugin that reports wound area, wound area fraction, average wound width, and width variability through a local-variance and thresholding workflow **(Suarez-Arnedo et al., 2020)**. PyScratch provided a Python-based graphical workflow for time-series scratch assays and highlighted the value of batch analysis for non-programmer users **(Garcia-Fossa et al., 2020)**. More recently, CSMA introduced a standalone and ImageJ-compatible tool focused on detecting cells inside the wound region and producing area and width outputs over time **(Pham et al., 2025)**.

These tools show that the core measurement concepts are well established: wound area, normalized wound area, width, closure over time, and visual overlays. The remaining opportunity is not simply to add another opaque segmentation algorithm. Instead, a useful workflow should reduce installation friction, keep images local where possible, make segmentation review natural, record parameter choices, and export data in forms that are easy to audit and cite.

Here we present Cytomove, a browser-based prototype for local scratch wound healing assay quantification. The central claim is deliberately conservative: Cytomove provides a reviewable, browser-local, area-first workflow that can produce WHST-comparable measurements in preliminary validation. Wound area is treated as the primary metric because it is broadly supported across scratch-assay tools. Wound width is retained as a secondary metric, but it is interpreted with quality-control caution when wounds become small, fragmented, or irregular.

## 2. Materials and Methods

### 2.1 Cytomove prototype

Cytomove is a browser-based scratch wound healing analysis prototype designed to run without server-side image upload during analysis. Users open the web app, import one or more local microscopy images, choose or accept an image-type preset, review the segmentation overlay, optionally apply local correction, and export results.

The current prototype supports two analysis modes. In single-image mode, one image is loaded into the main canvas and processed with the current segmentation settings. In group mode, multiple local images can be loaded as a time-course or treatment group. The app displays per-frame previews, lets the user open any frame in the main review canvas, and exports group-level tables, plots, and overlay images.

Outputs include wound area in pixels, wound area fraction, field or crop area, mean wound width, median wound width, width standard deviation, width coefficient of variation, valid row fraction, segmentation parameters, crop and rotation state, manual correction status, quality-control labels, and source image metadata when available. These outputs are intended to make the analysis path inspectable after export.

### 2.2 Segmentation and review workflow

Cytomove uses an explainable image-processing workflow inspired by WHST-like local-variance and threshold segmentation rather than an AI-first model. The prototype includes presets for brightfield normal cells, brightfield small cells, phase contrast, and a second phase-contrast-like setting for speckled images. User-adjustable parameters include variance radius, threshold level or offset, minimum component size, field-of-view cutoff, tiny-island handling, microscope mode, scratch orientation, fine rotation, crop state, contour style, and manual correction mode.

The segmentation output is treated as a review object, not only as a numeric endpoint. The user sees the wound contour or mask overlaid on the source image and can identify oversegmentation, missed wound regions, internal islands, fragmented masks, and late near-closure ambiguity. Manual correction tools allow local filling, scan-based addition, erasing, and speck cleaning. Manual correction is stored in the exported analysis metadata so that downstream users can distinguish fully automatic and user-reviewed outputs.

### 2.3 Datasets and comparator tools

WHST was selected as the primary quantitative comparator because its reported metrics align closely with Cytomove: wound area, wound area fraction, average wound width, and width variability **(Suarez-Arnedo et al., 2020)**. Other tools were included in the literature and product comparison, but not all were used as primary numerical comparators in this preliminary validation. TScratch was treated as a historical and design comparator for reviewable segmentation **(Gebäck et al., 2009)**. PyScratch was treated as a time-course and usability comparator **(Garcia-Fossa et al., 2020)**. CSMA was treated as an emerging comparator for wound-internal cell handling and was used visually and contextually in the CSMA sample workflow **(Pham et al., 2025)**.

The current validation master file contains five datasets:

| Dataset | n | Imaging / role | Comparator role |
| --- | ---: | --- | --- |
| `csma_sample_11` | 11 | Representative subset from the CSMA sample time-course | Primary clean comparator subset |
| `whad_mcf7_11` | 11 | WHAD-MCF7 phase-contrast time-course subset | Primary phase-contrast time-course subset |
| `cell_phone_HK` | 3 | Smartphone-through-eyepiece brightfield images | External support set |
| `cell_phone_M8F` | 3 | Smartphone-through-eyepiece brightfield images | External support/stress set |
| `cell_phone_MK` | 3 | Smartphone-through-eyepiece brightfield images | External stress/limitation set |

For `whad_mcf7_11`, Cytomove values in the manuscript are taken from the raw Cytomove `group_metrics.csv` export after discrepancy review. Older workbook Cytomove columns were retained only as discrepancy history because they represented a different Cytomove run/export.

### 2.4 Measurement definitions

Wound area was defined as the number of pixels assigned to the wound region inside the analysis field or crop. Wound area fraction was defined as wound area divided by analysis field area and expressed as a percentage. Mean wound width was calculated from row-wise wound spans after applying the selected scratch orientation. Median width, width standard deviation, width coefficient of variation, and valid row fraction were exported as secondary descriptors of wound geometry.

Closure metrics were not treated as a primary endpoint in this preliminary manuscript because robust closure requires explicit baseline linkage, time metadata, and, ideally, spatial calibration. Cytomove can export time-course curves and baseline-relative summaries where the group structure is defined, but this draft focuses on per-frame agreement with WHST area and width measurements.

### 2.5 Statistical analysis

Agreement between Cytomove and WHST was evaluated primarily through paired area and width comparisons, trend correlation, visual overlay review, and diagnostic percent-difference summaries. Area and width were evaluated separately because they respond differently to near-closure frames, fragmented masks, and internal cell islands. Percent-difference values were used as diagnostic indicators for discordant frames rather than as the central validation claim, because the local scratch-assay tool literature more commonly reports manual/tool agreement, visual concordance, and application performance than MAPE-style summaries.

Area was treated as the primary endpoint. Width was treated as a secondary endpoint because mean wound width can become unstable when wounds are narrow, discontinuous, or represented by multiple disconnected regions. Correlation was interpreted as a trend-agreement statistic rather than a sufficient accuracy measure; percent-difference outliers and visual overlays were used to identify failure modes.

## 3. Results

### 3.1 Cytomove provides a browser-local, reviewable scratch assay workflow

Cytomove implements an end-to-end workflow from local image import to exportable figures and tables (Figure 1). The user can load one image or a group of local images, apply image-type presets, review the wound segmentation overlay, tune segmentation parameters, correct local errors, and export CSV, Excel, overlay PNG, group overlay ZIP, and time-course plots.

This workflow was designed around a simple principle: the segmentation mask should remain visible and accountable. Rather than hiding algorithmic decisions behind a single output number, Cytomove exposes the image, overlay, parameters, warnings, and exported metadata together. This is consistent with earlier scratch-assay tools that emphasize visual inspection and manual adjustment **(Gebäck et al., 2009; Suarez-Arnedo et al., 2020)**.

### 3.2 Cytomove showed strong area agreement in the clean CSMA subset

In `csma_sample_11` (n = 11), Cytomove wound area measurements showed strong agreement with WHST. Area trend correlation was high (Pearson r = 0.9975), diagnostic area percent differences were low across the sequence, and representative overlays showed close visual concordance. Width measurements also followed WHST closely (Pearson r = 0.9969), supporting the use of Cytomove for area-first analysis in clean comparator images.

This dataset supports the core claim that Cytomove can reproduce WHST-like area and width measurements in a controlled comparator subset. Representative overlays show that Cytomove captured the main wound corridor across the time-course while preserving a reviewable contour over the original image (Figure 2). The CSMA visual audit panel further places raw images, CSMA area outputs, WHST outputs, and Cytomove overlays in the same 11-frame sequence, allowing visual comparison of the full subset (Supplementary Figure 2).

### 3.3 Phase-contrast WHAD-MCF7 images showed high correlation but near-closure sensitivity

In `whad_mcf7_11` (n = 11), area correlation remained high (Pearson r = 0.9984), and width correlation was similarly strong (Pearson r = 0.9986). However, diagnostic percent-difference review showed that late near-closure frames were sensitive to small absolute differences between Cytomove and WHST. These frames should be interpreted as QC-sensitive rather than as simple pass/fail measurements.

These results show that Cytomove tracked the time-course trend well, but small residual wound regions produced high relative area error. Such frames should be flagged by QC and interpreted with visual review. Figure 4 illustrates this issue: area curves remain closely aligned across the time-course, but the relative impact of small absolute differences increases as the wound approaches closure.

### 3.4 Smartphone-through-eyepiece images exposed useful stress cases

External phone-capture brightfield images showed heterogeneous performance. `cell_phone_HK` behaved as a supportive external set with high area and width trend correlation. `cell_phone_M8F` showed moderate support with a late-frame underestimation pattern. `cell_phone_MK` behaved as a stress/limitation set rather than accuracy evidence, mainly because late fragmented or empty-looking regions were included more generously by Cytomove than by WHST.

This behavior is important for product positioning. Cytomove should not claim universal fully automatic segmentation. Instead, difficult phone-capture and near-closure images should be presented as cases requiring QC review and possible manual correction.

### 3.5 Dataset-level agreement summary

| Dataset | n | Area trend r | Width trend r | Diagnostic interpretation |
| --- | ---: | ---: | ---: | --- |
| `csma_sample_11` | 11 | 0.9975 | 0.9969 | Primary clean validation set; low diagnostic percent-difference range |
| `whad_mcf7_11` | 11 | 0.9984 | 0.9986 | Primary phase-contrast set; near-closure-sensitive late frames |
| `cell_phone_HK` | 3 | 0.9903 | 0.9918 | External support set |
| `cell_phone_M8F` | 3 | 0.9557 | 0.9076 | External support/stress set |
| `cell_phone_MK` | 3 | 0.9880 | 0.9861 | Stress/limitation set; not accuracy evidence |

## 4. Discussion

This preliminary validation supports Cytomove as a reviewable, browser-based workflow for scratch wound healing quantification. The strongest evidence comes from the CSMA sample subset, where Cytomove area and width metrics closely matched WHST and visual overlays were concordant. The WHAD-MCF7 phase-contrast set showed that correlation can remain excellent even when late, small-area frames become sensitive to small absolute segmentation differences. This reinforces the need to report correlation as trend evidence, not as a standalone accuracy claim.

Cytomove's main contribution is workflow-oriented. Existing tools already demonstrate that scratch-assay images can be quantified with semi-automated methods **(Gebäck et al., 2009; Suarez-Arnedo et al., 2020; Garcia-Fossa et al., 2020; Pham et al., 2025)**. Cytomove focuses on making that workflow accessible in the browser, keeping assay images local during analysis, requiring visual review, exporting overlays and metadata, and preserving a transparent record of settings.

The results support an area-first interpretation strategy. Wound area is the most stable and broadly comparable metric across scratch-assay tools. Mean width remains useful, especially for longitudinal closure behavior and comparison with WHST, but it should not be treated as universally reliable when masks become fragmented or when the wound approaches complete closure. For this reason, Cytomove exports width variability and valid-row information alongside mean width.

The smartphone-through-eyepiece sets are intentionally retained as stress cases. They represent a common real-world pattern: researchers may acquire images with imperfect illumination, circular field borders, uneven focus, and late time points where the wound becomes visually ambiguous. These images are valuable because they expose the boundaries of automatic segmentation. In product terms, they justify QC warnings, manual correction, and conservative language around automation.

### 4.1 Comparison with existing tools

TScratch established a useful precedent for combining automated wound detection with manual review and correction **(Gebäck et al., 2009)**. WHST provides the closest quantitative comparator because it reports area and width metrics through an ImageJ/Fiji workflow **(Suarez-Arnedo et al., 2020)**. PyScratch demonstrates the value of time-series batch processing and a non-programmer graphical interface **(Garcia-Fossa et al., 2020)**. CSMA highlights a key biological and image-processing challenge: cells inside the wound gap can bias conventional wound-area estimates when not explicitly detected **(Pham et al., 2025)**.

Cytomove does not replace these tools in all use cases. Its differentiating claim is that a useful subset of scratch-assay analysis can be performed locally in the browser with reviewable overlays and exportable metadata. This may reduce installation burden and make early-stage analysis more accessible, while still requiring expert review for difficult images.

### 4.2 Implications for reproducibility

Reproducibility in scratch-assay analysis depends not only on algorithmic accuracy but also on recording the analysis context. Cytomove exports segmentation settings, crop state, rotation, microscope mode, image dimensions, manual correction status, and software version. These fields are intended to make an exported table interpretable months later, and to support future citation-ready methods text.

This is particularly important because visual agreement and numerical agreement can diverge. A high correlation can reflect a shared time-course trend even when late-frame percent differences are substantial. Conversely, a visually acceptable segmentation can produce a large percent difference when the reference wound area is very small. Cytomove therefore treats overlay review and QC labels as part of the measurement, not as optional decoration.

## 5. Limitations

This is a preliminary validation based on a modest number of images. The current master includes 31 paired WHST-Cytomove comparisons across five datasets, but only two datasets have n = 11. Larger validation with more balanced cell types, imaging modalities, replicate structure, and independent ground-truth masks is needed.

WHST was used as the primary comparator rather than a multi-rater manual consensus mask. Therefore, the current results demonstrate agreement with an established ImageJ/Fiji tool, not absolute biological ground truth. Future work should include manual or consensus masks and mask-level metrics such as Dice coefficient or intersection-over-union.

The `whad_mcf7_11` dataset required discrepancy review because older workbook Cytomove columns and raw Cytomove CSV exports represented different Cytomove runs/exports. The manuscript uses the raw `group_metrics.csv` export as the official Cytomove source for that dataset.

Smartphone-through-eyepiece images remain challenging, especially in late time points with fragmented residual wounds. These images are best treated as stress tests and should guide QC and manual correction features rather than be presented as fully solved cases.

Cytomove is also still a prototype. Browser performance, memory use, TIFF support, worker-based processing, and packaged desktop workflows require additional engineering before broad public beta claims.

## 6. Conclusion

Cytomove provides a browser-based, local, reviewable workflow for scratch wound healing assay quantification. Preliminary validation shows WHST-comparable performance in clean comparator images and strong trend agreement in phase-contrast time-course data. Wound area should be reported as the primary metric, while width and near-closure measurements should be interpreted with QC-supported visual review.

## Data and Code Availability

The preliminary validation summary is maintained in `validation_sets/comparator_clean/results/validation_master.xlsx`. The workbook includes dataset-level summary statistics, paired WHST-Cytomove measurements, worst-case rows, discrepancy-resolution notes, and manuscript notes. Representative Cytomove, WHST, and CSMA overlay images are stored under `validation_sets/comparator_clean/results/`.

The Cytomove prototype is maintained as a browser-based local prototype in this project repository. A public repository URL, archived release DOI, and frozen validation artifact package should be added before preprint submission.

## Funding

No external funding statement has been finalized for this preliminary manuscript. This section should be completed before preprint submission.

## Competing Interests

The author declares no competing interests unless this changes before submission.

## Author Contributions

Zekeriya DÜZGÜN conceived the Cytomove workflow, developed and evaluated the prototype, curated validation datasets, performed comparator measurements, interpreted the results, generated figures, and drafted the manuscript.

## Preprint Submission Note

This manuscript is intended as a preliminary methods/software preprint. The preprint claim should remain conservative: Cytomove is a browser-based, local, reviewable, area-first scratch assay quantification workflow with preliminary WHST comparison. It should not claim fully automated universal segmentation or AI-powered generalization.

## Figure Plan

1. **Figure 1: Cytomove workflow.** Upload/import -> preset/segmentation -> overlay review -> optional correction -> final quantification -> export.  
   Source files: `docs/manuscript_figures/figure_1_workflow.svg`, `.pdf`, `.png`.
2. **Figure 2: Representative segmentation overlays.** One clean CSMA image, one WHAD-MCF7 phase-contrast image, one phone-capture stress image.  
   Source files: `docs/manuscript_figures/figure_2_representative_overlays.svg`, `.pdf`, `.png`.
3. **Figure 3: WHST vs Cytomove area agreement.** Scatter plot and Bland-Altman-style percent-difference plot.  
   Source files: `docs/manuscript_figures/figure_3_area_agreement.svg`, `.pdf`, `.png`.
4. **Figure 4: Time-course behavior.** WHAD-MCF7 area and width curves, with near-closure QC zone.  
   Source files: `docs/manuscript_figures/figure_4_whad_timecourse.svg`, `.pdf`, `.png`.
5. **Figure 5: Visual WHST/Cytomove comparison.** Side-by-side comparator and Cytomove overlays for clean, phase-contrast, and phone-capture examples, with per-image error and QC labels.  
   Source files: `docs/manuscript_figures/figure_5_visual_comparison.svg`, `.pdf`, `.png`.
6. **Supplementary Figure 1: Validation summary.** Dataset-level trend correlations and diagnostic percent-difference context.  
   Source files: `docs/manuscript_figures/figure_s1_validation_summary.svg`, `.pdf`, `.png`.
7. **Supplementary Figure 2: CSMA 11-frame visual audit.** Four-row panel showing raw images, CSMA area output, WHST output, and Cytomove overlays for the 11-frame CSMA comparator subset.  
   Source files: `docs/manuscript_figures/figure_s2_csma_11_frame_visual_audit.pdf`, `.png`.

## Figure Captions

**Figure 1. Cytomove workflow for browser-local scratch assay quantification.** The Cytomove workflow starts with local image import, followed by image-type preset selection, semi-automated wound segmentation, visual overlay review, optional local correction, and export of tables, plots, overlays, and analysis metadata. The design goal is not blind automation, but reviewable quantification in which the mask, settings, and output files remain linked.

**Figure 2. Representative Cytomove segmentation overlays across clean, phase-contrast, and stress-case images.** Example Cytomove overlays are shown for a clean CSMA comparator image, a WHAD-MCF7 phase-contrast image, and a smartphone-through-eyepiece stress-case image. These examples illustrate the intended review workflow: the wound contour is visible on the source image so that users can inspect accepted and difficult segmentations before export.

**Figure 3. Agreement between WHST and Cytomove wound area measurements.** (A) Scatter plot comparing WHST wound area and Cytomove wound area across the validation datasets. The dashed line indicates identity. (B) Bland-Altman-style percent-difference plot showing Cytomove minus WHST wound area as a percentage of WHST area. This panel separates trend agreement from diagnostic frame-level differences and highlights the importance of visual review in addition to correlation.

**Figure 4. WHAD-MCF7 time-course behavior and near-closure sensitivity.** WHST and Cytomove area and width measurements are shown across the WHAD-MCF7 phase-contrast 11-frame subset. Cytomove follows the overall time-course trend closely, but late near-closure frames increase relative area error because small absolute segmentation differences represent a larger fraction of the remaining wound.

**Figure 5. Visual comparison of WHST comparator output and Cytomove overlays.** Representative examples show WHST output, Cytomove overlay, and per-image error/QC information for a clean CSMA image, a WHAD-MCF7 phase-contrast image, and a phone-capture brightfield image. This figure connects numerical agreement to the visual evidence that a researcher would inspect during analysis.

**Supplementary Figure 1. Dataset-level validation summary.** Area and width trend correlations are summarized for each validation dataset together with diagnostic percent-difference context. The figure is intended as a high-level overview rather than a substitute for per-image overlay review.

**Supplementary Figure 2. CSMA 11-frame visual audit.** The CSMA comparator subset is shown as an 11-column panel with four rows: raw image, CSMA area output, WHST output, and Cytomove overlay. This layout allows each time point to be inspected vertically while the time-course is read from left to right. The panel is best used as a landscape supplementary figure because the full 11-frame sequence is intentionally retained.

## Table Plan

1. **Table 1: Tool comparison and Cytomove positioning.** WHST, TScratch, PyScratch, CSMA, Cytomove.
2. **Table 2: Validation dataset summary.** Dataset, modality, n, role, comparator source.
3. **Table 3: Quantitative agreement summary.** Area/width trend correlation with diagnostic percent-difference notes.
4. **Supplementary Table 1: Per-image paired measurements.** Export from `validation_master.xlsx`.

## Tables

**Table 1. Tool comparison and Cytomove positioning.**

| Tool | Platform | Primary workflow | Main metrics | Cytomove positioning lesson |
| --- | --- | --- | --- | --- |
| TScratch | MATLAB / standalone GUI | Automated open-area detection with visual review and manual correction | Open/wounded area, open-area ratios, group summaries | Reviewable segmentation and manual correction are essential for trust |
| WHST | ImageJ/Fiji plugin | Local variance, thresholding, hole filling, component selection | Wound area, area fraction, average width, width SD, closure/migration metrics | Closest metric and algorithmic comparator for Cytomove validation |
| PyScratch | Python GUI | Automated time-series scratch analysis | Area over time, normalized area, velocity-related outputs | Batch/time-course usability matters for non-programmer researchers |
| CSMA | Standalone and ImageJ-compatible tool | Edge and morphology workflow with wound-internal cell handling | Area and width at each time point, closure graphs, output images | Internal cell islands and time-course outputs should guide future Cytomove features |
| Cytomove | Browser prototype / desktop alpha | Browser-local import, reviewable segmentation, optional correction, export package | Area, area fraction, mean/median width, width variability, QC labels, metadata | Installation-free, local-first, reviewable, export-oriented workflow |

**Table 2. Validation dataset summary.**

| Dataset | n | Image type | Role in manuscript | Comparator source |
| --- | ---: | --- | --- | --- |
| `csma_sample_11` | 11 | Brightfield / CSMA sample subset | Primary clean comparator subset | WHST and CSMA native output |
| `whad_mcf7_11` | 11 | Phase-contrast WHAD-MCF7 time-course subset | Primary phase-contrast subset | WHST and Cytomove raw group export |
| `cell_phone_HK` | 3 | Smartphone-through-eyepiece brightfield | External support set | WHST |
| `cell_phone_M8F` | 3 | Smartphone-through-eyepiece brightfield | External support/stress set | WHST |
| `cell_phone_MK` | 3 | Smartphone-through-eyepiece brightfield | External stress/limitation set | WHST |

**Table 3. Quantitative agreement summary.**

| Dataset | n | Area trend r | Width trend r | Diagnostic interpretation |
| --- | ---: | ---: | ---: | --- |
| `csma_sample_11` | 11 | 0.9975 | 0.9969 | Primary clean validation set; low diagnostic percent-difference range |
| `whad_mcf7_11` | 11 | 0.9984 | 0.9986 | High trend agreement; near-closure-sensitive late frames |
| `cell_phone_HK` | 3 | 0.9903 | 0.9918 | External support set |
| `cell_phone_M8F` | 3 | 0.9557 | 0.9076 | External support/stress set |
| `cell_phone_MK` | 3 | 0.9880 | 0.9861 | Stress/limitation set; not accuracy evidence |

**Supplementary Table 1. Per-image paired measurements.** This table should be exported from `validation_sets/comparator_clean/results/validation_master.xlsx` after the validation source is frozen. It should include dataset, image ID, WHST area, Cytomove area, area percentage error, WHST width, Cytomove width, width percentage error, QC class, and discrepancy notes.

## Reference Management Note

The Zotero-importable bibliography source is `docs/references/cytomove-preprint.bib`. The manuscript draft currently uses bold author-year in-text citations, for example **(Suarez-Arnedo et al., 2020)**, because this is the requested working style. For final journal submission, import the BibTeX file into Zotero, choose the target journal citation style, and regenerate the reference list from Zotero or a word processor citation plugin.

Suggested Zotero workflow:

1. Import `docs/references/cytomove-preprint.bib` into a dedicated Zotero collection named `Cytomove preprint`.
2. Check author spellings with diacritics, especially Gebäck, Arbeláez, Muñoz-Camargo, and Molnár.
3. Add missing items only after confirming they are cited in the text.
4. Export final references in the target style after choosing bioRxiv/journal formatting.

## References

Garcia-Fossa, F., Gaal, V., & de Jesus, M. B. (2020). PyScratch: An ease of use tool for analysis of scratch assays. *Computer Methods and Programs in Biomedicine*, *193*, 105476. https://doi.org/10.1016/j.cmpb.2020.105476

Gebäck, T., Schulz, M. M. P., Koumoutsakos, P., & Detmar, M. (2009). TScratch: A novel and simple software tool for automated analysis of monolayer wound healing assays. *BioTechniques*, *46*(4), 265-274. https://doi.org/10.2144/000113083

Grada, A., Otero-Vinas, M., Prieto-Castrillo, F., Obagi, Z., & Falanga, V. (2017). Research techniques made simple: Analysis of collective cell migration using the wound healing assay. *Journal of Investigative Dermatology*, *137*(2), e11-e16. https://doi.org/10.1016/j.jid.2016.11.020

Jonkman, J. E. N., Cathcart, J. A., Xu, F., Bartolini, M. E., Amon, J. E., Stevens, K. M., & Colarusso, P. (2014). An introduction to the wound healing assay using live-cell microscopy. *Cell Adhesion & Migration*, *8*(5), 440-451. https://doi.org/10.4161/cam.36224

Liang, C.-C., Park, A. Y., & Guan, J.-L. (2007). In vitro scratch assay: A convenient and inexpensive method for analysis of cell migration in vitro. *Nature Protocols*, *2*(2), 329-333. https://doi.org/10.1038/nprot.2007.30

Pham, T. T., Sagymbayeva, A., Elebessov, T., Onzhanova, Z., & Molnár, F. (2025). CSMA: A standalone and ImageJ-compatible tool for enhanced wound healing assay analysis. *IEEE Access*, *13*, 69341-69352. https://doi.org/10.1109/ACCESS.2025.3561607

Schindelin, J., Arganda-Carreras, I., Frise, E., Kaynig, V., Longair, M., Pietzsch, T., Preibisch, S., Rueden, C., Saalfeld, S., Schmid, B., Tinevez, J.-Y., White, D. J., Hartenstein, V., Eliceiri, K., Tomancak, P., & Cardona, A. (2012). Fiji: An open-source platform for biological-image analysis. *Nature Methods*, *9*(7), 676-682. https://doi.org/10.1038/nmeth.2019

Schneider, C. A., Rasband, W. S., & Eliceiri, K. W. (2012). NIH Image to ImageJ: 25 years of image analysis. *Nature Methods*, *9*(7), 671-675. https://doi.org/10.1038/nmeth.2089

Suarez-Arnedo, A., Torres Figueroa, F., Clavijo, C., Arbeláez, P., Cruz, J. C., & Muñoz-Camargo, C. (2020). An image J plugin for the high throughput image analysis of in vitro scratch wound healing assays. *PLOS ONE*, *15*(7), e0232565. https://doi.org/10.1371/journal.pone.0232565

## Open TODOs

- Decide final target server category and article type.
- Review all generated figure panels for journal-specific sizing and caption fit.
- Review Supplementary Figure 2 at full size; 11-column panels may need landscape supplementary-page layout.
- Re-check whether congress abstract numbers should use the updated WHAD-MCF7 raw CSV values or the older workbook values.
- Add exact software/tool versions for WHST, ImageJ/Fiji, browser, and Cytomove prototype.
- Add methods text for manual correction and QC labels once the site workflow is frozen.
- Export Zotero bibliography from `docs/references/cytomove-preprint.bib` after final reference review.
- Add public code/demo URL and data availability language before bioRxiv upload.
- Decide license for preprint and public repository; recommended default is CC-BY 4.0 for text and a permissive software license for code.
