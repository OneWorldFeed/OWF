/**
 * OWF | One World Feed
 * modules/feed-loader/feed-loader.js
 *
 * Centralized feed loading + hydration engine.
 * All views (home, discover, news, social) call into this.
 */

let registry = {}; // Stores feed instances by name

/**
 * Register a feed with a loader function.
 * Example: registerFeed('home', loadHomeFeed)
 */
export function registerFeed(name, loaderFn) {
  registry[name] = {
    loader: loaderFn,
    cursor: null,       // for pagination
    items: [],          // cached items
    isLoading: false,
    hasMore: true
  };
}

/**
 * Load the first page of a feed.
 */
export async function loadInitial(name) {
  const feed = registry[name];
  if (!feed) throw new Error(`Feed not registered: ${name}`);

  feed.cursor = null;
  feed.items = [];
  feed.hasMore = true;

  return await loadMore(name);
}

/**
 * Load the next page of a feed.
 */
export async function loadMore(name) {
  const feed = registry[name];
  if (!feed || feed.isLoading || !feed.hasMore) return;

  feed.isLoading = true;

  const result = await feed.loader(feed.cursor);

  // Expected result shape:
  // { items: [...], nextCursor: <string|null>, hasMore: boolean }
  feed.items.push(...result.items);
  feed.cursor = result.nextCursor;
  feed.hasMore = result.hasMore;

  feed.isLoading = false;

  return result.items;
}

/**
 * Get cached items for a feed.
 */
export function getFeedItems(name) {
  const feed = registry[name];
  return feed ? feed.items : [];
}
