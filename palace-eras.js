// 시대별 궁궐: 안내판 이야기 · 옷차림 · 사람 배치 · 건축
// 실제 궁궐(또는 궁궐 터)의 배치와 특징을 단순하게 살린 모형이에요. 고조선 왕검성처럼 기록이 거의 없는 곳은 상상 복원이라고 밝혀 두었어요.
const RED_TILE = "#d9805e";
const PALACES = {};

/* ===================== 고조선 · 왕검성 ===================== */
PALACES.gojoseon = {
  fires: [[2, -49], [25, 22]],
  costume: {
    patch: false,
    hats: { king: "crown", queen: "bun", prince: "topknot", princess: "princess", civil: "band", military: "helmet", courtlady: "bun", eunuch: "band" },
    colors: { king: ["#efe6cf", "#b3262d"], queen: ["#d9a62e", "#7a5a40"], prince: ["#8fc4ad", "#7a5a40"], princess: ["#e39bb0", "#efe6cf"], civil: ["#c9b38a", "#7a5a40"], military: ["#7a5a40", "#b3262d"], courtlady: ["#efe6cf", "#7a5a40"], eunuch: ["#a89878", "#5a3e2b"] },
  },
  ko: {
    place: "왕검성",
    greet: "왕검성에 온 것을 환영하오.",
    roleNames: { civil: "신하", military: "장수", eunuch: "시종" },
    guardSay: "멈추시오! …먼 훗날에서 온 손님이로군. 들어오시오.",
    guardDesc: "왕검성은 고조선의 마지막 도읍으로 기록된 곳이에요. 기원전 109년 한나라가 쳐들어오자 1년 가까이 버텼지만 기원전 108년에 무너졌어요.",
    examiner: "제사장",
    examinerSay: "하늘의 뜻을 아는지 시험해 보겠소. 4문제 중 3문제를 맞히면 도장을 주겠소.",
    signs: [
      ["wanggeom", "왕검성 王儉城", 7, 58, "고조선의 마지막 도읍으로 기록된 성이에요. 기원전 109년 한나라 무제가 쳐들어오자 우거왕과 백성들이 1년 가까이 버텼어요. 정확한 위치는 아직 학자마다 의견이 달라서, 이곳은 흙으로 쌓은 성벽(토성)과 나무 성문으로 상상해 복원했어요."],
      ["hall", "왕의 큰 집", 12, -12, "고조선 궁궐의 모습은 기록이 거의 남아 있지 않아요. 청동기 시대의 큰 집터를 바탕으로, 흙 기단 위에 나무 기둥을 세우고 풀(이엉)로 지붕을 덮은 모습으로 상상해 만들었어요."],
      ["altar", "제단 祭壇", 9, -44, "'단군왕검'의 '단군'은 하늘에 제사를 지내는 제사장을 뜻해요. 고조선의 임금은 나라를 다스리면서 하늘에 제사도 올렸어요."],
      ["sindansu", "신단수 神檀樹", 18, -52, "단군 신화에서 하늘의 아들 환웅이 무리 3천을 이끌고 내려온 곳이 태백산 꼭대기 신단수 아래였어요."],
      ["dolmen", "고인돌", -19, 16, "청동기 시대 지배자의 무덤이에요. 커다란 덮개돌을 옮기려면 많은 사람이 힘을 모아야 했으니, 그만큼 큰 힘을 가진 지배자가 있었다는 증거예요."],
      ["forge", "청동기 대장간", 31, 18, "구리와 주석을 녹여 비파형 동검, 거울, 방울 같은 청동기를 만들었어요. 청동기는 귀해서 지배자의 권위를 나타내는 물건이었어요."],
      ["pit", "움집", 30, -19, "땅을 파고 기둥을 세운 뒤 풀로 지붕을 덮은 집이에요. 청동기 시대에는 집이 점점 땅 위로 올라오고 넓어졌어요."],
      ["law", "8조법 이야기", -10, -9, "고조선에는 8개의 법이 있었는데 지금은 3개만 전해져요. 사람을 죽이면 사형, 다치게 하면 곡식으로 갚고, 도둑질하면 노비가 되었어요."],
    ],
  },
  en: {
    place: "Wanggeom-seong",
    greet: "Welcome to Wanggeom-seong.",
    roleNames: { civil: "Minister", military: "General" },
    guardSay: "Halt! …A guest from the distant future. Come in.",
    guardDesc: "Wanggeom-seong is recorded as Gojoseon's last capital. When the Han invaded in 109 BC it held out for nearly a year, but it fell in 108 BC.",
    examiner: "High Priest",
    examinerSay: "Let me test whether you know the will of heaven. Get 3 of 4 right and you'll earn my stamp.",
    signs: [
      ["wanggeom", "Wanggeom-seong Fortress", 7, 58, "Recorded as Gojoseon's last capital. When Emperor Wu of Han invaded in 109 BC, King Ugeo and his people held out for nearly a year. Its exact location is still debated, so this is an imagined reconstruction with earthen ramparts and a wooden gate."],
      ["hall", "Royal Hall (imagined)", 12, -12, "Almost nothing is recorded about Gojoseon's palace. Based on large Bronze Age house sites, it is imagined here as wooden pillars on an earthen platform under a thatched roof."],
      ["altar", "Sacrificial Altar", 9, -44, "The 'Dangun' in Dangun Wanggeom means a priest who made offerings to heaven. Gojoseon's ruler both governed and led rituals to heaven."],
      ["sindansu", "Sacred Sindansu Tree", 18, -52, "In the founding myth, Hwanung, son of heaven, descended with 3,000 followers beneath the sacred Sindansu tree atop Mount Taebaek."],
      ["dolmen", "Dolmens", -19, 16, "Tombs of Bronze Age chiefs. Moving the huge capstones took many people working together — proof of powerful rulers."],
      ["forge", "Bronze Workshop", 31, 18, "Copper and tin were melted to make lute-shaped daggers, mirrors and bells. Bronze was precious and showed a ruler's authority."],
      ["pit", "Pit Houses", 30, -19, "Homes dug into the ground with pillars and thatched roofs. In the Bronze Age, houses gradually rose above ground and grew larger."],
      ["law", "The Eight Prohibitions", -10, -9, "Gojoseon had eight laws, but only three survive: murder was punished by death, injury was repaid in grain, and thieves became slaves."],
    ],
  },
  spawn: [0, 66, Math.PI],
  bounds: [-43, 43, -66, 80],
  npcs: [[0, -41, 0, "king"], [-6, -8, 0, "military"], [-6, 44, 0, "king"]],
  guards: [[-5, 57, 0], [5, 57, 0]],
  examiner: [6, 2, 0],
  wanderers: [["courtlady", [-30, 30, -4, 40]], ["eunuch", [-30, 30, -4, 40]], ["civil", [10, 40, 0, 40]], ["military", [-40, -10, -40, 40]]],
  lamps: [[-4.5, 49, "torch"], [4.5, 49, "torch"], [-4, -36, "torch"], [4, -36, "torch"]],
  map: [[0, 0, 60], [1, 0, -10], [2, 0, -38], [4, -22, 26], [5, 26, 30], [6, 24, -8]],
  build(api, k) {
    const { box, cyl, mat, add } = k;
    k.ground("#7f8f5a", [-44, 44, -68, 52], "#a68d68");
    k.mountain(0, -220, 150, 80, "#4b6a48");
    k.mountain(-180, -160, 90, 50, "#557552");
    k.mountain(170, -200, 100, 55, "#4f6d4c");
    // 토성과 나무 성문
    k.earthWall(-46, -3.5, 51, 54);
    k.earthWall(3.5, 46, 51, 54);
    k.earthWall(-46, 46, -70, -67);
    k.earthWall(-46, -43, -70, 54);
    k.earthWall(43, 46, -70, 54);
    [-3.4, 3.4].forEach((x) => cyl(0.35, 0.4, 6, 8, mat("#5a3e2b"), x, 3, 52.5));
    box(8, 0.5, 1, mat("#5a3e2b"), 0, 5.6, 52.5);
    k.roof(9, 4.5, 1.6, 5.8, 0, 52.5, { thatch: true });
    // 성 밖의 밭
    for (let i = 0; i < 10; i++) [-1, 1].forEach((s) => box(30, 0.25, 1.4, mat(i % 2 ? "#6f8a3e" : "#8a9a4a"), s * 21, 0.12, 60 + i * 2.2));
    // 왕의 큰 집 (상상 복원)
    k.hall(0, -22, { w: 18, d: 9, h: 3.6, base: 1, thatch: true, wallMat: "earth", pillar: "#6b4a30", inside: "throne", name: LANG === "ko" ? "왕의 큰 집" : "Royal Hall" });
    k.placeLabel(LANG === "ko" ? "왕의 큰 집" : "Royal Hall", 0, 10, -22);
    [[-12.5, -16], [-13.5, -18.5], [-12, -20], [-14, -14.5]].forEach(([x, z]) => cyl(0.38, 0.25, 0.9, 10, mat("#a0704a"), x, 0.45, z)); // 민무늬토기
    // 3단 제단과 선돌, 불
    [[14, 1], [10, 2], [6, 3]].forEach(([s, h]) => {
      box(s, 1, s, mat(h === 3 ? "#a39a88" : "#8f887a"), 0, h - 0.5, -50);
      api.addFloor(-s / 2, s / 2, -50 - s / 2, -50 + s / 2, h);
    });
    box(1.2, 2.6, 0.6, k.darkStone, 0, 4.3, -51.8);
    api.addCollider(-0.6, 0.6, -52.1, -51.5);
    cyl(0.6, 0.4, 0.5, 10, mat("#6b4a30"), 2, 3.25, -49);
    const flames = [add(new THREE.ConeGeometry(0.4, 0.9, 8), new THREE.MeshBasicMaterial({ color: 0xff9a3c }), 2, 3.9, -49)];
    // 신단수
    k.tree(14, -56, 2.4, "#3d6b45", false);
    api.addCollider(13.3, 14.7, -56.7, -55.3);
    // 고인돌
    [[-22, 20], [-28, 10], [-16, 8]].forEach(([x, z]) => {
      [-0.8, 0.8].forEach((o) => box(0.5, 1.4, 1.2, k.darkStone, x + o, 0.7, z));
      box(3, 0.5, 2.2, k.stone, x, 1.65, z);
      api.addCollider(x - 1.5, x + 1.5, z - 1.1, z + 1.1);
    });
    // 청동기 대장간
    [[-3, -2], [3, -2], [-3, 2], [3, 2]].forEach(([dx, dz]) => cyl(0.15, 0.18, 3, 6, mat("#5a3e2b"), 26 + dx, 1.5, 22 + dz));
    k.roof(8, 6, 1.8, 3, 26, 22, { thatch: true });
    flames.push(add(new THREE.ConeGeometry(0.5, 1, 8), new THREE.MeshBasicMaterial({ color: 0xff8a3c }), 25, 0.5, 22));
    box(0.8, 0.6, 0.5, k.darkStone, 27.5, 0.3, 21.5);
    box(2.4, 1.2, 0.1, mat("#5a3e2b"), 26, 1.2, 24);
    for (let i = 0; i < 5; i++) box(0.08, 0.8, 0.04, mat("#c9a24a"), 25.1 + i * 0.45, 1.25, 24.07);
    api.addCollider(23, 29, 20, 24.2);
    // 움집
    [[24, -18], [34, -26], [26, -34], [36, -12]].forEach(([x, z]) => {
      add(new THREE.ConeGeometry(3, 4.2, 10), mat("#b8963f"), x, 2.1, z);
      box(1, 1.4, 0.3, mat("#2a1f1a"), x, 0.7, z + 2.4);
      api.addCollider(x - 2, x + 2, z - 2, z + 2);
    });
    api.onTick((dt, t) => flames.forEach((f, i) => f.scale.setScalar(1 + Math.sin(t * 9 + i * 2) * 0.08)));
    k.forest(70, (r) => {
      const a = r() * Math.PI * 2, d = 60 + r() * 90;
      return [Math.cos(a) * d, -10 + Math.sin(a) * d * 0.9];
    });
    k.forest(14, (r) => [-40 + r() * 20, -64 + r() * 20]);
  },
};

/* ===================== 삼국시대 · 고구려 안학궁 ===================== */
PALACES.threekingdoms = {
  costume: {
    patch: false,
    hats: { king: "crown", queen: "bun", prince: "feather", princess: "princess", civil: "feather", military: "helmet", courtlady: "bun", eunuch: "topknot" },
    colors: { king: ["#b3262d", "#d9a62e"], queen: ["#e39bb0", "#b3262d"], prince: ["#2f5d8a", "#d9a62e"], princess: ["#d9a62e", "#b3262d"], civil: ["#6b2f5f", "#d9a62e"], military: ["#4a4a52", "#b3262d"], courtlady: ["#efe6cf", "#b3262d"], eunuch: ["#a89878", "#5a3e2b"] },
  },
  ko: {
    place: "고구려 안학궁",
    greet: "세 나라의 사람들이 고구려 안학궁에 모였소.",
    roleNames: { prince: "태자", eunuch: "시종" },
    guardSay: "고구려 안학궁이오. 들어오시오!",
    guardDesc: "고구려는 427년 장수왕 때 국내성에서 평양으로 도읍을 옮겼어요. 안학궁은 그 뒤 평양 대성산 아래에 있던 궁궐로 알려져 있어요(지은 시기는 학자마다 의견이 달라요).",
    examiner: "태학 박사",
    examinerSay: "고구려는 372년 소수림왕 때 태학을 세워 인재를 길렀소. 실력을 보여 주시오!",
    signs: [
      ["anhak", "안학궁 安鶴宮", 9, 62, "고구려가 427년 평양으로 도읍을 옮긴 뒤 쓴 궁궐로 알려져 있어요. 한 변이 약 620m인 거의 정사각형 성벽 안에서 수십 곳의 건물터가 발견되었어요."],
      ["southgate", "남문 南門", -10, 62, "남쪽 성벽에는 문이 세 개 나란히 있었어요. 가운데 큰 문은 궁궐의 중심축과 곧게 이어져요."],
      ["oejeon", "외전 外殿", 20, 32, "남쪽에 있는 가장 큰 건물로, 나라의 큰 의식을 치르던 곳으로 보여요. 건물터의 길이가 80m가 넘을 만큼 컸어요."],
      ["redtile", "붉은 기와", -20, 32, "고구려 기와는 붉은 빛을 띠는 것이 많아요. 기와 끝(수막새)에는 연꽃무늬를 즐겨 새겼어요."],
      ["naejeon", "내전 內殿", 15, -4, "외전 뒤의 중심 건물이에요. 임금이 나랏일을 보던 곳으로 짐작돼요."],
      ["chimjeon", "침전 寢殿", 14, -38, "궁궐 북쪽, 임금과 왕비가 생활하던 공간이에요."],
      ["garden", "정원과 가산", 28, -8, "궁궐 동쪽에 연못을 파고 흙을 쌓아 작은 산(가산)을 만든 정원 터가 있어요."],
      ["mural", "고분 벽화 이야기", -8, -25, "고구려 사람들은 무덤 안에 사냥, 춤, 씨름 같은 생활 모습을 그렸어요. 무용총의 '수렵도'에는 말을 달리며 몸을 돌려 활을 쏘는 사냥꾼이 그려져 있어요."],
      ["daeseong", "대성산성 大城山城", -30, -60, "안학궁 뒤 대성산에 쌓은 산성이에요. 평소에는 평지의 궁궐에서 지내고, 적이 쳐들어오면 산성으로 들어가 싸웠어요."],
    ],
  },
  en: {
    place: "Anhakgung (Goguryeo)",
    greet: "People of the three kingdoms have gathered at Anhakgung.",
    guardSay: "This is Anhakgung of Goguryeo. Come in!",
    guardDesc: "Goguryeo moved its capital to Pyongyang in 427 under King Jangsu. Anhakgung is known as the palace below Mount Daeseong there (scholars debate when it was built).",
    examiner: "Taehak Scholar",
    examinerSay: "Goguryeo founded the Taehak academy in 372 under King Sosurim. Show me what you know!",
    signs: [
      ["anhak", "Anhakgung Palace", 9, 62, "Known as Goguryeo's palace after the move to Pyongyang in 427. Dozens of building sites were found inside nearly square walls about 620 m on each side."],
      ["southgate", "South Gates", -10, 62, "The south wall had three gates side by side. The large central gate lines up with the palace's main axis."],
      ["oejeon", "Outer Hall (Oejeon)", 20, 32, "The largest building, likely used for great state ceremonies. Its foundation is over 80 m long."],
      ["redtile", "Red Roof Tiles", -20, 32, "Many Goguryeo roof tiles have a reddish color, and their round end tiles often bear lotus patterns."],
      ["naejeon", "Inner Hall (Naejeon)", 15, -4, "The central building behind the outer hall, probably where the king handled state affairs."],
      ["chimjeon", "Sleeping Quarters", 14, -38, "In the north of the palace, where the king and queen lived."],
      ["garden", "Garden & Artificial Hill", 28, -8, "To the east is a garden site with a pond and a small man-made hill."],
      ["mural", "Tomb Murals", -8, -25, "Goguryeo people painted hunting, dancing and wrestling inside tombs. The 'Hunting Scene' of Muyongchong shows a rider turning back to shoot an arrow at full gallop."],
      ["daeseong", "Daeseong Mountain Fortress", -30, -60, "A fortress on the mountain behind the palace. People lived in the palace on the plain and retreated to the fortress when enemies came."],
    ],
  },
  spawn: [0, 72, Math.PI],
  bounds: [-55, 55, -76, 86],
  npcs: [[-4, 10, 0, "king"], [-18, 36, Math.PI / 2, "king"], [18, 36, -Math.PI / 2, "king"], [-8, 50, 0, "military"], [30, -4, -Math.PI / 2, "queen"], [-34, 4, Math.PI / 2, "military"]],
  guards: [[-6, 61, 0], [6, 61, 0]],
  examiner: [8, 40, 0],
  wanderers: [["courtlady", [-22, 22, 30, 42]], ["eunuch", [-20, 20, -4, 8]], ["courtlady", [-20, 20, -36, -24]], ["civil", [-44, -22, -30, 30]]],
  lamps: [[-5, 52], [5, 52], [28, -2], [-6, -2]],
  map: [[0, 0, 66], [2, 0, 36], [4, 0, -2], [5, 0, -34], [6, 28, 0], [7, -14, -22]],
  build(api, k) {
    const { mat } = k;
    const tint = RED_TILE;
    const wallOpt = { color: "#a59c88", cap: "#6b3a2e" };
    k.ground("#7a8a58", [-55, 55, -77, 55], "#b4a585");
    k.mountain(0, -190, 140, 95, "#3f5a3a");
    k.mountain(-170, -150, 90, 55, "#4b6a48");
    k.mountain(160, -170, 100, 60, "#4b6a48");
    [[-56, -21], [-15, -5], [5, 15], [21, 56]].forEach(([x1, x2]) => k.wall(x1, x2, 55, 57, wallOpt));
    k.wall(-56, 56, -79, -77, wallOpt);
    k.wall(-58, -56, -79, 57, wallOpt);
    k.wall(56, 58, -79, 57, wallOpt);
    k.hall(0, 56, { w: 10, d: 4, h: 4, base: 0.5, twoTier: true, walls: false, tint });
    [-18, 18].forEach((x) => k.hall(x, 56, { w: 6, d: 4, h: 3.4, base: 0.5, walls: false, tint }));
    k.corridor(-28, -5, 44, 48, { tint });
    k.corridor(5, 28, 44, 48, { tint });
    k.corridor(-28, -24, 8, 44, { tint });
    k.corridor(24, 28, 8, 44, { tint });
    const top = k.hall(0, 22, { w: 32, d: 12, h: 5.5, base: 1.6, tint, inside: "throne", name: LANG === "ko" ? "외전" : "Outer Hall" });
    k.placeLabel(LANG === "ko" ? "외전 外殿" : "Outer Hall", 0, top + 1, 22);
    k.hall(0, -14, { w: 24, d: 10, h: 5, base: 1.2, tint, inside: "office", name: LANG === "ko" ? "내전" : "Inner Hall" });
    k.placeLabel(LANG === "ko" ? "내전 內殿" : "Inner Hall", 0, 13, -14);
    k.hall(0, -46, { w: 20, d: 9, h: 4.5, base: 1, tint, inside: "bed", name: LANG === "ko" ? "침전" : "Sleeping Quarters" });
    k.placeLabel(LANG === "ko" ? "침전 寢殿" : "Sleeping Quarters", 0, 12, -46);
    k.hall(-38, -10, { w: 14, d: 8, h: 4, base: 1, tint, inside: "study", name: LANG === "ko" ? "서쪽 전각" : "West Hall" });
    // 동쪽 정원: 연못 · 섬 · 가산 · 정자
    k.pond([[30, 48, -36, -10], [34, 44, -40, -36]]);
    k.island(39, -22, 3);
    const hill = k.add(new THREE.ConeGeometry(7, 6, 14), mat("#5f7a4a"), 44, 3, -56);
    hill.scale.z = 0.8;
    api.addCollider(39, 49, -61, -51, true);
    k.hall(24, -24, { w: 6, d: 6, h: 3, base: 0.8, tint, name: LANG === "ko" ? "정원 정자" : "Garden Pavilion" });
    // 벽화를 그린 벽
    k.box(7, 3.4, 0.5, k.plaster, -14, 1.7, -30);
    const mural = k.add(new THREE.PlaneGeometry(6.6, 3), new THREE.MeshLambertMaterial({ map: k.tex.mural }), -14, 1.7, -29.74);
    mural.userData.noShadow = true;
    api.addCollider(-17.5, -10.5, -30.3, -29.7);
    k.forest(60, (r) => {
      const a = r() * Math.PI * 2, d = 70 + r() * 90;
      return [Math.cos(a) * d, -20 + Math.sin(a) * d * 0.9];
    });
    k.forest(12, (r) => [26 + r() * 26, -74 + r() * 10]);
  },
};

/* ===================== 통일신라 · 월성과 동궁·월지 ===================== */
PALACES.silla = {
  costume: {
    patch: false,
    hats: { king: "goldcrown", queen: "gache", prince: "topknot", princess: "princess", civil: "bokdu", military: "helmet", courtlady: "bun", eunuch: "topknot" },
    colors: { king: ["#6b2f5f", "#d9a62e"], queen: ["#b3262d", "#d9a62e"], prince: ["#2f5d8a", "#d9a62e"], princess: ["#e39bb0", "#3f7a55"], civil: ["#b3262d", "#2a2a30"], military: ["#4a4a52", "#b3262d"], courtlady: ["#3f7a55", "#efe6cf"], eunuch: ["#2f5d8a", "#efe6cf"] },
  },
  ko: {
    place: "월성과 동궁·월지",
    greet: "천년 왕국 신라의 궁궐에 온 것을 환영하오.",
    roleNames: { prince: "태자", eunuch: "시종" },
    guardSay: "이곳은 신라의 궁궐이 있는 월성이오.",
    guardDesc: "신라는 약 천 년 동안 서라벌(지금의 경주)을 도읍으로 삼았어요. 월성 안팎에 궁궐이, 동쪽에는 태자가 머무는 동궁과 아름다운 연못 월지가 있었어요.",
    examiner: "국학 박사",
    examinerSay: "신라는 682년 신문왕 때 국학을 세웠소. 배운 것을 보여 주시오!",
    signs: [
      ["wolseong", "월성 月城", -22, 20, "신라의 궁궐이 있던 성이에요. 생김새가 반달 같아서 '반월성'이라고도 불러요. 《삼국사기》에는 파사왕 때인 101년에 쌓았다고 적혀 있어요."],
      ["jeongjeon", "월성 안 궁궐", -20, -4, "월성 안에는 임금이 머물던 궁궐 건물들이 있었어요. 지금은 땅속에 건물터가 남아 있고, 발굴 조사가 이어지고 있어요."],
      ["wolji", "동궁과 월지 東宮과 月池", 30, 2, "문무왕 때인 674년 궁궐 안에 연못을 파고 산을 만들어 꽃과 나무를 심고 진귀한 새와 짐승을 길렀다고 해요. 연못에는 섬이 세 개 있어요. 조선 시대에는 '안압지'라고 불렸어요."],
      ["imhaejeon", "임해전 臨海殿", 4, -12, "동궁의 중심 건물로, 나라에 경사가 있거나 귀한 손님이 오면 잔치를 열었어요. 지금 연못가에는 건물 몇 채가 다시 지어져 있어요."],
      ["juryeonggu", "주령구 酒令具", 24, -44, "월지 바닥에서 나온 14면체 주사위예요. 면마다 '노래 없이 춤추기', '술 석 잔 한 번에 마시기' 같은 벌칙이 적혀 있어 신라 사람들의 잔치 놀이를 엿볼 수 있어요."],
      ["cheomseong", "첨성대 瞻星臺", -46, 30, "선덕여왕 때 세운 천문대로 알려져 있어요. 동양에서 가장 오래된 천문대 가운데 하나예요."],
      ["gyerim", "계림 鷄林", -38, 50, "경주 김씨의 시조 김알지가 금빛 상자 속에서 태어났다는 이야기가 전해지는 숲이에요."],
    ],
  },
  en: {
    place: "Wolseong & Wolji",
    greet: "Welcome to the palace of Silla, the thousand-year kingdom.",
    guardSay: "This is Wolseong, home of Silla's palace.",
    guardDesc: "Silla kept Seorabeol (today's Gyeongju) as its capital for about a thousand years. The palace stood in Wolseong, and to the east lay the crown prince's East Palace and the lovely Wolji pond.",
    examiner: "Gukhak Scholar",
    examinerSay: "Silla founded the Gukhak academy in 682 under King Sinmun. Show me what you've learned!",
    signs: [
      ["wolseong", "Wolseong Fortress", -22, 20, "The fortress that held Silla's palace, also called 'Half-moon Fortress' for its shape. The Samguk Sagi says it was built in 101 under King Pasa."],
      ["jeongjeon", "Palace inside Wolseong", -20, -4, "Royal buildings once stood inside Wolseong. Their foundations remain underground, and excavations are ongoing."],
      ["wolji", "Donggung Palace & Wolji Pond", 30, 2, "In 674, under King Munmu, a pond was dug and hills raised, with flowers, trees, and rare birds and animals. The pond has three islands. In Joseon it was called Anapji."],
      ["imhaejeon", "Imhaejeon Hall", 4, -12, "The main hall of the East Palace, used for banquets on happy occasions and for honored guests. Several pavilions have been rebuilt by the pond."],
      ["juryeonggu", "Juryeonggu Dice", 24, -44, "A 14-sided die found at the bottom of Wolji. Each face has a forfeit like 'dance without music' or 'drink three cups at once' — a glimpse of Silla party games."],
      ["cheomseong", "Cheomseongdae Observatory", -46, 30, "Known as an observatory built under Queen Seondeok — one of the oldest in East Asia."],
      ["gyerim", "Gyerim Forest", -38, 50, "The forest where Kim Al-ji, ancestor of the Gyeongju Kim clan, is said to have been found in a golden box."],
    ],
  },
  spawn: [0, 56, Math.PI],
  bounds: [-60, 62, -48, 64],
  npcs: [[21, -2, Math.PI / 2, "king"], [-24, 20, 0, "military"], [-42, 44, 0, "monk"], [40, 2, Math.PI, "military"], [-2, -12, 0, "civil"]],
  guards: [[-34, 19, 0], [-26, 19, 0]],
  examiner: [8, 12, 0],
  wanderers: [["courtlady", [2, 22, -2, 12]], ["eunuch", [-40, -20, -24, 6]], ["courtlady", [0, 12, -40, -30]], ["civil", [-20, 30, 14, 40]]],
  lamps: [[10, -2], [22, -2], [-34, 17], [-26, 17]],
  map: [[0, -30, 24], [1, -30, 0], [2, 30, 6], [3, 4, -8], [5, -46, 36], [6, -38, 54]],
  build(api, k) {
    const { mat, add, box } = k;
    k.ground("#7f8f5a", [-60, 62, -46, 40], "#b4a585");
    k.mountain(0, -200, 140, 70, "#4b6a48");
    k.mountain(-160, -120, 80, 45, "#557552");
    k.mountain(150, -160, 90, 50, "#4f6d4c");
    // 반달 모양 월성: 흙 성벽을 둥글게, 남쪽에 문
    const C = [-30, -10], R = 24;
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2;
      if (Math.abs(a - Math.PI / 2) < 0.28) continue; // 남쪽 문
      const x = C[0] + Math.cos(a) * R, z = C[1] + Math.sin(a) * R;
      const seg = box(5.6, 2.6, 3.6, mat("#8a7a52"), x, 1.3, z);
      seg.rotation.y = -a + Math.PI / 2;
      api.addCollider(x - 2.2, x + 2.2, z - 2.2, z + 2.2);
      if (i % 3 === 0) k.tree(C[0] + Math.cos(a) * (R + 0.2), C[1] + Math.sin(a) * (R + 0.2), 0.9, "#3d6b45", false);
    }
    k.hall(-30, -12, { w: 14, d: 8, h: 4.5, base: 1.2, inside: "throne", name: LANG === "ko" ? "월성 정전" : "Wolseong Hall" });
    k.placeLabel(LANG === "ko" ? "월성 月城" : "Wolseong", -30, 12, -12);
    k.hall(-30, -26, { w: 10, d: 6, h: 4, base: 1, inside: "bed", name: LANG === "ko" ? "월성 침전" : "Wolseong Quarters" });
    // 동궁과 월지
    k.pond([[26, 56, -40, -4], [22, 26, -30, -14]]);
    [[36, -12, 3], [46, -28, 2.6], [32, -30, 2]].forEach(([x, z, r]) => k.island(x, z, r));
    [[17, -8, 7, 6], [17, -22, 8, 7], [17, -36, 7, 6]].forEach(([x, z, w, d]) => k.hall(x, z, { w, d, h: 3.5, base: 1, inside: "banquet", name: LANG === "ko" ? "월지 누각" : "Wolji Pavilion" }));
    const top = k.hall(4, -22, { w: 12, d: 8, h: 4.5, base: 1.2, inside: "banquet", name: LANG === "ko" ? "임해전" : "Imhaejeon" });
    k.placeLabel(LANG === "ko" ? "임해전 臨海殿" : "Imhaejeon", 4, top + 1, -22);
    k.placeLabel(LANG === "ko" ? "월지 月池" : "Wolji Pond", 40, 6, -22);
    // 첨성대
    const pts = [[1.6, 0], [1.55, 1], [1.3, 2.4], [1.05, 3.6], [0.95, 4.6], [1, 5.2]].map(([x, y]) => new THREE.Vector2(x, y));
    add(new THREE.LatheGeometry(pts, 24), mat("#cdb88f"), -52, 0, 26);
    box(2.3, 0.3, 2.3, mat("#b8a27a"), -52, 5.35, 26);
    box(0.6, 0.6, 0.2, mat("#1a1208"), -52, 2.6, 27.1);
    api.addCollider(-53.8, -50.2, 24.2, 27.8);
    // 계림 숲
    k.forest(26, (r) => [-56 + r() * 22, 40 + r() * 16]);
    k.forest(60, (r) => {
      const a = r() * Math.PI * 2, d = 70 + r() * 90;
      return [Math.cos(a) * d, Math.sin(a) * d];
    });
  },
};

/* ===================== 고려 · 개경 만월대 ===================== */
PALACES.goryeo = {
  costume: {
    patch: false,
    hats: { king: "crown", queen: "gache", prince: "bokdu", princess: "princess", civil: "bokdu", military: "helmet", courtlady: "bun", eunuch: "naegwan" },
    colors: { king: ["#d9a62e", "#b3262d"], queen: ["#8fc4ad", "#b3262d"], prince: ["#6b2f5f", "#d9a62e"], princess: ["#e39bb0", "#8fc4ad"], civil: ["#6b2f5f", "#d9a62e"], military: ["#23305e", "#b3262d"], courtlady: ["#8fc4ad", "#23305e"], eunuch: ["#2a2a30", "#8fc4ad"] },
  },
  ko: {
    place: "개경 만월대",
    greet: "고려의 궁궐, 만월대에 온 것을 환영하오.",
    roleNames: { prince: "태자", eunuch: "내시" },
    guardSay: "이곳은 고려의 도읍 개경의 궁궐이오. 계단을 오를수록 임금의 자리에 가까워진다오.",
    guardDesc: "고려의 궁궐은 송악산 남쪽 비탈에 높은 축대를 여러 단 쌓고 지었어요. 문을 지날 때마다 땅이 높아져서, 가장 높은 곳의 정전은 아래에서 우러러보게 되어 있었어요.",
    examiner: "과거 시험관",
    examinerSay: "고려는 958년 광종 때 처음 과거를 실시했소. 실력을 보여 주시오!",
    signs: [
      ["manwoldae", "만월대 滿月臺", 8, 58, "고려의 궁궐터예요. 919년 태조 왕건이 송악산 남쪽 기슭에 궁궐을 지었어요. 비탈진 땅에 높은 축대를 쌓고 그 위에 건물을 올렸어요. 1361년 홍건적이 쳐들어왔을 때 불에 탔어요."],
      ["seungpyeong", "승평문 昇平門", -9, 54, "궁궐의 정문이에요. 이 문을 지나면 계단과 문이 차례로 이어져요."],
      ["sinbong", "신봉문 神鳳門", 9, 31, "정문을 지나 두 번째로 만나는 문이에요. 고려의 궁궐은 문을 하나 지날 때마다 땅이 한 단씩 높아져요."],
      ["changhap", "창합문 閶闔門", 8, 18, "정전인 회경전 마당으로 들어가는 문이에요."],
      ["hoegyeong", "회경전 會慶殿", 12, -8, "만월대의 정전으로, 나라의 큰 의식과 외국 사신 접견이 열렸어요. 높은 축대 위에 지어 아래에서 올려다보면 매우 웅장했어요."],
      ["stairs", "큰 돌계단", -8, -8, "회경전 앞에는 가파르고 높은 돌계단이 있어요. 신하들은 이 계단 아래 마당에서 임금을 우러러보았어요."],
      ["jangwha", "장화전 長和殿", 12, -40, "회경전 뒤, 한 단 더 높은 축대 위에 있던 건물이에요."],
      ["type", "금속활자 출토", -14, -40, "2015년 남북이 함께 만월대를 발굴하다가 고려 금속활자 한 점을 찾아냈어요. 고려가 금속활자의 나라였음을 보여 주는 유물이에요."],
      ["songak", "송악산 松嶽山", -20, -66, "개경(지금의 개성) 북쪽의 산이에요. 궁궐은 이 산을 등지고 남쪽을 바라보도록 지어졌어요."],
    ],
  },
  en: {
    place: "Manwoldae, Gaegyeong",
    greet: "Welcome to Manwoldae, the palace of Goryeo.",
    guardSay: "This is the palace of Gaegyeong, Goryeo's capital. The higher you climb, the closer you come to the throne.",
    guardDesc: "Goryeo's palace was built on tall terraces on the southern slope of Mount Songak. Each gate leads one level higher, so the throne hall at the top was seen from far below.",
    examiner: "Civil Exam Examiner",
    examinerSay: "Goryeo held its first civil service exam in 958 under King Gwangjong. Show me your skill!",
    signs: [
      ["manwoldae", "Manwoldae Palace Site", 8, 58, "The site of Goryeo's palace, built in 919 by King Taejo Wang Geon at the foot of Mount Songak. Halls stood on high stone terraces on the slope. It burned when the Red Turban rebels invaded in 1361."],
      ["seungpyeong", "Seungpyeongmun Gate", -9, 54, "The main gate. Beyond it, stairs and gates follow one after another."],
      ["sinbong", "Sinbongmun Gate", 9, 31, "The second gate. In Goryeo's palace, the ground rises one level at every gate."],
      ["changhap", "Changhapmun Gate", 8, 18, "The gate to the courtyard of Hoegyeongjeon, the throne hall."],
      ["hoegyeong", "Hoegyeongjeon Hall", 12, -8, "The throne hall, where great ceremonies and receptions for foreign envoys were held. Built on a high terrace, it looked majestic from below."],
      ["stairs", "The Grand Stairs", -8, -8, "Steep, tall stone stairs rise before Hoegyeongjeon. Officials gazed up at the king from the courtyard below."],
      ["jangwha", "Janghwajeon Hall", 12, -40, "A hall behind Hoegyeongjeon, one terrace higher."],
      ["type", "Metal Type Discovery", -14, -40, "In 2015, during a joint North–South Korean excavation of Manwoldae, a Goryeo metal type piece was found — evidence of Goryeo as a land of metal movable type."],
      ["songak", "Mount Songak", -20, -66, "The mountain north of Gaegyeong (today's Kaesong). The palace was built with its back to this mountain, facing south."],
    ],
  },
  spawn: [0, 64, Math.PI],
  bounds: [-46, 46, -72, 72],
  npcs: [[-3, -15, 0, "king"], [8, 0, 0, "king"], [-10, 24, 0, "civil"], [-8, 44, 0, "military"], [-8, -40, 0, "king"], [-12, 2, 0, "civil"]],
  guards: [[-5, 55, 0], [5, 55, 0]],
  examiner: [8, 22, 0],
  wanderers: [["courtlady", [-20, 20, -10, 6]], ["eunuch", [-30, 30, 20, 32]], ["courtlady", [-26, 26, -70, -56]], ["civil", [-40, 40, 38, 46]]],
  lamps: [[-4, 47], [4, 47], [-6, -4], [6, -4]],
  map: [[0, 0, 58], [2, 0, 24], [4, 0, 0], [6, 0, -36], [8, -20, -62]],
  build(api, k) {
    const { box, mat } = k;
    const terraceMat = mat("#a89f8c");
    k.ground("#7f8f5a", [-46, 46, -72, 50], "#b4a585");
    k.mountain(0, -150, 110, 95, "#556b4a");
    k.mountain(-130, -120, 80, 50, "#4b6a48");
    k.mountain(140, -130, 90, 55, "#4b6a48");
    k.wall(-48, -6, 49, 51);
    k.wall(6, 48, 49, 51);
    k.wall(-50, -48, -74, 51);
    k.wall(48, 50, -74, 51);
    k.wall(-50, 50, -76, -74);
    k.hall(0, 50, { w: 12, d: 4, h: 4.5, base: 0.5, twoTier: true, walls: false });
    // 계단식 축대: 문을 지날 때마다 한 단씩 높아져요
    const terrace = (x1, x2, z1, z2, y0, y1) => {
      box(x2 - x1, y1 - y0, z2 - z1, terraceMat, (x1 + x2) / 2, (y0 + y1) / 2, (z1 + z2) / 2);
      api.addFloor(x1, x2, z1, z2, y1);
    };
    const stairs = (zFrom, zTo, y0, y1, half = 4) => {
      const n = Math.max(2, Math.round(Math.abs(zTo - zFrom)));
      for (let i = 0; i < n; i++) {
        const za = zFrom + ((zTo - zFrom) * i) / n, zb = zFrom + ((zTo - zFrom) * (i + 1)) / n;
        const h = y0 + ((y1 - y0) * (i + 1)) / n;
        box(half * 2, h, Math.abs(zb - za), mat("#c2b9a6"), 0, h / 2, (za + zb) / 2);
        api.addFloor(-half, half, Math.min(za, zb), Math.max(za, zb), h);
      }
    };
    const edge = (x1, x2, z1, z2) => api.addCollider(x1, x2, z1, z2);
    terrace(-44, 44, -72, 34, 0, 2);
    stairs(38, 34, 0, 2);
    edge(-44, -4, 33.6, 34.4);
    edge(4, 44, 33.6, 34.4);
    edge(-44.4, -43.6, -72, 34);
    edge(43.6, 44.4, -72, 34);
    k.hall(0, 28, { w: 12, d: 4, h: 4, base: 2.4, walls: false });
    terrace(-38, 38, -72, 16, 2, 4);
    stairs(20, 16, 2, 4);
    edge(-38, -4, 15.6, 16.4);
    edge(4, 38, 15.6, 16.4);
    edge(-38.4, -37.6, -72, 16);
    edge(37.6, 38.4, -72, 16);
    k.hall(0, 12, { w: 10, d: 4, h: 4, base: 4.4, walls: false });
    k.corridor(-28, -5, 10, 14, { y0: 4 });
    k.corridor(5, 28, 10, 14, { y0: 4 });
    k.corridor(-28, -24, -14, 10, { y0: 4 });
    k.corridor(24, 28, -14, 10, { y0: 4 });
    // 회경전 축대와 큰 계단
    terrace(-18, 18, -32, -14, 4, 7.5);
    stairs(-6, -14, 4, 7.5, 5);
    edge(-18, -5, -14.4, -13.6);
    edge(5, 18, -14.4, -13.6);
    edge(-18.4, -17.6, -32, -14);
    edge(17.6, 18.4, -32, -14);
    const top = k.hall(0, -23, { w: 24, d: 11, h: 5.5, base: 8, platform: false, twoTier: true, inside: "throne", name: LANG === "ko" ? "회경전" : "Hoegyeongjeon" });
    box(27, 0.5, 14, k.stone, 0, 7.75, -23);
    k.placeLabel(LANG === "ko" ? "회경전 會慶殿" : "Hoegyeongjeon", 0, top + 1, -23);
    // 가장 높은 단: 장화전 · 원덕전
    terrace(-30, 30, -72, -34, 4, 9.5);
    api.addFloor(-18, 18, -34, -32, 8.5);
    edge(-30, -18, -34.4, -33.6);
    edge(18, 30, -34.4, -33.6);
    k.hall(0, -46, { w: 18, d: 8, h: 4.5, base: 10, platform: false, inside: "office", name: LANG === "ko" ? "장화전" : "Janghwajeon" });
    k.hall(0, -62, { w: 16, d: 8, h: 4.5, base: 10, platform: false, inside: "bed", name: LANG === "ko" ? "원덕전" : "Wondeokjeon" });
    k.hall(-22, -54, { w: 8, d: 6, h: 3.5, base: 10, platform: false, inside: "study", name: LANG === "ko" ? "서고" : "Library" });
    k.placeLabel(LANG === "ko" ? "장화전 長和殿" : "Janghwajeon", 0, 21, -46);
    k.forest(60, (r) => {
      const a = r() * Math.PI * 2, d = 60 + r() * 90;
      return [Math.cos(a) * d, -10 + Math.sin(a) * d * 0.9];
    });
  },
};

/* ===================== 조선 · 경복궁 ===================== */
PALACES.joseon = {
  costume: {
    hats: { king: "ikseon", queen: "gache", prince: "ikseon", princess: "princess", civil: "samo", military: "jeonrip", courtlady: "bun", eunuch: "naegwan" },
    colors: { king: ["#b3262d", "#d9a62e"], queen: ["#2f5d8a", "#b3262d"], prince: ["#23305e", "#d9a62e"], princess: ["#3f7a55", "#e39bb0"], civil: ["#2f5d8a", "#d9a62e"], military: ["#23305e", "#b3262d"], courtlady: ["#3f7a55", "#23305e"], eunuch: ["#2a2a30", "#8fc4ad"] },
  },
  quiz: {
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
  },
  ko: {
    place: "경복궁",
    greet: "경복궁에 온 것을 환영하오.",
    roleNames: { prince: "세자", courtlady: "상궁", eunuch: "내관" },
    roleDescs: {
      king: "붉은 곤룡포에 익선관을 쓰고, 근정전에서 나라의 큰 행사를 이끌어요.",
      queen: "어여머리를 얹고, 교태전에서 궁궐의 살림을 이끄는 중전이에요.",
      prince: "다음 왕이 될 왕세자. 동궁 자선당에서 공부해요.",
      princess: "왕과 왕비의 딸. 당의를 입고 댕기머리를 했어요.",
      civil: "사모를 쓰고 흉배를 단 단령 차림의 신하. 품계석 동쪽에 서요.",
      military: "전립을 쓰고 칼을 찬 무신. 품계석 서쪽에 서요.",
      courtlady: "궁궐 살림을 맡은 궁녀들의 우두머리예요.",
      eunuch: "왕의 곁에서 시중을 들고 궁궐 일을 맡아요.",
    },
    examiner: "과거 시험관",
    examinerSay: "과거 시험을 보러 왔는가? 경복궁에 대해 4문제 중 3문제를 맞히면 합격이오!",
    guardSay: "멈추시오! …아, 손님이시군요. 경복궁에 잘 오셨소.",
    guardDesc: "경복궁은 1395년 태조 이성계가 세운 조선의 법궁(으뜸 궁궐)이에요. 정도전이 '큰 복을 누리라'는 뜻으로 이름을 지었어요. 임진왜란 때 불탄 뒤 270여 년 동안 빈터로 남았다가 고종 때 흥선대원군이 다시 지었어요. 지금도 광화문에서는 수문장 교대 의식을 재현하고 있어요.",
    signs: [
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
  },
  en: {
    place: "Gyeongbokgung Palace",
    greet: "Welcome to Gyeongbokgung.",
    roleNames: { prince: "Crown Prince", civil: "Civil Minister", military: "Military Officer", courtlady: "Head Court Lady", eunuch: "Royal Attendant" },
    roleDescs: {
      king: "Wears the red dragon robe and ikseongwan cap, leading state ceremonies at Geunjeongjeon.",
      queen: "Wears the grand eoyeo-meori hairstyle and runs palace life from Gyotaejeon.",
      prince: "The future king, studying at Jaseondang in the East Palace.",
      princess: "Daughter of the king and queen, in a dang-ui jacket with a braided ribbon.",
      civil: "A scholar-official in a samo hat and rank badge, standing on the east side of the court.",
      military: "A general in a jeollip hat with a sword, standing on the west side of the court.",
      courtlady: "Leader of the court ladies who ran the palace household.",
      eunuch: "Served at the king's side and handled palace affairs.",
    },
    examiner: "Civil Exam Examiner",
    examinerSay: "Here for the state exam? Answer 3 of 4 questions about Gyeongbokgung correctly and you pass!",
    guardSay: "Halt! …Ah, a guest. Welcome to Gyeongbokgung.",
    guardDesc: "Gyeongbokgung was founded in 1395 by King Taejo as Joseon's main royal palace. Jeong Do-jeon named it \"palace greatly blessed by heaven.\" It burned in the Imjin War and lay in ruins for about 270 years until Heungseon Daewongun rebuilt it under King Gojong. A reenactment of the royal guard-changing ceremony is still held at Gwanghwamun.",
    signs: [
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
  },
  spawn: [0, 100, Math.PI],
  bounds: [-78, 78, -126, 110],
  npcs: [[-3, -8.5, 0, "king"], [-6, 50, Math.PI / 2, "military"], [-37, 0.5, Math.PI / 2, "civil"], [-11, -104, Math.PI / 2, "courtlady"], [-4, -37.5, 0, "king"], [-35, -12, Math.PI / 2, "civil"]],
  guards: [[-4.5, 79, 0], [4.5, 79, 0]],
  examiner: [9, 17, -Math.PI / 2],
  wanderers: [["courtlady", [-26, 26, -2, 20]], ["eunuch", [-22, 22, 30, 52]], ["courtlady", [-11, 11, -57, -52]], ["eunuch", [-30, 30, -48, -38]], ["courtlady", [-28, 28, 60, 70]]],
  lamps: [[-4, 21], [4, 21], [-38, -19], [-38, -27], [-2, -105], [2, -105]],
  map: [[0, 0, 86], [3, 0, 52], [6, 0, 4], [8, 0, -36], [9, 0, -53], [10, 0, -71], [12, -52, -2], [14, 12, -102], [15, 41, 2]],
  build(api, k) {
    const { box, flat, hall, corridor, wall, roof, stone, darkStone, pillar, beam, water, mat, add, placeLabel, tex, rand } = k;
    const { scene, addCollider, addFloor } = api;
    k.ground("#8f9a6e", null);
    flat(160, 200, mat("#b4a585"), 0, 0, -28);
    flat(84, 40, mat("#8e8a80"), 0, 0.005, 92);
    [[0, -330, 150, 95, "#3f5a3a"], [-210, -250, 110, 62, "#486446"], [200, -290, 100, 50, "#4b6a48"], [-120, -380, 120, 70, "#3a5236"]].forEach(([x, z, r, h, c]) => k.mountain(x, z, r, h, c));
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
    placeLabel(`${LANG === "ko" ? "광화문 光化門" : "Gwanghwamun"}`, 0, 22, 72);
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
    placeLabel(`${LANG === "ko" ? "흥례문 興禮門" : "Heungnyemun"}`, 0, 16, 56);

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
    const gTop = hall(0, -17, { w: 22, d: 13, h: 6, base: 2.4, twoTier: true, open: true, inside: "custom", name: LANG === "ko" ? "근정전" : "Geunjeongjeon" });
    box(22, 0.3, 13, mat("#7a5c40"), 0, 2.55, -17);
    addFloor(-11, 11, -23.5, -10.5, 2.7);
    box(4.4, 0.8, 3, mat("#8e2f25"), 0, 3.1, -21.3);
    box(1.6, 1.5, 1, mat("#b3262d"), 0, 4.2, -21.6);
    const screen = add(new THREE.PlaneGeometry(6.4, 3.6), new THREE.MeshBasicMaterial({ map: tex.irwol }), 0, 4.9, -22.6);
    placeLabel(`${LANG === "ko" ? "근정전 勤政殿" : "Geunjeongjeon"}`, 0, gTop + 1, -17);
    void screen;

    /* --- 사정전 · 강녕전 · 교태전 · 아미산 --- */
    hall(0, -44, { w: 16, d: 9, h: 4.5, base: 1.1, inside: "office", name: LANG === "ko" ? "사정전" : "Sajeongjeon" });
    placeLabel(`${LANG === "ko" ? "사정전 思政殿" : "Sajeongjeon"}`, 0, 12, -44);
    wall(-34, -12, -51, -50);
    wall(12, 34, -51, -50);
    box(22, 1.4, 5, stone, 0, 0.7, -58.5);
    addFloor(-11, 11, -61, -56, 1.4);
    hall(0, -66, { w: 22, d: 9, h: 4.5, base: 1.4, noRidge: true, inside: "bed", name: LANG === "ko" ? "강녕전" : "Gangnyeongjeon" });
    placeLabel(`${LANG === "ko" ? "강녕전 康寧殿" : "Gangnyeongjeon"}`, 0, 12, -66);
    wall(-30, -14, -75, -74);
    wall(14, 30, -75, -74);
    hall(0, -82, { w: 20, d: 9, h: 4.5, base: 1.2, noRidge: true, inside: "bed", deco: "#2f5d8a", name: LANG === "ko" ? "교태전" : "Gyotaejeon" });
    placeLabel(`${LANG === "ko" ? "교태전 交泰殿" : "Gyotaejeon"}`, 0, 12, -82);
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
    placeLabel(`${LANG === "ko" ? "경회루 慶會樓" : "Gyeonghoeru"}`, -52, 17, -21);
    [[-63, -32], [-63, -10]].forEach(([x, z]) => {
      add(new THREE.CylinderGeometry(2, 2.2, 0.8, 16), mat("#7d8a5e"), x, 0.2, z);
      addTree(api, x, z, 0.9, "#2f5a3a");
    });

    /* --- 수정전 · 자선당 --- */
    hall(-50, 16, { w: 16, d: 6, h: 4, base: 0.9, inside: "study", name: LANG === "ko" ? "수정전" : "Sujeongjeon" });
    hall(51, -10, { w: 14, d: 7, h: 4, base: 0.9, inside: "study", name: LANG === "ko" ? "자선당" : "Jaseondang" });
    wall(38, 39, -24, 4);
    placeLabel(`${LANG === "ko" ? "수정전 修政殿" : "Sujeongjeon"}`, -50, 11, 16);
    placeLabel(`${LANG === "ko" ? "자선당 資善堂" : "Jaseondang"}`, 51, 11, -10);

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
    placeLabel(`${LANG === "ko" ? "향원정 香遠亭" : "Hyangwonjeong"}`, 0, 10, cz);

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
  },
};

/* ===================== 대한제국 · 덕수궁 ===================== */
PALACES["korean-empire"] = {
  costume: {
    hats: { king: "ikseon", queen: "gache", prince: "ikseon", princess: "princess", civil: "western", military: "western", courtlady: "bun", eunuch: "naegwan" },
    colors: { king: ["#d9a62e", "#b3262d"], queen: ["#2f5d8a", "#b3262d"], prince: ["#b3262d", "#d9a62e"], princess: ["#e39bb0", "#3f7a55"], civil: ["#23305e", "#d9a62e"], military: ["#2a2a30", "#b3262d"], courtlady: ["#3f7a55", "#23305e"], eunuch: ["#2a2a30", "#8fc4ad"] },
  },
  ko: {
    place: "덕수궁",
    greet: "대한제국의 황궁, 덕수궁에 온 것을 환영하오.",
    roleNames: { king: "황제", queen: "황후", prince: "황태자", princess: "황녀", civil: "대신", military: "장교", courtlady: "상궁", eunuch: "내관" },
    roleDescs: {
      king: "누런 황룡포를 입은 대한제국의 황제예요. 1897년 고종이 황제 자리에 올랐어요.",
      civil: "서양식 대례복을 입은 대한제국의 대신이에요.",
      military: "서양식 군복을 입은 대한제국 군대의 장교예요.",
    },
    guardSay: "대한제국 황궁 경운궁이오. 들어오시오!",
    guardDesc: "덕수궁은 대한제국 때 '경운궁'이라 불린 황궁이에요. 1897년 고종은 이곳에 머물며 대한제국을 선포했어요. 1907년 고종이 물러난 뒤 '덕수궁'으로 이름이 바뀌었어요.",
    examiner: "신식 학교 선생님",
    examinerSay: "새 시대에는 새 학문이 필요하오! 대한제국에 대해 얼마나 아는지 봅시다.",
    signs: [
      ["daehanmun", "대한문 大漢門", 58, 8, "덕수궁의 정문이에요. 원래 이름은 대안문이었는데 1906년 '대한문'으로 바뀌었어요. 동쪽을 바라보고 있어 지금의 서울광장과 마주해요."],
      ["junghwajeon", "중화전 中和殿", 18, -2, "대한제국의 정전이에요. 1902년 2층 건물로 지었지만 1904년 큰불로 타서 1906년 지금처럼 단층으로 다시 지었어요. 황제를 상징하는 용무늬로 꾸며져 있어요."],
      ["pumgye", "품계석", 2, 8, "경복궁처럼 신하들이 벼슬 순서대로 서던 돌이에요."],
      ["seokjojeon", "석조전 石造殿", -14, 24, "1900년에 짓기 시작해 1910년에 완공된 서양식 돌 건물이에요. 그리스·로마 신전처럼 기둥을 세운 신고전주의 양식으로, 황제가 생활하고 손님을 맞기 위해 지었어요."],
      ["fountain", "분수 정원", -40, 32, "석조전 앞의 서양식 정원과 분수예요. 지금 모습의 분수 정원은 일제강점기에 만들어졌어요."],
      ["jeonggwanheon", "정관헌 靜觀軒", 21, -44, "서양식 기둥과 전통 지붕이 어우러진 건물이에요. 고종이 이곳에서 손님을 맞고 커피를 즐겼다고 전해져요."],
      ["hamnyeong", "함녕전 咸寧殿", 44, -26, "고종이 잠을 자고 생활하던 침전이에요. 고종은 1919년 이곳에서 세상을 떠났어요."],
      ["seogeodang", "석어당 昔御堂", -18, -28, "덕수궁에서 보기 드문 2층 목조 건물로, 단청을 칠하지 않아 소박해요. 임진왜란 뒤 선조가 머물던 곳이에요."],
      ["jungmyeong", "중명전 重明殿", -56, -12, "덕수궁 서쪽의 서양식 2층 벽돌 건물이에요. 1905년 을사늑약이 이곳에서 강제로 체결되었어요."],
      ["tram", "전차와 전등", 64, -12, "1899년 서울에 전차가 다니기 시작했어요. 궁궐에는 그보다 앞선 1887년 경복궁 건청궁에 처음 전등이 켜졌어요."],
    ],
  },
  en: {
    place: "Deoksugung Palace",
    greet: "Welcome to Deoksugung, the imperial palace of the Korean Empire.",
    roleNames: { king: "Emperor", queen: "Empress", prince: "Crown Prince", princess: "Princess", civil: "Minister", military: "Officer" },
    roleDescs: {
      king: "The Emperor of Korea in a yellow dragon robe. Gojong took the imperial throne in 1897.",
      civil: "An imperial minister in a Western-style ceremonial uniform.",
      military: "An officer of the Korean Imperial Army in a Western-style uniform.",
    },
    guardSay: "This is Gyeongun Palace, home of the Emperor. Come in!",
    guardDesc: "During the Korean Empire, Deoksugung was called Gyeongun Palace. Gojong lived here when he proclaimed the Empire in 1897. It was renamed Deoksugung after he was forced to abdicate in 1907.",
    examiner: "Modern School Teacher",
    examinerSay: "A new age needs new learning! Let's see how much you know about the Korean Empire.",
    signs: [
      ["daehanmun", "Daehanmun Gate", 58, 8, "The main gate of Deoksugung. Originally called Daeanmun, it was renamed Daehanmun in 1906. It faces east, toward today's Seoul Plaza."],
      ["junghwajeon", "Junghwajeon Hall", 18, -2, "The Empire's throne hall. Built with two stories in 1902, it burned in a great fire in 1904 and was rebuilt as a single story in 1906. Dragon motifs mark it as an emperor's hall."],
      ["pumgye", "Rank Stones", 2, 8, "As at Gyeongbokgung, officials lined up by rank at these stones."],
      ["seokjojeon", "Seokjojeon Hall", -14, 24, "A Western-style stone building begun in 1900 and completed in 1910. Its neoclassical columns recall Greek and Roman temples; it was built for the emperor to live in and receive guests."],
      ["fountain", "Fountain Garden", -40, 32, "A Western-style garden and fountain before Seokjojeon. The fountain garden in its current form was made during the Japanese occupation."],
      ["jeonggwanheon", "Jeonggwanheon Pavilion", 21, -44, "A blend of Western columns and a traditional roof. Gojong is said to have received guests and enjoyed coffee here."],
      ["hamnyeong", "Hamnyeongjeon Hall", 44, -26, "Gojong's living quarters, where he passed away in 1919."],
      ["seogeodang", "Seogeodang Hall", -18, -28, "A rare two-story wooden building at Deoksugung, left unpainted for a simple look. King Seonjo stayed here after the Imjin War."],
      ["jungmyeong", "Jungmyeongjeon Hall", -56, -12, "A two-story Western brick building west of the palace, where the Eulsa Treaty was forced on Korea in 1905."],
      ["tram", "Streetcars & Electric Lights", 64, -12, "Seoul's streetcar began running in 1899. Even earlier, in 1887, electric lights were first lit in a palace at Geoncheonggung in Gyeongbokgung."],
    ],
  },
  spawn: [64, 0, -Math.PI / 2],
  camYaw: Math.PI / 2,
  bounds: [-76, 82, -56, 46],
  npcs: [[16, -34, 0, "king"], [30, -17, 0, "prince"], [-60, -4, 0, "civil"], [40, 8, Math.PI / 2, "civil"], [-16, 34, 0, "civil"]],
  guards: [[56, -5, Math.PI / 2], [56, 5, Math.PI / 2]],
  examiner: [28, 22, 0],
  wanderers: [["courtlady", [26, 46, -14, 20]], ["eunuch", [-44, -10, -30, -4]], ["civil", [-46, -10, 26, 42]], ["military", [54, 78, -30, 30]]],
  lamps: [[58, -10, "electric"], [58, 10, "electric"], [-20, 30, "electric"], [30, 10, "electric"]],
  map: [[0, 62, 0], [1, 8, 26], [3, -28, 44], [5, 12, -30], [6, 32, -12], [7, -10, -28], [8, -62, -6], [9, 66, -12]],
  build(api, k) {
    const { box, cyl, mat, add } = k;
    k.ground("#7f8f5a", [-50, 50, -56, 46], "#b4a585");
    k.flat(32, 150, mat("#6f6a62"), 66, 0.01, 0);
    [69.5, 71.5].forEach((x) => box(0.15, 0.08, 150, mat("#3a3a3a"), x, 0.05, 0));
    k.mountain(-40, -220, 120, 70, "#4b6a48");
    k.mountain(120, -200, 90, 50, "#557552");
    // 담장과 대한문(동쪽), 서쪽 문
    k.wall(49, 51, -56, -4);
    k.wall(49, 51, 4, 46);
    k.wall(-50, 50, -57, -55);
    k.wall(-50, 50, 45, 47);
    k.wall(-51, -49, -56, -23);
    k.wall(-51, -49, -17, 46);
    k.hall(50, 0, { w: 4, d: 10, h: 4.2, base: 0.5, walls: false, rotate: true });
    k.placeLabel(LANG === "ko" ? "대한문 大漢門" : "Daehanmun", 50, 11, 0);
    // 금천교
    k.pond([[43, 45, -20, -3], [43, 45, 3, 20]]);
    box(3, 0.4, 6, k.stone, 44, 0.2, 0);
    api.addFloor(42.5, 45.5, -3, 3, 0.3);
    // 중화문 · 중화전 · 품계석
    k.hall(8, 18, { w: 10, d: 4, h: 4, base: 0.6, walls: false });
    k.wall(-6, 22, -27, -25);
    k.wall(-7, -5, -27, 20);
    k.wall(21, 23, -27, 20);
    k.wall(-7, 3, 19, 21);
    k.wall(13, 23, 19, 21);
    const top = k.hall(8, -14, { w: 18, d: 10, h: 5, base: 1.6, inside: "throne", irwol: true, name: LANG === "ko" ? "중화전" : "Junghwajeon" });
    k.placeLabel(LANG === "ko" ? "중화전 中和殿" : "Junghwajeon", 8, top + 1, -14);
    for (let i = 0; i < 8; i++) [4, 12].forEach((x) => box(0.45, 0.7, 0.3, k.darkStone, x, 0.35, 14 - i * 1.6));
    // 석조전 (서양식 신고전주의)
    western(api, k, -28, 12, { w: 22, d: 12, h: 8, color: "#ece7da", columns: 8, roof: "#5f6a6a", inside: "parlor", name: LANG === "ko" ? "석조전" : "Seokjojeon" });
    k.placeLabel(LANG === "ko" ? "석조전 石造殿" : "Seokjojeon", -28, 15, 12);
    // 분수 정원
    cyl(6, 6, 0.6, 32, k.water, -28, 0.05, 34);
    const ring = add(new THREE.TorusGeometry(6.1, 0.3, 6, 40), k.stone, -28, 0.35, 34);
    ring.rotation.x = Math.PI / 2;
    cyl(0.5, 0.8, 1.6, 12, k.stone, -28, 0.8, 34);
    const spray = add(new THREE.ConeGeometry(0.7, 2.2, 12, 1, true), new THREE.MeshLambertMaterial({ color: 0xe6f2ff, transparent: true, opacity: 0.6 }), -28, 2.6, 34);
    spray.rotation.x = Math.PI;
    api.addCollider(-34, -22, 28, 40, true);
    api.onTick((dt, t) => spray.scale.set(1, 1 + Math.sin(t * 4) * 0.05, 1));
    // 정관헌
    box(12, 0.8, 9, k.stone, 12, 0.4, -40);
    api.addFloor(6, 18, -44.5, -35.5, 0.8);
    for (let i = 0; i <= 5; i++) [-4.2, 4.2].forEach((dz) => cyl(0.15, 0.17, 3.4, 10, mat("#e8e2d6"), 6.6 + i * 2.16, 2.5, -40 + dz));
    [-5.4, 5.4].forEach((dx) => [-2.1, 0, 2.1].forEach((dz) => cyl(0.15, 0.17, 3.4, 10, mat("#e8e2d6"), 12 + dx, 2.5, -40 + dz)));
    box(11.2, 0.6, 0.2, mat("#3f7a55"), 12, 1.2, -35.8);
    box(9, 2.6, 0.3, k.lattice, 12, 2.1, -43.5);
    box(12.6, 0.4, 9.4, mat("#7a5a3a"), 12, 4.3, -40);
    k.roof(15, 12, 2.4, 4.5, 12, -40, { noRidge: true });
    api.addCollider(6, 18, -44, -43);
    // 함녕전 · 석어당(단청 없는 2층) · 즉조당
    k.hall(32, -24, { w: 16, d: 8, h: 4.5, base: 1, inside: "bed", name: LANG === "ko" ? "함녕전" : "Hamnyeongjeon" });
    k.hall(-10, -38, { w: 14, d: 8, h: 4, base: 1, twoTier: true, pillar: "#7a5a3a", beam: "#7a5a3a", inside: "study", name: LANG === "ko" ? "석어당" : "Seogeodang" });
    k.hall(-28, -38, { w: 12, d: 7, h: 4, base: 1, inside: "office", name: LANG === "ko" ? "즉조당" : "Jeukjodang" });
    // 중명전 (서쪽 담 밖의 벽돌 건물)
    western(api, k, -64, -20, { w: 14, d: 9, h: 7, color: "#9a4a3a", columns: 0, roof: "#3a3d44", arcade: true, inside: "office", name: LANG === "ko" ? "중명전" : "Jungmyeongjeon" });
    // 전차와 가로등
    const tram = new THREE.Group();
    tram.position.set(70.5, 0, -22);
    box(2, 2.2, 6, mat("#a33a2e"), 0, 1.5, 0, tram);
    box(2.05, 0.7, 5.6, k.windows, 0, 1.9, 0, tram);
    box(2.2, 0.2, 6.2, mat("#efe6cf"), 0, 2.7, 0, tram);
    cyl(0.03, 0.03, 2, 4, mat("#2a2a2a"), 0, 3.7, 0, tram);
    k.scene.add(tram);
    api.addCollider(69.3, 71.7, -25.2, -18.8);
    let dirZ = 1;
    api.onTick((dt) => {
      tram.position.z += dirZ * dt * 2.5;
      if (tram.position.z > 60 || tram.position.z < -60) dirZ *= -1;
    });
    k.forest(50, (r) => {
      const a = r() * Math.PI * 2, d = 70 + r() * 80;
      return [Math.cos(a) * d - 10, Math.sin(a) * d];
    });
    k.forest(14, (r) => [-46 + r() * 30, -54 + r() * 10]);
  },
};

// 서양식 건물: 석조전(돌기둥과 박공) · 중명전(벽돌, 아케이드)
function western(api, k, x, z, o) {
  const { box, cyl, mat, add } = k;
  const { w, d, h } = o;
  box(w + 2, 1.6, d + 2, mat("#c9c3b4"), x, 0.8, z);
  api.addFloor(x - w / 2 - 1, x + w / 2 + 1, z - d / 2 - 1, z + d / 2 + 1, 1.6);
  // 벽 네 면(앞쪽 가운데 출입문)과 실내
  const wallM = mat(o.color);
  const piece = (x1, x2, z1, z2) => {
    box(x2 - x1, h, z2 - z1, wallM, (x1 + x2) / 2, 1.6 + h / 2, (z1 + z2) / 2);
    api.addCollider(x1, x2, z1, z2);
  };
  const g = 1.6;
  piece(x - w / 2, x + w / 2, z - d / 2, z - d / 2 + 0.4);
  piece(x - w / 2, x - w / 2 + 0.4, z - d / 2, z + d / 2);
  piece(x + w / 2 - 0.4, x + w / 2, z - d / 2, z + d / 2);
  piece(x - w / 2, x - g, z + d / 2 - 0.4, z + d / 2);
  piece(x + g, x + w / 2, z + d / 2 - 0.4, z + d / 2);
  k.furnish(o.inside || "parlor", x, z, w - 0.8, d - 0.8, 1.6);
  const block = api.addCamBlock(x - w / 2 - 1, x + w / 2 + 1, z - d / 2 - 1, z + d / 2 + 1, h + 4);
  const partsFrom = k.scene.children.length;
  // 창문 두 줄 (밤에 불빛)
  const n = Math.floor(w / 2.6);
  [0.3, 0.68].forEach((f) => {
    for (let i = 0; i < n; i++) box(1.1, 1.6, 0.1, k.windows, x - w / 2 + (w / n) * (i + 0.5), 1.6 + h * f, z + d / 2 + 0.05);
  });
  if (o.arcade) for (let i = 0; i < n; i++) box(1.6, 0.25, 0.3, mat("#efe6cf"), x - w / 2 + (w / n) * (i + 0.5), 1.6 + h * 0.48, z + d / 2 + 0.2);
  if (o.columns) {
    // 이오니아식 기둥 + 박공(삼각 지붕)
    const cw = w * 0.7;
    for (let i = 0; i < o.columns; i++) {
      const cx = x - cw / 2 + (cw * i) / (o.columns - 1);
      cyl(0.42, 0.48, h - 0.6, 14, mat("#f4f0e6"), cx, 1.6 + (h - 0.6) / 2, z + d / 2 + 1.4);
      box(1.1, 0.3, 1.1, mat("#f4f0e6"), cx, 1.6 + h - 0.45, z + d / 2 + 1.4);
    }
    box(cw + 2, 0.7, 2.2, mat("#f4f0e6"), x, 1.6 + h, z + d / 2 + 1.2);
    const shape = new THREE.Shape();
    shape.moveTo(-(cw + 2) / 2, 0);
    shape.lineTo((cw + 2) / 2, 0);
    shape.lineTo(0, 2.4);
    shape.lineTo(-(cw + 2) / 2, 0);
    add(new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: false }), mat("#efe9dc"), x, 1.6 + h + 0.35, z + d / 2 + 0.2);
  }
  box(w + 0.8, 0.6, d + 0.8, mat("#d8d2c4"), x, 1.6 + h + 0.2, z);
  const r = add(new THREE.ConeGeometry(Math.max(w, d) * 0.62, 2.6, 4), mat(o.roof), x, 1.6 + h + 1.8, z);
  r.rotation.y = Math.PI / 4;
  r.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d));
  api.addRoom({ name: o.name, x1: x - w / 2 + 0.4, x2: x + w / 2 - 0.4, z1: z - d / 2 + 0.4, z2: z + d / 2 - 0.2, parts: k.scene.children.slice(partsFrom).filter((m) => m.position.y > 1.6 + h - 0.5), block });
}
