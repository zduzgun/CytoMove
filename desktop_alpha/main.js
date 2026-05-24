const path = require('node:path');
const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');

const APP_TITLE = 'Cytomove Desktop Alpha';
const DESKTOP_MANIFEST_URL = 'https://cytomove.com/desktop-manifest.json';

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: APP_TITLE,
    width: 1440,
    height: 940,
    minWidth: 1120,
    minHeight: 720,
    backgroundColor: '#f6faf9',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.removeMenu();
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', event => {
    const nextUrl = event.url || '';
    if (/^https?:\/\//i.test(nextUrl)) {
      event.preventDefault();
      shell.openExternal(nextUrl);
    }
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    dialog.showErrorBox(APP_TITLE, `The analysis screen failed to load.\n\n${errorCode}: ${errorDescription}`);
  });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    dialog.showErrorBox(APP_TITLE, `The analysis window stopped unexpectedly.\n\nReason: ${details.reason}`);
  });

  mainWindow.on('unresponsive', () => {
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: APP_TITLE,
      message: 'Cytomove is busy.',
      detail: 'Large image groups can take time to analyze. If the window does not recover, close and reopen the desktop alpha.'
    }).catch(() => {});
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

process.on('uncaughtException', error => {
  dialog.showErrorBox(APP_TITLE, `Unexpected desktop error:\n\n${error.stack || error.message || error}`);
});

process.on('unhandledRejection', reason => {
  const message = reason && (reason.stack || reason.message) ? (reason.stack || reason.message) : String(reason);
  dialog.showErrorBox(APP_TITLE, `Unexpected async desktop error:\n\n${message}`);
});

ipcMain.handle('cytomove:get-desktop-manifest', async () => {
  const response = await fetch(DESKTOP_MANIFEST_URL, {
    cache: 'no-store',
    headers: {
      'Accept': 'application/json',
      'X-Cytomove-Desktop-Version': app.getVersion()
    }
  });
  if (!response.ok) throw new Error(`Manifest request failed: HTTP ${response.status}`);
  return response.json();
});

ipcMain.handle('cytomove:open-external', async (_event, url) => {
  const parsed = new URL(String(url));
  if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Only web links can be opened.');
  await shell.openExternal(parsed.toString());
  return true;
});

app.whenReady().then(() => {
  app.setName(APP_TITLE);
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
