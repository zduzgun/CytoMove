const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app/app.js'), 'utf8');

function groupSelectChangeHandlerSource() {
  const start = app.indexOf("el.groupSelect.addEventListener('change',()=>{");
  assert.notStrictEqual(start, -1, 'groupSelect change handler should exist');
  const end = app.indexOf("    if(el.qcImageList)", start);
  assert.notStrictEqual(end, -1, 'groupSelect change handler should end before qcImageList handler');
  return app.slice(start, end);
}

test('group change loads the first image from the newly selected group', () => {
  const source = groupSelectChangeHandlerSource();
  assert.match(source, /if\(state\.appModule==='qc'\)/);
  assert.match(source, /const samples=selectedGroupSamples\(\)/);
  assert.match(source, /loadQcSampleAt\(0\)/);
  assert.match(source, /loadGroupSampleAt\(0\)/);
  assert.ok(
    source.indexOf('loadQcSampleAt(0)') > source.indexOf("if(state.appModule==='qc')"),
    'QC branch should load the first sample after the selected group changes'
  );
  assert.ok(
    source.indexOf('loadGroupSampleAt(0)') > source.indexOf("if(state.mode==='group')"),
    'group review branch should load the first sample after the selected group changes'
  );
});
