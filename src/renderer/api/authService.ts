import { LoginRequest, LoginResponse, ApiResponse } from '../types/auth';
import { IpcResponse } from '../types/ipc';

export const authService = {
  /**
   * 로그인 API 호출 (IPC 통신 방식)
   * Renderer -> Preload Bridge -> Main (Node.js) -> Backend
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const result: IpcResponse<ApiResponse<LoginResponse>> =
      await window.electron.auth.login(credentials);

    console.log('[Service] IPC Response:', result);

    // Main 프로세스에서 success: false를 명시적으로 반환한 경우
    if (!result.success) {
      console.log('[Service] Login Failed - Main returned error:', result.error);
      throw new Error(result.error ?? '로그인 중 오류가 발생했습니다.');
    }

    // 성공 케이스 처리
    if (result.data) {
      const { status, info } = result.data;

      // 백엔드 성공 코드 "0000" 체크
      if (status?.code === '0000') {
        console.log('[Service] Login Success - User Info:', info);
        return info;
      }

      console.log('[Service] Login Failed - Invalid Code:', status?.code);
      throw new Error(status?.message || `로그인 실패 (코드: ${status?.code})`);
    }

    // 예상치 못한 응답 구조
    console.log('[Service] Login Failed - Unexpected response structure');
    throw new Error('로그인 중 오류가 발생했습니다.');
  },
};
