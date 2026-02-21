/**
 * OWF | One World Feed
 * modules/feed-loader/feed-renderer.js
 *
 * Universal feed rendering engine.
 * Turns feed items into DOM elements and injects them into a container.
 */

import { getFeedItems } from './feed-loader.js';

/**
 * Render a feed into a container element.
 */
export function renderFeed(name, container) {
  const items = getFeedItems(name);
  container.innerHTML = items.map(renderItem).join('');
}

/**
 * Render a single feed item into HTML.
 * This is a placeholder — will be replaced with card components in 4.4.
 */
function renderItem(item) {
  return `
    <div class="feed-item feed-item-${item.type}">
      <p>${item.text}</p>
    </div>
  `;
}
