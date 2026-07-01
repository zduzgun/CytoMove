# Cytomove Tutorial Voiceover Script

Source video: `video_tutorial/tutorial.mp4`

Target output: `video_tutorial/tutorial_with_english_voiceover.mp4`

Voice direction: polished English, calm scientific product demo, clear pacing, no hype.

## Time-Coded Script

### 0:00-0:25 - Introduction and Workflow

Welcome to this Cytomove walkthrough. In this tutorial, we will move through the complete scratch assay workflow: image quality control, analysis, result review, and publication-ready figure export. The goal is to keep each decision visible, reproducible, and easy to audit before the data leaves the browser.

### 0:25-1:15 - Image QC and Field Review

The workflow begins in Image QC. Here, each image can be reviewed before analysis starts. Cytomove lets you inspect the field of view, confirm the scratch orientation, and define a clean crop region around the biologically relevant area. These checks are important because small framing or orientation problems can influence downstream segmentation and wound measurements.

As the crop box is adjusted, the preview updates immediately. The original image is preserved, while the reviewed QC state becomes the input for analysis. This makes the correction step reversible and keeps the analysis based on an explicit image review.

### 1:15-2:30 - Analysis and Contour Review

After QC is confirmed, the workflow moves into Analysis. Cytomove detects the wound region and overlays contours on the microscopy image, so the segmentation can be reviewed directly against the cells and the scratch boundary.

The control panel supports practical review of the mask. Threshold and contour settings can be adjusted while watching the overlay respond on the image. This is especially useful when the scratch edge is irregular, when debris is present in the wound area, or when local contrast varies across the field.

The purpose is not to hide the segmentation step. Instead, Cytomove keeps it visible, so the user can judge whether the contour follows the biologically meaningful wound boundary before accepting the measurement.

### 2:30-3:25 - Measurements and Group-Level Results

Once the contour is accepted, Cytomove summarizes the quantitative outputs. The interface reports wound area, wound width, and closure-related measurements for the selected image and group. This makes it possible to move from visual review to numerical interpretation without changing tools.

Across time points and experimental groups, Cytomove organizes the measurements into plots and tables. The user can compare control and treatment behavior, inspect the time course, and check whether the measurements agree with the image-level evidence.

### 3:25-4:20 - Publication Figure Builder

The final part of the workflow is the Publication Figure Builder. Here, reviewed images, contours, group summaries, and plots can be assembled into a figure layout. The builder is designed for manuscript preparation, so the visual elements remain connected to the reviewed analysis outputs.

The figure can include representative microscopy panels, quantitative charts, and a short interpretation panel. Export options are prepared for publication workflows, including high-resolution image output and bundled files for review or downstream editing.

### 4:20-4:35 - Closing

This completes the Cytomove workflow: review images first, run transparent analysis, inspect the measurements, and export figures from the same reproducible session.
