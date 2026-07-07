# Altibase 노동조합 홈페이지

Altibase 공식 홈페이지와 톤을 맞춘 노동조합 공식 홈페이지입니다. 신뢰, 전문성, 소통, 안정감을 목표로 하는 정적 홈페이지이며 GitHub Pages에서 운영합니다.

운영 사이트: https://altibaseunion.github.io/altibase-union-homepage/

## 프로젝트 구조

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── data/
│   └── posts.json
├── images/
│   ├── hero.png
│   ├── favicon.ico
│   ├── favicon.png
│   ├── logo-symbol.png
│   └── logo.png
└── README.md
```

## 브랜치 전략

- `main`: 운영 배포용 브랜치입니다. GitHub Pages 배포 소스로 사용합니다.
- `develop`: 개발 작업용 브랜치입니다. 모든 수정은 develop에서 진행합니다.
- 사용자의 검토 및 승인 전에는 main으로 merge하지 않습니다.
- main에는 직접 commit하지 않습니다.

권장 작업 흐름:

```bash
git switch develop
git pull --rebase origin develop
# 작업 및 테스트
git add .
git commit -m "refactor: improve homepage quality"
git push origin develop
```

이후 GitHub에서 develop → main Pull Request를 만들고 검토 후 병합합니다.

## GitHub Pages 배포

1. develop에서 작업을 완료하고 검토를 받습니다.
2. develop을 main으로 병합합니다.
3. GitHub 저장소의 `Settings` → `Pages`에서 배포 소스를 확인합니다.
4. 배포 소스는 `main` 브랜치의 `/root`를 사용합니다.

정적 파일은 상대경로(`./css/style.css`, `./js/app.js`, `./images/...`)를 사용하므로 GitHub Pages 하위 경로에서도 동작합니다.

## 로컬 미리보기

브라우저에서 `index.html`을 직접 열어도 확인할 수 있습니다.

로컬 서버로 확인하려면 프로젝트 폴더에서 다음 명령을 실행합니다.

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`으로 접속합니다.

## Hero 이미지 교체 방법

Hero 이미지는 `images/hero.png` 한 장만 교체하면 됩니다.

- 파일명: `hero.png`
- 위치: `images/hero.png`
- 권장 비율: 16:9 또는 21:9
- PC 높이: 최대 420px 이하
- 모바일 높이: 최대 320px 이하

이미지 위에 네이비 계열 오버레이가 적용되어 있으므로, 너무 어둡거나 텍스트가 많은 이미지는 피하는 것이 좋습니다.

## 운영 링크 관리

운영에 필요한 값은 `js/app.js` 상단의 `config` 객체에서 관리합니다.

```js
const config = {
  CONSULT_FORM_URL: "https://forms.gle/43E4x14eWB6X8oAF7",
  REPORT_FORM_URL: "https://forms.gle/43E4x14eWB6X8oAF7",
  NAVER_NOTICE_BOARD_URL: "https://cafe.naver.com/altibaseunion",
  NAVER_ACTIVITY_BOARD_URL: "https://cafe.naver.com/altibaseunion",
  EMAIL: "altibaseUnion@gmail.com",
  NAVER_CAFE_URL: "https://cafe.naver.com/altibaseunion",
  QUICK_LINKS: []
};
```

링크를 교체할 때는 이 객체의 값만 수정하면 됩니다. 기존 운영 링크를 바꿀 때는 main 병합 전 develop에서 먼저 확인합니다.

## Quick Links 관리

Quick Links는 `config.QUICK_LINKS` 배열에서 관리합니다.

```js
{
  title: "화섬식품노동조합 홈페이지",
  icon: "building-2",
  url: "https://kctfu.org/"
}
```

아이콘은 Lucide Icons 이름을 사용합니다. 링크를 추가하려면 객체를 하나 더 추가하면 됩니다.

## 게시글 데이터

현재는 네이버 카페 공지사항 게시판을 직접 fetch/parse하는 프로토타입이 들어가 있습니다.

- 공지사항 원본 URL: `https://cafe.naver.com/altibaseunion/menu/11`
- 브라우저 CORS, 네이버 로그인, 카페 접근 정책 때문에 자동 수집은 실패할 수 있습니다.
- 실패 시 콘솔에 원인을 출력하고 `data/posts.json` fallback 데이터를 표시합니다.
- fallback JSON도 불러오지 못하면 `js/app.js`의 내장 샘플 데이터를 사용합니다.

현재 fallback 데이터는 다음 위치에서 관리합니다.

- `data/posts.json`: 최근 공지사항 5개, 최근 활동보고 5개
- `embeddedFallbackPosts`: `data/posts.json` 로드 실패 시 사용하는 최종 fallback

향후 Google Apps Script JSON API를 붙일 때는 `fetchRecentPosts()` 또는 `fetchNaverCafeNoticePosts()` 내부를 교체합니다.

```js
async function fetchRecentPosts() {
  // 네이버 카페 직접 fetch가 실패하면 fallback data를 표시합니다.
}
```

이번 작업에서는 다음 기능을 구현하지 않습니다.

- 네이버 카페 자동 연동
- Apps Script
- RSS
- 검색
- 로그인
- 관리자 기능

## 유지보수 체크리스트

- develop 브랜치에서 작업했는지 확인합니다.
- `index.html`의 상대경로가 `./` 기준인지 확인합니다.
- `js/app.js` 문법 오류가 없는지 확인합니다.
- 공지사항 5개, 활동보고 5개, Quick Links가 표시되는지 확인합니다.
- 모바일에서 Hero와 카드가 겹치지 않는지 확인합니다.
- 운영 배포 전 `config` 링크가 의도한 운영 URL인지 확인합니다.
