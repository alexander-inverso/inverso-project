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
  es: {
    kicker: "Proyecto Inverso",
    lede: "Un proyecto sobre cómo entender el mundo: biología, computación, epistemología y preguntas grandes. Todavía tomando forma.",
    emailLabel: "correo",
    instaLabel: "insta",
  },
  en: {
    kicker: "The Inverso Project",
    lede: "A project about how to understand the world: biology, computing, epistemology and big questions. Still taking shape.",
    emailLabel: "email",
    instaLabel: "insta",
  },
  ca: {
    kicker: "Projecte Inverso",
    lede: "Un projecte sobre com entendre el món: biologia, computació, epistemologia i grans preguntes. Encara prenent forma.",
    emailLabel: "correu",
    instaLabel: "insta",
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
  const dict = I18N[lang] || I18N.es;
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
  });
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});
applyLang(pickInitial());
