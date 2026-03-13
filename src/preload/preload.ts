import { contextBridge, ipcRenderer } from 'electron';
import { LoginRequest } from '../renderer/types/auth';

// ─── Auth 도메인 브릿지 ────────────────────────────────────────────
// Renderer에서 window.electron.auth.* 로 접근합니다.
const authBridge = {
  login: (credentials: LoginRequest) => ipcRenderer.invoke('auth:login', credentials),

  // 추후 추가 예시:
  // logout: () => ipcRenderer.invoke('auth:logout'),
  // refreshToken: (token: string) => ipcRenderer.invoke('auth:refreshToken', token),
};

// ─── 추후 도메인 브릿지 추가 예시 ─────────────────────────────────
//
// import { DeviceTestParams } from '../renderer/types/device';
//
// const deviceBridge = {
//   getStatus: () => ipcRenderer.invoke('device:getStatus'),
//   test: (params: DeviceTestParams) => ipcRenderer.invoke('device:test', params),
// };
//
// const ticketBridge = {
//   getSaleList: (params: unknown) => ipcRenderer.invoke('ticket:getSaleList', params),
//   createSale: (payload: unknown) => ipcRenderer.invoke('ticket:createSale', payload),
// };
//
// const openBridge = {
//   open: (payload: unknown) => ipcRenderer.invoke('open:open', payload),
//   close: (payload: unknown) => ipcRenderer.invoke('open:close', payload),
// };
// ──────────────────────────────────────────────────────────────────

contextBridge.exposeInMainWorld('electron', {
  auth: authBridge,
  // device: deviceBridge,
  // ticket: ticketBridge,
  // open: openBridge,
});
