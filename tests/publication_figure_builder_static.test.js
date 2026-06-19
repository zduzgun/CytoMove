const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

const html = read('prototype_refactor/index.html');
const js = read('prototype_refactor/app.js');
const css = read('prototype_refactor/styles.css');
const specPath = path.join(root, 'docs/superpowers/specs/2026-06-16-publication-figure-builder-v1-design.md');

assert(fs.existsSync(specPath), 'Publication Figure Builder design spec should be saved as markdown');
assert(
  html.includes('app.js?v=20260619-qc-continuous-crop'),
  'index.html should cache-bust app.js for the continuous QC crop workflow'
);
assert(
  html.includes('id="builderValidationTools" hidden'),
  'Validation controls should start hidden'
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
  'Scale bar',
  'Caption draft'
].forEach(text => {
  assert(html.includes(text), `index.html should contain "${text}"`);
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
  'Validation query parameter should opt into QA tools'
);
assert.strictEqual(
  validationSandbox.validationToolsEnabled({hostname:'cytomove.example',search:''}),
  false,
  'Validation tools should be hidden in normal hosted use'
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
  true,
  'Validation tools wrapper should remain hidden for normal hosted use'
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

const loaderSource = js.match(/async function loadServedValidationSet\(setId\)\s*\{[\s\S]*?\n  \}/);
assert(loaderSource, 'app.js should expose loadServedValidationSet');
const loaderBody = loaderSource[0];
const importedDeclarationIndex = loaderBody.indexOf('const imported=[];');
const loaderTryIndex = loaderBody.indexOf('try {');
const preflightIndex = loaderBody.indexOf('await fetchServedImageFile(config.groups[0].files[0])');
const firstMutationIndex = loaderBody.indexOf('createCustomGroupFromFiles(');
assert(importedDeclarationIndex>=0, 'Validation loader should declare imported before entering its try block');
assert(
  importedDeclarationIndex<loaderTryIndex,
  'Validation loader should keep the imported collection available to its catch block'
);
assert(preflightIndex>=0, 'Validation loader should probe the first image before importing groups');
assert(
  preflightIndex<firstMutationIndex,
  'Validation loader should complete its asset preflight before creating any custom group'
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
  drawQcCanvasSource[0].includes('drawImage(displayImg,previewCrop.x,previewCrop.y'),
  'QC canvas should draw only the saved crop bounds'
);

const applyQcCropSource = js.match(/function applyQcCrop\(\)\s*\{[\s\S]*?\n  \}/);
assert(applyQcCropSource, 'app.js should expose applyQcCrop');
assert(
  !applyQcCropSource[0].includes('samples.forEach'),
  'Saving a crop should not overwrite every image crop state'
);

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
    rotation:0,
    fineRotation:0,
    autoCropFov:false,
    excluded:false,
    editedAt:null,
    needsCrop:false,
    borderCheckPerformed:false
  },
  'New QC image state should include persistent fine-rotation and auto-crop metadata'
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
    excluded:false,
    editedAt:123
  },
  'Locked QC snapshots should normalize and preserve geometry metadata'
);
assert(
  applyQcStateSource[0].includes('applyQcGeometryControls(qc,el,state.appModule)'),
  'Applying QC state should restore geometry through the compatible control adapter'
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
    {autoCrop:true,cropRatio:{x:0,y:0,w:1,h:1},deskew:9,scratchOrientation:'vertical'},
    {
      orientation:'horizontal',
      cropRatio:{x:0.1,y:0.2,w:0.7,h:0.6},
      rotation:90,
      fineRotation:'2.5',
      autoCropFov:true
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
    autoCropFov:true
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

const applyQcGeometryControlsSource = js.match(/function applyQcGeometryControls\(qc, controls, appModule\)\s*\{[\s\S]*?\n  \}/);
assert(applyQcGeometryControlsSource, 'app.js should expose applyQcGeometryControls');
const applyQcGeometryControlsSandbox = {};
vm.runInNewContext(
  `${applyQcGeometryControlsSource[0]}; this.applyQcGeometryControls = applyQcGeometryControls;`,
  applyQcGeometryControlsSandbox
);
assert.doesNotThrow(
  ()=>applyQcGeometryControlsSandbox.applyQcGeometryControls({}, {}, 'analysis'),
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
  legacyAnalysisControls,
  'analysis'
);
assert.strictEqual(legacyAnalysisControls.deskewAngle.value,'3');
assert.strictEqual(legacyAnalysisControls.deskewAngleVal.value,'3');
assert.strictEqual(
  legacyAnalysisControls.autoCropFov.checked,
  false,
  'Analysis should not restore QC auto-crop into the legacy Analysis control'
);
applyQcGeometryControlsSandbox.applyQcGeometryControls(
  {fineRotation:3,autoCropFov:true},
  legacyAnalysisControls,
  'qc'
);
assert.strictEqual(
  legacyAnalysisControls.autoCropFov.checked,
  true,
  'QC context may restore auto-crop into the legacy control until the dedicated QC control exists'
);

const leaveCropEditSource = js.match(/function leaveCropEdit\(apply=true\)\s*\{[\s\S]*?\n  \}/);
assert(leaveCropEditSource, 'app.js should expose leaveCropEdit');
const resetCropAndZoomSource = js.match(/function resetCropAndZoom\(\)\s*\{[\s\S]*?\n  \}/);
assert(resetCropAndZoomSource, 'app.js should expose resetCropAndZoom');
assert(
  !leaveCropEditSource[0].includes('updateQcState')&&
  !leaveCropEditSource[0].includes('resetLockedQcSnapshot')&&
  !resetCropAndZoomSource[0].includes('updateQcState')&&
  !resetCropAndZoomSource[0].includes('resetLockedQcSnapshot'),
  'Legacy Analysis crop helpers should never mutate QC working state or reset its locked snapshot'
);
assert(
  applyQcCropSource[0].includes('loadQcSampleAt(nextIndex,{openAdjust:true})'),
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
assert(js.includes('buildBuilderPptxSlide'), 'Builder export should include a PPTX slide');

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
assert(js.includes('summary_mean'), 'Builder CSV should export aggregate means');
assert(js.includes('summary_sd'), 'Builder CSV should export aggregate SD values');
assert(js.includes('summary_n'), 'Builder CSV should export replicate counts');
assert(js.includes('Bars and points show mean ± SD'), 'Builder caption should define the error bars');

[
  '.module-tabs',
  '.image-qc',
  '.qc-layout',
  '.qc-preview',
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
