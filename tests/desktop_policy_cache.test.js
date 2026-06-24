const test = require('node:test');
const assert = require('node:assert/strict');
const { decideCachedPolicy } = require('../desktop/lib/policy-cache');
const hour = 60 * 60 * 1000;

test('known mandatory policy remains mandatory offline', () => {
  const decision = decideCachedPolicy('1.0.0', {
    fetchedAt: 100 * hour,
    manifest: { schemaVersion: 2, latestVersion: '1.2.0', minimumRequiredVersion: '1.1.0', updateMode: 'recommended' }
  }, 200 * hour);
  assert.equal(decision.allowed, false);
  assert.equal(decision.required, true);
});
test('non-mandatory policy permits 72 hours offline', () => {
  const now = 100 * hour;
  const decision = decideCachedPolicy('1.0.0', {
    fetchedAt: now - 71 * hour,
    manifest: { schemaVersion: 2, latestVersion: '1.0.0', minimumRequiredVersion: '1.0.0', updateMode: 'recommended' }
  }, now);
  assert.equal(decision.allowed, true);
  assert.equal(decision.source, 'offline-grace');
});

test('missing update-policy cache never invents a mandatory update', () => {
  const decision = decideCachedPolicy('1.0.3', null, Date.now());
  assert.equal(decision.allowed, true);
  assert.equal(decision.required, false);
  assert.equal(decision.reason, 'no-policy-cache');
});
