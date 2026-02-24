/**
 * OWF | One World Feed
 * public/modules/router/router.js
 *
 * SPA Router — loads views + their JS modules.
 */

export const Router = {
  currentView: null,

  init() {
    console.info("[OWF:router] Initialised.");

    // Handle back/forward navigation
    window.addEventListener("popstate", () => {
      const view = this.getViewFromURL();
      this.navigate(view, false);
    });

    // Initial load
    const initialView = this.getViewFromURL();
    this.navigate(initialView, false);
  },

  getViewFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("view") || "home";
  },

  async navigate(viewName, pushState = true) {
    if (!viewName) return;

    console.info(`[OWF:router] Navigating to: ${viewName}`);

    if (pushState) {
      history.pushState({}, "", `/?view=${viewName}`);
    }

    await this.loadViewHTML(viewName);
    await this.loadViewModule(viewName);

    this.currentView = viewName;
  },

  async loadViewHTML(viewName) {
    try {
      const res = await fetch(`/views/${viewName}.html`);
      const html = await res.text();

      const container = document.getElementById("main-content");
      container.innerHTML = html;

      console.info(`[OWF] Loaded view: ${viewName}`);
    } catch (err) {
      console.warn(`[OWF:router] Failed to load HTML for ${viewName}`, err);
    }
  },

  async loadViewModule(viewName) {
    try {
      // ⭐ FINAL, CORRECT, VERCEL-SAFE PATH
      const modulePath = `/modules/${viewName}/${viewName}.js`;

      const module = await import(modulePath);

      if (module && typeof module.render === "function") {
        module.render();
        console.info(`[OWF:${viewName}] Rendered.`);
      }
    } catch (err) {
      console.warn(`[OWF:${viewName}] Failed to load module.`, err);
    }
  }
};

Router.init();
