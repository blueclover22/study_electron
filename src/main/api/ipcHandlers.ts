import { registerAuthHandlers } from './handlers/authHandlers';

/**
 * 모든 IPC 핸들러를 등록하는 진입점.
 * main.ts에서 앱 초기화 시 한 번 호출됩니다.
 *
 * ─── 새 도메인 API 추가 방법 ───────────────────────────────────────
 *  1. src/main/api/handlers/ 아래 {domain}Handlers.ts 파일 생성
 *  2. registerXxxHandlers() 함수를 구현하고 ipcMain.handle() 등록
 *  3. 아래 setupIpcHandlers()에 registerXxxHandlers() 호출 추가
 *  4. src/preload/preload.ts 에 해당 도메인 브릿지 추가
 *  5. src/renderer/types/electron.d.ts 에 타입 선언 추가
 *  6. src/renderer/api/ 에 서비스 래퍼 파일 추가
 * ──────────────────────────────────────────────────────────────────
 */
export const setupIpcHandlers = (): void => {
  registerAuthHandlers();

  // registerDeviceHandlers();  // 장치 관련 핸들러 (device:getStatus, device:test 등)
  // registerTicketHandlers();  // 발매 관련 핸들러 (ticket:getSaleList, ticket:createSale 등)
  // registerOpenHandlers();    // 개점/마감 관련 핸들러
};
