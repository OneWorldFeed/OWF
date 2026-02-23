// modules/home/home.js

import { createCard } from '../cards/card.js';
import { loadFeed } from '../feed-loader/feed-loader.js';

export async function render() {
  const container = document.getElementById('feed-container');
  if (!container) return;

  container.innerHTML = '<p class="loading">Loading your global feed…</p>';

  const items = await loadFeed();

  container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    fragment.appendChild(createCard(item));
  });

  container.appendChild(fragment);
}
