/**
 * OWF | One World Feed
 * modules/social/social.js – Social view module
 */

import { loadView } from '../global/view-loader.js';
import { registerFeed, loadInitial } from '../feed-loader/feed-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('social');
  rootEl.innerHTML = html;

  // Register the social feed
  registerFeed('social', async (cursor) => {
    // TODO: Replace with real API call
    return {
      items: [
        {
          id: 's1',
          type: 'post',
          user: '@GlobalCitizen',
          city: 'Tokyo',
          text: 'Sharing a moment from today’s walk through Shibuya.'
        }
      ],
      nextCursor: null,
      hasMore: false
    };
  });

  // Load the first page of the feed
  await loadInitial('social');

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const composer = rootEl.querySelector('.composer');
  // composer?.addEventListener('input', () => {
  //   console.log('Typing in the composer…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const composer = rootEl.querySelector('.composer');
  // composer?.removeEventListener('input', ...);

  rootEl = null;
}
