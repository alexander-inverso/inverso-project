/* Píldoras flotantes para lo que aún no existe. Cada una vive en su propio
   temporizador, así que una nueva nunca corta la anterior. */

const PAD = 8;

function place(x, y, joke) {
  const w = joke ? 240 : 160;
  const h = joke ? 64 : 30;
  const left = x + 14 + w + PAD > window.innerWidth ? Math.max(PAD, x - 14 - w) : x + 14;
  const top = y + 14 + h + PAD > window.innerHeight ? Math.max(PAD, y - 14 - h) : y + 14;
  return { left, top };
}

/* Una broma cada 3-5 clics, nunca la misma dos veces seguidas. */
function rotator(list) {
  let clicks = 0;
  let next = 3 + Math.floor(Math.random() * 3);
  let last = null;
  return () => {
    clicks += 1;
    if (clicks < next) return null;
    clicks = 0;
    next = 3 + Math.floor(Math.random() * 3);
    const all = list() || [];
    if (!all.length) return null;
    const pool = all.length > 1 ? all.filter((j) => j !== last) : all;
    last = pool[Math.floor(Math.random() * pool.length)];
    return last;
  };
}

/* jokesModule: ruta al módulo con `export const jokes`. */
export function createTipper({ jokesModule, plain }) {
  let jokes = [];
  import(jokesModule).then((m) => { jokes = m.jokes || []; }).catch(() => {});
  const nextJoke = rotator(() => jokes);

  return (event) => {
    const joke = nextJoke();
    const el = document.createElement("div");
    el.className = joke ? "tip tip-joke" : "tip";
    el.setAttribute("role", "status");
    el.textContent = joke || plain;
    const { left, top } = place(event.clientX, event.clientY, !!joke);
    el.style.left = left + "px";
    el.style.top = top + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), joke ? 3900 : 2200);
  };
}

/* Conecta cada [data-notready] a una píldora. */
export function wireNotReady(plain = "Not ready yet") {
  const nodes = document.querySelectorAll("[data-notready]");
  if (!nodes.length) return;
  const tip = createTipper({ jokesModule: "./not-ready-jokes.js", plain });
  nodes.forEach((el) => el.addEventListener("click", tip));
}
