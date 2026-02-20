/**
 * OWF | One World Feed
 * modules/badges/badges.js – Badges view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('badges');
  rootEl.innerHTML = html;

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const badgeItems = rootEl.querySelectorAll('.badge-item');
  // badgeItems.forEach(item => {
  //   item.addEventListener('click', () => {
  //     console.log('Opening badge story moment…');
  //   });
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const badgeItems = rootEl.querySelectorAll('.badge-item');
  // badgeItems.forEach(item => {
  //   item.removeEventListener('click', ...);
  // });

  rootEl = null;
}
