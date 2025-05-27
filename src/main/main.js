const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { initialize, enable } = require('@electron/remote/main');
const fs = require('fs').promises;
const { scanDirectory, processPhoto } = require('./photoProcessor');

initialize();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  enable(mainWindow.webContents);

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Create thumbnails directory if it doesn't exist
const thumbnailsDir = path.join(app.getPath('userData'), 'thumbnails');
fs.mkdir(thumbnailsDir, { recursive: true }).catch(console.error);

// IPC Handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['arw', 'cr2', 'raf', 'dng', 'nef', 'orf', 'rw2', 'jpg', 'jpeg', 'png'] }
    ]
  });
  return result.filePaths;
});

ipcMain.handle('import-folder', async (event, folderPath) => {
  try {
    const files = await scanDirectory(folderPath);
    const processedPhotos = [];

    for (const file of files) {
      const photo = await processPhoto(file, thumbnailsDir);
      if (photo) {
        processedPhotos.push(photo);
        // Send progress update
        mainWindow.webContents.send('import-progress', {
          current: processedPhotos.length,
          total: files.length,
          photo
        });
      }
    }

    return processedPhotos;
  } catch (error) {
    console.error('Error importing folder:', error);
    throw error;
  }
});

ipcMain.handle('import-files', async (event, filePaths) => {
  try {
    const processedPhotos = [];

    for (const filePath of filePaths) {
      const photo = await processPhoto(filePath, thumbnailsDir);
      if (photo) {
        processedPhotos.push(photo);
        // Send progress update
        mainWindow.webContents.send('import-progress', {
          current: processedPhotos.length,
          total: filePaths.length,
          photo
        });
      }
    }

    return processedPhotos;
  } catch (error) {
    console.error('Error importing files:', error);
    throw error;
  }
});

ipcMain.handle('open-in-affinity', async (event, filePath) => {
  try {
    if (process.platform === 'darwin') {
      await require('child_process').exec(`open -a "Affinity Photo" "${filePath}"`);
    } else if (process.platform === 'win32') {
      // TODO: Implement Windows path configuration
      const affinityPath = 'C:\\Program Files\\Affinity\\Affinity Photo\\AffinityPhoto.exe';
      await require('child_process').spawn(affinityPath, [filePath]);
    }
    return true;
  } catch (error) {
    console.error('Error opening file in Affinity Photo:', error);
    throw error;
  }
}); 