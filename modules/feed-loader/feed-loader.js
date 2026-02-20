/**
 * OWF | One World Feed
 * modules/feed-loader/feed-loader.js — Feed fetching, pagination, and rendering.
 */

import { safeUrl } from '../global/global.js';

// Lazily register the custom element only if not already defined
if (!customElements.get('feed-card')) {
  import('/components/feed-card/feed-card.js').catch((err) => {
    console.warn('[feed-loader] Could not load feed-card component:', err);
  });
}

// ── Constants ─────────────────────────────────────────────────────────────────

const FEED_URL        = '/data/feed.json';
const PAGE_SIZE       = 10;

// ── Module state ──────────────────────────────────────────────────────────────

/** @type {Array<object>} Full feed data loaded from JSON */
let _allItems = [];

/** @type {Array<object>} Filtered subset currently shown */
let _filteredItems = [];

let _currentFilter = 'all';
let _currentPage   = 0;
let _isLoading     = false;

// ── DOM helpers ───────────────────────────────────────────────────────────────

function _getFeedList()          { return document.getElementById('feed-list'); }
function _getLoadingState()      { return document.getElementById('feed-loading-state'); }
function _getEmptyState()        { return document.getElementById('feed-empty-state'); }
function _getLoadMoreWrapper()   { return document.getElementById('feed-load-more-wrapper'); }
function _getLoadMoreBtn()       { return document.getElementById('load-more-btn'); }
function _getFeedContainer()     { return document.getElementById('feed-container'); }

// ── Skeleton loading ──────────────────────────────────────────────────────────

function _showSkeleton() {
  const state = _getLoadingState();
  if (state) { state.hidden = false; state.removeAttribute('aria-hidden'); }
  const container = _getFeedContainer();
  if (container) container.setAttribute('aria-busy', 'true');
}

function _hideSkeleton() {
  const state = _getLoadingState();
  if (state) { state.hidden = true; state.setAttribute('aria-hidden', 'true'); }
  const container = _getFeedContainer();
  if (container) container.setAttribute('aria-busy', 'false');
}

// ── Feed card factory ─────────────────────────────────────────────────────────

/**
 * Create a <li> wrapping a <feed-card> element from a feed item.
 * Attributes are set via setAttribute — values come from our controlled JSON.
 * @param {object} item
 * @returns {HTMLLIElement}
 */
function _createFeedCardItem(item) {
  const li = document.createElement('li');
  li.className = 'feed-list__item';

  const card = document.createElement('feed-card');

  // Set attributes from data; tags array is JSON-serialised
  card.setAttribute('type',      item.type      ?? 'news');
  card.setAttribute('title',     item.title     ?? '');
  card.setAttribute('source',    item.source    ?? '');
  card.setAttribute('timestamp', item.timestamp ?? '');
  card.setAttribute('tags',      JSON.stringify(Array.isArray(item.tags) ? item.tags : []));
  card.setAttribute('mood',      item.mood      ?? '');
  card.setAttribute('region',    item.region    ?? '');
  card.setAttribute('summary',   item.summary   ?? '');

  const url = safeUrl(item.url ?? '');
  if (url) card.setAttribute('url', url);

  const thumb = safeUrl(item.thumbnail ?? '');
  if (thumb) card.setAttribute('thumbnail', thumb);

  li.appendChild(card);
  return li;
}

// ── Skeleton card factory ─────────────────────────────────────────────────────

/**
 * Build programmatic skeleton cards as a loading placeholder.
 * Shown in the feed list while data is loading, when the view HTML
 * does not include pre-built skeleton markup.
 * @param {number} count
 * @returns {DocumentFragment}
 */
function _buildSkeletonCards(count = 3) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const li = document.createElement('li');
    li.className = 'feed-list__item skeleton-card';
    li.setAttribute('aria-hidden', 'true');

    const avatar = document.createElement('div');
    avatar.className = 'skeleton skeleton-avatar';

    const lines = document.createElement('div');
    lines.className = 'skeleton-lines';

    ['full', 'wide', 'half'].forEach((w) => {
      const line = document.createElement('div');
      line.className = `skeleton skeleton-line skeleton-line--${w}`;
      lines.appendChild(line);
    });

    li.appendChild(avatar);
    li.appendChild(lines);
    fragment.appendChild(li);
  }
  return fragment;
}

// ── Data helpers ──────────────────────────────────────────────────────────────

function _applyFilter(filter) {
  if (!filter || filter === 'all') {
    return [..._allItems];
  }
  return _allItems.filter((item) => item.type === filter);
}

function _getPage(items, page) {
  const start = page * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

function _hasMore(items, page) {
  return (page + 1) * PAGE_SIZE < items.length;
}

// ── Render helpers ────────────────────────────────────────────────────────────

function _renderPage(items, append = false) {
  const list = _getFeedList();
  if (!list) return;

  if (!append) list.innerHTML = '';

  // Remove any programmatic skeleton items from a previous load
  list.querySelectorAll('.skeleton-card').forEach((el) => el.remove());

  if (!items.length && !append) {
    const empty = _getEmptyState();
    if (empty) empty.hidden = false;
    const wrapper = _getLoadMoreWrapper();
    if (wrapper) wrapper.hidden = true;
    return;
  }

  const empty = _getEmptyState();
  if (empty) empty.hidden = true;

  const fragment = document.createDocumentFragment();
  items.forEach((item) => fragment.appendChild(_createFeedCardItem(item)));
  list.appendChild(fragment);
}

function _updateLoadMoreBtn() {
  const wrapper = _getLoadMoreWrapper();
  if (!wrapper) return;
  wrapper.hidden = !_hasMore(_filteredItems, _currentPage);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Load (or reload) the feed with an optional type filter.
 * @param {string} [filter='all']
 */
export async function loadFeed(filter = 'all') {
  if (_isLoading) return;
  _isLoading = true;
  _currentFilter = filter;
  _currentPage   = 0;

  _showSkeleton();

  // Show programmatic skeletons in the list while fetching
  const list = _getFeedList();
  if (list) {
    list.innerHTML = '';
    list.appendChild(_buildSkeletonCards(3));
  }

  try {
    if (!_allItems.length) {
      const res = await fetch(FEED_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      _allItems = Array.isArray(data.feed) ? data.feed : [];
    }

    _filteredItems = _applyFilter(_currentFilter);
    const page = _getPage(_filteredItems, _currentPage);

    _renderPage(page, false);
    _updateLoadMoreBtn();
  } catch (err) {
    console.error('[feed-loader] Load error:', err);
    if (list) {
      list.innerHTML = '';
      const errItem = document.createElement('li');
      errItem.className = 'feed-error';
      const p = document.createElement('p');
      p.textContent = 'Failed to load feed. Please try again.';
      errItem.appendChild(p);
      list.appendChild(errItem);
    }
  } finally {
    _hideSkeleton();
    _isLoading = false;
  }
}

/**
 * Load the next page of the current feed.
 */
export async function loadMore() {
  if (_isLoading) return;
  if (!_hasMore(_filteredItems, _currentPage)) return;
  _isLoading = true;

  const btn = _getLoadMoreBtn();
  if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }

  try {
    _currentPage++;
    const page = _getPage(_filteredItems, _currentPage);
    _renderPage(page, true);
    _updateLoadMoreBtn();
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Load more'; }
    _isLoading = false;
  }
}

/**
 * Reset the feed cache (force refetch on next loadFeed call).
 */
export function clearCache() {
  _allItems = [];
  _filteredItems = [];
  _currentPage = 0;
}

// ── init ──────────────────────────────────────────────────────────────────────

/**
 * Wire up the Load More button and trigger the initial feed load.
 * @param {Record<string, unknown>} [appState]
 */
export async function initFeedLoader(appState) {
  const btn = _getLoadMoreBtn();
  if (btn) {
    btn.addEventListener('click', loadMore);
  }

  await loadFeed('all');
  console.info('[OWF:feed-loader] Initialised.');
}

export default { initFeedLoader, loadFeed, loadMore, clearCache };
