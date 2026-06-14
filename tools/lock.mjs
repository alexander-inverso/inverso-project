#!/usr/bin/env node
/* Cifra content/ -> secure/content.enc
   Uso:  node tools/lock.mjs        (pide contraseña)
         INVERSO_PASS=... node tools/lock.mjs */
import fs from "node:fs";
import path from "node:path";
import { readContentBundle, encrypt, promptPassword, ENC_PATH } from "./lib.mjs";

const bundle = readContentBundle();
const password = await promptPassword("Contraseña para CIFRAR: ");
if (!password) { console.error("Contraseña vacía. Abortado."); process.exit(1); }

const enc = await encrypt(bundle, password);
fs.mkdirSync(path.dirname(ENC_PATH), { recursive: true });
fs.writeFileSync(ENC_PATH, JSON.stringify(enc));
const n = Object.keys(bundle.nodes).length, e = Object.keys(bundle.essays).length;
console.log(`✓ Cifrado: ${n} nodos, ${e} ensayos → secure/content.enc`);
console.log("  Haz commit y push de secure/content.enc (el contenido en claro NO se sube).");
