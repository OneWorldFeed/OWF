/**
 * OWF | One World Feed
 * modules/router/router.js – Client-side History API router.
 */

import { loadView } from '../global/view-loader.js';

const viewModules = {
  home: () => import('../home/home.js'),
  profile: () => import('../profile/profile.js'),
  settings: () => import('../settings/settings.js'),
  discover: () => import('../discover/discover.js'),
  podcasts: () => import('../podcasts/podcasts.js'),
  live: () => import('../live/live.js'),
  ai: () => import('../ai/ai.js'),
  news: () => import('../news/news.js'),
  music: () => import('../music/music.js'),
  social: () => import('../social/social.js'),
  badges: () => import('../badges/badges.js'),
};

let current = {
  name: null,
  instance: null,
};

export async function navigateTo(viewName, { root, state, pushState = true }) {
  if (!viewModules[viewName]) {
    console.warn(`Router: No module registered for view "${viewName}"`);
    return;
  }

  if (pushState) {
    history.pushState({ view: viewName }, '', `/${viewName}`);
  }

  if (current.instance && typeof current.instance.destroy === 'function') {
    current.instance.destroy();
  }

  const module = await viewModules[viewName]();
  const view = module.default || module;

  const html = await loadView(viewName);
  root.innerHTML = html;

  if (typeof view.init === 'function') {
    await view.init({ root, state });
  }

  current = { name: viewName, instance: view };
}

export function initRouter({ root, state }) {
  const initialView = window.location.pathname.replace('/', '') || 'home';

  navigateTo(initialView, { root, state, pushState: false });

  window.addEventListener('popstate', (e) => {
    const view = e.state?.view || 'home';
    navigateTo(view, { root, state, pushState: false });
  });
}
