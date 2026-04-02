/* ============================================
   INVERSO PROJECT - Main Application
   ============================================ */

// --- Estado Global ---
const state = {
  currentPage: 'home',
  site: null,
  essays: [],
  axioms: [],
  about: null,
  inverso: null,
  tasks: {},
  impact: 0,
  currentEssay: null,
  essaysRead: [],
  testProgress: null,
  testResults: null
};

// --- Test de Arquetipos - Datos ---
const ARCHETYPE_TEST = {
  id: 'arquetipos',
  title: 'Test de Arquetipos de Longevidad',
  description: 'Descubre tu relación con la mortalidad, la identidad y la trascendencia a través de 20 preguntas.',
  questions: [
    // Bloque 1: Longevidad Progresiva
    { id: 1, block: 'longevidad', text: '¿Vivirías hasta los 50 años?', type: 'yes_maybe_no' },
    { id: 2, block: 'longevidad', text: '¿Vivirías hasta los 80 años?', type: 'yes_maybe_no' },
    { id: 3, block: 'longevidad', text: '¿Vivirías hasta los 120 años?', type: 'yes_maybe_no' },
    { id: 4, block: 'longevidad', text: '¿Vivirías hasta los 300 años?', type: 'yes_maybe_no' },
    { id: 5, block: 'longevidad', text: '¿Vivirías para siempre si pudieras?', type: 'yes_maybe_no' },

    // Bloque 2: Condiciones de Existencia
    { id: 6, block: 'condiciones', text: '¿Vivirías 150 años si tuvieras dolor crónico moderado?', type: 'yes_maybe_no' },
    { id: 7, block: 'condiciones', text: '¿Vivirías 200 años si todos tus seres queridos murieran a los 80?', type: 'yes_maybe_no' },
    { id: 8, block: 'condiciones', text: '¿Vivirías indefinidamente si no pudieras crear, aprender o experimentar nada nuevo?', type: 'yes_maybe_no' },
    { id: 9, block: 'condiciones', text: '¿Vivirías 500 años haciendo un trabajo que no te gusta?', type: 'yes_maybe_no' },

    // Bloque 3: Identidad y Continuidad
    { id: 10, block: 'identidad', text: 'Si escanearan tu cerebro y lo transfirieran a un chip de silicio, ¿seguirías siendo tú?', type: 'choice', options: [
      { value: 'A', text: 'Sí, soy mis recuerdos y patrones' },
      { value: 'B', text: 'No, necesito mi cerebro biológico original' },
      { value: 'C', text: 'No lo sé, pero me aterra perder "el yo"' }
    ]},
    { id: 11, block: 'identidad', text: 'Si te clonaran perfectamente con todos tus recuerdos, ¿cuál sería el verdadero tú?', type: 'choice', options: [
      { value: 'A', text: 'El original biológico' },
      { value: 'B', text: 'Ambos por igual' },
      { value: 'C', text: 'Ninguno, serían dos personas diferentes' }
    ]},
    { id: 12, block: 'identidad', text: '¿Aceptarías que modificaran tus recuerdos para eliminar traumas y ser más feliz?', type: 'choice', options: [
      { value: 'A', text: 'Sí, sin dudarlo' },
      { value: 'B', text: 'Solo en casos extremos' },
      { value: 'C', text: 'No, mis experiencias me definen' }
    ]},

    // Bloque 4: Valor de la Vida
    { id: 13, block: 'valor', text: '¿Qué prefieres?', type: 'choice', options: [
      { value: 'A', text: '60 años intensamente felices y plenos' },
      { value: 'B', text: '150 años tranquilos pero normales' },
      { value: 'C', text: '500 años con altibajos como cualquier vida' }
    ]},
    { id: 14, block: 'valor', text: 'La vida tiene valor porque:', type: 'choice', options: [
      { value: 'A', text: 'Es limitada, la muerte le da urgencia y significado' },
      { value: 'B', text: 'Tiene valor intrínseco independiente de su duración' },
      { value: 'C', text: 'Depende de lo que hagas con ella' }
    ]},
    { id: 15, block: 'valor', text: 'Si pudieras vivir para siempre:', type: 'choice', options: [
      { value: 'A', text: 'Me aburriría, perdería motivación' },
      { value: 'B', text: 'Tendría infinitas oportunidades para experimentar' },
      { value: 'C', text: 'Depende de las condiciones (salud, propósito, compañía)' }
    ]},

    // Bloque 5: Aceptación de la Finitud
    { id: 16, block: 'finitud', text: 'Cuando piensas en tu propia muerte:', type: 'choice', options: [
      { value: 'A', text: 'Me aterra profundamente' },
      { value: 'B', text: 'Me incomoda pero la acepto como natural' },
      { value: 'C', text: 'La veo como un problema técnico a resolver' },
      { value: 'D', text: 'Prefiero no pensar en ello' }
    ]},
    { id: 17, block: 'finitud', text: '¿Qué te causa más tristeza?', type: 'choice', options: [
      { value: 'A', text: 'Que alguien muera' },
      { value: 'B', text: 'Que alguien sufra antes de morir' },
      { value: 'C', text: 'Que no haya vivido plenamente' }
    ]},
    { id: 18, block: 'finitud', text: '¿Cómo preferirías morir?', type: 'choice', options: [
      { value: 'A', text: 'De repente, sin darme cuenta' },
      { value: 'B', text: 'Sabiendo cuándo, con tiempo para despedirme' },
      { value: 'C', text: 'Prefiero no morir nunca' }
    ]},

    // Bloque 6: Ética y Distribución
    { id: 19, block: 'etica', text: 'Si existe un tratamiento anti-envejecimiento pero es limitado, ¿quién debería recibirlo?', type: 'choice', options: [
      { value: 'A', text: 'Todos por igual (lotería)' },
      { value: 'B', text: 'Quienes contribuyan significativamente a la humanidad' },
      { value: 'C', text: 'Quienes puedan pagarlo' },
      { value: 'D', text: 'Nadie, es antinatural' }
    ]},
    { id: 20, block: 'etica', text: '¿Has hecho o harás algo que justifique "merecer" vivir más que otros?', type: 'choice', options: [
      { value: 'A', text: 'Sí, ya lo he hecho' },
      { value: 'B', text: 'Aún no, pero tengo un propósito claro' },
      { value: 'C', text: 'No creo en ese concepto de mérito' },
      { value: 'D', text: 'Todos merecemos la misma oportunidad' }
    ]}
  ],
  archetypes: {
    patron_consciente: {
      id: 'patron_consciente',
      name: 'El Patrón Consciente',
      tagline: '"Soy información, no carne"',
      description: 'Para ti, la identidad reside en los patrones de información, no en el sustrato biológico. Ves el cuerpo como hardware reemplazable y la mente como software transferible. La muerte física no te asusta tanto como la pérdida de continuidad mental. Probablemente te fascina la idea de uploading cerebral y no tendrías problema en "migrar" a un nuevo soporte si eso garantiza tu continuidad.',
      reflection: 'Tu perspectiva es radical pero coherente con ciertos avances en neurociencia. Sin embargo, considera: ¿hay algo en la experiencia corporal que se perdería en la traducción digital? ¿El "tú" resultante sería realmente tú, o una copia muy convincente?',
      color: '#5E4B56'
    },
    vitalista_finito: {
      id: 'vitalista_finito',
      name: 'El Vitalista Finito',
      tagline: '"La vida es biológica y la muerte natural"',
      description: 'Valoras la autenticidad de la experiencia biológica y aceptas la muerte como parte integral del ciclo vital. No la ves como un enemigo a derrotar sino como el marco que da significado a cada momento. Probablemente desconfías de las promesas transhumanistas y prefieres una vida plena a una vida eterna.',
      reflection: 'Tu aceptación de la finitud puede ser profundamente liberadora. Pero pregúntate: si la muerte fuera opcional, ¿seguirías eligiendo morir? ¿O tu aceptación es en parte una adaptación a lo inevitable?',
      color: '#2A2629'
    },
    hedonista_temporal: {
      id: 'hedonista_temporal',
      name: 'El Hedonista Temporal',
      tagline: '"Calidad sobre cantidad"',
      description: 'Para ti, lo que importa no es cuánto vives sino cómo vives. Preferirías 60 años de plenitud absoluta a siglos de existencia mediocre. Valoras las experiencias intensas, las conexiones profundas y los momentos de verdadera felicidad por encima de la mera acumulación de tiempo.',
      reflection: 'Tu enfoque en la calidad es admirable, pero considera: ¿no sería posible tener tanto calidad como cantidad con suficiente tiempo? ¿O hay algo en la escasez del tiempo que hace las experiencias más valiosas?',
      color: '#7D6B75'
    },
    trascendentalista: {
      id: 'trascendentalista',
      name: 'El Trascendentalista',
      tagline: '"Mi legado importa más que mi existencia"',
      description: 'Tu inmortalidad no está en tu cuerpo ni en tu mente, sino en lo que dejas atrás. Te preocupa más el impacto que tendrás en el mundo que tu propia supervivencia. Crees que hay formas de "vivir" más allá de la muerte biológica: en las ideas, en las personas que tocas, en las estructuras que construyes.',
      reflection: 'Tu perspectiva es noble y ha motivado grandes obras a lo largo de la historia. Pero reflexiona: ¿es el legado realmente una forma de inmortalidad, o es un consuelo que nos contamos? ¿Importará tu legado cuando no haya nadie para recordarlo?',
      color: '#35313A'
    },
    inmortalista: {
      id: 'inmortalista',
      name: 'El Inmortalista',
      tagline: '"La vida tiene valor intrínseco infinito"',
      description: 'Para ti, la muerte es el problema definitivo que la humanidad debe resolver. No aceptas la finitud como natural ni deseable; la ves como una tragedia que normalizamos por impotencia. Cada muerte evitable es una pérdida inaceptable. Probablemente apoyas activamente la investigación en longevidad y anti-envejecimiento.',
      reflection: 'Tu rechazo a aceptar la muerte como inevitable ha impulsado avances médicos durante siglos. Pero considera: en un mundo de inmortales, ¿qué pasaría con el sentido de urgencia, con el espacio para nuevas generaciones, con el significado que la finitud da a nuestras decisiones?',
      color: '#1A1718'
    },
    pragmatico_condicional: {
      id: 'pragmatico_condicional',
      name: 'El Pragmático Condicional',
      tagline: '"Depende de las circunstancias"',
      description: 'No tienes una posición absolutista sobre la vida y la muerte. Tu respuesta siempre es "depende": de la salud, del propósito, de la compañía, de las condiciones. Eres flexible y realista, capaz de adaptar tus preferencias al contexto. No te comprometes con ideales abstractos sino con realidades concretas.',
      reflection: 'Tu flexibilidad es práctica y quizás la más honesta de todas las posturas. Pero pregúntate: ¿hay algún principio no negociable para ti? ¿O todo tiene su precio y sus condiciones?',
      color: '#5E4B56'
    }
  },
  questionReflections: {
    1: 'Esta pregunta establece un mínimo. Si no quieres vivir ni 50 años, hay algo profundo que explorar sobre tu relación con la existencia.',
    2: 'Los 80 años representan una vida "normal" en el mundo desarrollado. Tu respuesta revela si aspiras a más o si te conformas con la norma.',
    3: 'Los 120 años es aproximadamente el límite biológico humano actual. Aquí empezamos a entrar en territorio de extensión de vida.',
    4: 'A los 300 años, verías civilizaciones cambiar. Tu respuesta indica si te atrae o te aterra la perspectiva de presenciar el futuro lejano.',
    5: 'La pregunta definitiva. Tu respuesta aquí es un indicador clave de tu arquetipo.',
    6: 'El dolor crónico pone precio a la longevidad. ¿Cuánto sufrimiento aceptarías por más tiempo?',
    7: 'Esta pregunta explora el valor de la vida en soledad versus la importancia de las conexiones.',
    8: 'Una existencia sin novedad, sin crecimiento. Para muchos, esto es peor que la muerte.',
    9: 'El trabajo que no te gusta representa una vida de mediocridad prolongada. ¿Vale la pena?',
    10: 'El escenario clásico del uploading cerebral. Tu respuesta revela tu teoría implícita sobre qué eres.',
    11: 'El problema de la duplicación. Si hay dos "tú", ¿sigue habiendo un "tú"?',
    12: 'La modificación de recuerdos plantea si tus experiencias (incluso las dolorosas) te definen.',
    13: 'Calidad vs cantidad en su forma más pura. Tu elección dice mucho sobre tus prioridades.',
    14: 'Una pregunta filosófica fundamental. ¿De dónde viene el valor de la vida?',
    15: 'Esta pregunta sondea tu teoría sobre el aburrimiento y la motivación humana.',
    16: 'Tu relación emocional con la muerte. No hay respuestas correctas, solo reveladoras.',
    17: 'Qué aspecto de la muerte te afecta más: el fin, el sufrimiento, o el potencial no realizado.',
    18: 'Tu preferencia sobre el proceso de morir (si tuvieras que elegir).',
    19: 'Una pregunta ética sobre la distribución de la inmortalidad. Revela tus valores sobre justicia y mérito.',
    20: 'La pregunta del mérito. ¿Crees que la longevidad debe ganarse? ¿Te la has ganado tú?'
  }
};

// --- Cargar datos de /content ---
async function loadContent() {
  try {
    const [siteRes, essaysRes, axiomsRes, aboutRes, inversoRes] = await Promise.all([
      fetch('/content/site.json'),
      fetch('/content/essays/index.json'),
      fetch('/content/axioms.json'),
      fetch('/content/about.json'),
      fetch('/content/inverso.json')
    ]);

    state.site = await siteRes.json();
    const essaysData = await essaysRes.json();
    state.essays = essaysData.essays;
    const axiomsData = await axiomsRes.json();
    state.axioms = axiomsData.axioms;
    state.about = await aboutRes.json();
    state.inverso = await inversoRes.json();

    // Cargar estado desde localStorage
    const savedTasks = localStorage.getItem('inverso_tasks');
    if (savedTasks) state.tasks = JSON.parse(savedTasks);

    const savedImpact = localStorage.getItem('inverso_impact');
    if (savedImpact) state.impact = parseFloat(savedImpact);

    const savedEssaysRead = localStorage.getItem('inverso_essays_read');
    if (savedEssaysRead) state.essaysRead = JSON.parse(savedEssaysRead);

    const savedTestResults = localStorage.getItem('inverso_test_results');
    if (savedTestResults) state.testResults = JSON.parse(savedTestResults);

    return true;
  } catch (error) {
    console.error('Error loading content:', error);
    return false;
  }
}

// --- Completar tarea automáticamente ---
function completeTask(taskId) {
  if (!state.tasks[taskId]) {
    state.tasks[taskId] = true;
    localStorage.setItem('inverso_tasks', JSON.stringify(state.tasks));
    renderTasksSidebar();
  }
}

// --- Renderizar navegación ---
function renderNavigation() {
  const navLinks = document.getElementById('nav-links');
  if (!navLinks || !state.site) return;

  const icons = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    about: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>',
    inverso: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    biblioteca: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    reflexiones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    apoyo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
  };

  navLinks.innerHTML = state.site.navigation.map(item => `
    <a href="#" class="nav-link ${state.currentPage === item.id ? 'active' : ''}"
       data-page="${item.id}" title="${item.label}">
      ${icons[item.id] || icons.home}
    </a>
  `).join('');

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });
}

// --- Renderizar sidebar de tareas (sin click) ---
function renderTasksSidebar() {
  const sidebar = document.getElementById('tasks-sidebar');
  if (!sidebar || !state.site) return;

  const completedTasks = Object.values(state.tasks).filter(Boolean).length;
  const totalTasks = state.site.tasks.length;

  sidebar.innerHTML = `
    <div>
      <p class="label-text">Agenda Pendiente</p>
      <div class="task-list">
        ${state.site.tasks.map(task => `
          <div class="task-item ${state.tasks[task.id] ? 'completed' : ''}">
            <div class="task-checkbox">
              ${state.tasks[task.id] ? '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : ''}
            </div>
            <span class="task-label">${task.label}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="impact-card">
      <p class="label-text" style="color: rgba(255,255,255,0.7);">Impacto Real</p>
      <h3 class="impact-title">Tu sesión financia el futuro</h3>
      <div class="impact-value">
        <span id="impact-value">${state.impact.toFixed(4)}</span>€
      </div>
      <div class="impact-global">
        Progreso: <strong>${completedTasks}/${totalTasks}</strong> tareas
      </div>
    </div>

    <div style="margin-top: auto;">
      <p class="label-text">Axioma del momento</p>
      <p style="font-size: 0.9rem; font-style: italic; color: var(--text-secondary);">
        ${getRandomAxiom()}
      </p>
    </div>
  `;
}

// --- Obtener axioma aleatorio ---
function getRandomAxiom() {
  if (!state.axioms.length) return '';
  const randomIndex = Math.floor(Math.random() * state.axioms.length);
  return `"${state.axioms[randomIndex].text}"`;
}

// --- Sistema de impacto ---
function startImpactCounter() {
  setInterval(() => {
    state.impact += 0.0005;
    localStorage.setItem('inverso_impact', state.impact.toString());
    const impactEl = document.getElementById('impact-value');
    if (impactEl) impactEl.textContent = state.impact.toFixed(4);
  }, 5000);
}

// --- Navegación ---
function navigateTo(page, data = null) {
  state.currentPage = page;
  state.currentEssay = data;

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  renderPage();
  window.scrollTo(0, 0);
}

// --- Renderizar página actual ---
function renderPage() {
  const main = document.getElementById('main-content');
  if (!main) return;

  switch (state.currentPage) {
    case 'home': renderHomePage(main); break;
    case 'about': renderAboutPage(main); break;
    case 'inverso': renderInversoPage(main); break;
    case 'biblioteca': renderBibliotecaPage(main); break;
    case 'reflexiones': renderReflexionesPage(main); break;
    case 'apoyo': renderApoyoPage(main); break;
    case 'essay': renderEssayPage(main); break;
    case 'test': renderTestPage(main); break;
    case 'test-results': renderTestResultsPage(main); break;
    default: renderHomePage(main);
  }
}

// --- Home Page ---
function renderHomePage(container) {
  const landing = state.site?.landing || {};

  container.innerHTML = `
    <div class="page active">
      <header class="landing-hero">
        <h1 class="display-title">
          ${landing.main_title || 'THINK'}<br>
          <span class="accent">${landing.accent_title || '4D.'}</span>
        </h1>
        <p class="subtitle">${landing.description || ''}</p>
      </header>

      <div class="landing-question">
        <p class="question-text">${landing.subtitle || '¿Qué hacemos hoy?'}</p>

        <div class="options-grid">
          <div class="option-card card card-brutal" data-action="biblioteca">
            <h3>Biblioteca</h3>
            <p>Explora ensayos sobre longevidad, biología y el futuro.</p>
          </div>
          <div class="option-card card card-brutal card-dark" data-action="reflexiones">
            <h3>Reflexionar</h3>
            <p>Test de arquetipos sobre vida, muerte y trascendencia.</p>
          </div>
          <div class="option-card card card-brutal" data-action="about">
            <h3>Conocerme</h3>
            <p>Descubre quién soy y hacia dónde voy.</p>
          </div>
          <div class="option-card card card-brutal card-accent" data-action="apoyo">
            <h3>Apoyar</h3>
            <p>Financia mi formación y asistencia a congresos.</p>
          </div>
        </div>
      </div>

      <div class="axiom-banner card card-accent mt-xl">
        <p class="axiom-text">${getRandomAxiom()}</p>
        <p class="axiom-label">Axioma de Continuidad</p>
      </div>

      <section class="mt-xl">
        <h2 class="section-title">Últimos Ensayos<span class="accent">.</span></h2>
        <div class="essays-grid">
          ${state.essays.slice(0, 4).map(essay => renderEssayCard(essay)).join('')}
        </div>
      </section>

      ${renderGoFundMeWidget()}
    </div>
  `;

  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => navigateTo(card.dataset.action));
  });

  container.querySelectorAll('.essay-card').forEach(card => {
    card.addEventListener('click', () => {
      const essay = state.essays.find(e => e.id === card.dataset.essay);
      if (essay) navigateTo('essay', essay);
    });
  });
}

// --- Essay Card ---
function renderEssayCard(essay) {
  const isRead = state.essaysRead.includes(essay.id);
  return `
    <div class="essay-card card card-brutal ${essay.featured ? 'featured' : ''} ${isRead ? 'read' : ''}" data-essay="${essay.id}">
      <div>
        ${essay.tags.map(tag => `<span class="essay-tag">${tag}</span>`).join('')}
        ${isRead ? '<span class="essay-tag" style="background: var(--charcoal);">Leído</span>' : ''}
      </div>
      <h3 class="essay-title">${essay.title}</h3>
      <p class="essay-synopsis">${essay.synopsis}</p>
      <p class="essay-date">${formatDate(essay.date)}</p>
    </div>
  `;
}

// --- About Page ---
function renderAboutPage(container) {
  const about = state.about || {};

  container.innerHTML = `
    <div class="page active">
      <p class="label-text">Sobre mí</p>
      <h1 class="section-title">${about.name || 'Alexander'}<span class="accent">.</span></h1>
      <p class="subtitle">${about.tagline || ''}</p>

      <div class="mt-xl">
        ${(about.sections || []).map(section => `
          <div class="about-section">
            <h3>${section.title}</h3>
            <p>${section.content}</p>
          </div>
        `).join('')}

        ${about.university ? `
          <div class="card card-brutal card-accent mt-xl" style="padding: var(--space-lg);">
            <p class="label-text" style="color: rgba(255,255,255,0.7);">Destino académico</p>
            <h3 style="font-family: var(--font-display); font-size: 1.3rem; text-transform: uppercase; margin-bottom: var(--space-sm);">
              ${about.university.name}
            </h3>
            <p>${about.university.location}</p>
            <p class="mt-sm"><strong>BSc:</strong> ${about.university.program_bsc}</p>
            <p><strong>MSc:</strong> ${about.university.program_msc}</p>
          </div>
        ` : ''}
      </div>

      ${renderGoFundMeWidget()}
    </div>
  `;
}

// --- Inverso Page ---
function renderInversoPage(container) {
  const inverso = state.inverso || {};

  container.innerHTML = `
    <div class="page active">
      <p class="label-text">El Proyecto</p>
      <h1 class="section-title">${inverso.name || 'Inverso'}<span class="accent">.</span></h1>
      <p class="subtitle">${inverso.tagline || ''}</p>

      ${inverso.provocative_slogan ? `
        <div class="axiom-banner card card-dark mt-lg">
          <p class="axiom-text">"${inverso.provocative_slogan}"</p>
        </div>
      ` : ''}

      <div class="mt-xl">
        ${(inverso.sections || []).map(section => `
          <div class="about-section">
            <h3>${section.title}</h3>
            <p>${section.content}</p>
          </div>
        `).join('')}
      </div>

      ${renderGoFundMeWidget()}
    </div>
  `;
}

// --- Biblioteca Page ---
function renderBibliotecaPage(container) {
  container.innerHTML = `
    <div class="page active">
      <p class="label-text">Ensayos y artículos</p>
      <h1 class="section-title">Biblioteca<span class="accent">.</span></h1>
      <p class="subtitle">Reflexiones sobre longevidad, biología computacional y el futuro de la humanidad.</p>

      <div class="essays-grid mt-xl">
        ${state.essays.map(essay => renderEssayCard(essay)).join('')}
      </div>

      ${renderGoFundMeWidget()}
    </div>
  `;

  container.querySelectorAll('.essay-card').forEach(card => {
    card.addEventListener('click', () => {
      const essay = state.essays.find(e => e.id === card.dataset.essay);
      if (essay) {
        // Marcar como leído
        if (!state.essaysRead.includes(essay.id)) {
          state.essaysRead.push(essay.id);
          localStorage.setItem('inverso_essays_read', JSON.stringify(state.essaysRead));
        }
        // Completar tarea si ha leído al menos 1
        if (state.essaysRead.length >= 1) {
          completeTask('read_essays');
        }
        navigateTo('essay', essay);
      }
    });
  });
}

// --- Essay Page ---
async function renderEssayPage(container) {
  const essay = state.currentEssay;
  if (!essay) return navigateTo('biblioteca');

  let content = '<p>Cargando...</p>';
  try {
    const res = await fetch(`/content/essays/${essay.file}`);
    if (res.ok) content = parseMarkdown(await res.text());
  } catch (e) {
    content = '<p>Error al cargar el ensayo.</p>';
  }

  container.innerHTML = `
    <div class="page active essay-reader">
      <div class="essay-reader-back" id="back-to-biblioteca">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Volver a Biblioteca
      </div>

      <p class="label-text">Ensayo</p>
      <div class="mb-md">
        ${essay.tags.map(tag => `<span class="essay-tag">${tag}</span>`).join('')}
      </div>

      <h1 class="essay-reader-title">${essay.title}</h1>
      <p class="essay-date mb-lg">${formatDate(essay.date)}</p>

      <div class="essay-reader-content">
        ${content}
      </div>

      ${renderGoFundMeWidget()}
    </div>
  `;

  document.getElementById('back-to-biblioteca').addEventListener('click', () => navigateTo('biblioteca'));
}

// --- Reflexiones Page ---
function renderReflexionesPage(container) {
  const hasResults = state.testResults !== null;

  container.innerHTML = `
    <div class="page active">
      <p class="label-text">Tests interactivos</p>
      <h1 class="section-title">Reflexiones<span class="accent">.</span></h1>
      <p class="subtitle">Descubre tu arquetipo de longevidad a través de preguntas sobre la vida, la muerte y la trascendencia.</p>

      <div class="mt-xl">
        <div class="card card-brutal" style="padding: var(--space-xl);">
          <p class="label-text">Test principal</p>
          <h3 class="card-title">${ARCHETYPE_TEST.title}</h3>
          <p style="margin-bottom: var(--space-lg); color: var(--text-muted);">${ARCHETYPE_TEST.description}</p>
          <p style="margin-bottom: var(--space-lg); font-size: 0.85rem;"><strong>20 preguntas</strong> · ~5 minutos</p>

          <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
            <button class="btn btn-primary" id="start-test">
              ${hasResults ? 'Volver a hacer el test' : 'Comenzar'}
            </button>
            ${hasResults ? `
              <button class="btn btn-secondary" id="view-results">Ver mis resultados</button>
            ` : ''}
          </div>
        </div>
      </div>

      ${renderGoFundMeWidget()}
    </div>
  `;

  document.getElementById('start-test')?.addEventListener('click', () => {
    state.testProgress = { currentQuestion: 0, answers: [], scores: {
      apego_biologico: 0,
      tolerancia_finitud: 0,
      busqueda_trascendencia: 0,
      valoracion_experiencia: 0,
      condicionalidad: 0
    }};
    navigateTo('test');
  });

  document.getElementById('view-results')?.addEventListener('click', () => {
    navigateTo('test-results');
  });
}

// --- Test Page ---
function renderTestPage(container) {
  if (!state.testProgress) return navigateTo('reflexiones');

  const { currentQuestion } = state.testProgress;
  const questions = ARCHETYPE_TEST.questions;

  if (currentQuestion >= questions.length) {
    calculateArchetype();
    return navigateTo('test-results');
  }

  const question = questions[currentQuestion];
  const progress = (currentQuestion / questions.length) * 100;
  const blockNames = {
    longevidad: 'Longevidad Progresiva',
    condiciones: 'Condiciones de Existencia',
    identidad: 'Identidad y Continuidad',
    valor: 'Valor de la Vida',
    finitud: 'Aceptación de la Finitud',
    etica: 'Ética y Distribución'
  };

  container.innerHTML = `
    <div class="page active test-container">
      <div class="essay-reader-back" id="exit-test">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Salir del test
      </div>

      <p class="label-text">${blockNames[question.block]} · Pregunta ${currentQuestion + 1} de ${questions.length}</p>

      <div class="test-progress">
        <div class="test-progress-bar" style="width: ${progress}%"></div>
      </div>

      <div class="test-question">
        <h2 class="test-question-text">${question.text}</h2>

        ${question.type === 'yes_maybe_no' ? `
          <div class="test-options">
            <button class="test-option card card-brutal" data-answer="yes">Sí</button>
            <button class="test-option card" data-answer="maybe">Tal vez</button>
            <button class="test-option card card-brutal" data-answer="no">No</button>
          </div>
        ` : ''}

        ${question.type === 'choice' ? `
          <div class="test-options" style="flex-direction: column;">
            ${question.options.map(opt => `
              <button class="test-option card" data-answer="${opt.value}" style="text-align: left; flex: none;">
                <strong style="color: var(--purple-smoke);">${opt.value})</strong> ${opt.text}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;

  document.getElementById('exit-test').addEventListener('click', () => {
    if (confirm('¿Seguro que quieres salir? Perderás tu progreso.')) {
      state.testProgress = null;
      navigateTo('reflexiones');
    }
  });

  container.querySelectorAll('.test-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.dataset.answer;
      state.testProgress.answers.push({ questionId: question.id, answer });
      updateScores(question.id, answer);
      state.testProgress.currentQuestion++;
      renderTestPage(container);
    });
  });
}

// --- Actualizar puntuaciones ---
function updateScores(questionId, answer) {
  const scores = state.testProgress.scores;

  // Bloque 1: Longevidad (preguntas 1-5)
  if (questionId >= 1 && questionId <= 5) {
    if (answer === 'yes') {
      if (questionId === 5) scores.tolerancia_finitud -= 20; // Quiere vivir siempre
    } else if (answer === 'no') {
      scores.tolerancia_finitud += 10;
    } else {
      scores.condicionalidad += 10;
    }
  }

  // Bloque 2: Condiciones (preguntas 6-9)
  if (questionId >= 6 && questionId <= 9) {
    if (answer === 'no') scores.condicionalidad += 15;
    if (questionId === 8 && answer === 'yes') scores.tolerancia_finitud += 15;
  }

  // Pregunta 10: Cerebro a chip
  if (questionId === 10) {
    if (answer === 'A') { scores.apego_biologico -= 30; }
    if (answer === 'B') { scores.apego_biologico += 30; }
    if (answer === 'C') { scores.condicionalidad += 15; }
  }

  // Pregunta 11: Clonación
  if (questionId === 11) {
    if (answer === 'A') scores.apego_biologico += 20;
    if (answer === 'B') scores.apego_biologico -= 20;
  }

  // Pregunta 12: Modificar recuerdos
  if (questionId === 12) {
    if (answer === 'C') scores.apego_biologico += 15;
  }

  // Pregunta 13: Calidad vs cantidad
  if (questionId === 13) {
    if (answer === 'A') scores.valoracion_experiencia += 25;
    if (answer === 'C') scores.tolerancia_finitud -= 15;
  }

  // Pregunta 14: Valor de la vida
  if (questionId === 14) {
    if (answer === 'A') scores.tolerancia_finitud += 25;
    if (answer === 'B') scores.tolerancia_finitud -= 25;
  }

  // Pregunta 15: Aburrimiento
  if (questionId === 15) {
    if (answer === 'A') scores.tolerancia_finitud += 20;
    if (answer === 'B') scores.tolerancia_finitud -= 20;
    if (answer === 'C') scores.condicionalidad += 20;
  }

  // Pregunta 16: Tu muerte
  if (questionId === 16) {
    if (answer === 'B') scores.tolerancia_finitud += 20;
    if (answer === 'C') scores.tolerancia_finitud -= 30;
  }

  // Pregunta 19: Distribución
  if (questionId === 19) {
    if (answer === 'B') scores.busqueda_trascendencia += 25;
    if (answer === 'D') scores.tolerancia_finitud += 20;
  }

  // Pregunta 20: Mérito
  if (questionId === 20) {
    if (answer === 'A' || answer === 'B') scores.busqueda_trascendencia += 20;
    if (answer === 'C' || answer === 'D') scores.busqueda_trascendencia -= 15;
  }
}

// --- Calcular arquetipo ---
function calculateArchetype() {
  const scores = state.testProgress.scores;
  const answers = state.testProgress.answers;

  let archetype = 'pragmatico_condicional'; // Default

  // Determinar arquetipo basado en puntuaciones
  if (scores.apego_biologico <= -20 && scores.tolerancia_finitud <= 0) {
    archetype = 'patron_consciente';
  } else if (scores.apego_biologico >= 20 && scores.tolerancia_finitud >= 20) {
    archetype = 'vitalista_finito';
  } else if (scores.valoracion_experiencia >= 20 && scores.tolerancia_finitud >= 10) {
    archetype = 'hedonista_temporal';
  } else if (scores.busqueda_trascendencia >= 25) {
    archetype = 'trascendentalista';
  } else if (scores.tolerancia_finitud <= -30) {
    archetype = 'inmortalista';
  } else if (scores.condicionalidad >= 30) {
    archetype = 'pragmatico_condicional';
  }

  state.testResults = {
    archetype,
    scores,
    answers,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem('inverso_test_results', JSON.stringify(state.testResults));
  completeTask('do_test');
}

// --- Test Results Page ---
function renderTestResultsPage(container) {
  if (!state.testResults) return navigateTo('reflexiones');

  const { archetype, scores, answers } = state.testResults;
  const arch = ARCHETYPE_TEST.archetypes[archetype];

  container.innerHTML = `
    <div class="page active">
      <div class="essay-reader-back" id="back-to-reflexiones">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Volver a Reflexiones
      </div>

      <p class="label-text">Tu resultado</p>
      <h1 class="section-title" style="border: none;">${arch.name}<span class="accent">.</span></h1>

      <div class="card card-brutal mt-lg" style="padding: var(--space-xl); border-left: 6px solid ${arch.color};">
        <p style="font-size: 1.3rem; font-style: italic; margin-bottom: var(--space-lg); color: var(--purple-smoke);">
          ${arch.tagline}
        </p>
        <p style="line-height: 1.8; margin-bottom: var(--space-lg);">
          ${arch.description}
        </p>
        <div style="background: var(--bg-light); padding: var(--space-md); border-left: 3px solid var(--purple-smoke);">
          <p class="label-text">Reflexión</p>
          <p style="font-size: 0.95rem; line-height: 1.7;">${arch.reflection}</p>
        </div>
      </div>

      <div class="mt-xl">
        <h2 class="section-title" style="font-size: 1.5rem;">Tus respuestas<span class="accent">.</span></h2>

        <div style="display: flex; flex-direction: column; gap: var(--space-md);">
          ${answers.map((a, i) => {
            const q = ARCHETYPE_TEST.questions.find(q => q.id === a.questionId);
            const reflection = ARCHETYPE_TEST.questionReflections[a.questionId];
            let answerText = a.answer;
            if (q.type === 'choice') {
              const opt = q.options.find(o => o.value === a.answer);
              answerText = opt ? `${opt.value}) ${opt.text}` : a.answer;
            } else if (a.answer === 'yes') answerText = 'Sí';
            else if (a.answer === 'no') answerText = 'No';
            else if (a.answer === 'maybe') answerText = 'Tal vez';

            return `
              <details class="card" style="padding: var(--space-md);">
                <summary style="cursor: pointer; font-weight: 600;">
                  <span style="color: var(--text-muted);">${i + 1}.</span> ${q.text}
                </summary>
                <div style="margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--bg-light);">
                  <p style="margin-bottom: var(--space-sm);"><strong>Tu respuesta:</strong> ${answerText}</p>
                  <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">${reflection}</p>
                </div>
              </details>
            `;
          }).join('')}
        </div>
      </div>

      <div class="mt-xl" style="display: flex; gap: var(--space-md);">
        <button class="btn btn-primary" id="retake-test">Volver a hacer el test</button>
        <button class="btn btn-secondary" id="share-result">Compartir resultado</button>
      </div>

      ${renderGoFundMeWidget()}
    </div>
  `;

  document.getElementById('back-to-reflexiones').addEventListener('click', () => navigateTo('reflexiones'));

  document.getElementById('retake-test').addEventListener('click', () => {
    state.testProgress = { currentQuestion: 0, answers: [], scores: {
      apego_biologico: 0, tolerancia_finitud: 0, busqueda_trascendencia: 0,
      valoracion_experiencia: 0, condicionalidad: 0
    }};
    navigateTo('test');
  });

  document.getElementById('share-result').addEventListener('click', () => {
    const text = `Soy "${arch.name}" según el Test de Arquetipos de Longevidad de Inverso Project. ${arch.tagline}`;
    if (navigator.share) {
      navigator.share({ title: 'Mi arquetipo de longevidad', text, url: window.location.origin });
    } else {
      navigator.clipboard.writeText(text);
      alert('Resultado copiado al portapapeles');
    }
    completeTask('share_axiom');
  });
}

// --- Apoyo Page ---
function renderApoyoPage(container) {
  const crowdfunding = state.site?.crowdfunding || {};

  container.innerHTML = `
    <div class="page active">
      <p class="label-text">Crowdfunding</p>
      <h1 class="section-title">Apoyar<span class="accent">.</span></h1>
      <p class="subtitle">Contribuye a financiar mi formación y asistencia a congresos científicos de verano.</p>

      <div class="card card-brutal mt-xl" style="padding: var(--space-xl);">
        <p class="label-text">Meta de financiación</p>
        <h3 style="font-family: var(--font-display); font-size: 2rem; text-transform: uppercase; margin-bottom: var(--space-md);">
          ${crowdfunding.goal?.toLocaleString() || '10.000'}€
        </h3>

        <p style="margin-bottom: var(--space-lg); line-height: 1.7;">
          Este verano quiero asistir a eventos científicos internacionales donde podré aprender
          de los mejores investigadores en longevidad y biotecnología:
        </p>

        <ul style="list-style: none; margin-bottom: var(--space-lg);">
          ${(crowdfunding.events || []).map(event => `
            <li style="margin-bottom: var(--space-sm); display: flex; align-items: center; gap: var(--space-sm);">
              <span style="width: 8px; height: 8px; background: var(--purple-smoke);"></span>
              <strong>${event.name}</strong> — ${event.location}
            </li>
          `).join('')}
        </ul>

        <p style="font-size: 0.9rem; color: var(--text-muted);">
          Tu contribución me ayudará a cubrir inscripciones, viajes y alojamiento.
        </p>
      </div>

      <div class="gofundme-section card card-accent mt-xl">
        <h3>Contribuir vía GoFundMe</h3>
        <div class="gofundme-embed">
          ${crowdfunding.gofundme_embed?.startsWith('[')
            ? '<p>El widget de GoFundMe aparecerá aquí cuando esté configurado.</p>'
            : crowdfunding.gofundme_embed || '<p>El widget de GoFundMe aparecerá aquí cuando esté configurado.</p>'}
        </div>
      </div>
    </div>
  `;
}

// --- GoFundMe Widget ---
function renderGoFundMeWidget() {
  const crowdfunding = state.site?.crowdfunding || {};
  const hasEmbed = crowdfunding.gofundme_embed && !crowdfunding.gofundme_embed.startsWith('[');

  return `
    <div class="gofundme-section card mt-xl" style="background: var(--dusty-mauve); color: white;">
      <p class="label-text" style="color: rgba(255,255,255,0.7);">Crowdfunding</p>
      <h3>Apoya el proyecto</h3>
      <p style="margin-top: var(--space-sm); opacity: 0.8;">Tu contribución financia mi formación y asistencia a congresos científicos.</p>
      ${hasEmbed
        ? `<div class="gofundme-embed mt-lg">${crowdfunding.gofundme_embed}</div>`
        : `<button class="btn btn-dark mt-lg" onclick="navigateTo('apoyo')">Ver más</button>`
      }
    </div>
  `;
}

// --- Utilidades ---
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function parseMarkdown(markdown) {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^(?!<)/gm, '<p>')
    .replace(/(?!>)$/gm, '</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h(\d)><\/p>/g, '</h$1>')
    .replace(/<p><blockquote>/g, '<blockquote>')
    .replace(/<\/blockquote><\/p>/g, '</blockquote>')
    .replace(/---/g, '<hr>');
}

// --- Cookie Banner ---
function initCookieBanner() {
  const consent = localStorage.getItem('cookie_consent');
  if (consent) return;
  const banner = document.getElementById('cookie-banner');
  if (banner) setTimeout(() => banner.classList.add('visible'), 1000);
}

function acceptCookies() {
  localStorage.setItem('cookie_consent', 'accepted');
  document.getElementById('cookie-banner')?.classList.remove('visible');
}

function rejectCookies() {
  localStorage.setItem('cookie_consent', 'rejected');
  document.getElementById('cookie-banner')?.classList.remove('visible');
  localStorage.removeItem('inverso_tasks');
  localStorage.removeItem('inverso_impact');
  localStorage.removeItem('inverso_essays_read');
  localStorage.removeItem('inverso_test_results');
}

// --- Inicialización ---
async function init() {
  const loaded = await loadContent();
  if (loaded) {
    renderNavigation();
    renderTasksSidebar();
    renderPage();
    startImpactCounter();
    initCookieBanner();
  } else {
    document.getElementById('main-content').innerHTML = `
      <div class="page active">
        <h1 class="section-title">Error<span class="accent">.</span></h1>
        <p>No se pudieron cargar los datos. Por favor, recarga la página.</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', init);

window.navigateTo = navigateTo;
window.acceptCookies = acceptCookies;
window.rejectCookies = rejectCookies;
