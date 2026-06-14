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

- `index.html`, `profesional/`, `internet/` — una página por contexto.
- `assets/css/main.css` — sistema visual y paleta (theming por nodo).
- `assets/js/main.js` — carga el contenido y renderiza todos los nodos.
- `assets/js/shaders/gl.js` — fondo WebGL (modos: field, lattice, noisefield, flow).
- `content/` — todo el contenido, separado del código.

## Desarrollo local

El sitio carga el contenido por `fetch`, así que necesita servirse por HTTP
(no abrir el archivo con `file://`):

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo extender (modularidad)

### Añadir un nodo nuevo

1. Crea `content/nodes/mi-nodo.json` (copia uno existente como plantilla).
2. Añade su `id` a `content/site.json` → `nodes`.
3. Añádelo al `order` de los contextos en `content/contexts.json` donde quieras
   que aparezca.

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

### Añadir un contexto (p. ej. `/inversores`)

1. Añade la entrada en `content/contexts.json` con su `recommendation` y `order`.
2. Duplica `profesional/index.html` en `inversores/index.html` y cambia
   `data-context="inversores"`.

## Paleta (del brief)

`#1A1718` ink · `#2A2629` charcoal · `#35313A` onyx · `#5E4B56` smoke ·
`#7D6B75` mauve (acento). Acento general: púrpura desaturado.

## Contacto

correo@inverso.bio

---

El sitio antiguo se conserva en `_legacy/` por si hace falta consultarlo.
`BRIEF.md` es el documento de visión original (referencia).
