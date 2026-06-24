const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const { readJson, writeJsonAtomic } = require('./lib/json-store');
const { validateAcademicAccess } = require('./lib/academic-access');
const { decideGrace } = require('./lib/grace-policy');
const { decideUpdatePolicy } = require('./lib/update-policy');
const { decideCachedPolicy } = require('./lib/policy-cache');
const { createUpdateManager } = require('./lib/update-manager');
const academicConfig = require('./config/academic-access.json');

const APP_TITLE = 'Cytomove Desktop';
const DESKTOP_MANIFEST_URL = process.env.CYTOMOVE_MANIFEST_URL
  || 'https://cytomove.com/desktop-manifest.json';
const GOOGLE_LOOPBACK_PORT = 54545;
const ACCESS_CACHE_FILE = 'academic-access.json';
const POLICY_CACHE_FILE = 'desktop-policy.json';

let mainWindow = null;
let updateManager = null;

function cachePath(filename) {
  return path.join(app.getPath('userData'), filename);
}

function nowMs() {
  const testNow = !app.isPackaged && Number(process.env.CYTOMOVE_TEST_NOW);
  return Number.isFinite(testNow) && testNow > 0 ? testNow : Date.now();
}

function accessDecisionFromCache() {
  const cache = readJson(cachePath(ACCESS_CACHE_FILE));
  const decision = decideGrace(cache, nowMs());
  if (cache && Number.isFinite(cache.lastSeenAt)) {
    writeJsonAtomic(cachePath(ACCESS_CACHE_FILE), {
      ...cache,
      lastSeenAt: Math.max(cache.lastSeenAt, nowMs())
    });
  }
  return decision;
}

async function validateDesktopAcademicAccess(payload = {}) {
  try {
    const result = await validateAcademicAccess({
      accessToken: payload.accessToken,
      expectedUserId: payload.userId,
      expectedEmail: payload.email,
      config: academicConfig
    });
    const saved = {
      approved: result.approved,
      explicitDenial: result.explicitDenial,
      validatedAt: nowMs(),
      lastSeenAt: nowMs(),
      userId: result.userId || payload.userId || null,
      email: result.email || payload.email || null,
      accessStatus: result.accessStatus || null
    };
    writeJsonAtomic(cachePath(ACCESS_CACHE_FILE), saved);
    return {
      allowed: result.approved,
      source: 'online',
      reason: result.reason,
      remainingMs: result.approved ? 72 * 60 * 60 * 1000 : 0
    };
  } catch (error) {
    return { ...accessDecisionFromCache(), error: error.message };
  }
}

async function fetchDesktopManifest() {
  const response = await fetch(DESKTOP_MANIFEST_URL, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'X-Cytomove-Desktop-Version': app.getVersion()
    }
  });
  if (!response.ok) throw new Error(`Manifest request failed: HTTP ${response.status}`);
  return response.json();
}

async function getDesktopPolicy() {
  try {
    const manifest = await fetchDesktopManifest();
    const update = decideUpdatePolicy(app.getVersion(), manifest);
    writeJsonAtomic(cachePath(POLICY_CACHE_FILE), { manifest, fetchedAt: nowMs() });
    return {
      allowed: !update.required,
      required: update.required,
      source: 'online',
      reason: update.reason,
      manifest,
      update
    };
  } catch (error) {
    const cache = readJson(cachePath(POLICY_CACHE_FILE));
    const cached = decideCachedPolicy(app.getVersion(), cache, nowMs());
    return {
      ...cached,
      required: cached.required || cached.reason === 'policy-grace-expired',
      manifest: cache?.manifest || null,
      error: error.message
    };
  }
}

function createUpdater() {
  const isPortable = Boolean(process.env.PORTABLE_EXECUTABLE_FILE);
  let updater = null;
  try {
    updater = require('electron-updater').autoUpdater;
  } catch (_error) {
    updater = {
      autoDownload: false,
      on() {},
      async checkForUpdates() {},
      async downloadUpdate() {},
      quitAndInstall() {}
    };
  }
  updateManager = createUpdateManager({
    updater,
    isPackaged: app.isPackaged,
    isPortable,
    send: state => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('cytomove:update-state', state);
      }
    }
  });
  updateManager.initialize();
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
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
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', event => {
    if (/^https?:\/\//i.test(event.url || '')) {
      event.preventDefault();
      shell.openExternal(event.url);
    }
  });
  mainWindow.webContents.on('did-fail-load', (_event, code, description) => {
    dialog.showErrorBox(APP_TITLE, `The analysis screen failed to load.\n\n${code}: ${description}`);
  });
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

ipcMain.handle('cytomove:get-version', () => app.getVersion());
ipcMain.handle('cytomove:validate-academic-access', (_event, payload) => validateDesktopAcademicAccess(payload));
ipcMain.handle('cytomove:clear-academic-access', () => {
  writeJsonAtomic(cachePath(ACCESS_CACHE_FILE), {
    approved: false,
    explicitDenial: true,
    validatedAt: nowMs(),
    lastSeenAt: nowMs()
  });
  return true;
});
ipcMain.handle('cytomove:get-desktop-policy', () => getDesktopPolicy());
ipcMain.handle('cytomove:get-update-state', () => updateManager.getState());
ipcMain.handle('cytomove:check-for-updates', () => updateManager.check());
ipcMain.handle('cytomove:download-update', () => updateManager.download());
ipcMain.handle('cytomove:restart-and-install', () => updateManager.restartAndInstall());
ipcMain.handle('cytomove:close-app', () => {
  app.quit();
  return true;
});
ipcMain.handle('cytomove:open-external', async (_event, url) => {
  const parsed = new URL(String(url));
  if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Only web links can be opened.');
  await shell.openExternal(parsed.toString());
  return true;
});
ipcMain.handle('cytomove:choose-local-images', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open wound-healing images',
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'] }
    ]
  });
  if (result.canceled) return [];
  return Promise.all(result.filePaths.slice(0, 48).map(async filePath => {
    const extension = path.extname(filePath).toLowerCase();
    const mime = extension === '.png' ? 'image/png'
      : extension === '.gif' ? 'image/gif'
      : extension === '.bmp' ? 'image/bmp'
      : extension === '.webp' ? 'image/webp'
      : 'image/jpeg';
    return {
      name: path.basename(filePath),
      type: mime,
      bytes: await fs.promises.readFile(filePath)
    };
  }));
});
ipcMain.handle('cytomove:read-validation-asset', async (_event, relativePath) => {
  const normalized = String(relativePath || '').replace(/\\/g, '/');
  const marker = 'validation_sets/';
  const markerIndex = normalized.indexOf(marker);
  if (markerIndex < 0) throw new Error('Invalid validation asset path.');
  const relative = normalized.slice(markerIndex + marker.length);
  const validationRoot = path.resolve(__dirname, 'validation_sets');
  const target = path.resolve(validationRoot, relative);
  if (!target.startsWith(`${validationRoot}${path.sep}`)) throw new Error('Invalid validation asset path.');
  const extension = path.extname(target).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(extension)) throw new Error('Unsupported validation asset.');
  return {
    name: path.basename(target),
    type: extension === '.png' ? 'image/png' : 'image/jpeg',
    bytes: await fs.promises.readFile(target)
  };
});

ipcMain.handle('cytomove:google-auth-wait', () => new Promise((resolve, reject) => {
  let settled = false;
  const server = http.createServer((request, response) => {
    if (request.method === 'OPTIONS') {
      response.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      response.end();
      return;
    }
    const fullUrl = `http://localhost:${GOOGLE_LOOPBACK_PORT}${request.url || ''}`;
    const callback = new URL(fullUrl);
    const completed = callback.searchParams.has('code') || callback.searchParams.has('error') || callback.searchParams.has('error_description');
    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    response.end(completed
      ? '<!doctype html><html><body style="font-family:system-ui;text-align:center;padding:48px"><h2>Cytomove</h2><p>Sign-in complete. Return to the desktop app.</p></body></html>'
      : '<!doctype html><html><body style="font-family:system-ui;text-align:center;padding:48px"><h2>Cytomove</h2><p>Waiting for the Google response...</p></body></html>');
    if (completed && !settled) {
      settled = true;
      clearTimeout(timeout);
      server.close();
      resolve(fullUrl);
    }
  });
  const timeout = setTimeout(() => {
    if (!settled) {
      settled = true;
      server.close();
      reject(new Error('Google sign-in did not return to Cytomove within 60 seconds. Close the browser tab and try again.'));
    }
  }, 60 * 1000);
  server.on('error', error => {
    if (!settled) {
      settled = true;
      clearTimeout(timeout);
      reject(new Error(error.code === 'EADDRINUSE'
        ? 'Google sign-in helper is already running. Fully close Cytomove and try again.'
        : error.message));
    }
  });
  server.listen(GOOGLE_LOOPBACK_PORT);
}));

app.whenReady().then(() => {
  app.setName(APP_TITLE);
  createUpdater();
  createMainWindow();
  updateManager.check().catch(() => {});
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
