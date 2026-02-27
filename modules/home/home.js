/* ============================================================
   OWF HOME FEED LOADER — PHASE 4.4.4
   Cinematic Hybrid • Static + Dynamic Cards
   Injects cards into #feed after layout.js builds the grid.
   ============================================================ */

import {
  createHeroCard,
  createMomentCard,
  createTextCard,
  createImageTextCard,
  createNewsCard,
  createMusicCard,
  createWeatherCard,
  createLiveCard,
  createTrendingCard
} from "../../components/feed-card/feed-cards.js";

/* ------------------------------------------------------------
   MAIN ENTRY POINT
   Called by router.js when route === "home"
   ------------------------------------------------------------ */
export function loadHomeFeed() {
  const feed = document.querySelector("#feed");
  if (!feed) return;

  feed.innerHTML = ""; // reset feed

  /* ------------------------------------------------------------
     STATIC CINEMATIC CARDS (guaranteed content)
     ------------------------------------------------------------ */

  feed.appendChild(
    createHeroCard({
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      title: "Sunrise in Tokyo",
      subtitle: "A new day begins across the Pacific."
    })
  );

  feed.appendChild(
    createMomentCard({
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      caption: "Morning light over Shibuya Crossing."
    })
  );

  feed.appendChild(
    createImageTextCard({
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      title: "Pacific Winds",
      body: "Warm currents sweep across the ocean as the world wakes up."
    })
  );

  feed.appendChild(
    createTextCard({
      title: "Global Pulse",
      body: "From Los Angeles to Tokyo, the rhythm of the world moves in waves—culture, weather, music, and human connection."
    })
  );

  /* ------------------------------------------------------------
     NEWS + MUSIC + WEATHER (static demo)
     ------------------------------------------------------------ */

  feed.appendChild(
    createNewsCard({
      headline: "Japan Markets Open Higher",
      source: "Nikkei Asia • 12m ago"
    })
  );

  feed.appendChild(
    createMusicCard({
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
      track: "Midnight Echoes",
      artist: "Luna Waves"
    })
  );

  feed.appendChild(
    createWeatherCard({
      city: "Tokyo",
      temp: 72
    })
  );

  /* ------------------------------------------------------------
     LIVE TILE
     ------------------------------------------------------------ */

  feed.appendChild(
    createLiveCard({
      title: "Live: Tokyo Street Cam",
      description: "Shibuya is waking up. Watch the morning rush unfold."
    })
  );

  /* ------------------------------------------------------------
     TRENDING (static demo)
     ------------------------------------------------------------ */

  feed.appendChild(
    createTrendingCard({
      items: [
        { tag: "tokyo", count: 1 },
        { tag: "sunrise", count: 1 },
        { tag: "global", count: 1 }
      ]
    })
  );

  /* ------------------------------------------------------------
     DYNAMIC CARDS (JSON/API-ready)
     ------------------------------------------------------------ */

  loadDynamicFeed(feed);
}

/* ------------------------------------------------------------
   DYNAMIC FEED LOADER
   Replace this with real API calls later.
   ------------------------------------------------------------ */
async function loadDynamicFeed(feed) {
  try {
    const res = await fetch("/data/feed.json");
    if (!res.ok) return;

    const items = await res.json();

    items.forEach(item => {
      if (item.type === "news") {
        feed.appendChild(
          createNewsCard({
            headline: item.headline,
            source: item.source
          })
        );
      }

      if (item.type === "moment") {
        feed.appendChild(
          createMomentCard({
            image: item.image,
            caption: item.caption
          })
        );
      }
    });
  } catch (err) {
    console.warn("Dynamic feed failed:", err);
  }
}
