const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
execFileSync(process.execPath, ['desktop/scripts/sync-renderer.js', '--check'], {
  cwd: root,
  stdio: 'pipe'
});

assert.equal(
  fs.readFileSync(path.join(root, 'desktop/renderer/app.js'), 'utf8').replace(/^\uFEFF/, ''),
  fs.readFileSync(path.join(root, 'app/app.js'), 'utf8').replace(/^\uFEFF/, ''),
  'Desktop app.js must exactly match canonical app/app.js'
);
const html = fs.readFileSync(path.join(root, 'desktop/renderer/index.html'), 'utf8');
for (const pattern of [
  /<title>Cytomove Desktop<\/title>/,
  /desktop\/desktop\.css/,
  /desktop\/auth-ui\.js/,
  /desktop\/file-picker\.js/,
  /desktop\/update-ui\.js/,
  /id="desktopAuthGate"/,
  /id="desktopUpdateGate"/
]) assert.match(html, pattern);
assert.doesNotMatch(html, /id="trialGate"/);
assert.doesNotMatch(html, /\.\.\/access\/\?stay=1/);
for (const file of [
  'analysis-worker.js',
  'styles.css',
  'vendor/pptxgen.bundle.js',
  'auth/cytomove-auth.js',
  'auth/supabase-config.js',
  'desktop/auth-ui.js',
  'desktop/file-picker.js',
  'desktop/update-ui.js',
  'desktop/desktop.css'
]) assert.ok(fs.existsSync(path.join(root, 'desktop/renderer', file)), `${file} must be generated`);
assert.ok(fs.existsSync(path.join(root, 'desktop/assets/tutorial/m8f/m8f_0h_001.png')));
assert.ok(fs.existsSync(path.join(root, 'desktop/validation_sets/full_thread_control/huvec_control_r1/0.jpg')));
