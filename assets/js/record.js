/* /record/ — pasado a la izquierda, lo de ahora en el centro con sitio, lo que
   viene a la derecha. Las entradas individuales todavía no están escritas, así
   que ninguna fila navega: responden con una píldora. */
import { RECORD, RADAR, inPhase } from "./record-data.js";
import { initPage } from "./page.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const row = (e) => `
  <button type="button" class="rec-row rec-row-off" data-notready aria-disabled="true">
    <span class="rec-row-date">${esc(e.date)}</span>
    <span class="rec-row-title">${esc(e.title)}</span>
    <span class="rec-arrow" aria-hidden="true">&rarr;</span>
  </button>`;

const card = (e) => `
  <button type="button" class="rec-card rec-card-off" data-notready aria-disabled="true">
    <div class="rec-card-meta">
      <span class="rec-card-date">${esc(e.date)}</span>
      <span class="rec-card-kind">${esc(e.kind)}</span>
    </div>
    <p class="rec-card-title">${esc(e.title)}</p>
    <p class="rec-card-body">${esc(e.body)}</p>
    <span class="rec-read">Read<span class="rec-arrow" aria-hidden="true">&rarr;</span></span>
  </button>`;

const radarRow = (e) => `
  <button type="button" class="rec-row rec-row-off" data-notready aria-disabled="true">
    <span class="rec-row-title">${esc(e.title)}</span>
    <span class="rec-arrow" aria-hidden="true">&rarr;</span>
  </button>`;

function render() {
  document.querySelector("[data-past]").innerHTML = inPhase("past").map(row).join("");
  document.querySelector("[data-now]").innerHTML = inPhase("present").map(card).join("");
  document.querySelector("[data-future]").innerHTML = inPhase("future").map(row).join("");
  document.querySelector("[data-radar]").innerHTML = RADAR.map(radarRow).join("");
}

render();
initPage();
