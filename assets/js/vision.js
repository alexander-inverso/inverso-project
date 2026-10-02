/* /vision/ — los recorridos todavía no existen: lo dicen ellos mismos al tocarlos. */

const NOTE_DONE = "Not recorded yet";

export function initVision() {
  document.querySelectorAll("[data-walk]").forEach((row) => {
    row.addEventListener("click", () => {
      row.querySelector(".vis-walk-note").textContent = NOTE_DONE;
    });
  });
}
