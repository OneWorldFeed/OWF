/* ============================================================
   OWF APPLICATION ENTRY — PHASE 4.4.4
   ============================================================ */

import "/modules/global/global.js";
import "/modules/nav/nav.js";
import "/modules/layout/layout.js";
import { initLeftPanel }    from "/components/left-panel/left-panel.js";
import { renderRightPanel } from "/modules/right-panel/right-panel.js";
import { loadInitialFeed }  from "/modules/feed-loader/feed-loader.js";

/* ------------------------------------------------------------
   Route loader — fetches view HTML and injects into #owf-page
------------------------------------------------------------ */
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

async function loadView() {
  const hash  = location.hash.replace("#/", "").trim();
  const route = hash || "home";
  const file  = routes[route] || routes.home;
  const mount = document.querySelector("#owf-page");
  if (!mount) return;

  try {
    const res  = await fetch(file);
    const html = await res.text();
    mount.innerHTML = html;
  } catch (err) {
    console.error("Router error:", err);
    mount.innerHTML = `<p style="padding:20px">Error loading view.</p>`;
  }
}

/* ------------------------------------------------------------
   Boot — single DOMContentLoaded, strict order
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", async () => {

  // 1. Static panel features
  initLeftPanel();

  // 2. Load the view — await so DOM is populated before step 3
  await loadView();

  // 3. Now safe to render panels that depend on the view being present
  renderRightPanel();

  if (document.querySelector("#feed")) {
    loadInitialFeed();
  }
});

// Re-run on nav clicks
window.addEventListener("hashchange", async () => {
  await loadView();
  renderRightPanel();
  if (document.querySelector("#feed")) {
    loadInitialFeed();
  }
});
