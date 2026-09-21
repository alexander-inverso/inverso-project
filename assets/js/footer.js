/* Pie compartido: contacto, alta en la lista de correo, aviso de cookies y el
   selector de idioma (ESP/CAT siguen bloqueados: sólo hay inglés por ahora).
   Se inyecta desde aquí para que exista una única fuente de verdad; el
   <noscript> de cada página lleva el contacto por si esto no llega a correr. */
import { createTipper } from "./tips.js";

/* Formulario alojado en Mailrelay. La misma URL sirve para dos cosas: el POST
   del formulario propio y el botón de emergencia que abre el de Mailrelay. */
const FORM_URL = "https://inverso.ipzmarketing.com/f/dCqSdYRxa1A";
const HASH = "subscribe";

/* Grupos de Mailrelay. `id` es el value de cada casilla en su formulario
   alojado, no un nombre ni una URL. Si se añade o renombra un grupo allí, hay
   que volver a mirar el HTML del formulario: el nombre visible puede cambiar
   sin que cambie el número, y al contrario. */
const GROUPS = [
  { id: "5", label: "a professional", mailrelay: "Inverso Project Professional" },
  { id: "3", label: "just curious", mailrelay: "Inverso Project Newsletter" },
  { id: "6", label: "interested in the vision", mailrelay: "Vision" },
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
      <h3 class="ft-h">Talk to me?</h3>
      <!-- "Talk to you!" on its own tells a screen reader nothing, and the
           heading beside it is a sibling, not a label. El aria-label empieza por
           el texto visible, como pide la norma, y añade de qué va. -->
      <button type="button" class="ft-sub-open" data-nl-open
              aria-label="Talk to you! — sign up for e-mail updates">Talk to you!</button>
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

<div class="nl-reply" data-nl-reply hidden>
      <p class="nl-reply-note">Mailrelay's reply:</p>
      <iframe name="ipz-sink" title="Mailrelay's reply" class="nl-sink" data-nl-sink></iframe>
    </div>

    <p class="nl-eu"><span class="eu-badge"><svg class="eu-stars" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.00 1.50L12.56 3.23L14.38 3.23L12.91 4.30L13.47 6.02L12.00 4.96L10.53 6.02L11.09 4.30L9.62 3.23L11.44 3.23Z"/><path d="M16.00 2.57L16.56 4.30L18.38 4.30L16.91 5.37L17.47 7.09L16.00 6.03L14.53 7.09L15.09 5.37L13.62 4.30L15.44 4.30Z"/><path d="M18.93 5.50L19.49 7.23L21.31 7.23L19.84 8.30L20.40 10.02L18.93 8.96L17.46 10.02L18.02 8.30L16.55 7.23L18.37 7.23Z"/><path d="M20.00 9.50L20.56 11.23L22.38 11.23L20.91 12.30L21.47 14.02L20.00 12.96L18.53 14.02L19.09 12.30L17.62 11.23L19.44 11.23Z"/><path d="M18.93 13.50L19.49 15.23L21.31 15.23L19.84 16.30L20.40 18.02L18.93 16.95L17.46 18.02L18.02 16.30L16.55 15.23L18.37 15.23Z"/><path d="M16.00 16.43L16.56 18.16L18.38 18.16L16.91 19.22L17.47 20.95L16.00 19.88L14.53 20.95L15.09 19.22L13.62 18.16L15.44 18.16Z"/><path d="M12.00 17.50L12.56 19.23L14.38 19.23L12.91 20.30L13.47 22.02L12.00 20.95L10.53 22.02L11.09 20.30L9.62 19.23L11.44 19.23Z"/><path d="M8.00 16.43L8.56 18.16L10.38 18.16L8.91 19.22L9.47 20.95L8.00 19.88L6.53 20.95L7.09 19.22L5.62 18.16L7.44 18.16Z"/><path d="M5.07 13.50L5.63 15.23L7.45 15.23L5.98 16.30L6.54 18.02L5.07 16.95L3.60 18.02L4.16 16.30L2.69 15.23L4.51 15.23Z"/><path d="M4.00 9.50L4.56 11.23L6.38 11.23L4.91 12.30L5.47 14.02L4.00 12.96L2.53 14.02L3.09 12.30L1.62 11.23L3.44 11.23Z"/><path d="M5.07 5.50L5.63 7.23L7.45 7.23L5.98 8.30L6.54 10.02L5.07 8.95L3.60 10.02L4.16 8.30L2.69 7.23L4.51 7.23Z"/><path d="M8.00 2.57L8.56 4.30L10.38 4.30L8.91 5.37L9.47 7.09L8.00 6.03L6.53 7.09L7.09 5.37L5.62 4.30L7.44 4.30Z"/></svg>EU-hosted</span></p>

    <div class="nl-fallback">
      <p class="nl-fallback-note">Fallback, in case anything here misbehaves:</p>
      <a class="nl-fallback-btn" href="${FORM_URL}" target="_blank" rel="noopener">Open the form on Mailrelay &rarr;</a>
      <p class="nl-fallback-note nl-leave">Want off the list? Every e-mail I send carries an unsubscribe link at the bottom. Or write to <a href="mailto:alexander@inverso.bio">alexander@inverso.bio</a> and I'll take you off myself.</p>
    </div>
  </div>
</div>



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
  let finished = false;

  /* Qué haría el formulario ahora mismo, dicho en voz alta. Mailrelay rechaza
     un envío sin ningún grupo, así que hace falta marcar al menos una casilla:
     no existe el camino "sin casillas = baja" que se intentó antes. */
  function state() {
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const picked = boxes.filter((b) => b.checked);
    if (!email) return { key: "idle", picked };
    if (!picked.length) return { key: "needGroup", picked };
    if (!name) return { key: "needName", picked };
    return { key: "subscribe", picked };
  }

  const COPY = {
    idle: {
      hint: "Your e-mail, your name, and at least one box below.",
      label: "Sign me up",
    },
    needGroup: {
      hint: "Tick at least one box — the list needs to know what to send you.",
      label: "Sign me up",
    },
    needName: {
      hint: "Add your name and you're set.",
      label: "Sign me up",
    },
    subscribe: { label: "Sign me up" },
  };

  function refresh() {
    if (sending || finished) return;
    const s = state();
    submit.textContent = COPY[s.key].label;
    submit.classList.toggle("nl-submit-off", s.key !== "subscribe");
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
    finished = false;
    form.hidden = false;
    host.querySelector("[data-nl-reply]").hidden = true;
    submit.textContent = "Sign me up";
    refresh();
    if (location.hash.replace("#", "") !== HASH) history.pushState(null, "", "#" + HASH);
    nameEl.focus();
  };
  const close = () => {
    scrim.hidden = true;
    if (location.hash.replace("#", "") === HASH) {
      history.pushState(null, "", location.pathname + location.search);
    }
  };
  /* La respuesta de Mailrelay llega dentro de un iframe de otro dominio: no se
     puede leer. El evento load salta igual si aceptó el alta que si devolvió un
     error, así que aquí no se puede afirmar que haya funcionado — sólo que se
     envió, y qué hacer si no llega nada. */
  /* La respuesta de Mailrelay llega en un iframe de otro dominio: no se puede
     leer desde aquí. Pero sí se puede enseñar. En vez de inventarse un "listo",
     se muestra su página tal cual: si dice que ya estabas suscrito, o que algo
     falla, el lector lo ve con sus palabras. */
  const reply = host.querySelector("[data-nl-reply]");
  const done = () => {
    sending = false;
    finished = true;
    submit.textContent = "Sent";
    hint.textContent = "";
    hint.classList.remove("nl-hint-warn");
    form.hidden = true;
    reply.hidden = false;
    reply.scrollIntoView({ block: "nearest" });
  };

  host.querySelector("[data-nl-open]").addEventListener("click", open);
  host.querySelector("[data-nl-close]").addEventListener("click", close);
  /* Hay algo escrito si queda algo que perder. La trampa no cuenta: la rellenan
     los bots, no las personas. */
  const isDirty = () =>
    nameEl.value.trim() !== "" || emailEl.value.trim() !== "" || boxes.some((b) => b.checked);

  /* Un clic fuera cierra un formulario vacío, que es lo que se espera. Con algo
     escrito no: es demasiado fácil tirar por la borda lo que acabas de teclear
     con un clic a un centímetro del diálogo. Para eso están Esc y la ✕, y
     ninguno de los dos borra nada. */
  scrim.addEventListener("click", (e) => {
    if (e.target !== scrim) return;
    if (finished || !isDirty()) { close(); return; }
    hint.textContent = "Esc or ✕ closes this. Nothing you typed will be lost.";
    hint.classList.add("nl-hint-warn");
    host.querySelector("[data-nl-close]").focus();
  });
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
      done();
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
    /* Enviarlo sin grupo devuelve un error de Mailrelay que este formulario no
       puede ver, así que se para aquí. */
    if (s.key === "needGroup") {
      e.preventDefault();
      hint.textContent = "Tick at least one box first.";
      hint.classList.add("nl-hint-warn");
      boxes[0].focus();
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
  });
  sink.addEventListener("load", () => { if (sending) done(); });

  /* ---- cookies ---- */
  const ck = host.querySelector("[data-cookies]");
  host.querySelector("[data-cookies-open]").addEventListener("click", () => { ck.hidden = !ck.hidden; });
  host.querySelector("[data-cookies-close]").addEventListener("click", () => { ck.hidden = true; });
}
