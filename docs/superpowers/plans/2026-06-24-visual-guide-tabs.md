# Visual Guide Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visual tabbed Cytomove guide that explains Image QC, Analysis, Manual correction, Publication Figure Builder, Export, and troubleshooting with existing Cytomove-owned images and tutorial links.

**Architecture:** Keep the active SEO guide route at `wound-healing-scratch-assay-analysis/index.html` and add a self-contained tabbed handbook section using static HTML, CSS, and a tiny inline script. Keep `tutorial/index.html` as the guided tutorial launcher, with stronger links back to the visual guide.

**Tech Stack:** Static HTML/CSS/vanilla JavaScript, Node-based static contract tests, existing Cytomove image assets.

---

### Task 1: Add a static contract test for the visual guide

**Files:**
- Modify: `tests/app_route_contract.test.js`
- Read: `wound-healing-scratch-assay-analysis/index.html`
- Read: `tutorial/index.html`

- [ ] **Step 1: Write the failing guide contract**

Add this block after the existing guide CTA assertion in `tests/app_route_contract.test.js`:

```js
const tutorialHtml = read('tutorial/index.html');
const guideTabLabels = [
  'Overview',
  'Load images',
  'Image QC',
  'Analysis',
  'Manual correction',
  'Publication figures',
  'Export',
  'Troubleshooting'
];

assert(
  guideHtml.includes('id="visualGuideTabs"') &&
    guideHtml.includes('class="guide-tab"') &&
    guideHtml.includes('class="guide-panel"'),
  'Guide should include a visual tabbed handbook section'
);
guideTabLabels.forEach(label => {
  assert(
    guideHtml.includes(`>${label}<`) || guideHtml.includes(`>${label}`),
    `Guide should include the ${label} tab`
  );
});
assert(
  guideHtml.indexOf('Image QC') < guideHtml.indexOf('Analysis') &&
    guideHtml.indexOf('Analysis') < guideHtml.indexOf('Publication Figure Builder') &&
    guideHtml.indexOf('Publication Figure Builder') < guideHtml.indexOf('Export'),
  'Guide should teach the Cytomove workflow in the correct order'
);
assert(
  guideHtml.includes('single-group figure') &&
    guideHtml.includes('Control vs Treatment') &&
    guideHtml.includes('multi-treatment'),
  'Guide should explain single-group, Control vs Treatment, and multi-treatment figure modes'
);
assert(
  guideHtml.includes('full-size original') &&
    guideHtml.includes('full-size contour-overlay'),
  'Guide should explain full-size original and contour-overlay export assets'
);
assert(
  guideHtml.includes('../app/?tutorial=huvec-full') &&
    guideHtml.includes('../app/?tutorial=manual') &&
    guideHtml.includes('../app/?tutorial=publication-quality'),
  'Guide should link to the full HUVEC, manual correction, and publication figure tutorials'
);
assert(
  tutorialHtml.includes('../wound-healing-scratch-assay-analysis/'),
  'Tutorial landing page should link back to the visual guide'
);
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
node tests\app_route_contract.test.js
```

Expected result:

```text
AssertionError [ERR_ASSERTION]: Guide should include a visual tabbed handbook section
```

- [ ] **Step 3: Commit only if no production files were changed**

Do not commit yet if only the failing test exists and implementation will follow immediately in the same working set.

---

### Task 2: Build the visual tabbed handbook on the public guide page

**Files:**
- Modify: `wound-healing-scratch-assay-analysis/index.html`

- [ ] **Step 1: Add tab styles to the existing `<style>` block**

Add CSS near the existing `.note` and content-card styles:

```css
.visual-guide {
  margin: 34px 0 48px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--paper);
  box-shadow: var(--shadow);
  overflow: hidden;
}
.guide-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 14px;
  border-bottom: 1px solid var(--line);
  background: var(--soft);
}
.guide-tab {
  flex: 0 0 auto;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--muted);
  padding: 9px 13px;
  font: inherit;
  font-size: 13px;
  font-weight: 820;
  cursor: pointer;
}
.guide-tab[aria-selected="true"] {
  background: var(--ink);
  color: #fff;
  border-color: var(--ink);
}
.guide-panel {
  display: none;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.72fr);
  gap: 24px;
  padding: 24px;
}
.guide-panel.active { display: grid; }
.guide-panel h3 {
  margin: 0 0 10px;
  font-size: 25px;
  letter-spacing: -0.03em;
}
.guide-panel p { color: var(--muted); }
.guide-figure {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #f8fbfa;
  overflow: hidden;
}
.guide-figure img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
.guide-figure figcaption {
  padding: 10px 12px;
  color: var(--muted);
  font-size: 13px;
}
.guide-checklist,
.guide-watch {
  margin-top: 16px;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 14px;
  background: #f8fbfa;
}
.guide-watch {
  border-color: rgba(15, 159, 143, 0.26);
  background: rgba(15, 159, 143, 0.08);
}
.guide-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}
.guide-actions .button {
  width: auto;
}
@media (max-width: 760px) {
  .guide-panel { grid-template-columns: 1fr; }
  .guide-actions .button { width: 100%; }
}
```

- [ ] **Step 2: Add the tabbed handbook markup**

Place this section after the hero section and before the long article body:

```html
<section class="visual-guide" id="visual-guide" aria-labelledby="visualGuideTitle">
  <div class="preview-head">
    <span id="visualGuideTitle">Visual Cytomove guide</span>
    <span>Image QC → Analysis → Builder → Export</span>
  </div>
  <div class="guide-tabs" id="visualGuideTabs" role="tablist" aria-label="Cytomove guide sections">
    <button class="guide-tab" type="button" role="tab" aria-selected="true" aria-controls="guide-overview" data-guide-tab="guide-overview">Overview</button>
    <button class="guide-tab" type="button" role="tab" aria-selected="false" aria-controls="guide-load" data-guide-tab="guide-load">Load images</button>
    <button class="guide-tab" type="button" role="tab" aria-selected="false" aria-controls="guide-qc" data-guide-tab="guide-qc">Image QC</button>
    <button class="guide-tab" type="button" role="tab" aria-selected="false" aria-controls="guide-analysis" data-guide-tab="guide-analysis">Analysis</button>
    <button class="guide-tab" type="button" role="tab" aria-selected="false" aria-controls="guide-manual" data-guide-tab="guide-manual">Manual correction</button>
    <button class="guide-tab" type="button" role="tab" aria-selected="false" aria-controls="guide-builder" data-guide-tab="guide-builder">Publication figures</button>
    <button class="guide-tab" type="button" role="tab" aria-selected="false" aria-controls="guide-export" data-guide-tab="guide-export">Export</button>
    <button class="guide-tab" type="button" role="tab" aria-selected="false" aria-controls="guide-troubleshooting" data-guide-tab="guide-troubleshooting">Troubleshooting</button>
  </div>
  <div class="guide-panel active" id="guide-overview" role="tabpanel">
    <div>
      <h3>Reviewable scratch-assay analysis from image to figure.</h3>
      <p>Cytomove 1.0 follows one reviewable path: Image QC, Analysis, Publication Figure Builder, and Export. The point is not to hide segmentation; the point is to make crop, contour, mask, figure, and export decisions visible.</p>
      <div class="guide-checklist"><strong>Use this guide when you want to understand the workflow before running the guided tutorial.</strong></div>
      <div class="guide-actions"><a class="button" href="../app/?tutorial=huvec-full">Start full HUVEC tutorial</a></div>
    </div>
    <figure class="guide-figure">
      <img src="../assets/validation/figure6-ab-phase-timecourse.jpg" alt="Example Cytomove validation time-course figure">
      <figcaption>Example validation figure showing how a reviewed image workflow becomes a publication-style result.</figcaption>
    </figure>
  </div>
  <div class="guide-panel" id="guide-load" role="tabpanel">
    <div>
      <h3>Load images as named reviewable groups.</h3>
      <p>Start with one image group or a full 0h / 24h / 48h time series. A clear group name matters because the same label follows the images into Analysis, Publication Figure Builder, and export files.</p>
      <div class="guide-checklist"><strong>Checklist:</strong> choose related images together, name the group before review, and confirm the first image opens in Image QC.</div>
      <div class="guide-watch"><strong>Watch for this:</strong> if only one group is loaded, Builder should create a single-group figure rather than a Control vs Treatment comparison.</div>
      <div class="guide-actions"><a class="button" href="../app/">Open Cytomove</a><a class="button secondary" href="../app/?tutorial=huvec-full">Use bundled HUVEC set</a></div>
    </div>
    <figure class="guide-figure">
      <img src="../validation_sets/full_thread_control/huvec_control_r1/0.jpg" alt="HUVEC 0 hour scratch assay image">
      <figcaption>A 0h HUVEC validation image can be loaded as part of a named time-series group.</figcaption>
    </figure>
  </div>
  <div class="guide-panel" id="guide-qc" role="tabpanel">
    <div>
      <h3>Image QC locks the image state before analysis.</h3>
      <p>Use Image QC to review crop, orientation, fine rotation, and exclusions before segmentation. Saved crop/orientation should carry forward so Analysis and Publication Figure Builder do not drift back to the original image.</p>
      <div class="guide-checklist"><strong>Checklist:</strong> adjust the rectangle, keep the scratch centered, save crop, and exclude images that should not contribute to analysis.</div>
      <div class="guide-watch"><strong>Watch for this:</strong> a crop that cuts off wound edges can make downstream contours scientifically misleading.</div>
      <div class="guide-actions"><a class="button" href="../app/?tutorial=huvec-full">Practice Image QC</a></div>
    </div>
    <figure class="guide-figure">
      <img src="../assets/tutorial/m8f/m8f_0h_001.png" alt="Example scratch assay image for Image QC">
      <figcaption>Image QC is the review step before the analysis snapshot is locked.</figcaption>
    </figure>
  </div>
  <div class="guide-panel" id="guide-analysis" role="tabpanel">
    <div>
      <h3>Analysis should be applied, inspected, and adjusted.</h3>
      <p>Choose the brightfield normal cells preset, click Apply, inspect contour quality, then adjust variance radius if the boundary is too noisy or too smooth. Use Apply to group only when the settings look good for the time series.</p>
      <div class="guide-checklist"><strong>Checklist:</strong> run Apply, inspect contour overlay, adjust variance radius, run Apply again, then review the group trend.</div>
      <div class="guide-watch"><strong>Watch for this:</strong> good numbers are not enough; the contour should visually follow the wound edge.</div>
      <div class="guide-actions"><a class="button" href="../app/?tutorial=huvec-full">Practice Analysis</a></div>
    </div>
    <figure class="guide-figure">
      <img src="../assets/validation/figure3-whst-cytomove-agreement.jpg" alt="Cytomove validation agreement plot">
      <figcaption>Analysis outputs should be reviewable as both contours and quantitative measurements.</figcaption>
    </figure>
  </div>
  <div class="guide-panel" id="guide-manual" role="tabpanel">
    <div>
      <h3>Manual correction is for local scientific review.</h3>
      <p>When an automatic mask misses a local wound region or includes a false-positive island, switch to correction tools. Use ignore tiny islands, fill, erase, undo, and reset deliberately.</p>
      <div class="guide-checklist"><strong>Checklist:</strong> inspect mask, use ignore tiny islands when needed, fill missed wound area, erase false positives, and undo before reset when possible.</div>
      <div class="guide-watch"><strong>Watch for this:</strong> correction should improve a specific local mask problem, not repaint the whole image from scratch.</div>
      <div class="guide-actions"><a class="button" href="../app/?tutorial=manual">Start manual correction</a></div>
    </div>
    <figure class="guide-figure">
      <img src="../assets/tutorial/manual/m8f_48h_003.png" alt="Manual correction tutorial image">
      <figcaption>The manual correction tutorial teaches reversible local edits on a hard segmentation case.</figcaption>
    </figure>
  </div>
  <div class="guide-panel" id="guide-builder" role="tabpanel">
    <div>
      <h3>Publication Figure Builder turns reviewed results into panels.</h3>
      <p>Builder supports single-group figure mode, Control vs Treatment, and multi-treatment comparison. Panel A shows representative contour-overlay images; Panel B summarizes wound closure; Panel C shows normalized area or width.</p>
      <div class="guide-checklist"><strong>Checklist:</strong> choose representative groups, select replicates, update the figure, adjust panel titles/fonts, and inspect contour overlays before export.</div>
      <div class="guide-watch"><strong>Watch for this:</strong> if selected groups need current QC analysis, use Analyze missing groups before exporting.</div>
      <div class="guide-actions"><a class="button" href="../app/?tutorial=publication-quality">Build publication figure</a></div>
    </div>
    <figure class="guide-figure">
      <img src="../assets/validation/figure6-ab-phase-timecourse.jpg" alt="Publication-style Cytomove figure panels">
      <figcaption>Publication figures combine representative images, contour overlays, and summary plots.</figcaption>
    </figure>
  </div>
  <div class="guide-panel" id="guide-export" role="tabpanel">
    <div>
      <h3>Export includes figures and reusable source assets.</h3>
      <p>Publication export should include 600 DPI PNG/TIFF/PDF outputs, editable PPTX where available, CSV or figure data, plus full-size original and full-size contour-overlay images for manual figure assembly.</p>
      <div class="guide-checklist"><strong>Checklist:</strong> export the Builder ZIP, archive figure data, and keep full-size contour overlays if you want to assemble figures manually.</div>
      <div class="guide-watch"><strong>Watch for this:</strong> export buttons can be disabled until the required image groups are analyzed.</div>
      <div class="guide-actions"><a class="button" href="../app/?tutorial=publication-quality">Practice export</a></div>
    </div>
    <figure class="guide-figure">
      <img src="../assets/validation/figure3-whst-cytomove-agreement.jpg" alt="Exported validation figure example">
      <figcaption>Export packages should preserve both publication-ready output and reusable source material.</figcaption>
    </figure>
  </div>
  <div class="guide-panel" id="guide-troubleshooting" role="tabpanel">
    <div>
      <h3>Most confusing states have a simple cause.</h3>
      <p>If no images are loaded, start with a group. If the crop rectangle disappears, return to Image QC and adjust crop. If contours look wrong, inspect orientation, preset, variance radius, and manual correction. If validation images do not load, hard refresh or use a fresh session.</p>
      <div class="guide-checklist"><strong>Checklist:</strong> confirm image group, check Image QC state, rerun Apply, use Analyze missing groups, and retry export after the preview updates.</div>
      <div class="guide-watch"><strong>Watch for this:</strong> stale browser cache can make a fixed tutorial or validation set look broken after an update.</div>
      <div class="guide-actions"><a class="button" href="../app/">Open Cytomove playground</a></div>
    </div>
    <figure class="guide-figure">
      <img src="../assets/tutorial/manual-hard/whad_mcf7_046.png" alt="Hard correction case used for troubleshooting guidance">
      <figcaption>Troubleshooting starts by checking whether the visible contour matches the biological wound edge.</figcaption>
    </figure>
  </div>
</section>
```

- [ ] **Step 3: Add the guide tab script**

Add this before `</body>`:

```html
<script>
  document.querySelectorAll('[data-guide-tab]').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.guideTab;
      document.querySelectorAll('[data-guide-tab]').forEach(tab => {
        tab.setAttribute('aria-selected', String(tab === button));
      });
      document.querySelectorAll('.guide-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === target);
      });
    });
  });
</script>
```

- [ ] **Step 4: Run the route contract test**

Run:

```powershell
node tests\app_route_contract.test.js
```

Expected:

```text
Canonical app route contract passed.
```

---

### Task 3: Link tutorial landing page back to the visual guide

**Files:**
- Modify: `tutorial/index.html`

- [ ] **Step 1: Add a visual guide CTA**

In the hero CTA row, keep existing tutorial buttons and ensure there is a link with this destination:

```html
<a class="button secondary" href="../wound-healing-scratch-assay-analysis/">Open visual guide</a>
```

If a “Read the guide” link already exists, update its visible text to “Open visual guide” so the purpose is clearer.

- [ ] **Step 2: Add a short guide note near the tutorial cards**

Add a compact note before the tutorial cards:

```html
<section class="data-note">
  <strong>Need the explanation before the click-through tutorial?</strong>
  Use the visual guide for tabbed explanations of loading images, Image QC, Analysis, manual correction, publication figures, and export.
  <a href="../wound-healing-scratch-assay-analysis/">Open the visual guide</a>.
</section>
```

- [ ] **Step 3: Run guide and tutorial contracts**

Run:

```powershell
node tests\app_route_contract.test.js
node tests\tutorial_v1_contract.test.js
```

Expected:

```text
Canonical app route contract passed.
...
pass 15
fail 0
```

---

### Task 4: Verify local assets and responsive static behavior

**Files:**
- Read: `wound-healing-scratch-assay-analysis/index.html`
- Read: `assets/validation/*`
- Read: `assets/tutorial/**/*`

- [ ] **Step 1: Check all referenced local image assets exist**

Run this PowerShell command:

```powershell
$html = Get-Content wound-healing-scratch-assay-analysis\index.html -Raw
$matches = [regex]::Matches($html, 'src="\.\./([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
$missing = @()
foreach($path in $matches){
  if($path -match '^https?:'){ continue }
  if(-not (Test-Path $path)){ $missing += $path }
}
if($missing.Count){ $missing; exit 1 }
"ALL_GUIDE_ASSETS_EXIST"
```

Expected:

```text
ALL_GUIDE_ASSETS_EXIST
```

- [ ] **Step 2: Run the relevant static tests**

Run:

```powershell
node tests\app_route_contract.test.js
node tests\tutorial_v1_contract.test.js
```

Expected: both pass.

- [ ] **Step 3: Run full test sweep**

Run:

```powershell
$failed=@()
$count=0
Get-ChildItem tests\*.test.js | Sort-Object Name | ForEach-Object {
  $count++
  $log = Join-Path $env:TEMP ('cytomove-test-' + $_.BaseName + '.log')
  node $_.FullName *> $log
  if($LASTEXITCODE -ne 0){
    $failed += $_.Name
    Write-Host "FAIL $($_.Name)"
    Get-Content $log -Tail 100
  } else {
    Write-Host "PASS $($_.Name)"
  }
}
Write-Host "TEST_FILES=$count"
if($failed.Count -gt 0){ Write-Host ("FAILED=" + ($failed -join ',')); exit 1 }
Write-Host "ALL_TEST_FILES_PASSED"
```

Expected:

```text
ALL_TEST_FILES_PASSED
```

---

### Task 5: Commit and hand off for visual review

**Files:**
- Modify: `tests/app_route_contract.test.js`
- Modify: `wound-healing-scratch-assay-analysis/index.html`
- Modify: `tutorial/index.html`
- Optional create: `assets/guide/*` only if new screenshots are genuinely needed

- [ ] **Step 1: Inspect the diff**

Run:

```powershell
git status --short
git diff -- tests/app_route_contract.test.js wound-healing-scratch-assay-analysis/index.html tutorial/index.html
```

Expected: only public guide/tutorial/test files are changed.

- [ ] **Step 2: Commit the guide implementation**

Run:

```powershell
git add tests/app_route_contract.test.js wound-healing-scratch-assay-analysis/index.html tutorial/index.html
git commit -m "feat: add visual tabbed guide"
```

- [ ] **Step 3: Do not push until the user approves the visual result**

Run:

```powershell
git status --short
git log --oneline --decorate -3
```

Expected: working tree clean and the latest commit is `feat: add visual tabbed guide`.

Then ask the user to open the local guide and review the visual result before pushing.
