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


// ── 4. Keyboard Secret Easter Egg ─────────────────────────────────────
(function () {
  const secretCode = "hireme";
  let inputBuffer = "";

  document.addEventListener('keydown', (e) => {
    // Ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    inputBuffer += e.key.toLowerCase();
    
    // Keep buffer same length as secret code
    if (inputBuffer.length > secretCode.length) {
      inputBuffer = inputBuffer.slice(-secretCode.length);
    }

    if (inputBuffer === secretCode) {
      triggerDiscoMode();
      inputBuffer = ""; // Reset
    }
  });

  function triggerDiscoMode() {
    if (document.body.classList.contains('disco-mode')) return; // prevent spam

    // CSS Disco effect
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes disco {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
      body.disco-mode {
        animation: disco 2s linear infinite;
      }
      .disco-banner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(45deg, #ff00cc, #3333ff);
        color: white;
        padding: 40px 60px;
        border-radius: 20px;
        font-size: 3rem;
        font-weight: 800;
        z-index: 100000;
        box-shadow: 0 10px 50px rgba(0,0,0,0.5);
        text-align: center;
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: none;
      }
      .disco-banner.show {
        transform: translate(-50%, -50%) scale(1);
      }
      @media (max-width: 580px) {
        .disco-banner { font-size: 1.5rem; padding: 20px 30px; width: 90%; }
      }
    `;
    document.head.appendChild(style);

    // Add class to body
    document.body.classList.add('disco-mode');

    // Create banner
    const banner = document.createElement('div');
    banner.className = 'disco-banner';
    banner.innerHTML = "🎉 YOU FOUND THE SECRET! 🎉<br><span style='font-size:1.5rem'>Now you have to hire me! 😉</span>";
    document.body.appendChild(banner);

    // Show banner with animation
    setTimeout(() => {
      banner.classList.add('show');
    }, 100);

    const emojis = ['⭐', '✨', '💫', '🌟', '🎉', '🎊', '💙', '🚀', '🔥', '👏'];
    function burstMany(x, y) {
      const count = 15;
      for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 150 + 50;
        Object.assign(el.style, {
          position: 'fixed',
          left: x + 'px',
          top: y + 'px',
          fontSize: (Math.random() * 20 + 15) + 'px',
          pointerEvents: 'none',
          zIndex: '99999',
          transform: 'translate(-50%, -50%)',
          transition: 'all 1s ease-out',
          opacity: '1',
          userSelect: 'none'
        });
        document.body.appendChild(el);
        requestAnimationFrame(() => {
          el.style.left = (x + Math.cos(angle) * dist) + 'px';
          el.style.top = (y + Math.sin(angle) * dist) + 'px';
          el.style.opacity = '0';
          el.style.transform = `translate(-50%, -50%) scale(${Math.random() * 0.5 + 0.5}) rotate(${Math.random() * 360}deg)`;
        });
        setTimeout(() => el.remove(), 1000);
      }
    }

    // Fire confetti burst everywhere
    let intervals = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      burstMany(x, y);
    }, 300);

    // Stop after 6 seconds
    setTimeout(() => {
      clearInterval(intervals);
      document.body.classList.remove('disco-mode');
      banner.style.transform = "translate(-50%, -50%) scale(0)";
      setTimeout(() => {
        banner.remove();
        style.remove();
      }, 500);
    }, 6000);
  }
})();
