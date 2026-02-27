/* ============================================================
   OWF LAYOUT ENGINE — PHASE 4.4.4
   Injects Feed Column • Right Panel • Mood Bar
   ============================================================ */

const LAYOUT_ROUTES = ["home", "discover", "news", "live"];

export function injectLayout() {
  const main = document.querySelector("#main");
  if (!main) return;

  const route = location.hash.replace("#", "") || "home";
  if (!LAYOUT_ROUTES.includes(route)) return;

  // Do NOT overwrite the view — inject INTO it
  const viewRoot = main.querySelector(".view-root") || main;

  // Prevent double injection
  if (viewRoot.querySelector("#owf-layout")) return;

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
