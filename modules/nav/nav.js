/* ============================================================
   OWF NAVIGATION — PHASE 4.4.4
   Hash Routing • Active State • SPA Safe
   ============================================================ */

export function setActiveNav() {
  const route = location.hash.replace("#", "") || "home";

  document.querySelectorAll("[data-nav]").forEach(el => {
    el.classList.toggle("active", el.dataset.nav === route);
  });
}

document.addEventListener("DOMContentLoaded", setActiveNav);
window.addEventListener("hashchange", setActiveNav);