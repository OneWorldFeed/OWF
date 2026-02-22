/**
 * OWF | One World Feed
 * modules/feed-loader/feed-renderer.js
 *
 * Universal feed rendering engine.
 * Turns feed items into DOM elements and injects them into a container.
 */

import { getFeedItems } from './feed-loader.js';
import { renderCard } from '../cards/card-registry.js';

/**
 * Render a feed into a container element.
 */
export function renderFeed(name, container) {
  const items = getFeedItems(name);
  container.innerHTML = items.map(renderCard).join('');
}
