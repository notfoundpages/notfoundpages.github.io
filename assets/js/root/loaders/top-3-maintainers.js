/* --- DYNAMIC MAINTAINERS LOADING FOR LANDING PAGE --- */
async function loadLandingMaintainers() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/gh/notfoundpages/v1.notfoundpages.dynamic@main/maintainers.json');
    if (!response.ok) throw new Error('Unable to load maintainers ; likely due to incorrect dynamic content path or issues with the CDN.');
    
    let maintainers = await response.json();
    
    // Sort by contributions (descending) and take top 3
    maintainers = maintainers
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 3);
    
    const teamGrid = document.getElementById('landingTeamGrid');
    if (!teamGrid) return;
    
    // Helper function to truncate names to 30 characters with ellipses
    function truncateName(name, maxLength = 30) {
      return name.length > maxLength ? name.substring(0, maxLength - 3) + '...' : name;
    }
    
    maintainers.forEach(maintainer => {
      const card = document.createElement('div');
      card.className = 'team-card';
      card.style.cursor = 'pointer';

      const displayName = truncateName(maintainer.name);
      const highlightedBadge = maintainer.isOwner ? '<div class="team-owner-badge"><i class="ph-bold ph-crown"></i> Owner</div>' : '<div class="team-maintainer-badge"><i class="ph-bold ph-user-gear"></i> Maintainer</div>';
      
      // Build expertise tags
      const statusColor = maintainer.status === 'Active' ? '#10B981' : '#F59E0B'; // green if active, orange if not
      
      card.innerHTML = `
        <img src="${maintainer.avatar}" alt="${maintainer.name}" class="team-avatar" loading="lazy">
        ${highlightedBadge}
        <h4 title="${maintainer.name}" style="font-size: 16px;">${displayName}</h4>
        <div class="team-status" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${statusColor};"></span>
          <span style="font-size: 12px; color: var(--text-muted);">${maintainer.status || 'Active'}</span>
          ${maintainer.tier ? `<div style="background-color: ${maintainer.tier === 'Gold' ? '#FFB81C' : maintainer.tier === 'Silver' ? '#C0C0C0' : '#CD7F32'}30; color: ${maintainer.tier === 'Gold' ? '#FFB81C' : maintainer.tier === 'Silver' ? '#C0C0C0' : '#CD7F32'}; border: 1px solid ${maintainer.tier === 'Gold' ? '#FFB81C' : maintainer.tier === 'Silver' ? '#C0C0C0' : '#CD7F32'}; padding: 2px 4px; border-radius: 100px; font-size: 7px; font-weight: 600;\">${maintainer.tier}</div>` : ''}
        </div>
        <div class="team-stats" style="display: flex; justify-content: space-around; padding: 12px 0; border-top: 1px solid var(--border); font-size: 12px; margin: 16px 0; margin-bottom: 0; color: var(--text-muted);">
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
    console.error('Exception: Unable to load landing maintainers:', error);
  }
}

// Load maintainers when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadLandingMaintainers);
} else {
  loadLandingMaintainers();
}
