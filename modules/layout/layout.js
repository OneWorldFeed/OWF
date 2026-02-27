/* ============================================================
   OWF LAYOUT ENGINE — PHASE 4.4.4
   Injects Feed Column • Right Panel • Mood Bar
   ============================================================ */

const LAYOUT_ROUTES = ["home", "discover", "news", "live"];

export function injectLayout() {
  const main = document.querySelector("#main");
  if (!main) return;

  let route = location.hash.replace("#", "").trim();
  if (route === "") route = "home";

  if (!LAYOUT_ROUTES.includes(route)) return;

  // Find the view root inside the loaded view
  const viewRoot = main.querySelector(".view-root") || main;

  // Prevent double injection
  if (viewRoot.querySelector("#owf-layout")) return;

  // Inject the grid INSIDE the view, not overwriting it
  viewRoot.insertAdjacentHTML(
    "beforeend",
    `
    <div id="owf-layout" class="owf-grid">
      <div id="mood-bar"></div>
      <div id="feed"></div>
      <div id="right-panel"></div>
    </div>
    `
  );
}

window.addEventListener("owf:view-loaded", injectLayout);
