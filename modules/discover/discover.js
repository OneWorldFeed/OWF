/**
 * OWF | One World Feed
 * modules/discover/discover.js – Discover view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('discover');
  rootEl.innerHTML = html;

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const discoverBtn = rootEl.querySelector('.discover-refresh');
  // discoverBtn?.addEventListener('click', () => {
  //   console.log('Refreshing Discover feed…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const discoverBtn = rootEl.querySelector('.discover-refresh');
  // discoverBtn?.removeEventListener('click', ...);

  rootEl = null;
}
