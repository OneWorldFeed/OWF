/* ============================================================
   OWF ROUTER — PHASE 4.4.4 (FINAL STATIC LAYOUT VERSION)
   Loads views into <section id="owf-page">
   ============================================================ */

const routes = {
  home: "/views/home.html",
  discover: "/views/discover.html",
  news: "/views/news.html",
  live: "/views/live.html",
  music: "/views/music.html",
  podcasts: "/views/podcasts.html",
  social: "/views/social.html",
  dm: "/views/dm.html",
  ai: "/views/ai.html",
  profile: "/views/profile.html",
  settings: "/views/settings.html",
  auth: "/views/auth.html"
};

/* ------------------------------------------------------------
   Load a view into #owf-page
------------------------------------------------------------ */
async function loadView(route) {
  const mount = document.querySelector("#owf-page");
  if (!mount) return;

  const file = routes[route] || routes.home;

  try {
    const response = await fetch(file);
    const html = await response.text();
    mount.innerHTML = html;

    // First hydration event
    window.dispatchEvent(new CustomEvent("owf:view-loaded"));

    // Second hydration event (DOM fully stable)
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("owf:view-ready"));
    });

  } catch (err) {
    console.error("Router error:", err);
    mount.innerHTML = `<p style="padding:20px;">Error loading view.</p>`;
  }
}

/* ------------------------------------------------------------
   Normalize hash route
------------------------------------------------------------ */
function getRoute() {
  const hash = location.hash.replace("#/", "").trim();
  return hash === "" ? "home" : hash;
}

/* ------------------------------------------------------------
   Handle route changes
------------------------------------------------------------ */
async function handleRoute() {
  const route = getRoute();
  await loadView(route);
}

/* ------------------------------------------------------------
   Boot router
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("hashchange", handleRoute);