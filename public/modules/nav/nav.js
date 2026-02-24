import router from "../router/router.js";

export function initNav() {
  function attachNavListeners() {
    const navLinks = document.querySelectorAll("[data-nav]");

    if (!navLinks.length) return;

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachNavListeners);
  } else {
    attachNavListeners();
  }
}