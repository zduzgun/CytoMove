# Validation Dataset Layout

Raw validation images should not be copied into the repository root and should not be committed to git.

Use the ignored `validation_ref_sets/` folder for downloaded or local raw datasets:

```text
validation_ref_sets/
  raw/
    whad_camad/
      README_SOURCE.txt
      whad_camad.zip
      extracted/
    csma/
      README_SOURCE.txt
      extracted/
    local_phone/
      README_SOURCE.txt
      selected_images/
    rqsa_deferred/
      README_SOURCE.txt
      trainingSet.zip
      validationSet.zip
  curated/
    cytomove_public_validation_v0/
      images/
      masks/
      metadata.csv
      measurements.csv
```

`validation_sets/` remains reserved for generated Cytomove outputs such as synthetic fixtures, masks, figures, and benchmark reports.

The external raw-image inventory is generated with:

```text
py -3 scripts/build_validation_ref_inventory.py
```

Outputs:

- `docs/validation-ref-inventory.csv`
- `docs/validation-ref-inventory-summary.md`

## First-Wave Dataset Roles

| Source | Role | Status |
|--------|------|--------|
| WHAD/CAMAD | Primary professional real-world validation: high-quality scratch assay, frequent time-lapse acquisition, public DOI source | First-wave priority |
| CSMA dataset | Public comparator validation: linked to a wound-healing analysis tool and useful for area/width workflow comparison | First-wave secondary |
| Local phone/eyepiece images | Real-world usability stress: non-standard acquisition, phone capture, FOV/crop/angle variability | First-wave usability subset |
| RQSA | Robustness/stress dataset, especially difficult illumination/noise/contrast cases | Deferred; keep as Phase 2/3 candidate |

## Rules

- Keep original archives intact under `raw/<source>/`.
- Do not rename original raw files in place; create curated copies or symlinks under `curated/` when a stable subset is chosen.
- Store source URL, DOI, license, download date, and notes in each `README_SOURCE.txt`.
- Commit only metadata, scripts, and small derived documentation unless the source license and file size make redistribution appropriate.
- For manuscript figures, use selected derived panels and citation-ready metadata rather than committing large raw datasets.

## Browser Review

The prototype supports quick visual screening of external validation candidates:

- Open `http://127.0.0.1:8765/prototype/index.html`.
- Select or drag/drop 2+ images to create a temporary `Custom local group`.
- Use Group review for contour preview and click any card to inspect it in the single-image canvas.
- Custom local groups are for visual screening only; they do not have ground-truth rows and auto-calibration is skipped.

Browser-native image decoding does not reliably support TIFF. Convert WHAD/CAMAD TIFFs to browser-ready PNG before app review:

```text
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\convert_tiff_for_browser.ps1
```

Default output:

```text
validation_ref_sets/browser_ready/whad_camad_png/
```
