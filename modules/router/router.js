/**
 * OWF | One World Feed
 * modules/router/router.js
 * Canonical SPA Router (Vercel‑safe)
 */

import { loadView } from "../global/view-loader.js";

export class Router {
    constructor() {
        this.currentView = null;

        // Handle browser back/forward
        window.addEventListener("popstate", () => {
            const view = this.getViewFromURL();
            this.navigate(view, { push: false });
        });

        console.info("[OWF:router] Initialised.");
    }

    // Extract view name from URL (/?view=home)
    getViewFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("view") || "home";
    }

    // Main navigation method
    async navigate(viewName, { push = true } = {}) {
        if (!viewName) viewName = "home";

        // Prevent redundant reloads
        if (this.currentView === viewName) return;

        this.currentView = viewName;

        if (push) {
            history.pushState({}, "", `/?view=${viewName}`);
        }

        console.info(`[OWF:router] Navigating to: ${viewName}`);

        // Load HTML from /public/views/
        const html = await loadView(viewName);

        if (!html) {
            console.error(`[OWF:router] Failed to load view: ${viewName}`);
            return;
        }

        // Inject into main content area
        const container = document.getElementById("main-content");
        if (container) {
            container.innerHTML = html;
        }

        // Initialize the view’s JS module
        this.initViewModule(viewName);
    }

    // Dynamically import JS module for the view
    async initViewModule(viewName) {
        try {
            const modulePath = `/modules/${viewName}/${viewName}.js`;

            const module = await import(modulePath);

            if (module && typeof module.init === "function") {
                module.init();
                console.info(`[OWF:${viewName}] Initialised.`);
            }
        } catch (err) {
            console.warn(`[OWF:${viewName}] No JS module found or failed to load.`, err);
        }
    }
}

// Auto‑boot router
export const router = new Router();
router.navigate(router.getViewFromURL());
