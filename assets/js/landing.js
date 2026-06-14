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
