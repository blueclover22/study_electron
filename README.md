# Electron POS Test Project


---

## 🛠 기술 스택 및 라이브러리

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Frontend Framework**: [React 19](https://react.dev/)
- **Desktop Framework**: [Electron 41](https://www.electronjs.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Bundler/Packager**: [Electron Forge](https://www.electronforge.io/)

---

## 📂 프로젝트 구조

Electron의 보안 및 성능 모범 사례에 따라 메인, 렌더러, 프리로드 프로세스가 분리된 구조를 가지고 있습니다.

```text
electron_test/
├── src/
│   ├── main/           # 메인 프로세스 (Node.js 환경)
│   │   └── main.ts     # 앱 생명주기 및 브라우저 윈도우 관리
│   ├── preload/        # 프리로드 스크립트 (Main과 Renderer 사이의 가교)
│   │   └── preload.ts  # 안전한 IPC 통신 설정
│   └── renderer/       # 렌더러 프로세스 (React UI 환경)
│       ├── components/ # React 컴포넌트 및 스타일 (Login, MainMenu 등)
│       ├── App.tsx     # 메인 앱 컴포넌트 및 라우팅 로직
│       ├── renderer.tsx # React 진입점 (DOM 렌더링)
│       └── ...         # CSS 및 기타 에셋
├── forge.config.ts     # Electron Forge 설정 파일
├── index.html          # 메인 HTML 템플릿
├── package.json        # 의존성 및 스크립트 정의
└── tsconfig.json       # TypeScript 설정
```

---

## 💻 개발 환경 세팅

### 1. Node.js 설치
- [nodejs.org](https://nodejs.org/)에서 LTS 버전을 설치합니다.
- 설치 확인: `node -v`

### 2. IDE 세팅 (VS Code / Cursor)
- 별도의 전용 확장 없이 기존 JavaScript/TypeScript 확장으로 개발 가능합니다.

### 3. pnpm 사용 시 추가 설정 (.npmrc)
pnpm은 심볼릭 링크 방식으로 패키지를 관리하기 때문에 electron-forge가 의존성 탐색에 실패할 수 있습니다. 프로젝트 루트에 `.npmrc` 파일이 아래 설정을 포함하고 있는지 확인하세요.
```text
node-linker=hoisted
```

---

## 🚀 실행 및 빌드 명령어 (pnpm)

### 의존성 설치
```bash
pnpm install
```

### 개발 모드 실행
Vite 개발 서버와 함께 Electron 앱을 실행합니다. (Hot Reload 지원)
```bash
pnpm dev
# 또는
pnpm start
```

### 애플리케이션 패키징
현재 플랫폼에 맞는 실행 파일만 생성합니다. (결과물: `out/`)
```bash
pnpm package
```

### 배포용 빌드 (Make)
설치 프로그램(Installer)을 생성합니다. (결과물: `out/make/`)
- **Windows**: `.exe` (Squirrel 인스톨러)
- **macOS**: `.dmg`, `.zip`
```bash
pnpm make
```

---

## 🎯 빌드 타겟 옵션 (고급)

기본적으로 현재 머신의 플랫폼과 아키텍처로 빌드됩니다. 더 세밀한 타겟 설정이 필요한 경우 `electron-builder`를 활용할 수 있습니다.

### Windows 빌드 타겟 예시
```bash
# x64 (기본값)
pnpm electron-builder --win --x64
# ia32 (32비트)
pnpm electron-builder --win --ia32
# ARM64
pnpm electron-builder --win --arm64
```

### macOS 빌드 타겟 예시
```bash
# Apple Silicon (M1 이후)
pnpm electron-builder --mac --arm64
# Intel Mac
pnpm electron-builder --mac --x64
# Universal Binary (Apple Silicon + Intel 동시 지원)
pnpm electron-builder --mac --universal
```

> **참고**: 플랫폼별 빌드 제약으로 인해 기본적으로 현재 OS의 결과물만 생성 가능합니다. (Windows -> Windows, macOS -> macOS)

---

## 스프링부트 연동 시 구조

```
┌─────────────────────────────────────────────────────┐
│                  Electron App                        │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │         Renderer Process (UI)               │    │
│  │         React / Vue / 기존 웹 UI            │    │
│  │                                             │    │
│  │  fetch() → Spring Boot (온라인)             │    │
│  │  ipcRenderer.invoke() → Main Process        │    │
│  └──────────────┬──────────────────────────────┘    │
│                 │ IPC (contextBridge)                │
│  ┌──────────────▼──────────────────────────────┐    │
│  │         Main Process (Node.js)              │    │
│  │                                             │    │
│  │  - 프린터 제어 (node-thermal-printer)       │    │
│  │  - 시리얼 통신 (serialport)                 │    │
│  │  - 로컬 DB (better-sqlite3)                 │    │
│  │  - 오프라인 sync queue                      │    │
│  │  - 자동 업데이트 (electron-updater)         │    │
│  └──────────────┬──────────────────────────────┘    │
└─────────────────┼───────────────────────────────────┘
                  │ HTTP
       ┌──────────▼──────────┐
       │    Spring Boot      │
       │  - 메뉴/발매 관리   │
       │  - 매출/현황        │
       │  - 멀티 포스 동기화  │
       └──────────┬──────────┘
                  │
             ┌────▼────┐
             │   DB    │
             └─────────┘

```
