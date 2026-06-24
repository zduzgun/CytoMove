const test = require('node:test');
const assert = require('node:assert/strict');
const { createUpdateManager } = require('../desktop/lib/update-manager');

test('publishes update progress and downloaded state', () => {
  const listeners = {};
  const sent = [];
  const updater = {
    autoDownload: true,
    on(name, handler) { listeners[name] = handler; },
    checkForUpdates: async () => ({}),
    downloadUpdate: async () => {},
    quitAndInstall() {}
  };
  const manager = createUpdateManager({
    updater,
    send: state => sent.push(state),
    isPackaged: true,
    isPortable: false
  });
  manager.initialize();
  listeners['download-progress']({ percent: 42 });
  listeners['update-downloaded']({ version: '1.1.0' });
  assert.equal(sent.at(-2).progress, 42);
  assert.equal(sent.at(-1).status, 'downloaded');
});

test('portable builds use manual update state', async () => {
  const manager = createUpdateManager({
    updater: { on() {} },
    send() {},
    isPackaged: true,
    isPortable: true
  });
  manager.initialize();
  assert.equal((await manager.check()).status, 'manual');
});
