/* ============================================
   INVERSO PROJECT - Particles Configuration
   ============================================ */

const particlesConfig = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: ["#5E4B56", "#7D6B75", "#35313A"]
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: 0.4,
      random: true,
      anim: {
        enable: true,
        speed: 0.5,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#5E4B56",
      opacity: 0.3,
      width: 1
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab"
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 0.6
        }
      },
      push: {
        particles_nb: 3
      }
    }
  },
  retina_detect: true
};

// Inicializar particles.js cuando esté disponible
function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', particlesConfig);
  }
}

// Intentar inicializar después de que cargue la librería
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initParticles, 100);
  });
} else {
  setTimeout(initParticles, 100);
}
