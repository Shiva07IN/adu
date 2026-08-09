/* ═══════════════════════════════════════════
   MIDNIGHT AMITY — script.js
   For My Bestest Friend
   ═══════════════════════════════════════════ */

'use strict';

// ── Helpers ────────────────────────────────
const isMob = () => window.innerWidth <= 768;
const $ = id => document.getElementById(id);

// ── Nav scroll ─────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Background Canvas ──────────────────────
const bgC = $('bgCanvas');
const bgX = bgC.getContext('2d');
let bParts = [], bgT = 0;

function resizeBg() {
  bgC.width  = window.innerWidth;
  bgC.height = window.innerHeight;
}

class Particle {
  constructor() { this.init(); }
  init() {
    this.x  = Math.random() * bgC.width;
    this.y  = Math.random() * bgC.height;
    this.r  = Math.random() * 2 + 0.3;
    this.a  = Math.random() * 0.38 + 0.04;
    this.vx = (Math.random() - 0.5) * 0.28;
    this.vy = (Math.random() - 0.5) * 0.28;
    this.lf = 0;
    this.ml = 260 + Math.random() * 280;
    this.col = ['rgba(255,0,127,','rgba(179,136,255,','rgba(255,177,196,','rgba(74,20,140,'][Math.floor(Math.random()*4)];
  }
  step() {
    this.x += this.vx; this.y += this.vy; this.lf++;
    if (this.lf > this.ml) this.init();
  }
  draw() {
    const p = this.lf / this.ml;
    const al = p < 0.1 ? this.a * (p / 0.1) : p > 0.9 ? this.a * ((1-p) / 0.1) : this.a;
    bgX.beginPath();
    bgX.arc(this.x, this.y, this.r, 0, Math.PI*2);
    bgX.fillStyle = this.col + al + ')';
    bgX.fill();
    const g = bgX.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*3.5);
    g.addColorStop(0, this.col + (al*0.28) + ')');
    g.addColorStop(1, this.col + '0)');
    bgX.beginPath();
    bgX.arc(this.x, this.y, this.r*3.5, 0, Math.PI*2);
    bgX.fillStyle = g;
    bgX.fill();
  }
}

function drawBg() {
  bgX.clearRect(0, 0, bgC.width, bgC.height);
  bgT += 0.0018;
  // orb 1
  const x1 = bgC.width  * (0.2  + Math.sin(bgT) * 0.09);
  const y1 = bgC.height * (0.22 + Math.cos(bgT*0.7) * 0.09);
  const g1 = bgX.createRadialGradient(x1,y1,0,x1,y1,bgC.width*0.48);
  g1.addColorStop(0,'rgba(74,20,140,0.11)'); g1.addColorStop(1,'transparent');
  bgX.fillStyle = g1; bgX.fillRect(0,0,bgC.width,bgC.height);
  // orb 2
  const x2 = bgC.width  * (0.76 + Math.sin(bgT*0.8+2) * 0.1);
  const y2 = bgC.height * (0.7  + Math.cos(bgT*0.55) * 0.09);
  const g2 = bgX.createRadialGradient(x2,y2,0,x2,y2,bgC.width*0.38);
  g2.addColorStop(0,'rgba(255,0,127,0.07)'); g2.addColorStop(1,'transparent');
  bgX.fillStyle = g2; bgX.fillRect(0,0,bgC.width,bgC.height);

  bParts.forEach(p => { p.step(); p.draw(); });
  requestAnimationFrame(drawBg);
}

function initBg() {
  resizeBg();
  bParts = [];
  for (let i = 0; i < 90; i++) {
    const p = new Particle();
    p.lf = Math.random() * p.ml;
    bParts.push(p);
  }
  drawBg();
}
window.addEventListener('resize', resizeBg, { passive: true });

// ── Click Sparkles ──────────────────────────
(function attachSparkles() {
  const s = document.createElement('style');
  s.textContent = '@keyframes spkExp{0%{transform:translate(-50%,-50%) scale(0);opacity:1;color:#ff007f;}50%{opacity:1;color:#b388ff;}100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.5);opacity:0;}}';
  document.head.appendChild(s);
  document.addEventListener('click', e => {
    for (let i = 0; i < 7; i++) {
      const el = document.createElement('span');
      el.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:9999;font-size:${0.65+Math.random()*0.8}rem;transform:translate(-50%,-50%);animation:spkExp .85s ease-out forwards;--dx:${(Math.random()-.5)*90}px;--dy:${(Math.random()-.5)*90}px;`;
      el.textContent = ['✦','✧','⋆','❋','✿','⭐','💫'][Math.floor(Math.random()*7)];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
  });
})();

// ── Live: Days since Apr 17 2016 ────────────────
function getDaysSince() {
  const start = new Date('2016-04-17T00:00:00');
  const now   = new Date();
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
}

function startDayCounter() {
  const el = $('dayCount');
  if (!el) return;
  const target = getDaysSince();
  const dur = 2400;
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
    // Once anim done, keep it live (updates at midnight)
    else el.textContent = target.toLocaleString();
  })(performance.now());
}

// ── Live: World population ticker ──────────────
// World population Jan 1 2026 ≈ 8,189,700,000
// Growth rate ≈ ~4.5 people / second (net)
const POP_BASE      = 8_189_700_000;
const POP_BASE_TIME = new Date('2026-01-01T00:00:00Z').getTime();
const POP_RATE      = 4.5; // people per second

function getLivePop() {
  const secElapsed = (Date.now() - POP_BASE_TIME) / 1000;
  return Math.round(POP_BASE + secElapsed * POP_RATE);
}

function startPopTicker() {
  const el = $('popCount');
  if (!el) return;
  // Animate count-up from a starting offset over 2.5s
  const finalPop = getLivePop();
  const startPop = finalPop - 10000;
  const dur = 2500;
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const display = Math.round(startPop + ease * (finalPop - startPop));
    el.textContent = display.toLocaleString();
    if (p < 1) { requestAnimationFrame(tick); return; }
    // After anim: tick every second in real-time
    setInterval(() => { el.textContent = getLivePop().toLocaleString(); }, 1000);
  })(performance.now());
}

// ── IntersectionObserver ────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('vis');
    io.unobserve(e.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -55px 0px' });


// ── Falling Petals ──────────────────────────
const petalEmoji = ['🌸','🌷','✿','❀','🌺','🌼','🪷'];
function dropPetal() {
  const wrap = $('petalsWrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.classList.add('petal');
  el.textContent = petalEmoji[Math.floor(Math.random() * petalEmoji.length)];
  el.style.left = (Math.random() * 100) + 'vw';
  el.style.fontSize = (0.65 + Math.random() * 0.65) + 'rem';
  el.style.opacity = (0.25 + Math.random() * 0.38).toString();
  const dur = 8 + Math.random() * 10;
  const del = Math.random() * 5;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = del + 's';
  wrap.appendChild(el);
  setTimeout(() => el.remove(), (dur + del) * 1000 + 200);
}

// ── Quotes Carousel ─────────────────────────
let qIdx = 0;
const qSlides = document.querySelectorAll('.q-slide');
let qDots = [];
let qTimer;

function buildQDots() {
  const wrap = $('qDots');
  if (!wrap) return;
  qSlides.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'q-dot' + (i === 0 ? ' on' : '');
    b.setAttribute('aria-label', 'Quote ' + (i+1));
    b.addEventListener('click', () => goQ(i));
    wrap.appendChild(b);
    qDots.push(b);
  });
}

function goQ(idx) {
  qSlides[qIdx].classList.remove('active');
  qDots[qIdx]?.classList.remove('on');
  qIdx = (idx + qSlides.length) % qSlides.length;
  qSlides[qIdx].classList.add('active');
  qDots[qIdx]?.classList.add('on');
}

function shiftQuote(dir) {
  clearInterval(qTimer);
  goQ(qIdx + dir);
  qTimer = setInterval(() => goQ(qIdx + 1), 5200);
}

// ── Book Logic ───────────────────────────────
const FACES = [
  '#cover .cover-front',
  '#cover .pb-1',
  '#page1 .pf-2',
  '#page1 .pb-2',
  '#page2 .pf-3',
  '#page2 .pb-3',
  '#page3 .pf-4',
  '#page3 .pb-cover',
];
const PAGE_NAMES = [
  'Cover', '1 of 7', '2 of 7', '3 of 7',
  '4 of 7', '5 of 7', '6 of 7', 'The End ✨'
];
let faceIdx = 0;
let flipping = false;

function getFace(sel) { return document.querySelector(sel); }
function allFaces() { return document.querySelectorAll('.book .page-front, .book .page-back'); }

function resetAllFaces() {
  allFaces().forEach(el =>
    el.classList.remove('face-active','face-exit','face-exit-back','face-enter-back')
  );
}

function goFace(idx, dir /* 'fwd'|'bwd' */) {
  if (flipping || idx === faceIdx) return;
  if (idx < 0 || idx >= FACES.length) return;
  flipping = true;

  const prevEl = getFace(FACES[faceIdx]);
  const nextEl = getFace(FACES[idx]);
  const goingFwd = dir === 'fwd';

  // 1. Set starting position of incoming face
  if (nextEl) {
    nextEl.classList.remove('face-active','face-exit','face-exit-back','face-enter-back');
    if (!goingFwd) nextEl.classList.add('face-enter-back');
    // force reflow so transition fires
    nextEl.getBoundingClientRect();
  }

  // 2. Exit current face
  if (prevEl) {
    prevEl.classList.remove('face-active');
    prevEl.classList.add(goingFwd ? 'face-exit' : 'face-exit-back');
  }

  // 3. Animate in next face
  requestAnimationFrame(() => {
    if (nextEl) {
      nextEl.classList.remove('face-enter-back');
      nextEl.classList.add('face-active');
    }
    faceIdx = idx;
    updateBkControls();
  });

  // 4. Clean up exit class after transition
  setTimeout(() => {
    if (prevEl) prevEl.classList.remove('face-exit','face-exit-back');
    flipping = false;
  }, 420);
}

function openBook() {
  const ov = $('bookOverlay');
  ov.classList.add('active');
  document.body.style.overflow = 'hidden';
  resetAllFaces();
  faceIdx = 0;
  flipping = false;
  // Slight delay so overlay fade-in completes first
  setTimeout(() => {
    const first = getFace(FACES[0]);
    if (first) first.classList.add('face-active');
    updateBkControls();
  }, 120);
}

function closeBook() {
  $('bookOverlay').classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(resetAllFaces, 320);
  faceIdx = 0;
  flipping = false;
}

function nextPage() {
  if (faceIdx < FACES.length - 1) { goFace(faceIdx + 1, 'fwd'); navigator.vibrate?.(18); }
}
function prevPage() {
  if (faceIdx > 0) { goFace(faceIdx - 1, 'bwd'); navigator.vibrate?.(12); }
}

function updateBkControls() {
  const prev = $('prevBtn'), next = $('nextBtn'), ind = $('pageIndicator');
  if (prev) prev.disabled = faceIdx <= 0;
  if (next) next.disabled = faceIdx >= FACES.length - 1;
  if (ind)  ind.textContent = PAGE_NAMES[faceIdx] || faceIdx;
}

// Keyboard
document.addEventListener('keydown', e => {
  if (!$('bookOverlay').classList.contains('active')) return;
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextPage(); }
  else if (e.key === 'ArrowLeft')               { e.preventDefault(); prevPage(); }
  else if (e.key === 'Escape')                   closeBook();
});

// Touch swipe
let swX = 0, swY = 0;
document.addEventListener('DOMContentLoaded', () => {
  const bk = $('book-main');
  if (!bk) return;
  bk.addEventListener('touchstart', e => {
    swX = e.touches[0].clientX;
    swY = e.touches[0].clientY;
  }, { passive: true });
  bk.addEventListener('touchend', e => {
    const dx = swX - e.changedTouches[0].clientX;
    const dy = Math.abs(swY - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 48 && Math.abs(dx) > dy) {
      dx > 0 ? nextPage() : prevPage();
    }
  }, { passive: true });
});

// ── Music: auto-play with volume fade-in ────────
const audio = $('bgMusic');
const muteBtn = $('muteBtn');
let muted = false;

function toggleMute() {
  muted = !muted;
  audio.muted = muted;
  muteBtn.textContent = muted ? '🔇' : '🔊';
}

// Fade volume from 0 → 1 over ~3 seconds
function fadeInVolume() {
  audio.volume = 0;
  const step = 0.02;
  const interval = setInterval(() => {
    if (audio.volume + step >= 1) {
      audio.volume = 1;
      clearInterval(interval);
    } else {
      audio.volume += step;
    }
  }, 60);
}

function startAudio() {
  audio.play()
    .then(fadeInVolume)
    .catch(() => {
      // Autoplay blocked — retry on first interaction
      const retry = () => {
        audio.play().then(fadeInVolume).catch(() => {});
        document.removeEventListener('click',      retry);
        document.removeEventListener('touchstart', retry);
        document.removeEventListener('keydown',    retry);
      };
      document.addEventListener('click',      retry, { once: true });
      document.addEventListener('touchstart', retry, { once: true });
      document.addEventListener('keydown',    retry, { once: true });
    });
}

// ── DOMContentLoaded: boot everything ────────
document.addEventListener('DOMContentLoaded', () => {
  initBg();

  // Petals
  for (let i = 0; i < 8; i++) setTimeout(dropPetal, i * 600);
  setInterval(dropPetal, 1500);

  // Observe animatable elements
  document.querySelectorAll('.tl-item, .q-card, .mc, .pr-card').forEach(el => io.observe(el));

  // Live counters
  startDayCounter();
  startPopTicker();

  // Quotes
  buildQDots();
  qTimer = setInterval(() => goQ(qIdx + 1), 5200);

  // Quote stage hover → pause
  const qs = document.querySelector('.quotes-stage');
  if (qs) {
    qs.addEventListener('mouseenter', () => clearInterval(qTimer));
    qs.addEventListener('mouseleave', () => { qTimer = setInterval(() => goQ(qIdx + 1), 5200); });
  }

  // Start music
  startAudio();
});
