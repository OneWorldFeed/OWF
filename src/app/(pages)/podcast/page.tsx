'use client';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeProvider';
const EPISODES = [
  { id: '1', title: 'Lagos After Dark: The Night Economy',     host: 'Amara Diallo',  city: 'Lagos',        duration: '38m', moodColor: '#FCD34D', plays: '12.4k', cover: '#D97706' },
  { id: '2', title: 'Cherry Blossoms and Climate Memory',      host: 'Mei Tanaka',    city: 'Tokyo',        duration: '24m', moodColor: '#60A5FA', plays: '8.7k',  cover: '#60A5FA' },
  { id: '3', title: 'Building Community Gardens in CDMX',      host: 'Carlos Mendez', city: 'Mexico City',  duration: '41m', moodColor: '#34D399', plays: '5.2k',  cover: '#34D399' },
  { id: '4', title: 'Mumbai Pitch Culture: The New Founders',  host: 'Priya Sharma',  city: 'Mumbai',       duration: '52m', moodColor: '#FB923C', plays: '19.1k', cover: '#FB923C' },
  { id: '5', title: 'Tango as Language: Buenos Aires Stories', host: 'Sofia Reyes',   city: 'Buenos Aires', duration: '31m', moodColor: '#F472B6', plays: '6.8k',  cover: '#F472B6' },
  { id: '6', title: 'Afrobeats and the Global Sound Shift',    host: 'Yaw Darko',     city: 'Accra',        duration: '44m', moodColor: '#10B981', plays: '22.3k', cover: '#10B981' },
  { id: '7', title: 'Seoul at 3AM: The Insomnia Economy',      host: 'Jin Park',      city: 'Seoul',        duration: '29m', moodColor: '#6366F1', plays: '14.6k', cover: '#6366F1' },
  { id: '8', title: 'Berlin Studio Diaries: Making Something', host: 'Lena Muller',   city: 'Berlin',       duration: '56m', moodColor: '#8B5CF6', plays: '9.4k',  cover: '#8B5CF6' },
];
const CATEGORIES = ['All', 'Culture', 'Music', 'Tech', 'Community'];
export default function PodcastPage() {
  const { theme: T } = useTheme();
  const [playing, setPlaying] = useState<string | null>(null);
  const [category, setCategory] = useState('All');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const h = T.horizon;
  const hRgb = T.horizonRgb;
  function toggleSave(id: string) {
    setSaved(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  return (
    <div style={{ padding: '20px 0 80px' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 300, color: 'var(--owf-text)', letterSpacing: '-0.02em' }}>
          Podcast
        </h1>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--owf-text-muted)', letterSpacing: '0.04em' }}>
          Voices from cities around the world
        </p>
      </div>
      {/* Featured */}
      <div style={{
        background: `linear-gradient(135deg, rgba(${hRgb},0.12), rgba(${hRgb},0.04))`,
        border: `1px solid rgba(${hRgb},0.18)`,
        borderRadius: 20, padding: '24px', marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, rgba(${hRgb},0.15), transparent 70%)` }} />
        <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: h, marginBottom: 10 }}>
          Featured Episode
        </div>
        <div style={{ fontSize: 17, fontWeight: 300, color: 'var(--owf-text)', marginBottom: 6, lineHeight: 1.4 }}>
          {EPISODES[5].title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--owf-text-muted)', marginBottom: 16 }}>
          {EPISODES[5].host} · {EPISODES[5].city} · {EPISODES[5].duration}
        </div>
        <button
          onClick={() => setPlaying(playing === EPISODES[5].id ? null : EPISODES[5].id)}
          style={{
            background: h, border: 'none', color: '#fff',
            padding: '10px 24px', borderRadius: 24, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: `0 4px 16px rgba(${hRgb},0.35)`,
          }}
        >
          {playing === EPISODES[5].id ? 'Pause' : 'Play Episode'}
        </button>
        {playing === EPISODES[5].id && (
          <div style={{ display: 'flex', gap: 3, alignItems: 'center', marginTop: 16 }}>
            {[12,18,8,22,14,20,10,16,24,12,18,8,20,14,10,22,16,12,18,10].map((h2, i) => (
              <div key={i} style={{
                width: 3, borderRadius: 2, background: h, height: h2,
                animation: 'owfWave 0.8s ease-in-out infinite',
                animationDelay: `${i * 0.06}s`, opacity: 0.7,
              }} />
            ))}
          </div>
        )}
      </div>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            background: category === c ? h : 'transparent',
            border: `1px solid ${category === c ? h : 'var(--owf-border)'}`,
            color: category === c ? '#fff' : 'var(--owf-text-muted)',
            padding: '5px 14px', borderRadius: 20, fontSize: 12,
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}>{c}</button>
        ))}
      </div>
      {/* Episode list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {EPISODES.map((ep, i) => {
          const isPlaying = playing === ep.id;
          const isSaved = saved.has(ep.id);
          return (
            <div key={ep.id} style={{
              display: 'flex', gap: 14, alignItems: 'center',
              background: isPlaying ? `rgba(${hRgb},0.06)` : 'var(--owf-surface)',
              border: `1px solid ${isPlaying ? `rgba(${hRgb},0.25)` : 'var(--owf-border)'}`,
              borderRadius: 14, padding: '14px 16px', transition: 'all 0.2s',
              animation: 'owfCardReveal 0.4s ease both',
              animationDelay: `${i * 40}ms`,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                background: ep.cover, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 20, color: '#fff', fontWeight: 700,
                boxShadow: `0 0 12px ${ep.cover}50`,
              }}>
                {ep.city[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--owf-text)', marginBottom: 3, lineHeight: 1.4 }}>
                  {ep.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--owf-text-muted)' }}>
                  {ep.host} · {ep.city} · {ep.duration} · {ep.plays} plays
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <button onClick={() => toggleSave(ep.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 16, color: isSaved ? h : 'var(--owf-text-muted)',
                }}>
                  {isSaved ? '◈' : '◇'}
                </button>
                <button onClick={() => setPlaying(isPlaying ? null : ep.id)} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: isPlaying ? h : 'var(--owf-raised)',
                  border: `1px solid ${isPlaying ? h : 'var(--owf-border)'}`,
                  color: isPlaying ? '#fff' : 'var(--owf-text-muted)',
                  fontSize: 13, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  boxShadow: isPlaying ? `0 0 12px rgba(${hRgb},0.4)` : 'none',
                }}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes owfWave { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }`}</style>
    </div>
  );
}
