const app = document.getElementById("app");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const STAMP_KEY = "dalbit-history-stamps";
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

/* ---------- 라우팅 ---------- */
function route() {
  const [, eraId, tab] = location.hash.match(/^#era\/([\w-]+)(?:\/(\w+))?/) || [];
  const era = ERAS.find((e) => e.id === eraId);
  if (era) renderEra(era, TABS.some(([t]) => t === tab) ? tab : "intro");
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
  window.scrollTo(0, 0);
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
  el.querySelector("#lifeForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const data = new FormData(ev.target);
    const name = data.get("name").trim();
    const birth = data.get("birth");
    if (!name) return;
    el.innerHTML = `<div class="loading"><div class="mini-moon"></div>달빛이 ${esc(era.name)}의 기록을 넘기는 중…</div>`;
    setTimeout(() => showLife(era, el, name, birth), 1400);
  });
}

function showLife(era, el, name, birth) {
  const h = hash(`${name}|${birth}|${era.id}`);
  const [emoji, role, desc] = era.lives[h % era.lives.length];
  const luck = 60 + (h >> 4) % 41;
  const wit = 60 + (h >> 10) % 41;
  const courage = 60 + (h >> 16) % 41;
  const person = era.people[(h >> 20) % era.people.length][0];
  el.innerHTML = `
    <div class="life-card" id="lifeCard">
      <div class="kicker">${esc(era.name)} · 전생 기록</div>
      <div class="life-emoji">${emoji}</div>
      <h2>${esc(name)}님은<br />${role}</h2>
      <p>${desc}</p>
      <div class="life-stats">
        <div>지혜<b>${wit}</b></div>
        <div>용기<b>${courage}</b></div>
        <div>행운<b>${luck}</b></div>
      </div>
      <p>🤝 전생에 <b>${person}</b>와(과) 스쳐 지나간 인연이 있어요.</p>
    </div>
    <div class="actions">
      <button class="btn ghost" id="again">다시 하기</button>
      <button class="btn ghost" id="share">결과 복사하기</button>
      <button class="btn" data-go="">다른 시대로 떠나기 →</button>
    </div>`;
  el.querySelector("#again").addEventListener("click", () => renderLifeForm(era, el));
  el.querySelector("[data-go]").addEventListener("click", () => (location.hash = ""));
  el.querySelector("#share").addEventListener("click", async (ev) => {
    const text = `🌙 달빛 한국사 여행\n${name}님의 ${era.name} 전생은 ${emoji} ${role}!\n${desc}\n${location.href.split("#")[0]}`;
    try {
      await navigator.clipboard.writeText(text);
      ev.target.textContent = "복사 완료 ✓";
    } catch {
      ev.target.textContent = "복사할 수 없어요";
    }
  });
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
