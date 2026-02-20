/**
 * OWF | One World Feed
 * modules/ai/ai.js – AI view module
 */

import { loadView } from '../global/view-loader.js';

let rootEl = null;

export async function init({ root, state }) {
  rootEl = root;

  // Load the HTML template for this view
  const html = await loadView('ai');
  rootEl.innerHTML = html;

  // Attach listeners, hydrate UI, etc.
  // Example:
  // const askBtn = rootEl.querySelector('.ai-submit');
  // askBtn?.addEventListener('click', () => {
  //   console.log('Submitting AI query…');
  // });
}

export function destroy() {
  if (!rootEl) return;

  // Remove listeners, timers, observers, etc.
  // Example:
  // const askBtn = rootEl.querySelector('.ai-submit');
  // askBtn?.removeEventListener('click', ...);

  rootEl = null;
}
