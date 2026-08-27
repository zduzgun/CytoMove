const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const appJs = fs.readFileSync(path.join(root, 'app/app.js'), 'utf8');
const tutorialHtml = fs.readFileSync(path.join(root, 'tutorial/index.html'), 'utf8');
const appHtml = fs.readFileSync(path.join(root, 'app/index.html'), 'utf8');
const appCss = fs.readFileSync(path.join(root, 'app/styles.css'), 'utf8');

test('full HUVEC tutorial starts from the bundled validation image set', () => {
  assert.match(tutorialHtml, /\.\.\/app\/\?tutorial=huvec-full/);
  assert.doesNotMatch(tutorialHtml, /\.\.\/app\/\?tutorial=m8f/);
  assert.doesNotMatch(tutorialHtml, /\.\.\/app\/\?tutorial=mcf7/);
  assert.doesNotMatch(tutorialHtml, /\.\.\/app\/\?tutorial=manual-hard/);
  assert.match(appHtml, /id="openImageGroupButton"/);
  assert.match(appJs, /'huvec-full':\s*\{/);
  assert.match(appJs, /validationSetId:'full_thread_control'/);
  assert.match(appJs, /preAnalyzeValidationSet:false/);
  assert.match(appJs, /18 images/);
  assert.match(appJs, /selector:'#goToAnalysisFromQc'/);
  assert.match(appJs, /selector:'#rerun'/);
  assert.match(appJs, /selector:'button\[data-module="builder"\]'/);
  assert.match(appJs, /const finalModule=config\.finalModule\|\|'qc'/);
  assert.match(appJs, /const preAnalyze=config\.preAnalyzeValidationSet!==false/);
  assert.match(appJs, /loadServedValidationSet\(config\.validationSetId,\{tutorial:true,finalModule,preAnalyze\}\)/);
  assert.match(appJs, /const finalModule=options\.finalModule\|\|'qc'/);
  assert.match(appJs, /const preAnalyze=options\.preAnalyze!==false/);
  assert.match(appJs, /if\(preAnalyze\)\s*\{/);
  assert.match(appJs, /if\(finalModule==='qc'\)/);
  assert.doesNotMatch(appJs, /loadValidationSet\(config\.validationSetId\)/);
  assert.doesNotMatch(appJs, /switchModule\('qc'\)/);
  assert.match(appJs, /setAppModule\('qc'\)/);
  assert.match(appHtml, /styles\.css\?v=20260625-dark-builder-fix/);
  assert.match(appHtml, /app\.js\?v=20260827-responsive-analysis/);
});

test('full HUVEC validation assets are tracked for the web tutorial', () => {
  const tracked = childProcess
    .execFileSync('git', ['ls-files', 'validation_sets/full_thread_control'], { cwd: root, encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  const jpgs = tracked.filter(file => /\.jpe?g$/i.test(file));
  assert.equal(jpgs.length, 18, 'web HUVEC tutorial should ship 18 tracked validation images');
  assert.ok(
    tracked.includes('validation_sets/full_thread_control/README.md'),
    'web HUVEC tutorial should ship its validation README'
  );
});

test('full HUVEC tutorial teaches crop review before basic analysis tuning', () => {
  const huvecSource = appJs.match(/'huvec-full':\s*\{[\s\S]*?completeBody:'[^']*'[\s\S]*?\n    \},/);
  assert.ok(huvecSource, 'full HUVEC tutorial config should be present');
  const body = huvecSource[0];
  const expectedOrder = [
    "selector:'#qcAdjustCrop'",
    "selector:'#imageQcPanel .qc-preview'",
    "selector:'#qcSaveCrop'",
    "selector:'#imageQcPanel .qc-preview'",
    "selector:'#qcSaveCrop'",
    "selector:'#imageQcPanel .qc-preview'",
    "selector:'#qcSaveCrop'",
    "selector:'#goToAnalysisFromQc'",
    "selector:'button[data-preset=\"rough\"]'",
    "selector:'#rerun'",
    "selector:'#varianceRadius'",
    "selector:'#rerun'",
    "selector:'#applySettingsGroup'",
    "selector:'button[data-module=\"builder\"]'",
    "selector:'#analyzeMissingBuilderGroups'"
  ];
  let cursor = -1;
  for (const snippet of expectedOrder) {
    const next = body.indexOf(snippet, cursor + 1);
    assert.ok(next > cursor, `HUVEC tutorial should include ${snippet} in workflow order`);
    cursor = next;
  }
  assert.match(body, /action:'set-value'/);
  assert.match(body, /event:'input'/);
  assert.match(body, /value:'8'/);
  assert.match(body, /minValue:4/);
  assert.match(body, /Basic analysis tuning/);
  assert.match(body, /Apply to group/);
  assert.doesNotMatch(body, /selector:'#groupNext'/);
  assert.doesNotMatch(body, /selector:'#exportBuilderFigure'/);
  assert.match(body, /Analyze missing groups/);
  assert.match(body, /cytomove:builder-analysis-complete/);
  assert.match(body, /Continue in Playground/);
  assert.match(body, /kare alan.*merkeze/i);
  assert.doesNotMatch(body, /selector:'#qcCropOverlay'/);
  assert.match(appJs, /document\.addEventListener\('input'/);
  assert.match(appJs, /step\.minValue/);
});

test('Image QC crop tutorial uses a single draggable DOM rectangle', () => {
  const drawQcSource = appJs.slice(
    appJs.indexOf('function drawQcCanvas()'),
    appJs.indexOf('function qcCanvasPoint(')
  );
  assert.ok(drawQcSource.includes('renderQcCropOverlay();'), 'QC drawing should render the draggable overlay');
  assert.doesNotMatch(drawQcSource, /strokeRect\(crop\.x\*sx,crop\.y\*sy,crop\.w\*sx,crop\.h\*sy\)/);
  assert.match(appCss, /\.image-qc \.qc-preview canvas\s*\{[^}]*pointer-events:\s*none/i);
  assert.match(appCss, /\.qc-crop-overlay\s*\{[^}]*pointer-events:\s*auto/i);
});

test('tutorial landing page teaches the Cytomove 1.0 workflow', () => {
  assert.match(tutorialHtml, /Image QC\s*→\s*Analysis\s*→\s*Publication Figure Builder\s*→\s*Export/);
  assert.match(tutorialHtml, /600 DPI PNG\/TIFF/i);
  assert.match(tutorialHtml, /Publication-ready figure/i);
  assert.match(tutorialHtml, /Full HUVEC validation tutorial/i);
  assert.match(tutorialHtml, /18 images/i);
  assert.match(tutorialHtml, /Control vs FDI/i);
  assert.match(tutorialHtml, /Manual correction tutorial/i);
  assert.match(tutorialHtml, /\.\.\/app\/\?tutorial=manual/);
  assert.match(tutorialHtml, /Start manual correction/i);
  assert.match(tutorialHtml, /Publication quality figure tutorial/i);
  assert.match(tutorialHtml, /\.\.\/app\/\?tutorial=publication-quality/);
  assert.match(tutorialHtml, /Build publication figure/i);
});

test('publication quality figure tutorial loads the 3-replicate validation set into Builder', () => {
  assert.doesNotMatch(tutorialHtml, /\.\.\/app\/\?tutorial=upload/);
  assert.doesNotMatch(appJs, /tutorial-upload/);
  assert.doesNotMatch(appJs, /Local image loading tutorial/);
  const figureSource = appJs.match(/'publication-quality':\s*\{[\s\S]*?completeBody:'[^']*'[\s\S]*?\n    \},/);
  assert.ok(figureSource, 'publication quality tutorial config should be present');
  const body = figureSource[0];
  const expectedOrder = [
    "selector:'#builderControlGroup'",
    "selector:'#builderControlReplicates'",
    "selector:'#builderTreatmentReplicates'",
    "selector:'#builderMetricSelect'",
    "selector:'#builderSelectedPanel'",
    "selector:'#builderPanelTitle'",
    "selector:'#refreshBuilderFigure'",
    "selector:'#exportBuilderFigure'"
  ];
  let cursor = -1;
  for (const snippet of expectedOrder) {
    const next = body.indexOf(snippet, cursor + 1);
    assert.ok(next > cursor, `publication quality tutorial should include ${snippet} in workflow order`);
    cursor = next;
  }
  assert.match(body, /validationSetId:'full_thread_control'/);
  assert.match(body, /finalModule:'builder'/);
  assert.doesNotMatch(body, /preAnalyzeValidationSet:false/);
  assert.match(body, /3 Control and 3 FDI replicate groups/);
  assert.match(body, /600 DPI PNG\/TIFF/);
});

test('validation tutorials show a centered loading overlay before the coach starts', () => {
  assert.match(appJs, /function showTutorialLoadingOverlay\(config\)/);
  assert.match(appJs, /function hideTutorialLoadingOverlay\(\)/);
  assert.match(appJs, /showTutorialLoadingOverlay\(config\);/);
  assert.match(appJs, /hideTutorialLoadingOverlay\(\);/);
  assert.match(appCss, /\.tutorial-loading-overlay/);
  assert.match(appCss, /\.tutorial-loading-card/);
  assert.match(appJs, /Loading the bundled validation images/);
  const validationLoadBlock = appJs.slice(
    appJs.indexOf('if(config.validationSetId)'),
    appJs.indexOf('const existingGroup=state.customGroups')
  );
  assert.doesNotMatch(
    validationLoadBlock,
    /if\(finalModule!=='builder'\) setupTutorialCoach\(config,\[\]\);/,
    'validation tutorials should wait until images are loaded before rendering the coach'
  );
});

test('M8F guided tutorial remains available internally while hidden from the landing page', () => {
  const m8fSource = appJs.match(/m8f:\s*\{[\s\S]*?completeBody:'[^']*'[\s\S]*?\n    \},/);
  assert.ok(m8fSource, 'M8F tutorial config should be present');
  const body = m8fSource[0];

  [
    "selector:'#goToAnalysisFromQc'",
    "selector:'#rerun'",
    "selector:'button[data-module=\"builder\"]'"
  ].forEach(snippet => assert.ok(body.includes(snippet), `M8F tutorial should include ${snippet}`));

  assert.match(body, /Image QC/);
  assert.match(body, /Analysis/);
  assert.match(body, /Publication Figure Builder/);
  assert.match(body, /control and treatment groups/);
});

test('manual correction tutorial is public and teaches reversible local mask edits', () => {
  assert.match(tutorialHtml, /Launch correction tutorial/i);
  assert.doesNotMatch(tutorialHtml, /Launch hard tutorial/i);
  const manualSource = appJs.match(/manual:\s*\{[\s\S]*?completeBody:'[^']*'[\s\S]*?\n    \},/);
  assert.ok(manualSource, 'manual tutorial config should be present');
  const body = manualSource[0];
  const expectedOrder = [
    "selector:'#qcRotateLeft'",
    "selector:'#goToAnalysisFromQc'",
    "selector:'button[data-preset=\"rough\"]'",
    "selector:'#rerun'",
    "selector:'#tinyIslandMode'",
    "selector:'button[data-brush-mode=\"fill\"]'",
    "selector:'#canvas'",
    "selector:'#undoBrush'",
    "selector:'button[data-brush-mode=\"fill\"]'",
    "selector:'#canvas'",
    "selector:'button[data-brush-mode=\"erase\"]'",
    "selector:'#canvas'",
    "selector:'#resetBrush'"
  ];
  let cursor = -1;
  for (const snippet of expectedOrder) {
    const next = body.indexOf(snippet, cursor + 1);
    assert.ok(next > cursor, `manual tutorial should include ${snippet} in workflow order`);
    cursor = next;
  }
  assert.match(body, /Manual correction tutorial/);
  assert.match(body, /startModule:'qc'/);
  assert.match(body, /starts in Image QC/i);
  assert.match(body, /value:'trace'/);
  assert.match(body, /event:'change'/);
  assert.doesNotMatch(body, /selector:'button\[data-view="mask"\]'/);
  assert.match(body, /event:'cytomove:manual-correction'/);
  assert.doesNotMatch(body, /data-brush-mode="add"/);
  assert.doesNotMatch(body, /data-brush-mode="clean"/);
  assert.match(appJs, /Advanced hard-case correction/);
});

test('tutorial pointer remains visible even when animation does not render', () => {
  assert.match(appCss, /\.tutorial-pointer\.visible\s*\{[^}]*opacity:\s*1/i);
  assert.match(appJs, /pointer\.classList\.add\('visible'\)/);
  assert.match(appJs, /pointer\.classList\.remove\('moving','visible'\)/);
  const pointerKeyframes = appCss.match(/@keyframes tutorialPointerMove\s*\{[\s\S]*?\n    \}/);
  assert.ok(pointerKeyframes, 'tutorial pointer animation should be defined');
  assert.doesNotMatch(pointerKeyframes[0], /100%\s*\{[\s\S]*?opacity:\s*0/i);
});

test('tutorial coach does not double-advance when setup runs more than once', () => {
  assert.match(appJs, /state\.tutorialRender\s*=\s*render/);
  assert.match(appJs, /if\(!state\.tutorialListenersBound\)/);
  assert.match(appJs, /state\.tutorialListenersBound\s*=\s*true/);
  assert.match(appJs, /coach\.onclick\s*=/);
  assert.doesNotMatch(appJs, /coach\.addEventListener\('click'/);
  assert.match(appJs, /clearInterval\(state\.tutorialHighlightTimer\)/);
  assert.doesNotMatch(appJs, /behavior:\s*'smooth'/);
  assert.match(appJs, /behavior:\s*'auto'/);
});

test('tutorial input changes advance only once per step', () => {
  assert.match(appJs, /function scheduleTutorialAdvance\(\)/);
  assert.match(appJs, /state\.tutorialAdvancePending/);
  assert.doesNotMatch(appJs, /setTimeout\(\(\)=>advanceTutorialStep\(\),500\)/);
  assert.match(appJs, /state\.tutorialAdvancePendingStep\s*=\s*state\.tutorial\.stepIndex/);
});

test('completed tutorials point to a playground button at the bottom of the coach', () => {
  const advanceSource = appJs.match(/function advanceTutorialStep\(render\)\s*\{[\s\S]*?\n  \}/);
  assert.ok(advanceSource, 'app.js should expose tutorial advancement');
  assert.doesNotMatch(advanceSource[0], /enterTutorialPlayground/);
  assert.match(appJs, /id="tutorialPlaygroundButton"/);
  assert.match(appJs, /tutorial-final-action/);
  assert.match(appJs, /selector:'#tutorialPlaygroundButton'/);
  assert.match(appJs, /Click Playground to close the guide/);
  assert.doesNotMatch(appJs, /Back to tutorial page/);
});

test('Analyze missing groups advances the tutorial only after Builder analysis completes', () => {
  assert.match(appJs, /document\.addEventListener\('cytomove:builder-analysis-complete'/);
  assert.match(appJs, /document\.dispatchEvent\(new CustomEvent\('cytomove:builder-analysis-complete'/);
  assert.match(appJs, /step\.event!=='cytomove:builder-analysis-complete'/);
});

test('full HUVEC tutorial cannot complete while Builder still has missing group analyses', () => {
  assert.match(appJs, /function tutorialRequiresBuilderMissingGroupsStep\(\)/);
  assert.match(appJs, /builderResultCoverage\(builderSettings\(\)\)/);
  assert.match(appJs, /state\.tutorial\.stepIndex\s*=\s*missingStepIndex/);
  assert.match(appJs, /state\.tutorial\.complete\s*=\s*false/);
  assert.match(appJs, /const completed=tutorialCompletionAllowed\(\)&&state\.tutorial\.complete/);
});
