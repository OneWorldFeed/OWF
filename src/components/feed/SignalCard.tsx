"use client"

import { useState, useEffect, useRef } from "react"
import { Signal } from "@/types/signal"

// ── Mood → subtle accent colour (always cool-toned) ───────────────────────────
const MOOD_ACCENT: Record<string, string> = {
  wonder: "#00d4ff",
  cosmos: "#a78bfa",
  earth:  "#34d399",
  aurora: "#818cf8",
  fire:   "#f87171",
}

function moodAccent(mood: string) {
  return MOOD_ACCENT[mood] ?? "#00d4ff"
}

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function useScrollReveal(delay = 0) {
  const ref  = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return {
    ref,
    style: {
      opacity:   visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    },
  }
}

// ── Play icon SVG ─────────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="21" stroke="var(--owf-horizon)" strokeWidth="1" opacity="0.6" />
      <polygon points="17,13 35,22 17,31" fill="var(--owf-horizon)" opacity="0.9" />
    </svg>
  )
}

// ── Main card ─────────────────────────────────────────────────────────────────
interface SignalCardProps {
  signal:  Signal
  onWatch: (signal: Signal) => void
  index?:  number
}

export function SignalCard({ signal, onWatch, index = 0 }: SignalCardProps) {
  const reveal    = useScrollReveal(index * 55)
  const [open, setOpen] = useState(false)
  const [hov,  setHov]  = useState(false)
  const accent = moodAccent(signal.mood)
  const isVideo = signal.type === "stream"

  // Cinematic gradient per mood — no real images yet, this is the "image area"
  const MOOD_GRAD: Record<string, string> = {
    wonder: "radial-gradient(ellipse at 40% 30%, #0d1a2e 0%, #050810 60%, #0a0a0f 100%)",
    cosmos: "radial-gradient(ellipse at 60% 20%, #150d2e 0%, #0a0510 60%, #0a0a0f 100%)",
    earth:  "radial-gradient(ellipse at 30% 50%, #0a1f14 0%, #050c08 60%, #0a0a0f 100%)",
    aurora: "radial-gradient(ellipse at 50% 30%, #0f0d28 0%, #08070f 60%, #0a0a0f 100%)",
    fire:   "radial-gradient(ellipse at 40% 40%, #1a0808 0%, #0f0505 60%, #0a0a0f 100%)",
  }
  const imgGrad = MOOD_GRAD[signal.mood] ?? MOOD_GRAD.wonder

  return (
    <div ref={reveal.ref} style={reveal.style}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background:    "var(--owf-surface)",
          border:        `1px solid ${hov || open ? `${accent}55` : "var(--owf-border)"}`,
          borderRadius:  0,
          cursor:        "pointer",
          overflow:      "hidden",
          boxShadow:     hov || open
            ? `0 0 0 1px ${accent}30, 0 8px 40px rgba(0,0,0,0.7), 0 0 24px ${accent}18`
            : "0 4px 24px rgba(0,0,0,0.5)",
          transition:    "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        {/* ── Image / Media area ─ 16:9 ─────────────────────────────────── */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            position:   "relative",
            width:      "100%",
            paddingTop: "56.25%", // 16:9
            background: imgGrad,
            overflow:   "hidden",
          }}
        >
          {/* Thumb emoji centred */}
          <div style={{
            position:  "absolute",
            inset:     0,
            display:   "flex",
            alignItems:"center",
            justifyContent: "center",
            fontSize:  "52px",
            filter:    `drop-shadow(0 0 32px ${accent}80)`,
            transform: hov ? "scale(1.06)" : "scale(1)",
            transition:"transform 0.4s ease",
          }}>
            {signal.thumb}
          </div>

          {/* Subtle glow orb */}
          <div style={{
            position:  "absolute",
            top:       "30%",
            left:      "50%",
            transform: "translate(-50%,-50%)",
            width:     "60%",
            height:    "60%",
            borderRadius: "50%",
            background:`radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />

          {/* Scanline texture */}
          <div style={{
            position:   "absolute",
            inset:      0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
            pointerEvents: "none",
          }} />

          {/* Gradient vignette */}
          <div style={{
            position:   "absolute",
            inset:      0,
            background: "linear-gradient(to bottom, transparent 50%, rgba(13,13,20,0.92) 100%)",
            pointerEvents: "none",
          }} />

          {/* Video play overlay */}
          {isVideo && (
            <div style={{
              position:       "absolute",
              inset:          0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              opacity:        hov ? 1 : 0.65,
              transition:     "opacity 0.2s",
              pointerEvents:  "none",
            }}>
              <PlayIcon />
            </div>
          )}

          {/* Duration badge — bottom-right */}
          {isVideo && (
            <div style={{
              position:     "absolute",
              bottom:       "10px",
              right:        "10px",
              fontSize:     "10px",
              fontWeight:   700,
              letterSpacing:"0.08em",
              padding:      "3px 8px",
              background:   signal.duration === "LIVE"
                ? `${accent}22`
                : "rgba(0,0,0,0.75)",
              border:       `1px solid ${signal.duration === "LIVE" ? accent : "var(--owf-text-muted)"}`,
              color:        signal.duration === "LIVE" ? accent : "var(--owf-text-sub)",
            }}>
              {signal.duration === "LIVE" ? (
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%", background: accent,
                    boxShadow: `0 0 6px ${accent}`,
                    animation: "owfLivePulse 1.8s infinite",
                    display: "inline-block",
                  }} />
                  LIVE
                </span>
              ) : signal.duration}
            </div>
          )}

          {/* Mood tag — top-left */}
          <div style={{
            position:      "absolute",
            top:           "12px",
            left:          "12px",
            fontSize:      "8px",
            fontWeight:    700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color:         accent,
            fontFamily:    "monospace",
          }}>
            {signal.mood}
          </div>

          {/* Viewers — top-right */}
          <div style={{
            position:      "absolute",
            top:           "12px",
            right:         isVideo ? "10px" : "12px",
            fontSize:      "9px",
            letterSpacing: "0.08em",
            color:         "var(--owf-text-muted)",
            fontFamily:    "monospace",
          }}>
            {signal.viewers} watching
          </div>
        </div>

        {/* ── Card body ──────────────────────────────────────────────────── */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{ padding: "16px 18px 0" }}
        >
          {/* Location */}
          <p style={{
            fontSize:      "9px",
            fontWeight:    600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color:         "var(--owf-text-muted)",
            marginBottom:  "6px",
            fontFamily:    "monospace",
          }}>
            {signal.location}
          </p>

          {/* Title */}
          <h3 style={{
            fontSize:      "15px",
            fontWeight:    300,
            letterSpacing: "-0.01em",
            color:         "var(--owf-text)",
            lineHeight:    1.4,
            marginBottom:  "8px",
          }}>
            {signal.title}
          </h3>

          {/* Cyan horizon rule */}
          <div style={{
            height:     "1px",
            background: `linear-gradient(90deg, ${accent}60, transparent)`,
            boxShadow:  `0 0 6px ${accent}40`,
            marginBottom: "10px",
          }} />

          {/* Tags */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
            {signal.tags.slice(0, open ? 99 : 3).map(t => (
              <span key={t} style={{
                fontSize:      "10px",
                color:         accent,
                letterSpacing: "0.05em",
                fontFamily:    "monospace",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Expandable section ─────────────────────────────────────────── */}
        <div style={{
          maxHeight:  open ? "400px" : "0px",
          overflow:   "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <div style={{ padding: "0 18px 18px" }}>
            {/* Blurb */}
            <p style={{
              fontSize:   "12px",
              lineHeight: 1.7,
              color:      "var(--owf-text-sub)",
              marginBottom: "12px",
            }}>
              {signal.blurb}
            </p>

            {/* Why it matters */}
            {signal.whyMatters && (
              <div style={{
                padding:      "10px 12px",
                borderLeft:   `2px solid ${accent}`,
                background:   `${accent}08`,
                marginBottom: "14px",
              }}>
                <p style={{
                  fontSize:      "8px",
                  fontWeight:    700,
                  letterSpacing: "0.16em",
                  color:         accent,
                  marginBottom:  "5px",
                  fontFamily:    "monospace",
                  textTransform: "uppercase",
                }}>
                  WHY IT MATTERS
                </p>
                <p style={{ fontSize: "11px", color: "var(--owf-text-sub)", lineHeight: 1.65 }}>
                  {signal.whyMatters}
                </p>
              </div>
            )}

            {/* Highlights */}
            {signal.highlights?.length > 0 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                {signal.highlights.map((h, i) => (
                  <span key={i} style={{
                    fontSize:      "9px",
                    fontFamily:    "monospace",
                    color:         "var(--owf-text-sub)",
                    letterSpacing: "0.06em",
                    paddingRight:  "8px",
                    borderRight:   i < signal.highlights.length - 1 ? "1px solid var(--owf-border)" : "none",
                  }}>
                    {h}
                  </span>
                ))}
              </div>
            )}

            {/* Action row */}
            <div style={{
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "space-between",
              paddingTop:      "12px",
              borderTop:       "1px solid var(--owf-border)",
            }}>
              <button
                onClick={e => { e.stopPropagation(); onWatch(signal); }}
                style={{
                  fontSize:      "10px",
                  fontWeight:    700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontFamily:    "monospace",
                  padding:       "8px 20px",
                  background:    "transparent",
                  border:        `1px solid ${accent}`,
                  color:         accent,
                  cursor:        "pointer",
                  boxShadow:     `0 0 12px ${accent}25`,
                  transition:    "background 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${accent}18`
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${accent}40`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent"
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 12px ${accent}25`
                }}
              >
                {isVideo ? "Watch Live" : "Read More"}
              </button>
              <div style={{ display: "flex", gap: "16px" }}>
                {[["◎", "Save"], ["↗", "Share"]].map(([icon, label]) => (
                  <button
                    key={label}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background:    "none",
                      border:        "none",
                      cursor:        "pointer",
                      fontSize:      "11px",
                      color:         "var(--owf-text-muted)",
                      letterSpacing: "0.06em",
                      display:       "flex",
                      alignItems:    "center",
                      gap:           "4px",
                      fontFamily:    "monospace",
                      padding:       "4px",
                      transition:    "color 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = accent }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--owf-text-muted)" }}
                  >
                    <span style={{ fontSize: "13px" }}>{icon}</span>
                    <span style={{ fontSize: "9px", textTransform: "uppercase" }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Collapse indicator */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            padding:         "8px 18px",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             "6px",
            borderTop:       open ? "1px solid var(--owf-border)" : "none",
            cursor:          "pointer",
          }}
        >
          <div style={{
            width:     "24px",
            height:    "1px",
            background:accent,
            opacity:   open ? 0.6 : 0.2,
          }} />
          <div style={{
            fontSize:  "8px",
            color:     open ? accent : "var(--owf-text-muted)",
            fontFamily:"monospace",
            letterSpacing: "0.1em",
            transition:"color 0.2s",
          }}>
            {open ? "COLLAPSE" : "EXPAND"}
          </div>
          <div style={{
            width:     "24px",
            height:    "1px",
            background:accent,
            opacity:   open ? 0.6 : 0.2,
          }} />
        </div>
      </div>
    </div>
  )
}
