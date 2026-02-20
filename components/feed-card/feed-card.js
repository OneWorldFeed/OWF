/**
 * OWF | One World Feed
 * feed-card.js — FeedCard Web Component
 *
 * A custom element that renders a feed card for various content types:
 * news, music, social, live, podcast, ai.
 *
 * Usage:
 *   <feed-card
 *     type="news"
 *     title="Breaking: ..."
 *     source="Reuters"
 *     timestamp="2024-01-15T10:30:00Z"
 *     tags='["breaking","global"]'
 *     mood="urgent"
 *     region="europe"
 *     thumbnail="https://..."
 *     summary="Short description..."
 *     url="https://..."
 *   ></feed-card>
 */

const CARD_TYPES = ['news', 'music', 'social', 'live', 'podcast', 'ai'];

const TYPE_ICONS = {
  news:    '📰',
  music:   '🎵',
  social:  '💬',
  live:    '🔴',
  podcast: '🎙️',
  ai:      '🤖',
};

const TYPE_LABELS = {
  news:    'News',
  music:   'Music',
  social:  'Social',
  live:    'Live',
  podcast: 'Podcast',
  ai:      'AI',
};

/** Default accent colours per type. Match the token values in tokens/colors.css. */
const TYPE_COLORS = {
  news:    '#2563eb',
  music:   '#7c3aed',
  social:  '#059669',
  live:    '#dc2626',
  podcast: '#d97706',
  ai:      '#0891b2',
};

/** Format an ISO timestamp into a human-readable relative time string. */
function formatTimestamp(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date)) return iso;
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Parse a stringified JSON attribute safely. */
function parseJSON(value) {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = /* html */`
  <style>
    :host {
      display: block;
      outline: none;
    }

    .card {
      background-color: var(--card-bg, var(--color-bg-card, #1e1e1e));
      border: 1px solid var(--card-border, var(--color-border, #2a2a2a));
      border-radius: var(--card-radius, 0.75rem);
      padding: var(--card-padding, 1rem);
      box-shadow: var(--card-shadow, 0 1px 3px rgba(0,0,0,0.1));
      cursor: pointer;
      transition:
        box-shadow 200ms ease,
        transform  200ms cubic-bezier(0.34, 1.56, 0.64, 1),
        background-color 150ms ease;
      font-family: var(--card-font-family, var(--font-sans, 'Inter', system-ui, sans-serif));
      color: var(--card-text, var(--color-text, #f0f0f0));
      position: relative;
      overflow: hidden;
    }

    .card:hover {
      box-shadow: var(--card-shadow-hover, 0 4px 12px rgba(0,0,0,0.15));
      transform: translateY(-2px);
    }

    .card:active {
      box-shadow: var(--card-shadow-active, 0 1px 2px rgba(0,0,0,0.1));
      transform: translateY(0);
    }

    /* ── Type accent bar ─────────────────────────────────────────── */
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background-color: var(--type-color, var(--card-type-news, #2563eb));
      border-radius: var(--card-radius, 0.75rem) 0 0 var(--card-radius, 0.75rem);
    }

    /* ── Header row ──────────────────────────────────────────────── */
    .card__header {
      display: flex;
      align-items: center;
      gap: var(--card-gap, 0.5rem);
      margin-bottom: var(--card-gap, 0.5rem);
    }

    .card__type-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: var(--card-font-size-meta, 0.75rem);
      font-weight: 600;
      color: var(--type-color, var(--card-type-news, #2563eb));
      text-transform: uppercase;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }

    .card__source {
      font-size: var(--card-font-size-meta, 0.75rem);
      color: var(--card-text-secondary, var(--color-text-secondary, #a0a0a0));
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .card__timestamp {
      font-size: var(--card-font-size-meta, 0.75rem);
      color: var(--card-text-secondary, var(--color-text-secondary, #a0a0a0));
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* ── Body ────────────────────────────────────────────────────── */
    .card__body {
      display: flex;
      gap: var(--card-gap, 0.5rem);
    }

    .card__content {
      flex: 1;
      min-width: 0;
    }

    .card__title {
      font-size: var(--card-font-size-title, 1.1rem);
      font-weight: var(--card-font-weight-title, 600);
      line-height: var(--card-line-height-title, 1.3);
      color: var(--card-text, var(--color-text, #f0f0f0));
      margin-bottom: var(--card-gap-sm, 0.25rem);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card__summary {
      font-size: var(--card-font-size-body, 0.9rem);
      line-height: var(--card-line-height-body, 1.5);
      color: var(--card-text-secondary, var(--color-text-secondary, #a0a0a0));
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: var(--card-gap, 0.5rem);
    }

    .card__thumbnail {
      width: 80px;
      height: 80px;
      border-radius: var(--card-radius-sm, 0.5rem);
      object-fit: cover;
      flex-shrink: 0;
      background-color: var(--color-border, #2a2a2a);
    }

    /* ── Tags ────────────────────────────────────────────────────── */
    .card__tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--card-gap-sm, 0.25rem);
      margin-top: var(--card-gap-sm, 0.25rem);
    }

    .card__tag {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 500;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      background-color: var(--color-border, #2a2a2a);
      color: var(--card-text-secondary, var(--color-text-secondary, #a0a0a0));
      text-transform: lowercase;
    }

    /* ── Live indicator ──────────────────────────────────────────── */
    .card__live-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--card-type-live, #dc2626);
      animation: livePulse 1.4s ease-in-out infinite;
      flex-shrink: 0;
    }

    @keyframes livePulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(0.85); }
    }

    /* ── Music layout extras ─────────────────────────────────────── */
    .card__music-meta {
      font-size: var(--card-font-size-meta, 0.75rem);
      color: var(--card-text-secondary, var(--color-text-secondary, #a0a0a0));
      margin-top: var(--card-gap-sm, 0.25rem);
    }

    /* ── Podcast layout extras ───────────────────────────────────── */
    .card__duration {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: var(--card-font-size-meta, 0.75rem);
      color: var(--card-text-secondary, var(--color-text-secondary, #a0a0a0));
      margin-top: var(--card-gap-sm, 0.25rem);
    }

    /* ── AI layout extras ────────────────────────────────────────── */
    .card__ai-label {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: var(--card-font-size-meta, 0.75rem);
      font-weight: 500;
      color: var(--card-type-ai, #0891b2);
      margin-top: var(--card-gap-sm, 0.25rem);
    }

    /* ── Region accent ───────────────────────────────────────────── */
    .card[data-region] .card__source::after {
      content: ' · ' attr(data-region-label);
    }
  </style>
  <article class="card" role="article" tabindex="0">
    <header class="card__header">
      <span class="card__type-badge"></span>
      <span class="card__source"></span>
      <time class="card__timestamp"></time>
    </header>
    <div class="card__body">
      <div class="card__content">
        <h2 class="card__title"></h2>
        <p class="card__summary"></p>
        <div class="card__tags"></div>
      </div>
    </div>
  </article>
`;

export class FeedCard extends HTMLElement {
  /** Observed attributes drive re-renders when changed declaratively. */
  static get observedAttributes() {
    return ['type', 'title', 'source', 'timestamp', 'tags', 'mood', 'region',
            'thumbnail', 'summary', 'url'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._card = this.shadowRoot.querySelector('.card');
    this._handleClick  = this._handleClick.bind(this);
    this._handleKeydown = this._handleKeydown.bind(this);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  connectedCallback() {
    this.render();
    this._card.addEventListener('click',   this._handleClick);
    this._card.addEventListener('keydown', this._handleKeydown);
  }

  disconnectedCallback() {
    this._card.removeEventListener('click',   this._handleClick);
    this._card.removeEventListener('keydown', this._handleKeydown);
  }

  attributeChangedCallback(_name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Update multiple properties at once and re-render.
   * @param {Partial<FeedCardData>} data
   */
  update(data = {}) {
    const attrMap = {
      type: 'type', title: 'title', source: 'source',
      timestamp: 'timestamp', tags: 'tags', mood: 'mood',
      region: 'region', thumbnail: 'thumbnail', summary: 'summary',
      url: 'url',
    };
    for (const [key, attr] of Object.entries(attrMap)) {
      if (key in data) {
        const value = key === 'tags' && Array.isArray(data[key])
          ? JSON.stringify(data[key])
          : String(data[key] ?? '');
        this.setAttribute(attr, value);
      }
    }
  }

  /** Re-render the card from current attributes. */
  render() {
    const type      = this.getAttribute('type') || 'news';
    const title     = this.getAttribute('title') || '';
    const source    = this.getAttribute('source') || '';
    const timestamp = this.getAttribute('timestamp') || '';
    const tags      = parseJSON(this.getAttribute('tags'));
    const mood      = this.getAttribute('mood') || '';
    const region    = this.getAttribute('region') || '';
    const thumbnail = this.getAttribute('thumbnail') || '';
    const summary   = this.getAttribute('summary') || '';
    const url       = this.getAttribute('url') || '';

    const safeType = CARD_TYPES.includes(type) ? type : 'news';

    // Set ARIA label for the card article
    this._card.setAttribute('aria-label', `${TYPE_LABELS[safeType]} card: ${title}`);

    // Apply type colour directly so the shadow-DOM element receives it without
    // an extra level of var() indirection. Falls back to the token if overridden.
    const typeColor = TYPE_COLORS[safeType];
    this._card.style.setProperty('--type-color', typeColor);

    // Data attributes for region theming hooks
    if (region) {
      this._card.dataset.region = region;
    } else {
      delete this._card.dataset.region;
    }

    // Mood modifier class
    this._card.dataset.mood = mood || '';
    this._card.dataset.type = safeType;

    this._renderHeader(safeType, source, timestamp);
    this._renderBody(safeType, title, summary, thumbnail);
    this._renderTags(tags, safeType);
    this._renderTypeExtras(safeType);
  }

  // ── Private render helpers ────────────────────────────────────────────────

  _renderHeader(type, source, timestamp) {
    const badge = this.shadowRoot.querySelector('.card__type-badge');
    const sourceEl = this.shadowRoot.querySelector('.card__source');
    const timeEl   = this.shadowRoot.querySelector('.card__timestamp');

    // Type badge
    const icon = type === 'live'
      ? `<span class="card__live-dot" aria-hidden="true"></span>`
      : `<span aria-hidden="true">${TYPE_ICONS[type]}</span>`;
    badge.innerHTML = `${icon}<span>${TYPE_LABELS[type]}</span>`;

    // Source
    sourceEl.textContent = source;

    // Timestamp
    const formatted = formatTimestamp(timestamp);
    timeEl.textContent = formatted;
    if (timestamp) timeEl.setAttribute('datetime', timestamp);
  }

  _renderBody(type, title, summary, thumbnail) {
    const titleEl   = this.shadowRoot.querySelector('.card__title');
    const summaryEl = this.shadowRoot.querySelector('.card__summary');
    const bodyEl    = this.shadowRoot.querySelector('.card__body');

    titleEl.textContent = title;
    summaryEl.textContent = summary;
    summaryEl.hidden = !summary;

    // Thumbnail — insert or remove
    const existingThumb = this.shadowRoot.querySelector('.card__thumbnail');
    if (thumbnail) {
      if (existingThumb) {
        existingThumb.src = thumbnail;
        existingThumb.alt = title;
      } else {
        const img = document.createElement('img');
        img.className = 'card__thumbnail';
        img.src = thumbnail;
        img.alt = title;
        img.loading = 'lazy';
        img.decoding = 'async';
        bodyEl.appendChild(img);
      }
    } else if (existingThumb) {
      existingThumb.remove();
    }

    // Social cards show a larger summary (3 lines)
    if (type === 'social') {
      summaryEl.style.webkitLineClamp = '3';
    } else {
      summaryEl.style.webkitLineClamp = '2';
    }
  }

  _renderTags(tags, type) {
    const tagsEl = this.shadowRoot.querySelector('.card__tags');
    tagsEl.innerHTML = '';
    if (!tags.length) return;

    const fragment = document.createDocumentFragment();
    for (const tag of tags) {
      const span = document.createElement('span');
      span.className = `card__tag card__tag--${String(tag).toLowerCase().replace(/\s+/g, '-')}`;
      span.textContent = `#${tag}`;
      fragment.appendChild(span);
    }
    tagsEl.appendChild(fragment);
  }

  _renderTypeExtras(type) {
    // Remove any previously injected extras
    const prev = this.shadowRoot.querySelector('.card__type-extra');
    if (prev) prev.remove();

    const content = this.shadowRoot.querySelector('.card__content');
    if (!content) return;

    let extra = null;

    if (type === 'music') {
      extra = document.createElement('div');
      extra.className = 'card__music-meta card__type-extra';
      extra.setAttribute('aria-label', 'Music');
      extra.innerHTML = `<span>🎧 Now playing</span>`;
    } else if (type === 'podcast') {
      const dur = this.getAttribute('duration') || '';
      extra = document.createElement('div');
      extra.className = 'card__duration card__type-extra';
      extra.innerHTML = `<span aria-hidden="true">⏱</span><span>${dur || 'Podcast episode'}</span>`;
    } else if (type === 'ai') {
      extra = document.createElement('div');
      extra.className = 'card__ai-label card__type-extra';
      extra.innerHTML = `<span aria-hidden="true">✨</span><span>AI Summary</span>`;
    }

    if (extra) content.appendChild(extra);
  }

  // ── Event handlers ────────────────────────────────────────────────────────

  _handleClick() {
    const url = this.getAttribute('url');
    if (!url) return;
    this.dispatchEvent(new CustomEvent('card-click', {
      bubbles: true, composed: true,
      detail: { url, type: this.getAttribute('type'), title: this.getAttribute('title') },
    }));
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  _handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }
}

customElements.define('feed-card', FeedCard);

export default FeedCard;
