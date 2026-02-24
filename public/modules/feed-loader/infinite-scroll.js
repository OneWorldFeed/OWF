/**
 * OWF | One World Feed
 * modules/feed-loader/infinite-scroll.js
 *
 * Minimal infinite scroll engine.
 * Observes a sentinel at the bottom of the feed and loads more items.
 */

import { loadMore } from './feed-loader.js';
import { renderFeed } from './feed-renderer.js';

export function attachInfiniteScroll(name, container) {
  // Create sentinel element
  const sentinel = document.createElement('div');
  sentinel.className = 'feed-sentinel';
  container.appendChild(sentinel);

  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (!entry.isIntersecting) return;

    // Load next page
    const newItems = await loadMore(name);

    // If new items exist, re-render the feed
    if (newItems && newItems.length > 0) {
      renderFeed(name, container);
    }
  });

  observer.observe(sentinel);
}
