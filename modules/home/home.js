/**
 * OWF | One World Feed
 * modules/home/home.js – Home view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('home');
  rootEl.innerHTML = html;

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
