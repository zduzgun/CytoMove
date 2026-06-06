const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');

const APP_TITLE = 'Cytomove Desktop Alpha';
const DESKTOP_MANIFEST_URL = 'https://cytomove.com/desktop-manifest.json';
const TRIAL_DURATION_DAYS = 30;
const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;
const CLOCK_ROLLBACK_GRACE_MS = 5 * 60 * 1000;
const TRIAL_STATE_FILE = 'desktop-alpha-trial.json';
const TRIAL_VERSION = 'alpha-0.1';

let mainWindow = null;

function trialStatePath() {
  return path.join(app.getPath('userData'), TRIAL_STATE_FILE);
}

function toIso(ms) {
  return new Date(ms).toISOString();
}

function parseTime(value) {
  const ms = Date.parse(value || '');
  return Number.isFinite(ms) ? ms : null;
}

function makeInstallId() {
  return typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
}

function readTrialStateFile() {
  try {
    return JSON.parse(fs.readFileSync(trialStatePath(), 'utf8'));
  } catch (_error) {
    return null;
  }
}

function writeTrialStateFile(nextState) {
  fs.mkdirSync(app.getPath('userData'), { recursive: true });
  fs.writeFileSync(trialStatePath(), JSON.stringify(nextState, null, 2), 'utf8');
}

function getDesktopTrialState() {
  const nowMs = Date.now();
  const saved = readTrialStateFile() || {};
  const savedFirstRunMs = parseTime(saved.firstRunAt);
  const savedLastSeenMs = parseTime(saved.lastSeenAt);
  const firstRunMs = savedFirstRunMs || nowMs;
  const lastSeenMs = savedLastSeenMs || nowMs;
  const clockInvalid = nowMs + CLOCK_ROLLBACK_GRACE_MS < lastSeenMs;
  const effectiveNowMs = clockInvalid ? lastSeenMs : nowMs;
  const expiresMs = firstRunMs + TRIAL_DURATION_MS;
  const expired = effectiveNowMs >= expiresMs;
  const storedLastSeenMs = Math.max(nowMs, lastSeenMs);
  const installId = typeof saved.installId === 'string' && saved.installId ? saved.installId : makeInstallId();
  const nextState = {
    installId,
    trialVersion: TRIAL_VERSION,
    firstRunAt: toIso(firstRunMs),
    lastSeenAt: toIso(storedLastSeenMs)
  };

  writeTrialStateFile(nextState);

  return {
    source: 'local-user-data',
    installId,
    trialVersion: TRIAL_VERSION,
    durationDays: TRIAL_DURATION_DAYS,
    firstRunAt: toIso(firstRunMs),
    lastSeenAt: toIso(storedLastSeenMs),
    now: toIso(nowMs),
    expiresAt: toIso(expiresMs),
    daysRemaining: Math.max(0, Math.ceil((expiresMs - effectiveNowMs) / (24 * 60 * 60 * 1000))),
    expired,
    clockInvalid
  };
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

ipcMain.handle('cytomove:get-trial-state', async () => getDesktopTrialState());

ipcMain.handle('cytomove:close-app', async () => {
  app.quit();
  return true;
});

// Google sign-in via loopback: start a one-shot local server, wait for the
// OAuth redirect (http://localhost:PORT/?code=...), return the full URL.
const GOOGLE_LOOPBACK_PORT = 54545;

ipcMain.handle('cytomove:google-auth-wait', async () => {
  return await new Promise((resolve, reject) => {
    let settled = false;
    const server = http.createServer((req, res) => {
      const fullUrl = 'http://localhost:' + GOOGLE_LOOPBACK_PORT + (req.url || '');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<!doctype html><html><head><meta charset="utf-8"><title>Cytomove</title></head>' +
        '<body style="font-family:system-ui,Segoe UI,sans-serif;text-align:center;padding:48px;color:#102027">' +
        '<h2 style="color:#08766c">Cytomove</h2><p>Sign-in complete. You can close this tab and return to the desktop app.</p></body></html>');
      if (!settled) {
        settled = true;
        cleanup();
        resolve(fullUrl);
      }
    });
    function cleanup() {
      clearTimeout(timeout);
      try { server.close(); } catch (_e) {}
    }
    const timeout = setTimeout(() => {
      if (!settled) { settled = true; cleanup(); reject(new Error('Google sign-in timed out. Please try again.')); }
    }, 5 * 60 * 1000);
    server.on('error', err => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(new Error('Could not start the local sign-in listener on port ' + GOOGLE_LOOPBACK_PORT + '. ' + (err && err.message ? err.message : '')));
      }
    });
    server.listen(GOOGLE_LOOPBACK_PORT, '127.0.0.1');
  });
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
