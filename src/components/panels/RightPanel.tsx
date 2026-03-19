'use client';
import React, { useState, useEffect } from 'react';
import { escalatingCall } from '@/lib/ai/escalation';
import ThemeSelector from '@/components/ui/ThemeSelector';
import RadioPlayer from '@/components/ui/RadioPlayer';

// ─── Constants ────────────────────────────────────────────────────────────────

const CYAN = 'var(--owf-horizon)'

const TRENDING = [
  { tag: '+lagos',          count: '12.4k' },
  { tag: '+cherryblossoms', count: '8.1k'  },
  { tag: '+ramadan',        count: '89.2k' },
  { tag: '+community',      count: '4.3k'  },
  { tag: '+nightlife',      count: '6.7k'  },
  { tag: '+afrobeats',      count: '11.2k' },
  { tag: '+startups',       count: '3.8k'  },
]

const SPOTLIGHT = [
  { title: 'Sunrise in Tokyo',  subtitle: 'A new day begins',              image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
  { title: 'Voices of Nairobi', subtitle: 'Street stories at golden hour', image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=600' },
]

const WHO_TO_FOLLOW = [
  { name: 'Yaw Darko',    handle: 'yawdarko.feed'    },
  { name: 'Priya Sharma', handle: 'priyasharma.feed' },
  { name: 'Lena Müller',  handle: 'lenamuller.feed'  },
]

const ALL_CITIES = [
  { name: 'Lagos',        timezone: 'Africa/Lagos',                   region: 'Africa'   },
  { name: 'Cairo',        timezone: 'Africa/Cairo',                   region: 'Africa'   },
  { name: 'Nairobi',      timezone: 'Africa/Nairobi',                 region: 'Africa'   },
  { name: 'Accra',        timezone: 'Africa/Accra',                   region: 'Africa'   },
  { name: 'Tokyo',        timezone: 'Asia/Tokyo',                     region: 'Asia'     },
  { name: 'Mumbai',       timezone: 'Asia/Kolkata',                   region: 'Asia'     },
  { name: 'Seoul',        timezone: 'Asia/Seoul',                     region: 'Asia'     },
  { name: 'Singapore',    timezone: 'Asia/Singapore',                 region: 'Asia'     },
  { name: 'Dubai',        timezone: 'Asia/Dubai',                     region: 'Asia'     },
  { name: 'Bangkok',      timezone: 'Asia/Bangkok',                   region: 'Asia'     },
  { name: 'London',       timezone: 'Europe/London',                  region: 'Europe'   },
  { name: 'Paris',        timezone: 'Europe/Paris',                   region: 'Europe'   },
  { name: 'Berlin',       timezone: 'Europe/Berlin',                  region: 'Europe'   },
  { name: 'Amsterdam',    timezone: 'Europe/Amsterdam',               region: 'Europe'   },
  { name: 'New York',     timezone: 'America/New_York',               region: 'Americas' },
  { name: 'Los Angeles',  timezone: 'America/Los_Angeles',            region: 'Americas' },
  { name: 'São Paulo',    timezone: 'America/Sao_Paulo',              region: 'Americas' },
  { name: 'Mexico City',  timezone: 'America/Mexico_City',            region: 'Americas' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', region: 'Americas' },
  { name: 'Sydney',       timezone: 'Australia/Sydney',               region: 'Oceania'  },
]

const REGIONS  = ['All', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania']
const MAX_PINNED = 3

function getLocalTime(tz: string) {
  try { return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }) }
  catch { return '--' }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Dark glass panel */
function Panel({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="owf-fade-up"
      style={{
        background:          'var(--owf-surface)',
        border:              'none',
        borderTop:           `1px solid var(--owf-border)`,
        borderBottom:        `1px solid var(--owf-border)`,
        padding:             '18px 16px',
        position:            'relative',
        animationDelay:      `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/** Section label — small caps, cyan, monospaced */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize:      '9px',
      fontWeight:    700,
      letterSpacing: '0.20em',
      color:         CYAN,
      marginBottom:  '14px',
      textTransform: 'uppercase',
      fontFamily:    'monospace',
    }}>
      {children}
    </p>
  )
}

/** Thin cyan rule */
function Rule() {
  return (
    <div style={{
      height:     '1px',
      background: `linear-gradient(90deg, transparent, rgba(var(--owf-horizon-rgb), 0.19), transparent)`,
      margin:     '14px -16px 0',
    }} />
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RightPanel() {
  const [mounted, setMounted]               = useState(false)
  const [times, setTimes]                   = useState<Record<string, string>>({})
  const [aiOpen, setAiOpen]                 = useState(false)
  const [moodResult, setMoodResult]         = useState('')
  const [moodLoading, setMoodLoading]       = useState(false)
  const [summaryResult, setSummaryResult]   = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [spotIdx, setSpotIdx]               = useState(0)
  const [homeCity, setHomeCity]             = useState('Lagos')
  const [pinned, setPinned]                 = useState<string[]>(['Tokyo', 'London', 'New York'])
  const [showPicker, setShowPicker]         = useState(false)
  const [settingHome, setSettingHome]       = useState(false)
  const [search, setSearch]                 = useState('')
  const [region, setRegion]                 = useState('All')

  useEffect(() => {
    setMounted(true)
    const c = localStorage.getItem('owf-cities')
    const h = localStorage.getItem('owf-home-city')
    if (c) setPinned(JSON.parse(c))
    if (h) setHomeCity(h)
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  function tick() {
    const t: Record<string, string> = {}
    ALL_CITIES.forEach(c => { t[c.name] = getLocalTime(c.timezone) })
    setTimes(t)
  }

  function toggleCity(name: string) {
    if (name === homeCity) return
    if (pinned.includes(name)) {
      const next = pinned.filter(c => c !== name)
      setPinned(next); localStorage.setItem('owf-cities', JSON.stringify(next))
    } else {
      const nonHome = pinned.filter(c => c !== homeCity)
      if (nonHome.length >= MAX_PINNED) return
      const next = [...pinned, name]
      setPinned(next); localStorage.setItem('owf-cities', JSON.stringify(next))
    }
  }

  function setAsHome(name: string) {
    const oldHome = homeCity
    setHomeCity(name); localStorage.setItem('owf-home-city', name)
    const next = pinned.filter(c => c !== name && c !== oldHome).slice(0, MAX_PINNED - 1)
    setPinned(next); localStorage.setItem('owf-cities', JSON.stringify(next))
    setSettingHome(false)
  }

  async function handleMoodOfDay() {
    setMoodLoading(true); setMoodResult('')
    const res = await escalatingCall('right_panel', 'In 2 sentences, describe the overall emotional mood of the world today. Be poetic. Start with an emoji.')
    setMoodResult(res.text); setMoodLoading(false)
  }

  async function handleFeedSummary() {
    setSummaryLoading(true); setSummaryResult('')
    const res = await escalatingCall('right_panel', 'Give a TL;DR of what people around the world are talking about right now. 3 bullet points, one sentence each. Use city names.')
    setSummaryResult(res.text); setSummaryLoading(false)
  }

  const displayCities = [
    ALL_CITIES.find(c => c.name === homeCity)!,
    ...pinned.filter(n => n !== homeCity).map(n => ALL_CITIES.find(c => c.name === n)!).filter(Boolean),
  ].filter(Boolean)

  const filteredCities = ALL_CITIES.filter(c => {
    const byRegion = region === 'All' || c.region === region
    const bySearch = c.name.toLowerCase().includes(search.toLowerCase())
    return byRegion && bySearch
  })

  const nonHomePinned = pinned.filter(c => c !== homeCity).length
  const spot = SPOTLIGHT[spotIdx]

  if (!mounted) return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
      {[130, 60, 80, 200, 160].map((h, i) => (
        <div key={i} style={{
          height: `${h}px`,
          background: 'var(--owf-surface)',
          borderTop: '1px solid var(--owf-border)',
        }} />
      ))}
    </aside>
  )

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>

      {/* ── Spotlight ─────────────────────────────────────────────────────── */}
      <Panel delay={0}>
        <Label>SPOTLIGHT</Label>
        <div
          onClick={() => setSpotIdx((spotIdx + 1) % SPOTLIGHT.length)}
          style={{
            position:   'relative',
            overflow:   'hidden',
            height:     '120px',
            cursor:     'pointer',
            border:     `1px solid var(--owf-border)`,
          }}
        >
          <img
            src={spot.image}
            alt={spot.title}
            draggable={false}
            onContextMenu={e => e.preventDefault()}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.88), transparent 50%)' }} />
          {/* Cyan bottom edge */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(var(--owf-horizon-rgb), 0.50), transparent)`,
          }} />
          <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px' }}>
            <p style={{ color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '2px' }}>{spot.title}</p>
            <p style={{ color: 'var(--owf-text-sub)', fontSize: '10px', letterSpacing: '0.06em', fontFamily: 'monospace' }}>{spot.subtitle}</p>
          </div>
          {/* Dot indicators */}
          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px' }}>
            {SPOTLIGHT.map((_, i) => (
              <div key={i} style={{
                width: '4px', height: '4px', borderRadius: '50%',
                background: i === spotIdx ? CYAN : 'var(--owf-text-muted)',
                boxShadow: i === spotIdx ? `0 0 6px ${CYAN}` : 'none',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>
        </div>
        <Rule />
      </Panel>

      {/* ── OWF Radio ─────────────────────────────────────────────────────── */}
      <Panel delay={0.05}>
        <Label>RADIO</Label>
        <RadioPlayer />
        <Rule />
      </Panel>

      {/* ── OWF AI ────────────────────────────────────────────────────────── */}
      <Panel delay={0.1}>
        <button
          onClick={() => setAiOpen(!aiOpen)}
          style={{
            width:      '100%',
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            padding:    0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '22px', height: '22px',
              border: `1px solid rgba(var(--owf-horizon-rgb), 0.31)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', color: CYAN,
              background: `rgba(var(--owf-horizon-rgb), 0.05)`,
            }}>◈</div>
            <span style={{
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.20em',
              color: CYAN, fontFamily: 'monospace', textTransform: 'uppercase',
            }}>OWF AI</span>
            <span style={{
              fontSize: '8px', fontWeight: 700, padding: '1px 6px',
              border: `1px solid rgba(var(--owf-horizon-rgb), 0.25)`, color: CYAN, fontFamily: 'monospace',
              letterSpacing: '0.1em',
            }}>LIVE</span>
          </div>
          <span style={{
            fontSize: '10px', color: 'var(--owf-text-muted)',
            transform: aiOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block', transition: 'transform 0.25s',
          }}>▾</span>
        </button>

        {aiOpen && (
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Mood of day */}
            <AIBlock
              title="🌍 Mood of the Day"
              sub="AI reads the global feed"
              result={moodResult}
              loading={moodLoading}
              onRun={handleMoodOfDay}
            />
            {/* Feed summary */}
            <AIBlock
              title="📋 Feed Summary"
              sub="TL;DR of what's happening"
              result={summaryResult}
              loading={summaryLoading}
              onRun={handleFeedSummary}
            />
          </div>
        )}
        <Rule />
      </Panel>

      {/* ── Trending ──────────────────────────────────────────────────────── */}
      <Panel delay={0.15}>
        <Label>TRENDING</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {TRENDING.map((item, i) => (
            <TrendRow key={item.tag} rank={i + 1} tag={item.tag} count={item.count} />
          ))}
        </div>
        <Rule />
      </Panel>

      {/* ── World Clocks ──────────────────────────────────────────────────── */}
      <Panel delay={0.2}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <Label>WORLD CLOCKS</Label>
          <div style={{ display: 'flex', gap: '4px', marginTop: '-14px' }}>
            <button
              onClick={() => { setSettingHome(!settingHome); setShowPicker(false); setSearch(''); setRegion('All') }}
              style={{
                fontSize: '8px', fontWeight: 700, padding: '3px 8px', cursor: 'pointer',
                fontFamily: 'monospace', letterSpacing: '0.08em',
                color: settingHome ? 'var(--owf-bg)' : CYAN,
                background: settingHome ? CYAN : 'transparent',
                border: `1px solid rgba(var(--owf-horizon-rgb), 0.31)`,
              }}
            >
              {settingHome ? 'CANCEL' : 'HOME'}
            </button>
            <button
              onClick={() => { setShowPicker(!showPicker); setSettingHome(false); setSearch(''); setRegion('All') }}
              style={{
                fontSize: '8px', fontWeight: 700, padding: '3px 8px', cursor: 'pointer',
                fontFamily: 'monospace', letterSpacing: '0.08em',
                color: showPicker ? 'var(--owf-bg)' : CYAN,
                background: showPicker ? CYAN : 'transparent',
                border: `1px solid rgba(var(--owf-horizon-rgb), 0.31)`,
              }}
            >
              {showPicker ? 'DONE' : '+ CITY'}
            </button>
          </div>
        </div>

        {!showPicker && !settingHome && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {displayCities.map((city, i) => (
              <div key={city.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px',
                background: i === 0 ? `rgba(var(--owf-horizon-rgb), 0.03)` : 'transparent',
                borderLeft: i === 0 ? `2px solid ${CYAN}` : '2px solid transparent',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--owf-text)', letterSpacing: '0.02em' }}>{city.name}</span>
                    {city.name === homeCity && (
                      <span style={{
                        fontSize: '7px', fontWeight: 700, padding: '1px 5px',
                        border: `1px solid rgba(var(--owf-horizon-rgb), 0.31)`, color: CYAN,
                        fontFamily: 'monospace', letterSpacing: '0.12em',
                      }}>HOME</span>
                    )}
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--owf-text-muted)', marginTop: '1px', fontFamily: 'monospace' }}>
                    {times[city.name] || '--'}
                  </p>
                </div>
                {city.name !== homeCity && (
                  <button
                    onClick={() => toggleCity(city.name)}
                    style={{
                      fontSize: '11px', color: 'var(--owf-text-muted)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
                    }}
                  >✕</button>
                )}
              </div>
            ))}
          </div>
        )}

        {(settingHome || showPicker) && (
          <div>
            <p style={{ fontSize: '9px', color: 'var(--owf-text-muted)', marginBottom: '8px', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
              {settingHome ? 'SELECT HOME CITY' : `SELECT UP TO ${MAX_PINNED} · ${nonHomePinned}/${MAX_PINNED}`}
            </p>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search cities..."
              style={{
                width: '100%', fontSize: '11px', padding: '7px 10px',
                background: 'var(--owf-bg)', border: `1px solid rgba(var(--owf-horizon-rgb), 0.20)`,
                color: 'var(--owf-text)', outline: 'none', boxSizing: 'border-box',
                marginBottom: '8px', fontFamily: 'monospace',
              }}
            />
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {REGIONS.map(r => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  style={{
                    fontSize: '8px', fontWeight: 700, padding: '2px 7px', cursor: 'pointer',
                    fontFamily: 'monospace', letterSpacing: '0.06em',
                    background: region === r ? CYAN : 'transparent',
                    color: region === r ? 'var(--owf-bg)' : 'var(--owf-text-muted)',
                    border: `1px solid ${region === r ? CYAN : 'var(--owf-border)'}`,
                  }}
                >{r}</button>
              ))}
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {filteredCities.map(city => {
                const isPinned = pinned.includes(city.name)
                const isHome   = city.name === homeCity
                const atMax    = !isPinned && !isHome && nonHomePinned >= MAX_PINNED
                return (
                  <button
                    key={city.name}
                    onClick={() => showPicker ? toggleCity(city.name) : setAsHome(city.name)}
                    disabled={showPicker ? (isHome || atMax) : false}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '5px 8px', cursor: atMax ? 'not-allowed' : 'pointer',
                      background: (isPinned && showPicker) || (isHome && settingHome) ? `rgba(var(--owf-horizon-rgb), 0.06)` : 'transparent',
                      border: 'none', opacity: atMax ? 0.25 : 1, textAlign: 'left',
                      borderLeft: (isPinned && showPicker) ? `2px solid ${CYAN}` : '2px solid transparent',
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--owf-text-sub)' }}>{city.name}</span>
                    <span style={{ fontSize: '9px', color: 'var(--owf-text-muted)', fontFamily: 'monospace' }}>{city.region}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <Rule />
      </Panel>

      {/* ── Who to Follow ─────────────────────────────────────────────────── */}
      <Panel delay={0.25}>
        <Label>WHO TO FOLLOW</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {WHO_TO_FOLLOW.map(person => (
            <FollowRow key={person.handle} person={person} />
          ))}
        </div>
        <Rule />
      </Panel>

      {/* ── Theme Selector ────────────────────────────────────────────────── */}
      <Panel delay={0.3}>
        <Label>INTERFACE</Label>
        <ThemeSelector />
        <Rule />
      </Panel>

    </aside>
  )
}

// ─── Sub-row components ───────────────────────────────────────────────────────

function TrendRow({ rank, tag, count }: { rank: number; tag: string; count: string }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 6px', cursor: 'pointer',
        background: hov ? `rgba(var(--owf-horizon-rgb), 0.02)` : 'transparent',
        border: 'none', width: '100%',
        borderLeft: hov ? `2px solid rgba(var(--owf-horizon-rgb), 0.31)` : '2px solid transparent',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--owf-text-muted)', width: '12px', textAlign: 'right', fontFamily: 'monospace' }}>{rank}</span>
        <span style={{ fontSize: '12px', fontWeight: 500, color: hov ? 'var(--owf-text)' : CYAN, fontFamily: 'monospace', letterSpacing: '0.04em', transition: 'color 0.15s' }}>{tag}</span>
      </div>
      <span style={{ fontSize: '9px', color: 'var(--owf-text-muted)', fontFamily: 'monospace' }}>{count}</span>
    </button>
  )
}

function FollowRow({ person }: { person: { name: string; handle: string } }) {
  const [hov, setHov] = useState(false)
  const initials = person.name.split(' ').map(w => w[0]).join('').toUpperCase()
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Avatar */}
        <div style={{
          width: '34px', height: '34px', flexShrink: 0,
          border: `1px solid rgba(var(--owf-horizon-rgb), 0.19)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: CYAN, fontSize: '12px', fontWeight: 700, fontFamily: 'monospace',
          background: `rgba(var(--owf-horizon-rgb), 0.03)`,
        }}>{initials}</div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--owf-text)', letterSpacing: '0.02em' }}>{person.name}</p>
          <p style={{ fontSize: '10px', color: 'var(--owf-text-muted)', marginTop: '1px', fontFamily: 'monospace' }}>{person.handle}</p>
        </div>
      </div>
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          fontSize: '9px', fontWeight: 700, padding: '5px 12px', cursor: 'pointer',
          background: hov ? CYAN : 'transparent',
          color: hov ? 'var(--owf-bg)' : CYAN,
          border: `1px solid rgba(var(--owf-horizon-rgb), 0.31)`,
          fontFamily: 'monospace', letterSpacing: '0.1em',
          transition: 'background 0.15s, color 0.15s',
        }}
      >FOLLOW</button>
    </div>
  )
}

function AIBlock({
  title, sub, result, loading, onRun,
}: {
  title: string; sub: string; result: string; loading: boolean; onRun: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ padding: '10px', background: 'var(--owf-bg)', border: `1px solid var(--owf-border)` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--owf-text)' }}>{title}</p>
          <p style={{ fontSize: '9px', color: 'var(--owf-text-muted)', marginTop: '1px', fontFamily: 'monospace' }}>{sub}</p>
        </div>
        <button
          onClick={onRun}
          disabled={loading}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            fontSize: '8px', fontWeight: 800, padding: '4px 10px', cursor: 'pointer',
            background: hov ? CYAN : 'transparent',
            color: hov ? 'var(--owf-bg)' : CYAN,
            border: `1px solid rgba(var(--owf-horizon-rgb), 0.31)`,
            fontFamily: 'monospace', letterSpacing: '0.1em',
            opacity: loading ? 0.4 : 1,
            transition: 'background 0.15s, color 0.15s',
          }}
        >
          {loading ? '···' : result ? '↺' : 'READ'}
        </button>
      </div>
      {result && (
        <p style={{
          fontSize: '11px', lineHeight: 1.65, color: 'var(--owf-text-sub)',
          borderLeft: `2px solid ${CYAN}`, paddingLeft: '8px', margin: 0,
          whiteSpace: 'pre-line',
        }}>{result}</p>
      )}
    </div>
  )
}

