const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'app/index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'app/styles.css'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app/app.js'), 'utf8');

test('Image QC empty state presents a local-first onboarding surface', () => {
  assert.match(index, /Start with local images/);
  assert.match(index, /Open image group/);
  assert.match(index, /Open one image/);
  assert.match(index, /Images stay local on this device/);
  assert.match(index, /PNG, JPG, BMP, GIF/);
  assert.match(index, /qc-tools-empty/);
});

test('Image QC switches between onboarding and active controls', () => {
  assert.match(app, /classList\.toggle\(['"]empty-qc['"]/);
  assert.match(styles, /\.image-qc\.empty-qc \.qc-preview/);
  assert.match(styles, /\.image-qc\.empty-qc \.qc-tools/);
  assert.match(styles, /\.qc-onboarding/);
  assert.match(styles, /\.qc-onboarding\[hidden\]/);
  assert.match(styles, /\.image-qc:not\(\.empty-qc\) \.qc-onboarding/);
  assert.match(styles, /\.image-qc\.empty-qc \.qc-layout/);
  assert.match(styles, /justify-content:\s*center/);
  assert.match(styles, /\.image-qc\.empty-qc \.qc-sidebar,\s*\.image-qc\.empty-qc \.qc-tools/);
  assert.match(styles, /\.qc-tools-empty/);
});

test('desktop file mode uses a user-facing local image readiness message', () => {
  assert.match(app, /window\.cytomoveDesktop/);
  assert.match(app, /Ready for local images/);
  assert.match(app, /Images stay on this device/);
});
