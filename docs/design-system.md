# Design System

Altibase Union 홈페이지의 디자인 기준 문서다. 모든 UI 변경은 Corporate, Clean, Trust, Readability, Simplicity를 우선한다.

## 1. 프로젝트 디자인 철학

- Altibase 공식 홈페이지와 조화되는 기업형 톤을 유지한다.
- 노동조합의 신뢰, 소통, 권익 보호를 차분하게 표현한다.
- 장식보다 정보 구조와 가독성을 우선한다.

## 2. Color Palette

- Navy: `#0F2747`
- Blue: `#174EA6`
- Background: `#F6F8FC`
- Surface: `#FFFFFF`
- Text: `#182233`
- Muted: `#667085`
- Border: `#D9E2EF`
- Accent: `#FFB21A`

## 3. Typography

- 기본 폰트는 시스템 sans-serif와 `Noto Sans KR` 계열을 사용한다.
- Article 본문은 18px, line-height 1.85를 기준으로 한다.
- 제목은 짧고 명확하게 유지하며 과도하게 크게 만들지 않는다.

## 4. Spacing

- Section 간격은 48px 전후를 기본으로 한다.
- Article 문단 간격은 2rem을 기준으로 한다.
- 모바일에서는 여백을 줄이되 본문 가독성을 유지한다.

## 5. Border Radius

- 기본 radius는 8px이다.
- 대표 이미지와 큰 시각 요소는 10px까지 허용한다.
- 과도한 둥근 모서리는 사용하지 않는다.

## 6. Shadow

- Shadow는 정보 계층을 구분하기 위한 최소 수준으로 사용한다.
- 기본 shadow는 `0 12px 28px rgba(15, 39, 71, 0.08)`이다.

## 7. Card

- 카드에는 흰 배경, 1px border, 낮은 shadow를 적용한다.
- 카드 내부에 중첩 카드를 만들지 않는다.
- 목록 카드는 제목, 요약, 날짜를 우선한다.

## 8. Button

- 주요 행동에는 Blue 버튼을 사용한다.
- 보조 행동에는 outline 버튼을 사용한다.
- 버튼 텍스트는 짧게 유지한다.

## 9. Badge

- 카테고리와 태그는 badge 형태로 표현한다.
- Badge는 정보 보조 역할이며 과도하게 강조하지 않는다.

## 10. Lucide Icons 사용 규칙

- 아이콘은 작성일, 작성자, 태그, 목록, Quick Links, Footer Email 등 정보 탐색에 필요한 곳에만 사용한다.
- 아이콘 단독 버튼은 피하고 텍스트와 함께 사용한다.
- 아이콘 크기는 16-24px 범위로 유지한다.

## 11. Section Title 규칙

- 메뉴는 한글을 유지한다.
- Home Section은 `NOTICE`, `ACTIVITY`처럼 영문만 사용한다.
- Article은 게시글 제목만 크게 사용하고, 카테고리는 badge로 표시한다.

## 12. Article Layout 규칙

- 구조는 Breadcrumb, Category Badge, Title, Meta, Summary, Hero Image, Body, Footer 순서다.
- 본문 최대 폭은 760px을 기준으로 한다.
- 공지사항과 활동보고는 같은 Article Layout을 사용한다.

## 13. 대표 이미지 규격

- 권장 비율은 16:9 또는 4:3이다.
- 권장 너비는 1200px 이상이다.
- 대표 이미지는 제목 아래에 표시한다.
- 대표 이미지가 없으면 해당 영역은 렌더링하지 않는다.

## 14. Responsive 기준

- 모바일에서는 카드와 Quick Links를 1열로 배치한다.
- Article 제목은 모바일에서 1.9rem 전후로 제한한다.
- 본문 폰트는 모바일에서 16px까지 낮출 수 있다.

## 15. Corporate Style 원칙

- 과도한 색상, 애니메이션, 투쟁 이미지는 사용하지 않는다.
- 정보 구조, 여백, 정돈된 타이포그래피로 신뢰감을 만든다.
- 새 기능보다 유지보수성과 일관성을 우선한다.
