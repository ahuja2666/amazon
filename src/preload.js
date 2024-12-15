// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  openPDF: (filePath) => ipcRenderer.invoke('dialog:openPDF', filePath),
  goBack: () => ipcRenderer.invoke('dialog:goBack')
});


