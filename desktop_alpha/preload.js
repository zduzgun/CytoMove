const { contextBridge, ipcRenderer } = require('electron');
const packageInfo = require('./package.json');

contextBridge.exposeInMainWorld('cytomoveDesktop', {
  name: 'Cytomove Desktop Alpha',
  version: packageInfo.version,
  platform: process.platform,
  getManifest: () => ipcRenderer.invoke('cytomove:get-desktop-manifest'),
  openExternal: url => ipcRenderer.invoke('cytomove:open-external', url)
});
