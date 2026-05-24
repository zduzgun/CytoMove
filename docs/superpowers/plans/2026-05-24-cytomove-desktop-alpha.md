# Cytomove Desktop Alpha Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Windows-first Cytomove Desktop Alpha that runs the existing working prototype locally without changing the web deployment.

**Architecture:** Create an isolated `desktop_alpha/` Electron wrapper. The renderer is a copied snapshot of `prototype_refactor/`; the main process opens it from disk with conservative security defaults. Packaging is prepared but dependency installation is left to the developer machine because this repository currently has no Node project lockfile.

**Tech Stack:** Electron, static HTML/CSS/JavaScript, existing Cytomove canvas/typed-array analysis engine.

---

### File Structure

- `desktop_alpha/package.json`: npm scripts and Electron build metadata for the alpha app.
- `desktop_alpha/main.js`: Electron main process, app window, local file serving behavior.
- `desktop_alpha/preload.js`: Small bridge for app metadata only; no privileged file APIs exposed.
- `desktop_alpha/renderer/index.html`: Copied Cytomove prototype UI for desktop.
- `desktop_alpha/renderer/styles.css`: Copied prototype styling.
- `desktop_alpha/renderer/app.js`: Copied working prototype analysis engine.
- `desktop_alpha/README.md`: How to run and package the alpha.

### Task 1: Scaffold Electron Shell

**Files:**
- Create: `desktop_alpha/package.json`
- Create: `desktop_alpha/main.js`
- Create: `desktop_alpha/preload.js`
- Create: `desktop_alpha/README.md`

- [ ] **Step 1: Create package metadata**

Write `desktop_alpha/package.json` with `start`, `check`, and Windows packaging scripts. Use Electron as a dev dependency and electron-builder as an optional packaging dependency.

- [ ] **Step 2: Create main process**

Write `desktop_alpha/main.js` so it opens `renderer/index.html`, uses a preload script, disables remote module behavior, and leaves web security enabled.

- [ ] **Step 3: Create preload bridge**

Write `desktop_alpha/preload.js` exposing only `{ name, version, platform }` through `window.cytomoveDesktop`.

- [ ] **Step 4: Create operator README**

Write `desktop_alpha/README.md` with install, run, and package commands plus a privacy note.

### Task 2: Copy Working Prototype Snapshot

**Files:**
- Create: `desktop_alpha/renderer/index.html`
- Create: `desktop_alpha/renderer/styles.css`
- Create: `desktop_alpha/renderer/app.js`

- [ ] **Step 1: Copy current prototype files**

Copy `prototype_refactor/index.html`, `prototype_refactor/styles.css`, and `prototype_refactor/app.js` into `desktop_alpha/renderer/`.

- [ ] **Step 2: Desktop-label renderer**

Change only desktop copy text where needed: page title and brand tag should say `Cytomove Desktop Alpha`.

- [ ] **Step 3: Keep existing behavior**

Do not change segmentation, group mode, exports, or UI controls in this first alpha.

### Task 3: Verification

**Files:**
- Verify: `desktop_alpha/main.js`
- Verify: `desktop_alpha/preload.js`
- Verify: `desktop_alpha/renderer/app.js`

- [ ] **Step 1: Syntax-check JavaScript**

Run bundled Node syntax checks:

```powershell
& "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" --check desktop_alpha\main.js
& "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" --check desktop_alpha\preload.js
& "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" --check desktop_alpha\renderer\app.js
```

- [ ] **Step 2: Confirm web files untouched**

Run:

```powershell
git diff -- prototype_refactor index.html prototype
```

Expected: no desktop-alpha edits appear in those paths.

- [ ] **Step 3: Dependency note**

If `npm install` is not run, state that the Electron app is scaffolded but not launched yet.
