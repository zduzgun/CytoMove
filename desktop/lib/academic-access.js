const APPROVED_STATUSES = new Set(['academic_verified', 'approved', 'beta_approved']);
function isAcademicEmail(email) {
  const domain = String(email || '').toLowerCase().split('@')[1] || '';
  return domain.endsWith('.edu')
    || domain.includes('.edu.')
    || domain.includes('.ac.')
    || domain.endsWith('.ac.uk')
    || domain.endsWith('.edu.tr')
    || domain.endsWith('.edu.au');
}
async function readJson(response, label) {
  if (!response.ok) throw new Error(`${label} failed: HTTP ${response.status}`);
  return response.json();
}
function withTimeout(promise, timeoutMs, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out.`)), timeoutMs);
    })
  ]).finally(() => clearTimeout(timer));
}
async function fetchJson(url, options, label, fetchImpl, timeoutMs) {
  return readJson(await withTimeout(fetchImpl(url, options), timeoutMs, label), label);
}
async function validateAcademicAccess({
  accessToken,
  expectedUserId,
  expectedEmail,
  config,
  fetchImpl = fetch,
  timeoutMs = 8000
}) {
  if (!accessToken || !expectedUserId || !expectedEmail) {
    return { approved: false, explicitDenial: true, reason: 'missing-session' };
  }
  const headers = { apikey: config.anonKey, Authorization: `Bearer ${accessToken}` };
  const user = await fetchJson(`${config.url}/auth/v1/user`, { headers }, 'User validation', fetchImpl, timeoutMs);
  if (user.id !== expectedUserId || String(user.email).toLowerCase() !== String(expectedEmail).toLowerCase()) {
    return { approved: false, explicitDenial: true, reason: 'account-mismatch' };
  }
  if (user.email_confirmed_at) {
    return {
      approved: true,
      explicitDenial: false,
      reason: isAcademicEmail(user.email) ? 'academic-email-approved' : 'verified-email-approved',
      userId: user.id,
      email: user.email,
      accessStatus: isAcademicEmail(user.email) ? 'academic-email' : 'verified-email'
    };
  }
  const profileUrl = new URL(`${config.url}/rest/v1/beta_profiles`);
  profileUrl.searchParams.set('select', 'user_id,email,access_status');
  profileUrl.searchParams.set('user_id', `eq.${user.id}`);
  const profiles = await fetchJson(profileUrl, { headers }, 'Academic profile validation', fetchImpl, timeoutMs);
  const profile = profiles[0] || null;
  const profileApproved = Boolean(user.email_confirmed_at && profile && APPROVED_STATUSES.has(profile.access_status));
  const approved = profileApproved;
  return {
    approved,
    explicitDenial: !approved,
    reason: profileApproved ? 'academic-approved' : 'academic-not-approved',
    userId: user.id,
    email: user.email,
    accessStatus: profile?.access_status || 'missing'
  };
}
module.exports = { APPROVED_STATUSES, isAcademicEmail, withTimeout, validateAcademicAccess };
