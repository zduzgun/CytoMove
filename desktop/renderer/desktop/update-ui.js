(function () {
  'use strict';
  var statusButton = document.getElementById('desktopUpdateStatus');
  var banner = document.getElementById('desktopUpdateBanner');
  var gate = document.getElementById('desktopUpdateGate');
  var title = document.getElementById('desktopUpdateTitle');
  var message = document.getElementById('desktopUpdateMessage');
  var progress = document.getElementById('desktopUpdateProgress');
  var primary = document.getElementById('desktopUpdatePrimary');
  var later = document.getElementById('desktopUpdateLater');
  var requiredMessage = document.getElementById('desktopRequiredUpdateMessage');
  var requiredProgress = document.getElementById('desktopRequiredUpdateProgress');
  var requiredPrimary = document.getElementById('desktopRequiredUpdatePrimary');
  var requiredDetails = document.getElementById('desktopRequiredUpdateDetails');
  var appShell = document.querySelector('main.app');
  var policy = null;
  var updateState = { status: 'idle', progress: 0 };
  var busyState = { busy: false, label: '' };
  if (!statusButton || !window.cytomoveDesktop) return;

  function required() { return Boolean(policy && policy.required); }
  function setWorkspaceLocked(locked) {
    appShell?.classList.toggle('desktop-policy-locked', locked);
    gate.hidden = !locked;
  }
  function render() {
    var mustUpdate = required();
    setWorkspaceLocked(mustUpdate);
    var label = updateState.status === 'downloaded' ? 'Restart to update'
      : updateState.status === 'downloading' ? 'Downloading ' + (updateState.progress || 0) + '%'
      : updateState.status === 'available' ? 'Update available'
      : mustUpdate ? 'Required update'
      : updateState.status === 'checking' ? 'Checking updates'
      : 'Up to date';
    statusButton.textContent = label;
    banner.hidden = mustUpdate || !['available','downloading','downloaded','error','manual'].includes(updateState.status);
    title.textContent = label;
    message.textContent = policy?.manifest?.message || updateState.error || '';
    later.hidden = mustUpdate;
    progress.hidden = updateState.status !== 'downloading';
    progress.value = updateState.progress || 0;
    requiredProgress.hidden = updateState.status !== 'downloading';
    requiredProgress.value = updateState.progress || 0;
    if (mustUpdate) {
      requiredMessage.textContent = policy.manifest?.message || 'This Cytomove Desktop version must be updated.';
      requiredPrimary.textContent = updateState.status === 'downloaded'
        ? 'Restart and update'
        : updateState.isPortable ? 'Download current version' : 'Download update';
    }
  }
  async function restartAndInstall() {
    if (busyState.busy && !window.confirm('Cytomove is still running ' + busyState.label + '. Restart and update?')) return;
    await window.cytomoveDesktop.restartAndInstall();
  }
  async function primaryAction() {
    if (updateState.status === 'downloaded') return restartAndInstall();
    if (updateState.isPortable || updateState.status === 'manual') {
      return window.cytomoveDesktop.openExternal(policy?.manifest?.portableUrl || policy?.manifest?.releaseNotesUrl);
    }
    return window.cytomoveDesktop.downloadUpdate();
  }
  async function refreshPolicy() {
    policy = await window.cytomoveDesktop.getDesktopPolicy();
    render();
  }
  primary.addEventListener('click', primaryAction);
  requiredPrimary.addEventListener('click', primaryAction);
  later.addEventListener('click', function () { banner.hidden = true; });
  requiredDetails.addEventListener('click', function () {
    window.cytomoveDesktop.openExternal(policy?.manifest?.releaseNotesUrl || 'https://cytomove.com/download/');
  });
  statusButton.addEventListener('click', function () { banner.hidden = !banner.hidden; });
  window.addEventListener('cytomove:busy-state', function (event) {
    busyState = event.detail || { busy: false, label: '' };
  });
  window.cytomoveDesktop.onUpdateState(function (next) { updateState = next; render(); });
  window.cytomoveDesktop.getUpdateState().then(function (next) { updateState = next; render(); });
  refreshPolicy().catch(function () {});
  setInterval(function () {
    refreshPolicy().catch(function () {});
    window.cytomoveDesktop.checkForUpdates().catch(function () {});
  }, 6 * 60 * 60 * 1000);
}());

