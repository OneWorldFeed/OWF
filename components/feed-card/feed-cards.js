/* ============================================================
   OWF FEED CARDS — PHASE 4.4.4
   Card factory functions • Glow token integration
   Supports: hero, moment, text, image-text, news, music,
             weather, live, trending
   ============================================================ */

/* ------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------ */

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

/**
 * Generate a self-contained SVG placeholder as a data URI.
 * Used when the real image is missing — no network call needed.
 */
function makePlaceholderSrc(label = "", color = "#d0d8e4") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
    <rect width="800" height="400" fill="${color}"/>
    <circle cx="370" cy="175" r="36" fill="none" stroke="#aab4c0" stroke-width="3"/>
    <line x1="356" y1="175" x2="384" y2="175" stroke="#aab4c0" stroke-width="3" stroke-linecap="round"/>
    <line x1="370" y1="161" x2="370" y2="189" stroke="#aab4c0" stroke-width="3" stroke-linecap="round"/>
    <text x="400" y="255" font-family="system-ui,sans-serif" font-size="18" fill="#8a96a3" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Placeholder colors per glow variant.
 */
const PLACEHOLDER_COLORS = {
  warm:    "#f0e6dc",
  neutral: "#e8eaed",
  cool:    "#d8e6f0"
};

/**
 * Create an <img> with an onerror SVG placeholder fallback.
 * Never makes external network requests.
 */
function makeImg(src, alt = "", className = "", glowVariant = "neutral") {
  const img = document.createElement("img");
  img.alt = alt;
  if (className) img.className = className;
  img.loading = "lazy";

  const placeholder = makePlaceholderSrc(alt, PLACEHOLDER_COLORS[glowVariant] || "#e8eaed");

  if (src) {
    img.src = src;
    img.onerror = () => { img.src = placeholder; };
  } else {
    img.src = placeholder;
  }

  return img;
}

function makeCard(type, { glow = "neutral", mood, live, active } = {}) {
  const el = document.createElement("div");
  el.classList.add("feed-card", `${type}-card`);
  if (glow)   el.dataset.variant = glow;
  if (mood)   el.dataset.mood    = mood;
  if (live)   el.dataset.live    = "";
  if (active) el.dataset.active  = "";
  el.dataset.time = getTimeOfDay();
  return el;
}

/* ------------------------------------------------------------
   HERO CARD
   ------------------------------------------------------------ */
export function createHeroCard({ image, title, subtitle, glow = "warm", mood } = {}) {
  const card = makeCard("hero", { glow, mood });
  const wrap = document.createElement("div");
  wrap.className = "hero-image-wrap";

  wrap.appendChild(makeImg(image, title || "Hero image", "hero-image", glow));

  const overlay = document.createElement("div");
  overlay.className = "hero-overlay";
  wrap.appendChild(overlay);

  const content = document.createElement("div");
  content.className = "hero-content";
  if (title)    content.innerHTML += `<h1 class="hero-title">${title}</h1>`;
  if (subtitle) content.innerHTML += `<p class="hero-subtitle">${subtitle}</p>`;
  wrap.appendChild(content);

  card.appendChild(wrap);
  return card;
}

/* ------------------------------------------------------------
   MOMENT CARD
   ------------------------------------------------------------ */
export function createMomentCard({ image, caption, glow = "neutral", mood } = {}) {
  const card = makeCard("moment", { glow, mood });
  card.appendChild(makeImg(image, caption || "Global moment", "moment-image", glow));
  if (caption) {
    const p = document.createElement("p");
    p.className = "moment-caption";
    p.textContent = caption;
    card.appendChild(p);
  }
  return card;
}

/* ------------------------------------------------------------
   TEXT CARD
   ------------------------------------------------------------ */
export function createTextCard({ title, body, author, time, glow = "neutral", mood } = {}) {
  const card = makeCard("text", { glow, mood });
  if (author || time) {
    card.innerHTML += `<div class="card-meta">
      ${author ? `<span class="card-author">${author}</span>` : ""}
      ${time   ? `<span class="card-time">${time}</span>`     : ""}
    </div>`;
  }
  if (title) card.innerHTML += `<h2 class="card-title">${title}</h2>`;
  if (body)  card.innerHTML += `<p class="card-body">${body}</p>`;
  return card;
}

/* ------------------------------------------------------------
   IMAGE + TEXT CARD
   ------------------------------------------------------------ */
export function createImageTextCard({ image, title, body, author, time, glow = "cool", mood } = {}) {
  const card = makeCard("image-text", { glow, mood });

  if (author || time) {
    const meta = document.createElement("div");
    meta.className = "card-meta";
    if (author) meta.innerHTML += `<span class="card-author">${author}</span>`;
    if (time)   meta.innerHTML += `<span class="card-time">${time}</span>`;
    card.appendChild(meta);
  }

  if (title) {
    const h = document.createElement("h2");
    h.className = "card-title";
    h.textContent = title;
    card.appendChild(h);
  }

  card.appendChild(makeImg(image, title || "Post image", "card-image", glow));

  if (body) {
    const p = document.createElement("p");
    p.className = "card-body";
    p.textContent = body;
    card.appendChild(p);
  }

  return card;
}

/* ------------------------------------------------------------
   NEWS CARD
   ------------------------------------------------------------ */
export function createNewsCard({ headline, source, summary, glow = "neutral", mood } = {}) {
  const card = makeCard("news", { glow, mood });
  if (source)   card.innerHTML += `<p class="news-source">${source}</p>`;
  if (headline) card.innerHTML += `<h3 class="news-headline">${headline}</h3>`;
  if (summary)  card.innerHTML += `<p class="news-summary">${summary}</p>`;
  return card;
}

/* ------------------------------------------------------------
   MUSIC CARD
   ------------------------------------------------------------ */
export function createMusicCard({ image, track, artist, author, time, glow = "cool", mood } = {}) {
  const card = makeCard("music", { glow, mood });

  if (image) {
    card.appendChild(makeImg(image, track || "Album art", "music-art", glow));
  }

  const info = document.createElement("div");
  info.className = "music-info";
  if (author || time) {
    info.innerHTML += `<div class="card-meta">
      ${author ? `<span class="card-author">${author}</span>` : ""}
      ${time   ? `<span class="card-time">${time}</span>`     : ""}
    </div>`;
  }
  if (track)  info.innerHTML += `<p class="track-title">${track}</p>`;
  if (artist) info.innerHTML += `<p class="artist">${artist}</p>`;
  card.appendChild(info);
  return card;
}

/* ------------------------------------------------------------
   WEATHER CARD
   ------------------------------------------------------------ */
export function createWeatherCard({ city, temp, glow = "cool" } = {}) {
  const card = makeCard("weather", { glow });
  card.innerHTML = `
    <span class="city">${city || "—"}</span>
    <span class="temp">${temp != null ? `${temp}°` : "—"}</span>
  `;
  return card;
}

/* ------------------------------------------------------------
   LIVE CARD
   ------------------------------------------------------------ */
export function createLiveCard({ title, description, glow = "warm" } = {}) {
  const card = makeCard("live", { glow, live: true });
  card.innerHTML = `
    <p class="live-label">● LIVE</p>
    ${title       ? `<h3 class="live-title">${title}</h3>`     : ""}
    ${description ? `<p class="live-desc">${description}</p>` : ""}
  `;
  return card;
}

/* ------------------------------------------------------------
   TRENDING CARD
   ------------------------------------------------------------ */
export function createTrendingCard({ items = [], glow = "neutral" } = {}) {
  const card = makeCard("trending", { glow });
  const list = items.map(i => `<li class="trending-item">#${i.tag}</li>`).join("");
  card.innerHTML = `
    <h3 class="trending-title">Trending</h3>
    <ul class="trending-list">${list}</ul>
  `;
  return card;
}

/* ------------------------------------------------------------
   UNIVERSAL FACTORY — used by feed-loader.js
   ------------------------------------------------------------ */
export function createFeedCard(item) {
  const glow = item.glow || "neutral";
  const mood = item.mood || undefined;

  switch (item.type) {
    case "hero":
      return createHeroCard({
        image:    item.hero || item.image,
        title:    item.title,
        subtitle: item.subtitle || item.text,
        glow, mood
      });
    case "moment":
      return createMomentCard({
        image:   item.image,
        caption: item.caption || item.text,
        glow, mood
      });
    case "text":
      return createTextCard({
        title: item.title, body: item.text,
        author: item.author, time: item.time,
        glow, mood
      });
    case "image":
    case "mixed":
      return createImageTextCard({
        image:  item.image,
        title:  item.title,
        body:   item.text,
        author: item.author,
        time:   item.time,
        glow, mood
      });
    case "news":
      return createNewsCard({
        headline: item.newsTitle   || item.headline,
        source:   item.newsSource  || item.source || item.author,
        summary:  item.newsSummary || item.summary,
        glow, mood
      });
    case "music":
      return createMusicCard({
        image:  item.image,
        track:  item.track  || item.text,
        artist: item.artist,
        author: item.author,
        time:   item.time,
        glow, mood
      });
    case "weather":
      return createWeatherCard({ city: item.city, temp: item.temp, glow });
    case "live":
      return createLiveCard({
        title: item.title, description: item.description || item.text, glow
      });
    case "trending":
      return createTrendingCard({ items: item.items || [], glow });
    default:
      return createTextCard({ body: item.text || JSON.stringify(item), glow });
  }
}
