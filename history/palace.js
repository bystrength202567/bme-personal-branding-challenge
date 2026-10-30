// 조선 경복궁: 캐릭터 꾸미기 + 궁궐 3D 공간 + 접속한 사람의 현재 시각에 따른 하루(새벽·아침·낮·오후·저녁·밤)
const PALACE_KEY = "dalbit-palace-avatar";

const PALACE_COLORS = [
  ["홍", "Red", "#b3262d"], ["자", "Purple", "#6b2f5f"], ["청", "Blue", "#2f5d8a"], ["남", "Navy", "#23305e"], ["녹", "Green", "#3f7a55"],
  ["옥", "Jade", "#8fc4ad"], ["분홍", "Pink", "#e39bb0"], ["황", "Gold", "#d9a62e"], ["백", "White", "#efe6cf"], ["흑", "Black", "#2a2a30"],
];
const SKINS = ["#f6d5b8", "#f1c7a1", "#d9a57c", "#b07a55"];

// 신분별 기본 옷차림
const PALACE_ROLES = {
  king: { emoji: "👑", body: "robe", hat: "ikseon", patch: "round", robe: "#b3262d", deco: "#d9a62e" },
  queen: { emoji: "👸", body: "dress", hat: "gache", robe: "#2f5d8a", deco: "#b3262d", acc: true },
  prince: { emoji: "🤴", body: "robe", hat: "ikseon", patch: "round", robe: "#23305e", deco: "#d9a62e" },
  princess: { emoji: "🎀", body: "dress", hat: "princess", robe: "#3f7a55", deco: "#e39bb0", acc: true },
  civil: { emoji: "📜", body: "robe", hat: "samo", patch: "square", robe: "#2f5d8a", deco: "#d9a62e" },
  military: { emoji: "⚔️", body: "robe", hat: "jeonrip", patch: "square", robe: "#23305e", deco: "#b3262d", weapon: "sword" },
  courtlady: { emoji: "🏮", body: "dress", hat: "bun", robe: "#3f7a55", deco: "#23305e" },
  eunuch: { emoji: "🗝️", body: "robe", hat: "naegwan", robe: "#2a2a30", deco: "#8fc4ad" },
};

const PSTR = {
  ko: {
    place: "경복궁",
    dressTitle: "경복궁에 입장할 나만의 캐릭터를 꾸며요",
    name: "이름",
    role: "신분",
    robe: "옷 색",
    deco: "장식·치마 색",
    skin: "피부색",
    acc: "노리개 달기",
    enter: "🏯 경복궁 입장하기",
    rotateHint: "드래그해서 돌려 보세요",
    roles: {
      king: ["왕", "붉은 곤룡포에 익선관을 쓰고, 근정전에서 나라의 큰 행사를 이끌어요."],
      queen: ["왕비", "어여머리를 얹고, 교태전에서 궁궐의 살림을 이끄는 중전이에요."],
      prince: ["세자", "다음 왕이 될 왕세자. 동궁 자선당에서 공부해요."],
      princess: ["공주", "왕과 왕비의 딸. 당의를 입고 댕기머리를 했어요."],
      civil: ["문관", "사모를 쓰고 흉배를 단 단령 차림의 신하. 품계석 동쪽에 서요."],
      military: ["무관", "전립을 쓰고 칼을 찬 무신. 품계석 서쪽에 서요."],
      courtlady: ["상궁", "궁궐 살림을 맡은 궁녀들의 우두머리예요."],
      eunuch: ["내관", "왕의 곁에서 시중을 들고 궁궐 일을 맡아요."],
    },
    crowd: (n) => `궁인 ${n}`,
    greet: "경복궁에 온 것을 환영하오.",
    examiner: "과거 시험관",
    examinerSay: "과거 시험을 보러 왔는가? 경복궁에 대해 4문제 중 3문제를 맞히면 합격이오!",
    guard: "수문장",
    guardSay: "멈추시오! …아, 손님이시군요. 경복궁에 잘 오셨소.",
    guardDesc: "경복궁은 1395년 태조 이성계가 세운 조선의 법궁(으뜸 궁궐)이에요. 정도전이 '큰 복을 누리라'는 뜻으로 이름을 지었어요. 임진왜란 때 불탄 뒤 270여 년 동안 빈터로 남았다가 고종 때 흥선대원군이 다시 지었어요. 지금도 광화문에서는 수문장 교대 의식을 재현하고 있어요.",
    courtlady: "궁녀",
    eunuch: "내관",
    phases: { dawn: "새벽", morning: "아침", day: "낮", afternoon: "오후", evening: "저녁", night: "밤" },
    myTime: "내 시간",
    previewLabel: "미리보기",
    timeToast: (p) => `${p} 풍경으로 바뀌었어요`,
    realToast: "지금 내 시간의 궁궐로 돌아왔어요",
  },
  en: {
    place: "Gyeongbokgung Palace",
    dressTitle: "Dress up your character for Gyeongbokgung",
    name: "Name",
    role: "Role",
    robe: "Robe color",
    deco: "Trim / skirt color",
    skin: "Skin tone",
    acc: "Add norigae tassel",
    enter: "🏯 Enter Gyeongbokgung",
    rotateHint: "Drag to rotate",
    roles: {
      king: ["King", "Wears the red dragon robe and ikseongwan cap, leading state ceremonies at Geunjeongjeon."],
      queen: ["Queen", "Wears the grand eoyeo-meori hairstyle and runs palace life from Gyotaejeon."],
      prince: ["Crown Prince", "The future king, studying at Jaseondang in the East Palace."],
      princess: ["Princess", "Daughter of the king and queen, in a dang-ui jacket with a braided ribbon."],
      civil: ["Civil Minister", "A scholar-official in a samo hat and rank badge, standing on the east side of the court."],
      military: ["Military Officer", "A general in a jeollip hat with a sword, standing on the west side of the court."],
      courtlady: ["Head Court Lady", "Leader of the court ladies who ran the palace household."],
      eunuch: ["Royal Attendant", "Served at the king's side and handled palace affairs."],
    },
    crowd: (n) => `${n} courtiers`,
    greet: "Welcome to Gyeongbokgung.",
    examiner: "Civil Exam Examiner",
    examinerSay: "Here for the state exam? Answer 3 of 4 questions about Gyeongbokgung correctly and you pass!",
    guard: "Gate Guard",
    guardSay: "Halt! …Ah, a guest. Welcome to Gyeongbokgung.",
    guardDesc: "Gyeongbokgung was founded in 1395 by King Taejo as Joseon's main royal palace. Jeong Do-jeon named it \"palace greatly blessed by heaven.\" It burned in the Imjin War and lay in ruins for about 270 years until Heungseon Daewongun rebuilt it under King Gojong. A reenactment of the royal guard-changing ceremony is still held at Gwanghwamun.",
    courtlady: "Court Lady",
    eunuch: "Attendant",
    phases: { dawn: "Dawn", morning: "Morning", day: "Midday", afternoon: "Afternoon", evening: "Evening", night: "Night" },
    myTime: "My time",
    previewLabel: "Preview",
    timeToast: (p) => `Switched to ${p}`,
    realToast: "Back to the palace at your current time",
  },
};
const P = () => PSTR[LANG];

// 안내판: 실제 건물 이야기 (위치 x, z)
const PALACE_PLACES = {
  ko: [
    ["gwanghwamun", "광화문 光化門", 5, 80, "경복궁의 정문이에요. '임금의 큰 덕이 온 나라를 비춘다'는 뜻이에요. 돌로 쌓은 기단에 무지개 모양의 문(홍예문)이 세 개 있는데, 가운데 문은 임금이 다니던 문이에요. 일제강점기와 한국전쟁을 거치며 자리를 옮기고 훼손되었다가, 2010년 원래 자리에 복원됐어요."],
    ["haechi", "해치 獬豸", -12, 84, "광화문 앞을 지키는 상상의 동물 해치(해태)예요. 옳고 그름을 가려내고, 불의 기운을 막아 준다고 믿었어요."],
    ["heungnyemun", "흥례문 興禮門", 9, 61, "광화문과 근정문 사이에 있는 두 번째 문이에요. 일제강점기에 조선총독부 건물을 지으며 헐렸다가, 2001년에 다시 지어졌어요."],
    ["yeongjegyo", "영제교 永濟橋", 6, 50, "궁궐 안 물길(금천) 위에 놓인 돌다리예요. 물가에는 나쁜 기운이 들어오지 못하게 지키는 상상의 동물 '천록' 석상이 물길을 내려다보고 있어요."],
    ["geunjeongmun", "근정문 勤政門", 10, 28, "근정전 마당으로 들어가는 문이에요. 2층 지붕으로 위엄을 갖췄어요."],
    ["pumgyeseok", "품계석 品階石", -9, 12, "신하들이 벼슬 순서대로 서던 돌 표지예요. 정1품부터 종9품까지 새겨져 있고, 동쪽에는 문관이, 서쪽에는 무관이 섰어요. 가운데 세 갈래 길(삼도) 중 한가운데 높은 길은 임금만 다니던 어도예요."],
    ["geunjeongjeon", "근정전 勤政殿", 14, -2, "경복궁에서 가장 으뜸가는 건물(정전)이에요. 왕의 즉위식, 신하들의 조회, 외국 사신 맞이 같은 나라의 큰 행사가 열렸어요. '부지런히 정치하라'는 뜻을 담았고, 국보로 지정돼 있어요. 2단으로 쌓은 돌 기단(월대) 위에 2층 지붕으로 지어 웅장해요."],
    ["irworobongdo", "일월오봉도 日月五峯圖", 4, -19, "어좌(임금의 자리) 뒤에 세워 두던 그림이에요. 해와 달, 다섯 봉우리, 소나무, 폭포와 물결이 그려져 있고, 임금이 하늘과 땅을 잘 다스린다는 뜻을 담고 있어요. 만 원권 지폐의 세종대왕 뒤에도 이 그림이 있어요."],
    ["sajeongjeon", "사정전 思政殿", 11, -39, "왕이 신하들과 나랏일을 의논하고 공부하던 편전이에요. '깊이 생각해서 옳고 그름을 가려라'는 뜻이에요."],
    ["gangnyeongjeon", "강녕전 康寧殿", 15, -56, "왕이 잠을 자고 생활하던 침전이에요. 지붕 꼭대기에 용마루가 없는 것이 특징이에요. 용으로 여겨진 임금이 머무는 곳이라 그렇다는 이야기가 전해져요."],
    ["gyotaejeon", "교태전 交泰殿", 14, -72, "왕비가 생활하던 침전으로, 궁궐 살림을 이끄는 중궁전이에요. 강녕전처럼 용마루가 없어요."],
    ["amisan", "아미산 峨嵋山", 15, -93, "교태전 뒤뜰의 계단식 꽃동산이에요. 왕비를 위해 꾸몄고, 붉은 벽돌로 쌓은 육각형 굴뚝 네 개가 아름답기로 유명해요(보물)."],
    ["gyeonghoeru", "경회루 慶會樓", -59, -3, "나라에 경사가 있거나 외국 사신이 왔을 때 잔치를 열던 누각이에요. 연못 위에 48개의 돌기둥으로 받쳐 지었어요. 바깥쪽 기둥은 네모나고 안쪽 기둥은 둥근데, 땅과 하늘을 뜻한다고 해요. 국보예요."],
    ["sujeongjeon", "수정전 修政殿", -39, 21, "세종대왕 때 학자들이 모여 훈민정음 창제를 도운 집현전이 있던 자리예요. 지금 건물은 고종 때 다시 지었어요."],
    ["hyangwonjeong", "향원정 香遠亭", 12, -107, "고종 때 연못 가운데 섬 위에 지은 2층 육각형 정자예요. '향기가 멀리 퍼진다'는 뜻이고, 섬으로 건너가는 다리 이름은 '향기에 취한다'는 취향교예요."],
    ["jaseondang", "자선당 資善堂", 41, -3, "세자가 머물며 공부하던 동궁의 건물이에요. 동궁은 해가 뜨는 동쪽에 있어서 '떠오르는 해' 같은 세자를 뜻했어요."],
  ],
  en: [
    ["gwanghwamun", "Gwanghwamun Gate", 5, 80, "The main gate of Gyeongbokgung. Its name means \"may the king's virtue shine across the land.\" The stone base has three arched gateways — the middle one was for the king alone. Moved and damaged during the Japanese occupation and the Korean War, it was restored to its original spot in 2010."],
    ["haechi", "Haechi Statue", -12, 84, "Haechi (haetae) is a mythical beast guarding Gwanghwamun. People believed it could tell right from wrong and protect against fire."],
    ["heungnyemun", "Heungnyemun Gate", 9, 61, "The second gate, between Gwanghwamun and Geunjeongmun. It was torn down for the Japanese Government-General building and rebuilt in 2001."],
    ["yeongjegyo", "Yeongjegyo Bridge", 6, 50, "A stone bridge over the palace stream (Geumcheon). Stone 'cheollok' beasts on the banks watch the water to keep evil spirits out."],
    ["geunjeongmun", "Geunjeongmun Gate", 10, 28, "The gate to the courtyard of Geunjeongjeon, crowned with a dignified two-tier roof."],
    ["pumgyeseok", "Rank Stones (Pumgyeseok)", -9, 12, "Officials lined up by rank at these stones, carved from first to ninth rank. Civil officials stood on the east, military officials on the west. The raised center lane of the three-lane path was the king's road."],
    ["geunjeongjeon", "Geunjeongjeon Hall", 14, -2, "The main throne hall, where coronations, royal audiences and receptions for foreign envoys took place. Its name means \"diligent governance.\" It stands on a two-tier stone terrace (woldae) with a two-tier roof, and is a National Treasure."],
    ["irworobongdo", "Sun, Moon & Five Peaks", 4, -19, "This painting stood behind the king's throne. The sun, moon, five peaks, pines and waves show the king ruling heaven and earth in harmony. You can also find it behind King Sejong on the 10,000-won bill."],
    ["sajeongjeon", "Sajeongjeon Hall", 11, -39, "The king's office, where he discussed state affairs with ministers and studied. Its name means \"think deeply to judge right from wrong.\""],
    ["gangnyeongjeon", "Gangnyeongjeon Hall", 15, -56, "The king's living quarters. Its roof has no top ridge — legend says because the king, seen as a dragon, slept there."],
    ["gyotaejeon", "Gyotaejeon Hall", 14, -72, "The queen's quarters, the heart of palace household life. Like Gangnyeongjeon, it has no top ridge."],
    ["amisan", "Amisan Garden", 15, -93, "A terraced flower garden behind Gyotaejeon, made for the queen. Its four hexagonal red-brick chimneys are famous for their beauty (a Treasure)."],
    ["gyeonghoeru", "Gyeonghoeru Pavilion", -59, -3, "A banquet pavilion for national celebrations and foreign envoys, built over a pond on 48 stone pillars. The outer pillars are square and the inner ones round, symbolizing earth and heaven. A National Treasure."],
    ["sujeongjeon", "Sujeongjeon Hall", -39, 21, "The site of Jiphyeonjeon, the Hall of Worthies where scholars helped King Sejong create Hangeul. The current building dates from Gojong's reign."],
    ["hyangwonjeong", "Hyangwonjeong Pavilion", 12, -107, "A two-story hexagonal pavilion on an island, built under King Gojong. Its name means \"fragrance spreading far,\" and its bridge is Chwihyanggyo, \"drunk on fragrance.\""],
    ["jaseondang", "Jaseondang Hall", 41, -3, "Where the crown prince lived and studied in the East Palace. The east, where the sun rises, stood for the prince as the rising sun."],
  ],
};

const PALACE_QUIZ = {
  ko: [
    { q: "경복궁의 정문은?", o: ["광화문", "흥례문", "근정문", "숭례문"], a: 0, e: "광화문이 경복궁의 정문이에요. 숭례문은 한양 도성의 남쪽 문(남대문)이에요." },
    { q: "왕의 즉위식 같은 나라의 큰 행사를 연 건물은?", o: ["사정전", "근정전", "강녕전", "교태전"], a: 1, e: "경복궁의 정전인 근정전이에요." },
    { q: "경회루를 받치는 돌기둥은 모두 몇 개일까요?", o: ["24개", "36개", "48개", "64개"], a: 2, e: "48개의 돌기둥이 연못 위 경회루를 받치고 있어요." },
    { q: "어좌 뒤에 둔, 해·달·다섯 봉우리가 그려진 그림은?", o: ["일월오봉도", "몽유도원도", "세한도", "금강전도"], a: 0, e: "일월오봉도예요. 만 원권 지폐에도 있어요." },
  ],
  en: [
    { q: "What is the main gate of Gyeongbokgung?", o: ["Gwanghwamun", "Heungnyemun", "Geunjeongmun", "Sungnyemun"], a: 0, e: "Gwanghwamun. Sungnyemun is the south gate of the Seoul city wall." },
    { q: "Which hall hosted coronations and major state ceremonies?", o: ["Sajeongjeon", "Geunjeongjeon", "Gangnyeongjeon", "Gyotaejeon"], a: 1, e: "Geunjeongjeon, the main throne hall." },
    { q: "How many stone pillars hold up Gyeonghoeru?", o: ["24", "36", "48", "64"], a: 2, e: "48 stone pillars support the pavilion over the pond." },
    { q: "What painting stood behind the throne?", o: ["Sun, Moon & Five Peaks", "Dream Journey to the Peach Blossom Land", "Winter Scene", "Mount Geumgang"], a: 0, e: "Irworobongdo — also printed on the 10,000-won bill." },
  ],
};

/* ---------- 캐릭터 저장 ---------- */
function loadPalaceAvatar() {
  try { return JSON.parse(localStorage.getItem(PALACE_KEY)) || null; } catch { return null; }
}
function palaceAvatarOpts(a) {
  const r = PALACE_ROLES[a.role];
  return { body: r.body, hat: r.hat, patch: r.patch, weapon: r.weapon, robe: a.robe, deco: a.deco, skin: a.skin, acc: a.acc };
}

/* ---------- 캐릭터 꾸미기 ---------- */
let stopPalacePreview = null;
function renderPalaceDresser(era) {
  const p = P();
  const profile = loadProfile() || {};
  const saved = loadPalaceAvatar();
  const a = saved || { role: "king", ...pick(PALACE_ROLES.king), skin: SKINS[1], name: profile.nick || profile.name || randomNick() };
  delete app.dataset.era;
  app.style.setProperty("--c", era.color);
  const swatches = (key) => PALACE_COLORS.map(([ko, en, hex]) => `<button class="swatch" data-key="${key}" data-v="${hex}" style="--s:${hex}" title="${LANG === "en" ? en : ko}"></button>`).join("");
  app.innerHTML = `
    <button class="back" data-go="era/${era.id}">← ${era.emoji} ${era.name}</button>
    <section class="dresser fade-in">
      <p class="eyebrow">${era.name} · ${p.place}</p>
      <h1>${p.dressTitle}</h1>
      <div class="dresser-grid">
        <div class="dresser-preview">
          <canvas id="dressCanvas" width="320" height="380"></canvas>
          <p class="hint">${p.rotateHint}</p>
          <p class="role-desc" id="roleDesc"></p>
        </div>
        <div class="dresser-controls">
          <label class="nick-field">${p.name}<span><input id="pName" maxlength="12" value="${esc(a.name)}" /><button type="button" id="dice" aria-label="random">🎲</button></span></label>
          <h3>${p.role}</h3>
          <div class="role-grid">${Object.entries(PALACE_ROLES).map(([id, r]) => `<button class="role" data-role="${id}"><span>${r.emoji}</span>${p.roles[id][0]}</button>`).join("")}</div>
          <h3>${p.robe}</h3><div class="swatches">${swatches("robe")}</div>
          <h3>${p.deco}</h3><div class="swatches">${swatches("deco")}</div>
          <h3>${p.skin}</h3><div class="swatches">${SKINS.map((s) => `<button class="swatch" data-key="skin" data-v="${s}" style="--s:${s}"></button>`).join("")}</div>
          <label class="check"><input type="checkbox" id="pAcc" ${a.acc ? "checked" : ""} /> ${p.acc}</label>
        </div>
      </div>
      <div class="room-line">🏯 ${p.place} · ${W().room} <b>${roomNumber(era, a.name)}</b></div>
      <button class="btn big" id="enterPalace">${p.enter}</button>
    </section>`;

  const refresh = () => {
    app.querySelectorAll(".role").forEach((b) => b.classList.toggle("on", b.dataset.role === a.role));
    app.querySelectorAll(".swatch").forEach((b) => b.classList.toggle("on", a[b.dataset.key] === b.dataset.v));
    app.querySelector("#roleDesc").textContent = `${PALACE_ROLES[a.role].emoji} ${p.roles[a.role][1]}`;
    preview?.update(a);
  };
  app.querySelectorAll(".role").forEach((b) =>
    b.addEventListener("click", () => {
      a.role = b.dataset.role;
      Object.assign(a, pick(PALACE_ROLES[a.role]));
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
    try { localStorage.setItem(PALACE_KEY, JSON.stringify(a)); } catch {}
    saveProfile({ nick: a.name });
    location.hash = `world/${era.id}`;
  });

  let preview = null;
  refresh();
  loadThree()
    .then(() => {
      const canvas = document.getElementById("dressCanvas");
      if (!canvas) return;
      preview = startDressPreview(canvas);
      preview.update(a);
    })
    .catch(() => {});
  window.scrollTo(0, 0);
}
function pick(r) {
  return { robe: r.robe, deco: r.deco, acc: !!r.acc };
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
    update(a) {
      if (av) scene.remove(av.group);
      av = makeAvatar({ ...palaceAvatarOpts(a), scale: 1.25 });
      if (Math.random() < 0.5) av.anim = { type: "wave", t: 0 };
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

/* ---------- 경복궁 3D ---------- */
function createPalaceLevel(era) {
  const p = P();
  const a = loadPalaceAvatar();
  const places = PALACE_PLACES[LANG];
  const quiz = PALACE_QUIZ[LANG];
  return {
    place: p.place,
    roomText: `${W().room} ${roomNumber(era, a.name)}`,
    crowdText: p.crowd(5),
    greet: p.greet,
    speed: 7,
    camDist: 11,
    camPitch: 0.36,
    far: 900,
    shadows: true,
    quizEra: { ...era, quiz },
    places: [
      [p.place === "경복궁" ? "광화문" : "Gwanghwamun", 0, 86],
      [places[3][1].split(" ")[0], 0, 52],
      [places[6][1].split(" ")[0], 0, 4],
      [places[8][1].split(" ")[0], 0, -36],
      [places[9][1].split(" ")[0], 0, -53],
      [places[10][1].split(" ")[0], 0, -71],
      [places[12][1].split(" ")[0], -52, -2],
      [places[14][1].split(" ")[0], 12, -102],
      [places[15][1].split(" ")[0], 41, 2],
    ].map(([name, x, z]) => ({ name, x, z })),
    clampPos(pos) {
      if (pos.z > 72) {
        pos.x = clamp(pos.x, -40, 40);
        pos.z = Math.min(pos.z, 110);
      } else {
        pos.x = clamp(pos.x, -78, 78);
        pos.z = Math.max(pos.z, -126);
      }
    },
    build(api) {
      buildPalace(api, era, a, places);
    },
  };
}

function buildPalace(api, era, avatarData, places) {
  const p = P();
  const w = W();
  const { scene, add, mat, glow, rand, addLabel, addInteract, addCollider, addFloor } = api;
  const tex = palaceTextures();
  const lattice = new THREE.MeshLambertMaterial({ map: tex.lattice, emissive: 0xffb860, emissiveMap: tex.lattice, emissiveIntensity: 0 });
  const stone = mat("#b9b1a1");
  const darkStone = mat("#9d9584");
  const pillar = mat("#9c2f22");
  const beam = mat("#2f7a68");
  const plaster = mat("#e2d6bf");
  const water = new THREE.MeshPhongMaterial({ color: 0x2d5b6b, shininess: 90, specular: 0x88aacc, transparent: true, opacity: 0.92 });
  const box = (w, h, d, material, x, y, z, parent) => add(new THREE.BoxGeometry(w, h, d), material, x, y, z, parent);
  const flat = (w, d, material, x, y, z) => {
    const m = add(new THREE.PlaneGeometry(w, d), material, x, y, z);
    m.rotation.x = -Math.PI / 2;
    return m;
  };

  /* --- 하늘·빛 --- */
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

  /* --- 땅·산 --- */
  const ground = flat(1400, 1400, mat("#8f9a6e"), 0, -0.02, 0);
  ground.receiveShadow = true;
  flat(160, 200, mat("#b4a585"), 0, 0, -28).receiveShadow = true; // 궁궐 안 마사토
  flat(84, 40, mat("#8e8a80"), 0, 0.005, 92).receiveShadow = true; // 광화문 앞 광장
  [[0, -330, 150, 95, "#3f5a3a"], [-210, -250, 110, 62, "#486446"], [200, -290, 100, 50, "#4b6a48"], [-120, -380, 120, 70, "#3a5236"]].forEach(([x, z, r, h, c]) => {
    const m = add(new THREE.ConeGeometry(r, h, 18, 1), mat(c), x, h / 2 - 2, z);
    m.scale.z = 0.7;
  });

  /* --- 건물 도우미 --- */
  const roof = (wid, dep, h, y, x, z, opts = {}) => {
    const t = tex.tile.clone();
    t.needsUpdate = true;
    t.repeat.set(wid / 0.7, 1);
    const r = add(roofGeo(wid, dep, h, opts.ridge ?? 0.5), new THREE.MeshLambertMaterial({ map: t, side: THREE.DoubleSide }), x, y, z, opts.parent);
    if (opts.rotate) r.rotation.y = Math.PI / 2;
    if (!opts.noRidge) {
      const len = (opts.rotate ? dep : wid) * (opts.ridge ?? 0.5) + 0.6;
      const rg = box(opts.rotate ? 0.55 : len, 0.42, opts.rotate ? len : 0.55, mat("#2a2c33"), x, y + h + 0.1, z, opts.parent);
      box(opts.rotate ? 0.6 : len - 0.3, 0.16, opts.rotate ? len - 0.3 : 0.6, mat("#e8e2d6"), x, y + h - 0.12, z, opts.parent);
      [-1, 1].forEach((s) => {
        // 용마루 양 끝의 취두
        const ex = opts.rotate ? x : x + s * len / 2, ez = opts.rotate ? z + s * len / 2 : z;
        box(0.5, 0.75, 0.5, mat("#2a2c33"), ex, y + h + 0.35, ez, opts.parent);
      });
      return rg;
    }
    return r;
  };
  // 전각: 기단 + 붉은 기둥 + 창호 벽 + 단청 + 곡선 지붕
  const hall = (x, z, o) => {
    const { w: wid, d: dep, h = 5, base = 1, twoTier = false, noRidge = false, open = false, walls = true, collide = true, platform = true } = o;
    if (base > 0 && platform) {
      box(wid + 3, base, dep + 3, stone, x, base / 2, z);
      addFloor(x - wid / 2 - 1.5, x + wid / 2 + 1.5, z - dep / 2 - 1.5, z + dep / 2 + 1.5, base);
    }
    const nx = Math.max(2, Math.round(wid / 3.2)), nz = Math.max(2, Math.round(dep / 3.2));
    for (let i = 0; i <= nx; i++)
      for (let j = 0; j <= nz; j++) {
        if (i > 0 && i < nx && j > 0 && j < nz) continue;
        add(new THREE.CylinderGeometry(0.26, 0.3, h, 10), pillar, x - wid / 2 + (wid * i) / nx, base + h / 2, z - dep / 2 + (dep * j) / nz);
      }
    if (walls) {
      if (open) {
        box(wid - 0.3, h * 0.86, 0.25, lattice, x, base + h * 0.43, z - dep / 2 + 0.2);
        [-1, 1].forEach((s) => box(0.25, h * 0.86, dep - 0.4, lattice, x + s * (wid / 2 - 0.2), base + h * 0.43, z));
        if (collide) {
          addCollider(x - wid / 2, x + wid / 2, z - dep / 2, z - dep / 2 + 0.4);
          addCollider(x - wid / 2, x - wid / 2 + 0.4, z - dep / 2, z + dep / 2);
          addCollider(x + wid / 2 - 0.4, x + wid / 2, z - dep / 2, z + dep / 2);
        }
      } else {
        box(wid - 0.4, h * 0.86, dep - 0.4, lattice, x, base + h * 0.43, z);
        if (collide) addCollider(x - wid / 2, x + wid / 2, z - dep / 2, z + dep / 2);
      }
    }
    box(wid + 0.7, 0.6, dep + 0.7, beam, x, base + h + 0.05, z);
    box(wid + 0.9, 0.18, dep + 0.9, pillar, x, base + h - 0.3, z);
    const rh = Math.min(dep + 5, wid + 5) * 0.3;
    let top = base + h + 0.35;
    const block = (t) => api.addCamBlock(x - wid / 2 - 2.5, x + wid / 2 + 2.5, z - dep / 2 - 2.5, z + dep / 2 + 2.5, t);
    if (twoTier) {
      roof(wid + 5, dep + 5, rh * 0.55, top, x, z, { noRidge: true, ridge: 0.55 });
      const uw = wid * 0.66, ud = dep * 0.6, uh = h * 0.55;
      const y0 = top + rh * 0.4;
      box(uw, uh, ud, lattice, x, y0 + uh / 2, z);
      for (let i = 0; i <= 4; i++) [-1, 1].forEach((s) => add(new THREE.CylinderGeometry(0.22, 0.24, uh, 8), pillar, x - uw / 2 + (uw * i) / 4, y0 + uh / 2, z + s * ud / 2));
      box(uw + 0.6, 0.5, ud + 0.6, beam, x, y0 + uh + 0.05, z);
      top = y0 + uh + 0.3;
      roof(uw + 5, ud + 5, Math.min(uw, ud) * 0.42 + 1.4, top, x, z, { noRidge });
      block(top + Math.min(uw, ud) * 0.42 + 1.4);
      return top + Math.min(uw, ud) * 0.42 + 1.4;
    }
    roof(wid + 5, dep + 5, rh, top, x, z, { noRidge, ridge: o.ridge ?? 0.5 });
    block(top + rh);
    return top + rh;
  };
  // 행각(복도 건물)
  const corridor = (x1, x2, z1, z2) => {
    const alongX = x2 - x1 > z2 - z1;
    const len = alongX ? x2 - x1 : z2 - z1;
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
    const n = Math.max(1, Math.round(len / 3.2));
    for (let i = 0; i <= n; i++) {
      const t = -len / 2 + (len * i) / n;
      [-1.4, 1.4].forEach((o) => add(new THREE.CylinderGeometry(0.2, 0.22, 3, 8), pillar, alongX ? cx + t : cx + o, 0.5 + 1.5, alongX ? cz + o : cz + t));
    }
    box(alongX ? len : 4, 0.5, alongX ? 4 : len, stone, cx, 0.25, cz);
    box(alongX ? len : 0.3, 2.6, alongX ? 0.3 : len, plaster, cx, 1.8, cz);
    box(alongX ? len + 0.4 : 3.6, 0.4, alongX ? 3.6 : len + 0.4, beam, cx, 3.6, cz);
    roof(len + 1.6, 6, 1.5, 3.8, cx, cz, { ridge: 0.92, noRidge: true, rotate: !alongX });
    addCollider(x1, x2, z1, z2);
    api.addCamBlock(alongX ? x1 - 0.8 : cx - 3, alongX ? x2 + 0.8 : cx + 3, alongX ? cz - 3 : z1 - 0.8, alongX ? cz + 3 : z2 + 0.8, 5.5);
  };
  // 궁궐 담장
  const wall = (x1, x2, z1, z2) => {
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2, wx = x2 - x1, wz = z2 - z1;
    box(wx, 1.4, wz, darkStone, cx, 0.7, cz);
    box(wx, 2, wz, mat("#c9a48a"), cx, 2.4, cz);
    box(wx + 0.8, 0.5, wz + 0.8, mat("#2f323a"), cx, 3.6, cz);
    addCollider(x1, x2, z1, z2);
  };
  // 안내판
  const sign = (idx) => {
    const [, name, x, z, desc] = places[idx];
    const g = new THREE.Group();
    g.position.set(x, api.floorAt(x, z), z);
    [-0.5, 0.5].forEach((o) => box(0.1, 1.4, 0.1, mat("#5a3e2b"), o, 0.7, 0, g));
    box(1.4, 0.8, 0.08, mat("#3b2a20"), 0, 1.35, 0, g);
    box(1.25, 0.65, 0.02, mat("#efe6cf"), 0, 1.35, 0.05, g);
    const r = box(1.7, 0.08, 0.5, mat("#2f323a"), 0, 1.85, 0, g);
    r.rotation.x = 0.1;
    scene.add(g);
    const ko = name.split(" ")[0];
    addInteract(g, { kind: "sign", name, desc, emoji: "📜", labelHtml: `📜 ${LANG === "ko" ? ko : name}`, labelCls: "stone", labelHeight: 2.3 }, 0.9, 2);
  };
  const placeLabel = (text, x, y, z) => {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    scene.add(o);
    addLabel(o, text, "place", 0, 45);
  };

  /* --- 광화문과 바깥 담장 --- */
  const blocks = [[-11, -6.2], [-3.8, -1.4], [1.4, 3.8], [6.2, 11]];
  blocks.forEach(([x1, x2]) => {
    box(x2 - x1, 4.4, 8, stone, (x1 + x2) / 2, 2.2, 72);
    addCollider(x1, x2, 68, 76);
  });
  box(22, 1.8, 8, stone, 0, 5.3, 72);
  [-5, 0, 5].forEach((x) => box(x === 0 ? 2.8 : 2.4, 0.6, 8.05, mat("#3a3a3a"), x, 4.1, 72)); // 홍예 그늘
  box(22.6, 0.6, 8.6, darkStone, 0, 6.4, 72);
  hall(0, 72, { w: 13, d: 5.5, h: 3.4, base: 6.7, twoTier: true, collide: false, platform: false });
  placeLabel(`🏯 ${LANG === "ko" ? "광화문 光化門" : "Gwanghwamun"}`, 0, 22, 72);
  wall(-80, -11, 71, 73);
  wall(11, 80, 71, 73);
  wall(-81, -79, -128, 73);
  wall(79, 81, -128, 73);
  wall(-81, 81, -129, -127);

  // 해치 한 쌍
  [-9, 9].forEach((x) => {
    const g = new THREE.Group();
    g.position.set(x, 0, 83);
    box(1.6, 1, 2.4, darkStone, 0, 0.5, 0, g);
    box(1.2, 1.1, 1.8, stone, 0, 1.55, 0, g);
    add(new THREE.SphereGeometry(0.75, 14, 12), stone, 0, 2.5, 0.6, g);
    scene.add(g);
  });

  /* --- 흥례문 마당 · 금천 · 영제교 --- */
  corridor(-30, -6, 54, 58);
  corridor(6, 30, 54, 58);
  hall(0, 56, { w: 12, d: 4.5, h: 4, base: 0.5, twoTier: true, walls: false });
  corridor(-30, -26, 26, 54);
  corridor(26, 30, 26, 54);
  addFloor(-3.5, 3.5, 43.5, 47.5, 0.35);
  [[-28, -3.5], [3.5, 28]].forEach(([x1, x2]) => {
    box(x2 - x1, 0.5, 3, water, (x1 + x2) / 2, -0.1, 45.5);
    box(x2 - x1, 0.6, 0.4, stone, (x1 + x2) / 2, 0.1, 43.8);
    box(x2 - x1, 0.6, 0.4, stone, (x1 + x2) / 2, 0.1, 47.2);
    addCollider(x1, x2, 44, 47, true);
  });
  box(7, 0.5, 4.4, stone, 0, 0.1, 45.5);
  [-3.3, 3.3].forEach((x) => box(0.3, 0.7, 4.4, darkStone, x, 0.6, 45.5));
  [[-4.6, 43], [4.6, 43], [-4.6, 48], [4.6, 48]].forEach(([x, z]) => {
    box(1, 0.7, 1.4, darkStone, x, 0.35, z); // 천록
    add(new THREE.SphereGeometry(0.4, 10, 8), darkStone, x, 0.95, z + (z < 45 ? -0.4 : 0.4));
  });
  placeLabel(`🏯 ${LANG === "ko" ? "흥례문 興禮門" : "Heungnyemun"}`, 0, 16, 56);

  /* --- 근정문 · 근정전 마당 --- */
  corridor(-34, -7, 22, 26);
  corridor(7, 34, 22, 26);
  hall(0, 24, { w: 14, d: 4.5, h: 4, base: 0.6, twoTier: true, walls: false });
  corridor(-34, -30, -36, 4.5);
  corridor(-34, -30, 7.5, 22);
  corridor(30, 34, -36, 4.5);
  corridor(30, 34, 7.5, 22);
  corridor(-34, -3, -36, -32);
  corridor(3, 34, -36, -32);
  const bak = flat(60, 54, new THREE.MeshLambertMaterial({ map: tex.bakseok }), 0, 0.01, -5);
  bak.receiveShadow = true;
  box(5, 0.2, 26, mat("#a59d8c"), 0, 0.1, 9);
  box(1.6, 0.32, 26, mat("#b9b1a1"), 0, 0.16, 9);
  addFloor(-2.5, 2.5, -4, 22, 0.2);
  for (let i = 0; i < 18; i++)
    [-6, 6].forEach((x) => {
      box(0.5, 0.75, 0.35, darkStone, x, 0.37, 20 - i * 1.25);
    });
  // 월대 2단
  box(38, 1.2, 24, stone, 0, 0.6, -16);
  box(32, 1.2, 20, stone, 0, 1.8, -17);
  addFloor(-19, 19, -28, -4, 1.2);
  addFloor(-16, 16, -27, -7, 2.4);
  [[-4, 1.2], [-7, 2.4]].forEach(([z, h]) => box(6, h, 1, mat("#c9c1b0"), 0, h / 2, z - 0.4));
  // 근정전: 앞이 트인 내부 + 어좌 + 일월오봉도
  const gTop = hall(0, -17, { w: 22, d: 13, h: 6, base: 2.4, twoTier: true, open: true });
  box(22, 0.3, 13, mat("#7a5c40"), 0, 2.55, -17);
  addFloor(-11, 11, -23.5, -10.5, 2.7);
  box(4.4, 0.8, 3, mat("#8e2f25"), 0, 3.1, -21.3);
  box(1.6, 1.5, 1, mat("#b3262d"), 0, 4.2, -21.6);
  const screen = add(new THREE.PlaneGeometry(6.4, 3.6), new THREE.MeshBasicMaterial({ map: tex.irwol }), 0, 4.9, -22.6);
  placeLabel(`🏯 ${LANG === "ko" ? "근정전 勤政殿" : "Geunjeongjeon"}`, 0, gTop + 1, -17);
  void screen;

  /* --- 사정전 · 강녕전 · 교태전 · 아미산 --- */
  hall(0, -44, { w: 16, d: 9, h: 4.5, base: 1.1 });
  placeLabel(`🏯 ${LANG === "ko" ? "사정전 思政殿" : "Sajeongjeon"}`, 0, 12, -44);
  wall(-34, -12, -51, -50);
  wall(12, 34, -51, -50);
  box(22, 1.4, 5, stone, 0, 0.7, -58.5);
  addFloor(-11, 11, -61, -56, 1.4);
  hall(0, -66, { w: 22, d: 9, h: 4.5, base: 1.4, noRidge: true });
  placeLabel(`🏯 ${LANG === "ko" ? "강녕전 康寧殿" : "Gangnyeongjeon"}`, 0, 12, -66);
  wall(-30, -14, -75, -74);
  wall(14, 30, -75, -74);
  hall(0, -82, { w: 20, d: 9, h: 4.5, base: 1.2, noRidge: true });
  placeLabel(`🏯 ${LANG === "ko" ? "교태전 交泰殿" : "Gyotaejeon"}`, 0, 12, -82);
  [[0.8, -92.5], [1.6, -95], [2.4, -97.5]].forEach(([h, z]) => {
    box(26, h, 2.5, mat("#6f8a55"), 0, h / 2, z);
    addCollider(-13, 13, z - 1.25, z + 1.25, true);
  });
  [-7.5, -2.5, 2.5, 7.5].forEach((x) => {
    add(new THREE.CylinderGeometry(0.55, 0.6, 2.6, 6), mat("#9a4a3a"), x, 3.7, -97.5);
    add(new THREE.ConeGeometry(0.9, 0.5, 6), mat("#2f323a"), x, 5.2, -97.5);
  });
  for (let i = 0; i < 14; i++) add(new THREE.SphereGeometry(0.35, 8, 6), mat(["#e39bb0", "#f3d27a", "#ffffff"][i % 3]), -12 + i * 1.85, 1.2 + (i % 3) * 0.8, -92.8 - (i % 3) * 2.5);

  /* --- 경회루 --- */
  const pondColliders = [[-66, -38, -36, -28], [-66, -38, -14, -6], [-66, -59, -28, -14], [-45, -38, -28, -26], [-45, -38, -24, -22], [-45, -38, -20, -18], [-45, -38, -16, -14]];
  pondColliders.forEach((c) => addCollider(...c, true));
  box(28, 0.6, 30, water, -52, -0.25, -21);
  [[-66, -38, -36.4, -35.6], [-66, -38, -6.4, -5.6], [-66.4, -65.6, -36, -6], [-38.4, -37.6, -36, -6]].forEach(([x1, x2, z1, z2]) => box(x2 - x1, 0.7, z2 - z1, stone, (x1 + x2) / 2, 0.15, (z1 + z2) / 2));
  box(14, 0.8, 14, stone, -52, 0.2, -21);
  addFloor(-59, -45, -28, -14, 0.6);
  [-25, -21, -17].forEach((z) => {
    box(7, 0.4, 2, stone, -41.5, 0.3, z);
    addFloor(-45, -38, z - 1, z + 1, 0.5);
  });
  // 48개의 돌기둥: 바깥 네모 기둥 24 + 안쪽 둥근 기둥 24
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 6; j++) {
      const x = -57.5 + (11 * j) / 5, z = -26.5 + (11 * i) / 7;
      const outer = i === 0 || i === 7 || j === 0 || j === 5;
      if (outer) box(0.7, 4.6, 0.7, darkStone, x, 2.9, z);
      else add(new THREE.CylinderGeometry(0.38, 0.38, 4.6, 12), darkStone, x, 2.9, z);
    }
  box(13, 0.6, 13, mat("#6b4a30"), -52, 5.4, -21);
  box(13.4, 0.5, 13.4, mat("#9c2f22"), -52, 6.0, -21);
  for (let i = 0; i <= 7; i++) [-1, 1].forEach((s) => add(new THREE.CylinderGeometry(0.22, 0.24, 3, 8), pillar, -57.5 + (11 * (s > 0 ? 5 : 0)) / 5, 7.7, -26.5 + (11 * i) / 7));
  for (let j = 0; j <= 5; j++) [-1, 1].forEach((s) => add(new THREE.CylinderGeometry(0.22, 0.24, 3, 8), pillar, -57.5 + (11 * j) / 5, 7.7, -21 + s * 5.5));
  box(12, 0.5, 12, beam, -52, 9.3, -21);
  roof(17, 18, 4.4, 9.6, -52, -21, { rotate: true, ridge: 0.45 });
  api.addCamBlock(-61, -43, -29.5, -12.5, 14.5);
  placeLabel(`🏯 ${LANG === "ko" ? "경회루 慶會樓" : "Gyeonghoeru"}`, -52, 17, -21);
  [[-63, -32], [-63, -10]].forEach(([x, z]) => {
    add(new THREE.CylinderGeometry(2, 2.2, 0.8, 16), mat("#7d8a5e"), x, 0.2, z);
    addTree(api, x, z, 0.9, "#2f5a3a");
  });

  /* --- 수정전 · 자선당 --- */
  hall(-50, 16, { w: 16, d: 6, h: 4, base: 0.9 });
  hall(51, -10, { w: 14, d: 7, h: 4, base: 0.9 });
  wall(38, 39, -24, 4);
  placeLabel(`🏯 ${LANG === "ko" ? "수정전 修政殿" : "Sujeongjeon"}`, -50, 11, 16);
  placeLabel(`🏯 ${LANG === "ko" ? "자선당 資善堂" : "Jaseondang"}`, 51, 11, -10);

  /* --- 향원정 --- */
  const cz = -114;
  add(new THREE.CylinderGeometry(9.5, 9.5, 0.5, 40), water, 0, -0.15, cz);
  add(new THREE.TorusGeometry(9.6, 0.35, 6, 40), stone, 0, 0.1, cz).rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(3.6, 3.8, 0.8, 24), mat("#7d8a5e"), 0, 0.2, cz);
  addFloor(-3.5, 3.5, cz - 3.5, cz + 3.5, 0.6);
  [[-9.5, 9.5, cz + 3.5, cz + 9.5], [-9.5, -1, cz - 9.5, cz - 3.5], [1, 9.5, cz - 9.5, cz - 3.5], [-9.5, -3.5, cz - 3.5, cz + 3.5], [3.5, 9.5, cz - 3.5, cz + 3.5]].forEach((c) => addCollider(...c, true));
  box(1.8, 0.35, 6.4, mat("#9c2f22"), 0, 0.45, cz - 6.6);
  addFloor(-1, 1, cz - 9.8, cz - 3.4, 0.55);
  for (let i = 0; i < 6; i++) {
    const t = (i / 6) * Math.PI * 2;
    add(new THREE.CylinderGeometry(0.16, 0.18, 4.4, 8), pillar, Math.cos(t) * 1.9, 2.8, cz + Math.sin(t) * 1.9);
  }
  add(new THREE.CylinderGeometry(2.3, 2.3, 0.35, 6), mat("#6b4a30"), 0, 2.6, cz);
  add(new THREE.CylinderGeometry(2.6, 2.6, 0.4, 6), beam, 0, 5.1, cz);
  const hx = add(new THREE.ConeGeometry(3.6, 2.2, 6), new THREE.MeshLambertMaterial({ map: tex.tile, side: THREE.DoubleSide }), 0, 6.4, cz);
  hx.scale.set(1, 1, 1);
  add(new THREE.SphereGeometry(0.3, 10, 8), mat("#2a2c33"), 0, 7.6, cz);
  placeLabel(`🏯 ${LANG === "ko" ? "향원정 香遠亭" : "Hyangwonjeong"}`, 0, 10, cz);

  /* --- 나무 --- */
  const treeSpots = [];
  for (let i = 0; i < 40; i++) treeSpots.push([-74 + rand() * 6, -120 + rand() * 180]);
  for (let i = 0; i < 40; i++) treeSpots.push([62 + rand() * 14, -120 + rand() * 100]);
  for (let i = 0; i < 18; i++) treeSpots.push([-30 + rand() * 60, -126 + rand() * 6]);
  for (let i = 0; i < 12; i++) treeSpots.push([-70 + rand() * 30, -45 + rand() * 6]);
  for (let i = 0; i < 70; i++) {
    const a = rand() * Math.PI * 2, r = 120 + rand() * 120;
    treeSpots.push([Math.cos(a) * r, -40 + Math.sin(a) * r * 0.8]);
  }
  treeSpots.forEach(([x, z], i) => {
    if (z > 66 && Math.abs(x) < 45) return;
    addTree(api, x, z, 0.9 + rand() * 0.9, i % 3 ? "#2f5a3a" : "#3d6b45", i % 4 !== 0);
  });

  /* --- 청사초롱 --- */
  const lanterns = [];
  [[-4, 21], [4, 21], [-38, -19], [-38, -27], [-2, -105], [2, -105]].forEach(([x, z]) => {
    box(0.08, 2.2, 0.08, mat("#3b2a20"), x, 1.1 + api.floorAt(x, z), z);
    const l = add(new THREE.CylinderGeometry(0.28, 0.28, 0.6, 12), new THREE.MeshLambertMaterial({ color: 0xb3262d, emissive: 0xff7a3a, emissiveIntensity: 0 }), x, 2.4 + api.floorAt(x, z), z);
    lanterns.push(l);
  });
  const lampLights = [[0, 19], [-40, -21], [0, -104]].map(([x, z]) => {
    const l = new THREE.PointLight(0xffa860, 0, 30);
    l.position.set(x, 4, z);
    scene.add(l);
    return l;
  });

  /* --- 사람들 --- */
  const roleName = P().roles[avatarData.role][0];
  const player = makeAvatar(palaceAvatarOpts(avatarData));
  api.setPlayer(player, 0, 100, Math.PI);
  addLabel(player.group, `<i>${w.me}</i>${esc(avatarData.name)} · ${roleName}`, "me", 2.7);

  const npc = (opts, x, z, face, item) => {
    const av = makeAvatar(opts);
    av.group.position.set(x, api.floorAt(x, z), z);
    av.group.rotation.y = face;
    scene.add(av.group);
    api.addNpcAvatar(av);
    addInteract(av.group, { av, ...item });
    return av;
  };
  const people = era.people;
  const R = PALACE_ROLES;
  const spots = [
    [{ ...R.king, ...pick(R.king) }, -3, -8.5, 0, "👑"],
    [{ ...R.military, ...pick(R.military) }, -6, 50, Math.PI / 2, "🐢"],
    [{ ...R.civil, robe: "#3f7a55", deco: "#d9a62e" }, -37, 0.5, Math.PI / 2, "⚙️"],
    [{ body: "dress", hat: "bun", robe: "#efe6cf", deco: "#2f5d8a", acc: true }, -11, -104, Math.PI / 2, "🖌️"],
    [{ ...R.king, robe: "#b3262d", deco: "#d9a62e" }, -4, -37.5, 0, "🏰"],
    [{ ...R.civil, robe: "#b3262d", deco: "#2f5d8a" }, -35, -12, Math.PI / 2, "📚"],
  ];
  people.forEach(([name, desc], i) => {
    const [opts, x, z, face, emoji] = spots[i];
    npc(opts, x, z, face, { kind: "npc", name, desc, emoji, labelHtml: `${emoji} ${name}`, labelCls: "npc", labelHeight: 2.7 });
  });
  [-4.5, 4.5].forEach((x) => npc({ ...R.military, robe: "#b3262d", deco: "#23305e", weapon: "spear" }, x, 79, 0, { kind: "talk", count: false, name: p.guard, emoji: "🛡️", say: p.guardSay, desc: p.guardDesc, labelHtml: `🛡️ ${p.guard}`, labelCls: "villager", labelHeight: 2.7 }));
  npc({ ...R.civil, robe: "#b3262d", deco: "#d9a62e" }, 9, 17, -Math.PI / 2, { kind: "quiz", name: p.examiner, emoji: "📝", say: p.examinerSay, labelHtml: `📝 ${p.examiner}${loadStamps()[era.id] ? " 🏮" : ""}`, labelCls: "quiz", labelHeight: 2.7 });

  [[R.courtlady, [-26, 26, -2, 20]], [R.eunuch, [-22, 22, 30, 52]], [R.courtlady, [-11, 11, -57, -52]], [R.eunuch, [-30, 30, -48, -38]], [{ ...R.courtlady, hat: "bun", robe: "#e39bb0", deco: "#23305e" }, [-28, 28, 60, 70]]].forEach(([r, area], i) => {
    const av = makeAvatar({ ...r, ...pick(r), scale: 0.9 });
    api.addWanderer(av, area, 1.4);
    addLabel(av.group, i % 2 ? p.eunuch : p.courtlady, "villager", 2.4);
  });

  places.forEach((_, i) => sign(i));

  /* --- 그림자 설정 --- */
  scene.traverse((o) => {
    if (!o.isMesh || o.material.transparent || o === sky || o === sunBall || o === moonBall) return;
    o.castShadow = true;
    o.receiveShadow = true;
  });

  /* --- 시간 표시와 하루의 변화 --- */
  const presets = [null, 5.2, 8, 12, 15.5, 18.4, 22];
  let presetIdx = 0;
  const chip = document.createElement("button");
  chip.className = "w-pill w-btn w-time";
  api.root.querySelector("#wRight").prepend(chip);
  chip.addEventListener("click", () => {
    presetIdx = (presetIdx + 1) % presets.length;
    applyTime();
    const ph = P().phases[phaseOf(currentHour())];
    api.toast(presets[presetIdx] === null ? P().realToast : P().timeToast(ph));
  });
  const currentHour = () => presets[presetIdx] ?? localHour();
  const dir = new THREE.Vector3();
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
    lattice.emissiveIntensity = s.night * 0.85;
    lanterns.forEach((l) => (l.material.emissiveIntensity = s.night * 1.4));
    lampLights.forEach((l) => (l.intensity = s.night * 1.3));
    const ph = phaseOf(h);
    const hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
    chip.innerHTML = `${PHASE_ICON[ph]} ${P().phases[ph]} <small>${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")} · ${presets[presetIdx] === null ? P().myTime : P().previewLabel}</small>`;
    // 해는 동쪽(+x)에서 떠서 서쪽(-x)으로 져요. 밤에는 달빛이 비춰요.
    const ang = ((h - 6) / 12) * Math.PI;
    dir.set(Math.cos(ang), Math.sin(ang), -0.35).normalize();
    const sunUp = dir.y > -0.05;
    sunBall.visible = sunUp;
    moonBall.visible = !sunUp || h < 6.5 || h > 18.5;
    applyTime.sunDir = dir.clone();
    applyTime.moonDir = new THREE.Vector3(-dir.x * 0.7, Math.max(0.35, -dir.y), -0.5).normalize();
    applyTime.lightDir = sunUp && dir.y > 0.08 ? applyTime.sunDir : applyTime.moonDir;
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
    sunBall.position.copy(cam).addScaledVector(applyTime.sunDir, 420);
    moonBall.position.copy(cam).addScaledVector(applyTime.moonDir, 420);
    sun.position.copy(pos).addScaledVector(applyTime.lightDir, 120);
    sun.target.position.copy(pos);
    lanterns.forEach((l, i) => (l.scale.y = 1 + Math.sin(time * 3 + i) * 0.03 * nightLevel));
  });
}

// 기와지붕: 용마루에서 처마로 오목하게 내려오고 네 귀퉁이(추녀)가 들려 올라가는 곡선
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
  return { lattice, tile, bakseok, irwol };
}
