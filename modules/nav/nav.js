/* ============================================================
   OWF NAVIGATION — PHASE 4.4.4
   Handles SPA navigation + active state
   ============================================================ */

/**
 * Update active nav item based on current hash.
 */
function updateActiveNav() {
  const hash = location.hash.replace("#/", "") || "home";

  document.querySelectorAll("[data-nav]").forEach(item => {
    const target = item.dataset.nav;
    if (target === hash) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

/**
 * Bind click events to nav items.
 */
function bindNavEvents() {
  document.querySelectorAll("[data-nav]").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const target = item.dataset.nav;
      location.hash = `/${target}`;
    });
  });
}

/**
 * Initialize navigation system.
 */
function initNav() {
  bindNavEvents();
  updateActiveNav();
}

/* ---------------------------------------------
   Auto‑mount on load + hash change
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", initNav);
window.addEventListener("hashchange", updateActiveNav);
