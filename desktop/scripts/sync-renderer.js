const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '../..');
const appDir = path.join(root, 'app');
const authDir = path.join(root, 'auth');
const desktopDir = path.join(root, 'desktop');
const rendererDir = path.join(desktopDir, 'renderer');
const sourceDir = path.join(desktopDir, 'desktop-src');
const supabaseBrowserFromNodeModules = path.join(desktopDir, 'node_modules', '@supabase', 'supabase-js', 'dist', 'umd', 'supabase.js');
const supabaseBrowser = fs.existsSync(supabaseBrowserFromNodeModules)
  ? supabaseBrowserFromNodeModules
  : path.join(rendererDir, 'vendor', 'supabase.js');
const checkOnly = process.argv.includes('--check');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}
function writeFileAtomic(file, content) {
  if (fs.existsSync(file) && read(file) === content) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.tmp`);
  fs.writeFileSync(temporary, content, 'utf8');
  try {
    fs.renameSync(temporary, file);
  } catch (err) {
    if (err && err.code === 'EEXIST') {
      fs.rmSync(file, { force: true });
      fs.renameSync(temporary, file);
      return;
    }
    fs.rmSync(temporary, { force: true });
    throw err;
  }
}
function transformHtml(source) {
  const authGate = read(path.join(sourceDir, 'auth-gate.html'));
  const updateGate = read(path.join(sourceDir, 'update-gate.html'));
  return source
    .replace(/<title>[\s\S]*?<\/title>/, '<title>Cytomove Desktop</title>')
    .replace(/href="\.\.\/"/g, 'href="https://cytomove.com/" target="_blank" rel="noopener"')
    .replace(/href="\.\.\/access\/[^"]*"/g, 'href="https://cytomove.com/access/?stay=1" target="_blank" rel="noopener"')
    .replace(/\s*<script src="\.\.\/desktop\/renderer\/vendor\/supabase\.js"><\/script>/, '')
    .replace(/src="\.\.\/auth\//g, 'src="auth/')
    .replace(
      '<script src="auth/supabase-config.js"></script>',
      '<script src="vendor/supabase.js"></script>\n  <script src="auth/supabase-config.js"></script>'
    )
    .replace(/window\.location\.href = '\.\.\/access\/\?stay=1';/g, "window.dispatchEvent(new CustomEvent('cytomove:desktop-signout'));")
    .replace('</head>', '  <link rel="stylesheet" href="desktop/desktop.css">\n</head>')
    .replace('</body>', `${updateGate}\n${authGate}\n<script src="desktop/auth-ui.js"></script>\n<script src="desktop/file-picker.js"></script>\n<script src="desktop/update-ui.js"></script>\n</body>`)
    .replace(/[\r\n]+$/, '\n');
}
function transformSupabaseConfig(source) {
  return source.replace(
    /redirectTo:\s*window\.location\.origin\s*\+\s*"\/beta-gateway\/"/,
    'redirectTo: "https://cytomove.com/access/?stay=1"'
  );
}
const outputs = new Map([
  ['index.html', transformHtml(read(path.join(appDir, 'index.html')))],
  ['app.js', read(path.join(appDir, 'app.js'))],
  ['styles.css', read(path.join(appDir, 'styles.css'))],
  ['vendor/supabase.js', read(supabaseBrowser)],
  ['auth/cytomove-auth.js', read(path.join(authDir, 'cytomove-auth.js'))],
  ['auth/supabase-config.js', transformSupabaseConfig(read(path.join(authDir, 'supabase-config.js')))],
  ['desktop/auth-ui.js', read(path.join(sourceDir, 'auth-ui.js'))],
  ['desktop/file-picker.js', read(path.join(sourceDir, 'file-picker.js'))],
  ['desktop/update-ui.js', read(path.join(sourceDir, 'update-ui.js'))],
  ['desktop/desktop.css', read(path.join(sourceDir, 'desktop.css'))]
]);
function verify(relative, expected) {
  const target = path.join(rendererDir, relative);
  if (!fs.existsSync(target)) throw new Error(`Missing generated file: ${relative}`);
  const actual = read(target);
  if (actual !== expected) {
    const hash = value => crypto.createHash('sha256').update(value).digest('hex');
    throw new Error(`Stale generated file: ${relative} (${hash(actual)} != ${hash(expected)})`);
  }
}
function walkFiles(directory, base = directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(absolute, base) : [path.relative(base, absolute)];
  });
}
function syncTree(source, target) {
  for (const relative of walkFiles(source)) {
    const sourceFile = path.join(source, relative);
    const targetFile = path.join(target, relative);
    if (checkOnly) {
      if (!fs.existsSync(targetFile) || !fs.readFileSync(targetFile).equals(fs.readFileSync(sourceFile))) {
        throw new Error(`Stale generated asset: ${relative}`);
      }
    } else {
      if (fs.existsSync(targetFile) && fs.readFileSync(targetFile).equals(fs.readFileSync(sourceFile))) {
        continue;
      }
      fs.mkdirSync(path.dirname(targetFile), { recursive: true });
      fs.copyFileSync(sourceFile, targetFile);
    }
  }
}
for (const [relative, content] of outputs) {
  const target = path.join(rendererDir, relative);
  if (checkOnly) verify(relative, content);
  else {
    writeFileAtomic(target, content);
  }
}
syncTree(path.join(appDir, 'vendor'), path.join(rendererDir, 'vendor'));
syncTree(path.join(root, 'assets/tutorial'), path.join(desktopDir, 'assets/tutorial'));
syncTree(
  path.join(root, 'validation_sets/full_thread_control'),
  path.join(desktopDir, 'validation_sets/full_thread_control')
);
