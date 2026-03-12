import { ipcMain } from 'electron';
import api from './axiosInstance';

export const setupIpcHandlers = () => {
  // 로그인 요청 핸들러
  ipcMain.handle('auth:login', async (_event, credentials) => {
    const loginUrl = "/api/air/posuser/login/";
    const deviceId = "f067595a067c3e00";

    try {
      const response = await api.post(`${loginUrl}${deviceId}`, credentials);

      console.log('[Main] Backend Response:', response.data);

      // 백엔드 응답에서 info 필드 확인 (빈 문자열 또는 빈 객체면 실패)
      const isInfoEmpty = !response.data.info ||
                          (typeof response.data.info === 'object' && Object.keys(response.data.info).length === 0);
      
      if (isInfoEmpty) {
        // 백엔드 메시지는 깨질 수 있으므로 고정 메시지 사용
        const errorMessage = "로그인 정보가 올바르지 않습니다.";
        console.log('[Main] Login Failed - Empty Info:', errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }

      console.log('[Main] Login Success');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('[Main] Login Error:', error);
      // 모든 에러 메시지를 고정 메시지로 통일 (백엔드 메시지 깨짐 방지)
      const errorMessage = '로그인 정보가 올바르지 않습니다.';
      return {
        success: false,
        error: errorMessage
      };
    }
  });

  // 기타 필요한 API 핸들러들을 여기에 추가할 수 있습니다.
};
