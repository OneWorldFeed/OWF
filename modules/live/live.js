/**
 * OWF | One World Feed
 * modules/live/live.js — Live streams page module.
 */

import { loadFeed } from '../feed-loader/feed-loader.js';

const LIVE_REFRESH_MS = 30_000;

// ── Live status badge ─────────────────────────────────────────────────────────

function _renderLiveBadge(container) {
  const badge = document.createElement('div');
  badge.className = 'live-status-badge';
  badge.setAttribute('role', 'status');
  badge.setAttribute('aria-live', 'polite');

  const dot = document.createElement('span');
  dot.className = 'live-dot';
  dot.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.textContent = 'Live now';

  badge.appendChild(dot);
  badge.appendChild(label);
  container.prepend(badge);
}

// ── Live counter ──────────────────────────────────────────────────────────────

function _updateLiveCount() {
  const countEl = document.getElementById('live-stream-count');
  if (!countEl) return;
  // Simulate live viewer count fluctuation
  const base   = 1_200 + Math.floor(Math.random() * 800);
  countEl.textContent = `${base.toLocaleString()} watching`;
}

// ── Periodic refresh ──────────────────────────────────────────────────────────

let _liveTimer = null;

function _startLiveRefresh() {
  _liveTimer = setInterval(async () => {
    _updateLiveCount();
    await loadFeed('live');
  }, LIVE_REFRESH_MS);
}

// ── init ──────────────────────────────────────────────────────────────────────

export async function init() {
  await loadFeed('live');

  // Inject live badge into the view header if present
  const header = document.querySelector('.view-live .view-section-header')
    ?? document.querySelector('#view-live');
  if (header) _renderLiveBadge(header);

  _updateLiveCount();
  _startLiveRefresh();

  // Clean up timer when navigating away
  document.addEventListener('owf:route-leave', () => {
    clearInterval(_liveTimer);
    _liveTimer = null;
  }, { once: true });

  console.info('[OWF:live] Initialised.');
}

export default { init };
