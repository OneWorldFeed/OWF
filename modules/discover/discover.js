/**
 * OWF | One World Feed
 * modules/discover/discover.js – Discover view module
 */

import { loadView } from '../global/view-loader.js';
import { registerFeed, loadInitial } from '../feed-loader/feed-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('discover');
  rootEl.innerHTML = html;

  // Register the discover feed
  registerFeed('discover', async (cursor) => {
    // TODO: Replace with real API call
    return {
      items: [
        { id: 'd1', type: 'discover', text: 'Explore new creators and ideas.' }
      ],
      nextCursor: null,
      hasMore: false
    };
  });

  // Load the first page of the feed
  await loadInitial('discover');

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const exploreBtn = rootEl.querySelector('.explore-more');
  // exploreBtn?.addEventListener('click', () => {
  //   console.log('Exploring more discovery items…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const exploreBtn = rootEl.querySelector('.explore-more');
  // exploreBtn?.removeEventListener('click', ...);

  rootEl = null;
}
