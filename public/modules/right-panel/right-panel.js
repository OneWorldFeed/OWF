/**
 * OWF | One World Feed
 * modules/right-panel/right-panel.js — Spotlight, trending, and clock widget.
 */

import { sanitize, safeUrl } from '../global/global.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const SPOTLIGHT_URL   = '/data/spotlight.json';
const TAGS_URL        = '/data/tags.json';
const TRENDING_INTERVAL_MS = 60_000; // refresh trending every 60 s

// World cities for the clock widget
const CLOCK_CITIES = [
  { name: 'New York',  tz: 'America/New_York' },
  { name: 'London',    tz: 'Europe/London'    },
  { name: 'Tokyo',     tz: 'Asia/Tokyo'       },
  { name: 'Sydney',    tz: 'Australia/Sydney' },
  { name: 'Lagos',     tz: 'Africa/Lagos'     },
];

// ── State ─────────────────────────────────────────────────────────────────────

let _trendingTimer = null;

// ── Spotlight ─────────────────────────────────────────────────────────────────

/**
 * Fetch spotlight data and render into #spotlight-container.
 */
async function renderSpotlight() {
  const container = document.getElementById('spotlight-container');
  if (!container) return;

  try {
    const res = await fetch(SPOTLIGHT_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data.spotlight) ? data.spotlight : [];

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (const item of items) {
      fragment.appendChild(_buildSpotlightCard(item));
    }

    container.appendChild(fragment);
  } catch (err) {
    console.warn('[right-panel] Spotlight load error:', err);
    container.textContent = 'Spotlight unavailable.';
  }
}

/**
 * Build a spotlight card element. All text set via textContent.
 * @param {object} item
 * @returns {HTMLElement}
 */
function _buildSpotlightCard(item) {
  const card = document.createElement('article');
  card.className = 'spotlight-card';
  if (item.featured) card.classList.add('spotlight-card--featured');

  const imgUrl = safeUrl(item.image || '');
  if (imgUrl) {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = '';
    img.className = 'spotlight-card__image';
    img.loading = 'lazy';
    img.decoding = 'async';
    card.appendChild(img);
  }

  const body = document.createElement('div');
  body.className = 'spotlight-card__body';

  const badge = document.createElement('span');
  badge.className = 'spotlight-card__type';
  badge.textContent = item.type || 'feature';

  const title = document.createElement('h3');
  title.className = 'spotlight-card__title';
  title.textContent = item.title || '';

  const desc = document.createElement('p');
  desc.className = 'spotlight-card__desc';
  desc.textContent = item.description || '';

  body.appendChild(badge);
  body.appendChild(title);
  body.appendChild(desc);
  card.appendChild(body);

  return card;
}

// ── Trending topics ───────────────────────────────────────────────────────────

/**
 * Fetch tags data and render trending topics into #trending-tags.
 */
async function renderTrending() {
  const container = document.getElementById('trending-tags');
  if (!container) return;

  try {
    const res = await fetch(TAGS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const tags = Array.isArray(data.tags) ? data.tags.slice(0, 10) : [];

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    tags.forEach((tag, idx) => {
      fragment.appendChild(_buildTrendingTag(tag, idx + 1));
    });

    container.appendChild(fragment);
  } catch (err) {
    console.warn('[right-panel] Trending load error:', err);
  }
}

/**
 * Build a trending tag pill element.
 * @param {object} tag
 * @param {number} rank
 * @returns {HTMLElement}
 */
function _buildTrendingTag(tag, rank) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'trending-tag';

  const rankEl = document.createElement('span');
  rankEl.className = 'trending-tag__rank';
  rankEl.textContent = String(rank);

  const nameEl = document.createElement('span');
  nameEl.className = 'trending-tag__name';
  nameEl.textContent = `#${tag.name || tag.label || ''}`;

  if (tag.icon) {
    const iconEl = document.createElement('span');
    iconEl.className = 'trending-tag__icon';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.textContent = tag.icon;
    btn.appendChild(iconEl);
  }

  btn.appendChild(rankEl);
  btn.appendChild(nameEl);
  btn.setAttribute('aria-label', `Trending: ${tag.label || tag.name}`);

  return btn;
}

// ── Clock widget ──────────────────────────────────────────────────────────────

/**
 * Render the world-clock widget into #city-list and tick every second.
 */
function renderClock() {
  const container = document.getElementById('city-list');
  if (!container) return;

  container.innerHTML = '';
  const rows = CLOCK_CITIES.map((city) => _buildClockRow(city));
  rows.forEach((row) => container.appendChild(row));

  // Update time every second
  setInterval(() => _tickClock(container), 1000);
}

/**
 * Build an initial clock row for a city.
 * @param {{ name: string, tz: string }} city
 * @returns {HTMLElement}
 */
function _buildClockRow(city) {
  const row = document.createElement('div');
  row.className = 'city-row';
  row.dataset.tz = city.tz;

  const nameEl = document.createElement('span');
  nameEl.className = 'city-row__name';
  nameEl.textContent = city.name;

  const timeEl = document.createElement('time');
  timeEl.className = 'city-row__time';
  timeEl.textContent = _formatCityTime(city.tz);

  row.appendChild(nameEl);
  row.appendChild(timeEl);
  return row;
}

/**
 * Update all clock time elements.
 * @param {HTMLElement} container
 */
function _tickClock(container) {
  container.querySelectorAll('.city-row').forEach((row) => {
    const timeEl = row.querySelector('.city-row__time');
    if (timeEl) timeEl.textContent = _formatCityTime(row.dataset.tz);
  });
}

/**
 * Format current time for a given IANA timezone.
 * @param {string} tz
 * @returns {string}
 */
function _formatCityTime(tz) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour:     'numeric',
      minute:   '2-digit',
      hour12:   true,
    }).format(new Date());
  } catch {
    return '--:--';
  }
}

// ── init ──────────────────────────────────────────────────────────────────────

/**
 * Initialise the right panel. Called by app.js.
 * @param {Record<string, unknown>} [appState]
 */
export async function initRightPanel(appState) {
  await renderSpotlight();
  await renderTrending();
  renderClock();

  // Periodically refresh trending topics
  _trendingTimer = setInterval(renderTrending, TRENDING_INTERVAL_MS);

  console.info('[OWF:right-panel] Initialised.');
}

/**
 * Render (or re-render) the full right panel.
 */
export async function render() {
  await renderSpotlight();
  await renderTrending();
  renderClock();
}

export default { initRightPanel, render };
