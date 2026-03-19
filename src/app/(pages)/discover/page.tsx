'use client';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeProvider';
const CITIES = [
  { name: 'Lagos',       country: 'Nigeria',     emoji: '🌍', pop: '15M',  mood: 'Electric',   tag: 'Africa',   color: '#D97706', fact: 'Africa\'s largest city by population' },
  { name: 'Tokyo',       country: 'Japan',       emoji: '🏯', pop: '14M',  mood: 'Reflective', tag: 'Asia',     color: '#60A5FA', fact: '3,000+ islands surround its bay' },
  { name: 'Cairo',       country: 'Egypt',       emoji: '🕌', pop: '21M',  mood: 'Ancient',    tag: 'Africa',   color: '#A78BFA', fact: 'Oldest continuously inhabited megacity' },
  { name: 'Mumbai',      country: 'India',       emoji: '🎬', pop: '21M',  mood: 'Ambitious',  tag: 'Asia',     color: '#FB923C', fact: 'Bollywood produces 1,000+ films/year' },
  { name: 'Buenos Aires',country: 'Argentina',   emoji: '💃', pop: '15M',  mood: 'Joyful',     tag: 'Americas', color: '#F472B6', fact: 'Tango was born in its streets' },
  { name: 'Nairobi',     country: 'Kenya',       emoji: '🦁', pop: '5M',   mood: 'Hopeful',    tag: 'Africa',   color: '#34D399', fact: 'Only city with a national park inside it' },
  { name: 'Istanbul',    country: 'Turkey',      emoji: '🌙', pop: '15M',  mood: 'Ancient',    tag: 'Europe',   color: '#8B5CF6', fact: 'Spans two continents: Europe and Asia' },
  { name: 'Seoul',       country: 'South Korea', emoji: '🏙', pop: '10M',  mood: 'Electric',   tag: 'Asia',     color: '#6366F1', fact: 'World\'s fastest average internet speed' },
  { name: 'Accra',       country: 'Ghana',       emoji: '🥁', pop: '3M',   mood: 'Joyful',     tag: 'Africa',   color: '#10B981', fact: 'Gateway to West Africa\'s vibrant culture' },
  { name: 'Mexico City', country: 'Mexico',      emoji: '🌮', pop: '22M',  mood: 'Hopeful',    tag: 'Americas', color: '#EC4899', fact: 'Built on an ancient Aztec island city' },
  { name: 'Berlin',      country: 'Germany',     emoji: '🎵', pop: '4M',   mood: 'Resilient',  tag: 'Europe',   color: '#64748B', fact: 'Has more museums than rainy days per year' },
  { name: 'Osaka',       country: 'Japan',       emoji: '🍜', pop: '19M',  mood: 'Curious',    tag: 'Asia',     color: '#EC4899', fact: 'Japan\'s kitchen — best street food culture' },
];
const MOODS = ['All', 'Electric', 'Reflective', 'Hopeful', 'Joyful', 'Ambitious', 'Ancient', 'Curious', 'Resilient'];
const REGIONS = ['All', 'Africa', 'Asia', 'Europe', 'Americas'];
export default function DiscoverPage() {
  const { theme: T } = useTheme();
  const [search, setSearch] = useState('');
  const [mood, setMood] = useState('All');
  const [region, setRegion] = useState('All');
  const [hovered, setHovered] = useState<string | null>(null);
  const h = T.horizon;
  const hRgb = T.horizonRgb;
  const filtered = CITIES.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.country.toLowerCase().includes(search.toLowerCase())) return false;
    if (mood !== 'All' && c.mood !== mood) return false;
    if (region !== 'All' && c.tag !== region) return false;
    return true;
  });
  return (
    <div style={{ padding: '20px 0 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 300, color: 'var(--owf-text)', letterSpacing: '-0.02em' }}>
          Discover
        </h1>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--owf-text-muted)', letterSpacing: '0.04em' }}>
          Explore cities and cultures from around the world
        </p>
      </div>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cities or countries..."
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'var(--owf-raised)', border: `1px solid ${search ? h : 'var(--owf-border)'}`,
            borderRadius: 12, padding: '11px 44px 11px 16px',
            fontSize: 14, color: 'var(--owf-text)', outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>
          🔍
        </span>
      </div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
        {REGIONS.map(r => (
          <button key={r} onClick={() => setRegion(r)} style={{
            background: region === r ? `rgba(${hRgb},0.12)` : 'var(--owf-raised)',
            border: `1px solid ${region === r ? `rgba(${hRgb},0.35)` : 'var(--owf-border)'}`,
            color: region === r ? h : 'var(--owf-text-muted)',
            padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: region === r ? 600 : 400,
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}>{r}</button>
        ))}
      </div>
      {/* Mood filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 24 }}>
        {MOODS.map(m => (
          <button key={m} onClick={() => setMood(m)} style={{
            background: mood === m ? h : 'transparent',
            border: `1px solid ${mood === m ? h : 'var(--owf-border)'}`,
            color: mood === m ? '#fff' : 'var(--owf-text-muted)',
            padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: mood === m ? 600 : 400,
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}>{m}</button>
        ))}
      </div>
      {/* Count */}
      <div style={{ fontSize: 11, color: 'var(--owf-text-muted)', marginBottom: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {filtered.length} cities
      </div>
      {/* City grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {filtered.map((city, i) => {
          const isHov = hovered === city.name;
          return (
            <div
              key={city.name}
              onMouseEnter={() => setHovered(city.name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: 'var(--owf-surface)',
                border: `0.5px solid ${isHov ? city.color + '60' : 'var(--owf-border)'}`,
                borderRadius: 18, padding: '20px 18px',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                transform: isHov ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: isHov ? `0 8px 28px ${city.color}25, 0 0 0 1px ${city.color}30` : '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                animation: 'owfCardReveal 0.4s ease both',
                animationDelay: `${i * 35}ms`,
              }}
            >
              {/* Accent glow */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 80, height: 80, borderRadius: '50%',
                background: `radial-gradient(circle, ${city.color}20, transparent 70%)`,
                transform: 'translate(20px, -20px)',
                opacity: isHov ? 1 : 0.5, transition: 'opacity 0.3s',
              }} />
              <div style={{ fontSize: 36, marginBottom: 12 }}>{city.emoji}</div>
              <div style={{ marginBottom: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--owf-text)', letterSpacing: '-0.01em' }}>
                  {city.name}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--owf-text-muted)', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {city.country} · {city.pop}
              </div>
              <div style={{ fontSize: 12, color: 'var(--owf-text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
                {city.fact}
              </div>
              {/* Bottom row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase',
                  color: city.color, background: `${city.color}15`,
                  padding: '3px 8px', borderRadius: 4,
                }}>
                  {city.mood}
                </span>
                <span style={{
                  fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--owf-text-muted)', background: 'var(--owf-raised)',
                  padding: '3px 8px', borderRadius: 4,
                }}>
                  {city.tag}
                </span>
              </div>
              {/* Horizon line */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${city.color}50, transparent)`,
                opacity: isHov ? 1 : 0, transition: 'opacity 0.3s',
              }} />
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--owf-text-muted)', fontSize: 14 }}>
          No cities match your filters
        </div>
      )}
    </div>
  );
}
