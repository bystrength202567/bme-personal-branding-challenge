/* B, Me 카드뉴스 메이커 — 1080×1080 카드를 캔버스에 직접 그리고 PNG로 내보냅니다.
   미리보기와 저장 결과가 같은 렌더링 경로를 쓰기 때문에 화면에 보이는 그대로 저장됩니다. */

const W = 1080, H = 1080, M = 96;

const THEMES = {
  paper:  {bg:'#fffcf7', panel:'#f9e7e4', text:'#28272b', muted:'#67636a', em:'#c46d69', eyebrow:'#b45e59', rule:'#e5dfd7', mark:'#da5e57'},
  rose:   {bg:'#f9e7e4', panel:'#f3d5cf', text:'#28272b', muted:'#6c5b5a', em:'#b6524c', eyebrow:'#a9524d', rule:'#e6cdc8', mark:'#da5e57'},
  yellow: {bg:'#f7e8b9', panel:'#f2dca4', text:'#28272b', muted:'#6b5f42', em:'#a9683f', eyebrow:'#8d6a35', rule:'#e4d2a4', mark:'#c9635f'},
  lav:    {bg:'#e9e5fb', panel:'#dad4f5', text:'#28272b', muted:'#5f5a72', em:'#6f5bb5', eyebrow:'#6a5aa8', rule:'#d6d0f0', mark:'#da5e57'},
  mint:   {bg:'#dcece1', panel:'#c9e0d1', text:'#28272b', muted:'#54655a', em:'#3f7a5a', eyebrow:'#47705a', rule:'#c8dccf', mark:'#da5e57'},
  ink:    {bg:'#29282d', panel:'#37353c', text:'#fffcf7', muted:'#c2bcc4', em:'#f3ce66', eyebrow:'#e8a49d', rule:'#4d4952', mark:'#f3ce66'},
};
const BG_ORDER = ['paper','rose','yellow','lav','mint','ink'];
const BG_LABEL = {paper:'페이퍼', rose:'로즈', yellow:'옐로', lav:'라벤더', mint:'민트', ink:'잉크'};

/* ---------- 폰트 / 텍스트 유틸 ---------- */
const serif = (size, italic) => `${italic ? 'italic ' : ''}400 ${size}px "DM Serif Display","Noto Sans KR",serif`;
const sans  = (size, weight = 500) => `${weight} ${size}px Manrope,"Noto Sans KR",sans-serif`;

function setFont(ctx, font, spacing = 0){
  ctx.font = font;
  if ('letterSpacing' in ctx) ctx.letterSpacing = spacing + 'px';
}

/* *강조* 구간을 분리한다 */
function parseRich(str){
  const out = [];
  String(str == null ? '' : str).split(/(\*[^*\n]+\*)/g).forEach(part => {
    if (!part) return;
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) out.push({text: part.slice(1, -1), em: true});
    else out.push({text: part, em: false});
  });
  return out.length ? out : [{text:'', em:false}];
}

/* 줄바꿈(\n)을 지키면서 어절 단위로 줄을 나눈다 */
function wrapRich(ctx, segments, maxWidth, fontFor){
  const lines = [];
  let line = [];
  const push = () => { lines.push(line); line = []; };
  const lineWidth = () => line.reduce((s, t) => s + t.w, 0);

  segments.forEach(seg => {
    seg.text.split('\n').forEach((part, pi) => {
      if (pi > 0) push();
      const words = part.match(/\S+\s*|\s+/g) || [];
      words.forEach(word => {
        setFont(ctx, fontFor(seg.em), 0);
        const w = ctx.measureText(word).width;
        if (line.length && lineWidth() + w > maxWidth) push();
        if (w > maxWidth){
          let buf = '';
          for (const ch of word){
            if (lineWidth() + ctx.measureText(buf + ch).width > maxWidth && buf){
              line.push(token(ctx, buf, seg.em));
              push();
              buf = ch;
            } else buf += ch;
          }
          if (buf) line.push(token(ctx, buf, seg.em));
          return;
        }
        line.push(token(ctx, word, seg.em));
      });
    });
  });
  if (line.length) push();
  return lines.length ? lines : [[]];
}

function token(ctx, text, em){
  return {text, em, w: ctx.measureText(text).width, tw: ctx.measureText(text.replace(/\s+$/, '')).width};
}

/* 정해진 높이 안에 들어올 때까지 글자 크기를 줄인다 */
function fitRich(ctx, segments, maxWidth, maxHeight, startSize, minSize, mkFont, lhRatio){
  let last = null;
  for (let size = startSize; size >= minSize; size -= 2){
    const lines = wrapRich(ctx, segments, maxWidth, em => mkFont(size, em));
    last = {size, lines, lh: Math.round(size * lhRatio)};
    if (last.lines.length * last.lh <= maxHeight) return last;
  }
  return last;
}

function drawRich(ctx, fit, x, baselineY, mkFont, colorFor, align = 'left'){
  ctx.textBaseline = 'alphabetic';
  fit.lines.forEach((line, i) => {
    const total = line.reduce((s, t, idx) => s + (idx === line.length - 1 ? t.tw : t.w), 0);
    let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
    line.forEach(t => {
      setFont(ctx, mkFont(fit.size, t.em), 0);
      ctx.fillStyle = colorFor(t.em);
      ctx.fillText(t.text, cx, baselineY + i * fit.lh);
      cx += t.w;
    });
  });
  return baselineY + (fit.lines.length - 1) * fit.lh;
}

/* ---------- 공통 부품 ---------- */
function drawEyebrow(ctx, text, x, y, t, align = 'left'){
  if (!text) return;
  setFont(ctx, sans(22, 800), 3.4);
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = t.eyebrow;
  ctx.fillText(text.toUpperCase(), x, y);
  ctx.textAlign = 'left';
  setFont(ctx, sans(22, 800), 0);
}

function drawBrand(ctx, x, y, t, size = 36){
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  setFont(ctx, serif(size), 0);
  ctx.fillStyle = t.text;
  ctx.fillText('B,', x, y);
  const w1 = ctx.measureText('B,').width;
  setFont(ctx, sans(size * 0.92, 800), -0.8);
  ctx.fillText(' Me', x + w1, y);
  const w2 = ctx.measureText(' Me').width;
  setFont(ctx, sans(size, 800), 0);
  ctx.beginPath();
  ctx.arc(x + w1 + w2 + 10, y - size * 0.58, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = t.mark;
  ctx.fill();
}

function drawPageNum(ctx, idx, total, t){
  setFont(ctx, sans(20, 800), 2.2);
  ctx.textAlign = 'right';
  ctx.fillStyle = t.muted;
  ctx.fillText(`${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, W - M, 132);
  ctx.textAlign = 'left';
  setFont(ctx, sans(20, 800), 0);
}

function hairline(ctx, x, y, width, t){
  ctx.fillStyle = t.rule;
  ctx.fillRect(x, y, width, 1);
}

/* 종이 질감 */
const GRAIN = new Image();
let grainReady = false;
GRAIN.onload = () => { grainReady = true; renderAll(); };
GRAIN.onerror = () => { grainReady = false; };
GRAIN.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1080' height='1080'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

function drawGrain(ctx){
  if (!grainReady) return;
  ctx.save();
  ctx.globalAlpha = 0.05;
  try { ctx.drawImage(GRAIN, 0, 0, W, H); } catch (e) { /* 렌더 불가 브라우저는 건너뜀 */ }
  ctx.restore();
}

/* ---------- 템플릿 ---------- */
const TEMPLATES = {
  cover: {
    label: '표지',
    fields: [
      {key:'eyebrow', label:'상단 라벨', type:'text'},
      {key:'title',   label:'제목', type:'area', rows:3},
      {key:'body',    label:'본문', type:'area', rows:3},
      {key:'note',    label:'우측 하단 안내', type:'text'},
    ],
    draw(ctx, c, t, idx, total){
      const panelH = 470;
      ctx.fillStyle = t.panel;
      ctx.fillRect(0, 0, W, panelH);

      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, panelH); ctx.clip();
      ctx.beginPath(); ctx.arc(905, 95, 255, 0, Math.PI * 2);
      ctx.fillStyle = '#f7c750'; ctx.fill();
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = t.em;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(180, 430, 330, 165, -0.4, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(880, 460, 250, 120, 0.52, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(688, 402);
      ctx.rotate(-6 * Math.PI / 180);
      setFont(ctx, sans(20, 800), 2);
      ctx.fillStyle = t.eyebrow;
      ctx.fillText('BRAND', 0, 0);
      ctx.fillText('IN PROGRESS', 0, 28);
      ctx.restore();

      drawEyebrow(ctx, c.eyebrow, M, 140, t);

      const title = fitRich(ctx, parseRich(c.title), W - M * 2, 340, 96, 60, (s, em) => serif(s, em), 1.16);
      const titleEnd = drawRich(ctx, title, M, 650, (s, em) => serif(s, em), em => em ? t.em : t.text);

      const body = fitRich(ctx, parseRich(c.body), 760, 200, 30, 24, s => sans(s, 500), 1.75);
      drawRich(ctx, body, M, titleEnd + 76, s => sans(s, 500), () => t.muted);

      drawBrand(ctx, M, 985, t);
      if (c.note){
        setFont(ctx, sans(24, 700), 0);
        ctx.textAlign = 'right';
        ctx.fillStyle = t.muted;
        ctx.fillText(c.note, W - M, 985);
        ctx.textAlign = 'left';
      }
    },
  },

  statement: {
    label: '한 문장',
    fields: [
      {key:'eyebrow', label:'상단 라벨', type:'text'},
      {key:'title',   label:'문장', type:'area', rows:4},
      {key:'note',    label:'아래 설명', type:'area', rows:3},
    ],
    draw(ctx, c, t, idx, total){
      drawEyebrow(ctx, c.eyebrow, W / 2, 170, t, 'center');

      const title = fitRich(ctx, parseRich(c.title), W - M * 2 - 60, 470, 88, 52, (s, em) => serif(s, em), 1.34);
      const blockH = title.lines.length * title.lh;
      const start = 545 - blockH / 2 + title.lh * 0.76;
      const titleEnd = drawRich(ctx, title, W / 2, start, (s, em) => serif(s, em), em => em ? t.em : t.text, 'center');

      let y = titleEnd + 92;
      hairline(ctx, W / 2 - 36, y, 72, t);

      if (c.note){
        const note = fitRich(ctx, parseRich(c.note), 720, 200, 28, 22, s => sans(s, 500), 1.7);
        drawRich(ctx, note, W / 2, y + 66, s => sans(s, 500), em => em ? t.em : t.muted, 'center');
      }

      drawBrand(ctx, M, 985, t, 30);
      drawPageNum(ctx, idx, total, t);
    },
  },

  numbered: {
    label: '번호 + 설명',
    fields: [
      {key:'index',   label:'번호', type:'text'},
      {key:'eyebrow', label:'상단 라벨', type:'text'},
      {key:'title',   label:'제목', type:'area', rows:3},
      {key:'body',    label:'본문', type:'area', rows:5},
    ],
    draw(ctx, c, t, idx, total){
      drawEyebrow(ctx, c.eyebrow, M, 140, t);

      if (c.index){
        ctx.save();
        ctx.globalAlpha = 0.32;
        setFont(ctx, serif(210), 0);
        ctx.fillStyle = t.em;
        ctx.fillText(c.index, M - 6, 415);
        ctx.restore();
      }

      const title = fitRich(ctx, parseRich(c.title), W - M * 2, 240, 72, 48, (s, em) => serif(s, em), 1.3);
      const titleEnd = drawRich(ctx, title, M, 540, (s, em) => serif(s, em), em => em ? t.em : t.text);

      const y = titleEnd + 62;
      hairline(ctx, M, y, 190, t);

      const body = fitRich(ctx, parseRich(c.body), 800, 300, 31, 23, s => sans(s, 500), 1.8);
      drawRich(ctx, body, M, y + 76, s => sans(s, 500), em => em ? t.em : t.muted);

      drawBrand(ctx, M, 985, t, 30);
      drawPageNum(ctx, idx, total, t);
    },
  },

  list: {
    label: '목록',
    fields: [
      {key:'eyebrow', label:'상단 라벨', type:'text'},
      {key:'title',   label:'제목', type:'area', rows:2},
      {key:'items',   label:'항목 (한 줄에 하나 · 라벨 | 내용)', type:'area', rows:8},
    ],
    draw(ctx, c, t, idx, total){
      drawEyebrow(ctx, c.eyebrow, M, 140, t);

      const title = fitRich(ctx, parseRich(c.title), 820, 190, 68, 46, (s, em) => serif(s, em), 1.24);
      const titleEnd = drawRich(ctx, title, M, 250, (s, em) => serif(s, em), em => em ? t.em : t.text);

      const items = parseItems(c.items);
      const top = titleEnd + 74;
      const available = 908 - top;

      const measure = scale => {
        let h = 0;
        const rows = items.map(it => {
          const titleSize = 34 * scale;
          const fit = fitRich(ctx, parseRich(it.text), 820, 1000, titleSize, titleSize, s => sans(s, 600), 1.42);
          const rowH = (it.label ? 26 * scale + 10 * scale : 0) + fit.lines.length * fit.lh + 46 * scale;
          h += rowH;
          return {it, fit, rowH, scale};
        });
        return {rows, h};
      };

      let plan = measure(1);
      for (let s = 0.96; plan.h > available && s >= 0.62; s -= 0.04) plan = measure(s);

      const extra = plan.rows.length && plan.h < available
        ? Math.min((available - plan.h) / plan.rows.length, 72)
        : 0;

      let y = top;
      plan.rows.forEach(row => {
        row.rowH += extra;
        hairline(ctx, M, y, W - M * 2, t);
        let cursor = y + 34 * row.scale;
        if (row.it.label){
          setFont(ctx, sans(20 * row.scale, 800), 2);
          ctx.fillStyle = t.eyebrow;
          ctx.fillText(row.it.label.toUpperCase(), M, cursor);
          cursor += 34 * row.scale;
        }
        drawRich(ctx, row.fit, M, cursor + row.fit.size * 0.1, s => sans(s, 600), em => em ? t.em : t.text);
        y += row.rowH;
      });
      if (plan.rows.length) hairline(ctx, M, y, W - M * 2, t);

      drawBrand(ctx, M, 985, t, 30);
      drawPageNum(ctx, idx, total, t);
    },
  },

  cta: {
    label: '신청 안내',
    fields: [
      {key:'eyebrow', label:'상단 라벨', type:'text'},
      {key:'title',   label:'제목', type:'area', rows:3},
      {key:'body',    label:'안내 문구', type:'area', rows:4},
      {key:'action',  label:'버튼 문구', type:'text'},
      {key:'note',    label:'하단 계정', type:'text'},
    ],
    draw(ctx, c, t, idx, total){
      drawBrand(ctx, M, 155, t, 38);
      drawEyebrow(ctx, c.eyebrow, M, 300, t);

      const title = fitRich(ctx, parseRich(c.title), 860, 300, 80, 54, (s, em) => serif(s, em), 1.2);
      const titleEnd = drawRich(ctx, title, M, 430, (s, em) => serif(s, em), em => em ? t.em : t.text);

      const body = fitRich(ctx, parseRich(c.body), 820, 200, 29, 22, s => sans(s, 500), 1.85);
      drawRich(ctx, body, M, titleEnd + 84, s => sans(s, 500), em => em ? t.em : t.muted);

      if (c.action){
        ctx.fillStyle = t.em;
        ctx.fillRect(M, 800, W - M * 2, 108);
        setFont(ctx, sans(32, 800), 0);
        ctx.fillStyle = t.bg;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.action, W / 2, 856);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
      }

      if (c.note){
        setFont(ctx, sans(22, 700), 1.4);
        ctx.fillStyle = t.muted;
        ctx.textAlign = 'center';
        ctx.fillText(c.note, W / 2, 985);
        ctx.textAlign = 'left';
        setFont(ctx, sans(22, 700), 0);
      }
    },
  },
};

function parseItems(raw){
  return String(raw || '').split('\n').map(l => l.trim()).filter(Boolean).map(line => {
    const i = line.indexOf('|');
    return i === -1
      ? {label: '', text: line}
      : {label: line.slice(0, i).trim(), text: line.slice(i + 1).trim()};
  });
}

function drawCard(ctx, card, idx, total){
  const t = THEMES[card.bg] || THEMES.paper;
  const tpl = TEMPLATES[card.template] || TEMPLATES.statement;
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = t.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  tpl.draw(ctx, card, t, idx, total);
  drawGrain(ctx);
  ctx.restore();
}

/* ---------- 기본 내용: 2기 모집 ---------- */
const DEFAULT_CARDS = [
  {template:'cover', bg:'paper',
   eyebrow:'personal branding challenge · 2기 모집',
   title:'나를 브랜드로\n만드는 *6주*',
   body:'매일 한 문장으로 나를 발견하고,\n여섯 주의 끝에 나만의 브랜드 북을 완성해요.',
   note:'밀어서 보기 →'},

  {template:'statement', bg:'rose',
   eyebrow:'why b, me',
   title:'이력서 한 장으로는\n설명되지 않는 *나*',
   note:'경력은 차곡차곡 쌓였는데,\n정작 나를 한 문장으로 말하기는 어려웠어요.'},

  {template:'numbered', bg:'paper', index:'01',
   eyebrow:'발견',
   title:'남의 브랜드가 아니라\n내 안의 언어로',
   body:'버크만 진단과 강점 찾기로 시작합니다. 멋져 보이는 남의 방식을 흉내 내는 대신, 이미 내 안에 있던 것을 꺼내 이름을 붙여요.'},

  {template:'list', bg:'mint',
   eyebrow:'6 weeks journey',
   title:'6주의 여정',
   items:['week 1 · 발견 | 버크만 디브리핑으로 나를 읽기',
          'week 2 · 언어 | 강점 진단과 이키가이 그리기',
          'week 3 · 방향 | 나를 이끄는 만트라 만들기',
          'week 4 · 시각화 | 내가 향하는 풍경, 비전보드',
          'week 5 · 표현 | 세상에 건넬 브랜드 스토리',
          'week 6 · 완성 | 나만의 브랜드 북 만들기'].join('\n')},

  {template:'numbered', bg:'yellow', index:'02',
   eyebrow:'daily question',
   title:'하루 5분,\n한 문장이면 충분해요',
   body:'매일 하나의 질문에 답하며 나를 기록합니다. 부담 없는 한 문장이 쌓여, 6주 뒤에는 나를 설명하는 가장 정확한 자료가 됩니다.'},

  {template:'statement', bg:'lav',
   eyebrow:'brand book',
   title:'여정의 끝에는\n*나만의 브랜드 북*',
   note:'흩어져 있던 기록을 한 권으로 정리해\n세상에 보여 줄 수 있는 형태로 완성합니다.'},

  {template:'list', bg:'paper',
   eyebrow:'for you',
   title:'이런 분께 권해요',
   items:['| 이직·전환을 앞두고 나를 설명해야 하는 분',
          '| 콘텐츠를 시작하고 싶은데 주제를 못 정한 분',
          '| 열심히 살았는데 남는 게 없다고 느끼는 분',
          '| 끝나고도 함께 갈 동료가 필요한 분'].join('\n')},

  {template:'cta', bg:'ink',
   eyebrow:'2기 모집',
   title:'당신답게,\n*빛나는 이름*을',
   body:'모집 기간 · 9월 1일(월) — 9월 14일(일)\n시작일 · 9월 22일(월) · 정원 20명',
   action:'프로필 링크에서 신청하기 →',
   note:'@b.me.challenge'},
];

/* ---------- 상태 ---------- */
const STORE_KEY = 'bme-cardnews';
const $ = s => document.querySelector(s);
const clone = v => JSON.parse(JSON.stringify(v));

let cards = load();
let active = 0;

function load(){
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (e) { /* 저장값이 깨졌으면 기본값으로 */ }
  return clone(DEFAULT_CARDS);
}

function save(){
  try { localStorage.setItem(STORE_KEY, JSON.stringify(cards)); } catch (e) { /* 저장 실패는 무시 */ }
}

/* ---------- 렌더 ---------- */
const preview = $('#preview');
const pctx = preview.getContext('2d');

function renderPreview(){
  if (!cards.length) return;
  drawCard(pctx, cards[active], active, cards.length);
}

function renderThumbs(){
  const wrap = $('#thumbs');
  wrap.innerHTML = '';
  cards.forEach((card, i) => {
    const btn = document.createElement('button');
    btn.className = 'thumb' + (i === active ? ' active' : '');
    btn.type = 'button';
    btn.onclick = () => { active = i; renderAll(); };
    const cv = document.createElement('canvas');
    cv.width = 240; cv.height = 240;
    const c = cv.getContext('2d');
    c.scale(240 / W, 240 / H);
    drawCard(c, card, i, cards.length);
    const tag = document.createElement('b');
    tag.textContent = String(i + 1).padStart(2, '0');
    btn.append(cv, tag);
    wrap.appendChild(btn);
  });
  $('#cardCount').textContent = cards.length;
}

function renderEditor(){
  const card = cards[active];
  $('#pageTag').textContent = String(active + 1).padStart(2, '0');

  const sel = $('#template');
  sel.innerHTML = Object.entries(TEMPLATES)
    .map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');
  sel.value = card.template;

  const sw = $('#swatches');
  sw.innerHTML = '';
  BG_ORDER.forEach(key => {
    const b = document.createElement('button');
    b.className = 'swatch' + (card.bg === key ? ' active' : '');
    b.type = 'button';
    b.title = BG_LABEL[key];
    b.style.background = THEMES[key].bg;
    b.onclick = () => { card.bg = key; commit(); };
    sw.appendChild(b);
  });

  const fields = $('#fields');
  fields.innerHTML = '';
  TEMPLATES[card.template].fields.forEach(f => {
    const box = document.createElement('div');
    box.className = 'field';
    const label = document.createElement('label');
    label.textContent = f.label;
    const input = f.type === 'area' ? document.createElement('textarea') : document.createElement('input');
    if (f.type === 'area') input.rows = f.rows || 3; else input.type = 'text';
    input.value = card[f.key] || '';
    input.oninput = () => { card[f.key] = input.value; save(); renderPreview(); renderThumbs(); };
    label.htmlFor = input.id = 'field-' + f.key;
    box.append(label, input);
    fields.appendChild(box);
  });
}

function renderAll(){ renderPreview(); renderThumbs(); renderEditor(); }
function commit(){ save(); renderAll(); }

/* ---------- 조작 ---------- */
$('#template').onchange = e => { cards[active].template = e.target.value; commit(); };

$('#addCard').onclick = () => {
  cards.splice(active + 1, 0, {template:'statement', bg:'paper', eyebrow:'', title:'새 카드의\n*문장*', note:''});
  active += 1;
  commit();
};
$('#dupCard').onclick = () => { cards.splice(active + 1, 0, clone(cards[active])); active += 1; commit(); };
$('#delCard').onclick = () => {
  if (cards.length === 1) return;
  cards.splice(active, 1);
  active = Math.min(active, cards.length - 1);
  commit();
};
$('#moveUp').onclick = () => {
  if (active === 0) return;
  [cards[active - 1], cards[active]] = [cards[active], cards[active - 1]];
  active -= 1; commit();
};
$('#moveDown').onclick = () => {
  if (active === cards.length - 1) return;
  [cards[active + 1], cards[active]] = [cards[active], cards[active + 1]];
  active += 1; commit();
};
$('#resetAll').onclick = () => {
  if (!confirm('모든 카드를 기본 내용으로 되돌릴까요? 지금 편집한 내용은 사라집니다.')) return;
  cards = clone(DEFAULT_CARDS);
  active = 0;
  commit();
};

/* ---------- 저장 / 불러오기 ---------- */
function download(url, name){
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function exportCard(index){
  return new Promise(resolve => {
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    drawCard(cv.getContext('2d'), cards[index], index, cards.length);
    cv.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      download(url, `bme-cardnews-${String(index + 1).padStart(2, '0')}.png`);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      resolve();
    }, 'image/png');
  });
}

$('#exportOne').onclick = () => exportCard(active);
$('#exportAll').onclick = async e => {
  const btn = e.currentTarget;
  btn.disabled = true;
  for (let i = 0; i < cards.length; i++){
    btn.textContent = `저장 중 ${i + 1}/${cards.length}`;
    await exportCard(i);
    await new Promise(r => setTimeout(r, 350));
  }
  btn.textContent = '전체 PNG';
  btn.disabled = false;
};

$('#saveJson').onclick = () => {
  const blob = new Blob([JSON.stringify(cards, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  download(url, 'bme-cardnews.json');
  setTimeout(() => URL.revokeObjectURL(url), 4000);
};

$('#loadJson').onclick = () => $('#fileInput').click();
$('#fileInput').onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed) || !parsed.length) throw new Error('빈 파일');
      cards = parsed;
      active = 0;
      commit();
    } catch (err) {
      alert('카드뉴스 JSON 파일을 읽지 못했어요.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
};

/* ---------- 시작 ---------- */
renderAll();
if (document.fonts && document.fonts.ready){
  Promise.all([
    document.fonts.load('400 96px "DM Serif Display"'),
    document.fonts.load('italic 400 96px "DM Serif Display"'),
    document.fonts.load('800 22px Manrope'),
    document.fonts.load('500 30px Manrope'),
    document.fonts.load('600 34px "Noto Sans KR"'),
    document.fonts.load('800 22px "Noto Sans KR"'),
  ]).catch(() => {}).then(() => document.fonts.ready).then(renderAll);
}
