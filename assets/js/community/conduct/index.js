/* --- DYNAMIC SIDEBAR SCROLL SPY --- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.side-link');

const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -70% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

/* --- REVEAL ON SCROLL --- */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* --- ACCORDION TOGGLE --- */
function toggleExpand(btn) {
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !isExpanded);
}

/* --- COPY EMAIL FUNCTIONALITY --- */
function copyEmail(btn) {
  navigator.clipboard.writeText('notfoundpages@outlook.com').then(() => {
    btn.classList.add('copied');
    setTimeout(() => {
      btn.classList.remove('copied');
    }, 2000);
  });
}