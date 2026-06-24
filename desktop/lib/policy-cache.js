const { GRACE_MS } = require('./grace-policy');
const { decideUpdatePolicy } = require('./update-policy');
function decideCachedPolicy(currentVersion, cache, now = Date.now()) {
  if (!cache?.manifest || !Number.isFinite(cache.fetchedAt)) {
    return { allowed: true, required: false, source: 'none', reason: 'no-policy-cache', remainingMs: 0 };
  }
  const update = decideUpdatePolicy(currentVersion, cache.manifest);
  if (update.required) return { allowed: false, required: true, source: 'cached-policy', reason: update.reason, remainingMs: 0, update };
  const remainingMs = Math.max(0, cache.fetchedAt + GRACE_MS - now);
  return remainingMs > 0
    ? { allowed: true, required: false, source: 'offline-grace', reason: 'cached-policy', remainingMs, update }
    : { allowed: false, required: false, source: 'offline-grace', reason: 'policy-grace-expired', remainingMs: 0, update };
}
module.exports = { decideCachedPolicy };
