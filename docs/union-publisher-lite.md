# Union Publisher Lite

Union Publisher Lite는 Notion에서 내보낸 Markdown 또는 ZIP 파일을 활동보고 게시물 초안으로 변환하는 로컬 관리 도구입니다.

## 실행

```bash
npm run content:app
```

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:4177
```

Astro 실제 페이지 미리보기를 함께 확인하려면 다른 터미널에서 개발 서버를 실행합니다.

```bash
npm run dev
```

## 지원 입력

- `.md`
- `.markdown`
- Notion에서 내보낸 `.zip`

ZIP 안에 이미지가 있으면 `public/images/activities/{slug}/` 경로로 정리하고 Markdown 이미지 경로를 활동보고 상세 페이지 기준 상대 경로로 변환합니다.

## 변환 규칙

- 새 게시물은 `draft: true`로 생성합니다.
- 원문의 날짜, 인명, 금액, 사건 결과를 임의로 바꾸지 않습니다.
- 다음 용어는 홈페이지 표기 기준으로 정리합니다.
  - `부당 노동 행위` → `부당노동행위`
  - `근로 시간 면제자` → `근로시간면제자`
  - `노사 협의회` → `노사협의회`
- 본문은 `## 요약`, `## 주요 활동`, `### 세부 활동` 구조를 기본으로 합니다.

## 검증 항목

도구는 다음 항목을 점검합니다.

- Frontmatter 필수값
- 날짜 형식
- slug 중복
- 이미지 경로
- 제목 구조
- 원문 URL 기록 여부

원문 URL은 필수는 아니지만, Notion 게시 URL이 있다면 `sourceUrl`로 남기는 것을 권장합니다.

## GitHub PR 준비

도구의 `브랜치·Draft PR 준비` 버튼은 다음 흐름을 시도합니다.

1. Git 상태 확인
2. 콘텐츠 브랜치 생성
3. 생성된 활동보고와 이미지 add
4. commit
5. push
6. `gh pr create --draft` 실행

로컬에 GitHub CLI(`gh`)가 없으면 Draft PR 명령어를 결과창에 표시합니다.

## 제외 범위

이번 버전에서는 다음을 구현하지 않습니다.

- PDF/DOCX 가져오기
- OpenAI API 연동
- 예약 게시
- 다중 사용자
- OAuth
- Electron/Tauri
- 범용 CMS
