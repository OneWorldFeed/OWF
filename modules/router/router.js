/**
 * OWF | One World Feed
 * modules/router/router.js — Client-side History API router.
 */

import { eventBus } from '../global/global.js';

// ── Route definitions ─────────────────────────────────────────────────────────

/** Map of path → view HTML file name (relative to /components/views/). */
const ROUTE_MAP = {
  '/':          'home',
  '/profile':   'profile',
  '/social':    'social',
  '/settings':  'settings',
  '/discover':  'discover',
  '/podcasts':  'podcasts',
  '/live':      'live',
  '/ai':        'ai',
  '/news':      'news',
  '/music':     'music',
};

const DEFAULT_ROUTE = '/';
const VIEW_BASE_PATH = '/components/views/';

// ── View cache ────────────────────────────────────────────────────────────────

/** @type {Map<string, string>} - path → raw HTML string */
const _viewCache = new Map();

// ── Router class ──────────────────────────────────────────────────────────────

export class Router {
  constructor() {
    this._currentPath = DEFAULT_ROUTE;
    this._container   = null;
    this._handlers    = new Map(); // path → callback
  }

  /**
   * Register a per-route activation callback.
   * @param {string} path
   * @param {(params?: object) => void | Promise<void>} handler
   */
  register(path, handler) {
    this._handlers.set(path, handler);
  }

  /**
   * Navigate to a path using pushState.
   * @param {string} path
   * @param {boolean} [replace=false] - use replaceState instead of pushState
   */
  navigate(path, replace = false) {
    const resolved = this._resolvePath(path);
    if (resolved === this._currentPath) return;
    if (replace) {
      history.replaceState({ path: resolved }, '', resolved);
    } else {
      history.pushState({ path: resolved }, '', resolved);
    }
    this._handleRoute(resolved);
  }

  /**
   * Initialise the router: wire popstate, intercept link clicks, load current route.
   * @param {HTMLElement} container - element where view HTML is rendered
   */
  init(container) {
    this._container = container || document.getElementById('main-content');

    // Handle browser back/forward navigation
    window.addEventListener('popstate', (e) => {
      const path = e.state?.path ?? this._resolvePath(window.location.pathname);
      this._handleRoute(path);
    });

    // Intercept clicks on hash-based nav links (e.g. href="#/discover")
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;

      // Handle hash-prefixed SPA routes: #/path or #path
      if (href.startsWith('#/') || href.startsWith('#')) {
        e.preventDefault();
        const path = href.startsWith('#/') ? href.slice(1) : href.slice(1) || '/';
        this.navigate(path);
        return;
      }

      // Handle plain relative SPA routes that match our route map
      if (ROUTE_MAP[href]) {
        e.preventDefault();
        this.navigate(href);
      }
    });

    // Load the initial route
    const initial = this._resolvePath(window.location.pathname);
    history.replaceState({ path: initial }, '', initial);
    this._handleRoute(initial);
  }

  /** @returns {string} The currently active path. */
  get currentPath() {
    return this._currentPath;
  }

  // ── Private ──────────────────────────────────────────────────────────────────

  /**
   * Normalise a path string to a known route or the default route.
   * @param {string} raw
   * @returns {string}
   */
  _resolvePath(raw) {
    const clean = (raw || '/').split('?')[0].split('#')[0];
    return ROUTE_MAP[clean] ? clean : DEFAULT_ROUTE;
  }

  /**
   * Load and render the view for the given path.
   * @param {string} path
   */
  async _handleRoute(path) {
    const viewName = ROUTE_MAP[path] ?? ROUTE_MAP[DEFAULT_ROUTE];
    this._currentPath = path;

    eventBus.emit('route:change', { path, viewName });

    // Update document title
    document.title = `OWF | ${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`;

    await this._loadView(viewName);

    // Run the registered per-route handler if present
    const handler = this._handlers.get(path);
    if (handler) {
      try {
        await handler({ path, viewName });
      } catch (err) {
        console.error(`[Router] Handler error for "${path}":`, err);
      }
    }

    // Announce route change for screen readers
    this._announceRouteChange(viewName);
  }

  /**
   * Fetch and inject the view HTML into the container.
   * The HTML is loaded from a trusted static file path — not user input.
   * @param {string} viewName
   */
  async _loadView(viewName) {
    if (!this._container) return;

    // Show loading state
    this._container.setAttribute('aria-busy', 'true');

    try {
      let html = _viewCache.get(viewName);

      if (!html) {
        const res = await fetch(`${VIEW_BASE_PATH}${viewName}.html`);
        if (!res.ok) throw new Error(`Failed to load view "${viewName}" (${res.status})`);
        html = await res.text();
        _viewCache.set(viewName, html);
      }

      // Inject from a trusted static source — this is safe as views are
      // developer-authored HTML files, not user-supplied content.
      this._container.innerHTML = html;
    } catch (err) {
      console.error('[Router] View load error:', err);
      this._renderErrorView(viewName, err);
    } finally {
      this._container.setAttribute('aria-busy', 'false');
      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  /**
   * Render a simple error placeholder when a view fails to load.
   * Uses DOM manipulation — no user input interpolated.
   * @param {string} viewName
   * @param {Error} err
   */
  _renderErrorView(viewName, err) {
    if (!this._container) return;
    this._container.innerHTML = '';
    const section = document.createElement('section');
    section.className = 'view view-error';
    section.setAttribute('aria-label', 'Page error');

    const heading = document.createElement('h1');
    heading.textContent = 'Page not available';

    const msg = document.createElement('p');
    msg.textContent = `The "${viewName}" view could not be loaded. Please try again.`;

    const detail = document.createElement('pre');
    detail.className = 'error-detail';
    detail.textContent = err?.message ?? String(err);

    section.appendChild(heading);
    section.appendChild(msg);
    section.appendChild(detail);
    this._container.appendChild(section);
  }

  /**
   * Use an aria-live region to announce route changes to screen readers.
   * @param {string} viewName
   */
  _announceRouteChange(viewName) {
    let announcer = document.getElementById('owf-route-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'owf-route-announcer';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    // Brief delay lets the DOM settle before announcing
    setTimeout(() => {
      announcer.textContent = `Navigated to ${viewName} page`;
    }, 100);
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────

export const router = new Router();

// ── init (app.js compat) ──────────────────────────────────────────────────────

/**
 * Initialise the router. Called by app.js.
 * @param {Record<string, unknown>} [appState]
 */
export async function initRouter(appState) {
  const container = document.getElementById('main-content');
  router.init(container);
  console.info('[OWF:router] Initialised.');
}

export default router;
