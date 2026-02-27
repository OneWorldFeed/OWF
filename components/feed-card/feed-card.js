/* ============================================================
   OWF FEED CARD COMPONENT — PHASE 4.4.4
   Auto‑renders feed cards into #feed using feed.json
   ============================================================ */

import feedData from "../../data/feed.json" assert { type: "json" };

/* ---------------------------------------------
   Create a single Feed Card DOM element
--------------------------------------------- */
function createFeedCard(card) {
  const el = document.createElement("div");
  el.className = "feed-card";

  el.innerHTML = `
    <div class="feed-card-header">
      <img class="avatar" src="${card.avatar}" alt="${card.name}">
      <div class="meta">
        <div class="name">${card.name}</div>
        <div class="city-time">${card.city} • ${card.time}</div>
      </div>
    </div>

    <img class="feed-card-media" src="${card.image}" alt="${card.caption}">

    <p class="feed-card-caption">${card.caption}</p>

    <div class="feed-card-tags">
      ${card.tags?.map(tag => `<span class="feed-card-tag">#${tag}</span>`).join("")}
    </div>

    <div class="feed-card-engagement">
      <button class="like-btn">❤️ ${card.likes}</button>
      <button class="comment-btn">💬 ${card.comments}</button>
      <button class="share-btn">↗️ Share</button>
    </div>
  `;

  return el;
}

/* ---------------------------------------------
   Render all feed cards into #feed
--------------------------------------------- */
export function renderFeed() {
  const mount = document.querySelector("#feed");
  if (!mount) return;

  mount.innerHTML = ""; // Clear existing content

  feedData.forEach(card => {
    mount.appendChild(createFeedCard(card));
  });
}

/* ---------------------------------------------
   Auto‑mount on DOM ready
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", renderFeed);
