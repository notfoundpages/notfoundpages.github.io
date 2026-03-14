/* $
 * $ DOCS ATTRIBUTION: Documentation was written with the help of GitHub Copilot [Claude Haiku 4.5]
 * $
 * 
 * Footer Injection Script
 * 
 * PURPOSE:
 * Dynamically injects a reusable, modular footer component into pages
 * without requiring duplicate HTML code. Uses JavaScript to create footer on page load.
 * 
 * FEATURES:
 * - Multi-column grid layout (7 sections)
 * - Brand information with project statistics
 * - Quick links, explore, community sections
 * - Legal/project info links
 * - Social media links
 * - Back-to-top button with smooth scrolling
 * - Responsive design (5 cols → 3 cols → 1 col)
 * - Dynamic copyright year generation
 * 
 * REQUIREMENTS:
 * - HTML container: <footer id="footer-container"></footer>
 * - CSS file: /_components/footer/style.css (for styling)
 * - Icons: @phosphor-icons/web (for icon display)
 * - Main CSS: /assets/css/root/index.css (for theme variables)
 * 
 * USAGE:
 * Include this script before closing </body> tag:
 * <script src="/_components/footer/inject.js"></script>
 * 
 */

document.addEventListener('DOMContentLoaded', () => {

  // === CONTAINER VALIDATION === //
  // Check if footer container exists before attempting injection
  const footerContainer = document.getElementById('footer-container');

  // Warn user if container not found - prevents silent failure
  if (!footerContainer) {
    console.warn('$ [footer-container#id]@<footer> Not Found.');
    return;
  }

  // === DYNAMIC YEAR GENERATION === //
  /*
   * Gets current year for copyright notice
   * Updates automatically each year without code changes
   * Example: © 2026 notfoundpages. All rights reserved.
   * 
   */

  const currentYear = new Date().getFullYear();

  // === FOOTER HTML TEMPLATE === //
  /*
   * Complete HTML structure for the footer component
   * 
   * STRUCTURE (7 SECTIONS):
   * 1. Brand: Logo, description, project statistics
   * 2. Quick Links: Home, Gallery, About, Sponsors, Docs
   * 3. Explore: Featured Designs, Latest Pages, Contributors, Sponsorship
   * 4. Community: GitHub Org, Discussions, Repositories, Contribute
   * 5. Legal: License, Terms, Privacy, Changelog
   * 6. Social: GitHub, Email, Twitter, Discord with back-to-top button
   * 7. Footer Bottom: Copyright notice and community credit
   * 
   */

  const footerHTML = `
  <div class="footer-content">
    <!-- FOOTER GRID LAYOUT -->
    <div class="footer-grid">
      
      <!-- SECTION 1: BRAND -->
      <div class="footer-section footer-brand">
        <div class="footer-logo">
          notfound<span>pages</span>
        </div>
        <p class="footer-description">
          Premium opensource ecosystem of beautiful 404 pages for developers. Zero dependencies, maximum style.
        </p>
        <div class="footer-stats">
          <div class="footer-stat">
            <div class="footer-stat-value">45+</div>
            <div class="footer-stat-label repos-label-mobile-responsive">Repos</div>
          </div>
          <div class="footer-stat">
            <div class="footer-stat-value">1.2K+</div>
            <div class="footer-stat-label">Stars</div>
          </div>
          <div class="footer-stat">
            <div class="footer-stat-value">180+</div>
            <div class="footer-stat-label">Contributors</div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: QUICK LINKS -->
      <div class="footer-section">
        <h3 class="footer-section-title">
          <i class="ph ph-link"></i> Quick Links
        </h3>
        <div class="footer-links">
          <a href="/" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Home
          </a>
          <a href="/gallery/" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Gallery
          </a>
          <a href="/about/" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> About
          </a>
          <a href="/sponsors/" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Sponsors
          </a>
          <a href="/docs/" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Docs
          </a>
        </div>
      </div>

      <!-- SECTION 3: EXPLORE -->
      <div class="footer-section">
        <h3 class="footer-section-title">
          <i class="ph ph-compass"></i> Explore
        </h3>
        <div class="footer-links">
          <a href="/gallery/" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Featured Designs
          </a>
          <a href="/gallery/" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Latest Pages
          </a>
          <a href="/contributors/" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Top Contributors
          </a>
          <a href="/sponsors/" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Become a Sponsor
          </a>
        </div>
      </div>

      <!-- SECTION 4: COMMUNITY -->
      <div class="footer-section">
        <h3 class="footer-section-title">
          <i class="ph ph-users"></i> Community
        </h3>
        <div class="footer-links">
          <a href="https://github.com/notfoundpages" target="_blank" rel="noopener" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> GitHub Org
          </a>
          <a href="https://github.com/orgs/notfoundpages/discussions" target="_blank" rel="noopener" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Discussions
          </a>
          <a href="https://github.com/orgs/notfoundpages/repositories" target="_blank" rel="noopener" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Repositories
          </a>
          <a href="https://github.com/notfoundpages" target="_blank" rel="noopener" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Contribute
          </a>
        </div>
      </div>

      <!-- SECTION 5: LEGAL & PROJECT INFO -->
      <div class="footer-section">
        <h3 class="footer-section-title">
          <i class="ph ph-shield"></i> Legal
        </h3>
        <div class="footer-links">
          <a href="/license/" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> License
          </a>
          <a href="https://github.com/notfoundpages" target="_blank" rel="noopener" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Terms
          </a>
          <a href="https://github.com/notfoundpages" target="_blank" rel="noopener" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Privacy
          </a>
          <a href="https://github.com/notfoundpages" target="_blank" rel="noopener" class="footer-link">
            <i class="ph-bold ph-arrow-up-right"></i> Changelog
          </a>
        </div>
      </div>

    </div>

    <!-- SECTION 6: SOCIAL LINKS -->
    <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 24px; align-items: center; margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid var(--border, #E4E4E7);">
      <div>
        <h3 class="footer-section-title">
          <i class="ph ph-share-network"></i> Connect
        </h3>
        <div class="footer-social">
          <a href="https://github.com/notfoundpages" target="_blank" rel="noopener" class="footer-social-link" aria-label="GitHub">
            <i class="ph-bold ph-github-logo"></i>
          </a>
          <a href="https://github.com/notfoundpages/discussions" target="_blank" rel="noopener" class="footer-social-link" aria-label="Dissusions">
            <i class="ph-bold ph-users"></i>
          </a>
          <a href="https://github.com/sponsors/notfoundpages" target="_blank" rel="noopener" class="footer-social-link" aria-label="Sponsorship">
            <i class="ph-bold ph-heart"></i>
          </a>
          <a href="mailto:" class="footer-social-link" aria-label="Email">
            <i class="ph-bold ph-envelope"></i>
          </a>
          <a href="https://twitter.com/notfoundpages" target="_blank" rel="noopener" class="footer-social-link" aria-label="Twitter">
            <i class="ph-bold ph-x-logo"></i>
          </a>
          <a href="https://instagram.com/notfoundpages.oss" target="_blank" rel="noopener" class="footer-social-link" aria-label="Instagram">
            <i class="ph-bold ph-instagram-logo"></i>
          </a>
        </div>
      </div>

      <!-- Back to Top Button -->
      <a href="#" class="footer-back-to-top" id="footer-back-to-top" aria-label="Back to top">
        <i class="ph-bold ph-arrow-up"></i>
      </a>
    </div>

    <!-- SECTION 7: FOOTER BOTTOM -->
    <div class="footer-bottom">
      <div class="footer-copyright">
        <i class="ph-fill ph-heart"></i>
        &copy; ${currentYear} notfoundpages. All rights reserved.
      </div>
      <div class="footer-credit">
        Built for developers. Maintained by the community.
      </div>
    </div>
  </div>
  `;

  // === INJECT FOOTER === //
  // Insert the complete footer HTML into the container
  footerContainer.innerHTML = footerHTML;

  // === INITIALIZE ALL FOOTER INTERACTIONS === //
  // Must be called after HTML injection so elements exist in DOM
  initializeFooter();
});

/*
 * INITIALIZE FOOTER INTERACTIONS
 * 
 * Sets up all event listeners and functionality for:
 * 1. Back-to-top button (show/hide, scroll)
 * 2. Link hover animations
 * 
 * Called after footer HTML is injected into the DOM
 * 
 */

function initializeFooter() {

  // === GET BACK-TO-TOP BUTTON ELEMENT === //
  const backToTopBtn = document.getElementById('footer-back-to-top');

  // Early exit if button not found
  if (!backToTopBtn) return;

  // ============ BACK-TO-TOP BUTTON FUNCTIONALITY ============ //

  // === SHOW/HIDE BUTTON ON SCROLL === //
  /*
   * LOGIC:
   * - Button is hidden by default (display: none via CSS)
   * - When user scrolls past 400px, button appears (add 'visible' class)
   * - When user scrolls back to top, button hides
   * - This prevents clutter when user is already at top
   * 
   */

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      // User has scrolled down more than 400px
      backToTopBtn.classList.add('visible'); // Show button
    } else {
      // User is near the top
      backToTopBtn.classList.remove('visible'); // Hide button
    }
  });

  // === BACK-TO-TOP CLICK HANDLER === //
  /*
   * Smooth scrolls page to top when button is clicked
   * Uses 'smooth' behavior for animated scroll (not instant jump)
   * 
   */

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior

    // Scroll to top with smooth animation
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Animates scroll over ~500ms
    });
  });

  // ============ FOOTER LINK HOVER ANIMATIONS ============ //

  // === LINK HOVER EFFECT === //
  /*
   * BEHAVIOR:
   * - On hover: Links translate 4px to the right
   * - On leave: Links return to original position
   * - Creates subtle visual feedback for interactive links
   * 
   */

  const footerLinks = document.querySelectorAll('.footer-link');

  footerLinks.forEach(link => {
    // Mouse enters link
    link.addEventListener('mouseenter', function () {
      this.style.transform = 'translateX(4px)'; // Slide right on hover
    });

    // Mouse leaves link
    link.addEventListener('mouseleave', function () {
      this.style.transform = 'translateX(0)'; // Return to original position
    });
  });
}
