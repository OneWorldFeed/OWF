#!/usr/bin/env bash
# ============================================================
#  OWF — Feed Page Update Script
#  Run from your project root: bash update-feed.sh
#  Creates: Signal types, mock data, SignalCard, SignalModal,
#           GlobalMomentsStrip update, and feed page.
#  Safe: will NOT overwrite files unless you pass --force
# ============================================================

set -e

FORCE=false
[[ "$1" == "--force" ]] && FORCE=true

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

write_file() {
  local path="$1"
  local content="$2"
  mkdir -p "$(dirname "$path")"
  if [[ -f "$path" && "$FORCE" == false ]]; then
    echo -e "${YELLOW}  SKIP${NC}  $path  (already exists — use --force to overwrite)"
  else
    printf '%s' "$content" > "$path"
    echo -e "${GREEN}  WRITE${NC} $path"
  fi
}

echo ""
echo -e "${CYAN}  OneWorldFeed — Feed Page Update${NC}"
echo -e "${CYAN}  ================================${NC}"
echo ""

# ============================================================
# 1. TYPE DEFINITIONS  src/types/signal.ts
# ============================================================
write_file "src/types/signal.ts" \
'export type SignalMood = "wonder" | "cosmos" | "earth" | "aurora" | "fire"

export type Signal = {
  id:         string
  mood:       SignalMood
  category:   string
  region:     string
  title:      string
  location:   string
  blurb:      string
  whyMatters: string
  thumb:      string
  viewers:    string
  duration:   "LIVE" | string
  tags:       string[]
  highlights: string[]
  type:       "stream" | "article"
  streamUrl:  string | null
  articleUrl: string | null
}
'

# ============================================================
# 2. MOOD TOKENS  src/lib/mood.ts
# ============================================================
write_file "src/lib/mood.ts" \
'import { SignalMood } from "@/types/signal"

export type MoodTokens = {
  accent: string
  glow:   string
  soft:   string
  dot:    string
  label:  string
}

export const MOOD_MAP: Record<SignalMood, MoodTokens> = {
  wonder: {
    accent: "#8B5CF6",
    glow:   "rgba(139,92,246,0.22)",
    soft:   "rgba(139,92,246,0.06)",
    dot:    "#C4B5FD",
    label:  "Wonder",
  },
  cosmos: {
    accent: "#1A6EFF",
    glow:   "rgba(26,110,255,0.22)",
    soft:   "rgba(26,110,255,0.06)",
    dot:    "#93C5FD",
    label:  "Cosmos",
  },
  earth: {
    accent: "#D97706",
    glow:   "rgba(217,119,6,0.22)",
    soft:   "rgba(217,119,6,0.06)",
    dot:    "#FDE68A",
    label:  "Earth",
  },
  aurora: {
    accent: "#00D4AA",
    glow:   "rgba(0,212,170,0.22)",
    soft:   "rgba(0,212,170,0.06)",
    dot:    "#6EE7D0",
    label:  "Aurora",
  },
  fire: {
    accent: "#F05040",
    glow:   "rgba(240,80,64,0.22)",
    soft:   "rgba(240,80,64,0.06)",
    dot:    "#FCA5A5",
    label:  "Fire",
  },
}

export const getMood = (mood: SignalMood): MoodTokens =>
  MOOD_MAP[mood] ?? MOOD_MAP.cosmos
'

# ============================================================
# 3. MOCK DATA  src/data/signals.ts
# ============================================================
write_file "src/data/signals.ts" \
'import { Signal } from "@/types/signal"

export const SIGNALS: Signal[] = [
  {
    id: "s1", mood: "wonder", category: "Nature", region: "🇳🇴 Norway",
    title: "Aurora Borealis Live",
    location: "Tromsø, Norway · 69°N",
    blurb: "A rare G4 geomagnetic storm is painting the sky from Germany to Alaska. Conditions peak in the next 90 minutes.",
    whyMatters: "The strongest solar event since 2003. The Kp-index is currently 8.3 — auroras are visible across Central Europe for the first time in a generation.",
    thumb: "🌌", viewers: "12.4K", duration: "LIVE",
    tags: ["#AuroraBorealis", "#G4Storm", "#Norway"],
    type: "stream", streamUrl: null, articleUrl: null,
    highlights: ["Solar wind: 750 km/s", "Kp-index: 8.3", "Visible to 45°N"],
  },
  {
    id: "s2", mood: "cosmos", category: "Space", region: "🌍 Orbit",
    title: "ISS Nighttime Pass",
    location: "408km altitude · Pacific crossing",
    blurb: "Watch Earth from orbit as the station crosses the Pacific. City lights visible through exceptionally clear skies tonight.",
    whyMatters: "The ISS completes one orbit every 92 minutes. Tonight'\''s pass flies over one of the darkest ocean stretches on Earth.",
    thumb: "🛸", viewers: "8.1K", duration: "LIVE",
    tags: ["#ISS", "#NASALive", "#EarthFromSpace"],
    type: "stream", streamUrl: null, articleUrl: null,
    highlights: ["Speed: 27,600 km/h", "Crew: 7 aboard", "Orbit #124,330"],
  },
  {
    id: "s3", mood: "earth", category: "Wildlife", region: "🇰🇪 Kenya",
    title: "Elephant Watering Hole",
    location: "Amboseli National Park, Kenya",
    blurb: "A herd of 40+ elephants at the Amboseli watering hole. Calves visible. No narration — pure immersive sound.",
    whyMatters: "Amboseli'\''s ecosystem is under climate stress. This herd'\''s movements are tracked by the Elephant Voices Project.",
    thumb: "🐘", viewers: "3.7K", duration: "LIVE",
    tags: ["#Wildlife", "#Kenya", "#Elephants"],
    type: "stream", streamUrl: null, articleUrl: null,
    highlights: ["Herd size: 43", "3 newborn calves", "Dry season active"],
  },
  {
    id: "s4", mood: "aurora", category: "Ocean", region: "🇦🇺 Australia",
    title: "Great Barrier Reef Dawn",
    location: "Cairns, Queensland · 16°S",
    blurb: "An underwater fixed camera at 12m depth on Hastings Reef. Parrotfish, turtles, and a resident nurse shark spotted this morning.",
    whyMatters: "The reef is in its 4th mass bleaching event in 7 years. This camera is part of a coral resilience monitoring program.",
    thumb: "🐠", viewers: "5.2K", duration: "LIVE",
    tags: ["#GreatBarrierReef", "#Ocean", "#CoralReef"],
    type: "stream", streamUrl: null, articleUrl: null,
    highlights: ["Water temp: 29.4°C", "Visibility: 18m", "Bleaching risk: High"],
  },
  {
    id: "s5", mood: "fire", category: "Volcano", region: "🇮🇸 Iceland",
    title: "Reykjanes Eruption Feed",
    location: "Svartsengi Volcanic System",
    blurb: "The sixth eruption cycle in 14 months. Lava fountains reaching 80–120m. The Blue Lagoon has been evacuated.",
    whyMatters: "Geologists believe this eruption cycle could continue for decades. The Reykjanes peninsula is entering a new volcanic era.",
    thumb: "🌋", viewers: "21.8K", duration: "LIVE",
    tags: ["#Iceland", "#Volcano", "#Reykjanes"],
    type: "stream", streamUrl: null, articleUrl: null,
    highlights: ["Lava fountains: 80–120m", "Fissure: 3.2km", "Eruption #6"],
  },
  {
    id: "s6", mood: "cosmos", category: "Astronomy", region: "🇨🇱 Chile",
    title: "Atacama Deep Sky",
    location: "ESO Paranal Observatory · 2,635m",
    blurb: "One of the darkest skies on Earth. The Milky Way core is in full view. A live feed from the world'\''s driest desert.",
    whyMatters: "Paranal hosts the Very Large Telescope. Tonight the team is imaging a star-forming nebula 1,500 light-years away.",
    thumb: "🔭", viewers: "6.9K", duration: "LIVE",
    tags: ["#Atacama", "#MilkyWay", "#DeepSky"],
    type: "stream", streamUrl: null, articleUrl: null,
    highlights: ["Altitude: 2,635m", "Humidity: 4%", "Seeing: 0.4 arcsec"],
  },
]
'

# ============================================================
# 4. SIGNAL CARD COMPONENT  src/components/feed/SignalCard.tsx
# ============================================================
write_file "src/components/feed/SignalCard.tsx" \
'"use client"

import { useState } from "react"
import { Signal } from "@/types/signal"
import { getMood } from "@/lib/mood"

// ── Atoms ──────────────────────────────────────────────────

function LivePulse({ viewers }: { viewers: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%", background: "#EF4444",
        animation: "owfLivePulse 1.8s ease-in-out infinite", flexShrink: 0,
      }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: "#F87171", letterSpacing: "0.08em" }}>
        LIVE
      </span>
      <span style={{ fontSize: 11, color: "#3D5268", fontWeight: 500 }}>
        · {viewers}K watching
      </span>
    </div>
  )
}

function CategoryTag({ label, mood }: { label: string; mood: string }) {
  const m = getMood(mood as any)
  return (
    <span style={{
      background: m.soft, border: `1px solid ${m.accent}40`,
      color: m.accent, fontSize: 10, fontWeight: 700,
      letterSpacing: "0.12em", padding: "2px 8px",
      borderRadius: 4, textTransform: "uppercase",
    }}>{label}</span>
  )
}

function HashTag({ label }: { label: string }) {
  return (
    <span style={{
      background: "rgba(26,110,255,0.07)", border: "1px solid rgba(26,110,255,0.18)",
      color: "#4A90D9", fontSize: 11, padding: "2px 8px", borderRadius: 20,
    }}>{label}</span>
  )
}

// ── Signal Card ────────────────────────────────────────────

interface SignalCardProps {
  signal: Signal
  onWatch: (signal: Signal) => void
  index?: number
}

export function SignalCard({ signal, onWatch, index = 0 }: SignalCardProps) {
  const m = getMood(signal.mood)
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#ffffff",
        border: `1px solid ${hov ? m.accent + "80" : m.accent + "35"}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: hov
          ? `0 0 40px ${m.glow}, 0 8px 32px rgba(0,0,0,0.35)`
          : `0 0 18px ${m.glow.replace("0.22", "0.1")}, 0 2px 8px rgba(0,0,0,0.15)`,
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        animation: "owfCardReveal 0.5s ease both",
        animationDelay: `${index * 0.07}s`,
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: 148,
        background: "linear-gradient(160deg, #0A0F18, #0D1520)",
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 70%, ${m.glow}, transparent 65%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 80% 20%, ${m.soft}, transparent 50%)` }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)" }} />

        <span style={{
          fontSize: 56, zIndex: 1,
          filter: `drop-shadow(0 0 20px ${m.accent}80)`,
          transform: hov ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.3s ease",
        }}>
          {signal.thumb}
        </span>

        <div style={{ position: "absolute", top: 11, left: 11 }}>
          <LivePulse viewers={signal.viewers} />
        </div>
        <div style={{ position: "absolute", top: 11, right: 11 }}>
          <CategoryTag label={signal.category} mood={signal.mood} />
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
          {signal.region}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${m.accent}40, transparent)` }} />
      </div>

      {/* Body */}
      <div style={{ padding: "15px 17px 17px", background: "#ffffff" }}>
        <div style={{ fontSize: 10, color: "#8BA0B4", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 5, textTransform: "uppercase" }}>
          {signal.location}
        </div>
        <h3 style={{ margin: "0 0 7px", fontSize: 15, fontWeight: 800, color: "#0F1924", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
          {signal.title}
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#5A6E80", lineHeight: 1.55 }}>
          {signal.blurb}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {signal.tags.map(t => <HashTag key={t} label={t} />)}
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <button
            onClick={() => onWatch(signal)}
            style={{
              flex: 1, background: m.accent, border: "none", color: "#fff",
              fontSize: 12.5, fontWeight: 800, padding: "10px 0", borderRadius: 8,
              cursor: "pointer", letterSpacing: "0.04em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88" }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1" }}
          >
            <span>▶</span> Watch Signal
          </button>
          <button style={{
            background: "transparent", border: "1px solid rgba(0,0,0,0.12)",
            color: "#8BA0B4", fontSize: 12, fontWeight: 600,
            padding: "10px 13px", borderRadius: 8, cursor: "pointer",
          }}>
            + Pin
          </button>
        </div>
      </div>
    </div>
  )
}
'

# ============================================================
# 5. SIGNAL MODAL  src/components/feed/SignalModal.tsx
# ============================================================
write_file "src/components/feed/SignalModal.tsx" \
'"use client"

import { useEffect } from "react"
import { Signal } from "@/types/signal"
import { getMood } from "@/lib/mood"

interface SignalModalProps {
  signal: Signal
  onClose: () => void
}

export function SignalModal({ signal, onClose }: SignalModalProps) {
  const m = getMood(signal.mood)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", esc)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", esc)
    }
  }, [onClose])

  const handleWatch = () => {
    if (signal.type === "stream" && signal.streamUrl) {
      // Future: open OWF native player
      window.open(signal.streamUrl, "_blank")
    }
    // If no URL yet: stay in modal (OWF player placeholder)
  }

  const handleArticle = () => {
    if (signal.articleUrl) {
      window.open(signal.articleUrl, "_blank") // articles → new tab (hybrid containment)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(4,7,11,0.94)",
        backdropFilter: "blur(18px) saturate(0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        animation: "owfModalBg 0.25s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 620,
          background: "#0D1219",
          border: `1px solid ${m.accent}50`,
          borderRadius: 22, overflow: "hidden",
          boxShadow: `0 0 80px ${m.glow}, 0 32px 64px rgba(0,0,0,0.8)`,
          animation: "owfModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Hero */}
        <div style={{
          height: 220, position: "relative",
          background: "linear-gradient(160deg, #080C14 0%, #0D1520 100%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 35% 65%, ${m.glow}, transparent 60%)` }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 75% 25%, ${m.soft}, transparent 50%)` }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.01) 3px,rgba(255,255,255,0.01) 4px)" }} />
          <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${m.accent}18, transparent 70%)`, filter: "blur(20px)" }} />

          <span style={{ fontSize: 70, zIndex: 1, marginBottom: 14, filter: `drop-shadow(0 0 28px ${m.accent}70)`, animation: "owfFloat 4s ease-in-out infinite" }}>
            {signal.thumb}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 6, zIndex: 1 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444", animation: "owfLivePulse 1.8s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#F87171", letterSpacing: "0.08em" }}>LIVE</span>
            <span style={{ fontSize: 11, color: "#3D5268" }}>· {signal.viewers}K watching</span>
          </div>

          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 14,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >×</button>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: `linear-gradient(transparent, #0D1219)` }} />
        </div>

        {/* Content */}
        <div style={{ padding: "20px 26px 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ background: m.soft, border: `1px solid ${m.accent}40`, color: m.accent, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
              {signal.category}
            </span>
            <span style={{ fontSize: 11, color: "#3D5268" }}>·</span>
            <span style={{ fontSize: 11, color: "#7A95AE" }}>{signal.region}</span>
          </div>

          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 900, color: "#E2EAF2", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            {signal.title}
          </h2>
          <div style={{ fontSize: 11, color: "#3D5268", fontWeight: 500, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {signal.location}
          </div>

          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#7A95AE", lineHeight: 1.65 }}>
            {signal.blurb}
          </p>

          {/* Why This Matters */}
          <div style={{
            background: `linear-gradient(135deg, ${m.soft}, transparent)`,
            border: `1px solid ${m.accent}25`, borderLeft: `3px solid ${m.accent}`,
            borderRadius: "0 10px 10px 0", padding: "12px 16px", marginBottom: 16,
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: m.accent, letterSpacing: "0.12em", marginBottom: 5, textTransform: "uppercase" }}>
              Why this matters
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "#7A95AE", lineHeight: 1.6 }}>
              {signal.whyMatters}
            </p>
          </div>

          {/* Highlights */}
          {signal.highlights?.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {signal.highlights.map((h, i) => (
                <span key={i} style={{ background: "#121A24", border: "1px solid #1A2535", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#7A95AE", fontWeight: 500 }}>
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Tags */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 22 }}>
            {signal.tags.map(t => (
              <span key={t} style={{ background: "rgba(26,110,255,0.07)", border: "1px solid rgba(26,110,255,0.18)", color: "#4A90D9", fontSize: 11, padding: "2px 8px", borderRadius: 20 }}>
                {t}
              </span>
            ))}
          </div>

          {/* CTAs — hybrid containment */}
          <div style={{ display: "flex", gap: 9 }}>
            <button
              onClick={handleWatch}
              style={{
                flex: 1,
                background: `linear-gradient(135deg, ${m.accent}, ${m.accent}CC)`,
                border: "none", color: "#fff", fontSize: 14, fontWeight: 800,
                padding: "14px 0", borderRadius: 11, cursor: "pointer",
                letterSpacing: "0.04em",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                boxShadow: `0 4px 20px ${m.glow}`,
              }}
            >
              <span style={{ fontSize: 16 }}>▶</span> Watch in OWF Player
            </button>
            {signal.articleUrl && (
              <button
                onClick={handleArticle}
                style={{
                  background: "#121A24", border: "1px solid #1A2535",
                  color: "#7A95AE", fontSize: 12.5, fontWeight: 600,
                  padding: "14px 15px", borderRadius: 11, cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Read more ↗
              </button>
            )}
            <button style={{
              background: "#121A24", border: "1px solid #1A2535",
              color: "#7A95AE", fontSize: 12.5, fontWeight: 600,
              padding: "14px 15px", borderRadius: 11, cursor: "pointer",
            }}>
              + Daily
            </button>
          </div>

          <p style={{ margin: "12px 0 0", textAlign: "center", fontSize: 11, color: "#3D5268" }}>
            Press <kbd style={{ background: "#121A24", border: "1px solid #1A2535", borderRadius: 4, padding: "1px 5px", fontSize: 10 }}>Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  )
}
'

# ============================================================
# 6. GLOBAL MOMENTS STRIP  src/components/feed/GlobalMomentsStrip.tsx
# ============================================================
write_file "src/components/feed/GlobalMomentsStrip.tsx" \
'"use client"

import { Signal } from "@/types/signal"
import { getMood } from "@/lib/mood"

interface GlobalMomentsStripProps {
  signals: Signal[]
  onSelect?: (signal: Signal) => void
}

export function GlobalMomentsStrip({ signals, onSelect }: GlobalMomentsStripProps) {
  return (
    <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4, marginBottom: 28, scrollbarWidth: "none" }}>
      {signals.map((signal) => {
        const m = getMood(signal.mood)
        return (
          <div
            key={signal.id}
            onClick={() => onSelect?.(signal)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }}
          >
            <div
              style={{
                width: 54, height: 54, borderRadius: "50%",
                background: `linear-gradient(135deg, #121A24, #0D1219)`,
                border: "2px solid #EF4444",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24,
                boxShadow: "0 0 0 2px var(--owf-bg, #07090D), 0 0 14px rgba(239,68,68,0.3)",
                transition: "transform 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.06)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)" }}
            >
              {signal.thumb}
            </div>
            <span style={{ fontSize: 10, color: "#7A95AE", fontWeight: 500, whiteSpace: "nowrap", maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis", textAlign: "center" }}>
              {signal.category}
            </span>
          </div>
        )
      })}
    </div>
  )
}
'

# ============================================================
# 7. OWF FEED ANIMATIONS  src/app/globals.css  (APPEND ONLY)
# ============================================================
ANIM_MARKER="/* owf-feed-animations */"
GLOBALS_PATH="src/app/globals.css"

if [[ -f "$GLOBALS_PATH" ]] && grep -q "$ANIM_MARKER" "$GLOBALS_PATH"; then
  echo -e "${YELLOW}  SKIP${NC}  $GLOBALS_PATH animations (already present)"
else
  mkdir -p "$(dirname "$GLOBALS_PATH")"
  touch "$GLOBALS_PATH"
  cat >> "$GLOBALS_PATH" << 'CSSEOF'

/* owf-feed-animations */
@keyframes owfLivePulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
  50%       { opacity: 0.7; box-shadow: 0 0 0 5px rgba(239,68,68,0); }
}
@keyframes owfCardReveal {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes owfModalBg {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes owfModalIn {
  from { opacity: 0; transform: scale(0.92) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes owfFloat {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
CSSEOF
  echo -e "${GREEN}  APPEND${NC} $GLOBALS_PATH (feed animations)"
fi

# ============================================================
# 8. FEED PAGE  src/app/(pages)/home/page.tsx
#    (writes a new version — backs up your old one first)
# ============================================================
FEED_PAGE="src/app/(pages)/home/page.tsx"

if [[ -f "$FEED_PAGE" && "$FORCE" == false ]]; then
  echo -e "${YELLOW}  BACKUP${NC} $FEED_PAGE → ${FEED_PAGE}.bak"
  cp "$FEED_PAGE" "${FEED_PAGE}.bak"
fi

write_file "$FEED_PAGE" \
'"use client"

import { useState } from "react"
import { Signal } from "@/types/signal"
import { SIGNALS } from "@/data/signals"
import { SignalCard } from "@/components/feed/SignalCard"
import { SignalModal } from "@/components/feed/SignalModal"
import { GlobalMomentsStrip } from "@/components/feed/GlobalMomentsStrip"

const FEED_TABS = ["For You", "Nature", "Space", "Ocean", "Volcano", "Culture"]

export default function HomePage() {
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null)
  const [activeTab, setActiveTab]       = useState(0)

  // TODO: replace with Firestore query when Firebase is connected
  const signals = SIGNALS

  return (
    <div style={{ padding: "24px 0 60px" }}>

      {/* Feed header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ margin: "0 0 3px", fontSize: 24, fontWeight: 900, color: "var(--owf-text)", letterSpacing: "-0.025em" }}>
              The Feed
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: "var(--owf-text-muted)" }}>
              {signals.length} live signals · updating now
            </p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--owf-raised)", border: "1px solid var(--owf-border)",
            borderRadius: 8, padding: "5px 11px", fontSize: 11, color: "var(--owf-text-sub)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", animation: "owfLivePulse 1.8s infinite" }} />
            Live now
          </div>
        </div>

        {/* Tab strip */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
          {FEED_TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                background: activeTab === i ? "rgba(26,110,255,0.14)" : "transparent",
                border: activeTab === i ? "1px solid rgba(26,110,255,0.38)" : "1px solid transparent",
                color: activeTab === i ? "#60A5FA" : "var(--owf-text-muted)",
                fontSize: 12.5, fontWeight: activeTab === i ? 700 : 500,
                padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                whiteSpace: "nowrap", transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Global Moments */}
      <GlobalMomentsStrip signals={signals} onSelect={setActiveSignal} />

      {/* Signal Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 16,
      }}>
        {signals.map((signal, i) => (
          <SignalCard
            key={signal.id}
            signal={signal}
            index={i}
            onWatch={setActiveSignal}
          />
        ))}
      </div>

      {/* Modal */}
      {activeSignal && (
        <SignalModal
          signal={activeSignal}
          onClose={() => setActiveSignal(null)}
        />
      )}
    </div>
  )
}
'

# ============================================================
# DONE
# ============================================================
echo ""
echo -e "${CYAN}  ✓ Feed update complete!${NC}"
echo ""
echo "  Files created / updated:"
echo "    src/types/signal.ts"
echo "    src/lib/mood.ts"
echo "    src/data/signals.ts"
echo "    src/components/feed/SignalCard.tsx"
echo "    src/components/feed/SignalModal.tsx"
echo "    src/components/feed/GlobalMomentsStrip.tsx"
echo "    src/app/globals.css  (animations appended)"
echo "    src/app/(pages)/home/page.tsx  (old file backed up as .bak)"
echo ""
echo "  Next steps:"
echo "    1. Run: npm run dev  — verify the feed renders"
echo "    2. Check your LeftNav / RightPanel still wrap the page correctly"
echo "    3. When Firebase is ready: replace SIGNALS in page.tsx with Firestore query"
echo ""
echo "  Re-run with --force to overwrite existing files:"
echo "    bash update-feed.sh --force"
echo ""
