# Cytomove Manuscript Draft

**Working title:** Cytomove: a browser-local and reviewable workflow for scratch wound healing assay quantification

**Status:** literature-format rebuild, v0.1  
**Last updated:** 2026-05-25  
**Primary data source:** `validation_sets/comparator_clean/results/validation_master.xlsx`  
**Reference source file:** `docs/references/cytomove-preprint.bib`  
**Positioning:** methods/software preprint modeled after the local scratch-assay tool literature

---

## Abstract

Scratch wound healing assays are widely used to study collective cell migration, but image quantification often remains limited by manual measurement, local software installation, parameter bookkeeping, and limited visibility into segmentation decisions. Existing tools such as TScratch, WHST, PyScratch, and CSMA show that scratch-assay analysis is most convincing when automated measurements remain linked to visual review, adjustable parameters, and exportable results.

Here we present Cytomove, a browser-local prototype for reviewable scratch wound healing assay quantification. Cytomove imports local microscopy images, segments wound regions with an explainable image-processing workflow, displays overlays for user review, supports single-image and grouped time-course analysis, and exports tables, plots, overlay images, and analysis metadata. The workflow is designed to reduce installation friction while preserving the reviewability expected from established scratch-assay analysis tools.

Preliminary validation compared Cytomove with ImageJ/Fiji Wound Healing Size Tool (WHST) outputs across five image sets and 31 paired measurements, including two 11-frame comparator sequences. In the CSMA sample subset (n = 11), Cytomove area and width measurements followed WHST closely across the sequence, with area and width trend correlations of r = 0.9975 and r = 0.9969, respectively, and visually concordant overlays. In the WHAD-MCF7 phase-contrast set (n = 11), Cytomove followed the time-course trend with area and width trend correlations of r = 0.9984 and r = 0.9986, while late near-closure frames highlighted the need for quality-control interpretation. External phone-capture images exposed difficult illumination, circular-field, and fragmented-wound cases where visual review and optional manual correction are essential.

Cytomove should therefore be interpreted as a local, reviewable, area-first scratch-assay workflow rather than as a universal fully automatic segmentation system. The preliminary data support continued beta development, larger validation against manual consensus masks, and extension toward reproducible export packages for publication-oriented wound healing analysis.

## Keywords

scratch assay; wound healing assay; cell migration; image analysis; browser-based analysis; Cytomove; ImageJ; WHST

---

## 1. Introduction

The in vitro scratch wound healing assay is a convenient and inexpensive method for studying collective cell migration. A scratch is introduced into a confluent cell monolayer, the gap is imaged over time, and wound closure is quantified from microscopy images. The assay remains common because it is technically accessible, compatible with many adherent cell types, and easy to interpret as a model of coordinated cell movement **(Liang et al., 2007; Jonkman et al., 2014; Grada et al., 2017)**.

The simplicity of the wet-lab procedure contrasts with the difficulty of image analysis. Manual measurements are slow and subjective, especially when experiments include many fields, time points, replicates, or treatment conditions. General image-analysis platforms such as ImageJ and Fiji are powerful and widely adopted **(Schneider et al., 2012; Schindelin et al., 2012)**, but scratch-assay users still need to install plugins or macros, tune parameters, inspect masks, and preserve analysis settings.

Several dedicated tools have shaped the current expectations for scratch-assay software. TScratch introduced an automated wound-detection workflow with visual inspection and optional manual correction, emphasizing that segmentation should remain editable and inspectable **(Gebaeck et al., 2009)**. WHST provided an ImageJ/Fiji plugin that measures wound area, wound area fraction, average wound width, width variability, wound closure, and migration-related outputs using a local-variance and thresholding workflow **(Suarez-Arnedo et al., 2020)**. PyScratch demonstrated a Python graphical interface for batch and time-course analysis, reducing the burden of long image series **(Garcia-Fossa et al., 2020)**. CSMA more recently highlighted wound-internal cell detection and output images as important features for improved interpretation of difficult wound regions **(Pham et al., 2025)**.

These tools make an important point: a new scratch-assay workflow does not need to claim a wholly new biological metric to be useful. The established measurement vocabulary already includes wound area, normalized wound area, width, closure behavior, visual overlays, time-course plots, and spreadsheet exports. The remaining opportunity is workflow-oriented: reduce installation friction, keep images local where possible, make review natural, capture analysis parameters, and produce publication-ready evidence.

Cytomove was developed around this opportunity. It is a browser-local prototype for scratch wound healing analysis that treats the segmentation mask as a review object rather than a hidden intermediate. The aim of this manuscript is to describe Cytomove, compare its outputs with an established ImageJ/Fiji workflow, and define a conservative validation path for beta development.

## 2. Materials and Methods

### 2.1 Software overview

Cytomove is a browser-based scratch wound healing analysis prototype. Users open the web application, load local microscopy images, select or adjust an image-type preset, review the segmentation overlay, optionally apply local corrections, and export results. Image analysis is performed locally in the browser or desktop package; the workflow is designed so that microscopy images do not need to be uploaded to a remote analysis backend.

The current prototype supports single-image analysis and grouped time-course analysis. In single-image mode, one image is displayed in the review canvas with its segmentation overlay and current measurements. In group mode, multiple images can be loaded together, reviewed frame by frame, and exported as group-level tables, plots, and overlay files.

Cytomove exports wound area in pixels, wound area fraction, mean wound width, median wound width, width standard deviation, width coefficient of variation, valid-row fraction, quality-control labels, crop and rotation state, segmentation parameters, manual-correction status, image dimensions, and source metadata when available. These fields are intended to make each exported measurement auditable after analysis.

### 2.2 Segmentation and review workflow

Cytomove uses an explainable image-processing workflow inspired by the variance and threshold logic of ImageJ/Fiji scratch-assay tools. The prototype includes presets for brightfield normal cells, brightfield small cells, phase contrast, and speckled phase-contrast-like images. User-adjustable parameters include variance radius, threshold level or offset, minimum component size, field-of-view cutoff, microscope mode, scratch orientation, fine rotation, crop state, contour style, and manual correction mode.

The segmentation output is intentionally displayed over the source image. Users can inspect whether the wound corridor is captured, whether cells inside the wound region have been treated appropriately, whether circular microscope-field borders are excluded, and whether near-closure regions remain biologically meaningful. Manual correction tools support local fill, scan-based addition, erasing, and speck cleaning. Correction status is stored in the export metadata.

This review-oriented design follows the precedent set by TScratch and WHST, where automated analysis is paired with inspection, parameter adjustment, and output images **(Gebaeck et al., 2009; Suarez-Arnedo et al., 2020)**.

### 2.3 Comparator tools and literature-derived design criteria

The manuscript was structured around four local scratch-assay tool papers: TScratch, WHST, PyScratch, and CSMA. These papers were used to define Cytomove's comparison language and minimum evidence standard.

WHST was selected as the primary quantitative comparator because its output vocabulary aligns with Cytomove: wound area, wound area fraction, average wound width, and width variability **(Suarez-Arnedo et al., 2020)**. TScratch was treated as a design comparator for reviewable segmentation and manual correction **(Gebaeck et al., 2009)**. PyScratch was treated as a usability and time-course comparator because it emphasizes batch processing and non-programmer interaction **(Garcia-Fossa et al., 2020)**. CSMA was treated as an emerging comparator for wound-internal cell handling, time-course outputs, and visual audit panels **(Pham et al., 2025)**.

The resulting design criteria were:

1. Report wound area and area fraction as primary outputs.
2. Retain mean width and width variability as secondary geometry outputs.
3. Display overlays before export.
4. Store parameter and correction metadata.
5. Export spreadsheet-ready results and image evidence.
6. Treat difficult images as quality-control cases rather than hiding them.
7. Avoid claiming universal automatic segmentation before larger validation.

### 2.4 Datasets

The preliminary validation master file contains five image sets. These sets were selected to include clean comparator frames, a phase-contrast time-course subset, and real-world phone-capture stress examples.

| Dataset | n | Imaging / role | Source / provenance | Comparator role |
| --- | ---: | --- | --- | --- |
| `csma_sample_11` | 11 | Representative CSMA sample time-course subset | CSMA GitHub sample data / software outputs **(Pham et al., 2025)** | Primary clean comparator subset |
| `whad_mcf7_11` | 11 | WHAD-MCF7 phase-contrast time-course subset | WHAD/CAMAD Zenodo dataset, CC BY 4.0 **(Sarmad et al., 2024)** | Primary phase-contrast time-course subset |
| `cell_phone_HK` | 3 | Smartphone-through-eyepiece brightfield images | Author-acquired images | External support set |
| `cell_phone_M8F` | 3 | Smartphone-through-eyepiece brightfield images | Author-acquired images | External support/stress set |
| `cell_phone_MK` | 3 | Smartphone-through-eyepiece brightfield images | Author-acquired images | External stress/limitation set |

For `whad_mcf7_11`, the Cytomove values used in the manuscript were taken from the raw Cytomove `group_metrics.csv` export after discrepancy review. Older workbook Cytomove columns were retained only as discrepancy history because they represented a different Cytomove run/export.

### 2.5 Image and data provenance

External images were used only as analysis inputs and comparator examples; they are not presented as newly acquired experimental microscopy by the author. The WHAD-MCF7 phase-contrast frames were derived from the Wound Healing Assay Dataset and Cell Adhesion and Motility Assay Dataset deposited on Zenodo under the Creative Commons Attribution 4.0 International license **(Sarmad et al., 2024)**. The CSMA sample images and CSMA output context were derived from the public CSMA WoundHealing repository and associated CSMA publication **(Pham et al., 2025)**. Cytomove overlays, paired measurements, visual audit layouts, and manuscript figures were generated by the author from these source images and software outputs.

The smartphone-through-eyepiece brightfield sets were author-acquired images and were used as real-world support and stress examples. Figure captions identify whether images come from public datasets, CSMA sample material, or author-acquired phone captures.

### 2.6 Measurement definitions

Wound area was defined as the number of pixels assigned to the wound region inside the analysis field or crop. Wound area fraction was defined as wound area divided by the analysis field area. Mean wound width was calculated from row-wise wound spans after applying the selected scratch orientation. Median width, width standard deviation, width coefficient of variation, and valid-row fraction were exported as secondary descriptors of wound geometry.

Closure metrics were not treated as primary endpoints in this preliminary manuscript because robust closure requires explicit baseline linkage, time metadata, and ideally spatial calibration. Cytomove can export time-course curves and baseline-relative summaries where the group structure is defined, but this draft focuses on per-frame comparison with WHST area and width measurements.

### 2.7 Statistical and visual analysis

Cytomove and WHST outputs were compared using paired measurement tables, scatter plots against the identity line, time-course plots, Pearson trend correlation, and visual overlay review. Pearson correlation was interpreted as a trend statistic rather than a standalone accuracy measure. Frame-level percent-difference plots were retained only as diagnostic visual aids for identifying near-closure and stress-case behavior; they are not used as the central manuscript metric.

Visual review was treated as part of the measurement workflow. Representative images and audit panels were used to inspect whether numerical agreement corresponded to biologically plausible segmentation. This approach mirrors the practical validation style of prior tools, where automated output is interpreted together with manual review, output images, and tool-comparison context **(Gebaeck et al., 2009; Suarez-Arnedo et al., 2020; Garcia-Fossa et al., 2020; Pham et al., 2025)**.

## 3. Results

### 3.1 Cytomove provides a browser-local workflow from image import to export

Cytomove implements an end-to-end scratch-assay analysis workflow (Figure 1). Local images are imported into the browser, processed with the selected preset and parameters, displayed with a segmentation overlay, optionally corrected, and exported as tables, plots, overlays, and metadata. Group mode allows a time-course or treatment set to be reviewed frame by frame before export.

The interface was designed around review rather than blind automation. The source image, wound contour, warnings, parameter values, and export actions remain visible in the analysis flow. This matches a recurring theme in scratch-assay software: automated analysis is most useful when researchers can inspect the segmentation and intervene in difficult cases.

### 3.2 Clean comparator images showed WHST-like area and width behavior

The `csma_sample_11` subset provided the clearest initial support for Cytomove. Across the 11-frame sequence, Cytomove area and width measurements followed WHST closely, with high area and width trend correlation (Table 3). Representative overlays showed that Cytomove captured the main wound corridor while preserving a visible contour over the original image.

To make this comparison inspectable, a four-row visual audit panel was generated for the CSMA subset (Supplementary Figure 1). Each frame is shown as raw image, CSMA area output, WHST output, and Cytomove overlay. This panel follows the logic of the comparator literature: visual evidence should accompany numerical summaries so that readers can inspect where tools agree or diverge.

### 3.3 Phase-contrast time-course analysis highlighted near-closure sensitivity

The `whad_mcf7_11` set tested Cytomove on a phase-contrast time-course. Cytomove followed the WHST area and width trends closely across the sequence. However, late near-closure frames showed that small absolute differences in residual wound segmentation can become visually and numerically important. These frames should be interpreted with QC labels and overlay review rather than reduced to a single pass/fail number.

This behavior is important for practical use. A time-course can show strong trend concordance while still containing individual frames that require review. Cytomove therefore exposes overlay images, valid-row information, width variability, and correction status alongside the exported measurements.

### 3.4 Smartphone-through-eyepiece images exposed stress cases

The smartphone-through-eyepiece images were intentionally retained as external support and stress examples. These images contain challenges that are common in real laboratories: circular microscope fields, uneven illumination, focus variation, and late fragmented wound regions. The `cell_phone_HK` set behaved as a supportive external example. The `cell_phone_M8F` set showed a late-frame underestimation pattern. The `cell_phone_MK` set behaved as a limitation case rather than evidence of solved accuracy.

These results support a conservative product claim. Cytomove should not promise universal fully automatic segmentation across all acquisition conditions. Instead, it should make difficult cases visible, encourage review, and provide manual correction tools when automatic segmentation is insufficient.

### 3.5 Dataset-level summary

| Dataset | n | Area trend r | Width trend r | Interpretation |
| --- | ---: | ---: | ---: | --- |
| `csma_sample_11` | 11 | 0.9975 | 0.9969 | Primary clean comparator set; visually concordant overlays |
| `whad_mcf7_11` | 11 | 0.9984 | 0.9986 | Primary phase-contrast set; near-closure-sensitive late frames |
| `cell_phone_HK` | 3 | 0.9903 | 0.9918 | External support set |
| `cell_phone_M8F` | 3 | 0.9557 | 0.9076 | External support/stress set |
| `cell_phone_MK` | 3 | 0.9880 | 0.9861 | Stress/limitation set; not accuracy evidence |

## 4. Discussion

Cytomove is best understood as a workflow contribution. The established scratch-assay tool literature already defines the major measurement concepts: wound area, normalized area, width, closure behavior, time-course plots, output images, and spreadsheet export. Cytomove brings these expectations into a browser-local and reviewable workflow that reduces installation friction while preserving inspectability.

The preliminary validation supports an area-first interpretation. Wound area is the most stable and broadly comparable metric across TScratch, WHST, PyScratch, CSMA, and Cytomove. Width remains useful, especially for geometry and time-course behavior, but it can become unstable when wounds are fragmented, narrow, or near closure. Cytomove therefore exports width variability and valid-row information rather than treating mean width as a complete description.

The results also show why high correlation should be interpreted carefully. Pearson correlation can indicate that two methods follow the same time-course trend, but it does not prove frame-level measurement equivalence. This is especially relevant in near-closure images where the remaining wound is small and biologically ambiguous. Cytomove addresses this by keeping overlays, QC labels, and manual correction status linked to the measurements.

### 4.1 Comparison with existing tools

TScratch established the importance of combining automated segmentation with visual inspection and manual adjustment **(Gebaeck et al., 2009)**. Cytomove follows this principle through visible overlays, review-before-export behavior, and correction metadata.

WHST provides the closest metric and workflow comparator because it reports wound area, area fraction, average width, and width variability in an ImageJ/Fiji environment **(Suarez-Arnedo et al., 2020)**. Cytomove aligns with this measurement vocabulary while shifting the user experience toward browser-local use and exportable metadata.

PyScratch demonstrates the value of batch and time-course analysis for non-programmer users **(Garcia-Fossa et al., 2020)**. Cytomove adopts this direction through grouped image review, time-course plots, and spreadsheet exports.

CSMA highlights a difficult biological and image-processing problem: cells appearing within the wound region can change the interpretation of area and width **(Pham et al., 2025)**. Cytomove's current prototype does not claim to fully solve this problem. Instead, CSMA defines an important target for future Phase 2 development.

### 4.2 Reproducibility and local-first analysis

Reproducibility in scratch-assay analysis depends on more than the final number. Researchers need to know what image was analyzed, which crop or field was used, what threshold and variance settings were applied, whether rotation or manual correction occurred, and which software version produced the output. Cytomove records these fields in its exported metadata.

The local-first design is also important. Browser-local analysis can reduce the friction of trying the workflow and can support privacy-sensitive or unpublished microscopy data. For larger experiments and slower machines, the desktop package remains important because it can provide more predictable performance and future update control.

## 5. Limitations

This is a preliminary validation with a modest number of paired comparisons. The current evidence is sufficient for a beta-stage methods/software preprint, but not for a universal accuracy claim. Larger validation should include more cell types, imaging modalities, microscopes, replicate structures, and independent ground-truth masks.

WHST was used as the primary comparator rather than a multi-rater manual consensus reference. The current results therefore demonstrate agreement with an established ImageJ/Fiji workflow, not absolute biological ground truth. Future work should include manual or consensus masks and mask-level agreement metrics such as Dice coefficient or intersection-over-union.

Smartphone-through-eyepiece images remain challenging. They are valuable because they reveal acquisition conditions that real users may bring to the tool, but they should be presented as QC and correction examples rather than solved validation cases.

Cytomove is still a prototype. Browser performance, memory use, TIFF support, worker-based processing, packaged desktop updates, subscription-aware distribution, and multi-site validation require additional work before broad public beta claims.

## 6. Conclusion

Cytomove provides a browser-local, reviewable workflow for scratch wound healing assay quantification. In preliminary comparison with WHST, Cytomove followed area and width behavior in clean and phase-contrast image sets while exposing difficult near-closure and phone-capture cases through visual review. The appropriate claim is conservative: Cytomove is an accessible, publication-oriented analysis workflow that can produce WHST-comparable outputs in suitable images and makes uncertainty visible in difficult images.

## Data and Code Availability

The preliminary validation summary is maintained in `validation_sets/comparator_clean/results/validation_master.xlsx`. The workbook includes paired WHST-Cytomove measurements, dataset-level summaries, discrepancy notes, and manuscript notes. Representative Cytomove, WHST, and CSMA overlay images are stored under `validation_sets/comparator_clean/results/`.

External image provenance is as follows. WHAD-MCF7 source images were derived from the WHAD/CAMAD Zenodo dataset, released under CC BY 4.0 **(Sarmad et al., 2024)**. CSMA source images and CSMA output context were derived from the public CSMA WoundHealing GitHub repository and associated CSMA article **(Pham et al., 2025)**. Smartphone-through-eyepiece images were author-acquired. Cytomove overlays and analysis outputs were generated by the author.

The Cytomove prototype is maintained in this project repository. A public repository URL, archived release DOI, and frozen validation artifact package should be added before preprint submission.

## Funding

No external funding statement has been finalized for this preliminary manuscript.

## Competing Interests

The author declares no competing interests unless this changes before submission.

## Author Contributions

Zekeriya Duzgun conceived the Cytomove workflow, developed and evaluated the prototype, curated validation datasets, performed comparator measurements, interpreted the results, generated figures, and drafted the manuscript.

## Figure Plan

1. **Figure 1: Cytomove application workspace.** Annotated screenshot showing local group review, segmentation controls, overlay inspection, QC summaries, and export-ready outputs.
2. **Figure 2: Representative segmentation overlays.** Clean CSMA image, WHAD-MCF7 phase-contrast image, and phone-capture stress image.
3. **Figure 3: WHST vs Cytomove area comparison.** Scatter plot with identity line and diagnostic frame-level percent-difference panel.
4. **Figure 4: Time-course behavior.** WHAD-MCF7 area and width curves with near-closure review zone.
5. **Figure 5: Visual WHST/Cytomove comparison.** Side-by-side comparator output and Cytomove overlay examples.
6. **Supplementary Figure 1: CSMA 11-frame visual audit.** Raw, CSMA, WHST, and Cytomove views for the 11-frame CSMA subset.

## Figure Captions

**Figure 1. Cytomove application workspace for browser-local scratch assay quantification.** The Cytomove interface combines adjustable segmentation controls, an overlay review canvas, group frame review cards, QC summaries, and export-ready outputs in a single workspace. The screenshot illustrates the review-first workflow used before exporting measurements and image evidence.

**Figure 2. Representative Cytomove segmentation overlays.** Example overlays are shown for a clean CSMA sample image, a WHAD/CAMAD phase-contrast time-course image, and an author-acquired phone-capture stress image. Source images were used as analysis inputs; Cytomove overlays were generated by the author. The wound contour remains visible so the user can inspect segmentation quality before export.

**Figure 3. WHST and Cytomove wound area comparison.** Paired WHST and Cytomove wound area values are shown against the identity line. A diagnostic frame-level percent-difference panel highlights frames that need visual review, especially near closure.

**Figure 4. WHAD-MCF7 time-course behavior.** WHST and Cytomove area and width values are plotted across the 11-frame phase-contrast sequence derived from the WHAD/CAMAD Zenodo dataset **(Sarmad et al., 2024)**. Cytomove follows the time-course trend, while late near-closure frames are flagged as review-sensitive.

**Figure 5. Visual comparison of WHST output and Cytomove overlays.** Representative examples connect numerical comparison with visual evidence. Clean CSMA sample material, WHAD/CAMAD phase-contrast images, and author-acquired phone-capture cases illustrate where automatic segmentation is straightforward and where QC review is needed.

**Supplementary Figure 1. CSMA 11-frame visual audit.** The CSMA comparator subset is shown as an 11-column panel with raw image, CSMA area output, WHST output, and Cytomove overlay for each time point. CSMA sample material and CSMA output context were derived from the public CSMA WoundHealing repository and associated CSMA publication **(Pham et al., 2025)**; WHST and Cytomove outputs were generated for this validation workflow.

## Table Plan

1. **Table 1: Literature-derived tool comparison.** TScratch, WHST, PyScratch, CSMA, and Cytomove.
2. **Table 2: Validation dataset summary.** Dataset, imaging role, n, comparator source.
3. **Table 3: Preliminary paired-comparison summary.** Area and width trend correlation with diagnostic interpretation.
4. **Supplementary Table 1: Per-image paired measurements and QC notes.**

## Tables

**Table 1. Literature-derived tool comparison and Cytomove positioning.**

| Tool | Platform | Primary contribution | Cytomove lesson |
| --- | --- | --- | --- |
| TScratch | MATLAB GUI / standalone package | Automated open-area analysis with visual inspection and manual correction | Keep segmentation reviewable and correctable |
| WHST | ImageJ/Fiji plugin | Wound area, area fraction, width, width variability, closure-oriented outputs | Align metric vocabulary and comparator outputs |
| PyScratch | Python GUI | Batch/time-course analysis for non-programmer users | Make grouped analysis and exports easy |
| CSMA | ImageJ-compatible tool | Wound-internal cell handling and visual output images | Treat cell islands and difficult wounds as Phase 2 target |
| Cytomove | Browser / desktop prototype | Local-first reviewable workflow with exportable metadata | Reduce installation friction while preserving auditability |

**Table 2. Preliminary validation datasets.**

| Dataset | n | Imaging / role | Source / provenance | Comparator |
| --- | ---: | --- | --- | --- |
| `csma_sample_11` | 11 | Clean comparator sequence | CSMA GitHub sample data / software outputs | WHST / CSMA visual context |
| `whad_mcf7_11` | 11 | Phase-contrast time-course | WHAD/CAMAD Zenodo dataset, CC BY 4.0 | WHST |
| `cell_phone_HK` | 3 | Phone-capture external support | Author-acquired images | WHST |
| `cell_phone_M8F` | 3 | Phone-capture support/stress | Author-acquired images | WHST |
| `cell_phone_MK` | 3 | Phone-capture stress/limitation | Author-acquired images | WHST |

**Table 3. Preliminary paired-comparison summary.**

| Dataset | n | Area trend r | Width trend r | Interpretation |
| --- | ---: | ---: | ---: | --- |
| `csma_sample_11` | 11 | 0.9975 | 0.9969 | Primary clean comparator set; visually concordant overlays |
| `whad_mcf7_11` | 11 | 0.9984 | 0.9986 | Primary phase-contrast set; near-closure-sensitive late frames |
| `cell_phone_HK` | 3 | 0.9903 | 0.9918 | External support set |
| `cell_phone_M8F` | 3 | 0.9557 | 0.9076 | External support/stress set |
| `cell_phone_MK` | 3 | 0.9880 | 0.9861 | Stress/limitation set; not accuracy evidence |

## References

Garcia-Fossa, Fernanda, Vladimir Gaal, and Marcelo Bispo de Jesus. 2020. "PyScratch: An Ease of Use Tool for Analysis of Scratch Assays." *Computer Methods and Programs in Biomedicine* 193:105476. https://doi.org/10.1016/j.cmpb.2020.105476.

Gebaeck, Tobias, Marcel M. P. Schulz, Petros Koumoutsakos, and Michael Detmar. 2009. "TScratch: A Novel and Simple Software Tool for Automated Analysis of Monolayer Wound Healing Assays." *BioTechniques* 46 (4):265-274. https://doi.org/10.2144/000113083.

Grada, Ayman, Marta Otero-Vinas, Fanny Prieto-Castrillo, Z. Obagi, and Vincent Falanga. 2017. "Research Techniques Made Simple: Analysis of Collective Cell Migration Using the Wound Healing Assay." *Journal of Investigative Dermatology* 137 (2):e11-e16. https://doi.org/10.1016/j.jid.2016.11.020.

Jonkman, James E. N., Jason A. Cathcart, Feng Xu, Mary E. Bartolini, Jennifer E. Amon, Kristopher M. Stevens, and Pina Colarusso. 2014. "An Introduction to the Wound Healing Assay Using Live-Cell Microscopy." *Cell Adhesion & Migration* 8 (5):440-451. https://doi.org/10.4161/cam.36224.

Liang, Chia-Chen, Ann Y. Park, and Jun-Lin Guan. 2007. "In Vitro Scratch Assay: A Convenient and Inexpensive Method for Analysis of Cell Migration in Vitro." *Nature Protocols* 2 (2):329-333. https://doi.org/10.1038/nprot.2007.30.

Pham, Tri Thanh, Amina Sagymbayeva, Timur Elebessov, Zhadyra Onzhanova, and Ferdinand Molnar. 2025. "CSMA: A Standalone and ImageJ-Compatible Tool for Enhanced Wound Healing Assay Analysis." *IEEE Access* 13:69341-69352. https://doi.org/10.1109/ACCESS.2025.3561607.

Sarmad, Muhammad, and contributors. 2024. "Wound Healing Assay Dataset (WHAD) and Cell Adhesion and Motility Assay Dataset (CAMAD)." Zenodo. https://doi.org/10.5281/zenodo.12806149.

Schindelin, Johannes, Ignacio Arganda-Carreras, Erwin Frise, Verena Kaynig, Mark Longair, Tobias Pietzsch, Stephan Preibisch, Curtis Rueden, Stephan Saalfeld, Benjamin Schmid, Jean-Yves Tinevez, Daniel James White, Volker Hartenstein, Kevin Eliceiri, Pavel Tomancak, and Albert Cardona. 2012. "Fiji: An Open-Source Platform for Biological-Image Analysis." *Nature Methods* 9 (7):676-682. https://doi.org/10.1038/nmeth.2019.

Schneider, Caroline A., Wayne S. Rasband, and Kevin W. Eliceiri. 2012. "NIH Image to ImageJ: 25 Years of Image Analysis." *Nature Methods* 9 (7):671-675. https://doi.org/10.1038/nmeth.2089.

Suarez-Arnedo, Alejandra, Felipe Torres Figueroa, Claudia Clavijo, Pablo Arbelaez, Juan C. Cruz, and Camila Munoz-Camargo. 2020. "An ImageJ Plugin for the High Throughput Image Analysis of In Vitro Scratch Wound Healing Assays." *PLOS ONE* 15 (7):e0232565. https://doi.org/10.1371/journal.pone.0232565.
