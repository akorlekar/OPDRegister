const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktopStore', {
  read: () => ipcRenderer.sendSync('store-read'),
  write: (text) => { if (!ipcRenderer.sendSync('store-write', text)) throw new Error('write failed'); },
  info: () => ipcRenderer.sendSync('store-info'),
  openFolder: () => ipcRenderer.sendSync('store-open-folder'),
  backupNow: () => ipcRenderer.sendSync('store-backup-now'),
  quit: () => ipcRenderer.send('app-quit')
});
