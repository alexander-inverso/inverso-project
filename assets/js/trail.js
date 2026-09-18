/* Migas de pan: el enlace "atrás" nombra la página de la que vienes.
   El rastro viaja en ?trail=/a/|/b/ y cada enlace interno se anota al cargar,
   así que volver por donde viniste funciona sin historial ni servidor. */

const PAGES = {
  "/": "__home",
  "/about/": "About me",
  "/vision/": "The vision",
  "/philosophy/": "Philosophy",
  "/record/": "What I'm up to",
  "/record/entry/": "Record",
  "/portfolio/": "Portfolio",
};

const norm = (p) => {
  if (!p) return "";
  const path = p.split("?")[0].split("#")[0];
  return path.endsWith("/") ? path : path + "/";
};

const enc = (arr) => arr.map(encodeURIComponent).join("|");

function readTrail() {
  return (new URLSearchParams(location.search).get("trail") || "")
    .split("|")
    .filter(Boolean)
    .map(norm)
    .filter((s) => PAGES[s]);
}

/* fallback: adónde ir cuando nadie nos dijo de dónde venimos */
export function back(fallback) {
  const trail = readTrail();
  const prev = trail.length ? trail[trail.length - 1] : norm(fallback);
  const label = PAGES[prev] || "Back";
  const rest = trail.slice(0, -1);
  return {
    href: prev + (rest.length ? "?trail=" + enc(rest) : ""),
    label,
    isHome: label === "__home",
  };
}

/* Anota los enlaces internos con el rastro. Si el destino ya está en el
   rastro, recorta: navegar "hacia arriba" no debe alargar la cadena. */
export function decorate() {
  const me = norm(location.pathname);
  const trail = readTrail();
  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.includes("trail=")) return;
    if (/^(https?:|mailto:|#)/.test(href)) return;
    const target = norm(new URL(href, location.href).pathname);
    if (!PAGES[target]) return;
    const idx = trail.indexOf(target);
    const next = idx >= 0 ? trail.slice(0, idx) : trail.concat([me]);
    if (!next.length) return;
    a.setAttribute("href", href + (href.includes("?") ? "&" : "?") + "trail=" + enc(next));
  });
}

/* Rellena el enlace atrás: <a data-back data-back-fallback="/about/"> */
export function renderBack() {
  const el = document.querySelector("[data-back]");
  if (!el) return;
  const { href, label, isHome } = back(el.dataset.backFallback || "/");
  el.setAttribute("href", href);
  const slot = el.querySelector("[data-back-label]");
  if (!slot) return;
  if (isHome) {
    slot.className = "back-mark";
    slot.innerHTML = 'I<span class="accent-glyph">И</span>VE<span class="accent-glyph">Я</span>SO';
  } else {
    slot.className = "";
    slot.textContent = label;
  }
}

export function currentTrail() {
  return enc(readTrail());
}
