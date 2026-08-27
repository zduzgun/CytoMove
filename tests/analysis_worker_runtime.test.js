const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');

const root = path.resolve(__dirname, '..');
const workerSource = fs.readFileSync(path.join(root, 'app/analysis-worker.js'), 'utf8');

function runWorkerAnalysis(rgba, width, height) {
  let messageHandler = null;
  let posted = null;
  const context = vm.createContext({
    performance,
    self: {
      addEventListener(type, handler) {
        if (type === 'message') messageHandler = handler;
      },
      postMessage(message) {
        posted = message;
      }
    }
  });
  vm.runInContext(workerSource, context, { filename: 'analysis-worker.js' });
  messageHandler({
    data: {
      id: 1,
      rgbaBuffer: rgba.buffer,
      priorBuffer: null,
      width,
      height,
      settings: {
        varianceRadius: 3,
        thresholdOffset: -20,
        minComponent: 25,
        tinyIslandMode: 'trace',
        fovCutoff: 18,
        fovMode: 'cutoff',
        scratchOrientation: 'vertical'
      }
    }
  });
  return posted;
}

test('analysis worker returns deterministic transferable pixel results', () => {
  const width = 48;
  const height = 36;
  const createPixels = () => {
    const rgba = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = x > 18 && x < 29 ? 190 : ((x * 13 + y * 7) % 90) + 90;
        const offset = (y * width + x) * 4;
        rgba[offset] = value;
        rgba[offset + 1] = value;
        rgba[offset + 2] = value;
        rgba[offset + 3] = 255;
      }
    }
    return rgba;
  };
  const first = runWorkerAnalysis(createPixels(), width, height);
  const second = runWorkerAnalysis(createPixels(), width, height);

  assert.equal(first.ok, true);
  assert.equal(first.result.algorithmVersion, 'cytomove-whst-variance-v1.0');
  assert.equal(first.rgbaBuffer.byteLength, width * height * 4);
  assert.equal(first.fieldBuffer.byteLength, width * height);
  assert.equal(first.varianceBuffer.byteLength, width * height * 4);
  assert.equal(first.maskBuffer.byteLength, width * height);
  assert.deepEqual(
    Array.from(new Uint8Array(first.maskBuffer)),
    Array.from(new Uint8Array(second.maskBuffer))
  );
  assert.deepEqual(
    { area: first.result.area, threshold: first.result.threshold, boundaryCount: first.result.boundaryCount },
    { area: second.result.area, threshold: second.result.threshold, boundaryCount: second.result.boundaryCount }
  );
});
