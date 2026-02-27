/* ============================================================
   OWF APPLICATION ENTRY — PHASE 4.4.4
   Boots global modules, router, layout, feed, right panel
   ============================================================ */

/* ---------------------------------------------
   Global modules (always loaded)
--------------------------------------------- */
import "./assets/js/modules/global.js";
import "./assets/js/modules/router.js";
import "./assets/js/modules/nav.js";

/* ---------------------------------------------
   UI modules (loaded when their containers exist)
--------------------------------------------- */
import { renderRightPanel } from "./assets/js/modules/right-panel.js";
import { loadInitialFeed } from "./assets/js/modules/feed-loader.js";

/* ---------------------------------------------
   Boot sequence
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Router loads the correct view into <main id="main">
  // After the view loads, we hydrate the UI.

  const hydrate = () => {
    const feed = document.querySelector("#feed");
    const rightPanel = document.querySelector("#right-panel") || document.querySelector("#global-moments");

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
