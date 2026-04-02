/**
 * scroll.js — Letter-by-letter text reveal + scroll-linked audio sync
 *
 * Features:
 *  - Splits [data-reveal] elements into per-character <span> elements
 *  - IntersectionObserver triggers reveal when a section enters viewport
 *  - Characters animate in sequentially (opacity + slight upward motion)
 *  - Audio element mapped to scroll progress (0–1 → 0–duration)
 *  - Playback rate adjusts if scroll/audio gap is too large or too small
 *  - Rewind visual effect when user scrolls back up significantly
 *  - Language switching re-builds char spans on all reveal elements
 */

(function () {
  'use strict';

  // ── Config ─────────────────────────────────────────────────────────────
  const CHAR_DELAY_MS = 22;          // ms between each character appearing
  const SCROLL_SYNC_INTERVAL = 150;  // ms between audio sync checks
  const GAP_SPEEDUP = 1.5;           // seconds: gap > this → speed up audio
  const GAP_SLOWDOWN = 0.25;         // seconds: gap < this → slow down audio
  const RATE_FAST = 1.28;
  const RATE_SLOW = 0.82;
  const RATE_NORMAL = 1.0;
  const REWIND_THRESHOLD = 0.05;     // scroll fraction up = rewind effect
  const CHAR_STAGGER_OFFSET = 8;     // px vertical offset before reveal

  // ── Elements ────────────────────────────────────────────────────────────
  const audio = document.getElementById('narration-audio');
  const muteBtn = document.getElementById('audio-mute-btn');
  const waveformEl = document.getElementById('audio-waveform');
  const waveformBars = waveformEl ? waveformEl.querySelectorAll('.wave-bar') : [];

  // ── State ────────────────────────────────────────────────────────────────
  let audioStarted = false;
  let muted = true;
  let lastScrollY = 0;
  let lastScrollFraction = 0;
  let syncTimer = null;
  let rewindCooldown = false;
  let observers = [];

  // ── i18n integration ─────────────────────────────────────────────────────
  // Called by the language switcher after DOM text has been updated
  window.InversoReveal = {
    rebuild: buildAllRevealElements,
  };

  // ── Init ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    buildAllRevealElements();
    attachScrollListener();
    attachAudioControls();
    attachMoreDrawer();
    startSyncInterval();
  });

  // ── Build character spans ─────────────────────────────────────────────────
  function buildAllRevealElements() {
    // Disconnect existing observers before rebuilding
    observers.forEach(o => o.disconnect());
    observers = [];

    document.querySelectorAll('[data-reveal]').forEach(el => {
      buildReveal(el);
    });
  }

  function buildReveal(el) {
    const text = el.textContent;
    el.innerHTML = '';
    el.setAttribute('aria-label', text); // preserve accessibility

    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.setProperty('--char-index', i);
      el.appendChild(span);
    });

    // Observe the parent section (or element itself if no section parent)
    const section = el.closest('section') || el;
    observeSection(section);
  }

  function observeSection(section) {
    if (section._observed) return;
    section._observed = false; // will flip to true after reveal

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !section._revealed) {
            section._revealed = true;
            revealSection(section);
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    observers.push(observer);
  }

  function revealSection(section) {
    const chars = section.querySelectorAll('.char');
    chars.forEach((span, i) => {
      setTimeout(() => {
        span.classList.add('visible');
      }, i * CHAR_DELAY_MS);
    });
  }

  // ── Scroll listener ───────────────────────────────────────────────────────
  function attachScrollListener() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function handleScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = maxScroll > 0 ? scrollY / maxScroll : 0;

    // First scroll: start audio if not muted
    if (!audioStarted && scrollY > 10) {
      audioStarted = true;
      if (audio && !muted) {
        audio.play().catch(() => {});
      }
    }

    // Detect upward scroll for rewind effect
    if (
      !rewindCooldown &&
      fraction < lastScrollFraction - REWIND_THRESHOLD &&
      audioStarted
    ) {
      triggerRewindEffect();
    }

    lastScrollY = scrollY;
    lastScrollFraction = fraction;

    // Sync audio position to scroll
    if (audio && audioStarted && audio.duration && !isNaN(audio.duration)) {
      const targetTime = fraction * audio.duration;
      // Only hard-seek if gap is significant (> 3s), otherwise let rate control it
      const gap = Math.abs(audio.currentTime - targetTime);
      if (gap > 3.5) {
        audio.currentTime = targetTime;
      }
    }
  }

  // ── Audio rate sync ───────────────────────────────────────────────────────
  function startSyncInterval() {
    syncTimer = setInterval(syncAudioRate, SCROLL_SYNC_INTERVAL);
  }

  function syncAudioRate() {
    if (!audio || !audioStarted || !audio.duration || isNaN(audio.duration)) return;
    if (muted || audio.paused) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    const targetTime = fraction * audio.duration;
    const gap = targetTime - audio.currentTime; // positive = text ahead of audio

    if (gap > GAP_SPEEDUP) {
      // Text is far ahead — speed up audio slightly
      setRate(RATE_FAST);
    } else if (gap < -GAP_SLOWDOWN) {
      // Audio is catching up to where text hasn't revealed yet — slow down
      setRate(RATE_SLOW);
    } else {
      setRate(RATE_NORMAL);
    }
  }

  function setRate(rate) {
    if (audio && Math.abs(audio.playbackRate - rate) > 0.01) {
      audio.playbackRate = rate;
    }
  }

  // ── Rewind effect ─────────────────────────────────────────────────────────
  function triggerRewindEffect() {
    rewindCooldown = true;

    // Visual flash on waveform
    if (waveformEl) {
      waveformEl.classList.add('rewinding');
      setTimeout(() => waveformEl.classList.remove('rewinding'), 600);
    }

    // Quick seek backward in audio
    if (audio && audio.duration) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      audio.currentTime = fraction * audio.duration;
    }

    setTimeout(() => { rewindCooldown = false; }, 1200);
  }

  // ── Audio controls ────────────────────────────────────────────────────────
  function attachAudioControls() {
    if (!muteBtn) return;

    muteBtn.addEventListener('click', () => {
      muted = !muted;

      if (audio) {
        audio.muted = muted;
        if (!muted && !audioStarted && window.scrollY > 10) {
          audioStarted = true;
          audio.play().catch(() => {});
        } else if (!muted && audioStarted && audio.paused) {
          audio.play().catch(() => {});
        } else if (muted) {
          audio.pause();
        }
      }

      updateMuteUI();
    });

    // Waveform animation while playing
    if (audio) {
      audio.addEventListener('play', () => {
        if (waveformEl) waveformEl.classList.add('playing');
      });
      audio.addEventListener('pause', () => {
        if (waveformEl) waveformEl.classList.remove('playing');
      });
    }
  }

  function updateMuteUI() {
    if (!muteBtn) return;
    const lang = document.documentElement.lang || 'en';
    const i18n = window.InversoI18n || {};
    const strings = i18n[lang] || i18n['en'] || {};

    muteBtn.setAttribute(
      'data-i18n',
      muted ? 'audio_unmute' : 'audio_mute'
    );
    muteBtn.textContent = muted
      ? (strings.audio_unmute || 'unmute narration')
      : (strings.audio_mute || 'mute');

    muteBtn.classList.toggle('active', !muted);
  }

  // ── More drawer ───────────────────────────────────────────────────────────
  function attachMoreDrawer() {
    const moreBtn = document.getElementById('more-btn');
    const drawer = document.getElementById('more-drawer');
    const closeBtn = document.getElementById('more-close');

    if (!moreBtn || !drawer) return;

    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = drawer.classList.toggle('open');
      moreBtn.setAttribute('aria-expanded', open);
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeDrawer(drawer, moreBtn));
    }

    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && e.target !== moreBtn) {
        closeDrawer(drawer, moreBtn);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer(drawer, moreBtn);
    });
  }

  function closeDrawer(drawer, btn) {
    drawer.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

})();


// ── i18n / Language system ───────────────────────────────────────────────────
(function () {
  'use strict';

  let i18nData = null;
  window.InversoI18n = null;

  async function loadI18n() {
    try {
      const res = await fetch('content/i18n.json');
      i18nData = await res.json();
      window.InversoI18n = i18nData;
      const saved = localStorage.getItem('lang') || detectLang();
      applyLang(saved, false);
      bindLangButtons();
    } catch (e) {
      console.warn('i18n load failed', e);
    }
  }

  function detectLang() {
    const nav = navigator.language || 'en';
    if (nav.startsWith('ca')) return 'ca';
    if (nav.startsWith('bg')) return 'bg';
    if (nav.startsWith('es')) return 'es';
    return 'en';
  }

  function applyLang(lang, showToast) {
    if (!i18nData || !i18nData[lang]) return;
    const strings = i18nData[lang];

    document.documentElement.lang = lang;

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key] !== undefined) {
        el.textContent = strings[key];
      }
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (strings[key] !== undefined) {
        el.placeholder = strings[key];
      }
    });

    // Mark active lang button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
      btn.setAttribute('aria-current', btn.dataset.lang === lang ? 'true' : 'false');
    });

    // Rebuild char spans after text has changed
    if (window.InversoReveal) {
      window.InversoReveal.rebuild();
    }

    if (showToast) {
      localStorage.setItem('lang', lang);
      showLangToast(strings.toast_lang_saved || 'Language saved.');
    }
  }

  function bindLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyLang(btn.dataset.lang, true);
      });
    });
  }

  function showLangToast(message) {
    let toast = document.getElementById('lang-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'lang-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.remove('hide');
    toast.classList.add('show');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 4000);
  }

  document.addEventListener('DOMContentLoaded', loadI18n);
})();


// ── Newsletter form ───────────────────────────────────────────────────────────
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newsletter-form');
    const input = document.getElementById('newsletter-email');
    const confirm = document.getElementById('newsletter-confirm');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input ? input.value.trim() : '';

      if (!email || !email.includes('@')) {
        input && input.focus();
        return;
      }

      // No backend yet — log and show confirmation
      console.log('[Newsletter] Email submitted:', email);

      form.style.opacity = '0';
      setTimeout(() => {
        form.style.display = 'none';
        if (confirm) {
          confirm.style.display = 'block';
          confirm.offsetHeight; // reflow
          confirm.style.opacity = '1';
        }
      }, 300);
    });
  });
})();
