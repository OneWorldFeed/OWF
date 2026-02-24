/**
 * OWF | One World Feed
 * modules/nav/nav.js
 * Connects left navigation to the router.
 */

import { router } from "../router/router.js";

export function initNav() {
    const nav = document.getElementById("left-nav");
    if (!nav) {
        console.error("[OWF:nav] Navigation element not found.");
        return;
    }

    nav.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-view]");
        if (!btn) return;

        const view = btn.getAttribute("data-view");
        router.navigate(view);
    });

    console.info("[OWF:nav] Initialised.");
}

initNav();
