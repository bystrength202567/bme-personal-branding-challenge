# B, Me 퍼스널 브랜딩 챌린지

정적인 MVP입니다. 로그인·개인별 데이터·공개 브랜드 북·커뮤니티를 Supabase로 연결하기 위한 화면 흐름을 포함하며, 현재 데모 데이터와 개인 기록은 브라우저 `localStorage`에 저장됩니다.

## 배포

Vercel에서 이 저장소를 import하면 별도의 빌드 과정 없이 배포됩니다.

## Supabase 연결 시 필요한 테이블

- `profiles` — 사용자 프로필과 졸업 여부
- `daily_answers` — 일자별 1문 1답
- `mission_progress` — 미션 완료와 업로드 자료 URL
- `brand_books` — 공개 여부가 있는 브랜드 북
- `community_posts` — After B, Me 게시물

인증은 Supabase Auth의 이메일 매직 링크 또는 Google 로그인으로 구성하는 것을 권장합니다. 공개 브랜드 북과 게시물에는 RLS 정책으로 `is_public = true`인 항목만 비로그인 사용자에게 노출해야 합니다.

## 달빛 한국사 여행 (`/history`)

고조선 · 삼국시대 · 통일신라 · 고려 · 조선 · 대한제국 중 시대를 골라 들어가는 한국사 학습 앱입니다.

- 시대별 소개 · 연표 · 인물 · 재미있는 사실
- 시대별 퀴즈 (4문제 중 3문제 이상 맞히면 도장 획득, `localStorage` 저장)
- 이름 + 생년월일로 보는 "그 시대 나의 전생" 결과 카드

콘텐츠는 `history/data.js`의 `ERAS` 배열만 수정하면 추가·변경됩니다. 배포 후 `/history/` 경로로 접속하세요.
