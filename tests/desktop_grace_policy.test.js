const test = require('node:test');
const assert = require('node:assert/strict');
const { decideGrace, combineDesktopGates, GRACE_MS } = require('../desktop/lib/grace-policy');
const hour = 60 * 60 * 1000;

test('allows cached approval for 72 hours', () => {
  const now = 100 * hour;
  const decision = decideGrace({ approved: true, validatedAt: now - 71 * hour }, now);
  assert.equal(decision.allowed, true);
  assert.equal(decision.source, 'offline-grace');
});
test('locks after 72 hours', () => {
  const now = 100 * hour;
  assert.equal(decideGrace({ approved: true, validatedAt: now - GRACE_MS - 1 }, now).allowed, false);
});
test('explicit online denial never receives grace', () => {
  const decision = decideGrace({ approved: false, explicitDenial: true, validatedAt: Date.now() }, Date.now());
  assert.equal(decision.reason, 'explicit-denial');
});
test('clock rollback cannot extend grace', () => {
  assert.equal(decideGrace({ approved: true, validatedAt: 100 * hour, lastSeenAt: 110 * hour }, 109 * hour).reason, 'clock-rollback');
});
test('academic and policy gates are independent', () => {
  assert.equal(combineDesktopGates({ allowed: true }, { allowed: false, reason: 'policy-expired' }).allowed, false);
});

