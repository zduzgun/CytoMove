const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app/app.js'), 'utf8');

test('orientation warning waits until crop review is complete', () => {
  const match = app.match(/async function warnIfHorizontalScratchDetected\(samples=selectedGroupSamples\(\)\) \{([\s\S]*?)\n  \}/);
  assert.ok(match, 'warnIfHorizontalScratchDetected function should exist');
  const body = match[1];
  assert.match(body, /qcStateForSample\(sample\.id\)/);
  assert.match(body, /needsCrop/);
  assert.match(body, /showOrientationHint\(''\)/);
  assert.match(body, /renderOrientationSeriesWarning\(''\)/);
});

test('orientation warning copy avoids overconfident false-positive language', () => {
  assert.doesNotMatch(app, /Horizontal scratch pattern detected\. Set the orientation/);
  assert.match(app, /Possible horizontal scratch orientation/);
  assert.match(app, /after crop review/);
});

test('orientation warning stays out of active tutorial coaching', () => {
  const match = app.match(/async function warnIfHorizontalScratchDetected\(samples=selectedGroupSamples\(\)\) \{([\s\S]*?)\n  \}/);
  assert.ok(match, 'warnIfHorizontalScratchDetected function should exist');
  const body = match[1];
  assert.match(body, /state\.tutorial/);
  assert.match(body, /!state\.tutorial\.complete/);
  assert.ok(
    body.indexOf('state.tutorial') < body.indexOf('const pendingCropReview'),
    'tutorial guard should run before image-based orientation heuristics'
  );
});
