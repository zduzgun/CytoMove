const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app/app.js'), 'utf8');
const main = fs.readFileSync(path.join(root, 'desktop/main.js'), 'utf8');
const preload = fs.readFileSync(path.join(root, 'desktop/preload.js'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'desktop/package.json'), 'utf8'));

test('desktop exposes and bundles the figure-builder validation set', () => {
  assert.match(app, /protocol===?'file:'/);
  assert.match(app, /readValidationAsset/);
  assert.match(main, /cytomove:read-validation-asset/);
  assert.match(preload, /readValidationAsset/);
  assert.ok(pkg.build.files.includes('validation_sets/full_thread_control/**/*'));
  assert.equal(
    fs.readdirSync(path.join(root, 'desktop/validation_sets/full_thread_control'), { recursive: true })
      .filter(name => /\.(jpg|jpeg|png)$/i.test(String(name))).length,
    18
  );
});
