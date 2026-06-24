const test = require('node:test');
const assert = require('node:assert/strict');
const { decideUpdatePolicy } = require('../desktop/lib/update-policy');

test('recommended updates can be postponed', () => {
  assert.deepEqual(decideUpdatePolicy('1.0.0', {
    schemaVersion: 2,
    latestVersion: '1.1.0',
    minimumRequiredVersion: '1.0.0',
    updateMode: 'recommended'
  }), {
    updateAvailable: true,
    required: false,
    targetVersion: '1.1.0',
    reason: 'recommended'
  });
});
test('minimumRequiredVersion locks obsolete builds', () => {
  assert.equal(decideUpdatePolicy('1.0.0', {
    schemaVersion: 2, latestVersion: '1.2.0', minimumRequiredVersion: '1.1.0', updateMode: 'recommended'
  }).required, true);
});
test('required mode locks every build below latestVersion', () => {
  assert.equal(decideUpdatePolicy('1.1.5', {
    schemaVersion: 2, latestVersion: '1.2.0', minimumRequiredVersion: '1.0.0', updateMode: 'required'
  }).required, true);
});

test('legacy schema 1 manifest remains a non-mandatory compatibility policy', () => {
  const decision = decideUpdatePolicy('1.0.3', {
    schemaVersion: 1,
    latestVersion: '1.0.0',
    updateUrl: 'https://cytomove.com/'
  });
  assert.equal(decision.required, false);
  assert.equal(decision.updateAvailable, false);
});
