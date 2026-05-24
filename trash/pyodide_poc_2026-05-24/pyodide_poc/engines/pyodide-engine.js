import { AnalysisEngine } from './analysis-engine.js';

const PYODIDE_VERSION = '0.26.4';
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodideScriptPromise = null;
let sharedPyodide = null;

export class PyodideEngine extends AnalysisEngine {
  constructor() {
    super('pyodide-numpy-pillow');
    this.pyodide = null;
    this.timings = {
      pyodideLoadMs: null,
      packageLoadMs: null
    };
  }

  async init(onStatus = () => {}) {
    if (this.ready) return this.timings;

    onStatus('Loading Pyodide runtime...');
    const pyodideStart = performance.now();
    await loadPyodideScript();
    if (!sharedPyodide) {
      sharedPyodide = await globalThis.loadPyodide({ indexURL: PYODIDE_BASE_URL });
    }
    this.pyodide = sharedPyodide;
    this.timings.pyodideLoadMs = Math.round(performance.now() - pyodideStart);

    onStatus('Loading Python packages...');
    const packageStart = performance.now();
    await this.pyodide.loadPackage(['numpy', 'pillow']);
    this.timings.packageLoadMs = Math.round(performance.now() - packageStart);

    onStatus('Loading Cytomove Python analysis code...');
    const source = await fetch('./python/wound_analysis.py', { cache: 'no-store' }).then(response => {
      if (!response.ok) throw new Error(`Could not load Python analysis code (${response.status}).`);
      return response.text();
    });
    this.pyodide.runPython(source);

    this.ready = true;
    return this.timings;
  }

  async analyze(file, options = {}) {
    await this.init(options.onStatus);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const maxSide = Number(options.maxSide || 1200);
    const includeMask = options.includeMask !== false;

    this.pyodide.globals.set('cytomove_image_bytes', bytes);
    this.pyodide.globals.set('cytomove_file_name', file.name || 'local-image');
    this.pyodide.globals.set('cytomove_max_side', maxSide);
    this.pyodide.globals.set('cytomove_include_mask', includeMask);

    const resultJson = await this.pyodide.runPythonAsync(`
import json
json.dumps(analyze_wound_image_bytes(
    cytomove_image_bytes.to_py(),
    cytomove_file_name,
    int(cytomove_max_side),
    bool(cytomove_include_mask)
))
`);
    const result = JSON.parse(resultJson);
    result.engine = this.name;
    result.timings = {
      ...this.timings,
      ...result.timings
    };
    return result;
  }
}

function loadPyodideScript() {
  if (globalThis.loadPyodide) return Promise.resolve();
  if (pyodideScriptPromise) return pyodideScriptPromise;

  pyodideScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${PYODIDE_BASE_URL}pyodide.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Pyodide script failed to load.'));
    document.head.appendChild(script);
  });
  return pyodideScriptPromise;
}
