import { LoginRequest, LoginResponse, ApiResponse } from '../types/auth';

// Preload 스크립트에서 노출한 window.electron 타입을 위한 선언
declare global {
  interface Window {
    electron: {
      auth: {
        login: (credentials: LoginRequest) => Promise<{ success: boolean; data?: ApiResponse<LoginResponse>; error?: string }>;
      };
    };
  }
}

export const authService = {
  /**
   * 로그인 API 호출 (IPC 통신 방식)
   * Renderer -> Main (Node.js) -> Backend
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const result = await window.electron.auth.login(credentials);

    console.log('[Service] IPC Response:', result);

    // 메인 프로세스에서 success: false를 명시적으로 반환한 경우
    if (result.success === false) {
      console.log('[Service] Login Failed - Main returned error:', result.error);
      console.log('fail');
      throw new Error(result.error || '로그인 중 오류가 발생했습니다.');
    }

    // 성공 케이스만 처리
    if (result.success && result.data) {
      const { status, info } = result.data;

      // 백엔드 성공 코드 "0000" 체크
      if (status && status.code === '0000') {
        console.log('[Service] Login Success - User Info:', info);
        console.log('success');
        return info;
      }
      
      console.log('[Service] Login Failed - Invalid Code:', status?.code);
      console.log('fail');
      throw new Error(status?.message || `로그인 실패 (코드: ${status?.code})`);
    }

    // 예상치 못한 응답 구조
    console.log('[Service] Login Failed - Unexpected response structure');
    console.log('fail');
    throw new Error('로그인 중 오류가 발생했습니다.');
  },
};
