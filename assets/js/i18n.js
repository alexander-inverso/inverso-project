/* Selector de idioma de la landing: ESP · ENG · CAT.
   Módulo autónomo, sin dependencias: el cambio de idioma funciona
   aunque el fondo de code art (WebGL) no llegue a cargar. */

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
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch (_) { /* localStorage puede estar bloqueado */ }
  const nav = (navigator.language || "es").slice(0, 2).toLowerCase();
  return LANGS.includes(nav) ? nav : "es";
}

function applyLang(lang) {
  const dict = I18N[lang] || I18N.es;
  document.documentElement.lang = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignora */ }

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
