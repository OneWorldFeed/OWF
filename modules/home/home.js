/**
 * OWF | One World Feed
 * modules/home/home.js – Home view module
 */

import { loadView } from '../global/view-loader.js';
import { registerFeed, loadInitial } from '../feed-loader/feed-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('home');
  rootEl.innerHTML = html;

  // Register the home feed
  registerFeed('home', async (cursor) => {
    // TODO: Replace with real API call
    return {
      items: [
        { id: '1', type: 'post', text: 'Welcome to your global feed.' }
      ],
      nextCursor: null,
      hasMore: false
    };
  });

  // Load the first page of the feed
  await loadInitial('home');

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const refreshBtn = rootEl.querySelector('.refresh-feed');
  // refreshBtn?.addEventListener('click', () => {
  //   console.log('Refreshing home feed…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const refreshBtn = rootEl.querySelector('.refresh-feed');
  // refreshBtn?.removeEventListener('click', ...);

  rootEl = null;
}
