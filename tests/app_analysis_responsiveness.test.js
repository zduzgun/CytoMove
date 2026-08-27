const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const appJs = fs.readFileSync(path.join(root, 'app/app.js'), 'utf8');
const appHtml = fs.readFileSync(path.join(root, 'app/index.html'), 'utf8');
const analysisWorker = fs.readFileSync(path.join(root, 'app/analysis-worker.js'), 'utf8');

test('main-thread fallback yields between CPU-heavy stages', () => {
  const source = appJs.match(
    /async function analyzeImageOnMainThread[\s\S]*?\n  async function analyzeImageWithSettings/
  )?.[0] || '';

  assert.match(source, /async function analyzeImageOnMainThread/);
  assert.ok(
    (source.match(/await yieldToBrowser\(\)/g) || []).length >= 8,
    'analysis should yield between its expensive pixel-processing stages'
  );
  assert.match(
    appJs,
    /if\(globalThis\.scheduler\?\.yield\) return globalThis\.scheduler\.yield\(\)/,
    'modern browsers should use scheduler.yield when it is available'
  );
});

test('every asynchronous analysis caller waits for completion', () => {
  const callLines = appJs
    .split(/\r?\n/)
    .filter(line => line.includes('analyzeImageWithSettings(') && !line.includes('function analyzeImageWithSettings'));

  assert.ok(callLines.length >= 3);
  for (const line of callLines) {
    assert.match(line, /await analyzeImageWithSettings\(/);
  }
});

test('startup avoids font swapping and export-only PowerPoint code', () => {
  assert.doesNotMatch(appHtml, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.doesNotMatch(appHtml, /<script[^>]+pptxgen\.bundle\.js/);
  assert.match(appJs, /function ensurePptxGenJS\(\)/);
});

test('pixel segmentation runs in a transferable Web Worker', () => {
  assert.match(appJs, /new Worker\(new URL\('analysis-worker\.js\?v=20260827-worker-analysis'/);
  assert.match(appJs, /worker\.postMessage\([\s\S]*?rgbaBuffer:src\.data\.buffer[\s\S]*?,transfer\)/);
  assert.match(analysisWorker, /self\.addEventListener\('message'/);
  assert.match(analysisWorker, /varianceFilter\(normalized, field, width, height/);
  assert.match(analysisWorker, /self\.postMessage\([\s\S]*?rgbaBuffer: output\.rgba\.buffer/);
});

test('single-image analysis ignores stale worker results', () => {
  assert.match(appJs, /const runSeq=\+\+state\.analysisRunSeq/);
  assert.match(appJs, /runSeq!==state\.analysisRunSeq\|\|state\.image!==image/);
});
