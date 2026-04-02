/**
 * canvas.js — Narrative Background Animation
 *
 * Story: Many particles drift rightward. One lone, smaller particle
 * moves against the current — leftward. Over time, the crowd drifts
 * off-screen. The view gently zooms toward the lone particle.
 * Then the cycle resets, quietly.
 *
 * Intentionally subtle. Should never distract from the text.
 */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ── Config ────────────────────────────────────────────────────────────────
  const CONFIG = {
    particleCount: 70,
    connectionDistance: 110,
    cycleLength: 28000,      // ms — full story cycle
    zoomMax: 1.22,           // max zoom toward lone particle
    baseOpacity: 0.22,       // all particles (subtle)
    loneOpacity: 0.35,
    loneRadius: 1.8,
    crowdRadius: 2.2,
    crowdSpeedX: 0.28,       // rightward drift (px/frame)
    loneSpeedX: -0.18,       // leftward drift
    speedY: 0.05,            // gentle vertical drift (crowd)
    lineOpacityMax: 0.10,
    color: '180, 160, 175',  // muted purple-gray (RGB)
    loneColor: '150, 120, 160',
  };

  // ── State ─────────────────────────────────────────────────────────────────
  let W, H;
  let particles = [];
  let lone = null;
  let startTime = null;
  let raf = null;
  let zoom = 1;
  let zoomTarget = 1;
  let zoomOriginX = 0.5;
  let zoomOriginY = 0.5;

  // ── Resize ────────────────────────────────────────────────────────────────
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // ── Particle factory ──────────────────────────────────────────────────────
  function makeParticle(isLone) {
    const r = isLone ? CONFIG.loneRadius : CONFIG.crowdRadius;
    return {
      x: isLone ? W * 0.35 + Math.random() * W * 0.3 : Math.random() * W,
      y: Math.random() * H,
      vx: isLone ? CONFIG.loneSpeedX : CONFIG.crowdSpeedX + (Math.random() - 0.5) * 0.08,
      vy: isLone ? (Math.random() - 0.5) * 0.06 : (Math.random() - 0.5) * CONFIG.speedY,
      r,
      opacity: isLone ? CONFIG.loneOpacity : CONFIG.baseOpacity * (0.6 + Math.random() * 0.4),
      isLone,
      offscreen: false,
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(makeParticle(false));
    }
    lone = makeParticle(true);
    startTime = null;
    zoom = 1;
    zoomTarget = 1;
    zoomOriginX = lone.x / W;
    zoomOriginY = lone.y / H;
  }

  init();

  // ── Draw ──────────────────────────────────────────────────────────────────
  function drawParticle(p) {
    const col = p.isLone ? CONFIG.loneColor : CONFIG.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${col}, ${p.opacity})`;
    ctx.fill();
  }

  function drawConnections(all) {
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const a = all[i];
        const b = all[j];
        if (a.offscreen || b.offscreen) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectionDistance) {
          const alpha = (1 - dist / CONFIG.connectionDistance) * CONFIG.lineOpacityMax;
          const col = (a.isLone || b.isLone) ? CONFIG.loneColor : CONFIG.color;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${col}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // ── Easing ────────────────────────────────────────────────────────────────
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // ── Frame ─────────────────────────────────────────────────────────────────
  function frame(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / CONFIG.cycleLength, 1);

    ctx.clearRect(0, 0, W, H);

    // ── Zoom logic ────────────────────────────────────────────────────────
    // Phase 0–0.5: normal, crowd drifts
    // Phase 0.5–0.85: crowd fades, zoom begins toward lone particle
    // Phase 0.85–1.0: zoom holds, lone particle alone on screen
    if (progress < 0.5) {
      zoomTarget = 1;
    } else if (progress < 0.85) {
      const t = (progress - 0.5) / 0.35;
      zoomTarget = 1 + easeInOut(t) * (CONFIG.zoomMax - 1);
    } else {
      zoomTarget = CONFIG.zoomMax;
    }

    // Smooth zoom
    zoom += (zoomTarget - zoom) * 0.012;

    // Track lone particle position for zoom origin
    zoomOriginX += (lone.x / W - zoomOriginX) * 0.015;
    zoomOriginY += (lone.y / H - zoomOriginY) * 0.015;

    // Apply zoom transform centered on lone particle
    ctx.save();
    const ox = zoomOriginX * W;
    const oy = zoomOriginY * H;
    ctx.translate(ox, oy);
    ctx.scale(zoom, zoom);
    ctx.translate(-ox, -oy);

    // ── Move + fade crowd ────────────────────────────────────────────────
    const crowdFadeStart = 0.48;
    const crowdFadeEnd = 0.75;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Fade out during crowd-exit phase
      if (progress >= crowdFadeStart) {
        const ft = Math.min((progress - crowdFadeStart) / (crowdFadeEnd - crowdFadeStart), 1);
        p.opacity = CONFIG.baseOpacity * (0.6 + Math.random() * 0.4) * (1 - ft);
      }

      // Off-screen check
      p.offscreen = (p.x > W + 20 || p.x < -20 || p.y > H + 20 || p.y < -20);
    });

    // ── Move lone ────────────────────────────────────────────────────────
    lone.x += lone.vx;
    lone.y += lone.vy;

    // Lone particle bounces vertically, wraps horizontally
    if (lone.y < 20 || lone.y > H - 20) lone.vy *= -1;
    if (lone.x < -40) lone.x = W + 20; // wrap if it drifts too far left

    // Draw connections (crowd ↔ crowd + lone ↔ near crowd while visible)
    const visibleParticles = particles.filter(p => !p.offscreen && p.opacity > 0.01);
    drawConnections([...visibleParticles, lone]);

    // Draw particles
    visibleParticles.forEach(drawParticle);
    drawParticle(lone);

    ctx.restore();

    // ── Cycle reset ───────────────────────────────────────────────────────
    if (progress >= 1) {
      // Soft reset: fade back in
      init();
    }

    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);

  // ── Public API ────────────────────────────────────────────────────────────
  window.InversoCanvas = {
    stop: () => { if (raf) cancelAnimationFrame(raf); },
    restart: () => { init(); raf = requestAnimationFrame(frame); },
  };
})();
