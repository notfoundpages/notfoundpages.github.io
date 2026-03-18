async function loadFeatured() {
  const res = await fetch("https://cdn.jsdelivr.net/gh/notfoundpages/v1.notfoundpages.dynamic@main/featured.json");
  const d = await res.json();

  const html = `
  <div class="featured-card">
    <div class="featured-img" style="background-image:url('${d.preview}')"></div>

    <div class="featured-content">
      <div class="badge-featured">
        <i class="ph-bold ph-star"></i> Featured Design
      </div>

      <h3>${d.title}</h3>
      <p>${d.description}</p>

      <div class="author-attribution">
        <img src="${d.avatar}" class="author-avatar">
        <div class="author-info">
          <h5>Designed by ${d.author}</h5>
          <span>${d.tag}</span>
        </div>
      </div>

      <div class="featured-stats">
        <span><i class="ph-fill ph-star"></i> ${d.stars}</span>
        <span><i class="ph-fill ph-git-fork"></i> ${d.forks}</span>
      </div>

      <div class="featured-actions">
        <a href="${d.demo}" class="btn-primary" style="padding:12px 24px;">
          <i class="ph-bold ph-play"></i> <span class="demo-btn-mobile-responsive">View Demo</span>
        </a>
        <a href="${d.repo}" class="btn-outline" style="padding:12px 24px;">
          <i class="ph-bold ph-github-logo"></i> <span class="repo-btn-mobile-responsive">Open Repository</span>
        </a>
      </div>
    </div>
  </div>`;

  document.getElementById("featured-container").innerHTML = html;
}

loadFeatured();