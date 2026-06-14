/* ============================================================
   /preliminar — entrada protegida.
   Pide contraseña, descarga el blob cifrado, lo descifra en el
   navegador y monta la vista. Sin contraseña no hay contenido.
   ============================================================ */

import { decryptBundle } from "./crypto.js";
import { mount } from "./render.js";

const CONTEXT = document.body.dataset.context || "default";
const BASE = document.body.dataset.base || "";
const ENC_URL = "/secure/content.enc";
const SS_KEY = "inverso.pass";

const gate = document.getElementById("gate");
const form = document.getElementById("gate-form");
const passInput = document.getElementById("gate-pass");
const errorEl = document.getElementById("gate-error");

let encPromise = fetch(ENC_URL).then((r) => {
  if (!r.ok) throw new Error("No se encontró el contenido cifrado.");
  return r.json();
});

async function tryUnlock(password) {
  errorEl.textContent = "";
  let enc;
  try {
    enc = await encPromise;
  } catch (e) {
    errorEl.textContent = e.message;
    return false;
  }
  try {
    const bundle = await decryptBundle(enc, password);
    sessionStorage.setItem(SS_KEY, password);
    gate.classList.add("unlocked");
    setTimeout(() => { gate.style.display = "none"; }, 350);
    document.body.classList.add("unlocked");
    mount(bundle, CONTEXT, BASE);
    return true;
  } catch {
    errorEl.textContent = "Contraseña incorrecta.";
    passInput.value = "";
    passInput.focus();
    return false;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const pw = passInput.value;
  if (pw) tryUnlock(pw);
});

// si ya se desbloqueó en esta pestaña, no volver a preguntar
const saved = sessionStorage.getItem(SS_KEY);
if (saved) {
  tryUnlock(saved).then((ok) => { if (!ok) passInput.focus(); });
} else {
  passInput.focus();
}
