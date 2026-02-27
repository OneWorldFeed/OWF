/* ============================================================
   OWF FEED CARD ENGINE — PHASE 4.4.4
   Cinematic Hybrid • Deep Rounded • Adaptive Themes
   Generates all card types for the Home feed.
   ============================================================ */

/* ------------------------------------------------------------
   Base card wrapper
   ------------------------------------------------------------ */
function createBaseCard(className = "") {
  const card = document.createElement("div");
  card.className = `feed-card ${className}`;
  return card;
}

/* ------------------------------------------------------------
   HERO MOMENT CARD
   ------------------------------------------------------------ */
export function createHeroCard({ image, title, subtitle }) {
  const card = createBaseCard("hero-card");

  card.innerHTML = `
    <img class="hero-image" src="${image}" alt="">
    <div class="hero-content">
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
  `;

  return card;
}

/* ------------------------------------------------------------
   GLOBAL MOMENT CARD
   ------------------------------------------------------------ */
export function createMomentCard({ image, caption }) {
  const card = createBaseCard("moment-card");

  card.innerHTML = `
    <img class="moment-image" src="${image}" alt="">
    <div class="moment-caption">${caption}</div>
  `;

  return card;
}

/* ------------------------------------------------------------
   TEXT EDITORIAL CARD
   ------------------------------------------------------------ */
export function createTextCard({ title, body }) {
  const card = createBaseCard("text-card");

  card.innerHTML = `
    <h2>${title}</h2>
    <p>${body}</p>
  `;

  return card;
}

/* ------------------------------------------------------------
   IMAGE + TEXT HYBRID CARD
   ------------------------------------------------------------ */
export function createImageTextCard({ image, title, body }) {
  const card = createBaseCard("image-text-card");

  card.innerHTML = `
    <img class="card-image" src="${image}" alt="">
    <h2>${title}</h2>
    <p>${body}</p>
  `;

  return card;
}

/* ------------------------------------------------------------
   NEWS CARD
   ------------------------------------------------------------ */
export function createNewsCard({ headline, source }) {
  const card = createBaseCard("news-card");

  card.innerHTML = `
    <h3>${headline}</h3>
    <div class="source">${source}</div>
  `;

  return card;
}

/* ------------------------------------------------------------
   MUSIC CARD
   ------------------------------------------------------------ */
export function createMusicCard({ image, track, artist }) {
  const card = createBaseCard("music-card");

  card.innerHTML = `
    <img src="${image}" alt="">
    <div>
      <div class="track-title">${track}</div>
      <div class="artist">${artist}</div>
    </div>
  `;

  return card;
}

/* ------------------------------------------------------------
   WEATHER CARD
   ------------------------------------------------------------ */
export function createWeatherCard({ city, temp }) {
  const card = createBaseCard("weather-card");

  card.innerHTML = `
    <div class="temp">${temp}°</div>
    <div class="city">${city}</div>
  `;

  return card;
}

/* ------------------------------------------------------------
   LIVE TILE
   ------------------------------------------------------------ */
export function createLiveCard({ title, description }) {
  const card = createBaseCard("live-card");

  card.innerHTML = `
    <div class="live-label">LIVE</div>
    <h2>${title}</h2>
    <p>${description}</p>
  `;

  return card;
}

/* ------------------------------------------------------------
   TRENDING CARD
   ------------------------------------------------------------ */
export function createTrendingCard({ items }) {
  const card = createBaseCard("trending-card");

  const list = items
    .map(item => `<li>#${item.tag} (${item.count})</li>`)
    .join("");

  card.innerHTML = `
    <h2>Trending</h2>
    <ul>${list}</ul>
  `;

  return card;
}
