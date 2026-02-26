import { routes } from "./routes.js";

export async function loadView(viewName) {
  const path = routes[viewName];

  if (!path) {
    console.error("Route not found:", viewName);
    return;
  }

  try {
    const response = await fetch(path);
    const html = await response.text();
    document.getElementById("app").innerHTML = html;
  } catch (err) {
    console.error("Error loading view:", err);
  }
}

export function navigate(viewName) {
  loadView(viewName);
  window.history.pushState({ view: viewName }, "", `#${viewName}`);
}

export function initRouter() {
  const defaultView = "home";

  // Load initial view
  const hash = window.location.hash.replace("#", "");
  const initialView = hash || defaultView;
  loadView(initialView);

  // Handle back/forward navigation
  window.onpopstate = (event) => {
    const view = event.state?.view || defaultView;
    loadView(view);
  };
}
