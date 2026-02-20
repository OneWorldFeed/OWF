/**
 * OWF | One World Feed
 * modules/social/social.js – Social view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('social');
  rootEl.innerHTML = html;

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const composer = rootEl.querySelector('.social-composer-input');
  // composer?.addEventListener('input', () => {
  //   console.log('Typing into composer…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const composer = rootEl.querySelector('.social-composer-input');
  // composer?.removeEventListener('input', ...);

  rootEl = null;
}
