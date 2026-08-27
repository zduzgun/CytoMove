const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

const html = read('app/index.html');
const js = read('app/app.js');
const css = read('app/styles.css');
const specPath = path.join(root, 'docs/superpowers/specs/2026-06-16-publication-figure-builder-v1-design.md');

assert(fs.existsSync(specPath), 'Publication Figure Builder design spec should be saved as markdown');
assert(
  html.includes('app.js?v=20260827-responsive-analysis'),
  'index.html should cache-bust the canonical app.js asset'
);

const builderSettingsSource = js.slice(
  js.indexOf('function builderSettings()'),
  js.indexOf('function builderGroupRows(')
);
assert(
  builderSettingsSource.includes('persistBuilderRepresentativeSelections();'),
  'builderSettings should persist current representative selections'
);
assert(
  builderSettingsSource.indexOf('persistBuilderRepresentativeSelections();') <
    builderSettingsSource.indexOf('populateBuilderGroupSelects();'),
  'builderSettings should persist the current representative selections before rebuilding group selects'
);
assert(
  js.includes("builderState.controlRepresentativeId=el.builderControlGroup?.value||builderState.controlRepresentativeId||'';") &&
    js.includes("builderState.treatmentRepresentativeId=el.builderTreatmentGroup?.value||builderState.treatmentRepresentativeId||'';"),
  'representative group selections should be copied into builder state before an update'
);
const persistRepresentativeSource = js.match(
  /function persistBuilderRepresentativeSelections\(\) \{[\s\S]*?\n  \}/
);
assert(persistRepresentativeSource, 'representative selection persistence helper should exist');
const representativeSandbox = {
  state: {
    publicationBuilderState: {
      controlRepresentativeId: 'control_r1',
      treatmentRepresentativeId: 'treatment_r1'
    }
  },
  el: {
    builderControlGroup: { value: 'control_r3' },
    builderTreatmentGroup: { value: 'treatment_r2' }
  }
};
vm.runInNewContext(
  `${persistRepresentativeSource[0]}; persistBuilderRepresentativeSelections();`,
  representativeSandbox
);
assert.strictEqual(
  representativeSandbox.state.publicationBuilderState.controlRepresentativeId,
  'control_r3',
  'Update Figure should preserve the newly selected control representative'
);
assert.strictEqual(
  representativeSandbox.state.publicationBuilderState.treatmentRepresentativeId,
  'treatment_r2',
  'Update Figure should preserve the newly selected treatment representative'
);
const uniqueIdsSource = js.match(/function uniqueIds\(list\)\s*\{[\s\S]*?\n  \}/);
const syncBuilderSelectionsSource = js.match(/function syncPublicationBuilderSelections\(groups=groupOptions\(\)\)\s*\{[\s\S]*?\n  \}/);
assert(uniqueIdsSource, 'app.js should expose uniqueIds');
assert(syncBuilderSelectionsSource, 'app.js should expose syncPublicationBuilderSelections');
function syncedBuilderStateForGroups(groups, publicationBuilderState={}) {
  const sandbox = {state:{publicationBuilderState}};
  vm.runInNewContext(
    `${uniqueIdsSource[0]}; ${syncBuilderSelectionsSource[0]}; syncPublicationBuilderSelections(${JSON.stringify(groups)});`,
    sandbox
  );
  return sandbox.state.publicationBuilderState;
}
const singleGroupBuilderState = syncedBuilderStateForGroups([{id:'local-1',label:'Local group 1'}]);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(singleGroupBuilderState.controlReplicateIds)),
  ['local-1'],
  'A single loaded group should become the Control replicate'
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(singleGroupBuilderState.treatmentReplicateIds)),
  [],
  'A single loaded group should not be auto-copied into Treatment replicates'
);
assert.strictEqual(
  singleGroupBuilderState.treatmentRepresentativeId,
  '',
  'A single loaded group should leave the Treatment representative blank'
);
const singleGroupClearedTreatmentState = syncedBuilderStateForGroups(
  [{id:'local-1',label:'Local group 1'}],
  {
    controlReplicateIds:['local-1'],
    treatmentReplicateIds:['local-1'],
    controlRepresentativeId:'local-1',
    treatmentRepresentativeId:'local-1'
  }
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(singleGroupClearedTreatmentState.treatmentReplicateIds)),
  [],
  'Returning to one available group should clear any self-treatment assignment'
);
assert.strictEqual(
  singleGroupClearedTreatmentState.treatmentRepresentativeId,
  '',
  'Returning to one available group should clear the self-treatment representative'
);
const twoGroupBuilderState = syncedBuilderStateForGroups([
  {id:'control-1',label:'Control 1'},
  {id:'treatment-1',label:'Treatment 1'}
]);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(twoGroupBuilderState.treatmentReplicateIds)),
  ['treatment-1'],
  'When a second group exists, Builder should default Treatment to the second group'
);
assert(
  js.includes("key==='treatmentReplicateIds'&&groups.length<2") &&
    js.includes('Add another group to choose Treatment.'),
  'Treatment replicate controls should stay empty until a second group exists'
);
assert(
  js.includes('el.addBuilderTreatmentArm.disabled=groups.length<2'),
  'Extra treatment groups should not be addable until at least two groups exist'
);
assert(
  css.includes('[hidden] { display: none !important; }'),
  'Hidden controls such as Analyze missing groups should not be overridden by .btn display styles'
);
assert(
  html.includes('id="builderTitle"'),
  'Publication Figure Builder title should be runtime-updatable for single-group and comparative figures'
);
assert(
  html.includes('id="builderControlGroupLabel"') &&
    html.includes('id="builderControlReplicatesLabel"') &&
    html.includes('id="builderTreatmentGroupControl"') &&
    html.includes('id="builderTreatmentReplicatesControl"'),
  'Builder controls should expose addressable labels/sections for single-group terminology'
);
const renderPublicationBuilderSource = js.slice(
  js.indexOf('function renderPublicationBuilder()'),
  js.indexOf('function updateBuilderCanvasDisplay')
);
assert(
  renderPublicationBuilderSource.includes('if(!settings.controlReplicateIds.length)') &&
    !renderPublicationBuilderSource.includes('if(!settings.controlReplicateIds.length||!settings.treatmentReplicateIds.length)'),
  'Builder should render a single-group figure when only one analyzed group is selected'
);
assert(
  js.includes('function builderIsSingleGroup(settings)') &&
    js.includes('function builderSingleGroupLabel(settings)') &&
    js.includes('builderIsSingleGroup(settings)?builderSingleGroupLabel(settings):settings.controlLabel'),
  'Single-group Builder mode should use the group label, not Control/Treatment labels'
);
assert(
  js.includes("el.builderControlGroupLabel.textContent=groups.length<2?'Representative group':'Control representative group'") &&
    js.includes("el.builderControlReplicatesLabel.textContent=groups.length<2?'Selected image group':'Control replicates'") &&
    js.includes('el.builderTreatmentGroupControl.hidden=groups.length<2') &&
    js.includes('el.builderTreatmentReplicatesControl.hidden=groups.length<2'),
  'Single-group Builder mode should hide Treatment controls and remove Control wording from visible labels'
);
assert(
  renderPublicationBuilderSource.includes("builderTitle.textContent=builderIsSingleGroup(settings)?'Single group figure':'Control vs Treatment figure'"),
  'Builder heading should switch to a single-group figure title when no Treatment group is selected'
);
assert(
  js.includes('if(el.analyzeMissingBuilderGroups) {') &&
    js.includes('el.analyzeMissingBuilderGroups.hidden=true;') &&
    js.includes('el.analyzeMissingBuilderGroups.disabled=true;'),
  'Builder should disable Analyze missing groups when no image group is selected'
);
assert(
  js.includes('Builder needs an image group before missing analyses can run.'),
  'Analyze missing groups should guard only against an empty Builder selection'
);
assert(
  html.includes('id="builderValidationTools"') && !html.includes('id="builderValidationTools" hidden'),
  'Publication Figure Builder should expose validation example data controls in the web app'
);
assert(
  html.includes('Example validation data') &&
    html.includes('HUVEC control vs FDI (3 replicates)') &&
    html.includes('Load validation set'),
  'Builder validation controls should clearly offer the bundled 3-replicate HUVEC example set'
);
assert(
  js.includes('function syncValidationToolsVisibility()') &&
    js.includes('host.hidden=false'),
  'Validation tools visibility sync should keep the example data controls visible'
);
assert(
  js.includes("loadServedValidationSet(el.builderValidationSet?.value,{finalModule:'builder',preAnalyze:true})"),
  'Builder validation button should load the bundled data directly into Publication Figure Builder'
);
assert(
  js.includes("el.loadBuilderValidationSet.textContent=preAnalyze?'Analyzing validation set...':'Loading validation set...'") &&
    js.includes('el.loadBuilderValidationSet.textContent=validationButtonLabel'),
  'Builder validation button should show visible loading/analyzing feedback and then restore its label'
);

[
  'moduleTabs',
  'qcModuleTab',
  'imageQcPanel',
  'qcImageList',
  'qcCanvas',
  'qcCropOverlay',
  'qcOrientation',
  'qcRotateLeft',
  'qcRotateRight',
  'qcExcludeToggle',
  'goToAnalysisFromQc',
  'publicationBuilderPanel',
  'builderControlGroup',
  'builderTreatmentGroup',
  'builderControlReplicates',
  'builderTreatmentReplicates',
  'builderTreatmentArms',
  'addBuilderTreatmentArm',
  'builderValidationSet',
  'loadBuilderValidationSet',
  'builderScaleValue',
  'builderScaleMode',
  'builderMetricSelect',
  'exportBuilderFigure'
].forEach(id => {
  assert(html.includes(`id="${id}"`), `index.html should expose #${id}`);
});

[
  'Image QC',
  'Publication Figure Builder',
  'Control vs Treatment',
  'Control vs multiple treatments',
  '+ Add treatment group',
  'Scale bar',
  'Caption draft'
].forEach(text => {
  assert(html.includes(text), `index.html should contain "${text}"`);
});

const removedAnalysisGeometryIds = [
  'scratchOrientation',
  'deskewAngle',
  'angleRulerToggle',
  'autoCropFov',
  'applyCropRatioGroup',
  'adjustCrop',
  'applyCrop',
  'resetCrop'
];
removedAnalysisGeometryIds.forEach(id => {
  assert(
    !html.includes(`id="${id}"`),
    `Analysis should not expose duplicate geometry control #${id}`
  );
  assert(
    !new RegExp(`\\b${id}:\\s*document\\.getElementById\\('${id}'\\)`).test(js),
    `app.js should not query removed Analysis geometry control #${id}`
  );
});
[
  'bindNumberPair(el.deskewAngle',
  'el.angleRulerToggle.addEventListener',
  'bindPendingControl(el.scratchOrientation',
  'bindPendingControl(el.autoCropFov',
  'bindPendingControl(el.applyCropRatioGroup',
  'el.adjustCrop.addEventListener',
  'el.applyCrop.addEventListener',
  'el.resetCrop.addEventListener'
].forEach(eventPath => {
  assert(
    !js.includes(eventPath),
    `app.js should not bind removed Analysis geometry path ${eventPath}`
  );
});
[
  'fovCutoff',
  'microscopeMode',
  'qcOrientation',
  'qcFineRotation',
  'qcAngleRulerToggle',
  'qcAutoCropFov',
  'qcAdjustCrop',
  'qcSaveCrop',
  'qcResetCrop',
  'qcImagePosition',
  'qcAdvanceNotice'
].forEach(id => {
  assert(html.includes(`id="${id}"`), `#${id} should remain available under its owning panel`);
});

[
  'qcSnapshotForSample',
  'sampleExcludedFromAnalysis',
  'settingsWithQcSnapshot',
  'buildLockedQcSnapshot',
  'analysisInputFromQcSnapshot',
  'continueFromQcToAnalysis',
  'applyQcOrientation',
  'applyQcRotation',
  'applyQcCrop',
  'toggleQcExclude',
  'renderQcCropOverlay',
  'beginQcOverlayDrag',
  'updateQcOverlayDrag',
  'finishQcOverlayDrag',
  'updateQcOverlayRect',
  'qcPreviewBaseCanvas',
  'renderImageQcPanel',
  'renderQcImageList',
  'loadQcSampleAt',
  'qcStatusLabel',
  'imageQcState',
  'lockedQcSnapshot',
  'qcStateForSample',
  'updateQcState',
  'resetLockedQcSnapshot',
  'lastQcCropTemplateByGroup',
  'lastQcCropTemplate',
  'preparedQcImages',
  'cropForQcSample',
  'prepareQcAnalysisInput',
  'analysisImageUrl',
  'releasePreparedQcImage',
  'publicationBuilderState',
  'builderConditionRows',
  'aggregateBuilderConditionRows',
  'renderBuilderReplicateOptions',
  'loadServedValidationSet',
  'renderPublicationBuilder',
  'builderFigureRows',
  'drawBuilderFigurePanel',
  'exportPublicationBuilderZip',
  'builderCaptionDraft',
  'drawScaleBar'
].forEach(symbol => {
  assert(js.includes(symbol), `app.js should define or use ${symbol}`);
});

const validationToolsSource = js.match(/function validationToolsEnabled\(locationLike\)\s*\{[\s\S]*?\n  \}/);
assert(validationToolsSource, 'app.js should expose validationToolsEnabled');
const validationSandbox = {URLSearchParams};
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
  'Validation query parameter should keep example data visible'
);
assert.strictEqual(
  validationSandbox.validationToolsEnabled({hostname:'cytomove.example',search:''}),
  true,
  'Validation example data should be visible in normal hosted use'
);

const syncValidationToolsSource = js.match(/function syncValidationToolsVisibility\(\)\s*\{[\s\S]*?\n  \}/);
assert(syncValidationToolsSource, 'app.js should expose syncValidationToolsVisibility');
function validationToolsHiddenFor(location) {
  const wrapper = {hidden:false};
  const sandbox = {
    URLSearchParams,
    window:{location},
    document:{
      getElementById(id) {
        return id==='builderValidationTools'?wrapper:null;
      }
    }
  };
  vm.runInNewContext(
    `${validationToolsSource[0]}; ${syncValidationToolsSource[0]}; syncValidationToolsVisibility();`,
    sandbox
  );
  return wrapper.hidden;
}
assert.strictEqual(
  validationToolsHiddenFor({hostname:'cytomove.example',search:''}),
  false,
  'Validation tools wrapper should be shown for normal hosted use'
);
assert.strictEqual(
  validationToolsHiddenFor({hostname:'localhost',search:''}),
  false,
  'Validation tools wrapper should be shown on localhost'
);
assert.strictEqual(
  validationToolsHiddenFor({hostname:'cytomove.example',search:'?validation=1'}),
  false,
  'Validation tools wrapper should be shown when validation=1 is requested'
);

const initializationSource = js.slice(js.lastIndexOf('syncLabels();'));
assert(
  /bindEvents\(\);\s*syncValidationToolsVisibility\(\);/.test(initializationSource),
  'Initialization should sync validation tool visibility after DOM references and event bindings are ready'
);

const continueFromQcSource = js.match(/async function continueFromQcToAnalysis\(\)\s*\{[\s\S]*?\n  \}/);
assert(continueFromQcSource, 'app.js should expose continueFromQcToAnalysis');
assert(
  continueFromQcSource[0].includes('setQcTransitionPending(true)') &&
  continueFromQcSource[0].includes('setQcTransitionPending(false)'),
  'Continue to Analysis should acquire and release one central QC transition lock'
);
assert(
  continueFromQcSource[0].includes('clearAnalysisTransitionDisplay()') &&
  continueFromQcSource[0].includes("setMode('group',{scheduleMicroscope:false})") &&
  continueFromQcSource[0].includes("setAppModule('analysis')") &&
  continueFromQcSource[0].includes('loadGroupSampleAt(0)') &&
  !continueFromQcSource[0].includes('force:true'),
  'Continue to Analysis should clear the stale image, enter Group mode, and load the first group image'
);
assert(
  continueFromQcSource[0].indexOf('state.lockedQcSnapshot=buildLockedQcSnapshot(samples)') <
    continueFromQcSource[0].indexOf('clearAnalysisTransitionDisplay()') &&
  continueFromQcSource[0].indexOf('clearAnalysisTransitionDisplay()') <
    continueFromQcSource[0].indexOf("setMode('group',{scheduleMicroscope:false})") &&
  continueFromQcSource[0].indexOf("setMode('group',{scheduleMicroscope:false})") <
    continueFromQcSource[0].indexOf("setAppModule('analysis')") &&
  continueFromQcSource[0].indexOf("setAppModule('analysis')") <
    continueFromQcSource[0].indexOf('loadGroupSampleAt(0)'),
  'Continue to Analysis should lock QC, clear stale display, activate Group mode, reveal Analysis, then load image 1'
);
assert(
  !continueFromQcSource[0].includes('runSegmentation') &&
    !continueFromQcSource[0].includes('autoApplyAfterLoad:true'),
  'Continue to Analysis should not automatically analyze the first image'
);
const clearTransitionDisplaySource = js.match(/function clearAnalysisTransitionDisplay\(\)\s*\{[\s\S]*?\n  \}/);
assert(clearTransitionDisplaySource, 'app.js should expose a focused stale Analysis display reset');
[
  'state.imageLoadSeq=(state.imageLoadSeq||0)+1',
  'state.image=null',
  'state.sample=null',
  'el.canvas.hidden=true',
  'el.emptyState.hidden=false'
].forEach(fragment => {
  assert(
    clearTransitionDisplaySource[0].includes(fragment),
    `Analysis transition display reset should perform ${fragment}`
  );
});
assert(
  !clearTransitionDisplaySource[0].includes('URL.revokeObjectURL') &&
    !clearTransitionDisplaySource[0].includes('state.objectUrls'),
  'Analysis transition display reset should not delete session image resources'
);
assert(
  continueFromQcSource[0].includes('cancelAutoApply()') &&
  continueFromQcSource[0].includes('cancelGroupMicroscopeAutoDetect()'),
  'Continue to Analysis should cancel every pending automatic analysis path'
);
assert(
  /await awaitTrackedQcOperations\(\)[\s\S]*state\.lockedQcSnapshot=buildLockedQcSnapshot/.test(continueFromQcSource[0]),
  'Continue to Analysis should await every tracked QC operation before locking the snapshot'
);
assert(
  continueFromQcSource[0].includes('finally'),
  'Continue to Analysis should always release the transition lock'
);
assert(
  js.includes("el.goToAnalysisFromQc.addEventListener('click',()=>{ continueFromQcToAnalysis().catch"),
  'The async Continue handler should handle rejected transitions safely'
);

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

const validationSessionSnapshotSource = js.match(/function validationSessionSnapshot\(stateLike, elements=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(validationSessionSnapshotSource, 'app.js should expose validationSessionSnapshot');
const validationSessionSnapshotSandbox = {};
vm.runInNewContext(
  `${validationSessionSnapshotSource[0]}; this.validationSessionSnapshot = validationSessionSnapshot;`,
  validationSessionSnapshotSandbox
);
const priorImageReference = {id:'prior-image'};
const priorSampleReference = {id:'prior-sample'};
const priorResultReference = {area:42};
const validationSessionSnapshot = validationSessionSnapshotSandbox.validationSessionSnapshot(
  {
    appModule:'analysis',
    mode:'group',
    image:priorImageReference,
    imageOriginal:priorImageReference,
    imageName:'prior.jpg',
    sample:priorSampleReference,
    result:priorResultReference,
    crop:{x:1,y:2,w:30,h:40},
    cropManual:true,
    cropEditing:true,
    rotation:90,
    zoom:1.5,
    panX:12,
    panY:-4,
    rulerVisible:true,
    rulerOffsetX:8,
    rulerOffsetY:9,
    panelSettings:{presetKey:'fine',varianceRadius:7},
    sampleSettings:{'prior-sample':{presetKey:'fine'}},
    lockedQcSnapshot:[{sampleId:'prior-sample'}],
    calibrationReport:{status:'prior'},
    microscopeModeUserSet:true,
    lastAutoMicroscopeGroupKey:'prior-group-key',
    contourStyleUserSet:true,
    publicationBuilderState:{controlReplicateIds:['old-control'],treatmentReplicateIds:['old-treatment']},
    customGroups:[{id:'existing-group'}],
    customSamples:[{id:'existing-sample'}],
    objectUrls:['blob:existing']
  },
  {
    groupSelect:{value:'existing-group'},
    sampleSelect:{value:'existing-sample'},
    builderControlLabel:{value:'Old control'},
    builderTreatmentLabel:{value:'Old treatment'},
    builderCellType:{value:'Old cells'},
    builderReplicate:{value:'n=2'},
    canvasTitle:{textContent:'Prior title'},
    canvasMeta:{textContent:'Prior meta'},
    canvas:{hidden:false},
    emptyState:{hidden:true}
  }
);
assert.strictEqual(validationSessionSnapshot.image,priorImageReference,'Validation snapshot should preserve the active image reference');
assert.strictEqual(validationSessionSnapshot.sample,priorSampleReference,'Validation snapshot should preserve the active sample reference');
assert.strictEqual(validationSessionSnapshot.result,priorResultReference,'Validation snapshot should preserve the active result reference');
assert(validationSessionSnapshot.panelSettings,'Validation snapshot should include active analysis panel settings');
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(validationSessionSnapshot.panelSettings)),
  {presetKey:'fine',varianceRadius:7},
  'Validation snapshot should preserve the active analysis panel settings'
);
assert(validationSessionSnapshot.sampleSettings,'Validation snapshot should include pre-load sample settings');
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(validationSessionSnapshot.sampleSettings)),
  {'prior-sample':{presetKey:'fine'}},
  'Validation snapshot should preserve pre-load sample settings'
);
assert(validationSessionSnapshot.lockedQcSnapshot,'Validation snapshot should include the prior locked QC snapshot');
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(validationSessionSnapshot.lockedQcSnapshot)),
  [{sampleId:'prior-sample'}],
  'Validation snapshot should preserve the prior locked QC snapshot'
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(validationSessionSnapshot.publicationBuilderState)),
  {controlReplicateIds:['old-control'],treatmentReplicateIds:['old-treatment']},
  'Validation snapshot should preserve builder assignments'
);
assert.strictEqual(validationSessionSnapshot.builderControlLabel,'Old control');
assert(validationSessionSnapshot.crop,'Validation snapshot should include crop state');
assert.deepStrictEqual(JSON.parse(JSON.stringify(validationSessionSnapshot.crop)),{x:1,y:2,w:30,h:40});
assert.strictEqual(validationSessionSnapshot.zoom,1.5);
assert.strictEqual(validationSessionSnapshot.rulerVisible,true);
assert.strictEqual(validationSessionSnapshot.canvasTitle,'Prior title');

const validationAnalysisCompleteSource = js.match(/function validationGroupAnalysisComplete\(samples=\[\], context=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(validationAnalysisCompleteSource, 'app.js should expose validationGroupAnalysisComplete');
const validationAnalysisSandbox = {};
vm.runInNewContext(
  `${validationAnalysisCompleteSource[0]}; this.validationGroupAnalysisComplete = validationGroupAnalysisComplete;`,
  validationAnalysisSandbox
);
assert.strictEqual(
  validationAnalysisSandbox.validationGroupAnalysisComplete([],{
    groupResults:{},
    manualOverrides:{},
    excludedSampleIds:[]
  }),
  false,
  'Validation analysis should reject a group with no eligible samples'
);
assert.strictEqual(
  validationAnalysisSandbox.validationGroupAnalysisComplete([{id:'partial'}],{
    groupResults:{partial:{area:1}},
    manualOverrides:{},
    excludedSampleIds:[]
  }),
  false,
  'Validation analysis should reject a result missing a finite core width metric'
);
assert.strictEqual(
  validationAnalysisSandbox.validationGroupAnalysisComplete([{id:'valid'}],{
    groupResults:{valid:{area:1,wMean:2}},
    manualOverrides:{},
    excludedSampleIds:[]
  }),
  true,
  'Validation analysis should accept finite core result fields'
);
assert.strictEqual(
  validationAnalysisSandbox.validationGroupAnalysisComplete([{id:'manual'},{id:'excluded'}],{
    groupResults:{},
    manualOverrides:{manual:{result:{area:3,wMean:4}}},
    excludedSampleIds:['excluded']
  }),
  true,
  'Validation analysis should accept a valid manual override and ignore excluded samples'
);

const validationLoadErrorMessageSource = js.match(/function validationLoadErrorMessage\(err\)\s*\{[\s\S]*?\n  \}/);
assert(validationLoadErrorMessageSource, 'app.js should expose validationLoadErrorMessage');
const validationLoadErrorSandbox = {
  validationAssetErrorMessage:()=> 'Validation images are unavailable in this build.'
};
vm.runInNewContext(
  `${validationLoadErrorMessageSource[0]}; this.validationLoadErrorMessage = validationLoadErrorMessage;`,
  validationLoadErrorSandbox
);
assert.strictEqual(
  validationLoadErrorSandbox.validationLoadErrorMessage({name:'ValidationAssetError'}),
  'Validation images are unavailable in this build.',
  'Asset failures should use the asset-unavailable message'
);
assert.strictEqual(
  validationLoadErrorSandbox.validationLoadErrorMessage({validationKind:'analysis'}),
  'Validation analysis could not be completed in this session.',
  'Analysis failures should use a distinct safe message'
);
assert.strictEqual(
  validationLoadErrorSandbox.validationLoadErrorMessage(new Error('../private/path/image.jpg')),
  'Validation analysis could not be completed in this session.',
  'Unknown runtime failures should not expose technical paths'
);

const validationOwnershipSnapshotSource = js.match(/function validationOwnershipSnapshot\(stateLike\)\s*\{[\s\S]*?\n  \}/);
const recordValidationOwnershipSource = js.match(/function recordValidationOwnershipChanges\(ownership, before, after\)\s*\{[\s\S]*?\n  \}/);
assert(validationOwnershipSnapshotSource, 'app.js should expose validationOwnershipSnapshot');
assert(recordValidationOwnershipSource, 'app.js should expose recordValidationOwnershipChanges');
const ownershipSandbox = {};
vm.runInNewContext(
  `${validationOwnershipSnapshotSource[0]}; ${recordValidationOwnershipSource[0]};
   this.validationOwnershipSnapshot=validationOwnershipSnapshot;
   this.recordValidationOwnershipChanges=recordValidationOwnershipChanges;`,
  ownershipSandbox
);
const ownership = {groupIds:[],sampleIds:[],objectUrls:[]};
const ownershipBefore = ownershipSandbox.validationOwnershipSnapshot({
  customGroups:[{id:'keep-group'}],
  customSamples:[{id:'keep-sample'}],
  objectUrls:['blob:keep']
});
const ownershipAfter = ownershipSandbox.validationOwnershipSnapshot({
  customGroups:[{id:'keep-group'},{id:'owned-group'}],
  customSamples:[{id:'keep-sample'},{id:'owned-sample'}],
  objectUrls:['blob:keep','blob:owned']
});
ownershipSandbox.recordValidationOwnershipChanges(ownership,ownershipBefore,ownershipAfter);
assert.deepStrictEqual(JSON.parse(JSON.stringify(ownership)),{
  groupIds:['owned-group'],
  sampleIds:['owned-sample'],
  objectUrls:['blob:owned']
},'Validation ownership should record only resources created by one transaction step');

const validationCleanupSource = js.match(/function cleanupValidationOwnedResources\(ownership\)\s*\{[\s\S]*?\n  \}/);
assert(validationCleanupSource, 'app.js should expose cleanupValidationOwnedResources');
const revokedValidationUrls = [];
let validationGroupsRefreshCount = 0;
const validationCleanupSandbox = {
  state:{
    customGroups:[
      {id:'keep-group',sampleIds:['keep-sample']},
      {id:'remove-group',sampleIds:['remove-sample']}
    ],
    customSamples:[
      {id:'keep-sample',url:'blob:keep'},
      {id:'remove-sample',url:'blob:remove'}
    ],
    objectUrls:['blob:keep','blob:remove'],
    groupResults:{},
    manualOverrides:{},
    sampleSettings:{},
    imageQcState:{},
    lastQcCropTemplateByGroup:{}
  },
  URL:{revokeObjectURL:url=>revokedValidationUrls.push(url)},
  releasePreparedQcImage:()=>{},
  clearQcCropCache:()=>{},
  populateGroups:()=>{ validationGroupsRefreshCount+=1; }
};
vm.runInNewContext(
  `${validationCleanupSource[0]}; cleanupValidationOwnedResources({
    groupIds:['remove-group'],
    sampleIds:['remove-sample'],
    objectUrls:['blob:remove']
  });`,
  validationCleanupSandbox
);
assert.deepStrictEqual(
  validationCleanupSandbox.state.customGroups.map(group=>group.id),
  ['keep-group'],
  'Validation cleanup should remove only partially imported groups'
);
assert.deepStrictEqual(
  validationCleanupSandbox.state.customSamples.map(sample=>sample.id),
  ['keep-sample'],
  'Validation cleanup should remove only partially imported samples'
);
assert.deepStrictEqual(
  validationCleanupSandbox.state.objectUrls,
  ['blob:keep'],
  'Validation cleanup should remove revoked URLs from session tracking'
);
assert.deepStrictEqual(
  revokedValidationUrls,
  ['blob:remove'],
  'Validation cleanup should revoke imported sample object URLs'
);
assert.strictEqual(validationGroupsRefreshCount,1,'Validation cleanup should refresh group options once');

const restoreValidationValuesSource = js.match(/function restoreValidationSessionValues\(stateLike, elements, snapshot\)\s*\{[\s\S]*?\n  \}/);
assert(restoreValidationValuesSource, 'app.js should expose restoreValidationSessionValues');
const restoredState = {};
const restoredElements = {
  groupSelect:{value:''},
  sampleSelect:{value:''},
  builderControlLabel:{value:''},
  builderTreatmentLabel:{value:''},
  builderCellType:{value:''},
  builderReplicate:{value:''},
  canvasTitle:{textContent:''},
  canvasMeta:{textContent:''},
  canvas:{hidden:true,style:{transform:''}},
  emptyState:{hidden:false}
};
vm.runInNewContext(
  `${restoreValidationValuesSource[0]}; restoreValidationSessionValues(stateLike,elements,snapshot);`,
  {stateLike:restoredState,elements:restoredElements,snapshot:validationSessionSnapshot}
);
assert.strictEqual(restoredState.appModule,'analysis');
assert.strictEqual(restoredState.mode,'group');
assert.deepStrictEqual(JSON.parse(JSON.stringify(restoredState.crop)),{x:1,y:2,w:30,h:40});
assert.strictEqual(restoredState.cropManual,true);
assert.strictEqual(restoredState.cropEditing,true);
assert.strictEqual(restoredState.zoom,1.5);
assert.strictEqual(restoredState.rulerVisible,true);
assert.strictEqual(restoredElements.groupSelect.value,'existing-group');
assert.strictEqual(restoredElements.canvasTitle.textContent,'Prior title');
assert.strictEqual(restoredElements.canvas.hidden,false);

const loaderSource = js.match(/async function loadServedValidationSet\(setId, options=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(loaderSource, 'app.js should expose loadServedValidationSet');
const loaderBody = loaderSource[0];
const importedDeclarationIndex = loaderBody.indexOf('const imported=[];');
const loaderTryIndex = loaderBody.indexOf('try {');
const preflightIndex = loaderBody.indexOf('await Promise.all(validationPaths.map(async relativePath=>');
const firstMutationIndex = loaderBody.indexOf('createCustomGroupFromFiles(');
assert(importedDeclarationIndex>=0, 'Validation loader should declare imported before entering its try block');
assert(
  importedDeclarationIndex<loaderTryIndex,
  'Validation loader should keep the imported collection available to its catch block'
);
assert(preflightIndex>=0, 'Validation loader should fetch all validation assets in parallel before importing groups');
assert(
  loaderBody.includes("const preAnalyze=options.preAnalyze!==false") &&
    loaderBody.includes('if(preAnalyze)') &&
    loaderBody.includes('await analyzeImportedGroup(group.groupId)'),
  'Validation loader should allow QC-first tutorials to import images immediately without pre-analysis'
);
assert(
  loaderBody.includes("const finalModule=options.finalModule||'qc'") &&
    loaderBody.includes("if(finalModule==='qc')") &&
    loaderBody.includes("setAppModule('qc')") &&
    loaderBody.includes('loadQcSampleAt(0,{openAdjust:false})'),
  'Validation-backed tutorials should return to Image QC and open the first image instead of jumping straight to Builder'
);
assert(
  preflightIndex<firstMutationIndex,
  'Validation loader should complete its full asset preflight before creating any custom group'
);
assert(
  loaderBody.includes('const validationFiles=new Map()') &&
    loaderBody.includes('validationFiles.get(relativePath)') &&
    !loaderBody.includes('files.push(await fetchServedImageFile(relativePath))'),
  'Validation loader should reuse preflight files instead of downloading them again serially'
);
assert(
  loaderBody.includes('cleanupValidationOwnedResources(ownership)'),
  'Validation loader should clean only transaction-owned resources on failure'
);
assert(
  loaderBody.includes('restoreValidationSessionState(sessionSnapshot)'),
  'Validation loader should restore its prior session state on failure'
);
assert(
  loaderBody.includes('validationGroupAnalysisComplete('),
  'Validation loader should verify imported analysis completeness before success'
);
assert(
  loaderBody.includes('builderResultCoverage(builderSettings())') &&
    loaderBody.includes('await analyzeMissingBuilderGroups()'),
  'Builder validation load should resolve any current-QC coverage gaps before showing the Builder preview'
);
assert(
  loaderBody.includes('let validationAnalysisIncomplete=false') &&
    loaderBody.includes("if(finalModule==='builder') {") &&
    loaderBody.includes('validationAnalysisIncomplete=true') &&
    loaderBody.includes('continue;') &&
    loaderBody.includes('Some images still need analysis in this browser'),
  'Builder validation load should keep fetched images available when automatic analysis is incomplete'
);
assert(loaderBody.includes('state.validationLoadActive=true'),'Validation loader should activate its mutation guard');
assert(loaderBody.includes('setValidationLoadControlsLocked(true)'),'Validation loader should lock local mutation controls');
assert(loaderBody.includes('recordValidationOwnershipChanges('),'Validation loader should record ownership around each group creation');
assert(loaderBody.includes('state.validationLoadActive=false'),'Validation loader should clear its mutation guard in finally');
assert(loaderBody.includes('validationLoaded'),'Validation loader should distinguish success when restoring selector availability');
assert(
  loaderBody.includes('validationLoadErrorMessage(err)'),
  'Validation loader should select a safe message by failure type'
);
assert(
  !loaderBody.includes('${err.message||err}'),
  'Validation loader should not expose raw technical paths or fetch errors'
);
assert(
  /finally\s*\{[\s\S]*loadBuilderValidationSet\.disabled=false[\s\S]*setSpinner\(false\)/.test(loaderBody),
  'Validation loader should always restore its button and spinner'
);

const analyzeImportedGroupSource = js.match(/async function analyzeImportedGroup\(groupId\)\s*\{[\s\S]*?\n  \}/);
assert(analyzeImportedGroupSource, 'app.js should expose analyzeImportedGroup');
assert(
  analyzeImportedGroupSource[0].includes('el.groupSelect.value=groupId'),
  'Validation analysis should select each imported group before rendering its canvases'
);
assert(
  analyzeImportedGroupSource[0].includes("settingsFromPresetKey('standard')") &&
    analyzeImportedGroupSource[0].includes("setMode('group',{scheduleMicroscope:false})"),
  'Validation analysis should use the known brightfield preset without decoding every group for microscope detection'
);
assert(
  analyzeImportedGroupSource[0].includes('renderGroupContours(samples,{force:true,maxSide:480})'),
  'Validation analysis should cap its working resolution instead of retaining full-resolution arrays'
);

const renderGroupContoursSource = js.match(/async function renderGroupContours\(samples, options=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(renderGroupContoursSource, 'app.js should expose renderGroupContours');
assert(
  renderGroupContoursSource[0].includes('Number.isFinite(options.maxSide)') &&
    renderGroupContoursSource[0].includes('await yieldToBrowser()'),
  'Group rendering should accept an explicit analysis cap and yield between expensive images'
);
assert(
  js.includes('function yieldToBrowser()'),
  'app.js should expose a browser-yield helper for long validation analysis'
);

const restoreValidationSessionSource = js.match(/function restoreValidationSessionState\(snapshot\)\s*\{[\s\S]*?\n  \}/);
assert(restoreValidationSessionSource, 'app.js should expose restoreValidationSessionState');
assert(
  restoreValidationSessionSource[0].includes('state.imageLoadSeq=(state.imageLoadSeq||0)+1'),
  'Validation rollback should invalidate pending validation image callbacks'
);
assert(restoreValidationSessionSource[0].includes('cancelAutoApply()'),'Validation rollback should cancel pending auto-analysis');
assert(restoreValidationSessionSource[0].includes('state.groupRenderSeq'),'Validation rollback should cancel pending group rendering');
assert(!restoreValidationSessionSource[0].includes('setMode('),'Validation restore should not call scheduling mode helpers');
assert(!restoreValidationSessionSource[0].includes('setAppModule('),'Validation restore should not call module scheduling helpers');
assert(!restoreValidationSessionSource[0].includes('scheduleGroupMicroscopeAutoDetect'),'Validation restore should not schedule microscope detection');
assert(restoreValidationSessionSource[0].includes('cancelGroupMicroscopeAutoDetect()'),'Validation rollback should cancel the pending microscope timer');

const cancelMicroscopeDetectSource = js.match(/function cancelGroupMicroscopeAutoDetect\(\)\s*\{[\s\S]*?\n  \}/);
const scheduleMicroscopeDetectSource = js.match(/function scheduleGroupMicroscopeAutoDetect\(\)\s*\{[\s\S]*?\n  \}/);
assert(cancelMicroscopeDetectSource, 'app.js should expose cancelGroupMicroscopeAutoDetect');
assert(scheduleMicroscopeDetectSource, 'app.js should expose scheduleGroupMicroscopeAutoDetect');
const microscopeTimers = new Map();
const clearedMicroscopeTimers = [];
let nextMicroscopeTimerId = 1;
let microscopeDetectCalls = 0;
const microscopeTimerSandbox = {
  state:{
    mode:'group',
    microscopeModeUserSet:false,
    autoMicroscopeDetectSeq:3,
    autoMicroscopeDetectTimer:null,
    autoMicroscopeDetectPending:false
  },
  window:{
    setTimeout(callback) {
      const id=nextMicroscopeTimerId++;
      microscopeTimers.set(id,callback);
      return id;
    },
    clearTimeout(id) {
      clearedMicroscopeTimers.push(id);
      microscopeTimers.delete(id);
    }
  },
  autoDetectGroupMicroscopeMode() {
    microscopeDetectCalls+=1;
  }
};
vm.runInNewContext(
  `${cancelMicroscopeDetectSource[0]}; ${scheduleMicroscopeDetectSource[0]};
   this.cancelGroupMicroscopeAutoDetect=cancelGroupMicroscopeAutoDetect;
   this.scheduleGroupMicroscopeAutoDetect=scheduleGroupMicroscopeAutoDetect;`,
  microscopeTimerSandbox
);
microscopeTimerSandbox.scheduleGroupMicroscopeAutoDetect();
const firstMicroscopeTimer = microscopeTimerSandbox.state.autoMicroscopeDetectTimer;
assert(firstMicroscopeTimer,'Microscope scheduling should store its timer id');
assert.strictEqual(microscopeTimerSandbox.state.autoMicroscopeDetectPending,true);
microscopeTimerSandbox.scheduleGroupMicroscopeAutoDetect();
const secondMicroscopeTimer = microscopeTimerSandbox.state.autoMicroscopeDetectTimer;
assert.notStrictEqual(secondMicroscopeTimer,firstMicroscopeTimer,'Rescheduling should replace the prior timer');
assert(clearedMicroscopeTimers.includes(firstMicroscopeTimer),'Rescheduling should clear the prior timer');
const sequenceBeforeCancel = microscopeTimerSandbox.state.autoMicroscopeDetectSeq;
microscopeTimerSandbox.cancelGroupMicroscopeAutoDetect();
assert(clearedMicroscopeTimers.includes(secondMicroscopeTimer),'Cancellation should clear the current timer');
assert.strictEqual(microscopeTimerSandbox.state.autoMicroscopeDetectTimer,null);
assert.strictEqual(microscopeTimerSandbox.state.autoMicroscopeDetectPending,false);
assert.strictEqual(microscopeTimerSandbox.state.autoMicroscopeDetectSeq,sequenceBeforeCancel+1);
assert.strictEqual(microscopeDetectCalls,0,'Cancelled microscope detection should not start');
microscopeTimerSandbox.scheduleGroupMicroscopeAutoDetect();
const finalMicroscopeTimer = microscopeTimerSandbox.state.autoMicroscopeDetectTimer;
microscopeTimers.get(finalMicroscopeTimer)();
assert.strictEqual(microscopeTimerSandbox.state.autoMicroscopeDetectTimer,null,'Timer callback should clear the stored id before work');
assert.strictEqual(microscopeTimerSandbox.state.autoMicroscopeDetectPending,false,'Timer callback should clear pending state before work');
assert.strictEqual(microscopeDetectCalls,1,'A live microscope timer should start detection once');
microscopeTimerSandbox.scheduleGroupMicroscopeAutoDetect();
const guardedMicroscopeTimer = microscopeTimerSandbox.state.autoMicroscopeDetectTimer;
microscopeTimerSandbox.state.microscopeModeUserSet=true;
microscopeTimerSandbox.scheduleGroupMicroscopeAutoDetect();
assert(clearedMicroscopeTimers.includes(guardedMicroscopeTimer),'A guarded reschedule should still clear the stale timer');
assert.strictEqual(microscopeTimerSandbox.state.autoMicroscopeDetectTimer,null);
assert.strictEqual(microscopeTimerSandbox.state.autoMicroscopeDetectPending,false);

const loadLocalFilesSource = js.match(/function loadLocalFiles\(files\)\s*\{[\s\S]*?\n  \}/);
assert(loadLocalFilesSource, 'app.js should expose loadLocalFiles');
assert(loadLocalFilesSource[0].includes('state.validationLoadActive'),'Local file loading should guard against validation transactions');
assert(loaderBody.includes('cancelGroupMicroscopeAutoDetect()'),'Validation transaction start should cancel pending microscope detection');

assert(js.includes('class ValidationAssetError extends Error'),'Validation fetch failures should use a specific error class');
const fetchServedImageFileSource = js.match(/async function fetchServedImageFile\(relativePath\)\s*\{[\s\S]*?\n  \}/);
assert(fetchServedImageFileSource, 'app.js should expose fetchServedImageFile');
assert(!fetchServedImageFileSource[0].includes("err.validationKind='asset'"),'Fetch helper should not blanket-tag all exceptions as asset errors');
const loadImageSource = js.match(/function loadImage\(src,sample=null,name='',keepMode=false,options=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(loadImageSource, 'app.js should expose loadImage');
assert(
  loadImageSource[0].includes('if(loadSeq!==state.imageLoadSeq) return'),
  'Image loading should ignore callbacks invalidated by validation rollback'
);

const cropChoiceSource = js.match(/function cropForQcSample\(qc, template\)\s*\{[\s\S]*?\n  \}/);
assert(cropChoiceSource, 'app.js should expose cropForQcSample');
const cropChoiceSandbox = {};
vm.runInNewContext(`${cropChoiceSource[0]}; this.cropForQcSample = cropForQcSample;`, cropChoiceSandbox);
const savedCrop = {x:0.1,y:0.2,w:0.5,h:0.6};
const latestTemplate = {x:0.2,y:0.1,w:0.4,h:0.7};
assert.deepStrictEqual(
  {...cropChoiceSandbox.cropForQcSample({cropSaved:true,cropRatio:savedCrop},latestTemplate)},
  savedCrop,
  'A saved image should restore its own crop instead of the latest template'
);
assert.deepStrictEqual(
  {...cropChoiceSandbox.cropForQcSample({cropSaved:false,cropRatio:null},latestTemplate)},
  latestTemplate,
  'An unsaved image should start from the latest group crop template'
);
assert.strictEqual(
  cropChoiceSandbox.cropForQcSample({autoCropFov:true,cropSaved:false,cropRatio:null},latestTemplate),
  null,
  'A completed full-field auto-crop check should not inherit a manual crop template'
);
assert.strictEqual(
  cropChoiceSandbox.cropForQcSample({cropReset:true,cropSaved:false,cropRatio:null},latestTemplate),
  null,
  'A reset crop should show the raw image without deleting the group crop template'
);

const currentGroupCropTemplateSource = js.match(/function currentGroupCropTemplate\(\)\s*\{[\s\S]*?\n  \}/);
assert(currentGroupCropTemplateSource, 'app.js should expose currentGroupCropTemplate');
const templateSandbox = {
  state: {
    lastQcCropTemplateByGroup: {},
    lastQcCropTemplate: {x:0.15,y:0.1,w:0.7,h:0.8}
  },
  selectedGroup: () => ({id:'group-b'})
};
vm.runInNewContext(
  `${currentGroupCropTemplateSource[0]}; this.currentGroupCropTemplate = currentGroupCropTemplate;`,
  templateSandbox
);
assert.deepStrictEqual(
  {...templateSandbox.currentGroupCropTemplate()},
  templateSandbox.state.lastQcCropTemplate,
  'A new group should inherit the latest session crop template'
);
templateSandbox.state.lastQcCropTemplateByGroup['group-b']={x:0.2,y:0.2,w:0.5,h:0.5};
assert.deepStrictEqual(
  {...templateSandbox.currentGroupCropTemplate()},
  templateSandbox.state.lastQcCropTemplateByGroup['group-b'],
  'A group-specific crop template should take priority over the session template'
);
const shouldOpenTemplateSource = js.match(/function shouldOpenQcCropTemplate\(qc, template\)\s*\{[\s\S]*?\n  \}/);
assert(shouldOpenTemplateSource, 'app.js should decide whether an inherited crop opens in Adjust mode');
vm.runInNewContext(
  `${shouldOpenTemplateSource[0]}; this.shouldOpenQcCropTemplate = shouldOpenQcCropTemplate;`,
  templateSandbox
);
assert.strictEqual(templateSandbox.shouldOpenQcCropTemplate({},latestTemplate),true);
assert.strictEqual(templateSandbox.shouldOpenQcCropTemplate({cropSaved:true},latestTemplate),false);
assert.strictEqual(templateSandbox.shouldOpenQcCropTemplate({cropReset:true},latestTemplate),false);
assert.strictEqual(templateSandbox.shouldOpenQcCropTemplate({autoCropFov:true},latestTemplate),false);

const qcAdvanceMessageSource = js.match(/function qcAdvanceMessage\(savedSample, activeSample, activeIndex, sampleCount\)\s*\{[\s\S]*?\n  \}/);
assert(qcAdvanceMessageSource, 'app.js should expose a QC auto-advance message formatter');
const advanceSandbox = {};
vm.runInNewContext(
  `${qcAdvanceMessageSource[0]}; this.qcAdvanceMessage = qcAdvanceMessage;`,
  advanceSandbox
);
assert.strictEqual(
  advanceSandbox.qcAdvanceMessage({time:'0h'},{time:'24h'},1,3),
  '0h saved — now viewing 24h (image 2 of 3)',
  'Save Crop should clearly name both the saved and newly active images'
);

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

const drawQcCanvasSource = js.match(/function drawQcCanvas\(\)\s*\{[\s\S]*?\n  \}/);
assert(drawQcCanvasSource, 'app.js should expose drawQcCanvas');
assert(
  drawQcCanvasSource[0].includes('qcPreviewCrop(qc,state.crop)'),
  'QC canvas should select a saved crop for normal preview'
);
assert(
  drawQcCanvasSource[0].includes('sourceX,sourceY,sourceW,sourceH'),
  'QC canvas should draw only the selected saved-crop source bounds'
);

const applyQcCropSource = js.match(/function applyQcCrop\(\)\s*\{[\s\S]*?\n  \}/);
assert(applyQcCropSource, 'app.js should expose applyQcCrop');
assert(
  !applyQcCropSource[0].includes('samples.forEach'),
  'Saving a crop should not overwrite every image crop state'
);
assert(
  applyQcCropSource[0].includes('state.lastQcCropTemplate={...cropRatio}'),
  'Saving a crop should update the session-wide crop template'
);
assert(
  applyQcCropSource[0].includes('advanceFromSample:sample'),
  'Save-driven navigation should identify the image that was just saved'
);

const loadQcSampleSource = js.match(/function loadQcSampleAt\(index, options=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(loadQcSampleSource, 'loadQcSampleAt should accept workflow options');
assert(
  loadQcSampleSource[0].includes('openAdjust:!!options.openAdjust'),
  'Save-driven navigation should pass openAdjust into image loading'
);
assert(
  loadQcSampleSource[0].includes('advanceFromSample:options.advanceFromSample||null'),
  'Save-driven navigation should pass auto-advance feedback metadata into image loading'
);

const qcMutationBlockedSource = js.match(/function qcMutationBlocked\(\)\s*\{[\s\S]*?\n  \}/);
assert(qcMutationBlockedSource, 'app.js should expose one central QC transition mutation guard');
const qcMutationGuardSandbox = {state:{qcTransitionPending:false}};
vm.runInNewContext(
  `${qcMutationBlockedSource[0]}; this.qcMutationBlocked = qcMutationBlocked;`,
  qcMutationGuardSandbox
);
assert.strictEqual(qcMutationGuardSandbox.qcMutationBlocked(),false);
qcMutationGuardSandbox.state.qcTransitionPending=true;
assert.strictEqual(qcMutationGuardSandbox.qcMutationBlocked(),true);

const guardedQcMutationFunctions = [
  'loadQcSampleAt',
  'qcPreviousImage',
  'qcNextImage',
  'beginQcCropEdit',
  'applyQcOrientation',
  'applyQcRotation',
  'applyQcFineRotation',
  'toggleQcAutoCrop',
  'resetQcCrop',
  'undoQcCrop',
  'redoQcCrop',
  'applyQcCrop',
  'toggleQcExclude'
];
guardedQcMutationFunctions.forEach(name => {
  const source=js.match(new RegExp(`(?:async )?function ${name}\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n  \\}`));
  assert(source, `app.js should expose ${name}`);
  assert(
    source[0].includes('if(qcMutationBlocked()) return'),
    `${name} should no-op while the QC transition is pending`
  );
});

const syncQcTransitionControlsSource = js.match(/function syncQcTransitionControls\(samples, sample, qc\)\s*\{[\s\S]*?\n  \}/);
assert(syncQcTransitionControlsSource, 'app.js should centrally render QC transition control disabled state');
[
  'qcOrientation','qcRotateLeft','qcRotateRight','qcFineRotation','qcFineRotationVal',
  'qcAutoCropFov','qcAdjustCrop','qcSaveCrop','qcResetCrop','qcUndoCrop','qcRedoCrop',
  'qcExcludeToggle','qcPrevImage','qcNextImage','goToAnalysisFromQc'
].forEach(control => {
  assert(
    syncQcTransitionControlsSource[0].includes(`el.${control}`),
    `QC transition rendering should manage ${control}`
  );
});
assert(
  syncQcTransitionControlsSource[0].includes('state.qcTransitionPending'),
  'QC transition control rendering should derive disabled state from the central lock'
);

const applyQcStateSource = js.match(/function applyQcStateToCurrentImage\(sample=state.sample, options=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(applyQcStateSource, 'app.js should expose applyQcStateToCurrentImage');
assert(
  applyQcStateSource[0].includes('state.cropEditing=!!options.openAdjust'),
  'Loaded QC images should open Adjust mode only when requested'
);

const qcStateDefaultsSource = js.match(/function createQcStateDefaults\(\)\s*\{[\s\S]*?\n  \}/);
assert(qcStateDefaultsSource, 'app.js should expose createQcStateDefaults');
const qcStateDefaultsSandbox = {};
vm.runInNewContext(
  `${qcStateDefaultsSource[0]}; this.createQcStateDefaults = createQcStateDefaults;`,
  qcStateDefaultsSandbox
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(qcStateDefaultsSandbox.createQcStateDefaults())),
  {
    orientation:'vertical',
    cropRatio:null,
    cropSaved:false,
    cropReset:false,
    rotation:0,
    fineRotation:0,
    autoCropFov:false,
    fovCutoff:null,
    excluded:false,
    editedAt:null,
    needsCrop:false,
    borderCheckPerformed:false
  },
  'New QC image state should include persistent fine-rotation and auto-crop metadata'
);

const qcFingerprintSource = js.match(/function qcFingerprint\(qc=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(qcFingerprintSource, 'app.js should expose a deterministic QC fingerprint');
const qcFingerprintSandbox = {};
vm.runInNewContext(
  `${qcFingerprintSource[0]}; this.qcFingerprint = qcFingerprint;`,
  qcFingerprintSandbox
);
const fingerprintBase = qcFingerprintSandbox.qcFingerprint({
  orientation:'vertical',
  cropRatio:{x:0.1,y:0.2,w:0.7,h:0.6},
  cropSaved:true,
  rotation:0,
  fineRotation:0,
  autoCropFov:false,
  fovCutoff:null,
  excluded:false,
  editedAt:1,
  needsCrop:false,
  borderCheckPerformed:false
});
assert.strictEqual(
  fingerprintBase,
  qcFingerprintSandbox.qcFingerprint({
    orientation:'vertical',
    cropRatio:{x:0.1,y:0.2,w:0.7,h:0.6},
    cropSaved:true,
    rotation:0,
    fineRotation:0,
    autoCropFov:false,
    fovCutoff:null,
    excluded:false,
    editedAt:999,
    needsCrop:true,
    borderCheckPerformed:true
  }),
  'Diagnostic-only QC fields should not invalidate analysis'
);
assert.notStrictEqual(
  fingerprintBase,
  qcFingerprintSandbox.qcFingerprint({
    orientation:'vertical',
    cropRatio:{x:0.1,y:0.2,w:0.5,h:0.6},
    cropSaved:true
  }),
  'Changing crop geometry should invalidate analysis'
);

const updateQcStateSource = js.match(/function updateQcState\(sampleId, patch\)\s*\{[\s\S]*?\n  \}/);
assert(updateQcStateSource, 'app.js should expose updateQcState');
assert(
  updateQcStateSource[0].includes('invalidateAnalysisForQcChange(sampleId,current,next)'),
  'QC changes should invalidate stale sample analysis'
);

const invalidateQcAnalysisSource = js.match(/function invalidateAnalysisForQcChange\(sampleId, before, after\)\s*\{[\s\S]*?\n  \}/);
assert(invalidateQcAnalysisSource, 'app.js should expose QC-aware analysis invalidation');
[
  'delete state.groupResults[sampleId]',
  'delete state.manualOverrides[sampleId]',
  'state.result=null'
].forEach(fragment => {
  assert(
    invalidateQcAnalysisSource[0].includes(fragment),
    `QC invalidation should perform ${fragment}`
  );
});

const resultForSampleSource = js.match(/function resultForSample\(sample\)\s*\{[\s\S]*?\n  \}/);
assert(resultForSampleSource, 'app.js should expose resultForSample');
assert(
  resultForSampleSource[0].includes('resultMatchesCurrentQc(sample,candidate)'),
  'Builder rows should reject results created from an older QC state'
);
const builderFreshnessSource = js.match(/function builderGroupsHaveFreshResults\(settings\)\s*\{[\s\S]*?\n  \}/);
assert(builderFreshnessSource, 'app.js should expose a Builder freshness gate');
assert(
  builderFreshnessSource[0].includes('builderResultCoverage(settings).complete'),
  'Builder freshness should require current results across all selected replicate groups'
);
const builderCoverageSource = js.match(/function builderResultCoverage\(settings\)\s*\{[\s\S]*?\n  \}/);
assert(builderCoverageSource, 'app.js should expose detailed Builder result coverage');
assert(
  builderCoverageSource[0].includes('missingSamples') &&
    builderCoverageSource[0].includes('missingGroups') &&
    builderCoverageSource[0].includes('storedContourForSample(sample)'),
  'Builder coverage should identify each group and image requiring current analysis'
);
assert(
  js.includes('function analyzeMissingBuilderGroups()') &&
    js.includes('settingsWithCurrentQc') &&
    js.includes('analyzeImageWithSettings') &&
    js.includes('renderPublicationBuilder()'),
  'Builder should analyze missing selected groups with current QC and render automatically'
);
const drawBuilderFigurePanelSource = js.match(/function drawBuilderFigurePanel\(style='grayscale', options=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(drawBuilderFigurePanelSource, 'app.js should expose drawBuilderFigurePanel');
assert(
  drawBuilderFigurePanelSource[0].includes('if(!builderGroupsHaveFreshResults(settings)) return null'),
  'Builder should refuse partial figures when any selected result is stale'
);

const groupOverlaySource = js.match(/function groupOverlayCanvas\(sample, options=\{\}\)\s*\{[\s\S]*?\n  \}/);
assert(groupOverlaySource, 'app.js should expose groupOverlayCanvas');
assert(
  groupOverlaySource[0].includes('storedContourForSample(sample)'),
  'Builder representative overlays should require the stored fresh Analysis source and mask'
);
assert(
  js.includes('image(s) need analysis across') &&
    js.includes('Analyze missing groups'),
  'Builder should explain exactly how much analysis is missing and offer recovery'
);
assert(
  js.includes('qcFingerprint:qcFingerprintForSample(sample.id)') &&
    js.includes('qcFingerprint:qcFingerprintForSample(state.sample?.id)'),
  'Group and single-image analysis results should record the QC fingerprint used'
);

const lockedQcEntrySource = js.match(/function lockedQcSnapshotEntry\(sample, groupId, qc, prepared=false\)\s*\{[\s\S]*?\n  \}/);
assert(lockedQcEntrySource, 'app.js should expose lockedQcSnapshotEntry');
const lockedQcEntrySandbox = {};
vm.runInNewContext(
  `${lockedQcEntrySource[0]}; this.lockedQcSnapshotEntry = lockedQcSnapshotEntry;`,
  lockedQcEntrySandbox
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(lockedQcEntrySandbox.lockedQcSnapshotEntry(
    {id:'sample-1'},
    'group-1',
    {
      orientation:'horizontal',
      cropRatio:{x:0.1,y:0.2,w:0.7,h:0.6},
      cropSaved:true,
      rotation:90,
      fineRotation:'2.5',
      autoCropFov:1,
      fovCutoff:36,
      excluded:false,
      editedAt:123
    },
    true
  ))),
  {
    sampleId:'sample-1',
    groupId:'group-1',
    orientation:'horizontal',
    cropRatio:{x:0.1,y:0.2,w:0.7,h:0.6},
    cropSaved:true,
    prepared:true,
    rotation:90,
    fineRotation:2.5,
    autoCropFov:true,
    fovCutoff:36,
    excluded:false,
    editedAt:123
  },
  'Locked QC snapshots should normalize and preserve geometry metadata'
);
assert(
  applyQcStateSource[0].includes("state.analysisGeometry.orientation=qc.orientation||'vertical'") &&
  applyQcStateSource[0].includes('state.analysisGeometry.fineRotation=Number(qc.fineRotation)||0') &&
  applyQcStateSource[0].includes('applyQcGeometryControls(qc,el)'),
  'Applying QC state should restore Analysis geometry state while updating only QC controls'
);
const qcSettingsSource = js.match(/function settingsWithQcSnapshot\(settings, sample\)\s*\{[\s\S]*?\n  \}/);
assert(qcSettingsSource, 'app.js should expose settingsWithQcSnapshot');
const normalizeLockedQcSettingsSource = js.match(/function normalizeLockedQcSettings\(settings, qc, prepared=false, orientationRotation=0\)\s*\{[\s\S]*?\n  \}/);
assert(normalizeLockedQcSettingsSource, 'app.js should expose normalizeLockedQcSettings');
const normalizeLockedQcSettingsSandbox = {};
vm.runInNewContext(
  `${normalizeLockedQcSettingsSource[0]}; this.normalizeLockedQcSettings = normalizeLockedQcSettings;`,
  normalizeLockedQcSettingsSandbox
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(normalizeLockedQcSettingsSandbox.normalizeLockedQcSettings(
    {autoCrop:true,cropRatio:{x:0,y:0,w:1,h:1},deskew:9,scratchOrientation:'vertical',fovCutoff:18},
    {
      orientation:'horizontal',
      cropRatio:{x:0.1,y:0.2,w:0.7,h:0.6},
      rotation:90,
      fineRotation:'2.5',
      autoCropFov:true,
      fovCutoff:36
    },
    false,
    90
  ))),
  {
    autoCrop:false,
    cropRatio:{x:0.1,y:0.2,w:0.7,h:0.6},
    deskew:2.5,
    scratchOrientation:'horizontal',
    preparedQcInput:false,
    manualRotation:90,
    orientationRotation:90,
    rotation:180,
    fineRotation:2.5,
    autoCropFov:true,
    fovCutoff:36
  },
  'Locked QC settings should map fine rotation to deskew, preserve audit metadata, and disable Analysis auto-crop'
);
assert.strictEqual(
  normalizeLockedQcSettingsSandbox.normalizeLockedQcSettings(
    {autoCrop:true,cropRatio:{x:0,y:0,w:1,h:1}},
    {cropRatio:{x:0.1,y:0.2,w:0.7,h:0.6}},
    true,
    0
  ).cropRatio,
  null,
  'Prepared QC images should not be cropped a second time'
);

const applyQcGeometryControlsSource = js.match(/function applyQcGeometryControls\(qc, controls\)\s*\{[\s\S]*?\n  \}/);
assert(applyQcGeometryControlsSource, 'app.js should expose applyQcGeometryControls');
const applyQcGeometryControlsSandbox = {};
vm.runInNewContext(
  `${applyQcGeometryControlsSource[0]}; this.applyQcGeometryControls = applyQcGeometryControls;`,
  applyQcGeometryControlsSandbox
);
assert.doesNotThrow(
  ()=>applyQcGeometryControlsSandbox.applyQcGeometryControls({}, {}),
  'Geometry restoration should tolerate controls that do not exist yet'
);
const futureQcControls = {qcFineRotation:{value:''},qcFineRotationVal:{value:''},qcAutoCropFov:{checked:false}};
applyQcGeometryControlsSandbox.applyQcGeometryControls(
  {fineRotation:'-1.25',autoCropFov:true},
  futureQcControls,
  'analysis'
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(futureQcControls)),
  {qcFineRotation:{value:'-1.25'},qcFineRotationVal:{value:'-1.25'},qcAutoCropFov:{checked:true}},
  'Future QC controls should restore geometry metadata without requiring legacy controls'
);
const legacyAnalysisControls = {
  deskewAngle:{value:''},
  deskewAngleVal:{value:''},
  autoCropFov:{checked:false}
};
applyQcGeometryControlsSandbox.applyQcGeometryControls(
  {fineRotation:3,autoCropFov:true},
  legacyAnalysisControls
);
assert.strictEqual(legacyAnalysisControls.deskewAngle.value,'');
assert.strictEqual(legacyAnalysisControls.deskewAngleVal.value,'');
assert.strictEqual(
  legacyAnalysisControls.autoCropFov.checked,
  false,
  'Removed Analysis geometry controls should never be restored or mutated'
);
applyQcGeometryControlsSandbox.applyQcGeometryControls(
  {fineRotation:3,autoCropFov:true},
  legacyAnalysisControls
);
assert.strictEqual(
  legacyAnalysisControls.autoCropFov.checked,
  false,
  'QC state should restore only dedicated QC controls'
);

[
  'qcFineRotation',
  'qcFineRotationVal',
  'qcAngleRulerToggle',
  'qcAutoCropFov',
  'qcResetCrop'
].forEach(id => {
  assert(html.includes(`id="${id}"`), `Image QC should expose #${id}`);
});
assert(!html.includes('id="qcCopyCrop"'), 'Image QC should not expose duplicate copy-to-all crop control');
assert(!js.includes('qcCopyCropToAll'), 'app.js should remove the duplicate copy-to-all crop handler');
assert(!js.includes('qcCopyCrop:'), 'app.js should remove the duplicate copy-to-all DOM reference');

const normalizeQcFineRotationSource = js.match(/function normalizeQcFineRotation\(value\)\s*\{[\s\S]*?\n  \}/);
assert(normalizeQcFineRotationSource, 'app.js should expose normalizeQcFineRotation');
const normalizeQcFineRotationSandbox = {};
vm.runInNewContext(
  `${normalizeQcFineRotationSource[0]}; this.normalizeQcFineRotation = normalizeQcFineRotation;`,
  normalizeQcFineRotationSandbox
);
assert.strictEqual(normalizeQcFineRotationSandbox.normalizeQcFineRotation('2.5'),2.5);
assert.strictEqual(normalizeQcFineRotationSandbox.normalizeQcFineRotation(50),20);
assert.strictEqual(normalizeQcFineRotationSandbox.normalizeQcFineRotation(-50),-20);
assert.strictEqual(normalizeQcFineRotationSandbox.normalizeQcFineRotation('bad'),0);

const normalizeQcFovCutoffSource = js.match(/function normalizeQcFovCutoff\(value\)\s*\{[\s\S]*?\n  \}/);
assert(normalizeQcFovCutoffSource, 'app.js should expose normalizeQcFovCutoff');
const normalizeQcFovCutoffSandbox = {};
vm.runInNewContext(
  `${normalizeQcFovCutoffSource[0]}; this.normalizeQcFovCutoff = normalizeQcFovCutoff;`,
  normalizeQcFovCutoffSandbox
);
assert.strictEqual(normalizeQcFovCutoffSandbox.normalizeQcFovCutoff('36'),36);
assert.strictEqual(normalizeQcFovCutoffSandbox.normalizeQcFovCutoff(250),180);
assert.strictEqual(normalizeQcFovCutoffSandbox.normalizeQcFovCutoff(-10),0);
assert.strictEqual(normalizeQcFovCutoffSandbox.normalizeQcFovCutoff('bad'),0);

const qcAutoCropPatchSource = js.match(/function qcAutoCropPatch\(crop, image, fovCutoff\)\s*\{[\s\S]*?\n  \}/);
assert(qcAutoCropPatchSource, 'app.js should expose qcAutoCropPatch');
const qcAutoCropPatchSandbox = {};
vm.runInNewContext(
  `${qcAutoCropPatchSource[0]}; this.qcAutoCropPatch = qcAutoCropPatch;`,
  qcAutoCropPatchSandbox
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(qcAutoCropPatchSandbox.qcAutoCropPatch(
    {x:10,y:20,w:80,h:60,active:true},
    {naturalWidth:100,naturalHeight:100},
    36
  ))),
  {
    autoCropFov:true,
    fovCutoff:36,
    cropRatio:{x:0.1,y:0.2,w:0.8,h:0.6},
    cropSaved:true,
    cropReset:false,
    needsCrop:false
  },
  'Auto FOV crop should persist its cutoff and normalized saved crop'
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(qcAutoCropPatchSandbox.qcAutoCropPatch(
    {x:0,y:0,w:100,h:100,active:false},
    {naturalWidth:100,naturalHeight:100},
    18
  ))),
  {
    autoCropFov:true,
    fovCutoff:18,
    cropRatio:null,
    cropSaved:false,
    cropReset:false,
    needsCrop:false
  },
  'A full-field auto crop should keep the preference without inventing crop metadata'
);

const resetQcCropPatchSource = js.match(/function resetQcCropPatch\(\)\s*\{[\s\S]*?\n  \}/);
assert(resetQcCropPatchSource, 'app.js should expose resetQcCropPatch');
const resetQcCropPatchSandbox = {};
vm.runInNewContext(
  `${resetQcCropPatchSource[0]}; this.resetQcCropPatch = resetQcCropPatch;`,
  resetQcCropPatchSandbox
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(resetQcCropPatchSandbox.resetQcCropPatch())),
  {cropRatio:null,cropSaved:false,cropReset:true,autoCropFov:false,fovCutoff:null,needsCrop:false},
  'Reset crop should clear every QC crop marker'
);

const applyQcFineRotationSource = js.match(/function applyQcFineRotation\(value\)\s*\{[\s\S]*?\n  \}/);
assert(applyQcFineRotationSource, 'app.js should expose applyQcFineRotation');
assert(
  applyQcFineRotationSource[0].includes('updateQcState(state.sample.id,{fineRotation:next})'),
  'Fine rotation should update image-level QC state'
);
assert(
  applyQcFineRotationSource[0].includes('drawQcCanvas()'),
  'Fine rotation should redraw the QC preview'
);
assert(
  !applyQcFineRotationSource[0].includes('scheduleAutoApply') &&
  !applyQcFineRotationSource[0].includes('runSegmentation'),
  'Fine rotation in QC should never auto-run Analysis'
);

const toggleQcAutoCropSource = js.match(/async function toggleQcAutoCrop\(checked\)\s*\{[\s\S]*?\n  \}/);
assert(toggleQcAutoCropSource, 'app.js should expose toggleQcAutoCrop');
assert(
  toggleQcAutoCropSource[0].includes('normalizeQcFovCutoff(el.fovCutoff?.value)'),
  'QC auto crop should safely normalize the Analysis-owned FOV cutoff internally'
);
assert(
  toggleQcAutoCropSource[0].includes('prepareQcAnalysisInput'),
  'QC auto crop should prepare the cropped Analysis input'
);
assert(
  toggleQcAutoCropSource[0].includes('releasePreparedQcImage(sample.id)'),
  'QC auto crop should release stale prepared input when the user changes samples mid-operation'
);
assert(
  toggleQcAutoCropSource[0].includes('beginQcCropOperation(sample.id)') &&
  toggleQcAutoCropSource[0].includes('isCurrentQcCropOperation(sample.id,operationId)'),
  'QC auto crop should ignore stale async preparation results for the same sample'
);

const resetQcCropSource = js.match(/function resetQcCrop\(\)\s*\{[\s\S]*?\n  \}/);
assert(resetQcCropSource, 'app.js should expose resetQcCrop');
[
  'invalidateQcCropOperation(sampleId)',
  'releasePreparedQcImage(sampleId)',
  'state.qcCropCache.delete(sampleId)',
  'invalidateCropCache(sampleId)',
  'drawQcCanvas()'
].forEach(fragment => {
  assert(resetQcCropSource[0].includes(fragment), `Reset crop should perform ${fragment}`);
});
assert(
  !resetQcCropSource[0].includes('delete state.lastQcCropTemplateByGroup'),
  'Reset crop should preserve the latest group template for continuous crop workflow'
);

const clearQcCropCacheSource = js.match(/function clearQcCropCache\(sampleId = null\)\s*\{[\s\S]*?\n  \}/);
assert(clearQcCropCacheSource, 'app.js should expose clearQcCropCache');
assert(
  clearQcCropCacheSource[0].includes('delete state.qcCropHistoryBySample[sampleId]'),
  'Clearing a sample crop cache should remove only that sample history'
);

const qcCropHistoryForSampleSource = js.match(/function qcCropHistoryForSample\(sampleId\)\s*\{[\s\S]*?\n  \}/);
assert(qcCropHistoryForSampleSource, 'app.js should expose per-sample QC crop history');
assert(
  qcCropHistoryForSampleSource[0].includes('state.qcCropHistoryBySample[sampleId]'),
  'QC crop history should be stored by sample id'
);

const appendQcCropHistorySource = js.match(/function appendQcCropHistory\(history, index, entry, limit=20\)\s*\{[\s\S]*?\n  \}/);
assert(appendQcCropHistorySource, 'app.js should expose appendQcCropHistory');
const qcCropHistorySandbox = {};
vm.runInNewContext(
  `${appendQcCropHistorySource[0]}; this.appendQcCropHistory = appendQcCropHistory;`,
  qcCropHistorySandbox
);
const branchedQcHistory = qcCropHistorySandbox.appendQcCropHistory(
  [{sampleId:'a'},{sampleId:'b'},{sampleId:'redo'}],
  1,
  {sampleId:'new'}
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(branchedQcHistory)),
  {history:[{sampleId:'a'},{sampleId:'b'},{sampleId:'new'}],index:2},
  'A new QC crop operation should discard the redo branch'
);

const undoQcCropSource = js.match(/function undoQcCrop\(\)\s*\{[\s\S]*?\n  \}/);
const redoQcCropSource = js.match(/function redoQcCrop\(\)\s*\{[\s\S]*?\n  \}/);
assert(undoQcCropSource, 'app.js should expose undoQcCrop');
assert(redoQcCropSource, 'app.js should expose redoQcCrop');
[undoQcCropSource[0],redoQcCropSource[0]].forEach(source => {
  assert(
    source.includes('state.sample.id') &&
    source.includes('qcCropHistoryForSample') &&
    !source.includes('selectedGroupSamples') &&
    !source.includes('saveQcCropToCache('),
    'QC crop history callbacks should operate only on the visible active sample'
  );
});
const updateQcUndoRedoSource = js.match(/function updateQcUndoRedoButtons\(\)\s*\{[\s\S]*?\n  \}/);
assert(updateQcUndoRedoSource, 'app.js should expose updateQcUndoRedoButtons');
assert(
  updateQcUndoRedoSource[0].includes('qcCropHistoryForSample(state.sample?.id)'),
  'QC crop buttons should reflect only the active sample history'
);
const restoreQcCropHistorySource = js.match(/async function restoreQcCropHistorySnapshot\(sample, snapshot\)\s*\{[\s\S]*?\n  \}/);
assert(restoreQcCropHistorySource, 'QC crop history restore should rebuild prepared input asynchronously');
[
  'beginQcCropOperation(sample.id)',
  'cropFromRatio(rawImage,snapshot.cropRatio)',
  'await prepareQcAnalysisInput(sample,rawImage,crop,operationId)',
  'isCurrentQcCropOperation(sample.id,operationId)'
].forEach(fragment => {
  assert(
    restoreQcCropHistorySource[0].includes(fragment),
    `QC crop history restore should perform ${fragment}`
  );
});
assert(
  !restoreQcCropHistorySource[0].includes('prepareQcAnalysisInput(sample,rawImage,state.crop'),
  'QC crop restore should prepare the raw-image ROI once instead of cropping an already cropped preview'
);
assert(
  restoreQcCropHistorySource[0].includes('trackQcOperation(restorePromise)'),
  'QC crop restore should join the central tracked operation set'
);
const awaitTrackedQcOperationsSource = js.match(/async function awaitTrackedQcOperations\(\)\s*\{[\s\S]*?\n  \}/);
assert(awaitTrackedQcOperationsSource, 'app.js should await all active asynchronous QC operations');
assert(
  awaitTrackedQcOperationsSource[0].includes('Promise.allSettled(pending)') &&
  awaitTrackedQcOperationsSource[0].includes('state.qcPendingOperations'),
  'QC operation waiting should settle every tracked operation without rejecting Continue'
);
assert(
  awaitTrackedQcOperationsSource[0].includes('while(state.qcPendingOperations.size)'),
  'QC operation waiting should remain stable if tracked work changes while settling'
);
const trackQcOperationSource = js.match(/function trackQcOperation\(operation\)\s*\{[\s\S]*?\n  \}/);
assert(trackQcOperationSource, 'app.js should track asynchronous QC geometry operations centrally');
assert(
  trackQcOperationSource[0].includes('state.qcPendingOperations.add(operation)') &&
  trackQcOperationSource[0].includes('operation.then(clearPending,clearPending)') &&
  !trackQcOperationSource[0].includes('.finally('),
  'QC operation cleanup should consume both settlement paths without unhandled rejection'
);
assert(
  toggleQcAutoCropSource[0].includes('trackQcOperation(operation)'),
  'Auto Crop should be tracked until all geometry state is committed'
);
assert(
  applyQcCropSource[0].includes('trackQcOperation(operation)'),
  'Manual crop preparation should be tracked until all geometry state is committed'
);
assert(
  applyQcCropSource[0].includes('recordQcCropHistory('),
  'A successful manual QC crop should record an undoable history operation'
);
assert(
  resetQcCropSource[0].includes('recordQcCropHistory(') &&
  !resetQcCropSource[0].includes('clearQcCropCache(state.sample.id)'),
  'Reset crop should be undoable without deleting that sample history'
);

const prepareQcAnalysisInputSource = js.match(/async function prepareQcAnalysisInput\(sample, rawImage, crop, operationId=null\)\s*\{[\s\S]*?\n  \}/);
assert(prepareQcAnalysisInputSource, 'app.js should expose race-safe prepareQcAnalysisInput');
assert(
  prepareQcAnalysisInputSource[0].includes('isCurrentQcCropOperation(sample.id,operationId)'),
  'Prepared QC input should be stored only while its crop operation is current'
);

const lockedQcSnapshotEntrySource = js.match(/function lockedQcSnapshotEntry\(sample, groupId, qc, prepared=false\)\s*\{[\s\S]*?\n  \}/);
assert(lockedQcSnapshotEntrySource, 'app.js should expose lockedQcSnapshotEntry');
assert(
  lockedQcSnapshotEntrySource[0].includes('fovCutoff:'),
  'Locked QC metadata should retain the cutoff used for auto crop'
);

assert(
  drawQcCanvasSource[0].includes('drawAngleRuler(ctx,w,h)'),
  'QC canvas should render the reusable angle ruler'
);
assert(
  js.includes('function qcCanvasPoint(event)'),
  'QC canvas should expose pointer coordinates for ruler dragging'
);
assert(
  js.includes("el.qcCanvas.addEventListener('pointerdown'"),
  'QC canvas should support direct ruler interaction'
);

const resetCropAndZoomSource = js.match(/function resetCropAndZoom\(\)\s*\{[\s\S]*?\n  \}/);
assert(resetCropAndZoomSource, 'app.js should expose resetCropAndZoom');
assert(
  !resetCropAndZoomSource[0].includes('updateQcState')&&
  !resetCropAndZoomSource[0].includes('resetLockedQcSnapshot'),
  'Analysis reset helpers should never mutate QC working state or reset its locked snapshot'
);
assert(
  applyQcCropSource[0].includes('loadQcSampleAt(nextIndex,{openAdjust:true,advanceFromSample:sample})'),
  'Saving a non-final crop should auto-open Adjust on the next image'
);
assert(
  applyQcCropSource[0].includes('state.cropEditing=true'),
  'Crop preparation failure should keep Adjust mode active'
);
assert(
  applyQcCropSource[0].includes('drawQcCanvas()'),
  'Crop preparation failure should redraw the editable crop'
);

['top-left','top-right','bottom-left','bottom-right'].forEach(handle => {
  assert(
    html.includes(`data-crop-handle="${handle}"`),
    `Image QC should expose the ${handle} crop handle`
  );
});

assert(js.includes('caption/cytomove_'), 'Builder ZIP should include a caption draft file');
assert(js.includes('scale_bar'), 'Builder CSV should include scale bar metadata');
assert(
  !html.includes('vendor/pptxgen.bundle.js') &&
    js.includes("script.src='vendor/pptxgen.bundle.js?v=4.0.1'") &&
    js.includes('await ensurePptxGenJS()'),
  'The app should load the local PptxGenJS browser bundle only when a PowerPoint export needs it'
);
assert(
  html.includes('id="refreshBuilderFigure" type="button" disabled>Update Figure</button>'),
  'Builder update control should be clearly named and disabled until settings change'
);
assert(
  js.includes("builderPreviewStyle:'color'"),
  'Builder preview should default to color'
);
assert(
  js.includes("drawBuilderFigurePanel(state.builderPreviewStyle||'color')"),
  'Builder preview should render with the selected color style'
);
assert(
  js.includes('function syncBuilderUpdateButton()') &&
    js.includes("classList.toggle('is-dirty',dirty)") &&
    js.includes('el.refreshBuilderFigure.disabled=!dirty'),
  'Builder should synchronize the Update Figure enabled and highlighted state'
);
assert(
  js.includes('function markBuilderPreviewDirty()') &&
    js.includes('Settings changed — click Update Figure.'),
  'Builder controls should make the explicit Update Figure action meaningful'
);
assert(
  js.includes('Figure updated: color image with contour overlays.'),
  'Update Figure should visibly confirm the rendered result'
);
assert(
  css.includes('#refreshBuilderFigure.is-dirty'),
  'Dirty Builder settings should visibly highlight Update Figure'
);
[
  'builderPanelTitle',
  'builderPanelFont',
  'builderPanelFontSize',
  'builderPanelFontWeight',
  'builderApplyTypographyAll',
  'resetBuilderLayout',
  'builderPanelOverlay',
  'analyzeMissingBuilderGroups'
].forEach(id => {
  assert(html.includes(`id="${id}"`), `Builder editor should expose ${id}`);
});
assert(
  ['Arial','Helvetica','Times New Roman','Georgia','Calibri'].every(font => html.includes(`>${font}<`)),
  'Builder typography should offer a constrained scientific font list'
);
assert(
  js.includes("'Representative wound-edge morphology'") &&
    js.includes("'Wound closure'") &&
    js.includes("'Normalized wound area'"),
  'Builder should use scientific default panel titles'
);
assert(
  js.includes('drawBuilderPanelA') &&
    js.includes('drawBuilderPanelB') &&
    js.includes('drawBuilderPanelC') &&
    js.includes('composeBuilderPanels'),
  'Builder should compose independently positioned panel canvases'
);

const panelDefaultsSource = js.match(/function builderPanelLayoutDefaults\(\)\s*\{[\s\S]*?\n  \}/);
const panelOverlapSource = js.match(/function builderPanelsOverlap\(a,b\)\s*\{[\s\S]*?\n  \}/);
const panelSnapSource = js.match(/function snapBuilderPanelPosition\(position,panel,layout,canvas=\{width:2600,height:1580\},grid=20\)\s*\{[\s\S]*?\n  \}/);
assert(panelDefaultsSource, 'app.js should expose Builder panel layout defaults');
assert(panelOverlapSource, 'app.js should expose Builder panel overlap detection');
assert(panelSnapSource, 'app.js should expose Builder panel snapping');
const panelLayoutSandbox = {};
vm.runInNewContext(
  `${panelDefaultsSource[0]};${panelOverlapSource[0]};${panelSnapSource[0]};` +
  `this.defaults=builderPanelLayoutDefaults;this.snap=snapBuilderPanelPosition;`,
  panelLayoutSandbox
);
const defaultPanelLayout = JSON.parse(JSON.stringify(panelLayoutSandbox.defaults()));
assert.deepStrictEqual(Object.keys(defaultPanelLayout), ['A','B','C'], 'Builder should define A/B/C panel bounds');
assert.strictEqual(defaultPanelLayout.A.titleSize, 34, 'Panel A should use the same scientific title size as other panels');
assert.strictEqual(defaultPanelLayout.B.titleSize, 34, 'Panel B should use the common scientific title size');
assert.strictEqual(defaultPanelLayout.C.titleSize, 34, 'Panel C should use the common scientific title size');
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(panelLayoutSandbox.snap(
    {x:1513,y:57},
    {...defaultPanelLayout.B},
    {A:defaultPanelLayout.A,C:defaultPanelLayout.C}
  ))),
  {x:1520,y:60,valid:true},
  'Builder panel movement should snap to the 20 px grid'
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(panelLayoutSandbox.snap(
    {x:3000,y:-50},
    {...defaultPanelLayout.B},
    {}
  ))),
  {x:1580,y:0,valid:true},
  'Builder panels should remain within the 2600x1580 canvas'
);
assert.strictEqual(
  panelLayoutSandbox.snap(
    {x:100,y:100},
    {...defaultPanelLayout.B},
    {A:defaultPanelLayout.A}
  ).valid,
  false,
  'Builder should reject panel positions that overlap another panel'
);
const publicationProfilesSource = js.match(/function builderPublicationProfiles\(aspect=1580\/2600\)\s*\{[\s\S]*?\n  \}/);
assert(publicationProfilesSource, 'app.js should expose 600 DPI publication profiles');
const publicationProfileSandbox = {};
vm.runInNewContext(
  `${publicationProfilesSource[0]}; this.builderPublicationProfiles=builderPublicationProfiles;`,
  publicationProfileSandbox
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(publicationProfileSandbox.builderPublicationProfiles())),
  [
    {key:'single_column',label:'Single column',widthMm:85,dpi:600,widthPx:2008,heightPx:1220},
    {key:'double_column',label:'Double column',widthMm:180,dpi:600,widthPx:4252,heightPx:2584}
  ],
  'Builder should provide 85 mm and 180 mm 600 DPI export profiles'
);
assert(
  js.includes('pngBytesWithDpi') &&
    js.includes("type:'pHYs'") &&
    js.includes('23622'),
  'Builder PNG exports should include 600 DPI physical-resolution metadata'
);
assert(
  js.includes('canvasToTiffBytes') &&
    js.includes('writeTiffEntry(view,entryOffset,282') &&
    js.includes('writeTiffEntry(view,entryOffset,283') &&
    js.includes('writeTiffEntry(view,entryOffset,296'),
  'Builder TIFF exports should include X/Y resolution and resolution-unit tags'
);
[
  'single_column_85mm_600dpi.png',
  'single_column_85mm_600dpi.tiff',
  'double_column_180mm_600dpi.png',
  'double_column_180mm_600dpi.tiff'
].forEach(suffix => {
  assert(js.includes(suffix), `Builder ZIP should include ${suffix}`);
});
assert(
  js.includes("contour:'#161A1D'") &&
    js.includes("contourHalo:'#F7F7F2'"),
  'Color figures should use a publication-style dark contour and light halo'
);
assert(
  js.includes('contourThickness:2') &&
    js.includes('contourHaloRadius:1'),
  'Color contours should stay thin enough to preserve cellular detail'
);
const contourTargetStyleSource = js.match(
  /function contourStyleForTarget\(sourceWidth,sourceHeight,targetWidth,targetHeight,cfg\)\s*\{[\s\S]*?\n  \}/
);
assert(contourTargetStyleSource, 'app.js should adapt stored Analysis contours to publication cell scale');
const contourTargetSandbox = {Math};
vm.runInNewContext(
  `${contourTargetStyleSource[0]}; this.contourStyleForTarget=contourStyleForTarget;`,
  contourTargetSandbox
);
const fittedContourStyle = contourTargetSandbox.contourStyleForTarget(
  2282,1506,500,260,
  {contour:'#161A1D',contourHalo:'#F7F7F2',contourThickness:2,contourHaloRadius:1}
);
const fittedScale = Math.max(500/2282,260/1506);
assert(
  fittedContourStyle.thickness*fittedScale>=1,
  'Publication contour thickness should remain at least one output pixel after image reduction'
);
assert.strictEqual(fittedContourStyle.color,'#161A1D');
assert.strictEqual(fittedContourStyle.haloColor,'#F7F7F2');
const builderPanelASource = js.match(/function drawBuilderPanelA\(panel, settings, representativeRows, timepoints, style='color'\)\s*\{[\s\S]*?\n  \}/);
assert(builderPanelASource, 'app.js should expose Builder Panel A drawing');
assert(
  builderPanelASource[0].includes('groupOverlayCanvas(row.sample,{style,targetWidth:colW,targetHeight:rowH})'),
  'Builder Panel A should request target-aware drawing of the stored Analysis contour'
);
assert(
  js.includes('function drawContainedImage'),
  'Builder should provide a contain-fit image draw helper for narrow multi-treatment cells'
);
assert(
  builderPanelASource[0].includes('drawContainedImage(ctx,overlay.canvas,x,y,colW,rowH)'),
  'Builder Panel A should show the full crop/overlay area instead of cover-cropping narrow treatment cells'
);
assert(
  (js.match(/groupOverlayCanvas\([^)]*\{style,targetWidth:cellW,targetHeight:cellH\}\)/g)||[]).length>=2,
  'Other composite publication grids should also preserve stored contour visibility after reduction'
);
const groupOverlayPngBytesSource = js.match(/function groupOverlayPngBytes\(sample\)\s*\{[\s\S]*?\n  \}/);
assert(groupOverlayPngBytesSource, 'app.js should expose original-size contour PNG rendering');
assert(
  groupOverlayPngBytesSource[0].includes('groupOverlayCanvas(sample)') &&
    !groupOverlayPngBytesSource[0].includes('targetWidth') &&
    !groupOverlayPngBytesSource[0].includes('targetHeight'),
  'Individual contour PNGs should render at stored Analysis dimensions without publication scaling'
);
assert(
  groupOverlayPngBytesSource[0].includes('width:overlay.width,height:overlay.height'),
  'Individual contour PNG metadata should retain original Analysis width and height'
);
const builderFullImageSource = js.match(/function builderFullImageExportSamples\(settings\)\s*\{[\s\S]*?\n  \}/);
assert(builderFullImageSource, 'Builder export should expose the analyzed sample list for full-image assets');
assert(
  builderFullImageSource[0].includes('settings.controlReplicateIds') &&
    builderFullImageSource[0].includes('settings.treatmentArms') &&
    builderFullImageSource[0].includes('groupSamplesById'),
  'Builder full-image export should collect every selected control and treatment replicate image'
);
const builderFullImageFilesSource = js.match(/async function builderFullImageExportFiles\(settings, exportStyle, groupName\)\s*\{[\s\S]*?\n  \}/);
assert(builderFullImageFilesSource, 'Builder ZIP should prepare full-size original and contour overlay assets');
assert(
  builderFullImageFilesSource[0].includes('samples.filter(sampleNeedsFullResolutionContour)') &&
    builderFullImageFilesSource[0].includes('await renderGroupContours(samples,{force:true})'),
  'Builder ZIP should prepare missing full-resolution contours before packaging full images'
);
assert(
  builderFullImageFilesSource[0].includes('full_images/original/') &&
    builderFullImageFilesSource[0].includes('full_images/contour_overlay/'),
  'Builder ZIP should include separate full_images/original and full_images/contour_overlay folders'
);
assert(
  js.includes('...await builderFullImageExportFiles(settings,exportStyle,groupName)'),
  'Publication Builder ZIP should include the full-image files in the exported package'
);
const fullResolutionNeedSource = js.match(
  /function sampleNeedsFullResolutionContour\(sample\)\s*\{[\s\S]*?\n  \}/
);
assert(fullResolutionNeedSource, 'app.js should verify every group image has a full-resolution stored contour');
assert(
  fullResolutionNeedSource[0].includes('storedContourForSample(sample)') &&
    fullResolutionNeedSource[0].includes('previewOnly'),
  'Full-resolution export readiness should require both stored contour data and a non-preview analysis'
);
const exportGroupOverlaySource = js.match(/async function exportGroupPngOverlays\(\)\s*\{[\s\S]*?\n  \}/);
assert(exportGroupOverlaySource, 'app.js should expose group contour ZIP export');
assert(
  exportGroupOverlaySource[0].includes('samples.filter(sampleNeedsFullResolutionContour)'),
  'Group contour ZIP should prepare every image that lacks a full-resolution stored contour'
);
assert(
  js.includes('buildBuilderPptxBlob') &&
    js.includes('new window.PptxGenJS()'),
  'Builder export should use PptxGenJS for a reliable PPTX'
);
assert(
  !/makePptxDeck\(\[slide\]\)/.test(js),
  'Builder export should no longer use handcrafted OOXML'
);

const timeMatchSource = js.match(/function customFileTimeMatch\(stem\)\s*\{[\s\S]*?\n  \}/);
assert(timeMatchSource, 'app.js should expose customFileTimeMatch');
const timeSandbox = {};
vm.runInNewContext(`${timeMatchSource[0]}; this.customFileTimeMatch = customFileTimeMatch;`, timeSandbox);
assert.strictEqual(timeSandbox.customFileTimeMatch('0')?.[1], '0', 'plain numeric stems should map to 0h');
assert.strictEqual(timeSandbox.customFileTimeMatch('24')?.[1], '24', 'plain numeric stems should map to 24h');
assert.strictEqual(timeSandbox.customFileTimeMatch('48')?.[1], '48', 'plain numeric stems should map to 48h');

const overlayRectSource = js.match(/function updateQcOverlayRect\(start, dx, dy, mode, bounds, minSize\)\s*\{[\s\S]*?\n  \}/);
assert(overlayRectSource, 'app.js should expose updateQcOverlayRect');
const overlaySandbox = {};
vm.runInNewContext(`${overlayRectSource[0]}; this.updateQcOverlayRect = updateQcOverlayRect;`, overlaySandbox);
const bounds = {left:0,top:0,right:500,bottom:400};
assert.deepStrictEqual(
  {...overlaySandbox.updateQcOverlayRect({left:100,top:80,width:240,height:180},50,30,'move',bounds,24)},
  {left:150,top:110,width:240,height:180},
  'Dragging the DOM crop body should move without resizing'
);
assert.deepStrictEqual(
  {...overlaySandbox.updateQcOverlayRect({left:100,top:80,width:240,height:180},-30,-20,'top-left',bounds,24)},
  {left:70,top:60,width:270,height:200},
  'Dragging a DOM crop corner should resize from that corner'
);

const sidebarVisibilitySource = js.match(/function sidebarSectionHiddenForModule\(module, isBuilder, isReview, defaultHidden\)\s*\{[\s\S]*?\n  \}/);
assert(sidebarVisibilitySource, 'app.js should expose sidebarSectionHiddenForModule');
const sidebarVisibilitySandbox = {};
vm.runInNewContext(
  `${sidebarVisibilitySource[0]}; this.sidebarSectionHiddenForModule = sidebarSectionHiddenForModule;`,
  sidebarVisibilitySandbox
);
assert.strictEqual(
  sidebarVisibilitySandbox.sidebarSectionHiddenForModule('qc', false, false, false),
  true,
  'Image QC should hide Analysis-only sidebar sections'
);
assert.strictEqual(
  sidebarVisibilitySandbox.sidebarSectionHiddenForModule('analysis', false, false, false),
  false,
  'Analysis should restore sidebar sections that were initially visible'
);
assert.strictEqual(
  sidebarVisibilitySandbox.sidebarSectionHiddenForModule('analysis', false, false, true),
  true,
  'Analysis should preserve sections that were initially hidden'
);

const replicateStateKeySource = js.match(/function builderReplicateStateKey\(value\)\s*\{[\s\S]*?\n  \}/);
assert(replicateStateKeySource, 'app.js should expose builderReplicateStateKey');
const replicateStateKeySandbox = {};
vm.runInNewContext(
  `${replicateStateKeySource[0]}; this.builderReplicateStateKey = builderReplicateStateKey;`,
  replicateStateKeySandbox
);
assert.strictEqual(
  replicateStateKeySandbox.builderReplicateStateKey('controlReplicateIds'),
  'controlReplicateIds',
  'Control replicate checkboxes should update control replicate state'
);
assert.strictEqual(
  replicateStateKeySandbox.builderReplicateStateKey('treatmentReplicateIds'),
  'treatmentReplicateIds',
  'Treatment replicate checkboxes should update treatment replicate state'
);
assert.strictEqual(
  replicateStateKeySandbox.builderReplicateStateKey('unknown'),
  '',
  'Unknown replicate checkbox state keys should be ignored'
);

const averageSource = js.match(/function average\(values\)\s*\{[\s\S]*?\n  \}/);
const standardDeviationSource = js.match(/function sampleStandardDeviation\(values\)\s*\{[\s\S]*?\n  \}/);
const aggregateRowsSource = js.match(/function aggregateBuilderConditionRows\(rows, conditionKey, conditionLabel\)\s*\{[\s\S]*?\n  \}/);
assert(averageSource, 'app.js should expose average');
assert(standardDeviationSource, 'app.js should expose sampleStandardDeviation');
assert(aggregateRowsSource, 'app.js should expose aggregateBuilderConditionRows');
const aggregateSandbox = {};
vm.runInNewContext(
  `${averageSource[0]}; ${standardDeviationSource[0]}; ${aggregateRowsSource[0]}; this.aggregateBuilderConditionRows = aggregateBuilderConditionRows;`,
  aggregateSandbox
);
const aggregateRows = aggregateSandbox.aggregateBuilderConditionRows([
  {conditionKey:'control',x:24,label:'24h',areaClosurePct:40,widthNormalizedPct:70},
  {conditionKey:'control',x:24,label:'24h',areaClosurePct:50,widthNormalizedPct:80},
  {conditionKey:'control',x:24,label:'24h',areaClosurePct:60,widthNormalizedPct:90}
], 'control', 'Control');
assert.strictEqual(aggregateRows[0].replicateCount, 3, 'Builder aggregation should retain replicate count');
assert.strictEqual(aggregateRows[0].areaClosurePct, 50, 'Builder aggregation should calculate the replicate mean');
assert.strictEqual(aggregateRows[0].areaClosurePctSd, 10, 'Builder aggregation should calculate sample SD for closure');
assert.strictEqual(aggregateRows[0].widthNormalizedPctSd, 10, 'Builder aggregation should calculate sample SD for normalized width');

const closurePlotSource = js.match(/function drawBuilderClosurePlot\(ctx,rows,x,y,w,h,settings,style='grayscale',includeHeader=true\)\s*\{[\s\S]*?\n  \}/);
const linePlotSource = js.match(/function drawBuilderLinePlot\(ctx,rows,x,y,w,h,settings,style='grayscale',includeHeader=true\)\s*\{[\s\S]*?\n  \}/);
assert(closurePlotSource?.[0].includes('areaClosurePctSd'), 'Panel B should draw closure SD error bars');
assert(linePlotSource?.[0].includes('`${metric}Sd`'), 'Panel C should draw metric SD error bars');
assert(js.includes('function builderLegendLayout'), 'Builder plots should calculate a multi-row legend layout for 4+ conditions');
assert(js.includes('function drawBuilderLegend'), 'Builder plots should share a dynamic legend drawing helper');
assert(closurePlotSource?.[0].includes('legendLayout.rows'), 'Panel B should reserve x-axis space for multi-row legends');
assert(linePlotSource?.[0].includes('legendLayout.rows'), 'Panel C should reserve x-axis space for multi-row legends');
assert(closurePlotSource?.[0].includes('drawBuilderLegend'), 'Panel B should use the dynamic legend helper');
assert(linePlotSource?.[0].includes('drawBuilderLegend'), 'Panel C should use the dynamic legend helper');
assert(js.includes('summary_mean'), 'Builder CSV should export aggregate means');
assert(js.includes('summary_sd'), 'Builder CSV should export aggregate SD values');
assert(js.includes('summary_n'), 'Builder CSV should export replicate counts');
assert(js.includes('Bars and points show mean ± SD'), 'Builder caption should define the error bars');

assert(js.includes('function builderTreatmentArms'), 'Builder should expose treatment arms for multi-treatment figures');
assert(js.includes('function addBuilderTreatmentArm'), 'Builder should support adding another treatment condition');
assert(js.includes('function builderConditionSeries'), 'Builder plots should use dynamic condition series');
assert(js.includes('multi-treatment'), 'Builder should keep a multi-treatment template mode');
assert(js.includes('additionalTreatmentArms'), 'Builder state should persist added treatment arms');
assert(js.includes('treatment-2'), 'Builder should key extra treatment arms separately from the primary treatment');
assert(js.includes('replicateIds'), 'Additional treatment arms should persist their own replicate IDs');
assert(js.includes('data-treatment-arm-replicate'), 'Additional treatment arm cards should expose replicate checkboxes');
assert(js.includes('selectedBuilderTreatmentArmReplicates'), 'Additional treatment arms should read their selected replicates');
assert(js.includes('builderTreatmentArms'), 'Builder UI should render added treatment arms');
assert(css.includes('.builder-treatment-arms'), 'styles.css should style multi-treatment arm controls');
assert(css.includes('.builder-treatment-arm'), 'styles.css should style each treatment arm card');

[
  '.module-tabs',
  '.image-qc',
  '.qc-layout',
  '.qc-preview',
  '.qc-image-position',
  '.qc-advance-notice',
  '.qc-image-row.arrived',
  '.qc-crop-overlay',
  '.qc-crop-handle',
  '.builder-empty[hidden]',
  '.publication-builder',
  '.builder-grid',
  '.builder-preview'
].forEach(selector => {
  assert(css.includes(selector), `styles.css should style ${selector}`);
});

console.log('Publication Figure Builder static contract passed.');
