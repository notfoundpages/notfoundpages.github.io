/* --- THEME TOGGLE LOGIC --- */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Check local storage or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

// Apply initial theme
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon(currentTheme);
});

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.classList.remove('ph-moon');
    themeIcon.classList.add('ph-sun');
  } else {
    themeIcon.classList.remove('ph-sun');
    themeIcon.classList.add('ph-moon');
  }
}

/* --- ANIMATED STATS --- */
function animate(id, end) {
  let el = document.getElementById(id);
  const duration = 2500;
  const startTime = performance.now();

  function easeOutQuart(x) { return 1 - Math.pow(1 - x, 4); }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentVal = Math.floor(easeOutQuart(progress) * end);

    el.textContent = currentVal + (id === 'stars' || id === 'designs' ? '+' : '');

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = end + (id === 'stars' || id === 'designs' ? '+' : '');
  }
  requestAnimationFrame(update);
}

// Start animations slightly delayed
setTimeout(() => {
  animate("designs", 45);
  animate("stars", 1250);
  animate("contributors", 28);
}, 300);

/* --- NAV DROPDOWN TOGGLE --- */
const navMoreBtn = document.getElementById('nav-more-btn');
const navDropdown = document.getElementById('nav-dropdown');

navMoreBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  navDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!navMoreBtn.contains(e.target) && !navDropdown.contains(e.target)) {
    navDropdown.classList.remove('active');
  }
});

// Close dropdown when a link is clicked
navDropdown.querySelectorAll('.nav-dropdown-link').forEach(element => {
  element.addEventListener('click', () => {
    navDropdown.classList.remove('active');
  });
});

/* --- DYNAMIC MOBILE NAVIGATION --- */
document.addEventListener('DOMContentLoaded', () => {
  const navDropdown = document.getElementById('nav-dropdown');

  // The links we hid on mobile, now formatted for the dropdown
  const mobileLinks = [
    { text: 'Home', href: '/', icon: 'ph-house' },
    { text: 'Gallery', href: '/gallery/', icon: 'ph-image' },
    { text: 'Designs', href: '/designs/', icon: 'ph-palette' }
  ];

  const fragment = document.createDocumentFragment();

  mobileLinks.forEach(linkData => {
    const linkEl = document.createElement('a');
    linkEl.className = 'nav-dropdown-link mobile-only-link'; // Custom class for CSS targeting
    linkEl.href = linkData.href;
    linkEl.innerHTML = `<i class="ph ${linkData.icon}"></i> ${linkData.text}`;

    // Ensure the dropdown closes when these new links are clicked
    linkEl.addEventListener('click', () => {
      navDropdown.classList.remove('active');
    });

    fragment.appendChild(linkEl);
  });

  // Add a neat little visual divider to separate core links from the "More" links
  const divider = document.createElement('div');
  divider.className = 'mobile-only-divider';
  fragment.appendChild(divider);

  // Insert these new links at the very top of the dropdown
  if (navDropdown) {
    navDropdown.insertBefore(fragment, navDropdown.firstChild);
  }
});

/* --- TESTIMONIALS INFINITE SCROLL --- */
const testimonialsTrack = document.getElementById('testimonials-track');
const testimonialsContainer = document.getElementById('testimonials-container');

if (testimonialsTrack && testimonialsContainer) {
  // Duplicate cards for seamless infinite scroll on large screens
  const isDesktop = window.innerWidth > 768;

  if (isDesktop) {
    const cards = testimonialsTrack.querySelectorAll('.testimonial-card');
    const cardsHTML = Array.from(cards).map(card => card.cloneNode(true));
    cardsHTML.forEach(card => testimonialsTrack.appendChild(card));
  }

  // Pause animation on hover
  testimonialsContainer.addEventListener('mouseenter', () => {
    testimonialsTrack.style.animationPlayState = 'paused';
  });

  testimonialsContainer.addEventListener('mouseleave', () => {
    testimonialsTrack.style.animationPlayState = 'running';
  });

  // Pause animation on focus
  testimonialsTrack.addEventListener('focusin', () => {
    testimonialsTrack.style.animationPlayState = 'paused';
  });

  testimonialsTrack.addEventListener('focusout', () => {
    testimonialsTrack.style.animationPlayState = 'running';
  });

  // Make cards keyboard focusable
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.setAttribute('tabindex', '0');
  });
}