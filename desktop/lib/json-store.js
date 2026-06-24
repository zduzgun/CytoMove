const fs = require('node:fs');
const path = require('node:path');
function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) { return fallback; }
}
function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(value, null, 2), 'utf8');
  fs.renameSync(temporary, file);
}
module.exports = { readJson, writeJsonAtomic };

