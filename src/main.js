const { app, BrowserWindow, ipcMain, dialog } = require('electron');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // Make sure this path is correct
      webSecurity: false,

      nodeIntegration: false,
      contextIsolation: true,  // Security: Allow proper isolation between processes
    },
    autoHideMenuBar: true,
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': null,
      },
    });
  });


  // and load the index.html of the app.

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools (optional for debugging)
  // mainWindow.webContents.openDevTools();
};

// IPC Handler for the file dialog
ipcMain.handle("dialog:openFile", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
  });
  return result.filePaths;
});

ipcMain.handle("dialog:goBack", async () => {
  const mainWindow = BrowserWindow.getAllWindows()[0]; // Get the main window
  mainWindow.focus();  // Bring the main window to the front
  const pdfWindow = BrowserWindow.getFocusedWindow();
  if (pdfWindow) {
    pdfWindow.close(); // Close the PDF window
  }
  return { status: 'back' };
});

ipcMain.handle("dialog:openPDF", async (event, filePath) => {
  const pdfWindow = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });


  pdfWindow.loadURL(`file://${filePath}`);


  return { status: 'success' };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
