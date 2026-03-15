/* $
 * $ DOCS ATTRIBUTION: Documentation was written with the help of GitHub Copilot [Claude Haiku 4.5]
 * $
 * 
 * Navigation Injection Script
 * 
 * PURPOSE:
 * Dynamically injects a reusable, modular navigation component into pages
 * without requiring duplicate HTML code. Uses JavaScript to create nav on page load.
 * 
 * BEHAVIOR:
 * - Injects complete nav HTML into #nav-container
 * - Handles theme toggle (light/dark mode) with localStorage
 * - Manages more dropdown menu for additional links
 * - Provides smooth anchor link scrolling for in-page navigation
 * 
 * REQUIREMENTS:
 * - HTML container: <nav id="nav-container"></nav>
 * - CSS file: /_components/navbar/style.css (for styling)
 * - Icons: @phosphor-icons/web (for icon display)
 * - Main CSS: /assets/css/root/index.css (for theme variables)
 * 
 * USAGE:
 * Include this script before closing </body> tag:
 * <script src="/_components/navbar/inject.js"></script>
 * 
 */

document.addEventListener('DOMContentLoaded', () => {

  // === CONTAINER VALIDATION === //
  // Check if nav container exists before attempting injection
  const navContainer = document.getElementById('nav-container');

  // Warn user if container not found - prevents silent failure
  if (!navContainer) {
    console.warn('$ [nav-container#id]@<nav> Not Found.');
    return;
  }

  // === NAVIGATION HTML TEMPLATE === //
  /*
   * Complete HTML structure for the navigation component
   * 
   * STRUCTURE:
   * - nav-main: Contains logo, nav links, and action buttons
   * - nav-links: Primary navigation links (desktop view)
   * - nav-actions: Theme toggle and GitHub button
   * - nav-more-btn: More options menu button (ellipsis icon)
   * - nav-dropdown: Mobile menu with additional links
   * 
   */

  const navHTML = `
  <div class="nav-glass">
    <div class="nav-main">
      <div class="logo">
        notfound<span>pages</span>
      </div>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/gallery/">Gallery</a>
        <a href="/designs/">Designs</a>
        <a href="/#contribute">Contribute</a>
        <a href="/docs/">Docs</a>
      </div>
      <div class="nav-actions">
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
          <i class="ph ph-moon" id="theme-icon"></i>
        </button>
        <a class="btn-sm" href="https://github.com/notfoundpages">
          <i class="ph-bold ph-github-logo"></i> <span>View Organisation</span>
        </a>
      </div>
    </div>
    <button class="nav-more-btn" id="nav-more-btn" aria-label="More options">
      <i class="ph ph-dots-three"></i>
    </button>
    <div class="nav-dropdown" id="nav-dropdown">
      <a class="nav-dropdown-link" href="/about/">
        <i class="ph ph-info"></i> About
      </a>
      <a class="nav-dropdown-link" href="/sponsors/">
        <i class="ph ph-star"></i> Sponsors
      </a>
      <a class="nav-dropdown-link" href="/community/contributors/">
        <i class="ph ph-users"></i> Contributors
      </a>
      <a class="nav-dropdown-link" href="/miscellaneous/">
        <i class="ph ph-wrench"></i> Miscellaneous
      </a>
    </div>
  </div>
  `;

  // === INJECT NAVIGATION === //
  // Insert the complete nav HTML into the container
  navContainer.innerHTML = navHTML;

  // === INITIALIZE ALL NAV INTERACTIONS === //
  // Must be called after HTML injection so elements exist in DOM
  initializeNavigation();
});

/*
 * INITIALIZE NAVIGATION INTERACTIONS
 * 
 * Sets up all event listeners and functionality for:
 * 1. Theme toggle (light/dark mode switching)
 * 2. More dropdown menu (open/close on click)
 * 3. Smooth anchor link scrolling (in-page navigation)
 * 
 * Called after nav HTML is injected into the DOM
 * 
 */

function initializeNavigation() {

  // ============ SECTION 1: THEME TOGGLE ============ //
  /*
   * THEME SYSTEM:
   * - Saves user preference to localStorage
   * - Falls back to system preference (prefers-color-scheme)
   * - Updates document [data-theme] attribute
   * - Changes icon and applies CSS variable overrides
   * 
   */

  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Determine initial theme: saved preference > system preference > light mode default
  let currentTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  // Apply initial theme to document root element
  // CSS uses [data-theme="dark"] or [data-theme="light"] selectors to override variables
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  // === THEME TOGGLE BUTTON CLICK HANDLER === //
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Toggle between dark and light
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';

      // Apply theme to document (triggers CSS variable overrides)
      document.documentElement.setAttribute('data-theme', currentTheme);

      // Save preference for next visit (persists across sessions)
      localStorage.setItem('theme', currentTheme);

      // Update icon to match new theme
      updateThemeIcon(currentTheme);
    });
  }

  /*
   * UPDATE THEME ICON
   * @param {string} theme - Current theme ('light' or 'dark')
   * 
   * Changes icon display:
   * - Light mode: Shows moon icon (🌙) - indicating user can switch to dark
   * - Dark mode: Shows sun icon (☀️) - indicating user can switch to light
   * 
   */

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'ph ph-sun';
    } else {
      themeIcon.className = 'ph ph-moon';
    }
  }

  // ============ SECTION 2: MORE DROPDOWN MENU ============ //
  /*
   * MORE MENU BEHAVIOR:
   * - Toggle menu open/close on more button click
   * - Close menu when a link is clicked (navigation occurs)
   * - Close menu when clicking outside (user loses interest)
   * 
   */

  const navMoreBtn = document.getElementById('nav-more-btn');
  const navDropdown = document.getElementById('nav-dropdown');

  if (navMoreBtn && navDropdown) {

    // === MORE BUTTON CLICK HANDLER === //
    // Toggle dropdown visibility
    navMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event from bubbling to document listener
      navDropdown.classList.toggle('active'); // Add/remove 'active' class for CSS animation
    });

    // === DROPDOWN LINK CLICK HANDLER === //
    // Close dropdown after user selects a link (navigation starts)
    navDropdown.querySelectorAll('.nav-dropdown-link').forEach(element => {
      element.addEventListener('click', () => {
        navDropdown.classList.remove('active'); // Close menu
      });
    });

    // === CLOSE ON OUTSIDE CLICK === //
    // Close dropdown when user clicks elsewhere on the page
    // Prevents menu staying open after navigation
    document.addEventListener('click', (e) => {
      // Check if click is outside both the button and dropdown
      if (!navMoreBtn.contains(e.target) && !navDropdown.contains(e.target)) {
        navDropdown.classList.remove('active'); // Close menu
      }
    });
  }
}

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