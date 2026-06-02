const CALIBRATION = [
    { id:'cal-001', imageId:'cytv-0260', path:'wound healing/29.06.22/COMBİNE/H-K-0-24-48/HK-0H.jpg',    cell:'HUVEC',      condition:'Control',   time:'0h',  area:1678355, areaPct:51.801, width:934.773, closure:null,    confidence:'whst-rerun' },
    { id:'cal-002', imageId:'cytv-0263', path:'wound healing/29.06.22/COMBİNE/H-K-0-24-48/HK-24H.jpg',   cell:'HUVEC',      condition:'Control',   time:'24h', area:966903,  areaPct:29.843, width:555.649, closure:42.3898, confidence:'whst-rerun' },
    { id:'cal-003', imageId:'cytv-0266', path:'wound healing/29.06.22/COMBİNE/H-K-0-24-48/HK-48H.jpg',   cell:'HUVEC',      condition:'Control',   time:'48h', area:537627,  areaPct:16.593, width:341.152, closure:67.9670, confidence:'whst-rerun' },
    { id:'cal-004', imageId:'cytv-0308', path:'wound healing/29.06.22/COMBİNE/M-8F-0H-24-48/M8F-0H.jpg', cell:'MDA-MB-231', condition:'FDI-6 8uM', time:'0h',  area:550026,  areaPct:57.271, width:6.911,  closure:null,    confidence:'provisional' },
    { id:'cal-005', imageId:'cytv-0311', path:'wound healing/29.06.22/COMBİNE/M-8F-0H-24-48/M8F-24H.jpg',cell:'MDA-MB-231', condition:'FDI-6 8uM', time:'24h', area:245294,  areaPct:25.541, width:24.087, closure:55.4032, confidence:'primary' },
    { id:'cal-006', imageId:'cytv-0314', path:'wound healing/29.06.22/COMBİNE/M-8F-0H-24-48/M8F-48H.jpg',cell:'MDA-MB-231', condition:'FDI-6 8uM', time:'48h', area:301709,  areaPct:31.415, width:0.531,  closure:45.1464, confidence:'primary' },
    { id:'cal-007', imageId:'cytv-0335', path:'wound healing/29.06.22/COMBİNE/M-K-0-24-48/MK-0H.jpg',    cell:'MDA-MB-231', condition:'Control',   time:'0h',  area:1688680, areaPct:52.12,  width:35.685, closure:null,    confidence:'provisional' },
    { id:'cal-008', imageId:'cytv-0338', path:'wound healing/29.06.22/COMBİNE/M-K-0-24-48/MK-24H.jpg',   cell:'MDA-MB-231', condition:'Control',   time:'24h', area:992658,  areaPct:30.638, width:99.413, closure:41.2169, confidence:'provisional' },
    { id:'cal-009', imageId:'cytv-0340', path:'wound healing/29.06.22/COMBİNE/M-K-0-24-48/MK-48H.jpg',   cell:'MDA-MB-231', condition:'Control',   time:'48h', area:13844,   areaPct:0.427,  width:79.667, closure:99.1802, confidence:'primary' }
  ];

  const PRESETS = {
    rough:    { varianceRadius:22, thresholdMode:'wide', thresholdValue:-32, minComponent:55000, tinyIslandMode:'medium', fovCutoff:36, fovMode:'cutoff' },
    standard: { varianceRadius:3, thresholdMode:'small', thresholdValue:1, minComponent:0, tinyIslandMode:'trace', fovCutoff:18, fovMode:'cutoff' },
    fine:     { varianceRadius:18, thresholdMode:'wide', thresholdValue:-25, minComponent:20000, tinyIslandMode:'low', fovCutoff:0, fovMode:'full' },
    phase2:   { varianceRadius:1, thresholdMode:'small', thresholdValue:1, minComponent:0, tinyIslandMode:'trace', fovCutoff:18, fovMode:'cutoff' }
  };

  const GROUPS = [
    { id:'hk-control', label:'HK Control', sampleIds:['cal-001','cal-002','cal-003'] },
    { id:'m8f-fdi6', label:'M8F FDI-6 8uM', sampleIds:['cal-004','cal-005','cal-006'] },
    { id:'mk-control', label:'MK Control', sampleIds:['cal-007','cal-008','cal-009'] }
  ];

  const CYTOMOVE_ALGORITHM_VERSION = 'prototype-whst-variance-v0.4';
  const SHOW_DEMO_CALIBRATION = false;

  const state = {
    mode:'single',
    image:null, imageOriginal:null, imageName:'', sample:null, rotation:0,
    view:'overlay', result:null, rulerVisible:false,
    groupResults:{},
    manualOverrides:{},
    sampleSettings:{},
    customSamples:[],
    customGroups:[],
    objectUrls:[],
    calibrationReport:null,
    groupRenderSeq:0,
    autoMicroscopeDetectSeq:0,
    microscopeModeUserSet:false,
    lastAutoMicroscopeGroupKey:'',
    contourStyleUserSet:false,
    varMap:null, maskData:null, autoMaskData:null, fieldData:null, sourceData:null, grayData:null, darkGuideThreshold:0,
    brushMode:'off', brushDrawing:false, brushEdited:false, brushAddedPx:0, brushRemovedPx:0,
    correctionSelecting:false, correctionStart:null, correctionRect:null,
    brushHistory:[],
    crop:null, cropManual:false, cropEditing:false, cropDragging:false, cropDragStart:null, cropDragMode:'move',
    rulerOffsetX:0, rulerOffsetY:0, rulerDragging:false, rulerDragStart:null,
    zoom:1, panX:0, panY:0, panning:false, panStart:null
  };
  const desktopLinkState = {
    manifest:null,
    urls:{
      feedback:'https://cytomove.com/#feedback-title',
      account:'https://cytomove.com/',
      update:'https://cytomove.com/'
    }
  };

  const el = {
    modeToggle:         document.getElementById('modeToggle'),
    groupSelect:        document.getElementById('groupSelect'),
    groupSelectRow:     document.getElementById('groupSelectRow'),
    deleteGroup:        document.getElementById('deleteGroup'),
    applySettingsGroup: document.getElementById('applySettingsGroup'),
    exportGroupPng:     document.getElementById('exportGroupPng'),
    autoCalibrateGroup: document.getElementById('autoCalibrateGroup'),
    autoDetectModeGroup:document.getElementById('autoDetectModeGroup'),
    sampleSelect:       document.getElementById('sampleSelect'),
    sampleMeta:         document.getElementById('sampleMeta'),
    loadSample:         document.getElementById('loadSample'),
    rerun:              document.getElementById('rerun'),
    varianceRadius:     document.getElementById('varianceRadius'),
    varianceRadiusVal:  document.getElementById('varianceRadiusVal'),
    thresholdOffset:    document.getElementById('thresholdOffset'),
    thresholdOffsetVal: document.getElementById('thresholdOffsetVal'),
    thresholdOffsetLabel: document.getElementById('thresholdOffsetLabel'),
    minComponent:       document.getElementById('minComponent'),
    minComponentVal:    document.getElementById('minComponentVal'),
    tinyIslandMode:     document.getElementById('tinyIslandMode'),
    fovCutoff:          document.getElementById('fovCutoff'),
    fovCutoffVal:       document.getElementById('fovCutoffVal'),
    microscopeMode:     document.getElementById('microscopeMode'),
    fovMode:            document.getElementById('fovMode'),
    scratchOrientation: document.getElementById('scratchOrientation'),
    orientationHint:    document.getElementById('orientationHint'),
    deskewAngle:        document.getElementById('deskewAngle'),
    deskewAngleVal:     document.getElementById('deskewAngleVal'),
    autoCropFov:        document.getElementById('autoCropFov'),
    applyCropRatioGroup:document.getElementById('applyCropRatioGroup'),
    adjustCrop:         document.getElementById('adjustCrop'),
    applyCrop:          document.getElementById('applyCrop'),
    resetCrop:          document.getElementById('resetCrop'),
    contourThickness:   document.getElementById('contourThickness'),
    contourThicknessVal:document.getElementById('contourThicknessVal'),
    contourColor:       document.getElementById('contourColor'),
    contourStyle:       document.getElementById('contourStyle'),
    brushMode:          document.getElementById('brushMode'),
    brushSize:          document.getElementById('brushSize'),
    brushSizeVal:       document.getElementById('brushSizeVal'),
    undoBrush:          document.getElementById('undoBrush'),
    resetBrush:         document.getElementById('resetBrush'),
    angleRulerToggle:   document.getElementById('angleRulerToggle'),
    viewToggle:         document.getElementById('viewToggle'),
    metricsPanel:       document.getElementById('metricsPanel'),
    exportPng:          document.getElementById('exportPng'),
    exportPlots:        document.getElementById('exportPlots'),
    showAreaPlot:       document.getElementById('showAreaPlot'),
    showWidthPlot:      document.getElementById('showWidthPlot'),
    exportCsv:          document.getElementById('exportCsv'),
    exportExcel:        document.getElementById('exportExcel'),
    canvas:             document.getElementById('canvas'),
    canvasTitle:        document.getElementById('canvasTitle'),
    canvasMeta:         document.getElementById('canvasMeta'),
    emptyState:         document.getElementById('emptyState'),
    dropZone:           document.getElementById('dropZone'),
    groupPrev:          document.getElementById('groupPrev'),
    groupNext:          document.getElementById('groupNext'),
    plotPanel:          document.getElementById('plotPanel'),
    plotDialogTitle:    document.getElementById('plotDialogTitle'),
    plotBody:           document.getElementById('plotBody'),
    closePlot:          document.getElementById('closePlot'),
    groupView:          document.getElementById('groupView'),
    logMsg:             document.getElementById('logMsg'),
    timerMsg:           document.getElementById('timerMsg'),
    spinner:            document.getElementById('spinner'),
    zoomBadge:          document.getElementById('zoomBadge'),
    zoomIn:             document.getElementById('zoomIn'),
    zoomOut:            document.getElementById('zoomOut'),
    zoomReset:          document.getElementById('zoomReset'),
    deskewMinus:        document.getElementById('deskewMinus'),
    deskewPlus:         document.getElementById('deskewPlus'),
    deskewBadge:        document.getElementById('deskewBadge'),
    rotateImage:        document.getElementById('rotateImage'),
    openFile:           document.getElementById('openFile'),
    fileInput:          document.getElementById('fileInput'),
    desktopLinkStatus:  document.getElementById('desktopLinkStatus'),
    desktopLinkMessage: document.getElementById('desktopLinkMessage'),
    desktopModuleList:  document.getElementById('desktopModuleList'),
    desktopFeedback:    document.getElementById('desktopFeedback'),
    desktopAccount:     document.getElementById('desktopAccount'),
    desktopUpdate:      document.getElementById('desktopUpdate'),
    appShell:           document.querySelector('.app'),
    trialGate:          document.getElementById('trialGate'),
    trialWelcome:       document.getElementById('trialWelcome'),
    trialExpired:       document.getElementById('trialExpired'),
    trialDaysRemaining: document.getElementById('trialDaysRemaining'),
    trialExpiresAt:     document.getElementById('trialExpiresAt'),
    trialStartAnalysis: document.getElementById('trialStartAnalysis'),
    trialVisitSite:     document.getElementById('trialVisitSite'),
    trialExpiredReason: document.getElementById('trialExpiredReason'),
    trialExpiredVisit:  document.getElementById('trialExpiredVisit'),
    trialExpiredFeedback: document.getElementById('trialExpiredFeedback'),
    trialCloseApp:      document.getElementById('trialCloseApp')
  };

  // Helpers
  function fmt(v, d=0) {
    if (v===null||v===undefined||isNaN(v)||v==='') return 'n/a';
    return Number(v).toLocaleString(undefined,{maximumFractionDigits:d});
  }
  function escHtml(v) {
    return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function setLog(msg, timer='') { el.logMsg.innerHTML=msg; el.timerMsg.textContent=timer; }

  function localDesktopVersion() {
    return window.cytomoveDesktop?.version || '0.1.0-alpha.1';
  }

  function compareVersions(a, b) {
    const pa=String(a||'').match(/\d+/g)?.map(Number)||[];
    const pb=String(b||'').match(/\d+/g)?.map(Number)||[];
    const length=Math.max(pa.length,pb.length);
    for(let i=0;i<length;i++) {
      const da=pa[i]||0, db=pb[i]||0;
      if(da!==db) return da-db;
    }
    return 0;
  }

  function renderDesktopManifest(manifest) {
    desktopLinkState.manifest=manifest;
    desktopLinkState.urls.feedback=manifest.feedbackUrl||desktopLinkState.urls.feedback;
    desktopLinkState.urls.account=manifest.accountUrl||desktopLinkState.urls.account;
    desktopLinkState.urls.update=manifest.updateUrl||desktopLinkState.urls.update;
    const latest=manifest.latestVersion||'unknown';
    const current=localDesktopVersion();
    const updateAvailable=latest!=='unknown'&&compareVersions(current,latest)<0;
    if(el.desktopLinkStatus) {
      el.desktopLinkStatus.textContent=updateAvailable?`Update ${latest} available`:'Web link active';
      el.desktopLinkStatus.classList.toggle('online',true);
      el.desktopLinkStatus.classList.toggle('offline',false);
    }
    if(el.desktopLinkMessage) {
      el.desktopLinkMessage.innerHTML=`<strong>${updateAvailable?'Update available':'Connected to Cytomove web'}.</strong> ${escHtml(manifest.message||'Desktop status received.')}<br><small>Local ${escHtml(current)} · latest ${escHtml(latest)} · channel ${escHtml(manifest.channel||'alpha')}</small>`;
    }
    if(el.desktopModuleList) {
      const modules=Array.isArray(manifest.modules)?manifest.modules:[];
      el.desktopModuleList.innerHTML=modules.map(module=>{
        const stateClass=String(module.state||'planned').toLowerCase();
        return `<div class="desktop-module"><strong>${escHtml(module.label||module.id)}</strong><span class="${escHtml(stateClass)}">${escHtml(module.state||'planned')}</span></div>`;
      }).join('');
    }
  }

  function renderDesktopManifestOffline(error) {
    if(el.desktopLinkStatus) {
      el.desktopLinkStatus.textContent='Offline mode';
      el.desktopLinkStatus.classList.toggle('online',false);
      el.desktopLinkStatus.classList.toggle('offline',true);
    }
    if(el.desktopLinkMessage) {
      el.desktopLinkMessage.innerHTML=`<strong>Offline local analysis.</strong> Cytomove could not check updates or module status. Images still stay on this computer.<br><small>${escHtml(error?.message||'Web manifest unavailable')}</small>`;
    }
    if(el.desktopModuleList) {
      el.desktopModuleList.innerHTML='<div class="desktop-module"><strong>Wound healing core</strong><span class="included">included</span></div>';
    }
  }

  async function loadDesktopManifest() {
    if(!window.cytomoveDesktop?.getManifest) {
      renderDesktopManifestOffline(new Error('Desktop bridge unavailable.'));
      return;
    }
    try {
      const manifest=await window.cytomoveDesktop.getManifest();
      renderDesktopManifest(manifest);
    } catch(err) {
      console.warn(err);
      renderDesktopManifestOffline(err);
    }
  }

  function openDesktopLink(kind) {
    const url=desktopLinkState.urls[kind];
    if(!url) return;
    if(window.cytomoveDesktop?.openExternal) {
      window.cytomoveDesktop.openExternal(url).catch(err=>setLog(`<strong>Link open failed.</strong> ${escHtml(err.message||err)}`));
    } else {
      window.open(url,'_blank','noopener');
    }
  }

  function formatTrialDate(value) {
    const date=new Date(value);
    if(Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
  }

  function trialWelcomeKey(trial) {
    const version=window.cytomoveDesktop?.version||'dev';
    return `cytomove.desktopAlpha.welcomeSeen.${version}.${trial?.trialVersion||'alpha'}`;
  }

  function hasSeenTrialWelcome(trial) {
    try {
      return localStorage.getItem(trialWelcomeKey(trial))==='1';
    } catch(_error) {
      return false;
    }
  }

  function markTrialWelcomeSeen(trial) {
    try {
      localStorage.setItem(trialWelcomeKey(trial),'1');
    } catch(_error) {}
  }

  function showTrialPanel(kind, trial) {
    if(!el.trialGate) return;
    el.trialGate.hidden=false;
    el.trialWelcome.hidden=kind!=='welcome';
    el.trialExpired.hidden=kind!=='expired';
    if(kind==='expired') el.appShell?.classList.add('trial-locked');
    else el.appShell?.classList.remove('trial-locked');

    if(el.trialDaysRemaining) {
      const days=Math.max(0,Number(trial?.daysRemaining)||0);
      el.trialDaysRemaining.textContent=`${days} day${days===1?'':'s'}`;
    }
    if(el.trialExpiresAt) el.trialExpiresAt.textContent=formatTrialDate(trial?.expiresAt);
    if(el.trialExpiredReason) {
      el.trialExpiredReason.textContent=trial?.clockInvalid
        ? 'The system clock appears to have been moved backwards, so this alpha build is paused for safety.'
        : 'This alpha build has reached its 30-day testing window.';
    }
  }

  function hideTrialPanel() {
    if(!el.trialGate) return;
    el.trialGate.hidden=true;
    el.trialWelcome.hidden=true;
    el.trialExpired.hidden=true;
    el.appShell?.classList.remove('trial-locked');
  }

  async function initTrialGate() {
    if(!window.cytomoveDesktop?.getTrialState) return;
    try {
      const trial=await window.cytomoveDesktop.getTrialState();
      if(trial.expired||trial.clockInvalid) {
        showTrialPanel('expired',trial);
        return;
      }
      if(!hasSeenTrialWelcome(trial)) showTrialPanel('welcome',trial);
    } catch(err) {
      console.warn(err);
      setLog(`<strong>Trial check failed.</strong> ${escHtml(err.message||err)} Local analysis remains available.`);
    }
  }

  const BUTTON_TOOLTIPS = {
    deleteGroup:'Remove the selected loaded group from this browser session.',
    loadSample:'Load the selected calibration sample into the main canvas.',
    rerun:'Run segmentation again with the current settings.',
    applySettingsGroup:'Re-analyze all cards in the selected group with current settings.',
    exportGroupPng:'Download one ZIP file containing contour overlay PNGs for the selected group.',
    exportPlots:'Download wound area and width plots for the selected group as one ZIP.',
    showAreaPlot:'Show the wound area time-course plot without downloading.',
    showWidthPlot:'Show the mean wound width time-course plot without downloading.',
    autoDetectModeGroup:'Sample group images and choose the microscope mode automatically.',
    angleRulerToggle:'Show or hide the draggable angle guide overlay.',
    adjustCrop:'Draw or edit the analysis crop region.',
    applyCrop:'Apply the current crop to the analysis.',
    resetCrop:'Return to the full image or automatic FOV crop.',
    undoBrush:'Undo the last manual mask correction.',
    resetBrush:'Remove manual correction and return to the automatic mask.',
    exportPng:'Save the current contour overlay as a PNG image.',
    exportCsv:'Export the current metrics as CSV.',
    exportExcel:'Export metrics as an Excel-compatible table.',
    zoomIn:'Zoom into the image canvas.',
    zoomOut:'Zoom out of the image canvas.',
    zoomReset:'Reset zoom and pan.',
    deskewMinus:'Rotate the image slightly counterclockwise.',
    deskewPlus:'Rotate the image slightly clockwise.',
    rotateImage:'Rotate the image by 90 degrees.',
    openFile:'Open one image or multiple images from your computer.',
    groupPrev:'Load the previous image in the current group.',
    groupNext:'Load the next image in the current group.'
  };

  function buttonTooltipText(target) {
    if(!target) return '';
    if(target.dataset.tooltip) return target.dataset.tooltip;
    if(target.dataset.tip) return target.dataset.tip;
    if(target.id&&BUTTON_TOOLTIPS[target.id]) return BUTTON_TOOLTIPS[target.id];
    if(target.dataset.mode==='single') return 'Analyze one image in the main canvas.';
    if(target.dataset.mode==='group') return 'Review a time-course group side by side.';
    if(target.dataset.preset==='rough') return 'Brightfield preset for larger or clearer cell edges.';
    if(target.dataset.preset==='standard') return 'Optimized brightfield preset for small-cell CSMA-style images.';
    if(target.dataset.preset==='fine') return 'Phase contrast preset; keeps the full rectangular field.';
    if(target.dataset.preset==='phase2') return 'Speckled phase-contrast preset using low-variance brightfield-style segmentation.';
    if(target.dataset.fovMode==='full') return 'Keep the full rectangular image field.';
    if(target.dataset.fovMode==='cutoff') return 'Trim dark microscope borders using the FOV cutoff.';
    if(target.dataset.view==='overlay') return 'Show the image with contour overlay.';
    if(target.dataset.view==='mask') return 'Show the binary wound mask.';
    if(target.dataset.brushMode==='off') return 'Turn manual mask editing off.';
    if(target.dataset.brushMode==='add') return 'Draw a small rectangle and locally scan it for missed wound area.';
    if(target.dataset.brushMode==='fill') return 'Draw a rectangle and fill it directly as wound area.';
    if(target.dataset.brushMode==='erase') return 'Draw a small rectangle and locally remove cell-like false wound area.';
    if(target.dataset.brushMode==='clean') return 'Draw a rectangle and remove only very small mask fragments inside it.';
    const title=target.getAttribute('data-title')||target.getAttribute('title');
    if(title) return title;
    const aria=target.getAttribute('aria-label');
    if(aria) return aria;
    return target.textContent.trim();
  }

  function setupDelayedTooltips() {
    const targets=[...document.querySelectorAll('button, .file-picker-label')];
    targets.forEach(target=>{
      const title=target.getAttribute('title');
      if(title) {
        target.dataset.title=title;
        target.removeAttribute('title');
      }
      const text=buttonTooltipText(target);
      if(text) target.dataset.tooltip=text;
    });

    const tip=document.createElement('div');
    tip.className='delayed-tooltip';
    tip.hidden=true;
    document.body.appendChild(tip);
    let timer=null;
    let active=null;

    const hide=()=>{
      window.clearTimeout(timer);
      timer=null;
      active=null;
      tip.classList.remove('visible');
      tip.hidden=true;
    };
    const show=target=>{
      const text=buttonTooltipText(target);
      if(!text) return;
      tip.textContent=text;
      tip.hidden=false;
      const rect=target.getBoundingClientRect();
      const margin=10;
      const top=Math.min(window.innerHeight-tip.offsetHeight-margin, rect.bottom+8);
      let left=rect.left+(rect.width-tip.offsetWidth)/2;
      left=Math.max(margin,Math.min(window.innerWidth-tip.offsetWidth-margin,left));
      tip.style.left=`${left}px`;
      tip.style.top=`${Math.max(margin,top)}px`;
      requestAnimationFrame(()=>tip.classList.add('visible'));
    };
    const schedule=target=>{
      hide();
      active=target;
      timer=window.setTimeout(()=>{ if(active===target) show(target); },2000);
    };

    document.addEventListener('pointerover',e=>{
      const target=e.target.closest('button, .file-picker-label');
      if(!target||target.contains(e.relatedTarget)) return;
      schedule(target);
    });
    document.addEventListener('pointerout',e=>{
      const target=e.target.closest('button, .file-picker-label');
      if(!target||target.contains(e.relatedTarget)) return;
      hide();
    });
    document.addEventListener('focusin',e=>{
      const target=e.target.closest('button, .file-picker-label');
      if(target) schedule(target);
    });
    document.addEventListener('focusout',hide);
    window.addEventListener('scroll',hide,true);
    window.addEventListener('resize',hide);
  }
  function setSpinner(on) { el.spinner.classList.toggle('active',on); }
  function sampleUrl(s) { return s.url||('../'+s.path.split('/').map(encodeURIComponent).join('/')); }
  function isFileProtocol() { return window.location.protocol==='file:'; }
  function thresholdMode() {
    return el.thresholdOffset.dataset.mode||'small';
  }
  function smallThresholdLevelToOffset(level) {
    const v=Math.max(1,Math.min(50,Number(level)||1));
    return -100+(v-1)*(50/49);
  }
  function thresholdLevelToOffset(level) {
    if(thresholdMode()==='wide') return Math.max(-100,Math.min(100,Number(level)||0));
    return smallThresholdLevelToOffset(level);
  }
  function thresholdOffsetToLevel(offset, mode=thresholdMode()) {
    if(mode==='wide') return Math.max(-100,Math.min(100,Math.round(Number(offset)||0)));
    const v=1+((Number(offset)||-100)+100)*(49/50);
    return Math.max(1,Math.min(50,Math.round(v)));
  }
  function setThresholdMode(mode, value=null) {
    const next=mode==='wide'?'wide':'small';
    const currentOffset=thresholdLevelToOffset(el.thresholdOffset.value);
    el.thresholdOffset.dataset.mode=next;
    el.thresholdOffsetLabel.textContent=next==='wide'?'Threshold offset':'Threshold level';
    const min=next==='wide'?-100:1;
    const max=next==='wide'?100:50;
    const display=value===null?thresholdOffsetToLevel(currentOffset,next):value;
    [el.thresholdOffset,el.thresholdOffsetVal].forEach(input=>{
      input.min=String(min);
      input.max=String(max);
      input.step='1';
      input.value=clampControlValue({min,max,step:1,value:display},display);
    });
  }
  function clampControlValue(input, raw) {
    const min=Number(input.min), max=Number(input.max), step=Number(input.step)||1;
    let value=Number(raw);
    if(!Number.isFinite(value)) value=Number(input.value)||min;
    value=Math.max(min,Math.min(max,value));
    if(step>=1) value=Math.round(value/step)*step;
    return String(Math.max(min,Math.min(max,value)));
  }

  // 1. Grayscale
  function toGray(data, len) {
    const g=new Uint8Array(len);
    for (let i=0,p=0;i<data.length;i+=4,p++)
      g[p]=(0.2126*data[i]+0.7152*data[i+1]+0.0722*data[i+2])|0;
    return g;
  }

  // 2. FOV field mask
  function fovMask(gray, len, cutoff, mode='full') {
    const f=new Uint8Array(len);
    if(mode==='full') {
      f.fill(1);
      return f;
    }
    const th=Math.max(1,Number(cutoff)||18);
    for (let p=0;p<len;p++) f[p]=gray[p]>th?1:0;
    return f;
  }

  // 3. Contrast enhance (P1/P99 clip + normalize)
  function enhanceContrast(gray, field, len) {
    const hist=new Uint32Array(256);
    let count=0;
    for (let p=0;p<len;p++) if(field[p]) { hist[gray[p]]++; count++; }
    let lo=0,hi=255,acc=0;
    const loT=Math.floor(count*0.01), hiT=Math.floor(count*0.99);
    for(let v=0;v<256;v++){acc+=hist[v]; if(acc>=loT){lo=v;break;}}
    acc=0;
    for(let v=0;v<256;v++){acc+=hist[v]; if(acc>=hiT){hi=v;break;}}
    const range=Math.max(1,hi-lo);
    const out=new Uint8Array(len);
    for (let p=0;p<len;p++) {
      if(!field[p]) continue;
      out[p]=Math.max(0,Math.min(255,((gray[p]-lo)*255/range)|0));
    }
    return out;
  }

  function effectiveFovCutoff(gray, W, H, cutoff) {
    const samples=[];
    const padX=Math.max(2,Math.round(W*0.08));
    const padY=Math.max(2,Math.round(H*0.08));
    for(let y=0;y<H;y++) {
      for(let x=0;x<W;x++) {
        const cornerX=x<padX||x>=W-padX;
        const cornerY=y<padY||y>=H-padY;
        if(cornerX&&cornerY) samples.push(gray[y*W+x]);
      }
    }
    if(!samples.length) return Math.max(18,Number(cutoff)||0);
    samples.sort((a,b)=>a-b);
    const cornerP90=samples[Math.min(samples.length-1,Math.floor(samples.length*0.90))];
    const cornerP98=samples[Math.min(samples.length-1,Math.floor(samples.length*0.98))];
    const cornerDriven=Math.max(cornerP90+14,cornerP98+6);
    return Math.max(18,Number(cutoff)||0,Math.min(110,cornerDriven));
  }

  function estimateFovCrop(gray, W, H, cutoff) {
    const th=effectiveFovCutoff(gray,W,H,cutoff);
    const rowCounts=new Uint32Array(H);
    const colCounts=new Uint32Array(W);
    let count=0;
    for(let y=0;y<H;y++){
      for(let x=0;x<W;x++){
        const p=y*W+x;
        if(gray[p]<=th) continue;
        count++;
        rowCounts[y]++;
        colCounts[x]++;
      }
    }
    if(count<100) return {x:0,y:0,w:W,h:H,active:false,fovThreshold:th};

    const rowMax=Math.max(...rowCounts);
    const colMax=Math.max(...colCounts);
    const rowFloor=Math.max(8,Math.round(rowMax*0.08));
    const colFloor=Math.max(8,Math.round(colMax*0.08));
    let minY=0,maxY=H-1,minX=0,maxX=W-1;
    while(minY<H&&rowCounts[minY]<rowFloor) minY++;
    while(maxY>=0&&rowCounts[maxY]<rowFloor) maxY--;
    while(minX<W&&colCounts[minX]<colFloor) minX++;
    while(maxX>=0&&colCounts[maxX]<colFloor) maxX--;
    if(maxX<=minX||maxY<=minY) return {x:0,y:0,w:W,h:H,active:false,fovThreshold:th};

    const bw=maxX-minX+1, bh=maxY-minY+1;
    const pad=Math.max(4,Math.round(Math.min(bw,bh)*0.015));
    const cropW=Math.max(16,Math.min(W,bw+pad*2));
    const cropH=Math.max(16,Math.min(H,bh+pad*2));
    let x=Math.round(minX-pad), y=Math.round(minY-pad);
    x=Math.max(0,Math.min(W-cropW,x));
    y=Math.max(0,Math.min(H-cropH,y));
    return {x,y,w:cropW,h:cropH,active:cropW<W||cropH<H,fieldPixels:count,fovThreshold:th,bounds:{minX,minY,maxX,maxY,rowFloor,colFloor}};
  }

  function autoCropForImage(img, autoCrop=el.autoCropFov.checked, fovCutoff=Number(el.fovCutoff.value)) {
    if(!autoCrop) return {x:0,y:0,w:img.naturalWidth,h:img.naturalHeight,active:false};
    const probe=document.createElement('canvas');
    probe.width=img.naturalWidth; probe.height=img.naturalHeight;
    const probeCtx=probe.getContext('2d',{willReadFrequently:true});
    probeCtx.drawImage(img,0,0);
    const probeData=probeCtx.getImageData(0,0,probe.width,probe.height);
    return estimateFovCrop(toGray(probeData.data,probe.width*probe.height),probe.width,probe.height,fovCutoff);
  }

  function currentCrop() {
    if(!state.image) return null;
    if(state.cropManual&&state.crop) return state.crop;
    if(!el.autoCropFov.checked) return {x:0,y:0,w:state.image.naturalWidth,h:state.image.naturalHeight,active:false};
    if(!state.crop) state.crop=autoCropForImage(state.image);
    return state.crop;
  }

  function clampCrop(crop) {
    const img=state.image;
    if(!img) return crop;
    const minSize=32;
    crop.w=Math.max(minSize,Math.min(img.naturalWidth,Math.round(crop.w)));
    crop.h=Math.max(minSize,Math.min(img.naturalHeight,Math.round(crop.h)));
    crop.x=Math.max(0,Math.min(img.naturalWidth-crop.w,Math.round(crop.x)));
    crop.y=Math.max(0,Math.min(img.naturalHeight-crop.h,Math.round(crop.y)));
    crop.active=crop.w<img.naturalWidth||crop.h<img.naturalHeight;
    return crop;
  }

  function normalizedCropRatio(crop, img=state.image) {
    if(!crop||!img) return null;
    return {
      x:crop.x/img.naturalWidth,
      y:crop.y/img.naturalHeight,
      w:crop.w/img.naturalWidth,
      h:crop.h/img.naturalHeight
    };
  }

  function cropFromRatio(img, ratio) {
    if(!img||!ratio) return null;
    const crop={
      x:Math.round(ratio.x*img.naturalWidth),
      y:Math.round(ratio.y*img.naturalHeight),
      w:Math.round(ratio.w*img.naturalWidth),
      h:Math.round(ratio.h*img.naturalHeight),
      active:true
    };
    const minSize=32;
    crop.w=Math.max(minSize,Math.min(img.naturalWidth,crop.w));
    crop.h=Math.max(minSize,Math.min(img.naturalHeight,crop.h));
    crop.x=Math.max(0,Math.min(img.naturalWidth-crop.w,crop.x));
    crop.y=Math.max(0,Math.min(img.naturalHeight-crop.h,crop.y));
    crop.active=crop.w<img.naturalWidth||crop.h<img.naturalHeight;
    return crop;
  }

  function canvasPoint(evt) {
    const rect=el.canvas.getBoundingClientRect();
    return {
      x:(evt.clientX-rect.left)*el.canvas.width/rect.width,
      y:(evt.clientY-rect.top)*el.canvas.height/rect.height
    };
  }

  function cropHitMode(pt, crop) {
    const handle=Math.max(12,el.canvas.width/120);
    const near=(x,y)=>Math.abs(pt.x-x)<=handle&&Math.abs(pt.y-y)<=handle;
    if(near(crop.x+crop.w,crop.y+crop.h)) return 'corner';
    if(near(crop.x+crop.w,crop.y+crop.h/2)) return 'right';
    if(near(crop.x+crop.w/2,crop.y+crop.h)) return 'bottom';
    if(pt.x>=crop.x&&pt.x<=crop.x+crop.w&&pt.y>=crop.y&&pt.y<=crop.y+crop.h) return 'move';
    return '';
  }

  function drawCropEditor() {
    if(!state.image) return;
    const img=state.image, crop=currentCrop();
    const ctx=el.canvas.getContext('2d');
    el.canvas.width=img.naturalWidth; el.canvas.height=img.naturalHeight;
    ctx.drawImage(img,0,0);
    ctx.save();
    ctx.fillStyle='rgba(0,0,0,0.48)';
    ctx.fillRect(0,0,el.canvas.width,crop.y);
    ctx.fillRect(0,crop.y,crop.x,crop.h);
    ctx.fillRect(crop.x+crop.w,crop.y,el.canvas.width-(crop.x+crop.w),crop.h);
    ctx.fillRect(0,crop.y+crop.h,el.canvas.width,el.canvas.height-(crop.y+crop.h));
    ctx.strokeStyle='#000000';
    ctx.lineWidth=Math.max(4,Math.round(el.canvas.width/900));
    ctx.setLineDash([24,16]);
    ctx.strokeRect(crop.x,crop.y,crop.w,crop.h);
    ctx.strokeStyle='#ffffff';
    ctx.lineWidth=Math.max(2,Math.round(el.canvas.width/1400));
    ctx.setLineDash([]);
    ctx.strokeRect(crop.x+2,crop.y+2,crop.w-4,crop.h-4);
    const handle=Math.max(12,Math.round(el.canvas.width/120));
    ctx.fillStyle='#ffffff';
    ctx.strokeStyle='#000000';
    ctx.lineWidth=Math.max(2,Math.round(el.canvas.width/1600));
    [[crop.x+crop.w,crop.y+crop.h],[crop.x+crop.w,crop.y+crop.h/2],[crop.x+crop.w/2,crop.y+crop.h]].forEach(([hx,hy])=>{
      ctx.fillRect(hx-handle/2,hy-handle/2,handle,handle);
      ctx.strokeRect(hx-handle/2,hy-handle/2,handle,handle);
    });
    ctx.restore();
    el.canvas.hidden=false; el.emptyState.hidden=true;
    el.canvasTitle.textContent='Adjust crop';
    el.canvasMeta.textContent=`Drag rectangle to move. Drag edge/corner handles or use mouse wheel to resize. ${crop.w}x${crop.h} from ${img.naturalWidth}x${img.naturalHeight}`;
    setLog('<strong>Crop edit mode.</strong> Rectangular crop is allowed. Drag the rectangle or handles, then Apply crop.');
  }

  function enterCropEdit() {
    if(!state.image) return;
    state.crop=currentCrop();
    state.cropEditing=true;
    state.zoom=1; state.panX=0; state.panY=0;
    el.canvas.style.transform='';
    el.zoomBadge.classList.remove('visible');
    el.applyCrop.disabled=false;
    el.canvas.classList.add('grabbing');
    drawCropEditor();
  }

  function leaveCropEdit(apply=true) {
    state.cropEditing=false;
    state.cropDragging=false;
    state.cropDragMode='move';
    state.cropManual=!!apply;
    el.applyCrop.disabled=true;
    el.canvas.classList.remove('grabbing');
    if(apply) runSegmentation();
  }

  function resetCropAndZoom() {
    state.crop=null; state.cropManual=false; state.cropEditing=false; state.cropDragging=false; state.cropDragMode='move';
    state.zoom=1; state.panX=0; state.panY=0;
    el.canvas.style.transform='';
    el.zoomBadge.classList.remove('visible');
    el.applyCrop.disabled=true;
  }

  function transformImage(src, rotationDeg, deskewDeg) {
    const c=document.createElement('canvas');
    const quarter=((rotationDeg%360)+360)%360;
    const swap=quarter===90||quarter===270;
    const baseW=swap?src.naturalHeight:src.naturalWidth;
    const baseH=swap?src.naturalWidth:src.naturalHeight;
    const rad=deskewDeg*Math.PI/180;
    const cos=Math.abs(Math.cos(rad)), sin=Math.abs(Math.sin(rad));
    c.width=Math.max(1,Math.ceil(baseW*cos+baseH*sin));
    c.height=Math.max(1,Math.ceil(baseW*sin+baseH*cos));
    const ctx=c.getContext('2d');
    ctx.translate(c.width/2,c.height/2);
    ctx.rotate(rad);
    ctx.rotate(quarter*Math.PI/180);
    ctx.drawImage(src,-src.naturalWidth/2,-src.naturalHeight/2);
    return c.toDataURL('image/png');
  }

  function orientationRotationDeg(orientation=el.scratchOrientation.value) {
    return orientation==='horizontal'?90:0;
  }

  function effectiveRotationDeg() {
    return (state.rotation+orientationRotationDeg())%360;
  }

  function applyImageTransform(options={}) {
    if(!state.imageOriginal) return;
    const transformed=new Image();
    const angle=Number(el.deskewAngle.value)||0;
    transformed.onload=()=>{
      state.image=transformed;
      resetCropAndZoom();
      runSegmentation({restoreManual:!!options.restoreManual});
    };
    transformed.src=transformImage(state.imageOriginal,effectiveRotationDeg(),angle);
  }

  function rotateCurrentImage() {
    if(!state.imageOriginal) return;
    state.rotation=(state.rotation+90)%360;
    applyImageTransform();
  }

  function deskewCurrentImage() {
    if(!state.imageOriginal) return;
    applyImageTransform();
  }

  // 4. Variance filter â€” integral image O(1) per pixel (matches ImageJ Variance... radius=R)
  function varianceFilter(src, field, W, H, radius) {
    const N=W*H;
    const S=new Float64Array(N), S2=new Float64Array(N);
    for (let y=0;y<H;y++) {
      for (let x=0;x<W;x++) {
        const p=y*W+x, v=src[p];
        const above=y>0?S[p-W]:0, left=x>0?S[p-1]:0, diag=(y>0&&x>0)?S[p-W-1]:0;
        S[p]=v+above+left-diag;
        const a2=y>0?S2[p-W]:0, l2=x>0?S2[p-1]:0, d2=(y>0&&x>0)?S2[p-W-1]:0;
        S2[p]=v*v+a2+l2-d2;
      }
    }
    const varMap=new Float32Array(N);
    for (let y=0;y<H;y++) {
      for (let x=0;x<W;x++) {
        const p=y*W+x;
        if(!field[p]) continue;
        const y0=Math.max(0,y-radius), y1=Math.min(H-1,y+radius);
        const x0=Math.max(0,x-radius), x1=Math.min(W-1,x+radius);
        const n=(y1-y0+1)*(x1-x0+1);
        const sumV  =S[y1*W+x1]-(x0>0?S[y1*W+x0-1]:0)-(y0>0?S[(y0-1)*W+x1]:0)+((x0>0&&y0>0)?S[(y0-1)*W+x0-1]:0);
        const sumV2 =S2[y1*W+x1]-(x0>0?S2[y1*W+x0-1]:0)-(y0>0?S2[(y0-1)*W+x1]:0)+((x0>0&&y0>0)?S2[(y0-1)*W+x0-1]:0);
        varMap[p]=Math.max(0,sumV2/n-(sumV/n)*(sumV/n));
      }
    }
    return varMap;
  }

  // 5. Otsu on variance map
  function otsuOnMap(varMap, field, len) {
    let maxV=0;
    for (let p=0;p<len;p++) if(field[p]&&varMap[p]>maxV) maxV=varMap[p];
    maxV=Math.max(1,maxV);
    const hist=new Uint32Array(256);
    for (let p=0;p<len;p++) if(field[p]) hist[Math.min(255,(varMap[p]*255/maxV)|0)]++;
    const total=hist.reduce((a,b)=>a+b,0);
    let sumAll=0; for(let i=0;i<256;i++) sumAll+=i*hist[i];
    let sumB=0,wB=0,best=-1,th=128;
    for(let i=0;i<256;i++){
      wB+=hist[i]; if(!wB) continue;
      const wF=total-wB; if(!wF) break;
      sumB+=i*hist[i];
      const mB=sumB/wB, mF=(sumAll-sumB)/wF;
      const v=wB*wF*(mB-mF)*(mB-mF);
      if(v>best){best=v;th=i;}
    }
    return {threshold:th, maxV};
  }

  function percentileThresholdOnMap(varMap, field, len, maxV, pct) {
    const hist=new Uint32Array(256);
    let total=0;
    for (let p=0;p<len;p++) {
      if(!field[p]) continue;
      hist[Math.min(255,(varMap[p]*255/maxV)|0)]++;
      total++;
    }
    const target=Math.max(1,Math.round(total*pct));
    let acc=0;
    for(let i=0;i<256;i++){
      acc+=hist[i];
      if(acc>=target) return i;
    }
    return 255;
  }

  // 6. Threshold low-variance wound gap
  function applyThreshold(varMap, field, len, th, maxV, gray=null, mode='cutoff') {
    const mask=new Uint8Array(len);
    const normTh=th*maxV/255;
    const darkTh=(mode==='full'&&gray)?darkPercentile(gray,field,len,0.42):255;
    const brightfieldFloor=(mode==='cutoff'&&gray)?darkPercentile(gray,field,len,0.18):0;
    for (let p=0;p<len;p++) {
      if(!field[p]) continue;
      if(varMap[p]>normTh) continue;
      if(mode==='full'&&gray&&gray[p]>darkTh) continue;
      if(mode==='cutoff'&&gray&&gray[p]<brightfieldFloor) continue;
      mask[p]=1;
    }
    return mask;
  }

  function percentileOnMap(values, field, len, pct) {
    const arr=[];
    for(let p=0;p<len;p++) if(!field||field[p]) arr.push(values[p]);
    if(!arr.length) return 0;
    arr.sort((a,b)=>a-b);
    return arr[Math.max(0,Math.min(arr.length-1,Math.round((arr.length-1)*pct)))];
  }

  function classifyScratchOrientation(img) {
    const maxSide=360;
    const scale=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));
    const W=Math.max(1,Math.round(img.naturalWidth*scale));
    const H=Math.max(1,Math.round(img.naturalHeight*scale));
    const c=document.createElement('canvas');
    c.width=W; c.height=H;
    const ctx=c.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(img,0,0,W,H);
    const src=ctx.getImageData(0,0,W,H);
    const len=W*H;
    const gray=toGray(src.data,len);
    const field=fovMask(gray,len,Number(el.fovCutoff.value)||0,el.fovMode.value);
    const normed=enhanceContrast(gray,field,len);
    const varMap=varianceFilter(normed,field,W,H,Math.max(4,Math.round(Math.min(W,H)*0.018)));
    const th=percentileOnMap(varMap,field,len,0.28);
    const rowCounts=new Uint16Array(H);
    const colCounts=new Uint16Array(W);
    let candidateCount=0;
    for(let y=0;y<H;y++) {
      for(let x=0;x<W;x++) {
        const p=y*W+x;
        if(!field[p]||varMap[p]>th) continue;
        rowCounts[y]++; colCounts[x]++; candidateCount++;
      }
    }
    if(candidateCount<len*0.02) return {orientation:'unknown',confidence:0,rowScore:0,colScore:0};
    const rowScore=Math.max(...rowCounts)/Math.max(1,W);
    const colScore=Math.max(...colCounts)/Math.max(1,H);
    if(rowScore>colScore*1.2) return {orientation:'horizontal',confidence:Math.min(1,rowScore/Math.max(0.01,colScore)-1),rowScore,colScore};
    if(colScore>rowScore*1.2) return {orientation:'vertical',confidence:Math.min(1,colScore/Math.max(0.01,rowScore)-1),rowScore,colScore};
    return {orientation:'unknown',confidence:0,rowScore,colScore};
  }

  function showOrientationHint(message='') {
    if(!el.orientationHint) return;
    if(!message) {
      el.orientationHint.hidden=true;
      el.orientationHint.textContent='';
      return;
    }
    el.orientationHint.textContent=message;
    el.orientationHint.hidden=false;
  }

  function renderOrientationSeriesWarning(message='') {
    const target=el.groupView?.querySelector('#orientationSeriesWarning');
    if(!target) return;
    target.innerHTML=message?seriesCard('Orientation check','Horizontal?',message,'danger'):'';
  }

  async function warnIfHorizontalScratchDetected(samples=selectedGroupSamples()) {
    if(el.scratchOrientation.value!=='vertical'||!samples.length) {
      showOrientationHint('');
      return;
    }
    try {
      const votes=[];
      for(const sample of samples.slice(0,Math.min(samples.length,3))) {
        const img=await loadImageElement(sampleUrl(sample));
        votes.push(classifyScratchOrientation(img));
      }
      const horizontal=votes.filter(v=>v.orientation==='horizontal').length;
      const vertical=votes.filter(v=>v.orientation==='vertical').length;
      if(horizontal>vertical&&horizontal>0) {
        const msg='Horizontal scratch pattern detected. Use Scratch orientation -> Horizontal scratch to rotate images into vertical analysis view.';
        showOrientationHint(msg);
        renderOrientationSeriesWarning(msg);
      } else {
        showOrientationHint('');
        renderOrientationSeriesWarning('');
      }
    } catch(_) {
      showOrientationHint('');
      renderOrientationSeriesWarning('');
    }
  }

  function dilateMaskSquare(mask, W, H, radius) {
    radius=Math.max(0,Math.round(radius));
    if(!radius) return new Uint8Array(mask);
    const stride=W+1;
    const integral=new Uint32Array((W+1)*(H+1));
    for(let y=0;y<H;y++) {
      let row=0;
      const srcRow=y*W, intRow=(y+1)*stride, prevRow=y*stride;
      for(let x=0;x<W;x++) {
        row+=mask[srcRow+x]?1:0;
        integral[intRow+x+1]=integral[prevRow+x+1]+row;
      }
    }
    const out=new Uint8Array(W*H);
    for(let y=0;y<H;y++) {
      const y0=Math.max(0,y-radius), y1=Math.min(H-1,y+radius);
      const top=y0*stride, bottom=(y1+1)*stride;
      for(let x=0;x<W;x++) {
        const x0=Math.max(0,x-radius), x1=Math.min(W-1,x+radius);
        const sum=integral[bottom+x1+1]-integral[top+x1+1]-integral[bottom+x0]+integral[top+x0];
        if(sum>0) out[y*W+x]=1;
      }
    }
    return out;
  }

  function erodeMaskSquare(mask, W, H, radius) {
    radius=Math.max(0,Math.round(radius));
    if(!radius) return new Uint8Array(mask);
    const stride=W+1;
    const integral=new Uint32Array((W+1)*(H+1));
    for(let y=0;y<H;y++) {
      let row=0;
      for(let x=0;x<W;x++) {
        row+=mask[y*W+x]?1:0;
        const ip=(y+1)*stride+x+1;
        integral[ip]=integral[ip-stride]+row;
      }
    }
    const out=new Uint8Array(mask.length);
    for(let y=0;y<H;y++) for(let x=0;x<W;x++) {
      const x0=Math.max(0,x-radius), x1=Math.min(W-1,x+radius);
      const y0=Math.max(0,y-radius), y1=Math.min(H-1,y+radius);
      const area=(x1-x0+1)*(y1-y0+1);
      const sum=integral[(y1+1)*stride+x1+1]-integral[y0*stride+x1+1]-integral[(y1+1)*stride+x0]+integral[y0*stride+x0];
      if(sum===area) out[y*W+x]=1;
    }
    return out;
  }

  function smoothPhaseContrastMask(mask, W, H, mode='cutoff') {
    if(mode!=='full') return {mask,changed:0,radius:0};
    const radius=Math.max(1,Math.min(3,Math.round(Math.min(W,H)*0.0016)));
    const closed=erodeMaskSquare(dilateMaskSquare(mask,W,H,radius),W,H,radius);
    const opened=dilateMaskSquare(erodeMaskSquare(closed,W,H,1),W,H,1);
    const out=new Uint8Array(mask.length);
    let changed=0;
    for(let p=0;p<mask.length;p++) {
      out[p]=opened[p];
      if(out[p]!==mask[p]) changed++;
    }
    return {mask:out,changed,radius};
  }

  function currentGroupPriorMask(W,H) {
    const idx=currentGroupSampleIndex();
    if(idx<=0) return null;
    const samples=selectedGroupSamples();
    for(let i=idx-1;i>=0;i--) {
      const prior=state.manualOverrides[samples[i].id]?.result||state.groupResults[samples[i].id];
      if(prior?.mask&&prior.analysisW===W&&prior.analysisH===H) return prior.mask;
    }
    return null;
  }

  function groupPriorMaskForSample(sample,W,H) {
    if(!sample?.id) return null;
    const samples=selectedGroupSamples();
    const idx=samples.findIndex(s=>s.id===sample.id);
    if(idx<=0) return null;
    for(let i=idx-1;i>=0;i--) {
      const prior=state.manualOverrides[samples[i].id]?.result||state.groupResults[samples[i].id];
      if(prior?.mask&&prior.analysisW===W&&prior.analysisH===H) return prior.mask;
    }
    return null;
  }

  function constrainToPrior(raw,W,H,prior) {
    if(!prior) return {mask:raw,applied:false,priorArea:0,radius:0};
    const radius=Math.max(8,Math.min(80,Math.round(Math.min(W,H)*0.035)));
    const expanded=dilateMaskSquare(prior,W,H,radius);
    const mask=new Uint8Array(raw.length);
    let priorArea=0,kept=0;
    for(let p=0;p<raw.length;p++) {
      if(expanded[p]) priorArea++;
      if(raw[p]&&expanded[p]) { mask[p]=1; kept++; }
    }
    return {mask,applied:kept>0,priorArea,radius};
  }

  function applyGroupPrior(raw, W, H) {
    return constrainToPrior(raw,W,H,currentGroupPriorMask(W,H));
  }

  function darkPercentile(gray, field, len, pct) {
    const hist=new Uint32Array(256);
    let total=0;
    for(let p=0;p<len;p++) {
      if(!field[p]) continue;
      hist[gray[p]]++;
      total++;
    }
    const target=Math.max(1,Math.round(total*pct));
    let acc=0;
    for(let i=0;i<256;i++) {
      acc+=hist[i];
      if(acc>=target) return i;
    }
    return 255;
  }

  // 7. Fill only tiny enclosed holes; preserve large cell islands inside the wound.
  function tinyIslandMaxArea(W, H, mode=el.tinyIslandMode?.value||'medium') {
    const len=W*H;
    const fractions={off:0,trace:0.00025,'very-low':0.0006,low:0.0015,moderate:0.0035,medium:0.006,high:0.018};
    const frac=fractions[mode]??fractions.medium;
    return frac<=0?0:Math.max(16,Math.round(len*frac));
  }

  function fillSmallHoles(mask, W, H, maxHoleArea=Math.max(64,Math.round(W*H*0.002))) {
    const len=W*H;
    const inv=new Uint8Array(len);
    for (let p=0;p<len;p++) inv[p]=mask[p]?0:1;
    const visited=new Uint8Array(len);
    const queue=new Int32Array(len);
    let head=0,tail=0;
    for (let x=0;x<W;x++){
      if(inv[x]&&!visited[x]){visited[x]=1;queue[tail++]=x;}
      const b=(H-1)*W+x; if(inv[b]&&!visited[b]){visited[b]=1;queue[tail++]=b;}
    }
    for (let y=1;y<H-1;y++){
      const L=y*W; if(inv[L]&&!visited[L]){visited[L]=1;queue[tail++]=L;}
      const R=y*W+W-1; if(inv[R]&&!visited[R]){visited[R]=1;queue[tail++]=R;}
    }
    const nb=[-1,1,-W,W];
    while(head<tail){
      const p=queue[head++]; const x=p%W;
      for(const d of nb){
        const ni=p+d;
        if(ni<0||ni>=len||visited[ni]||!inv[ni]) continue;
        if(d===-1&&x===0) continue; if(d===1&&x===W-1) continue;
        visited[ni]=1; queue[tail++]=ni;
      }
    }
    const out=new Uint8Array(len);
    out.set(mask);
    const holeQueue=new Int32Array(len);
    let holeCount=0,holeArea=0,filledHoleCount=0,filledHoleArea=0,largestHoleArea=0;
    let reportedHoleCount=0,reportedHoleArea=0,reportedLargestHoleArea=0;
    const reportHoleArea=Math.max(maxHoleArea*2,Math.round(W*H*0.004));
    for(let start=0;start<len;start++){
      if(!inv[start]||visited[start]) continue;
      let h=0,t=0,area=0;
      holeQueue[t++]=start; visited[start]=1;
      while(h<t){
        const p=holeQueue[h++]; area++; const x=p%W;
        const nb=[-1,1,-W,W];
        for(const d of nb){
          const ni=p+d;
          if(ni<0||ni>=len||visited[ni]||!inv[ni]) continue;
          if(d===-1&&x===0) continue; if(d===1&&x===W-1) continue;
          visited[ni]=1; holeQueue[t++]=ni;
        }
      }
      holeCount++;
      holeArea+=area;
      largestHoleArea=Math.max(largestHoleArea,area);
      if(area<=maxHoleArea){
        filledHoleCount++;
        filledHoleArea+=area;
        for(let i=0;i<t;i++) out[holeQueue[i]]=1;
      } else if(area>=reportHoleArea) {
        reportedHoleCount++;
        reportedHoleArea+=area;
        reportedLargestHoleArea=Math.max(reportedLargestHoleArea,area);
      }
    }
    return {
      mask:out,
      holeCount:reportedHoleCount,
      holeArea:reportedHoleArea,
      filledHoleCount,
      filledHoleArea,
      largestHoleArea:reportedLargestHoleArea,
      rawHoleCount:holeCount,
      rawHoleArea:holeArea,
      rawLargestHoleArea:largestHoleArea,
      maxHoleArea,
      reportHoleArea
    };
  }

  // 8. Connected components - keep every component above the minimum area
  function filterComponents(mask, W, H, minArea) {
    const len=W*H, labels=new Int32Array(len), areas=[0], queue=new Int32Array(len);
    let label=1;
    const nb=[-1,1,-W,W];
    for(let start=0;start<len;start++){
      if(!mask[start]||labels[start]) continue;
      let head=0,tail=0,area=0;
      queue[tail++]=start; labels[start]=label;
      while(head<tail){
        const p=queue[head++]; area++; const x=p%W;
        for(const d of nb){
          const ni=p+d;
          if(ni<0||ni>=len||labels[ni]||!mask[ni]) continue;
          if(d===-1&&x===0) continue; if(d===1&&x===W-1) continue;
          labels[ni]=label; queue[tail++]=ni;
        }
      }
      areas[label]=area;
      label++;
    }
    const keep=new Uint8Array(len);
    let keptComponents=0, largestArea=0;
    for(let i=1;i<areas.length;i++) {
      if(areas[i]>largestArea) largestArea=areas[i];
    }
    for(let i=1;i<areas.length;i++) if(areas[i]>=minArea) keptComponents++;
    for(let p=0;p<len;p++) if(labels[p]&&areas[labels[p]]>=minArea) keep[p]=1;
    return {mask:keep,totalComponents:areas.length-1,keptComponents,largestArea};
  }

  function componentStats(mask, W, H) {
    const stats=filterComponents(mask,W,H,1);
    return {
      totalComponents:stats.totalComponents,
      keptComponents:stats.keptComponents,
      largestArea:stats.largestArea
    };
  }

  function componentDetails(mask, W, H) {
    const len=W*H, labels=new Int32Array(len), queue=new Int32Array(len), details=[];
    let label=1;
    const nb=[-1,1,-W,W];
    for(let start=0;start<len;start++){
      if(!mask[start]||labels[start]) continue;
      let head=0,tail=0,area=0,minX=W,maxX=0,minY=H,maxY=0,sumX=0,sumY=0;
      queue[tail++]=start; labels[start]=label;
      while(head<tail){
        const p=queue[head++], x=p%W, y=(p/W)|0;
        area++; sumX+=x; sumY+=y;
        if(x<minX) minX=x; if(x>maxX) maxX=x;
        if(y<minY) minY=y; if(y>maxY) maxY=y;
        for(const d of nb){
          const ni=p+d;
          if(ni<0||ni>=len||labels[ni]||!mask[ni]) continue;
          if(d===-1&&x===0) continue; if(d===1&&x===W-1) continue;
          labels[ni]=label; queue[tail++]=ni;
        }
      }
      details.push({
        label, area, minX, maxX, minY, maxY,
        cx:sumX/area, cy:sumY/area,
        rowCoverage:(maxY-minY+1)/Math.max(1,H),
        colCoverage:(maxX-minX+1)/Math.max(1,W)
      });
      label++;
    }
    return {labels, details};
  }

  function enforceWoundContinuity(mask, W, H, orientation='vertical', mode='cutoff') {
    const {labels,details}=componentDetails(mask,W,H);
    if(details.length<=1) return {mask,kept:details.length,total:details.length,applied:false};
    const axisIsVertical=orientation!=='horizontal';
    const axisCenter=axisIsVertical?W/2:H/2;
    const halfSize=Math.max(1,axisIsVertical?W:H);
    const phaseContrast=mode==='full';
    const sorted=[...details].sort((a,b)=>b.area-a.area);
    const maxArea=Math.max(1,sorted[0]?.area||1);
    const scored=details.map(d=>{
      const axisCoord=axisIsVertical?d.cx:d.cy;
      const centerDist=Math.abs(axisCoord-axisCenter)/halfSize;
      const span=axisIsVertical?d.rowCoverage:d.colCoverage;
      const areaNorm=d.area/maxArea;
      const score=(span*2.2)+(areaNorm*0.9)-(centerDist*1.6);
      return {...d,centerDist,span,score};
    });
    const centerCandidates=phaseContrast
      ? scored.filter(d=>d.centerDist<=0.24&&d.span>=0.18)
      : scored;
    const ranked=(centerCandidates.length?centerCandidates:scored).sort((a,b)=>b.score-a.score);
    const primary=ranked[0];
    if(phaseContrast&&(!primary||primary.centerDist>0.3||primary.span<0.16)) {
      return {mask:new Uint8Array(mask.length),kept:0,total:details.length,applied:true};
    }
    const spanFloor=phaseContrast?Math.max(0.18,primary.span*0.55):Math.max(0.04,primary.span*0.35);
    const centerFloor=phaseContrast?Math.min(0.28,Math.max(0.1,primary.centerDist+0.08)):Math.min(0.24,Math.max(0.12,primary.centerDist+0.10));
    let keepSet=new Set(
      ranked
        .filter(d=>d.span>=spanFloor&&d.centerDist<=centerFloor)
        .map(d=>d.label)
    );
    if(!keepSet.size) keepSet=new Set([primary.label]);
    const out=new Uint8Array(mask.length);
    for(let p=0;p<mask.length;p++) if(labels[p]&&keepSet.has(labels[p])) out[p]=1;
    return {mask:out,kept:keepSet.size,total:details.length,applied:true};
  }

  function closePhaseContrastSlits(mask, W, H, mode='cutoff') {
    if(mode!=='full') return {mask,filled:0,slits:0};
    const out=new Uint8Array(mask);
    const maxGap=Math.max(3,Math.round(W*0.028));
    const minSpan=Math.max(10,Math.round(H*0.035));
    const colHits=new Map();
    let filled=0,slits=0;
    for(let y=0;y<H;y++) {
      let x=0;
      while(x<W) {
        while(x<W&&mask[y*W+x]) x++;
        const start=x;
        while(x<W&&!mask[y*W+x]) x++;
        const end=x-1;
        const width=end-start+1;
        if(width<=0||width>maxGap) continue;
        const left=start>0&&mask[y*W+start-1];
        const right=end<W-1&&mask[y*W+end+1];
        if(!left||!right) continue;
        const cx=Math.round((start+end)/2);
        for(let gx=start;gx<=end;gx++) {
          const p=y*W+gx;
          if(!out[p]) out[p]=2;
        }
        const key=Math.round(cx/3);
        const hit=colHits.get(key)||{count:0,pixels:[]};
        hit.count++;
        for(let gx=start;gx<=end;gx++) hit.pixels.push(y*W+gx);
        colHits.set(key,hit);
      }
    }
    for(const hit of colHits.values()) {
      if(hit.count<minSpan) continue;
      slits++;
      for(const p of hit.pixels) {
        if(out[p]!==1) { out[p]=1; filled++; }
      }
    }
    for(let p=0;p<out.length;p++) if(out[p]===2) out[p]=0;
    return {mask:out,filled,slits};
  }

  function bridgeWoundGaps(mask, W, H, orientation='vertical') {
    if(orientation==='horizontal') return {mask,filled:0,gaps:0};
    const rows=[];
    for(let y=0;y<H;y++) {
      let lo=-1,hi=-1,count=0;
      for(let x=0;x<W;x++) {
        if(mask[y*W+x]) {
          if(lo<0) lo=x;
          hi=x;
          count++;
        }
      }
      if(lo>=0) rows.push({y,lo,hi,c:(lo+hi)/2,w:hi-lo+1,count});
    }
    if(rows.length<2) return {mask,filled:0,gaps:0};
    const out=new Uint8Array(mask);
    const maxGap=Math.max(6,Math.round(H*0.22));
    const maxShift=Math.max(18,Math.round(W*0.14));
    let filled=0,gaps=0;
    for(let i=0;i<rows.length-1;i++) {
      const a=rows[i], b=rows[i+1];
      const gap=b.y-a.y-1;
      if(gap<=0||gap>maxGap) continue;
      if(Math.abs(a.c-b.c)>maxShift) continue;
      const overlap=Math.min(a.hi,b.hi)-Math.max(a.lo,b.lo);
      const looseOverlap=overlap>=-Math.max(10,Math.round(Math.min(a.w,b.w)*0.65));
      if(!looseOverlap) continue;
      gaps++;
      for(let gy=a.y+1;gy<b.y;gy++) {
        const t=(gy-a.y)/(b.y-a.y);
        const pad=Math.max(2,Math.round(Math.min(a.w,b.w)*0.08));
        const lo=Math.max(0,Math.round(a.lo+(b.lo-a.lo)*t)-pad);
        const hi=Math.min(W-1,Math.round(a.hi+(b.hi-a.hi)*t)+pad);
        for(let x=lo;x<=hi;x++) {
          const p=gy*W+x;
          if(!out[p]) { out[p]=1; filled++; }
        }
      }
    }
    return {mask:out,filled,gaps};
  }

  function extendWoundToFrameEdges(mask, W, H, orientation='vertical', mode='cutoff') {
    if(orientation==='horizontal'||mode!=='cutoff') return {mask,filled:0,edges:0};
    const rows=[];
    for(let y=0;y<H;y++) {
      let lo=-1,hi=-1,count=0;
      for(let x=0;x<W;x++) if(mask[y*W+x]) {
        if(lo<0) lo=x;
        hi=x;
        count++;
      }
      if(lo>=0) rows.push({y,lo,hi,c:(lo+hi)/2,w:hi-lo+1,count});
    }
    if(!rows.length) return {mask,filled:0,edges:0};
    const out=new Uint8Array(mask);
    const minWidth=Math.max(8,Math.round(W*0.025));
    const maxShift=Math.max(18,Math.round(W*0.12));
    const maxLook=Math.max(8,Math.round(H*0.22));
    let filled=0,edges=0;
    const paintToEdge=(fromRow, direction)=>{
      if(!fromRow||fromRow.w<minWidth) return;
      const edgeGap=direction<0?fromRow.y:(H-1-fromRow.y);
      if(edgeGap<=0||edgeGap>maxLook) return;
      const neighbors=direction<0
        ? rows.filter(r=>r.y>=fromRow.y&&r.y<=fromRow.y+Math.max(4,Math.round(H*0.04)))
        : rows.filter(r=>r.y<=fromRow.y&&r.y>=fromRow.y-Math.max(4,Math.round(H*0.04)));
      const stable=neighbors.length<2||neighbors.every(r=>Math.abs(r.c-fromRow.c)<=maxShift);
      if(!stable) return;
      edges++;
      const yStart=direction<0?0:fromRow.y;
      const yEnd=direction<0?fromRow.y:H-1;
      const pad=Math.max(2,Math.round(fromRow.w*0.08));
      const lo=Math.max(0,fromRow.lo-pad);
      const hi=Math.min(W-1,fromRow.hi+pad);
      for(let y=yStart;y<=yEnd;y++) for(let x=lo;x<=hi;x++) {
        const p=y*W+x;
        if(!out[p]) { out[p]=1; filled++; }
      }
    };
    paintToEdge(rows[0],-1);
    paintToEdge(rows[rows.length-1],1);
    return {mask:out,filled,edges};
  }

  // 9. Width estimation â€” ImageJ edge-span method
  function estimateWidth(mask, W, H) {
    const spans=[];
    const minValidWidth=Math.max(3,Math.round(W*0.002));
    for(let y=0;y<H;y++){
      let lo=-1,hi=-1;
      for(let x=0;x<W;x++) if(mask[y*W+x]){if(lo<0)lo=x;hi=x;}
      if(lo>=0) {
        const width=hi-lo+1;
        if(width>=minValidWidth) spans.push(width);
      }
    }
    if(!spans.length) return {mean:0,median:0,sd:0,cv:0,min:0,max:0,validRows:0,validRowFraction:0,areaPerValidRow:0,minValidWidth};
    spans.sort((a,b)=>a-b);
    const mean=spans.reduce((a,b)=>a+b,0)/spans.length;
    const mid=Math.floor(spans.length/2);
    const median=spans.length%2?spans[mid]:(spans[mid-1]+spans[mid])/2;
    const sd=Math.sqrt(spans.reduce((a,b)=>a+(b-mean)**2,0)/spans.length);
    return {
      mean,
      median,
      sd,
      cv:mean?sd*100/mean:0,
      min:spans[0],
      max:spans[spans.length-1],
      validRows:spans.length,
      validRowFraction:spans.length*100/H,
      areaPerValidRow:mean,
      minValidWidth
    };
  }

  function buildQc(r, crop, W, H, manualCrop=state.cropManual) {
    const warnings=[];
    let score=100;
    const fillRatio=Number.isFinite(r.areaWidthFillRatio)?r.areaWidthFillRatio:1;
    const coherentAreaWidth=fillRatio>=0.72&&fillRatio<=1.08;
    const seriesAreaWidthR2=currentSeriesAreaWidthR2();
    const seriesAreaWidthCoherent=seriesAreaWidthR2!==null&&seriesAreaWidthR2>=0.9;
    const nearClosed=(r.areaPct||0)<6||(W&&r.wMean/W<0.08);
    const reliableSmallWound=nearClosed&&coherentAreaWidth&&r.area&&r.boundaryCount;
    if(r.manualCorrectionStatus==='edited') {
      warnings.push(`Manual correction applied (${fmt(r.manualCorrectionFractionPercent,2)}% of field).`);
      if((r.manualCorrectionFractionPercent||0)>2) score-=5;
    }
    if(crop.active) {
      warnings.push('Area fraction is crop/FOV dependent; interpret area-based closure with caution.');
    }
    if(manualCrop) {
      warnings.push('Manual crop was applied; keep crop rules consistent across timepoints.');
    }
    if(r.validRowFraction<35) {
      warnings.push(reliableSmallWound?'Low valid row fraction, consistent with a near-closed wound.':'Low valid row fraction; width estimate may be unstable.');
      score-=reliableSmallWound?3:(coherentAreaWidth?10:25);
    } else if(r.validRowFraction<60) {
      warnings.push('Moderate valid row fraction; review width profile visually.');
      score-=10;
    }
    if(r.widthCv>65) {
      warnings.push('High width CV; wound edges may be irregular, tilted, fragmented, or poorly segmented.');
      score-=coherentAreaWidth&&r.validRowFraction>=80?8:20;
    } else if(r.widthCv>40) {
      warnings.push('Moderate width CV; compare area and width metrics before interpreting closure.');
      score-=coherentAreaWidth&&r.validRowFraction>=80?3:10;
    }
    if(r.finalComponents>1) {
      warnings.push('Final wound mask has multiple components; width and area metrics may need manual review.');
      score-=reliableSmallWound?3:(coherentAreaWidth&&r.validRowFraction>=80?0:coherentAreaWidth&&r.validRowFraction>=35?5:15);
    }
    if(r.internalIslandCount>0) {
      warnings.push('Internal cell islands/bridges are present inside the wound mask; review area and width visually.');
      score-=coherentAreaWidth?0:5;
    }
    if((r.filledSmallIslandCount||0)>0) {
      warnings.push(`${fmt(r.filledSmallIslandCount)} tiny internal islands were ignored by cleanup (${r.tinyIslandMode||el.tinyIslandMode.value}).`);
      if((r.filledSmallIslandCount||0)>100) score-=3;
    }
    if(!r.boundaryCount||!r.area) {
      warnings.push('No wound contour detected; adjust threshold, crop, or component filtering.');
      score-=40;
    }
    if(r.gtComparable===false&&!seriesAreaWidthCoherent) {
      warnings.push('Ground-truth area exceeds analysed field; current crop is not comparable to this calibration row.');
      score-=5;
    }
    const severeInstability=!r.area||(r.validRowFraction<20&&!reliableSmallWound)||r.widthCv>90||(r.finalComponents>1&&!coherentAreaWidth&&r.validRowFraction<35);
    const recommendedPrimaryMetric=severeInstability
      ? 'review_required'
      : (crop.active||manualCrop||(r.gtComparable===false&&!seriesAreaWidthCoherent)||r.finalComponents>1||(!coherentAreaWidth&&(r.internalIslandCount>0||(r.filledSmallIslandCount||0)>0)))
        ? 'width_preferred'
        : 'area_and_width';
    return {
      warnings,
      score:Math.max(0,Math.min(100,Math.round(score))),
      recommendedPrimaryMetric
    };
  }

  // Main segmentation runner
  function runSegmentation(options={}) {
    if (!state.image) return;
    setSpinner(true);
    try {
      if(!options.restoreManual&&state.sample?.id) delete state.manualOverrides[state.sample.id];
      rememberCurrentSampleSettings();
      const t0=performance.now();
      const img=state.image, canvas=el.canvas;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      const crop=clampCrop({...currentCrop()});
      state.crop=crop;
      canvas.width=crop.w; canvas.height=crop.h;
      ctx.drawImage(img,crop.x,crop.y,crop.w,crop.h,0,0,crop.w,crop.h);
      const src=ctx.getImageData(0,0,canvas.width,canvas.height);
      const W=canvas.width, H=canvas.height, len=W*H;
      const radius=Number(el.varianceRadius.value);
      const thMode=thresholdMode();
      const thLevel=Number(el.thresholdOffset.value);
      const thOff=thresholdLevelToOffset(thLevel);
      const minC=Number(el.minComponent.value);
      const fov=Number(el.fovCutoff.value);
      const fovMode=el.fovMode.value;

      const gray=toGray(src.data,len);
      const field=fovMask(gray,len,fov,fovMode);
      const normed=enhanceContrast(gray,field,len);
      const varMap=varianceFilter(normed,field,W,H,radius);
      const {threshold:otsuTh,maxV}=otsuOnMap(varMap,field,len);
      const fallbackTh=percentileThresholdOnMap(varMap,field,len,maxV,0.38);
      const baseTh=otsuTh<3?fallbackTh:otsuTh;
      const finalTh=Math.max(1,Math.min(255,baseTh+thOff));
      const raw=applyThreshold(varMap,field,len,finalTh,maxV,gray,fovMode);
      const priorResult=applyGroupPrior(raw,W,H);
      const islandFilter=filterComponents(priorResult.mask,W,H,minC);
      const holeFillLimit=tinyIslandMaxArea(W,H,el.tinyIslandMode.value);
      const holeResult=fillSmallHoles(islandFilter.mask,W,H,holeFillLimit);
      const mask=holeResult.mask;
      for(let p=0;p<len;p++) if(!field[p]) mask[p]=0;
      const scratchOri=el.scratchOrientation.value||'vertical';
      const continuity=enforceWoundContinuity(mask,W,H,scratchOri,fovMode);
      const slitClose=closePhaseContrastSlits(continuity.mask,W,H,fovMode);
      const smooth=smoothPhaseContrastMask(slitClose.mask,W,H,fovMode);
      const bridge=bridgeWoundGaps(smooth.mask,W,H,scratchOri);
      const edgeExtend=extendWoundToFrameEdges(bridge.mask,W,H,scratchOri,fovMode);
      const finalHoleResult=fillSmallHoles(edgeExtend.mask,W,H,holeFillLimit);
      const finalMask=finalHoleResult.mask;
      const finalComponents=componentStats(finalMask,W,H);

      let area=0,fieldArea=0;
      for(let p=0;p<len;p++){fieldArea+=field[p];area+=finalMask[p];}
      const areaPct=fieldArea?area*100/fieldArea:0;
      const width=estimateWidth(finalMask,W,H);
      const gt=state.sample;
      const gtComparable=!!(gt?.area&&gt.area<=fieldArea);
      const areaErr=gt?.areaPct?Math.abs(areaPct-gt.areaPct)*100/gt.areaPct:null;
      const areaErrS=gt?.areaPct?(areaPct-gt.areaPct)*100/gt.areaPct:null;

      state.varMap=varMap; state.grayData=gray; state.darkGuideThreshold=darkPercentile(gray,field,len,0.48);
      state.autoMaskData=new Uint8Array(finalMask); state.maskData=new Uint8Array(finalMask);
      state.fieldData=field; state.sourceData=src;
      resetBrushStats(false);
      state.brushHistory=[];
      const boundary=boundaryPixels(state.maskData,W,H);
      const boundaryCount=boundary.length;
      drawCanvas(src,state.maskData,field,varMap,W,H,maxV,boundary);
      const ms=Math.round(performance.now()-t0);
      const fineRotationDeg=Number(el.deskewAngle.value)||0;
      const areaPerValidRow=width.validRows?area/width.validRows:0;
      const areaWidthFillRatio=width.mean&&width.validRows?area/(width.mean*width.validRows):0;
      const partialResult={sourceW:img.naturalWidth,sourceH:img.naturalHeight,analysisW:W,analysisH:H,area,areaPct,wMean:width.mean,wMedian:width.median,wSd:width.sd,widthCv:width.cv,wMin:width.min,wMax:width.max,validRows:width.validRows,validRowFraction:width.validRowFraction,areaPerValidRow,areaWidthFillRatio,minValidWidth:width.minValidWidth,threshold:finalTh,thresholdMode:thMode,thresholdLevel:thLevel,thresholdOffset:thOff,otsuThreshold:otsuTh,baseThreshold:baseTh,fallbackThreshold:fallbackTh,thresholdFallbackUsed:otsuTh<3,maxV,fieldArea,gtComparable,areaErr,areaErrS,boundaryCount,totalComponents:islandFilter.totalComponents,keptComponents:islandFilter.keptComponents,largestArea:islandFilter.largestArea,groupPriorApplied:priorResult.applied,groupPriorArea:priorResult.priorArea,groupPriorRadius:priorResult.radius,phaseSlitFilledPx:slitClose.filled,phaseSlitCount:slitClose.slits,phaseSmoothChangedPx:smooth.changed,phaseSmoothRadius:smooth.radius,bridgeFilledPx:bridge.filled,bridgeGapCount:bridge.gaps,edgeExtendedPx:edgeExtend.filled,edgeExtendedCount:edgeExtend.edges,finalHoleFilledCount:finalHoleResult.filledHoleCount,finalHoleFilledArea:finalHoleResult.filledHoleArea,finalComponents:finalComponents.totalComponents,continuityKeptComponents:continuity.kept,continuityTotalComponents:continuity.total,internalIslandCount:finalHoleResult.holeCount,internalIslandArea:finalHoleResult.holeArea,largestInternalIslandArea:finalHoleResult.largestHoleArea,filledSmallIslandCount:holeResult.filledHoleCount+finalHoleResult.filledHoleCount,filledSmallIslandArea:holeResult.filledHoleArea+finalHoleResult.filledHoleArea,holeFillMaxArea:holeResult.maxHoleArea,tinyIslandMode:el.tinyIslandMode.value,crop,runtimeMs:ms,fieldMaskMode:fovMode,scratchOrientation:el.scratchOrientation.value,manualRotationDeg:state.rotation,orientationRotationDeg:orientationRotationDeg(),effectiveRotationDeg:effectiveRotationDeg(),fineRotationDeg,varianceRadius:radius,minComponentPx:minC,fovCutoff:fov,autoCropFov:el.autoCropFov.checked,cropManual:state.cropManual,manualCorrectionStatus:'none',manualAddedPx:0,manualRemovedPx:0,manualNetDeltaPx:0,manualCorrectionFractionPercent:0};
      const qc=buildQc(partialResult,crop,W,H);
      state.result={...partialResult,segmentationQualityScore:qc.score,warnings:qc.warnings,recommendedPrimaryMetric:qc.recommendedPrimaryMetric};
      renderMetrics();
      const cropNote=crop.active?` &middot; crop ${crop.w}x${crop.h}`:'';
      const thNote=otsuTh<3?`fallback ${fallbackTh}`:`Otsu ${otsuTh}`;
      const gtNote=gt?` &middot; GT ${fmt(gt.areaPct,2)}% area fraction`:'';
      const warningNote=state.result.warnings.length?` &middot; ${state.result.warnings.length} QC warning${state.result.warnings.length>1?'s':''}`:'';
      const internalIslandTotal=finalHoleResult.holeCount+holeResult.filledHoleCount+finalHoleResult.filledHoleCount;
      const priorNote=priorResult.applied?` &middot; group prior r${priorResult.radius}`:'';
      const slitNote=slitClose.filled?` &middot; phase slit fill ${fmt(slitClose.filled)} px/${slitClose.slits}`:'';
      const smoothNote=smooth.changed?` &middot; phase smooth r${smooth.radius} (${fmt(smooth.changed)} px)`:'';
      const bridgeNote=bridge.filled?` &middot; bridged ${fmt(bridge.filled)} px/${bridge.gaps} gaps`:'';
      const edgeNote=edgeExtend.filled?` &middot; edge extended ${fmt(edgeExtend.filled)} px/${edgeExtend.edges} edges`:'';
      const finalHoleNote=finalHoleResult.filledHoleCount?` &middot; final islands filled ${fmt(finalHoleResult.filledHoleCount)}`:'';
      const thDisplay=thMode==='wide'?`offset ${fmt(thOff,1)}`:`level ${thLevel}, offset ${fmt(thOff,1)}`;
      setLog(`<strong>Threshold ${finalTh}</strong> (${thNote}, ${thDisplay}) &middot; radius ${radius}${cropNote}${priorNote}${slitNote}${smoothNote}${bridgeNote}${edgeNote}${finalHoleNote} &middot; microscope ${microscopeModeLabel(fovMode)} (${fmt(fieldArea)} px) &middot; wound comps ${islandFilter.keptComponents}/${islandFilter.totalComponents} &middot; internal islands ${internalIslandTotal} (${finalHoleResult.holeCount}/${holeResult.filledHoleCount+finalHoleResult.filledHoleCount}) &middot; mask ${fmt(area)} px &middot; width ${fmt(width.mean,1)} px &middot; contour ${fmt(boundaryCount)} px${warningNote}${gtNote}`, `${ms} ms`);
      el.rerun.disabled=false; el.exportPng.disabled=false; el.exportGroupPng.disabled=state.mode!=='group'; el.exportPlots.disabled=state.mode!=='group'; el.showAreaPlot.disabled=state.mode!=='group'; el.showWidthPlot.disabled=state.mode!=='group'; el.exportCsv.disabled=false; el.exportExcel.disabled=false;
      const deskew=Number(el.deskewAngle.value)||0;
      const orientation=el.scratchOrientation.value==='horizontal'?'horizontal scratch -> 90deg':'vertical scratch';
      el.canvasMeta.textContent=`${W}x${H} px ${orientation}${state.rotation?` + manual rotate ${state.rotation}deg`:''}${deskew?` fine rotation ${deskew}deg`:''}${crop.active?` cropped from ${img.naturalWidth}x${img.naturalHeight}`:''}  variance radius ${radius}  Otsu ${finalTh}`;
      const restored=options.restoreManual&&applyManualOverrideToCurrentSample();
      if(!restored) syncDisplayedResultToGroup();
      updateGroupNavButtons();
    } catch(err) {
      console.error(err);
      state.result=null;
      renderMetrics();
      const fileHint=isFileProtocol()
        ? ' Desktop Alpha runs from local files; use the Open button/drag-drop for microscopy images.'
        : '';
      setLog(`<strong>Segmentation failed.</strong>${fileHint} ${err.name||'Error'}: ${err.message||err}`);
    } finally {
      setSpinner(false);
    }
  }

  // Canvas rendering
  function isBoundary(mask,W,H,p) {
    if(!mask[p]) return false;
    const x=p%W,y=(p/W)|0;
    if(x===0||y===0||x===W-1||y===H-1) return true;
    return !mask[p-1]||!mask[p+1]||!mask[p-W]||!mask[p+W];
  }

  function paintPixel(d,W,H,x,y,r,g,b) {
    if(x<0||y<0||x>=W||y>=H) return;
    const i=(y*W+x)*4;
    d[i]=r; d[i+1]=g; d[i+2]=b; d[i+3]=255;
  }

  function hexToRgb(hex) {
    const clean=hex.replace('#','');
    return [
      parseInt(clean.slice(0,2),16),
      parseInt(clean.slice(2,4),16),
      parseInt(clean.slice(4,6),16)
    ];
  }

  function boundaryPixels(mask,W,H) {
    const len=W*H, boundary=[];
    for(let p=0;p<len;p++) if(isBoundary(mask,W,H,p)) boundary.push(p);
    return boundary;
  }

  function drawContour(d,mask,W,H,boundaryOverride=null) {
    const boundary=boundaryOverride||boundaryPixels(mask,W,H);
    const thickness=Number(el.contourThickness.value);
    const radius=Math.max(0,Math.floor((thickness-1)/2));
    const haloRadius=radius+2;
    const [r,g,b]=hexToRgb(el.contourColor.value);
    const dashed=el.contourStyle.value==='dashed';
    for(const p of boundary){
      const x=p%W,y=(p/W)|0;
      if(dashed&&((x+y)%34)>20) continue;
      for(let oy=-haloRadius;oy<=haloRadius;oy++) for(let ox=-haloRadius;ox<=haloRadius;ox++) {
        if(Math.abs(ox)+Math.abs(oy)>haloRadius) continue;
        paintPixel(d,W,H,x+ox,y+oy,16,32,39);
      }
    }
    for(const p of boundary){
      const x=p%W,y=(p/W)|0;
      if(dashed&&((x+y)%34)>20) continue;
      for(let oy=-radius;oy<=radius;oy++) for(let ox=-radius;ox<=radius;ox++) {
        if(Math.abs(ox)+Math.abs(oy)>radius) continue;
        paintPixel(d,W,H,x+ox,y+oy,r,g,b);
      }
    }
    return boundary.length;
  }

  function rulerCenter(W,H) {
    return {
      x:W/2+(state.rulerOffsetX||0),
      y:H/2+(state.rulerOffsetY||0)
    };
  }

  function rulerHitTest(pt,W,H) {
    if(!state.rulerVisible) return false;
    const theta=0;
    const c=rulerCenter(W,H);
    const ux=Math.sin(theta), uy=Math.cos(theta);
    const nx=Math.cos(theta), ny=-Math.sin(theta);
    const dx=pt.x-c.x, dy=pt.y-c.y;
    const along=dx*ux+dy*uy;
    const across=dx*nx+dy*ny;
    const half=Math.max(W,H)*0.45;
    const band=Math.max(28,Math.min(W,H)*0.045);
    return Math.abs(along)<=half&&Math.abs(across)<=band;
  }

  function redrawCurrentCanvas() {
    if(state.image&&state.sourceData) {
      drawCanvas(state.sourceData,state.maskData,state.fieldData,state.varMap,el.canvas.width,el.canvas.height,state.result?.maxV||1);
    }
  }

  function resetBrushStats(updateUi=true) {
    state.brushEdited=false;
    state.brushAddedPx=0;
    state.brushRemovedPx=0;
    state.brushDrawing=false;
    state.correctionSelecting=false;
    state.correctionStart=null;
    state.correctionRect=null;
    if(updateUi) {
      el.resetBrush.disabled=true;
      el.undoBrush.disabled=true;
      syncLabels();
    }
  }

  function brushSnapshot() {
    if(!state.maskData) return null;
    return {
      mask:new Uint8Array(state.maskData),
      brushEdited:state.brushEdited,
      brushAddedPx:state.brushAddedPx,
      brushRemovedPx:state.brushRemovedPx
    };
  }

  function pushBrushHistory(snap=brushSnapshot()) {
    if(!snap) return;
    state.brushHistory.push(snap);
    if(state.brushHistory.length>25) state.brushHistory.shift();
    el.undoBrush.disabled=false;
  }

  function undoBrush() {
    const snap=state.brushHistory.pop();
    if(!snap||!state.maskData) return;
    state.maskData=new Uint8Array(snap.mask);
    state.brushEdited=snap.brushEdited;
    state.brushAddedPx=snap.brushAddedPx;
    state.brushRemovedPx=snap.brushRemovedPx;
    updateResultFromMask();
    el.undoBrush.disabled=state.brushHistory.length===0;
    el.resetBrush.disabled=!state.brushEdited;
    syncLabels();
    setLog('<strong>Manual correction undone.</strong>');
  }

  function brushActive() {
    return state.brushMode!=='off'&&state.image&&state.maskData&&state.sourceData&&state.fieldData&&state.varMap&&!state.cropEditing;
  }

  function normalizeCorrectionRect(a,b) {
    const W=el.canvas.width,H=el.canvas.height;
    const x0=Math.max(0,Math.min(W-1,Math.floor(Math.min(a.x,b.x))));
    const y0=Math.max(0,Math.min(H-1,Math.floor(Math.min(a.y,b.y))));
    const x1=Math.max(0,Math.min(W-1,Math.ceil(Math.max(a.x,b.x))));
    const y1=Math.max(0,Math.min(H-1,Math.ceil(Math.max(a.y,b.y))));
    return {x:x0,y:y0,w:Math.max(1,x1-x0+1),h:Math.max(1,y1-y0+1)};
  }

  function drawCorrectionRect(ctx,W,H) {
    const r=state.correctionRect;
    if(!r) return;
    ctx.save();
    const add=state.brushMode==='add';
    const fill=state.brushMode==='fill';
    const clean=state.brushMode==='clean';
    ctx.fillStyle=add?'rgba(15,159,143,0.12)':fill?'rgba(47,111,237,0.12)':clean?'rgba(255,196,64,0.13)':'rgba(255,77,109,0.12)';
    ctx.strokeStyle=add?'#0f9f8f':fill?'#2f6fed':clean?'#c77d00':'#ff4d6d';
    ctx.lineWidth=Math.max(2,Math.round(Math.min(W,H)/520));
    ctx.setLineDash([8,5]);
    ctx.fillRect(r.x,r.y,r.w,r.h);
    ctx.strokeRect(r.x+0.5,r.y+0.5,Math.max(1,r.w-1),Math.max(1,r.h-1));
    ctx.font='700 12px Inter, sans-serif';
    ctx.fillStyle=add?'#0b6f66':fill?'#1d4ed8':clean?'#8a5400':'#9f1239';
    ctx.fillText(add?'add scan':fill?'fill area':clean?'clean specks':'erase scan',r.x+8,Math.max(16,r.y+18));
    ctx.restore();
  }

  function cleanSmallMaskFragments(rect, localField, W, H) {
    const len=W*H;
    const seen=new Uint8Array(len);
    const queue=new Int32Array(Math.max(1,rect.w*rect.h));
    const pixels=[];
    const components=[];
    const sensitivity=Number(el.brushSize.value)||28;
    const sensitivity01=Math.max(0,Math.min(1,(sensitivity-4)/76));
    const maxArea=Math.max(24,Math.min(5000,Math.round(rect.w*rect.h*(0.002+sensitivity01*0.023))));
    const impossibleCellArea=Math.max(8,Math.min(320,Math.round(rect.w*rect.h*(0.00035+sensitivity01*0.0018))));
    const nb4=[[-1,0],[1,0],[0,-1],[0,1]];
    for(let y=rect.y;y<rect.y+rect.h;y++) for(let x=rect.x;x<rect.x+rect.w;x++) {
      const start=y*W+x;
      if(seen[start]||!localField[start]||!state.maskData[start]) continue;
      let head=0,tail=0;
      pixels.length=0;
      queue[tail++]=start; seen[start]=1;
      while(head<tail) {
        const p=queue[head++], px=p%W, py=(p/W)|0;
        pixels.push(p);
        for(const [dx,dy] of nb4) {
          const nx=px+dx, ny=py+dy;
          if(nx<rect.x||ny<rect.y||nx>=rect.x+rect.w||ny>=rect.y+rect.h) continue;
          const ni=ny*W+nx;
          if(seen[ni]||!localField[ni]||!state.maskData[ni]) continue;
          seen[ni]=1;
          queue[tail++]=ni;
        }
      }
      components.push(Int32Array.from(pixels));
    }
    let removed=0,removedComponents=0;
    const largest=components.reduce((m,c)=>Math.max(m,c.length),0);
    for(const comp of components) {
      const tooSmallForCell=comp.length<=impossibleCellArea;
      const smallEnough=comp.length<=maxArea;
      const clearlyNotMain=comp.length<largest*0.45;
      if(tooSmallForCell||(smallEnough&&clearlyNotMain)) {
        removedComponents++;
        removed+=comp.length;
        for(const p of comp) state.maskData[p]=0;
      }
    }
    return {removed,componentCount:components.length,removedComponents,maxArea,impossibleCellArea,largest};
  }

  function mainRoiComponent(candidate, rect, W, H) {
    const kept=new Uint8Array(W*H);
    const seen=new Uint8Array(W*H);
    const queue=new Int32Array(Math.max(1,rect.w*rect.h));
    const minArea=Math.max(12,Math.round(rect.w*rect.h*0.015));
    let best=null, fallback=null;
    for(let y=rect.y;y<rect.y+rect.h;y++) for(let x=rect.x;x<rect.x+rect.w;x++) {
      const start=y*W+x;
      if(seen[start]||!candidate[start]) continue;
      let head=0,tail=0,area=0;
      queue[tail++]=start; seen[start]=1;
      while(head<tail) {
        const p=queue[head++], px=p%W, py=(p/W)|0;
        area++;
        for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) {
          if(!dx&&!dy) continue;
          const nx=px+dx, ny=py+dy;
          if(nx<rect.x||ny<rect.y||nx>=rect.x+rect.w||ny>=rect.y+rect.h) continue;
          const ni=ny*W+nx;
          if(seen[ni]||!candidate[ni]) continue;
          seen[ni]=1;
          queue[tail++]=ni;
        }
      }
      const score=area;
      if(area>=minArea&&(!best||score>best.score)) best={start,area,score};
      if(!fallback||area>fallback.area) fallback={start,area,score};
    }
    if(!best) best=fallback;
    if(!best) return {mask:kept,area:0,totalArea:0,componentCount:0};

    seen.fill(0);
    let head=0,tail=0,area=0,totalArea=0,componentCount=0;
    for(let y=rect.y;y<rect.y+rect.h;y++) for(let x=rect.x;x<rect.x+rect.w;x++) if(candidate[y*W+x]) totalArea++;
    queue[tail++]=best.start; seen[best.start]=1; kept[best.start]=1;
    while(head<tail) {
      const p=queue[head++], px=p%W, py=(p/W)|0;
      area++;
      for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) {
        if(!dx&&!dy) continue;
        const nx=px+dx, ny=py+dy;
        if(nx<rect.x||ny<rect.y||nx>=rect.x+rect.w||ny>=rect.y+rect.h) continue;
        const ni=ny*W+nx;
        if(seen[ni]||!candidate[ni]) continue;
        seen[ni]=1;
        kept[ni]=1;
        queue[tail++]=ni;
      }
    }
    seen.fill(0);
    for(let y=rect.y;y<rect.y+rect.h;y++) for(let x=rect.x;x<rect.x+rect.w;x++) {
      const start=y*W+x;
      if(seen[start]||!candidate[start]) continue;
      componentCount++;
      head=0;tail=0;queue[tail++]=start;seen[start]=1;
      while(head<tail) {
        const p=queue[head++], px=p%W, py=(p/W)|0;
        for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) {
          if(!dx&&!dy) continue;
          const nx=px+dx, ny=py+dy;
          if(nx<rect.x||ny<rect.y||nx>=rect.x+rect.w||ny>=rect.y+rect.h) continue;
          const ni=ny*W+nx;
          if(seen[ni]||!candidate[ni]) continue;
          seen[ni]=1;queue[tail++]=ni;
        }
      }
    }
    return {mask:kept,area,totalArea,componentCount};
  }

  function applyCorrectionScanRect(rect) {
    if(!brushActive()||!rect||rect.w<3||rect.h<3) return false;
    const W=el.canvas.width,H=el.canvas.height,len=W*H;
    const localField=new Uint8Array(len);
    let localPixels=0;
    for(let y=rect.y;y<rect.y+rect.h;y++) for(let x=rect.x;x<rect.x+rect.w;x++) {
      const p=y*W+x;
      if(!state.fieldData||state.fieldData[p]) {
        localField[p]=1;
        localPixels++;
      }
    }
    if(localPixels<9) return false;
    let added=0,removed=0,candidateCount=0;
    const add=state.brushMode==='add';
    if(state.brushMode==='clean') {
      const cleaned=cleanSmallMaskFragments(rect,localField,W,H);
      if(cleaned.removed) {
        state.brushEdited=true;
        state.brushRemovedPx+=cleaned.removed;
        updateResultFromMask();
        el.resetBrush.disabled=false;
        setLog(`<strong>Clean specks applied:</strong> ROI ${rect.w}x${rect.h} px, removed ${fmt(cleaned.removed)} px from ${fmt(cleaned.removedComponents)}/${fmt(cleaned.componentCount)} small 4-connected components (non-cell floor ${fmt(cleaned.impossibleCellArea)} px, max speck ${fmt(cleaned.maxArea)} px, largest ${fmt(cleaned.largest)} px).`);
        return true;
      }
      setLog(`<strong>Clean specks:</strong> no small mask fragments found in the selected ROI.`);
      return false;
    }
    if(state.brushMode==='fill') {
      for(let y=rect.y;y<rect.y+rect.h;y++) for(let x=rect.x;x<rect.x+rect.w;x++) {
        const p=y*W+x;
        if(!localField[p]||state.maskData[p]) continue;
        state.maskData[p]=1;
        added++;
      }
      if(added) {
        state.brushEdited=true;
        state.brushAddedPx+=added;
        updateResultFromMask();
        el.resetBrush.disabled=false;
        setLog(`<strong>Fill area applied:</strong> ROI ${rect.w}x${rect.h} px directly filled as wound area; added ${fmt(added)} px.`);
        return true;
      }
      setLog(`<strong>Fill area:</strong> selected ROI was already filled or outside the analysis field.`);
      return false;
    }
    if(!add) {
      for(let y=rect.y;y<rect.y+rect.h;y++) for(let x=rect.x;x<rect.x+rect.w;x++) {
        const p=y*W+x;
        if(!localField[p]) continue;
        if(state.maskData[p]) { state.maskData[p]=0; removed++; }
      }
      if(removed) {
        state.brushEdited=true;
        state.brushRemovedPx+=removed;
        updateResultFromMask();
        el.resetBrush.disabled=false;
        setLog(`<strong>Erase scan applied:</strong> ROI ${rect.w}x${rect.h} px cleared; removed ${fmt(removed)} mask px. This region is now treated as non-wound/no-border.`);
        return true;
      }
      setLog(`<strong>Erase scan:</strong> no existing mask pixels were found in the selected ROI.`);
      return false;
    }
    const {threshold:localOtsu,maxV:localMaxV}=otsuOnMap(state.varMap,localField,len);
    const localFallback=percentileThresholdOnMap(state.varMap,localField,len,localMaxV,0.38);
    const localBase=localOtsu<3?localFallback:localOtsu;
    const sensitivity=Number(el.brushSize.value)||28;
    const globalOffset=thresholdLevelToOffset(el.thresholdOffset.value);
    const sensitivity01=Math.max(0,Math.min(1,(sensitivity-4)/76));
    const fineOffset=-54+sensitivity01*45+globalOffset*0.05;
    const localCap=Math.min(90,localBase+10,localFallback+14);
    const localTh=Math.max(1,Math.min(localCap,Math.round(localBase+fineOffset)));
    const localCandidate=applyThreshold(state.varMap,localField,len,localTh,localMaxV,state.grayData,el.fovMode.value);
    const main=mainRoiComponent(localCandidate,rect,W,H);
    const addHoleFillMax=Math.max(12,Math.min(1200,Math.round(rect.w*rect.h*(0.00045+sensitivity01*0.0025))));
    const cleanedMain=fillSmallHoles(main.mask,W,H,addHoleFillMax);
    for(let y=rect.y;y<rect.y+rect.h;y++) for(let x=rect.x;x<rect.x+rect.w;x++) {
      const p=y*W+x;
      if(!localField[p]) continue;
      if(state.maskData[p]) { state.maskData[p]=0; removed++; }
      if(cleanedMain.mask[p]) {
        candidateCount++;
        state.maskData[p]=1;
        added++;
      }
    }
    if(added||removed) {
      state.brushEdited=true;
      state.brushAddedPx+=added;
      state.brushRemovedPx+=removed;
      updateResultFromMask();
      el.resetBrush.disabled=false;
      setLog(`<strong>Add scan applied:</strong> ROI ${rect.w}x${rect.h} px cleared first, largest gap component kept, and ${fmt(cleanedMain.filledHoleCount)} tiny internal islands filled (${fmt(candidateCount)}/${fmt(main.totalArea)} px from ${fmt(main.componentCount)} components; local threshold ${localTh}, island max ${fmt(addHoleFillMax)} px).`);
      return true;
    }
    setLog(`<strong>Add scan:</strong> no mask pixels changed in the selected ROI. Try a larger rectangle or adjust scan sensitivity.`);
    return false;
  }

  function applyBrushAt(pt) {
    if(!brushActive()) return;
    if(state.brushMode==='add') {
      const snap=brushSnapshot();
      if(applySmartAddAt(pt)&&snap) {
        state.brushHistory.push(snap);
        if(state.brushHistory.length>25) state.brushHistory.shift();
        el.undoBrush.disabled=false;
      }
      return;
    }
    if(state.brushMode==='erase') {
      const snap=brushSnapshot();
      if(applySmartEraseAt(pt)&&snap) {
        state.brushHistory.push(snap);
        if(state.brushHistory.length>25) state.brushHistory.shift();
        el.undoBrush.disabled=false;
      }
      return;
    }
    const snap=brushSnapshot();
    const W=el.canvas.width,H=el.canvas.height;
    const radius=Math.max(1,Number(el.brushSize.value)/2);
    const r2=radius*radius;
    const minX=Math.max(0,Math.floor(pt.x-radius));
    const maxX=Math.min(W-1,Math.ceil(pt.x+radius));
    const minY=Math.max(0,Math.floor(pt.y-radius));
    const maxY=Math.min(H-1,Math.ceil(pt.y+radius));
    let added=0,removed=0;
    for(let y=minY;y<=maxY;y++) for(let x=minX;x<=maxX;x++) {
      const dx=x-pt.x,dy=y-pt.y;
      if(dx*dx+dy*dy>r2) continue;
      const p=y*W+x;
      if(state.fieldData&&!state.fieldData[p]) continue;
      if(state.brushMode==='add') {
        if(!state.maskData[p]) { state.maskData[p]=1; added++; }
      } else if(state.brushMode==='erase') {
        if(state.maskData[p]) { state.maskData[p]=0; removed++; }
      }
    }
    if(added||removed) {
      pushBrushHistory(snap);
      state.brushEdited=true;
      state.brushAddedPx+=added;
      state.brushRemovedPx+=removed;
      updateResultFromMask();
      el.resetBrush.disabled=false;
    }
  }

  function applySmartEraseAt(pt) {
    const W=el.canvas.width,H=el.canvas.height,len=W*H;
    const sx=Math.round(pt.x), sy=Math.round(pt.y);
    if(sx<0||sy<0||sx>=W||sy>=H) return false;
    const start=sy*W+sx;
    if(!state.maskData[start]) return false;
    const tol=Number(el.brushSize.value)||28;
    const maxPixels=Math.max(80,Math.min(18000,Math.round(len*0.014)));
    const maxRadius=Math.max(28,Math.min(220,Math.round(Math.min(W,H)*(0.04+tol/800))));
    const maxR2=maxRadius*maxRadius;
    const visited=new Uint8Array(len);
    const queue=new Int32Array(Math.min(len,maxPixels*6));
    const toErase=[];
    let head=0,tail=0;
    queue[tail++]=start; visited[start]=1;
    const nb=[-1,1,-W,W];
    while(head<tail&&toErase.length<maxPixels) {
      const p=queue[head++], x=p%W, y=(p/W)|0;
      const dx=x-sx,dy=y-sy;
      if(dx*dx+dy*dy>maxR2) continue;
      if(!state.maskData[p]) continue;
      toErase.push(p);
      for(const d of nb) {
        const ni=p+d;
        if(ni<0||ni>=len||visited[ni]) continue;
        if(d===-1&&x===0) continue; if(d===1&&x===W-1) continue;
        visited[ni]=1; queue[tail++]=ni;
        if(tail>=queue.length) {
          head=tail;
          break;
        }
      }
    }
    if(toErase.length) {
      for(const p of toErase) state.maskData[p]=0;
      state.brushEdited=true;
      state.brushRemovedPx+=toErase.length;
      updateResultFromMask();
      el.resetBrush.disabled=false;
      return true;
    }
    return false;
  }

  function applySmartAddAt(pt) {
    const W=el.canvas.width,H=el.canvas.height,len=W*H;
    const sx=Math.round(pt.x), sy=Math.round(pt.y);
    if(sx<0||sy<0||sx>=W||sy>=H) return false;
    const start=sy*W+sx;
    if(state.fieldData&&!state.fieldData[start]) return false;
    const gray=state.grayData||toGray(state.sourceData.data,len);
    const seedGray=gray[start];
    const seedVar=state.varMap?.[start]||0;
    const tol=Number(el.brushSize.value)||28;
    const grayTol=Math.max(8,tol*1.25);
    const varTol=Math.max(2,(state.result?.maxV||1)*(tol/255)*1.75);
    const maxPixels=Math.max(80,Math.min(16000,Math.round(len*0.012)));
    const maxRadius=Math.max(24,Math.min(180,Math.round(Math.min(W,H)*(0.035+tol/900))));
    const maxR2=maxRadius*maxRadius;
    const visited=new Uint8Array(len);
    const queue=new Int32Array(Math.min(len,maxPixels*6));
    let head=0,tail=0,added=0;
    queue[tail++]=start; visited[start]=1;
    const nb=[-1,1,-W,W];
    const darkGuide=state.darkGuideThreshold||seedGray+grayTol;
    while(head<tail&&added<maxPixels) {
      const p=queue[head++], x=p%W, y=(p/W)|0;
      const dx=x-sx,dy=y-sy;
      if(dx*dx+dy*dy>maxR2) continue;
      const g=gray[p], v=state.varMap?.[p]||0;
      const darkEnough=g<=Math.max(seedGray+grayTol,darkGuide);
      const similar=Math.abs(g-seedGray)<=grayTol||darkEnough;
      const lowVar=v<=Math.max(seedVar+varTol,(state.result?.maxV||1)*0.18);
      if(similar&&lowVar) {
        if(!state.maskData[p]) { state.maskData[p]=1; added++; }
        for(const d of nb) {
          const ni=p+d;
          if(ni<0||ni>=len||visited[ni]) continue;
          if(d===-1&&x===0) continue; if(d===1&&x===W-1) continue;
          if(state.fieldData&&!state.fieldData[ni]) continue;
          visited[ni]=1; queue[tail++]=ni;
          if(tail>=queue.length) {
            head=tail;
            break;
          }
        }
      }
    }
    if(added) {
      state.brushEdited=true;
      state.brushAddedPx+=added;
      updateResultFromMask();
      el.resetBrush.disabled=false;
      return true;
    }
    return false;
  }

  function updateResultFromMask() {
    if(!state.result||!state.maskData||!state.fieldData||!state.sourceData) return;
    const W=el.canvas.width,H=el.canvas.height,len=W*H;
    let area=0,fieldArea=0;
    for(let p=0;p<len;p++){fieldArea+=state.fieldData[p];area+=state.maskData[p];}
    const width=estimateWidth(state.maskData,W,H);
    const finalComponents=componentStats(state.maskData,W,H);
    const boundaryCount=boundaryPixels(state.maskData,W,H).length;
    const gt=state.sample;
    const areaPct=fieldArea?area*100/fieldArea:0;
    const areaErr=gt?.areaPct?Math.abs(areaPct-gt.areaPct)*100/gt.areaPct:null;
    const areaErrS=gt?.areaPct?(areaPct-gt.areaPct)*100/gt.areaPct:null;
    const manualNet=state.brushAddedPx-state.brushRemovedPx;
    const areaPerValidRow=width.validRows?area/width.validRows:0;
    const areaWidthFillRatio=width.mean&&width.validRows?area/(width.mean*width.validRows):0;
    const patch={
      area,areaPct,wMean:width.mean,wMedian:width.median,wSd:width.sd,widthCv:width.cv,
      wMin:width.min,wMax:width.max,validRows:width.validRows,validRowFraction:width.validRowFraction,
      areaPerValidRow,areaWidthFillRatio,minValidWidth:width.minValidWidth,
      fieldArea,areaErr,areaErrS,boundaryCount,finalComponents:finalComponents.totalComponents,
      manualCorrectionStatus:state.brushEdited?'edited':'none',
      manualAddedPx:state.brushAddedPx,
      manualRemovedPx:state.brushRemovedPx,
      manualNetDeltaPx:manualNet,
      manualCorrectionFractionPercent:fieldArea?Math.abs(manualNet)*100/fieldArea:0
    };
    const partial={...state.result,...patch};
    const qc=buildQc(partial,state.crop,W,H);
    state.result={...partial,segmentationQualityScore:qc.score,warnings:qc.warnings,recommendedPrimaryMetric:qc.recommendedPrimaryMetric};
    redrawCurrentCanvas();
    renderMetrics();
    syncManualOverrideToGroup();
  }

  function syncManualOverrideToGroup() {
    const sample=state.sample;
    if(!sample?.id||!state.maskData||!state.result) return;
    if(state.brushEdited) {
      const override={
        mask:new Uint8Array(state.maskData),
        result:{...state.result},
        sourceData:state.sourceData,
        fieldData:state.fieldData,
        varMap:state.varMap,
        width:el.canvas.width,
        height:el.canvas.height,
        maxV:state.result?.maxV||1
      };
      state.manualOverrides[sample.id]=override;
      state.groupResults[sample.id]=override.result;
      updateGroupCardResult(sample,override.result);
      updateGroupCardPreview(sample,override);
    } else {
      delete state.manualOverrides[sample.id];
      state.groupResults[sample.id]={...state.result};
      updateGroupCardResult(sample,state.groupResults[sample.id]);
    }
    const group=selectedGroup();
    const samples=group.sampleIds?.map(id=>sampleById(id)).filter(Boolean)||[];
    if(samples.some(s=>s.id===sample.id)) renderSeriesSummary(samples);
  }

  function syncDisplayedResultToGroup() {
    const sample=state.sample;
    if(!sample?.id||!state.result||!state.maskData||!state.sourceData) return;
    if(!selectedGroupSamples().some(s=>s.id===sample.id)) return;
    if(state.manualOverrides[sample.id]) return;
    const enriched={
      ...state.result,
      src:state.sourceData,
      field:state.fieldData,
      varMap:state.varMap,
      mask:new Uint8Array(state.maskData),
      analysisW:el.canvas.width,
      analysisH:el.canvas.height,
      displayLinked:true
    };
    state.result=enriched;
    state.groupResults[sample.id]=enriched;
    updateGroupCardResult(sample,enriched);
    updateGroupCardPreview(sample,enriched);
    renderSeriesSummary(selectedGroupSamples());
  }

  function applyManualOverrideToCurrentSample() {
    const sample=state.sample;
    const override=sample?.id?state.manualOverrides[sample.id]:null;
    if(!override||!state.maskData||override.width!==el.canvas.width||override.height!==el.canvas.height) return false;
    state.maskData=new Uint8Array(override.mask);
    state.brushEdited=override.result.manualCorrectionStatus==='edited';
    state.brushAddedPx=override.result.manualAddedPx||0;
    state.brushRemovedPx=override.result.manualRemovedPx||0;
    state.brushHistory=[];
    state.result={...override.result};
    redrawCurrentCanvas();
    renderMetrics();
    el.resetBrush.disabled=!state.brushEdited;
    updateGroupCardResult(sample,override.result);
    updateGroupCardPreview(sample,override);
    const group=selectedGroup();
    const samples=group.sampleIds?.map(id=>sampleById(id)).filter(Boolean)||[];
    if(samples.some(s=>s.id===sample.id)) renderSeriesSummary(samples);
    setLog(`<strong>Manual correction restored.</strong> Group preview and metrics are using the edited mask.`);
    return true;
  }

  function updateGroupCardPreview(sample, override) {
    const canvas=el.groupView?.querySelector(`canvas[data-sample-id="${sample.id}"]`);
    const source=override?.sourceData||override?.src;
    const field=override?.fieldData||override?.field;
    const mask=override?.mask;
    const W=override?.width||override?.analysisW||source?.width;
    const H=override?.height||override?.analysisH||source?.height;
    if(!canvas||!source||!mask||!W||!H) return;
    const full=document.createElement('canvas');
    full.width=W;
    full.height=H;
    const fullCtx=full.getContext('2d',{willReadFrequently:true});
    const out=new ImageData(new Uint8ClampedArray(source.data),W,H);
    const d=out.data;
    const len=W*H;
    for(let p=0,i=0;p<len;p++,i+=4) {
      if(field&&!field[p]) {
        d[i]=d[i]*0.35|0;
        d[i+1]=d[i+1]*0.35|0;
        d[i+2]=d[i+2]*0.35|0;
      }
    }
    drawContour(d,mask,W,H);
    fullCtx.putImageData(out,0,0);

    const maxSide=520;
    const scale=Math.min(1,maxSide/Math.max(W,H));
    const outW=Math.max(1,Math.round(W*scale));
    const outH=Math.max(1,Math.round(H*scale));
    canvas.width=outW;
    canvas.height=outH;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(full,0,0,W,H,0,0,outW,outH);
  }

  function drawAngleRuler(ctx,W,H) {
    const angle=0;
    const theta=0;
    const center=rulerCenter(W,H);
    const cx=center.x, cy=center.y;
    const ux=Math.sin(theta), uy=Math.cos(theta);
    const nx=Math.cos(theta), ny=-Math.sin(theta);
    const length=Math.max(W,H)*0.9;
    const half=length/2;
    const band=22;
    ctx.save();
    ctx.lineCap='round';
    ctx.lineJoin='round';
    ctx.globalAlpha=0.72;
    ctx.beginPath();
    ctx.moveTo(cx-ux*half-nx*band,cy-uy*half-ny*band);
    ctx.lineTo(cx+ux*half-nx*band,cy+uy*half-ny*band);
    ctx.lineTo(cx+ux*half+nx*band,cy+uy*half+ny*band);
    ctx.lineTo(cx-ux*half+nx*band,cy-uy*half+ny*band);
    ctx.closePath();
    ctx.fillStyle='rgba(255,255,255,0.16)';
    ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.38)';
    ctx.lineWidth=Math.max(1,Math.min(3,Math.round(Math.min(W,H)/450)));
    ctx.stroke();

    ctx.globalAlpha=0.92;
    ctx.strokeStyle='rgba(255,255,255,0.9)';
    ctx.lineWidth=Math.max(1,Math.min(4,Math.round(Math.min(W,H)/350)));
    ctx.beginPath();
    ctx.moveTo(cx-ux*half,cy-uy*half);
    ctx.lineTo(cx+ux*half,cy+uy*half);
    ctx.stroke();

    const tickStep=Math.max(40,Math.round(Math.min(W,H)/12));
    ctx.strokeStyle='rgba(16,32,39,0.72)';
    ctx.lineWidth=1;
    for(let t=-half;t<=half;t+=tickStep) {
      const tickLen=Math.abs(t)<1?band*1.4:band*0.9;
      const x=cx+ux*t, y=cy+uy*t;
      ctx.beginPath();
      ctx.moveTo(x-nx*tickLen,y-ny*tickLen);
      ctx.lineTo(x+nx*tickLen,y+ny*tickLen);
      ctx.stroke();
    }

    ctx.globalAlpha=0.96;
    ctx.fillStyle='rgba(16,32,39,0.82)';
    ctx.fillRect(Math.max(8,cx-46),Math.max(8,cy-half-30),92,22);
    ctx.fillStyle='white';
    ctx.font='700 12px Inter, sans-serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText('ruler',Math.max(54,cx),Math.max(19,cy-half-19));
    ctx.restore();
  }

  function drawCanvas(source,mask,field,varMap,W,H,maxV,boundaryOverride=null) {
    const ctx=el.canvas.getContext('2d');
    const len=W*H;
    const out=new ImageData(new Uint8ClampedArray(source.data),W,H);
    const d=out.data;
    let boundaryCount=0;
    if(state.view==='variance'){
      for(let p=0,i=0;p<len;p++,i+=4){
        const v=field[p]?Math.min(255,(varMap[p]*255/maxV)|0):0;
        d[i]=v;d[i+1]=v;d[i+2]=v;d[i+3]=255;
      }
    } else if(state.view==='mask'){
      for(let p=0,i=0;p<len;p++,i+=4){
        if(mask[p]){d[i]=15;d[i+1]=159;d[i+2]=143;d[i+3]=255;}
        else if(field[p]){d[i]=30;d[i+1]=30;d[i+2]=30;d[i+3]=255;}
        else{d[i]=0;d[i+1]=0;d[i+2]=0;d[i+3]=255;}
      }
    } else if(state.view==='overlay'){
      for(let p=0,i=0;p<len;p++,i+=4)
        if(!field[p]){d[i]=d[i]*0.35|0;d[i+1]=d[i+1]*0.35|0;d[i+2]=d[i+2]*0.35|0;}
      boundaryCount=drawContour(d,mask,W,H,boundaryOverride);
    }
    ctx.putImageData(out,0,0);
    if(state.rulerVisible) drawAngleRuler(ctx,W,H);
    if(state.correctionSelecting&&state.correctionRect) drawCorrectionRect(ctx,W,H);
    return boundaryCount;
  }

  // Metrics
  function metricCard(label,number,hint,kind='') {
    return `<div class="metric-card ${kind}"><div class="metric-label">${label}</div><div class="metric-number">${number}</div><div class="metric-hint">${hint}</div></div>`;
  }

  function internalIslandStats(r) {
    const remainingCount=Number(r?.internalIslandCount)||0;
    const ignoredCount=Number(r?.filledSmallIslandCount)||0;
    const remainingArea=Number(r?.internalIslandArea)||0;
    const ignoredArea=Number(r?.filledSmallIslandArea)||0;
    const totalCount=remainingCount+ignoredCount;
    const totalArea=remainingArea+ignoredArea;
    const mode=r?.tinyIslandMode||el.tinyIslandMode?.value||'medium';
    let label='none detected';
    if(totalCount) {
      label=`remaining ${fmt(remainingCount)}, ignored ${fmt(ignoredCount)} (${mode}); area ${fmt(totalArea)} px`;
      if(remainingCount) label+=`, largest ${fmt(r.largestInternalIslandArea)} px`;
    }
    return {totalCount,totalArea,remainingCount,remainingArea,ignoredCount,ignoredArea,mode,label};
  }

  function renderMetrics() {
    const r=state.result, gt=state.sample;
    if(!r){el.metricsPanel.innerHTML='';return;}
    const ek=r.areaErr===null?'':r.areaErr<=10?'good':r.areaErr<=25?'warn':'bad';
    const qcKind=r.segmentationQualityScore>=80?'good':r.segmentationQualityScore>=60?'warn':'bad';
    const primaryKind=r.recommendedPrimaryMetric==='review_required'?'bad':r.recommendedPrimaryMetric==='width_preferred'?'warn':'good';
    el.metricsPanel.innerHTML=[
      metricCard('Mask area',`${fmt(r.area)} px`,`${fmt(r.areaPct,2)}% of field`),
      metricCard('GT area',gt?`${fmt(gt.areaPct,2)}%`:'n/a',gt?'area fraction reference':'manual image'),
      metricCard('Area error',r.areaErr===null?'n/a':`${fmt(r.areaErr,2)}%`,r.areaErrS===null?'load cal row':`${fmt(r.areaPct,2)}% vs ${fmt(gt?.areaPct,2)}%`,ek),
      metricCard('Mean width',`${fmt(r.wMean,1)} px`,`median ${fmt(r.wMedian,1)} px`),
      metricCard('Width spread',`${fmt(r.widthCv,1)}% CV`,`SD ${fmt(r.wSd,1)} px, ${fmt(r.wMin)}-${fmt(r.wMax)} px`),
      metricCard('Area-width fit',r.areaWidthFillRatio?`${fmt(r.areaWidthFillRatio,2)}`:'n/a','1.00 means area matches scanline span',r.areaWidthFillRatio>=0.72&&r.areaWidthFillRatio<=1.08?'good':'warn'),
      metricCard('Valid rows',`${fmt(r.validRows)}`,`${fmt(r.validRowFraction,1)}% of image rows`),
      metricCard('Primary metric',r.recommendedPrimaryMetric.replace(/_/g,' '),(r.recommendedPrimaryMetric==='review_required'?r.warnings.find(w=>!/Manual correction/i.test(w)):r.warnings.find(w=>!/Manual correction|Low valid row fraction, consistent/i.test(w)))||'area and width can be read together',primaryKind),
      metricCard('QC score',`${fmt(r.segmentationQualityScore)}/100`,r.warnings.length?`${r.warnings.length} warning${r.warnings.length>1?'s':''}`:'no major warnings',qcKind),
      metricCard('Wound comps',`${fmt(r.keptComponents)}/${fmt(r.totalComponents)}`,`min ${fmt(el.minComponent.value)} px, largest ${fmt(r.largestArea)} px`),
      metricCard('Continuity',`${fmt(r.continuityKeptComponents||r.finalComponents)}/${fmt(r.continuityTotalComponents||r.finalComponents)}`,`kept by center+span prior`,(r.continuityTotalComponents||0)>(r.continuityKeptComponents||0)?'warn':''),
      metricCard('Manual edit',r.manualCorrectionStatus==='edited'?`${fmt(r.manualNetDeltaPx)} px`:'none',r.manualCorrectionStatus==='edited'?`added ${fmt(r.manualAddedPx)}, erased ${fmt(r.manualRemovedPx)}`:'auto mask unchanged',r.manualCorrectionStatus==='edited'?'warn':''),
      metricCard('Final comps',`${fmt(r.finalComponents)}`,`after tiny-hole cleanup`),
      metricCard('Contour',`${fmt(r.boundaryCount)} px`,r.boundaryCount?'overlay boundary':'no boundary found',r.boundaryCount?'':'bad')
    ].join('');
  }

  // Export
  function exportPng() {
    if(!state.result) return;
    const a=document.createElement('a');
    a.href=el.canvas.toDataURL('image/png');
    a.download=`cytomove_${(state.imageName||'image').replace(/\.[^.]+$/,'')}_${state.view}.png`;
    a.click();
  }

  function csvCell(v) { return `"${String(v??'').replace(/"/g,'""')}"`; }

  function downloadText(filename, mime, text) {
    const a=document.createElement('a');
    a.href=`data:${mime};charset=utf-8,`+encodeURIComponent(text);
    a.download=filename;
    a.click();
  }

  function safeFilenamePart(value, fallback='image') {
    const clean=String(value||fallback).replace(/\.[^.]+$/,'').replace(/[^\w\-]+/g,'_').replace(/^_+|_+$/g,'');
    return clean||fallback;
  }

  function dataUrlToBytes(dataUrl) {
    const comma=dataUrl.indexOf(',');
    const meta=dataUrl.slice(0,comma);
    const body=dataUrl.slice(comma+1);
    if(meta.includes(';base64')) {
      const bin=atob(body);
      const bytes=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
      return bytes;
    }
    return new TextEncoder().encode(decodeURIComponent(body));
  }

  const ZIP_CRC_TABLE=(()=>{
    const table=new Uint32Array(256);
    for(let n=0;n<256;n++) {
      let c=n;
      for(let k=0;k<8;k++) c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);
      table[n]=c>>>0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc=0xffffffff;
    for(let i=0;i<bytes.length;i++) crc=ZIP_CRC_TABLE[(crc^bytes[i])&0xff]^(crc>>>8);
    return (crc^0xffffffff)>>>0;
  }

  function dosDateTime(date=new Date()) {
    const year=Math.max(1980,date.getFullYear());
    const dosTime=(date.getHours()<<11)|(date.getMinutes()<<5)|Math.floor(date.getSeconds()/2);
    const dosDate=((year-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate();
    return {dosTime,dosDate};
  }

  function makeZip(files) {
    const encoder=new TextEncoder();
    const chunks=[];
    const central=[];
    let offset=0;
    const now=dosDateTime();
    const push=bytes=>{ chunks.push(bytes); offset+=bytes.length; };
    const header=(size, writer)=>{
      const bytes=new Uint8Array(size);
      const view=new DataView(bytes.buffer);
      writer(view,bytes);
      return bytes;
    };
    const writeName=(target, pos, nameBytes)=>target.set(nameBytes,pos);

    files.forEach(file=>{
      const nameBytes=encoder.encode(file.name);
      const data=file.bytes;
      const crc=crc32(data);
      const localOffset=offset;
      const local=header(30+nameBytes.length,(view,bytes)=>{
        view.setUint32(0,0x04034b50,true);
        view.setUint16(4,20,true);
        view.setUint16(6,0,true);
        view.setUint16(8,0,true);
        view.setUint16(10,now.dosTime,true);
        view.setUint16(12,now.dosDate,true);
        view.setUint32(14,crc,true);
        view.setUint32(18,data.length,true);
        view.setUint32(22,data.length,true);
        view.setUint16(26,nameBytes.length,true);
        view.setUint16(28,0,true);
        writeName(bytes,30,nameBytes);
      });
      push(local);
      push(data);
      central.push({nameBytes,data,crc,localOffset});
    });

    const centralStart=offset;
    central.forEach(file=>{
      const cent=header(46+file.nameBytes.length,(view,bytes)=>{
        view.setUint32(0,0x02014b50,true);
        view.setUint16(4,20,true);
        view.setUint16(6,20,true);
        view.setUint16(8,0,true);
        view.setUint16(10,0,true);
        view.setUint16(12,now.dosTime,true);
        view.setUint16(14,now.dosDate,true);
        view.setUint32(16,file.crc,true);
        view.setUint32(20,file.data.length,true);
        view.setUint32(24,file.data.length,true);
        view.setUint16(28,file.nameBytes.length,true);
        view.setUint16(30,0,true);
        view.setUint16(32,0,true);
        view.setUint16(34,0,true);
        view.setUint16(36,0,true);
        view.setUint32(38,0,true);
        view.setUint32(42,file.localOffset,true);
        writeName(bytes,46,file.nameBytes);
      });
      push(cent);
    });
    const centralSize=offset-centralStart;
    const end=header(22,view=>{
      view.setUint32(0,0x06054b50,true);
      view.setUint16(4,0,true);
      view.setUint16(6,0,true);
      view.setUint16(8,central.length,true);
      view.setUint16(10,central.length,true);
      view.setUint32(12,centralSize,true);
      view.setUint32(16,centralStart,true);
      view.setUint16(20,0,true);
    });
    push(end);
    return new Blob(chunks,{type:'application/zip'});
  }

  function downloadBlob(filename, blob) {
    const a=document.createElement('a');
    const url=URL.createObjectURL(blob);
    a.href=url;
    a.download=filename;
    a.click();
    window.setTimeout(()=>URL.revokeObjectURL(url),2000);
  }

  function groupOverlayPngBytes(sample) {
    const override=state.manualOverrides[sample.id];
    const result=override?.result||state.groupResults[sample.id]||(state.sample?.id===sample.id?state.result:null);
    const source=override?.sourceData||result?.src;
    const field=override?.fieldData||result?.field;
    const mask=override?.mask||result?.mask;
    if(!source||!mask) return null;
    const W=override?.width||result?.analysisW||source.width;
    const H=override?.height||result?.analysisH||source.height;
    if(!W||!H) return null;
    const canvas=document.createElement('canvas');
    canvas.width=W;
    canvas.height=H;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const out=new ImageData(new Uint8ClampedArray(source.data),W,H);
    const d=out.data;
    const len=W*H;
    if(field) {
      for(let p=0,i=0;p<len;p++,i+=4) {
        if(!field[p]) {
          d[i]=d[i]*0.35|0;
          d[i+1]=d[i+1]*0.35|0;
          d[i+2]=d[i+2]*0.35|0;
        }
      }
    }
    drawContour(d,mask,W,H);
    ctx.putImageData(out,0,0);
    return {bytes:dataUrlToBytes(canvas.toDataURL('image/png')),width:W,height:H};
  }

  async function exportGroupPngOverlays() {
    const samples=selectedGroupSamples();
    if(state.mode!=='group') setMode('group');
    if(!samples.length) {
      setLog('<strong>No group loaded yet.</strong> Drop multiple images or use the open button to create a group.');
      return;
    }
    let missing=samples.filter(s=>(!state.groupResults[s.id]||state.groupResults[s.id].previewOnly)&&!state.manualOverrides[s.id]?.result);
    if(missing.length) {
      setSpinner(true);
      el.exportGroupPng.disabled=true;
      setLog(`<strong>Group PNG export:</strong> preparing ${missing.length}/${samples.length} full-resolution overlay${missing.length>1?'s':''} before download.`);
      await renderGroupContours(samples,{force:true});
      missing=samples.filter(s=>(!state.groupResults[s.id]||state.groupResults[s.id].previewOnly)&&!state.manualOverrides[s.id]?.result);
      if(missing.length) {
        setSpinner(false);
        el.exportGroupPng.disabled=false;
        setLog(`<strong>Group PNG export:</strong> ${missing.length}/${samples.length} image${missing.length>1?'s still need':' still needs'} full-resolution analysis. Check whether any group cards failed, then try again.`);
        return;
      }
    }
    const group=selectedGroup();
    const groupName=safeFilenamePart(group.label,'group');
    setSpinner(true);
    el.exportGroupPng.disabled=true;
    try {
      setLog(`<strong>Group PNG export:</strong> rendering ${samples.length} full-resolution contour overlay PNG${samples.length>1?'s':''} into one ZIP.`);
      const rendered=samples.map((sample,index)=>({sample,index,overlay:groupOverlayPngBytes(sample)})).filter(item=>item.overlay);
      if(!rendered.length) {
        setLog('<strong>Group PNG export:</strong> no full-resolution analysis overlays were found. Click Apply to group, wait for previews, then export again.');
        return;
      }
      const files=rendered.map(item=>{
        const sampleName=safeFilenamePart(item.sample.path.split('/').pop()||item.sample.imageId,`image_${item.index+1}`);
        const time=safeFilenamePart(item.sample.time||String(item.index+1),`t${item.index+1}`);
        return {
          name:`cytomove_${groupName}_${String(item.index+1).padStart(2,'0')}_${time}_${sampleName}_overlay_${item.overlay.width}x${item.overlay.height}px.png`,
          bytes:item.overlay.bytes
        };
      });
      const zip=makeZip(files);
      downloadBlob(`cytomove_${groupName}_overlay_pngs.zip`,zip);
      const sizes=[...new Set(rendered.map(item=>`${item.overlay.width}x${item.overlay.height}`))].join(', ');
      setLog(`<strong>Group PNG export complete:</strong> ${files.length} full-resolution contour overlay PNG${files.length>1?'s were':' was'} packed into one ZIP (${sizes} px).`);
    } catch(err) {
      setLog(`<strong>Group PNG export failed.</strong> ${err.message||err}`);
    } finally {
      el.exportGroupPng.disabled=false;
      setSpinner(false);
    }
  }

  function groupPlotRows() {
    return selectedGroupSamples().map((sample,index)=>{
      const r=state.manualOverrides[sample.id]?.result||state.groupResults[sample.id]||(state.sample?.id===sample.id?state.result:null);
      if(!r) return null;
      const parsed=parseTimeHours(sample.time);
      return {
        sample,index,
        x:Number.isFinite(parsed)?parsed:index+1,
        label:sample.time||String(index+1),
        areaPct:Number(r.areaPct),
        width:Number(r.wMean)
      };
    }).filter(row=>row&&Number.isFinite(row.x));
  }

  function drawTimePlot(rows, metric, title, yLabel, color) {
    const valid=rows.filter(row=>Number.isFinite(row[metric]));
    if(valid.length<2) return null;
    const W=1400,H=900;
    const margin={left:115,right:50,top:90,bottom:115};
    const plotW=W-margin.left-margin.right;
    const plotH=H-margin.top-margin.bottom;
    const canvas=document.createElement('canvas');
    canvas.width=W; canvas.height=H;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#102027';
    ctx.font='700 34px Arial, sans-serif';
    ctx.fillText(title,margin.left,52);
    ctx.font='500 20px Arial, sans-serif';
    ctx.fillStyle='#5b7370';
    ctx.fillText('Cytomove group export',margin.left,82);

    const xs=valid.map(row=>row.x), ys=valid.map(row=>row[metric]);
    let minX=Math.min(...xs), maxX=Math.max(...xs);
    let minY=Math.min(...ys), maxY=Math.max(...ys);
    if(minX===maxX){ minX-=1; maxX+=1; }
    if(minY===maxY){ minY=Math.max(0,minY-1); maxY+=1; }
    const yPad=(maxY-minY)*0.12;
    minY=Math.max(0,minY-yPad); maxY=maxY+yPad;
    const xToPx=x=>margin.left+(x-minX)*plotW/(maxX-minX);
    const yToPx=y=>margin.top+plotH-(y-minY)*plotH/(maxY-minY);

    ctx.strokeStyle='#d5e4e1';
    ctx.lineWidth=2;
    ctx.fillStyle='#6d8581';
    ctx.font='18px Arial, sans-serif';
    ctx.textAlign='right';
    ctx.textBaseline='middle';
    for(let i=0;i<=5;i++) {
      const y=minY+(maxY-minY)*i/5;
      const py=yToPx(y);
      ctx.beginPath(); ctx.moveTo(margin.left,py); ctx.lineTo(W-margin.right,py); ctx.stroke();
      ctx.fillText(metric==='areaPct'?fmt(y,1):fmt(y,0),margin.left-14,py);
    }
    ctx.strokeStyle='#102027';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(margin.left,margin.top);
    ctx.lineTo(margin.left,margin.top+plotH);
    ctx.lineTo(margin.left+plotW,margin.top+plotH);
    ctx.stroke();

    ctx.textAlign='center';
    ctx.textBaseline='top';
    valid.forEach(row=>{
      const px=xToPx(row.x);
      ctx.fillStyle='#6d8581';
      ctx.fillText(row.label,px,margin.top+plotH+20);
    });
    ctx.save();
    ctx.translate(34,margin.top+plotH/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillStyle='#102027';
    ctx.font='700 22px Arial, sans-serif';
    ctx.textAlign='center';
    ctx.fillText(yLabel,0,0);
    ctx.restore();
    ctx.fillStyle='#102027';
    ctx.font='700 22px Arial, sans-serif';
    ctx.textAlign='center';
    ctx.fillText('Timepoint',margin.left+plotW/2,H-46);

    ctx.strokeStyle=color;
    ctx.lineWidth=5;
    ctx.beginPath();
    valid.forEach((row,i)=>{
      const px=xToPx(row.x), py=yToPx(row[metric]);
      if(i) ctx.lineTo(px,py); else ctx.moveTo(px,py);
    });
    ctx.stroke();
    valid.forEach(row=>{
      const px=xToPx(row.x), py=yToPx(row[metric]);
      ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(px,py,9,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=color; ctx.lineWidth=5; ctx.stroke();
      ctx.fillStyle='#102027';
      ctx.font='700 18px Arial, sans-serif';
      ctx.textBaseline='bottom';
      ctx.fillText(metric==='areaPct'?`${fmt(row[metric],1)}%`:fmt(row[metric],0),px,py-15);
    });
    return canvas;
  }

  function exportGroupPlotsZip() {
    const rows=groupPlotRows();
    if(state.mode!=='group') setMode('group');
    if(rows.length<2) {
      setLog('<strong>Plot export:</strong> at least two analyzed group images are needed.');
      return;
    }
    const group=selectedGroup();
    const groupName=safeFilenamePart(group.label,'group');
    const areaPlot=drawTimePlot(rows,'areaPct',`${group.label} - Wound area`,'Wound area (%)','#0f9f8f');
    const widthPlot=drawTimePlot(rows,'width',`${group.label} - Mean wound width`,'Mean wound width (px)','#2f6fed');
    const files=[];
    if(areaPlot) files.push({name:`cytomove_${groupName}_wound_area_plot.png`,bytes:dataUrlToBytes(areaPlot.toDataURL('image/png'))});
    if(widthPlot) files.push({name:`cytomove_${groupName}_mean_width_plot.png`,bytes:dataUrlToBytes(widthPlot.toDataURL('image/png'))});
    if(!files.length) {
      setLog('<strong>Plot export:</strong> no plottable area or width values were found.');
      return;
    }
    downloadBlob(`cytomove_${groupName}_plots.zip`,makeZip(files));
    setLog(`<strong>Plot export complete:</strong> ${files.length} plot PNG${files.length>1?'s were':' was'} packed into one ZIP.`);
  }

  function showGroupPlot(metric) {
    const rows=groupPlotRows();
    if(state.mode!=='group') setMode('group');
    if(rows.length<2) {
      setLog('<strong>Plot preview:</strong> at least two analyzed group images are needed.');
      return;
    }
    const group=selectedGroup();
    const isArea=metric==='areaPct';
    const canvas=drawTimePlot(
      rows,
      metric,
      `${group.label} - ${isArea?'Wound area':'Mean wound width'}`,
      isArea?'Wound area (%)':'Mean wound width (px)',
      isArea?'#0f9f8f':'#2f6fed'
    );
    if(!canvas) {
      setLog(`<strong>Plot preview:</strong> no plottable ${isArea?'area':'width'} values were found.`);
      return;
    }
    el.plotDialogTitle.textContent=isArea?'Wound area plot':'Mean wound width plot';
    el.plotBody.innerHTML='';
    el.plotBody.appendChild(canvas);
    el.plotPanel.hidden=false;
  }

  function closePlotPanel() {
    el.plotPanel.hidden=true;
    el.plotBody.innerHTML='';
  }

  function groupExportRows(samples=selectedGroupSamples()) {
    return samples.map(s=>{
      const r=state.manualOverrides[s.id]?.result||state.groupResults[s.id]||(state.sample?.id===s.id?state.result:null);
      if(!r) return null;
      return {
        image_id:s.imageId||s.id,
        filename:s.path.split('/').pop()||s.path,
        group_id:`${s.cell} / ${s.condition}`,
        timepoint:s.time,
        time_hours:r.timeHours??'',
        source_width_px:r.sourceW||'',
        source_height_px:r.sourceH||'',
        analysis_width_px:r.analysisW||r.crop?.w||'',
        analysis_height_px:r.analysisH||r.crop?.h||'',
        field_area_px:r.fieldArea,
        wound_area_px:r.area,
        wound_area_fraction_percent:Number.isFinite(r.areaPct)?r.areaPct.toFixed(4):'',
        mean_wound_width_px:Number.isFinite(r.wMean)?r.wMean.toFixed(2):'',
        median_wound_width_px:Number.isFinite(r.wMedian)?r.wMedian.toFixed(2):'',
        width_sd_px:Number.isFinite(r.wSd)?r.wSd.toFixed(2):'',
        width_cv_percent:Number.isFinite(r.widthCv)?r.widthCv.toFixed(4):'',
        min_width_px:r.wMin??'',
        max_width_px:r.wMax??'',
        valid_row_count:r.validRows??'',
        valid_row_fraction_percent:Number.isFinite(r.validRowFraction)?r.validRowFraction.toFixed(4):'',
        segmentation_quality_score:r.segmentationQualityScore??'',
        recommended_primary_metric:r.recommendedPrimaryMetric||'',
        manual_correction_status:r.manualCorrectionStatus||'none',
        manual_added_px:r.manualAddedPx||0,
        manual_removed_px:r.manualRemovedPx||0,
        manual_net_delta_px:r.manualNetDeltaPx||0,
        internal_island_total_count:(Number(r.internalIslandCount)||0)+(Number(r.filledSmallIslandCount)||0),
        internal_island_total_area_px:(Number(r.internalIslandArea)||0)+(Number(r.filledSmallIslandArea)||0),
        internal_island_count:r.internalIslandCount??'',
        internal_island_area_px:r.internalIslandArea??'',
        largest_internal_island_px:r.largestInternalIslandArea??'',
        filled_small_internal_island_count:r.filledSmallIslandCount??'',
        filled_small_internal_island_area_px:r.filledSmallIslandArea??'',
        tiny_island_mode:r.tinyIslandMode||'',
        tiny_island_max_area_px:r.holeFillMaxArea??'',
        final_components:r.finalComponents??'',
        threshold:r.threshold??'',
        threshold_mode:r.thresholdMode||'',
        variance_radius:r.varianceRadius??'',
        threshold_level:r.thresholdLevel??'',
        threshold_offset:r.thresholdOffset??'',
        min_component_px:r.minComponentPx??'',
        fov_cutoff:r.fovCutoff??'',
        field_mask_mode:r.fieldMaskMode||'',
        gt_area_px:s.area??'',
        gt_area_fraction_percent:s.areaPct??'',
        gt_width_px:s.width??'',
        gt_closure_percent:s.closure??'',
        area_error_percent:Number.isFinite(r.areaErr)?r.areaErr.toFixed(4):'',
        warnings:(r.warnings||[]).join(' | ')
      };
    }).filter(Boolean);
  }

  function exportGroupCsv() {
    const records=groupExportRows();
    if(!records.length) {
      setLog('<strong>No group results yet.</strong> Wait for group analysis previews to finish, then export again.');
      return;
    }
    const headers=Object.keys(records[0]);
    const csv=[headers, ...records.map(r=>headers.map(h=>r[h]))].map(row=>row.map(csvCell).join(',')).join('\n');
    const group=selectedGroup();
    downloadText(`cytomove_${(group.label||'group').replace(/[^\w\-]+/g,'_')}_group_metrics.csv`,'text/csv',csv);
  }

  function exportSingleCsv() {
    if(!state.result) return;
    const r=state.result, gt=state.sample;
    const crop=r.crop||{};
    const parameterLog={
      algorithm_version:CYTOMOVE_ALGORITHM_VERSION,
      view:state.view,
      image_name:state.imageName,
      source_width_px:r.sourceW||state.image?.naturalWidth||'',
      source_height_px:r.sourceH||state.image?.naturalHeight||'',
      analysis_width_px:r.analysisW||el.canvas.width,
      analysis_height_px:r.analysisH||el.canvas.height,
      scratch_orientation:r.scratchOrientation||'',
      manual_rotation_deg:r.manualRotationDeg??'',
      orientation_rotation_deg:r.orientationRotationDeg??'',
      rotation_deg:r.effectiveRotationDeg??'',
      deskew_angle_deg:r.fineRotationDeg??0,
      deskew_applied:(Number(r.fineRotationDeg)||0)!==0,
      auto_crop_fov:r.autoCropFov??'',
      crop_x:crop.x??'',
      crop_y:crop.y??'',
      crop_w:crop.w??'',
      crop_h:crop.h??'',
      crop_manual:r.cropManual??'',
      variance_radius:r.varianceRadius??'',
      threshold_mode:r.thresholdMode||'',
      threshold_level:r.thresholdLevel??'',
      threshold_offset:r.thresholdOffset??'',
      otsu_threshold:r.otsuThreshold,
      fallback_threshold:r.fallbackThreshold,
      threshold_fallback_used:r.thresholdFallbackUsed,
      final_threshold:r.threshold,
      min_component_px:r.minComponentPx??'',
      tiny_island_mode:r.tinyIslandMode||'',
      tiny_island_max_area_px:r.holeFillMaxArea,
      field_mask_mode:r.fieldMaskMode||'',
      fov_cutoff:r.fovCutoff??'',
      contour_thickness:Number(el.contourThickness.value),
      contour_color:el.contourColor.value,
      contour_style:el.contourStyle.value,
      angle_ruler_visible:state.rulerVisible,
      angle_ruler_offset_x_px:Math.round(state.rulerOffsetX||0),
      angle_ruler_offset_y_px:Math.round(state.rulerOffsetY||0),
      manual_correction_status:state.result?.manualCorrectionStatus||'none',
      manual_added_px:state.result?.manualAddedPx||0,
      manual_removed_px:state.result?.manualRemovedPx||0,
      manual_net_delta_px:state.result?.manualNetDeltaPx||0,
      manual_correction_fraction_percent:state.result?.manualCorrectionFractionPercent||0,
      width_min_valid_width_px:state.result?.minValidWidth||'',
      recommended_primary_metric:state.result?.recommendedPrimaryMetric||'',
      warnings:state.result?.warnings||[]
    };
    const rows=[
      ['field','value'],
      ['schema_version','validation-protocol-v0.3'],
      ['cytomove_algorithm_version',CYTOMOVE_ALGORITHM_VERSION],
      ['image',state.imageName],['image_id',gt?.imageId||''],
      ['filename',state.imageName.split('/').pop()||state.imageName],
      ['cell_type',gt?.cell||''],['condition',gt?.condition||''],['time_post_wounding_hours',gt?.time||''],
      ['baseline_image_id',''],['replicate_id',''],
      ['image_width_px',r.sourceW||state.image?.naturalWidth||''],['image_height_px',r.sourceH||state.image?.naturalHeight||''],
      ['analysis_width_px',r.analysisW||el.canvas.width],['analysis_height_px',r.analysisH||el.canvas.height],
      ['scratch_orientation',r.scratchOrientation||''],
      ['manual_rotation_deg',r.manualRotationDeg??''],['orientation_rotation_deg',r.orientationRotationDeg??''],
      ['rotation_deg',r.effectiveRotationDeg??''],['deskew_angle_deg',r.fineRotationDeg??0],['deskew_applied',(Number(r.fineRotationDeg)||0)!==0?'yes':'no'],
      ['ground_truth_method',gt?'whst_seed_calibration':'manual_image'],
      ['ground_truth_comparable',r.gtComparable?'yes':'no'],
      ['ground_truth_wound_area_px',gt?.area||''],['ground_truth_wound_area_pct',gt?.areaPct||''],
      ['ground_truth_width_mean_px',gt?.width||''],['ground_truth_width_sd_px',''],
      ['ground_truth_closure_pct',gt?.closure||''],['ground_truth_mask_filename',''],
      ['cytomove_wound_area_px',r.area],['cytomove_wound_area_pct',r.areaPct.toFixed(4)],
      ['cytomove_wound_area_fraction_percent',r.areaPct.toFixed(4)],
      ['cytomove_area_per_valid_row_px',r.areaPerValidRow.toFixed(2)],
      ['cytomove_width_mean_px',r.wMean.toFixed(2)],
      ['cytomove_width_median_px',r.wMedian.toFixed(2)],
      ['cytomove_width_sd_px',r.wSd.toFixed(2)],
      ['cytomove_width_cv_percent',r.widthCv.toFixed(4)],
      ['cytomove_width_min_px',r.wMin],
      ['cytomove_width_max_px',r.wMax],
      ['cytomove_valid_row_count',r.validRows],
      ['cytomove_valid_row_fraction_percent',r.validRowFraction.toFixed(4)],
      ['cytomove_segmentation_quality_score',r.segmentationQualityScore],
      ['cytomove_recommended_primary_metric',r.recommendedPrimaryMetric],
      ['cytomove_warnings',r.warnings.join(' | ')],
      ['cytomove_runtime_ms',r.runtimeMs],
      ['cytomove_manual_correction_status',r.manualCorrectionStatus||'none'],
      ['manual_added_px',r.manualAddedPx||0],['manual_removed_px',r.manualRemovedPx||0],
      ['manual_net_delta_px',r.manualNetDeltaPx||0],['manual_correction_fraction_percent',r.manualCorrectionFractionPercent||0],
      ['cytomove_parameter_json',JSON.stringify(parameterLog)],
      ['comparator_whst_area_px',gt?.area||''],['comparator_tscratch_area_px',''],
      ['comparator_pyscratch_area_px',''],['comparator_csma_area_px',''],
      ['area_error_pct',r.areaErr?.toFixed(4)||''],['area_error_signed_pct',r.areaErrS?.toFixed(4)||''],
      ['width_error_px',gt?.width?(r.wMean-gt.width).toFixed(4):''],
      ['otsu_threshold',r.otsuThreshold],['fallback_threshold',r.fallbackThreshold],['threshold_fallback_used',r.thresholdFallbackUsed?'yes':'no'],['final_threshold',r.threshold],['field_area_px',r.fieldArea],
      ['variance_radius',r.varianceRadius??''],['threshold_mode',r.thresholdMode||''],['threshold_level',r.thresholdLevel??''],['threshold_offset',Number.isFinite(r.thresholdOffset)?fmt(r.thresholdOffset,3):''],
      ['min_component_px',r.minComponentPx??''],['tiny_island_mode',r.tinyIslandMode||''],['tiny_island_max_area_px',r.holeFillMaxArea??''],['field_mask_mode',r.fieldMaskMode||''],['fov_cutoff',r.fovCutoff??''],
      ['auto_crop_fov',r.autoCropFov?'yes':'no'],['crop_x',crop.x??''],['crop_y',crop.y??''],['crop_w',crop.w??''],['crop_h',crop.h??''],['crop_manual',r.cropManual?'yes':'no'],
      ['islands_total',r.totalComponents],['islands_kept',r.keptComponents],['final_components',r.finalComponents],
      ['largest_component_px',r.largestArea||''],
      ['internal_island_total_count',(Number(r.internalIslandCount)||0)+(Number(r.filledSmallIslandCount)||0)],
      ['internal_island_total_area_px',(Number(r.internalIslandArea)||0)+(Number(r.filledSmallIslandArea)||0)],
      ['internal_island_count',r.internalIslandCount??''],['internal_island_area_px',r.internalIslandArea??''],
      ['largest_internal_island_px',r.largestInternalIslandArea??''],
      ['filled_small_internal_island_count',r.filledSmallIslandCount??''],
      ['filled_small_internal_island_area_px',r.filledSmallIslandArea??''],
      ['small_hole_fill_max_area_px',r.holeFillMaxArea??''],
      ['contour_thickness',el.contourThickness.value],['contour_color',el.contourColor.value],['contour_style',el.contourStyle.value],
      ['angle_ruler_visible',state.rulerVisible?'yes':'no'],
      ['angle_ruler_offset_x_px',Math.round(state.rulerOffsetX||0)],['angle_ruler_offset_y_px',Math.round(state.rulerOffsetY||0)],
      ['confidence',gt?.confidence||'manual'],['timestamp',new Date().toISOString()]
    ];
    downloadText(`cytomove_${gt?.imageId||'image'}_metrics.csv`,'text/csv',rows.map(row=>row.map(csvCell).join(',')).join('\n'));
  }

  function exportCsv() {
    if(state.mode==='group') exportGroupCsv();
    else exportSingleCsv();
  }

  function htmlTable(title, rows) {
    if(!rows.length) return `<h2>${escHtml(title)}</h2><p>No rows</p>`;
    const headers=Object.keys(rows[0]);
    return `<h2>${escHtml(title)}</h2><table><thead><tr>${headers.map(h=>`<th>${escHtml(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${headers.map(h=>`<td>${escHtml(r[h])}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  function exportExcel() {
    const now=new Date().toISOString();
    let rows=[];
    let filename='cytomove_metrics.xls';
    let title='CytoMove Single Image Metrics';
    if(state.mode==='group') {
      rows=groupExportRows();
      const group=selectedGroup();
      filename=`cytomove_${(group.label||'group').replace(/[^\w\-]+/g,'_')}_group_metrics.xls`;
      title=`CytoMove Group Metrics - ${group.label}`;
    } else if(state.result) {
      rows=groupExportRows([state.sample||{id:'single',imageId:'single',path:state.imageName||'image',cell:'',condition:'',time:'',area:null,areaPct:null,width:null,closure:null}]);
      if(!rows.length) rows=[{image_name:state.imageName||'image', wound_area_px:state.result.area, wound_area_fraction_percent:state.result.areaPct, mean_wound_width_px:state.result.wMean, segmentation_quality_score:state.result.segmentationQualityScore, recommended_primary_metric:state.result.recommendedPrimaryMetric, warnings:(state.result.warnings||[]).join(' | ')}];
      filename=`cytomove_${(state.sample?.imageId||state.imageName||'image').replace(/[^\w\-]+/g,'_')}_metrics.xls`;
    }
    if(!rows.length) {
      setLog('<strong>No exportable results yet.</strong> Run a single image or wait for group analysis to finish.');
      return;
    }
    const summary=[{created_at:now, algorithm_version:CYTOMOVE_ALGORITHM_VERSION, export_scope:state.mode, image_count:rows.length, export_basis:'last displayed segmentation result per image'}];
    const html=`<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif}h1{font-size:18px}h2{font-size:14px;margin-top:18px}table{border-collapse:collapse;margin-bottom:18px}th{background:#e8f4f2;font-weight:700}td,th{border:1px solid #b9d4cf;padding:6px 8px;font-size:12px;mso-number-format:"\\@";}</style></head><body><h1>${escHtml(title)}</h1>${htmlTable('Export summary',summary)}${htmlTable('Per-image metrics',rows)}</body></html>`;
    downloadText(filename,'application/vnd.ms-excel',html);
  }

  // Zoom
  let zoomTimer;
  function applyZoom() {
    el.canvas.style.transform=`scale(${state.zoom}) translate(${state.panX/state.zoom}px,${state.panY/state.zoom}px)`;
    el.zoomBadge.textContent=`${Math.round(state.zoom*100)}%`;
    el.zoomBadge.classList.add('visible');
    clearTimeout(zoomTimer);
    zoomTimer=setTimeout(()=>el.zoomBadge.classList.remove('visible'),1400);
  }
  function changeZoom(delta) {
    state.zoom=Math.max(0.25,Math.min(8,state.zoom*delta));
    applyZoom();
  }

  // Sample meta
  function populateGroups() {
    el.groupSelect.innerHTML='';
    const groups=groupOptions();
    groups.forEach(g=>{
      const o=document.createElement('option');
      o.value=g.id;
      o.textContent=g.label;
      el.groupSelect.appendChild(o);
    });
    el.groupSelect.disabled=!groups.length;
    if(el.groupSelectRow) el.groupSelectRow.hidden=!groups.length;
    if(el.deleteGroup) el.deleteGroup.disabled=!groups.length;
    const label=document.getElementById('groupSelectLabel');
    if(label) label.hidden=!groups.length;
  }

  function populateSamples() {
    el.sampleSelect.innerHTML='';
    CALIBRATION.forEach(s=>{
      const o=document.createElement('option');
      o.value=s.id;
      o.textContent=`${s.id} - ${s.cell} - ${s.condition} - ${s.time} [${s.confidence}]`;
      el.sampleSelect.appendChild(o);
    });
    el.sampleSelect.value='cal-003';
    updateSampleMeta();
  }

  function selectedSample() { return CALIBRATION.find(s=>s.id===el.sampleSelect.value)||CALIBRATION[0]; }
  function groupOptions() {
    const custom=state.customGroups;
    return SHOW_DEMO_CALIBRATION ? [...GROUPS,...custom] : custom;
  }
  function allSamples() { return [...CALIBRATION,...state.customSamples]; }
  function sampleById(id) { return allSamples().find(s=>s.id===id); }
  function selectedGroup() { return groupOptions().find(g=>g.id===el.groupSelect.value)||groupOptions()[0]||{id:'empty',label:'No group loaded',sampleIds:[],custom:true}; }
  function microscopeModeLabel(mode) { return mode==='cutoff'?'brightfield':'phase contrast'; }
  function selectedGroupSamples() {
    const group=selectedGroup();
    return group.sampleIds.map(id=>sampleById(id)).filter(Boolean);
  }
  function selectedGroupKey() {
    return selectedGroupSamples().map(s=>`${s.id}:${s.path}:${s.time}`).join('|');
  }
  function clearMainImage() {
    state.image=null; state.imageOriginal=null; state.sample=null; state.result=null;
    state.maskData=null; state.autoMaskData=null; state.fieldData=null; state.sourceData=null;
    state.grayData=null; state.varMap=null; state.imageName='';
    el.canvas.hidden=true; el.emptyState.hidden=false;
    el.canvasTitle.textContent='No image loaded';
    el.canvasMeta.textContent='Drop an image or use the open button';
    el.metricsPanel.innerHTML='';
    el.rerun.disabled=true; el.exportPng.disabled=true; el.exportGroupPng.disabled=true; el.exportPlots.disabled=true; el.showAreaPlot.disabled=true; el.showWidthPlot.disabled=true; el.exportCsv.disabled=true; el.exportExcel.disabled=true;
    el.adjustCrop.disabled=true; el.resetCrop.disabled=true; el.applyCrop.disabled=true; el.rotateImage.disabled=true;
    el.deskewMinus.disabled=true; el.deskewPlus.disabled=true; if(el.resetRotation) el.resetRotation.disabled=true;
    state.objectUrls.forEach(u=>URL.revokeObjectURL(u)); state.objectUrls=[];
    updateGroupNavButtons();
  }
  function currentImageBelongsToSelectedGroup() {
    const currentId=state.sample?.id;
    return !!currentId&&selectedGroupSamples().some(s=>s.id===currentId);
  }
  function currentGroupSampleIndex() {
    const currentId=state.sample?.id;
    if(!currentId) return -1;
    return selectedGroupSamples().findIndex(s=>s.id===currentId);
  }
  function updateGroupNavButtons() {
    const samples=selectedGroupSamples();
    const idx=currentGroupSampleIndex();
    const enabled=state.mode==='group'&&idx>=0&&samples.length>1&&!state.cropEditing;
    el.groupPrev.disabled=!enabled||idx<=0;
    el.groupNext.disabled=!enabled||idx>=samples.length-1;
  }
  function loadGroupSampleAt(index) {
    const samples=selectedGroupSamples();
    if(index<0||index>=samples.length) return;
    const sample=samples[index];
    if(!sample.custom&&el.sampleSelect) {
      el.sampleSelect.value=sample.id;
      updateSampleMeta();
    }
    loadImage(sampleUrl(sample),sample,sample.path,true);
  }
  function stepGroupSample(delta) {
    const idx=currentGroupSampleIndex();
    if(idx<0) return;
    loadGroupSampleAt(idx+delta);
  }
  function deleteSelectedGroup() {
    const group=selectedGroup();
    if(!group?.sampleIds?.length||!group.custom) return;
    const ok=window.confirm(`Remove "${group.label}" from this session? Original image files on disk will not be deleted.`);
    if(!ok) return;
    const ids=new Set(group.sampleIds);
    const removedSamples=state.customSamples.filter(s=>ids.has(s.id));
    removedSamples.forEach(s=>{ if(s.url) URL.revokeObjectURL(s.url); });
    state.customSamples=state.customSamples.filter(s=>!ids.has(s.id));
    state.customGroups=state.customGroups.filter(g=>g.id!==group.id);
    ids.forEach(id=>{
      delete state.groupResults[id];
      delete state.manualOverrides[id];
      delete state.sampleSettings[id];
    });
    state.calibrationReport=null;
    state.lastAutoMicroscopeGroupKey='';
    populateGroups();
    const nextGroup=groupOptions()[0];
    if(nextGroup) {
      el.groupSelect.value=nextGroup.id;
      setMode('group');
      const first=selectedGroupSamples()[0];
      if(first) loadImage(sampleUrl(first),first,first.path,true);
      setLog(`<strong>Group removed:</strong> ${escHtml(group.label)}. Switched to ${escHtml(nextGroup.label)}.`);
    } else {
      setMode('single');
      clearMainImage();
      el.groupView.hidden=true;
      setLog(`<strong>Group removed:</strong> ${escHtml(group.label)}. No loaded groups remain.`);
    }
  }
  function setMicroscopeMode(mode, userSet=false) {
    el.fovMode.value=mode==='cutoff'?'cutoff':'full';
    if(userSet) state.microscopeModeUserSet=true;
    applyAutoContourStyle();
    syncLabels();
  }

  function applyAutoContourStyle(force=false) {
    if(!force&&state.contourStyleUserSet) return;
    el.contourColor.value=el.fovMode.value==='cutoff'?'#000000':'#00d1ff';
    el.contourStyle.value='solid';
  }

  function currentGroupSettingsSummary() {
    const cropMode=state.cropManual&&state.crop?'manual crop':el.autoCropFov.checked?'auto FOV crop':'full image';
    const groupCrop=el.applyCropRatioGroup.checked&&state.cropManual&&state.crop?'same crop ratio':'per-image crop';
    const orientation=el.scratchOrientation.value==='horizontal'?'horizontal scratch':'vertical scratch';
    const rotation=effectiveRotationDeg()?`${effectiveRotationDeg()}deg effective rotation`:'no rotation';
    const deskew=Number(el.deskewAngle.value)||0;
    const thresholdText=thresholdMode()==='wide'?`T-offset ${el.thresholdOffset.value}`:`T-level ${el.thresholdOffset.value}`;
    return `R${el.varianceRadius.value}, ${thresholdText}, min ${el.minComponent.value}, islands ${el.tinyIslandMode.value}, microscope ${microscopeModeLabel(el.fovMode.value)}, FOV ${el.fovCutoff.value}, ${orientation}, ${cropMode}, ${groupCrop}, ${rotation}, fine rotation ${deskew}deg`;
  }

  function parseTimeHours(time) {
    const m=String(time||'').match(/-?\d+(\.\d+)?/);
    return m?Number(m[0]):0;
  }

  function seriesCard(label,number,hint,kind='') {
    return `<div class="series-card ${kind}"><div class="series-label">${label}</div><div class="series-number">${number}</div><div class="series-hint">${hint}</div></div>`;
  }

  function rSquared(xs, ys) {
    const pairs=xs.map((x,i)=>[Number(x),Number(ys[i])]).filter(([x,y])=>Number.isFinite(x)&&Number.isFinite(y));
    if(pairs.length<3) return null;
    const mx=pairs.reduce((a,p)=>a+p[0],0)/pairs.length;
    const my=pairs.reduce((a,p)=>a+p[1],0)/pairs.length;
    let sxx=0,syy=0,sxy=0;
    pairs.forEach(([x,y])=>{const dx=x-mx,dy=y-my;sxx+=dx*dx;syy+=dy*dy;sxy+=dx*dy;});
    if(!sxx||!syy) return null;
    return (sxy*sxy)/(sxx*syy);
  }

  function currentSeriesAreaWidthR2() {
    const group=selectedGroup();
    const rows=(group?.sampleIds||[]).map(id=>state.manualOverrides[id]?.result||state.groupResults[id]).filter(Boolean);
    if(rows.length<3) return null;
    return rSquared(rows.map(r=>r.area),rows.map(r=>r.wMean));
  }

  function computeSeriesQc(samples) {
    const rows=samples.map(s=>state.manualOverrides[s.id]?.result||state.groupResults[s.id]).filter(Boolean).sort((a,b)=>a.timeHours-b.timeHours);
    if(rows.length<2) return null;
    const base=rows[0];
    const warnings=[];
    const validRowProblem=rows.some(r=>{
      const fillRatio=Number.isFinite(r.areaWidthFillRatio)?r.areaWidthFillRatio:1;
      const coherent=fillRatio>=0.72&&fillRatio<=1.08;
      const nearClosed=(r.areaPct||0)<6||(r.analysisW&&r.wMean/r.analysisW<0.08);
      return r.validRowFraction<35&&!(nearClosed&&coherent&&r.area&&r.boundaryCount);
    });
    const dims=new Set(rows.map(r=>`${r.sourceW}x${r.sourceH}`));
    if(dims.size>1) warnings.push('image dimensions differ across timepoints');
    const cropAreas=rows.map(r=>r.cropW*r.cropH).filter(Boolean);
    const minCrop=Math.min(...cropAreas), maxCrop=Math.max(...cropAreas);
    if(minCrop>0&&((maxCrop-minCrop)/minCrop)*100>3) warnings.push('crop/FOV size varies across timepoints');
    if(validRowProblem) warnings.push('one or more timepoints have low valid row fraction');
    if(rows.some(r=>r.widthCv>65)) warnings.push('one or more wounds have a highly irregular width profile');
    const areaWidthR2=rSquared(rows.map(r=>r.area),rows.map(r=>r.wMean));
    if(areaWidthR2!==null&&areaWidthR2<0.9) warnings.push(`area-width Pearson R2 is weak (${fmt(areaWidthR2,3)})`);

    const closureRows=rows.slice(1).map(r=>{
      const areaClosure=base.area?((base.area-r.area)/base.area)*100:0;
      const widthClosure=base.wMean?((base.wMean-r.wMean)/base.wMean)*100:0;
      const diff=Math.abs(areaClosure-widthClosure);
      if(diff>15) warnings.push(`${r.time}: area and width closure differ by ${fmt(diff,1)} percentage points`);
      return {...r,areaClosure,widthClosure,diff};
    });
    const maxDiff=closureRows.reduce((m,r)=>Math.max(m,r.diff),0);
    const latest=closureRows[closureRows.length-1];
    const cropOrFovWarning=warnings.some(w=>/dimension|crop|FOV/i.test(w));
    const recommended=cropOrFovWarning||maxDiff>15?'width_preferred':'area_and_width';
    let score=100;
    if(cropOrFovWarning) score-=25;
    if(maxDiff>15) score-=25;
    if(validRowProblem) score-=15;
    if(rows.some(r=>r.widthCv>65)) score-=10;
    if(areaWidthR2!==null&&areaWidthR2>=0.98) score+=10;
    else if(areaWidthR2!==null&&areaWidthR2<0.9) score-=15;
    score=Math.max(0,score);
    return {rows,closureRows,latest,maxDiff,areaWidthR2,warnings:[...new Set(warnings)],recommended,score:Math.min(100,score)};
  }

  function renderSeriesSummary(samples) {
    const target=el.groupView.querySelector('#seriesSummary');
    if(!target) return;
    const qc=computeSeriesQc(samples);
    if(!qc) {
      const done=Object.keys(state.groupResults).length;
      target.innerHTML=seriesCard('Series QC','calculating',`${done}/${samples.length} images analysed`);
      return;
    }
    const kind=qc.score>=80?'good':qc.score>=60?'warn':'bad';
    const recKind=qc.recommended==='width_preferred'?'warn':'good';
    target.innerHTML=[
      seriesCard('Series QC',`${fmt(qc.score)}/100`,qc.warnings.length?`${qc.warnings.length} warning${qc.warnings.length>1?'s':''}`:'crop/FOV looks consistent',kind),
      seriesCard('Latest area closure',`${fmt(qc.latest.areaClosure,1)}%`,`t0 to ${qc.latest.time}`),
      seriesCard('Latest width closure',`${fmt(qc.latest.widthClosure,1)}%`,`t0 to ${qc.latest.time}`),
      seriesCard('Area-width Pearson R2',qc.areaWidthR2===null?'n/a':fmt(qc.areaWidthR2,3),qc.areaWidthR2!==null&&qc.areaWidthR2>=0.98?'Pearson correlation squared; metrics track together':'Pearson correlation squared; check agreement',qc.areaWidthR2!==null&&qc.areaWidthR2<0.9?'warn':'good'),
      seriesCard('Recommended',qc.recommended.replace(/_/g,' '),qc.warnings[0]||'area and width can be interpreted together',recKind)
    ].join('');
  }

  function updateGroupCardResult(sample, r) {
    const body=el.groupView.querySelector(`.group-card[data-sample-id="${sample.id}"] .group-card-body`);
    if(!body) return;
    const qcKind=r.segmentationQualityScore>=80?'good':r.segmentationQualityScore>=60?'warn':'bad';
    body.innerHTML=`
      <div class="group-metric"><span>CM area</span><span>${fmt(r.area)} px</span></div>
      <div class="group-metric"><span>Area %</span><span>${fmt(r.areaPct,2)}%</span></div>
      <div class="group-metric"><span>CM width</span><span>${fmt(r.wMean,1)} px</span></div>
      <div class="group-metric"><span>Valid rows</span><span>${fmt(r.validRowFraction,1)}%</span></div>
      <div class="group-metric"><span>Image QC</span><span class="${qcKind}">${fmt(r.segmentationQualityScore)}/100</span></div>
      <div class="group-metric"><span>GT closure</span><span>${sample.closure===null||sample.closure===undefined?'n/a':`${fmt(sample.closure,2)}%`}</span></div>
    `;
  }

  function areaErrorClass(v) {
    if(!Number.isFinite(v)) return '';
    const a=Math.abs(v);
    return a<=10?'error-good':a<=25?'error-warn':'error-bad';
  }

  function renderCalibrationReport() {
    const target=el.groupView.querySelector('#calibrationReport');
    if(!target) return;
    const report=state.calibrationReport;
    if(!report) {
      target.hidden=true;
      target.innerHTML='';
      return;
    }
    target.hidden=false;
    const rows=report.rows.map(row=>{
      return `<tr>
        <td>${escHtml(row.time)}</td>
        <td>${fmt(row.cytoAreaPct,2)}%</td>
        <td>${fmt(row.gtAreaPct,2)}%</td>
        <td class="${areaErrorClass(row.areaErrorPct)}">${Number.isFinite(row.areaErrorPct)?`${fmt(row.areaErrorPct,2)}%`:'n/a'}</td>
      </tr>`;
    }).join('');
    target.innerHTML=`
      <div class="calibration-head">
        <div class="calibration-title">Calibration report</div>
        <div class="calibration-summary">mean area error ${fmt(report.meanAreaErrorPct,2)}% / max ${fmt(report.maxAreaErrorPct,2)}%</div>
      </div>
      <table class="calibration-table">
        <thead><tr><th>Time</th><th>CytoMove area</th><th>GT area</th><th>Area error</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  function buildCalibrationReport(rows, samples) {
    const reportRows=rows.slice().sort((a,b)=>a.timeHours-b.timeHours).map(r=>{
      const sample=samples.find(s=>s.id===r.sampleId);
      const gtAreaPct=Number(sample?.areaPct)||0;
      return {
        time:r.time,
        cytoAreaPct:r.areaPct,
        gtAreaPct,
        areaErrorPct:gtAreaPct?Math.abs(r.areaPct-gtAreaPct)*100/gtAreaPct:null
      };
    });
    const comparable=reportRows.map(r=>r.areaErrorPct).filter(v=>Number.isFinite(v));
    const meanAreaErrorPct=comparable.length?comparable.reduce((a,b)=>a+b,0)/comparable.length:null;
    const maxAreaErrorPct=comparable.length?Math.max(...comparable):null;
    return {rows:reportRows,meanAreaErrorPct,maxAreaErrorPct};
  }

  function currentSegmentationSettings() {
    const thresholdLevel=Number(el.thresholdOffset.value);
    const thMode=thresholdMode();
    return {
      varianceRadius:Number(el.varianceRadius.value),
      thresholdMode:thMode,
      thresholdLevel,
      thresholdOffset:thresholdLevelToOffset(thresholdLevel),
      minComponent:Number(el.minComponent.value),
      tinyIslandMode:el.tinyIslandMode.value,
      fovCutoff:Number(el.fovCutoff.value),
      fovMode:el.fovMode.value,
      autoCrop:el.autoCropFov.checked,
      cropRatio:el.applyCropRatioGroup.checked&&state.cropManual&&state.crop?normalizedCropRatio(state.crop):null,
      scratchOrientation:el.scratchOrientation.value,
      rotation:effectiveRotationDeg()||0,
      manualRotation:state.rotation||0,
      orientationRotation:orientationRotationDeg(),
      deskew:Number(el.deskewAngle.value)||0
    };
  }

  function currentPanelSettings() {
    const activePreset=document.querySelector('.preset-btn.active')?.dataset.preset||'';
    return {
      presetKey:activePreset,
      varianceRadius:Number(el.varianceRadius.value),
      thresholdMode:thresholdMode(),
      thresholdLevel:Number(el.thresholdOffset.value),
      thresholdOffset:thresholdLevelToOffset(Number(el.thresholdOffset.value)),
      minComponent:Number(el.minComponent.value),
      tinyIslandMode:el.tinyIslandMode.value,
      fovCutoff:Number(el.fovCutoff.value),
      fovMode:el.fovMode.value,
      autoCropFov:!!el.autoCropFov.checked,
      applyCropRatioGroup:!!el.applyCropRatioGroup.checked,
      scratchOrientation:el.scratchOrientation.value,
      manualRotation:state.rotation||0,
      deskew:Number(el.deskewAngle.value)||0
    };
  }

  function settingsFromPresetKey(key='standard') {
    const p=PRESETS[key]||PRESETS.standard;
    const mode=p.thresholdMode||'small';
    const value=p.thresholdValue??p.thresholdLevel??1;
    return {
      presetKey:key,
      varianceRadius:p.varianceRadius,
      thresholdMode:mode,
      thresholdLevel:value,
      thresholdOffset:mode==='wide'?value:smallThresholdLevelToOffset(value),
      minComponent:p.minComponent,
      tinyIslandMode:p.tinyIslandMode||'trace',
      fovCutoff:p.fovCutoff,
      fovMode:p.fovMode||'cutoff',
      autoCropFov:false,
      applyCropRatioGroup:false,
      scratchOrientation:p.scratchOrientation||'vertical',
      manualRotation:0,
      deskew:0
    };
  }

  function defaultPanelSettings() {
    return settingsFromPresetKey('standard');
  }

  function settingsFromResult(result) {
    if(!result) return null;
    return {
      varianceRadius:result.varianceRadius,
      thresholdMode:result.thresholdMode||'small',
      thresholdLevel:result.thresholdLevel??thresholdOffsetToLevel(result.thresholdOffset,result.thresholdMode||'small'),
      thresholdOffset:result.thresholdOffset,
      minComponent:result.minComponentPx,
      tinyIslandMode:result.tinyIslandMode||'medium',
      fovCutoff:result.fovCutoff,
      fovMode:result.fieldMaskMode||'cutoff',
      autoCropFov:!!result.autoCropFov,
      applyCropRatioGroup:!!el.applyCropRatioGroup.checked,
      scratchOrientation:result.scratchOrientation||'vertical',
      manualRotation:result.manualRotationDeg||0,
      deskew:result.fineRotationDeg||0
    };
  }

  function sampleSettings(sample) {
    if(!sample?.id) return null;
    return state.sampleSettings[sample.id]
      || settingsFromResult(state.manualOverrides[sample.id]?.result)
      || settingsFromResult(state.groupResults[sample.id])
      || null;
  }

  function settingsFromSegmentationSettings(settings) {
    if(!settings) return null;
    return {
      varianceRadius:settings.varianceRadius,
      thresholdMode:settings.thresholdMode||'small',
      thresholdLevel:settings.thresholdLevel,
      thresholdOffset:settings.thresholdOffset,
      minComponent:settings.minComponent,
      tinyIslandMode:settings.tinyIslandMode||'medium',
      fovCutoff:settings.fovCutoff,
      fovMode:settings.fovMode||'cutoff',
      autoCropFov:!!settings.autoCrop,
      applyCropRatioGroup:!!settings.cropRatio,
      scratchOrientation:settings.scratchOrientation||'vertical',
      manualRotation:settings.manualRotation||0,
      deskew:settings.deskew||0
    };
  }

  function rememberCurrentSampleSettings() {
    const id=state.sample?.id;
    if(!id) return;
    state.sampleSettings[id]=currentPanelSettings();
  }

  function applyPanelSettings(settings) {
    if(!settings) return;
    if(Number.isFinite(Number(settings.varianceRadius))) el.varianceRadius.value=settings.varianceRadius;
    setThresholdMode(settings.thresholdMode||'small',settings.thresholdLevel??settings.thresholdOffset);
    if(Number.isFinite(Number(settings.minComponent))) el.minComponent.value=settings.minComponent;
    if(settings.tinyIslandMode) el.tinyIslandMode.value=settings.tinyIslandMode;
    if(Number.isFinite(Number(settings.fovCutoff))) el.fovCutoff.value=settings.fovCutoff;
    if(settings.fovMode) setMicroscopeMode(settings.fovMode,false);
    el.autoCropFov.checked=!!settings.autoCropFov;
    el.applyCropRatioGroup.checked=!!settings.applyCropRatioGroup;
    if(settings.scratchOrientation) el.scratchOrientation.value=settings.scratchOrientation;
    state.rotation=Number(settings.manualRotation)||0;
    el.deskewAngle.value=Number(settings.deskew)||0;
    el.deskewAngleVal.value=el.deskewAngle.value;
    document.querySelectorAll('.preset-btn').forEach(btn=>btn.classList.toggle('active',!!settings.presetKey&&btn.dataset.preset===settings.presetKey));
    syncLabels();
  }

  function applySegmentationSettings(settings) {
    el.varianceRadius.value=settings.varianceRadius;
    setThresholdMode(settings.thresholdMode||'small',settings.thresholdLevel??thresholdOffsetToLevel(settings.thresholdOffset,settings.thresholdMode||'small'));
    el.minComponent.value=settings.minComponent;
    if(settings.tinyIslandMode) el.tinyIslandMode.value=settings.tinyIslandMode;
    el.fovCutoff.value=settings.fovCutoff;
    if(settings.fovMode) el.fovMode.value=settings.fovMode;
    syncLabels();
  }

  function loadImageElement(src) {
    return new Promise((resolve,reject)=>{
      const img=new Image();
      img.decoding='async';
      img.onload=()=>resolve(img);
      img.onerror=reject;
      img.src=src;
    });
  }

  function classifyMicroscopeImage(img) {
    const maxSide=260;
    const scale=Math.min(1,maxSide/Math.max(img.naturalWidth,img.naturalHeight));
    const W=Math.max(1,Math.round(img.naturalWidth*scale));
    const H=Math.max(1,Math.round(img.naturalHeight*scale));
    const c=document.createElement('canvas');
    c.width=W; c.height=H;
    const ctx=c.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(img,0,0,W,H);
    const data=ctx.getImageData(0,0,W,H).data;
    const len=W*H;
    const gray=toGray(data,len);
    const hist=new Uint32Array(256);
    let mean=0;
    for(let i=0;i<len;i++){hist[gray[i]]++;mean+=gray[i];}
    mean/=len;
    let acc=0,p10=null,p90=255;
    for(let i=0;i<256;i++) {
      acc+=hist[i];
      if(p10===null&&acc>=len*0.10) p10=i;
      if(acc>=len*0.90){p90=i;break;}
    }
    const darkFrac=hist.slice(0,45).reduce((a,b)=>a+b,0)/len;
    const contrast=((p90||255)-(p10||0))/255;
    const field=fovMask(gray,len,18,'cutoff');
    let fieldCount=0;
    for(let i=0;i<len;i++) fieldCount+=field[i];
    const fieldFraction=fieldCount/len;
    const centerX0=Math.round(W*0.28), centerX1=Math.round(W*0.72);
    let centerDark=0,centerN=0;
    for(let y=0;y<H;y++) for(let x=centerX0;x<centerX1;x++) {
      const p=y*W+x;
      centerN++;
      if(gray[p]<65) centerDark++;
    }
    const centerDarkFraction=centerN?centerDark/centerN:0;
    let scorePhase=0,scoreBright=0;
    if(darkFrac>0.08) scorePhase+=2;
    if(centerDarkFraction>0.10) scorePhase+=2;
    if(fieldFraction<0.92) scorePhase+=1;
    if(mean<110) scorePhase+=1;
    if(darkFrac<0.04) scoreBright+=2;
    if(centerDarkFraction<0.06) scoreBright+=2;
    if(fieldFraction>0.96) scoreBright+=1;
    if(mean>=110) scoreBright+=1;
    if(contrast>0.55&&darkFrac<0.06) scoreBright+=1;
    return {mode:scorePhase>scoreBright?'full':'cutoff',scorePhase,scoreBright,darkFrac,centerDarkFraction,fieldFraction,mean,contrast};
  }

  async function autoDetectGroupMicroscopeMode(options={}) {
    const {auto=false}=options;
    if(auto&&state.microscopeModeUserSet) return;
    const group=selectedGroup();
    const samples=selectedGroupSamples();
    if(!samples.length) return;
    const groupKey=selectedGroupKey();
    if(auto&&state.lastAutoMicroscopeGroupKey===groupKey) return;
    const seq=++state.autoMicroscopeDetectSeq;
    setSpinner(true);
    setLog(`<strong>Auto detect microscope:</strong> sampling ${samples.length} group image${samples.length>1?'s':''} in the background...`);
    try {
      const votes=[];
      for(const sample of samples.slice(0,Math.min(samples.length,12))) {
        const img=await loadImageElement(sampleUrl(sample));
        votes.push(classifyMicroscopeImage(img));
      }
      if(seq!==state.autoMicroscopeDetectSeq) return;
      const phase=votes.filter(v=>v.mode==='full').length;
      const bright=votes.length-phase;
      const next=phase>bright?'full':'cutoff';
      const previousMode=el.fovMode.value;
      setMicroscopeMode(next,false);
      state.lastAutoMicroscopeGroupKey=groupKey;
      if(state.mode==='group') renderGroupView();
      const confidence=Math.round(Math.max(phase,bright)*100/votes.length);
      const avg=votes.reduce((a,v)=>({dark:a.dark+v.darkFrac,field:a.field+v.fieldFraction}),{dark:0,field:0});
      setLog(`<strong>Auto detect microscope:</strong> selected ${microscopeModeLabel(next)} (${confidence}% vote; dark ${fmt(avg.dark*100/votes.length,1)}%, field ${fmt(avg.field*100/votes.length,1)}%).`);
      if(previousMode!==next&&state.image&&currentImageBelongsToSelectedGroup()) {
        runSegmentation();
        setLog(`<strong>Auto detect microscope:</strong> selected ${microscopeModeLabel(next)} and refreshed the main image (${confidence}% vote; dark ${fmt(avg.dark*100/votes.length,1)}%, field ${fmt(avg.field*100/votes.length,1)}%).`);
      }
    } catch(err) {
      setLog(`<strong>Auto detect failed.</strong> ${err.message||err}`);
    } finally {
      if(seq===state.autoMicroscopeDetectSeq) setSpinner(false);
    }
  }

  async function detectGroupMicroscopeMode(samples, limit=12) {
    const votes=[];
    for(const sample of samples.slice(0,Math.min(samples.length,limit))) {
      const img=await loadImageElement(sampleUrl(sample));
      votes.push(classifyMicroscopeImage(img));
    }
    const phase=votes.filter(v=>v.mode==='full').length;
    const bright=votes.length-phase;
    const mode=phase>bright?'full':'cutoff';
    const confidence=votes.length?Math.round(Math.max(phase,bright)*100/votes.length):0;
    const avg=votes.reduce((a,v)=>({dark:a.dark+v.darkFrac,field:a.field+v.fieldFraction,centerDark:a.centerDark+v.centerDarkFraction,contrast:a.contrast+v.contrast}),{dark:0,field:0,centerDark:0,contrast:0});
    const darkPct=votes.length?avg.dark*100/votes.length:0;
    const centerDarkPct=votes.length?avg.centerDark*100/votes.length:0;
    const fieldPct=votes.length?avg.field*100/votes.length:0;
    const contrastPct=votes.length?avg.contrast*100/votes.length:0;
    const speckledPhase=mode==='full'&&darkPct>=8&&centerDarkPct>=8&&fieldPct>=94;
    return {
      mode,
      presetKey:mode==='full'?(speckledPhase?'phase2':'fine'):'standard',
      confidence,
      darkPct,
      centerDarkPct,
      fieldPct,
      contrastPct,
      speckledPhase,
      votes
    };
  }

  async function initializeGroupPresetAndOpen(samples, groupLabel) {
    const seq=++state.autoMicroscopeDetectSeq;
    setSpinner(true);
    setLog(`<strong>${escHtml(groupLabel)}:</strong> detecting image type before opening the group...`);
    try {
      const detected=await detectGroupMicroscopeMode(samples,12);
      if(seq!==state.autoMicroscopeDetectSeq) return;
      const base=settingsFromPresetKey(detected.presetKey);
      samples.forEach(sample=>{
        if(!state.sampleSettings[sample.id]) state.sampleSettings[sample.id]={...base};
      });
      applyPanelSettings(base);
      state.lastAutoMicroscopeGroupKey=selectedGroupKey();
      setMode('group');
      const first=samples[0];
      if(first) loadImage(sampleUrl(first),first,first.path,true);
      warnIfHorizontalScratchDetected(samples);
      const presetLabel=detected.presetKey==='phase2'?'Phase contrast 2':detected.presetKey==='fine'?'Phase contrast':'Brightfield small cells';
      setLog(`<strong>${escHtml(groupLabel)} loaded:</strong> ${samples.length} local images. Initial preset: ${presetLabel} (${detected.confidence}% vote; dark ${fmt(detected.darkPct,1)}%, center dark ${fmt(detected.centerDarkPct,1)}%).`);
    } catch(err) {
      const base=defaultPanelSettings();
      samples.forEach(sample=>{ if(!state.sampleSettings[sample.id]) state.sampleSettings[sample.id]={...base}; });
      applyPanelSettings(base);
      setMode('group');
      const first=samples[0];
      if(first) loadImage(sampleUrl(first),first,first.path,true);
      setLog(`<strong>${escHtml(groupLabel)} loaded:</strong> image-type detection failed, so Brightfield small cells was used. ${err.message||err}`);
    } finally {
      if(seq===state.autoMicroscopeDetectSeq) setSpinner(false);
    }
  }

  function scheduleGroupMicroscopeAutoDetect() {
    if(state.mode!=='group'||state.microscopeModeUserSet) return;
    window.setTimeout(()=>autoDetectGroupMicroscopeMode({auto:true}),0);
  }

  function transformImageElement(img, settings) {
    if(!settings.rotation&&!settings.deskew) return Promise.resolve(img);
    return loadImageElement(transformImage(img,settings.rotation,settings.deskew));
  }

  function analyzeImageWithSettings(workImg, sample, settings, maxSide=420) {
    const scratch=document.createElement('canvas');
    const ctx=scratch.getContext('2d',{willReadFrequently:true});
    const crop=settings.cropRatio
      ? cropFromRatio(workImg,settings.cropRatio)
      : settings.autoCrop
        ? autoCropForImage(workImg,true,settings.fovCutoff)
        : {x:0,y:0,w:workImg.naturalWidth,h:workImg.naturalHeight,active:false};
    const scale=maxSide?Math.min(1,maxSide/Math.max(crop.w,crop.h)):1;
    const W=Math.max(1,Math.round(crop.w*scale));
    const H=Math.max(1,Math.round(crop.h*scale));
    scratch.width=W; scratch.height=H;
    ctx.drawImage(workImg,crop.x,crop.y,crop.w,crop.h,0,0,W,H);
    const src=ctx.getImageData(0,0,W,H);
    const len=W*H;
    const areaScale=(W*H)/(crop.w*crop.h);
    const radius=Math.max(1,Math.round(settings.varianceRadius*Math.sqrt(areaScale)));
    const minC=Math.max(25,Math.round(settings.minComponent*areaScale));
    const gray=toGray(src.data,len);
    const field=fovMask(gray,len,settings.fovCutoff,settings.fovMode);
    const normed=enhanceContrast(gray,field,len);
    const varMap=varianceFilter(normed,field,W,H,radius);
    const {threshold:otsuTh,maxV}=otsuOnMap(varMap,field,len);
    const fallbackTh=percentileThresholdOnMap(varMap,field,len,maxV,0.38);
    const baseTh=otsuTh<3?fallbackTh:otsuTh;
    const finalTh=Math.max(1,Math.min(255,baseTh+settings.thresholdOffset));
    const raw=applyThreshold(varMap,field,len,finalTh,maxV,gray,settings.fovMode);
    const priorResult=constrainToPrior(raw,W,H,groupPriorMaskForSample(sample,W,H));
    const filtered=filterComponents(priorResult.mask,W,H,minC);
    const holeFillLimit=tinyIslandMaxArea(W,H,settings.tinyIslandMode||'medium');
    const holeResult=fillSmallHoles(filtered.mask,W,H,holeFillLimit);
      const mask=holeResult.mask;
      for(let p=0;p<len;p++) if(!field[p]) mask[p]=0;
      const scratchOri=settings.scratchOrientation||'vertical';
      const continuity=enforceWoundContinuity(mask,W,H,scratchOri,settings.fovMode);
      const slitClose=closePhaseContrastSlits(continuity.mask,W,H,settings.fovMode);
      const smooth=smoothPhaseContrastMask(slitClose.mask,W,H,settings.fovMode);
      const bridge=bridgeWoundGaps(smooth.mask,W,H,scratchOri);
      const edgeExtend=extendWoundToFrameEdges(bridge.mask,W,H,scratchOri,settings.fovMode);
      const finalHoleResult=fillSmallHoles(edgeExtend.mask,W,H,holeFillLimit);
      const finalMask=finalHoleResult.mask;
      const finalComponents=componentStats(finalMask,W,H);
    let area=0,fieldArea=0;
      for(let p=0;p<len;p++){fieldArea+=field[p];area+=finalMask[p];}
    const areaPct=fieldArea?area*100/fieldArea:0;
      const width=estimateWidth(finalMask,W,H);
      const boundaryCount=boundaryPixels(finalMask,W,H).length;
    const areaPerValidRow=width.validRows?area/width.validRows:0;
    const areaWidthFillRatio=width.mean&&width.validRows?area/(width.mean*width.validRows):0;
    const partialResult={
      sampleId:sample.id,time:sample.time,timeHours:parseTimeHours(sample.time),
      sourceW:workImg.naturalWidth,sourceH:workImg.naturalHeight,
      cropW:crop.w,cropH:crop.h,analysisW:W,analysisH:H,
      varianceRadius:radius,thresholdLevel:settings.thresholdLevel,thresholdOffset:settings.thresholdOffset,
      minComponentPx:minC,fovCutoff:settings.fovCutoff,autoCropFov:!!settings.autoCrop,cropManual:false,
      scratchOrientation:settings.scratchOrientation||'vertical',
      manualRotationDeg:settings.manualRotation||0,
      orientationRotationDeg:settings.orientationRotation||0,
      effectiveRotationDeg:settings.rotation||0,
      fineRotationDeg:settings.deskew||0,
      area,areaPct,wMean:width.mean,wMedian:width.median,wSd:width.sd,widthCv:width.cv,
      wMin:width.min,wMax:width.max,validRows:width.validRows,validRowFraction:width.validRowFraction,
      areaPerValidRow,areaWidthFillRatio,minValidWidth:width.minValidWidth,
      threshold:finalTh,fieldArea,boundaryCount,maxV,fieldMaskMode:settings.fovMode||'full',
      thresholdMode:settings.thresholdMode||'small',
      totalComponents:filtered.totalComponents,keptComponents:filtered.keptComponents,
      largestArea:filtered.largestArea,finalComponents:finalComponents.totalComponents,
      groupPriorApplied:priorResult.applied,groupPriorArea:priorResult.priorArea,groupPriorRadius:priorResult.radius,
      continuityKeptComponents:continuity.kept,continuityTotalComponents:continuity.total,
      phaseSlitFilledPx:slitClose.filled,phaseSlitCount:slitClose.slits,
      phaseSmoothChangedPx:smooth.changed,phaseSmoothRadius:smooth.radius,
      bridgeFilledPx:bridge.filled,bridgeGapCount:bridge.gaps,edgeExtendedPx:edgeExtend.filled,edgeExtendedCount:edgeExtend.edges,
      finalHoleFilledCount:finalHoleResult.filledHoleCount,finalHoleFilledArea:finalHoleResult.filledHoleArea,
      internalIslandCount:finalHoleResult.holeCount,internalIslandArea:finalHoleResult.holeArea,
      largestInternalIslandArea:finalHoleResult.largestHoleArea,filledSmallIslandCount:holeResult.filledHoleCount+finalHoleResult.filledHoleCount,
      filledSmallIslandArea:holeResult.filledHoleArea+finalHoleResult.filledHoleArea,holeFillMaxArea:holeResult.maxHoleArea,tinyIslandMode:settings.tinyIslandMode||'medium',crop,
      src,field,varMap,mask:finalMask
    };
    const qc=buildQc(partialResult,crop,W,H,false);
    return {...partialResult,segmentationQualityScore:qc.score,warnings:qc.warnings,recommendedPrimaryMetric:qc.recommendedPrimaryMetric};
  }

  function candidateValues(center, values) {
    return [...new Set(values.filter(v=>Number.isFinite(v)).sort((a,b)=>Math.abs(a-center)-Math.abs(b-center)).slice(0,4))].sort((a,b)=>a-b);
  }

  function buildCalibrationGrid() {
    const c=currentSegmentationSettings();
    const radii=candidateValues(c.varianceRadius,[c.varianceRadius-6,c.varianceRadius-3,c.varianceRadius,c.varianceRadius+3,c.varianceRadius+6].map(v=>Math.max(1,Math.min(45,Math.round(v)))));
    const thresholdPool=c.thresholdMode==='wide'
      ? [c.thresholdLevel-50,c.thresholdLevel-25,c.thresholdLevel,c.thresholdLevel+25,c.thresholdLevel+50,-100,-75,-50,-25,0,25,50,75,100]
      : [c.thresholdLevel-8,c.thresholdLevel-4,c.thresholdLevel,c.thresholdLevel+4,c.thresholdLevel+8,1,5,10,20,35,50];
    const thresholdLevels=candidateValues(c.thresholdLevel,thresholdPool.map(v=>c.thresholdMode==='wide'?Math.max(-100,Math.min(100,Math.round(v))):Math.max(1,Math.min(50,Math.round(v)))));
    const mins=candidateValues(c.minComponent,[0,10000,25000,40000,55000,75000,100000,c.minComponent].map(v=>Math.max(0,Math.min(100000,Math.round(v/1000)*1000))));
    const fovs=candidateValues(c.fovCutoff,[c.fovCutoff-8,c.fovCutoff,c.fovCutoff+8,30,36,44].map(v=>Math.max(0,Math.min(180,Math.round(v)))));
    const grid=[];
    radii.forEach(varianceRadius=>thresholdLevels.forEach(thresholdLevel=>mins.forEach(minComponent=>fovs.forEach(fovCutoff=>{
      const thresholdOffset=c.thresholdMode==='wide'?Math.max(-100,Math.min(100,thresholdLevel)):smallThresholdLevelToOffset(thresholdLevel);
      grid.push({...c,varianceRadius,thresholdLevel,thresholdOffset,minComponent,fovCutoff});
    }))));
    return grid;
  }

  function scoreCandidate(rows, samples) {
    const areaErrors=[];
    rows.forEach(r=>{
      const sample=samples.find(s=>s.id===r.sampleId);
      if(sample?.areaPct) areaErrors.push(Math.abs(r.areaPct-sample.areaPct)*100/sample.areaPct);
    });
    const meanAreaErrorPct=areaErrors.length?areaErrors.reduce((a,b)=>a+b,0)/areaErrors.length:0;
    const maxAreaErrorPct=areaErrors.length?Math.max(...areaErrors):0;
    return {score:meanAreaErrorPct,meanAreaErrorPct,maxAreaErrorPct};
  }

  async function autoCalibrateGroup() {
    const group=selectedGroup();
    const samples=group.sampleIds.map(id=>sampleById(id)).filter(Boolean);
    if(group.custom||samples.some(s=>s.custom)) {
      setLog('<strong>Auto calibration skipped.</strong> Custom local groups do not have ground-truth area values.');
      return;
    }
    const grid=buildCalibrationGrid();
    if(el.autoCalibrateGroup) el.autoCalibrateGroup.disabled=true;
    el.applySettingsGroup.disabled=true;
    setSpinner(true);
    setMode('group');
    setLog(`<strong>Auto calibration:</strong> testing ${grid.length} setting combinations on ${group.label}...`);
    try {
      const originals=[];
      for(const sample of samples) {
        const img=await loadImageElement(sampleUrl(sample));
        originals.push({sample,img});
      }
      let best=null;
      for(let i=0;i<grid.length;i++) {
        const settings=grid[i];
        const rows=[];
        for(const item of originals) {
          const workImg=await transformImageElement(item.img,settings);
          rows.push(analyzeImageWithSettings(workImg,item.sample,settings,0));
        }
        const fit=scoreCandidate(rows,samples);
        if(!best||fit.meanAreaErrorPct<best.fit.meanAreaErrorPct||(fit.meanAreaErrorPct===best.fit.meanAreaErrorPct&&fit.maxAreaErrorPct<best.fit.maxAreaErrorPct)) best={settings,rows,fit};
        if(best.fit.meanAreaErrorPct<=5) {
          setLog(`<strong>Auto calibration:</strong> stopped early; mean area error is near zero (${fmt(best.fit.meanAreaErrorPct,2)}%).`);
          break;
        }
        if(i%12===0) setLog(`<strong>Auto calibration:</strong> ${i+1}/${grid.length} tested. Best mean area error ${fmt(best.fit.meanAreaErrorPct,2)}%, max ${fmt(best.fit.maxAreaErrorPct,2)}%.`);
        await new Promise(resolve=>setTimeout(resolve,0));
      }
      applySegmentationSettings(best.settings);
      state.calibrationReport=buildCalibrationReport(best.rows,samples);
      renderGroupView();
      setLog(`<strong>Auto calibration selected:</strong> ${currentGroupSettingsSummary()}. Group mean area error ${fmt(best.fit.meanAreaErrorPct,2)}%, max ${fmt(best.fit.maxAreaErrorPct,2)}%. Review contours before export.`);
    } catch(err) {
      setLog(`<strong>Auto calibration failed.</strong> ${err.message||err}`);
    } finally {
      if(el.autoCalibrateGroup) el.autoCalibrateGroup.disabled=false;
      el.applySettingsGroup.disabled=false;
      setSpinner(false);
    }
  }

  function updateSampleMeta() {
    const s=selectedSample();
    const rows=[
      ['Image ID',s.imageId],['Group',`${s.cell} / ${s.condition} / ${s.time}`],
      ['GT area',`${fmt(s.area)} px`],['GT width',`${fmt(s.width,3)} px`],
      ['Closure',s.closure?`${fmt(s.closure,2)}%`:'n/a'],['Confidence',s.confidence]
    ];
    el.sampleMeta.innerHTML=rows.map(([k,v])=>`<div class="meta-row"><span class="meta-key">${k}</span><span class="meta-val">${v}</span></div>`).join('');
  }

  function renderGroupView(options={}) {
    const force=!!options.force;
    const group=selectedGroup();
    const samples=group.sampleIds.map(id=>sampleById(id)).filter(Boolean);
    if(force) {
      samples.forEach(s=>{ if(!state.manualOverrides[s.id]) delete state.groupResults[s.id]; });
      state.calibrationReport=null;
    }
    samples.forEach(s=>{ if(state.manualOverrides[s.id]) state.groupResults[s.id]=state.manualOverrides[s.id].result; });
    el.canvasTitle.textContent=`Group view: ${group.label}`;
    el.canvasMeta.textContent=`${samples.map(s=>s.time).join(' / ')} - previews use current settings: ${currentGroupSettingsSummary()}`;
    el.exportPng.disabled=true;
    el.exportGroupPng.disabled=!samples.length;
    el.exportPlots.disabled=false;
    el.showAreaPlot.disabled=false;
    el.showWidthPlot.disabled=false;
    el.exportCsv.disabled=false;
    el.exportExcel.disabled=false;
    el.groupView.innerHTML=`
      <div class="series-summary" id="seriesSummary">
        ${seriesCard('Series QC','calculating',`0/${samples.length} images analysed`)}
      </div>
      <div class="series-summary" id="orientationSeriesWarning"></div>
      <div class="calibration-report" id="calibrationReport" hidden></div>
      <div class="group-grid">
        ${samples.map(s=>`
          <article class="group-card" data-sample-id="${escHtml(s.id)}">
            <div class="group-card-head">
              <div class="group-card-title">
                <div class="group-card-name">${escHtml(s.path.split('/').pop())}</div>
                <div class="group-card-sub">${escHtml(s.cell)} / ${escHtml(s.condition)}</div>
              </div>
              <div class="group-chip">${escHtml(s.time)}</div>
            </div>
            <div class="group-image-wrap">
              <canvas class="group-canvas" data-sample-id="${escHtml(s.id)}" aria-label="${escHtml(s.path.split('/').pop())} contour preview"></canvas>
            </div>
            <div class="group-card-body">
              <div class="group-metric"><span>GT area</span><span>${s.area?`${fmt(s.area)} px`:'n/a'}</span></div>
              <div class="group-metric"><span>Area %</span><span>${s.areaPct?`${fmt(s.areaPct,3)}%`:'n/a'}</span></div>
              <div class="group-metric"><span>GT width</span><span>${s.width?`${fmt(s.width,3)} px`:'n/a'}</span></div>
              <div class="group-metric"><span>Closure</span><span>${s.closure===null||s.closure===undefined?'n/a':`${fmt(s.closure,2)}%`}</span></div>
              <div class="group-metric"><span>Confidence</span><span>${escHtml(s.confidence)}</span></div>
            </div>
          </article>
        `).join('')}
      </div>`;
    renderCalibrationReport();
    el.groupView.querySelectorAll('.group-card').forEach(card=>{
      card.addEventListener('click',()=>{
        const sample=sampleById(card.dataset.sampleId);
        if(!sample) return;
        if(!sample.custom) {
          el.sampleSelect.value=sample.id;
          updateSampleMeta();
        }
        loadGroupSampleAt(selectedGroupSamples().findIndex(s=>s.id===sample.id));
      });
    });
    renderGroupContours(samples,{force});
    warnIfHorizontalScratchDetected(samples);
    samples.forEach(s=>{ if(state.manualOverrides[s.id]) updateGroupCardResult(s,state.manualOverrides[s.id].result); });
    if(samples.some(s=>state.groupResults[s.id])) renderSeriesSummary(samples);
  }

  async function renderGroupContours(samples, options={}) {
    const force=!!options.force;
    const renderSeq=++state.groupRenderSeq;
    const previewMaxSide=force?0:900;
    for(const sample of samples) {
      if(renderSeq!==state.groupRenderSeq) return;
      if(state.manualOverrides[sample.id]) {
        updateGroupCardPreview(sample,state.manualOverrides[sample.id]);
        continue;
      }
      if(!force&&state.groupResults[sample.id]?.src&&state.groupResults[sample.id]?.mask) {
        updateGroupCardPreview(sample,state.groupResults[sample.id]);
        updateGroupCardResult(sample,state.groupResults[sample.id]);
        continue;
      }
      const canvas=el.groupView.querySelector(`canvas[data-sample-id="${sample.id}"]`);
      if(!canvas) continue;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      canvas.width=420; canvas.height=420;
      ctx.fillStyle='#f8fbfa';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#5b7370';
      ctx.font='600 13px Inter, sans-serif';
      ctx.fillText('Analyzing preview...',18,28);
      const failPreview=()=>{
        ctx.fillStyle='#f8fbfa';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle='#b42336';
        ctx.font='700 13px Inter, sans-serif';
        ctx.fillText('Preview failed',18,28);
      };
      try {
        const settings=currentSegmentationSettings();
        const img=await loadImageElement(sampleUrl(sample));
        if(renderSeq!==state.groupRenderSeq) return;
        const workImg=await transformImageElement(img,settings);
        if(renderSeq!==state.groupRenderSeq) return;
        if(state.manualOverrides[sample.id]) {
          updateGroupCardResult(sample,state.manualOverrides[sample.id].result);
          updateGroupCardPreview(sample,state.manualOverrides[sample.id]);
          renderSeriesSummary(samples);
          continue;
        }
        const analysis=analyzeImageWithSettings(workImg,sample,settings,previewMaxSide);
        analysis.previewOnly=previewMaxSide>0;
        state.sampleSettings[sample.id]=settingsFromSegmentationSettings(settings);
        if(state.manualOverrides[sample.id]) {
          updateGroupCardResult(sample,state.manualOverrides[sample.id].result);
          updateGroupCardPreview(sample,state.manualOverrides[sample.id]);
          renderSeriesSummary(samples);
          continue;
        }
        state.groupResults[sample.id]=analysis;
        updateGroupCardResult(sample,analysis);
        updateGroupCardPreview(sample,analysis);
        if(state.calibrationReport) {
          state.calibrationReport=buildCalibrationReport(Object.values(state.groupResults),samples);
          renderCalibrationReport();
        }
        el.exportGroupPng.disabled=!samples.length;
        renderSeriesSummary(samples);
      } catch(err) {
        failPreview();
      }
      await new Promise(resolve=>setTimeout(resolve,0));
    }
  }

  function setMode(mode, options={}) {
    if(mode==='group'&&!selectedGroupSamples().length) {
      state.mode='single';
      el.modeToggle.querySelectorAll('[data-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.mode==='single'));
      el.groupView.hidden=true;
      setLog('<strong>No group loaded yet.</strong> Drop multiple images or use the open button to create a group.');
      return;
    }
    state.mode=mode;
    el.modeToggle.querySelectorAll('[data-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.mode===mode));
    const isGroup=mode==='group';
    el.dropZone.hidden=false;
    el.groupView.hidden=!isGroup;
    if(isGroup) {
      renderGroupView(options);
      setLog('<strong>Group review:</strong> contour previews are downsampled. Click any card to load it into the main analysis canvas.');
      scheduleGroupMicroscopeAutoDetect();
    } else {
      el.exportGroupPng.disabled=true;
      el.exportPlots.disabled=true;
      el.showAreaPlot.disabled=true;
      el.showWidthPlot.disabled=true;
      if(state.imageName) {
        el.canvasTitle.textContent=state.imageName.split('/').pop()||state.imageName;
        if(state.result) el.canvasMeta.textContent=`${state.image?.naturalWidth||el.canvas.width}x${state.image?.naturalHeight||el.canvas.height} px`;
      }
      setLog(state.result?'<strong>Single image mode:</strong> segmentation result is ready.':'Ready.');
    }
    updateGroupNavButtons();
  }

  function syncLabels() {
    el.varianceRadiusVal.value=el.varianceRadius.value;
    el.thresholdOffsetVal.value=el.thresholdOffset.value;
    el.minComponentVal.value=el.minComponent.value;
    el.fovCutoffVal.value=el.fovCutoff.value;
    el.microscopeMode.querySelectorAll('[data-fov-mode]').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.fovMode===el.fovMode.value);
    });
    el.deskewAngleVal.value=el.deskewAngle.value;
    el.deskewBadge.textContent=`${Number(el.deskewAngle.value).toFixed(1).replace('.0','')} deg`;
    el.contourThicknessVal.value=el.contourThickness.value;
    el.brushSizeVal.value=el.brushSize.value;
    el.brushMode.querySelectorAll('[data-brush-mode]').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.brushMode===state.brushMode);
    });
    el.resetBrush.disabled=!state.brushEdited;
    el.undoBrush.disabled=state.brushHistory.length===0;
    el.angleRulerToggle.textContent=state.rulerVisible?'Hide angle ruler':'Show angle ruler';
    el.angleRulerToggle.classList.toggle('primary',state.rulerVisible);
    el.canvas.style.cursor=brushActive()?'crosshair':state.rulerVisible&&!state.cropEditing?'grab':'';
  }

  function nudgeDeskew(delta) {
    const min=Number(el.deskewAngle.min), max=Number(el.deskewAngle.max);
    const next=Math.max(min,Math.min(max,(Number(el.deskewAngle.value)||0)+delta));
    el.deskewAngle.value=String(next);
    el.deskewAngleVal.value=String(next);
    syncLabels();
    deskewCurrentImage();
  }

  function bindNumberPair(rangeInput, numberInput, onApply) {
    rangeInput.addEventListener('input',()=>{
      numberInput.value=rangeInput.value;
      onApply();
    });
    numberInput.addEventListener('input',()=>{
      if(numberInput.value==='') return;
      rangeInput.value=clampControlValue(rangeInput,numberInput.value);
      onApply();
    });
    numberInput.addEventListener('change',()=>{
      numberInput.value=clampControlValue(rangeInput,numberInput.value);
      rangeInput.value=numberInput.value;
      onApply();
    });
  }

  function panelKey(text) {
    return String(text||'panel').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'panel';
  }

  function setCollapsibleOpen(panel, title, open) {
    panel.classList.toggle('collapsed',!open);
    title.setAttribute('aria-expanded',String(open));
  }

  function makeCollapsible(panel, title, key, defaultOpen=true) {
    if(panel.dataset.collapsibleReady) return;
    panel.dataset.collapsibleReady='true';
    const saved=localStorage.getItem(`cytomove.panel.${key}`);
    const open=saved===null?defaultOpen:saved==='open';
    title.setAttribute('role','button');
    title.setAttribute('tabindex','0');
    title.innerHTML=`<span class="section-title-text">${escHtml(title.textContent.trim())}</span><span class="section-chevron" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
    const toggle=()=>{
      const next=panel.classList.contains('collapsed');
      setCollapsibleOpen(panel,title,next);
      localStorage.setItem(`cytomove.panel.${key}`,next?'open':'closed');
    };
    title.addEventListener('click',toggle);
    title.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' ') {
        e.preventDefault();
        toggle();
      }
    });
    setCollapsibleOpen(panel,title,open);
  }

  function setupSidebarPanels() {
    const defaultOpen=new Set(['review-mode','presets','segmentation','metrics']);
    document.querySelectorAll('.sidebar .section:not([hidden])').forEach((section,index)=>{
      const title=Array.from(section.children).find(child=>child.classList?.contains('section-title'));
      if(!title||section.querySelector(':scope > .section-content')) return;
      const key=section.id||panelKey(title.textContent)||`section-${index}`;
      const content=document.createElement('div');
      content.className='section-content';
      while(title.nextSibling) content.appendChild(title.nextSibling);
      section.appendChild(content);
      makeCollapsible(section,title,key,defaultOpen.has(panelKey(title.textContent)));
    });
    setupSidebarSubpanels();
  }

  function createSubpanel(titleText, key, defaultOpen, nodes) {
    const panel=document.createElement('div');
    panel.className='subpanel';
    const title=document.createElement('div');
    title.className='subpanel-title';
    const content=document.createElement('div');
    content.className='subpanel-content';
    nodes.filter(Boolean).forEach(node=>content.appendChild(node));
    panel.append(title,content);
    makeCollapsible(panel,title,key,defaultOpen);
    title.querySelector('.section-title-text').textContent=titleText;
    return panel;
  }

  function setupSidebarSubpanels() {
    const segmentation=Array.from(document.querySelectorAll('.sidebar .section')).find(section=>section.querySelector(':scope > .section-title')?.textContent.toLowerCase().includes('segmentation'));
    const segContent=segmentation?.querySelector(':scope > .section-content');
    if(segContent&&!segContent.dataset.subpanelsReady) {
      segContent.dataset.subpanelsReady='true';
      const byId=id=>document.getElementById(id)?.closest('.control')||document.getElementById(id);
      const basic=createSubpanel('Basic analysis','segmentation-basic',true,[
        byId('varianceRadius'),
        byId('thresholdOffset'),
        byId('minComponent'),
        byId('tinyIslandMode'),
        document.getElementById('microscopeMode')?.closest('.control'),
        byId('scratchOrientation')
      ]);
      const advanced=createSubpanel('Advanced geometry','segmentation-advanced',false,[
        byId('fovCutoff'),
        byId('deskewAngle'),
        document.getElementById('angleRulerToggle'),
        byId('autoCropFov')
      ]);
      segContent.append(basic,advanced);
    }

    const view=Array.from(document.querySelectorAll('.sidebar .section')).find(section=>section.querySelector(':scope > .section-title')?.textContent.toLowerCase().includes('view'));
    const viewContent=view?.querySelector(':scope > .section-content');
    if(viewContent&&!viewContent.dataset.subpanelsReady) {
      viewContent.dataset.subpanelsReady='true';
      const display=createSubpanel('Basic display','view-basic',true,[document.getElementById('viewToggle')]);
      const styling=createSubpanel('Contour style','view-style',false,[
        document.getElementById('contourThickness')?.closest('.control'),
        viewContent.querySelector('.style-row')
      ]);
      viewContent.append(display,styling);
    }
  }

  // Image load
  function loadImage(src,sample=null,name='',keepMode=false) {
    rememberCurrentSampleSettings();
    if(state.mode!=='single'&&!keepMode) setMode('single');
    setSpinner(true); setLog('Loading image...');
    const img=new Image(); img.decoding='async';
    img.onload=()=>{
      state.image=img; state.imageOriginal=img; state.sample=sample; state.rotation=0;
      el.deskewAngle.value=0; el.deskewAngleVal.value=0;
      state.rulerOffsetX=0; state.rulerOffsetY=0; state.rulerDragging=false; state.rulerDragStart=null;
      state.imageName=name||sample?.path||'local image';
      resetCropAndZoom();
      applyPanelSettings(sampleSettings(sample)||defaultPanelSettings());
      state.zoom=1; state.panX=0; state.panY=0;
      el.canvas.style.transform='';
      el.canvas.hidden=false; el.emptyState.hidden=true;
      el.canvasTitle.textContent=state.imageName.split('/').pop()||state.imageName;
      el.adjustCrop.disabled=false; el.resetCrop.disabled=false; el.applyCrop.disabled=true;
      el.rotateImage.disabled=false; el.deskewMinus.disabled=false; el.deskewPlus.disabled=false;
      updateGroupNavButtons();
      if(effectiveRotationDeg()||(Number(el.deskewAngle.value)||0)) applyImageTransform({restoreManual:true});
      else runSegmentation({restoreManual:true});
    };
    img.onerror=()=>{ setSpinner(false); setLog('<strong>Image load failed.</strong> Run a local HTTP server from the repo root (e.g. <code>python -m http.server</code>) to serve the wound healing archive.'); };
    img.src=src;
  }

  function makeCustomSample(file, index, groupId, groupLabel) {
    const url=URL.createObjectURL(file);
    state.objectUrls.push(url);
    const stem=file.name.replace(/\.[^.]+$/,'');
    const timeMatch=customFileTimeMatch(stem);
    const time=timeMatch?`${Number(timeMatch[1])}h`:`${index+1}`;
    return {
      id:`${groupId}-${index}`,
      imageId:`local-${index+1}`,
      path:file.name,
      url,
      cell:'Local',
      condition:groupLabel,
      time,
      area:null,
      areaPct:null,
      width:null,
      closure:null,
      confidence:'local-review',
      custom:true
    };
  }

  function suggestedCustomGroupName(files) {
    const stems=files.map(f=>f.name.replace(/\.[^.]+$/,'').replace(/\b(?:t?\d+\s*h?|0h|24h|48h)\b/ig,'').replace(/[_\-\s]+$/,'').trim()).filter(Boolean);
    if(!stems.length) return `Local group ${state.customGroups.length+1}`;
    let prefix=stems[0];
    for(const stem of stems.slice(1)) {
      let i=0;
      while(i<prefix.length&&i<stem.length&&prefix[i].toLowerCase()===stem[i].toLowerCase()) i++;
      prefix=prefix.slice(0,i).replace(/[_\-\s]+$/,'').trim();
      if(prefix.length<3) break;
    }
    return prefix.length>=3?prefix:`Local group ${state.customGroups.length+1}`;
  }

  function askCustomGroupName(files) {
    const suggested=suggestedCustomGroupName(files);
    return new Promise(resolve=>{
      const overlay=document.createElement('div');
      overlay.className='desktop-modal-backdrop';
      overlay.innerHTML=`
        <div class="desktop-modal" role="dialog" aria-modal="true" aria-labelledby="desktopGroupNameTitle">
          <div class="desktop-modal-title" id="desktopGroupNameTitle">Group name</div>
          <div class="desktop-modal-text">Name this local image group before Cytomove opens group review.</div>
          <input class="desktop-modal-input" type="text" value="${escHtml(suggested)}" aria-label="Group name">
          <div class="desktop-modal-actions">
            <button class="btn" type="button" data-action="cancel">Use default</button>
            <button class="btn primary" type="button" data-action="confirm">Open group</button>
          </div>
        </div>`;
      const input=overlay.querySelector('input');
      const finish=value=>{
        overlay.remove();
        resolve((value||suggested).trim()||suggested);
      };
      overlay.addEventListener('click',event=>{
        const action=event.target?.dataset?.action;
        if(action==='cancel') finish(suggested);
        if(action==='confirm') finish(input.value);
        if(event.target===overlay) finish(input.value);
      });
      input.addEventListener('keydown',event=>{
        if(event.key==='Enter') finish(input.value);
        if(event.key==='Escape') finish(suggested);
      });
      document.body.appendChild(overlay);
      input.focus();
      input.select();
    });
  }

  function customFileTimeMatch(stem) {
    return stem.match(/(?:^|[_\-\s])t(\d+)(?:[_\-\s]|$)/i)
      || stem.match(/(\d+)\s*h/i)
      || stem.match(/_(\d+)$/);
  }

  function customFileSortKey(file, index) {
    const stem=file.name.replace(/\.[^.]+$/,'');
    const match=customFileTimeMatch(stem);
    return {
      time:match?Number(match[1]):Number.POSITIVE_INFINITY,
      name:file.name.toLocaleLowerCase(),
      index
    };
  }

  async function loadLocalFiles(files) {
    const picked=Array.from(files||[]);
    if(!picked.length) return;
    const tiffs=picked.filter(f=>/\.(tif|tiff)$/i.test(f.name));
    if(tiffs.length) {
      setLog(`<strong>TIFF is not browser-decodable here.</strong> Use PNG/JPEG copies for review. Converted WHAD/CAMAD PNGs are under <code>validation_ref_sets/browser_ready/whad_camad_png/</code>.`);
      return;
    }
    const images=picked
      .filter(f=>f.type.startsWith('image/')||/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f.name))
      .map((file,index)=>({file,key:customFileSortKey(file,index)}))
      .sort((a,b)=>(a.key.time-b.key.time)||a.key.name.localeCompare(b.key.name)||a.key.index-b.key.index)
      .map(item=>item.file);
    if(!images.length) {
      setLog('<strong>No supported images found.</strong> Use PNG, JPEG, BMP, GIF, or WebP files.');
      return;
    }
    if(images.length===1) {
      const singleUrl=URL.createObjectURL(images[0]);
      state.objectUrls.push(singleUrl);
      loadImage(singleUrl,null,images[0].name);
      return;
    }
    const groupLabel=await askCustomGroupName(images);
    const groupId=`custom-${Date.now()}-${state.customGroups.length+1}`;
    const samples=images.map((file,index)=>makeCustomSample(file,index,groupId,groupLabel));
    state.customSamples.push(...samples);
    state.customGroups.push({
      id:groupId,
      label:groupLabel,
      sampleIds:samples.map(s=>s.id),
      custom:true
    });
    state.calibrationReport=null;
    state.microscopeModeUserSet=false;
    state.lastAutoMicroscopeGroupKey='';
    state.contourStyleUserSet=false;
    populateGroups();
    el.groupSelect.value=groupId;
    initializeGroupPresetAndOpen(samples,groupLabel);
  }

  function handleLocalFiles(files) {
    loadLocalFiles(files).catch(err=>{
      console.error(err);
      setSpinner(false);
      setLog(`<strong>File import failed.</strong> ${err.name||'Error'}: ${escHtml(err.message||err)}`);
    });
  }

  // Events
  function bindEvents() {
    window.addEventListener('error',event=>{
      setSpinner(false);
      setLog(`<strong>Runtime error.</strong> ${escHtml(event.message||'Unknown error')}`);
    });
    window.addEventListener('unhandledrejection',event=>{
      setSpinner(false);
      const reason=event.reason||{};
      setLog(`<strong>Async error.</strong> ${escHtml(reason.message||reason||'Unknown error')}`);
    });
    if(el.desktopLinkStatus) el.desktopLinkStatus.addEventListener('click',()=>openDesktopLink('update'));
    if(el.desktopFeedback) el.desktopFeedback.addEventListener('click',()=>openDesktopLink('feedback'));
    if(el.desktopAccount) el.desktopAccount.addEventListener('click',()=>openDesktopLink('account'));
    if(el.desktopUpdate) el.desktopUpdate.addEventListener('click',()=>openDesktopLink('update'));
    if(el.trialStartAnalysis) el.trialStartAnalysis.addEventListener('click',()=>{
      window.cytomoveDesktop?.getTrialState?.().then(trial=>markTrialWelcomeSeen(trial)).catch(()=>{});
      hideTrialPanel();
    });
    if(el.trialVisitSite) el.trialVisitSite.addEventListener('click',()=>openDesktopLink('update'));
    if(el.trialExpiredVisit) el.trialExpiredVisit.addEventListener('click',()=>openDesktopLink('update'));
    if(el.trialExpiredFeedback) el.trialExpiredFeedback.addEventListener('click',()=>openDesktopLink('feedback'));
    if(el.trialCloseApp) el.trialCloseApp.addEventListener('click',()=>{
      if(window.cytomoveDesktop?.closeApp) window.cytomoveDesktop.closeApp();
      else window.close();
    });
    el.modeToggle.addEventListener('click',e=>{
      const btn=e.target.closest('[data-mode]');if(!btn)return;
      setMode(btn.dataset.mode);
    });
    el.groupSelect.addEventListener('change',()=>{
      state.microscopeModeUserSet=false;
      state.lastAutoMicroscopeGroupKey='';
      if(state.mode==='group') {
        renderGroupView();
        scheduleGroupMicroscopeAutoDetect();
      }
      updateGroupNavButtons();
    });
    el.deleteGroup.addEventListener('click',deleteSelectedGroup);
    el.groupPrev.addEventListener('click',()=>stepGroupSample(-1));
    el.groupNext.addEventListener('click',()=>stepGroupSample(1));
    el.exportGroupPng.addEventListener('click',exportGroupPngOverlays);
    el.exportPlots.addEventListener('click',exportGroupPlotsZip);
    el.showAreaPlot.addEventListener('click',()=>showGroupPlot('areaPct'));
    el.showWidthPlot.addEventListener('click',()=>showGroupPlot('width'));
    el.closePlot.addEventListener('click',closePlotPanel);
    el.plotPanel.addEventListener('click',e=>{ if(e.target===el.plotPanel) closePlotPanel(); });
    el.applySettingsGroup.addEventListener('click',()=>{
      if(state.mode==='group') renderGroupView({force:true});
      else setMode('group',{force:true});
      const ratioNote=el.applyCropRatioGroup.checked&&state.cropManual&&state.crop
        ? 'Current manual crop is copied as a relative rectangle across the group.'
        : 'Each image uses its own full image or auto FOV crop.';
      setLog(`<strong>Group settings applied:</strong> ${escHtml(currentGroupSettingsSummary())}. ${ratioNote}`);
      warnIfHorizontalScratchDetected(selectedGroupSamples());
    });
    el.autoDetectModeGroup.addEventListener('click',()=>{
      state.microscopeModeUserSet=false;
      state.lastAutoMicroscopeGroupKey='';
      autoDetectGroupMicroscopeMode();
    });
    if(el.autoCalibrateGroup) el.autoCalibrateGroup.addEventListener('click',autoCalibrateGroup);
    el.sampleSelect.addEventListener('change',updateSampleMeta);
    if(el.loadSample) el.loadSample.addEventListener('click',()=>{const s=selectedSample();loadImage(sampleUrl(s),s,s.path);});
    el.rerun.addEventListener('click',()=>{syncLabels();runSegmentation();});
    el.fileInput.addEventListener('change',e=>{handleLocalFiles(e.target.files); e.target.value='';});

    const rerunFromSegmentation=()=>{if(state.image&&!state.cropEditing)runSegmentation();};
    let _debounceTimer;
    const debouncedRerun=()=>{clearTimeout(_debounceTimer);_debounceTimer=setTimeout(rerunFromSegmentation,180);};
    const resetAutoCrop=()=>{state.crop=null;state.cropManual=false;if(state.cropEditing)drawCropEditor();else rerunFromSegmentation();};
    bindNumberPair(el.varianceRadius,el.varianceRadiusVal,debouncedRerun);
    bindNumberPair(el.thresholdOffset,el.thresholdOffsetVal,debouncedRerun);
    bindNumberPair(el.minComponent,el.minComponentVal,debouncedRerun);
    el.tinyIslandMode.addEventListener('change',rerunFromSegmentation);
    bindNumberPair(el.fovCutoff,el.fovCutoffVal,debouncedRerun);
    bindNumberPair(el.brushSize,el.brushSizeVal,()=>syncLabels());
    el.brushMode.addEventListener('click',e=>{
      const btn=e.target.closest('[data-brush-mode]'); if(!btn) return;
      state.brushMode=btn.dataset.brushMode;
      syncLabels();
    });
    el.undoBrush.addEventListener('click',undoBrush);
    el.resetBrush.addEventListener('click',()=>{
      if(!state.autoMaskData||!state.maskData) return;
      pushBrushHistory();
      state.maskData=new Uint8Array(state.autoMaskData);
      resetBrushStats(false);
      updateResultFromMask();
      el.undoBrush.disabled=state.brushHistory.length===0;
      syncLabels();
    });
    window.addEventListener('keydown',e=>{
      const editable=e.target&&['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName);
      if(editable) return;
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z') {
        if(state.brushHistory.length) {
          e.preventDefault();
          undoBrush();
        }
      }
    });
    el.microscopeMode.querySelectorAll('[data-fov-mode]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const next=btn.dataset.fovMode||'full';
        if(next===el.fovMode.value) return;
        setMicroscopeMode(next,true);
        rerunFromSegmentation();
      });
    });
    bindNumberPair(el.deskewAngle,el.deskewAngleVal,deskewCurrentImage);
    el.angleRulerToggle.addEventListener('click',()=>{
      state.rulerVisible=!state.rulerVisible;
      syncLabels();
      redrawCurrentCanvas();
    });
    el.scratchOrientation.addEventListener('change',()=>{
      showOrientationHint('');
      renderOrientationSeriesWarning('');
      if(state.imageOriginal&&!state.cropEditing) applyImageTransform();
      warnIfHorizontalScratchDetected(selectedGroupSamples());
    });
    el.autoCropFov.addEventListener('change',resetAutoCrop);
    el.adjustCrop.addEventListener('click',enterCropEdit);
    el.applyCrop.addEventListener('click',()=>leaveCropEdit(true));
    el.resetCrop.addEventListener('click',resetAutoCrop);
    bindNumberPair(el.contourThickness,el.contourThicknessVal,()=>{
      redrawCurrentCanvas();
    });
    [el.contourColor,el.contourStyle].forEach(inp=>{
      inp.addEventListener('input',()=>{
        state.contourStyleUserSet=true;
        redrawCurrentCanvas();
      });
      inp.addEventListener('change',()=>{
        state.contourStyleUserSet=true;
        redrawCurrentCanvas();
      });
    });

    el.viewToggle.addEventListener('click',e=>{
      const btn=e.target.closest('.view-btn');if(!btn)return;
      state.view=btn.dataset.view;
      el.viewToggle.querySelectorAll('.view-btn').forEach(b=>b.classList.toggle('active',b===btn));
      redrawCurrentCanvas();
    });

    document.querySelectorAll('.preset-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const p=PRESETS[btn.dataset.preset];if(!p)return;
        el.varianceRadius.value=p.varianceRadius;
        setThresholdMode(p.thresholdMode||'small',p.thresholdValue??p.thresholdLevel);
        el.minComponent.value=p.minComponent; el.fovCutoff.value=p.fovCutoff;
        if(p.tinyIslandMode) el.tinyIslandMode.value=p.tinyIslandMode;
        if(p.fovMode) setMicroscopeMode(p.fovMode,true);
        const orientationChanged=p.scratchOrientation&&el.scratchOrientation.value!==p.scratchOrientation;
        if(p.scratchOrientation) el.scratchOrientation.value=p.scratchOrientation;
        syncLabels();
        document.querySelectorAll('.preset-btn').forEach(b=>b.classList.toggle('active',b===btn));
        if(state.image) {
          if(orientationChanged&&state.imageOriginal&&!state.cropEditing) applyImageTransform();
          else runSegmentation();
        }
      });
    });

    el.exportPng.addEventListener('click',exportPng);
    el.exportCsv.addEventListener('click',exportCsv);
    el.exportExcel.addEventListener('click',exportExcel);

    el.zoomIn.addEventListener('click',()=>changeZoom(1.35));
    el.zoomOut.addEventListener('click',()=>changeZoom(1/1.35));
    el.zoomReset.addEventListener('click',()=>{state.zoom=1;state.panX=0;state.panY=0;el.canvas.style.transform='';el.zoomBadge.classList.remove('visible');});
    el.deskewMinus.addEventListener('click',()=>nudgeDeskew(-0.5));
    el.deskewPlus.addEventListener('click',()=>nudgeDeskew(0.5));
    el.rotateImage.addEventListener('click',rotateCurrentImage);

    el.dropZone.addEventListener('wheel',e=>{
      if(!state.image)return;
      e.preventDefault();
      if(state.cropEditing){
        const crop=currentCrop();
        const pt=canvasPoint(e);
        const oldW=crop.w, oldH=crop.h;
        const factor=e.deltaY<0?1.06:1/1.06;
        crop.w=Math.round(crop.w*factor);
        crop.h=Math.round(crop.h*factor);
        crop.x=pt.x-(pt.x-crop.x)*(crop.w/oldW);
        crop.y=pt.y-(pt.y-crop.y)*(crop.h/oldH);
        clampCrop(crop);
        state.cropManual=true;
        drawCropEditor();
      } else {
        changeZoom(e.deltaY<0?1.1:1/1.1);
      }
    },{passive:false});

    el.canvas.addEventListener('mousedown',e=>{
      if(state.cropEditing){
        const pt=canvasPoint(e), crop=currentCrop();
        const mode=cropHitMode(pt,crop);
        if(mode){
          state.cropDragging=true;
          state.cropDragMode=mode;
          state.cropDragStart={x:pt.x,y:pt.y,crop:{...crop}};
        }
        return;
      }
      const pt=canvasPoint(e);
      if(brushActive()) {
        state.correctionSelecting=true;
        state.correctionStart=pt;
        state.correctionRect=normalizeCorrectionRect(pt,pt);
        redrawCurrentCanvas();
        e.preventDefault();
        return;
      }
      if(rulerHitTest(pt,el.canvas.width,el.canvas.height)) {
        state.rulerDragging=true;
        state.rulerDragStart={x:pt.x,y:pt.y,offsetX:state.rulerOffsetX||0,offsetY:state.rulerOffsetY||0};
        el.canvas.classList.add('grabbing');
        el.canvas.style.cursor='grabbing';
        e.preventDefault();
        return;
      }
      if(state.zoom<=1)return;state.panning=true;state.panStart={x:e.clientX-state.panX,y:e.clientY-state.panY};el.canvas.classList.add('grabbing');
    });
    window.addEventListener('mousemove',e=>{
      if(state.cropEditing&&state.cropDragging){
        const pt=canvasPoint(e), crop=currentCrop();
        const start=state.cropDragStart;
        if(state.cropDragMode==='move') {
          crop.x=start.crop.x+(pt.x-start.x);
          crop.y=start.crop.y+(pt.y-start.y);
        } else {
          crop.x=start.crop.x;
          crop.y=start.crop.y;
          crop.w=start.crop.w;
          crop.h=start.crop.h;
          if(state.cropDragMode==='right'||state.cropDragMode==='corner') crop.w=start.crop.w+(pt.x-start.x);
          if(state.cropDragMode==='bottom'||state.cropDragMode==='corner') crop.h=start.crop.h+(pt.y-start.y);
        }
        clampCrop(crop);
        state.cropManual=true;
        drawCropEditor();
        return;
      }
      if(state.rulerDragging) {
        const pt=canvasPoint(e), start=state.rulerDragStart;
        state.rulerOffsetX=start.offsetX+(pt.x-start.x);
        state.rulerOffsetY=start.offsetY+(pt.y-start.y);
        redrawCurrentCanvas();
        return;
      }
      if(state.correctionSelecting) {
        state.correctionRect=normalizeCorrectionRect(state.correctionStart,canvasPoint(e));
        redrawCurrentCanvas();
        return;
      }
      if(!state.panning)return;state.panX=e.clientX-state.panStart.x;state.panY=e.clientY-state.panStart.y;applyZoom();
    });
    window.addEventListener('mouseup',()=>{
      if(state.correctionSelecting) {
        const rect=state.correctionRect;
        const snap=brushSnapshot();
        state.correctionSelecting=false;state.correctionStart=null;state.correctionRect=null;
        if(rect&&snap&&applyCorrectionScanRect(rect)) pushBrushHistory(snap);
        else redrawCurrentCanvas();
      }
      state.cropDragging=false;state.cropDragMode='move';state.rulerDragging=false;state.rulerDragStart=null;state.brushDrawing=false;state.panning=false;
      if(!state.cropEditing) {
        el.canvas.classList.remove('grabbing');
        el.canvas.style.cursor=brushActive()?'crosshair':state.rulerVisible?'grab':'';
      }
    });

    el.dropZone.addEventListener('dragover',e=>{e.preventDefault();el.dropZone.classList.add('dragging');});
    el.dropZone.addEventListener('dragleave',()=>el.dropZone.classList.remove('dragging'));
    el.dropZone.addEventListener('drop',e=>{
      e.preventDefault();el.dropZone.classList.remove('dragging');
      handleLocalFiles(e.dataTransfer.files);
    });
  }

  // Init
  populateGroups();
  populateSamples();
  applyAutoContourStyle(true);
  syncLabels();
  setupSidebarPanels();
  bindEvents();
  setupDelayedTooltips();
  loadDesktopManifest();
  initTrialGate();
  if(isFileProtocol()) setLog('<strong>Desktop Alpha:</strong> use Open/drag-drop for local images. Analysis runs on this computer.');

