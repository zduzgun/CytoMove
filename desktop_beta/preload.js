const { contextBridge, ipcRenderer } = require('electron');
// NOTE: sandbox:true preloads cannot require local files (e.g. ./package.json),
// doing so throws and silently breaks the whole bridge. Keep version in sync
// with package.json manually.
const APP_VERSION = '0.1.0-alpha.1';

contextBridge.exposeInMainWorld('cytomoveDesktop', {
  name: 'Cytomove Desktop Alpha',
  version: APP_VERSION,
  platform: (typeof process !== 'undefined' && process.platform) ? process.platform : 'desktop',
  getManifest: () => ipcRenderer.invoke('cytomove:get-desktop-manifest'),
  getTrialState: () => ipcRenderer.invoke('cytomove:get-trial-state'),
  closeApp: () => ipcRenderer.invoke('cytomove:close-app'),
  openExternal: url => ipcRenderer.invoke('cytomove:open-external', url),
  awaitGoogleCallback: () => ipcRenderer.invoke('cytomove:google-auth-wait')
});
