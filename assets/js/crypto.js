/* ============================================================
   Descifrado en cliente (Web Crypto).
   AES-GCM con clave derivada de la contraseña vía PBKDF2.
   Compatible con tools/lock.mjs (Node).
   ============================================================ */

function b64ToBuf(b64) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf;
}

export async function decryptBundle(enc, password) {
  const salt = b64ToBuf(enc.salt);
  const iv = b64ToBuf(enc.iv);
  const ct = b64ToBuf(enc.ct);
  const keyMat = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: enc.iter, hash: enc.hash },
    keyMat, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
  );
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return JSON.parse(new TextDecoder().decode(plain));
}
