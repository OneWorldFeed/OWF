// modules/home/home.js

import { registerFeed, loadInitial, getFeedItems } from '../feed-loader/feed-loader.js';
import { createCard } from '../cards/card.js';

export async function render() {
  const container = document.getElementById('feed-container');
  if (!container) return;

  container.innerHTML = '<p class="loading">Loading your global feed…</p>';

  // Register the home feed (placeholder loader)
  registerFeed('home', async (cursor) => {
    const res = await fetch('/data/feed.json');
    const items = await res.json();

    return {
      items,
      nextCursor: null,
      hasMore: false
    };
  });

  // Load first page
  await loadInitial('home');

  // Get cached items
  const items = getFeedItems('home');

  container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    fragment.appendChild(createCard(item));
  });

  container.appendChild(fragment);
}
