/**
 * OWF | One World Feed
 * modules/podcasts/podcasts.js – Podcasts view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('podcasts');
  rootEl.innerHTML = html;

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const playBtn = rootEl.querySelector('.podcast-play');
  // playBtn?.addEventListener('click', () => {
  //   console.log('Playing podcast episode…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const playBtn = rootEl.querySelector('.podcast-play');
  // playBtn?.removeEventListener('click', ...);

  rootEl = null;
}
