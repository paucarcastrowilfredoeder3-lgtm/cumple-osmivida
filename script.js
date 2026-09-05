// ===== LÓGICA INTRO vs CUMPLEAÑOS =====
function isBirthday() {
  const now = new Date();
  return now.getMonth() === 8 && now.getDate() === 21;
}

function checkAndRender() {
  if (isBirthday()) {
    // Redirigir a la página de cumpleaños mejorada
    window.location.href = 'birthday.html';
  } else {
    startIntroCountdown();
  }
}

function startIntroCountdown() {
  const intro = document.getElementById('intro-screen');
  intro.style.display = 'flex';

  function tick() {
    const now  = new Date();
    const year = (now.getMonth() > 8 || (now.getMonth() === 8 && now.getDate() > 21))
                 ? now.getFullYear() + 1 : now.getFullYear();
    const bday = new Date(year, 8, 21, 0, 0, 0);
    const diff = bday - now;

    if (diff <= 0) {
      // ¡Llegó el día! — redirigir a birthday.html con animación
      intro.classList.add('hide');
      setTimeout(() => {
        window.location.href = 'birthday.html';
      }, 1600);
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById('intro-countdown').innerHTML =
      iBox(days,'días') + iSep() + iBox(hours,'hrs') + iSep() +
      iBox(minutes,'min') + iSep() + iBox(seconds,'seg');

    setTimeout(tick, 1000);
  }
  tick();
}

function iBox(v, l) {
  return `<div class="i-box">
    <div class="i-num">${String(v).padStart(2,'0')}</div>
    <div class="i-lbl">${l}</div>
  </div>`;
}
function iSep() { return `<div class="i-sep">:</div>`; }

// Arrancar
checkAndRender();



const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

// ===== ESTRELLAS =====
class Star {
  constructor() { this.reset(); }
  reset() {
    this.x       = Math.random() * canvas.width;
    this.y       = Math.random() * canvas.height;
    this.baseR   = Math.random() * 1.8 + 0.4;
    this.twinkle = Math.random() * Math.PI * 2;
    this.speed   = 0.02 + Math.random() * 0.04;
    const types  = [
      {r:255,g:255,b:255},
      {r:255,g:220,b:100},
      {r:255,g:150,b:200},
      {r:180,g:200,b:255},
    ];
    this.col     = types[Math.floor(Math.random() * types.length)];
    this.isCross = Math.random() < 0.2;
  }
  update() {
    this.twinkle += this.speed;
    this.r       = this.baseR * (0.5 + Math.abs(Math.sin(this.twinkle)));
    this.opacity = 0.2 + Math.abs(Math.sin(this.twinkle)) * 0.8;
  }
  draw() {
    const {r,g,b} = this.col;
    if (this.isCross) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = this.opacity;
      const s = this.r * 2.8;
      const grd = ctx.createRadialGradient(0,0,0, 0,0,s);
      grd.addColorStop(0, `rgba(${r},${g},${b},1)`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(0,0,s,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
      ctx.lineWidth   = 0.8;
      for (let a=0;a<4;a++){
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(Math.cos(a*Math.PI/2)*s*2.4, Math.sin(a*Math.PI/2)*s*2.4);
        ctx.stroke();
      }
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`;
      ctx.fill();
      if (this.r > 1.2) {
        const grd = ctx.createRadialGradient(this.x,this.y,0, this.x,this.y,this.r*4);
        grd.addColorStop(0, `rgba(${r},${g},${b},0.25)`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(this.x,this.y,this.r*4,0,Math.PI*2);
        ctx.fillStyle = grd; ctx.fill();
      }
    }
  }
}

// ===== PLANETAS =====
const PLANET_DEFS = [
  { radius:22, colors:['#ff8aaa','#ff006e','#c2185b'], rings:true,  ringColor:'rgba(255,100,160,0.5)', moons:1 },
  { radius:16, colors:['#ce93d8','#9c27b0','#7b1fa2'], rings:false, ringColor:null,                   moons:0 },
  { radius:19, colors:['#64b5f6','#1565c0','#0d47a1'], rings:true,  ringColor:'rgba(100,181,246,0.4)', moons:1 },
  { radius:28, colors:['#ffd54f','#ff8f00','#e65100'], rings:true,  ringColor:'rgba(255,200,50,0.4)',  moons:2 },
  { radius:14, colors:['#80cbc4','#00796b','#004d40'], rings:false, ringColor:null,                   moons:0 },
  { radius:12, colors:['#ef9a9a','#c62828','#b71c1c'], rings:false, ringColor:null,                   moons:0 },
];
let planets = [];

function initPlanets() {
  planets = PLANET_DEFS.map((def, i) => ({
    ...def,
    cx:        canvas.width  / 2,
    cy:        canvas.height / 2,
    orbitA:    canvas.width  * (0.28 + (i % 3) * 0.13),
    orbitB:    canvas.height * (0.20 + (i % 3) * 0.09),
    angle:     (Math.PI * 2 / PLANET_DEFS.length) * i,
    speed:     (0.0003 + i * 0.00007) * (i%2===0 ? 1 : -1),
    tilt:      (i * 0.18) - 0.3,
    moonAngle: Math.random() * Math.PI * 2,
    moonSpeed: 0.012 + i * 0.003,
  }));
}
initPlanets();
window.addEventListener('resize', () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; initPlanets(); initStars(); });

function drawPlanet(p) {
  const x = p.cx + Math.cos(p.angle)*p.orbitA*Math.cos(p.tilt) - Math.sin(p.angle)*p.orbitB*Math.sin(p.tilt);
  const y = p.cy + Math.cos(p.angle)*p.orbitA*Math.sin(p.tilt) + Math.sin(p.angle)*p.orbitB*Math.cos(p.tilt);
  const r = p.radius;

  // Órbita tenue
  ctx.save(); ctx.translate(p.cx,p.cy); ctx.rotate(p.tilt);
  ctx.beginPath(); ctx.ellipse(0,0,p.orbitA,p.orbitB,0,0,Math.PI*2);
  ctx.strokeStyle='rgba(255,255,255,0.03)'; ctx.lineWidth=1; ctx.stroke();
  ctx.restore();

  // Glow
  const glow=ctx.createRadialGradient(x,y,0,x,y,r*3.5);
  glow.addColorStop(0, p.colors[0]+'44'); glow.addColorStop(1, p.colors[2]+'00');
  ctx.beginPath(); ctx.arc(x,y,r*3.5,0,Math.PI*2); ctx.fillStyle=glow; ctx.fill();

  // Anillos traseros
  if (p.rings) {
    ctx.save(); ctx.translate(x,y); ctx.scale(1,0.28);
    ctx.beginPath(); ctx.ellipse(0,0,r*2.2,r*2.2,0,Math.PI,Math.PI*2);
    ctx.strokeStyle=p.ringColor; ctx.lineWidth=r*0.4; ctx.stroke();
    ctx.restore();
  }

  // Cuerpo
  const grad=ctx.createRadialGradient(x-r*0.3,y-r*0.35,r*0.05,x,y,r);
  grad.addColorStop(0,p.colors[0]); grad.addColorStop(0.5,p.colors[1]); grad.addColorStop(1,p.colors[2]);
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();

  // Brillo
  const shine=ctx.createRadialGradient(x-r*0.35,y-r*0.35,0,x-r*0.35,y-r*0.35,r*0.65);
  shine.addColorStop(0,'rgba(255,255,255,0.38)'); shine.addColorStop(1,'rgba(255,255,255,0)');
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fillStyle=shine; ctx.fill();

  // Anillos delanteros
  if (p.rings) {
    ctx.save(); ctx.translate(x,y); ctx.scale(1,0.28);
    ctx.beginPath(); ctx.ellipse(0,0,r*2.2,r*2.2,0,0,Math.PI);
    ctx.strokeStyle=p.ringColor; ctx.lineWidth=r*0.4; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,0,r*2.7,r*2.7,0,0,Math.PI);
    ctx.strokeStyle=p.ringColor.replace(/[\d.]+\)$/,'0.2)'); ctx.lineWidth=r*0.18; ctx.stroke();
    ctx.restore();
  }

  // Lunas
  if (p.moons>=1) {
    const mx=x+Math.cos(p.moonAngle)*r*2.3, my=y+Math.sin(p.moonAngle)*r*1.1;
    ctx.beginPath(); ctx.arc(mx,my,r*0.22,0,Math.PI*2);
    ctx.fillStyle='rgba(230,220,255,0.85)'; ctx.fill();
  }
  if (p.moons>=2) {
    const mx2=x+Math.cos(p.moonAngle+Math.PI)*r*2.6, my2=y+Math.sin(p.moonAngle+Math.PI)*r*1.2;
    ctx.beginPath(); ctx.arc(mx2,my2,r*0.17,0,Math.PI*2);
    ctx.fillStyle='rgba(200,220,255,0.7)'; ctx.fill();
  }

  p.angle     += p.speed;
  p.moonAngle += p.moonSpeed;
}

let stars = [];
function initStars() {
  stars = [];
  const n = Math.min(Math.floor(canvas.width*canvas.height/3200), 220);
  for (let i=0;i<n;i++) stars.push(new Star());
}
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
initStars();
initPlanets();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const bg = ctx.createRadialGradient(canvas.width*.5,canvas.height*.4,0, canvas.width*.5,canvas.height*.5, Math.max(canvas.width,canvas.height));
  bg.addColorStop(0,   '#12003a');
  bg.addColorStop(0.4, '#080018');
  bg.addColorStop(1,   '#000008');
  ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
  planets.forEach(p => drawPlanet(p));
  stars.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();




// ===== PÉTALOS / CORAZONES FLOTANTES =====
const petalContainer = document.getElementById('floating-petals');
const heartContainer = document.getElementById('floating-hearts');
const petals  = ['🌷','🌹','🌸','💮'];
const hearts  = ['💖','💗','💓','💕','💞','❤️','✨'];

function createFloating(container, emojis) {
  const el = document.createElement('div');
  el.classList.add(container === petalContainer ? 'float-petal' : 'float-heart');
  el.textContent  = emojis[Math.floor(Math.random() * emojis.length)];
  const duration  = 7 + Math.random() * 8;
  const delay     = Math.random() * 3;
  el.style.left   = `${Math.random() * 100}%`;
  el.style.animationDuration = `${duration}s`;
  el.style.animationDelay    = `${delay}s`;
  el.style.fontSize           = `${0.8 + Math.random() * 1.4}rem`;
  container.appendChild(el);
  setTimeout(() => el.remove(), (duration + delay) * 1000);
}

setInterval(() => createFloating(petalContainer, petals), 800);
setInterval(() => createFloating(heartContainer, hearts), 1000);
for (let i = 0; i < 6; i++) {
  createFloating(petalContainer, petals);
  createFloating(heartContainer, hearts);
}


// ===== MÚSICA =====
const music   = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let   playing  = false;

function toggleMusic() {
  if (playing) {
    music.pause();
    musicBtn.textContent = '🎵';
    musicBtn.classList.remove('playing');
  } else {
    music.play().catch(() => {});
    musicBtn.textContent = '🔊';
    musicBtn.classList.add('playing');
  }
  playing = !playing;
}

// Intentar autoplay (navegadores modernos lo pueden bloquear)
document.addEventListener('click', function autoplay() {
  if (!playing) {
    music.play().then(() => {
      playing = true;
      musicBtn.textContent = '🔊';
      musicBtn.classList.add('playing');
    }).catch(() => {});
  }
  document.removeEventListener('click', autoplay);
}, { once: true });


// ===== RAZONES POR LAS QUE LA AMO =====
const reasons = [
  '💖 Por tu sonrisa que ilumina mi mundo entero',
  '🌷 Por cada momento que me haces reír sin razón',
  '✨ Por lo especial que eres, única e irrepetible',
  '💕 Por hacer que cada día valga la pena',
  '🌹 Por tu fuerza y lo hermosa que eres por dentro y por fuera',
  '💫 Por ser la persona que más admiro en este mundo',
  '🎂 Por existir y hacer feliz a todos los que te rodean',
];

const list = document.getElementById('reasonsList');
reasons.forEach((r, i) => {
  const li = document.createElement('li');
  li.textContent = r;
  list.appendChild(li);
  setTimeout(() => li.classList.add('visible'), 300 + i * 200);
});


// ===== VELA — SOPLAR CON MICRÓFONO =====
let candleBlown   = false;
let audioContext  = null;
let analyser      = null;
let micStream     = null;
let blowInterval  = null;

function startBlowDetection() {
  if (candleBlown) return;
  const btn = document.getElementById('micBtn');
  btn.textContent = '🎤 Escuchando... sopla fuerte!';
  btn.classList.add('listening');
  document.getElementById('candleHint').textContent = '🎤 Ya puedes soplar la vela...';

  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
      micStream    = stream;
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser     = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      blowInterval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        // Volumen promedio de las frecuencias bajas (soplo)
        const avg = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
        if (avg > 55) {
          blowCandle();
        }
      }, 100);
    })
    .catch(err => {
      btn.textContent = '🎤 Activar micrófono';
      btn.classList.remove('listening');
      // Fallback: soplar con click
      document.getElementById('candleHint').textContent = '⚠️ Micrófono no disponible — haz click en la llama para apagarla';
      document.getElementById('flame').addEventListener('click', blowCandle, { once: true });
    });
}

function blowCandle() {
  if (candleBlown) return;
  candleBlown = true;

  // Detener micrófono
  if (blowInterval)  clearInterval(blowInterval);
  if (micStream)     micStream.getTracks().forEach(t => t.stop());
  if (audioContext)  audioContext.close();

  // Apagar llama
  const flameWrapper = document.getElementById('flameWrapper');
  flameWrapper.classList.add('flame-off');

  // Actualizar UI
  const btn = document.getElementById('micBtn');
  btn.textContent = '🕯️ ¡Soplaste!';
  btn.classList.remove('listening');
  btn.disabled = true;
  document.getElementById('candleHint').textContent = '🌟 ¡Pidiste tu deseo!';

  // Mostrar mensaje
  const msg = document.getElementById('wishMessage');
  msg.style.display = 'block';

  // Explosión de corazones
  setTimeout(burst, 400);

  // Lluvia intensa de corazones
  for (let i = 0; i < 15; i++) {
    setTimeout(() => createFloating(heartContainer, hearts), i * 100);
  }
}


// ===== BURST: explosión de corazones desde el botón =====
function burst() {
  const btn = document.querySelector('.love-btn') || document.querySelector('.mic-btn');
  if (!btn) return;
  const rect    = btn.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top  + rect.height / 2;

  for (let i = 0; i < 24; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; left:${originX}px; top:${originY}px;
      font-size:${0.8 + Math.random() * 1.6}rem;
      pointer-events:none; z-index:9999;
      transition:transform 1.3s ease-out, opacity 1.3s ease-out;
      opacity:1;
    `;
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    document.body.appendChild(el);

    const angle    = (Math.PI * 2 / 24) * i + (Math.random() - 0.5) * 0.6;
    const distance = 90 + Math.random() * 160;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px,${dy}px) scale(1.6)`;
      el.style.opacity   = '0';
    }));
    setTimeout(() => el.remove(), 1500);
  }
}


// ===== BANNER CUMPLEAÑOS =====
function showBirthdayBanner() {
  if (document.getElementById('bday-banner')) return;
  const b = document.createElement('div');
  b.id = 'bday-banner';
  b.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:rgba(0,0,0,0.7);z-index:9998;backdrop-filter:blur(6px);`;
  b.innerHTML = `
    <div style="font-size:4rem;animation:heartbeat 1.2s ease-in-out infinite;">🎂</div>
    <h1 style="font-size:2.2rem;background:linear-gradient(135deg,#ffb3cc,#ff006e,#ffd700);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      text-align:center;padding:0 20px;margin-top:16px;">
      ¡Hoy es tu día,<br/>Iris Lizeth!
    </h1>
    <p style="color:#ffb3cc;margin-top:14px;font-size:1.1rem;">💖 ¡Feliz Cumpleaños mi amor! 💖</p>
    <button onclick="document.getElementById('bday-banner').remove()" style="
      margin-top:24px;padding:12px 30px;background:linear-gradient(135deg,#ff006e,#ff4d8d);
      border:none;border-radius:50px;color:#fff;font-size:1rem;cursor:pointer;
      box-shadow:0 0 20px rgba(255,0,110,0.5);">
      💕 Gracias, amor 💕
    </button>
  `;
  document.body.appendChild(b);
  setTimeout(burst, 600);
}


// ===== FRASES FLOTANTES — solo activan en cumpleaños =====
const phrases = [
  'Mi amor ❤️', 'Te amo', 'Eres especial', 'Feliz Cumpleaños 🎂',
  'Que la pases genial', 'Mi vida 💕', 'Eres mi todo',
  'Para siempre', 'Te quiero mucho', 'Eres hermosa 🌷',
  'Mi corazón', 'Amor de mi vida', 'Sonríe siempre ✨',
  'Me encantas', 'Eres única', '¡Felicidades! 🎉',
  'Mi razón 💖', 'Lo mejor de mi vida',
];

const phraseContainer = document.getElementById('floating-phrases');
let phraseInterval = null;

function createPhrase() {
  const el = document.createElement('div');
  el.classList.add('float-phrase');
  el.textContent = phrases[Math.floor(Math.random() * phrases.length)];
  const duration = 8 + Math.random() * 10;
  const delay    = Math.random() * 4;
  el.style.left  = `${Math.random() * 95}%`;
  el.style.top   = `${80 + Math.random() * 20}%`;
  el.style.animationDuration = `${duration}s`;
  el.style.animationDelay    = `${delay}s`;
  el.style.fontSize = `${0.7 + Math.random() * 0.6}rem`;
  el.style.color = `rgba(${Math.random()>0.5?'255,100,160':'255,200,220'},${0.3+Math.random()*0.4})`;
  phraseContainer.appendChild(el);
  setTimeout(() => el.remove(), (duration + delay) * 1000);
}

function startPhrases() {
  if (phraseInterval) return;
  phraseInterval = setInterval(createPhrase, 700);
  for (let i = 0; i < 12; i++) createPhrase();
}


