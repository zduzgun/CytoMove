# Cytomove Local Analysis Engine Note

Date: 2026-05-24

## Purpose

This note compares three candidate execution models for Cytomove wound-healing analysis:

- Pyodide running Python in the browser
- OpenCV.js / browser JavaScript or WASM
- Server-side analysis

The current proof of concept lives in `pyodide_poc/` and is intentionally isolated from the production-facing `prototype_refactor/` workflow.

## Summary Recommendation

Use Pyodide as a proof-of-concept and reproducibility experiment, not as the default production engine yet.

For the current soft-deployed Cytomove prototype, the safest short-term path remains custom browser JavaScript with typed arrays because it loads quickly, has no package bootstrap, and keeps images local. Pyodide is valuable if we want to reuse Python validation code directly in the browser. Server-side analysis should remain optional/future because it weakens the privacy-first claim unless users explicitly opt in.

## Comparison

| Criterion | Pyodide | OpenCV.js / Custom WASM | Server-side analysis |
|---|---|---|---|
| Bundle size | Large. Pyodide runtime plus `numpy` and `Pillow` can be many MB and creates a visible first-run delay. | OpenCV.js can also be large; custom JS/WASM can be much smaller if scoped to required operations. | Browser bundle small, but backend deployment and scaling are needed. |
| Runtime speed | Good for Python portability, but slower startup and higher memory overhead. Pure Python loops must be avoided. | Usually fastest in-browser path if optimized. Custom typed-array JS is already acceptable for current prototype; WASM could improve heavy morphology/labeling. | Potentially fastest for large images if using native Python/OpenCV/scikit-image on a server. Network transfer can dominate. |
| Memory use | High. Python runtime, packages, image arrays, and encoded PNG results all live in the browser tab. Large microscopy images may pressure memory. | Moderate to high depending on OpenCV.js build and image copies. Custom JS can control memory more tightly. | Server memory is controllable and can be scaled, but user images must leave the browser. |
| TIFF support | Better than native browser if Pillow can decode the specific TIFF variant in Pyodide, but not guaranteed for every microscopy TIFF/compression. | Browser-native TIFF support is poor; OpenCV.js TIFF support depends on build. Custom JS usually requires conversion. | Best option for broad TIFF support using Python libraries, tifffile, Bio-Formats, or ImageJ tooling. |
| Reproducibility | Strong if the same Python analysis code is shared between validation and browser runtime. Package/runtime versions must be pinned. | Strong if algorithms are explicitly versioned; closer to current Cytomove prototype implementation. | Strongest for controlled server environments, but users must trust the service and versioning. |
| Maintainability | Good for Python-heavy research code reuse, but Pyodide packaging/debugging is a separate browser runtime concern. | Good for product code if kept modular; harder if advanced image processing grows too large. | Good for scientific Python ecosystems, but adds DevOps, privacy, cost, and account/auth concerns. |
| Privacy posture | Good: images stay in browser after runtime loads. Third-party CDN loads code unless self-hosted. | Excellent if assets are served by Cytomove and all analysis is local. | Weakest by default: images are uploaded unless explicit opt-in and strong data handling policy exists. |

## Phase 1 POC Scope

The Pyodide POC intentionally supports only a single local image and a small metric set:

- local drag/drop or file input
- lazy Pyodide load
- Python `numpy` + `Pillow` package load
- downsampled preview
- wound area percentage
- mean horizontal gap width
- optional mask image
- CSV/JSON export
- timing log and development benchmark panel

The POC does not replace `prototype_refactor/` and does not claim final validation quality.

## Risks To Measure

1. Pyodide first-load time on normal lab laptops and slow networks.
2. Browser memory use with 3000-4000 px microscopy images.
3. Analysis time compared with the current JS prototype.
4. TIFF decode reliability in Pyodide/Pillow.
5. Whether users understand the difference between the stable prototype and experimental Python mode.

## Next Evaluation Steps

1. Run the same PNG/JPEG test images through `prototype_refactor/` and `pyodide_poc/`.
2. Record Pyodide load, package load, image decode, analysis, and export timing.
3. Compare metrics against the current JS prototype on a small reference set.
4. Try representative TIFFs after confirming Pyodide/Pillow support.
5. Decide whether Pyodide remains a validation/research mode or becomes a user-facing analysis option.
