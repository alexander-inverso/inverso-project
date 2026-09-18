/* Arranque común de página. Las páginas que generan contenido lo pintan antes
   de llamar a initPage(), para que los enlaces nuevos también reciban el rastro. */
import "./bg.js";
import { mountFooter } from "./footer.js";
import { decorate, renderBack } from "./trail.js";
import { wireNotReady } from "./tips.js";

export function initPage() {
  mountFooter();
  decorate();
  renderBack();
  wireNotReady();
}
