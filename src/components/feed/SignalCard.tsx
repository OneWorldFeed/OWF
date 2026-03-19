"use client"

import { useState, useEffect, useRef } from "react"
import { Signal } from "@/types/signal"
import { getMood } from "@/lib/mood"
import { useTheme } from "@/context/ThemeProvider"

// Card register — assigned by index to create visual rhythm
type CardRegister = 'film' | 'editorial' | 'glass'

function getRegister(index: number): CardRegister {
  const pattern: CardRegister[] = ['editorial', 'film', 'glass', 'editorial', 'glass', 'film']
  return pattern[index % pattern.length]
}

// ── Scroll reveal hook ────────────────────────────────────
function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(18px)',
      transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
    }
  }
}

// ── Film Register ─────────────────────────────────────────
// Dark, cinematic, city floats over like a film credit
function FilmCard({ signal, onWatch }: { signal: Signal; onWatch: () => void }) {
  const m = getMood(signal.mood)
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onWatch}
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        aspectRatio: '3/4',
        background: `linear-gradient(160deg, #0A0A0E 0%, #050508 100%)`,
        border: `0.5px solid ${hov ? m.accent + '60' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hov
          ? `0 0 48px ${m.glow}, 0 16px 48px rgba(0,0,0,0.6)`
          : `0 4px 24px rgba(0,0,0,0.4)`,
        transform: hov ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Noise texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      {/* Mood aurora */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%', height: '70%', borderRadius: '50%',
        background: `radial-gradient(circle, ${m.glow} 0%, transparent 70%)`,
        opacity: hov ? 0.7 : 0.45,
        transition: 'opacity 0.3s',
      }} />
      {/* Top: mood + region */}
      <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: m.accent, border: `0.5px solid ${m.accent}50`,
          padding: '3px 8px', borderRadius: 4, background: `${m.accent}12`,
        }}>
          {signal.mood}
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          {signal.viewers}K watching
        </div>
      </div>
      {/* Center: thumb */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${hov ? 1.08 : 1})`,
        transition: 'transform 0.4s ease',
        fontSize: 52, filter: `drop-shadow(0 0 24px ${m.accent}90)`,
        zIndex: 1,
      }}>
        {signal.thumb}
      </div>
      {/* Bottom: film credit style */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '32px 16px 18px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.92))',
      }}>
        <div style={{
          fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.38)', marginBottom: 5,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{
            display: 'inline-block', width: 16, height: 0.5,
            background: 'rgba(255,255,255,0.25)',
          }} />
          {signal.location}
        </div>
        <div style={{
          fontSize: 14, fontWeight: 300, letterSpacing: '-0.01em',
          color: 'rgba(255,255,255,0.88)', lineHeight: 1.4, marginBottom: 8,
        }}>
          {signal.title}
        </div>
        {/* Horizon line */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${m.accent}80, transparent)`,
          boxShadow: `0 0 8px ${m.accent}50`,
          marginBottom: 8,
        }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {signal.tags.slice(0, 2).map(t => (
            <span key={t} style={{ fontSize: 10, color: m.accent, letterSpacing: '0.06em' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Editorial Register ────────────────────────────────────
// White, airy, magazine-grade — breathing mood dot
function EditorialCard({ signal, onWatch, index }: { signal: Signal; onWatch: () => void; index: number }) {
  const { theme: T } = useTheme()
  const m = getMood(signal.mood)
  const [hov, setHov] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onWatch}
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#FFFFFF',
        border: `0.5px solid ${hov ? m.accent + '60' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: hov
          ? `0 0 32px ${m.glow}, 0 8px 32px rgba(0,0,0,0.12)`
          : `0 2px 12px rgba(0,0,0,0.06)`,
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        padding: '22px 20px 20px',
        display: 'flex', flexDirection: 'column' as const,
      }}
    >
      {/* Ghost number */}
      <div style={{
        fontSize: 52, fontWeight: 200, letterSpacing: '-0.04em',
        color: hov ? m.accent + '30' : 'rgba(0,0,0,0.06)',
        lineHeight: 1, marginBottom: 10,
        transition: 'color 0.3s',
      }}>
        {num}
      </div>
      {/* City label */}
      <div style={{
        fontSize: 9, textTransform: 'uppercase',
        color: m.accent, marginBottom: 7,
        display: 'flex', alignItems: 'center', gap: 5,
        transition: 'letter-spacing 0.2s',
        letterSpacing: hov ? '0.18em' : '0.14em',
      }}>
        {signal.location}
      </div>
      {/* Title */}
      <div style={{
        fontSize: 15, fontWeight: 300, letterSpacing: '-0.01em',
        color: '#1A1410', lineHeight: 1.4, marginBottom: 10, flex: 1,
      }}>
        {signal.title}
      </div>
      {/* Blurb */}
      <div style={{ fontSize: 12, color: '#7A8A96', lineHeight: 1.6, marginBottom: 14 }}>
        {signal.blurb}
      </div>
      {/* Divider */}
      <div style={{
        height: 0.5, background: hov
          ? `linear-gradient(90deg, transparent, ${m.accent}60, transparent)`
          : 'rgba(0,0,0,0.08)',
        marginBottom: 12, transition: 'background 0.3s',
        boxShadow: hov ? `0 0 6px ${m.accent}40` : 'none',
      }} />
      {/* Meta row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, color: '#B0BEC8', letterSpacing: '0.04em' }}>
          {signal.viewers}K watching
        </div>
        {/* Breathing mood dot */}
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: m.accent,
          animation: 'owfMoodBreathe 3s ease-in-out infinite',
          boxShadow: `0 0 6px ${m.accent}80`,
        }} />
      </div>
    </div>
  )
}

// ── Glass Register ────────────────────────────────────────
// Translucent, warm, avatar-forward
function GlassCard({ signal, onWatch }: { signal: Signal; onWatch: () => void }) {
  const { theme: T, isDark } = useTheme()
  const m = getMood(signal.mood)
  const [hov, setHov] = useState(false)

  const glassBase = isDark
    ? 'rgba(255,255,255,0.055)'
    : 'rgba(255,255,255,0.72)'
  const glassBorder = isDark
    ? 'rgba(255,255,255,0.10)'
    : 'rgba(255,255,255,0.90)'

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onWatch}
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        background: glassBase,
        border: `0.5px solid ${hov ? m.accent + '55' : glassBorder}`,
        boxShadow: hov
          ? `0 0 32px ${m.glow}, 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)`
          : `0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.35)`,
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        padding: '18px 16px 16px',
        position: 'relative',
      }}
    >
      {/* Warm tint */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${m.accent}08 0%, transparent 60%)`,
        borderRadius: 18, pointerEvents: 'none',
      }} />
      {/* Avatar */}
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: `linear-gradient(135deg, ${m.accent}CC, ${m.accent}88)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, marginBottom: 12,
        boxShadow: `0 0 12px ${m.accent}50`,
        transform: hov ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.2s ease',
        position: 'relative',
      }}>
        {signal.thumb}
      </div>
      {/* City */}
      <div style={{
        fontSize: 9, letterSpacing: hov ? '0.16em' : '0.12em', textTransform: 'uppercase',
        color: m.accent, marginBottom: 7, transition: 'letter-spacing 0.2s',
        position: 'relative',
      }}>
        {signal.location}
      </div>
      {/* Text */}
      <div style={{
        fontSize: 13, fontWeight: 300, lineHeight: 1.55,
        color: isDark ? 'rgba(255,255,255,0.82)' : '#1A1410',
        marginBottom: 12, position: 'relative',
      }}>
        {signal.title}
      </div>
      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', position: 'relative' }}>
        {signal.tags.slice(0, 3).map(t => (
          <span key={t} style={{
            fontSize: 10, color: m.accent, letterSpacing: '0.05em',
          }}>
            {t}
          </span>
        ))}
      </div>
      {/* Horizon line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${m.accent}50, transparent)`,
        boxShadow: hov ? `0 0 6px ${m.accent}40` : 'none',
        transition: 'box-shadow 0.3s',
      }} />
    </div>
  )
}

// ── Main SignalCard ───────────────────────────────────────
interface SignalCardProps {
  signal: Signal
  onWatch: (signal: Signal) => void
  index?: number
}

export function SignalCard({ signal, onWatch, index = 0 }: SignalCardProps) {
  const register = getRegister(index)
  const reveal = useScrollReveal(index * 60)

  return (
    <div ref={reveal.ref} style={reveal.style}>
      {register === 'film' && (
        <FilmCard signal={signal} onWatch={() => onWatch(signal)} />
      )}
      {register === 'editorial' && (
        <EditorialCard signal={signal} onWatch={() => onWatch(signal)} index={index} />
      )}
      {register === 'glass' && (
        <GlassCard signal={signal} onWatch={() => onWatch(signal)} />
      )}
    </div>
  )
}
