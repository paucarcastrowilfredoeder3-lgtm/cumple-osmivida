/* ══ FUEGOS ARTIFICIALES ══ */
const fwCanvas = document.getElementById('fireworks');
const fwCtx    = fwCanvas ? fwCanvas.getContext('2d') : null;

function resizeFW() {
  if (!fwCanvas) return;
  fwCanvas.width  = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
resizeFW();
window.addEventListener('resize', resizeFW);

const FW_COLORS = ['#ff4d8d','#ff80b3','#ff006e','#ffb3cc','#ff1493','#ff69b4','#ffd700','#ffffff'];

class FWParticle {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1;
    this.decay = .013 + Math.random() * .018;
    this.radius = 2 + Math.random() * 2;
    this.gravity = .06;
    this.trail = [];
  }
  update() {
    this.trail.push({x:this.x, y:this.y});
    if (this.trail.length > 7) this.trail.shift();
    this.vy += this.gravity; this.vx *= .97;
    this.x += this.vx; this.y += this.vy;
    this.life -= this.decay;
  }
  draw() {
    if (!fwCtx) return;
    this.trail.forEach((t,i) => {
      const a = (i/this.trail.length)*this.life*.4;
      fwCtx.beginPath(); fwCtx.arc(t.x,t.y,this.radius*.5,0,Math.PI*2);
      fwCtx.fillStyle=`rgba(255,100,160,${a})`; fwCtx.fill();
    });
    fwCtx.beginPath(); fwCtx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    fwCtx.fillStyle=this.color; fwCtx.globalAlpha=this.life; fwCtx.fill();
    fwCtx.globalAlpha=1;
  }
}

class Firework {
  constructor() {
    if (!fwCanvas) return;
    this.x = fwCanvas.width*(.15+Math.random()*.7);
    this.y = fwCanvas.height*(.05+Math.random()*.45);
    this.color = FW_COLORS[Math.floor(Math.random()*FW_COLORS.length)];
    this.particles = [];
    this.flash = 1;
    for (let i=0;i<80;i++) this.particles.push(new FWParticle(this.x,this.y,this.color));
  }
  update() {
    this.flash = Math.max(0, this.flash-.08);
    this.particles.forEach(p=>p.update());
    this.particles = this.particles.filter(p=>p.life>0);
  }
  draw() {
    if (!fwCtx) return;
    if (this.flash>0) {
      fwCtx.save(); fwCtx.globalAlpha=this.flash*.7;
      const g=fwCtx.createRadialGradient(this.x,this.y,0,this.x,this.y,40);
      g.addColorStop(0,'#fff'); g.addColorStop(.4,this.color); g.addColorStop(1,'transparent');
      fwCtx.fillStyle=g; fwCtx.beginPath(); fwCtx.arc(this.x,this.y,40,0,Math.PI*2); fwCtx.fill();
      fwCtx.restore();
    }
    this.particles.forEach(p=>p.draw());
  }
  get done() { return this.particles.length===0; }
}

let fireworks=[], fwActive=false, fwInterval=null;

function launchFirework() { if(fwCanvas) fireworks.push(new Firework()); }

function fwLoop() {
  if (!fwCtx) return;
  fwCtx.clearRect(0,0,fwCanvas.width,fwCanvas.height);
  fireworks.forEach(f=>{f.update();f.draw();});
  fireworks = fireworks.filter(f=>!f.done);
  if (fwActive||fireworks.length>0) requestAnimationFrame(fwLoop);
}

function startFireworks() {
  if (fwActive) return;
  fwActive = true;
  for (let i=0;i<6;i++) setTimeout(launchFirework, i*280);
  fwInterval = setInterval(launchFirework, 1800);
  fwLoop();
}


/* ══ MÚSICA - MP3 directo ══ */
const musicFab = document.getElementById('musicFab');
const bdayMusic = document.getElementById('bdayMusic');
let musicOn = false;

function iosStart() {
  // Esconder overlay
  const overlay = document.getElementById('iosPlay');
  if (overlay) overlay.style.display = 'none';
  // Arrancar música — llamado directo desde tap del usuario = iOS lo permite
  bdayMusic.volume = 1.0;
  bdayMusic.play().then(() => {
    musicOn = true;
    if (musicFab) { musicFab.textContent='🔊'; musicFab.classList.add('on'); }
  }).catch(e => console.log(e));
}

function startMusic() {
  if (!bdayMusic || musicOn) return;
  bdayMusic.volume = 1.0;
  bdayMusic.play().then(() => {
    musicOn = true;
    if (musicFab) { musicFab.textContent='🔊'; musicFab.classList.add('on'); }
  }).catch(e => console.log(e));
}

function autoplayMusic() { startMusic(); }

function toggleBdayMusic() {
  if (!bdayMusic) return;
  if (musicOn) {
    bdayMusic.pause();
    if (musicFab) { musicFab.textContent='🎵'; musicFab.classList.remove('on'); }
    musicOn = false;
  } else {
    bdayMusic.play();
    if (musicFab) { musicFab.textContent='🔊'; musicFab.classList.add('on'); }
    musicOn = true;
  }
}


/* ══ PARTÍCULAS ROSAS ══ */
const pinkParticles = document.getElementById('pinkParticles');
const PP_COLORS = ['#ff4d8d','#ff80b3','#ff006e','#ffb3cc','#ff1493','#ffd700'];

function createPP() {
  if (!pinkParticles) return;
  const el = document.createElement('div');
  el.classList.add('pp');
  const size=4+Math.random()*8, dur=6+Math.random()*8, del=Math.random()*4;
  el.style.cssText=`left:${Math.random()*100}%;width:${size}px;height:${size}px;
    background:${PP_COLORS[Math.floor(Math.random()*PP_COLORS.length)]};
    animation-duration:${dur}s;animation-delay:${del}s;opacity:0;`;
  pinkParticles.appendChild(el);
  setTimeout(()=>el.remove(),(dur+del)*1000);
}
setInterval(createPP,400);
for(let i=0;i<12;i++) createPP();

/* Tulipanes flotantes */
const decoTulips = document.getElementById('decoTulips');
const TULIP_CHARS = ['🌷','🌹','🌸'];

function createDecoTulip() {
  if (!decoTulips) return;
  const el=document.createElement('div'); el.classList.add('dt');
  const dur=8+Math.random()*10, del=Math.random()*5;
  el.textContent=TULIP_CHARS[Math.floor(Math.random()*TULIP_CHARS.length)];
  el.style.cssText=`left:${Math.random()*100}%;bottom:-40px;
    font-size:${1+Math.random()}rem;animation-duration:${dur}s;animation-delay:${del}s;`;
  decoTulips.appendChild(el);
  setTimeout(()=>el.remove(),(dur+del)*1000);
}
setInterval(createDecoTulip,900);
for(let i=0;i<8;i++) createDecoTulip();


/* ══ INTRO - NOMBRE LETRA POR LETRA ══ */
const NAME = 'Iris Lizeth';

function typeNameLetters() {
  const container = document.getElementById('introName');
  const introPost = document.getElementById('introPost');
  const btnEnter  = document.getElementById('btnEnter');
  if (!container) return;
  container.innerHTML = '';

  let i=0;
  function next() {
    if (i>=NAME.length) {
      setTimeout(()=>{ if(introPost){introPost.textContent='¡Feliz Cumpleaños! 🎂';introPost.style.opacity='1';} },400);
      return;
    }
    const ch=NAME[i];
    if (ch===' ') {
      const sp=document.createElement('span'); sp.classList.add('char-space'); container.appendChild(sp);
    } else {
      const span=document.createElement('span'); span.classList.add('char');
      span.textContent=ch; span.style.animationDelay='0s'; container.appendChild(span);
    }
    i++;
    setTimeout(next, ch===' '?80:130);
  }
  next();
}

function spawnIntroBgHearts() {
  const c=document.getElementById('introHeartsBg');
  if (!c) return;
  const emojis=['💖','💗','💕','💞','✨','🌸','🌷'];
  function spawn(){
    const el=document.createElement('div'); el.classList.add('ibh');
    const dur=6+Math.random()*8, del=Math.random()*3;
    el.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    el.style.cssText=`left:${Math.random()*100}%;bottom:-40px;
      font-size:${1+Math.random()*1.4}rem;animation-duration:${dur}s;animation-delay:${del}s;`;
    c.appendChild(el);
    setTimeout(()=>el.remove(),(dur+del)*1000);
  }
  setInterval(spawn,700);
  for(let i=0;i<8;i++) spawn();
}


/* ══ TRANSICIÓN: INTRO → MAIN ══ */
function goToMain() {
  const sIntro = document.getElementById('sIntro');
  const sMain  = document.getElementById('sMain');
  if (!sMain) return;

  startFireworks();

  if (sIntro) {
    sIntro.style.transition = 'opacity .9s ease';
    sIntro.style.opacity    = '0';
    sIntro.style.pointerEvents = 'none';
  }

  setTimeout(() => {
    if (sIntro) sIntro.style.display = 'none';
    sMain.style.display    = 'flex';
    sMain.style.opacity    = '0';
    sMain.style.transition = 'opacity 1s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { sMain.style.opacity='1'; });
    });
    setTimeout(() => {
      clearInterval(fwInterval);
      fwInterval = setInterval(launchFirework, 6000);
    }, 8000);
    setTimeout(setupReveal, 400);
    // Música al entrar
    setTimeout(autoplayMusic, 500);
  }, 950);
}


/* ══ REVEAL ON SCROLL ══ */
function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e,i) => {
      if (e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'), i*80);
    });
  }, {threshold:.12});
  els.forEach(el=>obs.observe(el));
  setupReasons();
}


/* ══ SOBRE ANIMADO ══ */
let envelopeOpened = false;
function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  const flap=document.getElementById('envFlap');
  const seal=document.getElementById('envSeal');
  const tapHint=document.getElementById('envTapHint');
  const letterCard=document.getElementById('letterCard');
  const wrapper=document.getElementById('envelopeWrapper');
  if (seal) seal.classList.add('gone');
  if (tapHint) tapHint.style.opacity='0';
  setTimeout(()=>{ if(flap) flap.classList.add('open'); },200);
  setTimeout(()=>{ if(wrapper){wrapper.style.transition='opacity .5s';wrapper.style.opacity='.7';} },800);
  setTimeout(()=>{
    if (letterCard) letterCard.style.display='block';
    const sec=document.getElementById('envelopeSection');
    if (sec) burstHeartsFrom(sec);
  },1100);
}


/* ══ VELA - MICRÓFONO ══ */
let candleBlown=false, audioCtx2=null, analyser=null, micStream=null, blowTimer=null;

function startBlowDetection() {
  if (candleBlown) return;
  const btn=document.getElementById('micBtn');
  const hint=document.getElementById('candleHint');
  if (btn){btn.textContent='🎤 Escuchando... sopla!';btn.classList.add('listening');}
  if (hint) hint.textContent='🎤 Ya puedes soplar...';
  navigator.mediaDevices?.getUserMedia({audio:true,video:false})
    .then(stream=>{
      micStream=stream;
      audioCtx2=new (window.AudioContext||window.webkitAudioContext)();
      analyser=audioCtx2.createAnalyser(); analyser.fftSize=256;
      audioCtx2.createMediaStreamSource(stream).connect(analyser);
      const data=new Uint8Array(analyser.frequencyBinCount);
      blowTimer=setInterval(()=>{
        analyser.getByteFrequencyData(data);
        const avg=data.slice(0,10).reduce((a,b)=>a+b,0)/10;
        if(avg>55) blowCandle();
      },100);
    })
    .catch(()=>{
      if(btn){btn.textContent='🎤 Activar micrófono';btn.classList.remove('listening');}
      if(hint) hint.textContent='⚠️ Toca la llama para apagarla';
      document.getElementById('flameWrapper')?.addEventListener('click',blowCandle,{once:true});
    });
}

function blowCandle() {
  if (candleBlown) return;
  candleBlown=true;
  clearInterval(blowTimer);
  micStream?.getTracks().forEach(t=>t.stop());
  audioCtx2?.close();
  document.getElementById('flameWrapper')?.classList.add('out');
  const btn=document.getElementById('micBtn');
  if(btn){btn.textContent='🕯️ ¡Soplaste!';btn.classList.remove('listening');btn.disabled=true;}
  const hint=document.getElementById('candleHint');
  if(hint) hint.textContent='🌟 ¡Pediste tu deseo!';
  const wish=document.getElementById('wishMessage');
  if(wish) wish.style.display='block';
  for(let i=0;i<4;i++) setTimeout(launchFirework,i*300);
  burstHeartsCenter();
}


/* ══ RAZONES ══ */
const REASONS=[
  {icon:'💖',text:'Por tu sonrisa que ilumina todo'},
  {icon:'🌷',text:'Por lo única e irrepetible que eres'},
  {icon:'✨',text:'Por hacerme reír sin razón'},
  {icon:'💕',text:'Por hacer cada día especial'},
  {icon:'🌹',text:'Por tu fuerza y tu hermosa forma de ser'},
  {icon:'💫',text:'Por ser la persona que más admiro'},
  {icon:'🎂',text:'Por existir y llenar de luz mi vida'},
  {icon:'🥰',text:'Por quererme como nadie más podría'},
];

function setupReasons() {
  const grid=document.getElementById('reasonsGrid');
  if(!grid||grid.children.length>0) return;
  REASONS.forEach((r,i)=>{
    const card=document.createElement('div'); card.classList.add('reason-card');
    card.innerHTML=`<span class="reason-icon">${r.icon}</span>${r.text}`;
    grid.appendChild(card);
    setTimeout(()=>card.classList.add('visible'),200+i*150);
  });
}


/* ══ EXPLOSIÓN DE CORAZONES ══ */
const BURST_EMOJIS=['💖','💗','💓','💕','💞','❤️','✨','🌸','🌷'];

function burstHeartsCenter() {
  spawnBurst(window.innerWidth/2, window.innerHeight/2, 28);
}
function burstHeartsFrom(el) {
  const r=el.getBoundingClientRect();
  spawnBurst(r.left+r.width/2, r.top+r.height/2, 20);
}
function burstHearts() {
  burstHeartsCenter();
  launchFirework();
}
function spawnBurst(ox,oy,count) {
  for(let i=0;i<count;i++){
    const el=document.createElement('div');
    const angle=(Math.PI*2/count)*i+(Math.random()-.5)*.6;
    const dist=80+Math.random()*160;
    el.textContent=BURST_EMOJIS[Math.floor(Math.random()*BURST_EMOJIS.length)];
    el.style.cssText=`position:fixed;left:${ox}px;top:${oy}px;
      font-size:${.9+Math.random()*1.4}rem;pointer-events:none;z-index:8000;
      transition:transform 1.4s ease-out,opacity 1.4s ease-out;opacity:1;`;
    document.body.appendChild(el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      el.style.transform=`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(1.6)`;
      el.style.opacity='0';
    }));
    setTimeout(()=>el.remove(),1500);
  }
}


/* ══ INIT ══ */
document.addEventListener('DOMContentLoaded', () => {
  // Crear contenedor de ripples
  const rc = document.createElement('div');
  rc.classList.add('ripple-container');
  rc.id = 'rippleContainer';
  document.body.appendChild(rc);

  spawnIntroBgHearts();
  setTimeout(typeNameLetters, 600);
  document.addEventListener('click', function firstClick() {
    if (musicOn) autoplayMusic();
    document.removeEventListener('click', firstClick);
  }, {once:true});
});

// ══ RIPPLE DE AGUA CON PARTÍCULAS ══
const RIPPLE_PARTICLES = ['💖','🌷','🌹','⭐','✨','💫','🌸'];

function createRipple(e) {
  const rc = document.getElementById('rippleContainer');
  if (!rc) return;

  const x = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth/2;
  const y = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight/2;

  // Onda de agua
  const wave = document.createElement('div');
  wave.classList.add('ripple-wave');
  const size = 60 + Math.random() * 40;
  wave.style.cssText = `
    left:${x}px; top:${y}px;
    width:${size}px; height:${size}px;
    background: radial-gradient(circle, rgba(255,77,141,0.4) 0%, rgba(255,0,110,0.15) 50%, transparent 70%);
    border: 1px solid rgba(255,100,160,0.5);
    animation-duration: ${0.6 + Math.random()*0.3}s;
  `;
  rc.appendChild(wave);
  setTimeout(() => wave.remove(), 900);

  // Partículas volando
  const count = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('ripple-particle');
    p.textContent = RIPPLE_PARTICLES[Math.floor(Math.random() * RIPPLE_PARTICLES.length)];
    const angle  = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.8;
    const dist   = 40 + Math.random() * 80;
    const dur    = 0.5 + Math.random() * 0.4;
    const rot    = (Math.random() - 0.5) * 360;
    p.style.cssText = `
      left:${x}px; top:${y}px;
      --tx:${Math.cos(angle)*dist}px;
      --ty:${Math.sin(angle)*dist}px;
      --rot:${rot}deg;
      animation-duration:${dur}s;
      font-size:${0.8 + Math.random()*0.8}rem;
    `;
    rc.appendChild(p);
    setTimeout(() => p.remove(), dur * 1000 + 100);
  }
}

// Activar ripple en click y touch
document.addEventListener('click', createRipple);
document.addEventListener('touchstart', (e) => createRipple(e), {passive:true});

/* ══ CANVAS FONDO: ESTRELLAS + SATURNO ROSADO ══ */
(function() {
  const bg   = document.getElementById('bgCanvas');
  if (!bg) return;
  const bctx = bg.getContext('2d');

  function resize() {
    bg.width  = window.innerWidth;
    bg.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Estrellas ──
  class BGStar {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * bg.width;
      this.y    = Math.random() * bg.height;
      this.r    = Math.random() * 1.4 + 0.2;
      this.tw   = Math.random() * Math.PI * 2;
      this.spd  = 0.025 + Math.random() * 0.035;
      this.cross = Math.random() < 0.22;
      const t = [[255,255,255],[255,210,230],[255,230,150],[200,210,255]];
      this.col = t[Math.floor(Math.random()*t.length)];
    }
    draw() {
      this.tw += this.spd;
      const op = 0.15 + Math.abs(Math.sin(this.tw)) * 0.85;
      const rr = this.r * (0.5 + Math.abs(Math.sin(this.tw)));
      const [r,g,b] = this.col;
      if (this.cross) {
        bctx.save();
        bctx.translate(this.x, this.y);
        bctx.globalAlpha = op;
        const s = rr * 3;
        const gd = bctx.createRadialGradient(0,0,0,0,0,s);
        gd.addColorStop(0,`rgba(${r},${g},${b},1)`);
        gd.addColorStop(1,`rgba(${r},${g},${b},0)`);
        bctx.fillStyle = gd;
        bctx.beginPath(); bctx.arc(0,0,s,0,Math.PI*2); bctx.fill();
        bctx.strokeStyle = `rgba(${r},${g},${b},0.5)`;
        bctx.lineWidth = 0.6;
        for (let a=0;a<4;a++) {
          bctx.beginPath(); bctx.moveTo(0,0);
          bctx.lineTo(Math.cos(a*Math.PI/2)*s*2.5, Math.sin(a*Math.PI/2)*s*2.5);
          bctx.stroke();
        }
        bctx.restore();
      } else {
        bctx.beginPath(); bctx.arc(this.x,this.y,rr,0,Math.PI*2);
        bctx.fillStyle=`rgba(${r},${g},${b},${op})`; bctx.fill();
        if (rr > 1.0) {
          const gd=bctx.createRadialGradient(this.x,this.y,0,this.x,this.y,rr*4);
          gd.addColorStop(0,`rgba(${r},${g},${b},0.2)`);
          gd.addColorStop(1,`rgba(${r},${g},${b},0)`);
          bctx.beginPath(); bctx.arc(this.x,this.y,rr*4,0,Math.PI*2);
          bctx.fillStyle=gd; bctx.fill();
        }
      }
    }
  }

  // ── Saturno rosado ──
  const saturn = {
    angle: 0,
    moonAngle: 0,
    get x() { return bg.width * 0.82; },
    get y() { return bg.height * 0.18; },
  };

  function drawSaturn() {
    const x = saturn.x, y = saturn.y, r = 38;

    // Glow
    const glow = bctx.createRadialGradient(x,y,0,x,y,r*3.5);
    glow.addColorStop(0,'rgba(255,100,180,0.25)');
    glow.addColorStop(1,'rgba(255,100,180,0)');
    bctx.beginPath(); bctx.arc(x,y,r*3.5,0,Math.PI*2);
    bctx.fillStyle=glow; bctx.fill();

    // Anillos traseros
    bctx.save(); bctx.translate(x,y); bctx.scale(1,0.28);
    bctx.beginPath(); bctx.ellipse(0,0,r*2.3,r*2.3,0,Math.PI,Math.PI*2);
    bctx.strokeStyle='rgba(255,100,170,0.55)'; bctx.lineWidth=r*0.45; bctx.stroke();
    bctx.beginPath(); bctx.ellipse(0,0,r*2.9,r*2.9,0,Math.PI,Math.PI*2);
    bctx.strokeStyle='rgba(255,150,200,0.25)'; bctx.lineWidth=r*0.2; bctx.stroke();
    bctx.restore();

    // Cuerpo
    const grad = bctx.createRadialGradient(x-r*0.3,y-r*0.35,r*0.05,x,y,r);
    grad.addColorStop(0,'#ffaad4');
    grad.addColorStop(0.5,'#ff4d9d');
    grad.addColorStop(1,'#c2185b');
    bctx.beginPath(); bctx.arc(x,y,r,0,Math.PI*2);
    bctx.fillStyle=grad; bctx.fill();

    // Brillo
    const shine=bctx.createRadialGradient(x-r*0.35,y-r*0.35,0,x-r*0.35,y-r*0.35,r*0.65);
    shine.addColorStop(0,'rgba(255,255,255,0.4)');
    shine.addColorStop(1,'rgba(255,255,255,0)');
    bctx.beginPath(); bctx.arc(x,y,r,0,Math.PI*2);
    bctx.fillStyle=shine; bctx.fill();

    // Anillos delanteros
    bctx.save(); bctx.translate(x,y); bctx.scale(1,0.28);
    bctx.beginPath(); bctx.ellipse(0,0,r*2.3,r*2.3,0,0,Math.PI);
    bctx.strokeStyle='rgba(255,100,170,0.55)'; bctx.lineWidth=r*0.45; bctx.stroke();
    bctx.beginPath(); bctx.ellipse(0,0,r*2.9,r*2.9,0,0,Math.PI);
    bctx.strokeStyle='rgba(255,150,200,0.25)'; bctx.lineWidth=r*0.2; bctx.stroke();
    bctx.restore();

    // Luna pequeña
    saturn.moonAngle += 0.008;
    const mx = x + Math.cos(saturn.moonAngle)*r*2.5;
    const my = y + Math.sin(saturn.moonAngle)*r*1.1;
    bctx.beginPath(); bctx.arc(mx,my,r*0.2,0,Math.PI*2);
    bctx.fillStyle='rgba(255,220,240,0.9)'; bctx.fill();
  }

  // ── Stars init ──
  let stars = [];
  function initStars() {
    stars = [];
    const n = Math.min(Math.floor(bg.width*bg.height/2200), 280);
    for (let i=0;i<n;i++) stars.push(new BGStar());
  }
  initStars();
  window.addEventListener('resize', initStars);

  // ── Loop ──
  function bgLoop() {
    bctx.clearRect(0,0,bg.width,bg.height);

    // Fondo degradado
    const grad=bctx.createRadialGradient(bg.width*.5,bg.height*.4,0,bg.width*.5,bg.height*.5,Math.max(bg.width,bg.height));
    grad.addColorStop(0,'#1a0030');
    grad.addColorStop(0.5,'#0d0020');
    grad.addColorStop(1,'#050008');
    bctx.fillStyle=grad; bctx.fillRect(0,0,bg.width,bg.height);

    drawSaturn();
    stars.forEach(s=>s.draw());
    requestAnimationFrame(bgLoop);
  }
  bgLoop();
})();
