/* --- SEARCH & FILTER LOGIC --- */
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentRoleFilter = 'all';
let currentSearchTerm = '';

function filterContributors() {
  let maintainersVisible = 0;
  let contributorsVisible = 0;
  const allCards = document.querySelectorAll('.filter-target');

  allCards.forEach(card => {
    const role = card.getAttribute('data-role');
    const name = card.querySelector('.search-name')?.textContent.toLowerCase() || '';
    const handle = card.querySelector('.search-handle')?.textContent.toLowerCase() || '';

    // Check Role
    const matchesRole = currentRoleFilter === 'all' || role === currentRoleFilter;

    // Check Search (Name or Handle)
    const matchesSearch = name.includes(currentSearchTerm) || handle.includes(currentSearchTerm) || role.includes(currentSearchTerm);

    if (matchesRole && matchesSearch) {
      card.style.display = '';
      if (role === 'maintainer') maintainersVisible++;
      if (role === 'contributor') contributorsVisible++;
    } else {
      card.style.display = 'none';
    }
  });

  // Handle Empty States
  document.getElementById('maintainersEmpty').style.display =
    (maintainersVisible === 0 && (currentRoleFilter === 'all' || currentRoleFilter === 'maintainer')) ? 'block' : 'none';

  document.getElementById('contributorsEmpty').style.display =
    (contributorsVisible === 0 && (currentRoleFilter === 'all' || currentRoleFilter === 'contributor')) ? 'block' : 'none';

  // Hide full sections if filtered out by role button
  document.querySelector('.maintainers-section').style.display = (currentRoleFilter === 'all' || currentRoleFilter === 'maintainer') ? 'block' : 'none';
  document.querySelector('.contributors-section').style.display = (currentRoleFilter === 'all' || currentRoleFilter === 'contributor') ? 'block' : 'none';
}

searchInput.addEventListener('input', (e) => {
  currentSearchTerm = e.target.value.toLowerCase().trim();

  // If there's a search term, display all remaining contributors for complete results
  if (currentSearchTerm && displayedCount < allContributors.length) {
    const grid = document.getElementById('contributorsGrid');
    // Add all remaining contributors at once
    for (let i = displayedCount; i < allContributors.length; i++) {
      grid.appendChild(createContributorCard(allContributors[i]));
    }
    displayedCount = allContributors.length;
    updateLoadMoreButton();
  }

  filterContributors();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentRoleFilter = e.target.getAttribute('data-filter');
    filterContributors();
  });
});

/* --- DYNAMIC CARD LOADING --- */
function createMaintainerCard(maintainer) {
  const card = document.createElement('div');
  card.className = 'card maintainer-card filter-target';
  card.setAttribute('data-role', 'maintainer');

  const stats1 = `<i class="ph-bold ph-git-commit"></i> ${maintainer.contributions} Commits`;
  const stats2 = maintainer.extra || '';
  const featuredStar = maintainer.featured ? '<i class="ph-fill ph-star" style="position: absolute; top: 12px; right: 12px; color: #EAB308; font-size: 16px;"></i>' : '';
  const ownerBadge = maintainer.isOwner ? '<span style="display: inline-block; font-size: 11px; font-weight: 700; color: #d13d3d; background: rgba(209, 61, 61, 0.1); padding: 4px 10px; border-radius: 100px; text-transform: uppercase; margin-bottom: 8px; margin-left: 8px;"><i class="ph-bold ph-crown"></i> Owner</span>' : '';

  // Tier badge styling
  let tierBadgeHtml = '';
  if (maintainer.tier) {
    const tierColor = maintainer.tier === 'Gold' ? '#FFB81C' : maintainer.tier === 'Silver' ? '#C0C0C0' : '#CD7F32';
    tierBadgeHtml = `<span style="display: inline-block; font-size: 11px; font-weight: 600; color: ${tierColor}; background: ${tierColor}20; border: 1px solid ${tierColor}; padding: 3px 9px; border-radius: 100px; margin-bottom: 8px">${maintainer.tier}</span>`;
  }

  card.innerHTML = `
    ${featuredStar}

    <img src="${maintainer.avatar}" alt="${maintainer.name}" class="m-avatar" loading="lazy">
    <div class="m-info">
      <div class="m-badges" style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
        ${ownerBadge}
        <span class="m-role m-badge-mobile-responsive"><i class="ph-bold ph-user-gear"></i> Maintainer</span>
        ${tierBadgeHtml}
      </div>
      <h4 class="m-name search-name">${maintainer.name}</h4>
      <span class="m-username search-handle">@${maintainer.username}</span>
      <div class="m-stats">
        <span>${stats1}</span>
        ${stats2 ? `<span>${stats2}</span>` : ''}
      </div>
    </div>
  `;

  return card;
}

function createContributorCard(contributor) {
  const card = document.createElement('a');
  card.href = '#';
  card.className = 'card contributor-card filter-target';
  card.setAttribute('data-role', 'contributor');

  const tooltipText = `@${contributor.username}`;
  const featuredBadge = contributor.featured ? `<i class="ph-fill ph-star featured-badge" title="Featured Contributor"></i>` : '';

  card.innerHTML = `
    <div class="tooltip">${tooltipText}</div>
    ${featuredBadge}
    <img src="${contributor.avatar}" alt="${contributor.name}" class="c-avatar" loading="lazy">
    <div class="c-name search-name">${contributor.name}</div>
    <div class="c-commits search-handle">${contributor.contributions} Commits</div>
  `;

  return card;
}

async function loadMaintainers() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/gh/notfoundpages/v1.notfoundpages.dynamic@main/maintainers.json');
    if (!response.ok) throw new Error('Failed to load maintainers');
    let maintainers = await response.json();

    // Sort by contributions (descending - highest to lowest)
    maintainers.sort((a, b) => b.contributions - a.contributions);

    const grid = document.getElementById('maintainersGrid');
    maintainers.forEach(maintainer => {
      grid.appendChild(createMaintainerCard(maintainer));
    });

    filterContributors();
  } catch (error) {
    console.error('Error loading maintainers:', error);
  }
}

let allContributors = [];
let displayedCount = 0;
let isLoadingMore = false;
const ITEMS_PER_BATCH = 30;

async function loadAllContributors() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/gh/notfoundpages/v1.notfoundpages.dynamic@main/contributors/core-contributors.json');
    if (!response.ok) throw new Error('Failed to load contributors');

    allContributors = await response.json();

    if (!Array.isArray(allContributors) || allContributors.length === 0) {
      allContributors = [];
    }

    // Sort by contributions (descending - highest to lowest)
    allContributors.sort((a, b) => b.contributions - a.contributions);

    // Display first batch
    displayBatch();
    filterContributors();
  } catch (error) {
    console.error('Error loading contributors:', error);
    allContributors = [];
  }
}

function displayBatch() {
  const grid = document.getElementById('contributorsGrid');
  const startIndex = displayedCount;
  const endIndex = Math.min(displayedCount + ITEMS_PER_BATCH, allContributors.length);

  for (let i = startIndex; i < endIndex; i++) {
    grid.appendChild(createContributorCard(allContributors[i]));
  }

  displayedCount = endIndex;
  updateLoadMoreButton();
}

function updateLoadMoreButton() {
  const container = document.getElementById('loadMoreContainer');
  if (!container) return;

  // Show button if there are more contributors to display
  container.style.display = displayedCount < allContributors.length ? 'flex' : 'none';
}

function setupLoadMoreListener() {
  const btn = document.getElementById('loadMoreBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (!isLoadingMore && displayedCount < allContributors.length) {
      isLoadingMore = true;
      btn.classList.add('loading');

      // Small delay for UX feedback
      setTimeout(() => {
        displayBatch();
        filterContributors();
        isLoadingMore = false;
        btn.classList.remove('loading');
      }, 200);
    }
  });
}

/* --- BACK TO TOP LOGIC --- */
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* --- INITIALIZE DYNAMIC LOADING --- */
document.addEventListener('DOMContentLoaded', () => {
  loadMaintainers();
  loadAllContributors();
  setupLoadMoreListener();
});