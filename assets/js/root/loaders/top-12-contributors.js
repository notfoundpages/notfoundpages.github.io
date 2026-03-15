async function loadContributors() {
  const res = await fetch("https://cdn.jsdelivr.net/gh/notfoundpages/v1.notfoundpages.dynamic@main/contributors/top-12-contributors.json");
  const users = await res.json();

  const container = document.getElementById("contributors-container");

  users.forEach(u => {

    const card = `
    <a href="${u.github}" class="contributor-card">

      <img src="${u.avatar}" class="contrib-avatar" alt="${u.name}">

      <div class="contrib-name" title="${u.name}">
        ${u.name}
      </div>

      <div class="contrib-stats">
        ${u.contributions} Contributions
      </div>

    </a>`;

    container.insertAdjacentHTML("beforeend", card);
  });
}

loadContributors();
