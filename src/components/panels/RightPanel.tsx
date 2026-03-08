'use client';
import { useState, useEffect } from 'react';

const THEMES = [
  { id: 'dawn',     label: 'Dawn',     gradient: 'linear-gradient(135deg, #F5A623, #E8650A, #C94A00)', vars: { '--owf-bg': '#FDF6EC', '--owf-surface': '#FFFAF4', '--owf-border': '#E8C99A', '--owf-text-primary': '#2C1A08', '--owf-text-secondary': '#8A5C35', '--owf-navy': '#2C1A08', '--owf-accent': '#E8650A', '--owf-gold': '#E8650A', '--owf-glow': 'rgba(232,101,10,0.28)', '--owf-card-glow': 'rgba(232,101,10,0.07)' } },
  { id: 'noon',     label: 'Noon',     gradient: 'linear-gradient(135deg, #E0F4FF, #FFFFFF, #F0F9FF)', vars: { '--owf-bg': '#F5F7FA', '--owf-surface': '#FFFFFF', '--owf-border': '#E2E8F0', '--owf-text-primary': '#0F172A', '--owf-text-secondary': '#64748B', '--owf-navy': '#0D1F35', '--owf-accent': '#0284C7', '--owf-gold': '#0284C7', '--owf-glow': 'rgba(2,132,199,0.25)', '--owf-card-glow': 'rgba(2,132,199,0.06)' } },
  { id: 'golden',   label: 'Golden',   gradient: 'linear-gradient(135deg, #FFF3CD, #FFB347, #FF6B35)', vars: { '--owf-bg': '#FFFBF0', '--owf-surface': '#FFFDF5', '--owf-border': '#F0E0B0', '--owf-text-primary': '#1A0F00', '--owf-text-secondary': '#7A5C20', '--owf-navy': '#1A0F00', '--owf-accent': '#D97706', '--owf-gold': '#D97706', '--owf-glow': 'rgba(217,119,6,0.30)', '--owf-card-glow': 'rgba(217,119,6,0.08)' } },
  { id: 'dusk',     label: 'Dusk',     gradient: 'linear-gradient(135deg, #2D1B69, #C2185B, #FF6E40)', vars: { '--owf-bg': '#1A0F2E', '--owf-surface': '#251540', '--owf-border': '#3D2060', '--owf-text-primary': '#F5E6FF', '--owf-text-secondary': '#9B7EC8', '--owf-navy': '#3D2060', '--owf-accent': '#E040FB', '--owf-gold': '#E040FB', '--owf-glow': 'rgba(224,64,251,0.30)', '--owf-card-glow': 'rgba(224,64,251,0.08)' } },
  { id: 'midnight', label: 'Midnight', gradient: 'linear-gradient(135deg, #060E1A, #0D1F35)', vars: { '--owf-bg': '#060E1A', '--owf-surface': '#0D1F35', '--owf-border': '#1E3A5F', '--owf-text-primary': '#F0F6FF', '--owf-text-secondary': '#7A9EC0', '--owf-navy': '#1E3A5F', '--owf-accent': '#00DCBE', '--owf-gold': '#00DCBE', '--owf-glow': 'rgba(0,220,190,0.28)', '--owf-card-glow': 'rgba(0,220,190,0.07)' } },
  { id: 'cosmos',   label: 'Cosmos',   gradient: 'linear-gradient(135deg, #05020F, #120830, #1A0530)', vars: { '--owf-bg': '#05020F', '--owf-surface': '#0E0720', '--owf-border': '#1E1040', '--owf-text-primary': '#E8DFFF', '--owf-text-secondary': '#6B5B8A', '--owf-navy': '#1E1040', '--owf-accent': '#9D4EDD', '--owf-gold': '#9D4EDD', '--owf-glow': 'rgba(157,78,221,0.30)', '--owf-card-glow': 'rgba(157,78,221,0.08)' } },
  { id: 'crimson',  label: 'Crimson',  gradient: 'linear-gradient(135deg, #7F0000, #DC143C, #FF6B6B)', vars: { '--owf-bg': '#0F0205', '--owf-surface': '#1A050A', '--owf-border': '#3D0A14', '--owf-text-primary': '#FFE8EC', '--owf-text-secondary': '#C07080', '--owf-navy': '#3D0A14', '--owf-accent': '#FF2D55', '--owf-gold': '#FF2D55', '--owf-glow': 'rgba(255,45,85,0.30)', '--owf-card-glow': 'rgba(255,45,85,0.08)' } },
  { id: 'ocean',    label: 'Ocean',    gradient: 'linear-gradient(135deg, #003366, #006994, #00B4D8)', vars: { '--owf-bg': '#020C1B', '--owf-surface': '#051828', '--owf-border': '#0A3050', '--owf-text-primary': '#E0F4FF', '--owf-text-secondary': '#4A8FA8', '--owf-navy': '#0A3050', '--owf-accent': '#00B4D8', '--owf-gold': '#00B4D8', '--owf-glow': 'rgba(0,180,216,0.30)', '--owf-card-glow': 'rgba(0,180,216,0.08)' } },
  { id: 'forest',   label: 'Forest',   gradient: 'linear-gradient(135deg, #1B5E20, #2E7D32, #4CAF50)', vars: { '--owf-bg': '#F4FAF4', '--owf-surface': '#FFFFFF', '--owf-border': '#C8E6C9', '--owf-text-primary': '#0A1F0A', '--owf-text-secondary': '#2E7D32', '--owf-navy': '#1B5E20', '--owf-accent': '#1B5E20', '--owf-gold': '#1B5E20', '--owf-glow': 'rgba(27,94,32,0.25)', '--owf-card-glow': 'rgba(27,94,32,0.06)' } },
  { id: 'violet',   label: 'Violet',   gradient: 'linear-gradient(135deg, #1A0038, #4A0080, #9C27B0)', vars: { '--owf-bg': '#0A0015', '--owf-surface': '#130025', '--owf-border': '#2A0050', '--owf-text-primary': '#F0E0FF', '--owf-text-secondary': '#8050A0', '--owf-navy': '#2A0050', '--owf-accent': '#AA00FF', '--owf-gold': '#AA00FF', '--owf-glow': 'rgba(170,0,255,0.28)', '--owf-card-glow': 'rgba(170,0,255,0.07)' } },
  { id: 'obsidian', label: 'Obsidian', gradient: 'linear-gradient(135deg, #000000, #1A1A1A, #2D2D2D)', vars: { '--owf-bg': '#000000', '--owf-surface': '#111111', '--owf-border': '#222222', '--owf-text-primary': '#F5F5F5', '--owf-text-secondary': '#666666', '--owf-navy': '#222222', '--owf-accent': '#E0E0E0', '--owf-gold': '#E0E0E0', '--owf-glow': 'rgba(255,255,255,0.15)', '--owf-card-glow': 'rgba(255,255,255,0.04)' } },
  { id: 'pearl',    label: 'Pearl',    gradient: 'linear-gradient(135deg, #FDFCFB, #F5F0E8, #EDE8DF)', vars: { '--owf-bg': '#FDFCFB', '--owf-surface': '#FFFFFF', '--owf-border': '#E8E0D5', '--owf-text-primary': '#1A1410', '--owf-text-secondary': '#7A6E65', '--owf-navy': '#1A1410', '--owf-accent': '#B8860B', '--owf-gold': '#B8860B', '--owf-glow': 'rgba(184,134,11,0.22)', '--owf-card-glow': 'rgba(184,134,11,0.06)' } },
];

const TRENDING_TAGS = [
  { tag: '+lagos',          count: '12.4k', color: '#D97706' },
  { tag: '+cherryblossoms', count: '8.1k',  color: '#2563EB' },
  { tag: '+ramadan',        count: '89.2k', color: '#7C3AED' },
  { tag: '+community',      count: '4.3k',  color: '#16A34A' },
  { tag: '+nightlife',      count: '6.7k',  color: '#D97706' },
  { tag: '+afrobeats',      count: '11.2k', color: '#059669' },
  { tag: '+startups',       count: '3.8k',  color: '#EA580C' },
];

const SPOTLIGHT = [
  { title: 'Sunrise in Tokyo',          subtitle: 'A new day begins',              image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
  { title: 'Voices of Nairobi',         subtitle: 'Street stories at golden hour', image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=600' },
];

const WHO_TO_FOLLOW = [
  { name: 'Yaw Darko',    handle: 'yawdarko.feed',    color: '#059669' },
  { name: 'Priya Sharma', handle: 'priyasharma.feed', color: '#EA580C' },
  { name: 'Lena Müller',  handle: 'lenamuller.feed',  color: '#B45309' },
];

const ALL_CITIES = [
  { name: 'Lagos',        timezone: 'Africa/Lagos',                      temp: 88, region: 'Africa'   },
  { name: 'Cairo',        timezone: 'Africa/Cairo',                      temp: 82, region: 'Africa'   },
  { name: 'Nairobi',      timezone: 'Africa/Nairobi',                    temp: 70, region: 'Africa'   },
  { name: 'Accra',        timezone: 'Africa/Accra',                      temp: 85, region: 'Africa'   },
  { name: 'Tokyo',        timezone: 'Asia/Tokyo',                        temp: 72, region: 'Asia'     },
  { name: 'Mumbai',       timezone: 'Asia/Kolkata',                      temp: 91, region: 'Asia'     },
  { name: 'Seoul',        timezone: 'Asia/Seoul',                        temp: 58, region: 'Asia'     },
  { name: 'Dubai',        timezone: 'Asia/Dubai',                        temp: 95, region: 'Asia'     },
  { name: 'Singapore',    timezone: 'Asia/Singapore',                    temp: 86, region: 'Asia'     },
  { name: 'London',       timezone: 'Europe/London',                     temp: 58, region: 'Europe'   },
  { name: 'Paris',        timezone: 'Europe/Paris',                      temp: 60, region: 'Europe'   },
  { name: 'Berlin',       timezone: 'Europe/Berlin',                     temp: 52, region: 'Europe'   },
  { name: 'New York',     timezone: 'America/New_York',                  temp: 65, region: 'Americas' },
  { name: 'Los Angeles',  timezone: 'America/Los_Angeles',               temp: 72, region: 'Americas' },
  { name: 'São Paulo',    timezone: 'America/Sao_Paulo',                 temp: 75, region: 'Americas' },
  { name: 'Mexico City',  timezone: 'America/Mexico_City',               temp: 70, region: 'Americas' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires',    temp: 68, region: 'Americas' },
  { name: 'Sydney',       timezone: 'Australia/Sydney',                  temp: 74, region: 'Oceania'  },
];

const DEFAULT_PINNED = ['Lagos', 'Tokyo', 'London', 'New York'];
const USER_HOME_CITY = 'Lagos';

function getLocalTime(timezone: string) {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone });
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--owf-surface)', border: '1px solid var(--owf-border)' }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-black tracking-widest mb-3" style={{ color: 'var(--owf-text-secondary)' }}>{children}</p>;
}

export default function RightPanel() {
  const [activeTheme, setActiveTheme] = useState('noon');
  const [times, setTimes] = useState<Record<string, string>>({});
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const [pinnedCities, setPinnedCities] = useState<string[]>(DEFAULT_PINNED);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('owf-theme') || 'noon') : 'noon';
    const savedCities = typeof window !== 'undefined' ? localStorage.getItem('owf-cities') : null;
    if (savedCities) try { setPinnedCities(JSON.parse(savedCities)); } catch {}
    setActiveTheme(saved);
    applyTheme(saved);
    updateTimes();
    const interval = setInterval(updateTimes, 30000);
    return () => clearInterval(interval);
  }, []);

  function updateTimes() {
    const t: Record<string, string> = {};
    ALL_CITIES.forEach(c => { t[c.name] = getLocalTime(c.timezone); });
    setTimes(t);
  }

  function applyTheme(id: string) {
    const t = THEMES.find(x => x.id === id);
    if (!t) return;
    Object.entries(t.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }

  function handleTheme(id: string) {
    setActiveTheme(id);
    applyTheme(id);
    if (typeof window !== 'undefined') localStorage.setItem('owf-theme', id);
  }

  function toggleCity(cityName: string) {
    if (cityName === USER_HOME_CITY) return;
    const next = pinnedCities.includes(cityName)
      ? pinnedCities.filter(c => c !== cityName)
      : pinnedCities.length < 4 ? [...pinnedCities, cityName] : pinnedCities;
    setPinnedCities(next);
    if (typeof window !== 'undefined') localStorage.setItem('owf-cities', JSON.stringify(next));
  }

  const regions = ['All', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania'];
  const filteredCities = ALL_CITIES.filter(c => {
    const matchRegion = activeRegion === 'All' || c.region === activeRegion;
    const matchSearch = c.name.toLowerCase().includes(citySearch.toLowerCase());
    return matchRegion && matchSearch;
  });

  const displayCities = [
    ALL_CITIES.find(c => c.name === USER_HOME_CITY)!,
    ...pinnedCities.filter(n => n !== USER_HOME_CITY).map(n => ALL_CITIES.find(c => c.name === n)!).filter(Boolean),
  ];

  const spotlight = SPOTLIGHT[spotlightIdx];

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0" suppressHydrationWarning>

      {/* Spotlight */}
      <SectionCard>
        <SectionTitle>SPOTLIGHT</SectionTitle>
        <div className="relative rounded-xl overflow-hidden cursor-pointer" style={{ height: '140px' }}
          onClick={() => setSpotlightIdx((spotlightIdx + 1) % SPOTLIGHT.length)}>
          <img src={spotlight.image} alt={spotlight.title} className="w-full h-full object-cover"
            draggable={false} onContextMenu={e => e.preventDefault()} style={{ pointerEvents: 'none' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }} />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-bold">{spotlight.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>{spotlight.subtitle}</p>
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            {SPOTLIGHT.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i === spotlightIdx ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Trending */}
      <SectionCard>
        <SectionTitle>TRENDING</SectionTitle>
        <div className="space-y-1.5">
          {TRENDING_TAGS.map((item, i) => (
            <button key={item.tag} className="w-full flex items-center justify-between py-1.5 px-2 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: item.color + '0A' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold w-4 text-right" style={{ color: 'var(--owf-text-secondary)' }}>{i + 1}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.tag}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--owf-text-secondary)' }}>{item.count}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* World Clocks */}
      <SectionCard>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>WORLD CLOCKS</SectionTitle>
          <button onClick={() => setShowCityPicker(!showCityPicker)}
            className="text-xs font-bold px-2 py-1 rounded-lg transition-all"
            style={{ color: 'var(--owf-accent)', backgroundColor: 'var(--owf-card-glow)', border: '1px solid var(--owf-glow)' }}>
            {showCityPicker ? 'Done' : '+ Cities'}
          </button>
        </div>
        {!showCityPicker ? (
          <div className="space-y-2">
            {displayCities.map((city, i) => city && (
              <div key={city.name} className="flex items-center justify-between py-1.5 px-2 rounded-xl"
                style={{ backgroundColor: i === 0 ? 'var(--owf-card-glow)' : 'transparent', border: i === 0 ? '1px solid var(--owf-glow)' : 'none' }}>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold" style={{ color: 'var(--owf-text-primary)' }}>{city.name}</p>
                    {i === 0 && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--owf-accent)', color: '#fff' }}>HOME</span>}
                  </div>
                  <p className="text-xs" suppressHydrationWarning style={{ color: 'var(--owf-text-secondary)' }}>{times[city.name] || '--'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--owf-text-secondary)' }}>{city.temp}°F</span>
                  {i > 0 && (
                    <button onClick={() => toggleCity(city.name)} className="text-xs opacity-40 hover:opacity-100" style={{ color: 'var(--owf-text-secondary)' }}>✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <input type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)}
              placeholder="Search cities..." className="w-full text-xs px-3 py-2 rounded-xl mb-3 focus:outline-none"
              style={{ backgroundColor: 'var(--owf-bg)', border: '1px solid var(--owf-border)', color: 'var(--owf-text-primary)' }} />
            <div className="flex gap-1 flex-wrap mb-3">
              {regions.map(r => (
                <button key={r} onClick={() => setActiveRegion(r)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                  style={{ backgroundColor: activeRegion === r ? 'var(--owf-accent)' : 'var(--owf-bg)', color: activeRegion === r ? '#fff' : 'var(--owf-text-secondary)', border: '1px solid var(--owf-border)' }}>
                  {r}
                </button>
              ))}
            </div>
            <div className="space-y-1 max-h-52 overflow-y-auto">
              {filteredCities.map(city => {
                const pinned = pinnedCities.includes(city.name);
                const isHome = city.name === USER_HOME_CITY;
                return (
                  <button key={city.name} onClick={() => toggleCity(city.name)}
                    className="w-full flex items-center justify-between py-1.5 px-2 rounded-xl transition-all"
                    style={{ backgroundColor: pinned ? 'var(--owf-card-glow)' : 'transparent' }} disabled={isHome}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded flex items-center justify-center text-xs"
                        style={{ backgroundColor: pinned ? 'var(--owf-accent)' : 'var(--owf-border)', color: '#fff' }}>
                        {pinned ? '✓' : ''}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: 'var(--owf-text-primary)' }}>{city.name}</span>
                      {isHome && <span className="text-[9px] font-black px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--owf-accent)', color: '#fff' }}>HOME</span>}
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--owf-text-secondary)' }}>{city.region}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </SectionCard>

      {/* Who to follow */}
      <SectionCard>
        <SectionTitle>WHO TO FOLLOW</SectionTitle>
        <div className="space-y-3">
          {WHO_TO_FOLLOW.map(person => (
            <div key={person.handle} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${person.color}, ${person.color}bb)`, boxShadow: `0 0 8px ${person.color}44` }}>
                  {person.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--owf-text-primary)' }}>{person.name}</p>
                  <p className="text-xs" style={{ color: 'var(--owf-text-secondary)' }}>{person.handle}</p>
                </div>
              </div>
              <button className="text-xs font-bold px-3 py-1 rounded-full transition-all hover:scale-105"
                style={{ backgroundColor: person.color + '18', color: person.color, border: `1px solid ${person.color}33` }}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Theme selector */}
      <SectionCard>
        <SectionTitle>THEME</SectionTitle>
        <div className="grid grid-cols-4 gap-3">
          {THEMES.map(t => {
            const active = activeTheme === t.id;
            return (
              <button key={t.id} onClick={() => handleTheme(t.id)}
                className="flex flex-col items-center gap-1.5 transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-2xl border-2 transition-all"
                  style={{
                    background: t.gradient,
                    borderColor: active ? 'var(--owf-accent)' : 'var(--owf-border)',
                    boxShadow: active ? '0 0 0 3px var(--owf-glow), 0 4px 12px var(--owf-glow)' : 'none',
                  }} />
                <span className="text-[9px] font-bold tracking-wide text-center leading-tight"
                  style={{ color: active ? 'var(--owf-accent)' : 'var(--owf-text-secondary)' }}>
                  {t.label.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </SectionCard>

    </aside>
  );
}
