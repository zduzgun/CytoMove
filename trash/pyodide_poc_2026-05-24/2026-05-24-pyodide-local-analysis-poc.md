# Pyodide Local Analysis POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an isolated browser-only Pyodide proof of concept for local wound-healing analysis.

**Architecture:** The POC lives under `pyodide_poc/` and does not replace `prototype_refactor/`. JavaScript talks to a small `AnalysisEngine` interface so Pyodide can later be swapped for OpenCV.js or custom WASM. Python receives local image bytes in browser memory, computes preview, mask, area percentage, width metrics, and returns JSON-compatible results.

**Tech Stack:** Static HTML/CSS/JS, Pyodide loaded lazily from CDN, Python with `numpy` and `Pillow`.

---

### Task 1: Engine Boundary

**Files:**
- Create: `pyodide_poc/engines/analysis-engine.js`
- Create: `pyodide_poc/engines/pyodide-engine.js`

- [x] Define a minimal engine interface: `init()`, `analyze(file, options)`, `exportCsv(result)`, `exportJson(result)`.
- [x] Implement Pyodide lazy loading and package timing.

### Task 2: Python Analysis

**Files:**
- Create: `pyodide_poc/python/wound_analysis.py`

- [x] Decode local image bytes with Pillow.
- [x] Downsample analysis image.
- [x] Compute local variance, threshold, largest connected component, wound area percentage, and horizontal gap width.
- [x] Return preview and mask PNGs as base64 data URLs.

### Task 3: POC UI

**Files:**
- Create: `pyodide_poc/index.html`
- Create: `pyodide_poc/styles.css`
- Create: `pyodide_poc/pyodide-runner.js`

- [x] Add drag/drop and file input.
- [x] Show preview, optional mask, metrics, timing log, and dev benchmark panel.
- [x] Add CSV/JSON export buttons.

### Task 4: Documentation

**Files:**
- Create: `docs/pyodide-local-analysis-note.md`

- [x] Compare Pyodide, OpenCV.js, and server-side analysis for Cytomove.

### Task 5: Verification

**Commands:**
- `node --check pyodide_poc/pyodide-runner.js`
- `node --check pyodide_poc/engines/analysis-engine.js`
- `node --check pyodide_poc/engines/pyodide-engine.js`
- `python -m py_compile scripts/serve_prototype_refactor.py`

- [ ] Verify local route serves `pyodide_poc/`.
- [ ] Browser-test full Pyodide analysis when network access is available.
