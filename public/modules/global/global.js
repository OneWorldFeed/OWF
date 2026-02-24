/**
 * OWF | One World Feed
 * modules/global/global.js — Global utilities: EventBus, AppState, theme, a11y.
 */

// ── Sanitizer ─────────────────────────────────────────────────────────────────
const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };

/**
 * Escape HTML special characters to prevent XSS when text must be inserted
 * into an attribute or title. Prefer textContent over this wherever possible.
 * @param {unknown} value
 * @returns {string}
 */
export function sanitize(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
}

/**
 * Validate that a string is a safe http/https URL.
 * Returns the URL string if safe, or an empty string otherwise.
 * @param {string} url
 * @returns {string}
 */
export function safeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url, window.location.href);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') ? url : '';
  } catch {
    return '';
  }
}

// ── EventBus ──────────────────────────────────────────────────────────────────

export class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._listeners = new Map();
  }

  /**
   * Subscribe to an event.
   * @param {string} event
   * @param {Function} handler
   */
  on(event, handler) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(handler);
  }

  /**
   * Unsubscribe a handler from an event.
   * @param {string} event
   * @param {Function} handler
   */
  off(event, handler) {
    this._listeners.get(event)?.delete(handler);
  }

  /**
   * Emit an event with optional data payload.
   * @param {string} event
   * @param {unknown} [data]
   */
  emit(event, data) {
    this._listeners.get(event)?.forEach((handler) => {
      try {
        handler(data);
      } catch (err) {
        console.error(`[EventBus] Error in handler for "${event}":`, err);
      }
    });
  }
}

// ── AppState ──────────────────────────────────────────────────────────────────

export class AppState {
  /**
   * @param {Record<string, unknown>} initial
   */
  constructor(initial = {}) {
    this._state = { ...initial };
    /** @type {Map<string, Set<Function>>} */
    this._subscribers = new Map();
  }

  /**
   * Read a value from state.
   * @param {string} key
   * @returns {unknown}
   */
  getState(key) {
    return this._state[key];
  }

  /**
   * Write a value to state and notify subscribers.
   * @param {string} key
   * @param {unknown} value
   */
  setState(key, value) {
    const prev = this._state[key];
    if (prev === value) return;
    this._state[key] = value;
    this._subscribers.get(key)?.forEach((cb) => {
      try { cb(value, prev); } catch (err) {
        console.error(`[AppState] Error in subscriber for "${key}":`, err);
      }
    });
  }

  /**
   * Subscribe to state changes for a specific key.
   * Returns an unsubscribe function.
   * @param {string} key
   * @param {Function} handler
   * @returns {() => void}
   */
  subscribe(key, handler) {
    if (!this._subscribers.has(key)) {
      this._subscribers.set(key, new Set());
    }
    this._subscribers.get(key).add(handler);
    return () => this._subscribers.get(key)?.delete(handler);
  }
}

// ── Theme utilities ───────────────────────────────────────────────────────────

const VALID_THEMES = new Set(['dark', 'light', 'winter', 'autumn', 'summer', 'spring']);
const THEME_KEY = 'owf-theme';

/**
 * Apply a theme to <body> by setting data-theme and the theme-* class.
 * @param {string} theme
 */
export function applyTheme(theme) {
  const safeTheme = VALID_THEMES.has(theme) ? theme : 'dark';
  document.documentElement.dataset.theme = safeTheme;
  document.body.dataset.theme = safeTheme;
  document.body.className = document.body.className
    .replace(/\btheme-\S+/g, '')
    .trim();
  document.body.classList.add(`theme-${safeTheme}`);
}

/**
 * Persist a theme choice and apply it immediately.
 * @param {string} theme
 */
export function setTheme(theme) {
  const safeTheme = VALID_THEMES.has(theme) ? theme : 'dark';
  try { localStorage.setItem(THEME_KEY, safeTheme); } catch { /* storage unavailable */ }
  applyTheme(safeTheme);
}

/**
 * Read the stored theme preference, falling back to 'dark'.
 * @returns {string}
 */
export function getTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return VALID_THEMES.has(stored) ? stored : 'dark';
  } catch {
    return 'dark';
  }
}

// ── Accessibility preferences ─────────────────────────────────────────────────

/**
 * Apply data attributes for reduced-motion and high-contrast preferences
 * so CSS can respond to them independently of the theme.
 */
function initA11y() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersHighContrast  = window.matchMedia('(prefers-contrast: more)').matches;
  const storedMotion   = localStorage.getItem('owf-reduced-motion');
  const storedContrast = localStorage.getItem('owf-high-contrast');

  const reducedMotion = storedMotion !== null ? storedMotion === 'true' : prefersReducedMotion;
  const highContrast  = storedContrast !== null ? storedContrast === 'true' : prefersHighContrast;

  document.documentElement.dataset.reducedMotion = String(reducedMotion);
  document.documentElement.dataset.highContrast  = String(highContrast);
}

// ── Singleton exports ─────────────────────────────────────────────────────────

export const eventBus = new EventBus();

export const appState = new AppState({
  theme:       getTheme(),
  mood:        (() => { try { return localStorage.getItem('owf-mood') || 'neutral'; } catch { return 'neutral'; } })(),
  region:      (() => { try { return localStorage.getItem('owf-region') || 'global'; } catch { return 'global'; } })(),
  feedPage:    0,
  feedLoading: false,
  route:       '/',
});

// ── init ──────────────────────────────────────────────────────────────────────

/**
 * Initialise global utilities. Called once at app startup.
 * @param {Record<string, unknown>} [externalState] - Optional state from app.js
 */
export async function initGlobal(externalState) {
  // Merge any externally constructed state
  if (externalState && typeof externalState === 'object') {
    for (const [key, value] of Object.entries(externalState)) {
      appState.setState(key, value);
    }
  }

  // Apply persisted theme
  const theme = getTheme();
  appState.setState('theme', theme);
  applyTheme(theme);

  // Apply accessibility preferences
  initA11y();

  // Keep AppState in sync when theme changes
  appState.subscribe('theme', (newTheme) => applyTheme(newTheme));

  // Global error boundary
  window.addEventListener('unhandledrejection', (e) => {
    console.error('[OWF] Unhandled promise rejection:', e.reason);
  });

  console.info('[OWF:global] Initialised.');
}

export default { eventBus, appState, sanitize, safeUrl, setTheme, getTheme, applyTheme, initGlobal };
