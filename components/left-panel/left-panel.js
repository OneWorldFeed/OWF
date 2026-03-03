/* ============================================================
   OneWorldFeed • Left Panel Component
   Radio Player • Glow Selector • Global Signals
   ============================================================ */

import { renderRadioPlayer } from "/modules/radio/radio-player.js";
import { initGlobalSignals } from "/modules/right-panel/global-signals.js";

/* ------------------------------------------------------------
   Initialize Left Panel
------------------------------------------------------------ */
export function initLeftPanel() {
  renderRadioPlayer();             // Mounts the radio UI (fix: was initRadioPlayer)
  renderGlowSelector();            // Renders glow card + swatches
  applySavedGlowToLeftPlayer();    // Applies saved glow class
  initGlobalSignals();             // Mounts time/signals
}

/* ------------------------------------------------------------
   Render Glow Selector
------------------------------------------------------------ */
function renderGlowSelector() {
  const mount = document.querySelector("#left-glow-selector");
  if (!mount) return;

  const card = document.createElement("div");
  card.className = "glow-card";

  card.innerHTML = `
    <h3 class="glow-title">Glow</h3>

    <div class="glow-swatches">
      <div class="glow-swatch" data-glow="warm"></div>
      <div class="glow-swatch" data-glow="neutral"></div>
      <div class="glow-swatch" data-glow="cool"></div>
    </div>
  `;

  mount.appendChild(card);

  const swatches = card.querySelectorAll(".glow-swatch");

  swatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      const glow = swatch.dataset.glow;

      const radioCard = document.querySelector(".left-radio-card");
      if (!radioCard) return;

      radioCard.classList.remove("glow-warm", "glow-neutral", "glow-cool");
      radioCard.classList.add(`glow-${glow}`);

      localStorage.setItem("owfGlowPreference", glow);
    });
  });
}

/* ------------------------------------------------------------
   Apply saved glow on load
------------------------------------------------------------ */
function applySavedGlowToLeftPlayer() {
  const savedGlow = localStorage.getItem("owfGlowPreference");
  if (!savedGlow) return;

  const radioCard = document.querySelector(".left-radio-card");
  if (!radioCard) return;

  radioCard.classList.add(`glow-${savedGlow}`);
}
