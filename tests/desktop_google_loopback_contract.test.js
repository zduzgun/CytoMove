const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const main = fs.readFileSync(path.join(root, 'desktop/main.js'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'desktop/package.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'desktop-manifest.json'), 'utf8').replace(/^\uFEFF/, ''));

test('Google loopback accepts IPv4 and IPv6 localhost and times out promptly', () => {
  assert.match(main, /server\.listen\(GOOGLE_LOOPBACK_PORT\);/);
  assert.doesNotMatch(main, /server\.listen\(GOOGLE_LOOPBACK_PORT,\s*['"]127\.0\.0\.1['"]\)/);
  assert.match(main, /60\s*\*\s*1000/);
  assert.match(main, /Access-Control-Allow-Origin/);
  assert.match(main, /request\.method === 'OPTIONS'/);
});

test('desktop package and update manifest expose the current product version', () => {
  assert.equal(pkg.version, '1.0.2');
  assert.equal(manifest.latestVersion, '1.0.2');
  assert.equal(manifest.minimumRequiredVersion, '1.0.0');
});
