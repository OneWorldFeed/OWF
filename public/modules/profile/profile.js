/**
 * OWF | One World Feed
 * modules/profile/profile.js – Profile view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('profile');
  rootEl.innerHTML = html;

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const editBtn = rootEl.querySelector('.edit-profile');
  // editBtn?.addEventListener('click', () => {
  //   console.log('Opening profile editor…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const editBtn = rootEl.querySelector('.edit-profile');
  // editBtn?.removeEventListener('click', ...);

  rootEl = null;
}
