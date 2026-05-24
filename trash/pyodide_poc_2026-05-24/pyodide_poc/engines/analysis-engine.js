export class AnalysisEngine {
  constructor(name) {
    this.name = name;
    this.ready = false;
  }

  async init() {
    throw new Error('AnalysisEngine.init() must be implemented.');
  }

  async analyze(_file, _options = {}) {
    throw new Error('AnalysisEngine.analyze() must be implemented.');
  }

  exportJson(result) {
    return JSON.stringify(result, null, 2);
  }

  exportCsv(result) {
    const metrics = result.metrics || {};
    const timings = result.timings || {};
    const rows = [
      ['field', 'value'],
      ['engine', result.engine || this.name],
      ['file_name', result.fileName || ''],
      ['source_width_px', result.sourceWidth || ''],
      ['source_height_px', result.sourceHeight || ''],
      ['analysis_width_px', result.analysisWidth || ''],
      ['analysis_height_px', result.analysisHeight || ''],
      ['wound_area_percent', metrics.woundAreaPercent ?? ''],
      ['wound_area_px', metrics.woundAreaPx ?? ''],
      ['field_area_px', metrics.fieldAreaPx ?? ''],
      ['mean_horizontal_gap_width_px', metrics.meanHorizontalGapWidthPx ?? ''],
      ['valid_width_rows', metrics.validWidthRows ?? ''],
      ['pyodide_load_ms', timings.pyodideLoadMs ?? ''],
      ['package_load_ms', timings.packageLoadMs ?? ''],
      ['image_decode_ms', timings.imageDecodeMs ?? ''],
      ['analysis_ms', timings.analysisMs ?? ''],
      ['export_ms', timings.exportMs ?? '']
    ];
    return rows.map(row => row.map(csvCell).join(',')).join('\n');
  }
}

export function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export function downloadText(filename, mime, text) {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function safeFileStem(name, fallback = 'cytomove-analysis') {
  return String(name || fallback)
    .replace(/\.[^.]+$/, '')
    .replace(/[^\w-]+/g, '_')
    .replace(/^_+|_+$/g, '') || fallback;
}
