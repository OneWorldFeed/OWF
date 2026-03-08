'use client';
import React, { useState, useEffect } from 'react';
import { escalatingCall } from '@/lib/ai/escalation';
import { THEMES, THEME_ORDER } from '@/lib/theme';
import { useTheme } from '@/context/ThemeProvider';
import type { ThemeId } from '@/lib/theme';

// ─── Data ────────────────────────────────────────────────────────────────────

const TRENDING = [
  { tag: '+lagos',          count: '12.4k', color: '#D97706' },
  { tag: '+cherryblossoms', count: '8.1k',  color: '#60A5FA' },
  { tag: '+ramadan',        count: '89.2k', color: '#A78BFA' },
  { tag: '+community',      count: '4.3k',  color: '#34D399' },
  { tag: '+nightlife',      count: '6.7k',  color: '#FB923C' },
  { tag: '+afrobeats',      count: '11.2k', color: '#10B981' },
  { tag: '+startups',       count: '3.8k',  color: '#F472B6' },
];

const SPOTLIGHT = [
  { title: 'Sunrise in Tokyo',       subtitle: 'A new day begins',              image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
  { title: 'Voices of Nairobi',      subtitle: 'Street stories at golden hour', image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=600' },
];

const WHO_TO_FOLLOW = [
  { name: 'Yaw Darko',    handle: 'yawdarko.feed',    color: '#10B981' },
  { name: 'Priya Sharma', handle: 'priyasharma.feed', color: '#FB923C' },
  { name: 'Lena Müller',  handle: 'lenamuller.feed',  color: '#A78BFA' },
];

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
];

const REGIONS = ['All', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania'];
const MAX_PINNED = 3;

function getLocalTime(tz: string) {
  try { return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }); }
  catch { return '--'; }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Panel({ children, glow }: { children: React.ReactNode; glow?: boolean }) {
  return (
    <div style={{
      background: 'var(--owf-surface)',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      border: '1px solid var(--owf-border)',
      borderRadius: '20px',
      padding: '20px',
      position: 'relative',
      boxShadow: glow
        ? `0 8px 32px rgba(var(--owf-horizon-rgb), 0.08), 0 1px 0 var(--owf-border) inset`
        : `0 4px 20px rgba(0,0,0,0.12), 0 1px 0 var(--owf-border) inset`,
    }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '10px', fontWeight: 900, letterSpacing: '0.14em',
      color: 'var(--owf-text-muted)', marginBottom: '14px', textTransform: 'uppercase',
    }}>
      {children}
    </p>
  );
}

function HorizonLine({ color }: { color?: string }) {
  return (
    <div style={{
      marginTop: '16px',
      marginLeft: '-20px',
      marginRight: '-20px',
      marginBottom: '-4px',
      height: '1px',
      background: color
        ? `linear-gradient(90deg, transparent 0%, ${color}90 30%, ${color} 50%, ${color}90 70%, transparent 100%)`
        : `linear-gradient(90deg, transparent 0%, var(--owf-horizon) 40% 60%, transparent 100%)`,
      opacity: 0.5,
    }} />
  );
}

// ─── Theme Selector ──────────────────────────────────────────────────────────

function ThemeSelector({ current, onChange }: { current: ThemeId; onChange: (id: ThemeId) => void }) {
  const darkThemes  = THEME_ORDER.filter(id => THEMES[id].isDark);
  const lightThemes = THEME_ORDER.filter(id => !THEMES[id].isDark);

  return (
    <div>
      <p style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--owf-text-muted)', marginBottom: '10px' }}>
        DARK
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '18px' }}>
        {darkThemes.map(id => {
          const t = THEMES[id];
          const active = current === id;
          return (
            <button key={id} onClick={() => onChange(id)} title={t.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: t.swatch,
                border: active ? `2px solid ${t.horizon}` : '2px solid rgba(255,255,255,0.08)',
                boxShadow: active ? `0 0 0 3px ${t.horizon}35, 0 0 20px ${t.aurora}` : '0 2px 10px rgba(0,0,0,0.35)',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                transform: active ? 'scale(1.1)' : 'scale(1)',
              }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                  background: t.horizon, opacity: active ? 1 : 0.4,
                  boxShadow: `0 0 8px ${t.horizon}`,
                  transition: 'opacity 0.2s',
                }} />
                {active && (
                  <div style={{
                    position: 'absolute', top: '5px', right: '5px',
                    width: '11px', height: '11px', borderRadius: '50%',
                    background: t.horizon, boxShadow: `0 0 8px ${t.horizon}`,
                  }} />
                )}
              </div>
              <span style={{
                fontSize: '9px', fontWeight: active ? 800 : 500,
                color: active ? t.horizon : 'var(--owf-text-muted)',
                letterSpacing: '0.02em', transition: 'color 0.2s', whiteSpace: 'nowrap',
              }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ height: '1px', background: 'var(--owf-border)', marginBottom: '18px' }} />

      <p style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--owf-text-muted)', marginBottom: '10px' }}>
        LIGHT
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {lightThemes.map(id => {
          const t = THEMES[id];
          const active = current === id;
          return (
            <button key={id} onClick={() => onChange(id)} title={t.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: t.swatch,
                border: active ? `2px solid ${t.horizon}` : '2px solid rgba(0,0,0,0.10)',
                boxShadow: active ? `0 0 0 3px ${t.horizon}35, 0 4px 20px ${t.aurora}` : '0 2px 10px rgba(0,0,0,0.10)',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                transform: active ? 'scale(1.1)' : 'scale(1)',
              }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                  background: t.horizon, opacity: active ? 1 : 0.35,
                  boxShadow: `0 0 8px ${t.horizon}`,
                  transition: 'opacity 0.2s',
                }} />
                {active && (
                  <div style={{
                    position: 'absolute', top: '5px', right: '5px',
                    width: '11px', height: '11px', borderRadius: '50%',
                    background: t.horizon, boxShadow: `0 0 8px ${t.horizon}`,
                  }} />
                )}
              </div>
              <span style={{
                fontSize: '9px', fontWeight: active ? 800 : 500,
                color: active ? t.horizon : 'var(--owf-text-muted)',
                letterSpacing: '0.02em', transition: 'color 0.2s', whiteSpace: 'nowrap',
              }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RightPanel() {
  const { themeId, theme: T, setTheme } = useTheme();

  const [mounted, setMounted]               = useState(false);
  const [isDesktop, setIsDesktop]           = useState(false);
  const [times, setTimes]                   = useState<Record<string, string>>({});
  const [aiOpen, setAiOpen]                 = useState(false);
  const [moodResult, setMoodResult]         = useState('');
  const [moodLoading, setMoodLoading]       = useState(false);
  const [summaryResult, setSummaryResult]   = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [spotIdx, setSpotIdx]               = useState(0);
  const [homeCity, setHomeCity]             = useState('Lagos');
  const [pinned, setPinned]                 = useState<string[]>(['Tokyo', 'London', 'New York']);
  const [showPicker, setShowPicker]         = useState(false);
  const [settingHome, setSettingHome]       = useState(false);
  const [search, setSearch]                 = useState('');
  const [region, setRegion]                 = useState('All');

  useEffect(() => {
    setMounted(true);
    const c = localStorage.getItem('owf-cities');
    const h = localStorage.getItem('owf-home-city');
    if (c) setPinned(JSON.parse(c));
    if (h) setHomeCity(h);
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    tick();
    const id = setInterval(tick, 30000);
    return () => { clearInterval(id); window.removeEventListener('resize', checkDesktop); };
  }, []);

  function tick() {
    const t: Record<string, string> = {};
    ALL_CITIES.forEach(c => { t[c.name] = getLocalTime(c.timezone); });
    setTimes(t);
  }

  function toggleCity(name: string) {
    if (name === homeCity) return;
    if (pinned.includes(name)) {
      const next = pinned.filter(c => c !== name);
      setPinned(next);
      localStorage.setItem('owf-cities', JSON.stringify(next));
    } else {
      const nonHome = pinned.filter(c => c !== homeCity);
      if (nonHome.length >= MAX_PINNED) return;
      const next = [...pinned, name];
      setPinned(next);
      localStorage.setItem('owf-cities', JSON.stringify(next));
    }
  }

  function setAsHome(name: string) {
    const oldHome = homeCity;
    setHomeCity(name);
    localStorage.setItem('owf-home-city', name);
    const next = pinned.filter(c => c !== name && c !== oldHome).slice(0, MAX_PINNED - 1);
    setPinned(next);
    localStorage.setItem('owf-cities', JSON.stringify(next));
    setSettingHome(false);
  }

  async function handleMoodOfDay() {
    setMoodLoading(true); setMoodResult('');
    const res = await escalatingCall('right_panel', 'In 2 sentences, describe the overall emotional mood of the world today. Be poetic. Start with an emoji.');
    setMoodResult(res.text);
    setMoodLoading(false);
  }

  async function handleFeedSummary() {
    setSummaryLoading(true); setSummaryResult('');
    const res = await escalatingCall('right_panel', 'Give a TL;DR of what people around the world are talking about right now. 3 bullet points, one sentence each. Use city names.');
    setSummaryResult(res.text);
    setSummaryLoading(false);
  }

  const displayCities = [
    ALL_CITIES.find(c => c.name === homeCity)!,
    ...pinned.filter(n => n !== homeCity).map(n => ALL_CITIES.find(c => c.name === n)!).filter(Boolean),
  ].filter(Boolean);

  const filteredCities = ALL_CITIES.filter(c => {
    const byRegion = region === 'All' || c.region === region;
    const bySearch = c.name.toLowerCase().includes(search.toLowerCase());
    return byRegion && bySearch;
  });

  const nonHomePinned = pinned.filter(c => c !== homeCity).length;
  const spot = SPOTLIGHT[spotIdx];

  if (!mounted) return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {[140, 60, 180, 200, 140, 320].map((h, i) => (
        <div key={i} style={{
          height: `${h}px`, borderRadius: '20px',
          background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)',
        }} />
      ))}
    </aside>
  );

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>

      {/* ── Spotlight ───────────────────────────────────────────────────── */}
      <Panel>
        <Label>SPOTLIGHT</Label>
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '130px', cursor: 'pointer' }}
          onClick={() => setSpotIdx((spotIdx + 1) % SPOTLIGHT.length)}>
          <img src={spot.image} alt={spot.title} draggable={false}
            onContextMenu={e => e.preventDefault()}
            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
            background: `linear-gradient(90deg, transparent, ${T.horizon}80, transparent)` }} />
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
            <p style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>{spot.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>{spot.subtitle}</p>
          </div>
          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px' }}>
            {SPOTLIGHT.map((_, i) => (
              <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%',
                background: i === spotIdx ? T.horizon : 'rgba(255,255,255,0.35)',
                boxShadow: i === spotIdx ? `0 0 6px ${T.horizon}` : 'none' }} />
            ))}
          </div>
        </div>
        <HorizonLine />
      </Panel>

      {/* ── OWF AI ──────────────────────────────────────────────────────── */}
      <Panel glow>
        <button onClick={() => setAiOpen(!aiOpen)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `rgba(var(--owf-horizon-rgb), 0.15)`,
              border: `1px solid rgba(var(--owf-horizon-rgb), 0.3)`,
              fontSize: '14px', color: T.horizon,
            }}>◈</div>
            <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.14em', color: 'var(--owf-text-muted)' }}>
              OWF AI
            </p>
            <span style={{
              fontSize: '8px', fontWeight: 700, padding: '2px 6px', borderRadius: '99px',
              background: `rgba(var(--owf-horizon-rgb), 0.12)`,
              color: T.horizon,
              border: `1px solid rgba(var(--owf-horizon-rgb), 0.2)`,
            }}>LIVE</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--owf-text-muted)', transition: 'transform 0.2s',
            transform: aiOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▾</span>
        </button>

        {aiOpen && (
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ borderRadius: '12px', padding: '12px', background: 'var(--owf-raised)', border: '1px solid var(--owf-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--owf-text)' }}>🌍 Mood of the Day</p>
                  <p style={{ fontSize: '9px', color: 'var(--owf-text-muted)', marginTop: '1px' }}>AI reads the global feed</p>
                </div>
                <button onClick={handleMoodOfDay} disabled={moodLoading} style={{
                  fontSize: '9px', fontWeight: 800, padding: '5px 10px', borderRadius: '8px', cursor: 'pointer',
                  background: `rgba(var(--owf-horizon-rgb), 0.15)`,
                  color: T.horizon,
                  border: `1px solid rgba(var(--owf-horizon-rgb), 0.3)`,
                  opacity: moodLoading ? 0.5 : 1,
                }}>
                  {moodLoading ? '···' : moodResult ? '↺' : 'Read'}
                </button>
              </div>
              {moodResult && (
                <p style={{ fontSize: '11px', lineHeight: 1.6, color: 'var(--owf-text-sub)',
                  borderLeft: `2px solid ${T.horizon}`, paddingLeft: '8px', margin: 0 }}>{moodResult}</p>
              )}
            </div>

            <div style={{ borderRadius: '12px', padding: '12px', background: 'var(--owf-raised)', border: '1px solid var(--owf-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--owf-text)' }}>📋 Feed Summary</p>
                  <p style={{ fontSize: '9px', color: 'var(--owf-text-muted)', marginTop: '1px' }}>TL;DR of what's happening</p>
                </div>
                <button onClick={handleFeedSummary} disabled={summaryLoading} style={{
                  fontSize: '9px', fontWeight: 800, padding: '5px 10px', borderRadius: '8px', cursor: 'pointer',
                  background: `rgba(var(--owf-horizon-rgb), 0.15)`,
                  color: T.horizon,
                  border: `1px solid rgba(var(--owf-horizon-rgb), 0.3)`,
                  opacity: summaryLoading ? 0.5 : 1,
                }}>
                  {summaryLoading ? '···' : summaryResult ? '↺' : 'Read'}
                </button>
              </div>
              {summaryResult && (
                <p style={{ fontSize: '11px', lineHeight: 1.6, color: 'var(--owf-text-sub)',
                  borderLeft: `2px solid ${T.horizon}`, paddingLeft: '8px', margin: 0,
                  whiteSpace: 'pre-line' }}>{summaryResult}</p>
              )}
            </div>
          </div>
        )}
        <HorizonLine />
      </Panel>

      {/* ── Trending ─────────────────────────────────────────────────────── */}
      <Panel>
        <Label>TRENDING NOW</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {TRENDING.map((item, i) => (
            <button key={item.tag} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: '12px', cursor: 'pointer',
              background: `${item.color}08`, border: 'none', transition: 'background 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--owf-text-muted)', width: '14px', textAlign: 'right' }}>{i + 1}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.tag}</span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--owf-text-muted)' }}>{item.count}</span>
            </button>
          ))}
        </div>
        <HorizonLine />
      </Panel>

      {/* ── World Clocks ─────────────────────────────────────────────────── */}
      <Panel>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <Label>WORLD CLOCKS</Label>
          <div style={{ display: 'flex', gap: '4px', marginTop: '-8px' }}>
            <button onClick={() => { setSettingHome(!settingHome); setShowPicker(false); setSearch(''); setRegion('All'); }}
              style={{
                fontSize: '9px', fontWeight: 800, padding: '4px 8px', borderRadius: '7px', cursor: 'pointer',
                color: settingHome ? '#fff' : T.horizon,
                background: settingHome ? T.horizon : `rgba(var(--owf-horizon-rgb), 0.10)`,
                border: `1px solid rgba(var(--owf-horizon-rgb), 0.25)`,
              }}>
              {settingHome ? 'Cancel' : '🏠'}
            </button>
            <button onClick={() => { setShowPicker(!showPicker); setSettingHome(false); setSearch(''); setRegion('All'); }}
              style={{
                fontSize: '9px', fontWeight: 800, padding: '4px 8px', borderRadius: '7px', cursor: 'pointer',
                color: showPicker ? '#fff' : T.horizon,
                background: showPicker ? T.horizon : `rgba(var(--owf-horizon-rgb), 0.10)`,
                border: `1px solid rgba(var(--owf-horizon-rgb), 0.25)`,
              }}>
              {showPicker ? 'Done' : '+ Cities'}
            </button>
          </div>
        </div>

        {!showPicker && !settingHome && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {displayCities.map((city, i) => (
              <div key={city.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: '11px',
                background: i === 0 ? `rgba(var(--owf-horizon-rgb), 0.08)` : 'transparent',
                border: i === 0 ? `1px solid rgba(var(--owf-horizon-rgb), 0.15)` : '1px solid transparent',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--owf-text)' }}>{city.name}</span>
                    {city.name === homeCity && (
                      <span style={{ fontSize: '7px', fontWeight: 900, padding: '1px 5px', borderRadius: '99px',
                        background: T.horizon, color: T.isDark ? '#000' : '#fff' }}>HOME</span>
                    )}
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--owf-text-muted)', marginTop: '1px' }}>{times[city.name] || '--'}</p>
                </div>
                {city.name !== homeCity && (
                  <button onClick={() => toggleCity(city.name)} style={{
                    fontSize: '11px', color: 'var(--owf-text-muted)', background: 'none',
                    border: 'none', cursor: 'pointer', opacity: 0.5, padding: '2px 6px',
                  }}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}

        {(settingHome || showPicker) && (
          <div>
            <p style={{ fontSize: '10px', color: 'var(--owf-text-muted)', marginBottom: '8px', fontWeight: 600 }}>
              {settingHome ? 'Tap a city to set as home' : `Select up to ${MAX_PINNED} cities (${nonHomePinned}/${MAX_PINNED})`}
            </p>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search cities..."
              style={{
                width: '100%', fontSize: '11px', padding: '7px 10px', borderRadius: '9px',
                background: 'var(--owf-raised)', border: '1px solid var(--owf-border)',
                color: 'var(--owf-text)', outline: 'none', boxSizing: 'border-box', marginBottom: '8px',
              }} />
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegion(r)} style={{
                  fontSize: '8px', fontWeight: 700, padding: '3px 7px', borderRadius: '6px', cursor: 'pointer',
                  background: region === r ? T.horizon : 'var(--owf-raised)',
                  color: region === r ? (T.isDark ? '#000' : '#fff') : 'var(--owf-text-muted)',
                  border: '1px solid var(--owf-border)',
                }}>{r}</button>
              ))}
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {filteredCities.map(city => {
                const isPinned = pinned.includes(city.name);
                const isHome = city.name === homeCity;
                const atMax = !isPinned && !isHome && nonHomePinned >= MAX_PINNED;
                return (
                  <button key={city.name}
                    onClick={() => showPicker ? toggleCity(city.name) : setAsHome(city.name)}
                    disabled={showPicker ? (isHome || atMax) : false}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '6px 8px', borderRadius: '8px', cursor: atMax ? 'not-allowed' : 'pointer',
                      background: (isPinned && showPicker) || (isHome && settingHome) ? `rgba(var(--owf-horizon-rgb), 0.10)` : 'transparent',
                      border: 'none', opacity: atMax ? 0.3 : 1, textAlign: 'left',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {showPicker && (
                        <div style={{
                          width: '14px', height: '14px', borderRadius: '4px', flexShrink: 0,
                          background: isPinned ? T.horizon : 'var(--owf-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '8px', color: isPinned ? (T.isDark ? '#000' : '#fff') : 'transparent',
                        }}>✓</div>
                      )}
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--owf-text)' }}>{city.name}</span>
                      {isHome && <span style={{ fontSize: '7px', fontWeight: 900, padding: '1px 5px', borderRadius: '99px',
                        background: T.horizon, color: T.isDark ? '#000' : '#fff' }}>HOME</span>}
                    </div>
                    <span style={{ fontSize: '9px', color: 'var(--owf-text-muted)' }}>{city.region}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <HorizonLine />
      </Panel>

      {/* ── Who to Follow ────────────────────────────────────────────────── */}
      <Panel>
        <Label>WHO TO FOLLOW</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {WHO_TO_FOLLOW.map(person => (
            <div key={person.handle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '14px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '16px', fontWeight: 900,
                  background: `linear-gradient(135deg, ${person.color}, ${person.color}99)`,
                  boxShadow: `0 0 14px ${person.color}40`,
                }}>{person.name.charAt(0)}</div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--owf-text)' }}>{person.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--owf-text-muted)', marginTop: '2px' }}>{person.handle}</p>
                </div>
              </div>
              <button style={{
                fontSize: '11px', fontWeight: 700, padding: '6px 14px', borderRadius: '99px', cursor: 'pointer',
                background: `${person.color}15`, color: person.color, border: `1px solid ${person.color}30`,
              }}>Follow</button>
            </div>
          ))}
        </div>
        <HorizonLine />
      </Panel>

      {/* ── Theme Selector ───────────────────────────────────────────────── */}
      <Panel>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <div style={{
            width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
            background: T.swatch, border: `1px solid ${T.horizon}50`,
          }} />
          <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.14em', color: 'var(--owf-text-muted)' }}>
            THEME — <span style={{ color: T.horizon }}>{T.emoji} {T.label}</span>
          </p>
        </div>
        <ThemeSelector current={themeId} onChange={setTheme} />
        <HorizonLine />
      </Panel>

    </aside>
  );
}
