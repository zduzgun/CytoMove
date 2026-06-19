# QC and Analysis Tool Ownership Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Image QC the single owner of image geometry, replace Analysis geometry controls with a read-only QC input summary, and hide the validation loader outside local QA mode.

**Architecture:** Extend the existing image-level QC metadata and locked snapshot with fine rotation and auto-crop state. Route prepared analysis images exclusively through that snapshot, while keeping FOV cutoff and microscope mode as Analysis-owned segmentation parameters. Gate validation-loader UI with a small environment predicate and leave normal Builder flow focused on analyzed groups.

**Tech Stack:** Vanilla JavaScript, HTML canvas, static HTML/CSS, Node.js contract tests, in-app browser QA.

---

## File Structure

- Modify `prototype_refactor/index.html`: consolidate geometry controls in Image QC, remove duplicate Analysis controls, add the QC Input summary, and wrap validation controls in a QA-only container.
- Modify `prototype_refactor/styles.css`: style the new QC geometry controls and read-only QC Input summary.
- Modify `prototype_refactor/app.js`: extend QC state/snapshot, route fine rotation and auto-crop through QC, render the Analysis summary, remove duplicate event dependencies, and gate/guard the validation loader.
- Modify `tests/publication_figure_builder_static.test.js`: add structural and pure-function regression contracts for tool ownership, snapshot summaries, validation visibility, and failure cleanup.

### Task 1: Gate the Validation Loader to QA Context

**Files:**
- Modify: `prototype_refactor/index.html:374-386`
- Modify: `prototype_refactor/app.js:338-420`
- Modify: `prototype_refactor/app.js:7160-7210`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Write failing tests for the QA visibility predicate**

Add:

```js
const validationToolsSource = js.match(/function validationToolsEnabled\(locationLike\)\s*\{[\s\S]*?\n  \}/);
assert(validationToolsSource, 'app.js should expose validationToolsEnabled');
const validationSandbox = {};
vm.runInNewContext(
  `${validationToolsSource[0]}; this.validationToolsEnabled = validationToolsEnabled;`,
  validationSandbox
);
assert.strictEqual(
  validationSandbox.validationToolsEnabled({hostname:'localhost',search:''}),
  true,
  'Validation tools should show on localhost'
);
assert.strictEqual(
  validationSandbox.validationToolsEnabled({hostname:'127.0.0.1',search:''}),
  true,
  'Validation tools should show on loopback'
);
assert.strictEqual(
  validationSandbox.validationToolsEnabled({hostname:'cytomove.example',search:'?validation=1'}),
  true,
  'Validation query parameter should opt into QA tools'
);
assert.strictEqual(
  validationSandbox.validationToolsEnabled({hostname:'cytomove.example',search:''}),
  false,
  'Validation tools should be hidden in normal hosted use'
);
```

Add an HTML contract:

```js
assert(html.includes('id="builderValidationTools" hidden'), 'Validation controls should start hidden');
```

- [ ] **Step 2: Run the contract test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `app.js should expose validationToolsEnabled`.

- [ ] **Step 3: Wrap the validation controls**

Replace the standalone validation control and load button with:

```html
<div id="builderValidationTools" hidden>
  <div class="control">
    <label for="builderValidationSet">Validation set</label>
    <select id="builderValidationSet">
      <option value="">None</option>
      <option value="full_thread_control">HUVEC control vs FDI (3 replicates)</option>
    </select>
  </div>
  <button class="btn" id="loadBuilderValidationSet" type="button" style="width:100%;margin-top:7px;">Load validation set</button>
</div>
```

- [ ] **Step 4: Implement the visibility predicate and startup sync**

Add:

```js
function validationToolsEnabled(locationLike=window.location) {
  const host=String(locationLike?.hostname||'').toLowerCase();
  const search=String(locationLike?.search||'');
  return host==='localhost'||host==='127.0.0.1'||new URLSearchParams(search).get('validation')==='1';
}

function syncValidationToolsVisibility() {
  const host=document.getElementById('builderValidationTools');
  if(host) host.hidden=!validationToolsEnabled();
}
```

Call `syncValidationToolsVisibility()` during initialization after DOM references exist.

- [ ] **Step 5: Run test and syntax checks**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
node --check prototype_refactor\app.js
```

Expected: both commands exit `0`.

- [ ] **Step 6: Commit the QA gate**

```powershell
git add prototype_refactor/index.html prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "feat: gate validation tools to QA mode"
```

### Task 2: Make Validation Loading Atomic and User-Safe

**Files:**
- Modify: `prototype_refactor/app.js:7143-7210`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Write failing contracts for availability and cleanup helpers**

Add:

```js
const validationMessageSource = js.match(/function validationAssetErrorMessage\(\)\s*\{[\s\S]*?\n  \}/);
assert(validationMessageSource, 'app.js should expose validationAssetErrorMessage');
const validationMessageSandbox = {};
vm.runInNewContext(
  `${validationMessageSource[0]}; this.validationAssetErrorMessage = validationAssetErrorMessage;`,
  validationMessageSandbox
);
assert(
  validationMessageSandbox.validationAssetErrorMessage().includes('Validation images are unavailable in this build'),
  'Validation failure should use a user-safe message'
);

const loaderSource = js.match(/async function loadServedValidationSet\(setId\)\s*\{[\s\S]*?\n  \}/);
assert(loaderSource, 'app.js should expose loadServedValidationSet');
assert(loaderSource[0].includes('await fetchServedImageFile(config.groups[0].files[0])'), 'Loader should probe assets before creating groups');
assert(loaderSource[0].includes('cleanupImportedValidationGroups(imported)'), 'Loader should clean partial imports on failure');
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `app.js should expose validationAssetErrorMessage`.

- [ ] **Step 3: Add the safe message and cleanup helper**

Add:

```js
function validationAssetErrorMessage() {
  return 'Validation images are unavailable in this build. Run the app from the repository root or provide the local validation assets.';
}

function cleanupImportedValidationGroups(imported=[]) {
  const groupIds=new Set(imported.map(item=>item.groupId).filter(Boolean));
  const sampleIds=new Set(imported.flatMap(item=>(item.samples||[]).map(sample=>sample.id)));
  state.customGroups=state.customGroups.filter(group=>!groupIds.has(group.id));
  state.customSamples=state.customSamples.filter(sample=>!sampleIds.has(sample.id));
  populateGroups();
}
```

- [ ] **Step 4: Probe before mutation and clean failure state**

At the start of the `try` block:

```js
await fetchServedImageFile(config.groups[0].files[0]);
```

Declare `const imported=[];` before `try`, remove its inner declaration, and replace the catch block with:

```js
} catch(err) {
  cleanupImportedValidationGroups(imported);
  setLog(`<strong>Validation set unavailable.</strong> ${validationAssetErrorMessage()}`);
}
```

- [ ] **Step 5: Run tests**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
node --check prototype_refactor\app.js
```

Expected: both commands exit `0`.

- [ ] **Step 6: Commit atomic validation loading**

```powershell
git add prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "fix: make validation loading atomic"
```

### Task 3: Extend Image-Level QC Geometry State

**Files:**
- Modify: `prototype_refactor/app.js:3693-3704`
- Modify: `prototype_refactor/app.js:5098-5127`
- Modify: `prototype_refactor/app.js:5380-5470`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Write failing state-contract tests**

Add:

```js
assert(js.includes("fineRotation:0"), 'QC state should store fine rotation');
assert(js.includes("autoCropFov:false"), 'QC state should store auto-crop preference');
assert(js.includes("fineRotation:Number(qc.fineRotation)||0"), 'QC state application should restore fine rotation');
assert(js.includes("autoCropFov:!!qc.autoCropFov"), 'Locked QC snapshot should preserve auto-crop state');
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `QC state should store fine rotation`.

- [ ] **Step 3: Extend the QC default state**

Use:

```js
return store[sampleId]||(store[sampleId]={
  orientation:'vertical',
  cropRatio:null,
  cropSaved:false,
  rotation:0,
  fineRotation:0,
  autoCropFov:false,
  excluded:false,
  editedAt:null,
  needsCrop:false,
  borderCheckPerformed:false
});
```

- [ ] **Step 4: Restore geometry controls from QC state**

Inside `applyQcStateToCurrentImage`:

```js
const fineRotation=Number(qc.fineRotation)||0;
if(el.qcFineRotation) el.qcFineRotation.value=String(fineRotation);
if(el.qcFineRotationVal) el.qcFineRotationVal.value=String(fineRotation);
if(el.deskewAngle) el.deskewAngle.value=String(fineRotation);
if(el.deskewAngleVal) el.deskewAngleVal.value=String(fineRotation);
```

- [ ] **Step 5: Include fields in locked snapshots**

In `buildLockedQcSnapshot`, include:

```js
fineRotation:Number(qc.fineRotation)||0,
autoCropFov:!!qc.autoCropFov,
```

- [ ] **Step 6: Run automated verification**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
node --check prototype_refactor\app.js
```

Expected: both commands exit `0`.

- [ ] **Step 7: Commit QC geometry state**

```powershell
git add prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "feat: persist QC geometry metadata"
```

### Task 4: Consolidate Geometry Controls in Image QC

**Files:**
- Modify: `prototype_refactor/index.html:483-509`
- Modify: `prototype_refactor/styles.css:92-117`
- Modify: `prototype_refactor/app.js:399-445`
- Modify: `prototype_refactor/app.js:5198-5230`
- Modify: `prototype_refactor/app.js:7280-7310`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Write failing HTML and symbol contracts**

Add required IDs:

```js
[
  'qcFineRotation',
  'qcFineRotationVal',
  'qcAngleRulerToggle',
  'qcAutoCropFov',
  'qcResetCrop'
].forEach(id => {
  assert(html.includes(`id="${id}"`), `Image QC should expose #${id}`);
});
```

Add removal assertions:

```js
assert(!html.includes('id="qcCopyCrop"'), 'Image QC should not expose duplicate copy-to-all crop control');
```

- [ ] **Step 2: Run test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `Image QC should expose #qcFineRotation`.

- [ ] **Step 3: Replace the QC tool markup**

After the rotate buttons add:

```html
<div class="control">
  <label for="qcFineRotation">Fine rotation (deg)</label>
  <div class="range-row">
    <input id="qcFineRotation" type="range" min="-20" max="20" value="0" step="0.5">
    <input class="value-input" id="qcFineRotationVal" type="number" min="-20" max="20" value="0" step="0.5">
  </div>
</div>
<button class="btn" id="qcAngleRulerToggle" type="button">Show angle ruler</button>
<label class="check-row" for="qcAutoCropFov">
  <input id="qcAutoCropFov" type="checkbox">
  Auto crop FOV
</label>
<button class="btn" id="qcAdjustCrop" type="button">Adjust crop</button>
<button class="btn" id="qcSaveCrop" type="button" disabled>Save crop</button>
<button class="btn" id="qcResetCrop" type="button">Reset crop</button>
```

Remove:

```html
<button class="btn" id="qcCopyCrop" ...>Copy crop to all images</button>
```

- [ ] **Step 4: Add DOM references**

Add:

```js
qcFineRotation: document.getElementById('qcFineRotation'),
qcFineRotationVal: document.getElementById('qcFineRotationVal'),
qcAngleRulerToggle: document.getElementById('qcAngleRulerToggle'),
qcAutoCropFov: document.getElementById('qcAutoCropFov'),
qcResetCrop: document.getElementById('qcResetCrop'),
```

Remove the `qcCopyCrop` reference.

- [ ] **Step 5: Implement QC geometry handlers**

Add:

```js
function applyQcFineRotation(value) {
  if(!state.sample) return;
  const next=Math.max(-20,Math.min(20,Number(value)||0));
  updateQcState(state.sample.id,{fineRotation:next});
  applyQcStateToCurrentImage(state.sample);
  renderImageQcPanel();
}

function toggleQcAngleRuler() {
  state.rulerVisible=!state.rulerVisible;
  syncLabels();
  drawQcCanvas();
}

function toggleQcAutoCrop(checked) {
  if(!state.sample||!state.imageOriginal) return;
  const crop=checked?autoCropForImage(state.imageOriginal,true,Number(el.fovCutoff.value)||0):null;
  updateQcState(state.sample.id,{
    autoCropFov:!!checked,
    cropRatio:crop?.active?normalizedCropRatio(crop,state.imageOriginal):null,
    cropSaved:!!crop?.active
  });
  applyQcStateToCurrentImage(state.sample);
  renderImageQcPanel();
}

function resetQcCrop() {
  if(!state.sample) return;
  updateQcState(state.sample.id,{cropRatio:null,cropSaved:false,autoCropFov:false});
  releasePreparedQcImage(state.sample.id);
  applyQcStateToCurrentImage(state.sample);
  renderImageQcPanel();
}
```

- [ ] **Step 6: Bind QC controls**

Use the existing `bindNumberPair` helper:

```js
bindNumberPair(el.qcFineRotation,el.qcFineRotationVal,()=>applyQcFineRotation(el.qcFineRotation.value));
el.qcAngleRulerToggle.addEventListener('click',toggleQcAngleRuler);
el.qcAutoCropFov.addEventListener('change',()=>toggleQcAutoCrop(el.qcAutoCropFov.checked));
el.qcResetCrop.addEventListener('click',resetQcCrop);
```

Remove the `qcCopyCrop` listener and delete `qcCopyCropToAll`.

- [ ] **Step 7: Run tests**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
node --check prototype_refactor\app.js
```

Expected: both commands exit `0`.

- [ ] **Step 8: Commit consolidated QC controls**

```powershell
git add prototype_refactor/index.html prototype_refactor/styles.css prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "feat: consolidate geometry tools in Image QC"
```

### Task 5: Remove Duplicate Analysis Geometry UI

**Files:**
- Modify: `prototype_refactor/index.html:193-225`
- Modify: `prototype_refactor/app.js:6858-7006`
- Modify: `prototype_refactor/app.js:7370-7440`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Write failing removal contracts**

Add:

```js
[
  'scratchOrientation',
  'deskewAngle',
  'angleRulerToggle',
  'autoCropFov',
  'applyCropRatioGroup',
  'adjustCrop',
  'applyCrop',
  'resetCrop'
].forEach(id => {
  assert(!html.includes(`id="${id}"`), `Analysis should not expose duplicate #${id}`);
});
assert(html.includes('id="fovCutoff"'), 'Analysis should retain FOV cutoff');
assert(html.includes('id="microscopeMode"'), 'Analysis should retain microscope mode');
```

- [ ] **Step 2: Run test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `Analysis should not expose duplicate #scratchOrientation`.

- [ ] **Step 3: Remove duplicate markup**

Delete the Analysis controls for:

- Scratch orientation
- Fine rotation
- Angle ruler
- Auto crop FOV
- Apply current crop ratio to group
- Adjust crop
- Apply crop
- Reset crop

Keep FOV cutoff and microscope mode.

- [ ] **Step 4: Remove duplicate subpanel composition**

Change Advanced Geometry nodes to only the Analysis-owned FOV control if needed, or remove the subpanel and leave FOV cutoff in Basic Analysis:

```js
const basic=createSubpanel('Basic analysis','segmentation-basic',true,[
  byId('varianceRadius'),
  byId('thresholdOffset'),
  byId('minComponent'),
  byId('tinyIslandMode'),
  document.getElementById('microscopeMode')?.closest('.control'),
  byId('fovCutoff')
]);
```

Do not create `segmentation-advanced`.

- [ ] **Step 5: Guard or remove old DOM-dependent bindings**

Delete event bindings for removed controls:

```js
bindNumberPair(el.deskewAngle,...)
el.angleRulerToggle.addEventListener(...)
bindPendingControl(el.autoCropFov,...)
bindPendingControl(el.applyCropRatioGroup,...)
el.adjustCrop.addEventListener(...)
el.applyCrop.addEventListener(...)
el.resetCrop.addEventListener(...)
```

Retain internal hidden compatibility values only if algorithm functions still require them. Prefer replacing direct DOM reads with locked QC snapshot values in Task 7.

- [ ] **Step 6: Run tests and fix null-reference regressions**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
node --check prototype_refactor\app.js
```

Expected: both commands exit `0`.

- [ ] **Step 7: Commit Analysis UI cleanup**

```powershell
git add prototype_refactor/index.html prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "refactor: remove duplicate Analysis geometry controls"
```

### Task 6: Add the Read-Only QC Input Summary

**Files:**
- Modify: `prototype_refactor/index.html:135-140`
- Modify: `prototype_refactor/styles.css`
- Modify: `prototype_refactor/app.js`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Write failing summary tests**

Add:

```js
assert(html.includes('id="qcInputSummary"'), 'Analysis should expose the QC Input summary');
assert(html.includes('id="editQcInput"'), 'QC Input summary should link back to Image QC');

const summarySource = js.match(/function summarizeQcInput\(samples, snapshot\)\s*\{[\s\S]*?\n  \}/);
assert(summarySource, 'app.js should expose summarizeQcInput');
const summarySandbox = {};
vm.runInNewContext(
  `${summarySource[0]}; this.summarizeQcInput = summarizeQcInput;`,
  summarySandbox
);
assert.deepStrictEqual(
  {...summarySandbox.summarizeQcInput(
    [{id:'a'},{id:'b'},{id:'c'}],
    [
      {sampleId:'a',cropRatio:{x:0,y:0,w:1,h:1},rotation:0,fineRotation:0,excluded:false},
      {sampleId:'b',cropRatio:null,rotation:90,fineRotation:0,excluded:false},
      {sampleId:'c',cropRatio:null,rotation:0,fineRotation:2.5,excluded:true}
    ]
  )},
  {imageCount:3,excludedCount:1,croppedCount:1,rotatedCount:2,locked:true},
  'QC Input summary should count geometry and exclusions'
);
```

- [ ] **Step 2: Run test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `Analysis should expose the QC Input summary`.

- [ ] **Step 3: Add summary markup**

After Presets add:

```html
<div class="section" id="qcInputSection">
  <div class="section-title">QC Input</div>
  <div class="qc-input-summary" id="qcInputSummary">No QC input loaded.</div>
  <button class="btn" id="editQcInput" type="button" style="width:100%;">Edit in Image QC</button>
</div>
```

- [ ] **Step 4: Add summary styles**

Add:

```css
.qc-input-summary {
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: #f7fbfa;
  color: var(--muted);
  font-size: 11.5px;
  line-height: 1.45;
  margin-bottom: 8px;
}
```

- [ ] **Step 5: Implement summary calculation**

Add:

```js
function summarizeQcInput(samples=[], snapshot=state.lockedQcSnapshot) {
  const items=Array.isArray(snapshot)?snapshot:[];
  return {
    imageCount:samples.length,
    excludedCount:items.filter(item=>item.excluded).length,
    croppedCount:items.filter(item=>item.cropRatio).length,
    rotatedCount:items.filter(item=>(Number(item.rotation)||0)!==0||(Number(item.fineRotation)||0)!==0||item.orientation==='horizontal').length,
    locked:items.length>0
  };
}

function renderQcInputSummary() {
  if(!el.qcInputSummary) return;
  const summary=summarizeQcInput(selectedGroupSamples());
  el.qcInputSummary.textContent=summary.imageCount
    ? `QC input: ${summary.imageCount-summary.excludedCount} included / ${summary.imageCount} images · ${summary.croppedCount} cropped · ${summary.rotatedCount} rotated · ${summary.locked?'snapshot locked':'working state'}`
    : 'No QC input loaded.';
}
```

- [ ] **Step 6: Bind Edit in Image QC**

Add DOM references and:

```js
el.editQcInput.addEventListener('click',()=>{
  setAppModule('qc');
  if(state.lockedQcSnapshot) {
    setLog('<strong>QC snapshot is locked.</strong> Changes require a new Analysis run.');
  }
});
```

Call `renderQcInputSummary()` from `setAppModule('analysis')`, group selection changes, and after locking a QC snapshot.

- [ ] **Step 7: Run tests**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
node --check prototype_refactor\app.js
```

Expected: both commands exit `0`.

- [ ] **Step 8: Commit the QC summary**

```powershell
git add prototype_refactor/index.html prototype_refactor/styles.css prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "feat: add Analysis QC input summary"
```

### Task 7: Route Analysis Geometry Exclusively Through the QC Snapshot

**Files:**
- Modify: `prototype_refactor/app.js:1832-1925`
- Modify: `prototype_refactor/app.js:5200-5410`
- Modify: `prototype_refactor/app.js:6420-6545`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Write failing routing contracts**

Add:

```js
assert(js.includes('settingsWithQcSnapshot'), 'Analysis should derive settings from QC snapshots');
assert(js.includes('fineRotation:qcSnapshot?.fineRotation??0'), 'Analysis settings should use QC fine rotation');
assert(js.includes('cropRatio:qcSnapshot?.cropRatio||null'), 'Analysis settings should use QC crop');
assert(!js.includes('el.applyCropRatioGroup.checked&&state.cropManual'), 'Analysis should not derive group crop from removed UI');
```

- [ ] **Step 2: Run test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `Analysis settings should use QC fine rotation`.

- [ ] **Step 3: Extend `settingsWithQcSnapshot`**

Use:

```js
function settingsWithQcSnapshot(settings, sample) {
  const qcSnapshot=qcSnapshotForSample(sample?.id);
  return {
    ...settings,
    scratchOrientation:qcSnapshot?.orientation||'vertical',
    rotation:Number(qcSnapshot?.rotation)||0,
    fineRotation:qcSnapshot?.fineRotation??0,
    cropRatio:qcSnapshot?.cropRatio||null,
    autoCrop:false
  };
}
```

- [ ] **Step 4: Apply crop and rotation once in analysis**

Update preview and full-resolution analysis paths to:

1. use the prepared QC image if available
2. otherwise apply `cropRatio`
3. apply orientation/rotation/fine rotation once
4. run segmentation with Analysis-owned FOV cutoff

Do not read removed DOM controls.

- [ ] **Step 5: Remove group-crop derivation from Analysis settings**

Replace:

```js
cropRatio:el.applyCropRatioGroup.checked&&state.cropManual&&state.crop?normalizedCropRatio(state.crop):null
```

with:

```js
cropRatio:null
```

The per-sample snapshot supplies crop later through `settingsWithQcSnapshot`.

- [ ] **Step 6: Run automated tests**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
node --check prototype_refactor\app.js
git diff --check -- prototype_refactor/app.js prototype_refactor/index.html prototype_refactor/styles.css tests/publication_figure_builder_static.test.js
```

Expected: all commands exit `0`.

- [ ] **Step 7: Commit snapshot-only geometry routing**

```powershell
git add prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "refactor: route Analysis geometry through QC snapshots"
```

### Task 8: Cache Bust and End-to-End Browser QA

**Files:**
- Modify: `prototype_refactor/index.html:737`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Add a failing cache-bust assertion**

Use:

```js
assert(
  html.includes('app.js?v=20260619-qc-tool-ownership'),
  'index.html should cache-bust app.js for QC tool ownership'
);
```

- [ ] **Step 2: Run test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `index.html should cache-bust app.js`.

- [ ] **Step 3: Update the script query**

Use:

```html
<script src="app.js?v=20260619-qc-tool-ownership"></script>
```

- [ ] **Step 4: Run complete automated verification**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
node --check prototype_refactor\app.js
git diff --check -- prototype_refactor/app.js prototype_refactor/index.html prototype_refactor/styles.css tests/publication_figure_builder_static.test.js
```

Expected: static contract passes, syntax passes, and diff check reports no errors.

- [ ] **Step 5: Run validation visibility QA**

Verify in the in-app browser:

1. Open a hosted-like URL without `validation=1` and confirm validation controls are absent.
2. Open localhost and confirm validation controls are present.
3. Open `?validation=1` and confirm validation controls are present.
4. Temporarily request an unavailable asset and confirm the safe validation-unavailable message appears with no partial groups.

- [ ] **Step 6: Run QC ownership QA**

Using a three-image group:

1. Set orientation and fine rotation on image 1.
2. Enable angle ruler and confirm it appears on the QC preview.
3. Save a crop and verify continuous crop workflow remains intact.
4. Navigate away and back; verify fine rotation and crop are restored.
5. Confirm no copy-to-all crop button exists.

- [ ] **Step 7: Run Analysis ownership QA**

1. Continue to Analysis and confirm duplicate geometry controls are absent.
2. Confirm FOV cutoff and microscope mode remain.
3. Confirm QC Input summary reports included, cropped, rotated, and locked state.
4. Run Apply and Apply to group.
5. Confirm segmentation and restored group results work without console errors.
6. Click Edit in Image QC and verify the locked-snapshot warning.

- [ ] **Step 8: Run Builder regression QA**

1. Select analyzed control/treatment groups.
2. Render Preview.
3. Confirm replicate selections and mean ± SD plots still work.
4. Confirm Export Builder ZIP remains enabled.

- [ ] **Step 9: Commit final integration**

```powershell
git add prototype_refactor/app.js prototype_refactor/index.html prototype_refactor/styles.css tests/publication_figure_builder_static.test.js
git commit -m "feat: finalize QC and Analysis tool ownership"
```
