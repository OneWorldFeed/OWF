export function renderRightPanel() {
  const container = document.querySelector("#right-global");
  if (!container) return;

  container.innerHTML = `
    <div class="right-card glow-warm time-weather-block">
      <div class="time-display">4:32 PM</div>
      <div class="weather-display">Los Angeles · 72°F · Clear</div>
    </div>

    <h3 class="right-section-title">Trending</h3>
    <div class="trending-list">
      <div class="trending-item">
        <div class="trending-rank">#1</div>
        <div class="trending-title">Global Climate Summit</div>
      </div>
      <div class="trending-item">
        <div class="trending-rank">#2</div>
        <div class="trending-title">New Music from Tokyo</div>
      </div>
    </div>

    <div class="right-divider"></div>

    <div class="ai-panel glow-cool">
      <div class="ai-title">OWF AI</div>
      <div class="ai-description">
        Ask anything, explore global insights, or generate ideas.
      </div>
    </div>
  `;
}
