/**
 * OWF | One World Feed
 * app.js — Root application entry point.
 *
 * Boots all core modules in dependency order and wires up the SPA shell.
 */

import { initGlobal } from './public/modules/global/global.js';
import { initRouter, router } from './public/modules/router/router.js';
import { initNav } from './public/modules/nav/nav.js';
import { initRightPanel } from './public/modules/right-panel/right-panel.js';
import { initFeedLoader } from './public/modules/feed-loader/feed-loader.js';
import { init as initBadges } from './public/modules/badges/badges.js';

/**
 * Application state shared across modules.
 * Treat this as a lightweight store — modules may read and update it
 * via the exported helpers rather than mutating it directly.
 */
const appState = {
  theme: localStorage.getItem('owf-theme') || 'dark',
  mood: localStorage.getItem('owf-mood') || 'neutral',
  region: localStorage.getItem('owf-region') || 'global',
  city: localStorage.getItem('owf-city') || null,
  feedPage: 0,
  feedLoading: false,
  route: '/',
};

/**
 * Apply the stored theme to <body> so the correct CSS variables are active
 * before any module renders.
 */
function applyTheme(theme) {
  document.body.dataset.theme = theme;
  // Remove all existing theme classes then add the current one.
  document.body.className = document.body.className
    .replace(/\btheme-\S+/g, '')
    .trim();
  document.body.classList.add(`theme-${theme}`);
}

/**
 * init — Orchestrates startup of all core modules.
 * Called once the DOM is ready.
 *
 * @returns {Promise<void>}
 */
export async function init() {
  try {
    // 1. Apply persisted theme before any paint.
    applyTheme(appState.theme);

    // 2. Initialise global utilities (error handling, event bus, helpers).
    await initGlobal(appState);

    // 3. Initialise the client-side router and register page module handlers.
    await initRouter(appState);
    _registerRouteHandlers();

    // 4. Render navigation sidebar.
    await initNav(appState);

    // 5. Render right panel (spotlight, trending, cities).
    await initRightPanel(appState);

    // 6. Kick off the initial feed load.
    await initFeedLoader(appState);

    // 7. Initialise badges (awards early-adopter on first visit).
    initBadges();

    // Expose router globally for modules that need programmatic navigation.
    window.__owfRouter = router;

    console.info('[OWF] App initialised successfully.');
  } catch (err) {
    console.error('[OWF] Fatal initialisation error:', err);
    renderErrorScreen(err);
  }
}

/**
 * Register per-route page module handlers with the router.
 * Modules are dynamically imported to keep the initial bundle lean.
 */
function _registerRouteHandlers() {
  const pageModules = {
    '/':         () => import('./public/modules/home/home.js'),
    '/profile':  () => import('./public/modules/profile/profile.js'),
    '/social':   () => import('./public/modules/social/social.js'),
    '/settings': () => import('./public/modules/settings/settings.js'),
    '/discover': () => import('./public/modules/discover/discover.js'),
    '/podcasts': () => import('./public/modules/podcasts/podcasts.js'),
    '/live':     () => import('./public/modules/live/live.js'),
    '/ai':       () => import('./public/modules/ai/ai.js'),
    '/news':     () => import('./public/modules/news/news.js'),
    '/music':    () => import('./public/modules/music/music.js'),
  };

  for (const [path, loader] of Object.entries(pageModules)) {
    router.register(path, async () => {
      const mod = await loader();
      if (typeof mod.init === 'function') await mod.init();
      else if (mod.default?.init) await mod.default.init();
    });
  }
}

/**
 * Render a minimal fallback error screen when boot fails.
 * @param {Error} err
 */
function renderErrorScreen(err) {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                height:100dvh;gap:1rem;padding:2rem;font-family:system-ui,sans-serif;">
      <h1 style="font-size:1.5rem;color:#e74c3c;">OWF failed to load</h1>
      <p style="color:#aaa;max-width:40ch;text-align:center;">
        Something went wrong while starting the application.
        Please refresh the page or check the console for details.
      </p>
      <pre style="font-size:0.75rem;color:#e74c3c;background:#1a1a2e;
                  padding:1rem;border-radius:8px;max-width:60ch;overflow:auto;">
${err?.message ?? String(err)}</pre>
      <button onclick="location.reload()"
              style="padding:0.5rem 1.5rem;background:#4f46e5;color:#fff;
                     border-radius:6px;cursor:pointer;border:none;font-size:1rem;">
        Reload
      </button>
    </div>`;
}

/* ── Boot ────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);
