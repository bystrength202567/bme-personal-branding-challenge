// 시대별 3D 입장 공간: 캐릭터 선택 → 공간 입장 → 위인 대화·이야기 비석·시험관 퀴즈
const THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
const CHAR_KEY = "dalbit-history-chars";
const ROBES = ["#efe6cf", "#c0584f", "#4f73b3", "#5fa39a", "#d4a63a", "#8a5bb8", "#d9d9e0", "#7a5a40"];
const ERA_HAT = { gojoseon: "band", threekingdoms: "helmet", silla: "topknot", goryeo: "topknot", joseon: "gat", "korean-empire": "western" };
const ROYAL = ["👑", "🤴", "👸"];

const WSTR = {
  ko: {
    pickTitle: (place) => `${place}에 입장할 캐릭터를 골라요`,
    nick: "닉네임",
    pastLife: "⭐ 나의 전생",
    enter: "🚪 입장하기",
    room: "마루",
    loading: (place) => `${place}(으)로 가는 문을 여는 중…`,
    noWebgl: "이 기기에서는 3D 공간을 열 수 없어요. 시대 이야기 화면으로 돌아갈게요.",
    loadFail: "3D 공간을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.",
    back: "돌아가기",
    hint: "바닥 클릭 · 드래그로 둘러보기 · 휠로 확대/축소",
    me: "나",
    villager: "주민",
    villagers: (n) => `주민 ${n}`,
    examiner: "시험관",
    stone: (i) => `이야기 비석 ${i}`,
    gate: "시간의 문",
    wave: "인사", bow: "절하기", cheer: "만세", talk: "말 걸기",
    iAm: (n) => `나는 ${n}이오.`,
    quizIntro: (era) => `${era}에 대해 얼마나 알고 있소? 4문제 중 3문제를 맞히면 도장을 찍어 주겠소.`,
    quizStart: "📝 시험 보기",
    keep: "계속 둘러보기",
    leaveQ: "현재로 돌아갈까요?",
    leave: "나가기",
    bowBack: (n) => `${n} 님이 맞절을 해요 🙇`,
    waveBack: (n) => `${n} 님이 손을 흔들어요 👋`,
    complete: "🎉 모든 위인과 비석을 만났어요! 이제 시험관에게 가 보세요.",
    progress: "탐험",
  },
  en: {
    pickTitle: (place) => `Choose your character to enter ${place}`,
    nick: "Nickname",
    pastLife: "⭐ My past life",
    enter: "🚪 Enter",
    room: "Hall",
    loading: (place) => `Opening the gate to ${place}…`,
    noWebgl: "This device can't open the 3D world. Taking you back to the era page.",
    loadFail: "Couldn't load the 3D world. Please check your connection.",
    back: "Go back",
    hint: "Click the floor · Drag to look around · Scroll to zoom",
    me: "Me",
    villager: "Villager",
    villagers: (n) => `${n} villagers`,
    examiner: "Examiner",
    stone: (i) => `Story Stone ${i}`,
    gate: "Gate of Time",
    wave: "Wave", bow: "Bow", cheer: "Cheer", talk: "Talk",
    iAm: (n) => `I am ${n}.`,
    quizIntro: (era) => `How much do you know about ${era}? Get 3 of 4 right and I'll give you my stamp.`,
    quizStart: "📝 Take the test",
    keep: "Keep exploring",
    leaveQ: "Return to the present?",
    leave: "Leave",
    bowBack: (n) => `${n} bows back 🙇`,
    waveBack: (n) => `${n} waves back 👋`,
    complete: "🎉 You've met everyone and read every stone! Now visit the Examiner.",
    progress: "Explored",
  },
};
const W = () => WSTR[LANG];

const NICK_WORDS = {
  ko: [["느긋한", "용감한", "슬기로운", "반짝이는", "씩씩한", "다정한", "호기심 많은", "고요한"], ["구름", "달빛", "호랑이", "소나무", "별", "바람", "두루미", "매화"]],
  en: [["Calm", "Brave", "Wise", "Shining", "Bold", "Kind", "Curious", "Quiet"], ["Cloud", "Moon", "Tiger", "Pine", "Star", "Wind", "Crane", "Plum"]],
};
function randomNick() {
  const [a, b] = NICK_WORDS[LANG];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return `${pick(a)} ${pick(b)}`;
}
function loadChars() {
  try { return JSON.parse(localStorage.getItem(CHAR_KEY)) || {}; } catch { return {}; }
}
function roomNumber(era, nick) {
  return 1 + (hash(`${era.id}|${nick}`) % 99);
}

/* ---------- 캐릭터 선택 ---------- */
function renderCharacterSelect(era) {
  const w = W();
  const profile = loadProfile() || {};
  const nick = profile.nick || randomNick();
  const past = profile.birth ? lifeIndex(era, profile.name, profile.birth) : -1;
  let chosen = loadChars()[era.id] ?? (past >= 0 ? past : 0);
  const place = sceneText(era.id).place;
  delete app.dataset.era;
  app.style.setProperty("--c", era.color);
  app.innerHTML = `
    <button class="back" data-go="era/${era.id}">← ${era.emoji} ${era.name}</button>
    <section class="char-select fade-in">
      <p class="eyebrow">${era.name} · ${era.period}</p>
      <h1>${w.pickTitle(place)}</h1>
      <label class="nick-field">${w.nick}<span><input id="nick" maxlength="12" value="${esc(nick)}" /><button type="button" id="dice" aria-label="random">🎲</button></span></label>
      <div class="char-grid">
        ${era.lives.map(([emoji, role], i) => `
          <button class="char${i === chosen ? " on" : ""}" data-i="${i}" style="--robe:${ROBES[i]}">
            <span class="char-avatar"><i>${emoji}</i></span>
            <b>${role}</b>
            ${i === past ? `<small>${w.pastLife}</small>` : ""}
          </button>`).join("")}
      </div>
      <div class="room-line">🏯 ${place} · ${w.room} <b id="roomNo">${roomNumber(era, nick)}</b></div>
      <button class="btn big" id="enterWorld">${w.enter}</button>
    </section>`;
  const nickInput = app.querySelector("#nick");
  const updateRoom = () => (app.querySelector("#roomNo").textContent = roomNumber(era, nickInput.value.trim() || nick));
  nickInput.addEventListener("input", updateRoom);
  app.querySelector("#dice").addEventListener("click", () => {
    nickInput.value = randomNick();
    updateRoom();
  });
  app.querySelectorAll(".char").forEach((b) =>
    b.addEventListener("click", () => {
      chosen = Number(b.dataset.i);
      app.querySelectorAll(".char").forEach((x) => x.classList.toggle("on", x === b));
    })
  );
  app.querySelector("[data-go]").addEventListener("click", (e) => (location.hash = e.currentTarget.dataset.go));
  app.querySelector("#enterWorld").addEventListener("click", () => {
    saveProfile({ nick: nickInput.value.trim() || nick });
    const chars = loadChars();
    chars[era.id] = chosen;
    try { localStorage.setItem(CHAR_KEY, JSON.stringify(chars)); } catch {}
    location.hash = `world/${era.id}`;
  });
  window.scrollTo(0, 0);
}

/* ---------- three.js 불러오기 ---------- */
let threePromise;
function loadThree() {
  if (window.THREE) return Promise.resolve();
  threePromise ||= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = THREE_URL;
    s.onload = resolve;
    s.onerror = () => {
      threePromise = null;
      reject(new Error("three.js load failed"));
    };
    document.head.appendChild(s);
  });
  return threePromise;
}

/* ---------- 공간 입장 ---------- */
function enterWorld(era) {
  const w = W();
  const profile = loadProfile() || {};
  if (!profile.nick || loadChars()[era.id] === undefined) {
    location.replace(`#enter/${era.id}`);
    return;
  }
  const place = sceneText(era.id).place;
  document.body.classList.add("in-world");
  delete app.dataset.era;
  app.innerHTML = `
    <div class="world" id="world" style="--c:${era.color}">
      <div class="world-loading" id="worldLoading"><div class="mini-moon"></div>${w.loading(place)}</div>
    </div>`;
  const token = (enterWorld.token = Symbol());
  loadThree()
    .then(() => {
      if (enterWorld.token !== token || !document.getElementById("world")) return;
      World.start(era, document.getElementById("world"), profile.nick, loadChars()[era.id]);
    })
    .catch(() => {
      document.getElementById("worldLoading").innerHTML = `${w.loadFail}<br /><button class="btn" onclick="location.hash='era/${era.id}'">${w.back}</button>`;
    });
}

const World = {
  ctx: null,

  leave() {
    enterWorld.token = null;
    const c = this.ctx;
    if (!c) return;
    this.ctx = null;
    cancelAnimationFrame(c.raf);
    c.cleanup.forEach((fn) => fn());
    c.renderer.dispose();
    c.renderer.forceContextLoss();
  },

  start(era, root, nick, charIndex) {
    const w = W();
    const scene3 = SCENES[era.id];
    const text = sceneText(era.id);
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      root.innerHTML = `<div class="world-loading">${w.noWebgl}<br /><button class="btn" onclick="location.hash='era/${era.id}'">${w.back}</button></div>`;
      return;
    }
    const c = (this.ctx = { renderer, cleanup: [], raf: 0 });
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      c.cleanup.push(() => target.removeEventListener(type, fn, opts));
    };

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    root.innerHTML = `
      <div class="w-labels" id="wLabels"></div>
      <div class="w-top">
        <div class="w-left">
          <button class="w-icon" id="wExit" aria-label="${w.leave}">⎋</button>
          <div class="w-room">🏯 <b>${text.place}</b><span>${w.room} ${roomNumber(era, nick)}</span></div>
        </div>
        <div class="w-right">
          <span class="w-pill" id="wProgress"></span>
          <span class="w-pill">👥 ${w.villagers(4)}</span>
        </div>
      </div>
      <p class="w-hint" id="wHint">${w.hint}</p>
      <div class="w-toast" id="wToast"></div>
      <div class="w-dialog" id="wDialog" hidden>
        <div class="w-dialog-head"><span id="wDlgEmoji"></span><b id="wDlgName"></b><button class="w-close" id="wDlgClose" aria-label="close">×</button></div>
        <div class="w-dialog-body" id="wDlgBody"></div>
      </div>
      <nav class="w-actions">
        <button data-gesture="wave"><span>👋</span>${w.wave}</button>
        <button data-gesture="bow"><span>🙇</span>${w.bow}</button>
        <button data-gesture="cheer"><span>🙌</span>${w.cheer}</button>
        <button id="wTalk" disabled><span>💬</span>${w.talk}</button>
      </nav>`;
    root.prepend(renderer.domElement);
    const labelsEl = root.querySelector("#wLabels");
    const dialog = root.querySelector("#wDialog");
    const toastEl = root.querySelector("#wToast");
    const talkBtn = root.querySelector("#wTalk");
    setTimeout(() => root.querySelector("#wHint")?.classList.add("fade"), 6000);

    /* --- 장면 --- */
    const scene = new THREE.Scene();
    const sky = new THREE.Color(scene3.ground[0]).lerp(new THREE.Color("#0b0d2a"), 0.75);
    scene.background = sky;
    scene.fog = new THREE.Fog(sky, 22, 60);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    scene.add(new THREE.HemisphereLight(0x9aa6ff, 0x3a2a1a, 0.75));
    const moonLight = new THREE.DirectionalLight(0xdfe4ff, 0.55);
    moonLight.position.set(20, 30, -25);
    scene.add(moonLight);

    const rand = seeded(hash(era.id));
    const mat = (color, extra = {}) => new THREE.MeshLambertMaterial({ color, ...extra });
    const glow = (color) => new THREE.MeshBasicMaterial({ color });
    const add = (geo, material, x, y, z, parent = scene) => {
      const m = new THREE.Mesh(geo, material);
      m.position.set(x, y, z);
      parent.add(m);
      return m;
    };

    // 땅·광장·길
    const ground = add(new THREE.CircleGeometry(70, 48), mat(scene3.ground[1]), 0, 0, 0);
    ground.rotation.x = -Math.PI / 2;
    const plaza = add(new THREE.CircleGeometry(13, 48), mat(new THREE.Color(scene3.ground[1]).offsetHSL(0, -0.05, 0.08)), 0, 0.01, 0);
    plaza.rotation.x = -Math.PI / 2;
    for (let z = 3; z < 21; z += 1.4) add(new THREE.BoxGeometry(1.6, 0.06, 0.9), mat("#8d8577"), 0, 0.03, z);

    // 달·별
    add(new THREE.SphereGeometry(5, 24, 24), glow("#fff4cf"), 35, 45, -80);
    const starGeo = new THREE.BufferGeometry();
    const starPos = [];
    for (let i = 0; i < 500; i++) {
      const a = rand() * Math.PI * 2, b = rand() * 0.45 * Math.PI + 0.08;
      starPos.push(Math.cos(a) * Math.cos(b) * 120, Math.sin(b) * 120, Math.sin(a) * Math.cos(b) * 120);
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, fog: false })));

    // 나무 (광장 바깥)
    for (let i = 0; i < 46; i++) {
      const a = rand() * Math.PI * 2, r = 17 + rand() * 18;
      const x = Math.sin(a) * r, z = Math.cos(a) * r;
      if (Math.abs(x) < 3 && z > 0) continue;
      const s = 0.8 + rand() * 0.8;
      add(new THREE.CylinderGeometry(0.15 * s, 0.22 * s, 1.2 * s, 6), mat("#5a3e2b"), x, 0.6 * s, z);
      add(new THREE.ConeGeometry(1.2 * s, 3 * s, 7), mat(rand() > 0.5 ? "#2f5a3a" : "#3d6b45"), x, 2.6 * s, z);
    }

    // 등불 (따뜻한 빛)
    const flames = [];
    [[-3, 6], [3, 6], [-8, -2], [8, -2], [-5, -9], [5, -9]].forEach(([x, z]) => {
      add(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 6), mat("#3b2a20"), x, 0.9, z);
      flames.push(add(new THREE.BoxGeometry(0.42, 0.55, 0.42), glow("#ffcf7a"), x, 2, z));
    });
    const warm = new THREE.PointLight(0xffb866, 1.1, 26);
    warm.position.set(0, 4, 0);
    scene.add(warm);

    buildLandmark(era.id, { add, mat, glow, scene, flames });

    // 시간의 문 (출구)
    const gate = new THREE.Group();
    gate.position.set(0, 0, 21);
    [-1.8, 1.8].forEach((x) => add(new THREE.CylinderGeometry(0.22, 0.25, 3.6, 10), mat("#8e2f25"), x, 1.8, 0, gate));
    add(new THREE.BoxGeometry(4.6, 0.3, 0.4), mat("#2e5a4c"), 0, 3.5, 0, gate);
    const gateRoof = add(new THREE.ConeGeometry(3.3, 1, 4), mat("#2c2f3a"), 0, 4.1, 0, gate);
    gateRoof.rotation.y = Math.PI / 4;
    gateRoof.scale.z = 0.35;
    scene.add(gate);

    /* --- 캐릭터 --- */
    const hat = ERA_HAT[era.id];
    const player = makeAvatar({ robe: ROBES[charIndex], sash: era.color, hat });
    player.group.position.set(0, 0, 11);
    player.group.rotation.y = Math.PI;
    scene.add(player.group);

    const interactables = [];
    const labels = [];
    const addLabel = (obj, html, cls = "", height = 2.45) => {
      const el = document.createElement("div");
      el.className = `w-label ${cls}`;
      el.innerHTML = html;
      labelsEl.appendChild(el);
      labels.push({ obj, el, height });
      return el;
    };
    addLabel(player.group, `<i>${w.me}</i>${esc(nick)}`, "me");

    const pickMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    const walkTo = (item) => {
      if (!dialog.hidden) return;
      pending = item;
      moveTarget = item.obj.position.clone();
    };
    const addInteract = (obj, item, radius = 0.9, height = 2.2) => {
      const hit = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 8), pickMat);
      hit.position.y = height / 2;
      obj.add(hit);
      hit.userData.item = item;
      item.obj = obj;
      item.hit = hit;
      interactables.push(item);
    };

    // 위인 NPC
    const npcs = era.people.map(([name, desc], i) => {
      const n = era.people.length;
      const a = ((35 + (290 * i) / Math.max(n - 1, 1)) * Math.PI) / 180;
      const emoji = scene3.npcs[i];
      const av = makeAvatar({ robe: ROBES[(i * 3 + 1) % ROBES.length], sash: "#f3d27a", hat: ROYAL.includes(emoji) ? "crown" : hat });
      av.group.position.set(Math.sin(a) * 7.5, 0, Math.cos(a) * 7.5);
      av.group.lookAt(0, 0, 0);
      scene.add(av.group);
      const item = { kind: "npc", name, desc, emoji, av, idx: i };
      addInteract(av.group, item);
      item.label = addLabel(av.group, `${emoji} ${name}`, "npc");
      item.label.addEventListener("click", () => walkTo(item));
      return item;
    });

    // 이야기 비석
    era.facts.forEach((fact, i) => {
      const a = ((60 + (240 * i) / Math.max(era.facts.length - 1, 1)) * Math.PI) / 180;
      const g = new THREE.Group();
      g.position.set(Math.sin(a) * 11.5, 0, Math.cos(a) * 11.5);
      add(new THREE.BoxGeometry(1.1, 0.25, 0.7), mat("#5d5a55"), 0, 0.12, 0, g);
      add(new THREE.BoxGeometry(0.8, 1.5, 0.25), mat("#9b968c"), 0, 1, 0, g);
      g.lookAt(0, 0, 0);
      scene.add(g);
      const item = { kind: "stone", name: w.stone(i + 1), desc: fact, emoji: scene3.stone };
      addInteract(g, item, 0.8, 1.8);
      item.label = addLabel(g, `${scene3.stone} ${w.stone(i + 1)}`, "stone", 2.1);
      item.label.addEventListener("click", () => walkTo(item));
    });

    // 시험관
    const examiner = makeAvatar({ robe: "#2b2e45", sash: "#f3d27a", hat: era.id === "joseon" ? "gat" : "crown" });
    examiner.group.position.set(3.2, 0, 8.5);
    examiner.group.lookAt(0, 0, 11);
    scene.add(examiner.group);
    const exItem = { kind: "quiz", name: w.examiner, emoji: "📝", av: examiner };
    addInteract(examiner.group, exItem);
    exItem.label = addLabel(examiner.group, `📝 ${w.examiner}${loadStamps()[era.id] ? " 🏮" : ""}`, "quiz");
    exItem.label.addEventListener("click", () => walkTo(exItem));

    // 출구
    const gateItem = { kind: "exit", name: w.gate, emoji: "🚪" };
    addInteract(gate, gateItem, 2.2, 4);
    addLabel(gate, `🚪 ${w.gate}`, "exit", 5).addEventListener("click", () => walkTo(gateItem));

    // 돌아다니는 주민
    const villagers = Array.from({ length: 4 }, (_, i) => {
      const av = makeAvatar({ robe: ROBES[(i * 5 + 2) % ROBES.length], sash: "#d6cfc0", hat: i % 2 ? hat : "topknot", scale: 0.85 });
      av.group.position.set((rand() - 0.5) * 16, 0, (rand() - 0.5) * 16);
      scene.add(av.group);
      addLabel(av.group, w.villager, "villager", 2.1);
      return { av, target: new THREE.Vector3(), wait: rand() * 3 };
    });

    // 클릭 표시
    const marker = add(new THREE.RingGeometry(0.3, 0.42, 24), new THREE.MeshBasicMaterial({ color: 0xfff4cf, transparent: true, opacity: 0 }), 0, 0.05, 0);
    marker.rotation.x = -Math.PI / 2;

    /* --- 진행 상황 --- */
    const seen = new Set();
    const totalToSee = npcs.length + era.facts.length;
    let completeShown = false;
    const updateProgress = () => {
      root.querySelector("#wProgress").textContent = `🧭 ${w.progress} ${seen.size}/${totalToSee}${loadStamps()[era.id] ? " · 🏮" : ""}`;
    };
    updateProgress();
    let toastTimer;
    const toast = (msg) => {
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
    };

    /* --- 대화창 --- */
    const dlgBody = root.querySelector("#wDlgBody");
    const closeDialog = () => (dialog.hidden = true);
    root.querySelector("#wDlgClose").addEventListener("click", closeDialog);
    const openDialog = (item) => {
      moveTarget = null;
      pending = null;
      if (item.obj) facePoint(player.group, item.obj.position);
      if (item.av) facePoint(item.av.group, player.group.position);
      root.querySelector("#wDlgEmoji").textContent = item.emoji;
      root.querySelector("#wDlgName").textContent = item.name;
      dialog.hidden = false;
      if (item.kind === "npc" || item.kind === "stone") {
        dlgBody.innerHTML = item.kind === "npc" ? `<p class="w-quote">「${text.greet} ${w.iAm(item.name)}」</p><p>${item.desc}</p>` : `<p>${item.desc}</p>`;
        if (item.av) item.av.anim = { type: "wave", t: 0 };
        seen.add(item);
        item.label.classList.add("seen");
        updateProgress();
        if (seen.size === totalToSee && !completeShown) {
          completeShown = true;
          setTimeout(() => toast(w.complete), 600);
        }
      } else if (item.kind === "quiz") {
        dlgBody.innerHTML = `<p class="w-quote">「${w.quizIntro(era.name)}」</p><button class="btn" id="wQuiz">${w.quizStart}</button>`;
        dlgBody.querySelector("#wQuiz").addEventListener("click", () =>
          runQuiz(era, dlgBody, {
            label: w.keep,
            fn: (passed) => {
              closeDialog();
              if (passed) {
                player.anim = { type: "cheer", t: 0 };
                exItem.label.innerHTML = `📝 ${w.examiner} 🏮`;
                updateProgress();
              }
            },
          })
        );
      } else {
        dlgBody.innerHTML = `<p>${w.leaveQ}</p><div class="actions"><button class="btn ghost" id="wStay">${w.keep}</button><button class="btn" id="wLeave">${w.leave}</button></div>`;
        dlgBody.querySelector("#wStay").addEventListener("click", closeDialog);
        dlgBody.querySelector("#wLeave").addEventListener("click", () => (location.hash = `era/${era.id}`));
      }
    };
    root.querySelector("#wExit").addEventListener("click", () => openDialog(gateItem));

    /* --- 동작 --- */
    let nearest = null;
    root.querySelectorAll("[data-gesture]").forEach((b) =>
      b.addEventListener("click", () => {
        const type = b.dataset.gesture;
        player.anim = { type, t: 0 };
        const near = npcs.find((n) => n.av.group.position.distanceTo(player.group.position) < 4.5);
        if (near && type !== "cheer") {
          facePoint(near.av.group, player.group.position);
          setTimeout(() => (near.av.anim = { type, t: 0 }), 450);
          toast(type === "bow" ? w.bowBack(near.name) : w.waveBack(near.name));
        }
      })
    );
    talkBtn.addEventListener("click", () => nearest && openDialog(nearest));

    /* --- 조작: 클릭 이동 · 드래그 회전 · 휠/핀치 확대 · 키보드 --- */
    const cam = { yaw: 0, pitch: 0.42, dist: 8 };
    let moveTarget = null;
    let pending = null;
    const keys = new Set();
    const pointers = new Map();
    let dragMoved = false;
    let pinchDist = 0;
    const canvas = renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    on(canvas, "pointerdown", (e) => {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      dragMoved = false;
      if (pointers.size === 2) {
        const [p1, p2] = [...pointers.values()];
        pinchDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      }
    });
    on(canvas, "pointermove", (e) => {
      const p = pointers.get(e.pointerId);
      if (!p) return;
      if (pointers.size === 2) {
        p.x = e.clientX;
        p.y = e.clientY;
        const [p1, p2] = [...pointers.values()];
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        cam.dist = clamp(cam.dist * (pinchDist / d), 4, 18);
        pinchDist = d;
        dragMoved = true;
        return;
      }
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) dragMoved = true;
      if (dragMoved) {
        cam.yaw -= dx * 0.006;
        cam.pitch = clamp(cam.pitch + dy * 0.004, 0.12, 1.25);
        p.x = e.clientX;
        p.y = e.clientY;
      }
    });
    const endPointer = (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      if (dragMoved || pointers.size) return;
      const rect = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(interactables.map((i) => i.hit))[0];
      if (hit) {
        const item = hit.object.userData.item;
        pending = item;
        moveTarget = item.obj.position.clone();
        return;
      }
      const g = raycaster.intersectObject(ground)[0];
      if (g) {
        pending = null;
        moveTarget = g.point.clone().setY(0);
        marker.position.set(moveTarget.x, 0.05, moveTarget.z);
        marker.material.opacity = 1;
        marker.scale.setScalar(1);
      }
    };
    on(canvas, "pointerup", endPointer);
    on(canvas, "pointercancel", (e) => pointers.delete(e.pointerId));
    on(canvas, "wheel", (e) => {
      e.preventDefault();
      cam.dist = clamp(cam.dist + e.deltaY * 0.01, 4, 18);
    }, { passive: false });
    on(window, "keydown", (e) => {
      if (e.target.closest?.("input, textarea")) return;
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(k)) {
        keys.add(k);
        e.preventDefault();
      } else if ((k === " " || k === "enter") && nearest && dialog.hidden) {
        e.preventDefault();
        openDialog(nearest);
      } else if (k === "escape") closeDialog();
    });
    on(window, "keyup", (e) => keys.delete(e.key.toLowerCase()));
    on(window, "blur", () => keys.clear());

    const resize = () => {
      const { clientWidth: cw, clientHeight: ch } = root;
      renderer.setSize(cw, ch);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
    };
    on(window, "resize", resize);
    resize();

    /* --- 매 프레임 --- */
    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();
    const camTarget = new THREE.Vector3();
    const tick = () => {
      c.raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.1);
      const time = clock.elapsedTime;
      const pos = player.group.position;

      // 키보드 이동 (카메라 방향 기준)
      let ix = 0, iz = 0;
      if (keys.has("w") || keys.has("arrowup")) iz -= 1;
      if (keys.has("s") || keys.has("arrowdown")) iz += 1;
      if (keys.has("a") || keys.has("arrowleft")) ix -= 1;
      if (keys.has("d") || keys.has("arrowright")) ix += 1;
      let moving = false;
      if (ix || iz) {
        moveTarget = null;
        pending = null;
        const sin = Math.sin(cam.yaw), cos = Math.cos(cam.yaw);
        tmp.set(ix * cos + iz * sin, 0, -ix * sin + iz * cos).normalize();
        pos.addScaledVector(tmp, 4.5 * dt);
        player.group.rotation.y = Math.atan2(tmp.x, tmp.z);
        moving = true;
      } else if (moveTarget) {
        tmp.subVectors(moveTarget, pos).setY(0);
        const d = tmp.length();
        const stopAt = pending ? 1.9 : 0.1;
        if (d > stopAt + 0.02) {
          tmp.normalize();
          pos.addScaledVector(tmp, Math.min(4.5 * dt, d - stopAt));
          player.group.rotation.y = Math.atan2(tmp.x, tmp.z);
          moving = true;
        } else {
          moveTarget = null;
          if (pending) openDialog(pending);
        }
      }
      const r = Math.hypot(pos.x, pos.z);
      if (r > 30) pos.multiplyScalar(30 / r);
      animateAvatar(player, dt, time, moving);
      marker.material.opacity = Math.max(0, marker.material.opacity - dt * 1.5);
      marker.scale.multiplyScalar(1 + dt * 0.8);

      // NPC·주민
      npcs.forEach((n) => animateAvatar(n.av, dt, time, false));
      animateAvatar(examiner, dt, time, false);
      villagers.forEach((v) => {
        const vp = v.av.group.position;
        if (v.wait > 0) {
          v.wait -= dt;
          animateAvatar(v.av, dt, time, false);
          if (v.wait <= 0) v.target.set((rand() - 0.5) * 22, 0, (rand() - 0.5) * 22);
          return;
        }
        tmp.subVectors(v.target, vp);
        const d = tmp.length();
        if (d < 0.2) v.wait = 2 + rand() * 4;
        else {
          tmp.normalize();
          vp.addScaledVector(tmp, 1.6 * dt);
          v.av.group.rotation.y = Math.atan2(tmp.x, tmp.z);
        }
        animateAvatar(v.av, dt, time, d >= 0.2);
      });
      flames.forEach((f, i) => f.scale.setScalar(1 + Math.sin(time * 9 + i * 2) * 0.06));
      warm.intensity = 1.05 + Math.sin(time * 7) * 0.08;

      // 가까운 대상
      nearest = null;
      let best = 3;
      interactables.forEach((it) => {
        const d = it.obj.position.distanceTo(pos) - (it.kind === "exit" ? 1.5 : 0);
        if (d < best) {
          best = d;
          nearest = it;
        }
      });
      talkBtn.disabled = !nearest;
      talkBtn.classList.toggle("ready", !!nearest);

      // 카메라: 캐릭터 뒤에서 따라가기
      camTarget.set(pos.x, 1.4, pos.z);
      const cp = Math.cos(cam.pitch);
      tmp.set(pos.x + Math.sin(cam.yaw) * cam.dist * cp, 1.4 + Math.sin(cam.pitch) * cam.dist, pos.z + Math.cos(cam.yaw) * cam.dist * cp);
      camera.position.lerp(tmp, 1 - Math.pow(0.001, dt));
      camera.lookAt(camTarget);
      renderer.render(scene, camera);

      // 이름표
      const cw = root.clientWidth, ch = root.clientHeight;
      labels.forEach(({ obj, el, height }) => {
        tmp.copy(obj.position).setY(obj.position.y + height * (obj.scale?.y || 1)).project(camera);
        const visible = tmp.z < 1 && Math.abs(tmp.x) < 1.2 && Math.abs(tmp.y) < 1.2 && obj.position.distanceTo(camera.position) < 34;
        el.style.display = visible ? "" : "none";
        if (visible) el.style.transform = `translate(-50%, -100%) translate(${((tmp.x + 1) / 2) * cw}px, ${((1 - tmp.y) / 2) * ch}px)`;
      });
    };
    tick();
  },
};

/* ---------- 시대별 랜드마크 ---------- */
function buildLandmark(id, { add, mat, glow, scene, flames }) {
  const hall = (roofColor) => {
    add(new THREE.BoxGeometry(12, 0.5, 6), mat("#6b5644"), 0, 0.25, -14);
    for (let i = 0; i < 4; i++) {
      [-2.4, 2.4].forEach((z) => add(new THREE.CylinderGeometry(0.25, 0.28, 3.6, 10), mat("#8e2f25"), -4.8 + i * 3.2, 2.3, -14 + z));
    }
    add(new THREE.BoxGeometry(11, 0.5, 5.6), mat("#2e5a4c"), 0, 4.2, -14);
    const roof = add(new THREE.ConeGeometry(8.4, 2.6, 4), mat(roofColor), 0, 5.7, -14);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1, 1, 0.55);
    add(new THREE.BoxGeometry(9, 2.4, 0.3), glow("#3a2210"), 0, 2.2, -16.2);
  };
  if (id === "gojoseon") {
    // 고인돌 + 모닥불
    [-0.9, 0.9].forEach((x) => add(new THREE.BoxGeometry(0.5, 1.6, 1.2), mat("#8a857c"), x, 0.8, -4));
    add(new THREE.BoxGeometry(3.2, 0.45, 2.4), mat("#9a958b"), 0, 1.8, -4);
    flames.push(add(new THREE.ConeGeometry(0.6, 1.3, 8), glow("#ff9a3c"), 0, 0.65, 2));
    const fire = new THREE.PointLight(0xff8a3c, 1.4, 14);
    fire.position.set(0, 1.5, 2);
    scene.add(fire);
    for (let i = 0; i < 4; i++) {
      const hut = add(new THREE.ConeGeometry(1.6, 2.6, 8), mat("#7a6143"), -10 + i * 6.5, 1.3, -15 - (i % 2) * 2);
      hut.rotation.y = i;
    }
  } else if (id === "threekingdoms") {
    hall("#3a3d46");
    add(new THREE.BoxGeometry(1.4, 4.4, 1.2), mat("#6f6a62"), 0, 2.2, -4); // 광개토대왕릉비
    [["#c0584f", -6], ["#4f73b3", 0], ["#d4a63a", 6]].forEach(([color, x]) => {
      add(new THREE.CylinderGeometry(0.06, 0.06, 4.5, 6), mat("#3b2a20"), x, 2.25, -9);
      const flag = add(new THREE.PlaneGeometry(1.4, 0.9), mat(color, { side: THREE.DoubleSide }), x + 0.72, 3.9, -9);
      flames.push(flag);
    });
  } else if (id === "silla") {
    hall("#3b3a33");
    // 첨성대
    const pts = [[1.6, 0], [1.55, 1], [1.3, 2.4], [1.05, 3.6], [0.95, 4.6], [1, 5.2]].map(([x, y]) => new THREE.Vector2(x, y));
    add(new THREE.LatheGeometry(pts, 24), mat("#cdb88f"), 0, 0, -4);
    add(new THREE.BoxGeometry(2.3, 0.3, 2.3), mat("#b8a27a"), 0, 5.35, -4);
    add(new THREE.BoxGeometry(0.6, 0.6, 0.2), glow("#1a1208"), 0, 2.6, -2.9);
  } else if (id === "goryeo") {
    hall("#2f4a48");
    // 고려청자 매병
    const pts = [[0.5, 0], [0.9, 0.4], [1.3, 1.4], [1.45, 2.3], [1.2, 2.9], [0.5, 3.2], [0.35, 3.5], [0.5, 3.6]].map(([x, y]) => new THREE.Vector2(x, y));
    add(new THREE.CylinderGeometry(1.2, 1.4, 0.6, 16), mat("#5b4636"), 0, 0.3, -4);
    add(new THREE.LatheGeometry(pts, 28), mat("#8fc4ad"), 0, 0.6, -4);
    // 벽란도 배
    const boat = add(new THREE.BoxGeometry(5, 0.8, 1.6), mat("#6b4a30"), 13, 0.4, -6);
    boat.rotation.y = 0.4;
    add(new THREE.CylinderGeometry(0.08, 0.08, 4, 6), mat("#3b2a20"), 13, 2.6, -6);
    add(new THREE.PlaneGeometry(2, 2.4), mat("#e8e0cc", { side: THREE.DoubleSide }), 13, 2.8, -5.9);
  } else if (id === "joseon") {
    hall("#2b2f3d");
    // 앙부일구(해시계)
    add(new THREE.BoxGeometry(2, 1, 2), mat("#8a857c"), 0, 0.5, -4);
    const bowl = add(new THREE.SphereGeometry(1.2, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat("#9a7b3c", { side: THREE.DoubleSide }), 0, 2.2, -4);
    bowl.scale.y = 0.8;
    add(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), mat("#3b2a20"), 0, 2.2, -4).rotation.x = 0.6;
  } else {
    // 석조전 + 가로등 + 전차
    add(new THREE.BoxGeometry(14, 0.6, 6), mat("#cfcac0"), 0, 0.3, -15);
    add(new THREE.BoxGeometry(13, 4.6, 4.5), mat("#e6e1d6"), 0, 2.9, -15.5);
    for (let i = 0; i < 6; i++) add(new THREE.CylinderGeometry(0.3, 0.3, 4.6, 12), mat("#f4f0e6"), -5 + i * 2, 2.9, -12.8);
    const ped = add(new THREE.CylinderGeometry(1.6, 1.6, 9, 3), mat("#d8d2c4"), 0, 5.7, -12.9);
    ped.rotation.z = Math.PI / 2;
    ped.rotation.x = Math.PI;
    ped.scale.set(0.8, 1, 0.5);
    for (let i = 0; i < 5; i++) add(new THREE.BoxGeometry(0.9, 1.4, 0.1), glow("#ffd98a"), -5.5 + i * 2.75, 3.4, -13.2);
    const tram = new THREE.Group();
    tram.position.set(-11, 0, -3);
    tram.rotation.y = 0.5;
    add(new THREE.BoxGeometry(5, 2.2, 2), mat("#a33a2e"), 0, 1.5, 0, tram);
    add(new THREE.BoxGeometry(5.1, 0.7, 2.05), glow("#ffe2a0"), 0, 1.9, 0, tram);
    add(new THREE.BoxGeometry(5.2, 0.2, 2.2), mat("#efe6cf"), 0, 2.7, 0, tram);
    scene.add(tram);
  }
}

/* ---------- 아바타 ---------- */
function makeAvatar({ robe, sash, hat, scale = 1 }) {
  const g = new THREE.Group();
  const inner = new THREE.Group();
  g.add(inner);
  const m = (color) => new THREE.MeshLambertMaterial({ color });
  const put = (geo, material, x, y, z, parent = inner) => {
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };
  const skin = m("#f1c7a1");
  const hair = m("#2a1f1a");

  // 그림자
  const shadow = put(new THREE.CircleGeometry(0.5, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false }), 0, 0.02, 0, g);
  shadow.rotation.x = -Math.PI / 2;

  [-0.14, 0.14].forEach((x) => put(new THREE.CylinderGeometry(0.11, 0.12, 0.36, 10), m("#ece6d8"), x, 0.18, 0));
  put(new THREE.CylinderGeometry(0.3, 0.44, 0.78, 18), m(robe), 0, 0.72, 0);
  const band = put(new THREE.BoxGeometry(0.17, 0.85, 0.06), m(sash), 0.03, 0.74, 0.34);
  band.rotation.z = 0.55;
  band.rotation.x = -0.18;

  const arm = (side) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.34, 1.02, 0);
    put(new THREE.CylinderGeometry(0.09, 0.11, 0.46, 10), m(robe), 0, -0.22, 0, pivot);
    put(new THREE.SphereGeometry(0.09, 10, 10), skin, 0, -0.47, 0, pivot);
    pivot.rotation.z = side * 0.28;
    inner.add(pivot);
    return pivot;
  };
  const armL = arm(-1), armR = arm(1);

  const head = new THREE.Group();
  head.position.y = 1.5;
  inner.add(head);
  put(new THREE.SphereGeometry(0.42, 22, 18), skin, 0, 0, 0, head);
  [-0.14, 0.14].forEach((x) => put(new THREE.SphereGeometry(0.045, 8, 8), m("#1b1514"), x, 0.02, 0.39, head));
  [-0.24, 0.24].forEach((x) => {
    const b = put(new THREE.SphereGeometry(0.07, 8, 8), m("#f2a39a"), x, -0.09, 0.33, head);
    b.scale.set(1, 0.6, 0.4);
  });
  const cap = () => put(new THREE.SphereGeometry(0.44, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2.1), hair, 0, 0.03, -0.02, head);
  if (hat === "topknot") {
    cap();
    put(new THREE.SphereGeometry(0.13, 12, 10), hair, 0, 0.48, -0.05, head);
  } else if (hat === "band") {
    cap();
    const t = put(new THREE.TorusGeometry(0.42, 0.04, 8, 24), m("#b8463c"), 0, 0.12, 0, head);
    t.rotation.x = Math.PI / 2;
  } else if (hat === "gat") {
    cap();
    const black = new THREE.MeshLambertMaterial({ color: 0x14141a, transparent: true, opacity: 0.88 });
    put(new THREE.CylinderGeometry(0.62, 0.62, 0.025, 28), black, 0, 0.36, 0, head);
    put(new THREE.CylinderGeometry(0.2, 0.23, 0.34, 18), black, 0, 0.54, 0, head);
  } else if (hat === "crown") {
    cap();
    put(new THREE.CylinderGeometry(0.28, 0.3, 0.24, 16), m("#e5b93c"), 0, 0.46, 0, head);
    [-0.16, 0, 0.16].forEach((x) => put(new THREE.SphereGeometry(0.05, 8, 8), m("#c0584f"), x, 0.62, 0.18, head));
  } else if (hat === "helmet") {
    put(new THREE.SphereGeometry(0.46, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2.2), m("#6d7380"), 0, 0.04, -0.02, head);
    put(new THREE.ConeGeometry(0.08, 0.35, 10), m("#c0584f"), 0, 0.6, 0, head);
  } else if (hat === "western") {
    cap();
    put(new THREE.CylinderGeometry(0.52, 0.52, 0.03, 26), m("#1d1a1a"), 0, 0.3, 0, head);
    put(new THREE.SphereGeometry(0.33, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), m("#1d1a1a"), 0, 0.3, 0, head);
  }
  g.scale.setScalar(scale);
  return { group: g, inner, head, armL, armR, anim: null, phase: Math.random() * 6 };
}

// 걷기·숨쉬기·인사·절·만세 동작
function animateAvatar(av, dt, time, moving) {
  const t = time + av.phase;
  av.inner.position.y = moving ? Math.abs(Math.sin(t * 10)) * 0.08 : Math.sin(t * 2) * 0.012;
  let armL = -0.28, armR = 0.28, swingL = 0, swingR = 0, bow = 0;
  if (moving) {
    swingL = Math.sin(t * 10) * 0.6;
    swingR = -swingL;
  }
  if (av.anim) {
    av.anim.t += dt;
    const p = av.anim.t;
    if (av.anim.type === "wave") {
      armR = 2.5 + Math.sin(p * 14) * 0.35;
      if (p > 1.6) av.anim = null;
    } else if (av.anim.type === "bow") {
      bow = Math.sin(Math.min(p / 1.6, 1) * Math.PI) * 0.75;
      swingL = swingR = -bow * 0.5;
      if (p > 1.6) av.anim = null;
    } else if (av.anim.type === "cheer") {
      const up = Math.abs(Math.sin(p * 5));
      armL = -2.6 * up - 0.3;
      armR = 2.6 * up + 0.3;
      av.inner.position.y += up * 0.15;
      if (p > 1.9) av.anim = null;
    }
  }
  av.armL.rotation.z = armL;
  av.armR.rotation.z = armR;
  av.armL.rotation.x = swingL;
  av.armR.rotation.x = swingR;
  av.inner.rotation.x = bow;
}

function facePoint(obj, point) {
  obj.rotation.y = Math.atan2(point.x - obj.position.x, point.z - obj.position.z);
}
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
function seeded(seed) {
  let s = seed || 1;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
