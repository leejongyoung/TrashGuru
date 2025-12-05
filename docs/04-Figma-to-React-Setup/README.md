# Figma Export React 프로젝트 로컬 실행 가이드

Figma(또는 Figma Make 등)에서 내보낸 React + TypeScript 파일들을 로컬 환경(Vite)에서 실행하기 위한 설정 매뉴얼입니다.

## 1. 사전 준비
Node.js 설치 확인: 터미널에서 node -v 입력 (v18 이상 권장, 이슈 발생 시 v20/v22 LTS 사용)

## 2. 프로젝트 생성 (Vite)
가장 먼저 Vite를 사용하여 TypeScript 기반의 React 프로젝트를 생성합니다.

``` bash
# 프로젝트 생성 (my-app은 원하는 폴더명으로 변경)
npm create vite@latest my-app -- --template react-ts

# 폴더 이동
cd my-app

# 기본 패키지 설치
npm install
```

## 3. Figma 파일 이관 (중요)
다운로드 받은 파일 구조를 Vite 프로젝트 구조(src 폴더)에 맞게 배치합니다.

1. 프로젝트의 /src 폴더를 엽니다.

2. 기존 파일 삭제: App.tsx, App.css, index.css, assets 폴더를 삭제합니다. (단, main.tsx, vite-env.d.ts는 유지)

3. 파일 복사: Figma에서 다운로드한 파일들을 /src 안으로 넣습니다.

- /src/components
- /src/styles (주의: 반드시 src 폴더 안에 있어야 함)
- /src/utils (있다면)
- /src/App.tsx

## 4. 라이브러리 설치
Figma 코드에서 사용하는 아이콘 라이브러리와 스타일링 도구(Tailwind CSS v4)를 설치합니다.

> 주의: Tailwind CSS v4(베타)는 현재 Vite v6 환경에서 가장 안정적입니다. 설치 중 의존성 에러가 발생하면 --force를 사용하거나 package.json에서 vite 버전을 "^6.0.0"으로 맞추세요.

``` bash
# 1. 아이콘 라이브러리 설치 (필수)
npm install lucide-react

# 2. Tailwind CSS v4 및 Vite 플러그인 설치
npm install tailwindcss@next @tailwindcss/vite@next
```

## 5. 설정 파일 수정
1. `vite.config.ts` 설정

Tailwind 플러그인을 Vite에 연결합니다.

``` typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 추가

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 추가
  ],
})
```

2. `src/styles/globals.css` 수정

Figma에서 가져온 CSS 파일 최상단에 반드시 Tailwind 호출 구문을 추가해야 합니다.

``` typescript
@import "tailwindcss"; /* 👈 이 줄을 파일 맨 윗줄에 반드시 추가 */

@custom-variant dark (&:is(.dark *)); 

/* 이후 기존 스타일 코드... */
:root { 
  ... 
```

3. `src/main.tsx` 수정

앱의 진입점에서 스타일 파일을 올바르게 불러오도록 수정합니다.

``` typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css' // 👈 경로 확인! (기존 index.css 대신 사용)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 6. 실행 및 트러블슈팅
실행

``` bash
npm run dev
```

## 자주 발생하는 오류 해결

1. `Failed to resolve import ... globals.css`
- 원인: styles 폴더가 src 바깥에 있거나, 파일명이 다름.
- 해결: styles 폴더를 src 폴더 안으로 이동.

2. `Cannot convert undefined or null to object (Vite 에러)`
- 원인: Tailwind v4와 Vite 버전 호환성 문제.
- 해결: package.json에서 "vite": "^6.0.0"으로 수정 후 `rm -rf node_modules package-lock.json` -> `npm install` 진행.

3. lucide-react 관련 Module not found
- 원인: 패키지 미설치.
- 해결: `npm install lucide-react` (혹은 에러 메시지에 뜬 패키지명 설치).