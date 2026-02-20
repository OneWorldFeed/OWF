/**
 * OWF | One World Feed
 * modules/settings/settings.js — Settings page module (theme, motion, etc.).
 */

import { setTheme, getTheme, applyTheme } from '../global/global.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const VALID_THEMES = ['dark', 'light', 'winter', 'autumn', 'summer', 'spring'];
const MOTION_KEY   = 'owf-reduced-motion';
const CONTRAST_KEY = 'owf-high-contrast';

// ── Persistence helpers ───────────────────────────────────────────────────────

function _readBool(key, defaultVal = false) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val === 'true' : defaultVal;
  } catch {
    return defaultVal;
  }
}

function _writeBool(key, value) {
  try { localStorage.setItem(key, String(value)); } catch { /* storage unavailable */ }
}

// ── Apply settings ────────────────────────────────────────────────────────────

/**
 * Read stored preferences and apply them to the document.
 */
export function applySettings() {
  const theme        = getTheme();
  const reducedMotion = _readBool(MOTION_KEY);
  const highContrast  = _readBool(CONTRAST_KEY);

  applyTheme(theme);
  document.documentElement.dataset.reducedMotion = String(reducedMotion);
  document.documentElement.dataset.highContrast  = String(highContrast);
}

// ── Sync form to stored values ────────────────────────────────────────────────

function _syncFormToStorage() {
  const theme = getTheme();

  // Theme radio buttons
  document.querySelectorAll('[name="setting-theme"]').forEach((radio) => {
    radio.checked = radio.value === theme;
  });

  // Theme select (if present)
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) themeSelect.value = theme;

  // Toggle switches
  const motionToggle = document.getElementById('setting-reduce-motion');
  if (motionToggle) motionToggle.checked = _readBool(MOTION_KEY);

  const contrastToggle = document.getElementById('setting-high-contrast');
  if (contrastToggle) contrastToggle.checked = _readBool(CONTRAST_KEY);
}

// ── Event wiring ──────────────────────────────────────────────────────────────

function _setupThemeControls() {
  // Handle radio buttons for theme
  document.querySelectorAll('[name="setting-theme"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const val = e.target.value;
      if (VALID_THEMES.includes(val)) setTheme(val);
    });
  });

  // Handle a <select> for theme
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (VALID_THEMES.includes(val)) setTheme(val);
    });
  }

  // Delegate clicks on data-theme-pick buttons (e.g. swatch cards)
  document.addEventListener('click', (e) => {
    const swatch = e.target.closest('[data-theme-pick]');
    if (!swatch) return;
    const val = swatch.dataset.themePick;
    if (VALID_THEMES.includes(val)) {
      setTheme(val);
      // Update active class on swatches
      document.querySelectorAll('[data-theme-pick]').forEach((el) => {
        el.classList.toggle('theme-swatch--active', el.dataset.themePick === val);
      });
    }
  });
}

function _setupMotionControls() {
  const toggle = document.getElementById('setting-reduce-motion');
  if (!toggle) return;
  toggle.addEventListener('change', (e) => {
    _writeBool(MOTION_KEY, e.target.checked);
    document.documentElement.dataset.reducedMotion = String(e.target.checked);
  });
}

function _setupContrastControls() {
  const toggle = document.getElementById('setting-high-contrast');
  if (!toggle) return;
  toggle.addEventListener('change', (e) => {
    _writeBool(CONTRAST_KEY, e.target.checked);
    document.documentElement.dataset.highContrast = String(e.target.checked);
  });
}

// ── Settings nav (sidebar section anchors) ────────────────────────────────────

function _setupSettingsNav() {
  const nav = document.querySelector('.settings-nav');
  if (!nav) return;

  nav.addEventListener('click', (e) => {
    const link = e.target.closest('.settings-nav-link');
    if (!link) return;

    nav.querySelectorAll('.settings-nav-link').forEach((l) => {
      l.classList.remove('settings-nav-link--active');
      l.removeAttribute('aria-current');
    });
    link.classList.add('settings-nav-link--active');
    link.setAttribute('aria-current', 'true');
  });
}

// ── init ──────────────────────────────────────────────────────────────────────

/**
 * Initialise the settings page.
 */
export async function init() {
  applySettings();
  _syncFormToStorage();
  _setupThemeControls();
  _setupMotionControls();
  _setupContrastControls();
  _setupSettingsNav();
  console.info('[OWF:settings] Initialised.');
}

export default { init, applySettings };
