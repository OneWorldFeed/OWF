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

  if (document.querySelector("#owf-layout")) return;

  main.innerHTML = `
    <div id="owf-layout" class="owf-grid">
      <div id="mood-bar"></div>
      <div id="feed"></div>
      <div id="right-panel"></div>
    </div>
  `;
}

window.addEventListener("owf:view-loaded", injectLayout);