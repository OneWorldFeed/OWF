"use client"

import { useState } from "react"
import { SIGNALS } from "@/data/signals"
import FeedTabs from "@/components/feed/FeedTabs"
import { GlobalMomentsStrip } from "@/components/feed/GlobalMomentsStrip"

const CYAN = 'var(--owf-horizon)'

const FEED_TABS = ["For You", "Nature", "Space", "Ocean", "Volcano", "Culture"]

// Mock video data — replace with real data when available
const MOCK_VIDEOS = [
  { id: 'v1', title: 'Lagos Nightlife 2025', duration: '2:14', thumb: '🌃', orientation: 'vertical',  views: '84.2K' },
  { id: 'v2', title: 'Cherry Blossoms, Kyoto', duration: '0:58', thumb: '🌸', orientation: 'vertical',  views: '121K' },
  { id: 'v3', title: 'Nairobi Morning Run', duration: '1:33', thumb: '🌅', orientation: 'vertical',  views: '39.4K' },
  { id: 'v4', title: 'ISS Earth View', duration: '4:01', thumb: '🛸', orientation: 'horizontal', views: '203K' },
  { id: 'v5', title: 'Aurora Storm Live', duration: 'LIVE', thumb: '🌌', orientation: 'horizontal', views: '12.4K' },
  { id: 'v6', title: 'Elephant Herd, Amboseli', duration: '3:22', thumb: '🐘', orientation: 'horizontal', views: '67.8K' },
]

export default function HomePage() {
  const [activeTab, setActiveTab]       = useState(0)
  const [videoTab, setVideoTab]         = useState<'vertical' | 'horizontal'>('vertical')

  // TODO: replace with Firestore query when Firebase is connected
  const signals = SIGNALS

  const videos = MOCK_VIDEOS.filter(v => v.orientation === videoTab)

  return (
    <div style={{ background: 'var(--owf-bg)', minHeight: '100vh', padding: '24px 0 80px' }}>

      {/* ── Feed header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '16px',
        }}>
          <div>
            <h1 style={{
              margin: '0 0 4px', fontSize: '22px', fontWeight: 300,
              color: 'var(--owf-text)', letterSpacing: '-0.02em',
            }}>
              THE FEED
            </h1>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--owf-text-muted)', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
              {signals.length} LIVE SIGNALS · UPDATING NOW
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            border: `1px solid rgba(var(--owf-horizon-rgb), 0.25)`,
            padding: '5px 11px', fontSize: '9px', color: CYAN,
            fontFamily: 'monospace', letterSpacing: '0.12em',
            background: `rgba(var(--owf-horizon-rgb), 0.03)`,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', background: CYAN,
              boxShadow: `0 0 6px ${CYAN}`,
              animation: 'owfLivePulse 1.8s infinite',
              display: 'inline-block',
            }} />
            LIVE
          </div>
        </div>

        {/* Tab strip */}
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', borderBottom: '1px solid var(--owf-border)' }}>
          {FEED_TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                background:    'transparent',
                border:        'none',
                borderBottom:  activeTab === i ? `2px solid ${CYAN}` : '2px solid transparent',
                color:         activeTab === i ? CYAN : 'var(--owf-text-muted)',
                fontSize:      '10px',
                fontWeight:    activeTab === i ? 700 : 400,
                padding:       '10px 16px',
                cursor:        'pointer',
                whiteSpace:    'nowrap',
                fontFamily:    'monospace',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                transition:    'all 0.15s',
                marginBottom:  '-1px',
                boxShadow:     activeTab === i ? `0 2px 8px rgba(var(--owf-horizon-rgb), 0.19)` : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Global Moments ──────────────────────────────────────────────── */}
      <GlobalMomentsStrip />

      {/* ── Video Section ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: '28px' }}>
        {/* Video section header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            {(['vertical', 'horizontal'] as const).map(vt => (
              <button
                key={vt}
                onClick={() => setVideoTab(vt)}
                style={{
                  background:    'transparent',
                  border:        'none',
                  borderBottom:  videoTab === vt ? `2px solid ${CYAN}` : '2px solid transparent',
                  color:         videoTab === vt ? CYAN : 'var(--owf-text-muted)',
                  fontSize:      '10px',
                  fontWeight:    videoTab === vt ? 700 : 400,
                  padding:       '8px 16px',
                  cursor:        'pointer',
                  fontFamily:    'monospace',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  transition:    'all 0.15s',
                }}
              >
                {vt === 'vertical' ? 'VERTICAL VIDEOS' : 'HORIZONTAL VIDEOS'}
              </button>
            ))}
          </div>
          {/* Upload button */}
          <button
            style={{
              display:       'flex',
              alignItems:    'center',
              gap:           '6px',
              fontSize:      '9px',
              fontWeight:    700,
              fontFamily:    'monospace',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding:       '7px 14px',
              background:    'transparent',
              border:        `1px solid rgba(var(--owf-horizon-rgb), 0.31)`,
              color:         CYAN,
              cursor:        'pointer',
              transition:    'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `rgba(var(--owf-horizon-rgb), 0.08)` }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            UPLOAD VIDEO
          </button>
        </div>

        {/* Video grid */}
        {videoTab === 'vertical' ? (
          // Vertical: narrow cards in a row (9:16 aspect)
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            {videos.map(v => (
              <VerticalVideoCard key={v.id} video={v} />
            ))}
          </div>
        ) : (
          // Horizontal: 16:9 grid
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {videos.map(v => (
              <HorizontalVideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </div>

      {/* ── Signal Feed ────────────────────────────────────────────────── */}
      <FeedTabs signals={signals} />
    </div>
  )
}

// ── Video card components ──────────────────────────────────────────────────────

function VerticalVideoCard({ video }: { video: typeof MOCK_VIDEOS[0] }) {
  const [hov, setHov] = useState(false)
  const isLive = video.duration === 'LIVE'
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flexShrink:  0,
        width:       '130px',
        cursor:      'pointer',
        border:      `1px solid ${hov ? `rgba(var(--owf-horizon-rgb), 0.31)` : 'var(--owf-border)'}`,
        transition:  'border-color 0.15s, box-shadow 0.15s',
        boxShadow:   hov ? `0 0 20px rgba(var(--owf-horizon-rgb), 0.13)` : 'none',
        background:  'var(--owf-surface)',
      }}
    >
      {/* 9:16 thumbnail */}
      <div style={{
        width: '100%', paddingTop: '177.78%', position: 'relative', background: 'var(--owf-bg)', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px', background: 'radial-gradient(ellipse at 50% 40%, rgba(var(--owf-horizon-rgb), 0.08), transparent)',
        }}>
          {video.thumb}
        </div>
        {/* Play overlay */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hov ? 1 : 0, transition: 'opacity 0.2s',
        }}>
          <div style={{ width: 32, height: 32, border: `1px solid rgba(var(--owf-horizon-rgb), 0.50)`, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill={CYAN}><polygon points="2,1 9,5 2,9"/></svg>
          </div>
        </div>
        {/* Duration badge */}
        <div style={{
          position: 'absolute', bottom: '6px', right: '6px',
          fontSize: '8px', fontWeight: 700, fontFamily: 'monospace',
          padding: '2px 5px',
          background: isLive ? `rgba(var(--owf-horizon-rgb), 0.13)` : 'rgba(0,0,0,0.75)',
          border: `1px solid ${isLive ? CYAN : 'var(--owf-border)'}`,
          color: isLive ? CYAN : 'var(--owf-text-sub)',
          letterSpacing: '0.06em',
        }}>
          {isLive ? '● LIVE' : video.duration}
        </div>
      </div>
      <div style={{ padding: '8px' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--owf-text-sub)', lineHeight: 1.4, marginBottom: '3px' }}>
          {video.title}
        </p>
        <p style={{ fontSize: '9px', color: 'var(--owf-text-muted)', fontFamily: 'monospace' }}>{video.views}</p>
      </div>
    </div>
  )
}

function HorizontalVideoCard({ video }: { video: typeof MOCK_VIDEOS[0] }) {
  const [hov, setHov] = useState(false)
  const isLive = video.duration === 'LIVE'
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        cursor:     'pointer',
        border:     `1px solid ${hov ? `rgba(var(--owf-horizon-rgb), 0.31)` : 'var(--owf-border)'}`,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow:  hov ? `0 0 20px rgba(var(--owf-horizon-rgb), 0.13)` : 'none',
        background: 'var(--owf-surface)',
      }}
    >
      {/* 16:9 thumbnail */}
      <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', background: 'var(--owf-bg)', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '48px', background: 'radial-gradient(ellipse at 50% 40%, rgba(var(--owf-horizon-rgb), 0.08), transparent)',
        }}>
          {video.thumb}
        </div>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hov ? 1 : 0, transition: 'opacity 0.2s',
        }}>
          <div style={{ width: 40, height: 40, border: `1px solid rgba(var(--owf-horizon-rgb), 0.50)`, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 10 10" fill={CYAN}><polygon points="2,1 9,5 2,9"/></svg>
          </div>
        </div>
        <div style={{
          position: 'absolute', bottom: '8px', right: '8px',
          fontSize: '9px', fontWeight: 700, fontFamily: 'monospace', padding: '2px 6px',
          background: isLive ? `rgba(var(--owf-horizon-rgb), 0.13)` : 'rgba(0,0,0,0.75)',
          border: `1px solid ${isLive ? CYAN : 'var(--owf-border)'}`,
          color: isLive ? CYAN : 'var(--owf-text-sub)',
          letterSpacing: '0.06em',
        }}>
          {isLive ? '● LIVE' : video.duration}
        </div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--owf-text)', marginBottom: '4px' }}>{video.title}</p>
        <p style={{ fontSize: '9px', color: 'var(--owf-text-muted)', fontFamily: 'monospace' }}>{video.views} VIEWS</p>
      </div>
    </div>
  )
}
