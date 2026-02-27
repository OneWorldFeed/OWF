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

  const viewRoot = main.querySelector(".view-root") || main;

  if (viewRoot.querySelector("#owf-layout")) return;

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

document.addEventListener("DOMContentLoaded", injectLayout);
window.addEventListener("hashchange", injectLayout);
window.addEventListener("owf:view-loaded", injectLayout);
