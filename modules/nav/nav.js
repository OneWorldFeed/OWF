/* ============================================================
   OWF NAVIGATION ENGINE
   Self-starting DOMContentLoaded removed — app.js orchestrates.
   ============================================================ */

function updateActiveNav() {
  const route = location.hash.replace("#/", "") || "home";
  document.querySelectorAll(".nav-item").forEach(link => {
    const href = link.getAttribute("href").replace("#/", "");
    link.classList.toggle("active", href === route);
  });
}

export function initNav() {
  document.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      location.hash = link.getAttribute("href");
    });
  });

  updateActiveNav();

  // Keep nav in sync on back/forward
  window.addEventListener("hashchange", updateActiveNav);
}
