// 시대별 3D 입장 공간: 공용 엔진(이동·충돌·대화·동작) + 시대별 공간. 조선은 palace.js의 경복궁을 사용해요.
const THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
const ACTIONS = [["ganggang", "🌕"], ["meong", "🧘"], ["stroll", "🚶"], ["read", "📖"], ["eat", "🍚"], ["sleep", "😴"], ["rest", "🍵"], ["greet", "🙇"]];

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
    talk: "말 걸기",
    actions: { ganggang: "강강술래", meong: "멍때리기", stroll: "산책하기", read: "책읽기", eat: "식사하기", sleep: "잠자기", rest: "휴식하기", greet: "인사하기" },
    ganggangSolo: "🌕 강강술래~ 궁녀들과 손잡고 둥글게 돌아요. 다른 사람이 함께 누르면 같이 돌아요!",
    ganggangGroup: (n) => `🌕 강강술래~ ${n}명이 함께 돌아요!`,
    songs: ["강강술래~", "달 떠온다 달 떠온다~", "강강술래~", "동해 동천 달 떠온다~"],
    meongNames: { water: "🌊 물멍", fire: "🔥 불멍", moon: "🌕 달멍", palace: "🏯 궁궐멍" },
    meongLines: {
      water: ["물소리에 마음을 맡겨요", "연못에 비친 하늘을 바라봐요", "잔물결이 천천히 번져요"],
      fire: ["타닥타닥, 불꽃이 춤춰요", "따뜻한 불빛을 바라봐요", "옛사람들도 이 불을 바라봤겠지요"],
      moon: ["달빛이 궁궐을 비춰요", "같은 달을 옛사람들도 보았어요", "별이 하나둘 떠올라요"],
      palace: ["처마 끝에 바람이 머물러요", "기와 너머로 하늘이 흘러가요", "오래된 기둥이 들려주는 이야기를 상상해요"],
    },
    meongExit: "화면을 누르면 일어나요",
    meongMilestone: { 60: "🍃 마음이 고요해졌어요", 180: "🌿 '풍류객' 칭호를 얻었어요!", 300: "☁️ '신선' 칭호를 얻었어요!" },
    music: "🎵",
    musicOn: (t) => `🎵 ${t}`,
    musicOff: "🔇 음악을 껐어요",
    actionToast: {
      stroll: "🚶 뒷짐을 지고 궁궐 뜰을 천천히 거닐어요 (한 번 더 누르면 멈춰요)",
      read: "📖 방석에 앉아 책을 펼쳤어요. 임금도 날마다 학문을 닦았어요",
      eat: "🍚 상을 받고 식사를 해요",
      sleep: "😴 이부자리를 펴고 잠자리에 들어요",
      rest: "🍵 방석에 앉아 부채질하며 쉬어요",
      greet: "🙇 공손히 인사해요",
    },
    actionTip: {
      joseon: {
        read: "조선의 임금은 신하들과 '경연'을 열어 함께 경전을 공부했어요.",
        eat: "임금의 밥상은 '수라상'이라고 불렀어요.",
        sleep: "임금이 잠드는 곳은 침전, 경복궁에서는 강녕전이에요.",
      },
    },
    greetBack: (n) => `${n} 님도 공손히 인사해요 🙇`,
    iAm: (n) => `나는 ${n}이오.`,
    quizIntro: (era) => `${era}에 대해 얼마나 알고 있소? 4문제 중 3문제를 맞히면 도장을 찍어 주겠소.`,
    quizStart: "📝 시험 보기",
    keep: "계속 둘러보기",
    leaveQ: "현재로 돌아갈까요?",
    leave: "나가기",
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
    talk: "Talk",
    actions: { ganggang: "Ganggang", meong: "Zone out", stroll: "Stroll", read: "Read", eat: "Dine", sleep: "Sleep", rest: "Rest", greet: "Greet" },
    ganggangSolo: "🌕 Ganggangsullae! Hold hands with the court ladies and circle around. Others who join will dance with you!",
    ganggangGroup: (n) => `🌕 Ganggangsullae! ${n} people dancing together!`,
    songs: ["Ganggang-sullae~", "The moon is rising~", "Ganggang-sullae~", "Over the eastern sea~"],
    meongNames: { water: "🌊 Water gazing", fire: "🔥 Fire gazing", moon: "🌕 Moon gazing", palace: "🏯 Palace gazing" },
    meongLines: {
      water: ["Let the sound of water carry you", "Watch the sky in the pond", "Ripples spread slowly"],
      fire: ["Crackle, crackle — the flames dance", "Watch the warm firelight", "People long ago watched this fire too"],
      moon: ["Moonlight falls on the palace", "People long ago saw this same moon", "Stars appear one by one"],
      palace: ["The wind rests at the tip of the eaves", "Sky drifts past the roof tiles", "Imagine the stories these old pillars could tell"],
    },
    meongExit: "Tap the screen to get up",
    meongMilestone: { 60: "🍃 Your mind feels calm", 180: "🌿 You earned the title 'Pungnyu Poet'!", 300: "☁️ You earned the title 'Immortal Sage'!" },
    music: "🎵",
    musicOn: (t) => `🎵 ${t}`,
    musicOff: "🔇 Music off",
    actionToast: {
      stroll: "🚶 Strolling slowly through the palace grounds, hands behind your back (tap again to stop)",
      read: "📖 You sit on a cushion and open a book. Kings studied every day",
      eat: "🍚 A meal table is served",
      sleep: "😴 You lay out the bedding and go to sleep",
      rest: "🍵 You sit on a cushion and rest, fanning yourself",
      greet: "🙇 You bow politely",
    },
    actionTip: {
      joseon: {
        read: "Joseon kings held 'gyeongyeon' study sessions with their scholars.",
        eat: "The king's meal table was called 'surasang'.",
        sleep: "The king slept in Gangnyeongjeon, his private quarters.",
      },
    },
    greetBack: (n) => `${n} bows back 🙇`,
    iAm: (n) => `I am ${n}.`,
    quizIntro: (era) => `How much do you know about ${era}? Get 3 of 4 right and I'll give you my stamp.`,
    quizStart: "📝 Take the test",
    keep: "Keep exploring",
    leaveQ: "Return to the present?",
    leave: "Leave",
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
function roomNumber(era, nick) {
  return 1 + (hash(`${era.id}|${nick}`) % 99);
}

/* ---------- 캐릭터 선택: 모든 시대가 궁궐 꾸미기 화면을 써요 ---------- */
function renderCharacterSelect(era) {
  renderPalaceDresser(era);
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
  if (!loadPalaceAvatar(era.id)) {
    location.replace(`#enter/${era.id}`);
    return;
  }
  const place = palaceInfo(era.id).place;
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
    const level = createPalaceLevel(era);
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
        <button class="w-pill w-btn" id="wMusic" aria-label="music">${w.music}</button>
        <span class="w-pill w-crowd">👥 ${level.crowdText}</span>
      </div>
    </div>
    <p class="w-hint" id="wHint">${w.hint}</p>
    <div class="w-meong" id="wMeong" hidden><b id="wMeongName"></b><p id="wMeongLine"></p><span id="wMeongTime"></span><small id="wMeongMusic"></small><em>${w.meongExit}</em></div>
    <div class="w-toast" id="wToast"></div>
    <div class="w-dialog" id="wDialog" hidden>
      <div class="w-dialog-head"><span id="wDlgEmoji"></span><b id="wDlgName"></b><button class="w-close" id="wDlgClose" aria-label="close">×</button></div>
      <div class="w-dialog-body" id="wDlgBody"></div>
    </div>
    <nav class="w-actions">
      ${ACTIONS.map(([id, icon]) => `<button data-action="${id}"><span>${icon}</span>${w.actions[id]}</button>`).join("")}
    </nav>
    <button class="w-talk" id="wTalk" hidden>💬 <b></b></button>`;
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
  const rooms = []; // 들어갈 수 있는 건물 안: 들어가면 지붕을 감춰 실내가 보여요
  let activeRoom = null;
  const tickers = [];
  const wanderers = [];
  const npcAvatars = [];
  let player = null;
  let playerLabel = null;
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
    stopPose();
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
    addCamBlock: (x1, x2, z1, z2, top) => {
      const b = [x1, x2, z1, z2, top];
      camBlocks.push(b);
      return b;
    },
    // 건물 안 공간 (x1~x2, z1~z2). parts: 안에 있을 때 감출 지붕들, block: 그 건물의 카메라 막이
    addRoom: (room) => rooms.push(room),
    removeInteract(item) {
      const i = interactables.indexOf(item);
      if (i >= 0) interactables.splice(i, 1);
      if (item.label) api.removeLabel(item.label);
      if (nearest === item) nearest = null;
    },
    floorAt,
    setPlayer(av, x, z, ry, label) {
      player = av;
      playerLabel = label;
      x += (Math.random() - 0.5) * 4; // 입장할 때도 조금씩 다른 자리에
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
    onCleanup: (fn) => c.cleanup.push(fn),
    removeLabel(el) {
      const i = labels.findIndex((l) => l.el === el);
      if (i >= 0) labels.splice(i, 1);
      el.remove();
    },
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
    } else if (item.kind === "custom") {
      item.render(dlgBody, closeDialog);
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
        const jx = p.x + (Math.random() - 0.5) * 3; // 다른 사람과 겹치지 않게 조금씩 다른 자리에
        player.group.position.set(jx, floorAt(jx, p.z), p.z);
        player.group.rotation.y = Math.PI;
        cam.yaw = 0;
        stopPose();
        camera.position.set(p.x, 6, p.z + 9);
        closeDialog();
        toast(`📍 ${p.name}`);
      })
    );
  });

  /* --- 동작 --- */
  // 임금의 일과: 산책·책읽기·식사·잠·휴식(자세를 유지) / 인사(한 번)
  let nearest = null;
  let strollHome = null;
  const actionBtns = root.querySelectorAll("[data-action]");
  const markAction = () => actionBtns.forEach((b) => b.classList.toggle("on", b.dataset.action === player.pose));
  // 강강술래: 함께 추는 사람(실제 접속자)이 없으면 가까운 궁인들이 손을 잡아 줘요
  let danceAnchor = null;
  const npcDancers = [];
  const releaseDancers = () => {
    npcDancers.splice(0).forEach((v) => {
      v.dancing = false;
      v.wait = 1;
      setPose(v.av, null);
    });
  };
  const recruitDancers = () => {
    const pos = player.group.position;
    wanderers
      .filter((v) => !v.dancing && v.av.group.position.distanceTo(pos) < 30)
      .sort((a, b) => a.av.group.position.distanceTo(pos) - b.av.group.position.distanceTo(pos))
      .slice(0, 4)
      .forEach((v) => {
        v.dancing = true;
        setPose(v.av, "ganggang");
        npcDancers.push(v);
      });
  };
  // 멍때리기: 있는 곳에 따라 물멍·불멍·달멍·궁궐멍, 그 시대 악기 소리가 흘러요
  const meongEl = root.querySelector("#wMeong");
  let meong = null;
  const meongType = () => {
    const pos = player.group.position;
    const nearBox = (b, r) => pos.x > b[0] - r && pos.x < b[1] + r && pos.z > b[2] - r && pos.z < b[3] + r;
    if (colliders.some((b) => b[4] && nearBox(b, 5))) return "water";
    if ((level.fireSpots || []).some(([fx, fz]) => Math.hypot(fx - pos.x, fz - pos.z) < 7)) return "fire";
    if (!activeRoom && (api.night || 0) > 0.55) return "moon";
    return "palace";
  };
  const startMeong = () => {
    const type = meongType();
    const lines = w.meongLines[type];
    meong = { type, t: 0, line: 0, shown: {}, stopMusic: window.Gugak ? Gugak.start(era.id, type) : null };
    root.querySelector("#wMeongName").textContent = w.meongNames[type];
    root.querySelector("#wMeongLine").textContent = lines[0];
    root.querySelector("#wMeongMusic").textContent = window.Gugak ? Gugak.describe(era.id) : "";
    meongEl.hidden = false;
    root.classList.add("meong-mode");
    musicBtn.classList.toggle("on", true);
  };
  const endMeong = () => {
    if (!meong) return;
    meong.stopMusic?.();
    meong = null;
    meongEl.hidden = true;
    root.classList.remove("meong-mode");
    musicBtn.classList.toggle("on", !!bgm);
  };
  meongEl.addEventListener("pointerdown", () => stopPose());
  // 🎵 궁궐 배경 음악 (그 시대 악기 소리를 흉내 낸 합성 음악)
  const musicBtn = root.querySelector("#wMusic");
  let bgm = null;
  musicBtn.addEventListener("click", () => {
    if (bgm) {
      bgm();
      bgm = null;
      toast(w.musicOff);
    } else if (window.Gugak) {
      bgm = Gugak.start(era.id, "bgm");
      toast(w.musicOn(Gugak.describe(era.id)));
    }
    musicBtn.classList.toggle("on", !!bgm);
  });
  c.cleanup.push(() => {
    bgm?.();
    meong?.stopMusic?.();
  });
  const setPlayerPose = (pose) => {
    const old = player.pose;
    if (old === "ganggang" && pose !== "ganggang") {
      releaseDancers();
      danceAnchor = null;
      player.danceAnchor = null;
      playerLabel?.querySelector(".bubble")?.remove();
    }
    if (old === "meong" && pose !== "meong") endMeong();
    setPose(player, pose);
    if (pose === "ganggang") {
      danceAnchor = player.group.position.clone();
      player.danceAnchor = { x: +danceAnchor.x.toFixed(2), z: +danceAnchor.z.toFixed(2) };
    }
    if (pose === "meong") startMeong();
  };
  const stopPose = () => {
    if (!player || !player.pose) return;
    setPlayerPose(null);
    markAction();
  };
  actionBtns.forEach((b) =>
    b.addEventListener("click", () => {
      const type = b.dataset.action;
      moveTarget = pending = null;
      if (type === "greet") {
        setPlayerPose(null);
        player.anim = { type: "bow", t: 0 };
        const near = interactables.find((n) => n.av && n.av.group.position.distanceTo(player.group.position) < 4.5);
        if (near) {
          facePoint(near.av.group, player.group.position);
          facePoint(player.group, near.av.group.position);
          setTimeout(() => (near.av.anim = { type: "bow", t: 0 }), 500);
          toast(w.greetBack(near.name));
        } else toast(w.actionToast.greet);
      } else if (player.pose === type) {
        setPlayerPose(null);
      } else {
        setPlayerPose(type);
        strollHome = player.group.position.clone();
        if (type === "ganggang") {
          const peers = (api.peerSource?.() || []).filter((p) => p.pose === "ganggang" && Math.hypot(p.x - strollHome.x, p.z - strollHome.z) < 12);
          if (!peers.length) recruitDancers();
          toast(peers.length ? w.ganggangGroup(peers.length + 1) : w.ganggangSolo);
        } else if (type !== "meong") {
          const tip = w.actionTip[era.id]?.[type];
          toast(tip ? `${w.actionToast[type]} · ${tip}` : w.actionToast[type]);
        }
      }
      markAction();
      playerLabel?.classList.toggle("sleeping", player.pose === "sleep");
    })
  );
  talkBtn.addEventListener("click", () => nearest && openDialog(nearest));

  /* --- 조작: 클릭 이동 · 드래그 회전 · 휠/핀치 확대 · 키보드 --- */
  const cam = { yaw: level.camYaw || 0, pitch: level.camPitch || 0.42, dist: level.camDist || 8 };
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
      stopPose();
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
  const baseSpeed = level.speed || 4.5;
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
    if ((ix || iz) && player.pose) stopPose();
    // 산책: 출발한 자리 둘레를 천천히 거닐어요
    if (player.pose === "stroll" && !moveTarget && strollHome) {
      for (let k = 0; k < 10; k++) {
        const a = rand() * Math.PI * 2, r = 2 + rand() * 6;
        const tx = strollHome.x + Math.cos(a) * r, tz = strollHome.z + Math.sin(a) * r;
        if (!blocked(tx, tz)) {
          moveTarget = new THREE.Vector3(tx, 0, tz);
          break;
        }
      }
    }
    // 강강술래: 같은 원에 있는 사람들은 id 순서로 자리를 나눠 같은 시계로 함께 돌아요
    if (player.pose === "ganggang" && danceAnchor) {
      const myId = api.myId || "me";
      const peers = (api.peerSource?.() || []).filter((p) => p.pose === "ganggang" && Math.hypot(p.x - pos.x, p.z - pos.z) < 12);
      if (peers.length && npcDancers.length) releaseDancers();
      const members = [{ id: myId, anchor: danceAnchor }, ...peers.map((p) => ({ id: p.id, anchor: p.anchor }))].sort((a, b) => (a.id < b.id ? -1 : 1));
      const center = members[0].anchor && Number.isFinite(members[0].anchor.x) ? members[0].anchor : danceAnchor;
      const slots = [...members.map((m) => m.id), ...npcDancers.map((_, i) => `npc${i}`)];
      const n = slots.length;
      const radius = 1.6 + n * 0.45;
      const spin = (Date.now() / 1000) * 0.6;
      const at = (i) => {
        const th = (Math.PI * 2 * i) / n + spin;
        return [center.x + Math.cos(th) * radius, center.z + Math.sin(th) * radius];
      };
      const [tx, tz] = at(slots.indexOf(myId));
      moveTarget = new THREE.Vector3(tx, 0, tz);
      pending = null;
      npcDancers.forEach((v, i) => {
        const [nx, nz] = at(members.length + i);
        const vp = v.av.group.position;
        const dx = nx - vp.x, dz = nz - vp.z;
        const d = Math.hypot(dx, dz);
        if (d > 0.05) {
          const len = Math.min(d, 5 * dt);
          vp.x += (dx / d) * len;
          vp.z += (dz / d) * len;
          v.av.group.rotation.y = Math.atan2(dx, dz);
        }
        vp.y = floorAt(vp.x, vp.z);
        animateAvatar(v.av, dt, time, d > 0.05);
      });
      // 노랫말 말풍선
      const line = w.songs[Math.floor(Date.now() / 2500) % w.songs.length];
      let bubble = playerLabel?.querySelector(".bubble");
      if (playerLabel && !bubble) {
        bubble = document.createElement("span");
        bubble.className = "bubble";
        playerLabel.appendChild(bubble);
      }
      if (bubble && bubble.textContent !== line) bubble.textContent = line;
    }
    // 멍때리기: 시간과 문구, 이정표
    if (meong) {
      meong.t += dt;
      const sec = Math.floor(meong.t);
      root.querySelector("#wMeongTime").textContent = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
      const lines = w.meongLines[meong.type];
      const li = Math.floor(meong.t / 8) % lines.length;
      if (li !== meong.line) {
        meong.line = li;
        root.querySelector("#wMeongLine").textContent = lines[li];
      }
      Object.entries(w.meongMilestone).forEach(([at, msg]) => {
        if (sec >= Number(at) && !meong.shown[at]) {
          meong.shown[at] = true;
          toast(msg);
          if (Number(at) >= 180) {
            try {
              const b = JSON.parse(localStorage.getItem("dalbit-badges") || "{}");
              b[Number(at) >= 300 ? "sinseon" : "pungnyu"] = true;
              localStorage.setItem("dalbit-badges", JSON.stringify(b));
            } catch {}
          }
        }
      });
      cam.yaw += dt * 0.05;
    }
    const speed = player.pose === "stroll" ? 1.8 : player.pose === "ganggang" ? 5 : baseSpeed;
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
        if (Math.abs(pos.x + pos.z - before) < 1e-4) {
          // 벽에 막힘: 놀이 마당처럼 꼭 가야 하는 곳이면 바로 앞으로 건너가요
          if (pending?.hop) {
            const o = pending.obj.position;
            pos.set(o.x, floorAt(o.x, o.z + 2.2), o.z + 2.2);
            player.group.rotation.y = Math.PI;
            const it = pending;
            moveTarget = pending = null;
            openDialog(it);
          } else moveTarget = pending = null;
        }
        if (player.pose === "stroll") moving = "stroll";
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
      if (v.dancing) return; // 강강술래 중인 궁인은 위에서 움직여요
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
    const showTalk = nearest && dialog.hidden ? nearest : null;
    if (showTalk !== talkBtn.item) {
      talkBtn.item = showTalk;
      talkBtn.hidden = !showTalk;
      if (showTalk) talkBtn.querySelector("b").textContent = `${w.talk} · ${showTalk.name.split(" ")[0]}`;
    }

    // 카메라: 캐릭터 뒤에서 따라가기
    camTarget.set(pos.x, pos.y + 1.4, pos.z);
    // 카메라가 건물 안으로 들어가지 않도록 거리를 줄여요
    // 먼저 위로 올려 지붕 너머에서 내려다보고, 그래도 막히면 거리를 줄여요
    // 건물 안에 들어가면 그 건물 지붕을 감추고, 카메라를 가까이 높게 둬 실내를 내려다봐요
    const room = rooms.find((r) => pos.x > r.x1 && pos.x < r.x2 && pos.z > r.z1 && pos.z < r.z2) || null;
    if (room !== activeRoom) {
      activeRoom?.parts.forEach((m) => (m.visible = true));
      room?.parts.forEach((m) => (m.visible = false));
      if (room && !activeRoom && room.name) toast(`🚪 ${room.name}`);
      activeRoom = room;
    }
    let dist = room ? Math.min(cam.dist, 7.5) : cam.dist, pitch = room ? Math.max(cam.pitch, 0.8) : cam.pitch;
    for (let k = 0; k < 12; k++) {
      const pc = Math.cos(pitch);
      const cx = pos.x + Math.sin(cam.yaw) * dist * pc, cz = pos.z + Math.cos(cam.yaw) * dist * pc;
      const cy = pos.y + 1.4 + Math.sin(pitch) * dist;
      const inWall = !room && colliders.some((b) => !b[4] && cx > b[0] - 0.6 && cx < b[1] + 0.6 && cz > b[2] - 0.6 && cz < b[3] + 0.6);
      const inRoof = camBlocks.some((b) => b !== room?.block && cy < b[4] + 0.8 && cx > b[0] && cx < b[1] && cz > b[2] && cz < b[3]);
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
  } else if (hat === "feather") {
    // 고구려 조우관: 작은 관에 새 깃털 두 개
    cap();
    put(new THREE.CylinderGeometry(0.2, 0.26, 0.24, 14), m("#8a3b2a"), 0, 0.46, -0.02, head);
    [-1, 1].forEach((s) => {
      const f = put(new THREE.BoxGeometry(0.06, 0.55, 0.02), m("#efe6cf"), s * 0.14, 0.78, -0.02, head);
      f.rotation.z = -s * 0.25;
    });
  } else if (hat === "goldcrown") {
    // 신라 금관: 둥근 띠 + 出자 모양 세움장식 + 달개
    cap();
    put(new THREE.CylinderGeometry(0.44, 0.44, 0.12, 24, 1, true), gold, 0, 0.24, 0, head);
    [0, 1, 2].forEach((i) => {
      const a = ((i - 1) * Math.PI) / 3;
      const g2 = put(new THREE.BoxGeometry(0.06, 0.5, 0.02), gold, Math.sin(a) * 0.43, 0.52, Math.cos(a) * 0.43, head);
      g2.rotation.y = a;
      [0.4, 0.58, 0.74].forEach((y) => put(new THREE.BoxGeometry(0.2, 0.03, 0.02), gold, Math.sin(a) * 0.43, y, Math.cos(a) * 0.43, head).rotation.y = a);
    });
    [-0.3, 0.3].forEach((x) => put(new THREE.SphereGeometry(0.04, 8, 8), m("#3f7a55"), x, 0.12, 0.3, head));
  } else if (hat === "bokdu") {
    // 고려 복두: 네모난 관 + 양옆으로 길게 뻗은 곧은 날개
    put(new THREE.SphereGeometry(0.44, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), black, 0, 0.08, -0.02, head);
    put(new THREE.BoxGeometry(0.5, 0.3, 0.46), black, 0, 0.44, -0.04, head);
    [-1, 1].forEach((s) => put(new THREE.BoxGeometry(0.7, 0.04, 0.05), black, s * 0.6, 0.4, -0.22, head));
  } else if (hat === "naegwan") {
    cap();
    put(new THREE.CylinderGeometry(0.27, 0.32, 0.3, 18), black, 0, 0.42, -0.04, head);
  }
  g.scale.setScalar(scale);
  g.traverse((o) => o.isMesh && o !== shadow && (o.castShadow = true));
  return { group: g, inner, head, armL, armR, anim: null, pose: null, props: {}, body, robe, deco, phase: Math.random() * 6 };
}

/* ---------- 자세와 소품 ---------- */
// 산책(뒷짐) · 책읽기(앉아서 책) · 식사(소반) · 잠(이부자리에 누움) · 휴식(방석에 앉아 부채질)
function setPose(av, pose) {
  av.pose = pose;
  av.anim = null;
  const need = { read: ["cushion", "book"], eat: ["cushion", "table"], sleep: ["bed"], rest: ["cushion", "fan"], meong: ["cushion"] }[pose] || [];
  need.forEach((n) => av.props[n] || (av.props[n] = makeProp(av, n)));
  Object.entries(av.props).forEach(([n, obj]) => (obj.visible = need.includes(n)));
}
function makeProp(av, name) {
  const m = (c) => new THREE.MeshLambertMaterial({ color: c });
  const g = new THREE.Group();
  const put = (geo, mat, x, y, z) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    g.add(mesh);
    return mesh;
  };
  if (name === "cushion") {
    put(new THREE.BoxGeometry(1, 0.14, 1), m("#9c2f22"), 0, 0.07, 0);
    put(new THREE.BoxGeometry(0.82, 0.02, 0.82), m("#d9a62e"), 0, 0.15, 0);
    av.group.add(g);
  } else if (name === "table") {
    // 소반과 그릇
    put(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 20), m("#7a4a2a"), 0, 0.42, 0.85);
    [[-0.25, 0.65], [0.25, 0.65], [-0.25, 1.05], [0.25, 1.05]].forEach(([x, z]) => put(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), m("#5a3e2b"), x, 0.2, z));
    [[-0.15, 0.78, "#efe6cf"], [0.15, 0.78, "#efe6cf"], [0, 1.0, "#c9a24a"], [-0.22, 0.98, "#3f7a55"], [0.22, 0.98, "#b3262d"]].forEach(([x, z, c]) => put(new THREE.SphereGeometry(0.09, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), m(c), x, 0.45, z).rotation.x = Math.PI);
    av.group.add(g);
  } else if (name === "bed") {
    // 요 · 이불 · 베개
    put(new THREE.BoxGeometry(1.1, 0.1, 2.3), m("#efe6cf"), 0, 0.05, 0);
    put(new THREE.BoxGeometry(1.1, 0.14, 1.45), m(av.deco || "#b3262d"), 0, 0.8, 0.35);
    put(new THREE.BoxGeometry(0.9, 0.03, 1.25), m("#d9a62e"), 0, 0.88, 0.35);
    const pillow = put(new THREE.CylinderGeometry(0.16, 0.16, 0.6, 12), m("#2f5d8a"), 0, 0.22, -0.9);
    pillow.rotation.z = Math.PI / 2;
    av.group.add(g);
  } else if (name === "book") {
    put(new THREE.BoxGeometry(0.42, 0.03, 0.3), m("#23305e"), 0, 0, 0);
    put(new THREE.BoxGeometry(0.4, 0.035, 0.28), m("#f1e7cf"), 0, 0.02, 0);
    g.position.set(0, 0.95, 0.45);
    g.rotation.x = -0.5;
    av.inner.add(g);
  } else if (name === "fan") {
    // 합죽선
    const fan = put(new THREE.CircleGeometry(0.32, 16, 0, Math.PI), new THREE.MeshLambertMaterial({ color: 0xf1e7cf, side: THREE.DoubleSide }), 0, 0, 0);
    fan.rotation.z = Math.PI / 2;
    g.position.set(0, -0.5, 0.12);
    av.armR.add(g);
  }
  return g;
}

// 걷기·숨쉬기·인사·악수·만세 동작
function animateAvatar(av, dt, time, moving) {
  const t = time + av.phase;
  av.inner.position.y = moving ? Math.abs(Math.sin(t * 10)) * 0.08 : Math.sin(t * 2) * 0.012;
  let armL = -0.28, armR = 0.28, swingL = 0, swingR = 0, lean = 0, headX = 0, y = 0, z = 0, twist = 0;
  const pose = av.pose;
  if (moving && pose !== "stroll" && pose !== "ganggang") {
    swingL = Math.sin(t * 10) * 0.6;
    swingR = -swingL;
  }
  if (pose === "ganggang") {
    // 양옆 사람과 손을 잡듯 두 팔을 벌리고, 박자에 맞춰 흔들어요
    armL = -1.15 + Math.sin(t * 4) * 0.12;
    armR = 1.15 + Math.sin(t * 4) * 0.12;
    av.inner.position.y = Math.abs(Math.sin(t * 4)) * 0.07;
    headX = -0.1;
  } else if (pose === "meong") {
    // 가만히 앉아 무릎에 손을 얹고 숨을 고르는 자세
    y = av.body === "dress" ? -0.25 : -0.32;
    swingL = swingR = -0.5;
    armL = -0.15;
    armR = 0.15;
    headX = 0.12 + Math.sin(t * 0.8) * 0.04;
  } else if (pose === "stroll") {
    // 뒷짐을 지고 느긋하게
    swingL = swingR = 0.7;
    armL = 0.15;
    armR = -0.15;
    av.inner.position.y = moving ? Math.abs(Math.sin(t * 5)) * 0.04 : 0;
  } else if (pose === "read" || pose === "eat" || pose === "rest") {
    y = av.body === "dress" ? -0.25 : -0.32; // 방석에 앉기
    if (pose === "read") {
      swingL = swingR = -0.9;
      armL = -0.5;
      armR = 0.5;
      headX = 0.35 + Math.sin(t * 0.7) * 0.04;
    } else if (pose === "eat") {
      const bite = Math.max(0, Math.sin(t * 2.4));
      swingR = -0.6 - bite * 1.2;
      armR = 0.3 + bite * 0.3;
      swingL = -0.4;
      headX = 0.25 - bite * 0.15;
    } else {
      swingR = -0.7;
      armR = 0.6 + Math.sin(t * 6) * 0.35; // 부채질
      armL = -0.1;
      swingL = -0.3;
      headX = -0.1;
    }
  } else if (pose === "sleep") {
    lean = -Math.PI / 2;
    y = 0.32;
    z = 1.05;
    armL = -0.1;
    armR = 0.1;
    headX = 0;
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
    } else if (av.anim.type === "bow") {
      // 공손한 인사: 두 손을 모으고 허리를 굽혀요
      const k = Math.sin(Math.min(av.anim.t / 1.6, 1) * Math.PI);
      lean = k * 0.6;
      swingL = swingR = -0.6 * k;
      armL = -0.45 * k - 0.1;
      armR = 0.45 * k + 0.1;
      if (av.anim.t > 1.6) av.anim = null;
    } else if (av.anim.type === "dance") {
      // 흥겨운 춤: 팔을 번갈아 올리고 몸을 좌우로 흔들어요
      const p2 = av.anim.t;
      armL = -1.6 - Math.sin(p2 * 6) * 0.9;
      armR = 1.6 - Math.sin(p2 * 6 + Math.PI) * 0.9;
      twist = Math.sin(p2 * 3) * 0.5;
      av.inner.position.y += Math.abs(Math.sin(p2 * 6)) * 0.12;
      if (p2 > 3) av.anim = null;
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
  av.inner.rotation.y = twist;
  av.head.rotation.x = headX;
  if (pose === "sleep" || y) {
    av.inner.position.y = y + (pose === "sleep" ? Math.sin(t * 1.5) * 0.015 : Math.sin(t * 2) * 0.01);
    av.inner.position.z = z;
  } else av.inner.position.z = 0;
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
