/* ============================================================
   OWF FEED LOADER — PHASE 4.4.4 (Fetch Version)
   Pagination • Infinite Scroll • Component Hydration
   ============================================================ */

let feedData = [];

/* ---------------------------------------------
   Load JSON at runtime (no import assertions)
--------------------------------------------- */
async function loadFeedData() {
  const res = await fetch("../../data/feed.json");
  feedData = await res.json();
}

/* ---------------------------------------------
   Internal feed registry
--------------------------------------------- */
const feedState = {
  cursor: 0,
  limit: 5,
  hasMore: true,
  isLoading: false
};

/* ---------------------------------------------
   Load the first batch
--------------------------------------------- */
export async function loadInitialFeed() {
  await loadFeedData();

  feedState.cursor = 0;
  feedState.hasMore = true;
  feedState.isLoading = false;

  const mount = document.querySelector("#feed");
  if (mount) mount.innerHTML = "";

  loadMoreFeed();
}

/* ---------------------------------------------
   Load next batch
--------------------------------------------- */
export function loadMoreFeed() {
  if (feedState.isLoading || !feedState.hasMore) return;

  feedState.isLoading = true;

  const start = feedState.cursor;
  const end = start + feedState.limit;

  const slice = feedData.slice(start, end);

  if (slice.length === 0) {
    feedState.hasMore = false;
    feedState.isLoading = false;
    return;
  }

  renderFeedItems(slice);

  feedState.cursor = end;
  feedState.isLoading = false;

  if (end >= feedData.length) {
    feedState.hasMore = false;
  }
}

/* ---------------------------------------------
   Render items into #feed
--------------------------------------------- */
function renderFeedItems(items) {
  const mount = document.querySelector("#feed");
  if (!mount) return;

  items.forEach(card => {
    const el = createFeedCard(card);
    mount.appendChild(el);
  });
}

/* ---------------------------------------------
   Infinite scroll sentinel
--------------------------------------------- */
export function setupInfiniteScroll() {
  const mount = document.querySelector("#feed");
  if (!mount) return;

  const sentinel = document.createElement("div");
  sentinel.id = "feed-sentinel";
  sentinel.style.height = "1px";
  sentinel.style.width = "100%";
  sentinel.style.marginTop = "40px";

  mount.appendChild(sentinel);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMoreFeed();
      }
    });
  });

  observer.observe(sentinel);
}

/* ---------------------------------------------
   Feed Card Factory (imported via global scope)
--------------------------------------------- */
import { createFeedCard } from "../../components/feed-card/feed-card.js";