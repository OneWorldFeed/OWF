'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeProvider';
const TRACKS = [
  { id: '1',  title: 'Lagos Sunset',        artist: 'Burna Boy',        city: 'Lagos',     genre: 'Afrobeats',  duration: '3:47', plays: '2.1M', color: '#D97706' },
  { id: '2',  title: 'Shibuya Crossing',    artist: 'Ryuichi Sakamoto', city: 'Tokyo',     genre: 'Ambient',    duration: '5:12', plays: '890K', color: '#60A5FA' },
  { id: '3',  title: 'Nairobi Rhythm',      artist: 'Sauti Sol',        city: 'Nairobi',   genre: 'Afropop',    duration: '4:03', plays: '1.4M', color: '#34D399' },
  { id: '4',  title: 'Mumbai Dreams',       artist: 'A.R. Rahman',      city: 'Mumbai',    genre: 'Fusion',     duration: '6:21', plays: '3.2M', color: '#FB923C' },
  { id: '5',  title: 'Cairo Nights',        artist: 'Oum Kalthoum',     city: 'Cairo',     genre: 'Classical',  duration: '7:44', plays: '1.8M', color: '#A78BFA' },
  { id: '6',  title: 'Seoul Wave',          artist: 'BTS',              city: 'Seoul',     genre: 'K-Pop',      duration: '3:24', plays: '8.4M', color: '#6366F1' },
  { id: '7',  title: 'Berlin Techno Drift', artist: 'Ben Klock',        city: 'Berlin',    genre: 'Techno',     duration: '9:18', plays: '445K', color: '#8B5CF6' },
  { id: '8',  title: 'Accra Highlife',      artist: 'Kofi Boakye',      city: 'Accra',     genre: 'Highlife',   duration: '4:37', plays: '560K', color: '#10B981' },
  { id: '9',  title: 'Istanbul Bosphorus',  artist: 'Mercan Dede',      city: 'Istanbul',  genre: 'Electronic', duration: '6:02', plays: '720K', color: '#EC4899' },
  { id: '10', title: 'Carnaval do Rio',     artist: 'Seu Jorge',        city: 'Sao Paulo', genre: 'MPB',        duration: '4:55', plays: '670K', color: '#F472B6' },
];
const GENRES = ['All', 'Afrobeats', 'Ambient', 'Afropop', 'Fusion', 'K-Pop', 'Techno', 'Electronic'];
export default function MusicPage() {
  const { theme: T } = useTheme();
  const [playing, setPlaying] = useState<string | null>(null);
  const [genre, setGenre] = useState('All');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [seconds, setSeconds] = useState(0);
  const h = T.horizon;
  const hRgb = T.horizonRgb;
  useEffect(() => {
    if (!playing) { setSeconds(0); return; }
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [playing]);
  function toggleLike(id: string) {
    setLiked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function fmt(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }
  const filtered = genre === 'All' ? TRACKS : TRACKS.filter(t => t.genre === genre);
  const currentTrack = TRACKS.find(t => t.id === playing);
  return (
    <div style={{ padding: '20px 0 120px' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 300, color: 'var(--owf-text)', letterSpacing: '-0.02em' }}>
          Music
        </h1>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--owf-text-muted)', letterSpacing: '0.04em' }}>
          Sounds from cities around the world
        </p>
      </div>
      {/* Genre filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 24 }}>
        {GENRES.map(g => (
          <button key={g} onClick={() => setGenre(g)} style={{
            background: genre === g ? h : 'transparent',
            border: `1px solid ${genre === g ? h : 'var(--owf-border)'}`,
            color: genre === g ? '#fff' : 'var(--owf-text-muted)',
            padding: '5px 14px', borderRadius: 20, fontSize: 12,
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}>{g}</button>
        ))}
      </div>
      {/* Track list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((track, i) => {
          const isPlaying = playing === track.id;
          const isLiked = liked.has(track.id);
          return (
            <div key={track.id} style={{
              display: 'flex', gap: 14, alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid var(--owf-border)',
              background: isPlaying ? `rgba(${hRgb},0.04)` : 'transparent',
              paddingLeft: isPlaying ? 10 : 0, borderRadius: isPlaying ? 10 : 0,
              transition: 'all 0.2s', animation: 'owfCardReveal 0.35s ease both',
              animationDelay: `${i * 30}ms`,
            }}>
              {/* Track number / waveform */}
              <div style={{ width: 28, flexShrink: 0, textAlign: 'center' }}>
                {isPlaying ? (
                  <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 18, justifyContent: 'center' }}>
                    {[12, 18, 10, 16].map((ht, j) => (
                      <div key={j} style={{
                        width: 2.5, borderRadius: 1.5, background: h, height: ht,
                        animation: 'owfWave 0.8s ease-in-out infinite',
                        animationDelay: `${j * 0.12}s`,
                      }} />
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--owf-text-muted)' }}>{i + 1}</span>
                )}
              </div>
              {/* Color dot */}
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: track.color,
                boxShadow: isPlaying ? `0 0 8px ${track.color}80` : 'none',
                transition: 'box-shadow 0.2s',
              }} />
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: isPlaying ? 500 : 300,
                  color: isPlaying ? h : 'var(--owf-text)',
                  marginBottom: 2, transition: 'color 0.2s',
                }}>
                  {track.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--owf-text-muted)' }}>
                  {track.artist} · {track.city} · {track.genre}
                </div>
              </div>
              {/* Duration + plays */}
              <div style={{ fontSize: 11, color: 'var(--owf-text-muted)', textAlign: 'right', flexShrink: 0 }}>
                <div>{isPlaying ? fmt(seconds) : track.duration}</div>
                <div style={{ fontSize: 10, marginTop: 1 }}>{track.plays}</div>
              </div>
              {/* Like */}
              <button onClick={() => toggleLike(track.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 16, flexShrink: 0,
                color: isLiked ? '#EF4444' : 'var(--owf-text-muted)',
                transition: 'color 0.15s',
              }}>
                {isLiked ? '♥' : '♡'}
              </button>
              {/* Play */}
              <button onClick={() => setPlaying(isPlaying ? null : track.id)} style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: isPlaying ? h : 'var(--owf-raised)',
                border: `1px solid ${isPlaying ? h : 'var(--owf-border)'}`,
                color: isPlaying ? '#fff' : 'var(--owf-text-muted)',
                fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: isPlaying ? `0 0 10px rgba(${hRgb},0.4)` : 'none',
              }}>
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
          );
        })}
      </div>
      {/* Sticky mini player */}
      {currentTrack && (
        <div style={{
          position: 'fixed', bottom: 64, left: 0, right: 0, zIndex: 100,
          background: T.isDark ? 'rgba(10,10,16,0.92)' : 'rgba(250,250,248,0.92)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid rgba(${hRgb},0.20)`,
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: `0 -4px 24px rgba(${hRgb},0.10)`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: currentTrack.color,
            boxShadow: `0 0 12px ${currentTrack.color}60`,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--owf-text)', marginBottom: 1 }}>
              {currentTrack.title}
            </div>
            <div style={{ fontSize: 11, color: 'var(--owf-text-muted)' }}>
              {currentTrack.artist} · {fmt(seconds)}
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ width: 80, height: 2, background: 'var(--owf-border)', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: h, borderRadius: 1,
              width: `${Math.min((seconds / 240) * 100, 100)}%`,
              transition: 'width 1s linear',
            }} />
          </div>
          <button onClick={() => setPlaying(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 18, color: 'var(--owf-text-muted)',
          }}>✕</button>
        </div>
      )}
      <style>{`@keyframes owfWave { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }`}</style>
    </div>
  );
}
