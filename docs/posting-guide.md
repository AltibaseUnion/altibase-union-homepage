# Posting Guide

Altibase 노동조합 홈페이지 게시글 작성 가이드입니다.

## 공지 작성

공지사항은 `content/notices/`에 Markdown 파일로 작성합니다.

파일명은 날짜와 핵심 주제를 포함합니다.

```text
content/notices/2026-07-08-labor-board.md
```

Frontmatter 예시:

```yaml
---
title: "공지 제목"
date: 2026-07-08
category: "공지사항"
summary: "목록과 SEO에 표시될 한 문장 요약"
author: "Altibase 노동조합"
thumbnail: ""
pinned: false
tags: ["소통", "안내"]
draft: false
slug: "notice-slug"
---
```

## 활동보고 작성

활동보고는 `content/activities/`에 Markdown 파일로 작성합니다.

```text
content/activities/2026-07-08-meeting-report.md
```

## 대표 이미지 규격

- 권장 비율: 16:9
- 권장 너비: 1200px 이상
- 저장 위치: `public/images/`
- 이미지가 없으면 `thumbnail`은 빈 문자열로 둡니다.

## Markdown 작성 규칙

- 제목은 frontmatter의 `title`에 작성합니다.
- 본문에는 `##`부터 사용합니다.
- 문장은 짧고 명확하게 작성합니다.
- 표가 필요한 경우 Markdown 표를 사용합니다.
- 내부 운영 정보나 개인정보는 포함하지 않습니다.

## GPTS 사용 방법

1. 사용자가 공지 또는 활동보고 초안을 GPTS에 입력합니다.
2. GPTS는 위 frontmatter 형식에 맞춰 Markdown을 생성합니다.
3. 생성된 Markdown을 검토합니다.
4. 필요한 경우 제목, 날짜, 요약, 태그를 수정합니다.

## Codex 사용 방법

1. Codex에게 Markdown 파일을 추가하도록 요청합니다.
2. Codex는 `content/notices/` 또는 `content/activities/`에 파일을 생성합니다.
3. `npm run build`로 빌드 상태를 확인합니다.
4. develop 브랜치에 커밋하고 push합니다.

## 운영 흐름

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
