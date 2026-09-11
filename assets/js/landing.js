/* Fondo de code art para la landing pública.
   El acento "respira" lentamente entre dos tonos de la paleta
   para dar sensación de algo vivo, sin sobrecargar. */
import { initBackground } from "./shaders/gl.js";

const bg = initBackground(document.getElementById("bg-canvas"));
bg.setMode("field");

const A = [0x7d, 0x6b, 0x75];   // mauve
const B = [0x5e, 0x4b, 0x56];   // smoke
const hex = (c) => "#" + c.map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");

if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  bg.setAccent(hex(A));
} else {
  const start = performance.now();
  (function breathe(now) {
    const t = (Math.sin((now - start) / 6000) + 1) / 2;          // 0..1, ~12s ciclo
    bg.setAccent(hex(A.map((a, i) => a + (B[i] - a) * t)));
    requestAnimationFrame(breathe);
  })(start);
}

/* ---------- idioma: ESP · ENG · CAT ---------- */
const I18N = {
  en: {
    sub: "A project for the dear curious.",
    hi: "Hi, I'm Alexander.",
    p1: "I'm a Bioinformatics student interested in biological simulation, digital twins, and synthetic biology. I believe we won't be able to take full advantage of our bodies until we stop assuming it's a black box.",
    p2: "I hate the idea of a wet lab or AI as ways to discover/design drugs. We should use computers to simulate biology and find the solutions we need, rationally, with math. Not by AI interpolations or trial and error with pipettes.",
    p3: "As a kid, I loved machines. Today, I want to create one that solves biotech problems for us.",
    p4: "I want to share my ideas and projects, and will do here. Starting with my Breakthrough Junior Challenge submission, which I'll link around September 15th.",
    p5: "If you're curious, let's have a chat. Find my contact info below.",
    tagProject: "project",
    tagAcademic: "academic",
    note: "Original.",
  },
  es: {
    sub: "Un proyecto para los queridos curiosos.",
    hi: "Hola, soy Alexander.",
    p1: "Soy estudiante de Bioinformática y me interesan la simulación biológica, los gemelos digitales y la biología sintética. Creo que no podremos aprovechar del todo nuestro cuerpo hasta que dejemos de tratarlo como una caja negra.",
    p2: "Odio la idea del laboratorio húmedo o de la IA como vías para descubrir o diseñar fármacos. Deberíamos usar ordenadores para simular la biología y encontrar las soluciones que necesitamos, racionalmente, con matemáticas. No con interpolaciones de IA ni a base de ensayo y error con pipetas.",
    p3: "De niño me encantaban las máquinas. Hoy quiero crear una que resuelva los problemas de la biotecnología por nosotros.",
    p4: "Quiero compartir mis ideas y proyectos, y lo haré aquí. Empezando por mi propuesta para el Breakthrough Junior Challenge, que enlazaré hacia el 15 de septiembre.",
    p5: "Si tienes curiosidad, hablemos. Encontrarás mis datos de contacto abajo.",
    tagProject: "proyecto",
    tagAcademic: "académico",
    note: "Traducido con IA. Original en inglés.",
  },
  ca: {
    sub: "Un projecte per als estimats curiosos.",
    hi: "Hola, soc Alexander.",
    p1: "Soc estudiant de Bioinformàtica i m'interessen la simulació biològica, els bessons digitals i la biologia sintètica. Crec que no podrem aprofitar del tot el nostre cos fins que deixem de tractar-lo com una caixa negra.",
    p2: "Odio la idea del laboratori humit o de la IA com a vies per descobrir o dissenyar fàrmacs. Hauríem d'usar ordinadors per simular la biologia i trobar les solucions que necessitem, racionalment, amb matemàtiques. No amb interpolacions d'IA ni per assaig i error amb pipetes.",
    p3: "De petit m'encantaven les màquines. Avui vull crear-ne una que resolgui els problemes de la biotecnologia per nosaltres.",
    p4: "Vull compartir les meves idees i projectes, i ho faré aquí. Començant per la meva proposta per al Breakthrough Junior Challenge, que enllaçaré cap al 15 de setembre.",
    p5: "Si tens curiositat, parlem. Trobaràs les meves dades de contacte a sota.",
    tagProject: "projecte",
    tagAcademic: "acadèmic",
    note: "Traduït amb IA. Original en anglès.",
  },
};
const LANGS = Object.keys(I18N);
const STORAGE_KEY = "inverso-lang";

function pickInitial() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (LANGS.includes(saved)) return saved;
  const nav = (navigator.language || "es").slice(0, 2).toLowerCase();
  return LANGS.includes(nav) ? nav : "es";
}

function applyLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
  });
  const note = document.querySelector(".intro-note");
  if (note) note.hidden = lang === "en";
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});
applyLang(pickInitial());

/* ---------- wordmark: se encoge y se fija como cabecera al hacer scroll ---------- */
(function () {
  const markEl = document.getElementById("landing-mark");
  const spacerEl = document.getElementById("mark-spacer");
  if (!markEl || !spacerEl) return;
  const h1El = markEl.querySelector(".home-wordmark");

  let slot = null;
  let scrollY = 0;
  let measured = false;
  let resizeTimer = null;
  let scrollRaf = 0;

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const ease = (v) => v * v * (3 - 2 * v);
  const lerp = (a, b, p) => a + (b - a) * p;

  function render() {
    if (!measured || !slot) return;
    const p = ease(clamp01(scrollY / 140));
    const pad = Math.min(32, Math.max(20, window.innerWidth * 0.04));
    const veil = clamp01((p - 0.8) / 0.2);

    markEl.classList.add("pinned");
    markEl.style.left = lerp(slot.left, pad, p).toFixed(1) + "px";
    markEl.style.top = lerp(slot.top - scrollY, 12, p).toFixed(1) + "px";
    markEl.style.transform = "scale(" + lerp(1, slot.scale, p).toFixed(4) + ")";
    markEl.style.padding = (10 * veil).toFixed(1) + "px " + (22 * veil).toFixed(1) + "px";
    markEl.style.marginLeft = (-22 * veil).toFixed(1) + "px";
    markEl.style.background = "rgba(21,17,15," + (0.72 * veil).toFixed(3) + ")";
    markEl.style.backdropFilter = "blur(" + (9 * veil).toFixed(1) + "px)";
    markEl.style.borderBottom = "1px solid rgba(255,255,255," + (0.07 * veil).toFixed(3) + ")";

    spacerEl.style.height = slot.height.toFixed(1) + "px";
    spacerEl.hidden = false;
  }

  function measure() {
    markEl.classList.remove("pinned");
    markEl.removeAttribute("style");
    spacerEl.hidden = true;
    const r = markEl.getBoundingClientRect();
    const fs = parseFloat(getComputedStyle(h1El).fontSize) || 120;
    slot = {
      top: r.top + window.scrollY,
      left: r.left + window.scrollX,
      height: r.height,
      scale: Math.min(1, 17 / fs),
    };
    measured = true;
    render();
  }

  function unmeasure() {
    measured = false;
    markEl.classList.remove("pinned");
    markEl.removeAttribute("style");
    spacerEl.hidden = true;
  }

  const runMeasure = () => requestAnimationFrame(measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(runMeasure);
  else runMeasure();

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    unmeasure();
    resizeTimer = setTimeout(runMeasure, 120);
  });

  window.addEventListener(
    "scroll",
    () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const y = window.scrollY || 0;
        if (Math.abs(y - scrollY) > 0.5) {
          scrollY = y;
          render();
        }
      });
    },
    { passive: true }
  );
})();
