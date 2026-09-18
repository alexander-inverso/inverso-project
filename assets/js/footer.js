/* Pie compartido: contacto, alta en la lista de correo, aviso de cookies y el
   selector de idioma (ESP/CAT siguen bloqueados: sólo hay inglés por ahora).
   Se inyecta desde aquí para que exista una única fuente de verdad; el
   <noscript> de cada página lleva el contacto por si esto no llega a correr. */
import { createTipper } from "./tips.js";

/* Formulario alojado en Mailrelay. La misma URL sirve para dos cosas: el POST
   del formulario propio y el botón de emergencia que abre el de Mailrelay. */
const FORM_URL = "https://inverso.ipzmarketing.com/f/aGnwNmVCRF0";
const HASH = "subscribe";

/* Grupos de Mailrelay. `id` es el value de cada casilla en su formulario
   alojado, no un nombre ni una URL. Si se añade o renombra un grupo allí, hay
   que volver a mirar el HTML del formulario: el nombre visible puede cambiar
   sin que cambie el número, y al contrario. */
const GROUPS = [
  { id: "5", label: "a professional", mailrelay: "Inverso Project Professional" },
  { id: "3", label: "just curious", mailrelay: "Inverso Project Newsletter" },
  { id: "2", label: "interested in the philosophy page", mailrelay: "Inverso Project Philosophy" },
];
const GROUPS_READY = GROUPS.every((g) => g.id !== "");

/* La trampa se llama `anotheremail` porque así se llama en el formulario de
   Mailrelay: con ese nombre su servidor también la comprueba, no sólo nosotros.
   Un humano no rellena un campo que no puede ver, ni envía el formulario en
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

const groupRow = (g, i) => `
  <label class="nl-check">
    <input type="checkbox" name="subscriber[group_ids][]" value="${g.id}" data-group="${i}">
    <span>${g.label}</span>
  </label>`;

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
  <div role="dialog" aria-modal="true" aria-labelledby="nl-title" class="nl-dialog" data-nl-dialog>
    <div class="nl-head">
      <div>
        <p class="nl-kicker">E-mail updates</p>
        <p class="nl-h" id="nl-title">Let's get to know you:</p>
      </div>
      <button type="button" class="nl-close" aria-label="Close" data-nl-close>&#10005;</button>
    </div>

    <form class="nl-form" action="${FORM_URL}" method="post" accept-charset="UTF-8" target="ipz-sink" data-nl-form novalidate>
      <label class="nl-label">How should I call you?
        <input type="text" name="subscriber[name]" autocomplete="name" placeholder="Your name" data-nl-name>
      </label>
      <label class="nl-label">Newsletter e-mail
        <input type="email" name="subscriber[email]" autocomplete="email" placeholder="you@email.com" data-nl-email>
      </label>

      <fieldset class="nl-groups">
        <legend class="nl-legend">You are...</legend>
        <!-- Sin este campo vacío, no marcar nada no envía group_ids y Mailrelay
             no tiene por qué entender que hay que vaciar los grupos. Con él, la
             baja se pide explícitamente. Su propio formulario lo lleva. -->
        <input type="hidden" name="subscriber[group_ids][]" value="" autocomplete="off">
        ${GROUPS.map(groupRow).join("")}
      </fieldset>

      <div class="nl-trap" aria-hidden="true">
        <label for="anotheremail">Leave this field empty</label>
        <input type="text" id="anotheremail" name="anotheremail" tabindex="-1" autocomplete="new-password" value="" data-nl-trap>
      </div>

      <p class="nl-hint" role="status" data-nl-hint></p>
      <input type="hidden" name="commit" value="Enviar">
      <button type="submit" class="nl-submit" data-nl-submit>Sign me up</button>
    </form>

    <div class="nl-fallback">
      <p class="nl-fallback-note">Fallback, in case anything here misbehaves:</p>
      <a class="nl-fallback-btn" href="${FORM_URL}" target="_blank" rel="noopener">Open the form on Mailrelay &rarr;</a>
    </div>
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

  /* ---- alta y baja en la lista ---- */
  const scrim = host.querySelector("[data-nl-scrim]");
  const form = host.querySelector("[data-nl-form]");
  const submit = host.querySelector("[data-nl-submit]");
  const hint = host.querySelector("[data-nl-hint]");
  const nameEl = host.querySelector("[data-nl-name]");
  const emailEl = host.querySelector("[data-nl-email]");
  const trap = host.querySelector("[data-nl-trap]");
  const sink = host.querySelector("[data-nl-sink]");
  const boxes = Array.from(host.querySelectorAll("[data-group]"));
  /* Nunca 0: Date.now() - 0 son cincuenta años y la trampa de tiempo
     pasaría sola. Se reinicia al abrir el diálogo. */
  let openedAt = Date.now();
  let sending = false;

  /* Qué haría el formulario ahora mismo, dicho en voz alta. Nombre + correo +
     al menos una casilla da de alta; sólo el correo, sin casillas, da de baja. */
  function state() {
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const picked = boxes.filter((b) => b.checked);
    if (!email) return { key: "idle", picked };
    if (!picked.length) return { key: "unsubscribe", picked };
    if (!name) return { key: "needName", picked };
    return { key: "subscribe", picked };
  }

  const COPY = {
    idle: {
      hint: "Your e-mail is all it takes to start. Tick a box below to sign up, or leave them all empty to unsubscribe.",
      label: "Sign me up",
    },
    needName: {
      hint: "Add your name and you're signed up.",
      label: "Sign me up",
    },
    unsubscribe: {
      hint: "No boxes ticked — sending this takes you off the list.",
      label: "Unsubscribe me",
    },
    subscribe: { label: "Sign me up" },
  };

  function refresh() {
    if (sending) return;
    const s = state();
    submit.textContent = COPY[s.key].label;
    submit.classList.toggle("nl-submit-off", s.key === "idle" || s.key === "needName");
    submit.classList.toggle("nl-submit-leave", s.key === "unsubscribe");
    if (s.key === "subscribe") {
      const names = s.picked.map((b) => GROUPS[+b.dataset.group].label).join(", ");
      hint.textContent = "Signing you up as: " + names + ".";
      hint.classList.remove("nl-hint-warn");
    } else {
      hint.textContent = COPY[s.key].hint;
      hint.classList.remove("nl-hint-warn");
    }
  }

  [nameEl, emailEl].forEach((el) => el.addEventListener("input", refresh));
  boxes.forEach((b) => b.addEventListener("change", refresh));
  refresh();

  /* Rellenar y enviar de golpe es cosa de bots: se cronometra también desde la
     primera pulsación, no sólo desde que se abrió el diálogo. */
  let firstInputAt = 0;
  const markInput = () => { if (!firstInputAt) firstInputAt = Date.now(); };
  [nameEl, emailEl].forEach((el) => el.addEventListener("input", markInput, { once: true }));

  const open = () => {
    scrim.hidden = false;
    openedAt = Date.now();
    if (location.hash.replace("#", "") !== HASH) history.pushState(null, "", "#" + HASH);
    nameEl.focus();
  };
  const close = () => {
    scrim.hidden = true;
    if (location.hash.replace("#", "") === HASH) {
      history.pushState(null, "", location.pathname + location.search);
    }
  };
  const done = (word) => { sending = false; submit.textContent = word; };

  host.querySelector("[data-nl-open]").addEventListener("click", open);
  host.querySelector("[data-nl-close]").addEventListener("click", close);
  scrim.addEventListener("click", (e) => { if (e.target === scrim) close(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !scrim.hidden) close(); });
  window.addEventListener("hashchange", () => {
    const wants = location.hash.replace("#", "") === HASH;
    if (wants && scrim.hidden) open();
    else if (!wants && !scrim.hidden) close();
  });
  if (location.hash.replace("#", "") === HASH) open();

  form.addEventListener("submit", (e) => {
    /* Los bots primero, y en silencio: ni el campo trampa ni un envío
       instantáneo llegan a Mailrelay, pero se responde "Thanks" igual. */
    const since = Math.max(openedAt, firstInputAt);
    if (trap.value !== "" || Date.now() - since < MIN_FILL_MS) {
      e.preventDefault();
      done("Thanks");
      return;
    }

    const s = state();
    if (s.key === "idle") {
      e.preventDefault();
      hint.textContent = "An e-mail address first, please.";
      hint.classList.add("nl-hint-warn");
      emailEl.focus();
      return;
    }
    if (s.key === "needName") {
      e.preventDefault();
      hint.textContent = "A name too, so I know who you are.";
      hint.classList.add("nl-hint-warn");
      nameEl.focus();
      return;
    }
    /* Un id de grupo vacío llegaría como "sin grupos", que es justo lo que
       significa darse de baja. Antes de dar de alta a nadie sin querer, no se
       envía. Sólo puede pasar si alguien vacía un id en GROUPS. */
    if (s.key === "subscribe" && !GROUPS_READY) {
      e.preventDefault();
      hint.textContent = "Sign-up is misconfigured — use the Mailrelay form below.";
      hint.classList.add("nl-hint-warn");
      return;
    }

    sending = true;
    submit.textContent = "Sending…";
    submit.dataset.word = s.key === "unsubscribe" ? "Unsubscribed" : "Thanks";
  });
  sink.addEventListener("load", () => { if (sending) done(submit.dataset.word || "Thanks"); });

  /* ---- cookies ---- */
  const ck = host.querySelector("[data-cookies]");
  host.querySelector("[data-cookies-open]").addEventListener("click", () => { ck.hidden = !ck.hidden; });
  host.querySelector("[data-cookies-close]").addEventListener("click", () => { ck.hidden = true; });
}
