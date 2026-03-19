"use client"

import { useState, useEffect, useRef } from "react"
import { Signal } from "@/types/signal"

// ── Mood accent colours — semantic, independent of theme ──────────────────────
const MOOD_ACCENT: Record<string, string> = {
  wonder: "#6366F1",
  cosmos: "#8B5CF6",
  earth:  "#10B981",
  aurora: "#3B82F6",
  fire:   "#EF4444",
}
function moodAccent(m: string) { return MOOD_ACCENT[m] ?? "#6366F1" }

// Dark tone per mood for the thumbnail gradient (keeps emoji visible)
const MOOD_THUMB_BG: Record<string, string> = {
  wonder: "radial-gradient(ellipse at 40% 35%, #1e1b4b 0%, #0f0e23 100%)",
  cosmos: "radial-gradient(ellipse at 50% 30%, #2e1065 0%, #12062a 100%)",
  earth:  "radial-gradient(ellipse at 35% 45%, #064e3b 0%, #022c22 100%)",
  aurora: "radial-gradient(ellipse at 50% 30%, #1e3a8a 0%, #0a1836 100%)",
  fire:   "radial-gradient(ellipse at 45% 40%, #7f1d1d 0%, #3b0a0a 100%)",
}
function thumbBg(m: string) { return MOOD_THUMB_BG[m] ?? MOOD_THUMB_BG.wonder }

// ── Scroll-reveal hook ────────────────────────────────────────────────────────
function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.06 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return {
    ref,
    style: {
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
    },
  }
}

// ── Shared constants ──────────────────────────────────────────────────────────
const DARK  = "#0F1924"
const DARK2 = "rgba(15,25,36,0.55)"
const DARK3 = "rgba(15,25,36,0.35)"

// ── SignalCard ────────────────────────────────────────────────────────────────
interface SignalCardProps {
  signal:  Signal
  onWatch: (signal: Signal) => void
  index?:  number
}

export function SignalCard({ signal, onWatch, index = 0 }: SignalCardProps) {
  const reveal  = useScrollReveal(index * 55)
  const [open, setOpen] = useState(false)
  const [hov,  setHov]  = useState(false)
  const accent  = moodAccent(signal.mood)
  const isVideo = signal.type === "stream"
  const isLive  = signal.duration === "LIVE"

  const cardBorder = hov || open
    ? `1px solid rgba(var(--owf-horizon-rgb), 0.30)`
    : "1px solid rgba(0,0,0,0.09)"
  const cardShadow = hov || open
    ? `0 0 0 3px rgba(var(--owf-horizon-rgb), 0.07), 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)`
    : "0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)"

  return (
    <div ref={reveal.ref} style={reveal.style}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background:  "#ffffff",
          border:      cardBorder,
          borderRadius:"0",
          overflow:    "hidden",
          boxShadow:   cardShadow,
          transition:  "border-color 0.2s ease, box-shadow 0.25s ease",
          position:    "relative",
        }}
      >

        {/* ── Header row ───────────────────────────────────────────────────── */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            display:    "flex",
            alignItems: "flex-start",
            gap:        "12px",
            padding:    "14px 16px 10px",
            cursor:     "pointer",
          }}
        >
          {/* Avatar — mood-coloured ring around emoji */}
          <div style={{
            width:        "40px",
            height:       "40px",
            borderRadius: "50%",
            flexShrink:   0,
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            fontSize:     "20px",
            background:   `${accent}14`,
            border:       `2px solid ${accent}40`,
            boxShadow:    `0 0 0 3px ${accent}12`,
            transition:   "box-shadow 0.2s",
          }}>
            {signal.thumb}
          </div>

          {/* Title + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize:    "14px",
              fontWeight:  600,
              color:       DARK,
              lineHeight:  1.35,
              marginBottom:"3px",
              letterSpacing: "-0.01em",
            }}>
              {signal.title}
            </p>
            <div style={{
              display:    "flex",
              alignItems: "center",
              gap:        "8px",
              flexWrap:   "wrap",
            }}>
              {/* Location */}
              <span style={{
                fontSize:  "11px",
                color:     DARK3,
                letterSpacing: "0.01em",
              }}>
                {signal.location}
              </span>
              <span style={{ color: DARK3, fontSize: "10px" }}>·</span>
              {/* Viewers / time */}
              <span style={{
                fontSize:  "11px",
                color:     DARK3,
              }}>
                {signal.viewers} watching
              </span>
            </div>
          </div>

          {/* Right side: mood badge + collapse button when open */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <span style={{
              fontSize:      "9px",
              fontWeight:    700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         accent,
              background:    `${accent}12`,
              border:        `1px solid ${accent}30`,
              padding:       "2px 7px",
              borderRadius:  "3px",
            }}>
              {signal.mood}
            </span>
            {open && (
              <button
                onClick={e => { e.stopPropagation(); setOpen(false) }}
                style={{
                  width:        "24px",
                  height:       "24px",
                  borderRadius: "50%",
                  border:       "1px solid rgba(0,0,0,0.12)",
                  background:   "rgba(0,0,0,0.04)",
                  cursor:       "pointer",
                  display:      "flex",
                  alignItems:   "center",
                  justifyContent:"center",
                  fontSize:     "11px",
                  color:        DARK2,
                  flexShrink:   0,
                  lineHeight:   1,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── Thumbnail — 16:9, always visible ─────────────────────────────── */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            position:   "relative",
            width:      "100%",
            paddingTop: "56.25%",
            background: thumbBg(signal.mood),
            overflow:   "hidden",
            cursor:     "pointer",
          }}
        >
          {/* Emoji centred */}
          <div style={{
            position:       "absolute",
            inset:          0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       "54px",
            filter:         `drop-shadow(0 0 28px ${accent}90)`,
            transform:      hov ? "scale(1.05)" : "scale(1)",
            transition:     "transform 0.4s ease",
          }}>
            {signal.thumb}
          </div>

          {/* Soft glow orb */}
          <div style={{
            position:     "absolute",
            top:          "30%", left: "50%",
            transform:    "translate(-50%,-50%)",
            width:        "55%", height: "55%",
            borderRadius: "50%",
            background:   `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
            pointerEvents:"none",
          }} />

          {/* Vignette — dark at bottom so thumb text is readable */}
          <div style={{
            position:     "absolute",
            inset:        0,
            background:   "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.55) 100%)",
            pointerEvents:"none",
          }} />

          {/* Video play overlay */}
          {isVideo && (
            <div style={{
              position:       "absolute",
              inset:          0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              pointerEvents:  "none",
            }}>
              <div style={{
                width:        "48px",
                height:       "48px",
                borderRadius: "50%",
                background:   "rgba(255,255,255,0.92)",
                boxShadow:    "0 2px 16px rgba(0,0,0,0.25)",
                display:      "flex",
                alignItems:   "center",
                justifyContent:"center",
                transform:    hov ? "scale(1.08)" : "scale(1)",
                transition:   "transform 0.2s ease",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill={accent}>
                  <polygon points="4,2 14,8 4,14" />
                </svg>
              </div>
            </div>
          )}

          {/* Duration badge — bottom-right */}
          {isVideo && (
            <div style={{
              position:     "absolute",
              bottom:       "10px",
              right:        "10px",
              fontSize:     "9px",
              fontWeight:   700,
              letterSpacing:"0.08em",
              padding:      "3px 8px",
              background:   isLive ? `${accent}22` : "rgba(0,0,0,0.72)",
              border:       `1px solid ${isLive ? accent + "60" : "rgba(255,255,255,0.18)"}`,
              color:        isLive ? accent : "rgba(255,255,255,0.88)",
            }}>
              {isLive
                ? <span style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: accent, display: "inline-block",
                      boxShadow: `0 0 6px ${accent}`,
                      animation: "owfLivePulse 1.8s infinite",
                    }} />
                    LIVE
                  </span>
                : signal.duration
              }
            </div>
          )}
        </div>

        {/* ── Collapsed body ─ always visible ──────────────────────────────── */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{ padding: "12px 16px 0", cursor: "pointer" }}
        >
          {/* Blurb — 2-line clamp when collapsed */}
          <p style={{
            fontSize:       "13px",
            lineHeight:     1.6,
            color:          DARK2,
            marginBottom:   "10px",
            display:        "-webkit-box",
            WebkitBoxOrient:"vertical",
            WebkitLineClamp: open ? "none" : 2,
            overflow:       open ? "visible" : "hidden",
          } as React.CSSProperties}>
            {signal.blurb}
          </p>

          {/* Tags */}
          <div style={{
            display:      "flex",
            gap:          "10px",
            flexWrap:     "wrap",
            marginBottom: "12px",
          }}>
            {signal.tags.slice(0, open ? 99 : 3).map(t => (
              <span key={t} style={{
                fontSize:      "11px",
                color:         accent,
                letterSpacing: "0.03em",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Expanded section ─ animated ───────────────────────────────────── */}
        <div style={{
          maxHeight:  open ? "800px" : "0px",
          overflow:   "hidden",
          transition: "max-height 0.35s ease",
        }}>
          <div style={{ padding: "0 16px 16px" }}>

            {/* Accent divider */}
            <div style={{
              height:       "1px",
              background:   `linear-gradient(90deg, ${accent}50, transparent)`,
              marginBottom: "14px",
            }} />

            {/* Why it matters */}
            {signal.whyMatters && (
              <div style={{
                padding:      "10px 12px",
                borderLeft:   `3px solid ${accent}`,
                background:   `${accent}08`,
                borderRadius: "0 6px 6px 0",
                marginBottom: "14px",
              }}>
                <p style={{
                  fontSize:      "8px",
                  fontWeight:    800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color:         accent,
                  marginBottom:  "5px",
                }}>
                  WHY IT MATTERS
                </p>
                <p style={{ fontSize: "12px", lineHeight: 1.65, color: DARK2 }}>
                  {signal.whyMatters}
                </p>
              </div>
            )}

            {/* Video player shell (expanded video cards) */}
            {isVideo && (
              <div style={{
                borderRadius: "6px",
                overflow:     "hidden",
                background:   "#111",
                border:       "1px solid rgba(0,0,0,0.12)",
                marginBottom: "14px",
                position:     "relative",
              }}>
                {/* Player viewport */}
                <div style={{
                  position:   "relative",
                  paddingTop: "56.25%",
                  background: thumbBg(signal.mood),
                }}>
                  <div style={{
                    position:       "absolute",
                    inset:          0,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    fontSize:       "64px",
                    filter:         `drop-shadow(0 0 32px ${accent}80)`,
                  }}>
                    {signal.thumb}
                  </div>
                  {/* Big play button */}
                  <button
                    onClick={e => { e.stopPropagation(); onWatch(signal) }}
                    style={{
                      position:       "absolute",
                      inset:          0,
                      background:     "transparent",
                      border:         "none",
                      cursor:         "pointer",
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{
                      width:        "64px",
                      height:       "64px",
                      borderRadius: "50%",
                      background:   "rgba(255,255,255,0.92)",
                      boxShadow:    "0 4px 24px rgba(0,0,0,0.3)",
                      display:      "flex",
                      alignItems:   "center",
                      justifyContent:"center",
                    }}>
                      <svg width="22" height="22" viewBox="0 0 16 16" fill={accent}>
                        <polygon points="4,2 14,8 4,14" />
                      </svg>
                    </div>
                  </button>
                  {/* Live / duration pill */}
                  <div style={{
                    position:   "absolute",
                    bottom:     "10px",
                    right:      "10px",
                    fontSize:   "9px",
                    fontWeight: 700,
                    padding:    "3px 10px",
                    background: isLive ? `${accent}22` : "rgba(0,0,0,0.72)",
                    border:     `1px solid ${isLive ? accent + "60" : "rgba(255,255,255,0.18)"}`,
                    color:      isLive ? accent : "rgba(255,255,255,0.88)",
                    letterSpacing: "0.08em",
                  }}>
                    {isLive ? "● LIVE" : signal.duration}
                  </div>
                </div>
                {/* Minimal controls bar */}
                <div style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        "10px",
                  padding:    "8px 12px",
                  background: "#0a0a0a",
                }}>
                  <div style={{
                    flex:         1,
                    height:       "3px",
                    background:   "rgba(255,255,255,0.12)",
                    borderRadius: "99px",
                    overflow:     "hidden",
                  }}>
                    <div style={{
                      width:        isLive ? "100%" : "32%",
                      height:       "100%",
                      background:   accent,
                      borderRadius: "99px",
                      animation:    isLive ? "none" : undefined,
                    }} />
                  </div>
                  <span style={{
                    fontSize:     "10px",
                    color:        "rgba(255,255,255,0.45)",
                    fontFamily:   "monospace",
                    whiteSpace:   "nowrap",
                  }}>
                    {isLive ? "● LIVE" : signal.duration}
                  </span>
                </div>
              </div>
            )}

            {/* Highlights */}
            {signal.highlights?.length > 0 && (
              <div style={{
                display:      "flex",
                gap:          "0",
                flexWrap:     "wrap",
                marginBottom: "14px",
                border:       "1px solid rgba(0,0,0,0.07)",
              }}>
                {signal.highlights.map((h, i) => (
                  <span key={i} style={{
                    fontSize:      "11px",
                    color:         DARK2,
                    padding:       "6px 12px",
                    borderRight:   i < signal.highlights.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none",
                    fontFamily:    "monospace",
                    letterSpacing: "0.04em",
                  }}>
                    {h}
                  </span>
                ))}
              </div>
            )}

            {/* Action row */}
            <div style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              paddingTop:     "12px",
              borderTop:      "1px solid rgba(0,0,0,0.07)",
            }}>
              {/* Primary CTA */}
              <PrimaryButton
                label={isVideo ? "Watch Live" : "Read More"}
                accent={accent}
                onClick={e => { e.stopPropagation(); onWatch(signal) }}
              />

              {/* Secondary actions */}
              <div style={{ display:"flex", gap:"4px" }}>
                {[["◎", "Save"], ["↗", "Share"]].map(([icon, label]) => (
                  <button
                    key={label}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background:  "none",
                      border:      "1px solid rgba(0,0,0,0.08)",
                      cursor:      "pointer",
                      padding:     "6px 12px",
                      display:     "flex",
                      alignItems:  "center",
                      gap:         "4px",
                      color:       DARK3,
                      fontSize:    "11px",
                      transition:  "border-color 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => {
                      const b = e.currentTarget as HTMLButtonElement
                      b.style.borderColor = `${accent}50`
                      b.style.color = accent
                    }}
                    onMouseLeave={e => {
                      const b = e.currentTarget as HTMLButtonElement
                      b.style.borderColor = "rgba(0,0,0,0.08)"
                      b.style.color = DARK3
                    }}
                  >
                    <span>{icon}</span>
                    <span style={{ fontSize:"9px", textTransform:"uppercase", letterSpacing:"0.08em" }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Expand / collapse footer ──────────────────────────────────────── */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width:          "100%",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            gap:            "8px",
            padding:        "8px 16px",
            background:     open ? `${accent}06` : "transparent",
            border:         "none",
            borderTop:      "1px solid rgba(0,0,0,0.06)",
            cursor:         "pointer",
            transition:     "background 0.15s",
          }}
        >
          <div style={{
            width:      "20px",
            height:     "1px",
            background: open ? accent : "rgba(0,0,0,0.15)",
            transition: "background 0.2s",
          }} />
          <span style={{
            fontSize:      "8px",
            fontWeight:    700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color:         open ? accent : DARK3,
            transition:    "color 0.2s",
          }}>
            {open ? "Collapse" : "Expand"}
          </span>
          <div style={{
            width:      "20px",
            height:     "1px",
            background: open ? accent : "rgba(0,0,0,0.15)",
            transition: "background 0.2s",
          }} />
        </button>

      </div>
    </div>
  )
}

// ── PrimaryButton ─────────────────────────────────────────────────────────────
function PrimaryButton({
  label,
  accent,
  onClick,
}: {
  label: string
  accent: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize:      "11px",
        fontWeight:    700,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        padding:       "8px 18px",
        background:    hov ? accent : "#ffffff",
        border:        `1px solid ${accent}`,
        color:         hov ? "#ffffff" : accent,
        cursor:        "pointer",
        transition:    "background 0.15s, color 0.15s",
      }}
    >
      {label}
    </button>
  )
}
