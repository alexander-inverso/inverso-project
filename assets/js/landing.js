/* Fondo de code art para la landing pública. */
import { initBackground } from "./shaders/gl.js";
const bg = initBackground(document.getElementById("bg-canvas"));
bg.setMode("field");
bg.setAccent("#7D6B75");
