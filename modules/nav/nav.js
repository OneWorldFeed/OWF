/**
 * OWF | One World Feed
 * modules/nav/nav.js — Navigation sidebar renderer and route-active tracker.
 */

import { eventBus, sanitize } from '../global/global.js';
import { router } from '../router/router.js';

// ── Route definitions for nav ─────────────────────────────────────────────────

const NAV_ROUTES = [
  { path: '/',          label: 'Home',     icon: '/assets/icons/home.svg',    iconFallback: '🏠' },
  { path: '/discover',  label: 'Discover', icon: '/assets/icons/discover.svg', iconFallback: '🔭' },
  { path: '/news',      label: 'News',     icon: '/assets/icons/news.svg',    iconFallback: '📰' },
  { path: '/social',    label: 'Social',   icon: '/assets/icons/social.svg',  iconFallback: '💬' },
  { path: '/music',     label: 'Music',    icon: '/assets/icons/music.svg',   iconFallback: '🎵' },
  { path: '/podcasts',  label: 'Podcasts', icon: '/assets/icons/podcast.svg', iconFallback: '🎙️' },
  { path: '/live',      label: 'Live',     icon: '/assets/icons/live.svg',    iconFallback: '🔴' },
  { path: '/ai',        label: 'AI',       icon: '/assets/icons/ai.svg',      iconFallback: '🤖' },
  { path: '/profile',   label: 'Profile',  icon: '/assets/icons/profile.svg', iconFallback: '👤' },
  { path: '/settings',  label: 'Settings', icon: '/assets/icons/settings.svg', iconFallback: '⚙️' },
];

// ── Module state ──────────────────────────────────────────────────────────────

let _navList = null;
let _currentPath = '/';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Load an SVG icon via fetch and return the sanitised SVG text, or null on failure.
 * @param {string} iconPath
 * @returns {Promise<string|null>}
 */
async function loadSvgIcon(iconPath) {
  try {
    const res = await fetch(iconPath);
    if (!res.ok) return null;
    const text = await res.text();
    // Only accept responses that look like SVG
    if (!text.trim().startsWith('<svg') && !text.includes('<svg ')) return null;
    return text;
  } catch {
    return null;
  }
}

// ── Render ────────────────────────────────────────────────────────────────────

/**
 * Build and insert nav items into #nav-links.
 * Uses DOM creation — no user input is interpolated.
 */
export async function render() {
  _navList = document.getElementById('nav-links');
  if (!_navList) return;

  _navList.innerHTML = '';
  const fragment = document.createDocumentFragment();

  for (const route of NAV_ROUTES) {
    const li = document.createElement('li');
    li.setAttribute('role', 'listitem');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-item';
    btn.dataset.path = route.path;
    btn.setAttribute('aria-label', route.label);

    if (route.path === _currentPath) {
      btn.classList.add('nav-item--active');
      btn.setAttribute('aria-current', 'page');
    }

    // Icon container
    const iconEl = document.createElement('span');
    iconEl.className = 'nav-icon';
    iconEl.setAttribute('aria-hidden', 'true');

    // Try to load SVG; fall back to text emoji
    const svgText = await loadSvgIcon(route.icon);
    if (svgText) {
      // svgText is from a trusted static asset file, safe to use as innerHTML
      iconEl.innerHTML = svgText;
    } else {
      iconEl.textContent = route.iconFallback;
    }

    // Label
    const labelEl = document.createElement('span');
    labelEl.className = 'nav-label';
    labelEl.textContent = route.label;

    btn.appendChild(iconEl);
    btn.appendChild(labelEl);

    btn.addEventListener('click', () => {
      router.navigate(route.path);
    });

    li.appendChild(btn);
    fragment.appendChild(li);
  }

  _navList.appendChild(fragment);
}

/**
 * Update the active nav item to reflect the given path.
 * @param {string} path
 */
export function setActive(path) {
  _currentPath = path;
  if (!_navList) return;

  _navList.querySelectorAll('.nav-item').forEach((btn) => {
    const isActive = btn.dataset.path === path;
    btn.classList.toggle('nav-item--active', isActive);
    if (isActive) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });
}

// ── init ──────────────────────────────────────────────────────────────────────

/**
 * Initialise navigation. Called by app.js.
 * @param {Record<string, unknown>} [appState]
 */
export async function initNav(appState) {
  _currentPath = appState?.route ?? router.currentPath ?? '/';

  await render();

  // Listen for route changes from the router
  eventBus.on('route:change', ({ path }) => {
    setActive(path);
  });

  console.info('[OWF:nav] Initialised.');
}

export default { initNav, render, setActive };
