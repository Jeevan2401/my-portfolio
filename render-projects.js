// render-projects.js
// Fetches project data from projects.json and injects project cards into
// #projects-container. Once injected, calls window.initProjectCards() so the
// page's existing scroll-reveal + 3D tilt effects get wired up on the new cards.

async function loadProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  try {
    const res = await fetch("projects.json");
    if (!res.ok) throw new Error(`Failed to fetch projects.json: ${res.status}`);
    const projects = await res.json();

    container.innerHTML = projects.map(renderProjectCard).join("");

    // Hook the newly injected cards into the page's reveal/tilt animations
    if (typeof window.initProjectCards === "function") {
      window.initProjectCards();
    }
  } catch (err) {
    console.error("Error loading projects:", err);
    container.innerHTML = `<p style="color:var(--muted)">Couldn't load projects right now.</p>`;
  }
}

function renderProjectCard(project) {
  const stack = project.tags
    .map(tag => `<span class="stack-item">${escapeHTML(tag)}</span>`)
    .join("");

  return `
    <div class="project-card reveal">
      <div class="project-num">${escapeHTML(project.number)}</div>
      <span class="project-tag">${escapeHTML(project.category)}</span>
      <h3 class="project-name">${escapeHTML(project.title)}</h3>
      <p class="project-desc">${escapeHTML(project.description)}</p>
      <div class="project-stack">${stack}</div>
      <a href="${escapeAttr(project.link)}" class="project-link" target="_blank" rel="noopener">View Project</a>
    </div>
  `;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", loadProjects);
