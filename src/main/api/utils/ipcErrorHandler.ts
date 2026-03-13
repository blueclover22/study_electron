import { AxiosError } from 'axios';

/**
 * IPC 통신의 공통 응답 타입 (Main Process 측)
 */
export interface IpcResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Axios 에러를 IpcResult 형태로 변환하는 공통 에러 핸들러.
 * 모든 도메인 핸들러에서 재사용합니다.
 *
 * @param error  catch 블록에서 잡힌 에러 객체
 * @param context 로그에 표시할 핸들러 식별자 (예: 'auth:login')
 */
export const handleAxiosError = (error: unknown, context: string): IpcResult => {
  console.error(`[Main] ${context} Error:`, error);

  if (error instanceof AxiosError) {
    // 서버 연결 불가 (서버 꺼짐, 네트워크 단절 등)
    const isServerUnreachable =
      error.code === 'ECONNREFUSED' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error' ||
      (error.request !== undefined && error.response === undefined);

    if (isServerUnreachable) {
      console.log(`[Main] ${context} - Server Unreachable:`, error.code);
      return {
        success: false,
        error: '서버에 연결할 수 없습니다. 서버 상태를 확인해주세요.',
      };
    }

    // HTTP 오류 응답 (4xx, 5xx)
    if (error.response) {
      const statusCode = error.response.status;
      const serverMessage = (error.response.data as Record<string, any>)?.status?.message;
      console.log(`[Main] ${context} - HTTP Error:`, statusCode, serverMessage);
      return {
        success: false,
        error: serverMessage || `서버 오류가 발생했습니다. (HTTP ${statusCode})`,
      };
    }
  }

  // 예상치 못한 기타 오류
  const errorMessage =
    error instanceof Error
      ? error.message
      : `${context} 중 알 수 없는 오류가 발생했습니다.`;
  console.log(`[Main] ${context} - Unknown Error:`, errorMessage);
  return { success: false, error: errorMessage };
};
