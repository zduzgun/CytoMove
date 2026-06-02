# Cytomove: a browser-local and reviewable workflow for scratch wound healing assay quantification

**Status:** submission build, v1.0
**Last updated:** 2026-06-01
**Primary data source:** `validation_sets/comparator_clean/results/validation_master.xlsx`
**Reference source file:** `docs/references/cytomove-preprint.bib`
**Positioning:** methods/software preprint modeled after the local scratch-assay tool literature

---

## Author

Zekeriya Düzgün

Department of Medical Biology, Faculty of Medicine, Giresun University, Giresun, Türkiye

Corresponding author: zekeriya.duzgun@giresun.edu.tr

ORCID: 0000-0001-6420-6292

---

## Abstract

The in vitro scratch wound healing assay is one of the most widely used methods for studying collective cell migration, but converting assay images into reproducible measurements remains a practical bottleneck. Quantification is often limited by manual tracing, local software installation, parameter bookkeeping, and limited visibility into how the wound region was segmented. Established tools such as TScratch, the ImageJ/Fiji Wound Healing Size Tool (WHST), PyScratch, and CSMA show that scratch-assay analysis is most convincing when automated measurements remain linked to visual review, adjustable parameters, and exportable results.

This work presents Cytomove, a browser-local prototype for reviewable scratch wound healing assay quantification. Cytomove imports local microscopy images, segments the wound region with an explainable variance-and-threshold image-processing pipeline, displays the segmentation as an overlay for user review, supports single-image and grouped time-course analysis, and exports tables, plots, overlay images, and analysis metadata. The pipeline runs entirely in the browser or in a desktop package, so microscopy images do not need to be uploaded to a remote backend.

Cytomove was evaluated against WHST across five image sets comprising 31 paired measurements, including two 11-frame time-course sequences. In a representative CSMA sample subset (n = 11), Cytomove wound-area measurements agreed closely with WHST, with a mean absolute percentage error (MAPE) of 4.1% (median 3.9%), a near-unity area trend correlation (Pearson r = 0.9975), and visually concordant overlays; width agreement was acceptable (MAPE 9.7%, r = 0.9969). In a phase-contrast WHAD-MCF7 time-course (n = 11), area and width trends tracked WHST closely (r = 0.9984 and r = 0.9986), with a median absolute area error of 6.6%; the dataset-level area MAPE of 15.0% was driven almost entirely by late near-closure frames in which the residual wound spans only a few hundred pixels, so that small absolute differences become large relative errors. External smartphone-through-eyepiece images reproduced common real-world difficulties (circular fields, uneven illumination, and fragmented late wounds) and behaved as quality-control and stress cases rather than solved-accuracy evidence.

Cytomove should therefore be interpreted as a local, reviewable, area-first scratch-assay workflow rather than as a universal fully automatic segmentation system. The preliminary data support continued beta development, larger validation against manual consensus masks, and extension toward reproducible export packages for publication-oriented wound healing analysis.

## Keywords

scratch assay; wound healing assay; cell migration; image analysis; browser-based analysis; segmentation; reproducibility; Cytomove; ImageJ; WHST

---

## 1. Introduction

The in vitro scratch wound healing assay is a convenient and inexpensive method for studying collective cell migration. A scratch or gap is introduced into a confluent monolayer of adherent cells, the gap is imaged over time, and the rate at which cells move into the cell-free region is used as a proxy for migratory behaviour. The assay remains popular because it is technically accessible, requires no specialised reagents, is compatible with a wide range of adherent cell types, and produces an intuitive readout of coordinated cell movement (Liang et al., 2007; Jonkman et al., 2014; Grada et al., 2017). It is used routinely in cancer biology, wound healing, vascular biology, and drug-screening contexts, where wound closure under different treatments is compared across conditions, replicates, and time points.

The simplicity of the wet-lab procedure contrasts sharply with the difficulty of the image analysis. Manual measurement of the wound area or wound width is slow and subjective, and it scales poorly when an experiment contains many fields, time points, replicates, or treatment arms. Operator-dependent thresholding and tracing also introduce variability that is difficult to document and reproduce. General-purpose image-analysis platforms such as ImageJ and Fiji are powerful and widely adopted (Schneider et al., 2012; Schindelin et al., 2012), but scratch-assay users must still install plugins or macros, choose parameters, inspect the resulting masks, and keep a record of the settings that produced each measurement. In practice, the analysis settings are frequently lost, which undermines reproducibility even when the underlying numbers are sound.

Several dedicated tools have shaped current expectations for scratch-assay software, and each contributes a design lesson that a new tool should respect. TScratch introduced an automated wound-detection workflow based on the discrete fast curvelet transform, paired with visual inspection and optional manual correction, and made the point that segmentation should remain editable and inspectable rather than hidden (Gebäck et al., 2009). WHST, the ImageJ/Fiji Wound Healing Size Tool, provided a local-variance and thresholding plugin that reports wound area, wound area fraction, average wound width, width variability, and closure-oriented outputs, establishing a measurement vocabulary that has become a de facto standard for the assay (Suarez-Arnedo et al., 2020). PyScratch demonstrated a Python graphical interface for batch and time-course analysis, reducing the burden of long image series for users who are not programmers (Garcia-Fossa et al., 2020). More recently, CSMA emphasised the detection of cells located inside the wound region and the production of visual output images, and showed that wound-internal cells can bias area and width estimates if they are ignored (Pham et al., 2025).

Taken together, these tools make an important point: a new scratch-assay workflow does not need to invent a wholly new biological metric to be useful. The established measurement vocabulary (wound area, normalised wound area, wound width, width variability, closure behaviour, visual overlays, time-course plots, and spreadsheet exports) already covers most experimental needs. The remaining opportunity is largely workflow-oriented. A tool can add value by reducing installation friction, keeping images on the user's own machine where possible, making segmentation review a natural part of the analysis instead of an afterthought, capturing the analysis parameters automatically, and producing evidence that is ready to drop into a manuscript. These properties matter for reproducibility and for the growing number of researchers who are cautious about uploading unpublished microscopy to remote services.

Cytomove was developed around this opportunity. It is a browser-local prototype for scratch wound healing analysis that treats the segmentation mask as a review object rather than as a hidden intermediate, and that records the parameters, crop, orientation, and correction state behind every exported measurement. The goals of this manuscript are threefold: to describe the Cytomove workflow and its segmentation pipeline; to compare its wound-area and width outputs quantitatively with an established ImageJ/Fiji workflow (WHST) across clean, phase-contrast, and deliberately difficult real-world images; and to define a conservative, honest validation path for continued beta development. The contribution is deliberately framed as a workflow and reproducibility advance supported by preliminary validation, not as a claim of universal automatic segmentation.

## 2. Materials and Methods

### 2.1 Software overview

Cytomove is a browser-based scratch wound healing analysis prototype. The user opens the web application, loads one or more local microscopy images, selects or adjusts an image-type preset, reviews the segmentation overlay, optionally applies local corrections, and exports the results. All image processing is performed locally in the browser using the HTML Canvas API and typed-array operations; no external image-processing backend is required, and assay images are not transmitted to a server. A desktop package built on the same analysis code is also available for heavier local workflows and more predictable performance on large images.

The prototype supports two analysis modes. In single-image mode, one image is displayed in a review canvas together with its segmentation overlay and current measurements, and the user can adjust parameters and corrections for that image. In group mode, multiple images (for example, a time course or a treatment set) are loaded together, reviewed frame by frame through thumbnail cards, and exported as group-level tables, plots, and overlay files. Each image in a group retains its own segmentation settings, so that a single preset is not silently forced onto frames that require different handling.

For every analysed image, Cytomove exports wound area in pixels, wound area fraction, mean wound width, median wound width, width standard deviation, width coefficient of variation, valid-row count and fraction, quality-control labels and warnings, the recommended primary metric, crop and rotation state, the full set of segmentation parameters, manual-correction status, image dimensions, the algorithm version string, and source metadata where available. These fields are designed to make each measurement auditable after the fact, so that a reviewer or collaborator can reconstruct exactly how a number was produced. Exports are provided as CSV and Excel tables, PNG overlay images, grouped overlay ZIP archives, and time-course plot images.

### 2.2 Segmentation pipeline

Cytomove uses an explainable, dependency-free image-processing pipeline inspired by the local-variance and thresholding logic of ImageJ/Fiji scratch-assay tools, in particular WHST (Suarez-Arnedo et al., 2020). The pipeline is implemented in JavaScript using typed arrays, without OpenCV or other heavy WebAssembly dependencies, which keeps load times short and makes each step inspectable. The current algorithm version is recorded in every export as `prototype-whst-variance-v0.4`. The pipeline proceeds through the following stages:

1. **Grayscale conversion.** The RGB image is converted to luminance using the ITU-R BT.709 / sRGB weighting (0.2126R + 0.7152G + 0.0722B).
2. **Field-of-view masking.** An optional field-of-view cutoff masks black corners and circular microscope-field borders so that only the imaged field contributes to the analysis. This is important for eyepiece and brightfield images with dark surrounds.
3. **Contrast enhancement.** Pixel intensities are clipped to the 1st and 99th percentiles and normalised, which stabilises the subsequent variance and threshold steps against outliers and uneven exposure.
4. **Local variance map.** A local variance is computed for every pixel within a user-selected radius. The computation uses an integral image (summed-area table) so that the per-pixel variance is obtained in constant time regardless of radius, making it equivalent in intent to the ImageJ `Variance` filter but fast enough for interactive use in the browser. Confluent cell regions have high local texture variance, whereas the cell-free wound corridor is comparatively smooth.
5. **Thresholding.** The variance map is thresholded to separate the low-variance wound from the high-variance cell sheet. Otsu's method is used by default; when the Otsu threshold collapses toward zero on low-contrast images, a percentile-based fallback is applied and the fallback is recorded in the export. The threshold level or offset is user-adjustable, and the chosen scale depends on the preset.
6. **Island filtering.** Connected components below a user-set minimum size are removed before hole filling, suppressing isolated speckles and debris that would otherwise be mistaken for wound or fragment the mask.
7. **Hole filling.** Holes inside the wound region are filled using a border flood-fill and inversion, equivalent to the ImageJ `Fill Holes` operation, so that small cell clusters inside the gap do not punch holes in the wound mask.
8. **Continuity and component selection.** Connected components are scored by central proximity, axis span, and area, and the wound-like continuous component is retained. Additional steps bridge nearby fragments in the same corridor, extend a stable wound corridor to the image frame where the wound visibly continues out of frame, and, for phase-contrast images, close narrow internal slit artefacts and apply light morphological smoothing.
9. **Width estimation.** For each image row, the horizontal span of the wound is measured after the selected scratch orientation and any fine rotation have been applied. Cytomove reports the mean, median, standard deviation, and coefficient of variation of the row-wise widths, together with the number and fraction of valid rows, instead of collapsing wound geometry into a single mean width.

The prototype ships with image-type presets (brightfield normal cells, brightfield small cells, phase contrast, and a speckled phase-contrast variant) that set sensible defaults for the variance radius, threshold scale, minimum component size, island handling, field-of-view cutoff, and microscope mode. When a group is loaded, Cytomove samples the images and selects an initial preset automatically; manual preset or microscope-mode changes are treated as user overrides and are not repeatedly overwritten.

### 2.3 Review and manual correction

The segmentation output is intentionally displayed as a contour overlay on top of the source image, not as a separate binary mask. This lets the user inspect, before exporting any number, whether the wound corridor was captured correctly, whether cells inside the wound were treated appropriately, whether circular field borders were excluded, and whether near-closure regions remain biologically meaningful. The source image, wound contour, quality-control warnings, current parameter values, and export actions all remain visible in the same workflow.

When automatic segmentation is insufficient, Cytomove provides local manual-correction tools that operate on a dragged rectangular region of interest: a scan-based `Add` mode that runs a local fine threshold and writes back only the largest connected gap component; a direct `Fill` mode that marks a region as wound without thresholding; an `Erase` mode that clears a region; and a `Clean specks` mode that removes small spurious mask components. Corrections persist when the user navigates away from and back to an edited image, and the correction status of each image is stored in the export metadata so that manually adjusted measurements are never silently mixed with fully automatic ones. This review-first design follows the precedent set by TScratch and WHST, in which automated analysis is paired with inspection, parameter adjustment, and output images (Gebäck et al., 2009; Suarez-Arnedo et al., 2020).

### 2.4 Comparator tools and literature-derived design criteria

The validation design was structured around four local scratch-assay tool papers (TScratch, WHST, PyScratch, and CSMA), which were used to define the comparison language and the minimum evidence standard for this work (Table 1). WHST was selected as the primary quantitative comparator because its output vocabulary aligns most closely with Cytomove: wound area, wound area fraction, average wound width, and width variability, all computed in an ImageJ/Fiji environment (Suarez-Arnedo et al., 2020). TScratch was treated as a design comparator for reviewable, correctable segmentation (Gebäck et al., 2009). PyScratch was treated as a usability and time-course comparator because it emphasises batch processing and non-programmer interaction (Garcia-Fossa et al., 2020). CSMA was treated as an emerging comparator for wound-internal cell handling, time-course outputs, and visual audit panels (Pham et al., 2025).

From this literature, seven design criteria were derived for Cytomove: (1) report wound area and area fraction as primary outputs; (2) retain mean width and width variability as secondary geometry outputs; (3) display segmentation overlays before export; (4) store parameter and correction metadata with every measurement; (5) export both spreadsheet-ready results and image evidence; (6) treat difficult images as quality-control cases rather than hiding them; and (7) avoid claiming universal automatic segmentation before larger validation.

### 2.5 Datasets

The preliminary validation comprised five image sets selected to span clean comparator frames, a phase-contrast time course, and deliberately difficult real-world phone captures (Table 2). The first two sets are 11-frame time-course sequences and provide the primary quantitative evidence; the three phone sets contain three frames each (0 h, 24 h, 48 h) and are reported as external support and stress cases.

The `csma_sample_11` set is a representative 11-frame subset drawn from the sample data and software outputs distributed with the CSMA WoundHealing repository and its associated publication (Pham et al., 2025). The `whad_mcf7_11` set is an 11-frame phase-contrast MCF-7 time course derived from the publicly deposited Wound Healing Assay Dataset and Cell Adhesion and Motility Assay Dataset (WHAD/CAMAD), released on Zenodo under the Creative Commons Attribution 4.0 International licence (Iheme et al., 2024). The three `cell_phone` sets (HK, M8F, MK) are smartphone-through-eyepiece brightfield images acquired by the author and used as real-world support and stress examples.

For `whad_mcf7_11`, the Cytomove values used in this manuscript were taken from the raw Cytomove `group_metrics.csv` export after a discrepancy review (Section 2.7); earlier workbook values were retained only as discrepancy history because they originated from a different Cytomove run and export.

### 2.6 Image and data provenance

External images were used only as analysis inputs and comparator examples; they are not presented as newly acquired experimental microscopy by the author. The WHAD-MCF7 phase-contrast frames were derived from the WHAD/CAMAD Zenodo deposit under CC BY 4.0 (Iheme et al., 2024). The CSMA sample images and CSMA output context were derived from the public CSMA WoundHealing repository and the associated CSMA publication (Pham et al., 2025). The smartphone-through-eyepiece brightfield images were acquired by the author. All Cytomove overlays, paired measurements, visual audit layouts, and manuscript figures were generated by the author from these source images and software outputs. Figure captions identify, for every panel, whether the underlying image comes from a public dataset, from CSMA sample material, or from author-acquired phone captures.

### 2.7 Measurement definitions, statistics, and discrepancy handling

Wound area was defined as the number of pixels assigned to the wound region within the analysis field or crop, and wound area fraction as wound area divided by analysis field area. Mean wound width was computed from the row-wise wound spans after applying the selected scratch orientation; median width, width standard deviation, width coefficient of variation, and valid-row fraction were exported as secondary descriptors of wound geometry. Because all measurements are reported in pixels, and because robust closure rate additionally requires explicit baseline linkage, time metadata, and ideally spatial calibration, closure and migration rate were not treated as primary endpoints in this preliminary comparison.

Cytomove and WHST outputs were compared on a per-frame basis. For each dataset, the signed and absolute percentage difference between Cytomove and WHST was computed for both area and width, and summarised as the mean absolute percentage error (MAPE), the median absolute percentage error, the maximum absolute percentage error, and the mean signed error, alongside the Pearson trend correlation. MAPE and median error are reported together deliberately: in time courses that approach closure, the residual wound becomes very small, so a tiny absolute difference can produce a large percentage error in a single frame, inflating the mean while the median remains modest. Pearson correlation is therefore interpreted as a trend statistic rather than a standalone accuracy measure, the median absolute error is used as the more robust central estimate, and the maximum error together with per-frame quality-control labels is used to locate the frames that require review. Frame-level percent-difference plots are retained as diagnostic aids, not as headline metrics.

During analysis, an earlier `whad_mcf7_11` workbook was found to contain Cytomove values from a different run than the raw `group_metrics.csv` export. To avoid mixing runs, the validation master was updated to use the raw CSV as the single official Cytomove source for that set, and the per-frame deltas between the old and new values were recorded in a dedicated discrepancy-resolution table. Visual review was treated as part of the measurement workflow throughout: representative images and audit panels were used to confirm that numerical agreement corresponded to biologically plausible segmentation, mirroring the practical validation style of prior tools (Gebäck et al., 2009; Suarez-Arnedo et al., 2020; Garcia-Fossa et al., 2020; Pham et al., 2025).

## 3. Results

### 3.1 Cytomove provides a browser-local workflow from image import to export

Cytomove implements an end-to-end scratch-assay analysis workflow (Figure 1). Local images are imported into the browser, processed with the selected preset and parameters, displayed with a segmentation overlay, optionally corrected, and exported as tables, plots, overlays, and metadata. Group mode allows a time course or treatment set to be reviewed frame by frame before export, while single-image mode supports focused inspection and correction of individual frames. The interface keeps the source image, wound contour, warnings, parameter values, and export actions visible in a single workspace, so that automated analysis is paired with inspection rather than replacing it.

Representative segmentation overlays across the three imaging contexts (a clean CSMA sample image, a WHAD-MCF7 phase-contrast frame, and an author-acquired phone-capture image) show that the same pipeline produces a visible, inspectable contour over images of very different quality (Figure 2). This visibility is central to the workflow: in straightforward images the contour can be accepted at a glance, while in difficult images it directs the user to the regions that need correction.

### 3.2 Clean comparator images show WHST-comparable area and width

The `csma_sample_11` subset provided the clearest quantitative support for Cytomove. Across the 11-frame sequence, Cytomove wound-area measurements agreed closely with WHST, with a mean absolute area error of 4.1% and a median of 3.9%; the largest single-frame area error was 7.9%, and the mean signed error of −2.7% indicates only a slight, non-systematic tendency to under-measure relative to WHST (Table 3). The area trend correlation was near unity (Pearson r = 0.9975). Width agreement was acceptable, with a mean absolute error of 9.7% (median 8.7%) and r = 0.9969; the larger width error reflects the greater sensitivity of row-wise width to small contour differences, which is precisely why Cytomove reports width variability rather than mean width alone.

To make this comparison inspectable rather than purely numerical, a four-row visual audit panel was generated for the CSMA subset, showing the raw image, the CSMA area output, the WHST output, and the Cytomove overlay for each of the 11 frames (Supplementary Figure S2). The panel confirms that the high numerical agreement corresponds to visually concordant wound corridors, in keeping with the comparator literature's emphasis on pairing numbers with image evidence (Figure 3; Figure 4).

### 3.3 Phase-contrast time-course analysis tracks WHST with near-closure sensitivity

The `whad_mcf7_11` set tested Cytomove on a phase-contrast time course in which the wound progresses to near-complete closure (Figure 5). Cytomove followed the WHST area and width trends very closely, with area and width trend correlations of r = 0.9984 and r = 0.9986, and the median absolute area error was a modest 6.6%. The mean signed area error was small and positive (+2.2%), indicating no strong systematic bias across the sequence.

The dataset-level area MAPE of 15.0%, however, is higher than the median and warrants explanation rather than concealment. Inspection of the per-frame errors shows that the discrepancy is concentrated in the latest, near-closed frames: in the final frame the residual wound measured roughly 1,400 pixels by WHST versus roughly 2,550 pixels by Cytomove, an absolute difference of just over a thousand pixels that nonetheless registers as an ~82% relative error. Because such frames contribute disproportionately to the mean, the MAPE overstates the typical disagreement, which is better captured by the 6.6% median. This pattern is biologically meaningful: when the wound is nearly closed, the few hundred pixels of remaining gap are intrinsically ambiguous, and small differences in where the contour is drawn dominate the percentage. Cytomove flags these frames with quality-control labels (`review_needed`, `area_ok_width_review`) and exposes the overlay, valid-row information, and width variability so that the user can decide how to treat them, instead of collapsing the time course into a single pass/fail number. The practical message is that strong trend concordance and review-sensitive individual frames can coexist, and that a good workflow should surface both.

### 3.4 Smartphone-through-eyepiece images expose realistic stress cases

The three smartphone-through-eyepiece sets were retained as external support and stress examples because they reproduce conditions that are common in real laboratories but absent from curated datasets: circular microscope fields, uneven illumination, focus variation, and fragmented late wounds. The `cell_phone_HK` set behaved as a supportive external example, with a mean absolute area error of 6.7% and area r = 0.9903; its single elevated frame (a 24 h image with a 16% area error) corresponded to a `review_needed` quality-control flag. The `cell_phone_M8F` set showed a late-frame underestimation pattern, with a mean absolute area error of 10.6% and a negative mean signed error (−10.6%) driven by a 48 h frame in which Cytomove under-measured the wound by 25%. The `cell_phone_MK` set behaved as a genuine limitation case: Cytomove over-measured the late fragmented and near-closed regions, producing a mean absolute area error of 38.8% and a width error of 31.0%, and every difficult frame was flagged for review.

These results support a deliberately conservative product claim. Cytomove should not promise universal fully automatic segmentation across all acquisition conditions. Instead, its value in difficult images lies in making the problematic frames visible through overlays and quality-control labels, and in offering manual-correction tools when automatic segmentation is insufficient. The `cell_phone_MK` set in particular is reported as a limitation, not as accuracy evidence.

### 3.5 Dataset-level summary

Across the five sets, area agreement with WHST was strong in the clean and phase-contrast time courses and degraded predictably in the hardest phone captures, while the diagnostic statistics behaved consistently with the near-closure and fragmentation effects described above (Table 3; Supplementary Figure S1; Supplementary Table S1). Area was the more stable and comparable metric throughout; width tracked area but was more sensitive in fragmented and near-closed frames. This supports the area-first, width-as-QC interpretation adopted in this work.

## 4. Discussion

Cytomove is best understood as a workflow and reproducibility contribution, not as a new biological metric. The established scratch-assay tool literature already defines the major measurement concepts (wound area, normalised area, width, closure behaviour, time-course plots, output images, and spreadsheet export), and Cytomove brings these expectations into a browser-local, reviewable workflow that reduces installation friction while preserving inspectability and recording the provenance of each measurement.

The preliminary validation supports an area-first interpretation. Wound area was the most stable and broadly comparable metric across the datasets and is also the metric most directly shared with TScratch, WHST, PyScratch, and CSMA. Width remained useful, particularly for describing wound geometry and time-course behaviour, but it became less stable when wounds were fragmented, narrow, or near closure. Reporting width together with its variability and valid-row fraction, rather than as a single mean, is therefore not a cosmetic choice but a way of communicating when the width estimate should be trusted.

The phase-contrast results illustrate why correlation should be interpreted carefully and why a single summary statistic can mislead in either direction. The very high Pearson correlations (r > 0.99) confirm that Cytomove and WHST follow the same closure trajectory, but correlation alone does not establish frame-level measurement equivalence, especially near closure where the residual wound is small. Conversely, the dataset-level MAPE can overstate disagreement when a few near-closed frames with tiny absolute wounds dominate the mean. Reporting the median absolute error, the maximum error, and per-frame quality-control labels alongside correlation gives a more faithful picture than any one number, and keeping the overlay linked to every measurement lets the user act on it.

### 4.1 Comparison with existing tools

TScratch established the importance of combining automated segmentation with visual inspection and manual adjustment (Gebäck et al., 2009); Cytomove follows this principle through visible overlays, review-before-export behaviour, and correction metadata. WHST provides the closest metric and workflow comparator because it reports wound area, area fraction, average width, and width variability in an ImageJ/Fiji environment (Suarez-Arnedo et al., 2020); Cytomove aligns with this vocabulary while shifting the user experience toward browser-local use and exportable metadata, and the present validation quantifies how closely the two agree. PyScratch demonstrated the value of batch and time-course analysis for non-programmer users (Garcia-Fossa et al., 2020); Cytomove adopts this direction through grouped image review, time-course plots, and spreadsheet exports. CSMA highlighted that cells appearing within the wound region can change the interpretation of area and width (Pham et al., 2025); Cytomove's current prototype does not claim to solve this problem, and the wound-internal cell case is identified as a priority target for the next development phase.

### 4.2 Reproducibility and local-first analysis

Reproducibility in scratch-assay analysis depends on more than the final number. To reproduce a measurement, a researcher needs to know which image was analysed, which crop or field was used, what threshold and variance settings were applied, whether rotation or manual correction occurred, and which software version produced the output. Cytomove records these fields in its exported metadata, which directly addresses the common loss of analysis settings in macro- and plugin-based workflows. The local-first design is equally important: browser-local analysis lowers the barrier to trying the workflow and supports privacy-sensitive or unpublished microscopy that researchers may be unwilling to upload to a remote service, while the desktop package provides more predictable performance for large experiments.

## 5. Limitations

This is a preliminary validation with a modest number of paired comparisons (31 across five sets). The evidence is sufficient for a beta-stage methods/software preprint but not for a universal accuracy claim. Larger validation should include more cell types, imaging modalities, microscopes, replicate structures, and independent ground-truth masks.

WHST was used as the primary comparator rather than a multi-rater manual consensus reference. The present results therefore demonstrate agreement with an established ImageJ/Fiji workflow, not absolute biological ground truth. Future work should incorporate manual or consensus masks and mask-level agreement metrics such as the Dice coefficient or intersection-over-union, which measure spatial overlap directly rather than agreement of summary numbers.

The smartphone-through-eyepiece images remain challenging and are presented as quality-control and correction examples rather than as solved validation cases; the `cell_phone_MK` set in particular is a limitation rather than evidence. All measurements are reported in pixels, so closure rate and migration rate in physical units await spatial calibration and consistent time metadata. Finally, Cytomove is still a prototype: browser performance, memory use, native TIFF support, worker-based processing, packaged desktop updates, and multi-site validation require additional work before broad public-beta claims are appropriate.

## 6. Conclusion

Cytomove provides a browser-local, reviewable workflow for scratch wound healing assay quantification. In preliminary comparison with WHST, Cytomove reproduced wound-area behaviour closely in clean and phase-contrast time courses (with a 4.1% mean area error and near-unity correlation in the clean comparator set and a 6.6% median area error in the phase-contrast set), while making near-closure and phone-capture difficulties visible through overlays and quality-control labels rather than hiding them. The appropriate claim is therefore conservative: Cytomove is an accessible, publication-oriented analysis workflow that can produce WHST-comparable outputs in suitable images and that makes measurement uncertainty visible in difficult ones. The data support continued beta development, larger validation against manual consensus masks, and the release of reproducible export packages for wound healing analysis.

## Data and Code Availability

The preliminary validation summary is maintained in `validation_sets/comparator_clean/results/validation_master.xlsx`, which contains the paired WHST–Cytomove measurements, dataset-level diagnostic statistics, the discrepancy-resolution table, and manuscript notes; representative Cytomove, WHST, and CSMA overlay images are stored alongside it. A frozen validation artifact package is available on Zenodo at https://doi.org/10.5281/zenodo.20486820. The Cytomove prototype is maintained at https://github.com/zduzgun/CytoMove, and a live web version is available at https://cytomove.com. A versioned software archive DOI may be added separately if a GitHub release is archived.

External image provenance is as follows: WHAD-MCF7 source images were derived from the WHAD/CAMAD Zenodo dataset under CC BY 4.0 (Iheme et al., 2024); CSMA source images and output context were derived from the public CSMA WoundHealing GitHub repository and associated article (Pham et al., 2025); smartphone-through-eyepiece images were author-acquired. All Cytomove overlays and analysis outputs were generated by the author.

## Funding

This research received no specific grant from any funding agency in the public, commercial, or not-for-profit sectors.

## Competing Interests

The author is the developer of Cytomove. No other competing interests are declared.

## Author Contributions

Zekeriya Düzgün conceived the Cytomove workflow, developed and evaluated the prototype, curated the validation datasets, performed the comparator measurements, interpreted the results, generated the figures, and wrote the manuscript.

---

## Figures

**Figure 1. Cytomove application workspace for browser-local scratch assay quantification.** The interface combines adjustable segmentation controls, an overlay review canvas, group frame-review cards, quality-control summaries, and export-ready outputs in a single workspace, illustrating the review-first workflow used before any measurement is exported.

**Figure 2. Representative Cytomove segmentation overlays.** Overlays are shown for a clean CSMA sample image, a WHAD-MCF7 phase-contrast time-course image, and an author-acquired phone-capture stress image. Source images were used as analysis inputs; Cytomove overlays were generated by the author. The wound contour remains visible so that segmentation quality can be inspected before export.

**Figure 3. WHST versus Cytomove wound-area comparison.** Paired WHST and Cytomove wound-area values are plotted against the identity line. A diagnostic frame-level percent-difference panel highlights the frames that require visual review, particularly near closure.

**Figure 4. Visual comparison of WHST output and Cytomove overlays.** Representative examples connect numerical comparison with visual evidence across clean CSMA material, WHAD-MCF7 phase-contrast images, and author-acquired phone-capture cases, illustrating where automatic segmentation is straightforward and where quality-control review is needed.

**Figure 5. WHAD-MCF7 time-course behaviour.** WHST and Cytomove area and width values are plotted across the 11-frame WHAD-MCF7 phase-contrast sequence from the WHAD/CAMAD Zenodo dataset (Iheme et al., 2024). Cytomove follows the time-course trend, while late near-closure frames are flagged as review-sensitive.

**Supplementary Figure S1. Dataset-level validation summary.** Diagnostic summary of area and width agreement statistics across the five validation sets.

**Supplementary Figure S2. CSMA 11-frame visual audit.** An 11-column panel showing the raw image, CSMA area output, WHST output, and Cytomove overlay for each time point of the CSMA comparator subset. CSMA sample material and output context were derived from the public CSMA WoundHealing repository and associated publication (Pham et al., 2025); WHST and Cytomove outputs were generated for this validation workflow.

---

## Tables

**Table 1. Literature-derived tool comparison and Cytomove positioning.**

| Tool | Platform | Primary contribution | Lesson adopted by Cytomove |
| --- | --- | --- | --- |
| TScratch | MATLAB GUI / standalone | Automated open-area analysis with visual inspection and manual correction | Keep segmentation reviewable and correctable |
| WHST | ImageJ/Fiji plugin | Wound area, area fraction, width, width variability, closure outputs | Align metric vocabulary and serve as primary comparator |
| PyScratch | Python GUI | Batch and time-course analysis for non-programmer users | Make grouped analysis and exports easy |
| CSMA | ImageJ-compatible tool | Wound-internal cell handling and visual output images | Treat cell islands and difficult wounds as a Phase 2 target |
| Cytomove | Browser / desktop prototype | Local-first reviewable workflow with exportable metadata | Reduce installation friction while preserving auditability |

**Table 2. Preliminary validation datasets.**

| Dataset | n | Imaging / role | Source / provenance | Comparator |
| --- | ---: | --- | --- | --- |
| csma_sample_11 | 11 | Clean comparator time course | CSMA repository sample data / outputs (Pham et al., 2025) | WHST (with CSMA visual context) |
| whad_mcf7_11 | 11 | Phase-contrast time course | WHAD/CAMAD Zenodo dataset, CC BY 4.0 (Iheme et al., 2024) | WHST |
| cell_phone_HK | 3 | Phone-capture external support | Author-acquired | WHST |
| cell_phone_M8F | 3 | Phone-capture support / stress | Author-acquired | WHST |
| cell_phone_MK | 3 | Phone-capture stress / limitation | Author-acquired | WHST |

**Table 3. Preliminary Cytomove-versus-WHST agreement summary.** Area and width are reported as mean absolute percentage error (MAPE), median absolute percentage error, maximum absolute percentage error, and Pearson trend correlation (r). Median and MAPE are reported together because near-closure frames with very small residual wounds inflate the mean relative to the median.

| Dataset | n | Area MAPE % | Area median % | Area max % | Area r | Width MAPE % | Width r | Interpretation |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| csma_sample_11 | 11 | 4.1 | 3.9 | 7.9 | 0.9975 | 9.7 | 0.9969 | Primary clean comparator; visually concordant overlays |
| whad_mcf7_11 | 11 | 15.0 | 6.6 | 82.5 | 0.9984 | 9.0 | 0.9986 | Phase-contrast; MAPE driven by late near-closure frames |
| cell_phone_HK | 3 | 6.7 | 3.2 | 16.3 | 0.9903 | 8.5 | 0.9918 | External support set |
| cell_phone_M8F | 3 | 10.6 | 5.1 | 24.9 | 0.9557 | 8.7 | 0.9076 | Support / stress; late-frame underestimation |
| cell_phone_MK | 3 | 38.8 | 43.4 | 72.3 | 0.9880 | 31.0 | 0.9861 | Stress / limitation case; not accuracy evidence |

**Supplementary Table S1.** Per-image paired Cytomove and WHST measurements with signed and absolute percentage errors, quality-control labels, and manual-correction status (provided as `validation_master.xlsx`, sheet `paired_measurements`).

---

## References

Garcia-Fossa, Fernanda, Vladimir Gaal, and Marcelo Bispo de Jesus. 2020. "PyScratch: An Ease of Use Tool for Analysis of Scratch Assays." *Computer Methods and Programs in Biomedicine* 193:105476. https://doi.org/10.1016/j.cmpb.2020.105476.

Gebäck, Tobias, Martin Michael Peter Schulz, Petros Koumoutsakos, and Michael Detmar. 2009. "TScratch: A Novel and Simple Software Tool for Automated Analysis of Monolayer Wound Healing Assays." *BioTechniques* 46 (4):265–274. https://doi.org/10.2144/000113083.

Grada, Ayman, Marta Otero-Vinas, Fanny Prieto-Castrillo, Zaidal Obagi, and Vincent Falanga. 2017. "Research Techniques Made Simple: Analysis of Collective Cell Migration Using the Wound Healing Assay." *Journal of Investigative Dermatology* 137 (2):e11–e16. https://doi.org/10.1016/j.jid.2016.11.020.

Iheme, Leonardo Obinna, Sevgi Onal, Yusuf Sait Erdem, Mahmut Ucar, Ozden Yalcin-Ozuysal, Devrim Pesen-Okvur, Behçet U. Töreyin, and Devrim Ünay. 2024. "Wound Healing Assay Dataset (WHAD) and Cell Adhesion and Motility Assay Dataset (CAMAD)" (Version 1.0.0-alpha) [Data set]. Zenodo, CC BY 4.0. https://doi.org/10.5281/zenodo.12806149.

Jonkman, James E. N., Jason A. Cathcart, Feng Xu, Mary E. Bartolini, Jennifer E. Amon, Kristopher M. Stevens, and Pina Colarusso. 2014. "An Introduction to the Wound Healing Assay Using Live-Cell Microscopy." *Cell Adhesion & Migration* 8 (5):440–451. https://doi.org/10.4161/cam.36224.

Liang, Chia-Chen, Ann Y. Park, and Jun-Lin Guan. 2007. "In Vitro Scratch Assay: A Convenient and Inexpensive Method for Analysis of Cell Migration in Vitro." *Nature Protocols* 2 (2):329–333. https://doi.org/10.1038/nprot.2007.30.

Pham, Tri Thanh, Amina Sagymbayeva, Timur Elebessov, Zhadyra Onzhanova, and Ferdinand Molnár. 2025. "CSMA: A Standalone and ImageJ-Compatible Tool for Enhanced Wound Healing Assay Analysis." *IEEE Access* 13:69341–69352. https://doi.org/10.1109/ACCESS.2025.3561607.

Schindelin, Johannes, Ignacio Arganda-Carreras, Erwin Frise, Verena Kaynig, Mark Longair, Tobias Pietzsch, Stephan Preibisch, Curtis Rueden, Stephan Saalfeld, Benjamin Schmid, Jean-Yves Tinevez, Daniel James White, Volker Hartenstein, Kevin Eliceiri, Pavel Tomancak, and Albert Cardona. 2012. "Fiji: An Open-Source Platform for Biological-Image Analysis." *Nature Methods* 9 (7):676–682. https://doi.org/10.1038/nmeth.2019.

Schneider, Caroline A., Wayne S. Rasband, and Kevin W. Eliceiri. 2012. "NIH Image to ImageJ: 25 Years of Image Analysis." *Nature Methods* 9 (7):671–675. https://doi.org/10.1038/nmeth.2089.

Suarez-Arnedo, Alejandra, Felipe Torres Figueroa, Claudia Clavijo, Pablo Arbeláez, Juan C. Cruz, and Carolina Muñoz-Camargo. 2020. "An ImageJ Plugin for the High Throughput Image Analysis of In Vitro Scratch Wound Healing Assays." *PLOS ONE* 15 (7):e0232565. https://doi.org/10.1371/journal.pone.0232565.

