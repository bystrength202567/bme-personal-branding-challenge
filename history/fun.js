// 재미 요소: 그 시대 악기 소리를 흉내 낸 합성 음악(Gugak) + 시대별 놀이·문화 체험 마당
// 음악은 녹음이 아니라 브라우저에서 만든 소리예요. 음계(평조·계면조)와 악기 소리를 흉내 냈어요.

/* ===================== 국악 합성 ===================== */
const Gugak = (() => {
  let ctx = null;
  const ac = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  const SCALE = { pyeong: [0, 2, 5, 7, 9], gyemyeon: [0, 3, 5, 7, 10] }; // 평조, 계면조
  const hz = (base, step, scale) => {
    const s = SCALE[scale];
    const oct = Math.floor(step / s.length);
    return base * Math.pow(2, (s[((step % s.length) + s.length) % s.length] + 12 * oct) / 12);
  };
  let noiseBuf = null;
  const noise = (c) => {
    if (noiseBuf) return noiseBuf;
    noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  };
  // 가야금·거문고: 뜯는 소리 + 농현(떠는 소리)
  const pluck = (c, out, f, t, { vol = 0.35, decay = 2.4, low = false } = {}) => {
    const o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
    o.type = low ? "sawtooth" : "triangle";
    o.frequency.setValueAtTime(f * 1.01, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.08);
    const vib = c.createOscillator(), vg = c.createGain();
    vib.frequency.value = 5.5;
    vg.gain.setValueAtTime(0, t);
    vg.gain.linearRampToValueAtTime(f * 0.012, t + 0.6);
    vib.connect(vg).connect(o.frequency);
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(low ? 1400 : 3200, t);
    lp.frequency.exponentialRampToValueAtTime(low ? 400 : 900, t + decay);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, t + decay);
    o.connect(lp).connect(g).connect(out);
    o.start(t);
    vib.start(t);
    o.stop(t + decay + 0.1);
    vib.stop(t + decay + 0.1);
  };
  // 대금: 숨결 섞인 피리 소리 + 점점 깊어지는 떨림
  const flute = (c, out, f, t, dur, vol = 0.16) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine";
    o.frequency.value = f;
    const vib = c.createOscillator(), vg = c.createGain();
    vib.frequency.value = 4.5;
    vg.gain.setValueAtTime(0, t);
    vg.gain.linearRampToValueAtTime(f * 0.018, t + dur * 0.7);
    vib.connect(vg).connect(o.frequency);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.25);
    g.gain.setValueAtTime(vol, t + dur - 0.3);
    g.gain.linearRampToValueAtTime(0, t + dur);
    const n = c.createBufferSource(), bp = c.createBiquadFilter(), ng = c.createGain();
    n.buffer = noise(c);
    bp.type = "bandpass";
    bp.frequency.value = f * 2;
    bp.Q.value = 2;
    ng.gain.value = vol * 0.25;
    n.connect(bp).connect(ng).connect(g);
    o.connect(g).connect(out);
    [o, vib, n].forEach((s) => {
      s.start(t);
      s.stop(t + dur + 0.05);
    });
  };
  // 편경·편종: 맑게 오래 울리는 소리
  const chime = (c, out, f, t, vol = 0.18) => {
    [1, 2.76, 5.4].forEach((m, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine";
      o.frequency.value = f * m;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol / (i + 1.5), t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 3.5 / (i + 1));
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + 4);
    });
  };
  // 장구·북: 덩(낮은 소리), 덕(높은 소리)
  const drum = (c, out, t, kind, vol = 0.5) => {
    if (kind !== "deok") {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(kind === "buk" ? 75 : 110, t);
      o.frequency.exponentialRampToValueAtTime(50, t + 0.4);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + 0.55);
    }
    if (kind !== "buk") {
      const n = c.createBufferSource(), hp = c.createBiquadFilter(), g = c.createGain();
      n.buffer = noise(c);
      hp.type = "highpass";
      hp.frequency.value = 2500;
      g.gain.setValueAtTime(vol * 0.5, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      n.connect(hp).connect(g).connect(out);
      n.start(t);
      n.stop(t + 0.15);
    }
  };
  // 청동 방울
  const bell = (c, out, t) => {
    for (let i = 0; i < 4; i++) {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "square";
      o.frequency.value = 2200 + Math.random() * 1600;
      const tt = t + i * 0.05;
      g.gain.setValueAtTime(0.03, tt);
      g.gain.exponentialRampToValueAtTime(0.0005, tt + 0.25);
      o.connect(g).connect(out);
      o.start(tt);
      o.stop(tt + 0.3);
    }
  };
  // 군악대 나팔
  const brass = (c, out, f, t, dur) => {
    const o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
    o.type = "sawtooth";
    o.frequency.value = f;
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(600, t);
    lp.frequency.linearRampToValueAtTime(2200, t + 0.08);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09, t + 0.05);
    g.gain.setValueAtTime(0.09, t + dur - 0.08);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(lp).connect(g).connect(out);
    o.start(t);
    o.stop(t + dur + 0.05);
  };
  // 자연의 소리: 물·불·바람·풀벌레
  const bed = (c, out, type) => {
    const nodes = [];
    const src = c.createBufferSource();
    src.buffer = noise(c);
    src.loop = true;
    const f = c.createBiquadFilter(), g = c.createGain();
    f.type = type === "water" ? "lowpass" : "bandpass";
    f.frequency.value = type === "water" ? 700 : type === "fire" ? 1800 : 500;
    f.Q.value = 0.7;
    g.gain.value = type === "water" ? 0.12 : type === "fire" ? 0.03 : 0.04;
    const lfo = c.createOscillator(), lg = c.createGain();
    lfo.frequency.value = type === "water" ? 0.15 : 0.07;
    lg.gain.value = g.gain.value * 0.6;
    lfo.connect(lg).connect(g.gain);
    src.connect(f).connect(g).connect(out);
    src.start();
    lfo.start();
    nodes.push(src, lfo);
    let timer = null;
    if (type === "fire" || type === "moon") {
      // 타닥 소리 / 풀벌레 소리
      timer = setInterval(() => {
        const t = c.currentTime + Math.random() * 0.3;
        const o = c.createOscillator(), gg = c.createGain();
        o.type = type === "fire" ? "square" : "sine";
        o.frequency.value = type === "fire" ? 300 + Math.random() * 900 : 4200 + Math.random() * 400;
        gg.gain.setValueAtTime(type === "fire" ? 0.04 : 0.012, t);
        gg.gain.exponentialRampToValueAtTime(0.0005, t + (type === "fire" ? 0.03 : 0.08));
        o.connect(gg).connect(out);
        o.start(t);
        o.stop(t + 0.1);
      }, type === "fire" ? 180 : 420);
    }
    return () => {
      clearInterval(timer);
      nodes.forEach((n) => {
        try { n.stop(); } catch {}
      });
    };
  };

  // 시대별 연주: 느린 정악풍 가락을 음계 안에서 걸어가듯 만들어요
  const STYLE = {
    gojoseon: { base: 98, scale: "pyeong", tempo: 1.1 },
    threekingdoms: { base: 146.83, scale: "pyeong", tempo: 1.4 },
    silla: { base: 293.66, scale: "gyemyeon", tempo: 1.6 },
    goryeo: { base: 261.63, scale: "pyeong", tempo: 2.0 },
    joseon: { base: 311.13, scale: "pyeong", tempo: 2.2 },
    "korean-empire": { base: 261.63, scale: "pyeong", tempo: 1.3 },
  };
  const play = (eraId, c, out, t, beat, state) => {
    const st = STYLE[eraId];
    const step = () => {
      state.step = Math.max(0, Math.min(9, state.step + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));
      return hz(st.base, state.step, st.scale);
    };
    const len = st.tempo;
    if (eraId === "gojoseon") {
      drum(c, out, t, "buk", 0.55);
      if (beat % 2 === 1) drum(c, out, t + len / 2, "deok", 0.25);
      if (beat % 4 === 3) bell(c, out, t + len * 0.25);
    } else if (eraId === "threekingdoms") {
      pluck(c, out, step() / 2, t, { low: true, vol: 0.3, decay: 3 }); // 거문고
      if (Math.random() < 0.6) pluck(c, out, step(), t + len / 2, { vol: 0.22 }); // 가야금
    } else if (eraId === "silla") {
      if (beat % 2 === 0) flute(c, out, step(), t, len * 2 - 0.1); // 대금
      if (Math.random() < 0.7) pluck(c, out, step() / 2, t + len / 2, { vol: 0.2 });
    } else if (eraId === "goryeo") {
      chime(c, out, step(), t); // 편종·편경
      if (beat % 2 === 1) flute(c, out, step(), t + 0.2, len - 0.3, 0.1);
    } else if (eraId === "joseon") {
      if (beat % 4 === 0) {
        // 박: 악장의 시작을 알려요
        drum(c, out, t, "deok", 0.35);
      }
      chime(c, out, step(), t + 0.05, 0.14); // 편경
      if (beat % 2 === 0) flute(c, out, step(), t + 0.3, len * 2 - 0.4, 0.12); // 대금
      drum(c, out, t + len * 0.5, beat % 2 ? "deok" : "kung", 0.22); // 장구
    } else {
      pluck(c, out, step(), t, { vol: 0.22 });
      if (beat % 8 === 0) [0, 2, 4].forEach((s, i) => brass(c, out, hz(st.base, s, "pyeong"), t + i * 0.3, 0.28)); // 군악대 나팔
      if (beat % 2 === 1) drum(c, out, t + len / 2, "deok", 0.15);
    }
  };

  const describe = (eraId) =>
    ({
      ko: {
        gojoseon: "북과 청동 방울 · 하늘에 제사 지내던 의식 소리를 상상했어요",
        threekingdoms: "거문고·가야금 · 고구려 왕산악이 거문고를, 가야 우륵이 가야금을 남겼다고 전해져요",
        silla: "삼현삼죽 · 신라의 대금과 가야금 소리",
        goryeo: "아악 · 1116년 송나라에서 들어온 궁중 제례 음악(편종·편경)",
        joseon: "종묘제례악 분위기 · 편경·대금·장구 (유네스코 인류무형문화유산)",
        "korean-empire": "국악과 군악대 · 1900년 대한제국 군악대가 만들어졌어요",
      },
      en: {
        gojoseon: "Drums & bronze bells · imagined sounds of rites to heaven",
        threekingdoms: "Geomungo & gayageum · said to be left by Wang San-ak of Goguryeo and Ureuk of Gaya",
        silla: "Three strings & three winds · Silla's daegeum flute and gayageum",
        goryeo: "Aak · court ritual music from Song China in 1116 (bronze bells, stone chimes)",
        joseon: "Jongmyo Jeryeak mood · stone chimes, daegeum and janggu (UNESCO heritage)",
        "korean-empire": "Gugak & military band · the Empire's band was formed in 1900",
      },
    })[LANG][eraId] + (LANG === "ko" ? " (합성음으로 흉내 낸 소리)" : " (synthesized impression)");

  // mood: bgm | water | fire | moon | palace
  const start = (eraId, mood) => {
    let c;
    try { c = ac(); } catch { return () => {}; }
    const master = c.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(mood === "bgm" ? 0.5 : 0.7, c.currentTime + 2);
    master.connect(c.destination);
    const stopBed = mood === "bgm" ? null : bed(c, master, mood === "water" ? "water" : mood === "fire" ? "fire" : mood === "moon" ? "moon" : "wind");
    const len = STYLE[eraId].tempo;
    const state = { step: 4 };
    let beat = 0, next = c.currentTime + 0.3;
    const timer = setInterval(() => {
      while (next < c.currentTime + 1.5) {
        play(eraId, c, master, next, beat++, state);
        next += len;
      }
    }, 300);
    return () => {
      clearInterval(timer);
      master.gain.cancelScheduledValues(c.currentTime);
      master.gain.setValueAtTime(master.gain.value, c.currentTime);
      master.gain.linearRampToValueAtTime(0, c.currentTime + 1);
      setTimeout(() => {
        stopBed?.();
        master.disconnect();
      }, 1100);
    };
  };
  return { start, describe };
})();

/* ===================== 놀이·문화 체험 ===================== */
const FUN_UI = {
  ko: { score: (h, n) => `${h} / ${n}`, again: "다시 하기", done: "다 했어요", next: "다음", roll: "던지기!", start: "시작하기", great: "훌륭해요! 🎉", good: "잘했어요! 👏", tryAgain: "다시 도전해 볼까요? 💪", hit: "명중! 🎯", miss: "아쉬워요!", shoot: "찰칵! 📸", save: "사진 저장하기", pose: "포즈를 골라요", poses: [["bow", "🙇 점잖게 인사"], ["cheer", "🙌 만세"], ["dance", "💃 흥겹게"]], photoTitle: "대한제국 사진관" },
  en: { score: (h, n) => `${h} / ${n}`, again: "Play again", done: "Done", next: "Next", roll: "Throw!", start: "Start", great: "Excellent! 🎉", good: "Nice! 👏", tryAgain: "Try again? 💪", hit: "Hit! 🎯", miss: "So close!", shoot: "Click! 📸", save: "Save photo", pose: "Choose a pose", poses: [["bow", "🙇 Polite bow"], ["cheer", "🙌 Hurray"], ["dance", "💃 Party"]], photoTitle: "Korean Empire Photo Studio" },
};
const U = () => FUN_UI[LANG];

// 주령구: 월지에서 나온 14면 주사위 가운데 술과 관련 없는 면들
const JURYEONGGU = [
  ["禁聲作舞", "소리 없이 춤추기", "Dance without a sound", "dance"],
  ["衆人打鼻", "여러 사람에게 코 맞기", "Everyone flicks your nose", "bow"],
  ["有犯空過", "덤벼들어도 가만히 있기", "Stay still even if teased", "rest"],
  ["月鏡一曲", "'월경' 노래 한 곡 부르기", "Sing the song 'Wolgyeong'", "cheer"],
  ["任意請歌", "아무에게나 노래 청하기", "Ask anyone to sing", "wave"],
  ["空詠詩過", "시 한 수 읊기", "Recite a poem", "read"],
  ["醜物莫放", "더러운 물건도 버리지 않기", "Don't throw away the ugly thing", "bow"],
  ["弄面孔過", "얼굴을 간지럽혀도 참기", "Keep a straight face when tickled", "rest"],
  ["自唱怪來晩", "'괴래만' 노래 스스로 부르기", "Sing 'Goeraeman' yourself", "dance"],
];

// 시대별 체험 마당 (x, z: 자리 / prop: 소품 / type: 놀이 방식)
const FUN_STATIONS = {
  gojoseon: [
    { type: "culture", prop: "altar", x: 6, z: -40, emoji: "🔥",
      ko: { name: "하늘에 제사 지내기", steps: [["모닥불에 향나무를 올려요", null], ["하늘을 향해 공손히 절해요", "bow"], ["한 해 농사가 잘되기를 빌어요", "bow"]], fact: "고조선의 임금 '단군'은 하늘에 제사를 지내는 제사장이기도 했어요. 부여의 영고, 고구려의 동맹, 동예의 무천처럼 옛 나라들은 하늘에 제사 지내는 큰 축제를 열었어요." },
      en: { name: "Rite to Heaven", steps: [["Place fragrant wood on the fire", null], ["Bow respectfully to the sky", "bow"], ["Pray for a good harvest", "bow"]], fact: "Gojoseon's ruler, Dangun, was also a priest who made offerings to heaven. Ancient states held great festivals for heaven, like Yeonggo in Buyeo, Dongmaeng in Goguryeo and Mucheon in Dongye." } },
    { type: "timing", prop: "anvil", x: 26, z: 27, emoji: "🗡️", cfg: { tries: 3, zone: 0.2, speed: 1.1 },
      ko: { name: "청동검 만들기", intro: "쇳물이 알맞게 달아오른 순간(노란 칸)에 거푸집에 부어요!", verb: "쇳물 붓기", fact: "청동은 구리에 주석을 섞어 만들어요. 돌로 만든 거푸집에 녹인 쇳물을 부어 비파형 동검을 만들었고, 실제 거푸집이 땅속에서 나오기도 했어요." },
      en: { name: "Cast a Bronze Dagger", intro: "Pour the molten bronze into the mold when it's just right (yellow zone)!", verb: "Pour", fact: "Bronze is copper mixed with tin. Molten bronze was poured into stone molds to make lute-shaped daggers — real molds have been dug up." } },
  ],
  threekingdoms: [
    { type: "timing", prop: "target", x: -40, z: 44, emoji: "🏹", cfg: { tries: 5, zone: 0.14, speed: 1.3 },
      ko: { name: "고구려 활쏘기", intro: "과녁 한가운데(노란 칸)에 맞춰 활을 쏘아요!", verb: "활 쏘기", fact: "고구려 사람들은 활쏘기를 매우 중요하게 여겼어요. 시조 주몽의 이름도 '활을 잘 쏘는 사람'이라는 뜻이고, 무용총 수렵도에는 말 위에서 몸을 돌려 활을 쏘는 사냥꾼이 그려져 있어요." },
      en: { name: "Goguryeo Archery", intro: "Shoot for the bullseye (yellow zone)!", verb: "Shoot", fact: "Goguryeo valued archery highly. Its founder's name, Jumong, meant 'skilled archer', and the Muyongchong hunting mural shows a rider turning to shoot at full gallop." } },
    { type: "timing", prop: "mat", x: 40, z: 40, emoji: "🤼", cfg: { tries: 3, zone: 0.16, speed: 1.6 },
      ko: { name: "씨름", intro: "상대가 중심을 잃는 순간(노란 칸)에 기술을 걸어요!", verb: "기술 걸기", fact: "고구려 각저총 벽화에는 두 사람이 맞붙어 씨름하는 모습이 그려져 있어요. 씨름은 2018년 남북한이 함께 유네스코 인류무형문화유산에 올렸어요." },
      en: { name: "Ssireum Wrestling", intro: "Make your move when your opponent loses balance (yellow zone)!", verb: "Throw", fact: "The Gakjeochong tomb mural of Goguryeo shows two people wrestling. In 2018, North and South Korea jointly inscribed ssireum on UNESCO's intangible heritage list." } },
    { type: "timing", prop: "pot", x: -14, z: 40, emoji: "🏺", cfg: { tries: 5, zone: 0.16, speed: 1.2 },
      ko: { name: "백제 투호", intro: "항아리 입구(노란 칸)를 노려 화살을 던져요!", verb: "던지기", fact: "투호는 항아리에 화살을 던져 넣는 놀이예요. 중국 역사책에는 백제 사람들이 투호 같은 놀이를 즐겼다는 기록이 있어요." },
      en: { name: "Baekje Tuho", intro: "Aim for the mouth of the jar (yellow zone) and throw!", verb: "Throw", fact: "Tuho is a game of throwing arrows into a jar. Chinese histories record that the people of Baekje enjoyed games like tuho." } },
  ],
  silla: [
    { type: "dice", prop: "dice", x: 22, z: 8, emoji: "🎲",
      ko: { name: "주령구 굴리기", intro: "월지에서 나온 14면 주사위예요. 굴려서 나온 벌칙을 해 봐요!", fact: "주령구는 신라 귀족들이 잔치에서 굴리던 놀이 주사위예요. 1975년 월지 바닥에서 나왔어요. 여기서는 14면 가운데 술과 관련 없는 면만 골랐어요." },
      en: { name: "Roll the Juryeonggu", intro: "A 14-sided die found in Wolji. Roll it and do the forfeit!", fact: "The juryeonggu was a party die rolled by Silla nobles, found at the bottom of Wolji in 1975. Only the faces not about drinking are used here." } },
    { type: "culture", prop: "mask", x: 10, z: -4, emoji: "👺",
      ko: { name: "처용무 추기", steps: [["처용 탈을 써요", null], ["다섯 방향을 향해 춤춰요", "dance"], ["춤과 노래로 나쁜 기운을 쫓아요", "dance"]], fact: "《삼국유사》에 따르면 처용은 춤과 노래로 병을 옮기는 귀신을 물리쳤어요. 처용무는 2009년 유네스코 인류무형문화유산이 되었어요." },
      en: { name: "Cheoyongmu Dance", steps: [["Put on the Cheoyong mask", null], ["Dance toward the five directions", "dance"], ["Drive away bad spirits with song and dance", "dance"]], fact: "According to the Samguk Yusa, Cheoyong drove away a disease spirit with song and dance. Cheoyongmu became UNESCO intangible heritage in 2009." } },
    { type: "culture", prop: "star", x: -50, z: 33, emoji: "⭐",
      ko: { name: "첨성대에서 별보기", steps: [["첨성대 앞에 서요", null], ["밤하늘의 별을 찾아요", "rest"], ["본 것을 기록해요", "read"]], fact: "신라 사람들은 해와 달, 별의 움직임을 살펴 농사와 나랏일을 정했어요. 《삼국사기》에는 일식이나 혜성 같은 하늘의 변화가 많이 기록되어 있어요." },
      en: { name: "Stargazing at Cheomseongdae", steps: [["Stand before Cheomseongdae", null], ["Find stars in the night sky", "rest"], ["Record what you saw", "read"]], fact: "Silla people watched the sun, moon and stars to plan farming and state affairs. The Samguk Sagi records many sky events like eclipses and comets." } },
  ],
  goryeo: [
    { type: "culture", prop: "tea", x: -20, z: 24, emoji: "🍵",
      ko: { name: "고려 다도", steps: [["물을 끓여요", null], ["가루차를 넣고 저어 거품을 내요", "read"], ["청자 찻잔에 담아요", null], ["천천히 마셔요", "rest"]], fact: "고려 사람들은 차를 즐겨 마셨어요. 가루차를 물에 넣고 저어 거품을 내는 '점다'가 유행했고, 아름다운 청자 찻잔과 주전자가 많이 만들어졌어요." },
      en: { name: "Goryeo Tea Ceremony", steps: [["Boil the water", null], ["Whisk powdered tea into a froth", "read"], ["Pour it into a celadon cup", null], ["Sip slowly", "rest"]], fact: "Goryeo people loved tea. Whisking powdered tea into a froth ('jeomda') was popular, and many beautiful celadon cups and ewers were made." } },
    { type: "timing", prop: "ball", x: -30, z: 42, emoji: "🐎", cfg: { tries: 4, zone: 0.15, speed: 1.5 },
      ko: { name: "격구", intro: "말을 달리며 공이 구문(노란 칸) 앞에 왔을 때 쳐요!", verb: "공 치기", fact: "격구는 말을 타고 막대로 공을 쳐서 구문에 넣는 놀이예요. 고려의 무신들이 즐겼고, 조선에서는 무과 시험 과목이기도 했어요." },
      en: { name: "Gyeokgu Polo", intro: "Ride and strike the ball when it reaches the goal (yellow zone)!", verb: "Strike", fact: "Gyeokgu is played on horseback, hitting a ball into a goal with a stick. Goryeo's military officers loved it, and Joseon even used it in military exams." } },
    { type: "culture", prop: "lantern", x: -14, z: -2, emoji: "🏮",
      ko: { name: "연등회", steps: [["연등을 만들어요", "read"], ["소원을 적어 매달아요", null], ["등불을 밝혀요", "cheer"]], fact: "연등회는 등불을 밝혀 복을 비는 고려의 큰 나라 행사였어요. 연등회는 2020년 유네스코 인류무형문화유산이 되었어요." },
      en: { name: "Lantern Festival", steps: [["Make a lotus lantern", "read"], ["Write a wish and hang it", null], ["Light the lantern", "cheer"]], fact: "Yeondeunghoe, lighting lanterns to pray for blessings, was a great state festival in Goryeo. It became UNESCO intangible heritage in 2020." } },
  ],
  joseon: [
    { type: "timing", prop: "pot", x: -16, z: 14, emoji: "🏺", cfg: { tries: 5, zone: 0.15, speed: 1.3 },
      ko: { name: "궁중 투호", intro: "항아리 입구(노란 칸)를 노려 화살을 던져요!", verb: "던지기", fact: "투호는 조선 궁중과 양반가에서 즐긴 놀이예요. 화살을 던지며 마음을 바르게 다스리는 놀이로 여겼어요." },
      en: { name: "Court Tuho", intro: "Aim for the mouth of the jar (yellow zone) and throw!", verb: "Throw", fact: "Tuho was enjoyed at the Joseon court and by noble families, seen as a game that trains a calm, upright mind." } },
    { type: "yut", prop: "mat", x: 14, z: 32, emoji: "🪵",
      ko: { name: "윷놀이", intro: "윷가락 네 개를 던져요! 평평한 면이 몇 개 나오느냐에 따라 도·개·걸·윷·모가 돼요.", fact: "윷놀이는 네 개의 윷가락을 던져 나온 도·개·걸·윷·모로 말을 움직이는 놀이예요. 설날에 온 가족이 함께 즐겼어요." },
      en: { name: "Yunnori", intro: "Throw four sticks! How many land flat side up decides do, gae, geol, yut or mo.", fact: "Yunnori moves pieces by do, gae, geol, yut or mo from four thrown sticks — a game families enjoy at Lunar New Year." } },
    { type: "culture", prop: "desk", x: -46, z: 23, emoji: "🖌️",
      ko: { name: "서예", steps: [["벼루에 먹을 갈아요", "read"], ["붓에 먹을 묻혀요", null], ["한 글자씩 정성껏 써요", "read"]], word: "한글", fact: "선비들은 종이·붓·먹·벼루를 '문방사우(글방의 네 친구)'라 부르며 아꼈어요." },
      en: { name: "Calligraphy", steps: [["Grind ink on the inkstone", "read"], ["Dip the brush in ink", null], ["Write each stroke with care", "read"]], word: "한글", fact: "Scholars cherished paper, brush, ink and inkstone as the 'Four Friends of the Study'." } },
    { type: "timing", prop: "jegi", x: 16, z: 64, emoji: "🪶", cfg: { tries: 8, zone: 0.22, speed: 1.8 },
      ko: { name: "제기차기", intro: "제기가 내려오는 순간(노란 칸)에 발로 차 올려요!", verb: "차기", fact: "제기차기는 엽전을 종이나 천으로 싸서 만든 제기를 발로 차 올리는 놀이예요. 겨울철 아이들이 즐겼어요." },
      en: { name: "Jegichagi", intro: "Kick the jegi up just as it falls (yellow zone)!", verb: "Kick", fact: "Jegichagi is kicking a shuttlecock made of a coin wrapped in paper or cloth — a favorite winter game for children." } },
  ],
  "korean-empire": [
    { type: "culture", prop: "coffee", x: 6, z: -32, emoji: "☕",
      ko: { name: "가배 마시기", steps: [["원두를 갈아요", "read"], ["뜨거운 물을 부어 내려요", null], ["향을 맡고 천천히 마셔요", "rest"]], fact: "고종은 커피를 즐긴 것으로 유명해요. 당시에는 커피를 '가배' 또는 '양탕국'이라 불렀어요." },
      en: { name: "Have a 'Gabi' Coffee", steps: [["Grind the beans", "read"], ["Pour hot water to brew", null], ["Smell the aroma and sip", "rest"]], fact: "Emperor Gojong famously loved coffee, then called 'gabi' or 'yangtangguk' (Western soup)." } },
    { type: "photo", prop: "camera", x: 28, z: 6, emoji: "📸",
      ko: { name: "사진관 기념사진", fact: "개화기에 사진 기술이 들어오면서 서울에 사진관이 생겼어요. 고종 황제의 사진도 이 시기에 남았어요." },
      en: { name: "Photo Studio Portrait", fact: "Photography arrived in the enlightenment era and photo studios opened in Seoul. Photographs of Emperor Gojong survive from this time." } },
  ],
};

// 체험 마당을 궁궐에 놓아요
function placeActivities(api, kit, era, player) {
  const { box, cyl, mat, add } = kit;
  (FUN_STATIONS[era.id] || []).forEach((st) => {
    const info = st[LANG];
    const g = new THREE.Group();
    g.position.set(st.x, api.floorAt(st.x, st.z), st.z);
    // 체험 마당 돗자리
    box(3, 0.06, 3, mat("#c8a86a"), 0, 0.03, 0, g);
    box(3.2, 0.04, 3.2, mat("#8e2f25"), 0, 0.02, 0, g);
    propOf(st.prop, g, { box, cyl, mat, add });
    api.scene.add(g);
    api.addInteract(g, { kind: "custom", count: true, hop: true, name: info.name, emoji: st.emoji, labelHtml: `${st.emoji} ${info.name}`, labelCls: "fun", labelHeight: 2.6, render: (body, close) => runActivity(st, info, body, close, api, player) }, 1.6, 2);
  });
}

function propOf(kind, g, { box, cyl, mat, add }) {
  const wood = mat("#5a3e2b");
  if (kind === "pot") {
    cyl(0.35, 0.25, 0.8, 16, mat("#7a5a30"), 0, 0.46, -0.6, g);
    [-0.1, 0.1].forEach((x) => cyl(0.02, 0.02, 0.9, 6, mat("#efe6cf"), x, 1, -0.6, g));
  } else if (kind === "target") {
    [-0.6, 0.6].forEach((x) => cyl(0.05, 0.05, 1.8, 6, wood, x, 0.9, -1.2, g));
    const t = add(new THREE.CircleGeometry(0.6, 24), mat("#efe6cf"), 0, 1.3, -1.15, g);
    add(new THREE.CircleGeometry(0.35, 24), mat("#b3262d"), 0, 1.3, -1.14, g);
    add(new THREE.CircleGeometry(0.12, 24), mat("#d9a62e"), 0, 1.3, -1.13, g);
    void t;
  } else if (kind === "anvil") {
    box(0.7, 0.5, 0.4, mat("#4a4a52"), 0, 0.3, -0.6, g);
    cyl(0.25, 0.3, 0.3, 12, mat("#c9a24a"), 0.8, 0.2, 0, g);
  } else if (kind === "altar") {
    box(1.2, 0.5, 0.7, wood, 0, 0.25, -0.6, g);
    cyl(0.2, 0.15, 0.2, 12, mat("#c9a24a"), 0, 0.6, -0.6, g);
  } else if (kind === "dice") {
    add(new THREE.IcosahedronGeometry(0.35, 0), mat("#a07040"), 0, 0.45, 0, g);
  } else if (kind === "mask") {
    cyl(0.04, 0.04, 1.4, 6, wood, 0, 0.7, -0.8, g);
    add(new THREE.SphereGeometry(0.3, 14, 10), mat("#b3262d"), 0, 1.5, -0.8, g);
  } else if (kind === "star") {
    box(0.8, 0.4, 0.6, wood, 0, 0.2, -0.6, g);
    box(0.5, 0.02, 0.35, mat("#efe6cf"), 0, 0.41, -0.6, g);
  } else if (kind === "tea") {
    cyl(0.45, 0.45, 0.05, 16, wood, 0, 0.35, -0.3, g);
    [-0.15, 0.15].forEach((x) => cyl(0.07, 0.05, 0.08, 12, mat("#8fc4ad"), x, 0.42, -0.3, g));
  } else if (kind === "ball") {
    [-0.7, 0.7].forEach((x) => cyl(0.05, 0.05, 1.6, 6, mat("#b3262d"), x, 0.8, -1.3, g));
    box(1.5, 0.1, 0.1, mat("#b3262d"), 0, 1.6, -1.3, g);
    add(new THREE.SphereGeometry(0.12, 10, 8), mat("#efe6cf"), 0.3, 0.12, 0, g);
  } else if (kind === "lantern") {
    cyl(0.04, 0.04, 1.8, 6, wood, 0, 0.9, -0.8, g);
    [-0.4, 0, 0.4].forEach((x) => add(new THREE.SphereGeometry(0.2, 12, 10), new THREE.MeshLambertMaterial({ color: 0xe39bb0, emissive: 0xff7a5a, emissiveIntensity: 0.6 }), x, 1.6, -0.8, g));
  } else if (kind === "desk") {
    box(1, 0.4, 0.5, wood, 0, 0.2, -0.5, g);
    box(0.6, 0.01, 0.4, mat("#efe6cf"), 0, 0.41, -0.5, g);
  } else if (kind === "jegi") {
    add(new THREE.ConeGeometry(0.1, 0.3, 8), mat("#efe6cf"), 0, 1.2, 0, g);
  } else if (kind === "coffee") {
    cyl(0.4, 0.4, 0.05, 16, mat("#e8e2d6"), 0, 0.7, -0.4, g);
    cyl(0.05, 0.05, 0.7, 8, mat("#c9a24a"), 0, 0.35, -0.4, g);
    cyl(0.07, 0.06, 0.1, 12, mat("#efe6cf"), 0.1, 0.78, -0.4, g);
  } else if (kind === "camera") {
    [-0.3, 0, 0.3].forEach((x) => {
      const leg = cyl(0.03, 0.03, 1.3, 6, wood, x * 0.6, 0.62, -1 + Math.abs(x) * 0.3, g);
      leg.rotation.z = x * 0.4;
    });
    box(0.5, 0.45, 0.5, mat("#2a2a30"), 0, 1.35, -1, g);
    cyl(0.12, 0.14, 0.25, 12, mat("#c9a24a"), 0, 1.35, -0.7, g).rotation.x = Math.PI / 2;
  } else {
    box(1.4, 0.04, 1.4, mat("#b8963f"), 0, 0.08, 0, g);
  }
}

function runActivity(st, info, body, close, api, player) {
  const u = U();
  const act = (a) => {
    if (!a) return;
    if (["read", "rest", "eat"].includes(a)) {
      setPose(player, a);
      setTimeout(() => player.pose === a && setPose(player, null), 1800);
    } else player.anim = { type: a, t: 0 };
  };
  const finish = (title) => {
    body.innerHTML = `<p class="fun-result">${title}</p><p>${info.fact}</p><div class="actions"><button class="btn ghost" id="funAgain">${u.again}</button><button class="btn" id="funDone">${u.done}</button></div>`;
    body.querySelector("#funAgain").addEventListener("click", () => runActivity(st, info, body, close, api, player));
    body.querySelector("#funDone").addEventListener("click", close);
  };

  if (st.type === "timing") {
    const { tries, zone, speed } = st.cfg;
    let n = 0, hits = 0, x = 0, dir = 1, center = 0.5, last = performance.now();
    const newZone = () => (center = zone / 2 + Math.random() * (1 - zone));
    newZone();
    body.innerHTML = `<p>${info.intro}</p><div class="tbar"><div class="tzone"></div><div class="tmark"></div></div><p class="tscore">${u.score(0, tries)}</p><button class="btn" id="funGo">${info.verb}</button>`;
    const zoneEl = body.querySelector(".tzone"), markEl = body.querySelector(".tmark"), scoreEl = body.querySelector(".tscore");
    const place = () => {
      zoneEl.style.left = `${(center - zone / 2) * 100}%`;
      zoneEl.style.width = `${zone * 100}%`;
    };
    place();
    const loop = (now) => {
      if (!body.isConnected || !markEl.isConnected) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      x += dir * speed * dt;
      if (x > 1) (x = 1), (dir = -1);
      if (x < 0) (x = 0), (dir = 1);
      markEl.style.left = `${x * 100}%`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    body.querySelector("#funGo").addEventListener("click", () => {
      const hit = Math.abs(x - center) <= zone / 2;
      n++;
      if (hit) hits++;
      act(hit ? "cheer" : "wave");
      scoreEl.textContent = `${hit ? u.hit : u.miss} · ${u.score(hits, tries)}`;
      if (n >= tries) {
        const ratio = hits / tries;
        setTimeout(() => finish(`${ratio >= 0.8 ? u.great : ratio >= 0.4 ? u.good : u.tryAgain} ${u.score(hits, tries)}`), 500);
      } else {
        newZone();
        place();
      }
    });
  } else if (st.type === "dice" || st.type === "yut") {
    body.innerHTML = `<p>${info.intro}</p><div class="dice-face" id="funFace">🎲</div><p class="tscore" id="funSub"></p><div class="actions"><button class="btn" id="funRoll">${u.roll}</button><button class="btn ghost" id="funFact">${u.done}</button></div>`;
    const face = body.querySelector("#funFace"), sub = body.querySelector("#funSub");
    body.querySelector("#funFact").addEventListener("click", () => finish(`${st.emoji} ${info.name}`));
    body.querySelector("#funRoll").addEventListener("click", (e) => {
      e.target.disabled = true;
      let k = 0;
      const spin = setInterval(() => {
        face.textContent = st.type === "dice" ? JURYEONGGU[k++ % JURYEONGGU.length][0] : ["▮▯▮▯", "▯▮▯▮", "▮▮▯▯"][k++ % 3];
      }, 80);
      setTimeout(() => {
        clearInterval(spin);
        e.target.disabled = false;
        if (st.type === "dice") {
          const [han, ko, en, a] = JURYEONGGU[Math.floor(Math.random() * JURYEONGGU.length)];
          face.textContent = han;
          sub.textContent = LANG === "ko" ? ko : en;
          act(a);
        } else {
          const sticks = [0, 1, 2, 3].map(() => Math.random() < 0.5);
          const flat = sticks.filter(Boolean).length;
          const names = LANG === "ko" ? ["모", "도", "개", "걸", "윷"] : ["Mo (5)", "Do (1)", "Gae (2)", "Geol (3)", "Yut (4)"];
          face.textContent = sticks.map((s) => (s ? "▯" : "▮")).join(" ");
          sub.textContent = names[flat];
          act(flat === 0 || flat === 4 ? "dance" : flat === 3 ? "cheer" : "wave");
        }
      }, 1000);
    });
  } else if (st.type === "culture") {
    let i = 0;
    const show = () => {
      const [text, a] = info.steps[i];
      body.innerHTML = `<p class="eyebrow">${i + 1} / ${info.steps.length}</p><p class="fun-step">${text}</p><button class="btn" id="funNext">${i + 1 < info.steps.length ? u.next : u.done}</button>`;
      act(a);
      body.querySelector("#funNext").addEventListener("click", () => {
        i++;
        if (i < info.steps.length) show();
        else finish(info.word ? `<span class="brush">${info.word}</span>` : `${st.emoji} ${info.name}`);
      });
    };
    show();
  } else if (st.type === "photo") {
    body.innerHTML = `<p>${u.pose}</p><div class="w-map">${u.poses.map(([a, t]) => `<button data-a="${a}">${t}</button>`).join("")}</div><div id="funPhoto"></div>`;
    body.querySelectorAll("[data-a]").forEach((b) =>
      b.addEventListener("click", () => {
        // 카메라를 바라보게 돌려 세워요
        const pp = player.group.position, cp = api.camera.position;
        player.group.rotation.y = Math.atan2(cp.x - pp.x, cp.z - pp.z);
        act(b.dataset.a);
        setTimeout(() => {
          player.group.rotation.y = Math.atan2(cp.x - pp.x, cp.z - pp.z);
          const src = api.renderer.domElement;
          api.renderer.render(api.scene, api.camera);
          const shot = src.toDataURL("image/jpeg", 0.9);
          const img = new Image();
          img.onload = () => {
            const W = 900, H = Math.round((900 * src.height) / src.width) + 120;
            const cv = document.createElement("canvas");
            cv.width = W;
            cv.height = H;
            const g = cv.getContext("2d");
            g.fillStyle = "#efe6cf";
            g.fillRect(0, 0, W, H);
            g.filter = "sepia(0.85) contrast(1.05)";
            g.drawImage(img, 30, 30, W - 60, H - 150);
            g.filter = "none";
            g.fillStyle = "#3b2a20";
            g.font = '700 34px "Gowun Batang", serif';
            g.textAlign = "center";
            g.fillText(u.photoTitle, W / 2, H - 70);
            g.font = '22px "Noto Sans KR", sans-serif';
            g.fillText(`${LANG === "ko" ? "광무" : "Gwangmu era"} · ${new Date().toLocaleDateString(LANG)}`, W / 2, H - 35);
            const url = cv.toDataURL("image/jpeg", 0.9);
            body.querySelector("#funPhoto").innerHTML = `<p class="fun-result">${u.shoot}</p><img class="fun-photo" src="${url}" alt="" /><p>${info.fact}</p><a class="btn" download="${LANG === "ko" ? "대한제국-사진관" : "korean-empire-photo"}.jpg" href="${url}">${u.save}</a>`;
          };
          img.src = shot;
        }, 900);
      })
    );
  }
}

window.Gugak = Gugak;
window.placeActivities = placeActivities;
