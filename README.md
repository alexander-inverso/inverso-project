# Proyecto Inverso — inverso.bio

Un manifiesto de cómo pienso. Una web modular que presenta mi forma de entender
el mundo a través de **nodos** temáticos: biografía, computación heterogénea,
epistemología, sentido de la vida, jerarquía social, socioeconomía y mindset.

Todo el contenido se ve **a la vez**, en una sola página de scroll (sin menús
anidados). Distintas **rutas de contexto** (`/`, `/profesional/`, `/internet/`)
reordenan los nodos y muestran un mensaje que recomienda por dónde empezar.

## Stack

Sitio **estático sin build**: HTML + CSS + JavaScript moderno (ES modules) y un
fondo de *code art* en **WebGL**. Se despliega directamente en GitHub Pages
(`CNAME` → inverso.bio), sin pipeline de compilación.

- `index.html` — **landing pública**: Proyecto Inverso, Alexander DTT y el
  correo de contacto. Es lo único que ve cualquier visitante.
- `preliminar/` — **vista completa, protegida**. El contenido viaja **cifrado**
  y se descifra en el navegador con la contraseña (`/preliminar/`,
  `/preliminar/profesional/`, `/preliminar/internet/`).
- `assets/js/render.js` — renderiza todos los nodos desde el bundle descifrado.
- `assets/js/preliminar.js` + `crypto.js` — puerta de contraseña y descifrado.
- `assets/js/shaders/gl.js` — fondo WebGL (modos: field, lattice, noisefield, flow).
- `secure/content.enc` — el contenido **cifrado** (esto sí se sube).
- `content/` — el contenido en **texto plano**, solo en local (gitignorado).

## Privacidad — cómo funciona

El texto plano (`content/`) **nunca se sube**: está en `.gitignore`. Lo que se
publica es `secure/content.enc`, un blob cifrado con **AES-GCM** y clave derivada
de tu contraseña (PBKDF2). Sin la contraseña no se puede leer, ni siquiera
descargando el archivo. La landing pública no contiene nada protegido.

> ⚠️ **Contraseña temporal: `inverso`.** Cámbiala por la tuya antes de escribir
> nada privado (ver abajo).

## Editar el contenido (flujo seguro)

```bash
# 1. traer la última versión
git pull

# 2. descifrar a texto plano en content/ (te pedirá la contraseña)
node tools/unlock.mjs

# 3. editar content/nodes/*.json y content/essays/*.md con tu editor

# 4. volver a cifrar (aquí pones TU contraseña — la primera vez la cambias)
node tools/lock.mjs

# 5. subir (solo cambia secure/content.enc; content/ no se sube)
git add secure/content.enc && git commit -m "Update content" && git push
```

Puedes pasar la contraseña sin que se vea con `INVERSO_PASS=... node tools/lock.mjs`.

## Vista previa local

```bash
python3 -m http.server 8000
# http://localhost:8000          -> landing pública
# http://localhost:8000/preliminar/  -> pide contraseña y descifra
```

## Cómo extender (modularidad)

### Añadir un nodo nuevo

1. `node tools/unlock.mjs` para tener `content/` en texto plano.
2. Crea `content/nodes/mi-nodo.json` (copia uno existente como plantilla).
3. Añade su `id` a `content/site.json` → `nodes`.
4. Añádelo al `order` de los contextos en `content/contexts.json` donde quieras
   que aparezca.
5. `node tools/lock.mjs` y push.

Campos de un nodo:

| Campo | Qué hace |
|-------|----------|
| `accent` | Color de acento del nodo (su personalidad). |
| `shader` | Fondo de code art: `field`, `lattice`, `noisefield`, `flow`. |
| `layout` | `split`, `flow` o `manifesto`. |
| `blocks` | Contenido: `prose`, `list`, `quote`, `cv`. |
| `essays` | IDs de ensayos relacionados (de `content/essays/`). |
| `links` | Botones de enlace al pie del nodo. |

### Añadir un ensayo

1. Crea `content/essays/mi-ensayo.md`.
2. Regístralo en `content/essays/index.json`.
3. Referencia su `id` desde el array `essays` de cualquier nodo.

### Añadir un contexto (p. ej. `/preliminar/inversores`)

1. Añade la entrada en `content/contexts.json` con su `recommendation` y `order`
   (y vuelve a `lock`).
2. Duplica `preliminar/profesional/index.html` en
   `preliminar/inversores/index.html` y cambia `data-context="inversores"`.

## Paleta (del brief)

`#1A1718` ink · `#2A2629` charcoal · `#35313A` onyx · `#5E4B56` smoke ·
`#7D6B75` mauve (acento). Acento general: púrpura desaturado.

## Contacto

Alexander DTT — alexander@inverso.bio

---

El sitio antiguo se conserva en `_legacy/` por si hace falta consultarlo.
`BRIEF.md` es el documento de visión original (referencia).
