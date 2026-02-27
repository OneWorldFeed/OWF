/* ============================================================
   OWF FEED LOADER — PHASE 4.4.4
   Centralized feed loading + hydration engine
   ============================================================ */

let registry = {}; // Stores feed instances by name

/* ------------------------------------------------------------
   Register a feed with a loader function
   Example: registerFeed('home', loadHomeFeed)
   ------------------------------------------------------------ */
export function registerFeed(name, loaderFn) {
  registry[name] = {
    loader: loaderFn,
    cursor: null,
    items: [],
    isLoading: false,
    hasMore: true
  };
}

/* ------------------------------------------------------------
   Load the first page of a feed
   ------------------------------------------------------------ */
export async function loadInitialFeed() {
  const route = location.hash.replace("#", "") || "home";
  const feed = registry[route];
  if (!feed) return;

  feed.cursor = null;
  feed.items = [];
  feed.hasMore = true;

  const items = await loadMore(route);
  renderFeed(items);
}

/* ------------------------------------------------------------
   Load the next page of a feed
   ------------------------------------------------------------ */
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

/* ------------------------------------------------------------
   Render feed items into #feed
   ------------------------------------------------------------ */
function renderFeed(items) {
  const container = document.querySelector("#feed");
  if (!container) return;

  container.innerHTML = ""; // Clear existing items

  items.forEach(item => {
    const card = createFeedCard(item);
    container.appendChild(card);
  });
}

/* ------------------------------------------------------------
   Infinite scroll
   ------------------------------------------------------------ */
window.addEventListener("scroll", async () => {
  const route = location.hash.replace("#", "") || "home";
  const feed = registry[route];
  if (!feed || feed.isLoading || !feed.hasMore) return;

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    const newItems = await loadMore(route);
    appendFeedItems(newItems);
  }
});

function appendFeedItems(items) {
  const container = document.querySelector("#feed");
  if (!container) return;

  items.forEach(item => {
    const card = createFeedCard(item);
    container.appendChild(card);
  });
}

/* ------------------------------------------------------------
   Hydrate feed AFTER layout is ready
   ------------------------------------------------------------ */
window.addEventListener("owf:layout-ready", loadInitialFeed);
