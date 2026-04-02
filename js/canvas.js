/**
 * canvas.js — Narrative Background Animation
 *
 * Story: Many particles flow in one direction. One lone particle —
 * noticeably larger, brighter — moves against the current. When it
 * reaches a wall, it bounces back, shifts to a new Y position, and
 * the crowd flips direction to always oppose it. Perfectly looping.
 * Fixed to the viewport — scroll has no effect on it.
 */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ── Config ────────────────────────────────────────────────────────────────
  const C = {
    crowdCount:       65,
    crowdSpeed:       0.30,        // px/frame, base horizontal speed
    loneSpeed:        0.22,        // px/frame
    connDist:         115,         // px — max connection line distance
    crowdR:           2.0,
    loneR:            5.5,
    crowdOpacity:     0.18,
    loneOpacity:      0.82,
    crowdColor:       '170, 148, 165',
    loneColor:        '148, 98, 175',  // brighter accent purple
    lineMax:          0.09,
    speedYNoise:      0.045,
    loneShadow:       16,
    wallMargin:       40,
  };

  let W, H;
  let crowd = [];
  let lone = {};
  let loneDir = -1;       // -1 = moving left, +1 = moving right
  let loneTargetY = 0;
  let raf = null;
  let initialized = false;

  // ── Resize ────────────────────────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;

    if (initialized) {
      lone.x = Math.max(C.wallMargin, Math.min(W - C.wallMargin, lone.x));
      loneTargetY = Math.max(H * 0.15, Math.min(H * 0.85, loneTargetY));
    }
  }

  window.addEventListener('resize', resize);
  resize();

  // ── Crowd particle factory ─────────────────────────────────────────────────
  // All crowd particles are spread randomly at startup; each frame they wrap.
  function makeCrowdParticle(spreadX) {
    const vx = crowdVx();
    return {
      x:  spreadX ? Math.random() * W : (loneDir > 0 ? W + 10 : -10),
      y:  Math.random() * H,
      vx,
      vy: (Math.random() - 0.5) * C.speedYNoise,
      opacity: C.crowdOpacity * (0.55 + Math.random() * 0.45),
    };
  }

  function crowdVx() {
    // Crowd always moves OPPOSITE to lone
    return (-loneDir) * C.crowdSpeed + (Math.random() - 0.5) * 0.06;
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    loneDir     = -1;
    loneTargetY = H * (0.25 + Math.random() * 0.5);

    lone = {
      x:  W * 0.6,
      y:  loneTargetY,
      vx: loneDir * C.loneSpeed,
    };

    crowd = [];
    for (let i = 0; i < C.crowdCount; i++) {
      crowd.push(makeCrowdParticle(true)); // true = spread randomly for startup
    }

    initialized = true;
  }

  init();

  // ── Draw ─────────────────────────────────────────────────────────────────
  function drawConnections() {
    // Mix crowd + lone into one list for connection checks
    const pts = crowd.concat([{ x: lone.x, y: lone.y, isLone: true }]);

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= C.connDist) continue;

        const alpha = (1 - dist / C.connDist) * C.lineMax;
        const isLoneConn = a.isLone || b.isLone;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${isLoneConn ? C.loneColor : C.crowdColor}, ${alpha})`;
        ctx.lineWidth   = isLoneConn ? 0.9 : 0.5;
        ctx.stroke();
      }
    }
  }

  function drawCrowd() {
    crowd.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, C.crowdR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${C.crowdColor}, ${p.opacity})`;
      ctx.fill();
    });
  }

  function drawLone() {
    // Glow
    ctx.save();
    ctx.shadowBlur  = C.loneShadow;
    ctx.shadowColor = `rgba(${C.loneColor}, 0.45)`;
    ctx.beginPath();
    ctx.arc(lone.x, lone.y, C.loneR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${C.loneColor}, ${C.loneOpacity})`;
    ctx.fill();
    ctx.restore();
  }

  // ── Flip crowd direction ──────────────────────────────────────────────────
  function flipCrowd() {
    crowd.forEach(p => {
      // Reverse horizontal velocity, keep magnitude roughly constant
      const speed = Math.abs(p.vx) || C.crowdSpeed;
      p.vx = (-loneDir) * speed + (Math.random() - 0.5) * 0.06;
    });
  }

  // ── Frame ─────────────────────────────────────────────────────────────────
  function frame() {
    ctx.clearRect(0, 0, W, H);

    // ── Move lone ──────────────────────────────────────────────────────────
    lone.x += lone.vx;
    lone.y += (loneTargetY - lone.y) * 0.005; // slow drift to target Y

    // Bounce off walls
    if (loneDir === -1 && lone.x <= C.wallMargin) {
      lone.x    = C.wallMargin;
      loneDir   = 1;
      lone.vx   = C.loneSpeed;
      loneTargetY = H * (0.15 + Math.random() * 0.70);
      flipCrowd();
    } else if (loneDir === 1 && lone.x >= W - C.wallMargin) {
      lone.x    = W - C.wallMargin;
      loneDir   = -1;
      lone.vx   = -C.loneSpeed;
      loneTargetY = H * (0.15 + Math.random() * 0.70);
      flipCrowd();
    }

    // ── Move crowd + wrap ─────────────────────────────────────────────────
    crowd.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap horizontally: exit one edge → enter from opposite
      if (p.vx > 0 && p.x > W + 18) {
        p.x  = -12;
        p.y  = Math.random() * H;
        p.vy = (Math.random() - 0.5) * C.speedYNoise;
      } else if (p.vx < 0 && p.x < -18) {
        p.x  = W + 12;
        p.y  = Math.random() * H;
        p.vy = (Math.random() - 0.5) * C.speedYNoise;
      }

      // Soft vertical boundary reflection (gentle)
      if (p.y < 5 || p.y > H - 5) p.vy *= -1;
    });

    // ── Draw ──────────────────────────────────────────────────────────────
    drawConnections();
    drawCrowd();
    drawLone();

    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);

  // ── Public API ────────────────────────────────────────────────────────────
  window.InversoCanvas = {
    stop:    () => { if (raf) cancelAnimationFrame(raf); },
    restart: () => {
      if (raf) cancelAnimationFrame(raf);
      init();
      raf = requestAnimationFrame(frame);
    },
  };
})();
