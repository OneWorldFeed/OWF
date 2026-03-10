"use client"

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
