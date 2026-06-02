# Desktop Alpha Trial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 30-day Desktop Alpha welcome/trial gate that thanks testers, explains active development, and shows an expired thank-you/update screen after the alpha window ends.

**Architecture:** Electron main owns trusted-ish trial state in `app.getPath('userData')`, exposes a minimal read API through preload, and keeps the renderer UI-only. The renderer displays either a first-run welcome overlay, a normal remaining-days badge, or an expired overlay that blocks analysis interaction while still allowing Cytomove web/update links.

**Tech Stack:** Electron main/preload IPC, renderer HTML/CSS/JavaScript, JSON state file under Electron userData, existing Cytomove web manifest link.

---

### Task 1: Main/Preload Trial State

**Files:**
- Modify: `desktop_alpha/main.js`
- Modify: `desktop_alpha/preload.js`

- [x] Add trial constants: 30 day duration, state filename, Cytomove website URLs.
- [x] Read or initialize `desktop-alpha-trial.json` under Electron `userData`.
- [x] Store `firstRunAt`, `lastSeenAt`, `installId`, and `trialVersion`.
- [x] Detect system clock rollback when current time is earlier than `lastSeenAt` by more than five minutes.
- [x] Return `expired`, `clockInvalid`, `daysRemaining`, `startedAt`, `expiresAt`, `now`, and `durationDays`.
- [x] Expose the value as `window.cytomoveDesktop.getTrialState()`.

### Task 2: Renderer Gate UI

**Files:**
- Modify: `desktop_alpha/renderer/index.html`
- Modify: `desktop_alpha/renderer/styles.css`
- Modify: `desktop_alpha/renderer/app.js`

- [ ] Add a welcome overlay with “Start local analysis”, “Visit cytomove.com”, and remaining-days copy.
- [ ] Add an expired overlay with “Visit cytomove.com”, “Send feedback”, and “Close”.
- [x] On startup, call `getTrialState()`.
- [x] If expired or clock-invalid, show expired overlay and prevent interaction with the analysis app beneath it.
- [x] If active, show welcome overlay once per app version using localStorage.
- [x] Keep normal analysis available after the welcome screen is dismissed.

### Task 3: Documentation And Verification

**Files:**
- Modify: `desktop_alpha/README.md`
- Modify: `desktop_alpha/TESTER_README.txt`
- Modify: `AGENT_BRIEF.md`
- Modify: `ROADMAP.md`

- [x] Document that the 30-day gate is an alpha tester control, not paid licensing.
- [x] Run `npm run check` from `desktop_alpha/`.
- [x] Run `npm run pack:win` from `desktop_alpha/`.
- [ ] Keep unrelated untracked manuscript/sample files out of the commit.
