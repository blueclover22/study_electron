import { ipcMain } from 'electron';
import api from './axiosInstance';
import { AxiosError } from 'axios';

export const setupIpcHandlers = () => {
  // 로그인 요청 핸들러
  ipcMain.handle('auth:login', async (_event, credentials) => {
    const loginUrl = "/api/air/posuser/login/";
    const deviceId = "f067595a067c3e00";

    try {
      const response = await api.post(`${loginUrl}${deviceId}`, credentials);

      console.log('[Main] Backend Response:', response.data);

      // 응답 데이터 구조 검증
      if (!response.data || typeof response.data !== 'object') {
        console.log('[Main] Login Failed - Invalid response structure');
        return { success: false, error: '서버 응답 형식이 올바르지 않습니다.' };
      }

      // 백엔드 응답에서 info 필드 확인 (빈 문자열 또는 빈 객체면 실패)
      const isInfoEmpty = !response.data.info ||
                          (typeof response.data.info === 'object' && Object.keys(response.data.info).length === 0);

      if (isInfoEmpty) {
        const errorMessage = "로그인 정보가 올바르지 않습니다.";
        console.log('[Main] Login Failed - Empty Info:', errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }

      console.log('[Main] Login Success');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('[Main] Login Error:', error);

      if (error instanceof AxiosError) {
        // 서버 연결 불가 (서버가 꺼져있거나 네트워크 문제)
        const isServerUnreachable =
          error.code === 'ECONNREFUSED' ||
          error.code === 'ECONNRESET' ||
          error.code === 'ETIMEDOUT' ||
          error.code === 'ENOTFOUND' ||
          error.code === 'ERR_NETWORK' ||
          error.message === 'Network Error' ||
          (error.request !== undefined && error.response === undefined);

        if (isServerUnreachable) {
          console.log('[Main] Login Failed - Server Unreachable:', error.code);
          return {
            success: false,
            error: '서버에 연결할 수 없습니다. 서버 상태를 확인해주세요.'
          };
        }

        // HTTP 오류 응답 (4xx, 5xx)
        if (error.response) {
          const statusCode = error.response.status;
          const serverMessage = (error.response.data as any)?.status?.message;
          console.log('[Main] Login Failed - HTTP Error:', statusCode, serverMessage);
          return {
            success: false,
            error: serverMessage || `서버 오류가 발생했습니다. (HTTP ${statusCode})`
          };
        }
      }

      // 그 외 예상치 못한 오류
      const errorMessage = error instanceof Error ? error.message : '로그인 중 알 수 없는 오류가 발생했습니다.';
      console.log('[Main] Login Failed - Unknown Error:', errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  });

  // 기타 필요한 API 핸들러들을 여기에 추가할 수 있습니다.
};
