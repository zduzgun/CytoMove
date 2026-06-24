const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'desktop/renderer/index.html'), 'utf8');
const auth = fs.readFileSync(path.join(root, 'auth/cytomove-auth.js'), 'utf8');
const desktopConfig = fs.readFileSync(path.join(root, 'desktop/renderer/auth/supabase-config.js'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'desktop/package.json'), 'utf8'));

test('desktop authentication uses a packaged Supabase browser client', () => {
  assert.ok(pkg.dependencies['@supabase/supabase-js']);
  assert.ok(fs.existsSync(path.join(root, 'desktop/renderer/vendor/supabase.js')));
  const vendorIndex = html.indexOf('vendor/supabase.js');
  const authIndex = html.indexOf('auth/cytomove-auth.js');
  assert.ok(vendorIndex >= 0 && vendorIndex < authIndex);
  assert.match(auth, /window\.supabase\.createClient/);
  assert.match(auth, /flowType:\s*"pkce"/);
  assert.match(desktopConfig, /redirectTo:\s*"https:\/\/cytomove\.com\/access\/\?stay=1"/);
});
