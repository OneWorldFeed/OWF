/* ============================================================
   FEED CARD COMPONENT — PHASE 4.4.4 (CINEMATIC FINAL)
   Creates a DOM element for any card type
   ============================================================ */

/* ------------------------------------------------------------
   PLACEHOLDER IMAGE GENERATOR
   Canvas-based fallback for broken/missing images.
   Works fully offline, no external deps.
------------------------------------------------------------ */
const PLACEHOLDER_PALETTES = [
  ["#1a2340", "#3a4a6a"],
  ["#2a1a0a", "#6a3a1a"],
  ["#0a2a1a", "#1a6a3a"],
  ["#1a0a2a", "#4a1a6a"],
  ["#2a2a0a", "#6a6a1a"],
];

function generatePlaceholder(label = "") {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext("2d");

  // Pick a consistent palette based on label text
  const idx = Math.abs(
    label.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  ) % PLACEHOLDER_PALETTES.length;
  const [colorA, colorB] = PLACEHOLDER_PALETTES[idx];

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 800, 450);
  grad.addColorStop(0, colorA);
  grad.addColorStop(1, colorB);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 450);

  // Subtle grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < 800; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 450); ctx.stroke();
  }
  for (let y = 0; y < 450; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
  }

  // Image icon
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🖼", 400, 200);

  // Label
  if (label) {
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "14px -apple-system, sans-serif";
    ctx.fillText(label, 400, 265);
  }

  return canvas.toDataURL("image/png");
}

function attachPlaceholder(img, label) {
  img.onerror = () => {
    img.onerror = null; // prevent infinite loop if placeholder also fails
    img.src = generatePlaceholder(label);
  };
}

/* ------------------------------------------------------------
   CARD FACTORY
------------------------------------------------------------ */
export function createFeedCard(card) {
  const el = document.createElement("article");
  el.classList.add("feed-card");

  if (card.glow) el.classList.add(`glow-${card.glow}`);
  if (card.type) el.classList.add(`${card.type}-card`);

  /* ----------------------------------------------------------
     HERO CARD
  ---------------------------------------------------------- */
  if (card.type === "hero" && card.hero) {
    const img = document.createElement("img");
    img.classList.add("hero-image");
    img.src = card.hero;
    img.alt = card.text || "Hero image";
    attachPlaceholder(img, card.text || "Hero Image");
    el.appendChild(img);

    if (card.text) {
      const p = document.createElement("p");
      p.classList.add("card-text");
      p.textContent = card.text;
      el.appendChild(p);
    }

    return el;
  }

  /* ----------------------------------------------------------
     HEADER (author + time)
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     TEXT CONTENT
  ---------------------------------------------------------- */
  if (card.text) {
    const p = document.createElement("p");
    p.classList.add("card-text");
    p.textContent = card.text;
    el.appendChild(p);
  }

  /* ----------------------------------------------------------
     IMAGE CONTENT
  ---------------------------------------------------------- */
  if (card.image) {
    const img = document.createElement("img");
    img.classList.add("card-image");
    img.src = card.image;
    img.alt = card.text || card.author || "Post image";
    attachPlaceholder(img, card.author || "Image");
    el.appendChild(img);
  }

  /* ----------------------------------------------------------
     NEWS CARD
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     MUSIC CARD
  ---------------------------------------------------------- */
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
