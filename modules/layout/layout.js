/* ============================================================
   OWF LAYOUT ENGINE — PHASE 4.4.4 (STATIC LAYOUT VERSION)
   Layout is now fully defined in index.html.
   This file remains only for future global layout behaviors.
   ============================================================ */

export function initLayout() {
  // Reserved for future global layout behaviors (theme switching, resizing, etc.)
  // No dynamic DOM injection is needed anymore.
  window.dispatchEvent(new Event("owf:layout-ready"));
}

// Run once on startup
document.addEventListener("DOMContentLoaded", initLayout);