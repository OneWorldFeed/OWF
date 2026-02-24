import { router } from "../router/router.js";

export function initNav() {
  function attachNavListeners() {
    const navLinks = document.querySelectorAll("[data-view]");

    if (!navLinks.length) {
      console.warn("[OWF:nav] No nav links found.");
      return;
    }

    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const target = link.getAttribute("data-view");
        const path = router.routes[target];

        if (!path) {
          console.warn(`[OWF:nav] No route found for view: ${target}`);
          return;
        }

        router.navigate(path);
      });
    });

    console.info("[OWF:nav] Navigation listeners attached.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachNavListeners);
  } else {
    attachNavListeners();
  }
}