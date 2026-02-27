/* ============================================================
   OWF FEED LOADER — PHASE 4.4.4
   Pagination • Infinite Scroll • Component Hydration
   ============================================================ */

import feedData from "../../data/feed.json" assert { type: "json" };
import { createFeedCard } from "../cards/feed-card.js";

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
export function loadInitialFeed() {
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
    mount.appendChild(createFeedCard(card));
  });
}

/* ---------------------------------------------
   Infinite scroll sentinel
--------------------------------------------- */
function setupInfiniteScroll() {
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
   Removed auto-mount — hydration handled by app.js
--------------------------------------------- */
