/**
 * OWF | One World Feed
 * modules/home/home.js — Home page module.
 */

import { loadFeed } from '../feed-loader/feed-loader.js';

// ── Greeting helper ───────────────────────────────────────────────────────────

function _getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function _formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ── Tab switching ─────────────────────────────────────────────────────────────

function _setupTabs() {
  const tabList = document.querySelector('.feed-tabs-list');
  if (!tabList) return;

  tabList.addEventListener('click', async (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;

    // Update aria-selected on all tabs
    tabList.querySelectorAll('[role="tab"]').forEach((t) => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('feed-tab--active');
    });
    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('feed-tab--active');

    const filter = tab.dataset.tab || 'all';
    // Normalise 'podcasts' tab to the feed type 'podcast'
    const feedFilter = filter === 'podcasts' ? 'podcast' : filter;
    await loadFeed(feedFilter);
  });
}

// ── Greeting ──────────────────────────────────────────────────────────────────

function _initGreeting() {
  const todEl = document.getElementById('time-of-day');
  if (todEl) todEl.textContent = _getTimeOfDay();

  const dateEl = document.getElementById('current-date');
  if (dateEl) dateEl.textContent = _formatDate();
}

// ── init ──────────────────────────────────────────────────────────────────────

/**
 * Initialise the home page. Called by the router after the home view loads.
 */
export async function init() {
  _initGreeting();
  _setupTabs();
  await loadFeed('all');
  console.info('[OWF:home] Initialised.');
}

export default { init };
