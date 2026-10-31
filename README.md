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

### 🚀 배포하기 (하나만 고르세요)

| 방법 | 할 일 | 주소 |
|---|---|---|
| **GitHub Pages** ✅ 배포 중 | main의 `history/`가 바뀌면 자동으로 다시 배포돼요 (gh-pages 브랜치) | https://bystrength202567.github.io/korea-time-travel/ |
| **Vercel** | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbystrength202567%2Fkorea-time-travel&root-directory=history&project-name=moonlight-korean-history) | Vercel이 알려 주는 주소 |
| **Netlify** | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/bystrength202567/korea-time-travel) | Netlify가 알려 주는 주소 |

- `gh-pages` 브랜치는 main의 `history/`가 바뀔 때마다 GitHub Actions가 자동으로 갱신해요.
- 배포한 뒤 Supabase **Authentication → URL Configuration**의 **Site URL**과 **Redirect URLs**에 그 주소를 넣어 주세요.
- Vercel·Netlify를 쓰면 `history/config.js`의 `officialUrl`도 그 주소로 바꿔 주세요.
- 자세한 순서는 [`history/SETUP.md`](history/SETUP.md)에 있어요.

고조선 · 삼국시대 · 통일신라 · 고려 · 조선 · 대한제국 중 시대를 골라 들어가는 한국사 학습 앱입니다. 한국어/영어(KO/EN)를 지원합니다.

- 시대별 소개 · 연표 · 인물 · 재미있는 사실 · 퀴즈 (3/4 이상 정답 시 도장)
- 이름 + 생년월일로 보는 6개 시대 전생 결과, 이미지 저장
- **궁궐은 가입 없이 바로 입장**. 회원가입은 선택(오른쪽 위 👤 회원가입): 이메일 · 국적 · 이름 · 나이 구분(만 14세 미만은 보호자 이메일·동의) · 개인정보 처리방침 동의
  - `config.js`에 Supabase 값을 넣으면 이메일 인증 가입, 회원 정보·도장 서버 저장, 회원 탈퇴, 실시간 함께 접속이 켜져요 → [`history/SETUP.md`](history/SETUP.md)
  - 비워 두면 체험 모드(브라우저 저장, 같은 브라우저 탭끼리만 함께 접속)
- 개인정보 처리방침 페이지(`#privacy`), 🔗 공유하기(링크 복사 · QR코드)
- **시대별 3D 궁궐** (`palace-eras.js`)
  - 고조선 왕검성(상상 복원: 토성, 초가 큰 집, 제단, 고인돌, 청동기 대장간, 움집)
  - 삼국시대 고구려 안학궁(남문 3개, 외전·내전·침전, 붉은 기와, 정원과 가산, 수렵도 벽화)
  - 통일신라 월성과 동궁·월지(반달 모양 토성, 연못과 섬 3개, 임해전, 첨성대, 계림)
  - 고려 개경 만월대(계단식 축대, 승평문·신봉문·창합문, 높은 계단 위 회경전, 송악산)
  - 조선 경복궁(광화문~근정전~향원정, 경회루 48개 돌기둥, 일월오봉도)
  - 대한제국 덕수궁(동쪽 대한문, 중화전, 석조전과 분수 정원, 정관헌, 석어당, 중명전, 전차)
  - 시대별 옷차림(익선관·금관·조우관·복두·사모·전립·어여머리 등)으로 왕·왕비·왕자·공주·문관·무관·궁녀·시종 꾸미기
  - 임금의 일과 동작: 산책하기 · 책읽기 · 식사하기 · 잠자기 · 휴식하기 · 인사하기, 가까이 가면 말 걸기
  - 접속한 사람의 현재 시각에 따라 새벽·아침·낮·오후·저녁·밤으로 하늘·햇빛·그림자·불빛이 바뀜
  - 같은 시대 궁궐(마루 1)에 들어온 회원끼리 서로의 캐릭터·위치·동작이 실시간으로 보여요. 돌아다니는 궁인은 컴퓨터 캐릭터예요
  - 실제 궁궐을 단순화한 모형이에요

파일 구성: `config.js`(운영 설정), `backend.js`(Supabase 연결·실시간), `supabase.sql`(DB), `data.js`·`data.en.js`(시대 콘텐츠), `app.js`(화면·언어·회원가입), `world.js`(3D 엔진·캐릭터·동작), `palace.js`(꾸미기·하늘·건축 도구), `palace-eras.js`(시대별 궁궐). 3D는 입장할 때 cdnjs에서 three.js r128을 불러옵니다.
