const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('Cloudflare Pages output contains the site but excludes source videos', () => {
  const localTempBase = path.join(root, '.codex_tmp');
  fs.mkdirSync(localTempBase, { recursive: true });
  const tempRoot = fs.mkdtempSync(path.join(localTempBase, 'cytomove-pages-'));
  const output = path.join(tempRoot, 'dist');
  const outputRelative = path.relative(root, output);

  try {
    execFileSync(process.execPath, [path.join(root, 'pages-build.mjs'), outputRelative], {
      cwd: root,
      stdio: 'pipe'
    });

    assert.ok(fs.existsSync(path.join(output, 'index.html')));
    assert.ok(fs.existsSync(path.join(output, 'app', 'index.html')));
    assert.ok(fs.existsSync(path.join(output, 'app', 'app.js')));
    assert.ok(!fs.existsSync(path.join(output, 'video_tutorial')));

    const pending = [output];
    while (pending.length) {
      const current = pending.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const entryPath = path.join(current, entry.name);
        if (entry.isDirectory()) pending.push(entryPath);
        else assert.ok(fs.statSync(entryPath).size <= 25 * 1024 * 1024, `${entryPath} exceeds 25 MiB`);
      }
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
