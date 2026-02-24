/**
 * OWF Router — Canonical Default Export
 * Handles page navigation and route initialization.
 */

const routes = {
  home: "/",
  profile: "/profile",
  settings: "/settings",
  discover: "/discover",
  podcasts: "/podcasts",
  live: "/live",
  ai: "/ai",
  news: "/news",
  music: "/music",
  social: "/social"
};

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
}

function initRouter() {
  window.addEventListener("popstate", () => {
    // Page-level modules listen for this event
  });
}

const router = {
  routes,
  navigate,
  initRouter
};

export default router;