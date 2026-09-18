/* Pie compartido: contacto, alta en la lista de correo, aviso de cookies y el
   selector de idioma (ESP/CAT siguen bloqueados: sólo hay inglés por ahora).
   Se inyecta desde aquí para que exista una única fuente de verdad; el
   <noscript> de cada página lleva el contacto por si esto no llega a correr. */
import { createTipper } from "./tips.js";

const ACTION = "https://inverso.ipzmarketing.com/f/DmdC0JRZiwE";
const HASH = "subscribe";

/* Un humano no rellena un campo que no puede ver, ni envía el formulario en
   menos de un segundo y medio. Si pasa cualquiera de las dos cosas, no se
   envía nada — y decimos "Thanks" igual, para no darle pistas al bot. */
const MIN_FILL_MS = 1500;

const CONTACTS = [
  ["project", "alexander@inverso.bio", "mailto:alexander@inverso.bio", false],
  ["academic", "alexander.de.toro@estudiantat.upc.edu", "mailto:alexander.de.toro@estudiantat.upc.edu", false],
  ["instagram", "@alexander.inverso", "https://instagram.com/alexander.inverso", true],
  ["linkedin", "alexander-de-toro-todorov", "https://www.linkedin.com/in/alexander-de-toro-todorov-9b830b257/", true],
];

const contactRow = ([tag, text, href, external]) => `
  <p class="contact-row">
    <span class="contact-tag">${tag}</span>
    <a href="${href}"${external ? ' target="_blank" rel="noopener"' : ""}${tag === "academic" ? ' class="break-all"' : ""}>${text}</a>
  </p>`;

const TEMPLATE = `
<div class="ft-inner">
  <div class="ft-cols">
    <div>
      <h3 class="ft-h">Contact</h3>
      <div class="ft-contacts" data-contact>${CONTACTS.map(contactRow).join("")}</div>
    </div>
    <div>
      <h3 class="ft-h">E-mail updates</h3>
      <button type="button" class="ft-sub-open" data-nl-open>Subscribe or manage &nbsp;&rarr;</button>
      <p class="ft-note">Occasional notes on the work. No schedule.</p>
    </div>
  </div>

  <div class="ft-bar">
    <div class="ft-bar-left">
      <button type="button" class="ft-link-btn" data-cookies-open>Cookies</button>
    </div>
    <div class="lang-switch" role="group" aria-label="Language" data-lang-track="en">
      <span class="lang-pill" aria-hidden="true"></span>
      <button type="button" class="lang-btn" data-btn="es" aria-disabled="true">ESP</button>
      <button type="button" class="lang-btn" data-btn="en" aria-pressed="true">ENG</button>
      <button type="button" class="lang-btn" data-btn="ca" aria-disabled="true">CAT</button>
    </div>
    <span class="ft-copy">&copy; 2026 Alexander de Toro</span>
  </div>
</div>

<div class="nl-scrim" data-nl-scrim hidden>
  <div role="dialog" aria-modal="true" aria-label="E-mail updates" class="nl-dialog" data-nl-dialog>
    <div class="nl-head">
      <div>
        <p class="nl-kicker">E-mail updates</p>
        <p class="nl-blurb">Occasional notes on the work. No schedule.</p>
      </div>
      <button type="button" class="nl-close" aria-label="Close" data-nl-close>&#10005;</button>
    </div>
    <form class="nl-form" action="${ACTION}" method="post" target="ipz-sink" data-nl-form>
      <label class="nl-label">Name
        <input type="text" name="subscriber[name]" required autocomplete="name" placeholder="Your name">
      </label>
      <label class="nl-label">E-mail
        <input type="email" name="subscriber[email]" required autocomplete="email" placeholder="you@email.com">
      </label>
      <div class="nl-trap" aria-hidden="true">
        <label for="ipz_honeypot">Leave this field empty</label>
        <input type="text" id="ipz_honeypot" name="ipz_honeypot" tabindex="-1" autocomplete="off" value="" data-nl-trap>
      </div>
      <button type="submit" class="nl-submit" data-nl-submit>Subscribe</button>
    </form>
    <p class="nl-foot">Already subscribed? Re-submit with the same e-mail to update your details.</p>
  </div>
</div>

<iframe name="ipz-sink" title="Newsletter submission" aria-hidden="true" tabindex="-1" class="nl-sink" data-nl-sink></iframe>

<div role="dialog" aria-label="Cookie preferences" class="ck-box" data-cookies hidden>
  <p class="ck-kicker">Cookies</p>
  <p class="ck-body">This site uses only what it needs to work. Analytics are off by default. Embedded video (YouTube) and the e-mail signup form are loaded from third parties and set their own cookies.</p>
  <div class="ck-actions">
    <button type="button" class="ck-close" data-cookies-close>Close</button>
  </div>
</div>
`;

export function mountFooter() {
  const host = document.querySelector("footer[data-site-footer]");
  if (!host) return;
  host.innerHTML = TEMPLATE;

  /* ---- idioma: sólo inglés; ESP y CAT responden con una píldora ---- */
  const langTip = createTipper({ jokesModule: "./lang-jokes.js", plain: "Not available yet" });
  host.querySelectorAll('.lang-btn[aria-disabled="true"]').forEach((btn) => {
    btn.addEventListener("click", langTip);
  });

  /* ---- alta en la lista ---- */
  const scrim = host.querySelector("[data-nl-scrim]");
  const form = host.querySelector("[data-nl-form]");
  const submit = host.querySelector("[data-nl-submit]");
  const trap = host.querySelector("[data-nl-trap]");
  const sink = host.querySelector("[data-nl-sink]");
  let openedAt = 0;
  let sending = false;

  const open = () => {
    scrim.hidden = false;
    openedAt = Date.now();
    if (location.hash.replace("#", "") !== HASH) history.pushState(null, "", "#" + HASH);
    const first = form.querySelector("input");
    if (first) first.focus();
  };
  const close = () => {
    scrim.hidden = true;
    if (location.hash.replace("#", "") === HASH) {
      history.pushState(null, "", location.pathname + location.search);
    }
  };
  const done = () => { sending = false; submit.textContent = "Thanks"; };

  host.querySelector("[data-nl-open]").addEventListener("click", open);
  host.querySelector("[data-nl-close]").addEventListener("click", close);
  scrim.addEventListener("click", (e) => { if (e.target === scrim) close(); });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !scrim.hidden) close();
  });
  window.addEventListener("hashchange", () => {
    const wants = location.hash.replace("#", "") === HASH;
    if (wants && scrim.hidden) open();
    else if (!wants && !scrim.hidden) close();
  });
  if (location.hash.replace("#", "") === HASH) open();

  form.addEventListener("submit", (e) => {
    if (trap.value !== "" || Date.now() - openedAt < MIN_FILL_MS) {
      e.preventDefault();
      done();
      return;
    }
    sending = true;
    submit.textContent = "Sending…";
  });
  sink.addEventListener("load", () => { if (sending) done(); });

  /* ---- cookies ---- */
  const ck = host.querySelector("[data-cookies]");
  host.querySelector("[data-cookies-open]").addEventListener("click", () => { ck.hidden = !ck.hidden; });
  host.querySelector("[data-cookies-close]").addEventListener("click", () => { ck.hidden = true; });
}
