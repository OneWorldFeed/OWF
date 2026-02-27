/* ============================================================
   OWF ROUTER — PHASE 4.4.4
   Simple hash‑based SPA router for OWF
   Loads views into <main id="main">
   ============================================================ */

import { loadHomeFeed } from "../home/home.js";

const routes = {
  "home": "./views/home.html",
  "discover": "./views/discover.html",
  "news": "./views/news.html",
  "live": "./views/live.html",
  "profile": "./views/profile.html",
  "settings": "./views/settings.html"
};

/* ---------------------------------------------
   Load an HTML view into <main id="main">
--------------------------------------------- */
async function loadView(path) {
  const main = document.querySelector("#main");
  if (!main) return;

  const file = routes[path] || routes["home"];

  try {
    const response = await fetch(file);
    const html = await response.text();
    main.innerHTML = html;
  } catch (err) {
    main.innerHTML = `<p style="padding:20px;">Error loading view.</p>`;
  }
}

/* ---------------------------------------------
   Determine current route
--------------------------------------------- */
function getRoute() {
  const hash = location.hash.replace("#", "").trim();
  return hash === "" ? "home" : hash;
}

/* ---------------------------------------------
   Handle route changes
--------------------------------------------- */
async function handleRoute() {
  const route = getRoute();
  await loadView(route);

  // Layout injection (left-nav, feed, right-panel)
  window.dispatchEvent(new Event("owf:view-loaded"));

  // Hydrate Home feed AFTER layout is injected
  if (route === "home") {
    loadHomeFeed();
  }
}

/* ---------------------------------------------
   Boot router
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("hashchange", handleRoute);
