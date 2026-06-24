const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const main = fs.readFileSync(path.join(root, 'desktop/main.js'), 'utf8');
const preload = fs.readFileSync(path.join(root, 'desktop/preload.js'), 'utf8');
const pickerPath = path.join(root, 'desktop/desktop-src/file-picker.js');
const picker = fs.existsSync(pickerPath) ? fs.readFileSync(pickerPath, 'utf8') : '';
const app = fs.readFileSync(path.join(root, 'app/app.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'app/index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'app/styles.css'), 'utf8');
const unpackedCheckScript = fs.readFileSync(path.join(root, 'desktop/scripts/prepare-unpacked-check.ps1'), 'utf8');

test('desktop local-file picker bridges Windows files into the canonical loader', () => {
  assert.ok(fs.existsSync(pickerPath));
  assert.match(main, /cytomove:choose-local-images/);
  assert.match(main, /showOpenDialog/);
  assert.match(preload, /chooseLocalImages/);
  assert.match(picker, /CYTOMOVE_USE_NATIVE_FILE_PICKER/);
  assert.match(picker, /new File/);
  assert.match(picker, /type\s*={2,3}\s*['"]Buffer['"]/);
  assert.match(picker, /Array\.isArray\(bytes\.data\)/);
  assert.match(picker, /cytomove:desktop-files-selected/);
  assert.match(app, /cytomove:desktop-files-selected/);
});

test('desktop multi-image import does not depend on window.prompt', () => {
  const match = app.match(/function askCustomGroupName\(files\) \{([\s\S]*?)\n  \}/);
  assert.ok(match, 'askCustomGroupName function should exist');
  const body = match[1];
  assert.match(body, /showGroupNameDialog/);
  assert.match(app, /async function loadLocalFiles/);
  assert.match(app, /await askCustomGroupName\(images\)/);
  assert.doesNotMatch(body, /window\.prompt/);
});

test('multi-image group naming uses an in-app modal before creating a group', () => {
  assert.match(index, /id="groupNameDialog"/);
  assert.match(index, /id="groupNameInput"/);
  assert.match(index, /id="confirmGroupName"/);
  assert.match(index, /id="cancelGroupName"/);
  assert.match(styles, /\.group-name-dialog/);
  assert.match(app, /function showGroupNameDialog/);
  assert.match(app, /pendingGroupNameDialog/);
  assert.match(index, /Create group/);
});

test('loaded group controls expose a prominent add-another-group CTA', () => {
  assert.match(index, /id="addImageGroup"/);
  assert.match(index, /\+ Add another image group/);
  assert.match(styles, /\.group-add-cta/);
  assert.match(styles, /grid-column:\s*1\s*\/\s*-1/);
  assert.match(app, /addImageGroup:\s*document\.getElementById\('addImageGroup'\)/);
  assert.match(app, /function openImageGroupPicker\(\)/);
  const match = app.match(/function openImageGroupPicker\(\) \{([\s\S]*?)\n  \}/);
  assert.ok(match, 'openImageGroupPicker should exist');
  assert.match(match[1], /el\.fileInput\.multiple\s*=\s*true/);
  assert.match(match[1], /el\.fileInput\.click\(\)/);
  assert.match(app, /el\.addImageGroup\.addEventListener\('click',openImageGroupPicker\)/);
  assert.match(picker, /#addImageGroup/);
});

test('group naming modal uses an opaque readable Cytomove surface', () => {
  const cardMatch = styles.match(/\.group-name-card\s*\{([\s\S]*?)\n    \}/);
  assert.ok(cardMatch, 'group-name-card style should exist');
  assert.doesNotMatch(cardMatch[1], /var\(--card\)/);
  assert.match(cardMatch[1], /background:\s*var\(--panel/);
  assert.match(cardMatch[1], /box-shadow:\s*0 24px 70px/);
  assert.match(styles, /\.group-name-card \.auth-input/);
  assert.match(styles, /\.group-name-card \.auth-input:focus/);
  assert.match(styles, /box-shadow:\s*0 0 0 4px rgba\(15,159,143,0\.16\)/);
});

test('file input snapshots selected files before clearing the native input', () => {
  const match = app.match(/el\.fileInput\.addEventListener\('change',e=>\{([\s\S]*?)\n    \}\);/);
  assert.ok(match, 'file input change handler should exist');
  const body = match[1];
  const snapshotIndex = body.indexOf('Array.from(e.target.files||[])');
  const clearIndex = body.indexOf("e.target.value=''");
  assert.ok(snapshotIndex >= 0, 'change handler should convert the live FileList to an array');
  assert.ok(clearIndex >= 0, 'change handler should clear the native input after snapshotting files');
  assert.ok(snapshotIndex < clearIndex, 'FileList snapshot must happen before clearing the input value');
  assert.match(body, /loadLocalFiles\(files\)/);
});

test('unpacked check build carries the modal stylesheet into app.asar', () => {
  assert.match(unpackedCheckScript, /renderer\\styles\.css/);
});
