const app = document.getElementById("app");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const STAMP_KEY = "dalbit-history-stamps";
const PROFILE_KEY = "dalbit-history-profile";
const LANG_KEY = "dalbit-history-lang";
const TAB_IDS = ["intro", "timeline", "people", "facts", "quiz", "life"];

/* ---------- 언어 ---------- */
const STR = {
  ko: {
    title: "달빛 한국사 여행",
    stamp: "도장",
    footer: "고조선에서 대한제국까지, 달빛을 따라 걷는 우리 역사.",
    footnote: "연도와 내용은 교과서·《삼국사기》·《삼국유사》 등 일반적인 통설을 따랐어요. 전생 풀이는 재미로만 봐 주세요 🌙",
    tabs: ["📖 시대 소개", "🗓️ 연표", "👤 인물", "✨ 재미있는 사실", "📝 퀴즈", "🌙 나의 전생"],
    heroTitle: "달빛을 따라<br /><em>어느 시대</em>로 떠나볼까요?",
    heroLead: "고조선부터 대한제국까지, 가고 싶은 시대를 골라 캐릭터로 입장해 보세요. 위인과 대화하고, 퀴즈를 풀고, 그 시대의 나는 누구였을지 전생도 알아봐요.",
    lifeHomeTitle: "🌙 나의 전생 결과 보기",
    lifeHomeText: "이름과 생년월일을 넣으면 고조선부터 대한제국까지, <b>6개 시대의 내 전생</b>을 한 번에 알려드려요.",
    name: "이름",
    namePh: "예: 홍길동",
    birth: "생년월일",
    seeLife: "전생 결과 보기 →",
    chooseEra: "🕰️ 시대 선택",
    enterable: "🚪 입장 가능",
    howTitle: "🧭 이렇게 즐겨요",
    how: [
      ["① 캐릭터로 입장", "시대를 골라 캐릭터를 정하고 3D 공간에 들어가요."],
      ["② 대화하고 풀기", "위인과 대화하고 이야기 비석을 읽고, 시험관의 퀴즈를 통과하면 도장 획득!"],
      ["③ 나의 전생", "이름과 생일을 넣으면 그 시대의 나는 누구였는지 알려드려요."],
    ],
    passed: "퀴즈 통과",
    home: "← 처음으로",
    loadingLife: (n) => `달빛이 ${n}님의 전생 기록을 넘기는 중…`,
    lifeOf: (n) => `${n}님의 전생 결과`,
    strongest: "가장 강하게 남은 전생",
    saveImg: "📷 이미지로 저장",
    copy: "결과 복사하기",
    again: "다시 하기",
    byEra: "🕰️ 시대별 나의 전생",
    pts: "점",
    hintEra: "시대를 누르면 그 시대 이야기와 퀴즈로 들어가요.",
    youAre: (n) => `${n}님은`,
    wit: "지혜", courage: "용기", luck: "행운",
    fate: (p) => `🤝 전생에 <b>${p}</b>와(과) 스쳐 지나간 인연이 있어요.`,
    copied: "복사 완료 ✓",
    copyFail: "복사할 수 없어요",
    shareAll: (n, list, main, url) => `🌙 달빛 한국사 여행\n${n}님의 전생 결과\n${list}\n👉 가장 강한 전생: ${main}\n${url}`,
    shareOne: (n, era, l, url) => `🌙 달빛 한국사 여행\n${n}님의 ${era} 전생은 ${l.emoji} ${l.role}!\n${l.desc}\n${url}`,
    mainOf: (era, role) => `${era}의 ${role}`,
    fileName: (n) => `${n}-전생결과.png`,
    backEras: "← 시대 선택으로",
    enterBtn: "🚪 캐릭터로 입장하기",
    enterPalace: (place) => `🏯 ${place} 입장하기`,
    palaceTag: (place) => `🏯 ${place} 입장`,
    signupTitle: "회원가입",
    signupLead: "회원가입은 선택이에요. 가입하지 않아도 궁궐에 바로 들어갈 수 있어요. 가입하면 도장 기록을 회원 서버에 저장할 수 있어요.",
    joinChip: "회원가입",
    email: "이메일 주소",
    emailPh: "예: hong@example.com",
    country: "국적",
    countryPick: "국적을 골라 주세요",
    countryOther: "기타",
    memberName: "이름",
    consent: "회원 정보(이메일·국적·이름)를 입장과 이용에 쓰는 데 동의해요.",
    storageNote: "지금은 회원 정보가 이 기기의 브라우저에만 저장되고 다른 곳으로 보내지지 않아요.",
    signupBtn: "가입하고 입장하기",
    emailBad: "이메일 주소를 다시 확인해 주세요.",
    needCountry: "국적을 골라 주세요.",
    needConsent: "동의에 체크해 주세요.",
    member: "회원",
    memberInfo: "내 회원 정보",
    signout: "회원 정보 지우기",
    signoutDone: "회원 정보를 지웠어요.",
    welcome: (n) => `${n}님, 환영해요!`,
    next: { timeline: "연표 보러 가기 →", people: "인물 만나기 →", facts: "재미있는 사실 →", quiz: "퀴즈 도전! →" },
    qNum: (i, t) => `문제 ${i} / ${t}`,
    right: "⭕ 정답!", wrong: "❌ 아쉬워요!",
    nextQ: "다음 문제 →", seeResult: "결과 보기 →",
    gotStamp: (era) => `<b>${era}</b> 도장을 받았어요! 이 시대의 역사 박사 인정 🎉`,
    needMore: (p) => `${p}문제 이상 맞히면 도장을 받을 수 있어요. 한 번 더 도전해 볼까요?`,
    retry: "다시 풀기",
    toLife: "🌙 이 시대 나의 전생은?",
    lifeIntro: (era) => `이름과 생년월일을 알려주면, 달빛이 <b>${era}</b> 시대 당신의 전생을 비춰 드려요.`,
    lifeBtn: "🌙 전생 알아보기",
    loadingEra: (era) => `달빛이 ${era}의 기록을 넘기는 중…`,
    lifeRecord: "전생 기록",
    allLives: "🌙 전체 시대 전생 보기 →",
    board: "🏮 역사 도장판",
    boardAll: "모든 시대를 정복했어요! 진정한 한국사 마스터 👑",
    boardSome: (c, t) => `퀴즈를 통과하면 도장이 찍혀요. (${c}/${t})`,
  },
  en: {
    title: "Moonlit Korean History",
    stamp: "Stamps",
    footer: "From Gojoseon to the Korean Empire, walk through Korean history by moonlight.",
    footnote: "Dates and facts follow mainstream textbook accounts and classics like the Samguk Sagi and Samguk Yusa. Past-life readings are just for fun 🌙",
    tabs: ["📖 Overview", "🗓️ Timeline", "👤 People", "✨ Fun Facts", "📝 Quiz", "🌙 Past Life"],
    heroTitle: "Follow the moonlight —<br /><em>which era</em> will you visit?",
    heroLead: "From Gojoseon to the Korean Empire, pick an era and enter it as a character. Talk with historical figures, take quizzes, and discover who you were in a past life.",
    lifeHomeTitle: "🌙 Discover Your Past Lives",
    lifeHomeText: "Enter your name and birthday to see <b>who you were in all six eras</b> of Korean history.",
    name: "Name",
    namePh: "e.g. Alex",
    birth: "Date of birth",
    seeLife: "See my past lives →",
    chooseEra: "🕰️ Choose an Era",
    enterable: "🚪 Enter as a character",
    howTitle: "🧭 How to Play",
    how: [
      ["① Enter as a character", "Choose an era, pick your character and step into a 3D world."],
      ["② Talk & solve", "Talk with historical figures, read story stones, and pass the examiner's quiz to earn a stamp!"],
      ["③ Your past life", "Enter your name and birthday to find out who you were in that era."],
    ],
    passed: "Quiz passed",
    home: "← Home",
    loadingLife: (n) => `The moonlight is turning the pages of ${n}'s past lives…`,
    lifeOf: (n) => `${n}'s past lives`,
    strongest: "Your strongest past life",
    saveImg: "📷 Save as image",
    copy: "Copy result",
    again: "Try again",
    byEra: "🕰️ Your Past Life in Each Era",
    pts: "pts",
    hintEra: "Tap an era to explore its stories and quiz.",
    youAre: (n) => `${n}, you were a`,
    wit: "Wisdom", courage: "Courage", luck: "Luck",
    fate: (p) => `🤝 In that life, your path crossed with <b>${p}</b>.`,
    copied: "Copied ✓",
    copyFail: "Couldn't copy",
    shareAll: (n, list, main, url) => `🌙 Moonlit Korean History\n${n}'s past lives\n${list}\n👉 Strongest: ${main}\n${url}`,
    shareOne: (n, era, l, url) => `🌙 Moonlit Korean History\nIn ${era}, ${n} was a ${l.emoji} ${l.role}!\n${l.desc}\n${url}`,
    mainOf: (era, role) => `${role} of ${era}`,
    fileName: (n) => `${n}-past-life.png`,
    backEras: "← All eras",
    enterBtn: "🚪 Enter as a character",
    enterPalace: (place) => `🏯 Enter ${place}`,
    palaceTag: (place) => `🏯 Enter ${place}`,
    signupTitle: "Sign up",
    signupLead: "Signing up is optional — you can enter the palaces right away. Members can save their stamps on the member server.",
    joinChip: "Sign up",
    email: "Email address",
    emailPh: "e.g. alex@example.com",
    country: "Nationality",
    countryPick: "Choose your nationality",
    countryOther: "Other",
    memberName: "Name",
    consent: "I agree that my details (email, nationality, name) are used to let me enter and use the site.",
    storageNote: "For now, your details are saved only in this device's browser and are not sent anywhere.",
    signupBtn: "Sign up & enter",
    emailBad: "Please check your email address.",
    needCountry: "Please choose your nationality.",
    needConsent: "Please check the consent box.",
    member: "Member",
    memberInfo: "My member info",
    signout: "Delete my member info",
    signoutDone: "Your member info was deleted.",
    welcome: (n) => `Welcome, ${n}!`,
    next: { timeline: "See the timeline →", people: "Meet the people →", facts: "Fun facts →", quiz: "Take the quiz! →" },
    qNum: (i, t) => `Question ${i} / ${t}`,
    right: "⭕ Correct!", wrong: "❌ Not quite!",
    nextQ: "Next question →", seeResult: "See result →",
    gotStamp: (era) => `You earned the <b>${era}</b> stamp! Certified history expert 🎉`,
    needMore: (p) => `Get ${p} or more right to earn the stamp. Try again?`,
    retry: "Retry",
    toLife: "🌙 My past life in this era?",
    lifeIntro: (era) => `Tell us your name and birthday, and the moonlight will reveal who you were in <b>${era}</b>.`,
    lifeBtn: "🌙 Reveal my past life",
    loadingEra: (era) => `The moonlight is reading the records of ${era}…`,
    lifeRecord: "Past life record",
    allLives: "🌙 See all eras →",
    board: "🏮 History Stamp Board",
    boardAll: "You've conquered every era! True Korean history master 👑",
    boardSome: (c, t) => `Pass a quiz to earn its stamp. (${c}/${t})`,
  },
};

function detectLang() {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "ko") return q;
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved) return saved;
  } catch {}
  return (navigator.language || "ko").startsWith("ko") ? "ko" : "en";
}
let LANG = detectLang();
const T = () => STR[LANG];
const eras = () => (LANG === "en" ? ERAS_EN : ERAS);
const sceneText = (id) => (LANG === "en" ? SCENE_TEXT_EN[id] : SCENES[id]);

function setLang(lang) {
  LANG = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
  applyStaticText();
  route();
}

function applyStaticText() {
  document.documentElement.lang = LANG;
  document.title = T().title;
  document.getElementById("logoText").textContent = T().title;
  document.getElementById("stampLabel").textContent = T().stamp;
  document.getElementById("footerText").textContent = T().footer;
  document.getElementById("footerNote").textContent = T().footnote;
  document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("active", b.dataset.lang === LANG));
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function loadStamps() {
  try { return JSON.parse(localStorage.getItem(STAMP_KEY)) || {}; } catch { return {}; }
}
function saveStamp(id) {
  const stamps = loadStamps();
  stamps[id] = true;
  try { localStorage.setItem(STAMP_KEY, JSON.stringify(stamps)); } catch {}
  updateStampCount();
  Backend.pushStamps(stamps).catch(() => {});
}
function updateStampCount() {
  document.getElementById("stampCount").textContent = Object.keys(loadStamps()).length;
}

// 이름 + 생일 + 시대로 항상 같은 결과가 나오도록 하는 간단한 해시
function hash(str) {
  let h = 2166136261;
  for (const ch of str) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return h >>> 0;
}

function loadProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null; } catch { return null; }
}
function saveProfile(patch) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...loadProfile(), ...patch })); } catch {}
}

// 시대별 전생 결과 계산 (같은 이름·생일이면 항상 같은 결과)
function lifeIndex(era, name, birth) {
  return hash(`${name}|${birth}|${era.id}`) % era.lives.length;
}
function computeLife(era, name, birth) {
  const h = hash(`${name}|${birth}|${era.id}`);
  const [emoji, role, desc] = era.lives[h % era.lives.length];
  const wit = 60 + (h >>> 10) % 41;
  const courage = 60 + (h >>> 16) % 41;
  const luck = 60 + (h >>> 4) % 41;
  const person = era.people[(h >>> 20) % era.people.length][0];
  return { era, emoji, role, desc, wit, courage, luck, person, total: wit + courage + luck };
}

/* ---------- 라우팅 ---------- */
function route() {
  if (window.World) World.leave();
  document.body.classList.remove("in-world");
  const m = location.hash.match(/^#(era|enter|world)\/([\w-]+)(?:\/(\w+))?/) || [];
  const era = eras().find((e) => e.id === m[2]);
  const profile = loadProfile();
  updateMemberChip();
  // 궁궐은 가입 없이 바로 입장해요. 회원가입은 원하는 사람만 (#signup)
  if (location.hash === "#signup") renderSignup();
  else if (era && m[1] === "world") enterWorld(era);
  else if (era && m[1] === "enter") renderCharacterSelect(era);
  else if (era) renderEra(era, TAB_IDS.includes(m[3]) ? m[3] : "intro");
  else if (location.hash === "#life" && profile?.birth) renderLifeAll(profile);
  else if (location.hash === "#privacy") renderPrivacy();
  else renderHome();
}
window.addEventListener("hashchange", route);

/* ---------- 홈 ---------- */
function renderHome() {
  const stamps = loadStamps();
  const t = T();
  app.innerHTML = `
    <section class="hero fade-in">
      <div class="big-moon" aria-hidden="true"></div>
      <p class="eyebrow">KOREAN HISTORY · TIME TRAVEL</p>
      <h1>${t.heroTitle}</h1>
      <p class="lead">${t.heroLead}</p>
    </section>

    <section class="life-home fade-in">
      <div>
        <p class="eyebrow">MY PAST LIFE</p>
        <h2>${t.lifeHomeTitle}</h2>
        <p>${t.lifeHomeText}</p>
      </div>
      ${lifeFormHtml("homeLifeForm", t.seeLife)}
    </section>

    <h2 class="section-title">${t.chooseEra}</h2>
    <div class="era-grid">
      ${eras().map((e, i) => `
        <button class="era-card fade-in" style="--c:${e.color};animation-delay:${i * 70}ms" data-era="${e.id}">
          <span class="order">CHAPTER ${String(i + 1).padStart(2, "0")}</span>
          <span class="emoji">${e.emoji}</span>
          <h3>${e.name}<small>${e.hanja}</small></h3>
          <div class="period">${e.period}</div>
          <p>${e.tagline}</p>
          <span class="enter-tag">${t.palaceTag(palaceInfo(e.id).place)}</span>
          ${stamps[e.id] ? `<span class="stamp" title="${t.passed}">🏮</span>` : ""}
        </button>`).join("")}
    </div>

    <h2 class="section-title">${t.howTitle}</h2>
    <div class="how">${t.how.map(([b, d]) => `<div><b>${b}</b>${d}</div>`).join("")}</div>`;
  app.querySelectorAll("[data-era]").forEach((b) => b.addEventListener("click", () => (location.hash = `era/${b.dataset.era}`)));
  bindLifeForm(app.querySelector("#homeLifeForm"), () => {
    location.hash = "life";
    if (location.hash === "#life") route();
  });
  delete app.dataset.era;
  window.scrollTo(0, 0);
}

function lifeFormHtml(id, submitLabel) {
  const t = T();
  return `
    <form class="fortune-form" id="${id}">
      <label>${t.name}<input name="name" required maxlength="20" placeholder="${t.namePh}" autocomplete="name" /></label>
      <label>${t.birth}<input name="birth" type="date" required min="1900-01-01" max="2026-12-31" /></label>
      <button class="btn" type="submit">${submitLabel}</button>
    </form>`;
}

// 이름·생일 폼 공통 처리: 저장된 값 채우기 + 제출 시 저장
function bindLifeForm(form, onSubmit) {
  const profile = loadProfile();
  if (profile) {
    form.name.value = profile.name || "";
    form.birth.value = profile.birth || "";
  }
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = form.name.value.trim();
    const birth = form.birth.value;
    if (!name || !birth) return;
    saveProfile({ name, birth });
    onSubmit(name, birth);
  });
}

/* ---------- 전체 전생 결과 ---------- */
function renderLifeAll({ name, birth }) {
  const t = T();
  const lives = eras().map((e) => computeLife(e, name, birth));
  const main = lives.reduce((a, b) => (b.total > a.total ? b : a));
  delete app.dataset.era;
  app.style.setProperty("--c", main.era.color);
  app.innerHTML = `<button class="back" data-go="">${t.home}</button>
    <div class="loading"><div class="mini-moon"></div>${t.loadingLife(esc(name))}</div>`;
  app.querySelector("[data-go]").addEventListener("click", () => (location.hash = ""));
  window.scrollTo(0, 0);
  setTimeout(() => {
    if (location.hash !== "#life") return;
    app.innerHTML = `
      <button class="back" data-go="">${t.home}</button>
      <p class="eyebrow" style="text-align:center;margin-top:10px">${t.lifeOf(esc(name))}</p>
      ${lifeCardHtml(main, name, t.strongest)}
      <div class="actions">
        <button class="btn" id="saveImg">${t.saveImg}</button>
        <button class="btn ghost" id="share">${t.copy}</button>
        <button class="btn ghost" id="again">${t.again}</button>
      </div>

      <h2 class="section-title">${t.byEra}</h2>
      <div class="life-list">
        ${lives.map((l) => `
          <button class="life-row${l === main ? " main" : ""}" style="--c:${l.era.color}" data-go="era/${l.era.id}/life">
            <span class="life-row-emoji">${l.emoji}</span>
            <span class="life-row-text">
              <small>${l.era.emoji} ${l.era.name} · ${l.era.period}</small>
              <b>${l.role}</b>
              <span>${l.desc}</span>
            </span>
            <span class="life-row-score">${l.total}<small>${t.pts}</small></span>
          </button>`).join("")}
      </div>
      <p class="hint">${t.hintEra}</p>`;
    app.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => (location.hash = b.dataset.go)));
    app.querySelector("#again").addEventListener("click", () => (location.hash = ""));
    app.querySelector("#saveImg").addEventListener("click", () => saveLifeImage(main, lives, name));
    app.querySelector("#share").addEventListener("click", (ev) =>
      copyText(ev.target, t.shareAll(name, lives.map((l) => `${l.era.name}: ${l.emoji} ${l.role}`).join("\n"), t.mainOf(main.era.name, main.role), location.href.split("#")[0]))
    );
  }, 1400);
}

function lifeCardHtml(l, name, kicker) {
  const t = T();
  return `
    <div class="life-card" style="--c:${l.era.color}">
      <div class="kicker">${esc(l.era.name)} · ${kicker}</div>
      <div class="life-emoji">${l.emoji}</div>
      <h2>${t.youAre(esc(name))}<br />${l.role}</h2>
      <p>${l.desc}</p>
      <div class="life-stats">
        <div>${t.wit}<b>${l.wit}</b></div>
        <div>${t.courage}<b>${l.courage}</b></div>
        <div>${t.luck}<b>${l.luck}</b></div>
      </div>
      <p>${t.fate(l.person)}</p>
    </div>`;
}

async function copyText(btn, text) {
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = T().copied;
  } catch {
    btn.textContent = T().copyFail;
  }
}

// 결과 카드를 1080×1350 이미지로 그려서 내려받기
async function saveLifeImage(main, lives, name) {
  const t = T();
  await document.fonts.ready;
  const W = 1080, H = 1350;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  const bg = g.createRadialGradient(W / 2, 0, 50, W / 2, 300, 1200);
  bg.addColorStop(0, "#2a2f6e");
  bg.addColorStop(0.6, "#0d1030");
  bg.addColorStop(1, "#070818");
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  // 별
  for (let i = 0; i < 90; i++) {
    const r = hash(`${name}${i}`);
    g.fillStyle = `rgba(255,255,255,${0.3 + (r % 70) / 100})`;
    g.beginPath();
    g.arc(r % W, (r >>> 11) % H, 1 + (r >>> 5) % 2, 0, Math.PI * 2);
    g.fill();
  }
  // 달
  g.shadowColor = "#fff4cf";
  g.shadowBlur = 60;
  g.fillStyle = "#fff4cf";
  g.beginPath();
  g.arc(W - 150, 150, 70, 0, Math.PI * 2);
  g.fill();
  g.shadowBlur = 0;

  const serif = '"Gowun Batang", serif';
  const sans = '"Noto Sans KR", sans-serif';
  g.textAlign = "center";
  g.fillStyle = "#f3d27a";
  g.font = `700 30px ${sans}`;
  g.fillText(`${main.era.name} · ${t.strongest}`, W / 2, 130);
  g.font = `150px ${sans}`;
  g.fillText(main.emoji, W / 2, 320);
  g.fillStyle = "#f4efe3";
  g.font = `700 ${LANG === "en" ? 52 : 64}px ${serif}`;
  g.fillText(t.youAre(name), W / 2, 440);
  g.fillStyle = main.era.color;
  g.fillText(main.role, W / 2, 525);
  g.fillStyle = "#b8b4cf";
  g.font = `30px ${sans}`;
  wrapText(g, main.desc, W / 2, 590, 860, 44);

  // 시대별 목록
  let y = 680;
  g.textAlign = "left";
  lives.forEach((l) => {
    g.fillStyle = l === main ? "rgba(243,210,122,.16)" : "rgba(255,255,255,.06)";
    roundRect(g, 90, y, W - 180, 78, 18);
    g.fill();
    g.fillStyle = l.era.color;
    g.font = `700 ${LANG === "en" ? 24 : 28}px ${sans}`;
    g.fillText(l.era.name, 130, y + 50);
    g.fillStyle = "#f4efe3";
    g.font = `${LANG === "en" ? 26 : 30}px ${sans}`;
    g.fillText(`${l.emoji}  ${l.role}`, 380, y + 50);
    y += 90;
  });
  g.textAlign = "center";
  g.fillStyle = "#f3d27a";
  g.font = `700 32px ${serif}`;
  g.fillText(`🌙 ${t.title}`, W / 2, H - 50);

  const a = document.createElement("a");
  a.download = t.fileName(name);
  a.href = cv.toDataURL("image/png");
  a.click();
}

// 줄바꿈: 영어는 단어 단위, 한국어는 글자 단위로 자르기
function wrapText(g, text, x, y, maxW, lineH) {
  const tokens = LANG === "en" ? text.split(/(?<= )/) : [...text];
  let line = "";
  for (const tok of tokens) {
    if (line && g.measureText(line + tok).width > maxW) {
      g.fillText(line.trim(), x, y);
      line = tok;
      y += lineH;
    } else line += tok;
  }
  g.fillText(line.trim(), x, y);
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/* ---------- 시대 상세 ---------- */
function renderEra(era, tab) {
  const t = T();
  const list = eras();
  const idx = list.indexOf(era);
  const prev = list[idx - 1];
  const next = list[idx + 1];
  const isNewEra = app.dataset.era !== era.id;
  app.dataset.era = era.id;
  app.style.setProperty("--c", era.color);
  app.innerHTML = `
    <button class="back" data-go="">${t.backEras}</button>
    <section class="era-hero fade-in">
      <span class="emoji-bg" aria-hidden="true">${era.emoji}</span>
      <h1>${era.name}<small>${era.hanja}</small></h1>
      <div class="period">${era.period}</div>
      <p class="tagline">${era.tagline}</p>
      <button class="btn enter-btn" data-go="enter/${era.id}">${t.enterPalace(palaceInfo(era.id).place)}</button>
    </section>
    <nav class="tabs" role="tablist">
      ${TAB_IDS.map((id, i) => `<button class="tab ${id === tab ? "active" : ""}" role="tab" aria-selected="${id === tab}" data-tab="${id}">${t.tabs[i]}</button>`).join("")}
    </nav>
    <section class="panel fade-in" id="panel"></section>
    <div class="next-era">
      ${prev ? `<button data-go="era/${prev.id}">← ${prev.emoji} ${prev.name}</button>` : "<span></span>"}
      ${next ? `<button class="right" data-go="era/${next.id}">${next.name} ${next.emoji} →</button>` : "<span></span>"}
    </div>`;
  app.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => (location.hash = `era/${era.id}/${b.dataset.tab}`)));
  app.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => (location.hash = b.dataset.go)));
  PANELS[tab](era, document.getElementById("panel"));
  if (isNewEra) window.scrollTo(0, 0);
}

const PANELS = {
  intro(era, el) {
    el.innerHTML = `<p class="intro-text">${era.intro}</p>
      <button class="btn" data-next="timeline">${T().next.timeline}</button>`;
    bindNext(era, el);
  },
  timeline(era, el) {
    el.innerHTML = `<ol class="timeline">${era.timeline.map(([y, d]) => `<li><span class="year">${y}</span>${d}</li>`).join("")}</ol>
      <button class="btn" data-next="people">${T().next.people}</button>`;
    bindNext(era, el);
  },
  people(era, el) {
    el.innerHTML = `<div class="people">${era.people.map(([n, d]) => `<article class="person"><h3>${n}</h3><p>${d}</p></article>`).join("")}</div>
      <button class="btn" data-next="facts">${T().next.facts}</button>`;
    bindNext(era, el);
  },
  facts(era, el) {
    el.innerHTML = `<div class="facts">${era.facts.map((f) => `<div class="fact">${f}</div>`).join("")}</div>
      <button class="btn" data-next="quiz">${T().next.quiz}</button>`;
    bindNext(era, el);
  },
  quiz(era, el) {
    runQuiz(era, el);
  },
  life(era, el) {
    renderLifeForm(era, el);
  },
};

function bindNext(era, el) {
  el.querySelectorAll("[data-next]").forEach((b) => b.addEventListener("click", () => (location.hash = `era/${era.id}/${b.dataset.next}`)));
}

/* ---------- 퀴즈 ---------- */
// onDone이 있으면(3D 공간 안) 결과 화면에서 전생 탭 대신 onDone 버튼을 보여줘요.
function runQuiz(era, el, onDone) {
  const t = T();
  const total = era.quiz.length;
  const pass = Math.ceil(total * 0.75);
  let i = 0;
  let score = 0;

  const showQuestion = () => {
    const q = era.quiz[i];
    el.innerHTML = `
      <div class="quiz-progress"><span style="width:${(i / total) * 100}%"></span></div>
      <p class="eyebrow">${t.qNum(i + 1, total)}</p>
      <h3 class="quiz-q">${q.q}</h3>
      <div class="options">${q.o.map((o, k) => `<button class="option" data-k="${k}">${k + 1}. ${o}</button>`).join("")}</div>
      <div id="after"></div>`;
    el.querySelectorAll(".option").forEach((b) =>
      b.addEventListener("click", () => {
        const k = Number(b.dataset.k);
        const ok = k === q.a;
        if (ok) score++;
        el.querySelectorAll(".option").forEach((x) => {
          x.disabled = true;
          if (Number(x.dataset.k) === q.a) x.classList.add("correct");
        });
        if (!ok) b.classList.add("wrong");
        el.querySelector("#after").innerHTML = `
          <div class="explain">${ok ? t.right : t.wrong} ${q.e}</div>
          <button class="btn" id="nextQ">${i + 1 < total ? t.nextQ : t.seeResult}</button>`;
        el.querySelector("#nextQ").addEventListener("click", () => (++i < total ? showQuestion() : showResult()));
      })
    );
  };

  const showResult = () => {
    const passed = score >= pass;
    if (passed) saveStamp(era.id);
    el.innerHTML = `
      <div class="result-center">
        <span class="stamp-big">${passed ? "🏮" : "📚"}</span>
        <div class="score">${score} / ${total}</div>
        <p>${passed ? t.gotStamp(era.name) : t.needMore(pass)}</p>
        <div class="actions">
          <button class="btn ghost" id="retry">${t.retry}</button>
          ${onDone ? `<button class="btn" id="done">${onDone.label}</button>` : `<button class="btn" data-next="life">${t.toLife}</button>`}
        </div>
      </div>`;
    el.querySelector("#retry").addEventListener("click", () => runQuiz(era, el, onDone));
    if (onDone) el.querySelector("#done").addEventListener("click", () => onDone.fn(passed));
    else bindNext(era, el);
  };

  showQuestion();
}

/* ---------- 나의 전생 ---------- */
function renderLifeForm(era, el) {
  const t = T();
  el.innerHTML = `<p>${t.lifeIntro(era.name)}</p>${lifeFormHtml("lifeForm", t.lifeBtn)}`;
  bindLifeForm(el.querySelector("#lifeForm"), (name, birth) => {
    el.innerHTML = `<div class="loading"><div class="mini-moon"></div>${t.loadingEra(esc(era.name))}</div>`;
    setTimeout(() => showLife(era, el, name, birth), 1400);
  });
}

function showLife(era, el, name, birth) {
  const t = T();
  const l = computeLife(era, name, birth);
  el.innerHTML = `
    ${lifeCardHtml(l, name, t.lifeRecord)}
    <div class="actions">
      <button class="btn ghost" id="again">${t.again}</button>
      <button class="btn ghost" id="share">${t.copy}</button>
      <button class="btn" data-go="enter/${era.id}">${t.enterPalace(palaceInfo(era.id).place)}</button>
      <button class="btn ghost" data-go="life">${t.allLives}</button>
    </div>`;
  el.querySelector("#again").addEventListener("click", () => renderLifeForm(era, el));
  el.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => (location.hash = b.dataset.go)));
  el.querySelector("#share").addEventListener("click", (ev) => copyText(ev.target, t.shareOne(name, era.name, l, location.href.split("#")[0])));
}

/* ---------- 회원가입 ---------- */
const MEMBER_KEY = "dalbit-history-member";
const COUNTRY_CODES = ["KR", "US", "JP", "CN", "TW", "HK", "VN", "PH", "TH", "ID", "MY", "SG", "IN", "MN", "KZ", "UZ", "RU", "GB", "FR", "DE", "IT", "ES", "NL", "SE", "PL", "TR", "CA", "MX", "BR", "AR", "AU", "NZ", "EG", "NG", "ZA", "AE", "SA"];
const MSTR = {
  ko: {
    age: "나이",
    age14: "만 14세 이상",
    ageUnder: "만 14세 미만",
    guardianEmail: "보호자(부모님) 이메일",
    guardianConsent: "보호자가 이 서비스의 개인정보 수집·이용에 동의했어요.",
    needAge: "나이를 골라 주세요.",
    needGuardian: "만 14세 미만은 보호자 이메일과 보호자 동의가 필요해요.",
    policyLink: "개인정보 처리방침",
    consent: "개인정보 처리방침을 읽었고, 회원 정보(이메일·국적·이름·나이 구분) 수집·이용에 동의해요.",
    serverNote: "회원 정보는 안전한 회원 서버(Supabase)에 저장돼요. 가입하면 확인 메일이 가요.",
    localNote: "지금은 체험 모드라 회원 정보가 이 기기의 브라우저에만 저장되고 다른 곳으로 보내지지 않아요.",
    sending: "보내는 중…",
    checkMailTitle: "📬 메일함을 확인해 주세요",
    checkMail: (e) => `<b>${e}</b>(으)로 확인 메일을 보냈어요. 메일에 적힌 인증 코드를 아래에 넣거나, 메일의 링크를 누르면 가입이 끝나요.`,
    code: "인증 코드",
    codePh: "메일에 적힌 숫자",
    verify: "확인하고 입장하기",
    codeBad: "코드가 맞지 않거나 시간이 지났어요. 메일을 다시 받아 주세요.",
    resend: "메일 다시 보내기",
    sendFail: "메일을 보내지 못했어요. 잠시 뒤 다시 시도해 주세요.",
    serverDown: "지금 회원 서버에 연결할 수 없어요. 잠시 뒤 다시 시도해 주세요.",
    previewNote: "이 claude.ai 미리보기 화면은 외부 서버 연결이 막혀 있어서 체험 모드로 동작해요. 가입 정보는 이 기기의 브라우저에만 저장되고 회원 서버로 보내지지 않아요.",
    officialLink: "정식 회원가입은 공식 사이트에서 할 수 있어요 →",
    mode: "저장 위치",
    modeServer: "회원 서버 (이메일 인증 완료)",
    modeLocal: "이 기기 브라우저 (체험 모드)",
    deleteAccount: "회원 탈퇴 (모든 정보 삭제)",
    deleteConfirm: "정말 탈퇴할까요? 회원 정보와 도장 기록이 모두 지워져요.",
    deleteFail: "탈퇴 처리에 실패했어요. 잠시 뒤 다시 시도해 주세요.",
  },
  en: {
    age: "Age",
    age14: "14 or older",
    ageUnder: "Under 14",
    guardianEmail: "Parent/guardian email",
    guardianConsent: "My parent/guardian has agreed to the collection and use of personal information.",
    needAge: "Please choose your age group.",
    needGuardian: "Under-14 members need a guardian email and guardian consent.",
    policyLink: "Privacy Policy",
    consent: "I have read the Privacy Policy and agree to the collection and use of my details (email, nationality, name, age group).",
    serverNote: "Your details are stored on a secure member server (Supabase). We'll send you a confirmation email.",
    localNote: "This is demo mode: your details are saved only in this device's browser and are not sent anywhere.",
    sending: "Sending…",
    checkMailTitle: "📬 Check your inbox",
    checkMail: (e) => `We sent a confirmation email to <b>${e}</b>. Enter the code from the email below, or click the link in it, to finish signing up.`,
    code: "Verification code",
    codePh: "Digits from the email",
    verify: "Verify & enter",
    codeBad: "The code is wrong or expired. Please request a new email.",
    resend: "Resend email",
    sendFail: "Couldn't send the email. Please try again shortly.",
    serverDown: "We can't reach the member server right now. Please try again shortly.",
    previewNote: "This claude.ai preview blocks connections to outside servers, so it runs in demo mode. Your details are saved only in this device's browser and are not sent to the member server.",
    officialLink: "Sign up for real on the official site →",
    mode: "Stored in",
    modeServer: "Member server (email verified)",
    modeLocal: "This device's browser (demo mode)",
    deleteAccount: "Delete my account (all data)",
    deleteConfirm: "Delete your account? Your member info and stamps will be removed.",
    deleteFail: "Couldn't delete your account. Please try again shortly.",
  },
};
const M = () => MSTR[LANG];

function loadMember() {
  try { return JSON.parse(localStorage.getItem(MEMBER_KEY)) || null; } catch { return null; }
}
function countryName(code) {
  if (code === "OTHER") return T().countryOther;
  try { return new Intl.DisplayNames([LANG], { type: "region" }).of(code); } catch { return code; }
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function renderSignup() {
  const t = T();
  const m = M();
  const profile = loadProfile() || {};
  const names = COUNTRY_CODES.map((c) => [c, countryName(c)]);
  const [first, ...rest] = names;
  rest.sort((a, b) => a[1].localeCompare(b[1], LANG));
  delete app.dataset.era;
  app.innerHTML = `
    <button class="back" data-go="">${t.home}</button>
    <section class="signup fade-in">
      <p class="eyebrow">MEMBERSHIP</p>
      <h1>🏯 ${t.signupTitle}</h1>
      <p class="lead">${t.signupLead}</p>
      <form class="fortune-form signup-form" id="signupForm" novalidate>
        <label>${t.email}<input name="email" type="email" required maxlength="80" autocomplete="email" placeholder="${t.emailPh}" value="${esc(Backend.user?.email || "")}" ${Backend.user ? "readonly" : ""} /></label>
        <label>${t.country}<select name="country" required>
          <option value="">${t.countryPick}</option>
          ${[first, ...rest, ["OTHER", t.countryOther]].map(([c, n]) => `<option value="${c}">${esc(n)}</option>`).join("")}
        </select></label>
        <label>${t.memberName}<input name="name" required maxlength="20" autocomplete="name" placeholder="${t.namePh}" value="${esc(profile.name || "")}" /></label>
        <fieldset class="age-field"><legend>${m.age}</legend>
          <label class="check"><input type="radio" name="age" value="14plus" /> ${m.age14}</label>
          <label class="check"><input type="radio" name="age" value="under14" /> ${m.ageUnder}</label>
        </fieldset>
        <div class="guardian" id="guardianBox" hidden>
          <label>${m.guardianEmail}<input name="guardian" type="email" maxlength="80" placeholder="${t.emailPh}" /></label>
          <label class="check"><input type="checkbox" name="guardianConsent" /> ${m.guardianConsent}</label>
        </div>
        <label class="check"><input type="checkbox" name="consent" /> <span>${m.consent} <a href="#privacy" target="_blank" rel="noopener">${m.policyLink} ↗</a></span></label>
        <p class="note">🔒 ${Backend.client ? m.serverNote : Backend.blocked ? m.previewNote : Backend.enabled ? m.serverNote : m.localNote}</p>
        ${Backend.blocked && Backend.config.officialUrl ? `<p class="note"><a href="${esc(Backend.config.officialUrl)}" target="_blank" rel="noopener">${m.officialLink} ${esc(Backend.config.officialUrl)}</a></p>` : ""}
        <p class="form-error" id="signupError" role="alert"></p>
        <button class="btn" type="submit">${t.signupBtn}</button>
      </form>
    </section>`;
  const form = app.querySelector("#signupForm");
  app.querySelector("[data-go]").addEventListener("click", () => (location.hash = ""));
  form.querySelectorAll("[name=age]").forEach((r) => r.addEventListener("change", () => (app.querySelector("#guardianBox").hidden = form.age.value !== "under14")));
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const f = ev.target;
    const email = f.email.value.trim();
    const name = f.name.value.trim();
    const ageGroup = f.age.value;
    const guardianEmail = f.guardian.value.trim();
    const err = app.querySelector("#signupError");
    if (!EMAIL_RE.test(email)) return (err.textContent = t.emailBad);
    if (!f.country.value) return (err.textContent = t.needCountry);
    if (!name) return (err.textContent = t.memberName);
    if (!ageGroup) return (err.textContent = m.needAge);
    if (ageGroup === "under14" && (!EMAIL_RE.test(guardianEmail) || !f.guardianConsent.checked)) return (err.textContent = m.needGuardian);
    if (!f.consent.checked) return (err.textContent = t.needConsent);
    const info = { email, name, country: f.country.value, ageGroup, guardianEmail: ageGroup === "under14" ? guardianEmail : null, consentedAt: new Date().toISOString() };
    saveProfile({ name: profile.name || name });
    if (Backend.user) {
      // 이미 메일 링크로 로그인한 상태(다른 기기에서 링크를 연 경우): 바로 저장해요
      if (await Backend.saveProfile(info)) {
        updateMemberChip();
        return (location.hash = "");
      }
      return (err.textContent = m.sendFail);
    }
    // 서버를 쓰도록 설정했는데 연결이 안 되면 브라우저에 몰래 저장하지 않고 알려요
    // 서버를 쓰도록 설정한 공식 사이트에서 연결이 안 되면 몰래 브라우저에 저장하지 않고 알려요.
    // (claude.ai 미리보기는 위 안내문으로 체험 모드임을 미리 밝혀요.)
    if (Backend.enabled && !Backend.client && !Backend.blocked) return (err.textContent = m.serverDown);
    if (!Backend.client) {
      // 체험 모드: 이 브라우저에만 저장
      writeJSON(MEMBER_KEY, { ...info, joinedAt: info.consentedAt, verified: false });
      updateMemberChip();
      return (location.hash = "");
    }
    const btn = f.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = m.sending;
    try {
      await Backend.signUp(info);
      renderCheckMail(info);
    } catch {
      err.textContent = m.sendFail;
      btn.disabled = false;
      btn.textContent = t.signupBtn;
    }
  });
  window.scrollTo(0, 0);
}

function renderCheckMail(info) {
  const m = M();
  app.innerHTML = `
    <section class="signup fade-in">
      <h1>${m.checkMailTitle}</h1>
      <p class="lead">${m.checkMail(esc(info.email))}</p>
      <form class="fortune-form signup-form" id="codeForm" novalidate>
        <label>${m.code}<input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="${m.codePh}" /></label>
        <p class="form-error" id="codeError" role="alert"></p>
        <button class="btn" type="submit">${m.verify}</button>
      </form>
      <button class="btn ghost" id="resend">${m.resend}</button>
    </section>`;
  app.querySelector("#codeForm").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const code = ev.target.code.value.replace(/\D/g, "");
    const err = app.querySelector("#codeError");
    if (code.length < 6) return (err.textContent = m.codeBad);
    const btn = ev.target.querySelector("button");
    btn.disabled = true;
    try {
      await Backend.verifyCode(info.email, code);
      updateMemberChip();
      updateStampCount();
      const target = Backend.nextHash || "";
      if (location.hash.replace("#", "") !== target.replace("#", "")) location.hash = target;
      else route();
    } catch {
      err.textContent = m.codeBad;
      btn.disabled = false;
    }
  });
  app.querySelector("#resend").addEventListener("click", async (e) => {
    e.target.disabled = true;
    try { await Backend.signUp(info); } catch { e.target.textContent = m.sendFail; }
    setTimeout(() => (e.target.disabled = false), 30000);
  });
}

/* ---------- 개인정보 처리방침 ---------- */
function renderPrivacy() {
  const cfg = Backend.config;
  const op = esc(cfg.operatorName || (LANG === "ko" ? "(운영자 이름을 config.js에 적어 주세요)" : "(set operatorName in config.js)"));
  const contact = esc(cfg.contactEmail || (LANG === "ko" ? "(문의 이메일을 config.js에 적어 주세요)" : "(set contactEmail in config.js)"));
  const ko = `
    <h1>개인정보 처리방침</h1>
    <p class="lead">${op}(이하 '운영자')는 「개인정보 보호법」에 따라 '달빛 한국사 여행' 이용자의 개인정보를 다음과 같이 처리합니다.</p>
    <h2>1. 수집하는 항목</h2>
    <ul><li>필수: 이메일 주소, 국적, 이름(닉네임 가능), 나이 구분(만 14세 이상/미만)</li><li>만 14세 미만: 보호자 이메일, 보호자 동의 여부</li><li>이용 기록: 퀴즈 도장 획득 기록, 꾸민 캐릭터 정보</li><li>함께 접속할 때: 궁궐 안에서의 이름·캐릭터·위치·동작 (저장하지 않고 실시간으로만 다른 접속자에게 보여 줌)</li></ul>
    <h2>2. 이용 목적</h2>
    <ul><li>회원 확인과 궁궐 입장</li><li>학습 기록(도장) 저장과 다른 기기에서 이어 하기</li><li>같은 궁궐에 접속한 사람들에게 내 캐릭터를 보여 주기</li></ul>
    <h2>3. 보관 기간</h2>
    <p>회원 탈퇴를 하면 회원 정보와 기록을 지체 없이 지웁니다.</p>
    <h2>4. 처리 위탁과 국외 이전</h2>
    <ul><li>Supabase Inc.: 회원 정보·기록 저장과 로그인 메일 발송 (저장 지역은 운영자가 선택한 서버 지역)</li><li>Vercel Inc.: 웹사이트 호스팅</li></ul>
    <p>위 업체는 해외에 서버가 있을 수 있으며, 서비스 제공을 위해 필요한 범위에서만 정보가 이전됩니다. 이 외에 제3자에게 제공하지 않습니다.</p>
    <h2>5. 만 14세 미만 아동</h2>
    <p>만 14세 미만 아동은 법정대리인(보호자)의 동의를 받아 가입할 수 있으며, 보호자는 아동 정보의 열람·정정·삭제를 요청할 수 있습니다.</p>
    <h2>6. 이용자의 권리</h2>
    <p>언제든 상단의 회원 표시를 눌러 내 정보를 보고, 회원 탈퇴로 모든 정보를 지울 수 있습니다. 그 밖의 요청은 아래로 연락해 주세요.</p>
    <h2>7. 개인정보 보호책임자와 문의</h2>
    <p>${op} · ${contact}</p>
    <p class="note">시행일: 2026년 10월 30일</p>`;
  const en = `
    <h1>Privacy Policy</h1>
    <p class="lead">${op} ("Operator") handles the personal information of 'Moonlit Korean History' users as follows, in line with Korea's Personal Information Protection Act.</p>
    <h2>1. What we collect</h2>
    <ul><li>Required: email, nationality, name (a nickname is fine), age group (14+ / under 14)</li><li>Under 14: guardian email and guardian consent</li><li>Activity: quiz stamps and your character design</li><li>When playing together: your name, character, position and actions inside a palace (shown live to other visitors, not stored)</li></ul>
    <h2>2. Why</h2>
    <ul><li>To verify members and let them enter the palaces</li><li>To save learning records (stamps) across devices</li><li>To show your character to others in the same palace</li></ul>
    <h2>3. Retention</h2>
    <p>Your member data and records are deleted without delay when you delete your account.</p>
    <h2>4. Processors and international transfer</h2>
    <ul><li>Supabase Inc.: storing member data and sending sign-in emails (in the server region chosen by the Operator)</li><li>Vercel Inc.: website hosting</li></ul>
    <p>These providers may operate servers abroad; data is transferred only as needed to provide the service. We do not share data with any other third party.</p>
    <h2>5. Children under 14</h2>
    <p>Children under 14 may join with consent from a parent or legal guardian, who may request access, correction or deletion of the child's data.</p>
    <h2>6. Your rights</h2>
    <p>Tap the member chip at the top anytime to view your details, or delete your account to erase everything. For other requests, contact us below.</p>
    <h2>7. Privacy officer & contact</h2>
    <p>${op} · ${contact}</p>
    <p class="note">Effective: October 30, 2026</p>`;
  delete app.dataset.era;
  app.innerHTML = `<button class="back" data-go="">${T().home}</button><article class="policy fade-in">${LANG === "en" ? en : ko}</article>`;
  app.querySelector("[data-go]").addEventListener("click", () => (location.hash = ""));
  window.scrollTo(0, 0);
}

function updateMemberChip() {
  const chip = document.getElementById("memberChip");
  const m = loadMember();
  chip.hidden = false;
  chip.textContent = m ? `👤 ${m.name}` : `👤 ${T().joinChip}`;
}
function openMemberInfo() {
  const t = T();
  const mm = M();
  const m = loadMember();
  if (!m) return (location.hash = "signup");
  const server = !!(Backend.user && m.verified);
  modalBody.innerHTML = `
    <h2 style="margin:0">👤 ${t.memberInfo}</h2>
    <dl class="member-info">
      <dt>${t.memberName}</dt><dd>${esc(m.name)}</dd>
      <dt>${t.email}</dt><dd>${esc(m.email)}</dd>
      <dt>${t.country}</dt><dd>${esc(countryName(m.country))}</dd>
      <dt>${mm.age}</dt><dd>${m.ageGroup === "under14" ? mm.ageUnder : mm.age14}</dd>
      <dt>${mm.mode}</dt><dd>${server ? mm.modeServer : mm.modeLocal}</dd>
    </dl>
    <p class="note"><a href="#privacy">${mm.policyLink}</a></p>
    <button class="btn ghost" id="signout">${server ? mm.deleteAccount : t.signout}</button>`;
  modalBody.querySelector("[href='#privacy']").addEventListener("click", () => modal.close());
  modalBody.querySelector("#signout").addEventListener("click", async (e) => {
    if (server && !confirm(mm.deleteConfirm)) return;
    try {
      if (server) await Backend.deleteAccount();
    } catch {
      e.target.textContent = mm.deleteFail;
      return;
    }
    [MEMBER_KEY, STAMP_KEY].forEach((k) => {
      try { localStorage.removeItem(k); } catch {}
    });
    modal.close();
    updateMemberChip();
    updateStampCount();
    location.hash = "";
    route();
  });
  modal.showModal();
}
document.getElementById("memberChip").addEventListener("click", openMemberInfo);

/* ---------- 공유하기 ---------- */
const QR_URL = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
function openShare() {
  const cfg = Backend.config;
  const framed = window.self !== window.top; // claude.ai 아티팩트 화면 안
  const url = cfg.siteUrl || (framed && cfg.artifactUrl) || location.origin + location.pathname;
  const ko = LANG === "ko";
  modalBody.innerHTML = `
    <h2 style="margin:0">🔗 ${ko ? "친구에게 공유하기" : "Share with friends"}</h2>
    <p class="note" style="margin-top:6px">${ko ? "QR코드를 찍거나 링크를 보내 주세요." : "Scan the QR code or send the link."}</p>
    <div class="qr" id="qrBox"></div>
    <div class="share-link"><input readonly value="${esc(url)}" id="shareUrl" /><button class="btn" id="copyShare">${ko ? "복사" : "Copy"}</button></div>
    ${navigator.share ? `<button class="btn ghost" id="nativeShare">${ko ? "📤 다른 앱으로 공유" : "📤 Share via apps"}</button>` : ""}`;
  modal.showModal();
  const draw = () => new QRCode(document.getElementById("qrBox"), { text: url, width: 200, height: 200, colorDark: "#12153a", colorLight: "#ffffff" });
  if (window.QRCode) draw();
  else {
    const s = document.createElement("script");
    s.src = QR_URL;
    s.onload = draw;
    document.head.appendChild(s);
  }
  modalBody.querySelector("#copyShare").addEventListener("click", (e) => copyText(e.target, url));
  modalBody.querySelector("#nativeShare")?.addEventListener("click", () => navigator.share({ title: T().title, url }).catch(() => {}));
}
document.getElementById("shareChip").addEventListener("click", openShare);

/* ---------- 도장판 ---------- */
function openStampBoard() {
  const t = T();
  const list = eras();
  const stamps = loadStamps();
  const count = Object.keys(stamps).length;
  modalBody.innerHTML = `
    <h2 style="margin:0">${t.board}</h2>
    <p style="color:var(--muted);margin:6px 0 0">${count === list.length ? t.boardAll : t.boardSome(count, list.length)}</p>
    <div class="stamp-board">
      ${list.map((e) => `<div class="${stamps[e.id] ? "on" : ""}"><div><span>${stamps[e.id] ? "🏮" : e.emoji}</span>${e.name}</div></div>`).join("")}
    </div>`;
  modal.showModal();
}
document.getElementById("stampChip").addEventListener("click", openStampBoard);
modal.querySelector(".close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => e.target === modal && modal.close());
document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

applyStaticText();
updateStampCount();
// 서버 모드라면 로그인 상태를 먼저 확인한 뒤 화면을 그려요 (이메일 링크로 돌아온 경우 가입 마무리)
Backend.init().finally(() => {
  updateStampCount();
  updateMemberChip();
  if (/access_token|error_description/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  if (Backend.nextHash && location.hash !== Backend.nextHash) location.hash = Backend.nextHash;
  else route();
});
window.addEventListener("member-changed", () => {
  updateMemberChip();
  updateStampCount();
});
