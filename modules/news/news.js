/**
 * OWF | One World Feed
 * modules/news/news.js – News view module
 */

import { loadView } from '../global/view-loader.js';
import { registerFeed, loadInitial } from '../feed-loader/feed-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('news');
  rootEl.innerHTML = html;

  // Register the news feed
  registerFeed('news', async (cursor) => {
    // TODO: Replace with real API call
    return {
      items: [
        {
          id: 'n1',
          type: 'headline',
          text: 'A calm view of today’s global events.'
        }
      ],
      nextCursor: null,
      hasMore: false
    };
  });

  // Load the first page of the feed
  await loadInitial('news');

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const refreshBtn = rootEl.querySelector('.refresh-news');
  // refreshBtn?.addEventListener('click', () => {
  //   console.log('Refreshing news feed…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const refreshBtn = rootEl.querySelector('.refresh-news');
  // refreshBtn?.removeEventListener('click', ...);

  rootEl = null;
}
