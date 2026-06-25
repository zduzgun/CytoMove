const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app/app.js'), 'utf8');
const updateUi = fs.readFileSync(path.join(root, 'desktop/desktop-src/update-ui.js'), 'utf8');

test('desktop update restart observes canonical app busy state', () => {
  assert.match(app, /cytomove:busy-state/);
  assert.match(updateUi, /cytomove:busy-state/);
  assert.match(updateUi, /Restart and update/);
});

test('desktop update banner does not offer downloads when already current', () => {
  assert.match(updateUi, /function updateAvailableByPolicy\(\)/);
  assert.match(updateUi, /function bannerAllowed\(\)/);
  assert.match(updateUi, /function primaryAllowed\(\)/);
  assert.match(updateUi, /primary\.hidden = !primaryAllowed\(\)/);
  assert.match(updateUi, /later\.textContent = primaryAllowed\(\) \? 'Later' : 'Close'/);
  assert.match(updateUi, /updateState\.status === 'manual'\) return updateAvailableByPolicy\(\)/);
  assert.match(updateUi, /if \(!bannerAllowed\(\)\) \{ banner\.hidden = true; return; \}/);
  assert.doesNotMatch(
    updateUi,
    /!\['available','downloading','downloaded','error','manual'\]\.includes\(updateState\.status\)/,
    'manual update state alone should not show a download banner'
  );
});
