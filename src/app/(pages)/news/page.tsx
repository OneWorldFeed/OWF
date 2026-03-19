'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeProvider';
const REGIONS = ['World', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania'];
const MOCK_NEWS = [
  { id: '1',  headline: 'Lagos tech hub sees record investment as African startups attract global capital', source: 'Tech Africa',     region: 'Africa',   timeAgo: '12m',  mood: 'hopeful',    reads: '8.2k' },
  { id: '2',  headline: 'Tokyo prepares for summer cultural festival with 400+ events across 23 wards',   source: 'Japan Daily',     region: 'Asia',     timeAgo: '28m',  mood: 'joyful',     reads: '5.1k' },
  { id: '3',  headline: 'Climate summit reaches new agreement on coastal city protections',               source: 'Global Watch',    region: 'World',    timeAgo: '45m',  mood: 'hopeful',    reads: '14.7k' },
  { id: '4',  headline: 'Buenos Aires tango revival draws international artists and educators',           source: 'América Sur',     region: 'Americas', timeAgo: '1h',   mood: 'joyful',     reads: '3.4k' },
  { id: '5',  headline: 'Nairobi opens largest urban green space in East Africa',                         source: 'East Africa Now', region: 'Africa',   timeAgo: '1h',   mood: 'hopeful',    reads: '6.8k' },
  { id: '6',  headline: 'Berlin\'s music scene attracts migration of young artists from across Europe',    source: 'EU Culture',      region: 'Europe',   timeAgo: '2h',   mood: 'curious',    reads: '4.2k' },
  { id: '7',  headline: 'Seoul announces city-wide digital art installation spanning 12 districts',       source: 'Korea Herald',    region: 'Asia',     timeAgo: '2h',   mood: 'electric',   reads: '9.1k' },
  { id: '8',  headline: 'Mumbai film industry sets global distribution records for regional cinema',      source: 'Bollywood Beat',  region: 'Asia',     timeAgo: '3h',   mood: 'ambitious',  reads: '11.3k' },
  { id: '9',  headline: 'Accra hosts first Pan-African AI summit with 30 nations represented',           source: 'Ghana Tech',      region: 'Africa',   timeAgo: '3h',   mood: 'ambitious',  reads: '7.5k' },
  { id: '10', headline: 'Amsterdam canal restoration project wins UNESCO preservation award',             source: 'Dutch News',      region: 'Europe',   timeAgo: '4h',   mood: 'reflective', reads: '2.9k' },
  { id: '11', headline: 'Cairo launches new metro line connecting ancient and modern districts',          source: 'Cairo Post',      region: 'Africa',   timeAgo: '4h',   mood: 'hopeful',    reads: '5.6k' },
  { id: '12', headline: 'Sydney unveils 10-year coastal arts and culture precinct masterplan',            source: 'AU Culture',      region: 'Oceania',  timeAgo: '5h',   mood: 'ambitious',  reads: '3.1k' },
];
const MOOD_COLORS: Record<string, string> = {
  hopeful: '#34D399', joyful: '#60A5FA', curious: '#A78BFA',
  electric: '#FCD34D', ambitious: '#FB923C', reflective: '#94A3B8',
};
export default function NewsPage() {
  const { theme: T } = useTheme();
  const [region, setRegion] = useState('World');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const h = T.horizon;
  const hRgb = T.horizonRgb;
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);
  function toggleSave(id: string) {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  const filtered = region === 'World'
    ? MOCK_NEWS
    : MOCK_NEWS.filter(n => n.region === region);
  return (
    <div style={{ padding: '20px 0 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 300, color: 'var(--owf-text)', letterSpacing: '-0.02em' }}>
          News
        </h1>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--owf-text-muted)', letterSpacing: '0.04em' }}>
          Global stories filtered for signal, not noise
        </p>
      </div>
      {/* Region tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto' }}>
        {REGIONS.map(r => (
          <button key={r} onClick={() => setRegion(r)} style={{
            background: region === r ? `rgba(${hRgb},0.12)` : 'transparent',
            border: `1px solid ${region === r ? `rgba(${hRgb},0.35)` : 'var(--owf-border)'}`,
            color: region === r ? h : 'var(--owf-text-muted)',
            padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: region === r ? 600 : 400,
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}>{r}</button>
        ))}
      </div>
      {/* Loading state */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              height: 88, background: 'var(--owf-raised)',
              borderRadius: 12, animation: 'owfPulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 100}ms`, marginBottom: 1,
            }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((item, i) => {
            const moodColor = MOOD_COLORS[item.mood] ?? h;
            const isSaved = saved.has(item.id);
            return (
              <div key={item.id} style={{
                padding: '18px 0',
                borderBottom: '1px solid var(--owf-border)',
                animation: 'owfCardReveal 0.4s ease both',
                animationDelay: `${i * 40}ms`,
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {/* Mood dot */}
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: moodColor, flexShrink: 0, marginTop: 6,
                    boxShadow: `0 0 6px ${moodColor}80`,
                    animation: 'owfMoodBreathe 3s ease-in-out infinite',
                    animationDelay: `${i * 0.3}s`,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 300, color: 'var(--owf-text)', lineHeight: 1.55, marginBottom: 8 }}>
                      {item.headline}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, color: moodColor, letterSpacing: '0.04em' }}>
                        {item.source}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--owf-text-muted)' }}>·</span>
                      <span style={{ fontSize: 11, color: 'var(--owf-text-muted)' }}>{item.timeAgo}</span>
                      <span style={{ fontSize: 10, color: 'var(--owf-text-muted)' }}>·</span>
                      <span style={{ fontSize: 11, color: 'var(--owf-text-muted)' }}>{item.reads} reads</span>
                      <button onClick={() => toggleSave(item.id)} style={{
                        marginLeft: 'auto', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: 14,
                        color: isSaved ? h : 'var(--owf-text-muted)',
                        transition: 'color 0.15s',
                      }}>
                        {isSaved ? '🔖' : '🏷'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
