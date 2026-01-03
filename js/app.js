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
  tests: {},
  tasks: {},
  impact: 0,
  currentEssay: null,
  testProgress: {}
};

// --- Cargar datos de /content ---
async function loadContent() {
  try {
    const [siteRes, essaysRes, axiomsRes, aboutRes, inversoRes, test120Res] = await Promise.all([
      fetch('/content/site.json'),
      fetch('/content/essays/index.json'),
      fetch('/content/axioms.json'),
      fetch('/content/about.json'),
      fetch('/content/inverso.json'),
      fetch('/content/tests/test-120.json')
    ]);

    state.site = await siteRes.json();
    const essaysData = await essaysRes.json();
    state.essays = essaysData.essays;
    const axiomsData = await axiomsRes.json();
    state.axioms = axiomsData.axioms;
    state.about = await aboutRes.json();
    state.inverso = await inversoRes.json();
    state.tests['test-120'] = await test120Res.json();

    // Cargar tareas desde localStorage
    const savedTasks = localStorage.getItem('inverso_tasks');
    if (savedTasks) {
      state.tasks = JSON.parse(savedTasks);
    }

    // Cargar impacto desde localStorage
    const savedImpact = localStorage.getItem('inverso_impact');
    if (savedImpact) {
      state.impact = parseFloat(savedImpact);
    }

    return true;
  } catch (error) {
    console.error('Error loading content:', error);
    return false;
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

  // Event listeners
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });
}

// --- Renderizar sidebar de tareas ---
function renderTasksSidebar() {
  const sidebar = document.getElementById('tasks-sidebar');
  if (!sidebar || !state.site) return;

  const completedTasks = Object.values(state.tasks).filter(Boolean).length;
  const totalTasks = state.site.tasks.length;

  sidebar.innerHTML = `
    <div>
      <h3 class="tasks-header">Agenda Pendiente</h3>
      <div class="task-list">
        ${state.site.tasks.map(task => `
          <div class="task-item ${state.tasks[task.id] ? 'completed' : ''}" data-task="${task.id}">
            <div class="task-checkbox">
              ${state.tasks[task.id] ? '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : ''}
            </div>
            <span class="task-label">${task.label}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="impact-card">
      <h3 class="impact-title">Impacto Real</h3>
      <p class="impact-subtitle">Tu sesión está financiando el futuro</p>
      <div class="impact-value">
        <span>$</span>
        <span id="impact-value">${state.impact.toFixed(4)}</span>€
      </div>
      <div class="impact-global">
        Tareas completadas: <strong>${completedTasks}/${totalTasks}</strong>
      </div>
    </div>

    <div style="margin-top: auto;">
      <p style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em;">
        ${getRandomAxiom()}
      </p>
    </div>
  `;

  // Event listeners para tareas
  sidebar.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('click', () => {
      const taskId = item.dataset.task;
      toggleTask(taskId);
    });
  });
}

// --- Toggle tarea ---
function toggleTask(taskId) {
  state.tasks[taskId] = !state.tasks[taskId];
  localStorage.setItem('inverso_tasks', JSON.stringify(state.tasks));
  renderTasksSidebar();
}

// --- Obtener axioma aleatorio ---
function getRandomAxiom() {
  if (!state.axioms.length) return '';
  const randomIndex = Math.floor(Math.random() * state.axioms.length);
  return `"${state.axioms[randomIndex].text}"`;
}

// --- Sistema de impacto (simulado) ---
function startImpactCounter() {
  setInterval(() => {
    state.impact += 0.0005;
    localStorage.setItem('inverso_impact', state.impact.toString());
    const impactEl = document.getElementById('impact-value');
    if (impactEl) {
      impactEl.textContent = state.impact.toFixed(4);
    }
  }, 5000);
}

// --- Navegación ---
function navigateTo(page, data = null) {
  state.currentPage = page;
  state.currentEssay = data;

  // Actualizar navegación activa
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Renderizar página
  renderPage();
}

// --- Renderizar página actual ---
function renderPage() {
  const main = document.getElementById('main-content');
  if (!main) return;

  switch (state.currentPage) {
    case 'home':
      renderHomePage(main);
      break;
    case 'about':
      renderAboutPage(main);
      break;
    case 'inverso':
      renderInversoPage(main);
      break;
    case 'biblioteca':
      renderBibliotecaPage(main);
      break;
    case 'reflexiones':
      renderReflexionesPage(main);
      break;
    case 'apoyo':
      renderApoyoPage(main);
      break;
    case 'essay':
      renderEssayPage(main);
      break;
    default:
      renderHomePage(main);
  }
}

// --- Páginas individuales ---

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
            <p>Explora ensayos sobre longevidad, biología y el futuro de la humanidad.</p>
          </div>
          <div class="option-card card card-brutal card-dark" data-action="reflexiones">
            <h3>Reflexionar</h3>
            <p>Participa en tests interactivos sobre la vida, la muerte y el tiempo.</p>
          </div>
          <div class="option-card card card-brutal" data-action="about">
            <h3>Conocerme</h3>
            <p>Descubre quién soy, de dónde vengo y hacia dónde voy.</p>
          </div>
          <div class="option-card card card-brutal card-accent" data-action="apoyo">
            <h3>Apoyar</h3>
            <p>Contribuye a financiar mi formación y asistencia a congresos.</p>
          </div>
        </div>
      </div>

      <div class="axiom-banner card card-accent mt-xl">
        <p class="axiom-text">${getRandomAxiom()}</p>
        <p class="axiom-label">Axioma de Continuidad</p>
      </div>

      <section class="mt-xl">
        <h2 class="section-title">Últimos<span class="accent"> Ensayos.</span></h2>
        <div class="essays-grid">
          ${state.essays.slice(0, 4).map(essay => renderEssayCard(essay)).join('')}
        </div>
      </section>

      ${renderGoFundMeWidget()}
    </div>
  `;

  // Event listeners
  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(card.dataset.action);
    });
  });

  container.querySelectorAll('.essay-card').forEach(card => {
    card.addEventListener('click', () => {
      const essayId = card.dataset.essay;
      const essay = state.essays.find(e => e.id === essayId);
      if (essay) {
        navigateTo('essay', essay);
      }
    });
  });
}

function renderEssayCard(essay) {
  return `
    <div class="essay-card card card-brutal ${essay.featured ? 'featured' : ''}" data-essay="${essay.id}">
      <div>
        ${essay.tags.map(tag => `<span class="essay-tag">${tag}</span>`).join('')}
      </div>
      <h3 class="essay-title">${essay.title}</h3>
      <p class="essay-synopsis">${essay.synopsis}</p>
      <p class="essay-date">${formatDate(essay.date)}</p>
    </div>
  `;
}

function renderAboutPage(container) {
  const about = state.about || {};

  container.innerHTML = `
    <div class="page active">
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
            <h3 style="font-family: var(--font-display); font-size: 1.2rem; text-transform: uppercase; margin-bottom: var(--space-sm);">
              Destino: ${about.university.name}
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

function renderInversoPage(container) {
  const inverso = state.inverso || {};

  container.innerHTML = `
    <div class="page active">
      <h1 class="section-title">${inverso.name || 'Inverso Project'}<span class="accent">.</span></h1>
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

function renderBibliotecaPage(container) {
  container.innerHTML = `
    <div class="page active">
      <h1 class="section-title">Biblioteca<span class="accent">.</span></h1>
      <p class="subtitle">Ensayos, reflexiones y artículos sobre longevidad, biología computacional y el futuro de la humanidad.</p>

      <div class="essays-grid mt-xl">
        ${state.essays.map(essay => renderEssayCard(essay)).join('')}
      </div>

      ${renderGoFundMeWidget()}
    </div>
  `;

  container.querySelectorAll('.essay-card').forEach(card => {
    card.addEventListener('click', () => {
      const essayId = card.dataset.essay;
      const essay = state.essays.find(e => e.id === essayId);
      if (essay) {
        navigateTo('essay', essay);
        // Marcar tarea como completada
        if (!state.tasks.read_essays) {
          state.tasks.read_essays = true;
          localStorage.setItem('inverso_tasks', JSON.stringify(state.tasks));
          renderTasksSidebar();
        }
      }
    });
  });
}

async function renderEssayPage(container) {
  const essay = state.currentEssay;
  if (!essay) {
    navigateTo('biblioteca');
    return;
  }

  // Cargar contenido del ensayo
  let content = '<p>Cargando...</p>';
  try {
    const res = await fetch(`/content/essays/${essay.file}`);
    if (res.ok) {
      const markdown = await res.text();
      content = parseMarkdown(markdown);
    }
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

      <div>
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

  document.getElementById('back-to-biblioteca').addEventListener('click', () => {
    navigateTo('biblioteca');
  });
}

function renderReflexionesPage(container) {
  const test = state.tests['test-120'];

  container.innerHTML = `
    <div class="page active">
      <h1 class="section-title">Reflexiones<span class="accent">.</span></h1>
      <p class="subtitle">Tests interactivos para pensar sobre la vida, el tiempo y la mortalidad.</p>

      <div class="options-grid mt-xl">
        <div class="option-card card card-brutal" data-test="test-120">
          <h3>${test?.title || 'El Test de los 120 Años'}</h3>
          <p>${test?.description || 'Una reflexión interactiva sobre la longevidad.'}</p>
          <button class="btn btn-primary mt-md">Comenzar</button>
        </div>
      </div>

      ${renderGoFundMeWidget()}
    </div>
  `;

  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      startTest(card.dataset.test);
    });
  });
}

function startTest(testId) {
  const test = state.tests[testId];
  if (!test) return;

  state.testProgress = {
    testId,
    currentQuestion: 0,
    answers: []
  };

  renderTestQuestion();
}

function renderTestQuestion() {
  const container = document.getElementById('main-content');
  const { testId, currentQuestion, answers } = state.testProgress;
  const test = state.tests[testId];

  if (currentQuestion >= test.questions.length) {
    renderTestResults();
    return;
  }

  const question = test.questions[currentQuestion];
  const progress = ((currentQuestion) / test.questions.length) * 100;

  container.innerHTML = `
    <div class="page active test-container">
      <div class="essay-reader-back" id="back-to-reflexiones">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Salir del test
      </div>

      <h2 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: var(--space-md);">
        ${test.title}
      </h2>

      <div class="test-progress">
        <div class="test-progress-bar" style="width: ${progress}%"></div>
      </div>

      <div class="test-question">
        <p class="test-question-text">${question.text}</p>

        ${question.type === 'yes_no' ? `
          <div class="test-options">
            <button class="test-option card card-brutal" data-answer="yes">Sí</button>
            <button class="test-option card card-brutal" data-answer="no">No</button>
          </div>
        ` : ''}

        ${question.type === 'scale' ? `
          <div class="test-options" style="flex-direction: column; gap: var(--space-sm);">
            ${Array.from({length: question.scale_max}, (_, i) => `
              <button class="test-option card" data-answer="${i + 1}" style="text-align: left;">
                <strong>${i + 1}</strong> - ${i === 0 ? question.scale_labels[0] : (i === question.scale_max - 1 ? question.scale_labels[1] : '')}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;

  document.getElementById('back-to-reflexiones').addEventListener('click', () => {
    navigateTo('reflexiones');
  });

  container.querySelectorAll('.test-option').forEach(btn => {
    btn.addEventListener('click', () => {
      state.testProgress.answers.push({
        questionId: question.id,
        answer: btn.dataset.answer
      });
      state.testProgress.currentQuestion++;
      renderTestQuestion();
    });
  });
}

function renderTestResults() {
  const container = document.getElementById('main-content');
  const { testId, answers } = state.testProgress;
  const test = state.tests[testId];

  // Marcar tarea como completada
  if (!state.tasks.do_test) {
    state.tasks.do_test = true;
    localStorage.setItem('inverso_tasks', JSON.stringify(state.tasks));
    renderTasksSidebar();
  }

  container.innerHTML = `
    <div class="page active test-container">
      <h1 class="section-title">Resultados<span class="accent">.</span></h1>

      <div class="card card-brutal card-accent mt-lg" style="padding: var(--space-xl);">
        <p style="font-size: 1.2rem; margin-bottom: var(--space-md);">Has completado el test.</p>
        <p style="opacity: 0.8;">Tus respuestas han sido registradas. Este es un espacio para la reflexión personal sobre la longevidad y el sentido de la vida.</p>
      </div>

      <div class="mt-xl">
        <h3 style="font-family: var(--font-display); text-transform: uppercase; margin-bottom: var(--space-md);">
          Resumen de respuestas
        </h3>
        ${answers.map((a, i) => `
          <p style="margin-bottom: var(--space-sm);">
            <strong>P${i + 1}:</strong> ${a.answer}
          </p>
        `).join('')}
      </div>

      <button class="btn btn-primary mt-xl" id="back-home">Volver al inicio</button>
    </div>
  `;

  document.getElementById('back-home').addEventListener('click', () => {
    navigateTo('home');
  });
}

function renderApoyoPage(container) {
  const crowdfunding = state.site?.crowdfunding || {};

  container.innerHTML = `
    <div class="page active">
      <h1 class="section-title">Apoyar<span class="accent">.</span></h1>
      <p class="subtitle">Contribuye a financiar mi formación y asistencia a congresos científicos de verano.</p>

      <div class="card card-brutal mt-xl" style="padding: var(--space-xl);">
        <h3 style="font-family: var(--font-display); font-size: 1.5rem; text-transform: uppercase; margin-bottom: var(--space-md);">
          Objetivo: ${crowdfunding.goal?.toLocaleString() || '10.000'}€
        </h3>

        <p style="margin-bottom: var(--space-lg);">
          Este verano quiero asistir a eventos científicos internacionales donde podré aprender de los mejores investigadores en longevidad y biotecnología:
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

function renderGoFundMeWidget() {
  const crowdfunding = state.site?.crowdfunding || {};
  const hasEmbed = crowdfunding.gofundme_embed && !crowdfunding.gofundme_embed.startsWith('[');

  return `
    <div class="gofundme-section card mt-xl" style="background: var(--dusty-mauve); color: white;">
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
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function parseMarkdown(markdown) {
  // Parser muy básico de Markdown
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
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
  if (banner) {
    setTimeout(() => banner.classList.add('visible'), 1000);
  }
}

function acceptCookies() {
  localStorage.setItem('cookie_consent', 'accepted');
  document.getElementById('cookie-banner')?.classList.remove('visible');
}

function rejectCookies() {
  localStorage.setItem('cookie_consent', 'rejected');
  document.getElementById('cookie-banner')?.classList.remove('visible');
  // Limpiar datos existentes
  localStorage.removeItem('inverso_tasks');
  localStorage.removeItem('inverso_impact');
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

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

// Exponer función de navegación globalmente
window.navigateTo = navigateTo;
window.acceptCookies = acceptCookies;
window.rejectCookies = rejectCookies;
