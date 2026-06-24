const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('every verified email receives full academic access without a profile lookup', async () => {
  let profileRequested = false;
  const client = {
    auth: {
      getSession: async () => ({
        data: {
          session: {
            access_token: 'token',
            user: {
              id: 'u1',
              email: 'zduzgun@gmail.com',
              email_confirmed_at: '2026-01-01'
            }
          }
        },
        error: null
      })
    },
    from() {
      profileRequested = true;
      throw new Error('Profile lookup should not block verified access.');
    }
  };
  const context = {
    window: {
      CYTOMOVE_SUPABASE_CONFIG: {
        url: 'https://example.supabase.co',
        anonKey: 'anon'
      },
      supabase: { createClient: () => client },
      location: { origin: 'file://', pathname: '/index.html' }
    },
    Promise,
    URL,
    console
  };
  vm.runInNewContext(
    fs.readFileSync(path.resolve(__dirname, '../auth/cytomove-auth.js'), 'utf8'),
    context
  );
  const snapshot = await context.window.CytomoveAuth.getAccessSnapshot();
  assert.equal(snapshot.approved, true);
  assert.equal(snapshot.label, 'Academic access');
  assert.equal(profileRequested, false);
});
