import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  auth: {
    login: (credentials: any) => ipcRenderer.invoke('auth:login', credentials),
  },
});
