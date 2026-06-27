const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const authUi = fs.readFileSync(
  path.resolve(__dirname, '../desktop/desktop-src/auth-ui.js'),
  'utf8'
);
const rendererAuthUi = fs.readFileSync(
  path.resolve(__dirname, '../desktop/renderer/desktop/auth-ui.js'),
  'utf8'
);

test('desktop distinguishes failed authentication from pending academic approval', () => {
  assert.match(authUi, /academic-not-approved/);
  assert.match(authUi, /missing-session/);
  assert.match(authUi, /Sign in to continue/);
  assert.match(authUi, /sign-in succeeded/i);
  assert.match(authUi, /academic approval/i);
  assert.match(authUi, /If this account was created with Google/);
  assert.match(authUi, /Access check timed out/);
});

test('desktop Google sign-in waits for the localhost helper before opening the browser', () => {
  assert.match(authUi, /waitForGoogleLoopbackReady/);
  assert.match(authUi, /http:\/\/localhost:54545/);
  assert.match(authUi, /prompt:\s*'select_account'/);
  assert.match(authUi, /Supabase Redirect URLs include http:\/\/localhost:54545/);
  assert.ok(
    authUi.indexOf('var callbackPromise = window.cytomoveDesktop.awaitGoogleCallback();') <
      authUi.indexOf('await waitForGoogleLoopbackReady();') &&
      authUi.indexOf('await waitForGoogleLoopbackReady();') <
      authUi.indexOf('await window.cytomoveDesktop.openExternal(response.data.url);'),
    'desktop Google flow should start callback listener, verify localhost readiness, then open the browser'
  );
});

test('desktop auth gate notifies the app shell when account state changes', () => {
  assert.match(authUi, /cytomove:auth-state-changed/);
  assert.match(authUi, /notifyAuthState/);
  assert.match(authUi, /clearLocalAuthStorage/);
  assert.match(authUi, /email:\s*session && session\.user && session\.user\.email/);
  assert.match(authUi, /detail:\s*\{\s*signedIn:\s*false/);
});

test('packaged renderer auth UI is synced from the active desktop source', () => {
  assert.equal(rendererAuthUi, authUi);
});
