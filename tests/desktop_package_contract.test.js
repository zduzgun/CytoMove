const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'desktop/package.json'), 'utf8'));
const main = fs.readFileSync(path.join(root, 'desktop/main.js'), 'utf8');
const preload = fs.readFileSync(path.join(root, 'desktop/preload.js'), 'utf8');

test('desktop package includes updater and signed production scripts', () => {
  assert.ok(pkg.dependencies['electron-updater']);
  assert.match(pkg.scripts['dist:win'], /require-signing/);
  assert.match(pkg.scripts['portable:win'], /require-signing/);
  assert.ok(pkg.build.publish);
});

test('desktop package exposes an unsigned portable preview build', () => {
  assert.match(pkg.scripts['portable:win:preview'], /build-portable-preview\.ps1/);
  assert.ok(fs.existsSync(path.join(root, 'desktop/scripts/build-portable-preview.ps1')));
});

test('desktop runtime has no time-limited trial bridge', () => {
  assert.doesNotMatch(main, /TRIAL_DURATION|get-trial-state/i);
  assert.doesNotMatch(preload, /getTrialState|get-trial-state/i);
});

test('preload exposes only explicit desktop capabilities', () => {
  assert.match(preload, /validateAcademicAccess/);
  assert.match(preload, /getDesktopPolicy/);
  assert.match(preload, /restartAndInstall/);
  assert.doesNotMatch(preload, /require\(['"]\.\/lib/);
});
