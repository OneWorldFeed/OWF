/* ============================================================
   OWF RIGHT PANEL MODULE — PHASE 4.4.4
   Spotlight • Trending • City Rows • Global Moments
   Auto‑renders into #right-panel or #global-moments
   ============================================================ */

import spotlightData from "../../data/spotlight.json" assert { type: "json" };
import citiesData from "../../data/cities.json" assert { type: "json" };
import feedData from "../../data/feed.json" assert { type: "json" };

/* ---------------------------------------------
   Root mount point
--------------------------------------------- */
function getMountPoint() {
  return (
    document.querySelector("#right-panel") ||
    document.querySelector("#global-moments")
  );
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
   Trending List
--------------------------------------------- */
function renderTrending() {
  const block = document.createElement("div");
  block.className = "trending-block";

  block.innerHTML = `<h3>Trending</h3>`;

  const list = document.createElement("div");

  // Count tag frequency from feed.json
  const tagCounts = {};
  feedData.forEach(card => {
    card.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Convert to sorted array
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
   City Row (Time + Weather)
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
    <div class="temp">${city.temp || "--"}°</div>
  `;

  return row;
}

/* ---------------------------------------------
   Global Moments Blocks
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
   Main Render Function
--------------------------------------------- */
export function renderRightPanel() {
  const mount = getMountPoint();
  if (!mount) return;

  mount.innerHTML = ""; // Clear existing content

  /* Spotlight */
  if (spotlightData[0]) {
    mount.appendChild(renderSpotlight(spotlightData[0]));
  }

  /* Trending */
  mount.appendChild(renderTrending());

  /* City Rows */
  citiesData.slice(0, 3).forEach(city => {
    mount.appendChild(renderCityRow(city));
  });

  /* Global Moments */
  const momentsHeader = document.createElement("div");
  momentsHeader.className = "right-panel-title";
  momentsHeader.textContent = "Global Moments";
  mount.appendChild(momentsHeader);

  feedData.slice(0, 3).forEach(card => {
    mount.appendChild(
      renderMoment({
        image: card.image,
        label: card.city
      })
    );
  });
}

/* ---------------------------------------------
   Auto‑mount on load
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", renderRightPanel);
