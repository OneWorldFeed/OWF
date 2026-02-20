/**
 * OWF | One World Feed
 * modules/music/music.js – Music view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('music');
  rootEl.innerHTML = html;

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const playBtn = rootEl.querySelector('.music-play');
  // playBtn?.addEventListener('click', () => {
  //   console.log('Playing track…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const playBtn = rootEl.querySelector('.music-play');
  // playBtn?.removeEventListener('click', ...);

  rootEl = null;
}
