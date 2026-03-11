# OneWorldFeed (OWF)

**A cinematic, emotionally intelligent global social platform.**  
Built with Next.js · TypeScript · Tailwind · Firebase

---

## Vision

OWF is a global curiosity hub — a place where people connect across cultures through shared signals: news, music, art, ideas, and conversation. The platform is built around three core principles:

- **User data ownership** — nothing sold, nothing profiled without consent
- **Global inclusivity** — built for a worldwide audience including African users, with multilingual support
- **Emotional intelligence** — the UI responds to context, mood, and connection

The long-term arc: contained editorial signals → creator channels → native OWF streaming.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Backend | Firebase (Firestore, Auth, Storage) |
| AI | Anthropic Claude API (deferred to premium tier) |
| Deployment | Vercel (planned) |
| Mobile | PWA first → Capacitor (post-MVP) |

---

## Project Structure

```
src/
├── app/
│   ├── (pages)/
│   │   ├── home/          # Feed page
│   │   ├── dm/            # Direct messages
│   │   ├── ai/            # AI assistant (4 tabs)
│   │   └── ...            # Social, Discover, News, Podcast, Music, Profile, Settings
│   └── globals.css
├── components/
│   ├── dm/                # DM + Owl streak system (11 components)
│   ├── feed/              # Signal cards, feed tabs, moments strip
│   ├── header/            # GlobalHeader
│   ├── nav/               # LeftNav, BottomNav
│   ├── panels/            # RightPanel and widgets
│   └── ui/                # Shared UI primitives
├── context/
│   └── ThemeProvider.tsx  # Global theme context
├── data/
│   ├── dm.ts              # Mock conversations + messages
│   ├── moods.json         # Mood definitions
│   └── signals.ts         # Mock feed signals
├── lib/
│   ├── ai/                # AI helpers
│   ├── firebase/
│   │   └── config.ts      # Lazy-init Firebase singletons
│   ├── freeapis.ts        # Free third-party API integrations
│   ├── streak.ts          # Streak tier + color helpers
│   └── theme.ts           # Theme source of truth (12 themes)
└── types/
    ├── dm.ts              # Conversation + Message types
    └── signal.ts          # Signal + SignalMood types
```

---

## Design System

### Themes

12 themes defined in `src/lib/theme.ts` (source of truth). Applied via `applyTheme()` on the document root.

`void · obsidian · midnight · cosmos · aurora · ember · dusk · slate · parchment · chalk · sand · fog`

**Default:** `chalk` (light)

### CSS Custom Properties

```css
--owf-bg           /* page background */
--owf-surface      /* card/panel surface */
--owf-raised       /* elevated elements */
--owf-border       /* borders + dividers */
--owf-text         /* primary text */
--owf-text-sub     /* secondary text */
--owf-text-muted   /* muted / placeholder */
--owf-horizon      /* brand blue accent */
--owf-horizon-rgb  /* RGB version for rgba() */
--owf-aurora       /* teal accent */
--owf-glow         /* ambient glow */
--owf-gold         /* gold / highlight */
--owf-card         /* feed card background (always white) */
--owf-card-border  /* card border */
--owf-card-glow    /* card glow ring */
```

### Card Rule

Feed cards are **always white (`#ffffff`)** with theme accent glow borders. Card text is hardcoded dark (`#0F1924`, `#5A6E80`) for readability across all themes.

### Aesthetic Direction

Tron/Sky OS — subtle, cinematic, not literal. Glowing horizon lines, radial aurora blooms, pulsing orbital elements.

---

## Pages

### ✅ Built

| Page | Route | Status |
|------|-------|--------|
| Home (Feed) | `/` | Live |
| Direct Messages | `/dm` | Live |
| AI Assistant | `/ai` | Live (4 tabs: Ask, Catch Me Up, Translate, What I Know) |

### 🔲 Planned

`/social` · `/discover` · `/news` · `/podcast` · `/music` · `/profile` · `/settings`

---

## Feed — Signal Block System

Signals are the atomic unit of the OWF feed. Each signal has a mood that drives its visual treatment.

### Signal Moods

| Mood | Accent | Meaning |
|------|--------|---------|
| `wonder` | `#8B5CF6` | Curiosity, discovery |
| `cosmos` | `#1A6EFF` | Space, scale, the universe |
| `earth` | `#D97706` | Nature, grounding |
| `aurora` | `#00D4AA` | Connection, flow |
| `fire` | `#F05040` | Urgency, passion |

### Key Feed Components

- **`SignalCard.tsx`** — mood-reactive glow border, white card body
- **`SignalModal.tsx`** — cinematic overlay with hybrid containment
- **`GlobalMomentsStrip.tsx`** — live global stories strip
- **`FeedTabs.tsx`** — category filtering

---

## DM Page — Owl Streak System

The DM page features a full conversation streak system. The OWF Owl mascot is the emotional/ceremonial symbol for streaks.

### Components

| Component | Purpose |
|-----------|---------|
| `OWFOwl.tsx` | Canonical owl SVG — 10 cycle variants, 4 moods |
| `OwlBadge.tsx` | Inline mini badge in conversation list rows |
| `ThreadStreakBar.tsx` | Animated streak bar in thread header |
| `AtRiskBanner.tsx` | Amber dismissible at-risk warning |
| `StreakSheet.tsx` | Bottom sheet streak detail modal |
| `ConvoRow.tsx` | Conversation list row with owl badge |
| `MessageBubble.tsx` | Chat bubble with reaction picker |

### OWFOwl — 10 Cycle System

Cycles auto-select from `streakDays`. SVG base uses exact 500×500 coordinates from the canonical reference.

| Cycle | Days | Visual |
|-------|------|--------|
| `city` | 0–3 | Warm peach, neutral |
| `lunar` | 4–9 | Steel blue, halo ring + stars |
| `frost` | 10–19 | Icy blue, frost crystals |
| `forest` | 20–29 | Green, floating leaves |
| `fire` | 30–49 | Red/orange, flame curtains + crown flames + embers |
| `solar` | 50–69 | Golden, warm stars |
| `storm` | 70–99 | Electric blue, stars |
| `aurora` | 100–199 | Teal + violet, stars |
| `cosmic` | 200–364 | Deep blue, star field |
| `mythic` | 365+ | Teal, magic arc ring + curved horns |

### Owl Moods

| Mood | Trigger | Visual |
|------|---------|--------|
| `calm` | Default | Standard cycle colors |
| `happy` | High streak tier | Bright cycle with glow |
| `atRisk` | Streak expires today | Amber dashed ring, pulse animation |
| `broken` | Streak ended | Desaturated + crack lines |

### Streak Tiers (`src/lib/streak.ts`)

`none → low → mid → high → fire → legendary`

### Mock Conversations

| Name | Streak | State |
|------|--------|-------|
| Maya Thompson | 31 days | Milestone (Fire Owl) |
| Leo Toronto | 8 days | At-risk (amber warning) |
| Sofia Nairobi | 0 | Broken (last streak: 9) |
| Alex Tokyo | 3 days | Active (City Owl) |
| Global Creators | — | Group chat |

---

## OWF Radio

A full global radio feature built on [radio-browser.info](https://www.radio-browser.info) (30,000+ stations, no API key required).

- **`AudioProvider`** context — persistent playback across navigation
- **`FloatingPlayer`** — cinematic player matching OWF visual signature
- Auto-updates the user's profile Now Playing field

---

## Free API Integrations (`src/lib/freeapis.ts`)

| API | Purpose | Key Required |
|-----|---------|-------------|
| MyMemory | Translation (20 languages) | No |
| restcountries.com | Country data | No |
| ip-api.com | IP geolocation | No |
| Last.fm | Now Playing | Yes (`.env.local`) |
| frankfurter.app | Exchange rates | No |
| nager.date | Public holidays | No |
| radio-browser.info | Global radio stations | No |

---

## AI System

### Philosophy

- Session-only context — no persistent profiling
- User owns their data — nothing sold or shared
- Memory opt-in: **off by default**
- Transparency panel shows exactly what the AI knows

### AI Page Tabs

1. **Ask** — general assistant
2. **Catch Me Up** — summarize what happened while you were away
3. **Translate** — powered by MyMemory (free tier)
4. **What I Know** — transparency panel showing current session context

### API Usage

Anthropic Claude API is **intentionally deferred** to a future premium tier. Free tier uses MyMemory for translation and Hugging Face for lightweight inference.

---

## Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# APIs
ANTHROPIC_API_KEY=         # deferred — premium tier only
HUGGING_FACE_API_KEY=
LAST_FM_API_KEY=
GNEWS_API_KEY=
```

---

## Firebase Architecture

### Current State
Firebase config uses lazy-init singleton getters (`getDb()`, `getFirebaseAuth()`, `getFirebaseStorage()`) to avoid Next.js SSR initialization errors.

### Roadmap (Not Yet Connected)
- Feed → real Firestore posts collection (currently hardcoded)
- Global Moments → real-time listeners
- Spotlight → top liked/shared query (last 24h)
- Trending Now → hashtag counter collection
- Safety Badges → moderation layer
- Streaks → stored per conversation pair in Firestore

---

## Gamification — 50-Tier Owl Progression

The OWF Owl has a full 50-tier progression system (`OwlConstellationSystem.jsx`).

**Major tiers:** Hatchling (1d) → City (7d) → Forest (22d) → Fire (52d) → Solar (70d) → Lunar (100d) → Aurora (115d) → Frost (130d) → Cosmic (240d) → Mythic (365d) → ... → Legendary (1825d / 5 years)

The constellation map shows your streak journey as an S-curve star path with milestone nodes. Tapping any node opens the badge unlock screen.

> Interactive demo: `OwlConstellationSystem.jsx` (outputs folder)

---

## Installation Scripts

Bash scripts for one-shot feature deployment. Run from project root.

| Script | Installs |
|--------|---------|
| `install-dm-owl.sh` | Complete DM page + all 11 Owl components (use this for fresh setup) |
| `install-owl.sh` | OWFOwl.tsx + dependent streak components only |

```bash
# Full DM system from scratch
bash install-dm-owl.sh && npm run dev
```

---

## Development Workflow

```bash
npm install
cp .env.local.example .env.local   # fill in keys
npm run dev                         # http://localhost:3000
```

The project runs in a GitHub Codespace. Changes are tested page by page before moving forward.

**Branch strategy:** feature branches committed and pushed via VS Code Source Control or terminal.

---

## Mobile Plan

PWA first, then Capacitor for App Store distribution.

> **Do not start mobile work until:** all main pages are built, Firebase is connected, and the design system is stable.

- Apple Developer: $99/year
- Google Play: $25 one-time

---

## Pending Work

### High Priority
- [ ] Connect feed to real Firestore posts (replace hardcoded signals array)
- [ ] Wire `BottomNav.tsx` mobile link for `/dm`
- [ ] Firebase lazy-init fix applied to `src/lib/firebase/config.ts`
- [ ] Fill Firebase keys in `.env.local`

### Feature Work
- [ ] Feed tabs filter — `.filter()` on signals by category
- [ ] Wire "Watch in OWF Player" button (currently no-op)
- [ ] Build OWF native player (Phase 2)
- [ ] Quiz Blocks, Fact Blocks, World Briefing Block in feed
- [ ] Wire `BadgeUnlockCard` to trigger on streak milestone days
- [ ] Integrate 50-tier system from `OwlSystem.jsx` into production
- [ ] Add `.devcontainer/` files and commit to repo

### Pages to Build
- [ ] `/social`
- [ ] `/discover`
- [ ] `/news`
- [ ] `/podcast`
- [ ] `/music`
- [ ] `/profile`
- [ ] `/settings`

---

## Cost Target

$50–150/month via user-provided API keys (Anthropic, Last.fm, GNews). All other integrations use free-tier or keyless APIs.

---

*OneWorldFeed — built for humans, designed for the world.*