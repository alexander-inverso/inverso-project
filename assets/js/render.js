/* ============================================================
   INVERSO — render
   Recibe un bundle de contenido YA descifrado y monta la vista:
   renderiza TODOS los nodos a la vez (sin anidar) y conecta el
   fondo de code art que reacciona al nodo en vista.
   No hace fetch de contenido: todo llega en el bundle.
   ============================================================ */

import { initBackground } from "./shaders/gl.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ============================================================
   mount(bundle, ctxName, base)
   bundle = { site, contexts, axioms, essaysIndex, nodes:{id:obj},
              essays:{ "archivo.md": "markdown..." } }
   ctxName = "default" | "profesional" | "internet"
   base    = prefijo de rutas (p. ej. "/preliminar")
   ============================================================ */
export function mount(bundle, ctxName, base = "") {
  const { site, contexts } = bundle;
  const ctx = contexts[ctxName] || contexts.default;
  const order = ctx.order && ctx.order.length ? ctx.order : site.nodes;
  const nodes = order.map((id) => bundle.nodes[id]).filter(Boolean);
  const essayById = Object.fromEntries(
    ((bundle.essaysIndex && bundle.essaysIndex.essays) || []).map((e) => [e.id, e])
  );

  renderTopbar(site, contexts, ctxName, base);
  renderHero(site, ctx);
  renderRail(nodes);
  const app = document.getElementById("app");
  app.innerHTML = nodes.map(renderNode).join("");
  app.insertAdjacentHTML("beforeend", renderFooter(site));

  wireReader(essayById, bundle.essays || {});
  wireJumpLinks();
  const bg = initBackground(document.getElementById("bg-canvas"));
  bg.setAccent(nodes[0]?.accent || site.accent || "#7D6B75");
  setupScrollSpy(nodes, bg, site);
  setupReveal();
}

/* ---------- topbar ---------- */
function renderTopbar(site, contexts, ctxName, base) {
  const order = ["default", "profesional", "internet"];
  const links = order
    .filter((k) => contexts[k])
    .map((k) => {
      const href = k === "default" ? `${base}/` : `${base}/${k}/`;
      const cur = k === ctxName ? ' aria-current="page"' : "";
      return `<a href="${href}"${cur}>${esc(contexts[k].label)}</a>`;
    }).join("");
  document.getElementById("topbar").innerHTML = `
    <a class="brand" href="${base}/"><b>●</b> ${esc(site.name)}</a>
    <nav class="contexts">${links}</nav>`;
}

/* ---------- hero ---------- */
function renderHero(site, ctx) {
  document.getElementById("hero").innerHTML = `
    <div class="shell">
      <p class="kicker">${esc(ctx.kicker || site.name)}</p>
      <h1>${esc(ctx.title || site.tagline)}</h1>
      <p class="lede">${esc(site.description)}</p>
      <div class="recommend">${ctx.recommendation || ""}</div>
      <span class="scroll-cue">desplázate · todo está aquí</span>
    </div>`;
}

/* ---------- rail ---------- */
function renderRail(nodes) {
  document.getElementById("rail").innerHTML = nodes.map((n) =>
    `<a href="#${n.id}" data-rail="${n.id}"><span>${esc(n.label)}</span></a>`).join("");
}

/* ---------- node ---------- */
function renderNode(n) {
  const layout = `layout-${n.layout || "flow"}`;
  const blocks = (n.blocks || []).map(renderBlock).join("");
  const essays = (n.essays || []).length ? renderEssayCards(n.essays) : "";
  const links = (n.links || []).length
    ? `<div class="node-links">${n.links.map((l) =>
        `<a href="${esc(l.href)}">${esc(l.label)} ↗</a>`).join("")}</div>` : "";
  return `
  <section class="node ${layout}" id="${esc(n.id)}" data-accent="${esc(n.accent || "")}"
           data-shader="${esc(n.shader || "field")}">
    <div class="shell">
      <p class="node-kicker reveal">${esc(n.kicker || "")}</p>
      <h2 class="reveal">${esc(n.title || n.label)}</h2>
      <p class="node-lede reveal">${esc(n.lede || "")}</p>
      <div class="node-body">
        ${blocks}
        ${essays}
        ${links}
      </div>
    </div>
  </section>`;
}

function renderBlock(b) {
  if (b.type === "prose") {
    return `<div class="block reveal">
      ${b.heading ? `<h3>${esc(b.heading)}</h3>` : ""}
      <p>${esc(b.body)}</p></div>`;
  }
  if (b.type === "list") {
    return `<div class="block reveal">
      ${b.heading ? `<h3>${esc(b.heading)}</h3>` : ""}
      <ul>${(b.items || []).map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`;
  }
  if (b.type === "quote") {
    return `<blockquote class="block block-quote reveal">${esc(b.text)}</blockquote>`;
  }
  if (b.type === "cv") {
    const rows = (b.items || []).map((r) => `
      <div class="cv-row">
        <span class="when">${esc(r.when)}</span>
        <span><span class="what">${esc(r.what)}</span><br>
        <span class="where">${esc(r.where)}</span></span>
      </div>`).join("");
    return `<div class="block cv reveal">
      ${b.heading ? `<h3>${esc(b.heading)}</h3>` : ""}${rows}</div>`;
  }
  return "";
}

function renderEssayCards(ids) {
  return `<div class="essays reveal">
    <p class="essays-label">Ensayos relacionados</p>
    <div class="essay-cards">
      ${ids.map((id) => `<article class="essay-card" data-essay="${esc(id)}">
        <h4 data-essay-title>${esc(id)}</h4>
        <p data-essay-syn></p>
        <div class="meta" data-essay-meta></div>
      </article>`).join("")}
    </div></div>`;
}

/* ---------- footer ---------- */
function renderFooter(site) {
  const ch = site.channel || {};
  return `
  <footer class="foot">
    <div class="shell">
      <h2>Hablemos.</h2>
      <p class="contact"><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
      <p class="channel"><strong>${esc(ch.name || "")}</strong> — ${esc(ch.intent || "")}</p>
      <p class="legal">${esc(site.domain)} · © 2026 ${esc(site.author)} · Sin rastreo. Sin cookies de seguimiento.</p>
    </div>
  </footer>`;
}

/* ---------- ensayos: tarjetas + lector (texto del bundle) ---------- */
function wireReader(essayById, essayText) {
  document.querySelectorAll(".essay-card").forEach((card) => {
    const e = essayById[card.dataset.essay];
    if (!e) return;
    card.querySelector("[data-essay-title]").textContent = e.title;
    card.querySelector("[data-essay-syn]").textContent = e.synopsis || "";
    card.querySelector("[data-essay-meta]").textContent =
      [(e.date || ""), ...(e.tags || [])].filter(Boolean).join(" · ");
  });

  const reader = document.getElementById("reader");
  const body = reader.querySelector(".reader-body");
  const close = () => { reader.classList.remove("open"); document.body.style.overflow = ""; };
  reader.querySelector(".reader-close").addEventListener("click", close);
  reader.addEventListener("click", (e) => { if (e.target === reader) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  document.querySelectorAll(".essay-card").forEach((card) => {
    card.addEventListener("click", () => {
      const e = essayById[card.dataset.essay];
      if (!e) return;
      const md = essayText[e.file];
      body.innerHTML = md ? mdToHtml(md) : `<p>No se pudo cargar el ensayo.</p>`;
      reader.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });
}

/* mini-markdown */
function mdToHtml(md) {
  const lines = md.replace(/\r/g, "").split("\n");
  let html = "", para = [];
  const flush = () => { if (para.length) { html += `<p>${inline(para.join(" "))}</p>`; para = []; } };
  for (const ln of lines) {
    if (/^###\s+/.test(ln)) { flush(); html += `<h3>${inline(ln.replace(/^###\s+/, ""))}</h3>`; }
    else if (/^##\s+/.test(ln)) { flush(); html += `<h2>${inline(ln.replace(/^##\s+/, ""))}</h2>`; }
    else if (/^#\s+/.test(ln)) { flush(); html += `<h1>${inline(ln.replace(/^#\s+/, ""))}</h1>`; }
    else if (/^>\s?/.test(ln)) { flush(); html += `<blockquote>${inline(ln.replace(/^>\s?/, ""))}</blockquote>`; }
    else if (/^---\s*$/.test(ln)) { flush(); html += "<hr>"; }
    else if (/^\s*$/.test(ln)) { flush(); }
    else para.push(ln);
  }
  flush();
  return html;
}
function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

/* ---------- jump links ---------- */
function wireJumpLinks() {
  document.querySelectorAll("[data-jump]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const el = document.getElementById(a.dataset.jump);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ---------- scroll spy ---------- */
function setupScrollSpy(nodes, bg, site) {
  const sections = nodes.map((n) => document.getElementById(n.id));
  const rail = document.querySelectorAll("[data-rail]");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.id;
      const node = nodes.find((n) => n.id === id);
      if (!node) return;
      const accent = node.accent || site.accent;
      document.documentElement.style.setProperty("--accent", accent);
      bg.setAccent(accent);
      bg.setMode(node.shader || "field");
      rail.forEach((r) => r.classList.toggle("active", r.dataset.rail === id));
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  sections.forEach((s) => s && obs.observe(s));
}

/* ---------- reveal ---------- */
function setupReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
}
