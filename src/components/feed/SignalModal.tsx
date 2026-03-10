"use client"

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
