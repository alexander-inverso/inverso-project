/* Utilidades compartidas para lock/unlock. */
import { webcrypto } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const subtle = webcrypto.subtle;
export const ITER = 200000;
export const HASH = "SHA-256";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
export const CONTENT = path.join(ROOT, "content");
export const ENC_PATH = path.join(ROOT, "secure", "content.enc");

export function readContentBundle() {
  const rd = (p) => JSON.parse(fs.readFileSync(path.join(CONTENT, p), "utf8"));
  const bundle = {
    site: rd("site.json"),
    contexts: rd("contexts.json"),
    axioms: rd("axioms.json"),
    essaysIndex: rd("essays/index.json"),
    nodes: {},
    essays: {},
  };
  for (const f of fs.readdirSync(path.join(CONTENT, "nodes")).filter((f) => f.endsWith(".json"))) {
    bundle.nodes[f.replace(/\.json$/, "")] = rd(`nodes/${f}`);
  }
  for (const f of fs.readdirSync(path.join(CONTENT, "essays")).filter((f) => f.endsWith(".md"))) {
    bundle.essays[f] = fs.readFileSync(path.join(CONTENT, "essays", f), "utf8");
  }
  return bundle;
}

export function writeContentBundle(bundle) {
  const wr = (p, obj) =>
    fs.writeFileSync(path.join(CONTENT, p), JSON.stringify(obj, null, 2) + "\n");
  fs.mkdirSync(path.join(CONTENT, "nodes"), { recursive: true });
  fs.mkdirSync(path.join(CONTENT, "essays"), { recursive: true });
  wr("site.json", bundle.site);
  wr("contexts.json", bundle.contexts);
  wr("axioms.json", bundle.axioms);
  wr("essays/index.json", bundle.essaysIndex);
  for (const [id, obj] of Object.entries(bundle.nodes)) wr(`nodes/${id}.json`, obj);
  for (const [file, md] of Object.entries(bundle.essays))
    fs.writeFileSync(path.join(CONTENT, "essays", file), md);
}

async function deriveKey(password, salt, usage) {
  const keyMat = await subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
  );
  return subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITER, hash: HASH },
    keyMat, { name: "AES-GCM", length: 256 }, false, [usage]
  );
}

export async function encrypt(obj, password) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, "encrypt");
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const ct = await subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return {
    v: 1, kdf: "PBKDF2", hash: HASH, iter: ITER,
    salt: Buffer.from(salt).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
    ct: Buffer.from(new Uint8Array(ct)).toString("base64"),
  };
}

export async function decrypt(enc, password) {
  const salt = Buffer.from(enc.salt, "base64");
  const iv = Buffer.from(enc.iv, "base64");
  const ct = Buffer.from(enc.ct, "base64");
  const key = await deriveKey(password, salt, "decrypt");
  const plain = await subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return JSON.parse(new TextDecoder().decode(plain));
}

export function promptPassword(label = "Contraseña: ") {
  if (process.env.INVERSO_PASS) return Promise.resolve(process.env.INVERSO_PASS);
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const stdout = process.stdout;
    rl._writeToOutput = (s) => { if (s.includes(label)) stdout.write(label); };
    rl.question(label, (answer) => { rl.close(); stdout.write("\n"); resolve(answer); });
  });
}
