/* ============================================================
   FEED CARD COMPONENT — PHASE 4.4.4 (CINEMATIC)
   Creates a DOM element for any card type
   ============================================================ */

export function createFeedCard(card) {
  const el = document.createElement("article");
  el.classList.add("feed-card");

  // Glow variant
  if (card.glow) el.classList.add(`glow-${card.glow}`);

  // Card type
  el.classList.add(`${card.type}-card`);

  // Header (optional)
  if (card.author) {
    const header = document.createElement("div");
    header.classList.add("card-header");

    header.innerHTML = `
      <div class="avatar"></div>
      <div class="meta">
        <h3>${card.author}</h3>
        <span>${card.time || ""}</span>
      </div>
    `;

    el.appendChild(header);
  }

  // Text content
  if (card.text) {
    const p = document.createElement("p");
    p.classList.add("card-text");
    p.textContent = card.text;
    el.appendChild(p);
  }

  // Image content
  if (card.image) {
    const img = document.createElement("img");
    img.classList.add("card-image");
    img.src = card.image;
    el.appendChild(img);
  }

  // Hero image
  if (card.hero) {
    const img = document.createElement("img");
    img.classList.add("hero-image");
    img.src = card.hero;
    el.appendChild(img);
  }

  // News title + summary
  if (card.newsTitle) {
    const title = document.createElement("h2");
    title.classList.add("news-title");
    title.textContent = card.newsTitle;
    el.appendChild(title);
  }

  if (card.newsSummary) {
    const summary = document.createElement("p");
    summary.classList.add("news-summary");
    summary.textContent = card.newsSummary;
    el.appendChild(summary);
  }

  // Music card
  if (card.type === "music") {
    const player = document.createElement("div");
    player.classList.add("music-player");

    player.innerHTML = `
      <button class="play-btn">▶</button>
      <div class="progress-bar"></div>
    `;

    el.appendChild(player);
  }

  return el;
}
