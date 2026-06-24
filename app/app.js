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

  const TUTORIALS = {
    'huvec-full': {
      id:'tutorial-huvec-full',
      label:'Full HUVEC validation tutorial',
      validationSetId:'full_thread_control',
      preAnalyzeValidationSet:false,
      completeBody:'You loaded the bundled 18 images from the HUVEC Control vs FDI validation set, reviewed Image QC, analyzed the groups, and opened Publication Figure Builder. Continue in Playground to adjust the figure, export the 600 DPI package, or inspect full-size contour overlays.',
      steps:[
        {
          key:'crop-adjust',
          selector:'#qcAdjustCrop',
          label:'Adjust crop',
          title:'Start from the loaded HUVEC validation set',
          body:'Cytomove loads 18 images: three Control replicates and three FDI replicates, each with 0h, 24h, and 48h time points. First, open crop adjustment on the representative 0h image.'
        },
        {
          key:'crop-rectangle-1',
          selector:'#imageQcPanel .qc-preview',
          label:'Review rectangle',
          title:'Adjust the crop rectangle',
          body:'Move or resize the rectangle so the wound field is centered and the dark microscope border is mostly outside the analysis area. Save only after the rectangle looks right.',
          mouseHint:'Drag the crop rectangle or its handles, then continue to Save crop.'
        },
        {
          key:'crop-save',
          selector:'#qcSaveCrop',
          label:'Save crop',
          title:'Save the first reviewed crop',
          body:'Review the crop rectangle around the wound field, then save it. The next unsaved image will start from this crop position, which makes group review faster.'
        },
        {
          key:'crop-rectangle-2',
          selector:'#imageQcPanel .qc-preview',
          label:'Check rectangle',
          title:'Check the next image crop',
          body:'The next time point opens with the same crop position. If the square area is outside the field or off-center, please drag it back to the center before saving.',
          mouseHint:'Kare alan dışarıda ya da kaymış görünüyorsa lütfen merkeze ayarlayın, sonra bu resmi kaydedin.'
        },
        {
          key:'crop-save-2',
          selector:'#qcSaveCrop',
          label:'Save crop',
          title:'Save the second crop',
          body:'Save this crop after checking that the wound field still sits inside the rectangle.'
        },
        {
          key:'crop-rectangle-3',
          selector:'#imageQcPanel .qc-preview',
          label:'Check rectangle',
          title:'Check the third image crop',
          body:'Repeat the same QC habit for the third time point. Kare alan mikroskop alanı dışında kalmışsa lütfen merkeze ayarlayın, sonra kaydedin.',
          mouseHint:'Confirm that the rectangle is centered on the wound field, then save the third image.'
        },
        {
          key:'crop-save-3',
          selector:'#qcSaveCrop',
          label:'Save crop',
          title:'Save the third crop',
          body:'Save the third reviewed crop. After three checked images, continue into Analysis with the QC-prepared inputs.'
        },
        {
          key:'qc-review',
          selector:'#goToAnalysisFromQc',
          label:'Continue to Analysis',
          title:'Continue with the QC-prepared image',
          body:'Now continue to Analysis. Cytomove will use the QC-prepared image state rather than returning to the uncropped original.'
        },
        {
          key:'preset-brightfield-normal',
          selector:'button[data-preset="rough"]',
          label:'Brightfield normal cells',
          title:'Choose the normal brightfield preset',
          body:'For this tutorial, start with the broader Brightfield normal cells preset before drawing the first contour.'
        },
        {
          key:'apply-before-radius',
          selector:'#rerun',
          label:'Apply',
          title:'Draw the first contour',
          body:'Click Apply once with the preset settings so you can see the initial contour before tuning the radius.'
        },
        {
          key:'variance-radius',
          selector:'#varianceRadius',
          label:'Variance radius',
          title:'Basic analysis tuning',
          body:'Move Variance radius slightly to the right. A modest radius increase smooths local texture before the wound contour is calculated.',
          action:'set-value',
          value:'8',
          minValue:4,
          event:'input',
          mouseHint:'Drag the Variance radius slider slightly to the right, or use this guided action to set it to 8.'
        },
        {
          key:'apply-first',
          selector:'#rerun',
          label:'Apply',
          title:'Analyze the first validation image',
          body:'Run Apply again after the radius adjustment and inspect how the calculated contour responds.'
        },
        {
          key:'apply-group',
          selector:'#applySettingsGroup',
          label:'Apply to group',
          title:'Apply the tuned settings to the group',
          body:'When the first contour looks acceptable, use Apply to group. Cytomove applies the same analysis settings to every image in the current group while preserving each image’s QC crop.'
        },
        {
          key:'builder',
          selector:'button[data-module="builder"]',
          label:'Publication Figure Builder',
          title:'Build the Control vs FDI figure',
          body:'Open the Builder after the validation groups are analyzed. The Builder uses stored Analysis contours. Continue in Playground to run Analyze missing groups if needed, adjust the figure, or export the 600 DPI package.'
        }
      ]
    },
    'publication-quality': {
      id:'tutorial-publication-quality',
      label:'Publication quality figure tutorial',
      validationSetId:'full_thread_control',
      finalModule:'builder',
      completeBody:'You loaded the 3 Control and 3 FDI replicate groups from the bundled HUVEC validation set, reviewed Builder controls, refreshed the publication figure, and reached the 600 DPI PNG/TIFF export step. Continue in Playground to fine-tune panel layout, typography, and full-size contour overlays.',
      steps:[
        {
          key:'builder-control-representative',
          selector:'#builderControlGroup',
          label:'Control representative',
          title:'Choose the Control representative',
          body:'The tutorial has already loaded and analyzed 3 Control and 3 FDI replicate groups. Use this menu to choose which Control group appears in Panel A.'
        },
        {
          key:'builder-control-replicates',
          selector:'#builderControlReplicates',
          label:'Control replicates',
          title:'Review Control replicates',
          body:'All three Control replicates are selected for the summary plots. Keep them checked when you want n=3 statistics in the publication figure.'
        },
        {
          key:'builder-treatment-replicates',
          selector:'#builderTreatmentReplicates',
          label:'Treatment replicates',
          title:'Review FDI replicates',
          body:'All three FDI replicates are selected so the bars and lines summarize the treatment condition with n=3.'
        },
        {
          key:'builder-metric',
          selector:'#builderMetricSelect',
          label:'Panel C metric',
          title:'Choose the normalized metric',
          body:'Choose whether Panel C shows normalized wound area or normalized width. Normalized wound area is the default publication metric.'
        },
        {
          key:'builder-selected-panel',
          selector:'#builderSelectedPanel',
          label:'Selected panel',
          title:'Select a panel to edit',
          body:'Choose A, B, or C before editing a panel title, typography, or drag-adjusted layout.'
        },
        {
          key:'builder-panel-title',
          selector:'#builderPanelTitle',
          label:'Scientific title',
          title:'Edit a scientific panel title',
          body:'Use concise scientific panel titles. The Builder keeps the panel letter separate, so the editable title can stay clean and publication-style.',
          action:'set-value',
          value:'Representative wound-edge morphology',
          event:'input'
        },
        {
          key:'builder-update',
          selector:'#refreshBuilderFigure',
          label:'Update Figure',
          title:'Refresh the publication preview',
          body:'After changing Builder controls, click Update Figure to redraw the colored contour preview and chart panels.'
        },
        {
          key:'builder-export',
          selector:'#exportBuilderFigure',
          label:'Export Builder ZIP',
          title:'Export the publication package',
          body:'Export the 600 DPI PNG/TIFF figure package with figure data, caption draft, and full-size contour overlays for manual figure assembly.'
        }
      ]
    },
    m8f: {
      id:'tutorial-m8f',
      label:'M8F 1.0 quick-start tutorial',
      cell:'MDA-MB-231',
      condition:'M8F example',
      baseUrl:'../assets/tutorial/m8f/',
      samples:[
        { file:'m8f_0h_001.png', time:'0h' },
        { file:'m8f_24h_002.png', time:'24h' },
        { file:'m8f_48h_003.png', time:'48h' }
      ],
      settings:{ presetKey:'standard', scratchOrientation:'vertical' },
      completeBody:'You reviewed Image QC, locked the prepared images for Analysis, analyzed the first image, reviewed group measurements, opened the Publication Figure Builder, and learned why publication figures need analyzed control and treatment groups.',
      steps:[
        {
          key:'qc-review',
          selector:'#goToAnalysisFromQc',
          label:'Continue to Analysis',
          title:'Lock Image QC and continue',
          body:'Start in Image QC. Confirm the loaded time-series looks right, then continue so Cytomove locks the QC snapshot that Analysis will use.'
        },
        {
          key:'apply-first',
          selector:'#rerun',
          label:'Apply',
          title:'Analyze the first prepared image',
          body:'In Analysis, click Apply to calculate the wound boundary and overlay for the current image. The result comes from the QC-prepared input, not the uncropped original.'
        },
        {
          key:'next-image',
          selector:'#groupNext',
          label:'Next image',
          title:'Review the next time point',
          body:'Move through the group and check that each restored image and contour is consistent before interpreting the time course.'
        },
        {
          key:'show-area',
          selector:'#showAreaPlot',
          label:'Area plot',
          title:'Review the wound area trend',
          body:'Open the plot to confirm that the measurements behave as expected across 0h, 24h, and 48h.'
        },
        {
          key:'close-plot',
          selector:'#closePlot',
          label:'Close plot',
          title:'Return to the image workspace',
          body:'Close the plot panel when you are ready to move from measurement review toward publication figure preparation.'
        },
        {
          key:'mask-view',
          selector:'button[data-view="mask"]',
          label:'Mask',
          title:'Check the measurement mask',
          body:'Return to mask view any time you want to verify the pixels that contributed to wound area before exporting figures or data.'
        },
        {
          key:'open-builder',
          selector:'button[data-module="builder"]',
          label:'Publication Figure Builder',
          title:'Open the Publication Figure Builder',
          body:'The Builder turns analyzed groups into publication-ready panels. A complete comparative figure needs analyzed control and treatment groups, so use this quick start as orientation before loading a full comparison set.'
        }
      ]
    },
    mcf7: {
      id:'tutorial-mcf7',
      label:'WHAD-MCF7 phase-contrast tutorial',
      cell:'MCF-7',
      condition:'WHAD/CAMAD example',
      baseUrl:'../assets/tutorial/mcf7/',
      samples:[
        { file:'whad_mcf7_001.png', time:'1h' },
        { file:'whad_mcf7_021.png', time:'21h' },
        { file:'whad_mcf7_046.png', time:'46h' }
      ],
      settings:{ presetKey:'fine', scratchOrientation:'vertical' },
      completeBody:'You selected the phase-contrast preset, analyzed the first image, applied settings to the WHAD-MCF7 group, reviewed the area plot, navigated the series, and inspected the mask.',
      steps:[
        {
          key:'preset-phase',
          selector:'button[data-preset="fine"]',
          label:'Phase contrast',
          title:'Select the phase-contrast preset',
          body:'This WHAD-MCF7 example uses phase-contrast microscopy. Start with the Phase contrast preset before running the first segmentation.'
        },
        {
          key:'apply-first',
          selector:'#rerun',
          label:'Apply',
          title:'Analyze the first MCF7 image',
          body:'Click Apply to draw the first contour overlay and check that the wound boundary is visible before running the group.'
        },
        {
          key:'apply-group',
          selector:'#applySettingsGroup',
          label:'Apply to group',
          title:'Run the same settings on all MCF7 images',
          body:'Apply the current phase-contrast settings to the early, mid, and near-closure frames.'
        },
        {
          key:'show-area',
          selector:'#showAreaPlot',
          label:'Area plot',
          title:'Review the near-closure trend',
          body:'Open the area plot to see how the wound area changes across the three WHAD-MCF7 time points.'
        },
        {
          key:'close-plot',
          selector:'#closePlot',
          label:'Close plot',
          title:'Close the plot panel',
          body:'Close the plot so you can inspect individual overlays and masks again.'
        },
        {
          key:'next-image',
          selector:'#groupNext',
          label:'Next image',
          title:'Inspect the next MCF7 time point',
          body:'Move through the series and check whether the restored contour still follows the wound boundary.'
        },
        {
          key:'mask-view',
          selector:'button[data-view="mask"]',
          label:'Mask',
          title:'Check the binary mask',
          body:'Switch to Mask view to inspect the exact region counted as wound area in this phase-contrast example.'
        }
      ]
    },
    manual: {
      id:'tutorial-manual',
      label:'Manual correction tutorial',
      cell:'MDA-MB-231',
      condition:'M8F correction example',
      baseUrl:'../assets/tutorial/manual/',
      samples:[
        { file:'m8f_48h_003.png', time:'48h' }
      ],
      startModule:'qc',
      settings:{ presetKey:'rough', scratchOrientation:'vertical' },
      completeBody:'You rotated the horizontal-looking example into a vertical scratch workflow, created an automatic contour, practiced local Fill and Erase edits, then tested Undo and Reset correction. Continue in Playground to repeat the edit safely or compare automatic and corrected results.',
      steps:[
        {
          key:'rotate-to-vertical',
          selector:'#qcRotateLeft',
          label:'Rotate left',
          title:'Make the scratch vertical first',
          body:'This correction example starts in Image QC. Rotate the horizontal-looking wound field so the scratch becomes vertical before analysis and manual correction.'
        },
        {
          key:'qc-to-analysis',
          selector:'#goToAnalysisFromQc',
          label:'Continue to Analysis',
          title:'Continue with the vertical scratch',
          body:'After the image is oriented vertically, continue to Analysis. Manual correction is easier when the contour is reviewed on the same visible image.'
        },
        {
          key:'preset-rough',
          selector:'button[data-preset="rough"]',
          label:'Brightfield normal cells',
          title:'Start with the brightfield preset',
          body:'Use the normal-cell brightfield preset as the automatic baseline before editing the contour.'
        },
        {
          key:'apply-first',
          selector:'#rerun',
          label:'Apply',
          title:'Create the automatic contour',
          body:'Run the first segmentation so the manual correction tools have a contour to edit while the image remains visible.'
        },
        {
          key:'tiny-islands-trace',
          selector:'#tinyIslandMode',
          label:'Ignore tiny islands: Trace',
          title:'Use Trace cleanup before manual editing',
          body:'Set Ignore tiny islands to Trace before manual correction. This keeps cleanup conservative so you only edit the regions that still need human review.',
          action:'set-value',
          value:'trace',
          event:'change',
          mouseHint:'Choose Trace from Ignore tiny islands, then continue to Fill area.'
        },
        {
          key:'fill-mode',
          selector:'button[data-brush-mode="fill"]',
          label:'Fill area',
          title:'Select Fill area',
          body:'Fill area directly marks a selected rectangle as wound area. Use it when an obvious gap is missing from the mask.'
        },
        {
          key:'draw-fill',
          selector:'#canvas',
          label:'Draw rectangle',
          title:'Drag a small rectangle on the image',
          body:'Drag across a small part of the wound gap. The tutorial continues only after Cytomove applies a manual correction.',
          mouseHint:'Mouse: press inside the wound gap, drag a small rectangle, then release.',
          expectedMode:'fill',
          event:'cytomove:manual-correction'
        },
        {
          key:'undo',
          selector:'#undoBrush',
          label:'Undo',
          title:'Undo the first practice edit',
          body:'Undo restores the previous mask state. Use it immediately after a local edit when the selected rectangle was not quite right.'
        },
        {
          key:'fill-mode-again',
          selector:'button[data-brush-mode="fill"]',
          label:'Fill area again',
          title:'Create an edit to reset later',
          body:'Select Fill area again and make one intentional local edit. This leaves a visible manual correction that Reset correction can remove at the end.'
        },
        {
          key:'draw-fill-again',
          selector:'#canvas',
          label:'Draw fill rectangle',
          title:'Draw a second fill rectangle',
          body:'Draw another compact rectangle in the wound gap so there is an active manual correction to compare and reset later.',
          mouseHint:'Mouse: press inside the wound gap, drag a small rectangle, then release.',
          expectedMode:'fill',
          event:'cytomove:manual-correction'
        },
        {
          key:'erase-mode',
          selector:'button[data-brush-mode="erase"]',
          label:'Erase scan',
          title:'Select Erase scan',
          body:'Erase scan removes mask pixels inside a selected rectangle. Use it when cells or debris were counted as wound area.'
        },
        {
          key:'draw-erase',
          selector:'#canvas',
          label:'Draw erase rectangle',
          title:'Drag a second rectangle',
          body:'Drag across an already-filled part of the mask to practice removing a local false-positive region.',
          mouseHint:'Mouse: press on a filled mask region, drag a compact rectangle, then release.',
          expectedMode:'erase',
          event:'cytomove:manual-correction'
        },
        {
          key:'reset',
          selector:'#resetBrush',
          label:'Reset correction',
          title:'Reset manual correction',
          body:'Reset correction removes manual edits and returns the image to the automatic mask.'
        }
      ]
    },
    'manual-hard': {
      id:'tutorial-manual-hard',
      label:'Advanced hard-case correction',
      cell:'MCF-7',
      condition:'WHAD-MCF7 fragmented near-closure example',
      baseUrl:'../assets/tutorial/manual-hard/',
      samples:[
        { file:'whad_mcf7_026.png', time:'26h' }
      ],
      settings:{ presetKey:'fine', scratchOrientation:'vertical' },
      completeBody:'You reviewed a fragmented near-closure phase-contrast example, used manual cleanup tools, applied local rectangle edits, tested undo/reset, and returned to a controlled mask state.',
      steps:[
        {
          key:'preset-phase',
          selector:'button[data-preset="fine"]',
          label:'Phase contrast',
          title:'Start with the phase-contrast preset',
          body:'This near-closure WHAD-MCF7 example is fragmented and speckled. Use the Phase contrast preset as a clear starting point before manual cleanup.'
        },
        {
          key:'apply-first',
          selector:'#rerun',
          label:'Apply',
          title:'Create the automatic mask',
          body:'Run the first segmentation so you can inspect where the automatic mask fragments or overreaches.'
        },
        {
          key:'add-mode',
          selector:'button[data-brush-mode="add"]',
          label:'Add scan',
          title:'Start with Add scan',
          body:'Add scan is the safest first manual correction here because it rescans a local region instead of blindly filling or deleting mask pixels.'
        },
        {
          key:'draw-add',
          selector:'#canvas',
          label:'Draw add rectangle',
          title:'Drag an Add scan rectangle',
          body:'Drag over a partly missed wound edge so Cytomove recalculates that hard local region before you try stronger edits.',
          mouseHint:'Mouse: press near the missed wound edge, drag a small rectangle, then release.',
          expectedMode:'add',
          event:'cytomove:manual-correction'
        },
        {
          key:'fill-mode',
          selector:'button[data-brush-mode="fill"]',
          label:'Fill area',
          title:'Try Fill area last',
          body:'Fill area is the most direct edit. Reserve it for obvious wound gaps where the mask should definitely be filled.'
        },
        {
          key:'draw-fill',
          selector:'#canvas',
          label:'Draw fill rectangle',
          title:'Drag a Fill area rectangle',
          body:'Drag inside an obvious wound gap so the tutorial records one deliberate fill edit before undo/reset.',
          mouseHint:'Mouse: press inside the obvious gap, drag a small rectangle, then release.',
          expectedMode:'fill',
          event:'cytomove:manual-correction'
        },
        {
          key:'erase-mode',
          selector:'button[data-brush-mode="erase"]',
          label:'Erase scan',
          title:'Select Erase scan',
          body:'Erase scan is useful after fill/add when a local cell cluster or artifact is clearly not wound area but was included in the mask.'
        },
        {
          key:'draw-erase',
          selector:'#canvas',
          label:'Draw erase rectangle',
          title:'Drag over a false-positive area',
          body:'Drag over a local false-positive mask region. If nothing changes, choose a nearby filled region and try again.',
          mouseHint:'Mouse: press on a false-positive filled area, drag a small rectangle, then release.',
          expectedMode:'erase',
          event:'cytomove:manual-correction'
        },
        {
          key:'clean-mode',
          selector:'button[data-brush-mode="clean"]',
          label:'Clean specks',
          title:'Finish with Clean specks',
          body:'Clean specks is a final cleanup pass for tiny fragments left after the larger local corrections.'
        },
        {
          key:'draw-clean',
          selector:'#canvas',
          label:'Draw cleanup rectangle',
          title:'Drag a final cleanup rectangle',
          body:'Drag over a small speckled region. If there are no tiny fragments there, the tutorial still records that you tried the cleanup tool.',
          mouseHint:'Mouse: press on a speckled mask area, drag a small rectangle, then release.',
          expectedMode:'clean',
          event:'cytomove:manual-correction'
        },
        {
          key:'undo',
          selector:'#undoBrush',
          label:'Undo',
          title:'Undo the last hard-case edit',
          body:'Undo lets you test aggressive corrections without committing to them.'
        },
        {
          key:'reset',
          selector:'#resetBrush',
          label:'Reset correction',
          title:'Reset the manual changes',
          body:'Reset returns the hard example to the automatic mask so you can compare edited and unedited states.'
        }
      ]
    }
  };

  const CYTOMOVE_ALGORITHM_VERSION = 'cytomove-whst-variance-v1.0';
  const SHOW_DEMO_CALIBRATION = false;
  const AUTO_APPLY_DELAY_MS = 1000;

  function validationToolsEnabled(locationLike) {
    const host=String(locationLike?.hostname||'').toLowerCase();
    const search=String(locationLike?.search||'');
    return locationLike?.protocol==='file:'||host==='localhost'||host==='127.0.0.1'||new URLSearchParams(search).get('validation')==='1';
  }

  function syncValidationToolsVisibility() {
    const host=document.getElementById('builderValidationTools');
    if(host) host.hidden=!validationToolsEnabled(window.location);
  }

  const VALIDATION_SETS = {
    full_thread_control: {
      label:'HUVEC control vs FDI (3 replicates)',
      cellType:'HUVEC',
      controlLabel:'Control',
      treatmentLabel:'FDI',
      groups:[
        { label:'huvec_control_r1', condition:'control', replicate:'R1', files:['../validation_sets/full_thread_control/huvec_control_r1/0.jpg','../validation_sets/full_thread_control/huvec_control_r1/24.jpg','../validation_sets/full_thread_control/huvec_control_r1/48.jpg'] },
        { label:'huvec_control_r2', condition:'control', replicate:'R2', files:['../validation_sets/full_thread_control/huvec_control_r2/0.jpg','../validation_sets/full_thread_control/huvec_control_r2/24.jpg','../validation_sets/full_thread_control/huvec_control_r2/48.jpg'] },
        { label:'huvec_control_r3', condition:'control', replicate:'R3', files:['../validation_sets/full_thread_control/huvec_control_r3/0.jpg','../validation_sets/full_thread_control/huvec_control_r3/24.jpg','../validation_sets/full_thread_control/huvec_control_r3/48.jpg'] },
        { label:'huvec_fdi_r1', condition:'treatment', replicate:'R1', files:['../validation_sets/full_thread_control/huvec_fdi_r1/0.jpg','../validation_sets/full_thread_control/huvec_fdi_r1/24.jpg','../validation_sets/full_thread_control/huvec_fdi_r1/48.jpg'] },
        { label:'huvec_fdi_r2', condition:'treatment', replicate:'R2', files:['../validation_sets/full_thread_control/huvec_fdi_r2/0.jpg','../validation_sets/full_thread_control/huvec_fdi_r2/24.jpg','../validation_sets/full_thread_control/huvec_fdi_r2/48.jpg'] },
        { label:'huvec_fdi_r3', condition:'treatment', replicate:'R3', files:['../validation_sets/full_thread_control/huvec_fdi_r3/0.jpg','../validation_sets/full_thread_control/huvec_fdi_r3/24.jpg','../validation_sets/full_thread_control/huvec_fdi_r3/48.jpg'] }
      ]
    }
  };

  const state = {
    appModule:'qc',
    pendingPublicationExport:'group',
    mode:'single',
    image:null, imageOriginal:null, imageName:'', sample:null, rotation:0,
    view:'overlay', result:null, rulerVisible:false,
    groupResults:{},
    manualOverrides:{},
    sampleSettings:{},
    customSamples:[],
    customGroups:[],
    imageQcState:{},
    lockedQcSnapshot:null,
    lastQcCropTemplateByGroup:{},
    lastQcCropTemplate:null,
    preparedQcImages:new Map(),
    qcCropOperationIds:new Map(),
    qcPendingOperations:new Set(),
    qcTransitionPending:false,
    imageIsPreparedQc:false,
    publicationBuilderState:{},
    builderPreviewStyle:'color',
    builderPreviewDirty:false,
    builderSelectedPanel:'A',
    builderPanelDrag:null,
    objectUrls:[],
    qcPreviewBaseCanvas:null,
    qcPreviewBaseImage:null,
    qcDrawFrame:0,
    qcOverlayDrag:null,
    cropCache:new Map(), // Cache cropped images for performance
    qcCropCache:new Map(), // QC crop cache - stores cropped images from QC stage
    qcCropHistoryBySample:{}, // Per-sample undo/redo history for QC crops
    calibrationReport:null,
    groupRenderSeq:0,
    autoMicroscopeDetectSeq:0,
    autoMicroscopeDetectTimer:null,
    autoMicroscopeDetectPending:false,
    microscopeModeUserSet:false,
    lastAutoMicroscopeGroupKey:'',
    contourStyleUserSet:false,
    tutorial:null,
    tutorialAdvancePending:false,
    tutorialAdvancePendingStep:null,
    imageLoadSeq:0,
    validationLoadActive:false,
    varMap:null, maskData:null, autoMaskData:null, fieldData:null, sourceData:null, grayData:null, darkGuideThreshold:0,
    brushMode:'off', brushDrawing:false, brushEdited:false, brushAddedPx:0, brushRemovedPx:0,
    correctionSelecting:false, correctionStart:null, correctionRect:null,
    brushHistory:[],
    crop:null, cropManual:false, cropEditing:false, cropDragging:false, cropDragStart:null, cropDragMode:'move',
    analysisGeometry:{orientation:'vertical',fineRotation:0},
    rulerOffsetX:0, rulerOffsetY:0, rulerDragging:false, rulerDragStart:null,
    zoom:1, panX:0, panY:0, panning:false, panStart:null,
    autoApplyTimer:null
  };

  const el = {
    moduleTabs:         document.getElementById('moduleTabs'),
    publicationBuilderControls: document.getElementById('publicationBuilderControls'),
    publicationBuilderPanel: document.getElementById('publicationBuilderPanel'),
    builderControlGroup: document.getElementById('builderControlGroup'),
    builderTreatmentGroup: document.getElementById('builderTreatmentGroup'),
    builderControlReplicates: document.getElementById('builderControlReplicates'),
    builderTreatmentReplicates: document.getElementById('builderTreatmentReplicates'),
    builderTreatmentArms: document.getElementById('builderTreatmentArms'),
    addBuilderTreatmentArm: document.getElementById('addBuilderTreatmentArm'),
    builderTemplate:    document.getElementById('builderTemplate'),
    builderMetricSelect: document.getElementById('builderMetricSelect'),
    builderSelectedPanel: document.getElementById('builderSelectedPanel'),
    builderPanelTitle: document.getElementById('builderPanelTitle'),
    builderPanelFont: document.getElementById('builderPanelFont'),
    builderPanelFontSize: document.getElementById('builderPanelFontSize'),
    builderPanelFontWeight: document.getElementById('builderPanelFontWeight'),
    builderApplyTypographyAll: document.getElementById('builderApplyTypographyAll'),
    resetBuilderLayout: document.getElementById('resetBuilderLayout'),
    builderControlLabel: document.getElementById('builderControlLabel'),
    builderTreatmentLabel: document.getElementById('builderTreatmentLabel'),
    builderCellType:    document.getElementById('builderCellType'),
    builderReplicate:   document.getElementById('builderReplicate'),
    builderScaleValue:  document.getElementById('builderScaleValue'),
    builderScaleMode:   document.getElementById('builderScaleMode'),
    builderPValue:      document.getElementById('builderPValue'),
    builderStars:       document.getElementById('builderStars'),
    builderValidationSet: document.getElementById('builderValidationSet'),
    loadBuilderValidationSet: document.getElementById('loadBuilderValidationSet'),
    refreshBuilderFigure: document.getElementById('refreshBuilderFigure'),
    exportBuilderFigure: document.getElementById('exportBuilderFigure'),
    builderCanvas:      document.getElementById('builderCanvas'),
    builderCanvasStage: document.getElementById('builderCanvasStage'),
    builderPanelOverlay: document.getElementById('builderPanelOverlay'),
    builderEmpty:       document.getElementById('builderEmpty'),
    builderStatus:      document.getElementById('builderStatus'),
    builderCaptionText: document.getElementById('builderCaptionText'),
    analyzeMissingBuilderGroups: document.getElementById('analyzeMissingBuilderGroups'),
    imageQcPanel:       document.getElementById('imageQcPanel'),
    qcStatus:           document.getElementById('qcStatus'),
    qcImageList:        document.getElementById('qcImageList'),
    qcPreview:          document.querySelector('#imageQcPanel .qc-preview'),
    qcImagePosition:    document.getElementById('qcImagePosition'),
    qcAdvanceNotice:    document.getElementById('qcAdvanceNotice'),
    qcCanvas:           document.getElementById('qcCanvas'),
    qcCropOverlay:      document.getElementById('qcCropOverlay'),
    qcEmpty:            document.getElementById('qcEmpty'),
    qcOrientation:      document.getElementById('qcOrientation'),
    qcRotateLeft:       document.getElementById('qcRotateLeft'),
    qcRotateRight:      document.getElementById('qcRotateRight'),
    qcFineRotation:     document.getElementById('qcFineRotation'),
    qcFineRotationVal:  document.getElementById('qcFineRotationVal'),
    qcAngleRulerToggle: document.getElementById('qcAngleRulerToggle'),
    qcAutoCropFov:      document.getElementById('qcAutoCropFov'),
    qcAdjustCrop:       document.getElementById('qcAdjustCrop'),
    qcSaveCrop:         document.getElementById('qcSaveCrop'),
    qcResetCrop:        document.getElementById('qcResetCrop'),
    qcUndoCrop:         document.getElementById('qcUndoCrop'),
    qcRedoCrop:         document.getElementById('qcRedoCrop'),
    qcExcludeToggle:    document.getElementById('qcExcludeToggle'),
    goToAnalysisFromQc: document.getElementById('goToAnalysisFromQc'),
    qcPrevImage:        document.getElementById('qcPrevImage'),
    qcNextImage:        document.getElementById('qcNextImage'),
    modeToggle:         document.getElementById('modeToggle'),
    groupSelect:        document.getElementById('groupSelect'),
    groupSelectRow:     document.getElementById('groupSelectRow'),
    deleteGroup:        document.getElementById('deleteGroup'),
    addImageGroup:      document.getElementById('addImageGroup'),
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
    orientationPanelWarning: document.getElementById('orientationPanelWarning'),
    orientationTopWarning: document.getElementById('orientationTopWarning'),
    contourThickness:   document.getElementById('contourThickness'),
    contourThicknessVal:document.getElementById('contourThicknessVal'),
    contourColor:       document.getElementById('contourColor'),
    contourStyle:       document.getElementById('contourStyle'),
    brushMode:          document.getElementById('brushMode'),
    brushSize:          document.getElementById('brushSize'),
    brushSizeVal:       document.getElementById('brushSizeVal'),
    undoBrush:          document.getElementById('undoBrush'),
    resetBrush:         document.getElementById('resetBrush'),
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
    exportStylePanel:   document.getElementById('exportStylePanel'),
    exportStyleGrayscale: document.getElementById('exportStyleGrayscale'),
    exportStyleColor:   document.getElementById('exportStyleColor'),
    cancelExportStyle:  document.getElementById('cancelExportStyle'),
    groupView:          document.getElementById('groupView'),
    logMsg:             document.getElementById('logMsg'),
    timerMsg:           document.getElementById('timerMsg'),
    spinner:            document.getElementById('spinner'),
    zoomBadge:          document.getElementById('zoomBadge'),
    zoomIn:             document.getElementById('zoomIn'),
    zoomOut:            document.getElementById('zoomOut'),
    zoomReset:          document.getElementById('zoomReset'),
    openFile:           document.getElementById('openFile'),
    fileInput:          document.getElementById('fileInput'),
    groupNameDialog:    document.getElementById('groupNameDialog'),
    groupNameInput:     document.getElementById('groupNameInput'),
    groupNameHint:      document.getElementById('groupNameHint'),
    confirmGroupName:   document.getElementById('confirmGroupName'),
    cancelGroupName:    document.getElementById('cancelGroupName')
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

  const BUTTON_TOOLTIPS = {
    deleteGroup:'Remove the selected loaded group from this browser session.',
    loadSample:'Load the selected calibration sample into the main canvas.',
    rerun:'Analyze the current image with the current settings.',
    applySettingsGroup:'Re-analyze all cards in the selected group with current settings.',
    exportGroupPng:'Download one ZIP file containing contour overlay PNGs for the selected group.',
    exportPlots:'Download publication-quality wound area and width figures plus figure-ready data for the selected group.',
    showAreaPlot:'Show the wound area time-course plot without downloading.',
    showWidthPlot:'Show the mean wound width time-course plot without downloading.',
    autoDetectModeGroup:'Sample group images and choose the microscope mode automatically.',
    undoBrush:'Undo the last manual mask correction.',
    resetBrush:'Remove manual correction and return to the automatic mask.',
    exportPng:'Save the current contour overlay as a PNG image.',
    exportCsv:'Export the current metrics as CSV.',
    exportExcel:'Export figure-ready area and width data plus detailed metrics as an Excel-compatible workbook.',
    zoomIn:'Zoom into the image canvas.',
    zoomOut:'Zoom out of the image canvas.',
    zoomReset:'Reset zoom and pan.',
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
  function setSpinner(on) {
    el.spinner.classList.toggle('active',on);
    window.dispatchEvent(new CustomEvent('cytomove:busy-state',{
      detail:{busy:Boolean(on),label:on?'an analysis or image operation':''}
    }));
  }
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

  function autoCropForImage(img, autoCrop=false, fovCutoff=Number(el.fovCutoff.value)) {
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
    if(state.imageIsPreparedQc) {
      return {x:0,y:0,w:state.image.naturalWidth,h:state.image.naturalHeight,active:false};
    }
    if(state.cropManual&&state.crop) return state.crop;
    return {x:0,y:0,w:state.image.naturalWidth,h:state.image.naturalHeight,active:false};
  }

  function clampCrop(crop, img=state.imageOriginal||state.image) {
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
    if(!crop||!img||!img.naturalWidth||!img.naturalHeight||img.naturalWidth<=0||img.naturalHeight<=0) return null;
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

  function resetCropAndZoom() {
    state.crop=null; state.cropManual=false; state.cropEditing=false; state.cropDragging=false; state.cropDragMode='move';
    state.zoom=1; state.panX=0; state.panY=0;
    el.canvas.style.transform='';
    el.zoomBadge.classList.remove('visible');
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

  function orientationRotationDeg(orientation=state.analysisGeometry.orientation) {
    return orientation==='horizontal'?90:0;
  }

  function effectiveRotationDeg() {
    return (state.rotation+orientationRotationDeg())%360;
  }

  function applyImageTransform(options={}) {
    if(!state.imageOriginal) return;
    const transformed=new Image();
    const angle=Number(state.analysisGeometry.fineRotation)||0;
    transformed.onload=()=>{
      state.image=transformed;
      resetCropAndZoom();
      if(options.analyze) runSegmentation({restoreManual:!!options.restoreManual});
      else if(options.restoreGroupResult&&restoreGroupResultToMainCanvas(state.sample)) return;
      else previewLoadedImageAndMaybeAutoApply(options.logMessage,!!options.autoApplyAfterLoad,options.autoApplyMessage);
    };
    transformed.src=transformImage(state.imageOriginal,effectiveRotationDeg(),angle);
  }

  function clearAnalysisState() {
    state.result=null;
    state.varMap=null; state.maskData=null; state.autoMaskData=null; state.fieldData=null; state.sourceData=null;
    state.grayData=null; state.darkGuideThreshold=0;
    state.brushHistory=[];
    resetBrushStats(false);
    renderMetrics();
    el.exportPng.disabled=true;
    el.exportCsv.disabled=true;
    el.exportExcel.disabled=true;
    if(state.mode!=='group') {
      el.exportGroupPng.disabled=true;
      el.exportPlots.disabled=true;
      el.showAreaPlot.disabled=true;
      el.showWidthPlot.disabled=true;
    }
  }

  function drawLoadedImagePreview(message) {
    if(!state.image) return;
    const canvas=el.canvas;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});

    const crop=currentCrop();
    if(crop&&crop.active) {
      canvas.width=crop.w;
      canvas.height=crop.h;
      ctx.drawImage(state.image,crop.x,crop.y,crop.w,crop.h,0,0,crop.w,crop.h);
    } else {
      canvas.width=state.image.naturalWidth||state.image.width;
      canvas.height=state.image.naturalHeight||state.image.height;
      ctx.drawImage(state.image,0,0,canvas.width,canvas.height);
    }
    clearAnalysisState();
    const cropNote=crop&&crop.active?` &middot; crop ${crop.w}x${crop.h}`:'';
    el.canvasMeta.textContent=`${canvas.width}x${canvas.height} px${cropNote}`;
    el.rerun.disabled=false;
    syncLabels();
    setSpinner(false);
    setLog(message||'<strong>Image ready.</strong> Adjust settings, then click Apply to analyze this image.');
  }

  function previewLoadedImageAndMaybeAutoApply(message, shouldAutoApply=false, autoApplyMessage='<strong>Image ready.</strong> Auto-applying the first image in 1 second...') {
    drawLoadedImagePreview(message);
    if(shouldAutoApply) scheduleAutoApply(autoApplyMessage);
  }

  function cancelAutoApply() {
    if(state.autoApplyTimer) {
      window.clearTimeout(state.autoApplyTimer);
      state.autoApplyTimer=null;
    }
  }

  function scheduleAutoApply(message='<strong>Settings changed.</strong> Auto-applying in 1 second...') {
    if(!state.image||state.cropEditing) return;
    cancelAutoApply();
    el.rerun.disabled=false;
    setLog(message);
    state.autoApplyTimer=window.setTimeout(()=>{
      state.autoApplyTimer=null;
      if(!state.image||state.cropEditing) return;
      syncLabels();
      runSegmentation();
    },AUTO_APPLY_DELAY_MS);
  }

  // 4. Variance filter - integral image O(1) per pixel (matches ImageJ Variance... radius=R)
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
    if(!message) {
      if(el.orientationTopWarning) {
        el.orientationTopWarning.hidden=true;
        el.orientationTopWarning.textContent='';
      }
      if(el.orientationPanelWarning) {
        el.orientationPanelWarning.hidden=true;
        el.orientationPanelWarning.textContent='';
      }
      return;
    }
    if(el.orientationTopWarning) {
      el.orientationTopWarning.textContent=message;
      el.orientationTopWarning.hidden=false;
    }
    if(el.orientationPanelWarning) {
      el.orientationPanelWarning.textContent=message;
      el.orientationPanelWarning.hidden=false;
    }
  }

  function renderOrientationSeriesWarning(message='') {
    const target=el.groupView?.querySelector('#orientationSeriesWarning');
    if(!target) return;
    target.innerHTML=message?seriesCard('Orientation check','Horizontal?',message,'danger'):'';
  }

  async function warnIfHorizontalScratchDetected(samples=selectedGroupSamples()) {
    if((state.lockedQcSnapshot||[]).length&&samples.some(sample=>qcSnapshotForSample(sample.id))) {
      showOrientationHint('');
      renderOrientationSeriesWarning('');
      return;
    }
    if(!samples.length) {
      showOrientationHint('');
      renderOrientationSeriesWarning('');
      return;
    }
    if(state.tutorial&&!state.tutorial.complete) {
      showOrientationHint('');
      renderOrientationSeriesWarning('');
      return;
    }
    const pendingCropReview=samples.some(sample=>{
      const qc=qcStateForSample(sample.id);
      return qc?.needsCrop&&!qc.cropSaved&&!qc.cropReset&&!qc.autoCropFov;
    });
    if(pendingCropReview) {
      showOrientationHint('');
      renderOrientationSeriesWarning('');
      return;
    }
    try {
      const votes=[];
      for(const sample of samples.slice(0,Math.min(samples.length,3))) {
        const img=await loadImageElement(analysisImageUrl(sample));
        votes.push(classifyScratchOrientation(img));
      }
      const horizontal=votes.filter(v=>v.orientation==='horizontal').length;
      const vertical=votes.filter(v=>v.orientation==='vertical').length;
      const detectedOrientation=horizontal>vertical&&horizontal>0?'horizontal':vertical>horizontal&&vertical>0?'vertical':'unknown';
      const selectedOrientation=state.analysisGeometry.orientation||'vertical';
      if(detectedOrientation==='horizontal'&&selectedOrientation!=='horizontal') {
        const msg='Possible horizontal scratch orientation after crop review. Check the Image QC orientation before starting Analysis.';
        showOrientationHint(msg);
        renderOrientationSeriesWarning(msg);
      } else if(detectedOrientation==='vertical'&&selectedOrientation==='horizontal') {
        const msg='Vertical scratch pattern detected. Review the orientation in Image QC before starting Analysis.';
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

  function updateQcOverlayRect(start, dx, dy, mode, bounds, minSize) {
    let left=start.left;
    let top=start.top;
    let right=start.left+start.width;
    let bottom=start.top+start.height;
    if(mode==='move') {
      left=Math.max(bounds.left,Math.min(bounds.right-start.width,start.left+dx));
      top=Math.max(bounds.top,Math.min(bounds.bottom-start.height,start.top+dy));
      right=left+start.width;
      bottom=top+start.height;
    } else {
      if(mode.includes('left')) left=Math.max(bounds.left,Math.min(right-minSize,start.left+dx));
      if(mode.includes('right')) right=Math.min(bounds.right,Math.max(left+minSize,start.left+start.width+dx));
      if(mode.includes('top')) top=Math.max(bounds.top,Math.min(bottom-minSize,start.top+dy));
      if(mode.includes('bottom')) bottom=Math.min(bounds.bottom,Math.max(top+minSize,start.top+start.height+dy));
    }
    return {left,top,width:right-left,height:bottom-top};
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

  // 9. Width estimation - ImageJ edge-span method
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
      const scratchOri=state.analysisGeometry.orientation||'vertical';
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
      const fineRotationDeg=Number(state.analysisGeometry.fineRotation)||0;
      const areaPerValidRow=width.validRows?area/width.validRows:0;
      const areaWidthFillRatio=width.mean&&width.validRows?area/(width.mean*width.validRows):0;
      const partialResult={sourceW:img.naturalWidth,sourceH:img.naturalHeight,analysisW:W,analysisH:H,qcFingerprint:qcFingerprintForSample(state.sample?.id),area,areaPct,wMean:width.mean,wMedian:width.median,wSd:width.sd,widthCv:width.cv,wMin:width.min,wMax:width.max,validRows:width.validRows,validRowFraction:width.validRowFraction,areaPerValidRow,areaWidthFillRatio,minValidWidth:width.minValidWidth,threshold:finalTh,thresholdMode:thMode,thresholdLevel:thLevel,thresholdOffset:thOff,otsuThreshold:otsuTh,baseThreshold:baseTh,fallbackThreshold:fallbackTh,thresholdFallbackUsed:otsuTh<3,maxV,fieldArea,gtComparable,areaErr,areaErrS,boundaryCount,totalComponents:islandFilter.totalComponents,keptComponents:islandFilter.keptComponents,largestArea:islandFilter.largestArea,groupPriorApplied:priorResult.applied,groupPriorArea:priorResult.priorArea,groupPriorRadius:priorResult.radius,phaseSlitFilledPx:slitClose.filled,phaseSlitCount:slitClose.slits,phaseSmoothChangedPx:smooth.changed,phaseSmoothRadius:smooth.radius,bridgeFilledPx:bridge.filled,bridgeGapCount:bridge.gaps,edgeExtendedPx:edgeExtend.filled,edgeExtendedCount:edgeExtend.edges,finalHoleFilledCount:finalHoleResult.filledHoleCount,finalHoleFilledArea:finalHoleResult.filledHoleArea,finalComponents:finalComponents.totalComponents,continuityKeptComponents:continuity.kept,continuityTotalComponents:continuity.total,internalIslandCount:finalHoleResult.holeCount,internalIslandArea:finalHoleResult.holeArea,largestInternalIslandArea:finalHoleResult.largestHoleArea,filledSmallIslandCount:holeResult.filledHoleCount+finalHoleResult.filledHoleCount,filledSmallIslandArea:holeResult.filledHoleArea+finalHoleResult.filledHoleArea,holeFillMaxArea:holeResult.maxHoleArea,tinyIslandMode:el.tinyIslandMode.value,crop,runtimeMs:ms,fieldMaskMode:fovMode,scratchOrientation:scratchOri,manualRotationDeg:state.rotation,orientationRotationDeg:orientationRotationDeg(),effectiveRotationDeg:effectiveRotationDeg(),fineRotationDeg,varianceRadius:radius,minComponentPx:minC,fovCutoff:fov,autoCropFov:false,cropManual:state.cropManual,manualCorrectionStatus:'none',manualAddedPx:0,manualRemovedPx:0,manualNetDeltaPx:0,manualCorrectionFractionPercent:0};
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
      const deskew=Number(state.analysisGeometry.fineRotation)||0;
      const orientation=state.analysisGeometry.orientation==='horizontal'?'horizontal scratch -> 90deg':'vertical scratch';
      el.canvasMeta.textContent=`${W}x${H} px ${orientation}${state.rotation?` + manual rotate ${state.rotation}deg`:''}${deskew?` fine rotation ${deskew}deg`:''}${crop.active?` cropped from ${img.naturalWidth}x${img.naturalHeight}`:''}  variance radius ${radius}  Otsu ${finalTh}`;
      const restored=options.restoreManual&&applyManualOverrideToCurrentSample();
      if(!restored) syncDisplayedResultToGroup();
      updateGroupNavButtons();
    } catch(err) {
      console.error(err);
      state.result=null;
      renderMetrics();
      const fileHint=isFileProtocol()
        ? ' Windows double-click opens this as <code>file://</code>, which can block canvas pixel reads from linked calibration images. Use the Open button/drag-drop for local files, or run a local server from the repo root: <code>py -3 -m http.server 8765</code>.'
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

  function drawContour(d,mask,W,H,boundaryOverride=null, style={}) {
    const boundary=boundaryOverride||boundaryPixels(mask,W,H);
    const thickness=Number.isFinite(style.thickness)?style.thickness:Number(el.contourThickness.value);
    const radius=Math.max(0,Math.floor((thickness-1)/2));
    const haloRadius=Number.isFinite(style.haloRadius)?style.haloRadius:radius+2;
    const [r,g,b]=hexToRgb(style.color||el.contourColor.value);
    const [hr,hg,hb]=style.haloColor?hexToRgb(style.haloColor):[16,32,39];
    const dashed=el.contourStyle.value==='dashed';
    for(const p of boundary){
      const x=p%W,y=(p/W)|0;
      if(dashed&&((x+y)%34)>20) continue;
      for(let oy=-haloRadius;oy<=haloRadius;oy++) for(let ox=-haloRadius;ox<=haloRadius;ox++) {
        if(Math.abs(ox)+Math.abs(oy)>haloRadius) continue;
        paintPixel(d,W,H,x+ox,y+oy,hr,hg,hb);
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
        emitTutorialManualCorrection('clean');
        return true;
      }
      setLog(`<strong>Clean specks:</strong> no small mask fragments found in the selected ROI.`);
      emitTutorialManualCorrection('clean',{applied:false});
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
        emitTutorialManualCorrection('fill');
        return true;
      }
      setLog(`<strong>Fill area:</strong> selected ROI was already filled or outside the analysis field.`);
      emitTutorialManualCorrection('fill',{applied:false});
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
        emitTutorialManualCorrection('erase');
        return true;
      }
      setLog(`<strong>Erase scan:</strong> no existing mask pixels were found in the selected ROI.`);
      emitTutorialManualCorrection('erase',{applied:false});
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
      emitTutorialManualCorrection('add');
      return true;
    }
    setLog(`<strong>Add scan:</strong> no mask pixels changed in the selected ROI. Try a larger rectangle or adjust scan sensitivity.`);
    emitTutorialManualCorrection('add',{applied:false});
    return false;
  }

  function emitTutorialManualCorrection(mode, detail={}) {
    if(!state.tutorial&&detail.applied===false) return;
    document.dispatchEvent(new CustomEvent('cytomove:manual-correction',{detail:{mode,applied:true,...detail}}));
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
    if(samples.some(s=>s.id===sample.id)) {
      updateGroupExportAvailability(samples);
      renderSeriesSummary(samples);
    }
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
    updateGroupExportAvailability(selectedGroupSamples());
    renderSeriesSummary(selectedGroupSamples());
  }

  function restoreGroupResultToMainCanvas(sample) {
    if(!sample?.id) return false;
    const override=state.manualOverrides[sample.id];
    const result=override?.result||state.groupResults[sample.id];
    const source=override?.sourceData||result?.src;
    const field=override?.fieldData||result?.field;
    const mask=override?.mask||result?.mask;
    if(!result||!source||!field||!mask) return false;
    state.result={...result};
    state.sourceData=source;
    state.fieldData=field;
    state.varMap=override?.varMap||result?.varMap||null;
    state.maskData=new Uint8Array(mask);
    state.autoMaskData=new Uint8Array(mask);
    state.grayData=null;
    state.darkGuideThreshold=0;
    state.brushHistory=[];
    const restoredSettings=settingsFromResult(result);
    if(restoredSettings) {
      state.sampleSettings[sample.id]=restoredSettings;
      applyPanelSettings(restoredSettings);
    }
    const W=result.analysisW||result.width||source.width||el.canvas.width;
    const H=result.analysisH||result.height||source.height||el.canvas.height;
    el.canvas.width=W;
    el.canvas.height=H;
    state.crop=result.crop?{...result.crop}:state.crop;
    resetBrushStats(false);
    drawCanvas(source,state.maskData,field,state.varMap,W,H,state.result?.maxV||1);
    renderMetrics();
    el.canvasMeta.textContent=`${W}x${H} px restored group analysis`;
    el.rerun.disabled=false;
    el.exportPng.disabled=false;
    el.exportCsv.disabled=false;
    el.exportExcel.disabled=false;
    updateGroupNavButtons();
    setSpinner(false);
    setLog('<strong>Group result restored.</strong> Existing analysis is shown for this image. Click Apply to re-analyze with changed settings.');
    warnIfHorizontalScratchDetected([sample]);
    return true;
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

  function concatBytes(parts) {
    const total=parts.reduce((sum,part)=>sum+part.length,0);
    const out=new Uint8Array(total);
    let offset=0;
    parts.forEach(part=>{ out.set(part,offset); offset+=part.length; });
    return out;
  }

  function canvasToPngBytes(canvas) {
    return dataUrlToBytes(canvas.toDataURL('image/png'));
  }

  function builderPublicationProfiles(aspect=1580/2600) {
    return [
      {key:'single_column',label:'Single column',widthMm:85,dpi:600,widthPx:2008,heightPx:Math.round(2008*aspect)},
      {key:'double_column',label:'Double column',widthMm:180,dpi:600,widthPx:4252,heightPx:Math.round(4252*aspect)}
    ];
  }

  function scaleCanvasForPublication(canvas, profile) {
    const scaled=document.createElement('canvas');
    scaled.width=profile.widthPx;
    scaled.height=profile.heightPx;
    const ctx=scaled.getContext('2d');
    ctx.fillStyle='#fff';
    ctx.fillRect(0,0,scaled.width,scaled.height);
    ctx.imageSmoothingEnabled=true;
    ctx.imageSmoothingQuality='high';
    ctx.drawImage(canvas,0,0,scaled.width,scaled.height);
    return scaled;
  }

  function pngChunk(type, data) {
    const typeBytes=new TextEncoder().encode(type);
    const bytes=new Uint8Array(12+data.length);
    const view=new DataView(bytes.buffer);
    view.setUint32(0,data.length,false);
    bytes.set(typeBytes,4);
    bytes.set(data,8);
    view.setUint32(8+data.length,crc32(concatBytes([typeBytes,data])),false);
    return bytes;
  }

  function pngBytesWithDpi(canvas, dpi=600) {
    const source=canvasToPngBytes(canvas);
    const signature=source.slice(0,8);
    const chunks=[];
    let offset=8;
    while(offset+12<=source.length) {
      const view=new DataView(source.buffer,source.byteOffset+offset);
      const length=view.getUint32(0,false);
      const end=offset+12+length;
      const type=String.fromCharCode(...source.slice(offset+4,offset+8));
      if(type!=='pHYs') chunks.push({type,bytes:source.slice(offset,end)});
      offset=end;
      if(type==='IEND') break;
    }
    const pixelsPerMeter=dpi===600?23622:Math.round(dpi/0.0254);
    const physData=new Uint8Array(9);
    const physView=new DataView(physData.buffer);
    physView.setUint32(0,pixelsPerMeter,false);
    physView.setUint32(4,pixelsPerMeter,false);
    physData[8]=1;
    const phys={type:'pHYs',bytes:pngChunk('pHYs',physData)};
    const output=[signature];
    let inserted=false;
    chunks.forEach(chunk=>{
      if(chunk.type==='IDAT'&&!inserted) {
        output.push(phys.bytes);
        inserted=true;
      }
      output.push(chunk.bytes);
    });
    return concatBytes(output);
  }

  function writeTiffEntry(view, offset, tag, type, count, value) {
    view.setUint16(offset,tag,true);
    view.setUint16(offset+2,type,true);
    view.setUint32(offset+4,count,true);
    if(type===3&&count===1) {
      view.setUint16(offset+8,value,true);
      view.setUint16(offset+10,0,true);
    } else {
      view.setUint32(offset+8,value,true);
    }
  }

  function canvasToTiffBytes(canvas, dpi=600) {
    const width=canvas.width;
    const height=canvas.height;
    const imageData=canvas.getContext('2d',{willReadFrequently:true}).getImageData(0,0,width,height).data;
    const entryCount=14;
    const ifdOffset=8;
    const ifdSize=2+entryCount*12+4;
    const bitsOffset=ifdOffset+ifdSize;
    const xResolutionOffset=bitsOffset+6;
    const yResolutionOffset=xResolutionOffset+8;
    const softwareBytes=new TextEncoder().encode('Cytomove\0');
    const softwareOffset=yResolutionOffset+8;
    const pixelOffset=(softwareOffset+softwareBytes.length+1)&~1;
    const pixelBytes=width*height*3;
    const bytes=new Uint8Array(pixelOffset+pixelBytes);
    const view=new DataView(bytes.buffer);
    bytes[0]=0x49; bytes[1]=0x49;
    view.setUint16(2,42,true);
    view.setUint32(4,ifdOffset,true);
    view.setUint16(ifdOffset,entryCount,true);
    let entryOffset=ifdOffset+2;
    writeTiffEntry(view,entryOffset,256,4,1,width); entryOffset+=12;
    writeTiffEntry(view,entryOffset,257,4,1,height); entryOffset+=12;
    writeTiffEntry(view,entryOffset,258,3,3,bitsOffset); entryOffset+=12;
    writeTiffEntry(view,entryOffset,259,3,1,1); entryOffset+=12;
    writeTiffEntry(view,entryOffset,262,3,1,2); entryOffset+=12;
    writeTiffEntry(view,entryOffset,273,4,1,pixelOffset); entryOffset+=12;
    writeTiffEntry(view,entryOffset,277,3,1,3); entryOffset+=12;
    writeTiffEntry(view,entryOffset,278,4,1,height); entryOffset+=12;
    writeTiffEntry(view,entryOffset,279,4,1,pixelBytes); entryOffset+=12;
    writeTiffEntry(view,entryOffset,282,5,1,xResolutionOffset); entryOffset+=12;
    writeTiffEntry(view,entryOffset,283,5,1,yResolutionOffset); entryOffset+=12;
    writeTiffEntry(view,entryOffset,284,3,1,1); entryOffset+=12;
    writeTiffEntry(view,entryOffset,296,3,1,2); entryOffset+=12;
    writeTiffEntry(view,entryOffset,305,2,softwareBytes.length,softwareOffset); entryOffset+=12;
    view.setUint32(ifdOffset+2+entryCount*12,0,true);
    view.setUint16(bitsOffset,8,true);
    view.setUint16(bitsOffset+2,8,true);
    view.setUint16(bitsOffset+4,8,true);
    view.setUint32(xResolutionOffset,dpi,true);
    view.setUint32(xResolutionOffset+4,1,true);
    view.setUint32(yResolutionOffset,dpi,true);
    view.setUint32(yResolutionOffset+4,1,true);
    bytes.set(softwareBytes,softwareOffset);
    for(let source=0,target=pixelOffset;source<imageData.length;source+=4,target+=3) {
      bytes[target]=imageData[source];
      bytes[target+1]=imageData[source+1];
      bytes[target+2]=imageData[source+2];
    }
    return bytes;
  }

  function canvasToJpegBytes(canvas, quality=0.94) {
    return dataUrlToBytes(canvas.toDataURL('image/jpeg',quality));
  }

  function pdfStringBytes(value) {
    return new TextEncoder().encode(value);
  }

  function pdfFromCanvas(canvas) {
    const imageBytes=canvasToJpegBytes(canvas);
    const pageW=842;
    const pageH=Math.max(1,Math.round(pageW*canvas.height/canvas.width));
    const content=`q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
    const objects=[
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
      `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`,
      `<< /Length ${content.length} >>\nstream\n${content}endstream`
    ];
    const chunks=[pdfStringBytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];
    const offsets=[0];
    let offset=chunks[0].length;
    objects.forEach((obj,i)=>{
      offsets.push(offset);
      let bytes;
      if(i===3) {
        bytes=concatBytes([pdfStringBytes(`4 0 obj\n${obj}`),imageBytes,pdfStringBytes('\nendstream\nendobj\n')]);
      } else {
        bytes=pdfStringBytes(`${i+1} 0 obj\n${obj}\nendobj\n`);
      }
      chunks.push(bytes);
      offset+=bytes.length;
    });
    const xrefStart=offset;
    let xref=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
    for(let i=1;i<offsets.length;i++) xref+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;
    xref+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
    chunks.push(pdfStringBytes(xref));
    return concatBytes(chunks);
  }

  function xmlEsc(value) {
    return String(value??'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&apos;');
  }

  const PPTX_W=12192000;
  const PPTX_H=6858000;
  const PPTX_SX=PPTX_W/2600;
  const PPTX_SY=PPTX_H/1550;

  function pptUnitsX(value) { return Math.round(value*PPTX_SX); }
  function pptUnitsY(value) { return Math.round(value*PPTX_SY); }
  function pptHex(color) { return String(color||'#111827').replace('#','').toUpperCase(); }

  function pptShape(id, name, x, y, w, h, fill='#ffffff', line='#ffffff') {
    return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${xmlEsc(name)}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${pptUnitsX(x)}" y="${pptUnitsY(y)}"/><a:ext cx="${pptUnitsX(w)}" cy="${pptUnitsY(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${pptHex(fill)}"/></a:solidFill><a:ln w="12700"><a:solidFill><a:srgbClr val="${pptHex(line)}"/></a:solidFill></a:ln></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody></p:sp>`;
  }

  function pptText(id, name, text, x, y, w, h, size=20, bold=false, color='#111827', align='l') {
    return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${xmlEsc(name)}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${pptUnitsX(x)}" y="${pptUnitsY(y)}"/><a:ext cx="${pptUnitsX(w)}" cy="${pptUnitsY(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square"/><a:lstStyle/><a:p><a:pPr algn="${align}"/><a:r><a:rPr lang="en-US" sz="${Math.round(size*100)}"${bold?' b="1"':''}><a:solidFill><a:srgbClr val="${pptHex(color)}"/></a:solidFill><a:latin typeface="Arial"/></a:rPr><a:t>${xmlEsc(text)}</a:t></a:r><a:endParaRPr lang="en-US" sz="${Math.round(size*100)}"/></a:p></p:txBody></p:sp>`;
  }

  function pptLine(id, name, x1, y1, x2, y2, color='#111827', width=2) {
    const x=Math.min(x1,x2), y=Math.min(y1,y2);
    const w=Math.max(1,Math.abs(x2-x1)), h=Math.max(1,Math.abs(y2-y1));
    const flipH=x2<x1?' flipH="1"':'';
    const flipV=y2<y1?' flipV="1"':'';
    return `<p:cxnSp><p:nvCxnSpPr><p:cNvPr id="${id}" name="${xmlEsc(name)}"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr><p:spPr><a:xfrm${flipH}${flipV}><a:off x="${pptUnitsX(x)}" y="${pptUnitsY(y)}"/><a:ext cx="${pptUnitsX(w)}" cy="${pptUnitsY(h)}"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:ln w="${Math.round(width*12700)}"><a:solidFill><a:srgbClr val="${pptHex(color)}"/></a:solidFill></a:ln></p:spPr></p:cxnSp>`;
  }

  function pptPic(id, name, relId, x, y, w, h) {
    return `<p:pic><p:nvPicPr><p:cNvPr id="${id}" name="${xmlEsc(name)}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="${pptUnitsX(x)}" y="${pptUnitsY(y)}"/><a:ext cx="${pptUnitsX(w)}" cy="${pptUnitsY(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>`;
  }

  function pptxSlideXml(index, elements) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      ${elements.join('')}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
  }

  function makePptxDeck(slides) {
    const files=[];
    const enc=new TextEncoder();
    const contentTypes=[
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
      '<Default Extension="xml" ContentType="application/xml"/>',
      '<Default Extension="png" ContentType="image/png"/>',
      '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>',
      '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>',
      '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>',
      '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>',
      '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
      '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
    ];
    slides.forEach((_,i)=>contentTypes.push(`<Override PartName="/ppt/slides/slide${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`));
    contentTypes.push('</Types>');
    files.push({name:'[Content_Types].xml',bytes:enc.encode(contentTypes.join(''))});
    files.push({name:'_rels/.rels',bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`)});
    files.push({name:'docProps/core.xml',bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Cytomove publication figures</dc:title><dc:creator>Cytomove</dc:creator><cp:lastModifiedBy>Cytomove</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified></cp:coreProperties>`)});
    files.push({name:'docProps/app.xml',bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Cytomove</Application><PresentationFormat>On-screen Show (16:9)</PresentationFormat><Slides>${slides.length}</Slides></Properties>`)});
    files.push({name:'ppt/presentation.xml',bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>${slides.map((_,i)=>`<p:sldId id="${256+i}" r:id="rId${i+2}"/>`).join('')}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="screen16x9"/><p:notesSz cx="6858000" cy="9144000"/><p:defaultTextStyle><a:defPPr><a:defRPr lang="en-US"/></a:defPPr></p:defaultTextStyle></p:presentation>`)});
    files.push({name:'ppt/_rels/presentation.xml.rels',bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>${slides.map((_,i)=>`<Relationship Id="rId${i+2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i+1}.xml"/>`).join('')}</Relationships>`)});
    files.push({name:'ppt/slideMasters/slideMaster1.xml',bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`)});
    files.push({name:'ppt/slideMasters/_rels/slideMaster1.xml.rels',bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`)});
    files.push({name:'ppt/slideLayouts/slideLayout1.xml',bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`)});
    files.push({name:'ppt/slideLayouts/_rels/slideLayout1.xml.rels',bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`)});
    files.push({name:'ppt/theme/theme1.xml',bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Cytomove"><a:themeElements><a:clrScheme name="Cytomove"><a:dk1><a:srgbClr val="111827"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="52615F"/></a:dk2><a:lt2><a:srgbClr val="F8FBFA"/></a:lt2><a:accent1><a:srgbClr val="0F9F8F"/></a:accent1><a:accent2><a:srgbClr val="2F6FED"/></a:accent2><a:accent3><a:srgbClr val="64748B"/></a:accent3><a:accent4><a:srgbClr val="E5E7EB"/></a:accent4><a:accent5><a:srgbClr val="111827"/></a:accent5><a:accent6><a:srgbClr val="B9D4CF"/></a:accent6><a:hlink><a:srgbClr val="2F6FED"/></a:hlink><a:folHlink><a:srgbClr val="0F9F8F"/></a:folHlink></a:clrScheme><a:fontScheme name="Cytomove"><a:majorFont><a:latin typeface="Arial"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/></a:minorFont></a:fontScheme><a:fmtScheme name="Cytomove"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`)});
    slides.forEach((slide,i)=>{
      const n=i+1;
      const mediaRels=(slide.media||[]).map((media,j)=>`<Relationship Id="rId${j+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/slide${n}_image${j+1}.png"/>`).join('');
      files.push({name:`ppt/slides/slide${n}.xml`,bytes:enc.encode(pptxSlideXml(n,slide.elements||[]))});
      files.push({name:`ppt/slides/_rels/slide${n}.xml.rels`,bytes:enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${mediaRels}<Relationship Id="rId${(slide.media||[]).length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>`)});
      (slide.media||[]).forEach((media,j)=>{
        files.push({name:`ppt/media/slide${n}_image${j+1}.png`,bytes:media.bytes});
      });
    });
    return makeZip(files);
  }

  function groupOverlayCanvas(sample, options={}) {
    const style=options.style||(options.grayscale?'grayscale':'color');
    const cfg=figureStyleConfig(style);
    const stored=storedContourForSample(sample);
    if(!stored) return null;
    const {source,field,mask,width:W,height:H}=stored;
    const canvas=document.createElement('canvas');
    canvas.width=W;
    canvas.height=H;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const out=new ImageData(new Uint8ClampedArray(source.data),W,H);
    const d=out.data;
    const len=W*H;
    if(options.grayscale||cfg.grayscale) {
      for(let p=0,i=0;p<len;p++,i+=4) {
        const g=Math.round(d[i]*0.299+d[i+1]*0.587+d[i+2]*0.114);
        d[i]=g; d[i+1]=g; d[i+2]=g;
      }
    }
    if(field) {
      for(let p=0,i=0;p<len;p++,i+=4) {
        if(!field[p]) {
          d[i]=d[i]*0.35|0;
          d[i+1]=d[i+1]*0.35|0;
          d[i+2]=d[i+2]*0.35|0;
        }
      }
    }
    const contourStyle=options.targetWidth&&options.targetHeight
      ? contourStyleForTarget(W,H,options.targetWidth,options.targetHeight,cfg)
      : {
          color:cfg.contour,
          haloColor:cfg.contourHalo,
          thickness:cfg.contourThickness,
          haloRadius:cfg.contourHaloRadius
        };
    drawContour(d,mask,W,H,null,contourStyle);
    ctx.putImageData(out,0,0);
    return {canvas,width:W,height:H};
  }

  function groupOverlayPngBytes(sample) {
    const overlay=groupOverlayCanvas(sample);
    if(!overlay) return null;
    return {bytes:dataUrlToBytes(overlay.canvas.toDataURL('image/png')),width:overlay.width,height:overlay.height};
  }

  function imageDataPngBytes(imageData, width, height) {
    const canvas=document.createElement('canvas');
    canvas.width=width;
    canvas.height=height;
    canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(imageData.data),width,height),0,0);
    return dataUrlToBytes(canvas.toDataURL('image/png'));
  }

  function storedSourcePngBytes(sample) {
    const stored=storedContourForSample(sample);
    if(!stored) return null;
    return {bytes:imageDataPngBytes(stored.source,stored.width,stored.height),width:stored.width,height:stored.height};
  }

  function builderFullImageExportSamples(settings) {
    const groupIds=uniqueIds([...(settings.controlReplicateIds||[]),...(settings.treatmentArms||[]).flatMap(arm=>arm.replicateIds||[])]);
    return groupIds.flatMap(groupSamplesById).filter(sample=>!sampleExcludedFromAnalysis(sample.id));
  }

  async function builderFullImageExportFiles(settings, exportStyle, groupName) {
    const samples=builderFullImageExportSamples(settings);
    const missing=samples.filter(sampleNeedsFullResolutionContour);
    if(missing.length) await renderGroupContours(samples,{force:true});
    return samples.map((sample,index)=>{
      const source=storedSourcePngBytes(sample);
      const overlay=groupOverlayPngBytes(sample);
      const sampleName=safeFilenamePart(sample.path.split('/').pop()||sample.imageId,`image_${index+1}`);
      const time=safeFilenamePart(sample.time||String(index+1),`t${index+1}`);
      const prefix=`cytomove_${groupName}_${String(index+1).padStart(2,'0')}_${time}_${sampleName}_${exportStyle}`;
      return {source,overlay,prefix};
    }).filter(item=>item.source&&item.overlay).flatMap(item=>[
      {name:`full_images/original/${item.prefix}_original_${item.source.width}x${item.source.height}px.png`,bytes:item.source.bytes},
      {name:`full_images/contour_overlay/${item.prefix}_contour_overlay_${item.overlay.width}x${item.overlay.height}px.png`,bytes:item.overlay.bytes}
    ]);
  }

  function sampleNeedsFullResolutionContour(sample) {
    const result=state.manualOverrides[sample.id]?.result||state.groupResults[sample.id]||(state.sample?.id===sample.id?state.result:null);
    return !storedContourForSample(sample)||!!result?.previewOnly;
  }

  async function exportGroupPngOverlays() {
    const samples=selectedGroupSamples();
    if(state.mode!=='group') setMode('group');
    if(!samples.length) {
      setLog('<strong>No group loaded yet.</strong> Drop multiple images or use the open button to create a group.');
      return;
    }
    let missing=samples.filter(sampleNeedsFullResolutionContour);
    if(missing.length) {
      setSpinner(true);
      el.exportGroupPng.disabled=true;
      setLog(`<strong>Group PNG export:</strong> preparing ${missing.length}/${samples.length} full-resolution overlay${missing.length>1?'s':''} before download.`);
      await renderGroupContours(samples,{force:true});
      missing=samples.filter(sampleNeedsFullResolutionContour);
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
    const rows=selectedGroupSamples().filter(sample=>!sampleExcludedFromAnalysis(sample.id)).map((sample,index)=>{
      const r=state.manualOverrides[sample.id]?.result||state.groupResults[sample.id]||(state.sample?.id===sample.id?state.result:null);
      if(!r) return null;
      const parsed=parseTimeHours(sample.time);
      return {
        sample,index,
        x:Number.isFinite(parsed)?parsed:index+1,
        label:sample.time||String(index+1),
        areaPct:Number(r.areaPct),
        areaPx:Number(r.area),
        width:Number(r.wMean),
        medianWidth:Number(r.wMedian),
        qc:r.segmentationQualityScore,
        recommended:r.recommendedPrimaryMetric||'',
        warnings:r.warnings||[]
      };
    }).filter(row=>row&&Number.isFinite(row.x)).sort((a,b)=>a.x-b.x||a.index-b.index);
    const base=rows[0]||{};
    return rows.map(row=>({
      ...row,
      areaNormalizedPct:Number.isFinite(base.areaPx)&&base.areaPx?row.areaPx*100/base.areaPx:null,
      widthNormalizedPct:Number.isFinite(base.width)&&base.width?row.width*100/base.width:null,
      areaClosurePct:Number.isFinite(base.areaPx)&&base.areaPx?100-(row.areaPx*100/base.areaPx):null,
      widthClosurePct:Number.isFinite(base.width)&&base.width?100-(row.width*100/base.width):null
    }));
  }

  function groupFigureRows(samples=selectedGroupSamples()) {
    const rows=groupPlotRows().filter(row=>samples.some(sample=>sample.id===row.sample.id));
    if(!rows.length) return [];
    return rows.map(row=>({
      figure_time_h:row.x,
      figure_time_label:row.label,
      image_name:row.sample.path.split('/').pop()||row.sample.path,
      wound_area_px:Number.isFinite(row.areaPx)?Math.round(row.areaPx):'',
      wound_area_percent:Number.isFinite(row.areaPct)?row.areaPct.toFixed(4):'',
      normalized_area_percent:Number.isFinite(row.areaNormalizedPct)?row.areaNormalizedPct.toFixed(4):'',
      mean_width_px:Number.isFinite(row.width)?row.width.toFixed(2):'',
      median_width_px:Number.isFinite(row.medianWidth)?row.medianWidth.toFixed(2):'',
      normalized_width_percent:Number.isFinite(row.widthNormalizedPct)?row.widthNormalizedPct.toFixed(4):'',
      area_closure_percent:Number.isFinite(row.areaClosurePct)?row.areaClosurePct.toFixed(4):'',
      width_closure_percent:Number.isFinite(row.widthClosurePct)?row.widthClosurePct.toFixed(4):'',
      recommended_metric:row.recommended,
      qc_score:Number.isFinite(row.qc)?Math.round(row.qc):'',
      qc_notes:(row.warnings||[]).join(' | ')
    }));
  }

  function figureDataCsv(rows) {
    if(!rows.length) return '';
    const headers=Object.keys(rows[0]);
    return [headers, ...rows.map(r=>headers.map(h=>r[h]))].map(row=>row.map(csvCell).join(',')).join('\n');
  }

  function figureStyleConfig(style='grayscale') {
    const grayscale=style!=='color';
    if(grayscale) {
      return {
        name:'grayscale',
        grayscale:true,
        area:'#111111',
        width:'#666666',
        axis:'#111111',
        text:'#111111',
        muted:'#555555',
        grid:'#DADADA',
        contour:'#1F1F1F',
        contourHalo:'#F7F7F7',
        contourThickness:2,
        contourHaloRadius:4
      };
    }
    return {
      name:'color',
      grayscale:false,
      area:'#00B8A9',
      width:'#2f6fed',
      axis:'#111827',
      text:'#111827',
      muted:'#52615f',
      grid:'#D8E7E4',
      contour:'#161A1D',
      contourHalo:'#F7F7F2',
      contourThickness:2,
      contourHaloRadius:1
    };
  }

  function contourStyleForTarget(sourceWidth,sourceHeight,targetWidth,targetHeight,cfg) {
    const scale=Math.max(
      Number(targetWidth)/Number(sourceWidth),
      Number(targetHeight)/Number(sourceHeight)
    );
    if(!Number.isFinite(scale)||scale<=0) {
      return {
        color:cfg.contour,
        haloColor:cfg.contourHalo,
        thickness:cfg.contourThickness,
        haloRadius:cfg.contourHaloRadius
      };
    }
    const sourceDiameter=1.35/scale;
    const sourceRadius=Math.max(0,Math.ceil((sourceDiameter-1)/2));
    return {
      color:cfg.contour,
      haloColor:cfg.contourHalo,
      thickness:Math.max(cfg.contourThickness,sourceRadius*2+1),
      haloRadius:Math.max(cfg.contourHaloRadius,Math.ceil(0.7/scale))
    };
  }

  function metricFigureColor(metricKind, style='grayscale') {
    const cfg=figureStyleConfig(style);
    return metricKind==='width'?cfg.width:cfg.area;
  }

  function drawTimePlot(rows, metric, title, yLabel, color, panelLabel='', style='grayscale') {
    const valid=rows.filter(row=>Number.isFinite(row[metric]));
    if(valid.length<2) return null;
    const metricKind=/width/i.test(metric)?'width':'area';
    const cfg=figureStyleConfig(style);
    const W=2200,H=1500;
    const margin={left:230,right:115,top:185,bottom:175};
    const plotW=W-margin.left-margin.right;
    const plotH=H-margin.top-margin.bottom;
    const canvas=document.createElement('canvas');
    canvas.width=W; canvas.height=H;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,W,H);
    const plotColor=style==='color'&&color?color:metricFigureColor(metricKind,style);
    ctx.fillStyle=cfg.text;
    ctx.font='700 50px Arial, sans-serif';
    ctx.textAlign='left';
    ctx.textBaseline='alphabetic';
    if(panelLabel) {
      ctx.fillText(panelLabel,70,82);
    }
    ctx.fillText(title,margin.left,88);
    ctx.font='500 30px Arial, sans-serif';
    ctx.fillStyle=cfg.muted;
    ctx.fillText('Normalized to baseline (0h = 100%)',margin.left,132);

    const xs=valid.map(row=>row.x), ys=valid.map(row=>row[metric]);
    let minX=Math.min(...xs), maxX=Math.max(...xs);
    let minY=Math.min(...ys), maxY=Math.max(...ys);
    if(minX===maxX){ minX-=1; maxX+=1; }
    const isPercent=/Pct$/i.test(metric);
    if(minY===maxY){ minY=Math.max(0,minY-1); maxY+=1; }
    const yPad=(maxY-minY)*0.12;
    minY=isPercent?0:Math.max(0,minY-yPad);
    maxY=isPercent?Math.max(110,maxY+yPad):maxY+yPad;
    const xToPx=x=>margin.left+(x-minX)*plotW/(maxX-minX);
    const yToPx=y=>margin.top+plotH-(y-minY)*plotH/(maxY-minY);

    ctx.strokeStyle=cfg.grid;
    ctx.lineWidth=2;
    ctx.fillStyle=cfg.text;
    ctx.font='26px Arial, sans-serif';
    ctx.textAlign='right';
    ctx.textBaseline='middle';
    for(let i=0;i<=5;i++) {
      const y=minY+(maxY-minY)*i/5;
      const py=yToPx(y);
      ctx.beginPath(); ctx.moveTo(margin.left,py); ctx.lineTo(W-margin.right,py); ctx.stroke();
      ctx.fillText(isPercent?fmt(y,0):fmt(y,0),margin.left-26,py);
    }
    ctx.strokeStyle=cfg.axis;
    ctx.lineWidth=4;
    ctx.beginPath();
    ctx.moveTo(margin.left,margin.top);
    ctx.lineTo(margin.left,margin.top+plotH);
    ctx.lineTo(margin.left+plotW,margin.top+plotH);
    ctx.stroke();

    ctx.textAlign='center';
    ctx.textBaseline='top';
    ctx.font='28px Arial, sans-serif';
    valid.forEach(row=>{
      const px=xToPx(row.x);
      ctx.fillStyle=cfg.text;
      ctx.fillText(row.label,px,margin.top+plotH+20);
    });
    ctx.save();
    ctx.translate(64,margin.top+plotH/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillStyle=cfg.text;
    ctx.font='700 32px Arial, sans-serif';
    ctx.textAlign='center';
    ctx.fillText(yLabel,0,0);
    ctx.restore();
    ctx.fillStyle=cfg.text;
    ctx.font='700 32px Arial, sans-serif';
    ctx.textAlign='center';
    ctx.fillText('Timepoint',margin.left+plotW/2,H-70);

    ctx.strokeStyle=plotColor;
    ctx.lineWidth=7;
    ctx.lineJoin='round';
    ctx.lineCap='round';
    ctx.beginPath();
    valid.forEach((row,i)=>{
      const px=xToPx(row.x), py=yToPx(row[metric]);
      if(i) ctx.lineTo(px,py); else ctx.moveTo(px,py);
    });
    ctx.stroke();
    valid.forEach(row=>{
      const px=xToPx(row.x), py=yToPx(row[metric]);
      ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(px,py,14,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=plotColor; ctx.lineWidth=6; ctx.stroke();
    });
    return canvas;
  }

  function drawFittedImage(ctx,img,x,y,w,h) {
    const ratio=Math.max(w/img.width,h/img.height);
    const sw=w/ratio, sh=h/ratio;
    const sx=Math.max(0,(img.width-sw)/2), sy=Math.max(0,(img.height-sh)/2);
    ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
  }

  function drawContainedImage(ctx,img,x,y,w,h) {
    const ratio=Math.min(w/img.width,h/img.height);
    const dw=img.width*ratio;
    const dh=img.height*ratio;
    const dx=x+(w-dw)/2;
    const dy=y+(h-dh)/2;
    ctx.drawImage(img,dx,dy,dw,dh);
  }

  function drawClosureBars(ctx,rows,x,y,w,h,metricKind='area',style='grayscale',includeHeader=true) {
    const metric=metricKind==='width'?'widthClosurePct':'areaClosurePct';
    const label=metricKind==='width'?'Width closure':'Area closure';
    const cfg=figureStyleConfig(style);
    const color=metricFigureColor(metricKind,style);
    const valid=rows.filter(row=>Number.isFinite(row[metric])&&row.x!==rows[0].x);
    ctx.save();
    ctx.fillStyle='#ffffff';
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle=cfg.text;
    if(includeHeader) {
      ctx.font='700 34px Arial, sans-serif';
      ctx.fillText('B',x,y-24);
      ctx.font='700 30px Arial, sans-serif';
      ctx.fillText(label,x+76,y-24);
    }
    const left=x+95, right=x+w-35, top=y+(includeHeader?50:28), bottom=y+h-90;
    ctx.strokeStyle=cfg.axis;
    ctx.lineWidth=4;
    ctx.beginPath();
    ctx.moveTo(left,top);
    ctx.lineTo(left,bottom);
    ctx.lineTo(right,bottom);
    ctx.stroke();
    ctx.font='22px Arial, sans-serif';
    ctx.fillStyle=cfg.text;
    ctx.textAlign='right';
    ctx.textBaseline='middle';
    for(let i=0;i<=5;i++) {
      const val=i*20;
      const py=bottom-(val/100)*(bottom-top);
      ctx.strokeStyle=cfg.grid;
      ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(left,py); ctx.lineTo(right,py); ctx.stroke();
      ctx.fillStyle=cfg.text;
      ctx.fillText(String(val),left-16,py);
    }
    const barW=Math.min(80,(right-left)/(valid.length*2.4));
    ctx.textAlign='center';
    valid.forEach((row,i)=>{
      const px=left+(i+0.65)*(right-left)/valid.length;
      const barH=Math.max(0,Math.min(100,row[metric]))/100*(bottom-top);
      ctx.fillStyle=color;
      ctx.fillRect(px-barW/2,bottom-barH,barW,barH);
      ctx.font='700 24px Arial, sans-serif';
      ctx.fillText(row.label,px,bottom+28);
    });
    ctx.save();
    ctx.translate(x+26,top+(bottom-top)/2);
    ctx.rotate(-Math.PI/2);
    ctx.font='700 26px Arial, sans-serif';
    ctx.textAlign='center';
    ctx.fillText(`${metricKind==='width'?'Width':'Area'} closure (%)`,0,0);
    ctx.restore();
    ctx.font='700 26px Arial, sans-serif';
    ctx.textAlign='center';
    ctx.fillText('Incubation time',left+(right-left)/2,y+h-26);
    ctx.restore();
  }

  function drawNormalizedLinePanel(ctx,rows,x,y,w,h,metricKind='area',style='grayscale',includeHeader=true) {
    const metric=metricKind==='width'?'widthNormalizedPct':'areaNormalizedPct';
    const label=metricKind==='width'?'Width':'Area';
    const cfg=figureStyleConfig(style);
    const color=metricFigureColor(metricKind,style);
    const valid=rows.filter(row=>Number.isFinite(row[metric]));
    if(valid.length<2) return;
    ctx.save();
    ctx.fillStyle='#ffffff';
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle=cfg.text;
    if(includeHeader) {
      ctx.font='700 34px Arial, sans-serif';
      ctx.fillText('C',x,y-24);
      ctx.font='700 30px Arial, sans-serif';
      ctx.fillText(`Normalized ${label.toLowerCase()}`,x+76,y-24);
    }
    const left=x+95, right=x+w-35, top=y+(includeHeader?50:28), bottom=y+h-90;
    const minX=Math.min(...valid.map(r=>r.x)), maxX=Math.max(...valid.map(r=>r.x));
    const xToPx=v=>left+(v-minX)*(right-left)/(maxX-minX||1);
    const yToPx=v=>bottom-(v/110)*(bottom-top);
    ctx.strokeStyle=cfg.axis;
    ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(left,top); ctx.lineTo(left,bottom); ctx.lineTo(right,bottom); ctx.stroke();
    ctx.font='22px Arial, sans-serif';
    ctx.textAlign='right';
    ctx.textBaseline='middle';
    for(let i=0;i<=5;i++) {
      const val=i*20;
      const py=yToPx(val);
      ctx.strokeStyle=cfg.grid; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(left,py); ctx.lineTo(right,py); ctx.stroke();
      ctx.fillStyle=cfg.text; ctx.fillText(String(val),left-16,py);
    }
    ctx.strokeStyle=color; ctx.lineWidth=5; ctx.lineJoin='round'; ctx.lineCap='round';
    ctx.beginPath();
    valid.forEach((row,i)=>{
      const px=xToPx(row.x), py=yToPx(row[metric]);
      if(i) ctx.lineTo(px,py); else ctx.moveTo(px,py);
    });
    ctx.stroke();
    valid.forEach(row=>{
      const px=xToPx(row.x), py=yToPx(row[metric]);
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(px,py,7,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=color; ctx.lineWidth=4; ctx.stroke();
    });
    ctx.textAlign='center';
    ctx.fillStyle=cfg.text;
    ctx.font='700 24px Arial, sans-serif';
    valid.forEach(row=>ctx.fillText(row.label,xToPx(row.x),bottom+28));
    ctx.save();
    ctx.translate(x+26,top+(bottom-top)/2);
    ctx.rotate(-Math.PI/2);
    ctx.font='700 26px Arial, sans-serif';
    ctx.textAlign='center';
    ctx.fillText('% of 0h',0,0);
    ctx.restore();
    ctx.font='700 24px Arial, sans-serif';
    ctx.textAlign='left';
    const lx=left+20, ly=y+h-28;
    ctx.fillStyle=color; ctx.fillRect(lx,ly-16,30,10);
    ctx.fillStyle=cfg.text; ctx.fillText(label,lx+42,ly-10);
    ctx.restore();
  }

  function drawOverlayGridBlock(groupLabel, samples, style='grayscale') {
    const cfg=figureStyleConfig(style);
    const available=samples.slice(0,48).filter(sample=>storedContourForSample(sample));
    if(!available.length) return null;
    const W=1360,H=1100;
    const canvas=document.createElement('canvas');
    canvas.width=W; canvas.height=H;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,W,H);
    const gap=18;
    const grid=computeFigureGrid(available.length,W,H-90);
    const cellW=grid.cellW;
    const cellH=grid.cellH-40;
    const tileH=cellH+40;
    const overlays=available.map(sample=>({
      sample,
      overlay:groupOverlayCanvas(sample,{style,targetWidth:cellW,targetHeight:cellH})
    })).filter(item=>item.overlay);
    overlays.forEach((item,i)=>{
      const col=i%grid.cols;
      const row=Math.floor(i/grid.cols);
      const x=col*(cellW+gap);
      const y=40+row*(tileH+gap);
      ctx.fillStyle=cfg.text;
      ctx.font=`700 ${Math.max(18,Math.min(34,cellW/8))}px Arial, sans-serif`;
      ctx.textAlign='center';
      ctx.fillText(item.sample.time||String(i+1),x+cellW/2,y-12);
      drawFittedImage(ctx,item.overlay.canvas,x,y,cellW,cellH);
      ctx.strokeStyle='#ffffff';
      ctx.lineWidth=Math.max(2,Math.min(5,cellW/80));
      ctx.strokeRect(x,y,cellW,cellH);
    });
    return canvas;
  }

  function drawClosureBarBlock(rows, metricKind='area', style='grayscale') {
    const W=860,H=520;
    const canvas=document.createElement('canvas');
    canvas.width=W; canvas.height=H;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,W,H);
    drawClosureBars(ctx,rows,0,0,W,H,metricKind,style,false);
    return canvas;
  }

  function drawNormalizedLineBlock(rows, metricKind='area', style='grayscale') {
    const W=860,H=520;
    const canvas=document.createElement('canvas');
    canvas.width=W; canvas.height=H;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,W,H);
    drawNormalizedLinePanel(ctx,rows,0,0,W,H,metricKind,style,false);
    return canvas;
  }

  function computeFigureGrid(count, maxW, maxH) {
    const n=Math.max(1,Math.min(48,count));
    let best=null;
    for(let cols=1;cols<=n;cols++) {
      const rows=Math.ceil(n/cols);
      const cellW=(maxW-(cols-1)*18)/cols;
      const cellH=(maxH-(rows-1)*58)/rows;
      const size=Math.min(cellW,cellH);
      const shapePenalty=Math.abs(cols-rows)*18;
      const unusedPenalty=(cols*rows-n)*22;
      const score=size-shapePenalty-unusedPenalty;
      if(!best||score>best.score) best={cols,rows,cellW,cellH,size,score};
    }
    return best;
  }

  function drawFigure2StylePanel(rows, groupLabel, samples, metricKind='area', style='grayscale') {
    const cfg=figureStyleConfig(style);
    const available=samples.slice(0,48).filter(sample=>storedContourForSample(sample));
    if(!available.length||rows.length<2) return null;
    const W=2600,H=1550;
    const canvas=document.createElement('canvas');
    canvas.width=W; canvas.height=H;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle=cfg.text;
    ctx.font='700 58px Arial, sans-serif';
    ctx.fillText('A',70,86);
    ctx.font='700 42px Arial, sans-serif';
    ctx.fillText(groupLabel,145,86);
    const gridX=145, gridY=145, gap=18;
    const gridMaxW=1360, gridMaxH=1100;
    const grid=computeFigureGrid(available.length,gridMaxW,gridMaxH);
    const cellW=grid.cellW;
    const cellH=grid.cellH-40;
    const tileH=cellH+40;
    const overlays=available.map(sample=>({
      sample,
      overlay:groupOverlayCanvas(sample,{style,targetWidth:cellW,targetHeight:cellH})
    })).filter(item=>item.overlay);
    overlays.forEach((item,i)=>{
      const col=i%grid.cols;
      const row=Math.floor(i/grid.cols);
      const x=gridX+col*(cellW+gap);
      const y=gridY+row*(tileH+gap);
      ctx.fillStyle=cfg.text;
      ctx.font=`700 ${Math.max(18,Math.min(34,cellW/8))}px Arial, sans-serif`;
      ctx.textAlign='center';
      ctx.fillText(item.sample.time||String(i+1),x+cellW/2,y-12);
      drawFittedImage(ctx,item.overlay.canvas,x,y,cellW,cellH);
      ctx.strokeStyle='#ffffff';
      ctx.lineWidth=Math.max(2,Math.min(5,cellW/80));
      ctx.strokeRect(x,y,cellW,cellH);
    });
    const usedRows=Math.ceil(overlays.length/grid.cols);
    const gridBottom=gridY+usedRows*(tileH+gap)-gap;
    ctx.textAlign='left';
    ctx.fillStyle=cfg.text;
    ctx.font='700 30px Arial, sans-serif';
    ctx.fillText('Contour overlay',gridX,gridBottom+45);
    ctx.font='500 26px Arial, sans-serif';
    ctx.fillStyle=cfg.muted;
    const countNote=samples.length>48?'First 48 analysed images are shown.':'Same analysed group, arranged by timepoint';
    ctx.fillText(countNote,gridX,gridBottom+82);
    drawClosureBars(ctx,rows,1580,170,860,520,metricKind,style,true);
    drawNormalizedLinePanel(ctx,rows,1580,925,860,520,metricKind,style,true);
    return canvas;
  }

  function pptFittedImageBox(imgW, imgH, x, y, w, h) {
    const ratio=Math.max(w/imgW,h/imgH);
    const shownW=imgW*ratio;
    const shownH=imgH*ratio;
    return {
      x:x-(shownW-w)/2,
      y:y-(shownH-h)/2,
      w:shownW,
      h:shownH
    };
  }

  function buildEditablePanelSlide(rows, groupLabel, samples, metricKind='area', style='grayscale') {
    const gridBlock=drawOverlayGridBlock(groupLabel,samples,style);
    const barBlock=drawClosureBarBlock(rows,metricKind,style);
    const lineBlock=drawNormalizedLineBlock(rows,metricKind,style);
    if(!gridBlock||rows.length<2) return null;
    let nextId=2;
    const elements=[];
    const media=[];
    const addText=(name,text,x,y,w,h,size,bold=false,color='#111827',align='l')=>elements.push(pptText(nextId++,name,text,x,y,w,h,size,bold,color,align));
    const addPic=(name,canvas,x,y,w,h)=>{
      media.push({bytes:canvasToPngBytes(canvas)});
      elements.push(pptPic(nextId++,name,`rId${media.length}`,x,y,w,h));
    };

    addText('Panel A','A',70,34,70,60,34,true);
    addText('Group title',groupLabel,145,38,980,60,24,true);
    const gridX=145;
    addPic('Panel A image grid',gridBlock,gridX,145,1360,1100);
    const gridBottom=1245;
    addText('Contour overlay label','Contour overlay',gridX,gridBottom+28,420,32,18,true);
    addText('Contour overlay note',samples.length>48?'First 48 analysed images are shown.':'Same analysed group, arranged by timepoint',gridX,gridBottom+62,720,32,15,false,'#52615F');

    const metricLabel=metricKind==='width'?'Width':'Area';
    const bx=1580, by=170, bw=860, bh=520;
    addText('Panel B','B',bx,by-76,55,48,24,true);
    addText('Panel B title',`${metricLabel} closure`,bx+76,by-72,420,44,18,true);
    addPic('Panel B bar plot',barBlock,bx,by,bw,bh);

    const lx=1580, ly=925, lw=860, lh=520;
    addText('Panel C','C',lx,ly-76,55,48,24,true);
    addText('Panel C title',`Normalized ${metricLabel.toLowerCase()}`,lx+76,ly-72,500,44,18,true);
    addPic('Panel C line plot',lineBlock,lx,ly,lw,lh);
    return {elements,media};
  }

  function groupById(id) {
    return groupOptions().find(group=>group.id===id)||null;
  }

  function groupSamplesById(groupId) {
    const group=groupById(groupId);
    return group ? group.sampleIds.map(id=>sampleById(id)).filter(Boolean) : [];
  }

  function resultForSample(sample) {
    const candidate=state.manualOverrides[sample.id]?.result||state.groupResults[sample.id]||(state.sample?.id===sample.id?state.result:null);
    return resultMatchesCurrentQc(sample,candidate)?candidate:null;
  }

  function storedContourForSample(sample) {
    const result=resultForSample(sample);
    if(!result) return null;
    const override=state.manualOverrides[sample.id];
    const active=state.sample?.id===sample.id;
    const source=override?.sourceData||result.src||(active?state.sourceData:null);
    const field=override?.fieldData||result.field||(active?state.fieldData:null);
    const mask=override?.mask||result.mask||(active?state.maskData:null);
    const width=override?.width||result.analysisW||source?.width;
    const height=override?.height||result.analysisH||source?.height;
    if(!source||!mask||!width||!height||mask.length!==width*height) return null;
    return {result,source,field,mask,width,height};
  }

  function uniqueIds(list) {
    return [...new Set((list||[]).filter(Boolean))];
  }

  function resetLockedQcSnapshot() {
    state.lockedQcSnapshot=null;
  }

  function createQcStateDefaults() {
    return {
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
    };
  }

  function qcFingerprint(qc={}) {
    const crop=qc.cropRatio
      ? ['x','y','w','h'].map(key=>Number(Number(qc.cropRatio[key]||0).toFixed(6)))
      : null;
    return JSON.stringify({
      orientation:qc.orientation==='horizontal'?'horizontal':'vertical',
      crop,
      cropSaved:!!qc.cropSaved,
      cropReset:!!qc.cropReset,
      rotation:(Number(qc.rotation)||0)%360,
      fineRotation:Number(Number(qc.fineRotation||0).toFixed(3)),
      autoCropFov:!!qc.autoCropFov,
      fovCutoff:qc.fovCutoff!==null&&Number.isFinite(Number(qc.fovCutoff))
        ? Number(Number(qc.fovCutoff).toFixed(3))
        : null,
      excluded:!!qc.excluded
    });
  }

  function qcStateForSample(sampleId) {
    const store=state.imageQcState||(state.imageQcState={});
    return store[sampleId]||(store[sampleId]=createQcStateDefaults());
  }

  function qcFingerprintForSample(sampleId) {
    return qcFingerprint(qcStateForSample(sampleId));
  }

  function resultMatchesCurrentQc(sample, result) {
    if(!sample?.id||!result) return false;
    return result.qcFingerprint===qcFingerprintForSample(sample.id);
  }

  function invalidateAnalysisForQcChange(sampleId, before, after) {
    if(qcFingerprint(before)===qcFingerprint(after)) return false;
    delete state.groupResults[sampleId];
    delete state.manualOverrides[sampleId];
    if(state.sample?.id===sampleId) {
      state.result=null;
      state.maskData=null;
      state.autoMaskData=null;
      state.fieldData=null;
      state.sourceData=null;
      state.grayData=null;
      state.varMap=null;
    }
    return true;
  }

  function cropForQcSample(qc, template) {
    if(qc?.cropReset) return null;
    if(qc?.autoCropFov) return qc.cropRatio||null;
    if(qc?.cropSaved&&qc.cropRatio) return qc.cropRatio;
    return template||qc?.cropRatio||null;
  }

  function qcPreviewCrop(qc, crop) {
    return qc?.cropSaved&&crop?.active?crop:null;
  }

  function qcCropAutoAdvanceTarget(currentIndex, sampleCount) {
    return currentIndex>=0&&currentIndex<sampleCount-1?currentIndex+1:null;
  }

  function currentGroupCropTemplate() {
    const group=selectedGroup();
    return (group?.id&&state.lastQcCropTemplateByGroup[group.id])||state.lastQcCropTemplate||null;
  }

  function shouldOpenQcCropTemplate(qc, template) {
    return !!template&&!qc?.cropSaved&&!qc?.cropReset&&!qc?.autoCropFov;
  }

  function qcAdvanceMessage(savedSample, activeSample, activeIndex, sampleCount) {
    const savedLabel=savedSample?.time||savedSample?.path||'Image';
    const activeLabel=activeSample?.time||activeSample?.path||'next image';
    return `${savedLabel} saved — now viewing ${activeLabel} (image ${activeIndex+1} of ${sampleCount})`;
  }

  function showQcAdvanceFeedback(savedSample, activeSample, activeIndex, sampleCount) {
    if(!savedSample||!activeSample) return;
    state.qcArrivalSampleId=activeSample.id;
    if(state.qcArrivalTimer) clearTimeout(state.qcArrivalTimer);
    if(el.qcAdvanceNotice) {
      el.qcAdvanceNotice.textContent=`✓ ${qcAdvanceMessage(savedSample,activeSample,activeIndex,sampleCount)}`;
      el.qcAdvanceNotice.hidden=false;
    }
    renderQcImageList();
    state.qcArrivalTimer=setTimeout(()=>{
      state.qcArrivalSampleId='';
      state.qcArrivalTimer=null;
      if(el.qcAdvanceNotice) el.qcAdvanceNotice.hidden=true;
      renderQcImageList();
    },2200);
  }

  // Auto-detect if an image needs cropping based on border analysis
  function detectImageBorderIssues(imgElement) {
    if(!imgElement || !imgElement.complete || !imgElement.naturalWidth) return false;

    const canvas = document.createElement('canvas');
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    // Sample the borders (top, bottom, left, right edges)
    const edgeSampleSize = Math.min(50, Math.floor(w / 4), Math.floor(h / 4));
    const darkPixelThreshold = 40; // Pixels darker than this are considered "dark"
    const darkFractionThreshold = 0.4; // If >40% of edge pixels are dark, flag it

    let topDark = 0, bottomDark = 0, leftDark = 0, rightDark = 0;
    let topTotal = 0, bottomTotal = 0, leftTotal = 0, rightTotal = 0;

    // Sample top edge (horizontal strip along top)
    for (let y = 0; y < edgeSampleSize; y++) {
      for (let x = 0; x < w; x += Math.max(1, Math.floor(w / 100))) {
        const idx = (y * w + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (brightness < darkPixelThreshold) topDark++;
        topTotal++;
      }
    }

    // Sample bottom edge
    for (let y = h - edgeSampleSize; y < h; y++) {
      for (let x = 0; x < w; x += Math.max(1, Math.floor(w / 100))) {
        const idx = (y * w + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (brightness < darkPixelThreshold) bottomDark++;
        bottomTotal++;
      }
    }

    // Sample left edge
    for (let x = 0; x < edgeSampleSize; x++) {
      for (let y = 0; y < h; y += Math.max(1, Math.floor(h / 100))) {
        const idx = (y * w + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (brightness < darkPixelThreshold) leftDark++;
        leftTotal++;
      }
    }

    // Sample right edge
    for (let x = w - edgeSampleSize; x < w; x++) {
      for (let y = 0; y < h; y += Math.max(1, Math.floor(h / 100))) {
        const idx = (y * w + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (brightness < darkPixelThreshold) rightDark++;
        rightTotal++;
      }
    }

    // Check if any edge has too many dark pixels
    const topDarkFrac = topDark / topTotal;
    const bottomDarkFrac = bottomDark / bottomTotal;
    const leftDarkFrac = leftDark / leftTotal;
    const rightDarkFrac = rightDark / rightTotal;

    const hasDarkCorners = (
      topDarkFrac > darkFractionThreshold ||
      bottomDarkFrac > darkFractionThreshold ||
      leftDarkFrac > darkFractionThreshold ||
      rightDarkFrac > darkFractionThreshold
    );

    return hasDarkCorners;
  }

  function updateQcState(sampleId, patch) {
    if(!sampleId) return null;
    const current=qcStateForSample(sampleId);
    const next={...current,...patch,editedAt:Date.now()};
    invalidateAnalysisForQcChange(sampleId,current,next);
    state.imageQcState[sampleId]=next;
    resetLockedQcSnapshot();
    return next;
  }

  function builderPanelLayoutDefaults() {
    return {
      A:{x:40,y:30,w:1400,h:1490,title:'Representative wound-edge morphology',font:'Arial',titleSize:34,titleWeight:700},
      B:{x:1580,y:30,w:1020,h:700,title:'Wound closure',font:'Arial',titleSize:34,titleWeight:700},
      C:{x:1580,y:820,w:1020,h:700,title:'Normalized wound area',font:'Arial',titleSize:34,titleWeight:700}
    };
  }

  function builderPanelsOverlap(a,b) {
    return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  }

  function snapBuilderPanelPosition(position,panel,layout,canvas={width:2600,height:1580},grid=20) {
    const maxX=Math.max(0,canvas.width-panel.w);
    const maxY=Math.max(0,canvas.height-panel.h);
    const x=Math.max(0,Math.min(maxX,Math.round(Number(position.x||0)/grid)*grid));
    const y=Math.max(0,Math.min(maxY,Math.round(Number(position.y||0)/grid)*grid));
    const candidate={...panel,x,y};
    const valid=!Object.values(layout||{}).some(other=>other&&builderPanelsOverlap(candidate,other));
    return {x,y,valid};
  }

  function builderPanelState() {
    const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
    const defaults=builderPanelLayoutDefaults();
    if(!builderState.panelLayout) {
      builderState.panelLayout=Object.fromEntries(Object.entries(defaults).map(([id,panel])=>[id,{x:panel.x,y:panel.y,w:panel.w,h:panel.h}]));
    }
    if(!builderState.panelTitles) builderState.panelTitles={};
    if(!builderState.panelTypography) {
      builderState.panelTypography=Object.fromEntries(Object.entries(defaults).map(([id,panel])=>[id,{font:panel.font,titleSize:panel.titleSize,titleWeight:panel.titleWeight}]));
    }
    return builderState;
  }

  function builderPanelConfig(id, settings=builderSettings()) {
    const defaults=builderPanelLayoutDefaults();
    const builderState=builderPanelState();
    const defaultTitle=id==='C'&&settings.metric==='width'?'Normalized wound width':defaults[id].title;
    return {
      ...defaults[id],
      ...(builderState.panelLayout[id]||{}),
      ...(builderState.panelTypography[id]||{}),
      title:builderState.panelTitles[id]||defaultTitle
    };
  }

  function builderPanelConfigs(settings=builderSettings()) {
    return Object.fromEntries(['A','B','C'].map(id=>[id,builderPanelConfig(id,settings)]));
  }

  function syncPublicationBuilderSelections(groups=groupOptions()) {
    const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
    const valid=new Set(groups.map(group=>group.id));
    const defaultControl=groups[0]?.id||'';
    const defaultTreatment=groups[1]?.id||groups[0]?.id||'';
    builderState.controlReplicateIds=uniqueIds((builderState.controlReplicateIds||[]).filter(id=>valid.has(id)));
    builderState.treatmentReplicateIds=uniqueIds((builderState.treatmentReplicateIds||[]).filter(id=>valid.has(id)));
    if(!builderState.controlReplicateIds.length&&defaultControl) builderState.controlReplicateIds=[defaultControl];
    if(!builderState.treatmentReplicateIds.length&&defaultTreatment) builderState.treatmentReplicateIds=[defaultTreatment];
    builderState.controlRepresentativeId=valid.has(builderState.controlRepresentativeId)?builderState.controlRepresentativeId:(builderState.controlReplicateIds[0]||defaultControl);
    builderState.treatmentRepresentativeId=valid.has(builderState.treatmentRepresentativeId)?builderState.treatmentRepresentativeId:(builderState.treatmentReplicateIds[0]||defaultTreatment);
    if(builderState.controlReplicateIds.length&&!builderState.controlReplicateIds.includes(builderState.controlRepresentativeId)) {
      builderState.controlRepresentativeId=builderState.controlReplicateIds[0];
    }
    if(builderState.treatmentReplicateIds.length&&!builderState.treatmentReplicateIds.includes(builderState.treatmentRepresentativeId)) {
      builderState.treatmentRepresentativeId=builderState.treatmentReplicateIds[0];
    }
  }

  function renderBuilderReplicateOptions() {
    if(!el.builderControlReplicates||!el.builderTreatmentReplicates) return;
    const groups=groupOptions();
    syncPublicationBuilderSelections(groups);
    const builderState=state.publicationBuilderState;
    const render=(host,key,label)=>{
      if(!groups.length) {
        host.innerHTML='<div class="builder-replicate-empty">No analyzed groups yet.</div>';
        return;
      }
      host.innerHTML=groups.map(group=>`
        <label class="builder-replicate-row">
          <input type="checkbox" data-builder-replicate="${escHtml(key)}" value="${escHtml(group.id)}" ${builderState[key].includes(group.id)?'checked':''}>
          <span>${escHtml(group.label)}</span>
        </label>
      `).join('');
      host.dataset.conditionLabel=label;
    };
    render(el.builderControlReplicates,'controlReplicateIds','Control');
    render(el.builderTreatmentReplicates,'treatmentReplicateIds','Treatment');
  }

  function selectedBuilderReplicateIds(key, fallback=[]) {
    const host=key==='controlReplicateIds'?el.builderControlReplicates:el.builderTreatmentReplicates;
    if(host) {
      const checked=[...host.querySelectorAll('input[data-builder-replicate]:checked')].map(input=>input.value);
      if(checked.length) return uniqueIds(checked);
    }
    return uniqueIds(fallback);
  }

  function builderReplicateStateKey(value) {
    return value==='controlReplicateIds'||value==='treatmentReplicateIds'?value:'';
  }

  function builderTemplateMode() {
    return el.builderTemplate?.value==='multi-treatment'?'multi-treatment':'control-treatment';
  }

  function normalizeAdditionalTreatmentArms(groups=groupOptions()) {
    const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
    const valid=new Set(groups.map(group=>group.id));
    const existing=Array.isArray(builderState.additionalTreatmentArms)?builderState.additionalTreatmentArms:[];
    const firstExtraTreatmentArmKey='treatment-2';
    builderState.additionalTreatmentArms=existing
      .map((arm,index)=>({
        id:arm.id||(index===0?firstExtraTreatmentArmKey:`treatment-${index+2}`),
        label:(arm.label||`Treatment ${index+2}`).trim()||`Treatment ${index+2}`,
        groupId:valid.has(arm.groupId)?arm.groupId:(groups[index+2]?.id||groups[index+1]?.id||groups[0]?.id||''),
        replicateIds:uniqueIds((arm.replicateIds||[]).filter(id=>valid.has(id)))
      }))
      .filter(arm=>arm.groupId&&valid.has(arm.groupId));
    builderState.additionalTreatmentArms.forEach(arm=>{
      if(!arm.replicateIds.length&&arm.groupId) arm.replicateIds=[arm.groupId];
      if(!arm.replicateIds.includes(arm.groupId)) arm.groupId=arm.replicateIds[0]||arm.groupId;
    });
    return builderState.additionalTreatmentArms;
  }

  function builderTreatmentArms(builderState=state.publicationBuilderState||{}, groups=groupOptions()) {
    const primaryReplicateIds=uniqueIds((builderState.treatmentReplicateIds||[]).filter(id=>groupById(id)));
    const primaryRepresentativeId=builderState.treatmentRepresentativeId||primaryReplicateIds[0]||groups[1]?.id||groups[0]?.id||'';
    const primaryLabel=(el.builderTreatmentLabel?.value||'Treatment').trim()||'Treatment';
    const primary=[{
      id:'treatment-1',
      conditionKey:'treatment',
      label:primaryLabel,
      representativeId:primaryRepresentativeId,
      replicateIds:primaryReplicateIds.length?primaryReplicateIds:(primaryRepresentativeId?[primaryRepresentativeId]:[])
    }];
    if(builderTemplateMode()!=='multi-treatment') return primary;
    return [
      ...primary,
      ...normalizeAdditionalTreatmentArms(groups).map((arm,index)=>({
        id:arm.id||`treatment-${index+2}`,
        conditionKey:`treatment-${index+2}`,
        label:arm.label||`Treatment ${index+2}`,
        representativeId:arm.groupId,
        replicateIds:arm.replicateIds?.length?arm.replicateIds:(arm.groupId?[arm.groupId]:[])
      }))
    ];
  }

  function builderConditionSeries(settings) {
    return [
      {
        id:'control',
        conditionKey:'control',
        label:settings.controlLabel,
        representativeId:settings.controlId,
        replicateIds:settings.controlReplicateIds||[]
      },
      ...(settings.treatmentArms||[])
    ];
  }

  function builderConditionColors(settings, style='grayscale') {
    const series=builderConditionSeries(settings);
    const colorPalette=['#0B2230','#00B8A9','#2F6FED','#D97706','#7C3AED','#BE123C'];
    const grayPalette=['#111111','#666666','#999999','#444444','#BBBBBB','#777777'];
    const palette=style==='color'?colorPalette:grayPalette;
    return Object.fromEntries(series.map((item,index)=>[item.conditionKey,palette[index%palette.length]]));
  }

  function builderComparisonLabel(settings) {
    const labels=builderConditionSeries(settings).map(item=>item.label).filter(Boolean);
    if(labels.length<=2) return `${settings.controlLabel} vs ${settings.treatmentLabel}`;
    return `${settings.controlLabel} vs ${labels.slice(1).join(' vs ')}`;
  }

  function builderReplicateSummary(settings) {
    if(settings.replicate) return settings.replicate;
    return builderConditionSeries(settings)
      .map(item=>`${item.label}=${(item.replicateIds||[]).length}`)
      .join('; ');
  }

  function renderBuilderTreatmentArms() {
    if(!el.builderTreatmentArms) return;
    const groups=groupOptions();
    const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
    const multi=builderTemplateMode()==='multi-treatment';
    const control=el.builderTreatmentArms.closest('.builder-treatment-arms-control');
    if(control) control.hidden=!multi;
    if(!multi) {
      el.builderTreatmentArms.innerHTML='';
      return;
    }
    const arms=normalizeAdditionalTreatmentArms(groups);
    el.builderTreatmentArms.innerHTML=arms.map((arm,index)=>`
      <div class="builder-treatment-arm" data-builder-treatment-arm="${escHtml(arm.id)}">
        <div class="builder-treatment-arm-head">
          <span>Treatment ${index+2}</span>
          <button class="icon-btn danger" type="button" data-remove-treatment-arm="${escHtml(arm.id)}" title="Remove treatment group" aria-label="Remove treatment group">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 4h10M6 4V3h4v1M5 6v6M8 6v6M11 6v6M4.5 4l.5 10h6l.5-10" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div class="builder-treatment-arm-grid">
          <label>Condition label
            <input class="value-input" data-treatment-arm-label="${escHtml(arm.id)}" type="text" value="${escHtml(arm.label)}">
          </label>
          <label>Representative group
            <select data-treatment-arm-group="${escHtml(arm.id)}">
              ${groups.filter(group=>arm.replicateIds.includes(group.id)).map(group=>`<option value="${escHtml(group.id)}" ${group.id===arm.groupId?'selected':''}>${escHtml(group.label)}</option>`).join('')}
            </select>
          </label>
          <div>
            <label>Replicates</label>
            <div class="builder-replicates builder-treatment-arm-replicates">
              ${groups.map(group=>`
                <label class="builder-replicate-row">
                  <input type="checkbox" data-treatment-arm-replicate="${escHtml(arm.id)}" value="${escHtml(group.id)}" ${arm.replicateIds.includes(group.id)?'checked':''}>
                  <span>${escHtml(group.label)}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function selectedBuilderTreatmentArmReplicates(armId, fallback=[]) {
    if(!el.builderTreatmentArms) return uniqueIds(fallback);
    const checked=[...el.builderTreatmentArms.querySelectorAll('input[data-treatment-arm-replicate]:checked')]
      .filter(input=>input.dataset.treatmentArmReplicate===armId)
      .map(input=>input.value);
    return uniqueIds(checked.length?checked:fallback);
  }

  function addBuilderTreatmentArm() {
    const groups=groupOptions();
    if(!groups.length) return;
    if(el.builderTemplate) el.builderTemplate.value='multi-treatment';
    const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
    const arms=normalizeAdditionalTreatmentArms(groups);
    const used=new Set([
      ...(builderState.controlReplicateIds||[]),
      ...(builderState.treatmentReplicateIds||[]),
      ...arms.map(arm=>arm.groupId)
    ]);
    const nextGroup=groups.find(group=>!used.has(group.id))||groups[arms.length+2]||groups[0];
    const index=arms.length+2;
    arms.push({
      id:`treatment-${index}`,
      label:nextGroup?.label||`Treatment ${index}`,
      groupId:nextGroup?.id||'',
      replicateIds:nextGroup?.id?[nextGroup.id]:[]
    });
    builderState.additionalTreatmentArms=arms;
    populateBuilderGroupSelects();
    markBuilderPreviewDirty();
  }

  function populateBuilderGroupSelects() {
    if(!el.builderControlGroup||!el.builderTreatmentGroup) return;
    const groups=groupOptions();
    syncPublicationBuilderSelections(groups);
    const builderState=state.publicationBuilderState;
    const fillSelect=(select, ids, fallbackId)=>{
      const options=ids.map(id=>groupById(id)).filter(Boolean);
      select.innerHTML='';
      options.forEach(group=>{
        const option=document.createElement('option');
        option.value=group.id;
        option.textContent=group.label;
        select.appendChild(option);
      });
      select.disabled=!options.length;
      if(options.length) select.value=options.some(group=>group.id===fallbackId)?fallbackId:options[0].id;
    };
    fillSelect(el.builderControlGroup,builderState.controlReplicateIds,builderState.controlRepresentativeId||groups[0]?.id);
    fillSelect(el.builderTreatmentGroup,builderState.treatmentReplicateIds,builderState.treatmentRepresentativeId||(groups[1]?.id||groups[0]?.id));
    renderBuilderReplicateOptions();
    renderBuilderTreatmentArms();
    if(el.exportBuilderFigure) el.exportBuilderFigure.disabled=groups.length<2;
  }

  function persistBuilderRepresentativeSelections() {
    const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
    builderState.controlRepresentativeId=el.builderControlGroup?.value||builderState.controlRepresentativeId||'';
    builderState.treatmentRepresentativeId=el.builderTreatmentGroup?.value||builderState.treatmentRepresentativeId||'';
  }

  function builderSettings() {
    persistBuilderRepresentativeSelections();
    populateBuilderGroupSelects();
    const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
    const controlId=el.builderControlGroup?.value||builderState.controlRepresentativeId||groupOptions()[0]?.id||'';
    const treatmentId=el.builderTreatmentGroup?.value||builderState.treatmentRepresentativeId||groupOptions()[1]?.id||controlId;
    builderState.controlRepresentativeId=controlId;
    builderState.treatmentRepresentativeId=treatmentId;
    const controlReplicateIds=selectedBuilderReplicateIds('controlReplicateIds',(builderState.controlReplicateIds||[]).filter(id=>groupById(id)));
    const treatmentReplicateIds=selectedBuilderReplicateIds('treatmentReplicateIds',(builderState.treatmentReplicateIds||[]).filter(id=>groupById(id)));
    builderState.controlReplicateIds=controlReplicateIds;
    builderState.treatmentReplicateIds=treatmentReplicateIds;
    const treatmentArms=builderTreatmentArms(builderState,groupOptions());
    return {
      template:builderTemplateMode(),
      controlId,
      treatmentId,
      controlReplicateIds,
      treatmentReplicateIds,
      treatmentArms,
      controlLabel:(el.builderControlLabel?.value||'Control').trim()||'Control',
      treatmentLabel:(el.builderTreatmentLabel?.value||'Treatment').trim()||'Treatment',
      cellType:(el.builderCellType?.value||'cells').trim()||'cells',
      replicate:(el.builderReplicate?.value||'').trim(),
      metric:el.builderMetricSelect?.value==='width'?'width':'area',
      scaleValue:Number(el.builderScaleValue?.value),
      scaleMode:el.builderScaleMode?.value||'um_per_pixel',
      pValue:(el.builderPValue?.value||'').trim(),
      stars:(el.builderStars?.value||'').trim()
    };
  }

  function builderGroupRows(groupId, conditionKey, conditionLabel, replicateLabel='') {
    const samples=groupSamplesById(groupId);
    const rows=samples.map((sample,index)=>{
      const r=resultForSample(sample);
      if(!r) return null;
      const parsed=parseTimeHours(sample.time);
      return {
        sample,index,conditionKey,conditionLabel,replicateGroupId:groupId,replicateLabel,
        x:Number.isFinite(parsed)?parsed:index+1,
        label:sample.time||String(index+1),
        areaPx:Number(r.area),
        areaPct:Number(r.areaPct),
        width:Number(r.wMean),
        medianWidth:Number(r.wMedian),
        qc:r.segmentationQualityScore,
        warnings:r.warnings||[]
      };
    }).filter(row=>row&&Number.isFinite(row.x)).sort((a,b)=>a.x-b.x||a.index-b.index);
    const base=rows[0]||{};
    return rows.map(row=>({
      ...row,
      areaNormalizedPct:Number.isFinite(base.areaPx)&&base.areaPx?row.areaPx*100/base.areaPx:null,
      widthNormalizedPct:Number.isFinite(base.width)&&base.width?row.width*100/base.width:null,
      areaClosurePct:Number.isFinite(base.areaPx)&&base.areaPx?100-(row.areaPx*100/base.areaPx):null,
      widthClosurePct:Number.isFinite(base.width)&&base.width?100-(row.width*100/base.width):null
    }));
  }

  function builderConditionRows(groupIds, representativeId, conditionKey, conditionLabel) {
    const ids=uniqueIds(groupIds);
    return ids.flatMap((groupId,index)=>builderGroupRows(groupId,conditionKey,conditionLabel,`R${index+1}`));
  }

  function average(values) {
    const valid=values.filter(Number.isFinite);
    return valid.length?valid.reduce((sum,value)=>sum+value,0)/valid.length:null;
  }

  function sampleStandardDeviation(values) {
    const valid=values.filter(Number.isFinite);
    if(valid.length<2) return null;
    const mean=average(valid);
    const variance=valid.reduce((sum,value)=>sum+(value-mean)**2,0)/(valid.length-1);
    return Math.sqrt(variance);
  }

  function aggregateBuilderConditionRows(rows, conditionKey, conditionLabel) {
    const grouped=new Map();
    rows.filter(row=>row.conditionKey===conditionKey).forEach(row=>{
      const key=String(row.x);
      if(!grouped.has(key)) grouped.set(key,[]);
      grouped.get(key).push(row);
    });
    return [...grouped.values()].map(groupRows=>{
      const first=groupRows[0];
      return {
        conditionKey,
        conditionLabel,
        x:first.x,
        label:first.label,
        replicateCount:groupRows.length,
        areaPx:average(groupRows.map(row=>row.areaPx)),
        areaPxSd:sampleStandardDeviation(groupRows.map(row=>row.areaPx)),
        width:average(groupRows.map(row=>row.width)),
        widthSd:sampleStandardDeviation(groupRows.map(row=>row.width)),
        medianWidth:average(groupRows.map(row=>row.medianWidth)),
        medianWidthSd:sampleStandardDeviation(groupRows.map(row=>row.medianWidth)),
        areaNormalizedPct:average(groupRows.map(row=>row.areaNormalizedPct)),
        areaNormalizedPctSd:sampleStandardDeviation(groupRows.map(row=>row.areaNormalizedPct)),
        widthNormalizedPct:average(groupRows.map(row=>row.widthNormalizedPct)),
        widthNormalizedPctSd:sampleStandardDeviation(groupRows.map(row=>row.widthNormalizedPct)),
        areaClosurePct:average(groupRows.map(row=>row.areaClosurePct)),
        areaClosurePctSd:sampleStandardDeviation(groupRows.map(row=>row.areaClosurePct)),
        widthClosurePct:average(groupRows.map(row=>row.widthClosurePct)),
        widthClosurePctSd:sampleStandardDeviation(groupRows.map(row=>row.widthClosurePct))
      };
    }).sort((a,b)=>a.x-b.x);
  }

  function builderFigureRows(settings=builderSettings()) {
    const controlRows=builderConditionRows(settings.controlReplicateIds,settings.controlId,'control',settings.controlLabel);
    const treatmentRows=(settings.treatmentArms||[]).flatMap(arm=>builderConditionRows(arm.replicateIds,arm.representativeId,arm.conditionKey,arm.label));
    return [...controlRows,...treatmentRows].sort((a,b)=>a.x-b.x||a.conditionKey.localeCompare(b.conditionKey));
  }

  function builderResultCoverage(settings) {
    const groupIds=uniqueIds([
      ...(settings.controlReplicateIds||[]),
      ...(settings.treatmentArms||[]).flatMap(arm=>arm.replicateIds||[])
    ]);
    const missingGroups=[];
    const missingSamples=[];
    let eligibleCount=0;
    groupIds.forEach(groupId=>{
      const group=groupById(groupId);
      const eligible=groupSamplesById(groupId).filter(sample=>!qcStateForSample(sample.id).excluded);
      eligibleCount+=eligible.length;
      const missing=eligible.filter(sample=>!storedContourForSample(sample));
      if(missing.length) {
        missingGroups.push({groupId,label:group?.label||groupId,missingCount:missing.length,totalCount:eligible.length});
        missingSamples.push(...missing);
      }
    });
    return {
      groupIds,
      eligibleCount,
      missingGroups,
      missingSamples,
      complete:groupIds.length>0&&eligibleCount>0&&missingSamples.length===0
    };
  }

  function builderGroupsHaveFreshResults(settings) {
    return builderResultCoverage(settings).complete;
  }

  function builderRepresentativeRows(settings=builderSettings()) {
    return [
      ...builderGroupRows(settings.controlId,'control',settings.controlLabel,'representative'),
      ...(settings.treatmentArms||[]).flatMap(arm=>builderGroupRows(arm.representativeId,arm.conditionKey,arm.label,'representative'))
    ].sort((a,b)=>a.x-b.x||a.conditionKey.localeCompare(b.conditionKey));
  }

  function builderPlotRows(settings=builderSettings(), rows=builderFigureRows(settings)) {
    return builderConditionSeries(settings)
      .flatMap(series=>aggregateBuilderConditionRows(rows,series.conditionKey,series.label))
      .sort((a,b)=>a.x-b.x||a.conditionKey.localeCompare(b.conditionKey));
  }

  function builderTimepoints(rows) {
    const map=new Map();
    rows.forEach(row=>{
      const key=String(row.x);
      if(!map.has(key)) map.set(key,{x:row.x,label:row.label});
    });
    return [...map.values()].sort((a,b)=>a.x-b.x);
  }

  function builderRowAt(rows, conditionKey, x) {
    return rows.find(row=>row.conditionKey===conditionKey&&row.x===x)||null;
  }

  function drawScaleBar(ctx,x,y,w,h,overlay,settings,cfg) {
    if(!Number.isFinite(settings.scaleValue)||settings.scaleValue<=0||!overlay) return null;
    const originalPixels=settings.scaleMode==='pixels_per_100um'
      ? settings.scaleValue
      : 100/settings.scaleValue;
    if(!Number.isFinite(originalPixels)||originalPixels<=0) return null;
    const ratio=Math.max(w/overlay.width,h/overlay.height);
    const barW=Math.max(34,Math.min(w*0.42,originalPixels*ratio));
    const barH=Math.max(5,Math.min(11,h*0.026));
    const bx=x+w-barW-26;
    const by=y+h-34;
    ctx.save();
    ctx.fillStyle=cfg.grayscale?'rgba(255,255,255,0.82)':'rgba(255,255,255,0.78)';
    ctx.fillRect(bx-10,by-22,barW+20,34);
    ctx.fillStyle=cfg.text;
    ctx.fillRect(bx,by,barW,barH);
    ctx.font='700 18px Arial, sans-serif';
    ctx.textAlign='center';
    ctx.textBaseline='bottom';
    ctx.fillText('100 um',bx+barW/2,by-4);
    ctx.restore();
    return {scale_bar:'100 um',scale_bar_px:originalPixels};
  }

  function drawBuilderErrorBar(ctx, centerX, mean, sd, yToPx, color) {
    if(!Number.isFinite(mean)||!Number.isFinite(sd)||sd<0) return;
    const top=yToPx(mean+sd);
    const bottom=yToPx(mean-sd);
    const cap=12;
    ctx.save();
    ctx.strokeStyle=color;
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(centerX,top);
    ctx.lineTo(centerX,bottom);
    ctx.moveTo(centerX-cap,top);
    ctx.lineTo(centerX+cap,top);
    ctx.moveTo(centerX-cap,bottom);
    ctx.lineTo(centerX+cap,bottom);
    ctx.stroke();
    ctx.restore();
  }

  function builderLegendLayout(series, width) {
    const count=Math.min(Array.isArray(series)?series.length:0,6);
    const perRow=count>=4?2:Math.max(1,count);
    const rows=Math.max(1,Math.ceil(count/Math.max(1,perRow)));
    return {
      count,
      perRow,
      rows,
      rowHeight:26,
      itemWidth:Math.max(110,width/Math.max(1,perRow))
    };
  }

  function builderLegendLabel(ctx, label, maxWidth) {
    const text=String(label||'');
    if(!ctx.measureText||ctx.measureText(text).width<=maxWidth) return text;
    let out=text;
    while(out.length>4&&ctx.measureText(`${out.slice(0,-1)}…`).width>maxWidth) out=out.slice(0,-1);
    return out.length>4?`${out}…`:text.slice(0,4);
  }

  function drawBuilderLegend(ctx, series, colors, x, y, width, cfg) {
    const legendLayout=builderLegendLayout(series,width);
    ctx.save();
    ctx.textAlign='left';
    ctx.textBaseline='alphabetic';
    ctx.font=`700 ${legendLayout.count>=4?18:21}px Arial, sans-serif`;
    series.slice(0,legendLayout.count).forEach((condition,index)=>{
      const row=Math.floor(index/legendLayout.perRow);
      const col=index%legendLayout.perRow;
      const lx=x+col*legendLayout.itemWidth;
      const ly=y+row*legendLayout.rowHeight;
      ctx.fillStyle=colors[condition.conditionKey]||cfg.text;
      ctx.fillRect(lx,ly-14,24,10);
      ctx.fillStyle=cfg.text;
      ctx.fillText(builderLegendLabel(ctx,condition.label,legendLayout.itemWidth-42),lx+32,ly-6);
    });
    ctx.restore();
    return legendLayout;
  }

  function drawBuilderClosurePlot(ctx,rows,x,y,w,h,settings,style='grayscale',includeHeader=true) {
    const cfg=figureStyleConfig(style);
    const metric='areaClosurePct';
    const timepoints=builderTimepoints(rows).filter(tp=>tp.x!==builderTimepoints(rows)[0]?.x);
    const series=builderConditionSeries(settings);
    const colors=builderConditionColors(settings,style);
    ctx.save();
    ctx.fillStyle='#fff'; ctx.fillRect(x,y,w,h);
    ctx.fillStyle=cfg.text;
    if(includeHeader) {
      ctx.font='700 34px Arial, sans-serif'; ctx.fillText('B',x,y-24);
      ctx.font='700 30px Arial, sans-serif'; ctx.fillText('Wound closure',x+76,y-24);
    }
    const left=x+95,right=x+w-35,top=y+48;
    const legendLayout=builderLegendLayout(series,right-left-56);
    const axisLabelY=y+h-24;
    const legendY=axisLabelY-36-((legendLayout.rows-1)*legendLayout.rowHeight);
    const bottom=Math.max(top+90,legendY-42);
    const yToPx=v=>bottom-(Math.max(0,Math.min(110,v))/110)*(bottom-top);
    ctx.strokeStyle=cfg.axis; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(left,top); ctx.lineTo(left,bottom); ctx.lineTo(right,bottom); ctx.stroke();
    ctx.font='22px Arial, sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle';
    for(let i=0;i<=5;i++) {
      const val=i*20, py=bottom-(val/100)*(bottom-top);
      ctx.strokeStyle=cfg.grid; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(left,py); ctx.lineTo(right,py); ctx.stroke();
      ctx.fillStyle=cfg.text; ctx.fillText(String(val),left-16,py);
    }
    const slotW=(right-left)/Math.max(1,timepoints.length);
    const barW=Math.min(44,slotW*0.62/Math.max(1,series.length));
    timepoints.forEach((tp,i)=>{
      series.forEach((condition,j)=>{
        const row=builderRowAt(rows,condition.conditionKey,tp.x);
        if(!row||!Number.isFinite(row[metric])) return;
        const center=left+slotW*(i+0.5)+(j-(series.length-1)/2)*(barW+5);
        const barH=Math.max(0,Math.min(110,row[metric]))/110*(bottom-top);
        ctx.fillStyle=colors[condition.conditionKey];
        ctx.fillRect(center-barW/2,bottom-barH,barW,barH);
        if(row.replicateCount>=2) {
          drawBuilderErrorBar(ctx,center,row[metric],row.areaClosurePctSd,yToPx,colors[condition.conditionKey]);
        }
      });
      ctx.fillStyle=cfg.text; ctx.textAlign='center'; ctx.font='700 22px Arial, sans-serif';
      ctx.fillText(tp.label,left+slotW*(i+0.5),bottom+28);
    });
    if(settings.stars) {
      ctx.fillStyle=cfg.text; ctx.font='700 30px Arial, sans-serif'; ctx.textAlign='center';
      ctx.fillText(settings.stars,right-80,top+35);
    }
    ctx.save(); ctx.translate(x+26,top+(bottom-top)/2); ctx.rotate(-Math.PI/2);
    ctx.font='700 26px Arial, sans-serif'; ctx.textAlign='center'; ctx.fillStyle=cfg.text;
    ctx.fillText('Wound closure (%)',0,0); ctx.restore();
    ctx.font='700 24px Arial, sans-serif'; ctx.textAlign='center';
    ctx.fillText('Time post scratch',left+(right-left)/2,axisLabelY);
    drawBuilderLegend(ctx,series,colors,left+28,legendY,right-left-56,cfg);
    ctx.restore();
  }

  function drawBuilderLinePlot(ctx,rows,x,y,w,h,settings,style='grayscale',includeHeader=true) {
    const cfg=figureStyleConfig(style);
    const metric=settings.metric==='width'?'widthNormalizedPct':'areaNormalizedPct';
    const sdMetric=`${metric}Sd`;
    const label=settings.metric==='width'?'Normalized width':'Normalized area';
    const seriesList=builderConditionSeries(settings);
    const colors=builderConditionColors(settings,style);
    const timepoints=builderTimepoints(rows);
    ctx.save();
    ctx.fillStyle='#fff'; ctx.fillRect(x,y,w,h);
    ctx.fillStyle=cfg.text;
    if(includeHeader) {
      ctx.font='700 34px Arial, sans-serif'; ctx.fillText('C',x,y-24);
      ctx.font='700 30px Arial, sans-serif'; ctx.fillText(label,x+76,y-24);
    }
    const left=x+95,right=x+w-35,top=y+48;
    const legendLayout=builderLegendLayout(seriesList,right-left-56);
    const legendY=y+h-36-((legendLayout.rows-1)*legendLayout.rowHeight);
    const bottom=Math.max(top+90,legendY-42);
    const minX=Math.min(...timepoints.map(tp=>tp.x)), maxX=Math.max(...timepoints.map(tp=>tp.x));
    const xToPx=v=>left+(v-minX)*(right-left)/(maxX-minX||1);
    const yToPx=v=>bottom-(Math.max(0,Math.min(110,v))/110)*(bottom-top);
    ctx.strokeStyle=cfg.axis; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(left,top); ctx.lineTo(left,bottom); ctx.lineTo(right,bottom); ctx.stroke();
    ctx.font='22px Arial, sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle';
    for(let i=0;i<=5;i++) {
      const val=i*20, py=yToPx(val);
      ctx.strokeStyle=cfg.grid; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(left,py); ctx.lineTo(right,py); ctx.stroke();
      ctx.fillStyle=cfg.text; ctx.fillText(String(val),left-16,py);
    }
    seriesList.forEach(condition=>{
      const series=rows.filter(row=>row.conditionKey===condition.conditionKey&&Number.isFinite(row[metric])).sort((a,b)=>a.x-b.x);
      ctx.strokeStyle=colors[condition.conditionKey]; ctx.lineWidth=5; ctx.lineJoin='round'; ctx.lineCap='round';
      ctx.beginPath();
      series.forEach((row,i)=>{ const px=xToPx(row.x), py=yToPx(row[metric]); if(i) ctx.lineTo(px,py); else ctx.moveTo(px,py); });
      ctx.stroke();
      series.forEach(row=>{
        if(row.replicateCount>=2) drawBuilderErrorBar(ctx,xToPx(row.x),row[metric],row[sdMetric],yToPx,colors[condition.conditionKey]);
      });
      series.forEach(row=>{ const px=xToPx(row.x), py=yToPx(row[metric]); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(px,py,7,0,Math.PI*2); ctx.fill(); ctx.strokeStyle=colors[condition.conditionKey]; ctx.lineWidth=4; ctx.stroke(); });
    });
    ctx.fillStyle=cfg.text; ctx.textAlign='center'; ctx.font='700 22px Arial, sans-serif';
    timepoints.forEach(tp=>ctx.fillText(tp.label,xToPx(tp.x),bottom+28));
    ctx.save(); ctx.translate(x+26,top+(bottom-top)/2); ctx.rotate(-Math.PI/2);
    ctx.font='700 26px Arial, sans-serif'; ctx.textAlign='center'; ctx.fillText('% of baseline',0,0); ctx.restore();
    drawBuilderLegend(ctx,seriesList,colors,left+28,legendY,right-left-56,cfg);
    ctx.restore();
  }

  function builderPanelFont(panel) {
    const family=String(panel.font||'Arial').replace(/["']/g,'');
    return `${Number(panel.titleWeight)||700} ${Number(panel.titleSize)||34}px "${family}", Arial, sans-serif`;
  }

  function drawBuilderPanelHeader(ctx, panelId, panel, cfg) {
    ctx.save();
    ctx.fillStyle=cfg.text;
    ctx.textAlign='left';
    ctx.textBaseline='alphabetic';
    ctx.font=builderPanelFont(panel);
    ctx.fillText(panelId,24,52);
    ctx.fillText(panel.title,78,52);
    ctx.restore();
  }

  function drawBuilderPanelA(panel, settings, representativeRows, timepoints, style='color') {
    const cfg=figureStyleConfig(style);
    const canvas=document.createElement('canvas');
    canvas.width=panel.w; canvas.height=panel.h;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    drawBuilderPanelHeader(ctx,'A',panel,cfg);
    const margin=24,labelW=78,gap=18,gridY=112;
    const series=builderConditionSeries(settings);
    const gridW=panel.w-margin*2;
    const colW=(gridW-labelW-gap*Math.max(0,series.length-1))/Math.max(1,series.length);
    const noteSpace=105;
    const rowH=Math.max(120,Math.min(350,(panel.h-gridY-noteSpace-(timepoints.length-1)*gap)/Math.max(1,timepoints.length)));
    ctx.fillStyle=cfg.text;
    ctx.font='700 28px Arial, sans-serif';
    ctx.textAlign='center';
    series.forEach((condition,colIndex)=>{
      ctx.fillText(condition.label,margin+labelW+colIndex*(colW+gap)+colW/2,gridY-28);
    });
    let scaleMeta=null;
    timepoints.forEach((tp,rowIndex)=>{
      const y=gridY+rowIndex*(rowH+gap);
      ctx.fillStyle=cfg.text;
      ctx.font='700 25px Arial, sans-serif';
      ctx.textAlign='right';
      ctx.textBaseline='middle';
      ctx.fillText(tp.label,margin+labelW-14,y+rowH/2);
      series.forEach((condition,colIndex)=>{
        const row=builderRowAt(representativeRows,condition.conditionKey,tp.x);
        const x=margin+labelW+colIndex*(colW+gap);
        ctx.fillStyle='#f4f4f4'; ctx.fillRect(x,y,colW,rowH);
        if(row) {
          const overlay=groupOverlayCanvas(row.sample,{style,targetWidth:colW,targetHeight:rowH});
          if(overlay) {
            drawContainedImage(ctx,overlay.canvas,x,y,colW,rowH);
            const meta=drawScaleBar(ctx,x,y,colW,rowH,overlay,settings,cfg);
            if(meta) scaleMeta=meta;
          }
        }
        ctx.strokeStyle='#fff'; ctx.lineWidth=4; ctx.strokeRect(x,y,colW,rowH);
      });
    });
    const bottom=gridY+timepoints.length*(rowH+gap)-gap;
    ctx.textAlign='left'; ctx.textBaseline='alphabetic';
    ctx.fillStyle=cfg.text; ctx.font='700 27px Arial, sans-serif';
    ctx.fillText('Segmented wound boundaries',margin+labelW,bottom+40);
    ctx.fillStyle=cfg.muted; ctx.font='500 22px Arial, sans-serif';
    ctx.fillText(scaleMeta?'Representative images with calculated contour overlays and scale bar.':'Representative images with calculated contour overlays.',margin+labelW,bottom+72);
    canvas.builderPanelMeta={scaleMeta};
    return canvas;
  }

  function drawBuilderPanelB(panel, settings, plotRows, style='color') {
    const cfg=figureStyleConfig(style);
    const canvas=document.createElement('canvas');
    canvas.width=panel.w; canvas.height=panel.h;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    drawBuilderPanelHeader(ctx,'B',panel,cfg);
    drawBuilderClosurePlot(ctx,plotRows,18,82,panel.w-36,panel.h-96,settings,style,false);
    return canvas;
  }

  function drawBuilderPanelC(panel, settings, plotRows, style='color') {
    const cfg=figureStyleConfig(style);
    const canvas=document.createElement('canvas');
    canvas.width=panel.w; canvas.height=panel.h;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    drawBuilderPanelHeader(ctx,'C',panel,cfg);
    drawBuilderLinePlot(ctx,plotRows,18,82,panel.w-36,panel.h-96,settings,style,false);
    return canvas;
  }

  function composeBuilderPanels(panelCanvases, panels, meta={}) {
    const canvas=document.createElement('canvas');
    canvas.width=2600; canvas.height=1580;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ['A','B','C'].forEach(id=>{
      const panel=panels[id];
      const source=panelCanvases[id];
      if(panel&&source) ctx.drawImage(source,panel.x,panel.y,panel.w,panel.h);
    });
    canvas.builderMeta={...meta,panelBounds:panels};
    return canvas;
  }

  function drawBuilderFigurePanel(style='grayscale', options={}) {
    const settings=builderSettings();
    if(!builderGroupsHaveFreshResults(settings)) return null;
    const rows=builderFigureRows(settings);
    const representativeRows=builderRepresentativeRows(settings);
    const plotRows=builderPlotRows(settings,rows);
    const timepoints=builderTimepoints(representativeRows.length?representativeRows:plotRows).slice(0,24);
    if(plotRows.length<2||!timepoints.length) return null;
    const panels=builderPanelConfigs(settings);
    const panelCanvases={
      A:drawBuilderPanelA(panels.A,settings,representativeRows,timepoints,style),
      B:drawBuilderPanelB(panels.B,settings,plotRows,style),
      C:drawBuilderPanelC(panels.C,settings,plotRows,style)
    };
    return composeBuilderPanels(panelCanvases,panels,{
      settings,rows,plotRows,representativeRows,
      scaleMeta:panelCanvases.A.builderPanelMeta?.scaleMeta||null
    });
  }

  function builderCaptionDraft(settings=builderSettings(), rows=builderFigureRows(settings)) {
    const metric=settings.metric==='width'?'normalized wound width':'normalized wound area';
    const timeLabels=builderTimepoints(rows).map(tp=>tp.label).join(', ');
    const treatmentLabels=(settings.treatmentArms||[]).map(arm=>arm.label).join(', ')||settings.treatmentLabel;
    const replicateSummary=builderReplicateSummary(settings);
    const stats=settings.pValue||settings.stars ? ` Statistical annotation: ${[settings.stars,settings.pValue].filter(Boolean).join(' ')}.` : '';
    const scale=Number.isFinite(settings.scaleValue)&&settings.scaleValue>0 ? ' Scale bar: 100 um.' : '';
    return `Representative wound healing scratch assay images and quantification for ${settings.cellType||'cells'}. Panel A shows contour overlays for ${settings.controlLabel} and ${treatmentLabels} across ${timeLabels||'the analyzed timepoints'}.${scale} Panel B shows wound closure normalized to baseline. Panel C shows ${metric}. Bars and points show mean ± SD when at least two replicates are available. ${replicateSummary}. ${stats}`.replace(/\s+/g,' ').trim();
  }

  function builderDataCsv(settings, rows, scaleMeta) {
    const data=rows.map(row=>({
      row_type:'replicate',
      condition:row.conditionLabel,
      replicate_group_id:row.replicateGroupId||'',
      replicate_label:row.replicateLabel||'',
      time_h:row.x,
      time_label:row.label,
      image_name:row.sample.path.split('/').pop()||row.sample.path,
      wound_area_px:Number.isFinite(row.areaPx)?Math.round(row.areaPx):'',
      normalized_area_percent:Number.isFinite(row.areaNormalizedPct)?row.areaNormalizedPct.toFixed(4):'',
      area_closure_percent:Number.isFinite(row.areaClosurePct)?row.areaClosurePct.toFixed(4):'',
      mean_width_px:Number.isFinite(row.width)?row.width.toFixed(2):'',
      normalized_width_percent:Number.isFinite(row.widthNormalizedPct)?row.widthNormalizedPct.toFixed(4):'',
      width_closure_percent:Number.isFinite(row.widthClosurePct)?row.widthClosurePct.toFixed(4):'',
      scale_bar:scaleMeta?.scale_bar||'',
      scale_bar_px:scaleMeta?.scale_bar_px?scaleMeta.scale_bar_px.toFixed(2):'',
      cell_type:settings.cellType,
      replicate:builderReplicateSummary(settings),
      p_value_label:settings.pValue,
      significance:settings.stars,
      summary_metric:'',
      summary_mean:'',
      summary_sd:'',
      summary_n:''
    }));
    const panelCMetric=settings.metric==='width'?'widthNormalizedPct':'areaNormalizedPct';
    const summaries=builderPlotRows(settings,rows).flatMap(row=>[
      ['area_closure_percent','areaClosurePct','areaClosurePctSd'],
      [settings.metric==='width'?'normalized_width_percent':'normalized_area_percent',panelCMetric,`${panelCMetric}Sd`]
    ].map(([label,meanKey,sdKey])=>({
      row_type:'summary',
      condition:row.conditionLabel,
      replicate_group_id:'',
      replicate_label:'',
      time_h:row.x,
      time_label:row.label,
      image_name:'',
      wound_area_px:'',
      normalized_area_percent:'',
      area_closure_percent:'',
      mean_width_px:'',
      normalized_width_percent:'',
      width_closure_percent:'',
      scale_bar:scaleMeta?.scale_bar||'',
      scale_bar_px:scaleMeta?.scale_bar_px?scaleMeta.scale_bar_px.toFixed(2):'',
      cell_type:settings.cellType,
      replicate:builderReplicateSummary(settings),
      p_value_label:settings.pValue,
      significance:settings.stars,
      summary_metric:label,
      summary_mean:Number.isFinite(row[meanKey])?row[meanKey].toFixed(4):'',
      summary_sd:Number.isFinite(row[sdKey])?row[sdKey].toFixed(4):'',
      summary_n:row.replicateCount
    })));
    return figureDataCsv([...data,...summaries]);
  }

  async function buildBuilderPptxBlob(canvas, settings, style='color', caption='') {
    if(!window.PptxGenJS) throw new Error('PptxGenJS is not available.');
    const pptx=new window.PptxGenJS();
    pptx.layout='LAYOUT_WIDE';
    pptx.author='Cytomove';
    pptx.company='Cellverse';
    pptx.subject='Wound healing scratch assay publication figure';
    pptx.title=builderComparisonLabel(settings);
    pptx.lang='en-US';
    pptx.theme={
      headFontFace:'Arial',
      bodyFontFace:'Arial',
      lang:'en-US'
    };
    const slide=pptx.addSlide();
    slide.background={color:'FFFFFF'};
    slide.addText(builderComparisonLabel(settings),{
      x:0.42,y:0.18,w:9.25,h:0.42,
      fontFace:'Arial',fontSize:22,bold:true,color:'0B2230',
      margin:0,breakLine:false,fit:'shrink'
    });
    slide.addText(style==='color'?'Color contour figure':'Grayscale contour figure',{
      x:9.82,y:0.24,w:3.05,h:0.24,
      fontFace:'Arial',fontSize:9,bold:true,color:style==='color'?'00A895':'52615F',
      align:'right',margin:0
    });
    slide.addImage({
      data:canvas.toDataURL('image/png'),
      x:0.42,y:0.72,w:9.35,h:5.68
    });
    slide.addShape(pptx.ShapeType.line,{
      x:9.94,y:0.76,w:0,h:5.56,
      line:{color:'D8E7E4',width:1}
    });
    slide.addText('CAPTION DRAFT',{
      x:10.16,y:0.78,w:2.72,h:0.28,
      fontFace:'Arial',fontSize:10,bold:true,color:'008C7F',margin:0
    });
    slide.addText(caption||builderCaptionDraft(settings,canvas.builderMeta?.rows||[]),{
      x:10.16,y:1.14,w:2.72,h:4.94,
      fontFace:'Arial',fontSize:11,color:'52615F',
      valign:'top',margin:0.04,breakLine:false,fit:'shrink'
    });
    slide.addText('Figure and contours are embedded at high resolution. Title and caption remain editable.',{
      x:0.44,y:6.82,w:12.38,h:0.22,
      fontFace:'Arial',fontSize:8,color:'64748B',margin:0
    });
    const output=await pptx.write({outputType:'blob',compression:true});
    return output instanceof Blob
      ? output
      : new Blob([output],{type:'application/vnd.openxmlformats-officedocument.presentationml.presentation'});
  }

  function syncBuilderPanelOverlays(panels=builderPanelConfigs()) {
    if(!el.builderPanelOverlay) return;
    el.builderPanelOverlay.querySelectorAll('[data-builder-panel]').forEach(handle=>{
      const id=handle.dataset.builderPanel;
      const panel=panels[id];
      if(!panel) return;
      handle.style.left=`${panel.x/26}%`;
      handle.style.top=`${panel.y/15.8}%`;
      handle.style.width=`${panel.w/26}%`;
      handle.style.height=`${panel.h/15.8}%`;
      handle.classList.toggle('selected',state.builderSelectedPanel===id);
    });
  }

  function selectBuilderPanel(id) {
    if(!['A','B','C'].includes(id)) return;
    state.builderSelectedPanel=id;
    if(el.builderSelectedPanel) el.builderSelectedPanel.value=id;
    syncBuilderPanelEditorControls();
    syncBuilderPanelOverlays();
  }

  function syncBuilderPanelEditorControls() {
    const id=state.builderSelectedPanel||'A';
    const settings={metric:el.builderMetricSelect?.value==='width'?'width':'area'};
    const panel=builderPanelConfig(id,settings);
    if(el.builderPanelTitle) el.builderPanelTitle.value=panel.title;
    if(el.builderPanelFont) el.builderPanelFont.value=panel.font;
    if(el.builderPanelFontSize) el.builderPanelFontSize.value=String(panel.titleSize);
    if(el.builderPanelFontWeight) el.builderPanelFontWeight.value=String(panel.titleWeight);
  }

  function applyBuilderPanelTypography() {
    const builderState=builderPanelState();
    const ids=el.builderApplyTypographyAll?.checked?['A','B','C']:[state.builderSelectedPanel||'A'];
    const typography={
      font:el.builderPanelFont?.value||'Arial',
      titleSize:Number(el.builderPanelFontSize?.value)||34,
      titleWeight:Number(el.builderPanelFontWeight?.value)||700
    };
    ids.forEach(id=>{ builderState.panelTypography[id]={...typography}; });
    markBuilderPreviewDirty();
  }

  function beginBuilderPanelDrag(event) {
    const handle=event.currentTarget;
    const id=handle.dataset.builderPanel;
    if(!id||!el.builderCanvasStage) return;
    selectBuilderPanel(id);
    const settings={metric:el.builderMetricSelect?.value==='width'?'width':'area'};
    const panels=builderPanelConfigs(settings);
    const panel=panels[id];
    const rect=el.builderCanvasStage.getBoundingClientRect();
    state.builderPanelDrag={
      id,
      startClientX:event.clientX,
      startClientY:event.clientY,
      startX:panel.x,
      startY:panel.y,
      scaleX:2600/Math.max(1,rect.width),
      scaleY:1580/Math.max(1,rect.height)
    };
    handle.classList.add('dragging');
    handle.setPointerCapture(event.pointerId);
  }

  function moveBuilderPanelDrag(event) {
    const drag=state.builderPanelDrag;
    if(!drag||drag.id!==event.currentTarget.dataset.builderPanel) return;
    const settings={metric:el.builderMetricSelect?.value==='width'?'width':'area'};
    const panels=builderPanelConfigs(settings);
    const panel=panels[drag.id];
    const others=Object.fromEntries(Object.entries(panels).filter(([id])=>id!==drag.id));
    const next=snapBuilderPanelPosition({
      x:drag.startX+(event.clientX-drag.startClientX)*drag.scaleX,
      y:drag.startY+(event.clientY-drag.startClientY)*drag.scaleY
    },panel,others);
    event.currentTarget.classList.toggle('invalid',!next.valid);
    if(!next.valid) return;
    const builderState=builderPanelState();
    builderState.panelLayout[drag.id]={...builderState.panelLayout[drag.id],x:next.x,y:next.y,w:panel.w,h:panel.h};
    syncBuilderPanelOverlays(builderPanelConfigs(settings));
  }

  function finishBuilderPanelDrag(event) {
    const drag=state.builderPanelDrag;
    if(!drag||drag.id!==event.currentTarget.dataset.builderPanel) return;
    event.currentTarget.classList.remove('dragging','invalid');
    state.builderPanelDrag=null;
    renderPublicationBuilder();
    setLog(`<strong>Panel ${drag.id} moved:</strong> snapped to the publication figure grid.`);
  }

  function resetBuilderPanelLayout() {
    const defaults=builderPanelLayoutDefaults();
    const builderState=builderPanelState();
    builderState.panelLayout=Object.fromEntries(Object.entries(defaults).map(([id,panel])=>[id,{x:panel.x,y:panel.y,w:panel.w,h:panel.h}]));
    renderPublicationBuilder();
    setLog('<strong>Builder layout reset:</strong> restored the balanced A/B/C panel arrangement.');
  }

  async function analyzeMissingBuilderGroups() {
    const settings=builderSettings();
    const coverage=builderResultCoverage(settings);
    if(!coverage.missingSamples.length) {
      renderPublicationBuilder();
      return;
    }
    if(el.analyzeMissingBuilderGroups) {
      el.analyzeMissingBuilderGroups.disabled=true;
      el.analyzeMissingBuilderGroups.textContent='Analyzing...';
    }
    if(el.exportBuilderFigure) el.exportBuilderFigure.disabled=true;
    setSpinner(true);
    try {
      const total=coverage.missingSamples.length;
      for(let index=0;index<coverage.missingSamples.length;index++) {
        const sample=coverage.missingSamples[index];
        if(qcStateForSample(sample.id).excluded) continue;
        setLog(`<strong>Preparing Builder:</strong> analyzing ${index+1}/${total} missing image(s) with current Image QC settings.`);
        const base=segmentationSettingsFromPanelSettings(sampleSettings(sample)||defaultPanelSettings());
        const sampleAnalysisSettings=settingsWithCurrentQc(base,sample);
        const img=await loadImageElement(analysisImageUrl(sample));
        const workImg=await transformImageElement(img,sampleAnalysisSettings);
        const analysis=analyzeImageWithSettings(workImg,sample,sampleAnalysisSettings,900);
        analysis.previewOnly=true;
        state.sampleSettings[sample.id]=settingsFromSegmentationSettings(sampleAnalysisSettings);
        state.groupResults[sample.id]=analysis;
        await yieldToBrowser();
      }
      renderPublicationBuilder();
      const remaining=builderResultCoverage(builderSettings());
      if(remaining.complete) {
        setLog(`<strong>Builder ready:</strong> analyzed ${coverage.missingSamples.length} missing image(s) and applied current Image QC changes.`);
      } else {
        setLog(`<strong>Builder analysis incomplete:</strong> ${remaining.missingSamples.length} image(s) still need analysis.`);
      }
    } catch(error) {
      renderPublicationBuilder();
      setLog(`<strong>Builder analysis failed.</strong> ${escHtml(error?.message||String(error))}`);
    } finally {
      setSpinner(false);
      if(el.analyzeMissingBuilderGroups) {
        el.analyzeMissingBuilderGroups.disabled=false;
        el.analyzeMissingBuilderGroups.textContent='Analyze missing groups';
      }
    }
  }

  function renderPublicationBuilder() {
    if(!el.builderCanvas) return;
    populateBuilderGroupSelects();
    const settings=builderSettings();
    if(!settings.controlReplicateIds.length||!settings.treatmentReplicateIds.length) {
      if(el.builderCanvasStage) el.builderCanvasStage.hidden=true;
      el.builderEmpty.hidden=false;
      if(el.analyzeMissingBuilderGroups) el.analyzeMissingBuilderGroups.hidden=true;
      if(el.builderStatus) el.builderStatus.textContent='Assign at least one replicate group to both Control and Treatment.';
      if(el.builderCaptionText) el.builderCaptionText.textContent='Caption draft will appear after preview.';
      if(el.exportBuilderFigure) el.exportBuilderFigure.disabled=true;
      return;
    }
    const canvas=drawBuilderFigurePanel(state.builderPreviewStyle||'color');
    if(!canvas) {
      const coverage=builderResultCoverage(settings);
      if(el.builderCanvasStage) el.builderCanvasStage.hidden=true;
      el.builderEmpty.hidden=false;
      const groupSummary=coverage.missingGroups.map(group=>`${group.label} (${group.missingCount}/${group.totalCount})`).join(', ');
      if(el.builderStatus) el.builderStatus.textContent=`${coverage.missingSamples.length} image(s) need analysis across ${coverage.missingGroups.length} selected group(s).`;
      const emptyStrong=el.builderEmpty?.querySelector('strong');
      const emptyText=el.builderEmpty?.querySelector('span');
      if(emptyStrong) emptyStrong.textContent='Current QC changes need group analysis';
      if(emptyText) emptyText.textContent=`Missing: ${groupSummary||'selected groups'}. Choose Analyze missing groups to continue with the current QC crop and orientation.`;
      if(el.analyzeMissingBuilderGroups) el.analyzeMissingBuilderGroups.hidden=!coverage.missingSamples.length;
      if(el.builderCaptionText) el.builderCaptionText.textContent='Caption draft will appear after preview.';
      if(el.exportBuilderFigure) el.exportBuilderFigure.disabled=true;
      return;
    }
    el.builderCanvas.width=canvas.width;
    el.builderCanvas.height=canvas.height;
    el.builderCanvas.getContext('2d').drawImage(canvas,0,0);
    if(el.builderCanvasStage) el.builderCanvasStage.hidden=false;
    el.builderEmpty.hidden=true;
    if(el.analyzeMissingBuilderGroups) el.analyzeMissingBuilderGroups.hidden=true;
    syncBuilderPanelOverlays(canvas.builderMeta.panelBounds);
    syncBuilderPanelEditorControls();
    const rows=builderFigureRows(settings);
    if(el.builderCaptionText) el.builderCaptionText.textContent=builderCaptionDraft(settings,rows);
    if(el.builderStatus) el.builderStatus.textContent=`${builderComparisonLabel(settings)}: ${builderConditionSeries(settings).length} condition(s), ${builderTimepoints(canvas.builderMeta.plotRows||rows).length} timepoint(s).`;
    if(el.exportBuilderFigure) el.exportBuilderFigure.disabled=false;
    state.builderPreviewDirty=false;
    syncBuilderUpdateButton();
  }

  function syncBuilderUpdateButton() {
    if(!el.refreshBuilderFigure) return;
    const dirty=!!state.builderPreviewDirty;
    el.refreshBuilderFigure.disabled=!dirty;
    el.refreshBuilderFigure.classList.toggle('is-dirty',dirty);
  }

  function markBuilderPreviewDirty() {
    state.builderPreviewDirty=true;
    syncBuilderUpdateButton();
    if(el.builderStatus) el.builderStatus.textContent='Settings changed — click Update Figure.';
  }

  function refreshPublicationBuilderPreview() {
    state.builderPreviewStyle='color';
    renderPublicationBuilder();
    if(!state.builderPreviewDirty) setLog('<strong>Figure updated: color image with contour overlays.</strong>');
  }

  async function exportPublicationBuilderZip(style='grayscale') {
    const exportStyle=style==='color'?'color':'grayscale';
    const canvas=drawBuilderFigurePanel(exportStyle);
    if(!canvas) {
      setLog('<strong>Publication Figure Builder:</strong> select analyzed control and treatment groups before export.');
      return;
    }
    const settings=canvas.builderMeta.settings;
    const rows=canvas.builderMeta.rows;
    const groupName=safeFilenamePart(builderComparisonLabel(settings),'builder');
    const caption=builderCaptionDraft(settings,rows);
    const pptxBlob=await buildBuilderPptxBlob(canvas,settings,exportStyle,caption);
    const files=[
      {name:`figures/cytomove_${groupName}_${exportStyle}_builder_figure.png`,bytes:canvasToPngBytes(canvas)},
      {name:`pdf/cytomove_${groupName}_${exportStyle}_builder_figure.pdf`,bytes:pdfFromCanvas(canvas)},
      {name:`pptx/cytomove_${groupName}_${exportStyle}_builder_figure.pptx`,bytes:new Uint8Array(await pptxBlob.arrayBuffer())},
      {name:`data/cytomove_${groupName}_${exportStyle}_builder_figure_data.csv`,bytes:new TextEncoder().encode(builderDataCsv(settings,rows,canvas.builderMeta.scaleMeta))},
      ...await builderFullImageExportFiles(settings,exportStyle,groupName),
      {name:`caption/cytomove_${groupName}_${exportStyle}_caption_draft.md`,bytes:new TextEncoder().encode(`# Caption draft\n\n${caption}\n`)}
    ];
    const publicationNames={
      single_column:{
        png:'single_column_85mm_600dpi.png',
        tiff:'single_column_85mm_600dpi.tiff'
      },
      double_column:{
        png:'double_column_180mm_600dpi.png',
        tiff:'double_column_180mm_600dpi.tiff'
      }
    };
    setLog('<strong>Publication Figure Builder:</strong> generating 85 mm and 180 mm files at 600 DPI. TIFF encoding can take a moment.');
    for(const profile of builderPublicationProfiles(canvas.height/canvas.width)) {
      await new Promise(resolve=>window.setTimeout(resolve,0));
      const publicationCanvas=scaleCanvasForPublication(canvas,profile);
      const names=publicationNames[profile.key];
      files.push({
        name:`publication_600dpi/png/cytomove_${groupName}_${exportStyle}_${names.png}`,
        bytes:pngBytesWithDpi(publicationCanvas,profile.dpi)
      });
      files.push({
        name:`publication_600dpi/tiff/cytomove_${groupName}_${exportStyle}_${names.tiff}`,
        bytes:canvasToTiffBytes(publicationCanvas,profile.dpi)
      });
      publicationCanvas.width=1;
      publicationCanvas.height=1;
    }
    downloadBlob(`cytomove_${groupName}_${exportStyle}_publication_builder.zip`,makeZip(files));
    setLog(`<strong>Publication Figure Builder export complete (${exportStyle}):</strong> ${files.length} files, including 85 mm and 180 mm PNG/TIFF at 600 DPI, were packed into one ZIP.`);
  }

  async function exportGroupPlotsZip(style='grayscale') {
    const exportStyle=style==='color'?'color':'grayscale';
    const rows=groupPlotRows();
    if(state.mode!=='group') setMode('group');
    if(rows.length<2) {
      setLog('<strong>Publication figure export:</strong> at least two analyzed group images are needed.');
      return;
    }
    const group=selectedGroup();
    const samples=selectedGroupSamples();
    const groupName=safeFilenamePart(group.label,'group');
    const figureRows=groupFigureRows();
    const areaPanelFigure=drawFigure2StylePanel(rows,group.label,samples,'area',exportStyle);
    const widthPanelFigure=drawFigure2StylePanel(rows,group.label,samples,'width',exportStyle);
    const areaPlot=drawTimePlot(rows,'areaNormalizedPct',`${group.label} - normalized wound area`,'Area (% of 0h)','#0f9f8f','A',exportStyle);
    const widthPlot=drawTimePlot(rows,'widthNormalizedPct',`${group.label} - normalized mean width`,'Width (% of 0h)','#2f6fed','B',exportStyle);
    const files=[];
    const pptSlides=[];
    if(areaPanelFigure) files.push({name:`figures/cytomove_${groupName}_${exportStyle}_area_three_panel_figure.png`,bytes:dataUrlToBytes(areaPanelFigure.toDataURL('image/png'))});
    if(widthPanelFigure) files.push({name:`figures/cytomove_${groupName}_${exportStyle}_width_three_panel_figure.png`,bytes:dataUrlToBytes(widthPanelFigure.toDataURL('image/png'))});
    if(areaPlot) files.push({name:`figures/cytomove_${groupName}_${exportStyle}_normalized_wound_area_figure.png`,bytes:dataUrlToBytes(areaPlot.toDataURL('image/png'))});
    if(widthPlot) files.push({name:`figures/cytomove_${groupName}_${exportStyle}_normalized_mean_width_figure.png`,bytes:dataUrlToBytes(widthPlot.toDataURL('image/png'))});
    if(areaPanelFigure) {
      files.push({name:`pdf/cytomove_${groupName}_${exportStyle}_area_three_panel_figure.pdf`,bytes:pdfFromCanvas(areaPanelFigure)});
    }
    if(widthPanelFigure) {
      files.push({name:`pdf/cytomove_${groupName}_${exportStyle}_width_three_panel_figure.pdf`,bytes:pdfFromCanvas(widthPanelFigure)});
    }
    if(areaPlot) {
      files.push({name:`pdf/cytomove_${groupName}_${exportStyle}_normalized_wound_area_figure.pdf`,bytes:pdfFromCanvas(areaPlot)});
    }
    if(widthPlot) {
      files.push({name:`pdf/cytomove_${groupName}_${exportStyle}_normalized_mean_width_figure.pdf`,bytes:pdfFromCanvas(widthPlot)});
    }
    const editableAreaSlide=buildEditablePanelSlide(rows,group.label,samples,'area',exportStyle);
    const editableWidthSlide=buildEditablePanelSlide(rows,group.label,samples,'width',exportStyle);
    if(editableAreaSlide) pptSlides.push(editableAreaSlide);
    if(editableWidthSlide) pptSlides.push(editableWidthSlide);
    if(pptSlides.length) files.push({name:`pptx/cytomove_${groupName}_${exportStyle}_publication_figures.pptx`,bytes:new Uint8Array(await makePptxDeck(pptSlides).arrayBuffer())});
    if(figureRows.length) files.push({name:`data/cytomove_${groupName}_${exportStyle}_figure_ready_data.csv`,bytes:new TextEncoder().encode(figureDataCsv(figureRows))});
    if(!files.length) {
      setLog('<strong>Publication figure export:</strong> no plottable area or width values were found.');
      return;
    }
    downloadBlob(`cytomove_${groupName}_${exportStyle}_publication_figures.zip`,makeZip(files));
    setLog(`<strong>Publication figure export complete (${exportStyle}):</strong> ${files.length} file${files.length>1?'s were':' was'} packed into one ZIP.`);
  }

  function showExportStylePanel(exportTarget='group') {
    state.pendingPublicationExport=exportTarget;
    if(!el.exportStylePanel) {
      if(exportTarget==='builder') exportPublicationBuilderZip('grayscale');
      else exportGroupPlotsZip('grayscale');
      return;
    }
    el.exportStylePanel.hidden=false;
  }

  function closeExportStylePanel() {
    if(el.exportStylePanel) el.exportStylePanel.hidden=true;
  }

  async function exportGroupPlotsWithStyle(style) {
    closeExportStylePanel();
    if(state.pendingPublicationExport==='builder') await exportPublicationBuilderZip(style);
    else await exportGroupPlotsZip(style);
  }

  function sidebarSectionHiddenForModule(module, isBuilder, isReview, defaultHidden) {
    if(module==='builder') return !isBuilder;
    if(module==='qc') return !isReview;
    if(isBuilder) return true;
    return defaultHidden;
  }

  function setAppModule(module) {
    state.appModule=module==='builder'?'builder':module==='qc'?'qc':'analysis';
    if(el.moduleTabs) {
      el.moduleTabs.querySelectorAll('[data-module]').forEach(btn=>{
        btn.classList.toggle('active',btn.dataset.module===state.appModule);
      });
    }
    document.querySelectorAll('.sidebar-inner > .section').forEach(section=>{
      const isBuilder=section.id==='publicationBuilderControls';
      const isReview=section.id==='reviewModeSection';
      if(section.dataset.moduleDefaultHidden===undefined) {
        section.dataset.moduleDefaultHidden=section.hidden?'1':'0';
      }
      section.hidden=sidebarSectionHiddenForModule(
        state.appModule,
        isBuilder,
        isReview,
        section.dataset.moduleDefaultHidden==='1'
      );
    });
    if(el.imageQcPanel) el.imageQcPanel.hidden=state.appModule!=='qc';
    if(el.publicationBuilderPanel) el.publicationBuilderPanel.hidden=state.appModule!=='builder';
    if(el.dropZone) el.dropZone.hidden=state.appModule==='builder'||state.appModule==='qc';
    if(el.groupView) el.groupView.hidden=state.appModule==='builder'||state.appModule==='qc'||state.mode!=='group';
    if(state.appModule==='builder') renderPublicationBuilder();
    else if(state.appModule==='qc') renderImageQcPanel();
    else {
      if(state.mode==='group') renderGroupView();
      else if(state.image) drawLoadedImage();
    }
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
    const normalizedMetric=isArea?'areaNormalizedPct':'widthNormalizedPct';
    const canvas=drawTimePlot(
      rows,
      normalizedMetric,
      `${group.label} - ${isArea?'Normalized wound area':'Normalized mean wound width'}`,
      isArea?'Area (% of 0h)':'Width (% of 0h)',
      isArea?'#0f9f8f':'#2f6fed',
      isArea?'A':'B'
    );
    if(!canvas) {
      setLog(`<strong>Plot preview:</strong> no plottable ${isArea?'area':'width'} values were found.`);
      return;
    }
    el.plotDialogTitle.textContent=isArea?'Normalized wound area plot':'Normalized mean width plot';
    el.plotBody.innerHTML='';
    el.plotBody.appendChild(canvas);
    el.plotPanel.hidden=false;
  }

  function closePlotPanel() {
    el.plotPanel.hidden=true;
    el.plotBody.innerHTML='';
  }

  function groupExportRows(samples=selectedGroupSamples()) {
    return samples.filter(s=>!sampleExcludedFromAnalysis(s.id)).map(s=>{
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

  function figureRowsFromMetricRows(rows) {
    if(!rows.length) return [];
    const baseArea=Number(rows[0].wound_area_px);
    const baseWidth=Number(rows[0].mean_wound_width_px);
    return rows.map(row=>{
      const area=Number(row.wound_area_px);
      const width=Number(row.mean_wound_width_px);
      return {
        figure_time_h:row.time_hours||row.timepoint||'',
        figure_time_label:row.timepoint||row.time_hours||'',
        image_name:row.filename||row.image_name||'',
        wound_area_px:Number.isFinite(area)?Math.round(area):row.wound_area_px,
        wound_area_percent:row.wound_area_fraction_percent||'',
        normalized_area_percent:Number.isFinite(baseArea)&&baseArea&&Number.isFinite(area)?(area*100/baseArea).toFixed(4):'',
        mean_width_px:row.mean_wound_width_px||'',
        median_width_px:row.median_wound_width_px||'',
        normalized_width_percent:Number.isFinite(baseWidth)&&baseWidth&&Number.isFinite(width)?(width*100/baseWidth).toFixed(4):'',
        area_closure_percent:Number.isFinite(baseArea)&&baseArea&&Number.isFinite(area)?(((baseArea-area)/baseArea)*100).toFixed(4):'',
        width_closure_percent:Number.isFinite(baseWidth)&&baseWidth&&Number.isFinite(width)?(((baseWidth-width)/baseWidth)*100).toFixed(4):'',
        recommended_metric:row.recommended_primary_metric||'',
        qc_score:row.segmentation_quality_score||'',
        qc_notes:row.warnings||''
      };
    });
  }

  function exportExcel() {
    const now=new Date().toISOString();
    let rows=[];
    let figureRows=[];
    let filename='cytomove_metrics.xls';
    let title='CytoMove Single Image Metrics';
    if(state.mode==='group') {
      rows=groupExportRows();
      figureRows=groupFigureRows();
      const group=selectedGroup();
      filename=`cytomove_${(group.label||'group').replace(/[^\w\-]+/g,'_')}_figure_data.xls`;
      title=`CytoMove Figure Data - ${group.label}`;
    } else if(state.result) {
      rows=groupExportRows([state.sample||{id:'single',imageId:'single',path:state.imageName||'image',cell:'',condition:'',time:'',area:null,areaPct:null,width:null,closure:null}]);
      if(!rows.length) rows=[{image_name:state.imageName||'image', wound_area_px:state.result.area, wound_area_fraction_percent:state.result.areaPct, mean_wound_width_px:state.result.wMean, segmentation_quality_score:state.result.segmentationQualityScore, recommended_primary_metric:state.result.recommendedPrimaryMetric, warnings:(state.result.warnings||[]).join(' | ')}];
      figureRows=figureRowsFromMetricRows(rows);
      filename=`cytomove_${(state.sample?.imageId||state.imageName||'image').replace(/[^\w\-]+/g,'_')}_figure_data.xls`;
    }
    if(!rows.length) {
      setLog('<strong>No exportable results yet.</strong> Run a single image or wait for group analysis to finish.');
      return;
    }
    if(!figureRows.length) figureRows=figureRowsFromMetricRows(rows);
    const summary=[{created_at:now, algorithm_version:CYTOMOVE_ALGORITHM_VERSION, export_scope:state.mode, image_count:rows.length, export_basis:'last displayed segmentation result per image', first_table:'Figure-ready data for publication plots'}];
    const html=`<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#111827}h1{font-size:20px;margin-bottom:6px}h2{font-size:15px;margin-top:22px;margin-bottom:8px}p{color:#52615f;font-size:12px}table{border-collapse:collapse;margin-bottom:18px}th{background:#dff3f0;color:#0f3f3a;font-weight:700}td,th{border:1px solid #b9d4cf;padding:6px 8px;font-size:12px;mso-number-format:"\\@";}.figure-table th{background:#0f9f8f;color:#fff}.summary th{background:#e8f4f2}</style></head><body><h1>${escHtml(title)}</h1><p>The first table contains the area and width values needed for publication-quality figures. Detailed audit metrics are kept below.</p><div class="figure-table">${htmlTable('Figure-ready data',figureRows)}</div><div class="summary">${htmlTable('Export summary',summary)}</div>${htmlTable('Detailed per-image metrics',rows)}</body></html>`;
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
    el.groupSelect.disabled=state.validationLoadActive||!groups.length;
    if(el.groupSelectRow) el.groupSelectRow.hidden=!groups.length;
    if(el.deleteGroup) el.deleteGroup.disabled=state.validationLoadActive||!groups.length;
    if(el.addImageGroup) {
      el.addImageGroup.textContent=groups.length ? '+ Add another image group' : 'Open image group';
      el.addImageGroup.disabled=state.validationLoadActive;
      if(el.groupSelectRow) el.groupSelectRow.hidden=false;
    }
    const label=document.getElementById('groupSelectLabel');
    if(label) label.hidden=!groups.length;
    populateBuilderGroupSelects();
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

  function qcStatusLabel(sample) {
    if(!sample) return 'Ready';
    const qc=qcStateForSample(sample.id);
    if(qc.excluded) return 'Excluded';
    if(qc.cropRatio||qc.rotation||qc.orientation!=='vertical') return 'Edited';
    if(qc.needsCrop) return 'Needs Crop';
    return 'Ready';
  }

  function renderQcImageList(samples=selectedGroupSamples()) {
    if(!el.qcImageList) return;
    if(!samples.length) {
      el.qcImageList.innerHTML='<div class="qc-series-empty"><strong>Your image series will appear here</strong><span>Load a time-series group to review each image before analysis.</span></div>';
      return;
    }
    el.qcImageList.innerHTML=samples.map((sample,index)=>{
      const status=qcStatusLabel(sample);
      const active=state.sample?.id===sample.id;
      const arrived=state.qcArrivalSampleId===sample.id;
      const excluded=status==='Excluded';
      const needsCrop=status==='Needs Crop';
      return `
        <button class="qc-image-row ${active?'active':''} ${arrived?'arrived':''} ${excluded?'excluded':''} ${needsCrop?'needs-crop':''}" data-qc-index="${index}" type="button">
          <span>${escHtml(sample.time||String(index+1))}</span>
          <strong class="${needsCrop?'warning':''}">${escHtml(status)}</strong>
        </button>
      `;
    }).join('');
  }

  function drawQcCanvas() {
    if(!el.qcCanvas||!el.qcEmpty) return;
    const sample=state.sample;
    const originalImg=state.imageOriginal||state.image;
    if(el.imageQcPanel) el.imageQcPanel.classList.toggle('empty-qc',!originalImg||state.appModule!=='qc');
    if(!originalImg||state.appModule!=='qc') {
      el.qcCanvas.hidden=true;
      el.qcEmpty.hidden=false;
      if(el.qcCropOverlay) el.qcCropOverlay.hidden=true;
      return;
    }

    const displayImg=originalImg;
    const qc=sample?qcStateForSample(sample.id):null;
    const previewCrop=!state.cropEditing?qcPreviewCrop(qc,state.crop):null;
    const sourceX=previewCrop?.x||0;
    const sourceY=previewCrop?.y||0;
    const sourceW=previewCrop?.w||displayImg.naturalWidth;
    const sourceH=previewCrop?.h||displayImg.naturalHeight;
    const previewRotation=state.cropEditing
      ? 0
      : (Number(qc?.rotation)||0)+(qc?.orientation==='horizontal'?90:0)+(Number(qc?.fineRotation)||0);
    const radians=previewRotation*Math.PI/180;
    const rotatedW=Math.abs(sourceW*Math.cos(radians))+Math.abs(sourceH*Math.sin(radians));
    const rotatedH=Math.abs(sourceW*Math.sin(radians))+Math.abs(sourceH*Math.cos(radians));
    const maxW=1100, maxH=760;
    const scale=Math.min(1,maxW/rotatedW,maxH/rotatedH);
    const w=Math.max(1,Math.round(rotatedW*scale));
    const h=Math.max(1,Math.round(rotatedH*scale));

    if(el.qcCanvas.width!==w) el.qcCanvas.width=w;
    if(el.qcCanvas.height!==h) el.qcCanvas.height=h;

    const ctx=el.qcCanvas.getContext('2d');
    ctx.clearRect(0,0,w,h);

    ctx.save();
    ctx.translate(w/2,h/2);
    ctx.rotate(radians);
    ctx.drawImage(
      displayImg,
      sourceX,sourceY,sourceW,sourceH,
      -sourceW*scale/2,-sourceH*scale/2,sourceW*scale,sourceH*scale
    );
    ctx.restore();

    if(state.cropEditing) {
      const crop=state.crop||currentCrop();
      if(crop&&crop.active) {
        const sx=w/originalImg.naturalWidth, sy=h/originalImg.naturalHeight;
        ctx.save();
        ctx.fillStyle='rgba(11,31,36,0.38)';
        ctx.fillRect(0,0,w,crop.y*sy);
        ctx.fillRect(0,crop.y*sy,crop.x*sx,crop.h*sy);
        ctx.fillRect((crop.x+crop.w)*sx,crop.y*sy,w-(crop.x+crop.w)*sx,crop.h*sy);
        ctx.fillRect(0,(crop.y+crop.h)*sy,w,h-(crop.y+crop.h)*sy);
        ctx.restore();
      }
    }
    if(state.rulerVisible&&!state.cropEditing) drawAngleRuler(ctx,w,h);

    el.qcCanvas.hidden=false;
    el.qcEmpty.hidden=true;
    el.qcCanvas.classList.toggle('ruler-active',state.rulerVisible&&!state.cropEditing);
    renderQcCropOverlay();
  }

  function qcCanvasPoint(event) {
    const rect=el.qcCanvas.getBoundingClientRect();
    return {
      x:(event.clientX-rect.left)*el.qcCanvas.width/rect.width,
      y:(event.clientY-rect.top)*el.qcCanvas.height/rect.height
    };
  }

  function beginQcRulerDrag(event) {
    if(qcMutationBlocked()) return;
    if(state.cropEditing||!state.rulerVisible||event.button!==0) return;
    const point=qcCanvasPoint(event);
    if(!rulerHitTest(point,el.qcCanvas.width,el.qcCanvas.height)) return;
    state.rulerDragging=true;
    state.rulerDragStart={
      x:point.x,
      y:point.y,
      offsetX:state.rulerOffsetX||0,
      offsetY:state.rulerOffsetY||0
    };
    el.qcCanvas.classList.add('grabbing');
    el.qcCanvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  function updateQcRulerDrag(event) {
    if(qcMutationBlocked()) return;
    if(!state.rulerDragging||!state.rulerDragStart) return;
    const point=qcCanvasPoint(event);
    const start=state.rulerDragStart;
    state.rulerOffsetX=start.offsetX+(point.x-start.x);
    state.rulerOffsetY=start.offsetY+(point.y-start.y);
    drawQcCanvas();
  }

  function finishQcRulerDrag(event) {
    if(!state.rulerDragging) return;
    updateQcRulerDrag(event);
    state.rulerDragging=false;
    state.rulerDragStart=null;
    if(el.qcCanvas.hasPointerCapture?.(event.pointerId)) el.qcCanvas.releasePointerCapture(event.pointerId);
    el.qcCanvas.classList.remove('grabbing');
  }

  function scheduleQcCanvasDraw() {
    if(state.qcDrawFrame) return;
    state.qcDrawFrame=requestAnimationFrame(()=>{
      state.qcDrawFrame=0;
      drawQcCanvas();
    });
  }

  function qcOverlayMetrics() {
    const img=state.imageOriginal||state.image;
    if(!img||!el.qcPreview||!el.qcCanvas) return null;
    const previewRect=el.qcPreview.getBoundingClientRect();
    const canvasRect=el.qcCanvas.getBoundingClientRect();
    if(canvasRect.width<=0||canvasRect.height<=0) return null;
    return {
      canvasLeft:canvasRect.left-previewRect.left,
      canvasTop:canvasRect.top-previewRect.top,
      canvasWidth:canvasRect.width,
      canvasHeight:canvasRect.height,
      naturalWidth:img.naturalWidth,
      naturalHeight:img.naturalHeight
    };
  }

  function cropToQcOverlayRect(crop, metrics) {
    return {
      left:metrics.canvasLeft+(crop.x/metrics.naturalWidth)*metrics.canvasWidth,
      top:metrics.canvasTop+(crop.y/metrics.naturalHeight)*metrics.canvasHeight,
      width:(crop.w/metrics.naturalWidth)*metrics.canvasWidth,
      height:(crop.h/metrics.naturalHeight)*metrics.canvasHeight
    };
  }

  function qcOverlayRectToCrop(rect, metrics) {
    return clampCrop({
      x:((rect.left-metrics.canvasLeft)/metrics.canvasWidth)*metrics.naturalWidth,
      y:((rect.top-metrics.canvasTop)/metrics.canvasHeight)*metrics.naturalHeight,
      w:(rect.width/metrics.canvasWidth)*metrics.naturalWidth,
      h:(rect.height/metrics.canvasHeight)*metrics.naturalHeight,
      active:true
    },state.imageOriginal||state.image);
  }

  function setQcCropOverlayRect(rect) {
    if(!el.qcCropOverlay) return;
    el.qcCropOverlay.style.left=`${rect.left}px`;
    el.qcCropOverlay.style.top=`${rect.top}px`;
    el.qcCropOverlay.style.width=`${rect.width}px`;
    el.qcCropOverlay.style.height=`${rect.height}px`;
  }

  function renderQcCropOverlay() {
    if(!el.qcCropOverlay) return;
    const metrics=qcOverlayMetrics();
    if(!state.cropEditing||!state.crop||!metrics||state.appModule!=='qc') {
      el.qcCropOverlay.hidden=true;
      return;
    }
    setQcCropOverlayRect(cropToQcOverlayRect(state.crop,metrics));
    el.qcCropOverlay.hidden=false;
  }

  function beginQcOverlayDrag(event) {
    if(qcMutationBlocked()) return;
    if(!state.cropEditing||!state.crop||event.button!==0) return;
    const metrics=qcOverlayMetrics();
    if(!metrics) return;
    const handle=event.target.closest('[data-crop-handle]');
    const mode=handle?.dataset.cropHandle||'move';
    state.qcOverlayDrag={
      pointerId:event.pointerId,
      startX:event.clientX,
      startY:event.clientY,
      startRect:cropToQcOverlayRect(state.crop,metrics),
      mode,
      metrics,
      bounds:{
        left:metrics.canvasLeft,
        top:metrics.canvasTop,
        right:metrics.canvasLeft+metrics.canvasWidth,
        bottom:metrics.canvasTop+metrics.canvasHeight
      },
      minSize:Math.max(24,32*metrics.canvasWidth/metrics.naturalWidth)
    };
    el.qcCropOverlay.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function updateQcOverlayDrag(event) {
    if(qcMutationBlocked()) return;
    const drag=state.qcOverlayDrag;
    if(!drag||drag.pointerId!==event.pointerId) return;
    const rect=updateQcOverlayRect(
      drag.startRect,
      event.clientX-drag.startX,
      event.clientY-drag.startY,
      drag.mode,
      drag.bounds,
      drag.minSize
    );
    setQcCropOverlayRect(rect);
    state.crop=qcOverlayRectToCrop(rect,drag.metrics);
  }

  function finishQcOverlayDrag(event) {
    const drag=state.qcOverlayDrag;
    if(!drag||drag.pointerId!==event.pointerId) return;
    if(!qcMutationBlocked()) updateQcOverlayDrag(event);
    if(el.qcCropOverlay.hasPointerCapture?.(event.pointerId)) {
      el.qcCropOverlay.releasePointerCapture(event.pointerId);
    }
    state.qcOverlayDrag=null;
  }

  // Crop cache management for performance optimization
  function buildCropCacheKey(sampleId, cropRatio, rotation) {
    if(!cropRatio) return null;
    const r = cropRatio;
    return `${sampleId}_${r.x.toFixed(4)}_${r.y.toFixed(4)}_${r.w.toFixed(4)}_${r.h.toFixed(4)}_${rotation}`;
  }

  function getCachedCroppedImage(sample, originalImg, cropRatio, rotation=0) {
    if(!sample||!originalImg||!cropRatio) return null;
    const cacheKey = buildCropCacheKey(sample.id, cropRatio, rotation);
    if(!cacheKey) return null;

    // Check cache
    if(state.cropCache.has(cacheKey)) {
      const cached = state.cropCache.get(cacheKey);
      if(cached && cached.img) {
        return cached.img;
      }
    }

    // Create cropped image and cache it
    const crop = cropFromRatio(originalImg, cropRatio);
    if(!crop || !crop.active) return null;

    const canvas = document.createElement('canvas');
    canvas.width = crop.w;
    canvas.height = crop.h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImg, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);

    const croppedImg = new Image();
    croppedImg.src = canvas.toDataURL('image/png');

    // Cache it (store the canvas for quick access)
    state.cropCache.set(cacheKey, {img: croppedImg, canvas, crop});

    // Limit cache size (keep last 50 cached images)
    if(state.cropCache.size > 50) {
      const firstKey = state.cropCache.keys().next().value;
      state.cropCache.delete(firstKey);
    }

    return croppedImg;
  }

  function invalidateCropCache(sampleId = null) {
    if(sampleId) {
      // Invalidate all cache entries for this sample
      const keysToDelete = [];
      for(const key of state.cropCache.keys()) {
        if(key.startsWith(sampleId + '_')) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => state.cropCache.delete(key));
    } else {
      // Clear entire cache
      state.cropCache.clear();
    }
  }

  function applyQcGeometryControls(qc, controls) {
    const fineRotation=Number(qc?.fineRotation)||0;
    if(controls.qcFineRotation) controls.qcFineRotation.value=String(fineRotation);
    if(controls.qcFineRotationVal) controls.qcFineRotationVal.value=String(fineRotation);
    if(controls.qcAutoCropFov) controls.qcAutoCropFov.checked=!!qc?.autoCropFov;
  }

  function applyQcStateToCurrentImage(sample=state.sample, options={}) {
    if(!sample||!state.imageOriginal) return;
    const qc=qcStateForSample(sample.id);
    if(!qc) return;
    if(el.qcOrientation) el.qcOrientation.value=qc.orientation||'vertical';
    state.rotation=Number(qc.rotation)||0;
    state.analysisGeometry.orientation=qc.orientation||'vertical';
    state.analysisGeometry.fineRotation=Number(qc.fineRotation)||0;
    applyQcGeometryControls(qc,el);
    const cropRatio=options.preparedInput?null:cropForQcSample(qc,currentGroupCropTemplate());
    state.crop=cropRatio?cropFromRatio(state.imageOriginal,cropRatio):null;
    state.cropManual=!!cropRatio;
    state.cropEditing=!!options.openAdjust;
    state.cropDragging=false;
    state.qcOverlayDrag=null;
  }

  function renderImageQcPanel() {
    const samples=selectedGroupSamples();
    renderQcImageList(samples);
    const sample=state.sample&&samples.some(s=>s.id===state.sample.id)?state.sample:samples[0]||null;
    if(sample&&state.sample?.id!==sample.id) {
      const incomingQc=qcStateForSample(sample.id);
      loadQcSampleAt(samples.findIndex(s=>s.id===sample.id),{
        openAdjust:shouldOpenQcCropTemplate(incomingQc,currentGroupCropTemplate())
      });
      return;
    }
    const qc=sample?qcStateForSample(sample.id):null;
    if(sample&&state.imageOriginal&&state.sample?.id===sample.id&&!state.cropEditing) applyQcStateToCurrentImage(sample);

    // Auto-detect border issues for current image if not already checked
    if(!qcMutationBlocked()&&sample&&state.imageOriginal&&!qc?.borderCheckPerformed&&!qc?.cropRatio) {
      const hasIssues = detectImageBorderIssues(state.imageOriginal);
      updateQcState(sample.id, {
        needsCrop: hasIssues,
        borderCheckPerformed: true
      });
      // Re-render to show updated status
      renderQcImageList(samples);
    }

    if(el.qcStatus) {
      el.qcStatus.textContent=sample
        ? `${selectedGroup().label}: ${samples.length} image(s), ${samples.filter(s=>qcStateForSample(s.id).excluded).length} excluded.`
        : 'Start with one image or a local time-series group.';
    }
    if(el.qcImagePosition) {
      const activeIndex=sample?samples.findIndex(item=>item.id===sample.id):-1;
      el.qcImagePosition.hidden=activeIndex<0;
      el.qcImagePosition.textContent=activeIndex>=0
        ? `${sample.time||sample.path||'Image'} · Image ${activeIndex+1} of ${samples.length}`
        : '';
    }
    if(el.qcOrientation&&qc) el.qcOrientation.value=qc.orientation||'vertical';
    if(el.qcExcludeToggle) el.qcExcludeToggle.checked=!!qc?.excluded;
    if(el.qcAngleRulerToggle) {
      el.qcAngleRulerToggle.textContent=state.rulerVisible?'Hide angle ruler':'Show angle ruler';
      el.qcAngleRulerToggle.classList.toggle('primary',state.rulerVisible);
    }
    syncQcTransitionControls(samples,sample,qc);
    drawQcCanvas();
  }

  function qcMutationBlocked() {
    return !!state.qcTransitionPending;
  }

  function setQcTransitionPending(pending) {
    state.qcTransitionPending=!!pending;
    const samples=selectedGroupSamples();
    const sample=state.sample&&samples.some(item=>item.id===state.sample.id)?state.sample:samples[0]||null;
    const qc=sample?qcStateForSample(sample.id):null;
    syncQcTransitionControls(samples,sample,qc);
  }

  function syncQcTransitionControls(samples, sample, qc) {
    const pending=state.qcTransitionPending;
    const noSample=!sample;
    if(el.qcOrientation) el.qcOrientation.disabled=pending||noSample;
    if(el.qcRotateLeft) el.qcRotateLeft.disabled=pending||noSample;
    if(el.qcRotateRight) el.qcRotateRight.disabled=pending||noSample;
    if(el.qcFineRotation) el.qcFineRotation.disabled=pending||noSample;
    if(el.qcFineRotationVal) el.qcFineRotationVal.disabled=pending||noSample;
    if(el.qcAngleRulerToggle) el.qcAngleRulerToggle.disabled=pending||noSample;
    if(el.qcAutoCropFov) el.qcAutoCropFov.disabled=pending||noSample;
    if(el.qcAdjustCrop) el.qcAdjustCrop.disabled=pending||noSample;
    if(el.qcSaveCrop) el.qcSaveCrop.disabled=pending||!state.cropEditing;
    if(el.qcResetCrop) el.qcResetCrop.disabled=pending||noSample||(!qc?.cropRatio&&!qc?.autoCropFov&&!preparedQcImage(sample.id));
    const history=qcCropHistoryForSample(sample?.id);
    if(el.qcUndoCrop) el.qcUndoCrop.disabled=pending||history.index<0;
    if(el.qcRedoCrop) el.qcRedoCrop.disabled=pending||history.index>=history.history.length-1;
    if(el.qcExcludeToggle) el.qcExcludeToggle.disabled=pending||noSample;
    if(el.qcPrevImage) el.qcPrevImage.disabled=pending||!samples.length||samples.length<=1;
    if(el.qcNextImage) el.qcNextImage.disabled=pending||!samples.length||samples.length<=1;
    if(el.groupSelect) el.groupSelect.disabled=pending;
    if(el.goToAnalysisFromQc) el.goToAnalysisFromQc.disabled=pending||!samples.length;
  }

  function loadQcSampleAt(index, options={}) {
    if(qcMutationBlocked()) return;
    const samples=selectedGroupSamples();
    const sample=samples[index];
    if(!sample) {
      renderImageQcPanel();
      return;
    }
    loadImage(sampleUrl(sample),sample,sample.path,true,{
      fromQc:true,
      autoApplyAfterLoad:false,
      openAdjust:!!options.openAdjust,
      advanceFromSample:options.advanceFromSample||null
    });
  }

  function qcPreviousImage() {
    if(qcMutationBlocked()) return;
    const samples=selectedGroupSamples();
    if(!samples.length) return;
    const currentIndex=state.sample ? samples.findIndex(s=>s.id===state.sample.id) : 0;
    const prevIndex=currentIndex<=0 ? samples.length-1 : currentIndex-1;
    loadQcSampleAt(prevIndex);
  }

  function qcNextImage() {
    if(qcMutationBlocked()) return;
    const samples=selectedGroupSamples();
    if(!samples.length) return;
    const currentIndex=state.sample ? samples.findIndex(s=>s.id===state.sample.id) : -1;
    const nextIndex=(currentIndex+1)%samples.length;
    loadQcSampleAt(nextIndex);
  }

  function beginQcCropEdit() {
    if(qcMutationBlocked()) return;
    if(!state.sample||!state.imageOriginal) return;
    state.crop=state.crop||currentCrop();
    if(!state.crop?.active) {
      const marginX=Math.round(state.imageOriginal.naturalWidth*0.08);
      const marginY=Math.round(state.imageOriginal.naturalHeight*0.08);
      state.crop={
        x:marginX,
        y:marginY,
        w:state.imageOriginal.naturalWidth-marginX*2,
        h:state.imageOriginal.naturalHeight-marginY*2,
        active:true
      };
    }
    state.cropEditing=true;
    state.cropDragging=false;
    state.qcOverlayDrag=null;
    if(el.qcSaveCrop) el.qcSaveCrop.disabled=false;
    drawQcCanvas();
  }

  function applyQcOrientation(value) {
    if(qcMutationBlocked()) return;
    if(!state.sample) return;
    updateQcState(state.sample.id,{orientation:value==='horizontal'?'horizontal':'vertical'});
    renderImageQcPanel();
  }

  function applyQcRotation(delta) {
    if(qcMutationBlocked()) return;
    if(!state.sample) return;
    const qc=qcStateForSample(state.sample.id);
    updateQcState(state.sample.id,{rotation:(Number(qc.rotation||0)+delta+360)%360});
    renderImageQcPanel();
  }

  function normalizeQcFineRotation(value) {
    return Math.max(-20,Math.min(20,Number(value)||0));
  }

  function normalizeQcFovCutoff(value) {
    return Math.max(0,Math.min(180,Number(value)||0));
  }

  function applyQcFineRotation(value) {
    if(qcMutationBlocked()) return;
    if(!state.sample) return;
    const next=normalizeQcFineRotation(value);
    updateQcState(state.sample.id,{fineRotation:next});
    applyQcGeometryControls(qcStateForSample(state.sample.id),el);
    drawQcCanvas();
  }

  function toggleQcAngleRuler() {
    state.rulerVisible=!state.rulerVisible;
    state.rulerDragging=false;
    state.rulerDragStart=null;
    renderImageQcPanel();
  }

  function qcAutoCropPatch(crop, image, fovCutoff) {
    const active=!!crop?.active;
    const cropRatio=active&&image?.naturalWidth&&image?.naturalHeight
      ? {
          x:crop.x/image.naturalWidth,
          y:crop.y/image.naturalHeight,
          w:crop.w/image.naturalWidth,
          h:crop.h/image.naturalHeight
        }
      : null;
    return {
      autoCropFov:true,
      fovCutoff,
      cropRatio,
      cropSaved:active,
      cropReset:false,
      needsCrop:false
    };
  }

  function resetQcCropPatch() {
    return {cropRatio:null,cropSaved:false,cropReset:true,autoCropFov:false,fovCutoff:null,needsCrop:false};
  }

  async function toggleQcAutoCrop(checked) {
    if(qcMutationBlocked()) return;
    if(!state.sample||!state.imageOriginal) return;
    if(!checked) {
      resetQcCrop();
      return;
    }
    const operation=(async()=>{
      const sample=state.sample;
      const historyBefore=qcCropHistorySnapshot(sample.id);
      const rawImage=state.imageOriginal;
      const fovCutoff=normalizeQcFovCutoff(el.fovCutoff?.value);
      const crop=autoCropForImage(rawImage,true,fovCutoff);
      const patch=qcAutoCropPatch(crop,rawImage,fovCutoff);
      const operationId=beginQcCropOperation(sample.id);
      try {
        if(crop.active) await prepareQcAnalysisInput(sample,rawImage,crop,operationId);
        else releasePreparedQcImage(sample.id);
        if(!isCurrentQcCropOperation(sample.id,operationId)) return;
        if(state.sample?.id!==sample.id) {
          releasePreparedQcImage(sample.id);
          return;
        }
        updateQcState(sample.id,patch);
        recordQcCropHistory(sample.id,historyBefore);
        state.crop=crop.active?{...crop}:null;
        state.cropManual=!!crop.active;
        state.cropEditing=false;
        state.qcOverlayDrag=null;
        renderImageQcPanel();
        setLog(crop.active
          ? '<strong>FOV crop prepared.</strong> The cropped image is ready for Analysis.'
          : '<strong>Full FOV retained.</strong> No dark microscope border required cropping.');
      } catch(error) {
        if(!isCurrentQcCropOperation(sample.id,operationId)) return;
        releasePreparedQcImage(sample.id);
        if(state.sample?.id===sample.id) {
          updateQcState(sample.id,resetQcCropPatch());
          state.crop=null;
          state.cropManual=false;
          if(el.qcAutoCropFov) el.qcAutoCropFov.checked=false;
          drawQcCanvas();
        }
        setLog(`<strong>Auto crop failed.</strong> ${escHtml(error?.message||String(error))}`);
      }
    })();
    return trackQcOperation(operation);
  }

  function resetQcCrop() {
    if(qcMutationBlocked()) return;
    if(!state.sample) return;
    const sampleId=state.sample.id;
    const historyBefore=qcCropHistorySnapshot(sampleId);
    invalidateQcCropOperation(sampleId);
    releasePreparedQcImage(sampleId);
    state.qcCropCache.delete(sampleId);
    invalidateCropCache(sampleId);
    updateQcState(sampleId,resetQcCropPatch());
    recordQcCropHistory(sampleId,historyBefore);
    state.crop=null;
    state.cropManual=false;
    state.cropEditing=false;
    state.cropDragging=false;
    state.qcOverlayDrag=null;
    drawQcCanvas();
    renderImageQcPanel();
    setLog('<strong>Crop reset.</strong> The raw image is restored for this QC item.');
  }

  // QC Crop cache management
  function saveQcCropToCache(sample, croppedImage, crop) {
    if(!sample) return;
    state.qcCropCache.set(sample.id, {
      img: croppedImage,
      crop: {...crop},
      timestamp: Date.now()
    });
  }

  function appendQcCropHistory(history, index, entry, limit=20) {
    const next=[...history.slice(0,index+1),entry].slice(-limit);
    return {history:next,index:next.length-1};
  }

  function qcCropHistoryForSample(sampleId) {
    if(!sampleId) return {history:[],index:-1};
    return state.qcCropHistoryBySample[sampleId]||(state.qcCropHistoryBySample[sampleId]={history:[],index:-1});
  }

  function qcCropHistorySnapshot(sampleId) {
    const qc=qcStateForSample(sampleId);
    return {
      cropRatio:qc.cropRatio?{...qc.cropRatio}:null,
      cropSaved:!!qc.cropSaved,
      cropReset:!!qc.cropReset,
      autoCropFov:!!qc.autoCropFov,
      fovCutoff:qc.fovCutoff??null,
      needsCrop:!!qc.needsCrop
    };
  }

  function recordQcCropHistory(sampleId, before, after=qcCropHistorySnapshot(sampleId)) {
    const current=qcCropHistoryForSample(sampleId);
    const next=appendQcCropHistory(current.history,current.index,{
      sampleId,
      before,
      after,
      timestamp:Date.now()
    });
    current.history=next.history;
    current.index=next.index;
    updateQcUndoRedoButtons();
  }

  function getQcCropFromCache(sampleId) {
    return state.qcCropCache.get(sampleId);
  }

  function clearQcCropCache(sampleId = null) {
    if(sampleId) {
      state.qcCropCache.delete(sampleId);
      delete state.qcCropHistoryBySample[sampleId];
    } else {
      state.qcCropCache.clear();
      state.qcCropHistoryBySample = {};
    }
  }

  function releasePreparedQcImage(sampleId) {
    const prepared=state.preparedQcImages.get(sampleId);
    if(prepared?.url) URL.revokeObjectURL(prepared.url);
    state.preparedQcImages.delete(sampleId);
  }

  function beginQcCropOperation(sampleId) {
    const operationId=(state.qcCropOperationIds.get(sampleId)||0)+1;
    state.qcCropOperationIds.set(sampleId,operationId);
    return operationId;
  }

  function invalidateQcCropOperation(sampleId) {
    beginQcCropOperation(sampleId);
  }

  function isCurrentQcCropOperation(sampleId, operationId) {
    return operationId===null||state.qcCropOperationIds.get(sampleId)===operationId;
  }

  function trackQcOperation(operation) {
    state.qcPendingOperations.add(operation);
    const clearPending=()=>{
      state.qcPendingOperations.delete(operation);
    };
    operation.then(clearPending,clearPending);
    return operation;
  }

  async function awaitTrackedQcOperations() {
    while(state.qcPendingOperations.size) {
      const pending=[...state.qcPendingOperations];
      await Promise.allSettled(pending);
    }
  }

  function canvasPngBlob(canvas) {
    return new Promise((resolve,reject)=>{
      canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not create prepared crop image.')),'image/png');
    });
  }

  async function prepareQcAnalysisInput(sample, rawImage, crop, operationId=null) {
    if(!sample||!rawImage||!crop) return null;
    const safeCrop=clampCrop({...crop},rawImage);
    const canvas=document.createElement('canvas');
    canvas.width=safeCrop.w;
    canvas.height=safeCrop.h;
    canvas.getContext('2d').drawImage(
      rawImage,
      safeCrop.x,safeCrop.y,safeCrop.w,safeCrop.h,
      0,0,safeCrop.w,safeCrop.h
    );
    const blob=await canvasPngBlob(canvas);
    if(!isCurrentQcCropOperation(sample.id,operationId)) return null;
    releasePreparedQcImage(sample.id);
    const url=URL.createObjectURL(blob);
    const prepared={
      sampleId:sample.id,
      url,
      width:safeCrop.w,
      height:safeCrop.h,
      crop:{...safeCrop},
      cropRatio:normalizedCropRatio(safeCrop,rawImage),
      createdAt:Date.now()
    };
    state.preparedQcImages.set(sample.id,prepared);
    return prepared;
  }

  function preparedQcImage(sampleId) {
    return state.preparedQcImages.get(sampleId)||null;
  }

  function analysisImageUrl(sample) {
    return preparedQcImage(sample?.id)?.url||sampleUrl(sample);
  }

  function undoQcCrop() {
    if(qcMutationBlocked()) return;
    if(!state.sample) return;
    const history=qcCropHistoryForSample(state.sample.id);
    if(history.index < 0) return;
    const historyEntry=history.history[history.index];
    if(!historyEntry) return;
    restoreQcCropHistorySnapshot(state.sample,historyEntry.before);
    history.index--;
    updateQcUndoRedoButtons();
  }

  function redoQcCrop() {
    if(qcMutationBlocked()) return;
    if(!state.sample) return;
    const history=qcCropHistoryForSample(state.sample.id);
    if(history.index >= history.history.length - 1) return;
    const historyEntry=history.history[history.index+1];
    if(!historyEntry) return;
    restoreQcCropHistorySnapshot(state.sample,historyEntry.after);
    history.index++;
    updateQcUndoRedoButtons();
  }

  async function restoreQcCropHistorySnapshot(sample, snapshot) {
    const restorePromise=(async()=>{
      const operationId=beginQcCropOperation(sample.id);
      releasePreparedQcImage(sample.id);
      state.qcCropCache.delete(sample.id);
      invalidateCropCache(sample.id);
      updateQcState(sample.id,snapshot);
      const isActive=state.sample?.id===sample.id;
      const rawImage=isActive?(state.imageOriginal||state.image):null;
      const crop=snapshot.cropRatio&&rawImage?cropFromRatio(rawImage,snapshot.cropRatio):null;
      if(isActive) {
        state.crop=crop;
        state.cropManual=!!state.crop;
        state.cropEditing=false;
        state.cropDragging=false;
        state.qcOverlayDrag=null;
        renderImageQcPanel();
      }
      try {
        if(crop) await prepareQcAnalysisInput(sample,rawImage,crop,operationId);
        if(!isCurrentQcCropOperation(sample.id,operationId)) return;
        if(state.sample?.id===sample.id) renderImageQcPanel();
      } catch(error) {
        if(!isCurrentQcCropOperation(sample.id,operationId)) return;
        setLog(`<strong>Crop history restore failed.</strong> ${escHtml(error?.message||String(error))}`);
      }
    })();
    return trackQcOperation(restorePromise);
  }

  function updateQcUndoRedoButtons() {
    if(!el.qcUndoCrop || !el.qcRedoCrop) return;
    const history=qcCropHistoryForSample(state.sample?.id);
    el.qcUndoCrop.disabled = state.qcTransitionPending||history.index < 0;
    el.qcRedoCrop.disabled = state.qcTransitionPending||history.index >= history.history.length - 1;
  }

  function applyQcCrop() {
    if(qcMutationBlocked()) return;
    if(!state.sample||!state.crop) return;
    const sample=state.sample;
    const historyBefore=qcCropHistorySnapshot(sample.id);
    const rawImage=state.imageOriginal||state.image;
    const savedCrop=clampCrop({...state.crop},rawImage);
    const cropRatio=normalizedCropRatio(savedCrop,rawImage);
    const samples=selectedGroupSamples();
    const currentIndex=samples.findIndex(item=>item.id===sample.id);
    const group=selectedGroup();
    const operationId=beginQcCropOperation(sample.id);
    if(el.qcSaveCrop) el.qcSaveCrop.disabled=true;
    setLog('<strong>Preparing crop:</strong> creating the temporary Analysis image...');
    const operation=prepareQcAnalysisInput(sample,rawImage,savedCrop,operationId).then(prepared=>{
      if(!prepared||!isCurrentQcCropOperation(sample.id,operationId)) return;
      updateQcState(sample.id,{
        cropRatio:{...cropRatio},
        cropSaved:true,
        cropReset:false,
        autoCropFov:false,
        fovCutoff:null
      });
      recordQcCropHistory(sample.id,historyBefore);
      if(group?.id) state.lastQcCropTemplateByGroup[group.id]={...cropRatio};
      state.lastQcCropTemplate={...cropRatio};
      state.crop={...savedCrop};
      state.cropEditing=false;
      state.cropDragging=false;
      state.qcOverlayDrag=null;
      setLog('<strong>Crop saved.</strong> This image keeps its crop; the next unsaved image starts from the same position.');
      const nextIndex=qcCropAutoAdvanceTarget(currentIndex,samples.length);
      renderImageQcPanel();
      if(nextIndex!==null) loadQcSampleAt(nextIndex,{openAdjust:true,advanceFromSample:sample});
    }).catch(error=>{
      if(!isCurrentQcCropOperation(sample.id,operationId)) return;
      state.cropEditing=true;
      state.cropDragging=false;
      state.qcOverlayDrag=null;
      if(el.qcSaveCrop) el.qcSaveCrop.disabled=false;
      drawQcCanvas();
      setLog(`<strong>Crop preparation failed.</strong> ${escHtml(error?.message||String(error))}`);
    });
    return trackQcOperation(operation);
  }

  function toggleQcExclude(checked) {
    if(qcMutationBlocked()) return;
    if(!state.sample) return;
    updateQcState(state.sample.id,{excluded:!!checked});
    renderImageQcPanel();
  }

  function lockedQcSnapshotEntry(sample, groupId, qc, prepared=false) {
    return {
      sampleId:sample.id,
      groupId,
      orientation:qc.orientation||'vertical',
      cropRatio:qc.cropRatio?{...qc.cropRatio}:null,
      cropSaved:!!qc.cropSaved,
      prepared:!!prepared,
      rotation:Number(qc.rotation)||0,
      fineRotation:Number(qc.fineRotation)||0,
      autoCropFov:!!qc.autoCropFov,
      fovCutoff:qc.fovCutoff!==null&&Number.isFinite(Number(qc.fovCutoff))?Number(qc.fovCutoff):null,
      excluded:!!qc.excluded,
      editedAt:qc.editedAt||null
    };
  }

  function buildLockedQcSnapshot(samples=selectedGroupSamples()) {
    const group=selectedGroup();
    return samples.map(sample=>{
      const qc=qcStateForSample(sample.id);
      return lockedQcSnapshotEntry(sample,group.id,qc,!!preparedQcImage(sample.id));
    });
  }

  function analysisInputFromQcSnapshot(snapshot=state.lockedQcSnapshot) {
    return (snapshot||[]).filter(entry=>!entry.excluded);
  }

  function qcSnapshotForSample(sampleId) {
    return (state.lockedQcSnapshot||[]).find(entry=>entry.sampleId===sampleId)||null;
  }

  function sampleExcludedFromAnalysis(sampleId) {
    return !!qcSnapshotForSample(sampleId)?.excluded;
  }

  function normalizeLockedQcSettings(settings, qc, prepared=false, orientationRotation=0) {
    const orientation=qc.orientation||settings.scratchOrientation||'vertical';
    const manualRotation=Number(qc.rotation)||0;
    const fineRotation=Number(qc.fineRotation)||0;
    return {
      ...settings,
      cropRatio:prepared?null:(qc.cropRatio||null),
      autoCrop:false,
      preparedQcInput:!!prepared,
      scratchOrientation:orientation,
      manualRotation,
      orientationRotation,
      rotation:(manualRotation+orientationRotation)%360,
      fineRotation,
      deskew:fineRotation,
      autoCropFov:!!qc.autoCropFov,
      fovCutoff:qc.fovCutoff!==null&&Number.isFinite(Number(qc.fovCutoff))?Number(qc.fovCutoff):settings.fovCutoff
    };
  }

  function settingsWithQcSnapshot(settings, sample) {
    const qc=sample?qcSnapshotForSample(sample.id):null;
    if(!qc) return settings;
    const prepared=!!preparedQcImage(sample.id);
    const orientation=qc.orientation||settings.scratchOrientation||'vertical';
    const orientationRotation=orientationRotationDeg(orientation);
    return normalizeLockedQcSettings(settings,qc,prepared,orientationRotation);
  }

  function segmentationSettingsFromPanelSettings(settings=defaultPanelSettings()) {
    const orientation=settings.scratchOrientation||'vertical';
    const manualRotation=Number(settings.manualRotation)||0;
    return {
      varianceRadius:Number(settings.varianceRadius),
      thresholdMode:settings.thresholdMode||'small',
      thresholdLevel:Number(settings.thresholdLevel),
      thresholdOffset:Number.isFinite(Number(settings.thresholdOffset))
        ? Number(settings.thresholdOffset)
        : thresholdLevelToOffset(Number(settings.thresholdLevel)),
      minComponent:Number(settings.minComponent),
      tinyIslandMode:settings.tinyIslandMode||'medium',
      fovCutoff:Number(settings.fovCutoff),
      fovMode:settings.fovMode||'cutoff',
      autoCrop:false,
      cropRatio:null,
      scratchOrientation:orientation,
      manualRotation,
      orientationRotation:orientationRotationDeg(orientation),
      rotation:(manualRotation+orientationRotationDeg(orientation))%360,
      fineRotation:Number(settings.deskew)||0,
      deskew:Number(settings.deskew)||0
    };
  }

  function settingsWithCurrentQc(settings, sample) {
    if(!sample?.id) return settings;
    const qc=qcStateForSample(sample.id);
    const prepared=!!preparedQcImage(sample.id);
    const orientation=qc.orientation||settings.scratchOrientation||'vertical';
    return normalizeLockedQcSettings(settings,qc,prepared,orientationRotationDeg(orientation));
  }

  function clearAnalysisTransitionDisplay() {
    state.imageLoadSeq=(state.imageLoadSeq||0)+1;
    state.image=null;
    state.imageOriginal=null;
    state.imageIsPreparedQc=false;
    state.sample=null;
    state.result=null;
    state.maskData=null;
    state.autoMaskData=null;
    state.fieldData=null;
    state.sourceData=null;
    state.grayData=null;
    state.varMap=null;
    state.imageName='';
    el.canvas.hidden=true;
    el.emptyState.hidden=false;
    el.canvasTitle.textContent='Loading first group image...';
    el.canvasMeta.textContent='Preparing image 1';
    el.metricsPanel.innerHTML='';
    updateGroupNavButtons();
  }

  async function continueFromQcToAnalysis() {
    if(qcMutationBlocked()) return;
    const samples=selectedGroupSamples();
    setQcTransitionPending(true);
    try {
      await awaitTrackedQcOperations();
      cancelAutoApply();
      cancelGroupMicroscopeAutoDetect();
      state.lockedQcSnapshot=buildLockedQcSnapshot(samples);
      clearAnalysisTransitionDisplay();
      if(samples.length) setMode('group',{scheduleMicroscope:false});
      setAppModule('analysis');
      if(samples.length) loadGroupSampleAt(0);
      const preparedCount=samples.filter(sample=>preparedQcImage(sample.id)).length;
      setLog(`<strong>Image QC locked:</strong> ${analysisInputFromQcSnapshot().length}/${samples.length} image(s) will be used for analysis; ${preparedCount} prepared crop image(s) ready.`);
    } finally {
      setQcTransitionPending(false);
    }
  }

  function clearMainImage() {
    cancelAutoApply();
    state.image=null; state.imageOriginal=null; state.imageIsPreparedQc=false; state.sample=null; state.result=null;
    state.maskData=null; state.autoMaskData=null; state.fieldData=null; state.sourceData=null;
    state.grayData=null; state.varMap=null; state.imageName='';
    el.canvas.hidden=true; el.emptyState.hidden=false;
    el.canvasTitle.textContent='No image loaded';
    el.canvasMeta.textContent='Drop an image or use the open button';
    el.metricsPanel.innerHTML='';
    el.rerun.disabled=true; el.exportPng.disabled=true; el.exportGroupPng.disabled=true; el.exportPlots.disabled=true; el.showAreaPlot.disabled=true; el.showWidthPlot.disabled=true; el.exportCsv.disabled=true; el.exportExcel.disabled=true;
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
    const prepared=preparedQcImage(sample.id);
    loadImage(analysisImageUrl(sample),sample,sample.path,true,{restoreGroupResult:true,preparedQc:!!prepared});
  }
  function stepGroupSample(delta) {
    const idx=currentGroupSampleIndex();
    if(idx<0) return;
    loadGroupSampleAt(idx+delta);
  }
  function deleteSelectedGroup() {
    cancelGroupMicroscopeAutoDetect();
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
      releasePreparedQcImage(id);
      clearQcCropCache(id);
      delete state.groupResults[id];
      delete state.manualOverrides[id];
      delete state.sampleSettings[id];
      delete state.imageQcState[id];
    });
    delete state.lastQcCropTemplateByGroup[group.id];
    state.calibrationReport=null;
    state.lastAutoMicroscopeGroupKey='';
    populateGroups();
    const nextGroup=groupOptions()[0];
    if(nextGroup) {
      el.groupSelect.value=nextGroup.id;
      setMode('group');
      const first=selectedGroupSamples()[0];
      if(first) loadImage(sampleUrl(first),first,first.path,true,{autoApplyAfterLoad:true});
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
    const cropMode=state.cropManual&&state.crop?'QC crop':'full image';
    const orientation=state.analysisGeometry.orientation==='horizontal'?'horizontal scratch':'vertical scratch';
    const rotation=effectiveRotationDeg()?`${effectiveRotationDeg()}deg effective rotation`:'no rotation';
    const deskew=Number(state.analysisGeometry.fineRotation)||0;
    const thresholdText=thresholdMode()==='wide'?`T-offset ${el.thresholdOffset.value}`:`T-level ${el.thresholdOffset.value}`;
    return `R${el.varianceRadius.value}, ${thresholdText}, min ${el.minComponent.value}, islands ${el.tinyIslandMode.value}, microscope ${microscopeModeLabel(el.fovMode.value)}, FOV ${el.fovCutoff.value}, ${orientation}, ${cropMode}, ${rotation}, fine rotation ${deskew}deg`;
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
      target.innerHTML=seriesCard('Series QC',done?'partial':'waiting',done?`${done}/${samples.length} images analysed`:'click Apply to group');
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
      autoCrop:false,
      cropRatio:null,
      scratchOrientation:state.analysisGeometry.orientation,
      rotation:effectiveRotationDeg()||0,
      manualRotation:state.rotation||0,
      orientationRotation:orientationRotationDeg(),
      deskew:Number(state.analysisGeometry.fineRotation)||0
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
      autoCropFov:false,
      applyCropRatioGroup:false,
      scratchOrientation:state.analysisGeometry.orientation,
      manualRotation:state.rotation||0,
      deskew:Number(state.analysisGeometry.fineRotation)||0
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
      applyCropRatioGroup:false,
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
    state.analysisGeometry.orientation=settings.scratchOrientation||'vertical';
    state.analysisGeometry.fineRotation=Number(settings.deskew)||0;
    state.rotation=Number(settings.manualRotation)||0;
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
        const img=await loadImageElement(analysisImageUrl(sample));
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
        drawLoadedImagePreview(`<strong>Auto detect microscope:</strong> selected ${microscopeModeLabel(next)} (${confidence}% vote). Auto-applying in 1 second...`);
        scheduleAutoApply(`<strong>Auto detect microscope:</strong> selected ${microscopeModeLabel(next)} (${confidence}% vote). Auto-applying in 1 second...`);
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
      if(first) loadImage(sampleUrl(first),first,first.path,true,{autoApplyAfterLoad:true});
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

  function cancelGroupMicroscopeAutoDetect() {
    if(state.autoMicroscopeDetectTimer!==null&&state.autoMicroscopeDetectTimer!==undefined) {
      window.clearTimeout(state.autoMicroscopeDetectTimer);
    }
    state.autoMicroscopeDetectTimer=null;
    state.autoMicroscopeDetectPending=false;
    state.autoMicroscopeDetectSeq=(state.autoMicroscopeDetectSeq||0)+1;
  }

  function scheduleGroupMicroscopeAutoDetect() {
    if(state.autoMicroscopeDetectTimer!==null&&state.autoMicroscopeDetectTimer!==undefined) {
      window.clearTimeout(state.autoMicroscopeDetectTimer);
    }
    state.autoMicroscopeDetectTimer=null;
    state.autoMicroscopeDetectPending=false;
    if(state.mode!=='group'||state.microscopeModeUserSet) return;
    state.autoMicroscopeDetectPending=true;
    state.autoMicroscopeDetectTimer=window.setTimeout(()=>{
      state.autoMicroscopeDetectTimer=null;
      state.autoMicroscopeDetectPending=false;
      autoDetectGroupMicroscopeMode({auto:true});
    },0);
  }

  function tutorialKeyFromUrl() {
    try {
      return new URLSearchParams(window.location.search).get('tutorial') || '';
    } catch(_) {
      return '';
    }
  }

  function tutorialSample(row, index, config) {
    return {
      id:`${config.id}-${index}`,
      imageId:`tutorial-${index+1}`,
      path:row.file,
      url:`${config.baseUrl}${row.file}`,
      cell:config.cell,
      condition:config.condition,
      time:row.time,
      area:null,
      areaPct:null,
      width:null,
      closure:null,
      confidence:'tutorial',
      custom:true,
      tutorial:true
    };
  }

  function loadTutorialGroup(key) {
    const config=TUTORIALS[key];
    if(!config) return false;
    state.tutorial={key,stepIndex:0,complete:false};
    expandAllSidebarPanelsForTutorial();
    if(config.localImageWorkflow) {
      setAppModule('qc');
      setMode('single');
      clearMainImage();
      setupTutorialCoach(config,[]);
      setLog(`<strong>${escHtml(config.label)} started.</strong> Start by loading a local image group.`);
      return true;
    }
    if(config.validationSetId) {
      const finalModule=config.finalModule||'qc';
      const preAnalyze=config.preAnalyzeValidationSet!==false;
      setAppModule(finalModule==='builder'?'builder':'qc');
      setMode('group');
      if(finalModule!=='builder') setupTutorialCoach(config,[]);
      loadServedValidationSet(config.validationSetId,{tutorial:true,finalModule,preAnalyze}).then(()=>{
        setupTutorialCoach(config,selectedGroupSamples());
      });
      setLog(`<strong>${escHtml(config.label)} started.</strong> Loading the bundled validation image set.`);
      return true;
    }
    const existingGroup=state.customGroups.find(group=>group.id===config.id);
    const samples=existingGroup
      ? existingGroup.sampleIds.map(id=>sampleById(id)).filter(Boolean)
      : config.samples.map((row,index)=>tutorialSample(row,index,config));
    if(!existingGroup) {
      state.customSamples.push(...samples);
      state.customGroups.push({
        id:config.id,
        label:config.label,
        sampleIds:samples.map(sample=>sample.id),
        custom:true,
        tutorial:true
      });
    }
    const base={...settingsFromPresetKey(config.settings?.presetKey||'standard'), ...(config.settings||{})};
    delete base.settings;
    samples.forEach(sample=>{ state.sampleSettings[sample.id]={...base}; });
    state.calibrationReport=null;
    state.microscopeModeUserSet=true;
    state.lastAutoMicroscopeGroupKey=selectedGroupKey();
    state.contourStyleUserSet=false;
    populateGroups();
    el.groupSelect.value=config.id;
    applyPanelSettings(base);
    setMode('group');
    setAppModule(config.startModule||'analysis');
    const first=samples[0];
    if(first) loadImage(sampleUrl(first),first,first.path,true,{autoApplyAfterLoad:false});
    warnIfHorizontalScratchDetected(samples);
    setupTutorialCoach(config,samples);
    setLog(`<strong>${escHtml(config.label)} loaded.</strong> Follow the tutorial panel and click the highlighted buttons.`);
    return true;
  }

  const DEFAULT_TUTORIAL_STEPS = [
    {
      key:'preset-rough',
      selector:'button[data-preset="rough"]',
      label:'Brightfield normal cells',
      title:'Select the normal-cell brightfield preset',
      body:'Start with the broader brightfield preset for this tutorial image set, then review the contour before applying it to the group.'
    },
    {
      key:'apply-first',
      selector:'#rerun',
      label:'Apply',
      title:'Analyze the first image',
      body:'Click Apply to draw the first contour overlay on the 0h image.'
    },
    {
      key:'apply-group',
      selector:'#applySettingsGroup',
      label:'Apply to group',
      title:'Run the same settings on all images',
      body:'This applies the current settings to the 0h, 24h, and 48h images so the group view can compare the time course.'
    },
    {
      key:'show-area',
      selector:'#showAreaPlot',
      label:'Area plot',
      title:'Open the wound area plot',
      body:'The area plot turns the three measurements into a closure trend that is easy to review before export.'
    },
    {
      key:'close-plot',
      selector:'#closePlot',
      label:'Close plot',
      title:'Close the plot panel',
      body:'After reviewing the trend, close the plot so the image workspace and navigation controls are visible again.'
    },
    {
      key:'next-image',
      selector:'#groupNext',
      label:'Next image',
      title:'Inspect the next time point',
      body:'Move from the 0h image to the next loaded image and confirm that the restored contour follows the wound boundary.'
    },
    {
      key:'mask-view',
      selector:'button[data-view="mask"]',
      label:'Mask',
      title:'Check the binary mask',
      body:'Switch to Mask view to inspect the exact region that contributes to the wound area measurement.'
    }
  ];

  function setupTutorialCoach(config, samples) {
    document.body.classList.add('tutorial-active');
    let coach=document.getElementById('tutorialCoach');
    if(!coach) {
      coach=document.createElement('aside');
      coach.id='tutorialCoach';
      coach.className='tutorial-coach';
      coach.setAttribute('aria-live','polite');
      document.body.appendChild(coach);
    }
    ensureTutorialPointer();
    state.tutorial={...state.tutorial,config,samples,stepIndex:0,done:new Set()};
    state.tutorialAdvancePending=false;
    state.tutorialAdvancePendingStep=null;
    const render=()=>{
      const steps=currentTutorialSteps();
      const current=steps[state.tutorial.stepIndex];
      const progress=`${Math.min(state.tutorial.stepIndex+1,steps.length)} / ${steps.length}`;
      const completed=state.tutorial.complete;
      coach.innerHTML=completed
        ? `<div class="tutorial-kicker">Guided tutorial complete</div>
           <h2>${escHtml(config.label)} is ready.</h2>
           <p>${escHtml(config.completeBody||'You selected the preset, analyzed the first image, applied settings to the group, opened the area plot, navigated the series, and inspected the mask.')}</p>
           <ol class="tutorial-steps">
             ${steps.map((step,index)=>`<li class="done"><span>${index+1}</span>${escHtml(step.label)}</li>`).join('')}
           </ol>
           <div class="tutorial-required tutorial-final-action">
             <span>Next action</span>
             <button class="tutorial-jump" id="tutorialPlaygroundButton" type="button" data-tutorial-playground>Playground</button>
           </div>
           <div class="tutorial-actions">
             <button class="tutorial-secondary" type="button" data-tutorial-restart>Restart</button>
           </div>`
        : `<div class="tutorial-kicker">Guided tutorial <span>${progress}</span></div>
           <h2>${escHtml(current.title)}</h2>
           <p>${escHtml(current.body)}</p>
           <div class="tutorial-required">
             <span>Next action</span>
             <button class="tutorial-jump" type="button" data-tutorial-jump>${escHtml(current.label)}</button>
           </div>
           <ol class="tutorial-steps">
             ${steps.map((step,index)=>`<li class="${index<state.tutorial.stepIndex?'done':index===state.tutorial.stepIndex?'current':''}"><span>${index+1}</span>${escHtml(step.label)}</li>`).join('')}
           </ol>
           <div class="tutorial-actions">
             <a class="tutorial-link" href="../tutorial/">Tutorial page</a>
             <button class="tutorial-secondary" type="button" data-tutorial-skip>Skip</button>
           </div>`;
      updateTutorialHighlight({scroll:true,restartPointer:true});
    };
    state.tutorialRender=render;
    coach.onclick=e=>{
      if(e.target.closest('[data-tutorial-jump]')) {
        const target=currentTutorialTarget();
        if(target) {
          scrollTutorialTargetIntoView(target);
          target.focus({preventScroll:true});
          if(!target.disabled) window.setTimeout(()=>performTutorialAction(currentTutorialStep(),target),160);
        }
      }
      if(e.target.closest('[data-tutorial-skip]')) {
        state.tutorial.complete=true;
        clearTutorialHighlight();
        render();
      }
      if(e.target.closest('[data-tutorial-playground]')) {
        enterTutorialPlayground(config);
      }
      if(e.target.closest('[data-tutorial-restart]')) {
        state.tutorial.stepIndex=0;
        state.tutorial.complete=false;
        state.tutorialAdvancePending=false;
        state.tutorialAdvancePendingStep=null;
        render();
      }
    };
    if(!state.tutorialListenersBound) {
      document.addEventListener('click',e=>{
        if(!state.tutorial||state.tutorial.complete) return;
        const step=currentTutorialStep();
        if(!step) return;
        if(step.event||step.action==='set-value') return;
        const target=e.target.closest(step.selector);
        if(!target||target.disabled) return;
        scheduleTutorialAdvance();
      },true);
      document.addEventListener('change',e=>{
        if(!state.tutorial||state.tutorial.complete) return;
        const step=currentTutorialStep();
        if(!step||step.event!=='change') return;
        const target=e.target.closest(step.selector);
        if(!target||target.disabled) return;
        if(step.value!==undefined&&target.value!==step.value) return;
        scheduleTutorialAdvance();
      },true);
      document.addEventListener('input',e=>{
        if(!state.tutorial||state.tutorial.complete) return;
        const step=currentTutorialStep();
        if(!step||step.event!=='input') return;
        const target=e.target.closest(step.selector);
        if(!target||target.disabled) return;
        if(step.minValue!==undefined&&Number(target.value)<Number(step.minValue)) return;
        if(step.minValue===undefined&&step.value!==undefined&&target.value!==step.value) return;
        scheduleTutorialAdvance();
      },true);
      document.addEventListener('cytomove:manual-correction',e=>{
        if(!state.tutorial||state.tutorial.complete) return;
        const step=currentTutorialStep();
        if(!step||step.event!=='cytomove:manual-correction') return;
        if(step.expectedMode&&e.detail?.mode!==step.expectedMode) return;
        const target=currentTutorialTarget();
        if(!target||target.disabled) return;
        scheduleTutorialAdvance();
      },true);
      state.tutorialListenersBound=true;
    }
    render();
    if(state.tutorialHighlightTimer) window.clearInterval(state.tutorialHighlightTimer);
    state.tutorialHighlightTimer=window.setInterval(()=>{ if(state.tutorial&&!state.tutorial.complete) updateTutorialHighlight(); },1200);
  }

  function scheduleTutorialAdvance() {
    if(!state.tutorial||state.tutorial.complete) return;
    if(state.tutorialAdvancePending&&state.tutorialAdvancePendingStep===state.tutorial.stepIndex) return;
    state.tutorialAdvancePending=true;
    state.tutorialAdvancePendingStep=state.tutorial.stepIndex;
    window.setTimeout(()=>{
      if(!state.tutorial||state.tutorial.complete) {
        state.tutorialAdvancePending=false;
        state.tutorialAdvancePendingStep=null;
        return;
      }
      if(state.tutorial.stepIndex!==state.tutorialAdvancePendingStep) {
        state.tutorialAdvancePending=false;
        state.tutorialAdvancePendingStep=null;
        return;
      }
      state.tutorialAdvancePending=false;
      state.tutorialAdvancePendingStep=null;
      advanceTutorialStep();
    },500);
  }

  function advanceTutorialStep(render) {
    state.tutorialAdvancePending=false;
    state.tutorialAdvancePendingStep=null;
    const steps=currentTutorialSteps();
    state.tutorial.stepIndex++;
    if(state.tutorial.stepIndex>=steps.length) {
      state.tutorial.complete=true;
      clearTutorialHighlight();
      const rerender=render || state.tutorialRender;
      if(typeof rerender==='function') rerender();
      return;
    }
    const rerender=render || state.tutorialRender;
    if(typeof rerender==='function') rerender();
  }

  function currentTutorialSteps() {
    return state.tutorial?.config?.steps || DEFAULT_TUTORIAL_STEPS;
  }

  function currentTutorialStep() {
    if(!state.tutorial) return null;
    if(state.tutorial.complete) {
      return {
        selector:'#tutorialPlaygroundButton',
        label:'Playground',
        title:'Continue in Playground',
        body:'Tutorial complete. Continue in Playground mode with the loaded images and current figure settings.',
        mouseHint:'Click Playground to close the guide and continue experimenting freely.'
      };
    }
    return currentTutorialSteps()[state.tutorial.stepIndex];
  }

  function currentTutorialTarget() {
    const step=currentTutorialStep();
    return step?document.querySelector(step.selector):null;
  }

  function performTutorialAction(step, target) {
    if(!step||!target||target.disabled) return;
    if(step.action==='set-value') {
      target.value=step.value;
      target.dispatchEvent(new Event(step.event||'change',{bubbles:true}));
      return;
    }
    target.click();
  }

  function clearTutorialHighlight() {
    document.querySelectorAll('.tutorial-highlight').forEach(node=>node.classList.remove('tutorial-highlight'));
    const bubble=document.getElementById('tutorialBubble');
    if(bubble) bubble.classList.remove('visible');
    const pointer=document.getElementById('tutorialPointer');
    if(pointer) pointer.classList.remove('moving','visible');
  }

  function enterTutorialPlayground(config) {
    clearTutorialHighlight();
    state.tutorial=null;
    document.body.classList.remove('tutorial-active');
    const coach=document.getElementById('tutorialCoach');
    if(coach) coach.remove();
    setLog(`<strong>Playground mode.</strong> ${escHtml(config?.label||'Tutorial images')} stays loaded, and you can change settings, redraw rectangles, undo/reset corrections, or export results freely.`);
  }

  function updateTutorialHighlight(options={}) {
    const {scroll=false,restartPointer=false}=options;
    clearTutorialHighlight();
    const target=currentTutorialTarget();
    if(!target) return;
    if(scroll) scrollTutorialTargetIntoView(target);
    target.classList.add('tutorial-highlight');
    aimTutorialPointer(target,{restart:restartPointer});
    positionTutorialBubble(target,currentTutorialStep());
    if(restartPointer) window.setTimeout(()=>aimTutorialPointer(target,{restart:false}),420);
  }

  function scrollTutorialTargetIntoView(target) {
    const containers=[
      target.closest('.sidebar'),
      target.closest('.workspace'),
      target.closest('.plot-body'),
      target.closest('.plot-dialog')
    ].filter(Boolean);
    containers.forEach(container=>{
      const targetRect=target.getBoundingClientRect();
      const containerRect=container.getBoundingClientRect();
      const targetCenter=targetRect.top + targetRect.height/2;
      const containerCenter=containerRect.top + containerRect.height/2;
      container.scrollBy({
        top: targetCenter-containerCenter,
        left: 0,
        behavior: 'auto'
      });
    });
    target.scrollIntoView({block:'center',inline:'center',behavior:'auto'});
  }

  function ensureTutorialPointer() {
    let pointer=document.getElementById('tutorialPointer');
    if(pointer) return pointer;
    pointer=document.createElement('div');
    pointer.id='tutorialPointer';
    pointer.className='tutorial-pointer';
    pointer.setAttribute('aria-hidden','true');
    pointer.innerHTML='<span class="tutorial-pointer-shaft"></span><span class="tutorial-pointer-head"></span>';
    document.body.appendChild(pointer);
    return pointer;
  }

  function ensureTutorialBubble() {
    let bubble=document.getElementById('tutorialBubble');
    if(bubble) return bubble;
    bubble=document.createElement('div');
    bubble.id='tutorialBubble';
    bubble.className='tutorial-bubble';
    bubble.setAttribute('role','status');
    bubble.setAttribute('aria-live','polite');
    document.body.appendChild(bubble);
    return bubble;
  }

  function tutorialActionHint(step, target) {
    if(!step) return '';
    if(step.mouseHint) return step.mouseHint;
    if(step.action==='set-value') return `Choose "${step.label}" from this control.`;
    if(target&&target.id==='canvas') return 'Mouse: drag a small rectangle on the image, then release.';
    return `Click "${step.label}" to continue.`;
  }

  function positionTutorialBubble(target, step) {
    if(!target||!step) return;
    const bubble=ensureTutorialBubble();
    bubble.innerHTML=`<strong>${escHtml(step.title)}</strong><span>${escHtml(tutorialActionHint(step,target))}</span>`;
    const rect=target.getBoundingClientRect();
    const margin=12;
    const maxLeft=window.innerWidth-300-margin;
    let left=rect.right+margin;
    let top=rect.top+Math.min(20,Math.max(0,rect.height/2-22));
    let placement='right';
    if(left>maxLeft) {
      left=rect.left-288-margin;
      placement='left';
    }
    if(left<margin) left=Math.min(maxLeft,Math.max(margin,rect.left));
    top=Math.max(margin,Math.min(window.innerHeight-100,top));
    bubble.style.left=`${Math.round(left)}px`;
    bubble.style.top=`${Math.round(top)}px`;
    bubble.dataset.placement=placement;
    bubble.classList.add('visible');
  }

  function aimTutorialPointer(target, options={}) {
    const {restart=false}=options;
    const pointer=ensureTutorialPointer();
    const rect=target.getBoundingClientRect();
    const coach=document.getElementById('tutorialCoach');
    const coachRect=coach?.getBoundingClientRect();
    const endX=Math.max(22,Math.min(window.innerWidth-22,rect.left+Math.min(rect.width*0.55,rect.width-8)));
    const endY=Math.max(22,Math.min(window.innerHeight-22,rect.top+Math.min(rect.height*0.55,rect.height-8)));
    let startX=window.innerWidth-78;
    let startY=74;
    if(coachRect) {
      startX=coachRect.left+38;
      startY=coachRect.top+coachRect.height-26;
    }
    pointer.style.setProperty('--pointer-start-x',`${Math.round(startX)}px`);
    pointer.style.setProperty('--pointer-start-y',`${Math.round(startY)}px`);
    pointer.style.setProperty('--pointer-end-x',`${Math.round(endX)}px`);
    pointer.style.setProperty('--pointer-end-y',`${Math.round(endY)}px`);
    pointer.classList.add('visible');
    if(restart) {
      pointer.classList.remove('moving');
      void pointer.offsetWidth;
    }
    pointer.classList.add('moving');
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
      qcFingerprint:qcFingerprintForSample(sample.id),
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
      renderGroupView({force:true});
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
    el.exportGroupPng.disabled=true;
    el.exportPlots.disabled=true;
    el.showAreaPlot.disabled=true;
    el.showWidthPlot.disabled=true;
    el.exportCsv.disabled=true;
    el.exportExcel.disabled=true;
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
    if(force) renderGroupContours(samples,{force});
    else renderCachedGroupState(samples);
    warnIfHorizontalScratchDetected(samples);
    samples.forEach(s=>{ if(state.manualOverrides[s.id]) updateGroupCardResult(s,state.manualOverrides[s.id].result); });
    updateGroupExportAvailability(samples);
    renderSeriesSummary(samples);
  }

  function updateGroupExportAvailability(samples=selectedGroupSamples()) {
    const analyzedCount=samples.filter(s=>state.manualOverrides[s.id]||state.groupResults[s.id]).length;
    el.exportGroupPng.disabled=!samples.length||analyzedCount<samples.length;
    el.exportPlots.disabled=analyzedCount<2;
    el.showAreaPlot.disabled=analyzedCount<2;
    el.showWidthPlot.disabled=analyzedCount<2;
    el.exportCsv.disabled=analyzedCount<1;
    el.exportExcel.disabled=analyzedCount<1;
  }

  function renderCachedGroupState(samples) {
    samples.forEach(sample=>{
      const result=state.manualOverrides[sample.id]||state.groupResults[sample.id];
      const canvas=el.groupView.querySelector(`canvas[data-sample-id="${sample.id}"]`);
      if(!canvas) return;
      if(result?.src&&result?.mask) {
        updateGroupCardPreview(sample,result);
        updateGroupCardResult(sample,result);
        return;
      }
      canvas.width=420; canvas.height=420;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      ctx.fillStyle='#f8fbfa';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#5b7370';
      ctx.font='600 13px Inter, sans-serif';
      ctx.fillText('Ready for Apply to group',18,28);
    });
  }

  function yieldToBrowser() {
    return new Promise(resolve=>setTimeout(resolve,0));
  }

  async function renderGroupContours(samples, options={}) {
    const force=!!options.force;
    const renderSeq=++state.groupRenderSeq;
    const previewMaxSide=Number.isFinite(options.maxSide)
      ? Math.max(0,Math.round(options.maxSide))
      : force?0:900;
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
        if(sampleExcludedFromAnalysis(sample.id)) {
          ctx.fillStyle='#fff7f6';
          ctx.fillRect(0,0,canvas.width,canvas.height);
          ctx.fillStyle='#b42336';
          ctx.font='800 15px Inter, sans-serif';
          ctx.fillText('Excluded from analysis',18,32);
          delete state.groupResults[sample.id];
          renderSeriesSummary(samples);
          continue;
        }
        const settings=settingsWithQcSnapshot(currentSegmentationSettings(),sample);
        const img=await loadImageElement(analysisImageUrl(sample));
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
        if(state.sample?.id===sample.id) restoreGroupResultToMainCanvas(sample);
        updateGroupExportAvailability(samples);
        if(state.calibrationReport) {
          state.calibrationReport=buildCalibrationReport(Object.values(state.groupResults),samples);
          renderCalibrationReport();
        }
        renderSeriesSummary(samples);
      } catch(err) {
        failPreview();
      }
      await yieldToBrowser();
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
    el.dropZone.hidden=state.appModule==='builder'||state.appModule==='qc';
    el.groupView.hidden=state.appModule==='builder'||state.appModule==='qc'||!isGroup;
    if(isGroup) {
      renderGroupView(options);
      setLog('<strong>Group review:</strong> images are ready. Click a card to tune one image, then use Apply to group.');
      if(options.scheduleMicroscope!==false) scheduleGroupMicroscopeAutoDetect();
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
    if(state.appModule==='builder') renderPublicationBuilder();
    if(state.appModule==='qc') renderImageQcPanel();
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
    el.contourThicknessVal.value=el.contourThickness.value;
    el.brushSizeVal.value=el.brushSize.value;
    el.brushMode.querySelectorAll('[data-brush-mode]').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.brushMode===state.brushMode);
    });
    el.resetBrush.disabled=!state.brushEdited;
    el.undoBrush.disabled=state.brushHistory.length===0;
    el.canvas.style.cursor=brushActive()?'crosshair':state.rulerVisible&&!state.cropEditing?'grab':'';
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

  function expandAllSidebarPanelsForTutorial() {
    document.querySelectorAll('.sidebar .section:not([hidden]), .sidebar .subpanel').forEach(panel=>{
      const title=Array.from(panel.children).find(child=>child.classList?.contains('section-title')||child.classList?.contains('subpanel-title'));
      if(title) setCollapsibleOpen(panel,title,true);
    });
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
        byId('fovCutoff'),
        document.getElementById('microscopeMode')?.closest('.control'),
      ]);
      segContent.append(basic);
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
  function loadImage(src,sample=null,name='',keepMode=false,options={}) {
    cancelAutoApply();
    rememberCurrentSampleSettings();
    if(state.mode!=='single'&&!keepMode) setMode('single');
    setSpinner(true); setLog('Loading image...');
    const loadSeq=(state.imageLoadSeq||0)+1;
    state.imageLoadSeq=loadSeq;
    const img=new Image(); img.decoding='async';
    img.onload=()=>{
      if(loadSeq!==state.imageLoadSeq) return;
      state.image=img; state.imageOriginal=img; state.sample=sample; state.rotation=0;
      state.imageIsPreparedQc=!!options.preparedQc;
      state.analysisGeometry={orientation:'vertical',fineRotation:0};
      state.rulerOffsetX=0; state.rulerOffsetY=0; state.rulerDragging=false; state.rulerDragStart=null;
      state.imageName=name||sample?.path||'local image';
      resetCropAndZoom();
      applyPanelSettings(sampleSettings(sample)||defaultPanelSettings());
      // Apply QC state when loading from QC or when in analysis mode with QC snapshot
      if((options.fromQc||state.lockedQcSnapshot)&&sample) {
        applyQcStateToCurrentImage(sample,{
          preparedInput:!!options.preparedQc,
          openAdjust:!!options.openAdjust
        });
      }
      if(options.fromQc&&options.advanceFromSample&&sample) {
        const qcSamples=selectedGroupSamples();
        showQcAdvanceFeedback(
          options.advanceFromSample,
          sample,
          qcSamples.findIndex(item=>item.id===sample.id),
          qcSamples.length
        );
      }
      state.zoom=1; state.panX=0; state.panY=0;
      el.canvas.style.transform='';
      el.canvas.hidden=false; el.emptyState.hidden=true;
      el.canvasTitle.textContent=state.imageName.split('/').pop()||state.imageName;
      updateGroupNavButtons();
      const readyMessage='<strong>Image ready.</strong> Adjust settings on the first image, then click Apply. Use Apply to group when the settings look right.';
      const showReadyPreview=()=> {
        if(options.restoreGroupResult&&restoreGroupResultToMainCanvas(sample)) return;
        previewLoadedImageAndMaybeAutoApply(readyMessage,!!options.autoApplyAfterLoad,options.autoApplyMessage);
        if(sample) warnIfHorizontalScratchDetected([sample]);
        if(options.fromQc||state.appModule==='qc') renderImageQcPanel();
      };
      if(effectiveRotationDeg()||(Number(state.analysisGeometry.fineRotation)||0)) applyImageTransform({restoreManual:true,analyze:false,restoreGroupResult:!!options.restoreGroupResult,autoApplyAfterLoad:!!options.autoApplyAfterLoad,logMessage:readyMessage});
      else showReadyPreview();
    };
    img.onerror=()=>{
      if(loadSeq!==state.imageLoadSeq) return;
      setSpinner(false);
      setLog('<strong>Image load failed.</strong> Run a local HTTP server from the repo root (e.g. <code>python -m http.server</code>) to serve the wound healing archive.');
    };
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

  let pendingGroupNameDialog=null;

  function closeGroupNameDialog(value) {
    const pending=pendingGroupNameDialog;
    pendingGroupNameDialog=null;
    if(el.groupNameDialog) el.groupNameDialog.hidden=true;
    if(el.confirmGroupName) el.confirmGroupName.onclick=null;
    if(el.cancelGroupName) el.cancelGroupName.onclick=null;
    if(el.groupNameInput) el.groupNameInput.onkeydown=null;
    if(pending) pending.resolve(value);
  }

  function showGroupNameDialog(files, suggested) {
    if(!el.groupNameDialog||!el.groupNameInput||!el.confirmGroupName||!el.cancelGroupName) return Promise.resolve(suggested);
    if(pendingGroupNameDialog) closeGroupNameDialog(null);
    if(el.groupNameHint) {
      el.groupNameHint.textContent=`Cytomove will create one reviewable group from ${files.length} selected images.`;
    }
    el.groupNameInput.value=suggested;
    el.groupNameDialog.hidden=false;
    el.groupNameInput.focus();
    el.groupNameInput.select();
    return new Promise(resolve=>{
      pendingGroupNameDialog={resolve};
      el.confirmGroupName.onclick=()=>{
        const label=(el.groupNameInput.value||'').trim()||suggested;
        closeGroupNameDialog(label);
      };
      el.cancelGroupName.onclick=()=>closeGroupNameDialog(null);
      el.groupNameInput.onkeydown=event=>{
        if(event.key==='Enter') {
          event.preventDefault();
          const label=(el.groupNameInput.value||'').trim()||suggested;
          closeGroupNameDialog(label);
        } else if(event.key==='Escape') {
          event.preventDefault();
          closeGroupNameDialog(null);
        }
      };
    });
  }

  async function askCustomGroupName(files) {
    const suggested=suggestedCustomGroupName(files);
    return showGroupNameDialog(files,suggested);
  }

  function customFileTimeMatch(stem) {
    return stem.match(/(?:^|[_\-\s])t(\d+)(?:[_\-\s]|$)/i)
      || stem.match(/(\d+)\s*h/i)
      || stem.match(/_(\d+)$/)
      || stem.match(/^(\d+)$/);
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

  function createCustomGroupFromFiles(images, groupLabel, options={}) {
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
    if(options.open!==false) {
      el.groupSelect.value=groupId;
      initializeGroupPresetAndOpen(samples,groupLabel);
    }
    return {groupId,samples,groupLabel};
  }

  class ValidationAssetError extends Error {
    constructor(message='Validation asset unavailable') {
      super(message);
      this.name='ValidationAssetError';
    }
  }

  async function fetchServedImageFile(relativePath) {
    if(window.location.protocol==='file:'&&window.cytomoveDesktop?.readValidationAsset) {
      const item=await window.cytomoveDesktop.readValidationAsset(relativePath);
      return new File([new Uint8Array(item.bytes)],item.name,{type:item.type||'image/jpeg'});
    }
    let response;
    try {
      response=await fetch(relativePath);
    } catch(_) {
      throw new ValidationAssetError();
    }
    if(!response.ok) throw new ValidationAssetError();
    const blob=await response.blob();
    const name=relativePath.split('/').pop()||'image.jpg';
    return new File([blob],name,{type:blob.type||'image/jpeg'});
  }

  async function analyzeImportedGroup(groupId) {
    const group=groupById(groupId);
    if(!group) return;
    const samples=group.sampleIds.map(id=>sampleById(id)).filter(Boolean);
    if(!samples.length) return;
    if(el.groupSelect) el.groupSelect.value=groupId;
    const base=settingsFromPresetKey('standard');
    samples.forEach(sample=>{ state.sampleSettings[sample.id]={...base}; });
    applyPanelSettings(base);
    state.lastAutoMicroscopeGroupKey=selectedGroupKey();
    setMode('group',{scheduleMicroscope:false});
    await renderGroupContours(samples,{force:true,maxSide:480});
  }

  function validationAssetErrorMessage() {
    return 'Validation images are unavailable in this build. Run the app from the repository root or provide the local validation assets.';
  }

  function validationSessionSnapshot(stateLike, elements={}) {
    const builderState={};
    Object.entries(stateLike.publicationBuilderState||{}).forEach(([key,value])=>{
      builderState[key]=Array.isArray(value)?[...value]:value;
    });
    return {
      appModule:stateLike.appModule,
      mode:stateLike.mode,
      groupId:elements.groupSelect?.value||'',
      sampleSelectId:elements.sampleSelect?.value||'',
      image:stateLike.image,
      imageOriginal:stateLike.imageOriginal,
      imageName:stateLike.imageName,
      sample:stateLike.sample,
      result:stateLike.result,
      crop:stateLike.crop?{...stateLike.crop}:stateLike.crop,
      cropManual:stateLike.cropManual,
      cropEditing:stateLike.cropEditing,
      rotation:stateLike.rotation,
      zoom:stateLike.zoom,
      panX:stateLike.panX,
      panY:stateLike.panY,
      rulerVisible:stateLike.rulerVisible,
      rulerOffsetX:stateLike.rulerOffsetX,
      rulerOffsetY:stateLike.rulerOffsetY,
      imageIsPreparedQc:stateLike.imageIsPreparedQc,
      maskData:stateLike.maskData,
      autoMaskData:stateLike.autoMaskData,
      fieldData:stateLike.fieldData,
      sourceData:stateLike.sourceData,
      grayData:stateLike.grayData,
      varMap:stateLike.varMap,
      panelSettings:stateLike.panelSettings?{...stateLike.panelSettings}:null,
      sampleSettings:Object.fromEntries(Object.entries(stateLike.sampleSettings||{}).map(([id,settings])=>[id,{...settings}])),
      lockedQcSnapshot:Array.isArray(stateLike.lockedQcSnapshot)?stateLike.lockedQcSnapshot.map(item=>({...item})):stateLike.lockedQcSnapshot,
      calibrationReport:stateLike.calibrationReport,
      microscopeModeUserSet:stateLike.microscopeModeUserSet,
      lastAutoMicroscopeGroupKey:stateLike.lastAutoMicroscopeGroupKey,
      contourStyleUserSet:stateLike.contourStyleUserSet,
      publicationBuilderState:builderState,
      builderControlGroup:elements.builderControlGroup?.value||'',
      builderTreatmentGroup:elements.builderTreatmentGroup?.value||'',
      builderControlLabel:elements.builderControlLabel?.value||'',
      builderTreatmentLabel:elements.builderTreatmentLabel?.value||'',
      builderCellType:elements.builderCellType?.value||'',
      builderReplicate:elements.builderReplicate?.value||'',
      canvasTitle:elements.canvasTitle?.textContent||'',
      canvasMeta:elements.canvasMeta?.textContent||'',
      canvasHidden:!!elements.canvas?.hidden,
      emptyStateHidden:!!elements.emptyState?.hidden
    };
  }

  function validationGroupAnalysisComplete(samples=[], context={}) {
    const results=context.groupResults||{};
    const overrides=context.manualOverrides||{};
    const excluded=new Set(context.excludedSampleIds||[]);
    const eligible=samples.filter(sample=>sample?.id&&!excluded.has(sample.id));
    if(!eligible.length) return false;
    return eligible.every(sample=>{
      const result=overrides[sample.id]?.result||results[sample.id]||(context.currentSampleId===sample.id?context.currentResult:null);
      return Number.isFinite(result?.area)&&Number.isFinite(result?.wMean);
    });
  }

  function validationLoadErrorMessage(err) {
    return err?.name==='ValidationAssetError'
      ? validationAssetErrorMessage()
      : 'Validation analysis could not be completed in this session.';
  }

  function validationOwnershipSnapshot(stateLike) {
    return {
      groupIds:(stateLike.customGroups||[]).map(group=>group.id),
      sampleIds:(stateLike.customSamples||[]).map(sample=>sample.id),
      objectUrls:[...(stateLike.objectUrls||[])]
    };
  }

  function recordValidationOwnershipChanges(ownership, before, after) {
    ['groupIds','sampleIds','objectUrls'].forEach(key=>{
      const prior=new Set(before[key]||[]);
      const owned=new Set(ownership[key]||[]);
      (after[key]||[]).forEach(value=>{ if(!prior.has(value)) owned.add(value); });
      ownership[key]=[...owned];
    });
    return ownership;
  }

  function cleanupValidationOwnedResources(ownership) {
    const groupIds=new Set(ownership?.groupIds||[]);
    const sampleIds=new Set(ownership?.sampleIds||[]);
    const objectUrls=new Set(ownership?.objectUrls||[]);
    objectUrls.forEach(url=>URL.revokeObjectURL(url));
    state.objectUrls=state.objectUrls.filter(url=>!objectUrls.has(url));
    state.customGroups=state.customGroups.filter(group=>!groupIds.has(group.id));
    state.customSamples=state.customSamples.filter(sample=>!sampleIds.has(sample.id));
    sampleIds.forEach(id=>{
      releasePreparedQcImage(id);
      clearQcCropCache(id);
      delete state.groupResults[id];
      delete state.manualOverrides[id];
      delete state.sampleSettings[id];
      delete state.imageQcState[id];
    });
    groupIds.forEach(id=>delete state.lastQcCropTemplateByGroup[id]);
    populateGroups();
  }

  function restoreValidationSessionValues(stateLike, elements, snapshot) {
    stateLike.appModule=snapshot.appModule;
    stateLike.mode=snapshot.mode;
    stateLike.publicationBuilderState=snapshot.publicationBuilderState;
    stateLike.image=snapshot.image;
    stateLike.imageOriginal=snapshot.imageOriginal;
    stateLike.imageName=snapshot.imageName;
    stateLike.sample=snapshot.sample;
    stateLike.result=snapshot.result;
    stateLike.crop=snapshot.crop?{...snapshot.crop}:snapshot.crop;
    stateLike.cropManual=snapshot.cropManual;
    stateLike.cropEditing=snapshot.cropEditing;
    stateLike.rotation=snapshot.rotation;
    stateLike.zoom=snapshot.zoom;
    stateLike.panX=snapshot.panX;
    stateLike.panY=snapshot.panY;
    stateLike.rulerVisible=snapshot.rulerVisible;
    stateLike.rulerOffsetX=snapshot.rulerOffsetX;
    stateLike.rulerOffsetY=snapshot.rulerOffsetY;
    stateLike.imageIsPreparedQc=snapshot.imageIsPreparedQc;
    stateLike.maskData=snapshot.maskData;
    stateLike.autoMaskData=snapshot.autoMaskData;
    stateLike.fieldData=snapshot.fieldData;
    stateLike.sourceData=snapshot.sourceData;
    stateLike.grayData=snapshot.grayData;
    stateLike.varMap=snapshot.varMap;
    stateLike.sampleSettings=snapshot.sampleSettings;
    stateLike.lockedQcSnapshot=snapshot.lockedQcSnapshot;
    stateLike.calibrationReport=snapshot.calibrationReport;
    stateLike.microscopeModeUserSet=snapshot.microscopeModeUserSet;
    stateLike.lastAutoMicroscopeGroupKey=snapshot.lastAutoMicroscopeGroupKey;
    stateLike.contourStyleUserSet=snapshot.contourStyleUserSet;
    if(elements.groupSelect) elements.groupSelect.value=snapshot.groupId;
    if(elements.sampleSelect) elements.sampleSelect.value=snapshot.sampleSelectId;
    if(elements.builderControlLabel) elements.builderControlLabel.value=snapshot.builderControlLabel;
    if(elements.builderTreatmentLabel) elements.builderTreatmentLabel.value=snapshot.builderTreatmentLabel;
    if(elements.builderCellType) elements.builderCellType.value=snapshot.builderCellType;
    if(elements.builderReplicate) elements.builderReplicate.value=snapshot.builderReplicate;
    if(elements.canvasTitle) elements.canvasTitle.textContent=snapshot.canvasTitle;
    if(elements.canvasMeta) elements.canvasMeta.textContent=snapshot.canvasMeta;
    if(elements.canvas) {
      elements.canvas.hidden=snapshot.canvasHidden;
      elements.canvas.style.transform=`scale(${snapshot.zoom}) translate(${snapshot.panX/snapshot.zoom}px,${snapshot.panY/snapshot.zoom}px)`;
    }
    if(elements.emptyState) elements.emptyState.hidden=snapshot.emptyStateHidden;
  }

  function setValidationLoadControlsLocked(locked, previous=null) {
    if(locked) {
      const snapshot={
        fileInputDisabled:!!el.fileInput?.disabled,
        groupSelectDisabled:!!el.groupSelect?.disabled,
        deleteGroupDisabled:!!el.deleteGroup?.disabled,
        openFileAriaDisabled:el.openFile?.getAttribute('aria-disabled'),
        openFilePointerEvents:el.openFile?.style.pointerEvents||''
      };
      if(el.fileInput) el.fileInput.disabled=true;
      if(el.groupSelect) el.groupSelect.disabled=true;
      if(el.deleteGroup) el.deleteGroup.disabled=true;
      if(el.openFile) {
        el.openFile.setAttribute('aria-disabled','true');
        el.openFile.style.pointerEvents='none';
      }
      return snapshot;
    }
    if(el.fileInput) el.fileInput.disabled=!!previous?.fileInputDisabled;
    if(el.groupSelect) el.groupSelect.disabled=!!previous?.groupSelectDisabled;
    if(el.deleteGroup) el.deleteGroup.disabled=!!previous?.deleteGroupDisabled;
    if(el.openFile) {
      if(previous?.openFileAriaDisabled===null||previous?.openFileAriaDisabled===undefined) el.openFile.removeAttribute('aria-disabled');
      else el.openFile.setAttribute('aria-disabled',previous.openFileAriaDisabled);
      el.openFile.style.pointerEvents=previous?.openFilePointerEvents||'';
    }
    return previous;
  }

  function restoreValidationSessionState(snapshot) {
    if(!snapshot) return;
    cancelAutoApply();
    cancelGroupMicroscopeAutoDetect();
    state.imageLoadSeq=(state.imageLoadSeq||0)+1;
    state.groupRenderSeq=(state.groupRenderSeq||0)+1;
    state.cropDragging=false;
    state.rulerDragging=false;
    state.panning=false;
    restoreValidationSessionValues(state,el,snapshot);
    applyPanelSettings(snapshot.panelSettings);
    populateGroups();
    if(el.groupSelect) el.groupSelect.value=snapshot.groupId;
    populateBuilderGroupSelects();
    if(el.builderControlGroup) el.builderControlGroup.value=snapshot.builderControlGroup;
    if(el.builderTreatmentGroup) el.builderTreatmentGroup.value=snapshot.builderTreatmentGroup;
    if(el.modeToggle) el.modeToggle.querySelectorAll('[data-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.mode===snapshot.mode));
    if(el.moduleTabs) el.moduleTabs.querySelectorAll('[data-module]').forEach(btn=>btn.classList.toggle('active',btn.dataset.module===snapshot.appModule));
    document.querySelectorAll('.sidebar-inner > .section').forEach(section=>{
      const isBuilder=section.id==='publicationBuilderControls';
      const isReview=section.id==='reviewModeSection';
      section.hidden=sidebarSectionHiddenForModule(snapshot.appModule,isBuilder,isReview,section.dataset.moduleDefaultHidden==='1');
    });
    if(el.imageQcPanel) el.imageQcPanel.hidden=snapshot.appModule!=='qc';
    if(el.publicationBuilderPanel) el.publicationBuilderPanel.hidden=snapshot.appModule!=='builder';
    if(el.dropZone) el.dropZone.hidden=snapshot.appModule==='builder'||snapshot.appModule==='qc';
    if(el.groupView) el.groupView.hidden=snapshot.appModule==='builder'||snapshot.appModule==='qc'||snapshot.mode!=='group';
    if(snapshot.appModule==='builder') renderPublicationBuilder();
    else if(snapshot.appModule==='qc') {
      drawQcCanvas();
      renderQcCropOverlay();
    }
    else if(snapshot.mode==='group'&&groupById(snapshot.groupId)) renderGroupView();
    else if(snapshot.image) drawLoadedImage();
    restoreValidationSessionValues(state,el,snapshot);
    syncLabels();
    updateGroupNavButtons();
  }

  async function loadServedValidationSet(setId, options={}) {
    if(state.validationLoadActive) {
      setLog('<strong>Validation set:</strong> a validation load is already in progress.');
      return;
    }
    const config=VALIDATION_SETS[setId];
    if(!config) {
      setLog('<strong>Validation set:</strong> choose a known validation set first.');
      return;
    }
    const sessionSnapshot=validationSessionSnapshot({...state,panelSettings:currentPanelSettings()},el);
    cancelGroupMicroscopeAutoDetect();
    state.validationLoadActive=true;
    const controlsSnapshot=setValidationLoadControlsLocked(true);
    setSpinner(true);
    if(el.loadBuilderValidationSet) el.loadBuilderValidationSet.disabled=true;
    const imported=[];
    const ownership={groupIds:[],sampleIds:[],objectUrls:[]};
    let validationLoaded=false;
    try {
      const validationPaths=[...new Set(config.groups.flatMap(group=>group.files))];
      const validationFiles=new Map();
      await Promise.all(validationPaths.map(async relativePath=>{
        validationFiles.set(relativePath,await fetchServedImageFile(relativePath));
      }));
      for(const group of config.groups) {
        const files=group.files.map(relativePath=>validationFiles.get(relativePath));
        const before=validationOwnershipSnapshot(state);
        let created;
        try {
          created=createCustomGroupFromFiles(files,group.label,{open:false});
        } finally {
          recordValidationOwnershipChanges(ownership,before,validationOwnershipSnapshot(state));
          setValidationLoadControlsLocked(true);
        }
        imported.push({...group,...created});
      }
      const preAnalyze=options.preAnalyze!==false;
      if(preAnalyze) {
        for(const group of imported) {
          await analyzeImportedGroup(group.groupId);
          if(!validationGroupAnalysisComplete(group.samples,{
            groupResults:state.groupResults,
            manualOverrides:state.manualOverrides,
            currentSampleId:state.sample?.id,
            currentResult:state.result,
            excludedSampleIds:group.samples.filter(sample=>sampleExcludedFromAnalysis(sample.id)).map(sample=>sample.id)
          })) {
            throw new Error('Validation analysis incomplete');
          }
        }
      }
      const applyImportedAssignments=()=>{
        const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
        builderState.controlReplicateIds=imported.filter(group=>group.condition==='control').map(group=>group.groupId);
        builderState.treatmentReplicateIds=imported.filter(group=>group.condition==='treatment').map(group=>group.groupId);
        builderState.controlRepresentativeId=builderState.controlReplicateIds[0]||'';
        builderState.treatmentRepresentativeId=builderState.treatmentReplicateIds[0]||'';
      };
      applyImportedAssignments();
      if(el.builderControlLabel) el.builderControlLabel.value=config.controlLabel;
      if(el.builderTreatmentLabel) el.builderTreatmentLabel.value=config.treatmentLabel;
      if(el.builderCellType) el.builderCellType.value=config.cellType;
      if(el.builderReplicate) el.builderReplicate.value=`n=${Math.min(imported.filter(group=>group.condition==='control').length,imported.filter(group=>group.condition==='treatment').length)||1}`;
      applyImportedAssignments();
      populateBuilderGroupSelects();
      [...(el.builderControlReplicates?.querySelectorAll('input[data-builder-replicate]')||[])].forEach(input=>{
        input.checked=imported.some(group=>group.condition==='control'&&group.groupId===input.value);
      });
      [...(el.builderTreatmentReplicates?.querySelectorAll('input[data-builder-replicate]')||[])].forEach(input=>{
        input.checked=imported.some(group=>group.condition==='treatment'&&group.groupId===input.value);
      });
      if(el.builderControlGroup) el.builderControlGroup.value=imported.find(group=>group.condition==='control')?.groupId||el.builderControlGroup.value;
      if(el.builderTreatmentGroup) el.builderTreatmentGroup.value=imported.find(group=>group.condition==='treatment')?.groupId||el.builderTreatmentGroup.value;
      const finalModule=options.finalModule||'qc';
      if(finalModule==='qc') {
        if(el.groupSelect) el.groupSelect.value=imported[0]?.groupId||el.groupSelect.value;
        setAppModule('qc');
        setMode('group',{scheduleMicroscope:false});
        loadQcSampleAt(0,{openAdjust:false});
      } else {
        setAppModule('builder');
        renderPublicationBuilder();
      }
      validationLoaded=true;
      setLog(preAnalyze
        ? `<strong>Validation set loaded:</strong> ${config.label}. Imported ${imported.length} groups and analyzed their image series for replicate testing.`
        : `<strong>Validation set loaded:</strong> ${config.label}. Imported ${imported.length} groups and opened the first image for Image QC.`);
    } catch(err) {
      cleanupValidationOwnedResources(ownership);
      restoreValidationSessionState(sessionSnapshot);
      setLog(`<strong>Validation set unavailable.</strong> ${validationLoadErrorMessage(err)}`);
    } finally {
      state.validationLoadActive=false;
      setValidationLoadControlsLocked(false,controlsSnapshot);
      if(validationLoaded) {
        if(el.groupSelect) el.groupSelect.disabled=!groupOptions().length;
        if(el.deleteGroup) el.deleteGroup.disabled=!groupOptions().length;
      }
      if(el.loadBuilderValidationSet) el.loadBuilderValidationSet.disabled=false;
      setSpinner(false);
    }
  }

  async function loadLocalFiles(files) {
    if(state.validationLoadActive) {
      setLog('<strong>Validation load in progress.</strong> Wait for it to finish before opening local images.');
      return;
    }
    const picked=Array.from(files||[]);
    const tiffs=picked.filter(f=>/\.(tif|tiff)$/i.test(f.name));
    if(tiffs.length) {
      setLog(`<strong>TIFF is not browser-decodable here.</strong> Use PNG/JPEG copies for review. Converted WHAD/CAMAD PNGs are under <code>validation_ref_sets/browser_ready/whad_camad_png/</code>.`);
      return;
    }
    const allImages=picked
      .filter(f=>f.type.startsWith('image/')||/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f.name))
      .map((file,index)=>({file,key:customFileSortKey(file,index)}))
      .sort((a,b)=>(a.key.time-b.key.time)||a.key.name.localeCompare(b.key.name)||a.key.index-b.key.index)
      .map(item=>item.file);
    const images=allImages.slice(0,48);
    if(!images.length) return;
    const limitNote=allImages.length>48
      ? ` <strong>Image limit:</strong> ${allImages.length} files were selected; the first 48 sorted images were loaded.`
      : '';
    if(images.length===1) {
      const singleUrl=URL.createObjectURL(images[0]);
      state.objectUrls.push(singleUrl);
      loadImage(singleUrl,null,images[0].name,false,{autoApplyAfterLoad:true});
      if(limitNote) setLog(limitNote);
      return;
    }
    const groupLabel=await askCustomGroupName(images);
    if(!groupLabel) {
      setLog('<strong>Group import cancelled.</strong> No local image group was created.');
      return;
    }
    createCustomGroupFromFiles(images,groupLabel);
    if(limitNote) setLog(`<strong>Group loaded:</strong> ${images.length} images. ${limitNote}`);
  }

  function openImageGroupPicker() {
    if(state.validationLoadActive) {
      setLog('<strong>Validation load in progress.</strong> Wait for it to finish before opening local images.');
      return;
    }
    if(!el.fileInput) return;
    el.fileInput.multiple=true;
    el.fileInput.click();
  }

  // Events
  function bindEvents() {
    if(el.moduleTabs) el.moduleTabs.addEventListener('click',e=>{
      if(qcMutationBlocked()) return;
      const btn=e.target.closest('[data-module]');
      if(!btn) return;
      setAppModule(btn.dataset.module);
    });
    el.modeToggle.addEventListener('click',e=>{
      if(qcMutationBlocked()) return;
      const btn=e.target.closest('[data-mode]');if(!btn)return;
      setMode(btn.dataset.mode);
    });
    el.groupSelect.addEventListener('change',()=>{
      if(qcMutationBlocked()) return;
      cancelGroupMicroscopeAutoDetect();
      state.microscopeModeUserSet=false;
      state.lastAutoMicroscopeGroupKey='';
      if(state.appModule==='qc') {
        state.sample=null;
        state.image=null;
        state.imageOriginal=null;
        state.crop=null;
        state.cropManual=false;
      state.cropEditing=false;
      state.qcPreviewBaseCanvas=null;
      state.qcPreviewBaseImage=null;
        const samples=selectedGroupSamples();
        if(samples.length) loadQcSampleAt(0);
        else renderImageQcPanel();
        updateGroupNavButtons();
        return;
      }
      if(state.mode==='group') {
        renderGroupView();
        if(selectedGroupSamples().length) loadGroupSampleAt(0);
        scheduleGroupMicroscopeAutoDetect();
      }
      updateGroupNavButtons();
    });
    if(el.qcImageList) el.qcImageList.addEventListener('click',e=>{
      if(qcMutationBlocked()) return;
      const row=e.target.closest('[data-qc-index]');
      if(!row) return;
      loadQcSampleAt(Number(row.dataset.qcIndex));
    });
    if(el.qcOrientation) el.qcOrientation.addEventListener('change',()=>applyQcOrientation(el.qcOrientation.value));
    if(el.qcRotateLeft) el.qcRotateLeft.addEventListener('click',()=>applyQcRotation(-90));
    if(el.qcRotateRight) el.qcRotateRight.addEventListener('click',()=>applyQcRotation(90));
    bindNumberPair(el.qcFineRotation,el.qcFineRotationVal,()=>applyQcFineRotation(el.qcFineRotation.value));
    if(el.qcAngleRulerToggle) el.qcAngleRulerToggle.addEventListener('click',toggleQcAngleRuler);
    if(el.qcAutoCropFov) el.qcAutoCropFov.addEventListener('change',()=>toggleQcAutoCrop(el.qcAutoCropFov.checked));
    if(el.qcAdjustCrop) el.qcAdjustCrop.addEventListener('click',beginQcCropEdit);
    if(el.qcSaveCrop) el.qcSaveCrop.addEventListener('click',applyQcCrop);
    if(el.qcResetCrop) el.qcResetCrop.addEventListener('click',resetQcCrop);
    if(el.qcExcludeToggle) el.qcExcludeToggle.addEventListener('change',()=>toggleQcExclude(el.qcExcludeToggle.checked));
    if(el.qcUndoCrop) el.qcUndoCrop.addEventListener('click',undoQcCrop);
    if(el.qcRedoCrop) el.qcRedoCrop.addEventListener('click',redoQcCrop);
    if(el.qcPrevImage) el.qcPrevImage.addEventListener('click',qcPreviousImage);
    if(el.qcNextImage) el.qcNextImage.addEventListener('click',qcNextImage);
    if(el.goToAnalysisFromQc) el.goToAnalysisFromQc.addEventListener('click',()=>{ continueFromQcToAnalysis().catch(error=>{
      setQcTransitionPending(false);
      setLog(`<strong>Could not continue to Analysis.</strong> ${escHtml(error?.message||String(error))}`);
    }); });
    if(el.qcCanvas) {
      el.qcCanvas.addEventListener('pointerdown',beginQcRulerDrag);
      el.qcCanvas.addEventListener('pointermove',updateQcRulerDrag);
      el.qcCanvas.addEventListener('pointerup',finishQcRulerDrag);
      el.qcCanvas.addEventListener('pointercancel',finishQcRulerDrag);
    }
    if(el.qcCropOverlay) {
      el.qcCropOverlay.addEventListener('pointerdown',beginQcOverlayDrag);
      el.qcCropOverlay.addEventListener('pointermove',updateQcOverlayDrag);
      el.qcCropOverlay.addEventListener('pointerup',finishQcOverlayDrag);
      el.qcCropOverlay.addEventListener('pointercancel',finishQcOverlayDrag);
    }
    window.addEventListener('resize',renderQcCropOverlay);
    if(el.addImageGroup) el.addImageGroup.addEventListener('click',openImageGroupPicker);
    el.deleteGroup.addEventListener('click',deleteSelectedGroup);
    el.groupPrev.addEventListener('click',()=>stepGroupSample(-1));
    el.groupNext.addEventListener('click',()=>stepGroupSample(1));
    el.exportGroupPng.addEventListener('click',exportGroupPngOverlays);
    el.exportPlots.addEventListener('click',()=>showExportStylePanel('group'));
    if(el.refreshBuilderFigure) el.refreshBuilderFigure.addEventListener('click',refreshPublicationBuilderPreview);
    if(el.analyzeMissingBuilderGroups) el.analyzeMissingBuilderGroups.addEventListener('click',()=>{ analyzeMissingBuilderGroups(); });
    if(el.builderSelectedPanel) el.builderSelectedPanel.addEventListener('change',()=>selectBuilderPanel(el.builderSelectedPanel.value));
    if(el.builderPanelTitle) {
      el.builderPanelTitle.addEventListener('input',()=>{
        const builderState=builderPanelState();
        builderState.panelTitles[state.builderSelectedPanel||'A']=el.builderPanelTitle.value.trim();
        markBuilderPreviewDirty();
      });
    }
    [el.builderPanelFont,el.builderPanelFontSize,el.builderPanelFontWeight].filter(Boolean).forEach(control=>{
      control.addEventListener('change',applyBuilderPanelTypography);
    });
    if(el.resetBuilderLayout) el.resetBuilderLayout.addEventListener('click',resetBuilderPanelLayout);
    if(el.builderPanelOverlay) {
      el.builderPanelOverlay.querySelectorAll('[data-builder-panel]').forEach(handle=>{
        handle.addEventListener('pointerdown',beginBuilderPanelDrag);
        handle.addEventListener('pointermove',moveBuilderPanelDrag);
        handle.addEventListener('pointerup',finishBuilderPanelDrag);
        handle.addEventListener('pointercancel',finishBuilderPanelDrag);
      });
    }
    if(el.loadBuilderValidationSet) el.loadBuilderValidationSet.addEventListener('click',()=>loadServedValidationSet(el.builderValidationSet?.value));
    if(el.exportBuilderFigure) el.exportBuilderFigure.addEventListener('click',()=>showExportStylePanel('builder'));
    if(el.addBuilderTreatmentArm) el.addBuilderTreatmentArm.addEventListener('click',addBuilderTreatmentArm);
    if(el.builderTreatmentArms) {
      el.builderTreatmentArms.addEventListener('click',e=>{
        const remove=e.target.closest('[data-remove-treatment-arm]');
        if(!remove) return;
        const id=remove.dataset.removeTreatmentArm;
        const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
        builderState.additionalTreatmentArms=(builderState.additionalTreatmentArms||[]).filter(arm=>arm.id!==id);
        populateBuilderGroupSelects();
        markBuilderPreviewDirty();
      });
      el.builderTreatmentArms.addEventListener('input',e=>{
        const input=e.target.closest('[data-treatment-arm-label]');
        if(!input) return;
        const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
        const arm=(builderState.additionalTreatmentArms||[]).find(item=>item.id===input.dataset.treatmentArmLabel);
        if(arm) arm.label=input.value.trim()||arm.label;
        markBuilderPreviewDirty();
      });
      el.builderTreatmentArms.addEventListener('change',e=>{
        const replicate=e.target.closest('[data-treatment-arm-replicate]');
        if(replicate) {
          const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
          const arm=(builderState.additionalTreatmentArms||[]).find(item=>item.id===replicate.dataset.treatmentArmReplicate);
          if(arm) {
            arm.replicateIds=selectedBuilderTreatmentArmReplicates(arm.id,arm.replicateIds||[]);
            if(!arm.replicateIds.includes(arm.groupId)) arm.groupId=arm.replicateIds[0]||arm.groupId;
            populateBuilderGroupSelects();
            markBuilderPreviewDirty();
          }
          return;
        }
        const select=e.target.closest('[data-treatment-arm-group]');
        if(!select) return;
        const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
        const arm=(builderState.additionalTreatmentArms||[]).find(item=>item.id===select.dataset.treatmentArmGroup);
        if(arm) arm.groupId=select.value;
        markBuilderPreviewDirty();
      });
    }
    [el.builderControlReplicates,el.builderTreatmentReplicates].filter(Boolean).forEach(host=>{
      host.addEventListener('change',e=>{
        const input=e.target.closest('[data-builder-replicate]');
        if(!input) return;
        const key=builderReplicateStateKey(input.dataset.builderReplicate);
        if(!key) return;
        const builderState=state.publicationBuilderState||(state.publicationBuilderState={});
        const current=new Set(builderState[key]||[]);
        if(input.checked) current.add(input.value);
        else current.delete(input.value);
        builderState[key]=[...current];
        syncPublicationBuilderSelections();
        markBuilderPreviewDirty();
      });
    });
    [el.builderControlGroup,el.builderTreatmentGroup].filter(Boolean).forEach(control=>{
      control.addEventListener('change',()=>{
        persistBuilderRepresentativeSelections();
        markBuilderPreviewDirty();
      });
    });
    [
      el.builderMetricSelect,el.builderTemplate,el.builderControlLabel,
      el.builderTreatmentLabel,el.builderCellType,el.builderReplicate,el.builderScaleValue,
      el.builderScaleMode,el.builderPValue,el.builderStars
    ].filter(Boolean).forEach(control=>{
      control.addEventListener('change',()=>{
        if(control===el.builderTemplate) populateBuilderGroupSelects();
        markBuilderPreviewDirty();
      });
      control.addEventListener('input',markBuilderPreviewDirty);
    });
    if(el.exportStyleGrayscale) el.exportStyleGrayscale.addEventListener('click',()=>exportGroupPlotsWithStyle('grayscale'));
    if(el.exportStyleColor) el.exportStyleColor.addEventListener('click',()=>exportGroupPlotsWithStyle('color'));
    if(el.cancelExportStyle) el.cancelExportStyle.addEventListener('click',closeExportStylePanel);
    if(el.exportStylePanel) el.exportStylePanel.addEventListener('click',e=>{ if(e.target===el.exportStylePanel) closeExportStylePanel(); });
    el.showAreaPlot.addEventListener('click',()=>showGroupPlot('areaPct'));
    el.showWidthPlot.addEventListener('click',()=>showGroupPlot('width'));
    el.closePlot.addEventListener('click',closePlotPanel);
    el.plotPanel.addEventListener('click',e=>{ if(e.target===el.plotPanel) closePlotPanel(); });
    el.applySettingsGroup.addEventListener('click',()=>{
      cancelAutoApply();
      if(state.mode==='group') renderGroupView({force:true});
      else setMode('group',{force:true});
      setLog(`<strong>Group settings applied:</strong> ${escHtml(currentGroupSettingsSummary())}. Image geometry remains owned by each locked QC snapshot.`);
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
    el.rerun.addEventListener('click',()=>{cancelAutoApply();syncLabels();runSegmentation();});
    el.fileInput.addEventListener('change',e=>{
      const files=Array.from(e.target.files||[]);
      e.target.value='';
      e.target.multiple=true;
      loadLocalFiles(files).catch(error=>setLog(`<strong>Image import failed.</strong> ${escHtml(error?.message||String(error))}`));
    });
    window.addEventListener('cytomove:desktop-files-selected',event=>{
      loadLocalFiles(event.detail?.files||[]).catch(error=>setLog(`<strong>Image import failed.</strong> ${escHtml(error?.message||String(error))}`));
    });
    window.addEventListener('cytomove:desktop-file-error',event=>{
      setLog(`<strong>Image selection failed.</strong> ${escHtml(event.detail?.message||'Unknown desktop error')}`);
    });

    const markAnalysisPending=(message='<strong>Settings changed.</strong> Auto-applying in 1 second...')=>{
      if(!state.image||state.cropEditing) return;
      drawLoadedImagePreview(message);
      scheduleAutoApply(message);
    };
    let _debounceTimer;
    const debouncedPending=(message)=>{clearTimeout(_debounceTimer);_debounceTimer=setTimeout(()=>markAnalysisPending(message),180);};
    const bindPendingControl=(control,handler)=>{
      if(!control) return;
      control.addEventListener('input',handler);
      control.addEventListener('change',handler);
    };
    bindNumberPair(el.varianceRadius,el.varianceRadiusVal,()=>debouncedPending());
    bindNumberPair(el.thresholdOffset,el.thresholdOffsetVal,()=>debouncedPending());
    bindNumberPair(el.minComponent,el.minComponentVal,()=>debouncedPending());
    bindPendingControl(el.tinyIslandMode,()=>markAnalysisPending());
    bindNumberPair(el.fovCutoff,el.fovCutoffVal,()=>debouncedPending());
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
        markAnalysisPending('<strong>Microscope mode changed.</strong> Auto-applying in 1 second...');
      });
    });
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
        syncLabels();
        document.querySelectorAll('.preset-btn').forEach(b=>b.classList.toggle('active',b===btn));
        if(state.image) {
          const message='<strong>Preset selected.</strong> Auto-applying in 1 second...';
          markAnalysisPending(message);
        }
      });
    });

    el.exportPng.addEventListener('click',exportPng);
    el.exportCsv.addEventListener('click',exportCsv);
    el.exportExcel.addEventListener('click',exportExcel);

    el.zoomIn.addEventListener('click',()=>changeZoom(1.35));
    el.zoomOut.addEventListener('click',()=>changeZoom(1/1.35));
    el.zoomReset.addEventListener('click',()=>{state.zoom=1;state.panX=0;state.panY=0;el.canvas.style.transform='';el.zoomBadge.classList.remove('visible');});

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
      loadLocalFiles(e.dataTransfer.files).catch(error=>setLog(`<strong>Image import failed.</strong> ${escHtml(error?.message||String(error))}`));
    });
  }

  // Init
  populateGroups();
  populateSamples();
  applyAutoContourStyle(true);
  syncLabels();
  setupSidebarPanels();
  bindEvents();
  syncValidationToolsVisibility();
  setAppModule(state.appModule);
  setupDelayedTooltips();
  const tutorialKey=tutorialKeyFromUrl();
  if(tutorialKey) {
    if(!loadTutorialGroup(tutorialKey)) setLog(`<strong>Tutorial not found.</strong> Unknown tutorial key: ${escHtml(tutorialKey)}.`);
  } else if(isFileProtocol()) {
    if(window.cytomoveDesktop) {
      setLog('<strong>Ready for local images.</strong> Images stay on this device.');
    } else {
      setLog('<strong>File mode:</strong> use Open/drag-drop for local images, or run <code>py -3 -m http.server 8765</code> from the repo root.');
    }
  }
