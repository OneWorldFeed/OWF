/* ============================================================
   OWF RIGHT PANEL MODULE — PHASE 4.4.4 (Static Layout Version)
   Spotlight • Trending • AI • City Rows • Global Moments • Theme
   ============================================================ */

let spotlightData = [];
let citiesData = [];
let feedData = [];

/* ---------------------------------------------
   Load JSON at runtime
--------------------------------------------- */
async function loadData() {
  const [spotlightRes, citiesRes, feedRes] = await Promise.all([
    fetch("../data/spotlight.json"),
    fetch("../data/cities.json"),
    fetch("../data/feed.json")
  ]);

  spotlightData = await spotlightRes.json();
  citiesData = await citiesRes.json();
  feedData = await feedRes.json();
}

/* ---------------------------------------------
   Correct mount point for static layout
--------------------------------------------- */
function getMountPoint() {
  return document.querySelector("#right-global");
}

/* ---------------------------------------------
   Cinematic Card Wrapper
--------------------------------------------- */
function wrapCard(el) {
  el.classList.add("right-card");
  return el;
}

/* ---------------------------------------------
   Spotlight Card
--------------------------------------------- */
function renderSpotlight(item) {
  const card = document.createElement("div");
  card.className = "spotlight-card";

  card.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="content">
      <div class="title">${item.title}</div>
      <div class="subtitle">${item.subtitle}</div>
    </div>
  `;

  return card;
}

/* ---------------------------------------------
   Trending Tags
--------------------------------------------- */
function renderTrending() {
  const block = document.createElement("div");
  block.className = "trending-block";

  block.innerHTML = `<h3>Trending</h3>`;

  const list = document.createElement("div");

  const tagCounts = {};
  feedData.forEach(card => {
    card.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sorted = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  sorted.forEach(([tag, count]) => {
    const item = document.createElement("div");
    item.className = "trending-item";

    item.innerHTML = `
      <span class="label">#${tag}</span>
      <span class="count">${count}</span>
    `;

    list.appendChild(item);
  });

  block.appendChild(list);
  return block;
}

/* ---------------------------------------------
   AI Mini Assistant
--------------------------------------------- */
function renderAICard() {
  const card = document.createElement("div");
  card.className = "ai-card";

  card.innerHTML = `
    <h3 class="ai-title">AI Assistant</h3>
    <p class="ai-subtitle">Ask anything.</p>

    <div class="ai-input-row">
      <input type="text" class="ai-input" placeholder="Ask a question..." />
      <button class="ai-send-btn">Send</button>
    </div>

    <div class="ai-response"></div>
  `;

  const input = card.querySelector(".ai-input");
  const send = card.querySelector(".ai-send-btn");
  const output = card.querySelector(".ai-response");

  send.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;

    output.innerHTML = `<p class="ai-message">You asked: ${text}</p>`;
    input.value = "";
  });

  return card;
}

/* ---------------------------------------------
   City Row
--------------------------------------------- */
function renderCityRow(city) {
  const row = document.createElement("div");
  row.className = "city-row";

  const now = new Date();
  const localTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: city.timezone
  });

  row.innerHTML = `
    <div class="left">
      <div class="city-name">${city.name}</div>
      <div class="city-time">${localTime}</div>
    </div>
    <div class="temp">${city.temp ?? "--"}°</div>
  `;

  return row;
}

/* ---------------------------------------------
   Global Moments Card
--------------------------------------------- */
function renderMoment(moment) {
  const card = document.createElement("div");
  card.className = "moment-card";
  card.style.backgroundImage = `url(${moment.image})`;

  card.innerHTML = `
    <div class="overlay"></div>
    <div class="label">${moment.label}</div>
  `;

  return card;
}

/* ---------------------------------------------
   Theme Selector (Option C)
--------------------------------------------- */
function renderThemeSelector() {
  const card = document.createElement("div");
  card.className = "theme-card";

  card.innerHTML = `
    <h3 class="theme-title">Theme</h3>

    <div class="theme-swatches">
      <div class="theme-swatch" data-theme="dawn"></div>
      <div class="theme-swatch" data-theme="day"></div>
      <div class="theme-swatch" data-theme="sunset"></div>
      <div class="theme-swatch" data-theme="midnight"></div>
    </div>
  `;

  const swatches = card.querySelectorAll(".theme-swatch");

  swatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      const theme = swatch.dataset.theme;

      document.body.classList.remove(
        "theme-dawn",
        "theme-day",
        "theme-sunset",
        "theme-midnight"
      );

      document.body.classList.add(`theme-${theme}`);
      document.body.style.transition = "background 0.6s ease, color 0.6s ease";
    });
  });

  return card;
}

/* ---------------------------------------------
   Routes that should show the right panel
--------------------------------------------- */
const RIGHT_PANEL_ROUTES = [
  "home",
  "social",
  "news",
  "discover",
  "music",
  "podcasts",
  "live",
  "ai"
];

/* ---------------------------------------------
   Main Render Function
--------------------------------------------- */
export async function renderRightPanel() {
  const route = location.hash.replace("#/", "") || "home";

  if (!RIGHT_PANEL_ROUTES.includes(route)) {
    const mount = getMountPoint();
    if (mount) mount.innerHTML = "";
    return;
  }

  await loadData();

  const mount = getMountPoint();
  if (!mount) return;

  mount.innerHTML = "";

  /* Spotlight */
  if (spotlightData[0]) {
    mount.appendChild(wrapCard(renderSpotlight(spotlightData[0])));
  }

  /* Trending */
  mount.appendChild(wrapCard(renderTrending()));

  /* AI Assistant */
  mount.appendChild(wrapCard(renderAICard()));

  /* City Rows */
  citiesData.slice(0, 3).forEach(city => {
    mount.appendChild(wrapCard(renderCityRow(city)));
  });

  /* Global Moments Header */
  const header = document.createElement("div");
  header.className = "right-panel-title";
  header.textContent = "Global Moments";
  mount.appendChild(header);

  /* Global Moments */
  feedData.slice(0, 3).forEach(card => {
    mount.appendChild(
      wrapCard(
        renderMoment({
          image: card.image,
          label: card.city || card.location || "Global Moment"
        })
      )
    );
  });

  /* Theme Selector — ALWAYS LAST */
  mount.appendChild(wrapCard(renderThemeSelector()));
}

/* ---------------------------------------------
   Auto-render on route changes
--------------------------------------------- */
window.addEventListener("hashchange", renderRightPanel);
window.addEventListener("owf:view-loaded", renderRightPanel);
