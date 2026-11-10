const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const music = $('#backgroundMusic');
const musicToggle = $('#musicToggle');
let musicOn = false;
let uiSounds = true;

function toast(message){
  const el=$('#toast'); el.textContent=message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2800);
}
async function toggleMusic(){
  if(!musicOn){
    try { await music.play(); musicOn=true; musicToggle.classList.add('active'); musicToggle.setAttribute('aria-label','Выключить музыку'); toast('Музыка включена. Приятного путешествия ♡'); }
    catch(e){ toast('Добавь файл assets/music.mp3, чтобы включить музыку.'); }
  } else { music.pause(); musicOn=false; musicToggle.classList.remove('active'); musicToggle.setAttribute('aria-label','Включить музыку'); }
}
musicToggle.addEventListener('click',toggleMusic);
$('#soundToggle').addEventListener('click',e=>{uiSounds=!uiSounds;e.currentTarget.classList.toggle('active',!uiSounds);e.currentTarget.textContent=uiSounds?'♪':'×';toast(uiSounds?'Звуки интерфейса включены':'Звуки интерфейса выключены')});
$('#beginJourney').addEventListener('click',()=>{if(!musicOn)toggleMusic();$('#intro').scrollIntoView({behavior:'smooth'});});
$$('.nav a').forEach(a=>a.addEventListener('click',()=>{if(uiSounds)document.body.classList.add('flash');setTimeout(()=>document.body.classList.remove('flash'),700)}));

/* Scroll reveal */
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

/* Pointer glow and gentle parallax */
const glow=$('.cursor-glow');
window.addEventListener('pointermove',e=>{
  glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';
  const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*10;
  $('.moon').style.transform=`translate(${x}px,${y}px)`;
},{passive:true});

/* Canvas star particles */
const canvas=$('#particles'),ctx=canvas.getContext('2d');let stars=[];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);stars=Array.from({length:Math.min(95,Math.floor(innerWidth/13))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.25,a:Math.random()*.65+.15,s:Math.random()*.007+.002,p:Math.random()*6.28}))}
function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);stars.forEach(st=>{st.p+=st.s;const alpha=st.a*(.65+Math.sin(st.p)*.35);ctx.beginPath();ctx.arc(st.x,st.y,st.r,0,Math.PI*2);ctx.fillStyle=`rgba(239,220,255,${alpha})`;ctx.shadowBlur=st.r*8;ctx.shadowColor='#c6a1ef';ctx.fill()});requestAnimationFrame(draw)}
window.addEventListener('resize',resize);resize();draw();

/* Falling petals */
function createPetal(){const p=document.createElement('span');p.className='petal';p.textContent=Math.random()>.5?'✧':'❀';p.style.left=Math.random()*100+'vw';p.style.fontSize=(9+Math.random()*13)+'px';p.style.opacity=.25+Math.random()*.5;p.style.animationDuration=(9+Math.random()*9)+'s';p.style.setProperty('--drift',(Math.random()*180-90)+'px');document.body.appendChild(p);setTimeout(()=>p.remove(),19000)}
setInterval(createPetal,1300);

/* 22 clickable flowers — replace these sample reasons with your own */
const reasons=[
'За твоё чувство юмора.','За искренность.','За наши странные шутки.','За то, что с тобой легко.',
'За твой характер.','За наши разговоры.','За твою индивидуальность.','За умение рассмешить.',
'За поддержку.','За спонтанность.','За маленькие традиции.','За твою смелость.',
'За то, что ты настоящая.','За наши воспоминания.','За твою энергию.','За твою доброту.',
'За твой взгляд на мир.','За все «ганабаре».','За мировую Шиноби.','За злодейские жесты рукой.',
'За то, что ты — это ты.','И просто за то, что ты есть.'
];
const garden=$('#reasonGarden');
reasons.forEach((reason,i)=>{
  const b=document.createElement('button');b.className='reason-flower reveal';b.type='button';
  b.innerHTML=`<span class="bloom">${['✿','❀','✾','✽'][i%4]}</span><small>FLOWER ${String(i+1).padStart(2,'0')}</small>`;
  b.addEventListener('click',()=>toast(reason));garden.appendChild(b);observer.observe(b);
});

/* Secret Shinobi sequence */
let secretClicks=0,secretOpened=false;
const seal=$('#secretSeal'),secretButton=$('#secretButton');
function openSecret(){
  if(secretOpened){toast('Секрет уже раскрыт, шиноби.');return}
  secretClicks++;$('#secretCounter').textContent=`HIDDEN EASTER EGG: ${secretClicks} / 5`;
  if(secretClicks>=5){
    secretOpened=true;$('#secretTitle').textContent='GANBARE, HADI!!!';
    $('#secretText').textContent='Я начинаю третью мировую Шиноби! Но сначала — приказываю тебе быть счастливой, смеяться чаще и никогда не забывать, насколько ты крутая. ДАТТЕБАЙО!!!';
    secretButton.textContent='СЕКРЕТ РАСКРЫТ';seal.textContent='卍';seal.classList.add('flash');
    document.body.classList.add('flash');setTimeout(()=>document.body.classList.remove('flash'),700);
    toast('СИСТЕМА ШИНОБИ АКТИВИРОВАНА 😈');
  } else {toast(`Печать сопротивляется... ещё ${5-secretClicks} нажатий.`)}
}
seal.addEventListener('click',openSecret);seal.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openSecret()}});
secretButton.addEventListener('click',openSecret);

/* Birthday wish — a burst of glowing symbols */
function celebrate(){
  for(let i=0;i<34;i++){
    const s=document.createElement('span');s.className='petal';s.textContent=['✦','✧','❀','♡'][i%4];
    s.style.left=(10+Math.random()*80)+'vw';s.style.top=(15+Math.random()*55)+'vh';s.style.animationDuration=(2+Math.random()*3)+'s';s.style.fontSize=(14+Math.random()*20)+'px';s.style.setProperty('--drift',(Math.random()*240-120)+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),5500);
  }
  toast('Желание принято. Пусть сбудется самое прекрасное. ✨');
}
$('#celebrateButton').addEventListener('click',celebrate);

/* Optional typewriter effect for the letter */
const letter=$('#letterText');
if(letter){const paragraphs=[...letter.children];paragraphs.forEach((p,i)=>{p.style.opacity='0';p.style.transform='translateY(8px)';p.style.transition=`opacity .7s ${i*.18}s, transform .7s ${i*.18}s`});
 const letterObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){paragraphs.forEach(p=>{p.style.opacity='1';p.style.transform='translateY(0)'});letterObserver.disconnect()}},{threshold:.25});letterObserver.observe(letter);}
