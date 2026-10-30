// 운영 설정. Supabase 프로젝트를 만든 뒤 아래 두 값을 채우면 실제 회원가입·기록 저장·함께 접속이 켜져요.
// (비워 두면 지금처럼 이 브라우저에만 저장하는 체험 모드로 동작해요.) 자세한 방법은 SETUP.md를 보세요.
window.DALBIT_CONFIG = {
  supabaseUrl: "", // 예: "https://abcdefgh.supabase.co"
  supabaseAnonKey: "", // Project Settings → API → anon public key (공개해도 되는 키예요)
  operatorName: "", // 개인정보 처리방침에 표시할 운영자(개인 또는 단체) 이름
  contactEmail: "", // 개인정보 관련 문의를 받을 이메일
};
