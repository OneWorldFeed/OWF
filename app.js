/* ============================================================
   OWF APPLICATION ENTRY — PHASE 4.4.4 (STABLE + UPDATED)
   Boots global modules, router, layout, feed, right panel
   ============================================================ */

/* ---------------------------------------------
   Global modules (always loaded)
--------------------------------------------- */
import "/modules/global/global.js";
import "/modules/router/router.js";
import "/modules/nav/nav.js";

/* ---------------------------------------------
   Layout engine
--------------------------------------------- */
import "/modules/layout/layout.js";

/* ---------------------------------------------
   UI modules (hydrated only when containers exist)
--------------------------------------------- */
import { renderRightPanel } from "/modules/right-panel/right-panel.js";
import { loadInitialFeed }  from "/modules/feed-loader/feed-loader.js";
import { initLeftPanel }    from "/components/left-panel/left-panel.js";

/* ---------------------------------------------
   Boot sequence
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initLeftPanel(); // mount radio, glow, signals into static HTML
});

window.addEventListener("owf:view-loaded", () => {

  const feed = document.querySelector("#feed");
  if (feed) {
    loadInitialFeed();
  }

  const rightPanel = document.querySelector(".owf-right-panel");
  if (rightPanel) {
    renderRightPanel();
  }
});
