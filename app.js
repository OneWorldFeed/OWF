/* ============================================================
   OWF APPLICATION ENTRY — PHASE 4.4.4
   Boots global modules, router, layout, feed, right panel
   ============================================================ */

/* ---------------------------------------------
   Global modules (always loaded)
--------------------------------------------- */
import "./modules/global/global.js";
import "./modules/router/router.js";
import "./modules/nav/nav.js";

/* ---------------------------------------------
   Layout engine (creates #feed, #right-panel, #mood-bar)
--------------------------------------------- */
import "./modules/layout/layout.js";

/* ---------------------------------------------
   UI modules (loaded when their containers exist)
--------------------------------------------- */
import { renderRightPanel } from "./modules/right-panel/right-panel.js";
import { loadInitialFeed } from "./modules/feed-loader/feed-loader.js";

/* ---------------------------------------------
   Boot sequence
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  const hydrate = () => {
    const feed = document.querySelector("#feed");
    const rightPanel =
      document.querySelector("#right-panel") ||
      document.querySelector("#global-moments");

    if (feed) {
      loadInitialFeed();
    }

    if (rightPanel) {
      renderRightPanel();
    }
  };

  // Hydrate immediately on first load
  hydrate();

  // Hydrate again whenever the router changes views
  window.addEventListener("hashchange", hydrate);
});
