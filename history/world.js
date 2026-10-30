// 시대별 3D 입장 공간: 공용 엔진(이동·충돌·대화·동작) + 시대별 공간. 조선은 palace.js의 경복궁을 사용해요.
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
    wave: "인사하기", shake: "악수하기", cheer: "만세하기", talk: "말 걸기",
    iAm: (n) => `나는 ${n}이오.`,
    quizIntro: (era) => `${era}에 대해 얼마나 알고 있소? 4문제 중 3문제를 맞히면 도장을 찍어 주겠소.`,
    quizStart: "📝 시험 보기",
    keep: "계속 둘러보기",
    leaveQ: "현재로 돌아갈까요?",
    leave: "나가기",
    shakeBack: (n) => `${n} 님과 악수를 나눴어요 🤝`,
    waveBack: (n) => `${n} 님이 손을 흔들어요 👋`,
    complete: "🎉 모든 곳을 둘러봤어요! 이제 시험관에게 가 보세요.",
    progress: "탐험",
    map: "🗺️ 지도",
    mapTitle: "어디로 갈까요?",
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
    wave: "Wave", shake: "Handshake", cheer: "Cheer", talk: "Talk",
    iAm: (n) => `I am ${n}.`,
    quizIntro: (era) => `How much do you know about ${era}? Get 3 of 4 right and I'll give you my stamp.`,
    quizStart: "📝 Take the test",
    keep: "Keep exploring",
    leaveQ: "Return to the present?",
    leave: "Leave",
    shakeBack: (n) => `You shook hands with ${n} 🤝`,
    waveBack: (n) => `${n} waves back 👋`,
    complete: "🎉 You've explored everything! Now visit the Examiner.",
    progress: "Explored",
    map: "🗺️ Map",
    mapTitle: "Where to?",
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
  if (era.id === "joseon") return renderPalaceDresser(era);
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
  const ready = era.id === "joseon" ? loadPalaceAvatar() : profile.nick && loadChars()[era.id] !== undefined;
  if (!ready) {
    location.replace(`#enter/${era.id}`);
    return;
  }
  const place = era.id === "joseon" ? P().place : sceneText(era.id).place;
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
      World.start(era, document.getElementById("world"));
    })
    .catch(() => {
      document.getElementById("worldLoading").innerHTML = `${w.loadFail}<br /><button class="btn" onclick="location.hash='era/${era.id}'">${w.back}</button>`;
    });
}

const World = {
  ctx: null,

  leave() {
    if (typeof stopPalacePreview === "function") stopPalacePreview();
    enterWorld.token = null;
    const c = this.ctx;
    if (!c) return;
    this.ctx = null;
    cancelAnimationFrame(c.raf);
    c.cleanup.forEach((fn) => fn());
    c.renderer.dispose();
    c.renderer.forceContextLoss();
  },

  start(era, root) {
    const level = era.id === "joseon" ? createPalaceLevel(era) : createEraLevel(era);
    runEngine(era, root, level, this);
  },
};

/* ---------- 공용 엔진 ---------- */
function runEngine(era, root, level, holder) {
  const w = W();
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch {
    root.innerHTML = `<div class="world-loading">${w.noWebgl}<br /><button class="btn" onclick="location.hash='era/${era.id}'">${w.back}</button></div>`;
    return;
  }
  const c = (holder.ctx = { renderer, cleanup: [], raf: 0 });
  const on = (target, type, fn, opts) => {
    target.addEventListener(type, fn, opts);
    c.cleanup.push(() => target.removeEventListener(type, fn, opts));
  };

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  if (level.shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  root.innerHTML = `
    <div class="w-labels" id="wLabels"></div>
    <div class="w-top">
      <div class="w-left">
        <button class="w-icon" id="wExit" aria-label="${w.leave}">⎋</button>
        <div class="w-room">${level.icon || "🏯"} <b>${level.place}</b><span>${level.roomText}</span></div>
      </div>
      <div class="w-right" id="wRight">
        <span class="w-pill" id="wProgress"></span>
        ${level.places ? `<button class="w-pill w-btn" id="wMap">${w.map}</button>` : ""}
        <span class="w-pill w-crowd">👥 ${level.crowdText}</span>
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
      <button data-gesture="shake"><span>🤝</span>${w.shake}</button>
      <button data-gesture="cheer"><span>🙌</span>${w.cheer}</button>
      <button id="wTalk" disabled><span>💬</span>${w.talk}</button>
    </nav>`;
  root.prepend(renderer.domElement);
  const labelsEl = root.querySelector("#wLabels");
  const dialog = root.querySelector("#wDialog");
  const toastEl = root.querySelector("#wToast");
  const talkBtn = root.querySelector("#wTalk");
  setTimeout(() => root.querySelector("#wHint")?.classList.add("fade"), 6000);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, level.far || 200);
  const rand = seeded(hash(era.id));
  const mat = (color, extra = {}) => new THREE.MeshLambertMaterial({ color, ...extra });
  const glow = (color) => new THREE.MeshBasicMaterial({ color });
  const add = (geo, material, x, y, z, parent = scene) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };

  const interactables = [];
  const labels = [];
  const colliders = [];
  const floors = [];
  const camBlocks = [];
  const tickers = [];
  const wanderers = [];
  const npcAvatars = [];
  let player = null;
  let moveTarget = null;
  let pending = null;

  const addLabel = (obj, html, cls = "", height = 2.45, range = 34) => {
    const el = document.createElement("div");
    el.className = `w-label ${cls}`;
    el.innerHTML = html;
    labelsEl.appendChild(el);
    labels.push({ obj, el, height, range });
    return el;
  };
  const walkTo = (item) => {
    if (!dialog.hidden) return;
    pending = item;
    moveTarget = item.obj.position.clone();
  };
  const pickMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const addInteract = (obj, item, radius = 0.9, height = 2.2) => {
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 8), pickMat);
    hit.position.y = height / 2;
    obj.add(hit);
    hit.userData.item = item;
    item.obj = obj;
    item.hit = hit;
    if (item.count === undefined) item.count = item.kind === "npc" || item.kind === "sign";
    interactables.push(item);
    if (item.labelHtml) {
      item.label = addLabel(obj, item.labelHtml, item.labelCls || item.kind, item.labelHeight || 2.45);
      item.label.addEventListener("click", () => walkTo(item));
    }
    return item;
  };
  const floorAt = (x, z) => floors.reduce((h, f) => (x >= f[0] && x <= f[1] && z >= f[2] && z <= f[3] ? Math.max(h, f[4]) : h), 0);
  const blocked = (x, z) => colliders.some((b) => x > b[0] - 0.35 && x < b[1] + 0.35 && z > b[2] - 0.35 && z < b[3] + 0.35);

  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  };

  const api = {
    THREE, scene, camera, renderer, root, rand, add, mat, glow, on, addLabel, addInteract, toast,
    // low: 물처럼 사람은 못 지나가도 카메라는 지나갈 수 있는 곳
    addCollider: (x1, x2, z1, z2, low = false) => colliders.push([x1, x2, z1, z2, low]),
    addFloor: (x1, x2, z1, z2, h) => floors.push([x1, x2, z1, z2, h]),
    // 지붕처럼 카메라가 들어가면 안 되는 공간 (바닥면 + 꼭대기 높이)
    addCamBlock: (x1, x2, z1, z2, top) => camBlocks.push([x1, x2, z1, z2, top]),
    floorAt,
    setPlayer(av, x, z, ry) {
      player = av;
      av.group.position.set(x, floorAt(x, z), z);
      av.group.rotation.y = ry;
      scene.add(av.group);
    },
    addNpcAvatar(av) {
      npcAvatars.push(av);
    },
    addWanderer(av, box, speed = 1.6) {
      // 건물 안에 서지 않도록 빈자리를 찾아요
      for (let i = 0; i < 30; i++) {
        av.group.position.set(box[0] + rand() * (box[1] - box[0]), 0, box[2] + rand() * (box[3] - box[2]));
        if (!blocked(av.group.position.x, av.group.position.z)) break;
      }
      scene.add(av.group);
      wanderers.push({ av, box, speed, target: new THREE.Vector3(), wait: rand() * 3 });
    },
    onTick: (fn) => tickers.push(fn),
  };
  level.build(api);

  /* --- 진행 상황 --- */
  const seen = new Set();
  const totalToSee = interactables.filter((i) => i.count).length;
  let completeShown = false;
  const updateProgress = () => {
    root.querySelector("#wProgress").textContent = `🧭 ${w.progress} ${seen.size}/${totalToSee}${loadStamps()[era.id] ? " · 🏮" : ""}`;
  };
  updateProgress();

  /* --- 대화창 --- */
  const dlgBody = root.querySelector("#wDlgBody");
  const closeDialog = () => (dialog.hidden = true);
  root.querySelector("#wDlgClose").addEventListener("click", closeDialog);
  const showDialog = (emoji, name) => {
    moveTarget = null;
    pending = null;
    root.querySelector("#wDlgEmoji").textContent = emoji;
    root.querySelector("#wDlgName").textContent = name;
    dialog.hidden = false;
  };
  const openDialog = (item) => {
    showDialog(item.emoji, item.name);
    if (item.obj) facePoint(player.group, item.obj.position);
    if (item.av) facePoint(item.av.group, player.group.position);
    if (item.kind === "npc" || item.kind === "talk") {
      dlgBody.innerHTML = `<p class="w-quote">「${item.say || `${level.greet} ${w.iAm(item.name)}`}」</p><p>${item.desc}</p>`;
      if (item.av) item.av.anim = { type: "wave", t: 0 };
    } else if (item.kind === "sign") {
      dlgBody.innerHTML = `${item.sub ? `<p class="w-sub">${item.sub}</p>` : ""}<p>${item.desc}</p>`;
    } else if (item.kind === "quiz") {
      const quizEra = level.quizEra || era;
      dlgBody.innerHTML = `<p class="w-quote">「${item.say || w.quizIntro(quizEra.name)}」</p><button class="btn" id="wQuiz">${w.quizStart}</button>`;
      dlgBody.querySelector("#wQuiz").addEventListener("click", () =>
        runQuiz(quizEra, dlgBody, {
          label: w.keep,
          fn: (passed) => {
            closeDialog();
            if (passed) {
              player.anim = { type: "cheer", t: 0 };
              if (item.label) item.label.innerHTML = `${item.labelHtml} 🏮`;
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
    if (item.count && !seen.has(item)) {
      seen.add(item);
      item.label?.classList.add("seen");
      updateProgress();
      if (seen.size === totalToSee && !completeShown) {
        completeShown = true;
        setTimeout(() => toast(w.complete), 600);
      }
    }
  };
  root.querySelector("#wExit").addEventListener("click", () => openDialog({ kind: "exit", emoji: "🚪", name: w.leave }));

  // 지도: 장소로 순간이동
  root.querySelector("#wMap")?.addEventListener("click", () => {
    showDialog("🗺️", w.mapTitle);
    dlgBody.innerHTML = `<div class="w-map">${level.places.map((p, i) => `<button data-i="${i}">${p.name}</button>`).join("")}</div>`;
    dlgBody.querySelectorAll("[data-i]").forEach((b) =>
      b.addEventListener("click", () => {
        const p = level.places[Number(b.dataset.i)];
        player.group.position.set(p.x, floorAt(p.x, p.z), p.z);
        player.group.rotation.y = Math.PI;
        cam.yaw = 0;
        camera.position.set(p.x, 6, p.z + 9);
        closeDialog();
        toast(`📍 ${p.name}`);
      })
    );
  });

  /* --- 동작 --- */
  let nearest = null;
  root.querySelectorAll("[data-gesture]").forEach((b) =>
    b.addEventListener("click", () => {
      const type = b.dataset.gesture;
      player.anim = { type, t: 0 };
      const near = interactables.find((n) => n.av && n.av.group.position.distanceTo(player.group.position) < 4.5);
      if (near && type !== "cheer") {
        facePoint(near.av.group, player.group.position);
        if (type === "shake") facePoint(player.group, near.av.group.position);
        setTimeout(() => (near.av.anim = { type, t: 0 }), type === "shake" ? 150 : 450);
        toast(type === "shake" ? w.shakeBack(near.name) : w.waveBack(near.name));
      }
    })
  );
  talkBtn.addEventListener("click", () => nearest && openDialog(nearest));

  /* --- 조작: 클릭 이동 · 드래그 회전 · 휠/핀치 확대 · 키보드 --- */
  const cam = { yaw: 0, pitch: level.camPitch || 0.42, dist: level.camDist || 8 };
  const keys = new Set();
  const pointers = new Map();
  let dragMoved = false;
  let pinchDist = 0;
  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const marker = add(new THREE.RingGeometry(0.3, 0.42, 24), new THREE.MeshBasicMaterial({ color: 0xfff4cf, transparent: true, opacity: 0, depthWrite: false }), 0, 0.05, 0);
  marker.rotation.x = -Math.PI / 2;
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

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
      cam.dist = clamp(cam.dist * (pinchDist / d), 4, 24);
      pinchDist = d;
      dragMoved = true;
      return;
    }
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragMoved = true;
    if (dragMoved) {
      cam.yaw -= dx * 0.006;
      cam.pitch = clamp(cam.pitch + dy * 0.004, 0.08, 1.3);
      p.x = e.clientX;
      p.y = e.clientY;
    }
  });
  on(canvas, "pointerup", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (dragMoved || pointers.size) return;
    const rect = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(interactables.map((i) => i.hit))[0];
    if (hit) return walkTo(hit.object.userData.item);
    groundPlane.constant = -player.group.position.y;
    const point = raycaster.ray.intersectPlane(groundPlane, new THREE.Vector3());
    if (point) {
      pending = null;
      moveTarget = point.setY(0);
      marker.position.set(point.x, floorAt(point.x, point.z) + 0.05, point.z);
      marker.material.opacity = 1;
      marker.scale.setScalar(1);
    }
  });
  on(canvas, "pointercancel", (e) => pointers.delete(e.pointerId));
  on(canvas, "wheel", (e) => {
    e.preventDefault();
    cam.dist = clamp(cam.dist + e.deltaY * 0.01, 4, 24);
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

  // 충돌을 피해 축별로 이동 (벽에 닿으면 미끄러지듯)
  const step = (pos, dx, dz) => {
    if (!blocked(pos.x + dx, pos.z)) pos.x += dx;
    if (!blocked(pos.x, pos.z + dz)) pos.z += dz;
  };

  /* --- 매 프레임 --- */
  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  const speed = level.speed || 4.5;
  const bound = level.bound || 30;
  const tick = () => {
    c.raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.1);
    const time = clock.elapsedTime;
    const pos = player.group.position;

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
      step(pos, tmp.x * speed * dt, tmp.z * speed * dt);
      player.group.rotation.y = Math.atan2(tmp.x, tmp.z);
      moving = true;
    } else if (moveTarget) {
      tmp.subVectors(moveTarget, pos).setY(0);
      const d = tmp.length();
      const stopAt = pending ? 1.9 : 0.1;
      if (d > stopAt + 0.02) {
        tmp.normalize();
        const len = Math.min(speed * dt, d - stopAt);
        const before = pos.x + pos.z;
        step(pos, tmp.x * len, tmp.z * len);
        player.group.rotation.y = Math.atan2(tmp.x, tmp.z);
        moving = true;
        if (Math.abs(pos.x + pos.z - before) < 1e-4) moveTarget = pending = null; // 벽에 막힘
      } else {
        moveTarget = null;
        if (pending) openDialog(pending);
      }
    }
    if (level.clampPos) level.clampPos(pos);
    else {
      const r = Math.hypot(pos.x, pos.z);
      if (r > bound) pos.multiplyScalar(bound / r);
    }
    pos.y += (floorAt(pos.x, pos.z) - pos.y) * Math.min(1, dt * 12);
    animateAvatar(player, dt, time, moving);
    marker.material.opacity = Math.max(0, marker.material.opacity - dt * 1.5);
    marker.scale.multiplyScalar(1 + dt * 0.8);

    npcAvatars.forEach((av) => animateAvatar(av, dt, time, false));
    wanderers.forEach((v) => {
      const vp = v.av.group.position;
      if (v.wait > 0) {
        v.wait -= dt;
        animateAvatar(v.av, dt, time, false);
        if (v.wait <= 0) v.target.set(v.box[0] + rand() * (v.box[1] - v.box[0]), 0, v.box[2] + rand() * (v.box[3] - v.box[2]));
        return;
      }
      tmp.subVectors(v.target, vp).setY(0);
      const d = tmp.length();
      if (d < 0.2) v.wait = 2 + rand() * 4;
      else {
        tmp.normalize();
        const bx = vp.x, bz = vp.z;
        step(vp, tmp.x * v.speed * dt, tmp.z * v.speed * dt);
        if (Math.abs(vp.x - bx) + Math.abs(vp.z - bz) < 1e-4) v.wait = 1;
        v.av.group.rotation.y = Math.atan2(tmp.x, tmp.z);
      }
      vp.y = floorAt(vp.x, vp.z);
      animateAvatar(v.av, dt, time, d >= 0.2);
    });
    tickers.forEach((fn) => fn(dt, time, pos));

    nearest = null;
    let best = 3;
    interactables.forEach((it) => {
      const d = it.obj.position.distanceTo(pos) - (it.reach || 0);
      if (d < best) {
        best = d;
        nearest = it;
      }
    });
    talkBtn.disabled = !nearest;
    talkBtn.classList.toggle("ready", !!nearest);

    // 카메라: 캐릭터 뒤에서 따라가기
    camTarget.set(pos.x, pos.y + 1.4, pos.z);
    // 카메라가 건물 안으로 들어가지 않도록 거리를 줄여요
    // 먼저 위로 올려 지붕 너머에서 내려다보고, 그래도 막히면 거리를 줄여요
    let dist = cam.dist, pitch = cam.pitch;
    for (let k = 0; k < 12; k++) {
      const pc = Math.cos(pitch);
      const cx = pos.x + Math.sin(cam.yaw) * dist * pc, cz = pos.z + Math.cos(cam.yaw) * dist * pc;
      const cy = pos.y + 1.4 + Math.sin(pitch) * dist;
      const inWall = colliders.some((b) => !b[4] && cx > b[0] - 0.6 && cx < b[1] + 0.6 && cz > b[2] - 0.6 && cz < b[3] + 0.6);
      const inRoof = camBlocks.some((b) => cy < b[4] + 0.8 && cx > b[0] && cx < b[1] && cz > b[2] && cz < b[3]);
      if ((!inWall && !inRoof) || dist < 2.5) break;
      if (pitch < 1.15) pitch = Math.min(1.15, pitch + 0.16);
      else dist *= 0.75;
    }
    const pc = Math.cos(pitch);
    tmp.set(pos.x + Math.sin(cam.yaw) * dist * pc, pos.y + 1.4 + Math.sin(pitch) * dist, pos.z + Math.cos(cam.yaw) * dist * pc);
    camera.position.lerp(tmp, 1 - Math.pow(0.001, dt));
    camera.lookAt(camTarget);
    renderer.render(scene, camera);

    const cw = root.clientWidth, ch = root.clientHeight;
    labels.forEach(({ obj, el, height, range }) => {
      tmp.setFromMatrixPosition(obj.matrixWorld);
      tmp.y += height * (obj.scale?.y || 1);
      const dist = tmp.distanceTo(camera.position);
      tmp.project(camera);
      const visible = tmp.z < 1 && Math.abs(tmp.x) < 1.2 && Math.abs(tmp.y) < 1.2 && dist < range;
      el.style.display = visible ? "" : "none";
      if (visible) el.style.transform = `translate(-50%, -100%) translate(${((tmp.x + 1) / 2) * cw}px, ${((1 - tmp.y) / 2) * ch}px)`;
    });
  };
  tick();
}

/* ---------- 시대 공간 (조선 외) ---------- */
function createEraLevel(era) {
  const w = W();
  const scene3 = SCENES[era.id];
  const text = sceneText(era.id);
  const profile = loadProfile() || {};
  return {
    place: text.place,
    roomText: `${w.room} ${roomNumber(era, profile.nick)}`,
    crowdText: w.villagers(4),
    greet: text.greet,
    build(api) {
      const { scene, add, mat, glow, rand, addLabel, addInteract } = api;
      const sky = new THREE.Color(scene3.ground[0]).lerp(new THREE.Color("#0b0d2a"), 0.75);
      scene.background = sky;
      scene.fog = new THREE.Fog(sky, 22, 60);
      scene.add(new THREE.HemisphereLight(0x9aa6ff, 0x3a2a1a, 0.75));
      const moonLight = new THREE.DirectionalLight(0xdfe4ff, 0.55);
      moonLight.position.set(20, 30, -25);
      scene.add(moonLight);

      const ground = add(new THREE.CircleGeometry(70, 48), mat(scene3.ground[1]), 0, 0, 0);
      ground.rotation.x = -Math.PI / 2;
      const plaza = add(new THREE.CircleGeometry(13, 48), mat(new THREE.Color(scene3.ground[1]).offsetHSL(0, -0.05, 0.08)), 0, 0.01, 0);
      plaza.rotation.x = -Math.PI / 2;
      for (let z = 3; z < 21; z += 1.4) add(new THREE.BoxGeometry(1.6, 0.06, 0.9), mat("#8d8577"), 0, 0.03, z);

      add(new THREE.SphereGeometry(5, 24, 24), glow("#fff4cf"), 35, 45, -80);
      scene.add(makeStars(rand, 500, 0.6));

      for (let i = 0; i < 46; i++) {
        const a = rand() * Math.PI * 2, r = 17 + rand() * 18;
        const x = Math.sin(a) * r, z = Math.cos(a) * r;
        if (Math.abs(x) < 3 && z > 0) continue;
        addTree(api, x, z, 0.8 + rand() * 0.8, rand() > 0.5 ? "#2f5a3a" : "#3d6b45");
      }

      const flames = [];
      [[-3, 6], [3, 6], [-8, -2], [8, -2], [-5, -9], [5, -9]].forEach(([x, z]) => {
        add(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 6), mat("#3b2a20"), x, 0.9, z);
        flames.push(add(new THREE.BoxGeometry(0.42, 0.55, 0.42), glow("#ffcf7a"), x, 2, z));
      });
      const warm = new THREE.PointLight(0xffb866, 1.1, 26);
      warm.position.set(0, 4, 0);
      scene.add(warm);
      buildLandmark(era.id, { add, mat, glow, scene, flames });
      api.onTick((dt, time) => {
        flames.forEach((f, i) => f.scale.setScalar(1 + Math.sin(time * 9 + i * 2) * 0.06));
        warm.intensity = 1.05 + Math.sin(time * 7) * 0.08;
      });

      // 시간의 문 (출구)
      const gate = new THREE.Group();
      gate.position.set(0, 0, 21);
      [-1.8, 1.8].forEach((x) => add(new THREE.CylinderGeometry(0.22, 0.25, 3.6, 10), mat("#8e2f25"), x, 1.8, 0, gate));
      add(new THREE.BoxGeometry(4.6, 0.3, 0.4), mat("#2e5a4c"), 0, 3.5, 0, gate);
      const gateRoof = add(new THREE.ConeGeometry(3.3, 1, 4), mat("#2c2f3a"), 0, 4.1, 0, gate);
      gateRoof.rotation.y = Math.PI / 4;
      gateRoof.scale.z = 0.35;
      scene.add(gate);
      addInteract(gate, { kind: "exit", name: w.gate, emoji: "🚪", reach: 1.5, labelHtml: `🚪 ${w.gate}`, labelHeight: 5 }, 2.2, 4);

      const hat = ERA_HAT[era.id];
      const player = makeAvatar({ robe: ROBES[loadChars()[era.id] ?? 0], sash: era.color, hat });
      api.setPlayer(player, 0, 11, Math.PI);
      addLabel(player.group, `<i>${w.me}</i>${esc(profile.nick || "")}`, "me");

      era.people.forEach(([name, desc], i) => {
        const n = era.people.length;
        const a = ((35 + (290 * i) / Math.max(n - 1, 1)) * Math.PI) / 180;
        const emoji = scene3.npcs[i];
        const av = makeAvatar({ robe: ROBES[(i * 3 + 1) % ROBES.length], sash: "#f3d27a", hat: ROYAL.includes(emoji) ? "crown" : hat });
        av.group.position.set(Math.sin(a) * 7.5, 0, Math.cos(a) * 7.5);
        av.group.lookAt(0, 0, 0);
        scene.add(av.group);
        api.addNpcAvatar(av);
        addInteract(av.group, { kind: "npc", name, desc, emoji, av, labelHtml: `${emoji} ${name}` });
      });

      era.facts.forEach((fact, i) => {
        const a = ((60 + (240 * i) / Math.max(era.facts.length - 1, 1)) * Math.PI) / 180;
        const g = new THREE.Group();
        g.position.set(Math.sin(a) * 11.5, 0, Math.cos(a) * 11.5);
        add(new THREE.BoxGeometry(1.1, 0.25, 0.7), mat("#5d5a55"), 0, 0.12, 0, g);
        add(new THREE.BoxGeometry(0.8, 1.5, 0.25), mat("#9b968c"), 0, 1, 0, g);
        g.lookAt(0, 0, 0);
        scene.add(g);
        addInteract(g, { kind: "sign", name: w.stone(i + 1), desc: fact, emoji: scene3.stone, labelHtml: `${scene3.stone} ${w.stone(i + 1)}`, labelCls: "stone", labelHeight: 2.1 }, 0.8, 1.8);
      });

      const examiner = makeAvatar({ robe: "#2b2e45", sash: "#f3d27a", hat: "crown" });
      examiner.group.position.set(3.2, 0, 8.5);
      examiner.group.lookAt(0, 0, 11);
      scene.add(examiner.group);
      api.addNpcAvatar(examiner);
      addInteract(examiner.group, { kind: "quiz", name: w.examiner, emoji: "📝", av: examiner, labelHtml: `📝 ${w.examiner}`, labelCls: "quiz" });

      for (let i = 0; i < 4; i++) {
        const av = makeAvatar({ robe: ROBES[(i * 5 + 2) % ROBES.length], sash: "#d6cfc0", hat: i % 2 ? hat : "topknot", scale: 0.85 });
        api.addWanderer(av, [-11, 11, -11, 11]);
        addLabel(av.group, w.villager, "villager", 2.1);
      }
    },
  };
}

function addTree(api, x, z, s, color = "#2f5a3a", pine = true) {
  const { add, mat } = api;
  add(new THREE.CylinderGeometry(0.15 * s, 0.22 * s, 1.2 * s, 6), mat("#5a3e2b"), x, 0.6 * s, z);
  if (pine) add(new THREE.ConeGeometry(1.2 * s, 3 * s, 7), mat(color), x, 2.6 * s, z);
  else add(new THREE.SphereGeometry(1.4 * s, 10, 8), mat(color), x, 2.2 * s, z);
}

function makeStars(rand, count, size) {
  const geo = new THREE.BufferGeometry();
  const pos = [];
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2, b = rand() * 0.45 * Math.PI + 0.08;
    pos.push(Math.cos(a) * Math.cos(b) * 120, Math.sin(b) * 120, Math.sin(a) * Math.cos(b) * 120);
  }
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size, fog: false, transparent: true }));
}

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
// body: "robe"(도포·곤룡포·단령) | "dress"(저고리·당의 + 치마)
// hat: topknot·band·gat·crown·helmet·western·bald + 궁궐용 ikseon(익선관)·samo(사모)·jeonrip(전립)·gache(어여머리)·princess(댕기머리)·bun(쪽머리)·naegwan
// deco: 흉배·띠(robe) 또는 치마(dress) 색, patch: round(보)·square(흉배), acc: 노리개, weapon: sword·spear
function makeAvatar({ robe, sash, hat, scale = 1, skin = "#f1c7a1", body = "robe", deco, patch, acc, weapon }) {
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
  const skinM = m(skin);
  const hair = m("#2a1f1a");
  const black = m("#16161c");
  const gold = m("#e5b93c");

  const shadow = put(new THREE.CircleGeometry(0.5, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false }), 0, 0.02, 0, g);
  shadow.rotation.x = -Math.PI / 2;

  if (body === "dress") {
    // 치마 + 저고리(당의)
    put(new THREE.CylinderGeometry(0.3, 0.56, 0.95, 20), m(deco || "#c94a6b"), 0, 0.48, 0);
    put(new THREE.CylinderGeometry(0.26, 0.36, 0.42, 18), m(robe), 0, 1.06, 0);
    const ribbon = put(new THREE.BoxGeometry(0.08, 0.3, 0.04), m("#b3262d"), 0.08, 1.0, 0.34);
    ribbon.rotation.z = 0.2;
  } else {
    [-0.14, 0.14].forEach((x) => put(new THREE.CylinderGeometry(0.11, 0.12, 0.36, 10), m("#ece6d8"), x, 0.18, 0));
    put(new THREE.CylinderGeometry(0.3, 0.44, 0.78, 18), m(robe), 0, 0.72, 0);
    if (deco) {
      const belt = put(new THREE.TorusGeometry(0.36, 0.035, 6, 24), m(deco), 0, 0.82, 0);
      belt.rotation.x = Math.PI / 2;
    } else {
      const band = put(new THREE.BoxGeometry(0.17, 0.85, 0.06), m(sash), 0.03, 0.74, 0.34);
      band.rotation.z = 0.55;
      band.rotation.x = -0.18;
    }
    if (patch) {
      // 가슴의 흉배(사각) 또는 보(둥근 용무늬)
      const p = patch === "round" ? put(new THREE.CircleGeometry(0.15, 20), gold, 0, 0.96, 0.33) : put(new THREE.PlaneGeometry(0.26, 0.24), m(deco || "#2f5d8a"), 0, 0.95, 0.335);
      p.rotation.x = -0.18;
      if (patch === "round") put(new THREE.CircleGeometry(0.09, 16), m("#b3262d"), 0, 0.965, 0.345).rotation.x = -0.18;
    }
  }
  if (acc) {
    // 노리개
    put(new THREE.SphereGeometry(0.05, 8, 8), m("#b3262d"), -0.16, 0.86, 0.33);
    put(new THREE.ConeGeometry(0.06, 0.24, 8), m(deco || "#d9a62e"), -0.16, 0.7, 0.33).rotation.x = Math.PI;
  }

  const arm = (side) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * (body === "dress" ? 0.3 : 0.34), body === "dress" ? 1.18 : 1.02, 0);
    put(new THREE.CylinderGeometry(0.09, 0.11, 0.46, 10), m(robe), 0, -0.22, 0, pivot);
    put(new THREE.SphereGeometry(0.09, 10, 10), skinM, 0, -0.47, 0, pivot);
    pivot.rotation.z = side * 0.28;
    inner.add(pivot);
    return pivot;
  };
  const armL = arm(-1), armR = arm(1);
  if (weapon === "sword") {
    const sw = put(new THREE.BoxGeometry(0.05, 0.8, 0.07), m("#3b2a20"), -0.42, 0.62, 0.05);
    sw.rotation.z = 0.25;
  } else if (weapon === "spear") {
    put(new THREE.CylinderGeometry(0.025, 0.025, 2.4, 6), m("#5a3e2b"), 0, -0.2, 0.08, armR).rotation.x = 0;
    put(new THREE.ConeGeometry(0.06, 0.25, 6), m("#c9ccd2"), 0, 1.1, 0.08, armR);
  }

  const head = new THREE.Group();
  head.position.y = body === "dress" ? 1.62 : 1.5;
  inner.add(head);
  put(new THREE.SphereGeometry(0.42, 22, 18), skinM, 0, 0, 0, head);
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
    put(new THREE.TorusGeometry(0.42, 0.04, 8, 24), m("#b8463c"), 0, 0.12, 0, head).rotation.x = Math.PI / 2;
  } else if (hat === "gat") {
    cap();
    const tr = new THREE.MeshLambertMaterial({ color: 0x14141a, transparent: true, opacity: 0.88 });
    put(new THREE.CylinderGeometry(0.62, 0.62, 0.025, 28), tr, 0, 0.36, 0, head);
    put(new THREE.CylinderGeometry(0.2, 0.23, 0.34, 18), tr, 0, 0.54, 0, head);
  } else if (hat === "crown") {
    cap();
    put(new THREE.CylinderGeometry(0.28, 0.3, 0.24, 16), gold, 0, 0.46, 0, head);
    [-0.16, 0, 0.16].forEach((x) => put(new THREE.SphereGeometry(0.05, 8, 8), m("#c0584f"), x, 0.62, 0.18, head));
  } else if (hat === "helmet") {
    put(new THREE.SphereGeometry(0.46, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2.2), m("#6d7380"), 0, 0.04, -0.02, head);
    put(new THREE.ConeGeometry(0.08, 0.35, 10), m("#c0584f"), 0, 0.6, 0, head);
  } else if (hat === "western") {
    cap();
    put(new THREE.CylinderGeometry(0.52, 0.52, 0.03, 26), m("#1d1a1a"), 0, 0.3, 0, head);
    put(new THREE.SphereGeometry(0.33, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), m("#1d1a1a"), 0, 0.3, 0, head);
  } else if (hat === "ikseon") {
    // 익선관: 둥근 관 + 뒤로 솟은 두 날개
    put(new THREE.SphereGeometry(0.44, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), black, 0, 0.08, -0.02, head);
    put(new THREE.CylinderGeometry(0.3, 0.36, 0.22, 20), black, 0, 0.42, -0.05, head);
    [-0.13, 0.13].forEach((x) => {
      const wing = put(new THREE.BoxGeometry(0.16, 0.26, 0.02), black, x, 0.62, -0.28, head);
      wing.rotation.x = -0.35;
    });
  } else if (hat === "samo") {
    // 사모: 둥근 관 + 양옆으로 뻗은 날개
    put(new THREE.SphereGeometry(0.44, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), black, 0, 0.08, -0.02, head);
    put(new THREE.CylinderGeometry(0.26, 0.32, 0.26, 20), black, 0, 0.42, -0.06, head);
    [-1, 1].forEach((s) => {
      const wing = put(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16), black, s * 0.48, 0.4, -0.16, head);
      wing.rotation.z = Math.PI / 2;
      wing.scale.set(1, 1, 0.55);
    });
  } else if (hat === "jeonrip") {
    // 전립: 넓은 챙 + 붉은 술
    cap();
    put(new THREE.CylinderGeometry(0.6, 0.6, 0.03, 26), black, 0, 0.3, 0, head);
    put(new THREE.SphereGeometry(0.3, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), black, 0, 0.3, 0, head);
    put(new THREE.ConeGeometry(0.1, 0.22, 10), m("#c0392b"), 0, 0.68, 0, head);
  } else if (hat === "gache") {
    // 어여머리: 크게 얹은 가체 + 금 비녀
    cap();
    const wig = put(new THREE.TorusGeometry(0.34, 0.16, 12, 26), hair, 0, 0.38, -0.02, head);
    wig.rotation.x = Math.PI / 2;
    wig.scale.set(1.15, 1, 1);
    put(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8), gold, 0, 0.4, -0.05, head).rotation.z = Math.PI / 2;
    put(new THREE.SphereGeometry(0.07, 10, 10), m("#b3262d"), 0, 0.52, 0.3, head);
  } else if (hat === "princess") {
    // 댕기머리 + 뒤꽂이
    cap();
    put(new THREE.SphereGeometry(0.16, 12, 10), hair, 0, -0.1, -0.42, head);
    put(new THREE.BoxGeometry(0.12, 0.5, 0.03), m("#b3262d"), 0, -0.42, -0.5, head);
    put(new THREE.SphereGeometry(0.06, 10, 10), m("#e39bb0"), 0.2, 0.3, -0.25, head);
  } else if (hat === "bun") {
    // 쪽머리 + 비녀
    cap();
    put(new THREE.SphereGeometry(0.17, 12, 10), hair, 0, -0.12, -0.44, head);
    put(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), gold, 0, -0.12, -0.46, head).rotation.z = Math.PI / 2;
  } else if (hat === "naegwan") {
    cap();
    put(new THREE.CylinderGeometry(0.27, 0.32, 0.3, 18), black, 0, 0.42, -0.04, head);
  }
  g.scale.setScalar(scale);
  g.traverse((o) => o.isMesh && o !== shadow && (o.castShadow = true));
  return { group: g, inner, head, armL, armR, anim: null, phase: Math.random() * 6 };
}

// 걷기·숨쉬기·인사·악수·만세 동작
function animateAvatar(av, dt, time, moving) {
  const t = time + av.phase;
  av.inner.position.y = moving ? Math.abs(Math.sin(t * 10)) * 0.08 : Math.sin(t * 2) * 0.012;
  let armL = -0.28, armR = 0.28, swingL = 0, swingR = 0, lean = 0;
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
    } else if (av.anim.type === "shake") {
      // 오른손을 앞으로 내밀고 위아래로 흔들기
      const reach = Math.sin(Math.min(p / 1.8, 1) * Math.PI);
      swingR = -1.3 * Math.min(reach * 1.6, 1) + Math.sin(p * 18) * 0.16 * reach;
      armR = 0.12;
      lean = 0.12 * reach;
      if (p > 1.8) av.anim = null;
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
  av.inner.rotation.x = lean;
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
