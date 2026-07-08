# Altibase Union 홈페이지

Altibase 공식 홈페이지와 톤을 맞춘 노동조합 공식 홈페이지입니다. GitHub Pages에서 무료로 운영하며, Astro Content Collections와 Markdown을 사용해 게시물을 관리합니다.

운영 사이트: https://altibaseunion.github.io/altibase-union-homepage/

## 기술 스택

- Astro
- Bootstrap 5 CDN
- Lucide Icons CDN
- Markdown Content Collections
- GitHub Pages

## 프로젝트 구조

```text
.
├── astro.config.mjs
├── package.json
├── src/
│   ├── components/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── content/
│   ├── notices/
│   └── activities/
├── public/
│   ├── images/
│   └── files/
├── docs/
│   └── posting-guide.md
└── README.md
```

## 실행 방법

최초 1회 의존성을 설치합니다.

```bash
npm install
```

개발 서버 실행:

```bash
npm run dev
```

정적 빌드:

```bash
npm run build
```

빌드 결과 미리보기:

```bash
npm run preview
```

## 브랜치 전략

- `main`: 운영 배포용 브랜치입니다.
- `develop`: 개발 작업용 브랜치입니다.
- 모든 작업은 develop에서 진행합니다.
- 사용자의 검토 및 승인 전에는 main으로 merge하지 않습니다.

권장 흐름:

```bash
git switch develop
git pull --rebase origin develop
npm install
npm run build
git add .
git commit -m "작업 내용"
git push origin develop
```

## GitHub Pages 배포

이 프로젝트는 GitHub Actions로 Astro 정적 빌드 결과를 GitHub Pages에 배포하도록 구성합니다.

- 설정 파일: `.github/workflows/deploy.yml`
- 배포 브랜치: `main`
- Astro base path: `/altibase-union-homepage`

운영 반영 절차:

1. develop에서 작업합니다.
2. `npm run build`를 통과시킵니다.
3. develop에 push합니다.
4. 검토 후 develop을 main으로 merge합니다.
5. main push 후 GitHub Actions가 Pages 배포를 수행합니다.

## Hero 이미지 교체

Hero 이미지는 다음 파일 하나만 교체하면 됩니다.

```text
public/images/hero.png
```

권장:

- 비율: 16:9 또는 21:9
- 너비: 1600px 이상
- 텍스트가 이미지 안에 직접 들어가지 않는 이미지
- 너무 어둡거나 투쟁적인 이미지는 피함

## 게시글 추가 방법

공지사항:

```text
content/notices/YYYY-MM-DD-title.md
```

활동보고:

```text
content/activities/YYYY-MM-DD-title.md
```

Frontmatter:

```yaml
---
title: "게시글 제목"
date: 2026-07-08
category: "공지사항"
summary: "목록에 표시될 요약"
author: "Altibase 노동조합"
thumbnail: ""
pinned: false
tags: ["태그"]
draft: false
slug: "post-slug"
---
```

`draft: true`인 글은 목록과 상세 페이지에 표시하지 않습니다.

## Content Collections

Content Collections는 `src/content.config.ts`에서 정의합니다.

컬렉션:

- `notices`
- `activities`

공통 필드:

- `title`
- `date`
- `category`
- `summary`
- `author`
- `thumbnail`
- `pinned`
- `tags`
- `draft`
- `slug`

목록 정렬은 `pinned: true`를 우선 표시하고, 그 다음 최신순으로 표시합니다.

## GPTS + Codex 운영 방식

향후 게시글 운영 흐름:

```text
사용자
↓
GPTS
↓
Markdown 생성
↓
Codex
↓
Git
↓
GitHub Pages
```

상세 작성 규칙은 [docs/posting-guide.md](docs/posting-guide.md)를 참고합니다.

## 이번 구조에서 구현하지 않는 기능

- 검색
- RSS
- 태그 페이지
- 카테고리 페이지
- 관리자 페이지
- 로그인
- DB
- Apps Script
- 네이버 카페 자동 연동
- CMS

## UI와 콘텐츠 운영 원칙

- Quick Links는 `src/data/site.ts`의 `quickLinks` 배열에서 관리합니다.
- Footer에는 외부 링크를 최소화하고, 네이버 카페와 카카오 채널 등 주요 외부 채널은 Quick Links에서 노출합니다.
- 공지사항과 활동보고 상세 페이지는 Markdown 본문을 공통 Article Layout으로 표시합니다.
- 게시글 본문에는 불필요한 HTML을 넣지 않고, breadcrumb, 메타 정보, 목록 버튼은 Layout에서 자동 처리합니다.
