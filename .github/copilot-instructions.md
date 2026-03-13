# Electron POS 프로젝트 — 개발 가이드

## 프로젝트 개요
Electron 41 기반 POS 데스크톱 앱. React 19 + TypeScript (렌더러) / Node.js (메인) 이중 계층 아키텍처.

## 기술 스택
- **Frontend**: React 19, TypeScript, Vite 5
- **Desktop**: Electron 41, Electron Forge
- **Backend 통신**: Axios 1.13
- **Package Manager**: pnpm

---

## 프로젝트 구조

### 메인 프로세스 (`src/main/`)
```
src/main/
├── api/
│   ├── handlers/        # 도메인별 IPC 핸들러
│   │   └── {domain}Handlers.ts
│   ├── utils/
│   │   └── ipcErrorHandler.ts   # Axios 에러 → IpcResult 변환
│   ├── axiosInstance.ts         # 백엔드 HTTP 클라이언트 + setAuthToken()
│   └── ipcHandlers.ts           # 모든 핸들러를 등록하는 진입점
└── main.ts             # 앱 생명주기 및 윈도우 관리
```

### 프리로드 스크립트 (`src/preload/`)
```
src/preload/
└── preload.ts          # ContextBridge - window.electron.* 노출
```

### 렌더러 프로세스 (`src/renderer/`)
```
src/renderer/
├── api/                # IPC 호출 래퍼 — 도메인별 파일
├── components/         # 화면 단위 컴포넌트
├── hooks/              # Custom Hooks — 비즈니스 로직 분리
├── types/
│   ├── ipc.ts          # IpcResponse<T> — 모든 IPC 공통 응답 타입
│   ├── {domain}.ts     # 도메인별 요청/응답 타입
│   └── electron.d.ts   # window.electron 전역 타입 선언
├── App.tsx             # 메인 앱 컴포넌트 및 라우팅
└── renderer.tsx        # React 진입점
```

---

## 코드 패턴

### Node.js (메인) — 새 IPC 핸들러 추가
1. `src/main/api/handlers/{domain}Handlers.ts` 생성
2. `ipcMain.handle('domain:action', ...)` 구현
3. 반환: **반드시** `IpcResult.ok()` 또는 `IpcResult.err()`
4. Axios 에러: `ipcErrorHandler(error, 'context')` → `IpcResult.err()` 반환
5. `src/main/api/ipcHandlers.ts`의 `setupIpcHandlers()`에 등록
6. 핸들러 이름: `{도메인}:{동작}` (예: `auth:login`)
7. HTTP 호출: **반드시** `axiosInstance` 사용

### TypeScript (렌더러) — 새 IPC 서비스
- `src/renderer/api/{domain}Service.ts`에 `window.electron.{domain}.{action}()` 호출
- 타입: `src/renderer/types/{domain}.ts` 정의

### 프리로드 스크립트 — 새 도메인 브릿지
1. `src/preload/preload.ts`에 도메인 객체 생성
2. `ipcRenderer.invoke('domain:action', payload)` 등록
3. `contextBridge.exposeInMainWorld()`로 노출

### 타입 선언
`src/renderer/types/electron.d.ts`에 window.electron 타입 추가

### React — 새 화면
1. `src/renderer/components/{Name}.tsx` 생성
2. `App.tsx`의 라우팅 로직에 분기 추가
3. 비즈니스 로직: `hooks/use{Domain}.ts`로 분리

---

## 에러 처리

- **메인 프로세스**: Axios 에러 → `ipcErrorHandler()` → `IpcResult.err()` 반환
- **렌더러 프로세스**: `result.success` 체크 후 `result.error` 표시
- **메시지**: 모든 에러는 **한국어**
- **절대 금지**: 메인에서 예외 던지기 (반드시 `IpcResult.err()` 반환)

---

## 토큰 관리

- **저장 위치**: 메인 프로세스의 `axiosInstance.defaults.headers.common['Authorization']`만 사용
- **설정**: `setAuthToken(token)` 함수로 로그인 후 토큰 설정
- **절대 금지**: 클라이언트(localStorage, sessionStorage)에 토큰 저장

---

## 필수 규칙

| 규칙 | 설명 |
|------|------|
| **README.md 업데이트** | 패키지, 모듈, 프로세스 로직 변경 시 필수 |
| **IPC 핸들러 반환** | 항상 `IpcResult.ok()` 또는 `IpcResult.err()` 명시 |
| **에러 메시지** | **한국어** 작성 |
| **HTTP 호출** | 반드시 `axiosInstance` 사용 |
| **토큰 관리** | 메인 프로세스만 관리 |
| **ContextBridge** | 필요한 메서드만 선택적 노출 |
| **타입 안정성** | 모든 IPC 통신에 TypeScript 타입 정의 |

---

## 금지 사항
❌ 렌더러에서 직접 HTTP 호출 (fetch, axios)
❌ 클라이언트에서 토큰 저장/관리
❌ IPC 핸들러에서 예외 던지기
❌ 프리로드에서 과도한 API 노출
❌ 영어 에러 메시지
❌ 렌더러에서 직접 Node.js 모듈 접근

---

## IPC 흐름도
```
Renderer (React)
    ↓
window.electron.domain.action(payload)
    ↓ (ipcRenderer.invoke)
Preload Script (ContextBridge)
    ↓
Main Process (ipcMain.handle)
    ↓
axiosInstance (HTTP)
    ↓
Main Process (IpcResult)
    ↓ (IpcResponse)
Renderer (React)
```

