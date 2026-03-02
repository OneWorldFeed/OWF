/* ============================================================
   FEED CARD COMPONENT — PHASE 4.4.4 (CINEMATIC FINAL)
   Creates a DOM element for any card type
   ============================================================ */

export function createFeedCard(card) {
  const el = document.createElement("article");
  el.classList.add("feed-card");

  // Glow variant
  if (card.glow) el.classList.add(`glow-${card.glow}`);

  // Card type
  if (card.type) el.classList.add(`${card.type}-card`);

  /* ------------------------------------------------------------
     HERO CARD (hero image first, no header required)
  ------------------------------------------------------------ */
  if (card.type === "hero" && card.hero) {
    const img = document.createElement("img");
    img.classList.add("hero-image");
    img.src = card.hero;
    el.appendChild(img);

    if (card.text) {
      const p = document.createElement("p");
      p.classList.add("card-text");
      p.textContent = card.text;
      el.appendChild(p);
    }

    return el;
  }

  /* ------------------------------------------------------------
     HEADER (author + time)
  ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     TEXT CONTENT
  ------------------------------------------------------------ */
  if (card.text) {
    const p = document.createElement("p");
    p.classList.add("card-text");
    p.textContent = card.text;
    el.appendChild(p);
  }

  /* ------------------------------------------------------------
     IMAGE CONTENT (image, mixed)
  ------------------------------------------------------------ */
  if (card.image) {
    const img = document.createElement("img");
    img.classList.add("card-image");
    img.src = card.image;
    el.appendChild(img);
  }

  /* ------------------------------------------------------------
     NEWS CARD
  ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------
     MUSIC CARD
  ------------------------------------------------------------ */
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
