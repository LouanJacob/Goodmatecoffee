const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

function closeMobileNav() {
  if (!menuToggle || !primaryNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', document.documentElement.lang === 'fr' ? 'Ouvrir le menu' : 'Open menu');
  primaryNav.classList.remove('is-open');
  document.body.classList.remove('nav-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Ouvrir le menu' : 'Fermer le menu');
  primaryNav?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('nav-open', !isOpen);
});

primaryNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeMobileNav();
});
const syncScrollState = () => document.body.classList.toggle('has-scrolled', window.scrollY > 24);
window.addEventListener('scroll', syncScrollState, { passive: true });
syncScrollState();

document.querySelectorAll('.filter-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const category = tab.dataset.filter;
    document.querySelectorAll('.filter-tab').forEach((item) => item.classList.toggle('active', item === tab));
    document.querySelectorAll('.menu-card').forEach((card) => {
      const categories = (card.dataset.category || '').split(' ');
      card.classList.toggle('is-hidden', category !== 'all' && !categories.includes(category));
    });
  });
});

const languageToggle = document.querySelector('.language-toggle');
function setLanguage(language) {
  const nextLanguage = language === 'en' ? 'en' : 'fr';
  document.documentElement.lang = nextLanguage;
  document.querySelectorAll('[data-fr][data-en]').forEach((element) => {
    element.innerHTML = element.dataset[nextLanguage];
  });
  document.querySelector('.language-current').textContent = nextLanguage.toUpperCase();
  languageToggle?.setAttribute('aria-label', nextLanguage === 'fr' ? 'Switch language to English' : 'Changer la langue en français');
  if (menuToggle?.getAttribute('aria-expanded') !== 'true') {
    menuToggle?.setAttribute('aria-label', nextLanguage === 'fr' ? 'Ouvrir le menu' : 'Open menu');
  }
  try { localStorage.setItem('goodmate-language', nextLanguage); } catch (_) { /* local file or private browsing */ }
}

languageToggle?.addEventListener('click', () => {
  setLanguage(document.documentElement.lang === 'fr' ? 'en' : 'fr');
});

try {
  const savedLanguage = localStorage.getItem('goodmate-language');
  if (savedLanguage === 'en') setLanguage('en');
} catch (_) { /* local file or private browsing */ }

const currentYear = document.querySelector('#current-year');
if (currentYear) currentYear.textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

document.querySelectorAll('img').forEach((image) => {
  image.addEventListener('error', () => image.parentElement?.classList.add('image-fallback'), { once: true });
});
