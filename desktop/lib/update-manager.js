function createUpdateManager({ updater, send, isPackaged, isPortable }) {
  let state = { status: 'idle', progress: 0, version: null, error: null, isPortable };
  const publish = patch => {
    state = { ...state, ...patch };
    send({ ...state });
    return state;
  };

  function initialize() {
    updater.autoDownload = false;
    updater.on('checking-for-update', () => publish({ status: 'checking', error: null }));
    updater.on('update-available', info => publish({ status: 'available', version: info.version }));
    updater.on('update-not-available', () => publish({ status: 'current' }));
    updater.on('download-progress', value => publish({
      status: 'downloading',
      progress: Math.round(value.percent || 0)
    }));
    updater.on('update-downloaded', info => publish({
      status: 'downloaded',
      version: info.version,
      progress: 100
    }));
    updater.on('error', error => publish({ status: 'error', error: error.message }));
    return state;
  }

  async function check() {
    if (!isPackaged || isPortable) return publish({ status: 'manual', isPortable });
    publish({ status: 'checking', error: null });
    await updater.checkForUpdates();
    return state;
  }

  async function download() {
    if (isPortable) return publish({ status: 'manual', isPortable: true });
    await updater.downloadUpdate();
    return state;
  }

  function restartAndInstall() {
    if (state.status !== 'downloaded') throw new Error('No downloaded update is ready.');
    updater.quitAndInstall(false, true);
  }

  return {
    initialize,
    check,
    download,
    restartAndInstall,
    getState: () => ({ ...state })
  };
}

module.exports = { createUpdateManager };
