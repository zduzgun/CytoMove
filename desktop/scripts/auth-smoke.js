const path = require('node:path');
const os = require('node:os');
const { app, BrowserWindow } = require('electron');

app.setPath('userData', path.join(os.tmpdir(), `cytomove-auth-smoke-${process.pid}`));

app.whenReady().then(async () => {
  const window = new BrowserWindow({ show: false });
  const timeout = setTimeout(() => {
    console.error('Auth smoke test timed out.');
    app.exit(1);
  }, 15000);
  await window.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  const result = await window.webContents.executeJavaScript(`
    window.CytomoveAuth.getClient().then(function (client) {
      return {
        configured: window.CytomoveAuth.isConfigured(),
        hasAuth: Boolean(client && client.auth),
        localBundle: Boolean(window.supabase && window.supabase.createClient)
      };
    })
  `);
  console.log(JSON.stringify(result));
  clearTimeout(timeout);
  window.destroy();
  app.exit(0);
}).catch(error => {
  console.error(error.stack || error);
  app.exit(1);
});
