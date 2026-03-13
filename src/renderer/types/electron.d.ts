import { LoginRequest, LoginResponse, ApiResponse } from './auth';
import { IpcResponse } from './ipc';

declare global {
  interface Window {
    electron: {
      // ── Auth 도메인 ──────────────────────────────────────────────
      auth: {
        login: (credentials: LoginRequest) => Promise<IpcResponse<ApiResponse<LoginResponse>>>;

        // 추후 추가 예시:
        // logout: () => Promise<IpcResponse>;
        // refreshToken: (token: string) => Promise<IpcResponse<ApiResponse<LoginResponse>>>;
      };

      // ── 추후 도메인 확장 예시 ────────────────────────────────────
      //
      // device: {
      //   getStatus: () => Promise<IpcResponse<DeviceStatus>>;
      //   test: (params: DeviceTestParams) => Promise<IpcResponse<DeviceTestResult>>;
      // };
      //
      // ticket: {
      //   getSaleList: (params: TicketSaleParams) => Promise<IpcResponse<ApiResponse<TicketSale[]>>>;
      //   createSale: (payload: CreateSalePayload) => Promise<IpcResponse<ApiResponse<SaleResult>>>;
      // };
      //
      // open: {
      //   open: (payload: OpenPayload) => Promise<IpcResponse<ApiResponse<OpenResult>>>;
      //   close: (payload: ClosePayload) => Promise<IpcResponse<ApiResponse<CloseResult>>>;
      // };
    };
  }
}

export {};
