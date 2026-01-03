# INVERSO PROJECT — Brief Completo

> **Versión:** 1.0
> **Fecha:** Enero 2026
> **Autor:** Alexander
> **Dominio:** inverso.bio

---

## 1. VISIÓN Y OBJETIVO

### 1.1 Misión Personal
Estudiar Biomedicina en **Karolinska Institutet** (Suecia) con especialización posterior en bioestadística/data science. Objetivo final: **frenar el envejecimiento humano** atacando el problema desde el código fuente de la vida.

### 1.2 Filosofía Central
> "Que los científicos se queden sin trabajo"

No seguir el método deductivo tradicional (ensayos clínicos → conclusiones), sino el **enfoque inductivo**: comprender el ADN/sistemas biológicos → crear simuladores → predecir resultados sin experimentación física.

**Visión:** Transformar al ser humano de una "máquina analógica impredecible" a un **sistema biológico completamente predecible**.

### 1.3 Propósito de la Web
1. **Portfolio personal** — Demostrar interés, criterio y capacidad de comunicación
2. **Crowdfunding** — Recaudar **10.000€** para asistir a congresos (LIYSF Londres, BIYSC Barcelona)
3. **Plataforma de ideas** — Ensayos, reflexiones filosóficas, tests interactivos
4. **Captación profesional** — Llamar la atención de empresas de longevidad/biotech

---

## 2. IDENTIDAD VISUAL

### 2.1 Paleta de Colores
| Nombre | Hex | Uso |
|--------|-----|-----|
| Purple Smoke | `#5E4B56` | Color de acento principal |
| Charcoal | `#2A2629` | Textos, elementos destacados |
| Dusty Mauve | `#7D6B75` | Acentos secundarios, hover states |
| Onyx | `#35313A` | Fondos de secciones, cards oscuras |
| Ink Black | `#1A1718` | Contrastes máximos |

**Fondo principal:** Claro (blanco/gris muy claro)
**Modo oscuro:** Pendiente para fase posterior

### 2.2 Fondo Dinámico
**Efecto Particles.js** — Puntos que se mueven aleatoriamente y forman líneas cuando están cerca. Colores de partículas usando la paleta púrpura-gris.

### 2.3 Tipografía
- **Títulos:** Fuente bold/black, impactante (ej: Syne, Space Grotesk Black)
- **Cuerpo:** Sans-serif limpia (ej: Space Grotesk, Inter)
- **Acentos:** Cambios de fuente, **negritas**, subrayados, tamaños variables

### 2.4 Estilo Visual
- **Geométrico y gráfico** — No minimalista aburrido
- **"Estilo Canva"** — Cada sección capturable como poster/Instagram
- **Carismático y atrevido** — NO oscuro/técnico/frío
- **Letras gruesas**, bloques de color, composiciones dinámicas

---

## 3. ESTRUCTURA DE LA WEB

### 3.1 Arquitectura de Páginas

```
inverso.bio/
├── / (Landing Page)
├── /about (Quién es Alexander)
├── /inverso (Qué es Inverso Project)
├── /biblioteca (Ensayos y artículos)
│   └── /biblioteca/[slug] (Artículo individual)
├── /reflexiones (Encuestas interactivas)
├── /comunidad (Posts de la comunidad)
├── /apoyo (Página dedicada al crowdfunding)
└── /contacto (Newsletter + contacto)
```

### 3.2 Descripción de Páginas

#### **Landing Page (`/`)**
- **Hero:** Título impactante con eslogan ("THINK 4D" o similar)
- **Pregunta interactiva:** "¿Qué hacemos hoy?" (estilo LLM)
  - Opciones: Leer ensayos | Reflexionar | Apoyar el proyecto | Conocerme
- **Grid de ensayos:** Preview con sinopsis del primer párrafo
- **Axiomas aleatorios** que rotan
- **Widget GoFundMe** al final

#### **About (`/about`) — Quién soy**
Secciones:
- Mi pasado / Mi niñez
- Qué hago ahora
- Mis gustos e intereses
- Mi ambición
- Mi proyección del futuro
- Por qué Karolinska / Por qué Suecia

#### **Inverso Project (`/inverso`) — La Visión**
- Qué es Inverso Project
- El problema: envejecimiento, enfermedades idiopáticas, "no lo sabemos"
- La solución: superinteligencia biológica, simuladores
- Temas filosóficos:
  - ¿Qué es la vida? ¿Cuándo deja de serlo?
  - Brain-computer interfaces
  - Copiar la mente: ¿sigue siendo "tú"?
- Eslogan: "No planet, no people, no future"
- Potencial futuro como empresa

#### **Biblioteca (`/biblioteca`) — Ensayos**
- Grid visual de artículos con:
  - Título
  - Imagen/ilustración
  - Sinopsis (primer párrafo o resumen)
  - Fecha
- Filtros por temática
- Ensayo destacado: "La Muerte como Fallo de Software"

#### **Reflexiones (`/reflexiones`) — Encuestas Interactivas**
Sistema de encuestas inteligentes con lógica condicional:

**Ejemplo: "El Test de los 120 años"**
1. ¿Te gustaría vivir hasta los 120 años?
2. ¿Hasta los 90?
3. ¿Hasta los 70? 60? 50? 40?
4. (Intercaladas) ¿Sabes qué quieres hacer con tu vida?
5. ¿Estás contento con lo que has conseguido?

**Output:** Asignación de "personalidad" o perfil basado en respuestas.

#### **Comunidad (`/comunidad`)**
- Posts de otras personas (moderados por Alexander)
- Sistema: usuario envía por email → Alexander publica
- Sin login requerido
- Likes públicos (contador global)

#### **Apoyo (`/apoyo`) — Crowdfunding**
- Explicación del objetivo (LIYSF, BIYSC, congresos)
- Desglose de costes
- Widget/viewport oficial de GoFundMe embebido
- Contador de progreso
- Testimonios/agradecimientos

#### **Contacto (`/contacto`)**
- Formulario de contacto
- Suscripción a newsletter
- Links a redes sociales

---

## 4. SISTEMA DE GAMIFICACIÓN

### 4.1 Lista de Tareas (Sidebar Derecho)
Tareas sugeridas guardadas en cookies (sin login):
- [ ] Explorar la Biblioteca (leer 2 ensayos)
- [ ] Completar una Reflexión
- [ ] Compartir un Axioma
- [ ] Suscribirse a la Newsletter
- [ ] Dejar un comentario en Comunidad

### 4.2 Sistema de Recompensas
- **Progreso visible:** Barra o indicador de tareas completadas
- **Mensaje de impacto:** "Has colaborado con X.XX€"
  - Basado en tiempo de sesión (simulado)
  - O basado en impresiones de anuncios (si se implementan)

### 4.3 Cookies/Persistencia
- Estado de tareas completadas
- Ensayos leídos
- Encuestas respondidas
- Preferencias de usuario

---

## 5. ESLÓGANES Y AXIOMAS

### Eslóganes Principales
- **"THINK 4D"**
- **"Be different, not indifferent"**
- **"No planet, no people, no future"**

### Axiomas de Continuidad (rotativos)
- "La muerte es un fallo de software"
- "El cuerpo humano es código sin documentar"
- "Predecir es la nueva medicina"
- "La inercia es el fallo"
- [Más por crear]

---

## 6. ELEMENTOS INTERACTIVOS

### 6.1 Animación de Entrada (Primera Visita)
**Concepto:**
1. Pantalla oscura
2. Luces que se proyectan alternando lados
3. Música ambiente suave
4. Las luces se transforman en diapositivas/carrete
5. Transición fluida al primer elemento de la web

### 6.2 Fondo de Partículas
- Puntos moviéndose aleatoriamente
- Líneas conectando puntos cercanos
- Colores de la paleta púrpura
- Interactivo con el cursor (opcional)

### 6.3 Encuestas Interactivas
- Preguntas con transiciones animadas
- Respuestas que desbloquean nuevas preguntas
- Resultado final con "perfil"

---

## 7. ANÁLISIS DE VIABILIDAD

### 7.1 Aspectos Legales (GDPR)

#### Cookies ✅ VIABLE con condiciones
| Tipo | Requiere Consentimiento | Notas |
|------|------------------------|-------|
| Cookies esenciales | No | Funcionamiento básico |
| Cookies funcionales | Sí | Guardar tareas, preferencias |
| Cookies analíticas | Sí | Google Analytics, etc. |
| Cookies publicitarias | Sí | AdSense, etc. |

**Requisitos:**
- Banner de consentimiento de cookies (obligatorio)
- Política de privacidad clara
- Opción de rechazar cookies no esenciales
- Almacenar consentimiento del usuario

#### Newsletter ✅ VIABLE
- **Double opt-in obligatorio** (confirmar suscripción por email)
- Link de baja en cada email
- No enviar sin consentimiento explícito
- Servicios recomendados: Mailchimp, ConvertKit, Buttondown

#### Sistema de "Impacto Económico" ⚠️ PARCIALMENTE VIABLE
- **Simulado (tiempo de sesión):** ✅ Sin problemas legales
- **Basado en anuncios reales:** ⚠️ Complejo
  - Los ad networks no suelen dar datos en tiempo real
  - Sería una estimación, no valor exacto
  - Requiere disclosure claro de que es estimación

#### Comunidad sin Login ✅ VIABLE
- Los usuarios envían contenido por email
- Alexander modera y publica
- No se almacenan datos personales sin consentimiento
- Los "likes" son contadores globales, no por usuario

#### GoFundMe Embed ✅ TOTALMENTE VIABLE
- GoFundMe proporciona widgets oficiales
- Cumple con sus propias políticas
- Solo requiere tener la campaña activa

### 7.2 Aspectos Técnicos

#### Stack Recomendado
| Componente | Tecnología | Razón |
|------------|------------|-------|
| Frontend | React / Next.js | Ya hay código React existente |
| Hosting | Vercel / Netlify | Gratis, fácil deploy |
| Base de datos | Firebase Firestore | Ya configurado, tiempo real |
| Auth | Firebase Auth (anónimo) | Sin login obligatorio |
| Newsletter | Mailchimp / ConvertKit | APIs gratuitas |
| Analytics | Plausible / Simple Analytics | GDPR-friendly |
| Partículas | particles.js / tsParticles | Fácil implementación |
| Animaciones | Framer Motion / GSAP | Transiciones fluidas |

#### Complejidad por Feature
| Feature | Complejidad | Tiempo estimado |
|---------|-------------|-----------------|
| Landing page con grid | Baja | ✅ |
| Sistema de tareas (cookies) | Baja | ✅ |
| Fondo de partículas | Baja | ✅ |
| Encuestas interactivas | Media | ✅ |
| Animación de entrada | Media-Alta | ⚠️ |
| Newsletter integration | Baja | ✅ |
| GoFundMe embed | Muy baja | ✅ |
| Comunidad moderada | Baja | ✅ |
| Sistema de "impacto" simulado | Baja | ✅ |
| Tests de personalidad | Media | ✅ |

### 7.3 Recomendaciones

#### HACER (Prioridad Alta)
1. Implementar banner de cookies (obligatorio GDPR)
2. Crear política de privacidad
3. Usar double opt-in para newsletter
4. Mantener el sistema de "impacto" como simulación/estimación
5. Empezar con partículas y estructura básica

#### CONSIDERAR (Prioridad Media)
1. Animación de entrada: empezar simple, iterar después
2. Tests de personalidad: diseñar bien las preguntas primero
3. Anuncios: evaluar si realmente son necesarios vs. solo crowdfunding

#### EVITAR
1. No almacenar datos personales sin consentimiento
2. No hacer tracking invasivo
3. No prometer valores exactos de "impacto económico"

---

## 8. CONTENIDO POR CREAR

### 8.1 Textos
- [ ] Biografía completa (About)
- [ ] Descripción de Inverso Project
- [ ] Al menos 3-5 ensayos iniciales
- [ ] Axiomas adicionales (objetivo: 10+)
- [ ] Textos para encuestas
- [ ] Copy para página de crowdfunding
- [ ] Política de privacidad
- [ ] Términos de uso (básico)

### 8.2 Visual
- [ ] Logo de Inverso (si aplica)
- [ ] Imágenes/ilustraciones para ensayos
- [ ] Iconografía consistente
- [ ] Capturas "instagrameables" de referencia

### 8.3 Funcional
- [ ] Crear campaña en GoFundMe
- [ ] Configurar servicio de newsletter
- [ ] Diseñar 2-3 encuestas completas
- [ ] Escribir preguntas del test de personalidad

---

## 9. ROADMAP SUGERIDO

### Fase 1: Fundamentos
- Estructura de páginas
- Sistema de navegación
- Fondo de partículas
- Paleta de colores y tipografía
- Banner de cookies + política de privacidad

### Fase 2: Contenido Core
- Landing page con "¿Qué hacemos hoy?"
- Página About
- Página Inverso Project
- Grid de biblioteca (aunque sea con placeholders)

### Fase 3: Interactividad
- Sistema de tareas en sidebar
- Primera encuesta interactiva
- Embed de GoFundMe
- Newsletter

### Fase 4: Pulido
- Animación de entrada
- Tests de personalidad
- Comunidad
- Optimización móvil

### Fase 5: Lanzamiento
- Testing completo
- SEO básico
- Compartir en redes
- Enviar esos correos pendientes

---

## 10. NOTAS FINALES

### El Proyecto en Una Frase
> Una web-portfolio interactiva y gamificada que presenta a Alexander como un estudiante visionario enfocado en acabar con el envejecimiento humano mediante superinteligencia biológica, mientras financia su formación a través de crowdfunding.

### Diferenciadores Clave
1. **No es un CV estático** — Es una experiencia interactiva
2. **Estilo Gen Z auténtico** — Lúdico, visual, compartible
3. **Pensamiento profundo** — Ensayos y reflexiones filosóficas
4. **Gamificación real** — Tareas, recompensas, progreso
5. **Transparencia** — El crowdfunding está integrado naturalmente

### Contacto del Proyecto
- **Web:** inverso.bio
- **Creador:** Alexander
- **Universidad objetivo:** Karolinska Institutet, Suecia
- **Programa:** BSc Biomedicina → MSc Bioestadística/Data Science

---

*Este brief es un documento vivo. Actualizar según evolucione el proyecto.*
