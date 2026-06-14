#!/usr/bin/env node
/* Descifra secure/content.enc -> content/ (para editar en local)
   Uso:  node tools/unlock.mjs       (pide contraseña)
         INVERSO_PASS=... node tools/unlock.mjs */
import fs from "node:fs";
import { writeContentBundle, decrypt, promptPassword, ENC_PATH } from "./lib.mjs";

if (!fs.existsSync(ENC_PATH)) { console.error("No existe secure/content.enc"); process.exit(1); }
const enc = JSON.parse(fs.readFileSync(ENC_PATH, "utf8"));
const password = await promptPassword("Contraseña para DESCIFRAR: ");

let bundle;
try {
  bundle = await decrypt(enc, password);
} catch {
  console.error("✗ Contraseña incorrecta o archivo corrupto.");
  process.exit(1);
}
writeContentBundle(bundle);
const n = Object.keys(bundle.nodes).length, e = Object.keys(bundle.essays).length;
console.log(`✓ Descifrado en content/: ${n} nodos, ${e} ensayos. Edita y luego: node tools/lock.mjs`);
