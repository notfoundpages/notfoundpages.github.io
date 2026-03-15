/* --- SCROLL REVEAL (Intersection Observer) --- */
const reveals = document.querySelectorAll('.reveal');
const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('active');
    observer.unobserve(entry.target);
  });
}, revealOptions);

reveals.forEach(reveal => revealOnScroll.observe(reveal));

/* --- ANIMATED STATS --- */
function animate(id, end, suffix = '') {
  let el = document.getElementById(id);
  const duration = 2000;
  const startTime = performance.now();

  function easeOutQuart(x) { return 1 - Math.pow(1 - x, 4); }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentVal = Math.floor(easeOutQuart(progress) * end);

    el.textContent = currentVal + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = end + suffix;
  }
  requestAnimationFrame(update);
}

// Trigger stats animation when the stats section is in view
const statsSection = document.querySelector('.stats-grid');
const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        animate("stat-repos", 45, '+');
        animate("stat-stars", 1250, '+');
        animate("stat-contribs", 28, '');
        animate("stat-forks", 840, '+');
      }, 200);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

if (statsSection) statsObserver.observe(statsSection);

/* --- DYNAMIC MAINTAINERS LOADING --- */
async function loadMaintainers() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/gh/notfoundpages/v1.notfoundpages.dynamic@main/maintainers.json');
    if (!response.ok) throw new Error('Unable to load maintainers ; likely due to incorrect dynamic content path or issues with the CDN.');

    let maintainers = await response.json();

    // Sort by contributions (descending) and take top 6
    maintainers = maintainers
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 6);

    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;

    // Helper function to truncate names to 25 characters with ellipses
    function truncateName(name, maxLength = 25) {
      return name.length > maxLength ? name.substring(0, maxLength - 3) + '...' : name;
    }

    maintainers.forEach(maintainer => {
      const card = document.createElement('div');
      card.className = 'team-card';
      card.style.cursor = 'pointer';

      const displayName = truncateName(maintainer.name);
      const ownerBadge = maintainer.isOwner ? '<div class="team-owner-badge"><i class="ph-bold ph-crown"></i> Owner</div>' : '';

      card.innerHTML = `
        <img src="${maintainer.avatar}" alt="${maintainer.name}" class="team-avatar" loading="lazy">
        ${ownerBadge}
        <h4 title="${maintainer.name}" style="font-size: 14px;">${displayName}</h4>
        <div class="team-status" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10B981;"></span>
          <span style="font-size: 12px; color: var(--text-muted);">${maintainer.status || 'Active'}</span>
          ${maintainer.tier ? `<div style="background-color: ${maintainer.tier === 'Gold' ? '#FFB81C' : maintainer.tier === 'Silver' ? '#C0C0C0' : '#CD7F32'}30; color: ${maintainer.tier === 'Gold' ? '#FFB81C' : maintainer.tier === 'Silver' ? '#C0C0C0' : '#CD7F32'}; border: 1px solid ${maintainer.tier === 'Gold' ? '#FFB81C' : maintainer.tier === 'Silver' ? '#C0C0C0' : '#CD7F32'}; padding: 2px 4px; border-radius: 100px; font-size: 7px; font-weight: 600;\">${maintainer.tier}</div>` : ''}
        </div>
        <div style="display: flex; justify-content: space-around; padding: 12px 0; border-top: 1px solid var(--border); font-size: 12px; margin: 16px 0; margin-bottom: 0; color: var(--text-muted);">
          <div><div style="font-weight: 700; color: var(--text-main);">${maintainer.pull_requests || 0}</div><div>PRs</div></div>
          <div><div style="font-weight: 700; color: var(--text-main);">${maintainer.reviews || 0}</div><div>Reviews</div></div>
          <div><div style="font-weight: 700; color: var(--text-main);">${maintainer.contributions || 0}</div><div>Commits</div></div>
        </div>
      `;

      // Click handler to redirect to GitHub
      card.addEventListener('click', () => {
        if (maintainer.github_url) {
          window.open(maintainer.github_url, '_blank');
        }
      });

      teamGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading maintainers:', error);
  }
}

// Load maintainers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadMaintainers();
});