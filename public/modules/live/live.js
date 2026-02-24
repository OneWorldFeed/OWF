/**
 * OWF | One World Feed
 * modules/live/live.js – Live view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('live');
  rootEl.innerHTML = html;

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const goLiveBtn = rootEl.querySelector('.go-live');
  // goLiveBtn?.addEventListener('click', () => {
  //   console.log('Starting live broadcast…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const goLiveBtn = rootEl.querySelector('.go-live');
  // goLiveBtn?.removeEventListener('click', ...);

  rootEl = null;
}
