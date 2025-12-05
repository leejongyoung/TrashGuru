# 분리수거 서비스 유저 플로우 및 유스케이스 정의서 (User Flow & Use Cases)

[🔗 웹으로 보기](./index.html)

## 1. 개요
분리수거 서비스는 **사용자(User)** 를 주 액터로 하며, 보조 액터인 디바이스(카메라, GPS), AI 인식 시스템, 포인트/결제 시스템, 커뮤니티/봉사활동 DB 등이 상호작용하여 이루어집니다. 서비스는 폐기물 인식, 분리배출 가이드 제공, 미션 인증, 대리수거 매칭, 커뮤니티, 상점, 자원봉사 모집 등으로 구성됩니다.

## 2. 주요 기능별 유저 플로우 및 유스케이스

### 1. 분리수거 서비스 모델

![그림1 분리수거 서비스 모델](./images/IMAGE_001.png)

### 2. 로그인 및 회원관리

![그림2 로그인 및 회원관리](./images/IMAGE_002.png)

<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 8px; width: 20%;">항목</th>
      <th style="padding: 8px;">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; font-weight: bold;">개요</td>
      <td style="padding: 8px;">사용자가 분리수거 서비스를 이용하기 위해 로그인하거나 회원가입을 수행한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">관련 액터</td>
      <td style="padding: 8px;">
        <strong>주 액터:</strong> 사용자<br>
        <strong>보조 액터:</strong> 계정 DB, 인증 이메일 서버
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">우선 순위</td>
      <td style="padding: 8px;">중요도: 중 / 난이도: 하</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">선행 조건</td>
      <td style="padding: 8px;">분리수거 서비스 App을 실행시켜야 한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">후행 조건</td>
      <td style="padding: 8px;">로그인 후 분리수거 서비스를 이용한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">기본 시나리오</td>
      <td style="padding: 8px;">
        <ol>
          <li>사용자가 로그인 메뉴를 선택한다.</li>
          <li>ID(이메일)와 비밀번호를 입력한다.</li>
          <li>로그인한다.</li>
          <li><strong>(회원가입 시)</strong>
            <ul>
              <li>ID와 PW가 없을 경우 회원가입을 선택한다.</li>
              <li>개인정보동의를 선택하고 확인버튼을 누른다.</li>
              <li>ID와 PW 중복확인을 통해 최종 입력한다.</li>
              <li>개인정보(이름, 주소 등)를 입력하고 확인버튼을 누른다.</li>
              <li>회원가입을 완료한다.</li>
              <li>ID와 PW를 입력하고 로그인 한다.</li>
            </ul>
          </li>
        </ol>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">대안 시나리오</td>
      <td style="padding: 8px;">2. ID와 PW 정보가 일치하지 않는 경우 ID 및 PW 찾기를 선택하여 인증을 통해 정보를 확인한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">비기능적 요구사항</td>
      <td style="padding: 8px;">
        1. 로그인 실패 사유를 안내해야 한다.<br>
        2. 사용자 정보는 안전하게 저장되어야 한다.
      </td>
    </tr>
  </tbody>
</table>

### 3. 폐기물 촬영 · AI 인식

![그림3 폐기물 촬영 · AI 인식](./images/IMAGE_003.png)

<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 8px; width: 20%;">항목</th>
      <th style="padding: 8px;">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; font-weight: bold;">개요</td>
      <td style="padding: 8px;">사용자가 폐기물을 촬영하여 AI 인식된 품목 정보와 매핑된 재질 정보를 확인한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">관련 액터</td>
      <td style="padding: 8px;">
        <strong>주 액터:</strong> 사용자<br>
        <strong>보조 액터:</strong> 디바이스 카메라(CameraX), AI 인식 서버(FastAPI + YOLO)
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">우선 순위</td>
      <td style="padding: 8px;">중요도: 상 / 난이도: 상</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">선행 조건</td>
      <td style="padding: 8px;">로그인이 되어 있어야 하며, 카메라 권한이 허용되어 있어야 한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">후행 조건</td>
      <td style="padding: 8px;">폐기물 인식 결과가 제공된다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">기본 시나리오</td>
      <td style="padding: 8px;">
        <ol>
          <li>사용자가 App 내의 촬영 버튼을 클릭한다.</li>
          <li>카메라가 실행되고 사용자가 폐기물을 촬영한다.</li>
          <li>시스템은 촬영된 이미지를 AI 인식 서버로 전송한다.</li>
          <li>AI 인식 서버는 폐기물 품목을 분석하고 품목명과 신뢰도(%)를 반환한다.</li>
          <li>시스템은 품목 코드를 품목·재질 매핑 DB와 연계하여 대표 재질 정보를 조회하고, 품목명·재질·신뢰도를 사용자에게 표시한다.</li>
          <li>사용자는 제공된 정보를 기반으로 배출 가이드를 확인한다.</li>
        </ol>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">대안 시나리오</td>
      <td style="padding: 8px;">
        3.1 인식 실패 또는 신뢰도 기준 미달 시<br>
        - AI 인식 결과가 없거나 신뢰도가 기준 미만인 경우 시스템은 "정확한 인식 불가" 메시지를 띄운다.<br>
        - 시스템은 수동 선택 화면(대분류, 중분류)을 제공한다.<br>
        - 사용자가 품목을 직접 선택하면, 시스템은 매핑 DB에서 정보를 조회한 후 배출 가이드를 제공한다.<br>
        3.2 네트워크/서버 오류 시 오류 메시지를 표시하고, 자동으로 수동 선택 흐름으로 이동한다.
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">비기능적 요구사항</td>
      <td style="padding: 8px;">1. 촬영 정보와 시스템 인식 정보는 높은 정확도로 일치해야 한다.</td>
    </tr>
  </tbody>
</table>

### 4. 가이드 및 배출규정 매핑

![그림4 가이드 및 배출규정 매핑](./images/IMAGE_004.png)

<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 8px; width: 20%;">항목</th>
      <th style="padding: 8px;">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; font-weight: bold;">개요</td>
      <td style="padding: 8px;">사용자가 지역별 분리배출 규정을 조회한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">관련 액터</td>
      <td style="padding: 8px;">
        <strong>주 액터:</strong> 사용자<br>
        <strong>보조 액터:</strong> GPS, 지역 규정 DB
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">우선 순위</td>
      <td style="padding: 8px;">중요도: 중 / 난이도: 중</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">선행 조건</td>
      <td style="padding: 8px;">위치 정보 제공 동의를 해야 한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">후행 조건</td>
      <td style="padding: 8px;">배출 가이드가 제공된다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">기본 시나리오</td>
      <td style="padding: 8px;">
        <ol>
          <li>사용자가 '분리수거 안내' 버튼을 클릭한다.</li>
          <li>위치 사용 권한 팝업이 표시된다.</li>
          <li>사용자가 위치기반서비스 활용에 동의한다.</li>
          <li>사용자 위치(시/군/구)에 해당하는 분리수거 규정이 로딩된다.</li>
          <li>시스템은 해당 규정에 따라 단계별 분리수거 가이드를 제공한다.</li>
        </ol>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">대안 시나리오</td>
      <td style="padding: 8px;">
        3. 위치 권한 거부 시 지역 수동 선택 화면을 제공한다.<br>
        4. 지역 DB에 규정이 없을 경우 국가 표준 가이드를 제공한다.
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">비기능적 요구사항</td>
      <td style="padding: 8px;">1. 규정 정보는 최신성(지자체 업데이트)을 유지해야 한다.</td>
    </tr>
  </tbody>
</table>

### 5. 인증 및 포인트 적립

![그림5 인증 및 포인트 적립](./images/IMAGE_005.png)

<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 8px; width: 20%;">항목</th>
      <th style="padding: 8px;">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; font-weight: bold;">개요</td>
      <td style="padding: 8px;">사용자가 미션 완료(인증샷 업로드 또는 걸음 수 데이터)를 통해 포인트를 적립한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">관련 액터</td>
      <td style="padding: 8px;">
        <strong>주 액터:</strong> 사용자<br>
        <strong>보조 액터:</strong> 포인트 시스템, 인증 검증 시스템, 걸음 수 연동 모듈
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">우선 순위</td>
      <td style="padding: 8px;">중요도: 중 / 난이도: 중</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">선행 조건</td>
      <td style="padding: 8px;">로그인이 되어 있어야 한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">후행 조건</td>
      <td style="padding: 8px;">포인트 적립 내역이 저장된다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">기본 시나리오</td>
      <td style="padding: 8px;">
        <ol>
          <li>사용자가 미션 메뉴를 선택한다.</li>
          <li>사용자가 인증샷을 촬영하거나 업로드한다.</li>
          <li>시스템이 인증샷의 유효성을 검증한다.</li>
          <li>검증을 통과하면 포인트가 적립된다.</li>
          <li>사용자가 적립된 포인트 내역을 확인한다.</li>
          <li>시스템이 연동된 걸음 수 데이터를 확인한다.</li>
          <li>사용자 걸음 수 기준에 따라 추가 포인트가 적립된다.</li>
          <li>사용자가 걸음 수 기반 추가 포인트 적립 여부를 확인한다.</li>
        </ol>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">대안 시나리오</td>
      <td style="padding: 8px;">
        3. 인증샷이 중복·조작으로 의심될 경우 업로드가 제한되고, 재시도 요청한다.<br>
        7.1 걸음 수 연동 데이터가 비정상일 경우 추가 포인트는 적립되지 않는다.<br>
        7.2 걸음 수 데이터 업데이트 실패 시 기본 포인트만 적립된다.
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">비기능적 요구사항</td>
      <td style="padding: 8px;">
        1. 포인트 적립은 정확하게 반영되어야 한다.<br>
        2. 인증샷 검증은 신속하게 처리되어야 한다.<br>
        3. 걸음 수 데이터는 실시간으로 동기화되어야 한다.<br>
        4. 부정행위(중복 사진·위치 조작)는 탐지되어야 한다.
      </td>
    </tr>
  </tbody>
</table>

### 6. 대리수거 매칭

![그림6 대리수거 매칭](./images/IMAGE_006.png)

<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 8px; width: 20%;">항목</th>
      <th style="padding: 8px;">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; font-weight: bold;">개요</td>
      <td style="padding: 8px;">대리수거 요청자와 승낙자를 매칭시켜 대리 분리수거를 할 수 있도록 한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">관련 액터</td>
      <td style="padding: 8px;">
        <strong>주 액터:</strong> 사용자(요청자, 수거자)<br>
        <strong>보조 액터:</strong> 결제 시스템, 수거자 인증 시스템
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">우선 순위</td>
      <td style="padding: 8px;">중요도: 상 / 난이도: 상</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">선행 조건</td>
      <td style="padding: 8px;">로그인 상태이며 결제수단이 등록되어 있어야 한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">후행 조건</td>
      <td style="padding: 8px;">요청·수거·보상 내역이 저장된다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">기본 시나리오</td>
      <td style="padding: 8px;">
        <ol>
          <li>요청자가 App 내의 대리수거 버튼을 클릭한다.</li>
          <li>시스템은 대리수거 요청 정보를 등록하고, 요청 정보는 요청 목록에 추가된다.</li>
          <li>수거자는 요청 목록 화면에서 서비스 가능한 요청들을 확인한다.</li>
          <li>수거자는 원하는 요청을 선택하여 수거 승낙 버튼을 누른다.</li>
          <li>요청자는 수거 승낙 알림을 받고, 집 앞에 대리수거 물품을 배치한다.</li>
          <li>수거자는 요청자 집 앞에서 물품을 회수한다.</li>
          <li>수거자는 회수한 물품을 분리수거 규정에 맞게 배출한다.</li>
          <li>수거자는 배출 완료 인증 사진을 업로드한다.</li>
          <li>시스템은 인증 완료 후 수거자에게 포인트를 지급한다.</li>
          <li>요청자는 등록된 결제수단 및 포인트로 결제가 이루어졌음을 확인한다.</li>
        </ol>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">대안 시나리오</td>
      <td style="padding: 8px;">
        2. 결제 오류 시 "다른 결제수단 등록 필요" 안내한다.<br>
        5. 수거자가 중도 취소 시 요청은 다시 요청 목록으로 복귀된다.<br>
        9. 인증 실패<br>
        - 9.1 인증 사진이 부정확하거나 누락되었을 경우<br>
        - 9.2 시스템은 재촬영을 요청한다.
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">비기능적 요구사항</td>
      <td style="padding: 8px;">
        1. 대리수거 매칭 과정은 실시간으로 반영되어야 한다.<br>
        2. 악용 사례(허위 사진, 배출 미이행 등)를 탐지할 수 있어야 한다.<br>
        3. 결제 정보와 포인트 지급 내역은 안전하게 처리되어야 한다.
      </td>
    </tr>
  </tbody>
</table>

### 7. 커뮤니티·챌린지·랭킹 통합

![그림7 커뮤니티·챌린지·랭킹 통합](./images/IMAGE_007.png)

<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 8px; width: 20%;">항목</th>
      <th style="padding: 8px;">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; font-weight: bold;">개요</td>
      <td style="padding: 8px;">사용자가 커뮤니티에서 인증샷 공유, 게시글 작성, 챌린지 참여, 랭킹 조회 등을 수행한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">관련 액터</td>
      <td style="padding: 8px;">
        <strong>주 액터:</strong> 사용자<br>
        <strong>보조 액터:</strong> 커뮤니티 DB, 필터링 시스템, 챌린지·랭킹 모듈
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">우선 순위</td>
      <td style="padding: 8px;">중요도: 중 / 난이도: 중</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">선행 조건</td>
      <td style="padding: 8px;">로그인이 되어 있어야 한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">후행 조건</td>
      <td style="padding: 8px;">커뮤니티 및 챌린지 기록이 저장된다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">기본 시나리오</td>
      <td style="padding: 8px;">
        <ol>
          <li>사용자가 App 내의 커뮤니티 탭을 클릭한다.</li>
          <li>시스템은 게시글 목록·인증샷 피드·챌린지·랭킹 정보를 조회한다.</li>
          <li>사용자는 게시글을 선택해 상세 내용을 확인한다.</li>
          <li>사용자는 댓글 작성, 좋아요, 공유를 수행할 수 있다.</li>
          <li>사용자가 글쓰기 버튼을 클릭한다.</li>
          <li>시스템이 게시글 유형(질문/인증샷/팁)과 제목·내용·사진 업로드 화면을 제공한다.</li>
          <li>사용자가 내용을 입력하고 등록 버튼을 누른다.</li>
          <li>시스템은 부적절한 언어/스팸/조작 이미지 여부를 필터링한다.</li>
          <li>문제가 없으면 게시글 또는 인증샷을 커뮤니티 DB에 저장한다.</li>
          <li>등록된 글이 목록 상단에 반영된다.</li>
          <li>사용자가 챌린지 메뉴를 열어 참여 가능한 챌린지를 확인한다.</li>
          <li>사용자가 챌린지 참여를 누르면 기록이 저장된다.</li>
          <li>사용자가 랭킹 메뉴에서 지역 전체 랭킹을 조회한다.</li>
        </ol>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">대안 시나리오</td>
      <td style="padding: 8px;">
        7. 필수 항목(제목 또는 내용)이 누락되면 시스템은 "제목과 내용을 입력해주세요" 메시지를 표시하고 작성화면으로 되돌린다.<br>
        8. 필터링 모듈이 부적절한 내용이 탐지되면 시스템은 게시글 등록을 차단하고 수정 요청 메시지를 표시한다.<br>
        13. 챌린지/랭킹 데이터를 불러오지 못하면 시스템은 "현재 정보를 불러올 수 없습니다" 메시지를 표시하고 이전화면으로 돌아간다.
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">비기능적 요구사항</td>
      <td style="padding: 8px;">
        1. 커뮤니티 피드·챌린지·랭킹은 빠르게 로딩되어야 한다.<br>
        2. 필터링 시스템은 부적절한 콘텐츠를 정확히 탐지해야 한다.<br>
        3. 챌린지·랭킹 정보는 안정적으로 갱신되어야 한다.
      </td>
    </tr>
  </tbody>
</table>

### 8. 상점 (포인트 사용)

![그림8 상점 (포인트 사용)](./images/IMAGE_008.png)

<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 8px; width: 20%;">항목</th>
      <th style="padding: 8px;">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; font-weight: bold;">개요</td>
      <td style="padding: 8px;">사용자가 보유 포인트로 상품을 구매한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">관련 액터</td>
      <td style="padding: 8px;">
        <strong>주 액터:</strong> 사용자<br>
        <strong>보조 액터:</strong> 상점 DB, 결제 시스템
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">우선 순위</td>
      <td style="padding: 8px;">중요도: 중 / 난이도: 중</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">선행 조건</td>
      <td style="padding: 8px;">포인트를 보유하고 있어야 한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">후행 조건</td>
      <td style="padding: 8px;">구매 기록이 시스템에 저장된다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">기본 시나리오</td>
      <td style="padding: 8px;">
        <ol>
          <li>사용자가 APP 내의 상점 메뉴를 선택한다.</li>
          <li>시스템은 사용자의 현재 포인트를 조회하여 화면에 표시한다.</li>
          <li>사용자는 구매할 상품을 선택한다.</li>
          <li>사용자는 상품을 찜 목록에 저장할 수 있다.</li>
          <li>사용자는 상품을 장바구니에 담을 수 있다.</li>
          <li>상품 결제 진행 시 사용할 포인트를 입력하며, 결제 금액이 남아있을 경우 등록된 결제 수단으로 결제된다.</li>
          <li>결제 완료 후 시스템은 주문 완료 화면이 표시한다.</li>
          <li>주문 내역은 결제 시스템, 사용자 DB에 저장된다.</li>
          <li>사용자는 주문 상세내역에서 결제완료/배송 준비/배송완료 등의 상태를 확인할 수 있다.</li>
        </ol>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">대안 시나리오</td>
      <td style="padding: 8px;">6. 결제 오류 발생 시 시스템은 "결제 실패" 메시지를 표시하고, 사용자는 이전 화면으로 돌아가거나 결제를 재시도한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">비기능적 요구사항</td>
      <td style="padding: 8px;">1. 결제 및 포인트 차감은 정확하게 처리되어야 한다.</td>
    </tr>
  </tbody>
</table>

### 9. 자원 봉사 모집

![그림9 자원 봉사 모집](./images/IMAGE_009.png)

<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 8px; width: 20%;">항목</th>
      <th style="padding: 8px;">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; font-weight: bold;">개요</td>
      <td style="padding: 8px;">사용자가 지역 기반 환경 자원봉사(플로깅·환경 관련 봉사 등)를 조회하고 참여 신청한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">관련 액터</td>
      <td style="padding: 8px;">
        <strong>주 액터:</strong> 사용자<br>
        <strong>보조 액터:</strong> 봉사활동 DB, 알림 시스템
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">우선 순위</td>
      <td style="padding: 8px;">중요도: 중 / 난이도: 중</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">선행 조건</td>
      <td style="padding: 8px;">로그인이 되어 있어야 한다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">후행 조건</td>
      <td style="padding: 8px;">봉사 참여 내역 및 포인트 적립 정보가 저장된다.</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">기본 시나리오</td>
      <td style="padding: 8px;">
        <ol>
          <li>사용자가 APP 내의 자원봉사 메뉴를 선택한다.</li>
          <li>시스템은 지역별 플로깅/환경정화/분리수거 봉사 활동 목록을 조회한다.</li>
          <li>사용자가 참여할 봉사 활동을 선택한다.</li>
          <li>시스템은 봉사 일정, 장소, 준비물, 모집 인원 등 상세 정보를 제공한다.</li>
          <li>사용자가 참여 신청 버튼을 누른다.</li>
          <li>시스템은 신청 정보를 저장하고, 참여 확정 또는 대기 메시지를 표시한다.</li>
          <li>시스템은 봉사 시작 전 안내 알림(푸시)을 제공한다.</li>
          <li>봉사 활동 완료 시 시스템은 봉사 수행 내역을 검증하고 포인트를 적립한다.</li>
        </ol>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">대안 시나리오</td>
      <td style="padding: 8px;">
        3. 모집 인원 마감 시<br>
        - 3.1 시스템은 "모집이 마감되었습니다." 메시지를 표시한다.<br>
        - 3.2 사용자는 다른 활동을 선택한다.<br>
        5. 네트워크 및 서버 오류로 참여 신청 실패 시, 시스템은 "신청을 처리할 수 없습니다. 다시 시도해주세요" 오류 메시지를 표시한다.
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold;">비기능적 요구사항</td>
      <td style="padding: 8px;">
        1. 봉사활동 정보는 최신 상태로 유지되어야 한다.<br>
        2. 참여 신청 처리와 알림 발송은 안정적으로 실행되어야 한다.<br>
        3. 위치 기반 정보는 정확하게 제공되어야 한다.
      </td>
    </tr>
  </tbody>
</table>