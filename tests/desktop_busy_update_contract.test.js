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
