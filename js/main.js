/* =============================================
   AzureEdge MSP — Main JavaScript
   ============================================= */

'use strict';

/* ---------- Navbar scroll effect ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---------- Animated particle background ---------- */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colours = ['#0078d4', '#50e6ff', '#7b2ff7', '#00b294', '#ffffff'];

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    const colour = colours[Math.floor(Math.random() * colours.length)];
    Object.assign(p.style, {
      left: Math.random() * 100 + '%',
      width:  size + 'px',
      height: size + 'px',
      background: colour,
      animationDuration: (Math.random() * 15 + 10) + 's',
      animationDelay:    (Math.random() * 10) + 's'
    });
    container.appendChild(p);
  }
})();

/* ---------- Animated counter ---------- */
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 2000;
  const start = performance.now();
  const step = timestamp => {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ---------- Intersection Observer ---------- */
const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

// Service cards staggered reveal
const serviceCards = document.querySelectorAll('.service-card');
const serviceObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), +delay);
      serviceObserver.unobserve(entry.target);
    }
  });
}, observerOpts);
serviceCards.forEach(card => serviceObserver.observe(card));

// Counter trigger
const statsSection = document.querySelector('.hero-stats');
let countersStarted = false;
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat-number').forEach(animateCounter);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
if (statsSection) counterObserver.observe(statsSection);

/* ---------- Portfolio filter ---------- */
const filterBtns    = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      }
    });
  });
});

/* ---------- Testimonial slider ---------- */
(function initSlider() {
  const track  = document.getElementById('testimonialsTrack');
  const dotsEl = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track) return;

  const cards  = track.querySelectorAll('.testimonial-card');
  const total  = cards.length;
  let current  = 0;
  let autoplay;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function updateDots() {
    dotsEl.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  resetAutoplay();

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAutoplay(); }
  });
})();

/* ---------- Contact form ---------- */
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const requiredFields = this.querySelectorAll('[required]');
  let valid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#e74c3c';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });

  if (!valid) return;

  const btn = this.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<span>Sending...</span>';

  // Simulate form submission
  setTimeout(() => {
    document.getElementById('formSuccess').classList.add('visible');
    this.reset();
    btn.disabled = false;
    btn.innerHTML = '<span>Send Message</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    setTimeout(() => document.getElementById('formSuccess').classList.remove('visible'), 5000);
  }, 1200);
});

/* ---------- Smooth scroll for all anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--azure-light)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));
