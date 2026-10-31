// 운영 설정. Supabase 프로젝트를 만든 뒤 아래 두 값을 채우면 실제 회원가입·기록 저장·함께 접속이 켜져요.
// (비워 두면 지금처럼 이 브라우저에만 저장하는 체험 모드로 동작해요.) 자세한 방법은 SETUP.md를 보세요.
window.DALBIT_CONFIG = {
  supabaseUrl: "https://pvsraldulblrftieowkf.supabase.co",
  // anon public key: 공개용 키라 사이트에 넣어도 돼요 (service_role 키는 절대 넣지 마세요)
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2c3JhbGR1bGJscmZ0aWVvd2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNjAyOTAsImV4cCI6MjEwODkzNjI5MH0.SzTr8dRwbredJoHyu4kmCudkV7ls9C8cuEoH5HGluno",
  operatorName: "스텔라", // 개인정보 처리방침에 표시할 운영자
  contactEmail: "nan1985@hanmail.net", // 개인정보 관련 문의 이메일
  // 공유 버튼(QR코드)에 넣을 주소. 비워 두면 지금 열린 주소를 써요.
  // 단, claude.ai 아티팩트 화면 안에서는 실제 주소를 알 수 없어서 artifactUrl을 써요.
  siteUrl: "",
  // 실제 회원가입이 되는 공식 사이트 (GitHub Pages). claude.ai 미리보기 화면에서 안내 링크로 보여요.
  officialUrl: "https://bystrength202567.github.io/bme-personal-branding-challenge/",
  artifactUrl: "https://claude.ai/artifact/ECAJffSiiuVVWLcjJ7r5uh",
};
