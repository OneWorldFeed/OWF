"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Signal } from "@/types/signal"
import { translateText } from "@/lib/freeapis"

/* ── Mood accent colours ──────────────────────────────────────────────────── */

const MOOD_ACCENT: Record<string, string> = {
  wonder: "#6366F1",
  cosmos: "#8B5CF6",
  earth:  "#10B981",
  aurora: "#3B82F6",
  fire:   "#EF4444",
}
function accent(m: string) { return MOOD_ACCENT[m] ?? "#6366F1" }

/* ── Scroll reveal ────────────────────────────────────────────────────────── */

function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.06 },
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

/* ── Compact number ───────────────────────────────────────────────────────── */

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

/* ── Props ────────────────────────────────────────────────────────────────── */

interface SignalCardProps {
  signal:  Signal
  index?:  number
}

/* ── Component ────────────────────────────────────────────────────────────── */

export function SignalCard({ signal, index = 0 }: SignalCardProps) {
  const reveal = useScrollReveal(index * 55)
  const mc = accent(signal.mood)
  const ix = signal.interactions

  // Card states
  type CardState = "default" | "expanded" | "minimized"
  const [state, setState] = useState<CardState>("default")
  const [hov, setHov]     = useState(false)

  // Interactions (local)
  const [liked, setLiked]         = useState(false)
  const [likeCount, setLikeCount] = useState(ix?.likes ?? 0)
  const [bookmarked, setBookmarked] = useState(false)

  // Overflow menu
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Repost dropdown
  const [repostOpen, setRepostOpen] = useState(false)
  const repostRef = useRef<HTMLDivElement>(null)

  // Video
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted]   = useState(true)
  const [playing, setPlaying] = useState(true)

  // Translate
  const [translated, setTranslated] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)

  // Ask Owl
  const [owlResponse, setOwlResponse] = useState<string | null>(null)
  const [owlLoading, setOwlLoading]   = useState(false)

  // Blurb expand
  const isExpanded = state === "expanded"

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
      if (repostOpen && repostRef.current && !repostRef.current.contains(e.target as Node)) setRepostOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [menuOpen, repostOpen])

  // Handlers
  const toggleLike = () => { setLiked(l => !l); setLikeCount(c => liked ? c - 1 : c + 1) }
  const toggleBookmark = () => setBookmarked(b => !b)

  const toggleVideo = useCallback(() => {
    const v = videoRef.current; if (!v) return
    if (v.paused) { v.play(); setPlaying(true) } else { v.pause(); setPlaying(false) }
  }, [])

  const toggleMute = useCallback(() => {
    const v = videoRef.current; if (!v) return
    v.muted = !v.muted; setMuted(v.muted)
  }, [])

  const handleTranslate = async () => {
    if (translated) { setTranslated(null); return }
    setTranslating(true)
    const lang = navigator.language.split("-")[0]
    const result = await translateText(signal.blurb, lang)
    setTranslated(result)
    setTranslating(false)
  }

  const handleAskOwl = async () => {
    if (owlResponse) { setOwlResponse(null); return }
    setOwlLoading(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lens: "social", message: `${signal.title} ${signal.blurb}` }),
      })
      if (res.ok) {
        const data = await res.json()
        setOwlResponse(data.text ?? data.content?.[0]?.text ?? "No response")
      } else {
        setOwlResponse("Owl is unavailable right now.")
      }
    } catch {
      setOwlResponse("Owl is unavailable right now.")
    }
    setOwlLoading(false)
  }

  // Media rendering
  const mt = signal.mediaType
  const hasMedia = mt && mt !== "text" && signal.mediaUrl
  const isVertical = mt === "image-vertical" || mt === "video-vertical"
  const isVideo = mt === "video-horizontal" || mt === "video-vertical"
  const aspectPadding = isVertical ? "125%" : "56.25%"

  // Minimized state — avatar + title only
  if (state === "minimized") {
    return (
      <div ref={reveal.ref} style={reveal.style}>
        {/* Repost header */}
        {signal.repostedBy && (
          <div style={{ fontSize: "11px", color: "var(--owf-card-text-sub)", padding: "0 0 4px 52px" }}>
            ↩ {signal.repostedBy.displayName} reposted
          </div>
        )}
        <div
          onClick={() => setState("default")}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            background:    "var(--owf-card)",
            borderRadius:  "16px",
            border:        "1px solid var(--owf-card-border)",
            padding:       "10px 14px",
            display:       "flex",
            alignItems:    "center",
            gap:           "10px",
            cursor:        "pointer",
            boxShadow:     hov ? `0 0 0 2px ${mc}18, 0 4px 16px rgba(0,0,0,0.06)` : "0 1px 4px rgba(0,0,0,0.04)",
            transition:    "box-shadow 0.2s",
          }}
        >
          {/* Avatar */}
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
            border: `2px solid ${mc}`, overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", background: `${mc}14`,
          }}>
            {signal.authorAvatar
              ? <img src={signal.authorAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : signal.thumb}
          </div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--owf-card-text)", flex: 1, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {signal.title}
          </p>
          <span style={{ fontSize: "10px", color: "var(--owf-card-text-sub)", flexShrink: 0 }}>{signal.duration}</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={reveal.ref} style={reveal.style}>
      {/* Repost header — outside card shell */}
      {signal.repostedBy && (
        <div style={{ fontSize: "11px", color: "var(--owf-card-text-sub)", padding: "0 0 4px 52px" }}>
          ↩ {signal.repostedBy.displayName} reposted
        </div>
      )}

      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background:    "var(--owf-card)",
          borderRadius:  "16px",
          border:        "1px solid var(--owf-card-border)",
          overflow:      "hidden",
          boxShadow:     hov
            ? `0 0 0 3px ${mc}12, 0 8px 32px rgba(0,0,0,0.1)`
            : "0 1px 4px rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.03)",
          transition:    "box-shadow 0.25s, border-color 0.2s",
          borderColor:   hov ? `${mc}40` : undefined,
        }}
      >

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "14px 14px 10px" }}>
          {/* Avatar */}
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
            border: `2px solid ${mc}`, overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", background: `${mc}14`,
          }}>
            {signal.authorAvatar
              ? <img src={signal.authorAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : signal.thumb}
          </div>

          {/* Author info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--owf-card-text)" }}>
                {signal.authorHandle?.replace(".feed", "") ?? "OWF"}
              </span>
              {signal.authorHandle && (
                <span style={{ fontSize: "11px", color: "var(--owf-card-text-sub)" }}>
                  {signal.authorHandle}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--owf-card-text-sub)", marginTop: "1px" }}>
              <span>{signal.location}</span>
              <span>·</span>
              <span>{signal.duration}</span>
            </div>
          </div>

          {/* Right: mood badge + overflow */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <span style={{
              fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              color: mc, background: `${mc}14`, border: `1px solid ${mc}30`,
              padding: "2px 8px", borderRadius: "6px",
            }}>
              {signal.mood}
            </span>

            {/* Overflow menu */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "14px", color: "var(--owf-card-text-sub)", padding: "4px",
                  lineHeight: 1, letterSpacing: "2px",
                }}
              >
                •••
              </button>
              {menuOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "100%", zIndex: 20,
                  background: "var(--owf-card)", border: "1px solid var(--owf-card-border)",
                  borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  minWidth: "140px", overflow: "hidden",
                }}>
                  {["Mute", "Block", "Report", "Copy link"].map(item => (
                    <button key={item} onClick={() => setMenuOpen(false)} style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "9px 14px", fontSize: "12px", fontWeight: 500,
                      color: item === "Block" || item === "Report" ? "#EF4444" : "var(--owf-card-text)",
                      background: "none", border: "none", cursor: "pointer",
                    }}>
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── MEDIA BLOCK ─────────────────────────────────────────── */}
        {hasMedia && (
          <div style={{ position: "relative", width: "100%", paddingTop: aspectPadding, overflow: "hidden", background: "#0a0a0a" }}>
            {isVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={signal.mediaUrl}
                  autoPlay muted loop playsInline
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* Play/pause toggle */}
                <button onClick={toggleVideo} style={{
                  position: "absolute", inset: 0, background: "transparent",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {!playing && (
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 16 16" fill={mc}>
                        <polygon points="4,2 14,8 4,14" />
                      </svg>
                    </div>
                  )}
                </button>
                {/* Mute toggle — bottom right */}
                <button onClick={toggleMute} style={{
                  position: "absolute", bottom: "10px", right: "10px",
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", color: "#fff",
                }}>
                  {muted ? "🔇" : "🔊"}
                </button>
                {/* Duration badge */}
                <div style={{
                  position: "absolute", bottom: "10px", left: "10px",
                  fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em",
                  padding: "3px 8px", borderRadius: "4px",
                  background: signal.duration === "LIVE" ? `${mc}22` : "rgba(0,0,0,0.7)",
                  border: `1px solid ${signal.duration === "LIVE" ? mc + "60" : "rgba(255,255,255,0.18)"}`,
                  color: signal.duration === "LIVE" ? mc : "rgba(255,255,255,0.88)",
                }}>
                  {signal.duration === "LIVE" ? "● LIVE" : signal.duration}
                </div>
              </>
            ) : (
              <img
                src={signal.mediaUrl}
                alt={signal.title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        )}

        {/* ── BODY ────────────────────────────────────────────────── */}
        <div style={{ padding: "12px 14px 0" }}>
          {/* Title */}
          <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--owf-card-text)", margin: "0 0 6px", lineHeight: 1.35 }}>
            {signal.title}
          </p>

          {/* Blurb */}
          <div style={{ position: "relative", marginBottom: "8px" }}>
            <p style={{
              fontSize: "13px", lineHeight: 1.6, color: "var(--owf-card-text-sub)", margin: 0,
              ...(isExpanded ? {} : {
                display: "-webkit-box",
                WebkitBoxOrient: "vertical" as const,
                WebkitLineClamp: 3,
                overflow: "hidden",
              }),
            } as React.CSSProperties}>
              {translated ?? signal.blurb}
            </p>
            {!isExpanded && (
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "24px",
                background: "linear-gradient(transparent, var(--owf-card))",
                pointerEvents: "none",
              }} />
            )}
          </div>

          {/* Read more / collapse */}
          <button
            onClick={() => setState(isExpanded ? "default" : "expanded")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "12px", fontWeight: 600, color: mc, padding: 0, marginBottom: "8px",
            }}
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>

          {/* Why it matters — expanded only */}
          {isExpanded && signal.whyMatters && (
            <div style={{
              padding: "10px 12px", marginBottom: "10px",
              borderLeft: `3px solid ${mc}`, background: `${mc}08`,
              borderRadius: "0 8px 8px 0",
            }}>
              <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: mc, margin: "0 0 4px" }}>
                WHY IT MATTERS
              </p>
              <p style={{ fontSize: "12px", lineHeight: 1.65, color: "var(--owf-card-text-sub)", margin: 0 }}>
                {signal.whyMatters}
              </p>
            </div>
          )}

          {/* Tags */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {signal.tags.slice(0, 5).map(t => (
              <span key={t} style={{
                fontSize: "11px", fontWeight: 600, color: mc,
                background: `${mc}14`, padding: "3px 10px", borderRadius: "99px",
                cursor: "pointer",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── INTERACTION BAR ─────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 14px 10px", borderTop: "1px solid var(--owf-card-border)",
          flexWrap: "wrap", gap: "6px",
        }}>
          {/* Left cluster */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Like */}
            <button onClick={toggleLike} style={{
              display: "flex", alignItems: "center", gap: "4px",
              background: "none", border: "none", cursor: "pointer",
              fontSize: "12px", color: liked ? "#EF4444" : "var(--owf-card-text-sub)",
              fontWeight: liked ? 700 : 400, transition: "color .15s, transform .15s",
              transform: liked ? "scale(1.1)" : "scale(1)",
            }}>
              {liked ? "♥" : "♡"} {fmtNum(likeCount)}
            </button>

            {/* Comment */}
            <button style={{
              display: "flex", alignItems: "center", gap: "4px",
              background: "none", border: "none", cursor: "pointer",
              fontSize: "12px", color: "var(--owf-card-text-sub)",
            }}>
              💬 {fmtNum(ix?.comments ?? 0)}
            </button>

            {/* Repost */}
            <div ref={repostRef} style={{ position: "relative" }}>
              <button onClick={() => setRepostOpen(o => !o)} style={{
                display: "flex", alignItems: "center", gap: "4px",
                background: "none", border: "none", cursor: "pointer",
                fontSize: "12px", color: "var(--owf-card-text-sub)",
              }}>
                ↩ {fmtNum(ix?.reposts ?? 0)}
              </button>
              {repostOpen && (
                <div style={{
                  position: "absolute", bottom: "100%", left: 0, zIndex: 20,
                  background: "var(--owf-card)", border: "1px solid var(--owf-card-border)",
                  borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  minWidth: "130px", overflow: "hidden", marginBottom: "4px",
                }}>
                  {["Repost", "Quote repost"].map(item => (
                    <button key={item} onClick={() => setRepostOpen(false)} style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "9px 14px", fontSize: "12px", fontWeight: 500,
                      color: "var(--owf-card-text)", background: "none",
                      border: "none", cursor: "pointer",
                    }}>
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmark */}
            <button onClick={toggleBookmark} style={{
              display: "flex", alignItems: "center", gap: "2px",
              background: "none", border: "none", cursor: "pointer",
              fontSize: "13px", color: bookmarked ? "#F59E0B" : "var(--owf-card-text-sub)",
              transition: "color .15s, transform .15s",
              transform: bookmarked ? "scale(1.15)" : "scale(1)",
            }}>
              {bookmarked ? "🔖" : "🔖"}
            </button>
          </div>

          {/* Right cluster */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Reach */}
            {ix?.reach && (
              <span style={{ fontSize: "10px", color: "var(--owf-card-text-sub)", whiteSpace: "nowrap" }}>
                🌍 {ix.reach.cities} cities · {ix.reach.countries} countries
              </span>
            )}

            {/* Translate */}
            <button onClick={handleTranslate} disabled={translating} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "12px", color: translated ? mc : "var(--owf-card-text-sub)",
              fontWeight: translated ? 600 : 400, padding: "2px",
            }}>
              🌐 {translating ? "…" : translated ? "Original" : "Translate"}
            </button>

            {/* Ask Owl */}
            <button onClick={handleAskOwl} disabled={owlLoading} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "12px", color: owlResponse ? mc : "var(--owf-card-text-sub)",
              fontWeight: owlResponse ? 600 : 400, padding: "2px",
            }}>
              🦉 {owlLoading ? "…" : owlResponse ? "Close" : "Ask Owl"}
            </button>
          </div>
        </div>

        {/* ── OWL RESPONSE PANEL ──────────────────────────────────── */}
        {owlResponse && (
          <div style={{
            padding: "12px 14px", borderTop: "1px solid var(--owf-card-border)",
            background: `${mc}06`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <span style={{ fontSize: "14px" }}>🦉</span>
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: mc }}>
                OWF OWL
              </span>
            </div>
            <p style={{ fontSize: "12px", lineHeight: 1.65, color: "var(--owf-card-text-sub)", margin: 0 }}>
              {owlResponse}
            </p>
          </div>
        )}

        {/* ── MINIMIZE BUTTON ─────────────────────────────────────── */}
        <button
          onClick={() => setState("minimized")}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", padding: "7px 14px",
            background: "transparent", border: "none", borderTop: "1px solid var(--owf-card-border)",
            cursor: "pointer",
          }}
        >
          <div style={{ width: "20px", height: "1px", background: "var(--owf-card-text-sub)", opacity: 0.3 }} />
          <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--owf-card-text-sub)", opacity: 0.5 }}>
            Minimize
          </span>
          <div style={{ width: "20px", height: "1px", background: "var(--owf-card-text-sub)", opacity: 0.3 }} />
        </button>
      </div>
    </div>
  )
}
