/**
 * IPC 통신의 공통 응답 타입 (Renderer Process 측).
 * Main Process의 IpcResult와 동일한 형태입니다.
 *
 * @template T  성공 시 data 필드의 타입
 */
export interface IpcResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
