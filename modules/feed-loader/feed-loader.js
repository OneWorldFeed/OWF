/* ============================================================
   FEED LOADER — PHASE 4.4.4
   Loads feed.json and renders cards into #feed
   ============================================================ */

import { createFeedCard } from "/components/feed-card/feed-cards.js";

export async function loadInitialFeed() {
  const feedEl = document.querySelector("#feed");
  if (!feedEl) return;

  try {
    const res = await fetch("/data/feed.json");
    const cards = await res.json();

    feedEl.innerHTML = "";

    cards.forEach(card => {
      const el = createFeedCard(card);
      feedEl.appendChild(el);
    });

  } catch (err) {
    console.error("Feed load error:", err);
  }
}
