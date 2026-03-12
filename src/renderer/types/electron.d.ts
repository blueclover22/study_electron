import { LoginRequest, LoginResponse, ApiResponse } from './auth';

declare global {
  interface Window {
    electron: {
      auth: {
        login: (credentials: LoginRequest) => Promise<{ success: boolean; data?: ApiResponse<LoginResponse>; error?: string }>;
      };
    };
  }
}

export {};
