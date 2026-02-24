/**
 * OWF | One World Feed
 * modules/cards/card-registry.js
 *
 * Maps feed item types to card renderers.
 */

import { renderPostCard } from './card-post.js';
import { renderHeadlineCard } from './card-headline.js';
import { renderDiscoverCard } from './card-discover.js';

const registry = {
  post: renderPostCard,
  headline: renderHeadlineCard,
  discover: renderDiscoverCard
};

export function renderCard(item) {
  const renderer = registry[item.type];
  if (!renderer) {
    return `<div class="card card-unknown">Unknown card type: ${item.type}</div>`;
  }
  return renderer(item);
}
