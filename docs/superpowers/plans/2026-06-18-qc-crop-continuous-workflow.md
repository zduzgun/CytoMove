# QC Crop Continuous Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make saved QC crops render as cropped previews, carry the same crop ratio into the automatically opened next image with Adjust mode active, and remain on the final cropped image after saving.

**Architecture:** Keep crop persistence in the existing image-level `imageQcState` and group-level `lastQcCropTemplateByGroup`. Add explicit navigation options for the save-driven auto-advance path so manual navigation keeps its current behavior. Render the QC canvas from the saved crop only when Adjust mode is closed; when Adjust mode is open, render the raw image plus the editable overlay.

**Tech Stack:** Vanilla JavaScript, HTML canvas, Node.js static contract tests, in-app browser QA.

---

## File Structure

- Modify `prototype_refactor/app.js`: QC preview rendering, save-driven navigation options, automatic Adjust activation, final-image behavior, and crop error recovery.
- Modify `prototype_refactor/index.html`: update the `app.js` cache-busting query string after behavior changes.
- Modify `tests/publication_figure_builder_static.test.js`: add regression contracts for cropped preview selection, auto-advance options, and final-image behavior.

### Task 1: Define Saved Preview and Auto-Advance Decisions

**Files:**
- Modify: `prototype_refactor/app.js:4863-4923`
- Modify: `prototype_refactor/app.js:5154-5178`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Write failing tests for the decision helpers**

Add tests that extract and execute two pure helpers:

```js
const qcPreviewCropSource = js.match(/function qcPreviewCrop\(qc, crop\)\s*\{[\s\S]*?\n  \}/);
assert(qcPreviewCropSource, 'app.js should expose qcPreviewCrop');
const qcWorkflowSandbox = {};
vm.runInNewContext(
  `${qcPreviewCropSource[0]}; this.qcPreviewCrop = qcPreviewCrop;`,
  qcWorkflowSandbox
);
assert.deepStrictEqual(
  {...qcWorkflowSandbox.qcPreviewCrop({cropSaved:true}, {x:20,y:10,w:80,h:60,active:true})},
  {x:20,y:10,w:80,h:60,active:true},
  'Saved QC crops should render as cropped previews outside Adjust mode'
);
assert.strictEqual(
  qcWorkflowSandbox.qcPreviewCrop({cropSaved:false}, {x:20,y:10,w:80,h:60,active:true}),
  null,
  'Unsaved crop templates should not crop the normal preview'
);

const qcAutoAdvanceSource = js.match(/function qcCropAutoAdvanceTarget\(currentIndex, sampleCount\)\s*\{[\s\S]*?\n  \}/);
assert(qcAutoAdvanceSource, 'app.js should expose qcCropAutoAdvanceTarget');
vm.runInNewContext(
  `${qcAutoAdvanceSource[0]}; this.qcCropAutoAdvanceTarget = qcCropAutoAdvanceTarget;`,
  qcWorkflowSandbox
);
assert.strictEqual(qcWorkflowSandbox.qcCropAutoAdvanceTarget(0,3),1);
assert.strictEqual(qcWorkflowSandbox.qcCropAutoAdvanceTarget(2,3),null);
```

- [ ] **Step 2: Run the static contract test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `app.js should expose qcPreviewCrop`.

- [ ] **Step 3: Add the minimal pure helpers**

Add near `cropForQcSample`:

```js
function qcPreviewCrop(qc, crop) {
  return qc?.cropSaved&&crop?.active?crop:null;
}

function qcCropAutoAdvanceTarget(currentIndex, sampleCount) {
  return currentIndex>=0&&currentIndex<sampleCount-1?currentIndex+1:null;
}
```

- [ ] **Step 4: Run the static contract test and verify GREEN**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: `Publication Figure Builder static contract passed.`

- [ ] **Step 5: Commit the helper contract**

```powershell
git add prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "test: define continuous QC crop decisions"
```

### Task 2: Render Saved Crops as Cropped QC Previews

**Files:**
- Modify: `prototype_refactor/app.js:4863-4923`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Add a failing source contract for crop-based canvas drawing**

Add:

```js
const drawQcCanvasSource = js.match(/function drawQcCanvas\(\)\s*\{[\s\S]*?\n  \}/);
assert(drawQcCanvasSource, 'app.js should expose drawQcCanvas');
assert(
  drawQcCanvasSource[0].includes('qcPreviewCrop(qc,state.crop)'),
  'QC canvas should select a saved crop for normal preview'
);
assert(
  drawQcCanvasSource[0].includes('drawImage(displayImg,previewCrop.x,previewCrop.y'),
  'QC canvas should draw only the saved crop bounds'
);
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `QC canvas should select a saved crop for normal preview`.

- [ ] **Step 3: Update `drawQcCanvas` to choose raw or cropped preview**

Replace the fixed raw-image sizing/drawing section with:

```js
const qc=sample?qcStateForSample(sample.id):null;
const previewCrop=!state.cropEditing?qcPreviewCrop(qc,state.crop):null;
const sourceW=previewCrop?.w||displayImg.naturalWidth;
const sourceH=previewCrop?.h||displayImg.naturalHeight;
const maxW=1100, maxH=760;
const scale=Math.min(1,maxW/sourceW,maxH/sourceH);
const w=Math.max(1,Math.round(sourceW*scale));
const h=Math.max(1,Math.round(sourceH*scale));

if(el.qcCanvas.width!==w) el.qcCanvas.width=w;
if(el.qcCanvas.height!==h) el.qcCanvas.height=h;

const ctx=el.qcCanvas.getContext('2d');
ctx.clearRect(0,0,w,h);

if(previewCrop) {
  ctx.drawImage(
    displayImg,
    previewCrop.x,previewCrop.y,previewCrop.w,previewCrop.h,
    0,0,w,h
  );
  state.qcPreviewBaseCanvas=null;
  state.qcPreviewBaseImage=null;
} else {
  if(
    state.qcPreviewBaseImage!==displayImg
    || !state.qcPreviewBaseCanvas
    || state.qcPreviewBaseCanvas.width!==w
    || state.qcPreviewBaseCanvas.height!==h
  ) {
    const base=document.createElement('canvas');
    base.width=w;
    base.height=h;
    base.getContext('2d').drawImage(displayImg,0,0,w,h);
    state.qcPreviewBaseCanvas=base;
    state.qcPreviewBaseImage=displayImg;
  }
  ctx.drawImage(state.qcPreviewBaseCanvas,0,0);
}
```

Keep the existing dimmed outside-crop treatment only inside `if(state.cropEditing)`.

- [ ] **Step 4: Run syntax and static tests**

Run:

```powershell
node --check prototype_refactor\app.js
node tests\publication_figure_builder_static.test.js
```

Expected: both commands exit `0`.

- [ ] **Step 5: Commit cropped preview rendering**

```powershell
git add prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "feat: show saved QC crops in preview"
```

### Task 3: Auto-Open Adjust Mode on Save-Driven Navigation

**Files:**
- Modify: `prototype_refactor/app.js:5098-5111`
- Modify: `prototype_refactor/app.js:5154-5178`
- Modify: `prototype_refactor/app.js:5403-5427`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Add failing contracts for navigation options**

Add:

```js
const loadQcSampleSource = js.match(/function loadQcSampleAt\(index, options=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(loadQcSampleSource, 'loadQcSampleAt should accept workflow options');
assert(
  loadQcSampleSource[0].includes('openAdjust:!!options.openAdjust'),
  'Save-driven navigation should pass openAdjust into image loading'
);

const applyQcStateSource = js.match(/function applyQcStateToCurrentImage\(sample=state.sample, options=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(applyQcStateSource, 'app.js should expose applyQcStateToCurrentImage');
assert(
  applyQcStateSource[0].includes('state.cropEditing=!!options.openAdjust'),
  'Loaded QC images should open Adjust mode only when requested'
);

const applyQcCropSource = js.match(/function applyQcCrop\(\)\s*\{[\s\S]*?\n  \}/);
assert(
  applyQcCropSource[0].includes('loadQcSampleAt(nextIndex,{openAdjust:true})'),
  'Saving a non-final crop should auto-open Adjust on the next image'
);
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `loadQcSampleAt should accept workflow options`.

- [ ] **Step 3: Thread the `openAdjust` option through image loading**

Change:

```js
function loadQcSampleAt(index, options={}) {
  const samples=selectedGroupSamples();
  const sample=samples[index];
  if(!sample) {
    renderImageQcPanel();
    return;
  }
  loadImage(sampleUrl(sample),sample,sample.path,true,{
    fromQc:true,
    autoApplyAfterLoad:false,
    openAdjust:!!options.openAdjust
  });
}
```

In `loadImage`, pass the option when applying QC state:

```js
applyQcStateToCurrentImage(sample,{
  preparedInput:!!options.preparedQc,
  openAdjust:!!options.openAdjust
});
```

Update the end of `applyQcStateToCurrentImage`:

```js
state.cropEditing=!!options.openAdjust;
state.cropDragging=false;
state.qcOverlayDrag=null;
```

- [ ] **Step 4: Preserve the crop template while activating Adjust**

Keep:

```js
const cropRatio=options.preparedInput?null:cropForQcSample(qc,currentGroupCropTemplate());
state.crop=cropRatio?cropFromRatio(state.imageOriginal,cropRatio):null;
state.cropManual=!!cropRatio;
```

This ensures an unsaved next image receives the group template without setting `cropSaved`.

- [ ] **Step 5: Update save-driven navigation**

Inside `applyQcCrop`, replace the current next-image condition with:

```js
const nextIndex=qcCropAutoAdvanceTarget(currentIndex,samples.length);
renderImageQcPanel();
if(nextIndex!==null) loadQcSampleAt(nextIndex,{openAdjust:true});
```

- [ ] **Step 6: Run syntax and static tests**

Run:

```powershell
node --check prototype_refactor\app.js
node tests\publication_figure_builder_static.test.js
```

Expected: both commands exit `0`.

- [ ] **Step 7: Commit automatic Adjust workflow**

```powershell
git add prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "feat: continue QC crops in adjust mode"
```

### Task 4: Preserve Adjust Mode on Crop Preparation Failure

**Files:**
- Modify: `prototype_refactor/app.js:5403-5427`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Add a failing error-path contract**

Add:

```js
const applyQcCropFailureSource = js.match(/function applyQcCrop\(\)\s*\{[\s\S]*?\n  \}/);
assert(
  applyQcCropFailureSource[0].includes('state.cropEditing=true'),
  'Crop preparation failure should keep Adjust mode active'
);
assert(
  applyQcCropFailureSource[0].includes('drawQcCanvas()'),
  'Crop preparation failure should redraw the editable crop'
);
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `Crop preparation failure should keep Adjust mode active`.

- [ ] **Step 3: Update the failure handler**

Use:

```js
}).catch(error=>{
  state.cropEditing=true;
  state.cropDragging=false;
  state.qcOverlayDrag=null;
  if(el.qcSaveCrop) el.qcSaveCrop.disabled=false;
  drawQcCanvas();
  setLog(`<strong>Crop preparation failed.</strong> ${escHtml(error?.message||String(error))}`);
});
```

- [ ] **Step 4: Run tests**

Run:

```powershell
node --check prototype_refactor\app.js
node tests\publication_figure_builder_static.test.js
```

Expected: both commands exit `0`.

- [ ] **Step 5: Commit error recovery**

```powershell
git add prototype_refactor/app.js tests/publication_figure_builder_static.test.js
git commit -m "fix: preserve QC crop editor on failure"
```

### Task 5: Cache Bust and Browser QA

**Files:**
- Modify: `prototype_refactor/index.html:737`
- Test: `tests/publication_figure_builder_static.test.js`

- [ ] **Step 1: Add a failing cache-bust assertion**

Change the HTML assertion to:

```js
assert(
  html.includes('app.js?v=20260618-qc-continuous-crop'),
  'index.html should cache-bust app.js for the continuous QC crop workflow'
);
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
```

Expected: FAIL with `index.html should cache-bust app.js`.

- [ ] **Step 3: Update the script query**

Use:

```html
<script src="app.js?v=20260618-qc-continuous-crop"></script>
```

- [ ] **Step 4: Run the complete automated verification**

Run:

```powershell
node tests\publication_figure_builder_static.test.js
node --check prototype_refactor\app.js
git diff --check -- prototype_refactor/app.js prototype_refactor/index.html tests/publication_figure_builder_static.test.js
```

Expected: static contract passes, syntax check exits `0`, and diff check reports no errors.

- [ ] **Step 5: Run browser interaction QA**

Start or reuse the local server:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Test this exact flow in the in-app browser:

1. Open `http://127.0.0.1:8765/prototype_refactor/`.
2. Load a group with at least three images.
3. Open Image QC and Adjust crop on the first image.
4. Save the crop.
5. Verify the second image opens automatically with the same relative crop and visible editable overlay.
6. Adjust and save the second image.
7. Save the final image.
8. Verify the final image remains selected, the overlay closes, and only the cropped preview is shown.
9. Navigate backward and verify each image restores its own saved crop.
10. Confirm browser console has no relevant warnings or errors.

- [ ] **Step 6: Commit final workflow**

```powershell
git add prototype_refactor/app.js prototype_refactor/index.html tests/publication_figure_builder_static.test.js
git commit -m "feat: complete continuous QC crop workflow"
```
