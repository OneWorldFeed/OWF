/**
 * OWF Navigation — Canonical Default Import
 * Uses the router default export.
 */

import router from "../router/router.js";

export function initNav() {
  const navLinks = document.querySelectorAll("[data-nav]");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-nav");
      const path = router.routes[target];

      if (path) {
        router.navigate(path);
      }
    });
  });
}