# 🌐 (주) 인들이앤에이치 기업 소개 웹 사이트

> 인터랙션 기반 브랜드 경험을 설계한 기업 웹사이트

<div align='center'>

| [🗒️ 팀 노션](https://induel-dev.notion.site/Induel-E-H-2d085bfc828280f0bc3fedd91b91bc91?pvs=74) | [🎨 디자인 툴](https://www.figma.com/design/hLUzLlFZkt1a9Om6FgZNK7/Induel-E-H-FE?node-id=0-1&p=f) |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [**📊 프로젝트 보드**](https://github.com/orgs/Induel-E-H/projects/1)                           | [**📕 프로젝트 위키**](https://github.com/Induel-E-H/web-FE/wiki)                                 |

</div>

<div align="center">
<a href="https://induel.co.kr" style="
display:inline-flex;
align-items:center;
justify-content:center;
gap:6px;
padding:12px 20px;
font-size:clamp(13px, 1.2vw, 15px);
font-weight:600;
color:#ffffff;
background:linear-gradient(135deg, #3b2a20, #1f140f);
border-radius:10px;
text-decoration:none;
white-space:nowrap;
max-width:90%;
box-sizing:border-box;
transition:all 0.2s ease;
">
<span>배포 사이트 가기</span>
<span>🚀</span>
</a>
</div>

## 📖 PROJECT

<div align="left">
<div style="
display: inline-block;
padding: 12px 18px;
border: 1px solid #e5e5e5;
border-radius: 10px;
background: #fff;
box-shadow: 0 2px 10px rgba(0,0,0,0.05);
max-width: 100%;
box-sizing: border-box;
">
<div style="
font-size: clamp(12px, 2.5vw, 14px);
font-weight: 600;
color: #333;
line-height: 1.4;
">
📅 프로젝트 기간
</div>
<div style="
margin-top: 4px;
font-size: clamp(13px, 3vw, 15px);
font-weight: 700;
color: #333;
line-height: 1.4;
word-break: keep-all;
">
2025. 12. 20 ~ 2026. 05. 20
</div>
</div>
</div>

### 개요

(주) 인들이앤에이치 기업 소개 웹사이트를 제작한 프로젝트입니다.
기업 브랜드의 정체성과 스토리를 **인터랙션 중심 경험**으로 구현한 프로젝트입니다.

클라이언트의 모호한 요구사항 속에서 팀 내 자체적으로 기업을 분석하여  
요구를 구체화하고, 사용자 경험 기준으로 재정의한 뒤  
**기획 → 디자인 → 인프라 → 개발 → QA**까지 전 과정을 통합 설계했습니다.

## ✨ 주요 위젯

### Header

웹 사이트의 **네비게이션**입니다.  
디바이스별 UI 전략을 분리하여 반응형 대응을 최적화했습니다.

- PC는 상단 메뉴, 모바일은 햄버거 메뉴로 분리
- 아래로 스크롤하면 숨고 위로 스크롤하면 나타나며, Hero 위에서는 투명 배경으로 전환
- 메뉴를 누르면 해당 섹션으로 부드럽게 이동하고, 다른 페이지에서는 홈으로 돌아간 뒤 이동

<img width="2480" height="61" alt="image" src="https://github.com/user-attachments/assets/70dff3ef-32a8-4b90-9ffc-21a4925fd764" />
<img width="2486" height="62" alt="image" src="https://github.com/user-attachments/assets/6af62b00-178a-4cfa-b7d1-d21546918fe9" />

### Hero

Three.js로 물결 형태의 3D 배경을 모델링하여 브랜드 키워드인 **‘유연함’을 시각화**했습니다.  
정적 콘텐츠가 아닌, **첫 인상 자체를 경험으로 설계**했습니다.

이후 모바일에서 Three.js 청크 로드와 셰이더 컴파일 동안 배경이 비어 보이는 문제를 해결하기 위해  
완성된 3D 씬을 **60fps 21초 무한 루프 영상으로 사전 렌더링**하고 Three.js 의존성을 제거했습니다.

- VP9 WebM + H.264 MP4 두 포맷 제공, PC·모바일 해상도 분리 (`<source media>`)
- 영상 로드 전에는 첫 프레임 poster를 CSS 배경으로 표시해 빈 화면 제거
- 런타임 3D 렌더링 없이 동일한 연출을 유지하면서 초기 로딩과 기기 부담을 줄임

<img width="2479" height="1302" alt="image" src="https://github.com/user-attachments/assets/66677142-195e-43ed-89d5-edc04cd063f3" />

### Vision

AI 기반 이미지 생성과 키워드 구조화를 통해  
기업의 방향성을 **추상 → 구체**로 변환했습니다.

- Param(정밀한 설계) · Sculpt(공간을 조각하다) · Invest(미래에 투자하다) 세 가지 키워드로 구성
- 이미지와 글을 좌우 교차 배치하고, 화면에 들어올 때 나타나는 스크롤 애니메이션 적용

<img width="2476" height="1238" alt="image" src="https://github.com/user-attachments/assets/f7417a3d-0b30-421c-80ae-adadfae0ecfa" />

### History

클라이언트의 요구사항은 “책처럼 보여달라”였습니다.  
결과는 단순 UI가 아닌 **실제 기업 브로슈어 디자인을 모사한 인터랙션 시스템**으로 구현했습니다.

페이지 구조, 상태 관리, 애니메이션 흐름까지  
모두 **물리적 경험을 디지털로 치환**하는 데 집중했습니다.

- 하드커버 표지, 펼친 위치에 따라 변하는 종이 두께, 책등 굴곡 음영
- PC는 펼침면 전체, 태블릿·모바일은 한 쪽씩 넘기는 반쪽 보기
- 꾹 누르면 연속 넘김, 스와이프 넘김, 목차·카테고리에서 원하는 장으로 바로 이동
- 먼 장으로 이동할 때는 처음과 끝 몇 장만 넘기고 가운데는 건너뛰어 연출과 속도를 함께 확보
- 멀리 있는 장은 빈 종이로 두어 이미지를 한꺼번에 받지 않도록 지연 렌더링
- 책 넘김 엔진(`@gullabs/react-flipbook`)의 모서리 접힘 버그는 `patch-package`로 직접 패치

<img width="2476" height="1291" alt="image" src="https://github.com/user-attachments/assets/71dec15e-f3be-4766-a7b1-ceb104e351f4" />

### Award

Grid 기반 레이아웃과 연도별 필터를 적용하여  
디바이스 제약 환경에서도 **정보 밀도를 유지**했습니다.

- 연도 필터는 가로 스크롤로 제공하고, 더 볼 연도가 남아 있을 때만 끝을 흐리게 표시
- 총 수상 건수를 PC·태블릿은 필터 줄 오른쪽, 모바일은 제목 오른쪽에 표시
- 수상 이미지 팝업은 이미지 비율에 맞춰 크기를 계산해 PC·모바일·가로 모드에서 여백을 최소화

<img width="2482" height="1307" alt="image" src="https://github.com/user-attachments/assets/367203e3-6f52-4a54-9dd3-e955c5e31c68" />

### Patent

특허증 데이터 나열이 아닌  
**UI 일관성을 유지하는 방향으로 재디자인**을 수행했습니다.

- 유효 특허는 카드로 보여주고, 누르면 특허증 원본 이미지를 팝업으로 표시
- 만료 특허는 번호·명칭·등록번호 목록으로 정리해 이력을 한눈에 확인
- 특허 영역이 화면에 들어오면 특허증 이미지를 미리 받아 팝업을 바로 열 수 있도록 처리

<img width="2487" height="1067" alt="image" src="https://github.com/user-attachments/assets/1fd93286-ad60-4357-9a7a-4038dc2fa29a" />

### Location

Naver Map API + Open Street Map Fallback 구조로  
외부 API 장애 상황까지 고려한 **이중화 설계**를 적용했습니다.

Naver Map API를 활용하여 Map Marker와 Info Window를 구현하여 회사 위치를 정확하게 표기했습니다.

- Naver Maps SDK는 지도 섹션이 렌더링될 때 동적으로 불러와 초기 로딩 부담을 줄임
- API 키가 없거나, SDK 로드에 실패하거나, 인증에 실패하면 Open Street Map으로 전환하여 안정성 향상
- 도보·버스·지하철 안내, 전화 연결, 네이버 지도 길찾기 링크 제공

<img width="1845" height="804" alt="image" src="https://github.com/user-attachments/assets/a963c9ac-e8b6-4cb1-a91a-384f498936a8" />

### Footer

브랜드 컬러를 기반으로 한 **정보 신뢰 영역**을 구현했습니다.  
대표 전화와 이메일은 바로 연결되는 링크로 제공합니다.
<img width="1846" height="292" alt="image" src="https://github.com/user-attachments/assets/fc0b7b98-7370-434b-a9e2-d678244e9c2e" />

### Privacy Policy

Google Analytics 적용을 위한 법적 요구사항을 충족하며  
**실서비스 기준 컴플라이언스 대응**을 반영했습니다.
<img width="1845" height="946" alt="image" src="https://github.com/user-attachments/assets/36555345-9c42-4a1c-95fc-0296f80cfc6e" />

### 404 · Unsupported Browser

- 존재하지 않는 주소는 홈으로 돌아가는 버튼이 있는 404 페이지로 안내
- Chrome 79 이하 브라우저는 지원 버전과 Chrome 최신 버전 다운로드를 안내하는 전용 페이지로 분기

<img width="1839" height="943" alt="image" src="https://github.com/user-attachments/assets/05ce0bde-78a3-4627-9aeb-09c48ba19f5f" />

## 📚 SKILL STACK

### Deploy

<img width="103" height="97" alt="Deploy" src="https://github.com/user-attachments/assets/df2906e5-240e-4ed5-9df1-4c84320addb3" />

### Develop

<img width="759" height="99" alt="Develop" src="https://github.com/user-attachments/assets/9675dca0-0ee5-4ea2-a44c-2e7d6ea79a70" />

### Develop Environment

<img width="1114" height="97" alt="Environment" src="https://github.com/user-attachments/assets/854c9198-0627-4b90-ae05-48019a2c3ecf" />

### CI/CD

<img width="385" height="97" alt="CI   CD" src="https://github.com/user-attachments/assets/a88b7b4f-531f-47c1-a1ef-f25f04f8f9c2" />

### Monitor

<img width="427" height="97" alt="Monitor" src="https://github.com/user-attachments/assets/6ceb7171-47de-4728-b478-32c8a72dbf31" />

## 🛠️ GETTING STARTED

### 요구 사항

- Node.js 24 (`mise.toml` 기준 24.13.0)
- 지도 표시를 위한 Naver Maps API 키 (없으면 Open Street Map으로 표시)

### 실행

```bash
npm install
npm run dev            # 전체 페이지 (http://localhost:5173)
npm run dev:history    # 위젯 하나만 띄우기 (hero, vision, history, award, patent, map, footer)
```

### 환경 변수 (`.env.local`)

| 이름                     | 설명                                       |
| ------------------------ | ------------------------------------------ |
| `VITE_NAVER_MAP_API_KEY` | Naver Maps API 키                          |
| `VITE_DEV_WIDGET`        | 지정한 위젯만 렌더링 (`dev:{위젯}`이 설정) |
| `VITE_SHOW_DOWN_ICON`    | 개발 환경에서 Hero 스크롤 안내 표시        |

### 주요 스크립트

| 명령어                                   | 설명                                   |
| ---------------------------------------- | -------------------------------------- |
| `npm run build`                          | 타입 검사 + 프로덕션 빌드              |
| `npm run build:staging`                  | 스테이징 빌드 (Hero만 표시)            |
| `npm run test` / `npm run test:coverage` | Vitest 단위 테스트 / 커버리지          |
| `npm run storybook`                      | Storybook (http://localhost:6006)      |
| `npm run test:storybook`                 | Storybook 인터랙션 테스트 (Playwright) |
| `npm run docker`                         | Docker 이미지 빌드 후 개발 서버 실행   |
| `npm run commit`                         | Commitizen 기반 커밋                   |

## 🫂 TEAM

### 팀원 소개

<div align='center'>

| **FE**                     | **FE ⭐ Lead**           |
| -------------------------- | ------------------------ |
| ![박경민][gyeongmin]       | ![조민석][minseok]       |
| [박경민][gyeongmin-github] | [조민석][minseok-github] |

</div>

#### 박경민

- **QA**
- Vision
- Patent
- Footer

#### 조민석

- **Infra**
- Header
- Hero
- History
- Award
- Map
- Privacy Policy

## 🚀 RESULT

### Performance

- Desktop
  |Performance|Accessibility|Best Practice|SEO|
  |---|---|---|---|
  |🟢 98+|🟢 96+|🟠 75+|🟢 100|

- Mobile
  |Performance|Accessibility|Best Practice|SEO|
  |---|---|---|---|
  |🟢 94+|🟢 96+|🟠 73+|🟢 100|
- 웹 접근성 개선 (ARIA 속성 및 키보드 네비게이션 지원)

### Optimization

- 이미지 용량 45.6GB -> 78.4MB **99.83%** 절감 (JPG, PNG, TIF -> WebP 최적화, 해상도 기반 용량 제한 적용: 썸네일 100KB, 일반 이미지 200KB)
- Hero 3D 배경을 Three.js로 모델링한 뒤 무한 루프 영상으로 사전 렌더링하여 Three.js 런타임 의존성 제거
  - 영상 용량: WebM 기준 PC 272KB, 모바일 252KB (MP4 대체 포맷 별도 제공)
  - 영상 로드 전 poster 이미지(약 10KB)를 CSS 배경으로 표시
- 첫 화면(Hero·Vision) 아래 위젯은 지연 로딩하고, Vision 끝에 닿으면 미리 받아 스크롤 시 빈 화면 방지
- React 관련 라이브러리를 별도 청크(`vendor-react`)로 분리해 캐시 효율 향상
- 해시가 붙은 정적 자산은 1년 불변 캐시, HTML은 매번 재검증 (Netlify `_headers`)
- Pretendard 서브셋·북엔드바탕 폰트를 CDN 대신 로컬로 제공하고 `font-display: swap` 적용
- 팝업·책 이미지는 화면에 들어오거나 넘길 차례가 되면 미리 받아 표시 지연 최소화

<img width="285" height="74" alt="image" src="https://github.com/user-attachments/assets/ca3ecfc5-ca4b-476b-821f-c35954c36e9b" />

### Responsive

- PC(1025px~) · 태블릿(768~1024px) · 모바일(~767px) 3단계 브레이크포인트를 CSS와 JS(`useBreakpoint`)에서 같은 기준으로 사용
- 글자 크기·여백·레이아웃 간격을 `clamp()` 기반 유동 토큰으로 정의해 브레이크포인트 사이에서도 자연스럽게 변화
- 기기별로 레이아웃 자체를 다르게 구성
  - History: PC는 펼침면 전체, 태블릿·모바일은 한 쪽씩 넘기는 보기, 목차·주요 성과 구간도 기기별로 다르게 나눔
  - Header: PC 상단 메뉴 / 모바일 햄버거 메뉴
  - Award: 총 건수를 PC·태블릿은 필터 줄 오른쪽, 모바일은 제목 오른쪽에 배치
- 책 내부는 Container Query 단위(`cqmin`)로 크기를 잡아 화면이 아닌 책 크기에 비례해 글자·여백이 조정됨
- 휴대폰 가로 모드처럼 높이가 낮은 화면을 별도로 처리 (Hero 겹침 방지, 이미지 팝업을 화면 높이에 맞춤)
- 모바일 브라우저 주소창 변화에도 높이가 흔들리지 않도록 `svh`·`dvh` 단위 사용
- 이미지는 `sizes`로 기기별 크기를 지정하고, Hero 영상은 PC·모바일 해상도를 분리해 제공
- 지도 마커 크기를 CSS와 같은 계산식으로 맞춰 화면 폭에 따라 함께 조정
- `prefers-reduced-motion` 설정 시 Hero·카드 애니메이션 축소, 마우스 환경에서만 책 hover 효과 적용

### Compatibility

- Chrome 79 이하 브라우저는 최신 CSS 기능 지원 한계를 고려하여 Unsupported Browser 페이지로 분기
- Chrome 80~89 환경은 성능 저하 가능성을 고려해 Framer Motion 애니메이션을 축소 적용
- Lightning CSS 기반 트랜스파일 및 자동 Vendor Prefixing으로 레거시 브라우저 대응
- Hero 배경은 WebM 미지원 환경에서 MP4로, 영상 로드 전에는 poster 이미지로 대체

<img width="1101" height="719" alt="image" src="https://github.com/user-attachments/assets/bd2baedb-afa3-4acf-b9db-a425c595fdf0" />

### Architecture

- FSD(Feature-Sliced Design) 아키텍처 적용
- CSS 디자인 토큰(색상·모서리·전환 시간·z-index) 기반 스타일 관리로 디자인 값 일원화
- Naver Map 장애 대비 Open Street Map Fallback 구조 설계

### CI/CD

- Vitest & Github Actions 기반 테스트 자동화 파이프라인 구축
- Lighthouse & Github Actions 기반 성능 회귀 감지 자동화
- Chromatic & Storybook 기반 시각 회귀 테스트 적용
- PR마다 테스트 커버리지와 Lighthouse 결과를 자동 코멘트로 공유
- Branch Guard로 `main`에는 `develop`·`hotfix/*` 브랜치만 병합 가능하도록 제한
- Dependabot으로 npm·GitHub Actions 의존성을 매주 점검
- Husky + lint-staged(Prettier) + commitlint + Commitizen으로 커밋 품질 관리
- Netlify DNS 기반 도메인 및 배포 환경 관리

<img width="314" height="339" alt="image" src="https://github.com/user-attachments/assets/f4f3a730-d8eb-43a5-b6d2-a01de7e7a90b" />

### Test & Docs

- Storybook 기반 컴포넌트 명세화
- Vitest & Storybook 연동으로 UI 단위 테스트 환경 구축
- 테스트·스토리 파일을 소스 파일과 같은 위치에 1:1로 두는 규칙으로 관리
- Vitest Coverage
  |% Stmts|% Branch|% Funcs|% Lines|
  |---|---|---|---|
  |🟢 98+|🟢 97+|🟢 99+|🟢 99+|

### Observability

- Google Analytics 도입에 따른 개인정보 처리방침 페이지 구현으로 법적 요구사항 대응
- Google Analytics / Search Console / Naver Search Advisor 기반 사용자 유입 및 검색 성과 모니터링
- Google Analytics 이벤트 트래킹을 통한 사용자 행동 데이터 수집 및 분석

<img width="1531" height="771" alt="image" src="https://github.com/user-attachments/assets/b078923d-d760-4d10-9d84-9756a9009289" />

### SEO

- 빌드 시 sitemap 자동 생성, `robots.txt`로 크롤링 허용
- Open Graph·Twitter 카드 메타 태그와 공유 이미지(1200×630) 적용
- Google Search Console·Naver Search Advisor 사이트 등록

### TeamWork

- Docker 기반 개발 환경 통일 OS 간 실행 환경 차이 제거
- mise 기반 Node.js 버전 통일 팀원 간 실행 환경 불일치 제거 및 개발 환경 재현성 확보

## 📦 콘텐츠 · 디자인 작업

개발 외에도 웹사이트에 들어갈 콘텐츠를 만들고 다듬는 작업을 직접 수행했습니다.

### 브로슈어 콘텐츠 디지털화

클라이언트에게 전달받은 자료는 인쇄용 브로슈어 PDF가 전부였고,  
텍스트 레이어가 없어 **문자 인식(복사·검색)이 되지 않는 상태**였습니다.

- 브로슈어를 직접 읽으며 모든 내용을 한 글자씩 입력
  - 작품 56건의 명칭(국문·영문)·기간·주소·설명 (작품 설명만 약 6,500자)
  - 연혁, 주요 성과, 수상 10건, 특허 15건(유효 5건·만료 10건)
- 입력한 내용을 데이터로 구조화하고, 필수 항목 누락·날짜 형식 등을 테스트로 검증해 입력 실수를 방지

### 이미지 선별 · 최적화

- 원본 이미지를 하나씩 확인해 흐리거나 잘리거나 품질이 낮은 이미지를 제외하고, 웹에 쓸 수 있는 깨끗한 이미지만 분류
- JPG·PNG·TIF 원본을 WebP로 인코딩하고 용도별 용량 상한 적용 (썸네일 100KB, 일반 이미지 200KB)
- 최종적으로 WebP 이미지 598장을 작품·연혁·수상·특허·비전 영역에 배치

### 클라이언트 피드백 반영

- 클라이언트의 디자인 피드백을 받아 시안을 수정하고 구현에 반영하는 과정을 반복
- 클라이언트 QA에서 받은 콘텐츠 오타, 이미지 누락·순서, 회사명 표기(`(주) 인들이앤에이치`) 등을 수정
- 모호한 요구사항(예: “책처럼 보여달라”)은 실제 브로슈어 디자인을 분석해 구체적인 화면과 동작으로 정의한 뒤 확인받아 진행

## 🤝 협업 방식

### 코드 리뷰

PN 룰 기반으로 리뷰 코멘트에 중요도를 부여하여
**의사결정 비용을 최소화** 했습니다.

### PR 운영

대규모 변경은 텍스트 리뷰 대신  
**실시간 설명 기반 리뷰(Discord)** 로 전환하여 속도와 이해도를 동시에 확보했습니다.

### 크로스 도메인

프로젝트 전체 이해도 향상과 오너십 강화를 위해 도메인 분리 기반의 교차 책임 구조를 적용합니다.
각 개발자는 **오너 도메인**에서는 **기능 구현**을, **비오너 도메인**에서는 **테스트 코드 작성**을 담당하여 구현과 검증을 분리합니다.

### AI 활용 전략

Claude Code 기반으로 반복 작업을 자동화하고  
**개발 생산성**을 최적화했습니다.

- PR 자동 생성 (`/pr`)
- AI 지침 자동 갱신 (`/ai-update`)
- RTK 기반 토큰 비용 절감
- Caveman 스킬과 `caveman-shrink` MCP 프록시로 응답·도구 출력 압축
- 사용 플러그인
  - frontend-design
  - code-simplifier
  - chrome-devtools
  - session-report
  - hookify
- MCP
  - Talk To Figma
  - Serena
- Agent
  - figma-designer: Talk To Figma를 통해 디자인을 제작하는 Agent (Model: Opus)
  - vitest-writer: 테스트 작성 전문 Agent (Model: Opus)

> [!TIP]
> README에 대한 자세한 내용은 [Wiki](https://github.com/Induel-E-H/web-FE/wiki)에서 확인할 수 있습니다!

[gyeongmin]: https://avatars.githubusercontent.com/u/115498500?v=4&size=128
[minseok]: https://avatars.githubusercontent.com/u/99482796?v=4&size=128
[gyeongmin-github]: https://github.com/imyourmxxn
[minseok-github]: https://github.com/Jo-Minseok
