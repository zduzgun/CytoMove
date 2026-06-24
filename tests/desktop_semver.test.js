const test = require('node:test');
const assert = require('node:assert/strict');
const { compareVersions } = require('../desktop/lib/semver');

test('compares stable and prerelease versions', () => {
  assert.equal(compareVersions('1.0.0', '1.0.0'), 0);
  assert.equal(compareVersions('1.0.1', '1.0.0'), 1);
  assert.equal(compareVersions('1.0.0-beta.2', '1.0.0'), -1);
  assert.equal(compareVersions('v2.0', '1.9.9'), 1);
});

