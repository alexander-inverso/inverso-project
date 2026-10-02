/* /vision/ — las palabras clave se encienden cuando el ratón pasa cerca, y la
   que tienes debajo saca su anticipo. El botón las fija encendidas, que es la
   vía para quien va con el dedo o con el teclado y no tiene "cerca". */

const NEAR = 70;        // px: a esta distancia una palabra ya se enciende
const NOTE_DONE = "Not recorded yet";

export function initVision() {
  const mosaic = document.querySelector("[data-mosaic]");
  const pop = document.querySelector("[data-pop]");
  const popTitle = pop && pop.querySelector("[data-pop-title]");
  const kws = [...document.querySelectorAll("[data-kw]")];
  if (!mosaic || !pop || !kws.length) return;

  let pinned = false;
  let hovered = null;

  const hidePop = () => {
    pop.removeAttribute("data-show");
    hovered = null;
  };

  const showPop = (el) => {
    popTitle.textContent = el.textContent;
    /* medir con el globo ya pintado, si no sale descolocado la primera vez */
    pop.setAttribute("data-show", "");
    const r = el.getBoundingClientRect();
    const w = pop.offsetWidth;
    const h = pop.offsetHeight;
    const x = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2));
    const y = r.top - h - 12 < 12 ? r.bottom + 12 : r.top - h - 12;
    pop.style.left = x + "px";
    pop.style.top = y + "px";
  };

  /* distancia del cursor a la palabra: por rects, que una palabra puede partirse
     en dos líneas y entonces son dos cajas */
  const distance = (el, x, y) => {
    let best = Infinity;
    for (const r of el.getClientRects()) {
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      best = Math.min(best, Math.hypot(dx, dy));
    }
    return best;
  };

  let frame = 0;
  const onMove = (e) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      let over = null;
      for (const k of kws) {
        const d = distance(k, e.clientX, e.clientY);
        k.toggleAttribute("data-on", d < NEAR);
        if (d === 0) over = k;
      }
      if (over !== hovered) {
        hovered = over;
        over ? showPop(over) : hidePop();
      }
    });
  };

  const clearAll = () => {
    kws.forEach((k) => k.removeAttribute("data-on"));
    hidePop();
  };

  document.addEventListener("mousemove", onMove, { passive: true });
  document.documentElement.addEventListener("mouseleave", clearAll);

  /* teclado: el foco enseña el anticipo igual que el ratón */
  kws.forEach((k) => {
    k.addEventListener("focus", () => showPop(k));
    k.addEventListener("blur", hidePop);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hidePop();
  });

  const btn = document.querySelector("[data-hl]");
  btn.addEventListener("click", () => {
    pinned = !pinned;
    mosaic.toggleAttribute("data-pinned", pinned);
    btn.setAttribute("aria-pressed", String(pinned));
    btn.textContent = pinned ? "Hide highlights" : "Show highlights";
    if (!pinned) hidePop();
  });

  /* los recorridos todavía no existen: lo dicen ellos mismos al tocarlos */
  document.querySelectorAll("[data-walk]").forEach((row) => {
    row.addEventListener("click", () => {
      row.querySelector(".vis-walk-note").textContent = NOTE_DONE;
    });
  });
}
