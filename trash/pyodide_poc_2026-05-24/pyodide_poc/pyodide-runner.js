import { downloadText, safeFileStem } from './engines/analysis-engine.js';
import { PyodideEngine } from './engines/pyodide-engine.js';

const engine = new PyodideEngine();
const state = {
  file: null,
  result: null,
  zoom: 1,
  lastExportMs: null
};

const el = {
  openFile: document.getElementById('openFile'),
  fileInput: document.getElementById('fileInput'),
  dropZone: document.getElementById('dropZone'),
  emptyState: document.getElementById('emptyState'),
  canvas: document.getElementById('canvas'),
  canvasTitle: document.getElementById('canvasTitle'),
  canvasMeta: document.getElementById('canvasMeta'),
  metricsPanel: document.getElementById('metricsPanel'),
  logMsg: document.getElementById('logMsg'),
  timerMsg: document.getElementById('timerMsg'),
  spinner: document.getElementById('spinner'),
  exportPng: document.getElementById('exportPng'),
  exportGroupPng: document.getElementById('exportGroupPng'),
  exportPlots: document.getElementById('exportPlots'),
  showAreaPlot: document.getElementById('showAreaPlot'),
  showWidthPlot: document.getElementById('showWidthPlot'),
  exportCsv: document.getElementById('exportCsv'),
  exportExcel: document.getElementById('exportExcel'),
  rerun: document.getElementById('rerun'),
  zoomIn: document.getElementById('zoomIn'),
  zoomOut: document.getElementById('zoomOut'),
  zoomReset: document.getElementById('zoomReset'),
  zoomBadge: document.getElementById('zoomBadge'),
  groupView: document.getElementById('groupView'),
  groupPrev: document.getElementById('groupPrev'),
  groupNext: document.getElementById('groupNext'),
  modeToggle: document.getElementById('modeToggle')
};

init();

function init() {
  markAsPyodidePoc();
  disableUnsupportedControls();
  el.openFile.addEventListener('click', event => {
    if (event.target !== el.fileInput) {
      event.preventDefault();
      el.fileInput.click();
    }
  });

  el.fileInput.addEventListener('change', event => {
    const file = event.target.files && event.target.files[0];
    if (file) loadLocalFile(file);
    event.target.value = '';
  });

  ['dragenter', 'dragover'].forEach(type => {
    el.dropZone.addEventListener(type, event => {
      event.preventDefault();
      el.dropZone.classList.add('dragging');
    });
  });

  ['dragleave', 'drop'].forEach(type => {
    el.dropZone.addEventListener(type, event => {
      event.preventDefault();
      el.dropZone.classList.remove('dragging');
    });
  });

  el.dropZone.addEventListener('drop', event => {
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) loadLocalFile(file);
  });

  window.addEventListener('dragover', event => event.preventDefault());
  window.addEventListener('drop', event => event.preventDefault());

  el.rerun.addEventListener('click', () => state.file && runAnalysis(state.file));
  el.exportCsv.addEventListener('click', () => exportResult('csv'));
  el.exportExcel.addEventListener('click', () => exportResult('json'));
  el.exportPng.addEventListener('click', exportPreviewPng);
  el.zoomIn.addEventListener('click', () => setZoom(state.zoom * 1.2));
  el.zoomOut.addEventListener('click', () => setZoom(state.zoom / 1.2));
  el.zoomReset.addEventListener('click', () => setZoom(1));

  setLog('<strong>Pyodide local mode:</strong> drop one image or use the open button. Python loads only when analysis starts.');
}

function markAsPyodidePoc() {
  const tag = document.querySelector('.brand-tag');
  if (tag) tag.textContent = 'Area-First Segmentation Lab — Pyodide Local POC';
  if (el.exportExcel) el.exportExcel.textContent = 'JSON data';
}

function disableUnsupportedControls() {
  [
    el.exportGroupPng,
    el.exportPlots,
    el.showAreaPlot,
    el.showWidthPlot,
    el.groupPrev,
    el.groupNext
  ].forEach(button => {
    if (button) button.disabled = true;
  });
  if (el.groupView) el.groupView.hidden = true;
  if (el.modeToggle) {
    el.modeToggle.querySelectorAll('[data-mode]').forEach(button => {
      button.disabled = button.dataset.mode === 'group';
      button.classList.toggle('active', button.dataset.mode === 'single');
    });
  }
}

async function loadLocalFile(file) {
  if (!file.type.startsWith('image/') && !/\.(png|jpe?g|bmp|webp)$/i.test(file.name)) {
    setLog('<strong>Unsupported file.</strong> Use a browser-decodable PNG/JPEG/BMP/WebP image.');
    return;
  }
  state.file = file;
  state.result = null;
  state.lastExportMs = null;
  el.canvasTitle.textContent = file.name;
  el.canvasMeta.textContent = 'Local image selected. Python analysis will run in this browser tab.';
  setExportEnabled(false);
  try {
    await drawLocalPreview(file);
  } catch (error) {
    setLog(`<strong>Local file selected:</strong> preview is not browser-decodable, but Pyodide will still try to analyze it. ${escapeHtml(error.message || String(error))}`);
  }
  setSpinner(true);
  try {
    await runAnalysis(file);
  } finally {
    setSpinner(false);
  }
}

async function runAnalysis(file) {
  setSpinner(true);
  setLog('<strong>Pyodide local analysis:</strong> preparing Python runtime.');
  const started = performance.now();
  try {
    const result = await engine.analyze(file, {
      maxSide: 1200,
      includeMask: true,
      onStatus: message => setLog(`<strong>Pyodide local analysis:</strong> ${escapeHtml(message)}`)
    });
    state.result = result;
    drawPreview(result);
    renderMetrics(result);
    setExportEnabled(true);
    const total = Math.round(performance.now() - started);
    setLog(`<strong>Pyodide local analysis complete:</strong> image stayed in the browser. ${timingSummary(result.timings)}`, `${total} ms`);
  } catch (error) {
    console.error(error);
    setExportEnabled(false);
    setLog(`<strong>Pyodide local analysis failed.</strong> ${escapeHtml(error.message || String(error))}`);
  } finally {
    setSpinner(false);
  }
}

function drawLocalPreview(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxSide = 1200;
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));
      el.canvas.width = width;
      el.canvas.height = height;
      const ctx = el.canvas.getContext('2d', { willReadFrequently: true });
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      el.canvas.hidden = false;
      el.emptyState.hidden = true;
      el.canvasTitle.textContent = file.name;
      el.canvasMeta.textContent = `${img.naturalWidth}x${img.naturalHeight} px local preview · Pyodide analysis queued`;
      setZoom(1);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Browser preview decode failed.'));
    };
    img.src = url;
  });
}

function drawPreview(result) {
  const img = new Image();
  img.onload = () => {
    el.canvas.width = img.naturalWidth;
    el.canvas.height = img.naturalHeight;
    el.canvas.getContext('2d').drawImage(img, 0, 0);
    el.canvas.hidden = false;
    el.emptyState.hidden = true;
    setZoom(1);
  };
  img.src = result.previewPng;
  el.canvasTitle.textContent = result.fileName;
  el.canvasMeta.textContent = `${result.analysisWidth}x${result.analysisHeight} px analysis preview · Pyodide local mode`;
}

function renderMetrics(result) {
  const metrics = result.metrics || {};
  el.metricsPanel.innerHTML = [
    metricCard('Wound area', `${format(metrics.woundAreaPercent, 2)}%`, `${format(metrics.woundAreaPx, 0)} px`),
    metricCard('Mean width', `${format(metrics.meanHorizontalGapWidthPx, 1)} px`, `${metrics.validWidthRows || 0} valid rows`),
    metricCard('Field area', `${format(metrics.fieldAreaPx, 0)} px`, `${result.analysisWidth}x${result.analysisHeight}`),
    metricCard('Pyodide load', timeText(result.timings.pyodideLoadMs), 'runtime bootstrap'),
    metricCard('Package load', timeText(result.timings.packageLoadMs), 'numpy + pillow'),
    metricCard('Image decode', timeText(result.timings.imageDecodeMs), 'Pillow decode'),
    metricCard('Analysis', timeText(result.timings.analysisMs), 'Python analysis'),
    metricCard('Export', state.lastExportMs == null ? '-' : timeText(state.lastExportMs), 'last export')
  ].join('');
}

function exportResult(kind) {
  if (!state.result) return;
  const start = performance.now();
  const stem = safeFileStem(state.result.fileName, 'cytomove-pyodide-result');
  if (kind === 'csv') {
    downloadText(`${stem}_pyodide_metrics.csv`, 'text/csv', engine.exportCsv(state.result));
  } else {
    downloadText(`${stem}_pyodide_result.json`, 'application/json', engine.exportJson(state.result));
  }
  state.lastExportMs = Math.round(performance.now() - start);
  state.result.timings.exportMs = state.lastExportMs;
  renderMetrics(state.result);
  setLog(`<strong>Export complete:</strong> ${kind.toUpperCase()} generated locally.`, `${state.lastExportMs} ms`);
}

function exportPreviewPng() {
  if (!state.result?.previewPng) return;
  const stem = safeFileStem(state.result.fileName, 'cytomove-pyodide-preview');
  const anchor = document.createElement('a');
  anchor.href = state.result.previewPng;
  anchor.download = `${stem}_pyodide_preview.png`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function setExportEnabled(enabled) {
  [el.exportPng, el.exportCsv, el.exportExcel, el.rerun].forEach(button => {
    if (button) button.disabled = !enabled;
  });
}

function setZoom(value) {
  state.zoom = Math.max(0.25, Math.min(8, value));
  el.canvas.style.transform = `scale(${state.zoom})`;
  el.canvas.style.transformOrigin = 'center top';
  el.zoomBadge.textContent = `${Math.round(state.zoom * 100)}%`;
  el.zoomBadge.classList.add('visible');
  window.clearTimeout(setZoom.timer);
  setZoom.timer = window.setTimeout(() => el.zoomBadge.classList.remove('visible'), 1200);
}

function metricCard(label, value, detail) {
  return `<div class="metric-card"><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-detail">${detail}</div></div>`;
}

function timingSummary(timings = {}) {
  return [
    `Pyodide ${timeText(timings.pyodideLoadMs)}`,
    `packages ${timeText(timings.packageLoadMs)}`,
    `decode ${timeText(timings.imageDecodeMs)}`,
    `analysis ${timeText(timings.analysisMs)}`
  ].join(' · ');
}

function setSpinner(active) {
  el.spinner.classList.toggle('active', active);
}

function setLog(html, timer = '') {
  el.logMsg.innerHTML = html;
  el.timerMsg.textContent = timer;
}

function timeText(value) {
  return value == null ? '-' : `${value} ms`;
}

function format(value, digits = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }) : '-';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);
}
