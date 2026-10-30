// 시대별 궁궐: 캐릭터 꾸미기 + 궁궐 3D 공간 + 접속한 사람의 현재 시각에 따른 하루(새벽·아침·낮·오후·저녁·밤)
// 시대별 궁궐 데이터와 건축은 palace-eras.js에 있어요.
const PALACE_KEY = "dalbit-palace-avatar";

const PALACE_COLORS = [
  ["홍", "Red", "#b3262d"], ["자", "Purple", "#6b2f5f"], ["청", "Blue", "#2f5d8a"], ["남", "Navy", "#23305e"], ["녹", "Green", "#3f7a55"],
  ["옥", "Jade", "#8fc4ad"], ["분홍", "Pink", "#e39bb0"], ["황", "Gold", "#d9a62e"], ["백", "White", "#efe6cf"], ["흑", "Black", "#2a2a30"],
];
const SKINS = ["#f6d5b8", "#f1c7a1", "#d9a57c", "#b07a55"];
const ROLE_IDS = ["king", "queen", "prince", "princess", "civil", "military", "courtlady", "eunuch"];

// 신분별 몸 모양 (모자와 색은 시대마다 달라요)
const ROLE_BASE = {
  king: { emoji: "👑", body: "robe", patch: "round" },
  queen: { emoji: "👸", body: "dress", acc: true },
  prince: { emoji: "🤴", body: "robe", patch: "round" },
  princess: { emoji: "🎀", body: "dress", acc: true },
  civil: { emoji: "📜", body: "robe", patch: "square" },
  military: { emoji: "⚔️", body: "robe", patch: "square", weapon: "sword" },
  courtlady: { emoji: "🏮", body: "dress" },
  eunuch: { emoji: "🗝️", body: "robe" },
  monk: { emoji: "📿", body: "robe" },
};

const ROLE_TEXT = {
  ko: {
    names: { king: "왕", queen: "왕비", prince: "왕자", princess: "공주", civil: "문관", military: "무관", courtlady: "궁녀", eunuch: "시종" },
    descs: {
      king: "나라를 다스리는 임금이에요.",
      queen: "임금의 배우자로 궁궐 안의 살림을 이끌어요.",
      prince: "다음 임금이 될 왕자예요.",
      princess: "임금의 딸이에요.",
      civil: "글과 법으로 나랏일을 맡은 신하예요.",
      military: "나라를 지키는 장수예요.",
      courtlady: "궁궐의 살림을 돌보는 궁녀예요.",
      eunuch: "임금 곁에서 시중을 드는 사람이에요.",
    },
  },
  en: {
    names: { king: "King", queen: "Queen", prince: "Prince", princess: "Princess", civil: "Civil Official", military: "General", courtlady: "Court Lady", eunuch: "Attendant" },
    descs: {
      king: "The ruler of the kingdom.",
      queen: "The king's consort, running palace life.",
      prince: "The heir to the throne.",
      princess: "The king's daughter.",
      civil: "An official who handles state affairs and laws.",
      military: "A general who defends the kingdom.",
      courtlady: "A court lady who keeps the palace running.",
      eunuch: "An attendant who serves at the king's side.",
    },
  },
};

const PSTR = {
  ko: {
    dressTitle: (place) => `${place}에 입장할 나만의 캐릭터를 꾸며요`,
    name: "이름",
    role: "신분",
    robe: "옷 색",
    deco: "장식·치마 색",
    skin: "피부색",
    acc: "노리개 달기",
    enter: (place) => `🏯 ${place} 입장하기`,
    rotateHint: "드래그해서 돌려 보세요",
    crowd: (n) => `궁인 ${n}`,
    guard: "수문장",
    phases: { dawn: "새벽", morning: "아침", day: "낮", afternoon: "오후", evening: "저녁", night: "밤" },
    myTime: "내 시간",
    previewLabel: "미리보기",
    timeToast: (p) => `${p} 풍경으로 바뀌었어요`,
    realToast: "지금 내 시간의 궁궐로 돌아왔어요",
  },
  en: {
    dressTitle: (place) => `Dress up your character for ${place}`,
    name: "Name",
    role: "Role",
    robe: "Robe color",
    deco: "Trim / skirt color",
    skin: "Skin tone",
    acc: "Add norigae tassel",
    enter: (place) => `🏯 Enter ${place}`,
    rotateHint: "Drag to rotate",
    crowd: (n) => `${n} courtiers`,
    guard: "Gate Guard",
    phases: { dawn: "Dawn", morning: "Morning", day: "Midday", afternoon: "Afternoon", evening: "Evening", night: "Night" },
    myTime: "My time",
    previewLabel: "Preview",
    timeToast: (p) => `Switched to ${p}`,
    realToast: "Back to the palace at your current time",
  },
};
const P = () => PSTR[LANG];
const palaceInfo = (id) => PALACES[id][LANG];

// 시대·신분별 옷차림 (모자, 기본 옷 색, 장식 색)
function eraCostume(eraId, role) {
  const style = PALACES[eraId].costume;
  const [robe, deco] = style.colors[role] || style.colors.civil;
  return { ...ROLE_BASE[role], hat: style.hats[role] || "topknot", robe, deco, patch: style.patch === false ? undefined : ROLE_BASE[role].patch };
}
function roleName(eraId, role) {
  return palaceInfo(eraId).roleNames?.[role] || ROLE_TEXT[LANG].names[role];
}
function roleDesc(eraId, role) {
  return palaceInfo(eraId).roleDescs?.[role] || ROLE_TEXT[LANG].descs[role];
}

/* ---------- 캐릭터 저장 (시대별) ---------- */
function loadPalaceStore() {
  try {
    const v = JSON.parse(localStorage.getItem(PALACE_KEY)) || {};
    return v.role ? { joseon: v } : v; // 예전 형식(경복궁 하나)도 읽어요
  } catch {
    return {};
  }
}
function loadPalaceAvatar(eraId) {
  return loadPalaceStore()[eraId] || null;
}
function savePalaceAvatar(eraId, a) {
  const all = loadPalaceStore();
  all[eraId] = a;
  try { localStorage.setItem(PALACE_KEY, JSON.stringify(all)); } catch {}
}
function palaceAvatarOpts(eraId, a) {
  const c = eraCostume(eraId, a.role);
  return { body: c.body, hat: c.hat, patch: c.patch, weapon: c.weapon, robe: a.robe, deco: a.deco, skin: a.skin, acc: a.acc };
}
function defaultLook(eraId, role) {
  const c = eraCostume(eraId, role);
  return { robe: c.robe, deco: c.deco, acc: !!c.acc };
}

/* ---------- 캐릭터 꾸미기 ---------- */
let stopPalacePreview = null;
function renderPalaceDresser(era) {
  const p = P();
  const info = palaceInfo(era.id);
  const profile = loadProfile() || {};
  const a = loadPalaceAvatar(era.id) || { role: "king", ...defaultLook(era.id, "king"), skin: SKINS[1], name: profile.nick || profile.name || randomNick() };
  delete app.dataset.era;
  app.style.setProperty("--c", era.color);
  const swatches = (key) => PALACE_COLORS.map(([ko, en, hex]) => `<button class="swatch" data-key="${key}" data-v="${hex}" style="--s:${hex}" title="${LANG === "en" ? en : ko}"></button>`).join("");
  app.innerHTML = `
    <button class="back" data-go="era/${era.id}">← ${era.emoji} ${era.name}</button>
    <section class="dresser fade-in">
      <p class="eyebrow">${era.name} · ${info.place}</p>
      <h1>${p.dressTitle(info.place)}</h1>
      <div class="dresser-grid">
        <div class="dresser-preview">
          <canvas id="dressCanvas" width="320" height="380"></canvas>
          <p class="hint">${p.rotateHint}</p>
          <p class="role-desc" id="roleDesc"></p>
        </div>
        <div class="dresser-controls">
          <label class="nick-field">${p.name}<span><input id="pName" maxlength="12" value="${esc(a.name)}" /><button type="button" id="dice" aria-label="random">🎲</button></span></label>
          <h3>${p.role}</h3>
          <div class="role-grid">${ROLE_IDS.map((id) => `<button class="role" data-role="${id}"><span>${ROLE_BASE[id].emoji}</span>${roleName(era.id, id)}</button>`).join("")}</div>
          <h3>${p.robe}</h3><div class="swatches">${swatches("robe")}</div>
          <h3>${p.deco}</h3><div class="swatches">${swatches("deco")}</div>
          <h3>${p.skin}</h3><div class="swatches">${SKINS.map((s) => `<button class="swatch" data-key="skin" data-v="${s}" style="--s:${s}"></button>`).join("")}</div>
          <label class="check"><input type="checkbox" id="pAcc" ${a.acc ? "checked" : ""} /> ${p.acc}</label>
        </div>
      </div>
      <div class="room-line">🏯 ${info.place} · ${W().room} <b>${roomNumber(era, a.name)}</b></div>
      <button class="btn big" id="enterPalace">${p.enter(info.place)}</button>
    </section>`;

  let preview = null;
  const refresh = () => {
    app.querySelectorAll(".role").forEach((b) => b.classList.toggle("on", b.dataset.role === a.role));
    app.querySelectorAll(".swatch").forEach((b) => b.classList.toggle("on", a[b.dataset.key] === b.dataset.v));
    app.querySelector("#roleDesc").textContent = `${ROLE_BASE[a.role].emoji} ${roleDesc(era.id, a.role)}`;
    preview?.update(palaceAvatarOpts(era.id, a));
  };
  app.querySelectorAll(".role").forEach((b) =>
    b.addEventListener("click", () => {
      a.role = b.dataset.role;
      Object.assign(a, defaultLook(era.id, a.role));
      app.querySelector("#pAcc").checked = a.acc;
      refresh();
    })
  );
  app.querySelectorAll(".swatch").forEach((b) =>
    b.addEventListener("click", () => {
      a[b.dataset.key] = b.dataset.v;
      refresh();
    })
  );
  app.querySelector("#pAcc").addEventListener("change", (e) => {
    a.acc = e.target.checked;
    refresh();
  });
  const nameInput = app.querySelector("#pName");
  app.querySelector("#dice").addEventListener("click", () => (nameInput.value = randomNick()));
  app.querySelector("[data-go]").addEventListener("click", (e) => (location.hash = e.currentTarget.dataset.go));
  app.querySelector("#enterPalace").addEventListener("click", () => {
    a.name = nameInput.value.trim() || randomNick();
    savePalaceAvatar(era.id, a);
    saveProfile({ nick: a.name });
    location.hash = `world/${era.id}`;
  });

  refresh();
  loadThree()
    .then(() => {
      const canvas = document.getElementById("dressCanvas");
      if (!canvas) return;
      preview = startDressPreview(canvas);
      preview?.update(palaceAvatarOpts(era.id, a));
    })
    .catch(() => {});
  window.scrollTo(0, 0);
}

// 꾸미기 화면의 작은 3D 미리보기
function startDressPreview(canvas) {
  stopPalacePreview?.();
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth || 320, canvas.clientHeight || 380, false);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, (canvas.clientWidth || 320) / (canvas.clientHeight || 380), 0.1, 50);
  camera.position.set(0, 1.9, 8);
  camera.lookAt(0, 1.25, 0);
  scene.add(new THREE.HemisphereLight(0xfff6e0, 0x40384a, 1.0));
  const key = new THREE.DirectionalLight(0xffffff, 0.6);
  key.position.set(3, 5, 4);
  scene.add(key);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.12, 40), new THREE.MeshLambertMaterial({ color: 0x8a7b62 }));
  disc.position.y = -0.06;
  scene.add(disc);
  let av = null;
  let yaw = 0.4, drag = null, raf = 0;
  const onDown = (e) => (drag = e.clientX);
  const onMove = (e) => {
    if (drag === null) return;
    yaw += (e.clientX - drag) * 0.012;
    drag = e.clientX;
  };
  const onUp = () => (drag = null);
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  const clock = new THREE.Clock();
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.1);
    if (drag === null) yaw += dt * 0.5;
    if (av) {
      av.group.rotation.y = yaw;
      animateAvatar(av, dt, clock.elapsedTime, false);
    }
    renderer.render(scene, camera);
  };
  loop();
  stopPalacePreview = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    renderer.dispose();
    renderer.forceContextLoss();
    stopPalacePreview = null;
  };
  return {
    update(opts) {
      if (av) scene.remove(av.group);
      av = makeAvatar({ ...opts, scale: 1.25 });
      if (Math.random() < 0.5) av.anim = { type: "bow", t: 0 };
      scene.add(av.group);
    },
  };
}

/* ---------- 하루의 시간 ---------- */
// 시각(0~24)별 하늘·빛 설정. 사이 시각은 부드럽게 섞어요.
const SKY_KEYS = [
  [0, "night"], [4.6, "night"], [5.6, "dawn"], [6.8, "sunrise"], [9, "morning"], [12.5, "noon"],
  [15.5, "afternoon"], [17.8, "golden"], [19.1, "dusk"], [20.3, "night"], [24, "night"],
];
const SKY = {
  night: { top: "#050818", bottom: "#17224a", fog: "#0f1834", sun: "#9fb2ff", sunI: 0.32, hemiS: "#5867a8", hemiG: "#181826", hemiI: 0.45, night: 1 },
  dawn: { top: "#1d2350", bottom: "#d48ea0", fog: "#6d5a7c", sun: "#ffb59a", sunI: 0.4, hemiS: "#9a96d0", hemiG: "#3a2e3a", hemiI: 0.55, night: 0.65 },
  sunrise: { top: "#4a78b8", bottom: "#ffc58a", fog: "#e0b896", sun: "#ffcf9a", sunI: 0.62, hemiS: "#b8c4e8", hemiG: "#6a5a48", hemiI: 0.5, night: 0.1 },
  morning: { top: "#5d9be0", bottom: "#d4e8f7", fog: "#cadeec", sun: "#fff1d8", sunI: 0.72, hemiS: "#cfe2ff", hemiG: "#8a7a5a", hemiI: 0.52, night: 0 },
  noon: { top: "#3f86de", bottom: "#c4e2fa", fog: "#d2e6f6", sun: "#ffffff", sunI: 0.8, hemiS: "#d8e8ff", hemiG: "#8f8466", hemiI: 0.55, night: 0 },
  afternoon: { top: "#4f8fd8", bottom: "#e6e6d6", fog: "#dedccf", sun: "#fff0d0", sunI: 0.74, hemiS: "#d4dcf0", hemiG: "#8a7a5a", hemiI: 0.52, night: 0 },
  golden: { top: "#5a6fae", bottom: "#ffb36b", fog: "#e8a87a", sun: "#ffb070", sunI: 0.68, hemiS: "#c4a8c8", hemiG: "#6a4a38", hemiI: 0.46, night: 0.15 },
  dusk: { top: "#262a62", bottom: "#e0786a", fog: "#78526e", sun: "#ff8a60", sunI: 0.42, hemiS: "#7a6aa8", hemiG: "#3a2a30", hemiI: 0.44, night: 0.55 },
};
const PHASE_ICON = { dawn: "🌅", morning: "🌤️", day: "☀️", afternoon: "⛅", evening: "🌇", night: "🌙" };
function phaseOf(h) {
  if (h >= 4 && h < 6) return "dawn";
  if (h >= 6 && h < 10) return "morning";
  if (h >= 10 && h < 14) return "day";
  if (h >= 14 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}
function skyAt(h) {
  let i = 0;
  while (SKY_KEYS[i + 1][0] <= h) i++;
  const [h0, k0] = SKY_KEYS[i], [h1, k1] = SKY_KEYS[i + 1];
  const t = (h - h0) / (h1 - h0);
  const a = SKY[k0], b = SKY[k1];
  const mix = (key) => new THREE.Color(a[key]).lerp(new THREE.Color(b[key]), t);
  const num = (key) => a[key] + (b[key] - a[key]) * t;
  return { top: mix("top"), bottom: mix("bottom"), fog: mix("fog"), sun: mix("sun"), hemiS: mix("hemiS"), hemiG: mix("hemiG"), sunI: num("sunI"), hemiI: num("hemiI"), night: num("night") };
}
function localHour() {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

/* ---------- 궁궐 레벨 ---------- */
function createPalaceLevel(era) {
  const def = PALACES[era.id];
  const info = def[LANG];
  const a = loadPalaceAvatar(era.id);
  return {
    place: info.place,
    roomText: `${W().room} ${roomNumber(era, a.name)}`,
    crowdText: P().crowd(def.wanderers.length),
    greet: info.greet,
    speed: 7,
    camDist: 11,
    camPitch: 0.36,
    camYaw: def.camYaw || 0,
    far: 900,
    shadows: true,
    quizEra: def.quiz ? { ...era, quiz: def.quiz[LANG] } : null,
    places: def.map.map(([i, x, z]) => ({ name: info.signs[i][1].split(" ")[0], x, z })),
    clampPos(pos) {
      const [x1, x2, z1, z2] = def.bounds;
      pos.x = clamp(pos.x, x1, x2);
      pos.z = clamp(pos.z, z1, z2);
    },
    build(api) {
      const kit = makeKit(api, def);
      def.build(api, kit);
      placePeople(api, kit, era, def, info, a);
      kit.finish();
    },
  };
}

// 플레이어 · 위인 · 수문장 · 시험관 · 궁인 · 안내판
function placePeople(api, kit, era, def, info, a) {
  const w = W();
  const p = P();
  const { scene, addLabel, addInteract } = api;
  const player = makeAvatar(palaceAvatarOpts(era.id, a));
  const label = addLabel(player.group, `<i>${w.me}</i>${esc(a.name)} · ${roleName(era.id, a.role)}`, "me", 2.7);
  api.setPlayer(player, def.spawn[0], def.spawn[1], def.spawn[2], label);

  const npc = (opts, x, z, face, item) => {
    const av = makeAvatar(opts);
    av.group.position.set(x, api.floorAt(x, z), z);
    av.group.rotation.y = face;
    scene.add(av.group);
    api.addNpcAvatar(av);
    addInteract(av.group, { av, ...item });
    return av;
  };
  const costume = (role) => {
    const c = role === "monk" ? { ...eraCostume(era.id, "civil"), hat: "bald", robe: "#8a8a82", deco: "#5a5a52", patch: undefined } : eraCostume(era.id, role);
    return c;
  };
  era.people.forEach(([name, desc], i) => {
    const [x, z, face, role] = def.npcs[i];
    const emoji = SCENES[era.id].npcs[i];
    npc(costume(role), x, z, face, { kind: "npc", name, desc, emoji, labelHtml: `${emoji} ${name}`, labelCls: "npc", labelHeight: 2.7 });
  });
  def.guards.forEach(([x, z, face]) =>
    npc({ ...costume("military"), weapon: "spear" }, x, z, face, { kind: "talk", count: false, name: p.guard, emoji: "🛡️", say: info.guardSay, desc: info.guardDesc, labelHtml: `🛡️ ${p.guard}`, labelCls: "villager", labelHeight: 2.7 })
  );
  const [ex, ez, ef] = def.examiner;
  npc(costume("civil"), ex, ez, ef, { kind: "quiz", name: info.examiner, emoji: "📝", say: info.examinerSay, labelHtml: `📝 ${info.examiner}${loadStamps()[era.id] ? " 🏮" : ""}`, labelCls: "quiz", labelHeight: 2.7 });
  def.wanderers.forEach(([role, area]) => {
    const c = costume(role);
    const av = makeAvatar({ ...c, scale: 0.9 });
    api.addWanderer(av, area, 1.4);
    addLabel(av.group, roleName(era.id, role), "villager", 2.4);
  });
  info.signs.forEach((s) => kit.sign(s));
}

/* ---------- 건축 도구 ---------- */
function makeKit(api, def) {
  const { scene, add, mat, rand, addLabel, addInteract, addCollider, addFloor } = api;
  const tex = palaceTextures();
  const lattice = new THREE.MeshLambertMaterial({ map: tex.lattice, emissive: 0xffb860, emissiveMap: tex.lattice, emissiveIntensity: 0 });
  const windows = new THREE.MeshLambertMaterial({ color: 0x3a3428, emissive: 0xffc870, emissiveIntensity: 0 });
  const glowMats = [lattice, windows];
  const stone = mat("#b9b1a1");
  const darkStone = mat("#9d9584");
  const pillar = mat("#9c2f22");
  const beam = mat("#2f7a68");
  const plaster = mat("#e2d6bf");
  const water = new THREE.MeshPhongMaterial({ color: 0x2d5b6b, shininess: 90, specular: 0x88aacc, transparent: true, opacity: 0.92 });
  const box = (w, h, d, material, x, y, z, parent) => add(new THREE.BoxGeometry(w, h, d), material, x, y, z, parent);
  const cyl = (rt, rb, h, seg, material, x, y, z, parent) => add(new THREE.CylinderGeometry(rt, rb, h, seg), material, x, y, z, parent);
  const flat = (w, d, material, x, y, z) => {
    const m = add(new THREE.PlaneGeometry(w, d), material, x, y, z);
    m.rotation.x = -Math.PI / 2;
    return m;
  };

  // 기와지붕(또는 초가지붕). tint로 고구려의 붉은 기와 같은 색을 입혀요.
  const roof = (wid, dep, h, y, x, z, opts = {}) => {
    let material;
    if (opts.thatch) material = new THREE.MeshLambertMaterial({ color: opts.thatch === true ? "#b8963f" : opts.thatch, side: THREE.DoubleSide });
    else {
      const t = tex.tile.clone();
      t.needsUpdate = true;
      t.repeat.set(wid / 0.7, 1);
      material = new THREE.MeshLambertMaterial({ map: t, color: opts.tint || "#ffffff", side: THREE.DoubleSide });
    }
    const r = add(roofGeo(wid, dep, h, opts.ridge ?? 0.5), material, x, y, z, opts.parent);
    if (opts.rotate) r.rotation.y = Math.PI / 2;
    if (!opts.noRidge && !opts.thatch) {
      const len = wid * (opts.ridge ?? 0.5) + 0.6; // 용마루는 지붕 모양의 x축을 따라 놓여요(회전하면 z축)
      box(opts.rotate ? 0.55 : len, 0.42, opts.rotate ? len : 0.55, mat("#2a2c33"), x, y + h + 0.1, z, opts.parent);
      box(opts.rotate ? 0.6 : len - 0.3, 0.16, opts.rotate ? len - 0.3 : 0.6, mat("#e8e2d6"), x, y + h - 0.12, z, opts.parent);
      [-1, 1].forEach((s) => {
        const ex = opts.rotate ? x : x + (s * len) / 2, ez = opts.rotate ? z + (s * len) / 2 : z;
        box(0.5, 0.75, 0.5, mat("#2a2c33"), ex, y + h + 0.35, ez, opts.parent);
      });
    }
    return r;
  };
  // 전각: 기단 + 기둥 + 벽 + 보 + 지붕
  const hall = (x, z, o) => {
    const { w: wid, d: dep, h = 5, base = 1, twoTier = false, noRidge = false, open = false, walls = true, collide = true, platform = true } = o;
    const pil = o.pillar ? mat(o.pillar) : pillar;
    const bm = o.beam ? mat(o.beam) : beam;
    const wallM = o.wallMat === "earth" ? mat("#b89a72") : lattice;
    if (base > 0 && platform) box(wid + 3, base, dep + 3, o.thatch ? mat("#8a7458") : stone, x, base / 2, z);
    if (base > 0) addFloor(x - wid / 2 - 1.5, x + wid / 2 + 1.5, z - dep / 2 - 1.5, z + dep / 2 + 1.5, base);
    const nx = Math.max(2, Math.round(wid / 3.2)), nz = Math.max(2, Math.round(dep / 3.2));
    for (let i = 0; i <= nx; i++)
      for (let j = 0; j <= nz; j++) {
        if (i > 0 && i < nx && j > 0 && j < nz) continue;
        cyl(0.26, 0.3, h, 10, pil, x - wid / 2 + (wid * i) / nx, base + h / 2, z - dep / 2 + (dep * j) / nz);
      }
    if (walls) {
      if (open) {
        box(wid - 0.3, h * 0.86, 0.25, wallM, x, base + h * 0.43, z - dep / 2 + 0.2);
        [-1, 1].forEach((s) => box(0.25, h * 0.86, dep - 0.4, wallM, x + s * (wid / 2 - 0.2), base + h * 0.43, z));
        if (collide) {
          addCollider(x - wid / 2, x + wid / 2, z - dep / 2, z - dep / 2 + 0.4);
          addCollider(x - wid / 2, x - wid / 2 + 0.4, z - dep / 2, z + dep / 2);
          addCollider(x + wid / 2 - 0.4, x + wid / 2, z - dep / 2, z + dep / 2);
        }
      } else {
        box(wid - 0.4, h * 0.86, dep - 0.4, wallM, x, base + h * 0.43, z);
        if (collide) addCollider(x - wid / 2, x + wid / 2, z - dep / 2, z + dep / 2);
      }
    }
    if (!o.thatch) {
      box(wid + 0.7, 0.6, dep + 0.7, bm, x, base + h + 0.05, z);
      box(wid + 0.9, 0.18, dep + 0.9, pil, x, base + h - 0.3, z);
    }
    const rh = Math.min(dep + 5, wid + 5) * (o.thatch ? 0.42 : 0.3);
    let top = base + h + 0.35;
    const block = (t) => api.addCamBlock(x - wid / 2 - 2.5, x + wid / 2 + 2.5, z - dep / 2 - 2.5, z + dep / 2 + 2.5, t);
    // rotate: 용마루가 남북(z) 방향으로 놓이는 건물 (동쪽을 바라보는 대한문 등)
    const ropts = { noRidge, tint: o.tint, thatch: o.thatch, rotate: o.rotate };
    const rdim = (a, b) => (o.rotate ? [b, a] : [a, b]);
    if (twoTier) {
      roof(...rdim(wid + 5, dep + 5), rh * 0.55, top, x, z, { ...ropts, noRidge: true, ridge: 0.55 });
      const uw = wid * 0.66, ud = dep * 0.6, uh = h * 0.55;
      const y0 = top + rh * 0.4;
      box(uw, uh, ud, wallM, x, y0 + uh / 2, z);
      for (let i = 0; i <= 4; i++) [-1, 1].forEach((s) => cyl(0.22, 0.24, uh, 8, pil, x - uw / 2 + (uw * i) / 4, y0 + uh / 2, z + (s * ud) / 2));
      box(uw + 0.6, 0.5, ud + 0.6, bm, x, y0 + uh + 0.05, z);
      top = y0 + uh + 0.3;
      const rh2 = Math.min(uw, ud) * 0.42 + 1.4;
      roof(...rdim(uw + 5, ud + 5), rh2, top, x, z, ropts);
      block(top + rh2);
      return top + rh2;
    }
    roof(...rdim(wid + 5, dep + 5), rh, top, x, z, { ...ropts, ridge: o.ridge ?? (o.thatch ? 0.3 : 0.5) });
    block(top + rh);
    return top + rh;
  };
  // 행각(복도 건물). y0는 축대 위에 지을 때의 높이.
  const corridor = (x1, x2, z1, z2, o = {}) => {
    const y0 = o.y0 || 0;
    const alongX = x2 - x1 > z2 - z1;
    const len = alongX ? x2 - x1 : z2 - z1;
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
    const n = Math.max(1, Math.round(len / 3.2));
    for (let i = 0; i <= n; i++) {
      const t = -len / 2 + (len * i) / n;
      [-1.4, 1.4].forEach((off) => cyl(0.2, 0.22, 3, 8, pillar, alongX ? cx + t : cx + off, y0 + 2, alongX ? cz + off : cz + t));
    }
    box(alongX ? len : 4, 0.5, alongX ? 4 : len, stone, cx, y0 + 0.25, cz);
    box(alongX ? len : 0.3, 2.6, alongX ? 0.3 : len, plaster, cx, y0 + 1.8, cz);
    box(alongX ? len + 0.4 : 3.6, 0.4, alongX ? 3.6 : len + 0.4, beam, cx, y0 + 3.6, cz);
    roof(len + 1.6, 6, 1.5, y0 + 3.8, cx, cz, { ridge: 0.92, noRidge: true, rotate: !alongX, tint: o.tint });
    addCollider(x1, x2, z1, z2);
    api.addCamBlock(alongX ? x1 - 0.8 : cx - 3, alongX ? x2 + 0.8 : cx + 3, alongX ? cz - 3 : z1 - 0.8, alongX ? cz + 3 : z2 + 0.8, y0 + 5.5);
  };
  // 궁궐 담장
  const wall = (x1, x2, z1, z2, o = {}) => {
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2, wx = x2 - x1, wz = z2 - z1;
    const y0 = o.y0 || 0;
    box(wx, 1.4, wz, darkStone, cx, y0 + 0.7, cz);
    box(wx, 2, wz, mat(o.color || "#c9a48a"), cx, y0 + 2.4, cz);
    box(wx + 0.8, 0.5, wz + 0.8, mat(o.cap || "#2f323a"), cx, y0 + 3.6, cz);
    addCollider(x1, x2, z1, z2);
  };
  // 흙으로 쌓은 성벽(토성)
  const earthWall = (x1, x2, z1, z2) => {
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2, wx = x2 - x1, wz = z2 - z1;
    box(wx, 2, wz, mat("#8a6a48"), cx, 1, cz);
    box(Math.max(wx - 1.2, 0.8), 1.4, Math.max(wz - 1.2, 0.8), mat("#9a7a52"), cx, 2.7, cz);
    box(Math.max(wx - 1.6, 0.4), 0.9, Math.max(wz - 1.6, 0.4), mat("#6b4a30"), cx, 3.8, cz); // 나무 울타리
    addCollider(x1, x2, z1, z2);
  };
  // 연못: 사각형 여러 개로 물가 모양을 만들어요
  const pond = (rects, y = -0.25) => {
    rects.forEach(([x1, x2, z1, z2]) => {
      box(x2 - x1, 0.6, z2 - z1, water, (x1 + x2) / 2, y, (z1 + z2) / 2);
      addCollider(x1, x2, z1, z2, true);
    });
  };
  const island = (x, z, r, h = 0.8) => {
    cyl(r, r + 0.3, h, 18, mat("#7d8a5e"), x, h / 2 - 0.2, z);
    addTree(api, x, z, Math.min(1.1, r / 2.2), "#2f5a3a");
  };
  const mountain = (x, z, r, h, color) => {
    const m = add(new THREE.ConeGeometry(r, h, 18, 1), mat(color), x, h / 2 - 2, z);
    m.scale.z = 0.7;
  };
  const sign = ([, name, x, z, desc]) => {
    const g = new THREE.Group();
    g.position.set(x, api.floorAt(x, z), z);
    [-0.5, 0.5].forEach((o) => box(0.1, 1.4, 0.1, mat("#5a3e2b"), o, 0.7, 0, g));
    box(1.4, 0.8, 0.08, mat("#3b2a20"), 0, 1.35, 0, g);
    box(1.25, 0.65, 0.02, mat("#efe6cf"), 0, 1.35, 0.05, g);
    const r = box(1.7, 0.08, 0.5, mat("#2f323a"), 0, 1.85, 0, g);
    r.rotation.x = 0.1;
    scene.add(g);
    const short = name.split(" ")[0];
    addInteract(g, { kind: "sign", name, desc, emoji: "📜", labelHtml: `📜 ${LANG === "ko" ? short : name}`, labelCls: "stone", labelHeight: 2.3 }, 0.9, 2);
  };
  const placeLabel = (text, x, y, z) => {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    scene.add(o);
    addLabel(o, `🏯 ${text}`, "place", 0, 45);
  };
  const tree = (x, z, s = 1, color = "#2f5a3a", pine = true) => addTree(api, x, z, s, color, pine);
  const forest = (n, fn) => {
    for (let i = 0; i < n; i++) {
      const [x, z] = fn(rand);
      tree(x, z, 0.9 + rand() * 0.9, i % 3 ? "#2f5a3a" : "#3d6b45", i % 4 !== 0);
    }
  };
  const ground = (color, inner, innerColor) => {
    flat(1400, 1400, mat(color), 0, -0.02, 0);
    if (inner) {
      const [x1, x2, z1, z2] = inner;
      flat(x2 - x1, z2 - z1, mat(innerColor), (x1 + x2) / 2, 0, (z1 + z2) / 2);
    }
  };

  const kit = { scene, tex, lattice, windows, stone, darkStone, pillar, beam, plaster, water, box, cyl, flat, roof, hall, corridor, wall, earthWall, pond, island, mountain, sign, placeLabel, tree, forest, ground, mat, add, rand };
  kit.finish = () => {
    scene.traverse((o) => {
      if (!o.isMesh || o.material.transparent || o.userData.noShadow) return;
      o.castShadow = true;
      o.receiveShadow = true;
    });
    setupSky(api, kit, def.lamps);
  };
  return kit;
}

/* ---------- 하늘과 시간 ---------- */
function setupSky(api, kit, lampSpots) {
  const { scene, add, rand, mat } = api;
  const skyMat = new THREE.ShaderMaterial({
    uniforms: { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() } },
    vertexShader: "varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform vec3 top; uniform vec3 bottom; varying vec3 vPos; void main(){ float h = clamp(normalize(vPos).y * 1.6 + 0.15, 0.0, 1.0); gl_FragColor = vec4(mix(bottom, top, h), 1.0); }",
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), skyMat);
  sky.renderOrder = -1;
  scene.add(sky);
  const stars = makeStars(rand, 700, 1.4);
  stars.scale.setScalar(3.6);
  scene.add(stars);
  const sunBall = add(new THREE.SphereGeometry(14, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff2c8, fog: false }), 0, 0, 0);
  const moonBall = add(new THREE.SphereGeometry(9, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff4cf, fog: false }), 0, 0, 0);
  scene.fog = new THREE.Fog(0xcadeec, 120, 420);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 0.8);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 260 });
  sun.shadow.bias = -0.0006;
  scene.add(sun, sun.target);

  // 등불(청사초롱·횃불·전등)과 그 빛
  const lanterns = lampSpots.map(([x, z, kind]) => {
    const y0 = api.floorAt(x, z);
    kit.box(0.08, 2.2, 0.08, mat("#3b2a20"), x, y0 + 1.1, z);
    const color = kind === "torch" ? 0xff8a3c : kind === "electric" ? 0xfff2c0 : 0xff7a3a;
    const l = add(kind === "torch" ? new THREE.ConeGeometry(0.25, 0.6, 8) : new THREE.CylinderGeometry(0.28, 0.28, 0.6, 12), new THREE.MeshLambertMaterial({ color: kind === "electric" ? 0xf4f0e0 : 0xb3262d, emissive: color, emissiveIntensity: 0 }), x, y0 + 2.4, z);
    l.userData.noShadow = true;
    const light = new THREE.PointLight(color, 0, 26);
    light.position.set(x, y0 + 4, z);
    scene.add(light);
    return { l, light };
  });

  const presets = [null, 5.2, 8, 12, 15.5, 18.4, 22];
  let presetIdx = 0;
  const chip = document.createElement("button");
  chip.className = "w-pill w-btn w-time";
  api.root.querySelector("#wRight").prepend(chip);
  const currentHour = () => presets[presetIdx] ?? localHour();
  chip.addEventListener("click", () => {
    presetIdx = (presetIdx + 1) % presets.length;
    applyTime();
    api.toast(presets[presetIdx] === null ? P().realToast : P().timeToast(P().phases[phaseOf(currentHour())]));
  });
  const dir = new THREE.Vector3();
  let sunDir = new THREE.Vector3(0, 1, 0), moonDir = new THREE.Vector3(0, 1, 0), lightDir = sunDir;
  let nightLevel = 0;
  const applyTime = () => {
    const h = currentHour();
    const s = skyAt(h);
    skyMat.uniforms.top.value.copy(s.top);
    skyMat.uniforms.bottom.value.copy(s.bottom);
    scene.fog.color.copy(s.fog);
    scene.fog.near = 90 + (1 - s.night) * 60;
    scene.fog.far = 330 + (1 - s.night) * 200;
    hemi.color.copy(s.hemiS);
    hemi.groundColor.copy(s.hemiG);
    hemi.intensity = s.hemiI;
    sun.color.copy(s.sun);
    sun.intensity = s.sunI;
    nightLevel = s.night;
    stars.material.opacity = s.night;
    stars.visible = s.night > 0.05;
    kit.lattice.emissiveIntensity = s.night * 0.85;
    kit.windows.emissiveIntensity = s.night * 1.1;
    lanterns.forEach(({ l, light }) => {
      l.material.emissiveIntensity = s.night * 1.4;
      light.intensity = s.night * 1.1;
    });
    const ph = phaseOf(h);
    const hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
    chip.innerHTML = `${PHASE_ICON[ph]} ${P().phases[ph]} <small>${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")} · ${presets[presetIdx] === null ? P().myTime : P().previewLabel}</small>`;
    // 해는 동쪽(+x)에서 떠서 서쪽(-x)으로 져요. 밤에는 달빛이 비춰요.
    const ang = ((h - 6) / 12) * Math.PI;
    dir.set(Math.cos(ang), Math.sin(ang), -0.35).normalize();
    const sunUp = dir.y > -0.05;
    sunBall.visible = sunUp;
    moonBall.visible = !sunUp || h < 6.5 || h > 18.5;
    sunDir = dir.clone();
    moonDir = new THREE.Vector3(-dir.x * 0.7, Math.max(0.35, -dir.y), -0.5).normalize();
    lightDir = sunUp && dir.y > 0.08 ? sunDir : moonDir;
  };
  applyTime();
  let since = 0;
  api.onTick((dt, time, pos) => {
    since += dt;
    if (since > 20) {
      since = 0;
      applyTime();
    }
    const cam = api.camera.position;
    sky.position.copy(cam);
    stars.position.copy(cam);
    sunBall.position.copy(cam).addScaledVector(sunDir, 420);
    moonBall.position.copy(cam).addScaledVector(moonDir, 420);
    sun.position.copy(pos).addScaledVector(lightDir, 120);
    sun.target.position.copy(pos);
    lanterns.forEach(({ l }, i) => (l.scale.y = 1 + Math.sin(time * 3 + i) * 0.04 * nightLevel));
  });
}

function roofGeo(w, d, h, ridge = 0.5) {
  const g = new THREE.PlaneGeometry(w, d, 32, 18);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const u = Math.abs(pos.getX(i)) / (w / 2), v = Math.abs(pos.getZ(i)) / (d / 2);
    const ur = Math.max(0, (u - ridge) / (1 - ridge));
    const e = Math.min(1, Math.max(v, ur));
    let y = h * Math.pow(1 - e, 1.7);
    y += h * 0.14 * Math.pow(e, 5);
    y += h * 0.45 * Math.pow(Math.min(u, v), 3) * Math.pow(Math.max(u, v), 8);
    pos.setY(i, y);
  }
  g.computeVertexNormals();
  return g;
}

// 창호·기와·박석·일월오봉도 텍스처를 캔버스로 그려요
function palaceTextures() {
  const canvasTex = (w, h, draw) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  };
  const lattice = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = "#f1e7cf";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "#7a4a2a";
    g.lineWidth = 3;
    for (let i = 0; i <= 8; i++) {
      g.beginPath();
      g.moveTo((i * w) / 8, 0);
      g.lineTo((i * w) / 8, h);
      g.moveTo(0, (i * h) / 8);
      g.lineTo(w, (i * h) / 8);
      g.stroke();
    }
    g.lineWidth = 8;
    g.strokeRect(0, 0, w, h);
  });
  lattice.repeat.set(3, 1);
  const tile = canvasTex(32, 32, (g) => {
    g.fillStyle = "#3d4048";
    g.fillRect(0, 0, 32, 32);
    g.fillStyle = "#2a2c33";
    g.fillRect(0, 0, 9, 32);
    g.fillStyle = "#4a4e57";
    g.fillRect(20, 0, 4, 32);
  });
  const bakseok = canvasTex(512, 512, (g) => {
    g.fillStyle = "#8a8474";
    g.fillRect(0, 0, 512, 512);
    let s = 7;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let y = 0; y < 512; y += 22) {
      let x = -r() * 30;
      while (x < 512) {
        const w = 26 + r() * 30;
        const c = 128 + r() * 36;
        g.fillStyle = `rgb(${c},${c - 6},${c - 18})`;
        g.fillRect(x + 1.5, y + 1.5, w - 3, 19);
        x += w;
      }
    }
  });
  bakseok.repeat.set(6, 5);
  const irwol = canvasTex(512, 288, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#28508c");
    sky.addColorStop(1, "#5f86b8");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    // 다섯 봉우리
    [[256, 40, 110], [140, 80, 90], [372, 80, 90], [50, 120, 70], [462, 120, 70]].forEach(([x, top, half]) => {
      g.fillStyle = "#2c6e63";
      g.beginPath();
      g.moveTo(x - half, h - 60);
      g.quadraticCurveTo(x - half * 0.35, top + 20, x, top);
      g.quadraticCurveTo(x + half * 0.35, top + 20, x + half, h - 60);
      g.fill();
      g.strokeStyle = "#a7d3a3";
      g.lineWidth = 3;
      g.stroke();
    });
    // 해(오른쪽, 붉은색)와 달(왼쪽, 흰색)
    g.fillStyle = "#d8352a";
    g.beginPath();
    g.arc(410, 46, 22, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#f7f3e6";
    g.beginPath();
    g.arc(102, 46, 22, 0, Math.PI * 2);
    g.fill();
    // 폭포와 물결
    g.fillStyle = "#e9f2f7";
    [196, 316].forEach((x) => g.fillRect(x, 120, 6, h - 180));
    g.fillStyle = "#1f4f86";
    g.fillRect(0, h - 60, w, 60);
    g.strokeStyle = "#e9f2f7";
    g.lineWidth = 2;
    for (let y = h - 52; y < h; y += 12)
      for (let x = 0; x < w; x += 24) {
        g.beginPath();
        g.arc(x + 12, y + 8, 10, Math.PI, 0);
        g.stroke();
      }
    // 양쪽 붉은 소나무
    [18, w - 18].forEach((x) => {
      g.fillStyle = "#8e2f25";
      g.fillRect(x - 5, 90, 10, h - 150);
      g.fillStyle = "#2f6b3a";
      [100, 130, 160].forEach((y) => g.fillRect(x - 18, y, 36, 10));
    });
  });
  // 고구려 무용총 '수렵도'를 본뜬 간단한 벽화
  const mural = canvasTex(512, 232, (g, w, h) => {
    g.fillStyle = "#e8d8b0";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "#5a3e2b";
    g.lineWidth = 6;
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      for (let x = 0; x <= w; x += 8) g.lineTo(x, 60 + i * 42 + Math.sin(x / 28 + i) * 14);
      g.stroke();
    }
    const rider = (x, y, s, dir) => {
      g.save();
      g.translate(x, y);
      g.scale(dir * s, s);
      g.fillStyle = "#3b2a20";
      g.fillRect(-28, -10, 56, 18); // 말
      g.fillRect(22, -24, 12, 20);
      [-22, -10, 12, 22].forEach((lx) => g.fillRect(lx, 8, 5, 22));
      g.fillStyle = "#b3262d";
      g.fillRect(-6, -36, 12, 26); // 사람
      g.beginPath();
      g.arc(0, -42, 7, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#2a1f1a";
      g.lineWidth = 3;
      g.beginPath();
      g.arc(-14, -30, 14, -Math.PI / 2, Math.PI / 2, true); // 활
      g.stroke();
      g.restore();
    };
    rider(150, 110, 1.1, -1);
    rider(330, 170, 0.9, 1);
    g.fillStyle = "#c9862e";
    [[90, 185], [420, 90]].forEach(([x, y]) => {
      g.fillRect(x - 20, y - 8, 40, 14); // 사슴·호랑이
      g.fillRect(x + 14, y - 22, 8, 16);
      [-16, -6, 8, 16].forEach((lx) => g.fillRect(x + lx, y + 6, 4, 16));
    });
  });
  return { lattice, tile, bakseok, irwol, mural };
}
