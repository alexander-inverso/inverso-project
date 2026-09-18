/* /record/entry/?event=slug — una entrada del registro, con salto a la anterior
   y la siguiente de la línea temporal. */
import { RECORD, PHASE } from "./record-data.js";
import { currentTrail } from "./trail.js";
import { initPage } from "./page.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const slug = new URLSearchParams(location.search).get("event");
const idx = Math.max(0, RECORD.findIndex((e) => e.slug === slug));
const e = RECORD[idx];

/* los hermanos conservan el rastro, así que "atrás" sigue apuntando a donde
   entró el lector */
const sibling = (n) => "/record/entry/?event=" + encodeURIComponent(n.slug)
  + (currentTrail() ? "&trail=" + currentTrail() : "");

document.title = e.title + " — Proyecto Inverso";

document.querySelector("[data-entry-date]").textContent = e.date;
document.querySelector("[data-entry-phase]").textContent = PHASE[e.phase] || "";
document.querySelector("[data-entry-kind]").textContent = e.kind;
document.querySelector("[data-entry-title]").textContent = e.title;
document.querySelector("[data-entry-body]").textContent = e.body;

const prev = RECORD[idx - 1];
const next = RECORD[idx + 1];
const steps = document.querySelector("[data-entry-steps]");
steps.innerHTML = [
  prev ? `<a class="rec-step" href="${sibling(prev)}"><span class="rec-step-label">&larr; Earlier</span><span class="rec-step-title">${esc(prev.title)}</span></a>` : "",
  next ? `<a class="rec-step rec-step-next" href="${sibling(next)}"><span class="rec-step-label">Later &rarr;</span><span class="rec-step-title">${esc(next.title)}</span></a>` : "",
].join("");

initPage();
