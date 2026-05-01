# Comparator Benchmark Workspace

Use this folder to collect measurements from WHST, TScratch, PyScratch, CSMA, and manual workflows on the same source images.

Images are copied into `docs/comparator-benchmark/images/`, which is intentionally ignored by git. Do not commit copied microscopy images.

Recommended workflow:

1. Analyze each image in `images/` with the comparator tool.
2. Enter the result into `comparator-measurements-template.csv`.
3. Keep the original filename unchanged so rows can be joined back to Cytomove exports.
4. Record parameter settings and notes when a tool required manual tuning.

Primary comparator priority:

1. WHST
2. Manual ROI / consensus mask
3. TScratch
4. PyScratch
5. CSMA

