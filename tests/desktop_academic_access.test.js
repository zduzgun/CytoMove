const test = require('node:test');
const assert = require('node:assert/strict');
const { validateAcademicAccess } = require('../desktop/lib/academic-access');

test('requires matching verified user and approved academic status', async () => {
  const fetchImpl = async url => String(url).includes('/auth/v1/user')
    ? { ok: true, json: async () => ({ id: 'u1', email: 'a@university.edu', email_confirmed_at: '2026-01-01' }) }
    : { ok: true, json: async () => ([{ user_id: 'u1', email: 'a@university.edu', access_status: 'academic_verified' }]) };
  const decision = await validateAcademicAccess({
    accessToken: 'token', expectedUserId: 'u1', expectedEmail: 'a@university.edu',
    config: { url: 'https://example.supabase.co', anonKey: 'anon' }, fetchImpl
  });
  assert.equal(decision.approved, true);
});
test('verified academic email is approved without manual profile status', async () => {
  let profileRequested = false;
  const fetchImpl = async url => String(url).includes('/auth/v1/user')
    ? { ok: true, json: async () => ({ id: 'u1', email: 'zekeriya.duzgun@giresun.edu.tr', email_confirmed_at: '2026-01-01' }) }
    : (profileRequested = true, { ok: true, json: async () => ([]) });
  const decision = await validateAcademicAccess({
    accessToken: 'token', expectedUserId: 'u1', expectedEmail: 'zekeriya.duzgun@giresun.edu.tr',
    config: { url: 'https://example.supabase.co', anonKey: 'anon' }, fetchImpl
  });
  assert.equal(decision.approved, true);
  assert.equal(decision.reason, 'academic-email-approved');
  assert.equal(profileRequested, false);
});
test('every verified email is approved without manual profile status', async () => {
  let profileRequested = false;
  const fetchImpl = async url => String(url).includes('/auth/v1/user')
    ? { ok: true, json: async () => ({ id: 'u1', email: 'zduzgun@gmail.com', email_confirmed_at: '2026-01-01' }) }
    : (profileRequested = true, { ok: true, json: async () => ([]) });
  const decision = await validateAcademicAccess({
    accessToken: 'token', expectedUserId: 'u1', expectedEmail: 'zduzgun@gmail.com',
    config: { url: 'https://example.supabase.co', anonKey: 'anon' }, fetchImpl
  });
  assert.equal(decision.approved, true);
  assert.equal(decision.reason, 'verified-email-approved');
  assert.equal(profileRequested, false);
});
test('rejects an unverified email account', async () => {
  const fetchImpl = async url => String(url).includes('/auth/v1/user')
    ? { ok: true, json: async () => ({ id: 'u1', email: 'a@x.com', email_confirmed_at: null }) }
    : { ok: true, json: async () => ([{ user_id: 'u1', access_status: 'email_verified' }]) };
  const decision = await validateAcademicAccess({
    accessToken: 'token', expectedUserId: 'u1', expectedEmail: 'a@x.com',
    config: { url: 'https://example.supabase.co', anonKey: 'anon' }, fetchImpl
  });
  assert.equal(decision.approved, false);
  assert.equal(decision.explicitDenial, true);
});
test('rejects account mismatch', async () => {
  const fetchImpl = async () => ({ ok: true, json: async () => ({ id: 'other', email: 'other@x.edu', email_confirmed_at: 'x' }) });
  const decision = await validateAcademicAccess({
    accessToken: 'token', expectedUserId: 'u1', expectedEmail: 'a@x.edu',
    config: { url: 'https://example.supabase.co', anonKey: 'anon' }, fetchImpl
  });
  assert.equal(decision.reason, 'account-mismatch');
});

test('academic validation fails fast when Supabase stops responding', async () => {
  const fetchImpl = async () => new Promise(() => {});
  await assert.rejects(
    validateAcademicAccess({
      accessToken: 'token', expectedUserId: 'u1', expectedEmail: 'a@x.com',
      config: { url: 'https://example.supabase.co', anonKey: 'anon' },
      fetchImpl,
      timeoutMs: 20
    }),
    /timed out/i
  );
});
