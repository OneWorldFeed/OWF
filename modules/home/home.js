/**
 * OWF | One World Feed
 * modules/home/home.js
 *
 * Home feed renderer — uses the canonical feed-loader + card.js system.
 */

import { registerFeed, loadInitial, getFeedItems } from '../feed-loader/feed-loader.js';
import { createCard } from '../cards/card.js';

export async function render() {
  const container = document.getElementById('feed-container');
  if (!container) return;

  container.innerHTML = '<p class="loading">Loading your global feed…</p>';

  /* -----------------------------------------
     REGISTER THE HOME FEED
     (This connects feed-loader → feed.json)
  ------------------------------------------ */
  registerFeed('home', async (cursor) => {
    const res = await fetch('/data/feed.json');
    const items = await res.json();

    return {
      items,
      nextCursor: null,
      hasMore: false
    };
  });

  /* -----------------------------------------
     LOAD FIRST PAGE
  ------------------------------------------ */
  await loadInitial('home');

  /* -----------------------------------------
     GET CACHED ITEMS
  ------------------------------------------ */
  const items = getFeedItems('home');

  /* -----------------------------------------
     RENDER CARDS
  ------------------------------------------ */
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    fragment.appendChild(createCard(item));
  });

  container.appendChild(fragment);
}
