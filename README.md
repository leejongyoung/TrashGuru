# ♻️ 쓰레기 박사 (TrashGuru)

> **"분리배출의 모든 것, 쓰레기 박사가 해결해 드립니다."**
>
> AI 기반 폐기물 인식 및 분리배출 가이드, 대리수거 매칭, 그리고 환경 커뮤니티 플랫폼

![Project Status](https://img.shields.io/badge/Status-Prototype-lightgrey)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 프로젝트 개요 (Overview)

**쓰레기 박사**는 사용자가 폐기물 사진을 찍으면 AI가 이를 분석하여 올바른 분리배출 방법을 알려주는 서비스입니다. 또한, 분리배출이 어려운 사용자를 위한 **대리수거 매칭**, 환경 보호 활동을 장려하는 **챌린지 및 커뮤니티**, **자원봉사 모집** 기능을 통해 지속 가능한 환경 생태계를 만들어갑니다.

* **팀명:** 분반쓰
* **팀원:** 강건희, 송수연, 염가영, 이종영
* **개발 기간:** '25. 10.~'25. 12.

## 📚 프로젝트 문서 (Documentation)

프로젝트의 기획 의도, 설계, 디자인 등 상세 문서는 아래 링크를 통해 확인할 수 있습니다.

### 📂 기획 및 설계
* **[01. 시스템 아키텍처 (System Architecture)](/docs/01-SystemArchitecture/README.md)**
    * 서비스 기능 구조도 및 계층별 설계
    * 기능(Functional) 및 비기능(Non-Functional) 요구사항 명세서
* **[02. 유저 플로우 및 유스케이스 (User Flow & Use Cases)](/docs/02-UserFlowDiagram-UseCases/README.md)**
    * 주요 기능별(로그인, AI 인식, 대리수거 등) 순서도(Flow Chart)
    * 상세 유즈케이스 명세서 (Actor, 시나리오 포함)

### 🎨 디자인 (UI/UX)
* **[03. 스토리보드 스케치 (Storyboard Sketch)](/docs/03-StoryBoard-Sketch/README.md)**
    * 초기 화면 설계 및 UI 구성요소 명세
    * > **Note:** 해당 문서는 초기 기획 단계의 **초안 스케치**를 기반으로 작성되었으며, 구체적인 디자인 가이드라인은 포함되지 않았습니다.
* **[04. Figma 로컬 실행 가이드 (Setup Guide)](/docs/04-Figma-to-React-Setup/README.md)**
    * Figma Export 파일을 React(Vite) 프로젝트에서 실행하는 방법

### 📝 프로젝트 관리 및 결과 (Project Management & Outcomes)
* **[05. 프로젝트 타임라인 (WBS)](/docs/05-Project-Timeline(WBS)/index.html)**
    * 프로젝트 일정 및 작업 분할 구조
* **[06. 최종 완료 보고서 (Final Completion Report)](/docs/06-Final-Completion-Report/Final-Completion-Report.pdf)**
    * 프로젝트 최종 결과 보고서
* **[07. 최종 발표 평가표 (Final Presentation Evaluation)](/docs/07-Final-Presentation-Comments/Final-Presentation-Comments.pdf)**
    * 최종 발표 평가표 및 피드백

### 🎬 시연 영상 (Demonstration Videos)
* **[로그인 및 메인 기능 시연](/docs/08-Videos/dr_trash_login.mp4)**
    * AI 폐기물 인식 애플리케이션의 로그인 및 주요 기능 시연
* **[재활용품 인식 시연 (유리병)](/docs/08-Videos/recycling_recognition_glass_bottle.mp4)**
    * AI 기반 재활용품 인식 기능 (유리병) 시연
* **[일반 쓰레기 인식 시연 (유리병)](/docs/08-Videos/trash_recognition_glass_bottle.mp4)**
    * AI 기반 일반 쓰레기 인식 기능 (유리병) 시연


## ✨ 주요 기능 (Key Features)

### 1. 📷 AI 기반 폐기물 인식
* 카메라로 쓰레기를 촬영하면 AI(YOLO 등)가 품목을 자동 분석합니다.
* 인식된 재질에 따른 맞춤형 분리배출 가이드를 제공합니다.
* GPS 기반으로 내 지역(행정동)의 배출 규정을 자동으로 매핑합니다.

### 2. 🚛 대리수거 매칭 서비스
* 대형 폐기물이나 직접 배출이 어려운 경우 '대리수거'를 요청할 수 있습니다.
* 인근 수거자와 매칭되며, 수거 완료 시 포인트 보상을 지급합니다.

### 3. 🌱 커뮤니티 & 챌린지
* 분리배출 인증샷을 올리고 포인트를 적립받습니다.
* '플라스틱 줄이기' 등 챌린지에 참여하고 랭킹을 확인할 수 있습니다.

### 4. 🤝 자원봉사 모집
* 지역 기반의 플로깅(Plogging) 및 환경 봉사 활동을 모집하고 참여할 수 있습니다.

## 🛠 기술 스택 (Tech Stack)

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### AI & Backend (Planned)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![YOLO](https://img.shields.io/badge/YOLO-Object_Detection-FF9900?style=for-the-badge)

### Design
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

## 🚀 시작하기 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하려면 아래 절차를 따르세요.

``` bash
# 1. 저장소 클론 (Clone Repository)
git clone [https://github.com/username/trash-guru-app.git](https://github.com/leejongyoung/TrashGuru.git ./trash-guru-app)

# 2. 프로젝트 폴더로 이동
cd trash-guru-app

# 3. 의존성 설치 (Install Dependencies)
npm install

# 4. 개발 서버 실행 (Run Dev Server)
npm run dev
```

## 📬 문의 (Contact)
프로젝트에 대한 문의사항은 이슈(Issue)를 등록해 주세요.