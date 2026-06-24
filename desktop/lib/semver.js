function parseVersion(value) {
  const raw = String(value || '').trim().replace(/^v/i, '');
  const [core, prerelease = ''] = raw.split('-', 2);
  const parts = core.split('.').slice(0, 3).map(part => Number.parseInt(part, 10) || 0);
  while (parts.length < 3) parts.push(0);
  return { parts, prerelease };
}
function compareVersions(left, right) {
  const a = parseVersion(left), b = parseVersion(right);
  for (let index = 0; index < 3; index += 1) {
    if (a.parts[index] !== b.parts[index]) return a.parts[index] > b.parts[index] ? 1 : -1;
  }
  if (!a.prerelease && b.prerelease) return 1;
  if (a.prerelease && !b.prerelease) return -1;
  return a.prerelease.localeCompare(b.prerelease, undefined, { numeric: true, sensitivity: 'base' });
}
module.exports = { compareVersions, parseVersion };

