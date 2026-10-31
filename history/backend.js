// 서버 연결: config.js에 Supabase 값이 있으면 이메일 인증 회원가입 · 회원 정보/도장 저장 · 실시간 함께 접속을 써요.
// 값이 없으면 브라우저 저장(체험 모드)과 같은 기기의 다른 탭끼리만 보이는 BroadcastChannel로 동작해요.
const SUPABASE_JS = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js";
const PENDING_KEY = "dalbit-history-pending-signup";

const Backend = {
  config: window.DALBIT_CONFIG || {},
  client: null,
  user: null,
  nextHash: "", // 메일 링크로 돌아온 뒤 이어서 갈 화면
  // claude.ai 아티팩트 미리보기처럼 외부 서버 연결이 막힌 화면이면 true (그때는 체험 모드로 동작)
  blocked: false,
  get enabled() {
    return !!(this.config.supabaseUrl && this.config.supabaseAnonKey);
  },

  // 페이지를 열 때 한 번: 라이브러리를 불러오고, 이메일 링크로 돌아온 경우 가입을 마무리해요.
  async init() {
    if (!this.enabled) return;
    try {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = SUPABASE_JS;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
      // 먼저 회원 서버에 닿는지 확인해요. claude.ai 아티팩트 화면은 외부 연결을 막아서 여기서 실패해요.
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 6000);
      try {
        await fetch(`${this.config.supabaseUrl}/auth/v1/health`, { headers: { apikey: this.config.supabaseAnonKey }, signal: ctl.signal });
      } catch {
        this.blocked = window.self !== window.top;
        throw new Error("member server unreachable");
      } finally {
        clearTimeout(timer);
      }
      this.client = window.supabase.createClient(this.config.supabaseUrl, this.config.supabaseAnonKey);
      const { data } = await this.client.auth.getSession();
      await this.onSession(data.session);
      this.client.auth.onAuthStateChange((_event, session) => this.onSession(session).then(() => window.dispatchEvent(new Event("member-changed"))));
    } catch (e) {
      console.warn("Supabase를 불러오지 못했어요", e);
      this.client = null;
    }
  },

  async onSession(session) {
    this.user = session?.user || null;
    if (!this.user) return;
    const pending = readJSON(PENDING_KEY);
    if (pending && pending.email?.toLowerCase() === this.user.email?.toLowerCase()) {
      if (await this.saveProfile(pending, false)) {
        localStorage.removeItem(PENDING_KEY);
        this.nextHash = pending.next || "";
      }
    }
    const { data: row } = await this.client.from("members").select("*").eq("id", this.user.id).maybeSingle();
    if (row) {
      writeJSON(MEMBER_KEY, { email: row.email, name: row.name, country: row.country, ageGroup: row.age_group, guardianEmail: row.guardian_email, joinedAt: row.created_at, verified: true });
      await this.pullStamps();
    }
  },

  // 회원 정보 저장 (메일 링크를 다른 기기에서 연 경우에는 그 기기에서 가입 양식을 한 번 더 채워 저장해요)
  async saveProfile(info, refresh = true) {
    const { error } = await this.client.from("members").upsert({
      id: this.user.id,
      email: this.user.email,
      name: info.name,
      country: info.country,
      age_group: info.ageGroup,
      guardian_email: info.guardianEmail || null,
      consented_at: info.consentedAt,
    });
    if (error) return false;
    if (refresh) await this.onSession({ user: this.user });
    return true;
  },

  // 가입: 확인 메일(로그인 링크)을 보내요. 링크를 누르면 이 사이트로 돌아와 가입이 끝나요.
  async signUp(info) {
    writeJSON(PENDING_KEY, { ...info, next: location.hash });
    // 로그인 정보가 주소 뒤(#)에 붙어 돌아오므로, 돌아올 주소에는 #를 붙이지 않아요
    const redirect = location.origin + location.pathname;
    const { error } = await this.client.auth.signInWithOtp({ email: info.email, options: { emailRedirectTo: redirect } });
    if (error) throw error;
  },

  // 메일에 적힌 인증 코드로 가입·로그인을 마쳐요 (claude.ai 아티팩트 화면처럼 메일 링크가 돌아올 수 없는 곳에서도 동작)
  async verifyCode(email, token) {
    const { data, error } = await this.client.auth.verifyOtp({ email, token, type: "email" });
    if (error) throw error;
    await this.onSession(data.session);
  },

  async pullStamps() {
    if (!this.client || !this.user) return;
    const { data } = await this.client.from("progress").select("stamps").eq("user_id", this.user.id).maybeSingle();
    const merged = { ...(data?.stamps || {}), ...loadStamps() };
    writeJSON(STAMP_KEY, merged);
    if (Object.keys(merged).length !== Object.keys(data?.stamps || {}).length) await this.pushStamps(merged);
  },
  async pushStamps(stamps) {
    if (!this.client || !this.user) return;
    await this.client.from("progress").upsert({ user_id: this.user.id, stamps, updated_at: new Date().toISOString() });
  },

  // 회원 탈퇴: 서버의 회원 정보·기록·계정을 지워요 (supabase.sql의 delete_my_account 함수)
  async deleteAccount() {
    if (this.client && this.user) {
      const { error } = await this.client.rpc("delete_my_account");
      if (error) throw error;
      await this.client.auth.signOut();
    }
    this.user = null;
  },

  // 같은 궁궐(방)에 들어온 사람들끼리 위치·동작을 주고받는 통로
  joinRoom(name, onMessage, onPeople) {
    if (this.client && this.user) {
      const ch = this.client.channel(`room:${name}`, { config: { broadcast: { self: false }, presence: { key: this.user.id } } });
      ch.on("broadcast", { event: "msg" }, ({ payload }) => onMessage(payload));
      ch.on("presence", { event: "sync" }, () => onPeople(Object.keys(ch.presenceState()).length));
      ch.on("presence", { event: "leave" }, ({ key }) => onMessage({ type: "leave", id: key }));
      ch.subscribe((status) => status === "SUBSCRIBED" && ch.track({ at: Date.now() }));
      return {
        id: this.user.id,
        send: (payload) => ch.send({ type: "broadcast", event: "msg", payload: { ...payload, id: this.user.id } }),
        leave: () => this.client.removeChannel(ch),
      };
    }
    // 체험 모드: 같은 브라우저의 다른 탭끼리만 연결돼요
    if (!("BroadcastChannel" in window)) return null;
    const id = `local-${Math.random().toString(36).slice(2, 10)}`;
    const bc = new BroadcastChannel(`dalbit-room-${name}`);
    const seen = new Map();
    bc.onmessage = ({ data }) => {
      if (data.id === id) return;
      seen.set(data.id, Date.now());
      onMessage(data);
      if (data.type === "leave") seen.delete(data.id);
      onPeople(seen.size + 1);
    };
    const timer = setInterval(() => {
      const now = Date.now();
      seen.forEach((t, k) => {
        if (now - t > 6000) {
          seen.delete(k);
          onMessage({ type: "leave", id: k });
        }
      });
      onPeople(seen.size + 1);
    }, 2000);
    onPeople(1);
    return {
      id,
      send: (payload) => bc.postMessage({ ...payload, id }),
      leave: () => {
        bc.postMessage({ type: "leave", id });
        clearInterval(timer);
        bc.close();
      },
    };
  },
};

function readJSON(key) {
  try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
