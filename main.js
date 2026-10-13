const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

if (!app.requestSingleInstanceLock()) { app.quit(); }

/* ---------------------------------------------------------------------
   Where the data lives
   Documents\OPD Register Data\opd-data.json
   This folder is NOT inside the app, so uninstalling or reinstalling the
   app never touches it. If Documents is not writable, falls back to the
   normal app-data folder.
   --------------------------------------------------------------------- */
let dataDir = null;
function resolveDir() {
  if (dataDir) return dataDir;
  const candidates = [];
  try { candidates.push(path.join(app.getPath('documents'), 'OPD Register Data')); } catch (e) {}
  candidates.push(path.join(app.getPath('userData'), 'data'));
  for (const dir of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      const probe = path.join(dir, '.write-test');
      fs.writeFileSync(probe, 'ok'); fs.unlinkSync(probe);
      dataDir = dir; break;
    } catch (e) { /* try next */ }
  }
  if (!dataDir) dataDir = app.getPath('userData');
  return dataDir;
}
const dataFile = () => path.join(resolveDir(), 'opd-data.json');
const backupDir = () => path.join(resolveDir(), 'Backups');

function readData() {
  try { return fs.readFileSync(dataFile(), 'utf8'); } catch (e) { return ''; }
}

function writeData(text) {
  const file = dataFile();
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, text, 'utf8');
  try { if (fs.existsSync(file)) fs.copyFileSync(file, file.replace(/\.json$/, '.previous.json')); } catch (e) {}
  fs.renameSync(tmp, file);
  dailyBackup(text);
}

function prune(prefix, keep) {
  try {
    const files = fs.readdirSync(backupDir()).filter(n => n.startsWith(prefix) && n.endsWith('.json')).sort();
    while (files.length > keep) fs.unlinkSync(path.join(backupDir(), files.shift()));
  } catch (e) {}
}

// One automatic copy per day, last 60 days kept.
function dailyBackup(text) {
  try {
    fs.mkdirSync(backupDir(), { recursive: true });
    const d = new Date();
    const day = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    fs.writeFileSync(path.join(backupDir(), 'opd-' + day + '.json'), text, 'utf8');
    prune('opd-', 60);
  } catch (e) { /* best effort */ }
}

function manualBackup() {
  try {
    const text = readData(); if (!text) return false;
    fs.mkdirSync(backupDir(), { recursive: true });
    const d = new Date(), p2 = x => String(x).padStart(2, '0');
    const stamp = d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + '-' + p2(d.getHours()) + p2(d.getMinutes());
    fs.writeFileSync(path.join(backupDir(), 'manual-' + stamp + '.json'), text, 'utf8');
    prune('manual-', 30);
    return true;
  } catch (e) { return false; }
}

ipcMain.on('store-read', (e) => { e.returnValue = readData(); });
ipcMain.on('store-write', (e, text) => {
  try { writeData(String(text)); e.returnValue = true; } catch (err) { e.returnValue = false; }
});
ipcMain.on('store-info', (e) => { e.returnValue = { folder: resolveDir(), file: dataFile() }; });
ipcMain.on('store-open-folder', (e) => { shell.openPath(resolveDir()); e.returnValue = true; });
ipcMain.on('store-backup-now', (e) => { e.returnValue = manualBackup(); });
ipcMain.on('app-quit', () => app.quit());

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 820, minWidth: 900, minHeight: 600,
    title: 'OPD Register',
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.on('window-all-closed', () => app.quit());
