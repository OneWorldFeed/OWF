/* ============================================================
   OWF LAYOUT ENGINE — PHASE 4.4.4
   Injects Left Nav • Center Feed • Right Panel
   ============================================================ */

const LAYOUT_ROUTES = [
  "home",
  "profile",
  "social",
  "dm",
  "live",
  "ai",
  "news",
  "music",
  "podcast",
  "settings"
];

export function injectLayout() {
  const main = document.querySelector("#main");
  if (!main) return;

  let route = location.hash.replace("#", "").trim();
  if (route === "") route = "home";

  if (!LAYOUT_ROUTES.includes(route)) return;

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

  // Inject left nav content INTO THE CORRECT GRID
  viewRoot.querySelector("#left-nav").innerHTML = `
    <nav class="left-nav-inner">
      <a href="#home" data-nav="home">Home</a>
      <a href="#profile" data-nav="profile">Profile</a>
      <a href="#social" data-nav="social">Social</a>
      <a href="#dm" data-nav="dm">DM</a>
      <a href="#live" data-nav="live">Live</a>
      <a href="#ai" data-nav="ai">AI</a>
      <a href="#news" data-nav="news">News</a>
      <a href="#music" data-nav="music">Music</a>
      <a href="#podcast" data-nav="podcast">Podcast</a>
      <a href="#settings" data-nav="settings">Settings</a>
    </nav>
  `;

  // Signal that layout is ready for hydration
  window.dispatchEvent(new Event("owf:layout-ready"));
}

/* ============================================================
   Ensure layout injection runs at the correct time
   ============================================================ */

document.addEventListener("DOMContentLoaded", injectLayout);
window.addEventListener("hashchange", injectLayout);
window.addEventListener("owf:view-loaded", injectLayout);
