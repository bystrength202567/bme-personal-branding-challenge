# 달빛 한국사 여행 운영 가이드

`config.js`가 비어 있으면 **체험 모드**(회원 정보·도장은 이 기기 브라우저에만 저장, 함께 접속은 같은 브라우저의 다른 탭끼리만)로 동작해요.
아래 순서를 따라 하면 **실제 회원가입(이메일 인증) · 기기와 상관없는 도장 기록 · 다른 사람들과 함께 접속**이 켜져요.

## 0. 꼭 알아 둘 점: claude.ai 아티팩트 링크에서는 실제 회원가입이 안 돼요

claude.ai 아티팩트 화면은 보안 정책으로 외부 서버(Supabase 포함) 연결을 모두 막아요. 그래서 아티팩트 링크에서는 자동으로 **체험 모드**(이 기기에만 저장)로 동작하고, 그 사실을 가입 화면에 안내해요.
**실제 회원가입·도장 저장·함께 접속은 공식 사이트(GitHub Pages 또는 Vercel)에서만** 동작해요.

## 1-A. 공식 사이트: GitHub Pages (권장, 무료)

1. main에 `history/`가 바뀔 때마다 Actions가 `gh-pages` 브랜치로 사이트 파일을 올려요 (`.github/workflows/pages.yml`).
2. 공개 저장소는 보통 `gh-pages` 브랜치가 생기면 Pages가 자동으로 켜져요. 켜지지 않았다면 저장소 **Settings → Pages → Source**를 **Deploy from a branch**, 브랜치 **gh-pages / (root)**로 골라 주세요.
3. 주소: <https://bystrength202567.github.io/korea-time-travel/>
4. Supabase **Authentication → URL Configuration**에서 **Site URL**과 **Redirect URLs**에 위 주소를 넣어요.

## 1-B. 공식 사이트: Vercel (선택)

1. <https://vercel.com>에 GitHub 계정으로 로그인 → **Add New → Project** → `korea-time-travel` **Import** → **Deploy**
   (이미 연결돼 있다면 main에 합쳐질 때마다 자동으로 배포돼요.)
2. 배포된 주소 뒤에 `/history/`를 붙인 주소가 서비스 주소예요. 예: `https://내프로젝트.vercel.app/history/`
3. (선택) **Settings → Domains**에서 원하는 도메인을 연결할 수 있어요.

## 2. Supabase 프로젝트 만들기 (무료로 시작)

1. <https://supabase.com> 가입 → **New project**
   - Region: 한국 이용자가 많다면 **Northeast Asia (Seoul)** 를 권장해요.
2. 왼쪽 **SQL Editor** → `history/supabase.sql` 내용을 그대로 붙여 넣고 **Run**
   - 회원 정보(`members`)와 도장 기록(`progress`) 표가 만들어지고, 각 회원은 자기 정보만 읽고 쓸 수 있게 잠겨요(RLS).
3. **Authentication → URL Configuration**
   - **Site URL**: 1번의 공식 사이트 주소 (GitHub Pages면 `https://bystrength202567.github.io/korea-time-travel/`)
   - **Redirect URLs**에도 같은 주소를 추가해요. (가입 메일의 링크가 이 주소로 돌아와요.)
4. **Authentication → Providers → Email** 이 켜져 있는지 확인해요.
   - **Authentication → Emails → Templates**의 **Confirm signup**과 **Magic Link** 템플릿 본문에 `{{ .Token }}`을 넣어 주세요 (예: `인증 코드: {{ .Token }}`).
     claude.ai 아티팩트 화면에서는 메일 링크가 페이지로 돌아올 수 없어서, 메일의 인증 코드를 화면에 입력해 가입을 마쳐요.
5. (실제 운영 권장) **Authentication → Emails → SMTP Settings**에서 메일 발송 서비스를 연결해요.
   Supabase 기본 메일은 시간당 보낼 수 있는 양이 아주 적어서, 사람이 많이 가입하면 메일이 늦거나 안 갈 수 있어요.

## 3. `config.js` 채우기

**Project Settings → API**에서 두 값을 복사해 `history/config.js`에 넣어요.

```js
window.DALBIT_CONFIG = {
  supabaseUrl: "https://abcdefgh.supabase.co",
  supabaseAnonKey: "eyJ...", // anon public key (공개용 키라 사이트에 넣어도 돼요)
  operatorName: "운영자 이름 또는 단체 이름",
  contactEmail: "개인정보 문의를 받을 이메일",
};
```

> ⚠️ `service_role` 키는 절대 넣지 마세요. 모든 정보를 볼 수 있는 관리자 키예요.

GitHub에 올려 main에 합치면 Vercel이 다시 배포하고, 그때부터 실제 서버 모드로 동작해요.

## 4. 개인정보 처리방침 확인

- 사이트의 `#privacy` 페이지(화면 아래 **개인정보 처리방침 · Privacy** 링크)에 운영자 이름과 문의 이메일이 나타나는지 확인해요.
- 처리방침은 이 서비스가 실제로 하는 일을 바탕으로 쓴 초안이에요. 학교·기관 이름으로 운영하거나 수집 항목이 바뀌면 꼭 다시 검토해 주세요.
- 만 14세 미만은 가입할 때 보호자 이메일과 보호자 동의 체크를 받아요. 보호자에게 별도 확인 메일을 보내는 등 더 확실한 확인 방법이 필요하면 추가로 만들어야 해요.

## 5. 회원 관리

- Supabase **Table Editor → members**에서 가입자 목록(이메일·국적·이름·나이 구분)을 볼 수 있어요.
- 이용자는 사이트 오른쪽 위 👤 회원 표시 → **회원 탈퇴**로 계정·회원 정보·도장 기록을 스스로 지울 수 있어요.

## 6. 함께 접속(실시간)

- 서버 모드에서는 같은 시대의 궁궐(마루 1)에 들어온 회원끼리 서로의 캐릭터·위치·동작(산책·책읽기·식사·잠·휴식·인사)이 실시간으로 보여요.
- Supabase Realtime(무료 요금제는 동시 접속 수 제한이 있어요)을 사용하며, 위치 정보는 저장하지 않고 전달만 해요.

## 7. 공유하기

- 사이트 오른쪽 위 🔗 버튼을 누르면 QR코드와 링크 복사 버튼이 나와요. 학교·학부모 모임·SNS에 공유해 보세요.
