import { SIGNALS } from "@/data/signals"
import FeedTabs from "@/components/feed/FeedTabs"
import { GlobalMomentsStrip } from "@/components/feed/GlobalMomentsStrip"
import RightPanel from "@/components/panels/RightPanel"
import { getMoodOfTheDay } from "@/lib/ai/rules-engine"

/* ── Mood → signal-mood colour mapping ─────────────────────────────────── */

const MOOD_COLOR: Record<string, string> = {
  electric:   "#EF4444",  // fire
  reflective: "#8B5CF6",  // cosmos
  hopeful:    "#10B981",  // earth
  ambitious:  "#EF4444",  // fire
  curious:    "#6366F1",  // wonder
  joyful:     "#3B82F6",  // aurora
  resilient:  "#10B981",  // earth
}

function moodColor(mood: string) {
  return MOOD_COLOR[mood] ?? "#6366F1"
}

/* ── GlobalMoodBar ─────────────────────────────────────────────────────── */

function GlobalMoodBar() {
  const { mood, text } = getMoodOfTheDay()
  const mc = moodColor(mood)

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        height: "48px",
        padding: "0 4px",
        borderBottom: "1px solid var(--owf-border)",
      }}
    >
      {/* Mood pill */}
      <span
        style={{
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: mc,
          background: `${mc}14`,
          border: `1px solid ${mc}30`,
          padding: "3px 10px",
          borderRadius: "99px",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {mood}
      </span>

      {/* Mood text */}
      <p
        style={{
          fontSize: "12px",
          lineHeight: 1.4,
          color: "var(--owf-text-sub)",
          margin: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </p>
    </div>
  )
}

/* ── Home Page ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  const signals = SIGNALS

  return (
    <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>

      {/* Feed column */}
      <div
        className="feed-center"
        style={{
          flex: 1,
          minWidth: 0,
          padding: "8px 24px 32px 20px",
          borderRight: "1px solid var(--owf-border)",
        }}
      >
        <GlobalMoodBar />
        <GlobalMomentsStrip />
        <FeedTabs signals={signals} />
      </div>

      {/* Right panel — hidden below 1024px */}
      <div
        className="right-panel-col"
        style={{
          width: "300px",
          flexShrink: 0,
          padding: "12px 12px 32px 12px",
          minWidth: 0,
        }}
      >
        <RightPanel />
      </div>
    </div>
  )
}
