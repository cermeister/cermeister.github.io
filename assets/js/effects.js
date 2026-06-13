/* =============================================
   effects.js — Fun interactivity layer
   ============================================= */

// ── 1. Sparkle cursor trail (canvas) ──────────────────────────────────
(function () {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '9999'
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const colors = [
    'hsl(217,91%,70%)', 'hsl(260,80%,75%)',
    'hsl(150,60%,60%)', 'hsl(45,90%,65%)', 'hsl(190,80%,65%)'
  ];
  const particles = [];

  document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 8,
        y: e.clientY + (Math.random() - 0.5) * 8,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.85,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 1.5 + 0.5),
        decay: Math.random() * 0.025 + 0.015
      });
    }
  });

  function drawSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      p.size *= 0.96;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(drawSparkles);
  }
  drawSparkles();
})();


// ── 2. Avatar click emoji burst ───────────────────────────────────────
(function () {
  const emojis = ['⭐', '✨', '💫', '🌟', '🎉', '🎊', '💙', '🚀', '🔥', '👏'];

  function burst(x, y) {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const dist = Math.random() * 80 + 50;
      Object.assign(el.style, {
        position: 'fixed',
        left: x + 'px',
        top: y + 'px',
        fontSize: (Math.random() * 14 + 13) + 'px',
        pointerEvents: 'none',
        zIndex: '10000',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.75s cubic-bezier(.17,.67,.35,1.2)',
        opacity: '1',
        userSelect: 'none'
      });
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.left = (x + Math.cos(angle) * dist) + 'px';
        el.style.top = (y + Math.sin(angle) * dist) + 'px';
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%,-50%) scale(0.3)';
      });
      setTimeout(() => el.remove(), 800);
    }
  }

  document.addEventListener('click', (e) => {
    const avatar = e.target.closest('.avatar-box');
    if (avatar) burst(e.clientX, e.clientY);
  });
})();


// ── 3. Ripple on interactive cards ────────────────────────────────────
(function () {
  const TARGETS = '.contact-channel-card, .service-item, .project-item a, .timeline-item';

  document.addEventListener('click', (e) => {
    const target = e.target.closest(TARGETS);
    if (!target) return;

    const r = target.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const x = e.clientX - r.left - size / 2;
    const y = e.clientY - r.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'fx-ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;

    if (getComputedStyle(target).position === 'static') target.style.position = 'relative';
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
})();
