# OWF — One World Feed

> A personalised global news and social media SPA built with vanilla JavaScript, CSS, and Vite.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Module System](#module-system)
5. [Theme System](#theme-system)
6. [Component System](#component-system)
7. [Data Flow](#data-flow)
8. [Router](#router)

---

## Project Overview

**OWF (One World Feed)** is a single-page application that aggregates news, social posts, music, podcasts, live events, and AI-curated content into a unified, mood-aware feed. Users can filter content by mood, geographic region, city, or topic tag. A spotlight panel surfaces featured stories, and a trending widget surfaces popular tags in real time.

Key goals:
- Zero framework dependencies — pure vanilla JS with ES modules.
- Fast initial load via Vite's dev-server and optimised production build.
- Fully themeable through CSS custom properties.
- Accessible (WCAG 2.1 AA target) with semantic HTML and ARIA attributes.
- Firebase-ready: Firestore for live feed data, Firebase Auth for user accounts.

---

## Technology Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Language       | Vanilla JavaScript (ES2022+)        |
| Styling        | CSS3 with custom properties         |
| Bundler/Dev    | Vite 5                              |
| Backend/DB     | Firebase (Firestore + Auth + Storage) |
| Hosting        | Firebase Hosting                    |
| Data           | JSON flat-files (dev) / Firestore (prod) |
| Runtime        | Modern browsers (Chrome, Firefox, Safari, Edge) |

---

## Directory Structure

```
OWF/
├── index.html              # SPA shell — single HTML entry point
├── app.js                  # Root JS module; boots all other modules
├── styles.css              # Root CSS; imports global partials + layout
├── package.json
├── ARCHITECTURE.md
│
├── config/
│   ├── vite.config.js      # Vite configuration
│   ├── .firebaserc         # Firebase project aliases
│   ├── .gitignore
│   └── .replit             # Replit workspace config
│
├── data/                   # Static JSON data (used in dev / as seed data)
│   ├── feed.json           # Sample feed cards
│   ├── moods.json          # Mood definitions
│   ├── cities.json         # City metadata
│   ├── tags.json           # Tag definitions
│   └── spotlight.json      # Featured spotlight items
│
└── assets/
    ├── css/
    │   ├── global/         # Base styles imported by styles.css
    │   │   ├── global.css          # Design tokens, base resets, dark-mode vars
    │   │   ├── layout.css          # 3-column CSS Grid app shell, breakpoints
    │   │   ├── nav.css             # Sidebar navigation styles
    │   │   ├── right-panel.css     # Right panel (trending, spotlight, weather)
    │   │   ├── feed.css            # Feed container, post cards, loading states
    │   │   ├── style.css           # Shared utility classes (typography, spacing, etc.)
    │   │   ├── screenreader.css    # .sr-only, skip links, focus-visible styles
    │   │   ├── reduced-motion.css  # prefers-reduced-motion + .reduce-motion class
    │   │   └── high-contrast.css   # prefers-contrast:high + .high-contrast class
    │   ├── themes/         # One file per named theme
    │   │   ├── dark.css
    │   │   ├── light.css
    │   │   ├── winter.css
    │   │   ├── autumn.css
    │   │   ├── summer.css
    │   │   └── spring.css
    │   └── motion/         # Animation and transition rules
    │       ├── page-entrance.css   # Page/route entrance keyframes
    │       ├── transitions.css     # Fade/slide transitions + View Transitions API
    │       ├── pulse.css           # Pulse animations and live indicators
    │       ├── shimmer.css         # Shimmer/skeleton loading animations
    │       ├── lift.css            # Lift/elevation hover animations
    │       └── hover.css           # Hover effect utilities
    │
    ├── js/
    │   ├── modules/        # Core singleton modules (one responsibility each)
    │   │   ├── global.js       # Error handling, event bus, shared helpers
    │   │   ├── router.js       # Hash-based client-side router
    │   │   ├── nav.js          # Navigation sidebar renderer
    │   │   ├── right-panel.js  # Spotlight + trending + city widget
    │   │   └── feed-loader.js  # Feed fetching, rendering, pagination
    │   └── components/     # Reusable UI component factories
    │       ├── feed-card.js
    │       ├── mood-selector.js
    │       ├── tag-chip.js
    │       ├── spotlight-card.js
    │       └── city-row.js
    │
    └── icons/              # SVG icon assets
```

---

## Module System

All JavaScript is written as **ES modules** (`.js` files with `import`/`export`). There is no build-time transpilation for JS — Vite serves native ESM in development and uses Rollup to bundle for production.

### Module Conventions

- **Modules** (`assets/js/modules/`) are **singletons** initialised once at boot time by `app.js`. Each exports an `init(appState)` function as its public API.
- **Components** (`assets/js/components/`) are **pure factory functions** — they receive data and return a DOM node or an HTML string. They hold no state.
- **`appState`** is a plain object defined in `app.js` and passed by reference to every `init()` call. Modules mutate it directly for simple values and dispatch custom events on `window` for cross-module communication.

### Event Bus

Modules communicate through native `CustomEvent`s dispatched on `window`:

```js
// Dispatch
window.dispatchEvent(new CustomEvent('owf:mood-change', { detail: { mood: 'happy' } }));

// Listen
window.addEventListener('owf:mood-change', ({ detail }) => {
  console.log('Mood changed to', detail.mood);
});
```

Reserved event names are prefixed with `owf:`.

---

## Theme System

Themes are implemented as **CSS custom property overrides** scoped to `[data-theme="<name>"]` on the `<body>` element.

```css
/* assets/css/themes/theme-dark.css */
[data-theme="dark"] {
  --color-bg:       #0f0f1a;
  --color-surface:  #1a1a2e;
  --color-text:     #e8e8f0;
  /* … */
}
```

`app.js` reads the persisted theme from `localStorage` and sets `document.body.dataset.theme` before the first paint, preventing a flash of unstyled content.

### Adding a New Theme

1. Create `assets/css/themes/<name>.css` with all required variable overrides.
2. Add a `<link>` to the stylesheet in `index.html`.
3. Add the theme name to the theme-switcher UI component.

---

## Component System

Components live in `assets/js/components/` and follow a single pattern:

```js
/**
 * createFeedCard — returns a <li> DOM element for a feed item.
 * @param {FeedCard} data
 * @returns {HTMLLIElement}
 */
export function createFeedCard(data) {
  const li = document.createElement('li');
  li.className = 'feed-card';
  li.innerHTML = /* html */ `…`;
  // Attach event listeners here
  return li;
}
```

Components are **stateless** — they receive data, build DOM, wire events, and return the node. State changes flow back through the event bus.

---

## Data Flow

```
JSON / Firestore
      │
      ▼
feed-loader.js  ──fetch──▶  normalise()  ──▶  createFeedCard()  ──▶  #feed-list
      │
      │  owf:feed-loaded
      ▼
right-panel.js  ──▶  renderTrending()
```

1. `feed-loader.js` fetches data (JSON in dev, Firestore in prod).
2. Raw items are normalised into a consistent `FeedCard` shape.
3. Each item is rendered by `createFeedCard()` and appended to `#feed-list`.
4. After load, a `owf:feed-loaded` event is dispatched so sibling modules (e.g. `right-panel`) can react.

### FeedCard Shape

```ts
interface FeedCard {
  id:        string;
  type:      'news' | 'music' | 'social' | 'live' | 'podcast' | 'ai';
  title:     string;
  source:    string;
  timestamp: string;   // ISO 8601
  tags:      string[]; // tag IDs
  mood:      string;   // mood ID
  region:    string;
  thumbnail: string;   // URL
  summary:   string;
  url:       string;
}
```

---

## Router

OWF uses a **hash-based client-side router** (`assets/js/modules/router.js`) — no server configuration required.

### Routes

| Hash          | View                  |
|---------------|-----------------------|
| `#/`          | Main feed             |
| `#/explore`   | Explore / discovery   |
| `#/tag/:id`   | Tag-filtered feed     |
| `#/mood/:id`  | Mood-filtered feed    |
| `#/city/:id`  | City-filtered feed    |
| `#/settings`  | User settings         |
| `#/about`     | About page            |

### How It Works

```js
// router.js listens to hashchange and maps the hash to a view module.
window.addEventListener('hashchange', () => router.navigate(location.hash));
```

The router calls `render(view, params)` which:
1. Clears `#main-content`.
2. Imports the view module dynamically (`import()`).
3. Calls `view.render(params, appState)`.
4. Updates the active nav link.
