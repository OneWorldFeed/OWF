/**
 * OWF | One World Feed
 * modules/news/news.js — News page module.
 */

import { loadFeed } from '../feed-loader/feed-loader.js';

// ── Region filter ─────────────────────────────────────────────────────────────

const REGIONS = [
  { id: 'all',          label: 'All Regions' },
  { id: 'global',       label: 'Global'      },
  { id: 'americas',     label: 'Americas'    },
  { id: 'europe',       label: 'Europe'      },
  { id: 'asia-pacific', label: 'Asia Pacific' },
  { id: 'africa',       label: 'Africa'      },
  { id: 'middle-east',  label: 'Middle East'  },
];

function _renderRegionFilter() {
  const container = document.getElementById('news-region-filter')
    ?? document.querySelector('.news-region-filter');
  if (!container) return;

  container.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'filter-label';
  label.id = 'region-filter-label';
  label.textContent = 'Filter by region:';
  container.appendChild(label);

  const group = document.createElement('div');
  group.className = 'region-filter-group';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-labelledby', 'region-filter-label');

  REGIONS.forEach((region, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'region-filter-btn';
    btn.dataset.region = region.id;
    btn.textContent = region.label;
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    if (i === 0) btn.classList.add('region-filter-btn--active');

    btn.addEventListener('click', () => {
      group.querySelectorAll('.region-filter-btn').forEach((b) => {
        b.setAttribute('aria-pressed', 'false');
        b.classList.remove('region-filter-btn--active');
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('region-filter-btn--active');
      // Future: pass region filter to loadFeed when supported
    });

    group.appendChild(btn);
  });

  container.appendChild(group);
}

// ── init ──────────────────────────────────────────────────────────────────────

export async function init() {
  _renderRegionFilter();
  await loadFeed('news');
  console.info('[OWF:news] Initialised.');
}

export default { init };
