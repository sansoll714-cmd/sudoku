# 그린 스도쿠

Node.js 기반의 웹 스도쿠 게임입니다.  
초록 계열 테마, 좌측 정보 패널 / 우측 게임 보드 레이아웃, 난이도 선택, 힌트 제한, 완료 결과 표시를 포함한 MVP 형태로 구성되어 있습니다.

## 실행 방법

```bash
npm start
```

브라우저에서 아래 주소로 접속합니다.

```text
http://127.0.0.1:3000
```

## 주요 기능

- 쉬움 / 보통 / 어려움 난이도 선택
- 숫자 입력 및 삭제
- 관련 행/열/박스 강조
- 오답 표시
- 힌트 최대 5회 제한
- 타이머 표시
- 완료 시 난이도 / 걸린 시간 / 힌트 사용 횟수 표시

## 프로젝트 구조

```text
sudoku/
├─ docs/
│  └─ PRD.md
├─ public/
│  ├─ css/
│  │  └─ styles.css
│  ├─ js/
│  │  ├─ config/
│  │  │  └─ constants.js
│  │  ├─ data/
│  │  │  └─ puzzles.js
│  │  ├─ game/
│  │  │  ├─ gameManager.js
│  │  │  └─ gameState.js
│  │  ├─ ui/
│  │  │  ├─ boardView.js
│  │  │  ├─ difficultyMenu.js
│  │  │  └─ elements.js
│  │  ├─ utils/
│  │  │  └─ helpers.js
│  │  └─ main.js
│  └─ index.html
├─ package.json
├─ server.js
└─ README.md
```

## 코드 구조 설명

- `server.js`
  - 정적 파일을 서빙하는 Node.js HTTP 서버입니다.
- `public/index.html`
  - 앱의 기본 마크업입니다.
- `public/css/styles.css`
  - 전체 레이아웃과 테마 스타일을 담당합니다.
- `public/js/data`
  - 난이도별 퍼즐 데이터를 관리합니다.
- `public/js/config`
  - 힌트 횟수, 기본 난이도 같은 상수를 관리합니다.
- `public/js/utils`
  - 복제, 시간 포맷 같은 공통 유틸을 제공합니다.
- `public/js/ui`
  - 보드 렌더링, DOM 참조, 난이도 메뉴 같은 UI 계층입니다.
- `public/js/game`
  - 게임 상태 생성/초기화와 실제 플레이 로직을 담당합니다.
- `public/js/main.js`
  - 앱 진입점입니다.

## 문서

- PRD: [docs/PRD.md](docs/PRD.md)

## 메모

- 현재는 외부 라이브러리 없이 동작하는 구조입니다.
- 정적 자산이 더 늘어나면 `public/assets/` 폴더를 추가해 확장하기 좋습니다.
