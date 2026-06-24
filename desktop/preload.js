const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cytomoveDesktop', {
  name: 'Cytomove Desktop',
  platform: process.platform || 'desktop',
  getVersion: () => ipcRenderer.invoke('cytomove:get-version'),
  validateAcademicAccess: payload => ipcRenderer.invoke('cytomove:validate-academic-access', payload),
  clearAcademicAccess: () => ipcRenderer.invoke('cytomove:clear-academic-access'),
  getDesktopPolicy: () => ipcRenderer.invoke('cytomove:get-desktop-policy'),
  getUpdateState: () => ipcRenderer.invoke('cytomove:get-update-state'),
  checkForUpdates: () => ipcRenderer.invoke('cytomove:check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('cytomove:download-update'),
  restartAndInstall: () => ipcRenderer.invoke('cytomove:restart-and-install'),
  onUpdateState: callback => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('cytomove:update-state', listener);
    return () => ipcRenderer.removeListener('cytomove:update-state', listener);
  },
  closeApp: () => ipcRenderer.invoke('cytomove:close-app'),
  openExternal: url => ipcRenderer.invoke('cytomove:open-external', url),
  chooseLocalImages: () => ipcRenderer.invoke('cytomove:choose-local-images'),
  readValidationAsset: relativePath => ipcRenderer.invoke('cytomove:read-validation-asset', relativePath),
  awaitGoogleCallback: () => ipcRenderer.invoke('cytomove:google-auth-wait')
});
