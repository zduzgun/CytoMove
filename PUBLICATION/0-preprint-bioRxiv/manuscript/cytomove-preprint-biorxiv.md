# Cytomove: a browser-local and reviewable workflow for scratch wound healing assay quantification

**Article type:** Preprint / methods and software research article

**Author:** Zekeriya Düzgün

Department of Medical Biology, Faculty of Medicine, Giresun University, Giresun, Türkiye

Corresponding author: zekeriya.duzgun@giresun.edu.tr

ORCID: 0000-0001-6420-6292

---

## Abstract

The in vitro scratch wound healing assay is one of the most widely used methods for studying collective cell migration, but converting assay images into reproducible measurements remains a practical bottleneck of manual tracing, local software installation, parameter bookkeeping, and limited visibility into how the wound region was segmented. We present Cytomove, a browser-local software tool for reviewable scratch wound healing assay quantification. Cytomove imports local microscopy images, segments the wound region with an explainable variance-and-threshold image-processing pipeline implemented entirely in client-side JavaScript, displays the segmentation as an overlay for user review, supports single-image and grouped time-course analysis, and exports tables, plots, overlay images, and full analysis metadata. Because all processing runs in the browser or in a desktop package built on the same code, microscopy images never leave the user's machine. In a preliminary comparison with the established ImageJ/Fiji Wound Healing Size Tool (WHST) across five image sets and 31 paired measurements, Cytomove reproduced wound-area behaviour closely in clean (mean absolute percentage error 4.1%, Pearson r = 0.9975) and phase-contrast time-course images (median area error 6.6%, r = 0.9984), while surfacing near-closure and real-world difficulties through overlays and quality-control labels. Cytomove lowers installation friction, keeps data local, and links every exported number to the segmentation image and parameters that produced it.

## Keywords

scratch assay; wound healing assay; cell migration; image analysis; browser-based analysis; segmentation; reproducibility

---

## Software and code metadata

### Code metadata for the current preprint version

| Nr. | Code metadata description | Value |
| --- | --- | --- |
| C1 | Current code version | v1.0.0 |
| C2 | Permanent link to code/repository used for this code version | https://github.com/zduzgun/CytoMove (public project repository; source-code licensing/public-release confirmation pending institutional IP review) |
| C3 | Permanent link to Reproducible Capsule | — (not applicable) |
| C4 | Legal Code License | Pending institutional IP confirmation; intended source-available non-commercial academic/research licence with separate commercial licensing |
| C5 | Code versioning system used | git |
| C6 | Software code languages, tools, and services used | JavaScript (ES2020+), HTML5 Canvas API, typed arrays; Electron (desktop package) |
| C7 | Compilation requirements, operating environments and dependencies | Runs in any modern Chromium- or Firefox-based browser with no installation; desktop build requires Node.js ≥ 18 and Electron |
| C8 | If available, link to developer documentation/manual | https://github.com/zduzgun/CytoMove (README and `/docs`) |
| C9 | Support email for questions | zekeriya.duzgun@giresun.edu.tr |

A live web version is available at https://cytomove.com. Public release and licensing of the core source code are pending institutional IP/TTO confirmation; this preprint does not rely on a completed source-code relicensing step. The intended model is source-available non-commercial academic/research use, with commercial use requiring a separate written licence.

---

## 1. Motivation and significance

The in vitro scratch wound healing assay is a convenient and inexpensive method for studying collective cell migration. A scratch or gap is introduced into a confluent monolayer of adherent cells, the gap is imaged over time, and the rate at which cells move into the cell-free region is used as a proxy for migratory behaviour. The assay remains popular because it is technically accessible, requires no specialised reagents, is compatible with a wide range of adherent cell types, and produces an intuitive readout of coordinated cell movement (Liang et al., 2007; Jonkman et al., 2014; Grada et al., 2017), a process central to morphogenesis, tissue repair, and cancer invasion (Friedl and Gilmour, 2009). It is used routinely in cancer biology, wound healing, vascular biology, and drug-screening contexts.

The simplicity of the wet-lab procedure contrasts sharply with the difficulty of the image analysis. Manual measurement of wound area or width is slow and subjective, and it scales poorly when an experiment contains many fields, time points, replicates, or treatment arms. General-purpose platforms such as ImageJ and Fiji (Schneider et al., 2012; Schindelin et al., 2012), and dedicated bioimage-analysis environments such as CellProfiler (Carpenter et al., 2006; Stirling et al., 2021) and ilastik (Berg et al., 2019), are powerful and widely adopted, but scratch-assay users must still install plugins or macros, choose parameters, inspect the resulting masks, and keep a record of the settings that produced each measurement. In practice, these settings are frequently lost, which undermines reproducibility even when the underlying numbers are sound.

Several dedicated tools have shaped current expectations for scratch-assay software, and each contributes a design lesson. TScratch introduced an automated wound-detection workflow paired with visual inspection and optional manual correction, making the point that segmentation should remain editable and inspectable rather than hidden (Gebäck et al., 2009). The ImageJ/Fiji Wound Healing Size Tool (WHST) provided a local-variance and thresholding plugin that reports wound area, area fraction, average width, and width variability, establishing a measurement vocabulary that has become a de facto standard (Suarez-Arnedo et al., 2020). PyScratch demonstrated a Python graphical interface for batch and time-course analysis for non-programmer users (Garcia-Fossa et al., 2020). More recently, CSMA emphasised the detection of cells located inside the wound region and the production of visual output images (Pham et al., 2025). Other automated approaches have likewise combined texture-based segmentation with kinematic readouts, including high-throughput bright-field assays (Zordan et al., 2011) and objective continuous-kinematics curve fitting (Topman et al., 2012).

These tools also leave practical, workflow-oriented gaps: they require local software environments, depend on manual parameter tracking, and are less naturally connected to browser-based sharing, review, and export. The remaining opportunity is therefore not a new biological metric but lower installation friction, clearer provenance, easier group review, explicit linkage between the exported number and the segmentation that produced it, and the ability to keep unpublished microscopy on the researcher's own machine. Cytomove was developed around this opportunity. It is a browser-local software tool that treats the segmentation mask as a review object rather than a hidden intermediate, and records the parameters, crop, orientation, and correction state behind every exported measurement.

## 2. Software description

Cytomove is a browser-based scratch wound healing analysis tool. The user opens the web application, loads one or more local microscopy images, selects or adjusts an image-type preset, reviews the segmentation overlay, optionally applies local corrections, and exports the results. All image processing is performed locally in the browser using the HTML Canvas API and typed-array operations; no external image-processing backend is required, and assay images are not transmitted to a server. A desktop package built on the same analysis code is also available for heavier local workflows and more predictable performance on large images.

### 2.1 Software architecture

The Cytomove segmentation engine is an explainable, dependency-free image-processing pipeline implemented independently in JavaScript using typed arrays, without ImageJ/Fiji, WHST, OpenCV, or other external image-processing backends. WHST is used in this manuscript only as a quantitative comparator because it reports a closely related measurement vocabulary; the WHST plugin or code is not invoked by Cytomove. The pipeline proceeds through the following stages:

1. **Grayscale conversion.** The RGB image is converted to luminance using the ITU-R BT.709 / sRGB weighting (0.2126R + 0.7152G + 0.0722B).
2. **Field-of-view masking.** An optional field-of-view cutoff masks black corners and circular microscope-field borders so that only the imaged field contributes to the analysis.
3. **Contrast enhancement.** Pixel intensities are clipped to the 1st and 99th percentiles and normalised, stabilising the subsequent variance and threshold steps against outliers and uneven exposure.
4. **Local variance map.** A local variance is computed for every pixel within a user-selected radius using an integral image (summed-area table) (Crow, 1984; Viola and Jones, 2001), so that per-pixel variance is obtained in constant time regardless of radius. Confluent cell regions have high local texture variance, whereas the cell-free wound corridor is comparatively smooth.
5. **Thresholding.** The variance map is thresholded to separate the low-variance wound from the high-variance cell sheet. Otsu's method (Otsu, 1979) is used by default; when the Otsu threshold collapses toward zero on low-contrast images, a percentile-based fallback is applied and recorded in the export.
6. **Island filtering.** Connected components below a user-set minimum size are removed before hole filling, suppressing isolated speckles and debris.
7. **Hole filling.** Holes inside the wound region are filled using a border flood-fill and inversion procedure, a standard binary morphology operation (Soille, 2003), so that small cell clusters inside the gap do not punch holes in the wound mask.
8. **Continuity and component selection.** Connected components are scored by central proximity, axis span, and area, and the wound-like continuous component is retained; additional steps bridge nearby fragments, extend a stable corridor to the image frame where the wound continues out of frame, and, for phase-contrast images, close narrow internal slit artefacts.
9. **Width estimation.** For each image row, the horizontal span of the wound is measured after the selected scratch orientation and any fine rotation have been applied. Cytomove reports the mean, median, standard deviation, and coefficient of variation of the row-wise widths, together with the number and fraction of valid rows.

The tool ships with image-type presets (brightfield normal cells, brightfield small cells, phase contrast, and a speckled phase-contrast variant) that set sensible defaults for variance radius, threshold scale, minimum component size, island handling, field-of-view cutoff, and microscope mode. When a group is loaded, Cytomove samples the images and selects an initial preset automatically; manual preset or microscope-mode changes are treated as user overrides.

### 2.2 Software functionalities

The tool supports two analysis modes. In single-image mode, one image is displayed in a review canvas with its segmentation overlay and current measurements, and the user can adjust parameters and corrections. In group mode, multiple images (for example a time course or treatment set) are loaded together, reviewed frame by frame through thumbnail cards, and exported as group-level tables, plots, and overlay files; each image retains its own segmentation settings.

The segmentation output is displayed as a contour overlay on top of the source image rather than as a separate binary mask, letting the user inspect — before exporting any number — whether the wound corridor was captured correctly, whether cells inside the wound were treated appropriately, whether circular field borders were excluded, and whether near-closure regions remain biologically meaningful. When automatic segmentation is insufficient, Cytomove provides local manual-correction tools that operate on a dragged rectangular region of interest: a scan-based `Add` mode that runs a local fine threshold and writes back the largest connected gap component; a direct `Fill` mode; an `Erase` mode; and a `Clean specks` mode. Corrections persist across navigation, and the correction status of each image is stored in the export metadata so that manually adjusted measurements are never silently mixed with fully automatic ones.

For every analysed image, Cytomove exports wound area in pixels, wound area fraction, mean and median wound width, width standard deviation and coefficient of variation, valid-row count and fraction, quality-control labels and warnings, the recommended primary metric, crop and rotation state, the full set of segmentation parameters, manual-correction status, image dimensions, the algorithm version string, and source metadata where available. These fields make each measurement auditable after the fact. Exports are provided as CSV and Excel tables, PNG overlay images, grouped overlay ZIP archives, and time-course plot images. Figure 1 shows the application workspace, and Figure 2 shows representative overlays across three imaging contexts.

## 3. Illustrative examples

Cytomove was evaluated against WHST across five image sets comprising 31 paired measurements, including two 11-frame time-course sequences (Table 2). WHST was selected as the primary quantitative benchmark because its ImageJ/Fiji output vocabulary overlaps with Cytomove's exported endpoints. For each dataset, the signed and absolute percentage difference between Cytomove and WHST was computed for area and width, and summarised as the mean absolute percentage error (MAPE), the median absolute percentage error, the maximum absolute percentage error, the mean signed error, and the Pearson trend correlation (Table 3). MAPE and median error are reported together because, in time courses that approach closure, the residual wound becomes very small and a tiny absolute difference can produce a large percentage error in a single frame.

**Clean comparator images.** The `csma_sample_11` subset, an 11-frame sequence drawn from the CSMA WoundHealing sample data (Pham et al., 2025), provided the clearest support: Cytomove wound-area measurements agreed closely with WHST (area MAPE 4.1%, median 3.9%, maximum 7.9%, mean signed error −2.7%, Pearson r = 0.9975); width agreement was acceptable (MAPE 9.7%, r = 0.9969). A three-method comparison was possible because native CSMA, WHST, and Cytomove area outputs were available for the matched frames (Figure 5). All three followed the same decreasing wound-area trajectory (CSMA–WHST r = 0.9970; CSMA–Cytomove r = 0.9951), while native CSMA retained larger residual areas in later frames, presented as method-context evidence rather than a failure case.

**Phase-contrast time course.** The `whad_mcf7_11` set, an 11-frame phase-contrast MCF-7 sequence from the publicly deposited WHAD/CAMAD dataset under CC BY 4.0 (Iheme et al., 2024), tested Cytomove on a wound that progresses to near-complete closure (Figure 6). Cytomove followed the WHST area and width trends closely (r = 0.9984 and r = 0.9986) with a modest median absolute area error of 6.6% and a small positive mean signed error (+2.2%). The dataset-level area MAPE of 15.0% was concentrated in the latest near-closed frames: in the final frame the residual wound measured roughly 1,400 pixels by WHST versus roughly 2,550 pixels by Cytomove, an absolute difference of just over a thousand pixels that nonetheless registers as an ~82% relative error. Cytomove flags such frames with quality-control labels (`review_needed`, `area_ok_width_review`) and exposes the overlay, valid-row information, and width variability.

**Real-world stress cases.** Three smartphone-through-eyepiece brightfield sets acquired by the author (HK, M8F, MK; three frames each) reproduce conditions common in real laboratories but absent from curated datasets: circular fields, uneven illumination, focus variation, and fragmented late wounds. The `cell_phone_HK` set behaved as a supportive external example (area MAPE 6.7%, r = 0.9903); `cell_phone_M8F` showed a late-frame underestimation pattern (area MAPE 10.6%, mean signed error −10.6%); and `cell_phone_MK` behaved as a genuine limitation case in which Cytomove over-measured fragmented near-closed regions (area MAPE 38.8%, width MAPE 31.0%), with every difficult frame flagged for review. These sets are reported as quality-control and stress examples rather than solved-accuracy evidence.

A pooled Bland–Altman comparison (Bland and Altman, 1986) on the absolute area scale (Figure 3B) showed a median Cytomove-minus-WHST difference of essentially zero (−0.002 Mpx), with 2.5–97.5th percentile limits of agreement of −0.134 to +0.169 Mpx; an absolute, non-parametric summary is used because a percentage difference is unstable for near-closure frames and because the pooled points include time-course frames that are not mutually independent. Across all sets, area was the more stable and comparable metric; width tracked area but was more sensitive in fragmented and near-closed frames (Figure 4; Supplementary Figure S1), supporting the area-first, width-as-quality-control interpretation adopted in this work.

## 4. Impact

Cytomove is a workflow and reproducibility contribution rather than a new biological metric. The established scratch-assay tool literature already defines the major measurement concepts (wound area, normalised area, width, closure behaviour, time-course plots, output images, and spreadsheet export); Cytomove brings these into a browser-local, reviewable workflow that reduces installation friction while preserving inspectability and recording the provenance of each measurement. To reproduce a measurement, a researcher needs to know which image was analysed, which crop or field was used, what threshold and variance settings were applied, whether rotation or manual correction occurred, and which software version produced the output — and Cytomove records all of these in its exported metadata, directly addressing the common loss of analysis settings in macro- and plugin-based workflows.

The local-first design is equally consequential. Browser-local analysis lowers the barrier to trying the workflow and supports privacy-sensitive or unpublished microscopy that researchers may be unwilling to upload to a remote service, while the desktop package provides more predictable performance for large experiments. By keeping the segmentation overlay linked to every exported number, Cytomove makes measurement uncertainty visible: strong trend concordance with WHST and review-sensitive individual frames can coexist, and the tool surfaces both rather than collapsing a time course into a single pass/fail number. Cytomove is therefore most useful to cell biology, cancer biology, and drug-screening laboratories that run scratch assays routinely and need an accessible, auditable, publication-oriented analysis path that complements rather than replaces ImageJ/Fiji.

Cytomove is deliberately positioned as an explainable, dependency-free alternative to deep-learning segmentation models such as U-Net (Ronneberger et al., 2015), StarDist (Schmidt et al., 2018), and Cellpose (Stringer et al., 2021), which achieve strong accuracy but require training data, computational resources, and expertise that many scratch-assay laboratories lack. Recent efforts to lower that barrier, such as ZeroCostDL4Mic (von Chamier et al., 2021) and browser-based platforms such as ImJoy (Ouyang et al., 2019), share Cytomove's accessibility goal, and a future release may add an optional learned segmentation backend while preserving the review-first, local-first workflow.

## 5. Conclusions

Cytomove provides a browser-local, reviewable software tool for scratch wound healing assay quantification. In preliminary comparison with WHST it reproduced wound-area behaviour closely in clean and phase-contrast time courses (4.1% mean area error and near-unity correlation in the clean comparator set; 6.6% median area error in the phase-contrast set) while making near-closure and phone-capture difficulties visible through overlays and quality-control labels rather than hiding them. The appropriate claim is conservative: Cytomove is an accessible, publication-oriented analysis workflow that can produce WHST-comparable outputs in suitable images and that makes measurement uncertainty visible in difficult ones. Planned development includes wound-internal cell handling, validation against multi-rater manual consensus masks with spatial-overlap metrics such as the Dice coefficient and intersection-over-union (Dice, 1945; Taha and Hanbury, 2015; Maier-Hein et al., 2024), spatial and temporal calibration for physical-unit closure rates, and reproducible export packages aligned with the FAIR data principles (Wilkinson et al., 2016) for publication-oriented wound healing analysis.

## Ethics statement

This study did not involve human participants, identifiable human data, or animal experiments, and therefore required no ethical approval. The MCF-7 phase-contrast frames were obtained from a publicly available dataset released under the Creative Commons Attribution 4.0 International licence (Iheme et al., 2024); the smartphone-through-eyepiece brightfield images were acquired by the author from routine in vitro cell cultures.

## Funding

This research received no specific grant from any funding agency in the public, commercial, or not-for-profit sectors.

## Declaration of competing interest

The author is the developer of Cytomove and intends to offer a commercially licensed version of the software. No other competing interests are declared.

## CRediT author statement

**Zekeriya Düzgün:** Conceptualization, Methodology, Software, Validation, Formal analysis, Data curation, Visualization, Writing – original draft, Writing – review & editing.

## Data and software availability

A live web version is available at https://cytomove.com, and the public project repository is https://github.com/zduzgun/CytoMove. Public release and licensing of the full core analysis source code are pending institutional IP/TTO confirmation. The preliminary validation summary -- paired WHST-Cytomove measurements, dataset-level diagnostic statistics, the discrepancy-resolution table, and representative overlay images -- is archived on Zenodo under the reserved DOI https://doi.org/10.5281/zenodo.20486820. External image provenance: WHAD-MCF7 frames from the WHAD/CAMAD Zenodo dataset under CC BY 4.0 (Iheme et al., 2024); CSMA sample images and output context from the public CSMA WoundHealing repository and associated article (Pham et al., 2025); smartphone-through-eyepiece images acquired by the author. All Cytomove overlays and analysis outputs were generated by the author.

---

## References

Berg, Stuart, Dominik Kutra, Thorben Kroeger, Christoph N. Straehle, Bernhard X. Kausler, Carsten Haubold, Martin Schiegg, et al. 2019. "ilastik: Interactive Machine Learning for (Bio)Image Analysis." *Nature Methods* 16 (12):1226–1232. https://doi.org/10.1038/s41592-019-0582-9.

Bland, J. Martin, and Douglas G. Altman. 1986. "Statistical Methods for Assessing Agreement between Two Methods of Clinical Measurement." *The Lancet* 327 (8476):307–310. https://doi.org/10.1016/S0140-6736(86)90837-8.

Carpenter, Anne E., Thouis R. Jones, Michael R. Lamprecht, Colin Clarke, In Han Kang, Ola Friman, David A. Guertin, et al. 2006. "CellProfiler: Image Analysis Software for Identifying and Quantifying Cell Phenotypes." *Genome Biology* 7 (10):R100. https://doi.org/10.1186/gb-2006-7-10-r100.

Crow, Franklin C. 1984. "Summed-Area Tables for Texture Mapping." *Computer Graphics (SIGGRAPH '84)* 18 (3):207–212. https://doi.org/10.1145/964965.808600.

Dice, Lee R. 1945. "Measures of the Amount of Ecologic Association between Species." *Ecology* 26 (3):297–302. https://doi.org/10.2307/1932409.

Friedl, Peter, and Darren Gilmour. 2009. "Collective Cell Migration in Morphogenesis, Regeneration and Cancer." *Nature Reviews Molecular Cell Biology* 10 (7):445–457. https://doi.org/10.1038/nrm2720.

Garcia-Fossa, Fernanda, Vladimir Gaal, and Marcelo Bispo de Jesus. 2020. "PyScratch: An Ease of Use Tool for Analysis of Scratch Assays." *Computer Methods and Programs in Biomedicine* 193:105476. https://doi.org/10.1016/j.cmpb.2020.105476.

Gebäck, Tobias, Martin Michael Peter Schulz, Petros Koumoutsakos, and Michael Detmar. 2009. "TScratch: A Novel and Simple Software Tool for Automated Analysis of Monolayer Wound Healing Assays." *BioTechniques* 46 (4):265–274. https://doi.org/10.2144/000113083.

Grada, Ayman, Marta Otero-Vinas, Fanny Prieto-Castrillo, Zaidal Obagi, and Vincent Falanga. 2017. "Research Techniques Made Simple: Analysis of Collective Cell Migration Using the Wound Healing Assay." *Journal of Investigative Dermatology* 137 (2):e11–e16. https://doi.org/10.1016/j.jid.2016.11.020.

Iheme, Leonardo Obinna, Sevgi Onal, Yusuf Sait Erdem, Mahmut Ucar, Ozden Yalcin-Ozuysal, Devrim Pesen-Okvur, Behçet U. Töreyin, and Devrim Ünay. 2024. "Wound Healing Assay Dataset (WHAD) and Cell Adhesion and Motility Assay Dataset (CAMAD)" (Version 1.0.0-alpha) [Data set]. Zenodo, CC BY 4.0. https://doi.org/10.5281/zenodo.12806149.

Jonkman, James E. N., Jason A. Cathcart, Feng Xu, Mary E. Bartolini, Jennifer E. Amon, Kristopher M. Stevens, and Pina Colarusso. 2014. "An Introduction to the Wound Healing Assay Using Live-Cell Microscopy." *Cell Adhesion & Migration* 8 (5):440–451. https://doi.org/10.4161/cam.36224.

Liang, Chia-Chen, Ann Y. Park, and Jun-Lin Guan. 2007. "In Vitro Scratch Assay: A Convenient and Inexpensive Method for Analysis of Cell Migration in Vitro." *Nature Protocols* 2 (2):329–333. https://doi.org/10.1038/nprot.2007.30.

Maier-Hein, Lena, Annika Reinke, Patrick Godau, Minu D. Tizabi, Florian Buettner, Evangelia Christodoulou, Ben Glocker, et al. 2024. "Metrics Reloaded: Recommendations for Image Analysis Validation." *Nature Methods* 21 (2):195–212. https://doi.org/10.1038/s41592-023-02151-z.

Otsu, Nobuyuki. 1979. "A Threshold Selection Method from Gray-Level Histograms." *IEEE Transactions on Systems, Man, and Cybernetics* 9 (1):62–66. https://doi.org/10.1109/TSMC.1979.4310076.

Ouyang, Wei, Florian Mueller, Martin Hjelmare, Emma Lundberg, and Christophe Zimmer. 2019. "ImJoy: An Open-Source Computational Platform for the Deep Learning Era." *Nature Methods* 16 (12):1199–1200. https://doi.org/10.1038/s41592-019-0627-0.

Pham, Tri Thanh, Amina Sagymbayeva, Timur Elebessov, Zhadyra Onzhanova, and Ferdinand Molnár. 2025. "CSMA: A Standalone and ImageJ-Compatible Tool for Enhanced Wound Healing Assay Analysis." *IEEE Access* 13:69341–69352. https://doi.org/10.1109/ACCESS.2025.3561607.

Ronneberger, Olaf, Philipp Fischer, and Thomas Brox. 2015. "U-Net: Convolutional Networks for Biomedical Image Segmentation." In *Medical Image Computing and Computer-Assisted Intervention (MICCAI 2015)*, Lecture Notes in Computer Science 9351:234–241. https://doi.org/10.1007/978-3-319-24574-4_28.

Schindelin, Johannes, Ignacio Arganda-Carreras, Erwin Frise, Verena Kaynig, Mark Longair, Tobias Pietzsch, Stephan Preibisch, Curtis Rueden, Stephan Saalfeld, Benjamin Schmid, Jean-Yves Tinevez, Daniel James White, Volker Hartenstein, Kevin Eliceiri, Pavel Tomancak, and Albert Cardona. 2012. "Fiji: An Open-Source Platform for Biological-Image Analysis." *Nature Methods* 9 (7):676–682. https://doi.org/10.1038/nmeth.2019.

Schmidt, Uwe, Martin Weigert, Coleman Broaddus, and Gene Myers. 2018. "Cell Detection with Star-Convex Polygons." In *Medical Image Computing and Computer-Assisted Intervention (MICCAI 2018)*, Lecture Notes in Computer Science 11071:265–273. https://doi.org/10.1007/978-3-030-00934-2_30.

Schneider, Caroline A., Wayne S. Rasband, and Kevin W. Eliceiri. 2012. "NIH Image to ImageJ: 25 Years of Image Analysis." *Nature Methods* 9 (7):671–675. https://doi.org/10.1038/nmeth.2089.

Soille, Pierre. 2003. *Morphological Image Analysis: Principles and Applications.* 2nd ed. Berlin: Springer. https://doi.org/10.1007/978-3-662-05088-0.

Stirling, David R., Madison J. Swain-Bowden, Alice M. Lucas, Anne E. Carpenter, Beth A. Cimini, and Allen Goodman. 2021. "CellProfiler 4: Improvements in Speed, Utility and Usability." *BMC Bioinformatics* 22:433. https://doi.org/10.1186/s12859-021-04344-9.

Stringer, Carsen, Tim Wang, Michalis Michaelos, and Marius Pachitariu. 2021. "Cellpose: A Generalist Algorithm for Cellular Segmentation." *Nature Methods* 18 (1):100–106. https://doi.org/10.1038/s41592-020-01018-x.

Suarez-Arnedo, Alejandra, Felipe Torres Figueroa, Claudia Clavijo, Pablo Arbeláez, Juan C. Cruz, and Carolina Muñoz-Camargo. 2020. "An ImageJ Plugin for the High Throughput Image Analysis of In Vitro Scratch Wound Healing Assays." *PLOS ONE* 15 (7):e0232565. https://doi.org/10.1371/journal.pone.0232565.

Taha, Abdel Aziz, and Allan Hanbury. 2015. "Metrics for Evaluating 3D Medical Image Segmentation: Analysis, Selection, and Tool." *BMC Medical Imaging* 15:29. https://doi.org/10.1186/s12880-015-0068-x.

Topman, Gil, Orna Sharabani-Yosef, and Amit Gefen. 2012. "A Standardized Objective Method for Continuously Measuring the Kinematics of Cultures Covering a Mechanically Damaged Site." *Medical Engineering & Physics* 34 (2):225–232. https://doi.org/10.1016/j.medengphy.2011.07.014.

Viola, Paul, and Michael Jones. 2001. "Rapid Object Detection Using a Boosted Cascade of Simple Features." In *Proceedings of the 2001 IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR)*, I-511–I-518. https://doi.org/10.1109/CVPR.2001.990517.

von Chamier, Lucas, Romain F. Laine, Johanna Jukkala, Christoph Spahn, Daniel Krentzel, Elias Nehme, Martina Lerche, et al. 2021. "Democratising Deep Learning for Microscopy with ZeroCostDL4Mic." *Nature Communications* 12:2276. https://doi.org/10.1038/s41467-021-22518-0.

Wilkinson, Mark D., Michel Dumontier, IJsbrand Jan Aalbersberg, Gabrielle Appleton, Myles Axton, Arie Baak, Niklas Blomberg, et al. 2016. "The FAIR Guiding Principles for Scientific Data Management and Stewardship." *Scientific Data* 3:160018. https://doi.org/10.1038/sdata.2016.18.

Zordan, Michael D., Christopher P. Mill, David J. Riese, and James F. Leary. 2011. "A High Throughput, Interactive Imaging, Bright-Field Wound Healing Assay." *Cytometry Part A* 79 (3):227–232. https://doi.org/10.1002/cyto.a.21029.

---

## Figures

**Figure 1. Cytomove application workspace for browser-local scratch assay quantification.** The interface keeps adjustable segmentation parameters, overlay-based wound review, quality-control and metric summaries, and frame-level group review in a single workflow before export.

**Figure 2. Representative Cytomove segmentation overlays.** Overlays for a clean CSMA sample image, a WHAD-MCF7 phase-contrast frame, and an author-acquired phone-capture stress image. The wound contour remains visible so that segmentation quality can be inspected before export.

**Figure 3. WHST versus Cytomove wound-area comparison.** (A) Paired WHST and Cytomove wound-area values against the identity line, with a distinct marker per dataset. (B) Bland–Altman view on the absolute area scale; the solid line marks the median difference (−0.002 Mpx) and the dashed lines the 2.5–97.5th percentile limits of agreement (−0.134 to +0.169 Mpx).

**Figure 4. Visual comparison of WHST output and Cytomove overlays.** Representative examples connecting numerical comparison with visual evidence across clean CSMA material, WHAD-MCF7 phase-contrast images, and author-acquired phone-capture cases.

**Figure 5. CSMA sample 11 three-method area trend and visual audit.** (A–C) Native CSMA, WHST, and Cytomove area across the matched 11-frame sequence; (D) frame-level visual audit showing the raw image, CSMA area output, WHST output, and Cytomove overlay for each frame.

**Figure 6. WHAD-MCF7 time-course behaviour and visual audit.** (A) wound-area and (B) wound-width values across the 11-frame phase-contrast sequence (Iheme et al., 2024), with (C) a frame-level visual audit; late near-closure frames are flagged as review-sensitive.

**Supplementary Figure S1. Dataset-level validation summary.** Diagnostic summary of area and width agreement statistics across the five validation sets.

---

## Tables

**Table 2. Preliminary validation datasets.**

| Dataset | n | Imaging / role | Source / provenance | Comparator |
| --- | ---: | --- | --- | --- |
| csma_sample_11 | 11 | Clean comparator time course | CSMA repository sample data / outputs (Pham et al., 2025) | WHST (with CSMA visual context) |
| whad_mcf7_11 | 11 | Phase-contrast time course | WHAD/CAMAD Zenodo dataset, CC BY 4.0 (Iheme et al., 2024) | WHST |
| cell_phone_HK | 3 | Phone-capture external support | Author-acquired | WHST |
| cell_phone_M8F | 3 | Phone-capture support / stress | Author-acquired | WHST |
| cell_phone_MK | 3 | Phone-capture stress / limitation | Author-acquired | WHST |

**Table 3. Preliminary Cytomove-versus-WHST agreement summary.** Area and width are reported as mean absolute percentage error (MAPE), median absolute percentage error, maximum absolute percentage error, and Pearson trend correlation (r).

| Dataset | n | Area MAPE % | Area median % | Area max % | Area r | Width MAPE % | Width r | Interpretation |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| csma_sample_11 | 11 | 4.1 | 3.9 | 7.9 | 0.9975 | 9.7 | 0.9969 | Primary clean comparator; visually concordant overlays |
| whad_mcf7_11 | 11 | 15.0 | 6.6 | 82.5 | 0.9984 | 9.0 | 0.9986 | Phase-contrast; MAPE driven by late near-closure frames |
| cell_phone_HK | 3 | 6.7 | 3.2 | 16.3 | 0.9903 | 8.5 | 0.9918 | External support set |
| cell_phone_M8F | 3 | 10.6 | 5.1 | 24.9 | 0.9557 | 8.7 | 0.9076 | Support / stress; late-frame underestimation |
| cell_phone_MK | 3 | 38.8 | 43.4 | 72.3 | 0.9880 | 31.0 | 0.9861 | Stress / limitation case; not accuracy evidence |

**Table 1 (Code metadata)** is provided in the Software and code metadata section above.

