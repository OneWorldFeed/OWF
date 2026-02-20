/**
 * OWF | One World Feed
 * modules/discover/discover.js — Discover page module.
 */

import { safeUrl } from '../global/global.js';

const TAGS_URL = '/data/tags.json';

// ── Category definitions ──────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'news',     label: 'News',       icon: '📰', path: '/news'     },
  { id: 'music',    label: 'Music',      icon: '🎵', path: '/music'    },
  { id: 'social',   label: 'Social',     icon: '💬', path: '/social'   },
  { id: 'podcasts', label: 'Podcasts',   icon: '🎙️', path: '/podcasts' },
  { id: 'live',     label: 'Live',       icon: '🔴', path: '/live'     },
  { id: 'ai',       label: 'AI',         icon: '🤖', path: '/ai'       },
  { id: 'science',  label: 'Science',    icon: '🔬', path: '/'         },
  { id: 'sport',    label: 'Sport',      icon: '⚽', path: '/'         },
  { id: 'culture',  label: 'Culture',    icon: '🎭', path: '/'         },
  { id: 'tech',     label: 'Technology', icon: '💻', path: '/'         },
];

// ── Trending topics ───────────────────────────────────────────────────────────

async function _renderTrending() {
  const container = document.getElementById('discover-trending')
    ?? document.querySelector('.discover-trending');
  if (!container) return;

  try {
    const res = await fetch(TAGS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const tags = Array.isArray(data.tags) ? data.tags.slice(0, 15) : [];

    container.innerHTML = '';
    const heading = document.createElement('h2');
    heading.className = 'section-heading';
    heading.textContent = 'Trending Now';
    container.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'trending-list';
    list.setAttribute('role', 'list');

    tags.forEach((tag, i) => {
      const li = document.createElement('li');
      li.className = 'trending-list__item';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'trending-topic-btn';
      btn.setAttribute('aria-label', `Explore ${tag.label || tag.name}`);

      const rank = document.createElement('span');
      rank.className = 'trending-rank';
      rank.textContent = String(i + 1);

      const icon = document.createElement('span');
      icon.className = 'trending-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = tag.icon || '#';

      const name = document.createElement('span');
      name.className = 'trending-name';
      name.textContent = tag.label || tag.name || '';

      btn.appendChild(rank);
      btn.appendChild(icon);
      btn.appendChild(name);
      li.appendChild(btn);
      list.appendChild(li);
    });

    container.appendChild(list);
  } catch (err) {
    console.warn('[discover] Trending load error:', err);
  }
}

// ── Category cards ────────────────────────────────────────────────────────────

function _renderCategories() {
  const container = document.getElementById('discover-categories')
    ?? document.querySelector('.discover-categories');
  if (!container) return;

  container.innerHTML = '';

  const heading = document.createElement('h2');
  heading.className = 'section-heading';
  heading.textContent = 'Browse Categories';
  container.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'category-grid';

  CATEGORIES.forEach((cat) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'category-card';
    card.dataset.category = cat.id;
    card.setAttribute('aria-label', `Browse ${cat.label}`);

    const iconEl = document.createElement('span');
    iconEl.className = 'category-card__icon';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.textContent = cat.icon;

    const labelEl = document.createElement('span');
    labelEl.className = 'category-card__label';
    labelEl.textContent = cat.label;

    card.appendChild(iconEl);
    card.appendChild(labelEl);

    card.addEventListener('click', () => {
      // Navigate via the router if available, otherwise follow href
      if (window.__owfRouter?.navigate) {
        window.__owfRouter.navigate(cat.path);
      }
    });

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

// ── init ──────────────────────────────────────────────────────────────────────

export async function init() {
  await _renderTrending();
  _renderCategories();
  console.info('[OWF:discover] Initialised.');
}

export default { init };
