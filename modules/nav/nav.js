/* ============================================================
   OWF NAVIGATION ENGINE — PHASE 4.4.4 (STATIC LAYOUT)
   Highlights active nav item based on hash route
   Uses data-route instead of href
   ============================================================ */

/* ---------------------------------------------
   Highlight active nav item
--------------------------------------------- */
function updateActiveNav() {
  const route = location.hash.replace("#", "") || "home";

  document.querySelectorAll(".nav-item").forEach(item => {
    const itemRoute = item.dataset.route;
    item.classList.toggle("active", itemRoute === route);
  });
}

/* ---------------------------------------------
   Handle nav clicks (SPA routing)
--------------------------------------------- */
function handleNavClick(event) {
  const item = event.target.closest(".nav-item");
  if (!item) return;

  event.preventDefault();

  const route = item.dataset.route;
  location.hash = route;
}

/* ---------------------------------------------
   Event Listeners
--------------------------------------------- */

// Highlight when route changes
window.addEventListener("hashchange", updateActiveNav);

// Highlight after router loads a view
window.addEventListener("owf:view-loaded", updateActiveNav);

// Bind click handlers after full load (FOUC fix)
window.addEventListener("load", () => {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", handleNavClick);
  });

  updateActiveNav();
});
