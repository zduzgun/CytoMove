const GRACE_MS = 72 * 60 * 60 * 1000;
function decideGrace(cache, now = Date.now()) {
  if (cache?.explicitDenial) return { allowed: false, source: 'online', reason: 'explicit-denial', remainingMs: 0 };
  if (!cache?.approved || !Number.isFinite(cache.validatedAt)) {
    return { allowed: false, source: 'none', reason: 'no-valid-cache', remainingMs: 0 };
  }
  if (Number.isFinite(cache.lastSeenAt) && now + 5 * 60 * 1000 < cache.lastSeenAt) {
    return { allowed: false, source: 'offline-grace', reason: 'clock-rollback', remainingMs: 0 };
  }
  const remainingMs = Math.max(0, cache.validatedAt + GRACE_MS - now);
  return remainingMs > 0
    ? { allowed: true, source: 'offline-grace', reason: 'cached-approval', remainingMs }
    : { allowed: false, source: 'offline-grace', reason: 'grace-expired', remainingMs: 0 };
}
function combineDesktopGates(access, policy) {
  if (!access.allowed) return { allowed: false, gate: 'academic-access', reason: access.reason };
  if (!policy.allowed) return { allowed: false, gate: 'update-policy', reason: policy.reason };
  return { allowed: true, gate: null, reason: 'allowed' };
}
module.exports = { GRACE_MS, decideGrace, combineDesktopGates };

