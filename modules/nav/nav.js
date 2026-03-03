/* ============================================================
   OWF NAVIGATION ENGINE — PHASE 4.4.4 (STATIC LAYOUT)
   Highlights active nav item based on hash route
   ============================================================ */

/* ---------------------------------------------
   Highlight active nav item
--------------------------------------------- */
function updateActiveNav() {
  // Normalize route: "#/home" → "home"
  const route = location.hash.replace("#/", "") || "home";

  document.querySelectorAll(".nav-item").forEach(link => {
    const href = link.getAttribute("href").replace("#/", "");
    link.classList.toggle("active", href === route);
  });
}

/* ---------------------------------------------
   Handle nav clicks (SPA routing)
--------------------------------------------- */
function handleNavClick(event) {
  const link = event.target.closest(".nav-item");
  if (!link) return;

  event.preventDefault();

  const route = link.getAttribute("href");
  location.hash = route;
}

/* ---------------------------------------------
   Event Listeners
--------------------------------------------- */

// Highlight when route changes
window.addEventListener("hashchange", updateActiveNav);

// Highlight after router loads a view
window.addEventListener("owf:view-loaded", updateActiveNav);

// Bind click handlers once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", handleNavClick);
  });

  updateActiveNav();
});