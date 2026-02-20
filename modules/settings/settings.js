/**
 * OWF | One World Feed
 * modules/settings/settings.js – Settings view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('settings');
  rootEl.innerHTML = html;

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const themeToggle = rootEl.querySelector('.theme-toggle');
  // themeToggle?.addEventListener('click', () => {
  //   console.log('Switching theme…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const themeToggle = rootEl.querySelector('.theme-toggle');
  // themeToggle?.removeEventListener('click', ...);

  rootEl = null;
}
