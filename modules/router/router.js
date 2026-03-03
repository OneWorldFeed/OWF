/* ============================================================
   OWF ROUTER — PHASE 4.4.4
   Loads views into <section id="owf-page">.
   Self-starting DOMContentLoaded removed — app.js orchestrates.
   handleRoute is exported and awaitable.
   ============================================================ */

const routes = {
  home:     "/views/home.html",
  discover: "/views/discover.html",
  news:     "/views/news.html",
  live:     "/views/live.html",
  music:    "/views/music.html",
  podcasts: "/views/podcasts.html",
  social:   "/views/social.html",
  dm:       "/views/dm.html",
  ai:       "/views/ai.html",
  profile:  "/views/profile.html",
  settings: "/views/settings.html",
  auth:     "/views/auth.html"
};

async function loadView(route) {
  const mount = document.querySelector("#owf-page");
  if (!mount) return;

  const file = routes[route] || routes.home;

  try {
    const response = await fetch(file);
    const html = await response.text();
    mount.innerHTML = html;
  } catch (err) {
    console.error("Router error:", err);
    mount.innerHTML = `<p style="padding:20px;">Error loading view.</p>`;
  }
}

function getRoute() {
  const hash = location.hash.replace("#/", "").trim();
  return hash === "" ? "home" : hash;
}

/* Exported — app.js awaits this before rendering panels */
export async function handleRoute() {
  const route = getRoute();
  await loadView(route);
}
