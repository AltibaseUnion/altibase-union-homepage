# Content Guide

Altibase Union 홈페이지 게시글은 Markdown과 Astro Content Collections로 관리한다. 모든 글은 Corporate Style에 맞게 짧고 명확하게 작성한다.

## 게시글 작성 규칙

- 제목은 게시글의 핵심을 한 문장으로 표현한다.
- 요약은 목록과 SEO에 사용되므로 1-2문장으로 작성한다.
- 대표 이미지는 선택 사항이며, 글의 첫인상을 보강할 때만 사용한다.
- 태그는 향후 분류와 검색 확장을 고려해 2-5개 정도로 유지한다.
- 본문은 `##`, `###`, `####` 순서로 구조화한다.

## Frontmatter

```yaml
---
title: "게시글 제목"
date: 2026-07-08
category: "활동보고"
summary: "목록에 표시될 짧은 요약"
author: "Altibase 노동조합"
thumbnail: ""
pinned: false
tags: ["활동보고", "소통"]
draft: false
slug: "post-slug"
---
```

## 본문

- 문단은 너무 길게 쓰지 않는다.
- 표는 정보 비교가 필요할 때만 사용한다.
- 이미지는 `public/images/` 아래에 저장하고 GitHub Pages base path를 고려한다.
- Callout은 blockquote를 사용한다.
- 링크는 원문을 확인할 수 있는 공식 URL을 사용한다.

## GPTS 사용 절차

1. 초안, 회의록, Notion 게시글 등 원문을 GPTS에 전달한다.
2. GPTS가 frontmatter와 Markdown 본문을 생성한다.
3. 제목, 날짜, 요약, 태그, 공개 가능 정보를 검토한다.

## Codex 사용 절차

1. Codex에 Markdown 추가 또는 수정 요청을 전달한다.
2. Codex가 `content/notices/` 또는 `content/activities/`에 파일을 반영한다.
3. 이미지는 필요한 경우 `public/images/`에 저장한다.
4. 빌드 확인 후 develop 브랜치에 커밋하고 push한다.
