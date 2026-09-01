const missions = [
  {week:'WEEK 1 · 발견', title:'버크만 디브리핑', detail:'진단 결과 업로드', done:true},
  {week:'WEEK 2 · 언어', title:'나의 강점 찾기', detail:'무료 강점 진단', done:true},
  {week:'WEEK 2 · 언어', title:'이키가이 그려보기', detail:'내가 오래 할 수 있는 일', done:true},
  {week:'WEEK 3 · 방향', title:'나만의 만트라 만들기', detail:'나를 이끄는 한 문장', done:true},
  {week:'WEEK 4 · 시각화', title:'비전보드 만들기', detail:'내가 향하는 풍경', done:false, current:true},
  {week:'WEEK 5 · 표현', title:'브랜드 스토리 쓰기', detail:'세상에 건넬 나의 이야기', done:false},
  {week:'WEEK 6 · 완성', title:'나만의 브랜드 북', detail:'여정의 모든 기록을 한 권에', done:false},
];
const books = [
  {name:'김양희', initials:'양', title:'천천히,
나답게 피어나는 사람', copy:'작은 루틴과 다정한 언어로 마음의 여백을 만드는 브랜드.', label:'BRAND BOOK 01'},
  {name:'김은주', initials:'은', title:'나의 속도로
세상에 닿는 일', copy:'평범한 하루에서 발견한 이야기를 단단한 콘텐츠로 전합니다.', label:'BRAND BOOK 02'},
  {name:'강나영', initials:'나', title:'꾸준함이 만드는
나만의 장면', copy:'삶과 일을 연결하며 조금씩 더 나다운 길을 찾습니다.', label:'BRAND BOOK 03'},
];
const posts = [
  {name:'은주', tag:'#브랜드일기', text:'오늘은 “잘해야 한다” 대신 “계속 해보자”를 선택했어요. 작은 시도도 내 브랜드의 일부가 되겠죠?', time:'12분 전'},
  {name:'나영', tag:'#서로의성장', text:'양희님의 비전보드에서 용기를 얻었어요. 우리, 다음 주엔 함께 콘텐츠 하나를 올려 볼까요?', time:'1시간 전'},
  {name:'dr.summmmer', tag:'#스타트업', text:'라엘은 모두가 알다시피 미국에서 시작했다. 물론 미국에서도 의사, 과학자, 대학, 인증과 같은 authority는 강력하다. 하지만 미국 소비자 브랜드를 보다 보면 또 하나 눈에 띄는 방식이 있다. “내가 누구인지, 왜 이 문제를 풀고 싶은지” 자체를 신뢰의 근거로 만드는 것이다. 라엘의 브랜드 스토리에서 전면에 등장하는 것은 파운더의 학벌보다, 여성들이 자신의 몸을 위해 더 나은 선택을 할 수 있어야 한다는 \'관점\'이다. 그리고 여기에 창업자의 Korean heritage와 한국 제조 기술에 대한 이미지, 실제 제품력이 함께 쌓이면서 미국 시장에서 한 획을 그은 브랜드가 되었다. 그래서 나는 종종 이런 생각을 한다. 이 관점으로 스텔라가 해외시장 타겟으로 Tea 브랜드 런칭할 수 있을까?', time:'2시간 전'},
  {name:'현주', tag:'#AfterBMe', text:'졸업 후에도 이렇게 서로의 이야기를 들을 수 있어 참 좋아요.', time:'어제'},
];
const $ = s => document.querySelector(s);
const missionList = $('#missionList');
missionList.innerHTML = missions.map((m,i)=>`<article class="mission ${m.done?'done':''} ${m.current?'current':''}" data-mission="${i}"><p class="week">${m.week}</p><h3>${m.title}</h3><small>${m.done?'✓ 완료':'○ '+m.detail}</small>${m.done?'<span class="check">✓</span>':''}</article>`).join('');
const bookGrid = $('#bookGrid');
bookGrid.innerHTML = books.map((b,i)=>`<article class="book" data-book="${i}"><div class="book-top"><span>${b.label}</span><span>↗</span></div><h3>${b.title.replace('\n','<br>')}</h3><div><p>${b.copy}</p><div class="book-meta"><span class="mini-avatar">${b.initials}</span>${b.name}</div></div></article>`).join('');
const renderPosts=()=>$('#communityPosts').innerHTML=posts.map(p=>`<article class="post"><div class="post-top"><span><span class="tag">${p.tag}</span>${p.name}</span><time>${p.time}</time></div><p>${p.text}</p></article>`).join('');renderPosts();
const modal=$('#modal'),modalContent=$('#modalContent');
const openModal=html=>{modalContent.innerHTML=html;modal.showModal()};
$('.close').onclick=()=>modal.close();
document.querySelectorAll('[data-scroll]').forEach(b=>b.onclick=()=>$('#'+b.dataset.scroll).scrollIntoView({behavior:'smooth'}));
document.querySelectorAll('.mission').forEach(el=>el.onclick=()=>{const m=missions[el.dataset.mission];openModal(`<div class="modal-form"><p class="eyebrow">${m.week}</p><h2>${m.title}</h2><p>${m.done?'완료한 미션이에요. 기록을 다시 보거나 보완할 수 있습니다.':'이 미션을 시작할 준비가 되었어요.'}</p><textarea placeholder="이 미션에서 발견한 것을 기록해 보세요."></textarea><button class="primary" onclick="this.closest('dialog').close()">${m.done?'기록 보기':'미션 시작하기'} <span>→</span></button></div>`)});
document.querySelectorAll('.book').forEach(el=>el.onclick=()=>{const b=books[el.dataset.book];openModal(`<article class="modal-book"><p class="eyebrow">${b.label} · ${b.name}</p><h2>${b.title.replace('\n','<br>')}</h2><p>${b.copy}</p><hr><p><b>내가 소중히 여기는 것</b><br>꾸준함, 다정함, 그리고 내 속도로 걸어가는 용기.</p><p><b>세상에 건네는 가치</b><br>나답게 살아갈 용기를 만드는 이야기.</p></article>`)});
$('#openBookGallery').onclick=()=>$('#books').scrollIntoView({behavior:'smooth'});
const answer=$('#dailyAnswer'), count=$('#charCount');answer.value=localStorage.getItem('bme-answer')||'';count.textContent=`${answer.value.length} / 500`;answer.oninput=()=>count.textContent=`${answer.value.length} / 500`;
$('#saveAnswer').onclick=()=>{if(!answer.value.trim())return $('#savedMessage').textContent='한 문장만이라도 남겨 주세요.';localStorage.setItem('bme-answer',answer.value);$('#savedMessage').textContent='오늘의 마음을 안전하게 기록했어요. ✦'};
$('#writePost').onclick=()=>openModal(`<div class="modal-form"><p class="eyebrow">AFTER B, ME</p><h2>오늘의 이야기를<br>남겨 보세요.</h2><textarea id="postText" placeholder="졸업생에게 건네고 싶은 오늘의 이야기를 적어 주세요."></textarea><button class="primary" id="submitPost">공유하기 <span>→</span></button></div>`);
modal.addEventListener('click',e=>{if(e.target.id==='submitPost'){const v=$('#postText').value.trim();if(v){posts.unshift({name:'김양희',tag:'#나의기록',text:v,time:'방금'});renderPosts();modal.close()}}});
$('#joinAfter').onclick=()=>$('#after').scrollIntoView({behavior:'smooth'});
$('#profileButton').onclick=()=>openModal(`<div class="modal-form"><p class="eyebrow">MY PROFILE</p><h2>김양희님의<br>브랜드 여정</h2><p>현재 2기 챌린지를 진행하고 있어요.</p><button class="primary" onclick="this.closest('dialog').close()">프로필 설정 <span>→</span></button></div>`);
