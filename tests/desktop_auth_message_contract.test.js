const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const authUi = fs.readFileSync(
  path.resolve(__dirname, '../desktop/desktop-src/auth-ui.js'),
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
