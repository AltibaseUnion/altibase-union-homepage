# Altibase 노동조합 홈페이지

Altibase 노동조합 공식 포털로 사용할 수 있는 정적 홈페이지입니다. GitHub Pages에서 무료로 운영할 수 있도록 HTML, CSS, Vanilla JavaScript, Bootstrap 5 CDN, Lucide Icons CDN만 사용하며 별도 빌드 도구는 필요하지 않습니다.

## 1. 프로젝트 개요

- 홈, 조합소식, 상담·제보 메뉴를 제공하는 단일 페이지 홈페이지입니다.
- 공지사항과 활동보고는 현재 `js/app.js`의 샘플 데이터로 표시합니다.
- 원본 게시글은 네이버 카페에 두고, 향후 Google Apps Script JSON API를 통해 자동 연동할 수 있도록 함수 구조를 분리했습니다.
- 상담하기와 제보하기 버튼은 Google Forms 링크로 교체해 사용할 수 있습니다.

## 2. 로컬 미리보기 방법

가장 간단한 방법은 `index.html` 파일을 브라우저에서 직접 여는 것입니다.

로컬 서버로 확인하려면 프로젝트 폴더에서 다음 중 하나를 사용할 수 있습니다.

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`으로 접속합니다.

## 3. GitHub Pages 배포 방법

1. 이 프로젝트를 GitHub 저장소에 push합니다.
2. GitHub 저장소의 `Settings`로 이동합니다.
3. `Pages` 메뉴에서 배포 소스를 선택합니다.
4. `Deploy from a branch`를 선택하고 `main` 브랜치의 `/root`를 지정합니다.
5. 저장 후 표시되는 GitHub Pages 주소로 접속합니다.

모든 정적 파일은 상대경로(`./css/style.css`, `./js/app.js`)를 사용하므로 GitHub Pages에서도 경로가 깨지지 않습니다.

## 4. Hero 이미지 교체 방법

Hero 영역은 `images/hero.png` 파일이 있으면 자동으로 배경 이미지로 사용합니다.

1. 사용할 이미지를 `hero.png` 이름으로 준비합니다.
2. `images/hero.png` 경로에 파일을 넣습니다.
3. 이미지가 없거나 로드되지 않는 경우 네이비 계열 gradient 배경이 자연스럽게 표시됩니다.

권장 비율은 16:9 또는 21:9이며, PC 기준 Hero 높이는 420px 이하, 모바일 기준 320px 이하로 제한되어 있습니다.

현재 교체 전 Hero 이미지는 `images/hero-previous.png`로 백업되어 있습니다.

로고 이미지는 다음 경로에서 사용합니다.

- `images/logo.png`: 투명 배경으로 처리한 전체 로고 보관용
- `images/logo-symbol.png`: 투명 배경으로 처리한 상단 네비게이션 심볼 로고
- `images/favicon.png`, `images/favicon.ico`: 글자 없는 심볼 로고를 크게 보이도록 만든 브라우저 탭 아이콘

## 5. Google Form URL 교체 방법

`js/app.js` 상단의 아래 값을 실제 Google Forms 주소로 교체합니다.

```js
const CONSULT_FORM_URL = "PLACEHOLDER";
const REPORT_FORM_URL = "PLACEHOLDER";
```

- `CONSULT_FORM_URL`: 상담하기 버튼
- `REPORT_FORM_URL`: 제보하기 버튼

두 버튼은 새 창에서 열립니다.

## 6. 네이버 카페 게시판 URL 교체 방법

`js/app.js` 상단의 아래 값을 실제 네이버 카페 게시판 주소로 교체합니다.

```js
const NAVER_NOTICE_BOARD_URL = "PLACEHOLDER";
const NAVER_ACTIVITY_BOARD_URL = "PLACEHOLDER";
```

- `NAVER_NOTICE_BOARD_URL`: 최근 공지사항 더보기
- `NAVER_ACTIVITY_BOARD_URL`: 최근 활동보고 더보기

샘플 게시글 URL도 필요에 따라 `sampleNoticeData`, `sampleActivityData` 안에서 교체할 수 있습니다.

## 7. 향후 Apps Script 연동 예정 위치

외부 게시글 연동은 `js/app.js`의 `fetchRecentPosts()` 함수에서 처리하도록 준비되어 있습니다.

```js
async function fetchRecentPosts() {
  // TODO: 네이버 카페 게시글을 Google Apps Script JSON API로 중계한 뒤 이 함수에서 fetch로 연결합니다.
}
```

향후 Google Apps Script에서 다음 형태의 JSON을 반환하도록 만들면 현재 렌더링 함수를 그대로 사용할 수 있습니다.

```json
{
  "notices": [
    { "title": "공지 제목", "date": "2026-07-07", "url": "https://..." }
  ],
  "activities": [
    { "title": "활동보고 제목", "date": "2026-07-07", "url": "https://..." }
  ]
}
```

상담과 제보는 하나의 Google Forms 창구(`https://forms.gle/43E4x14eWB6X8oAF7`)로 접수합니다. 분리된 접수 폼이 생기기 전까지는 한 창구로 유지하는 것이 사용자 혼선을 줄입니다.

바로가기 항목은 `quickLinks` 배열에서 관리합니다. 현재 등록된 링크는 다음과 같습니다.

- 화섬식품노동조합 홈페이지: `https://kctfu.org/`
- 화섬식품노조 YouTube: `https://www.youtube.com/@kctfu`
- 법률 상담: `https://kctfu.org/bbs/board.php?bo_table=law`
- 노사협의회 안건 수집: `https://forms.gle/B3wFFgtCZ2phSn3b7`
- 상담 및 제보: `https://forms.gle/43E4x14eWB6X8oAF7`

```js
const quickLinks = [
  {
    title: "화섬식품노동조합 홈페이지",
    image: "./images/kctfu-symbol.png",
    url: "https://kctfu.org/"
  }
];
```
