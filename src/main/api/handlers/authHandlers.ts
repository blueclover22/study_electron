import { ipcMain } from 'electron';
import api, { setAuthToken } from '../axiosInstance';
import { handleAxiosError, IpcResult } from '../utils/ipcErrorHandler';

const LOGIN_URL = '/api/air/posuser/login/';
const DEVICE_ID = 'f067595a067c3e00';

/**
 * Auth 도메인 IPC 핸들러 등록.
 * setupIpcHandlers()에서 호출됩니다.
 *
 * 채널 목록:
 *  - auth:login  : 사용자 로그인
 */
export const registerAuthHandlers = (): void => {
  // ------------------------------------------------------------------
  // auth:login
  // ------------------------------------------------------------------
  ipcMain.handle('auth:login', async (_event, credentials): Promise<IpcResult> => {
    console.log('[Main] auth:login - Attempting login');

    try {
      const response = await api.post(`${LOGIN_URL}${DEVICE_ID}`, credentials);
      console.log('[Main] auth:login - Backend Response:', response.data);

      // 응답 구조 검증
      if (!response.data || typeof response.data !== 'object') {
        console.log('[Main] auth:login - Invalid response structure');
        return { success: false, error: '서버 응답 형식이 올바르지 않습니다.' };
      }

      // info 필드 유효성 검사 (빈 객체/빈 문자열은 실패로 간주)
      const isInfoEmpty =
        !response.data.info ||
        (typeof response.data.info === 'object' &&
          Object.keys(response.data.info).length === 0);

      if (isInfoEmpty) {
        console.log('[Main] auth:login - Empty info field');
        return { success: false, error: '로그인 정보가 올바르지 않습니다.' };
      }

      // 로그인 성공 시 이후 인증 요청에 사용할 토큰 등록
      const tokenValue: string | undefined = response.data.info?.tokenValue;
      if (tokenValue) {
        setAuthToken(tokenValue);
        console.log('[Main] auth:login - Auth token registered');
      }

      console.log('[Main] auth:login - Success');
      return { success: true, data: response.data };
    } catch (error) {
      return handleAxiosError(error, 'auth:login');
    }
  });

  // ------------------------------------------------------------------
  // 추후 추가할 Auth 도메인 핸들러 예시:
  //
  // ipcMain.handle('auth:logout', async (_event): Promise<IpcResult> => {
  //   setAuthToken(null);
  //   return { success: true };
  // });
  //
  // ipcMain.handle('auth:refreshToken', async (_event, token): Promise<IpcResult> => {
  //   const response = await api.post('/api/air/posuser/refresh', { token });
  //   setAuthToken(response.data.info?.tokenValue);
  //   return { success: true, data: response.data };
  // });
  // ------------------------------------------------------------------
};
