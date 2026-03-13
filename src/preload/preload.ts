import { contextBridge, ipcRenderer } from 'electron';
import { LoginRequest } from '../renderer/types/auth';

contextBridge.exposeInMainWorld('electron', {
  auth: {
    login: (credentials: LoginRequest) => ipcRenderer.invoke('auth:login', credentials),
  },
});
