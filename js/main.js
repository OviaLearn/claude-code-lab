/* =============================================
   AzureEdge MSP — Main JavaScript
   ============================================= */

'use strict';

/* ---------- SVG icon constants (keyed by service index 0–5) ---------- */
const SERVICE_ICONS = [
  // 0: Cloud Migration
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  // 1: Managed Infrastructure
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  // 2: Security & Compliance
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  // 3: DevOps & CI/CD
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/></svg>`,
  // 4: AI & Analytics
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  // 5: 24/7 Managed Support
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.12 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
];

/* ---------- HTML escape helper ---------- */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ---------- Data fetching ---------- */
async function fetchContent() {
  const [company, hero, services, caseStudies, testimonials, pricing] = await Promise.all([
    fetch('data/company.json').then(r => r.json()),
    fetch('data/hero.json').then(r => r.json()),
    fetch('data/services.json').then(r => r.json()),
    fetch('data/case-studies.json').then(r => r.json()),
    fetch('data/testimonials.json').then(r => r.json()),
    fetch('data/pricing.json').then(r => r.json()),
  ]);
  return { company, hero, services, caseStudies, testimonials, pricing };
}

/* ---------- Render: Hero ---------- */
function renderHero(hero) {
  document.getElementById('heroBadge').textContent = hero.badge;
  document.getElementById('heroTitle').innerHTML =
    `${esc(hero.title)}<br /><span class="gradient-text">${esc(hero.titleHighlight)}</span>`;
  document.getElementById('heroSubtitle').textContent = hero.subtitle;
}

/* ---------- Render: Services ---------- */
function renderServices(services) {
  document.getElementById('servicesGrid').innerHTML = services.items.map((svc, i) => `
    <div class="service-card${svc.featured ? ' featured' : ''}" data-delay="${i * 100}">
      ${svc.featured ? '<div class="service-badge">Most Popular</div>' : ''}
      <div class="service-icon" style="background:${esc(svc.iconColor)}">
        ${SERVICE_ICONS[i % SERVICE_ICONS.length]}
      </div>
      <h3>${esc(svc.title)}</h3>
      <p>${esc(svc.description)}</p>
      <ul class="service-list">
        ${svc.features.map(f => `<li>${esc(f)}</li>`).join('')}
      </ul>
      <a href="#contact" class="service-link">Learn more &#8594;</a>
    </div>
  `).join('');
}

/* ---------- Render: Case Studies ---------- */
function renderCaseStudies(caseStudies) {
  document.getElementById('portfolioGrid').innerHTML = caseStudies.items.map(cs => `
    <div class="portfolio-card" data-category="${esc(cs.category)}">
      <div class="portfolio-img" style="background:${esc(cs.gradient)}">
        <div class="portfolio-overlay">
          <span>${esc(cs.overlayLabel)}</span>
        </div>
      </div>
      <div class="portfolio-info">
        <span class="portfolio-tag">${esc(cs.label)}</span>
        <h3>${esc(cs.title)}</h3>
        <p>${esc(cs.description)}</p>
        <div class="portfolio-metrics">
          ${cs.metrics.map(m => `<span>${esc(m)}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------- Render: Testimonials ---------- */
function renderTestimonials(testimonials) {
  document.getElementById('testimonialsTrack').innerHTML = testimonials.items.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p>&#8220;${esc(t.quote)}&#8221;</p>
      <div class="testimonial-author">
        <div class="author-avatar">${esc(t.initials)}</div>
        <div>
          <strong>${esc(t.author)}</strong>
          <span>${esc(t.role)}, ${esc(t.company)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------- Render: Pricing ---------- */
function renderPricing(pricing) {
  document.getElementById('pricingGrid').innerHTML = pricing.items.map(tier => {
    const priceHtml = tier.price === 'Custom'
      ? `<div class="price">Custom</div>`
      : `<div class="price"><span class="price-currency">$</span>${esc(tier.price)}<span class="price-period">${esc(tier.period)}</span></div>`;
    const btnClass = tier.ctaStyle === 'primary' ? 'btn btn-primary' : 'btn btn-outline';
    return `
      <div class="pricing-card${tier.featured ? ' featured' : ''}">
        ${tier.featured ? '<div class="pricing-badge">Most Popular</div>' : ''}
        <h3>${esc(tier.tier)}</h3>
        ${priceHtml}
        <p class="price-desc">${esc(tier.description)}</p>
        <ul class="pricing-features">
          ${tier.features.map(f => `<li>&#10003; ${esc(f)}</li>`).join('')}
          ${(tier.disabledFeatures || []).map(f => `<li class="disabled">&#10007; ${esc(f)}</li>`).join('')}
        </ul>
        <a href="#contact" class="${btnClass}">${esc(tier.cta)}</a>
      </div>
    `;
  }).join('');
}

/* ---------- Render: Contact ---------- */
function renderContact(company) {
  document.getElementById('contactPhone').textContent = company.phone;
  document.getElementById('contactEmail').textContent = company.email;
  document.getElementById('contactOffices').textContent = company.offices;
}

/* ---------- Main init — runs after all content is rendered ---------- */
async function init() {
  const { company, hero, services, caseStudies, testimonials, pricing } = await fetchContent();

  renderHero(hero);
  renderServices(services);
  renderCaseStudies(caseStudies);
  renderTestimonials(testimonials);
  renderPricing(pricing);
  renderContact(company);

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
  const filterBtns     = document.querySelectorAll('.filter-btn');
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
    const track   = document.getElementById('testimonialsTrack');
    const dotsEl  = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let current = 0;
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
  const sections   = document.querySelectorAll('section[id]');
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
}

init();
