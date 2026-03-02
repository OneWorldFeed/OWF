/* ============================================================
   OneWorldFeed — Cinematic Global Stylesheet (Phase 4.4.4)
   Light-mode default • Inter/SF • Deep-rounded • Glow system
   ============================================================ */

/* ------------------------------------------------------------
   1. RESET + BASELINE
------------------------------------------------------------ */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text",
               "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

/* ------------------------------------------------------------
   2. GLOBAL TOKENS
------------------------------------------------------------ */
:root {
  /* Light-mode default */
  --bg: #f7f7f8;
  --bg-elevated: #ffffff;
  --bg-subtle: #f1f1f3;

  --text: #1a1a1c;
  --text-dim: #555;
  --text-soft: #777;

  /* Cinematic radii */
  --radius-sm: 10px;
  --radius-md: 18px;
  --radius-lg: 26px;
  --radius-xl: 36px;

  /* Glow colors */
  --glow-warm: rgba(255, 200, 150, 0.55);
  --glow-neutral: rgba(200, 200, 255, 0.45);
  --glow-cool: rgba(150, 200, 255, 0.45);

  /* Shadows */
  --shadow-soft: 0 4px 18px rgba(0,0,0,0.08);
  --shadow-card: 0 6px 24px rgba(0,0,0,0.10);

  /* Transitions */
  --fade: 0.35s ease;
  --fade-slow: 0.6s ease;
  --hover-lift: translateY(-2px);
}

/* ------------------------------------------------------------
   3. APP GRID (3-COLUMN LAYOUT)
------------------------------------------------------------ */
#owf-app {
  display: grid;
  grid-template-columns: 260px 1fr 320px;
  height: 100vh;
  overflow: hidden;
}

/* ------------------------------------------------------------
   4. LEFT PANEL (STATIC)
------------------------------------------------------------ */
.owf-left-panel {
  background: var(--bg-elevated);
  border-right: 1px solid #e5e5e7;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.owf-logo {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
}

.left-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  padding: 10px 14px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text);
  font-size: 15px;
  transition: var(--fade);
}

.nav-item:hover {
  background: var(--bg-subtle);
  transform: var(--hover-lift);
}

/* ------------------------------------------------------------
   5. CENTER COLUMN
------------------------------------------------------------ */
.owf-center {
  overflow-y: auto;
  padding: 24px 40px;
}

/* ------------------------------------------------------------
   6. GLOBAL HEADER
------------------------------------------------------------ */
.owf-global-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-elevated);
  padding: 16px 20px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-soft);
  margin-bottom: 28px;
}

.post-input,
.search-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  border: 1px solid #ddd;
  background: var(--bg-subtle);
  transition: var(--fade);
}

.post-input:focus,
.search-input:focus {
  outline: none;
  border-color: #aaa;
  background: #fff;
}

/* ------------------------------------------------------------
   7. COMPOSER
------------------------------------------------------------ */
.composer {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-elevated);
  padding: 16px 20px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-soft);
  margin-bottom: 20px;
}

.composer-avatar {
  width: 42px;
  height: 42px;
  background: #ddd;
  border-radius: 50%;
}

.composer-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  border: 1px solid #ddd;
  background: var(--bg-subtle);
}

.composer-post-btn {
  padding: 10px 18px;
  border-radius: var(--radius-md);
  background: #1a1a1c;
  color: white;
  border: none;
  cursor: pointer;
  transition: var(--fade);
}

.composer-post-btn:hover {
  opacity: 0.85;
}

/* ------------------------------------------------------------
   8. FEED FILTERS
------------------------------------------------------------ */
.feed-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filter {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  background: var(--bg-subtle);
  border: none;
  cursor: pointer;
  transition: var(--fade);
}

.filter.active {
  background: #1a1a1c;
  color: white;
}

.filter:hover {
  background: #e5e5e7;
}

/* ------------------------------------------------------------
   9. FEED CARDS
------------------------------------------------------------ */
.feed {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feed-card {
  background: var(--bg-elevated);
  padding: 20px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  transition: var(--fade);
}

.feed-card:hover {
  transform: var(--hover-lift);
}

/* Glow variants */
.glow-warm { box-shadow: 0 0 32px var(--glow-warm); }
.glow-neutral { box-shadow: 0 0 32px var(--glow-neutral); }
.glow-cool { box-shadow: 0 0 32px var(--glow-cool); }

/* Card header */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.card-header .avatar {
  width: 38px;
  height: 38px;
  background: #ccc;
  border-radius: 50%;
}

.card-header .meta h3 {
  font-size: 15px;
  font-weight: 600;
}

.card-header .meta span {
  font-size: 13px;
  color: var(--text-soft);
}

/* Hero card */
.hero-image {
  width: 100%;
  border-radius: var(--radius-lg);
  margin-bottom: 14px;
}

/* Image card */
.card-image {
  width: 100%;
  border-radius: var(--radius-lg);
  margin-top: 12px;
}

/* Music player */
.music-player {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.play-btn {
  padding: 8px 14px;
  border-radius: var(--radius-md);
  background: #1a1a1c;
  color: white;
  border: none;
  cursor: pointer;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #ddd;
  border-radius: 4px;
}

/* ------------------------------------------------------------
   10. RIGHT PANEL
------------------------------------------------------------ */
.owf-right-panel {
  background: var(--bg-elevated);
  border-left: 1px solid #e5e5e7;
  padding: 24px 20px;
  overflow-y: auto;
}

/* ------------------------------------------------------------
   11. SCROLLBAR (Cinematic)
------------------------------------------------------------ */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
