const app = document.getElementById("app");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const STAMP_KEY = "dalbit-history-stamps";
const PROFILE_KEY = "dalbit-history-profile";
const TABS = [
  ["intro", "📖 시대 소개"],
  ["timeline", "🗓️ 연표"],
  ["people", "👤 인물"],
  ["facts", "✨ 재미있는 사실"],
  ["quiz", "📝 퀴즈"],
  ["life", "🌙 나의 전생"],
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function loadStamps() {
  try { return JSON.parse(localStorage.getItem(STAMP_KEY)) || {}; } catch { return {}; }
}
function saveStamp(id) {
  const stamps = loadStamps();
  stamps[id] = true;
  try { localStorage.setItem(STAMP_KEY, JSON.stringify(stamps)); } catch {}
  updateStampCount();
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
function saveProfile(name, birth) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, birth })); } catch {}
}

// 시대별 전생 결과 계산 (같은 이름·생일이면 항상 같은 결과)
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
  const [, eraId, tab] = location.hash.match(/^#era\/([\w-]+)(?:\/(\w+))?/) || [];
  const era = ERAS.find((e) => e.id === eraId);
  if (era) renderEra(era, TABS.some(([t]) => t === tab) ? tab : "intro");
  else if (location.hash === "#life" && loadProfile()) renderLifeAll(loadProfile());
  else renderHome();
}
window.addEventListener("hashchange", route);

/* ---------- 홈 ---------- */
function renderHome() {
  const stamps = loadStamps();
  app.innerHTML = `
    <section class="hero fade-in">
      <div class="big-moon" aria-hidden="true"></div>
      <p class="eyebrow">KOREAN HISTORY · TIME TRAVEL</p>
      <h1>달빛을 따라<br /><em>어느 시대</em>로 떠나볼까요?</h1>
      <p class="lead">고조선부터 대한제국까지, 가고 싶은 시대를 골라 보세요. 이야기와 퀴즈로 역사를 만나고, 그 시대의 나는 누구였을지 전생도 알아봐요.</p>
    </section>

    <section class="life-home fade-in">
      <div>
        <p class="eyebrow">MY PAST LIFE</p>
        <h2>🌙 나의 전생 결과 보기</h2>
        <p>이름과 생년월일을 넣으면 고조선부터 대한제국까지, <b>6개 시대의 내 전생</b>을 한 번에 알려드려요.</p>
      </div>
      <form class="fortune-form" id="homeLifeForm">
        <label>이름<input name="name" required maxlength="20" placeholder="예: 홍길동" autocomplete="name" /></label>
        <label>생년월일<input name="birth" type="date" required min="1900-01-01" max="2026-12-31" /></label>
        <button class="btn" type="submit">전생 결과 보기 →</button>
      </form>
    </section>

    <h2 class="section-title">🕰️ 시대 선택</h2>
    <div class="era-grid">
      ${ERAS.map((e, i) => `
        <button class="era-card fade-in" style="--c:${e.color};animation-delay:${i * 70}ms" data-era="${e.id}">
          <span class="order">CHAPTER ${String(i + 1).padStart(2, "0")}</span>
          <span class="emoji">${e.emoji}</span>
          <h3>${e.name}<small>${e.hanja}</small></h3>
          <div class="period">${e.period}</div>
          <p>${e.tagline}</p>
          ${stamps[e.id] ? '<span class="stamp" title="퀴즈 통과">🏮</span>' : ""}
        </button>`).join("")}
    </div>

    <h2 class="section-title">🧭 이렇게 즐겨요</h2>
    <div class="how">
      <div><b>① 시대 고르기</b>궁금한 시대 카드를 눌러 시간여행을 시작해요.</div>
      <div><b>② 읽고 풀기</b>연표·인물·재미있는 사실을 보고 퀴즈 3문제 이상 맞히면 도장 획득!</div>
      <div><b>③ 나의 전생</b>이름과 생일을 넣으면 그 시대의 나는 누구였는지 알려드려요.</div>
    </div>`;
  app.querySelectorAll("[data-era]").forEach((b) => b.addEventListener("click", () => (location.hash = `era/${b.dataset.era}`)));
  bindLifeForm(app.querySelector("#homeLifeForm"), (name, birth) => {
    location.hash = "life";
    if (location.hash === "#life") route();
  });
  delete app.dataset.era;
  window.scrollTo(0, 0);
}

// 이름·생일 폼 공통 처리: 저장된 값 채우기 + 제출 시 저장
function bindLifeForm(form, onSubmit) {
  const profile = loadProfile();
  if (profile) {
    form.name.value = profile.name;
    form.birth.value = profile.birth;
  }
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = form.name.value.trim();
    const birth = form.birth.value;
    if (!name || !birth) return;
    saveProfile(name, birth);
    onSubmit(name, birth);
  });
}

/* ---------- 전체 전생 결과 ---------- */
function renderLifeAll({ name, birth }) {
  const lives = ERAS.map((e) => computeLife(e, name, birth));
  const main = lives.reduce((a, b) => (b.total > a.total ? b : a));
  delete app.dataset.era;
  app.style.setProperty("--c", main.era.color);
  app.innerHTML = `<button class="back" data-go="">← 처음으로</button>
    <div class="loading"><div class="mini-moon"></div>달빛이 ${esc(name)}님의 전생 기록을 넘기는 중…</div>`;
  app.querySelector("[data-go]").addEventListener("click", () => (location.hash = ""));
  window.scrollTo(0, 0);
  setTimeout(() => {
    if (location.hash !== "#life") return;
    app.innerHTML = `
      <button class="back" data-go="">← 처음으로</button>
      <p class="eyebrow" style="text-align:center;margin-top:10px">${esc(name)}님의 전생 결과</p>
      ${lifeCardHtml(main, name, "가장 강하게 남은 전생")}
      <div class="actions">
        <button class="btn" id="saveImg">📷 이미지로 저장</button>
        <button class="btn ghost" id="share">결과 복사하기</button>
        <button class="btn ghost" id="again">다시 하기</button>
      </div>

      <h2 class="section-title">🕰️ 시대별 나의 전생</h2>
      <div class="life-list">
        ${lives.map((l) => `
          <button class="life-row${l === main ? " main" : ""}" style="--c:${l.era.color}" data-go="era/${l.era.id}/life">
            <span class="life-row-emoji">${l.emoji}</span>
            <span class="life-row-text">
              <small>${l.era.emoji} ${l.era.name} · ${l.era.period}</small>
              <b>${l.role}</b>
              <span>${l.desc}</span>
            </span>
            <span class="life-row-score">${l.total}<small>점</small></span>
          </button>`).join("")}
      </div>
      <p class="hint">시대를 누르면 그 시대 이야기와 퀴즈로 들어가요.</p>`;
    app.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => (location.hash = b.dataset.go)));
    app.querySelector("#again").addEventListener("click", () => (location.hash = ""));
    app.querySelector("#saveImg").addEventListener("click", () => saveLifeImage(main, lives, name));
    app.querySelector("#share").addEventListener("click", (ev) =>
      copyText(ev.target, `🌙 달빛 한국사 여행\n${name}님의 전생 결과\n${lives.map((l) => `${l.era.name}: ${l.emoji} ${l.role}`).join("\n")}\n👉 가장 강한 전생: ${main.era.name}의 ${main.role}\n${location.href.split("#")[0]}`)
    );
  }, 1400);
}

function lifeCardHtml(l, name, kicker) {
  return `
    <div class="life-card" style="--c:${l.era.color}">
      <div class="kicker">${esc(l.era.name)} · ${kicker}</div>
      <div class="life-emoji">${l.emoji}</div>
      <h2>${esc(name)}님은<br />${l.role}</h2>
      <p>${l.desc}</p>
      <div class="life-stats">
        <div>지혜<b>${l.wit}</b></div>
        <div>용기<b>${l.courage}</b></div>
        <div>행운<b>${l.luck}</b></div>
      </div>
      <p>🤝 전생에 <b>${l.person}</b>와(과) 스쳐 지나간 인연이 있어요.</p>
    </div>`;
}

async function copyText(btn, text) {
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "복사 완료 ✓";
  } catch {
    btn.textContent = "복사할 수 없어요";
  }
}

// 결과 카드를 1080×1350 이미지로 그려서 내려받기
async function saveLifeImage(main, lives, name) {
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
  g.fillText(`${main.era.name} · 가장 강하게 남은 전생`, W / 2, 130);
  g.font = `150px ${sans}`;
  g.fillText(main.emoji, W / 2, 320);
  g.fillStyle = "#f4efe3";
  g.font = `700 64px ${serif}`;
  g.fillText(`${name}님은`, W / 2, 440);
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
    g.font = `700 28px ${sans}`;
    g.fillText(l.era.name, 130, y + 50);
    g.fillStyle = "#f4efe3";
    g.font = `30px ${sans}`;
    g.fillText(`${l.emoji}  ${l.role}`, 330, y + 50);
    y += 90;
  });
  g.textAlign = "center";
  g.fillStyle = "#f3d27a";
  g.font = `700 32px ${serif}`;
  g.fillText("🌙 달빛 한국사 여행", W / 2, H - 50);

  const a = document.createElement("a");
  a.download = `${name}-전생결과.png`;
  a.href = cv.toDataURL("image/png");
  a.click();
}

function wrapText(g, text, x, y, maxW, lineH) {
  let line = "";
  for (const ch of text) {
    if (g.measureText(line + ch).width > maxW) {
      g.fillText(line, x, y);
      line = ch;
      y += lineH;
    } else line += ch;
  }
  g.fillText(line, x, y);
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
  const idx = ERAS.indexOf(era);
  const prev = ERAS[idx - 1];
  const next = ERAS[idx + 1];
  const isNewEra = app.dataset.era !== era.id;
  app.dataset.era = era.id;
  app.style.setProperty("--c", era.color);
  app.innerHTML = `
    <button class="back" data-go="">← 시대 선택으로</button>
    <section class="era-hero fade-in">
      <span class="emoji-bg" aria-hidden="true">${era.emoji}</span>
      <h1>${era.name}<small>${era.hanja}</small></h1>
      <div class="period">${era.period}</div>
      <p class="tagline">${era.tagline}</p>
    </section>
    <nav class="tabs" role="tablist">
      ${TABS.map(([id, label]) => `<button class="tab ${id === tab ? "active" : ""}" role="tab" aria-selected="${id === tab}" data-tab="${id}">${label}</button>`).join("")}
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
      <button class="btn" data-next="timeline">연표 보러 가기 →</button>`;
    bindNext(era, el);
  },
  timeline(era, el) {
    el.innerHTML = `<ol class="timeline">${era.timeline.map(([y, t]) => `<li><span class="year">${y}</span>${t}</li>`).join("")}</ol>
      <button class="btn" data-next="people">인물 만나기 →</button>`;
    bindNext(era, el);
  },
  people(era, el) {
    el.innerHTML = `<div class="people">${era.people.map(([n, d]) => `<article class="person"><h3>${n}</h3><p>${d}</p></article>`).join("")}</div>
      <button class="btn" data-next="facts">재미있는 사실 →</button>`;
    bindNext(era, el);
  },
  facts(era, el) {
    el.innerHTML = `<div class="facts">${era.facts.map((f) => `<div class="fact">${f}</div>`).join("")}</div>
      <button class="btn" data-next="quiz">퀴즈 도전! →</button>`;
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
function runQuiz(era, el) {
  const total = era.quiz.length;
  const pass = Math.ceil(total * 0.75);
  let i = 0;
  let score = 0;

  const showQuestion = () => {
    const q = era.quiz[i];
    el.innerHTML = `
      <div class="quiz-progress"><span style="width:${(i / total) * 100}%"></span></div>
      <p class="eyebrow">문제 ${i + 1} / ${total}</p>
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
          <div class="explain">${ok ? "⭕ 정답!" : "❌ 아쉬워요!"} ${q.e}</div>
          <button class="btn" id="nextQ">${i + 1 < total ? "다음 문제 →" : "결과 보기 →"}</button>`;
        el.querySelector("#nextQ").addEventListener("click", () => (++i < total ? showQuestion() : showResult()));
      })
    );
  };

  const showResult = () => {
    const passed = score >= pass;
    if (passed) saveStamp(era.id);
    el.innerHTML = `
      <div class="result-center">
        ${passed ? '<span class="stamp-big">🏮</span>' : '<span class="stamp-big">📚</span>'}
        <div class="score">${score} / ${total}</div>
        <p>${passed ? `<b>${era.name}</b> 도장을 받았어요! 이 시대의 역사 박사 인정 🎉` : `${pass}문제 이상 맞히면 도장을 받을 수 있어요. 한 번 더 도전해 볼까요?`}</p>
        <div class="actions">
          <button class="btn ghost" id="retry">다시 풀기</button>
          <button class="btn" data-next="life">🌙 이 시대 나의 전생은?</button>
        </div>
      </div>`;
    el.querySelector("#retry").addEventListener("click", () => runQuiz(era, el));
    bindNext(era, el);
  };

  showQuestion();
}

/* ---------- 나의 전생 ---------- */
function renderLifeForm(era, el) {
  el.innerHTML = `
    <p>이름과 생년월일을 알려주면, 달빛이 <b>${era.name}</b> 시대 당신의 전생을 비춰 드려요.</p>
    <form class="fortune-form" id="lifeForm">
      <label>이름<input name="name" required maxlength="20" placeholder="예: 홍길동" autocomplete="name" /></label>
      <label>생년월일<input name="birth" type="date" required min="1900-01-01" max="2026-12-31" /></label>
      <button class="btn" type="submit">🌙 전생 알아보기</button>
    </form>`;
  bindLifeForm(el.querySelector("#lifeForm"), (name, birth) => {
    el.innerHTML = `<div class="loading"><div class="mini-moon"></div>달빛이 ${esc(era.name)}의 기록을 넘기는 중…</div>`;
    setTimeout(() => showLife(era, el, name, birth), 1400);
  });
}

function showLife(era, el, name, birth) {
  const l = computeLife(era, name, birth);
  el.innerHTML = `
    ${lifeCardHtml(l, name, "전생 기록")}
    <div class="actions">
      <button class="btn ghost" id="again">다시 하기</button>
      <button class="btn ghost" id="share">결과 복사하기</button>
      <button class="btn" data-go="life">🌙 전체 시대 전생 보기 →</button>
    </div>`;
  el.querySelector("#again").addEventListener("click", () => renderLifeForm(era, el));
  el.querySelector("[data-go]").addEventListener("click", () => (location.hash = "life"));
  el.querySelector("#share").addEventListener("click", (ev) =>
    copyText(ev.target, `🌙 달빛 한국사 여행\n${name}님의 ${era.name} 전생은 ${l.emoji} ${l.role}!\n${l.desc}\n${location.href.split("#")[0]}`)
  );
}

/* ---------- 도장판 ---------- */
document.getElementById("stampChip").addEventListener("click", () => {
  const stamps = loadStamps();
  const count = Object.keys(stamps).length;
  modalBody.innerHTML = `
    <h2 style="margin:0">🏮 역사 도장판</h2>
    <p style="color:var(--muted);margin:6px 0 0">${count === ERAS.length ? "모든 시대를 정복했어요! 진정한 한국사 마스터 👑" : `퀴즈를 통과하면 도장이 찍혀요. (${count}/${ERAS.length})`}</p>
    <div class="stamp-board">
      ${ERAS.map((e) => `<div class="${stamps[e.id] ? "on" : ""}"><div><span>${stamps[e.id] ? "🏮" : e.emoji}</span>${e.name}</div></div>`).join("")}
    </div>`;
  modal.showModal();
});
modal.querySelector(".close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => e.target === modal && modal.close());

updateStampCount();
route();
