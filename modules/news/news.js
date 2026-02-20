/**
 * OWF | One World Feed
 * modules/news/news.js – News view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('news');
  rootEl.innerHTML = html;

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const refreshBtn = rootEl.querySelector('.news-refresh');
  // refreshBtn?.addEventListener('click', () => {
  //   console.log('Refreshing global news…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const refreshBtn = rootEl.querySelector('.news-refresh');
  // refreshBtn?.removeEventListener('click', ...);

  rootEl = null;
}
