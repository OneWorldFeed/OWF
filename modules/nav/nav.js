/* ============================================================
   OWF NAVIGATION ENGINE — PHASE 4.4.4
   Handles route changes + active link highlighting
   ============================================================ */

function updateActiveNav() {
  const route = location.hash.replace("#", "") || "home";

  document.querySelectorAll("[data-nav]").forEach(link => {
    link.classList.toggle("active", link.dataset.nav === route);
  });
}

function handleNavClick(event) {
  const link = event.target.closest("[data-nav]");
  if (!link) return;

  const route = link.dataset.nav;
  location.hash = route;
}

/* ============================================================
   Event Listeners
   ============================================================ */

// Highlight nav when route changes
window.addEventListener("hashchange", updateActiveNav);

// Highlight nav after router loads a view
window.addEventListener("owf:view-loaded", updateActiveNav);

// Highlight nav after layout injects left-nav
window.addEventListener("owf:layout-ready", updateActiveNav);

// Bind click handlers after layout is ready
window.addEventListener("owf:layout-ready", () => {
  document.querySelectorAll("[data-nav]").forEach(link => {
    link.addEventListener("click", handleNavClick);
  });
});

// Initial highlight on first load
document.addEventListener("DOMContentLoaded", updateActiveNav);
