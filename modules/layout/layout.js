/* ============================================================
   OWF LAYOUT ENGINE — PHASE 4.4.4
   Creates the structural containers for the 12‑column grid
   ============================================================ */

export function mountLayout() {
  const main = document.querySelector("#main");
  if (!main) return;

  // Prevent duplicate injection
  if (main.dataset.layoutMounted === "true") return;
  main.dataset.layoutMounted = "true";

  main.innerHTML = `
    <div id="mood-bar"></div>
    <section id="feed"></section>
    <aside id="right-panel"></aside>
  `;
}

function hydrateLayout() {
  const main = document.querySelector("#main");

  const isHome =
    location.hash === "" ||
    location.hash === "#" ||
    location.hash.startsWith("#/home");

  if (isHome && main) {
    mountLayout();
  }
}

document.addEventListener("DOMContentLoaded", hydrateLayout);
window.addEventListener("hashchange", hydrateLayout);
