const { compareVersions } = require('./semver');
function validateManifest(manifest) {
  if (manifest?.schemaVersion === 1 && manifest.latestVersion) {
    return {
      ...manifest,
      schemaVersion: 2,
      minimumRequiredVersion: '0.0.0',
      updateMode: 'recommended'
    };
  }
  if (!manifest || manifest.schemaVersion !== 2) throw new Error('Unsupported desktop manifest schema.');
  if (!manifest.latestVersion || !manifest.minimumRequiredVersion) throw new Error('Desktop manifest is incomplete.');
  if (!['recommended', 'required'].includes(manifest.updateMode)) throw new Error('Invalid update mode.');
  return manifest;
}
function decideUpdatePolicy(currentVersion, rawManifest) {
  const manifest = validateManifest(rawManifest);
  const updateAvailable = compareVersions(currentVersion, manifest.latestVersion) < 0;
  const belowMinimum = compareVersions(currentVersion, manifest.minimumRequiredVersion) < 0;
  const requiredByMode = manifest.updateMode === 'required' && updateAvailable;
  return {
    updateAvailable,
    required: belowMinimum || requiredByMode,
    targetVersion: manifest.latestVersion,
    reason: belowMinimum ? 'minimum-version' : requiredByMode ? 'required-mode' : updateAvailable ? 'recommended' : 'current'
  };
}
module.exports = { decideUpdatePolicy, validateManifest };
