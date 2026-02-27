/* ============================================================
   OWF LAYOUT ENGINE — PHASE 4.4.4
   Injects Left Nav • Feed Column • Right Panel
   ============================================================ */

const LAYOUT_ROUTES = ["home", "discover", "news", "live"];

export function injectLayout() {
  const main = document.querySelector("#main");
  if (!main) return;

  let route = location.hash.replace("#", "").trim();
  if (route === "") route = "home";

  if (!LAYOUT_ROUTES.includes(route)) return;

  // The view container inside the loaded HTML file
  const viewRoot = main.querySelector(".view-root") || main;

  // Prevent duplicate injection
  if (viewRoot.querySelector("#owf-layout")) return;

  // Inject the full 3‑column grid
  viewRoot.insertAdjacentHTML(
    "beforeend",
    `
    <div id="owf-layout" class="owf-grid">

      <!-- LEFT NAV COLUMN -->
      <div id="left-nav"></div>

      <!-- CENTER FEED COLUMN -->
      <div id="feed"></div>

      <!-- RIGHT PANEL COLUMN -->
      <div id="right-panel"></div>

    </div>
    `
  );
}

/* ============================================================
   Ensure layout injection runs at the correct time
   ============================================================ */

// When the page first loads
document.addEventListener("DOMContentLoaded", injectLayout);

// When the route changes (#home → #discover → #news → #live)
window.addEventListener("hashchange", injectLayout);

// When router.js finishes loading a view
window.addEventListener("owf:view-loaded", injectLayout);
