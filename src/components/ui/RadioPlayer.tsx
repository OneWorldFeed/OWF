'use client';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeProvider';

// ─── Free radio stations via radio-browser.info API ──────────────────────────
// Completely free, no key, 30,000+ stations worldwide

interface Station {
  stationuuid: string;
  name: string;
  url_resolved: string;
  country: string;
  countrycode: string;
  tags: string;
  favicon: string;
  votes: number;
  codec: string;
  bitrate: number;
  language: string;
}

const GENRE_PRESETS = [
  { id: 'afrobeats',  label: 'Afrobeats',   emoji: '🌍', query: 'afrobeats' },
  { id: 'hiphop',     label: 'Hip-Hop',      emoji: '🎤', query: 'hip hop' },
  { id: 'jazz',       label: 'Jazz',         emoji: '🎷', query: 'jazz' },
  { id: 'electronic', label: 'Electronic',   emoji: '⚡', query: 'electronic' },
  { id: 'rnb',        label: 'R&B',          emoji: '🎶', query: 'rnb' },
  { id: 'reggae',     label: 'Reggae',       emoji: '🇯🇲', query: 'reggae' },
  { id: 'latin',      label: 'Latin',        emoji: '💃', query: 'latin' },
  { id: 'classical',  label: 'Classical',    emoji: '🎻', query: 'classical' },
  { id: 'pop',        label: 'Pop',          emoji: '✨', query: 'pop' },
  { id: 'lofi',       label: 'Lo-Fi',        emoji: '☕', query: 'lofi' },
];

// Radio Browser mirrors — try each until one works
const API_MIRRORS = [
  'https://de1.api.radio-browser.info',
  'https://fr1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
];

async function fetchStations(tag: string): Promise<Station[]> {
  for (const mirror of API_MIRRORS) {
    try {
      const url = `${mirror}/json/stations/bytag/${encodeURIComponent(tag)}?limit=20&order=votes&reverse=true&hidebroken=true&codec=MP3`;
      const res = await fetch(url, { headers: { 'User-Agent': 'OneWorldFeed/1.0' } });
      if (!res.ok) continue;
      const data: Station[] = await res.json();
      return data.filter(s => s.url_resolved && s.bitrate >= 64);
    } catch { continue; }
  }
  return [];
}

interface RadioPlayerProps {
  onNowPlayingChange?: (update: { track: string; artist: string; playing: boolean } | null) => void;
}

export default function RadioPlayer({ onNowPlayingChange }: RadioPlayerProps = {}) {
  const { theme: T } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [activeGenre, setActiveGenre]     = useState(GENRE_PRESETS[0]);
  const [stations, setStations]           = useState<Station[]>([]);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [playing, setPlaying]             = useState(false);
  const [loading, setLoading]             = useState(false);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [volume, setVolume]               = useState(0.8);
  const [error, setError]                 = useState('');
  const [visualizer, setVisualizer]       = useState([3,5,8,4,7,6,3,9,5,4]);

  // Animate visualizer bars when playing
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setVisualizer(prev => prev.map(() => Math.floor(Math.random() * 10) + 2));
    }, 300);
    return () => clearInterval(id);
  }, [playing]);

  // Load stations when genre changes
  useEffect(() => {
    setStationsLoading(true);
    setError('');
    fetchStations(activeGenre.query).then(data => {
      setStations(data);
      setStationsLoading(false);
      if (data.length === 0) setError('No stations found. Try another genre.');
    });
  }, [activeGenre]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  async function playStation(station: Station) {
    setError('');
    setLoading(true);
    setCurrentStation(station);
    setPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = station.url_resolved;
      audioRef.current.volume = volume;
      try {
        await audioRef.current.play();
        setPlaying(true);
        onNowPlayingChange?.({ track: '📻 Live Radio', artist: station.name, playing: true });
      } catch {
        setError(`Can't play ${station.name}. Try another station.`);
        setPlaying(false);
      }
    }
    setLoading(false);
  }

  function togglePlay() {
    if (!audioRef.current || !currentStation) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      onNowPlayingChange?.(null);
    } else {
      audioRef.current.play()
        .then(() => {
          setPlaying(true);
          onNowPlayingChange?.({ track: '📻 Live Radio', artist: currentStation.name, playing: true });
        })
        .catch(() => setError('Playback failed.'));
    }
  }

  function nextStation() {
    if (!stations.length) return;
    const idx = currentStation ? stations.findIndex(s => s.stationuuid === currentStation.stationuuid) : -1;
    const next = stations[(idx + 1) % stations.length];
    playStation(next);
  }

  const h = T.horizon;
  const isDark = T.isDark;

  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: '20px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 12px',
        borderBottom: `1px solid ${T.border}`,
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: `rgba(${T.horizonRgb}, 0.15)`,
              border: `1px solid rgba(${T.horizonRgb}, 0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
            }}>📻</div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.12em', color: T.textMuted }}>OWF RADIO</p>
              <p style={{ fontSize: '9px', color: T.textMuted, marginTop: '1px' }}>Live global stations</p>
            </div>
          </div>
          {/* Live visualizer */}
          {playing && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '20px' }}>
              {[1,2,3,4,5].map((_, i) => (
                <div key={i} className={`owf-viz-bar-${i+1}`} style={{
                  width: '3px', borderRadius: '99px',
                  height: '20px',
                  background: T.horizon,
                  opacity: 0.7 + (i % 3) * 0.1,
                }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Genre pills */}
      <div style={{
        padding: '12px 16px',
        display: 'flex', gap: '6px', overflowX: 'auto',
        scrollbarWidth: 'none',
        borderBottom: `1px solid ${T.border}`,
      }}>
        {GENRE_PRESETS.map(genre => (
          <button key={genre.id} onClick={() => setActiveGenre(genre)} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '5px 10px', borderRadius: '99px', cursor: 'pointer',
            flexShrink: 0, fontSize: '11px', fontWeight: 600,
            background: activeGenre.id === genre.id ? h : 'transparent',
            color: activeGenre.id === genre.id ? (isDark ? '#000' : '#fff') : T.textMuted,
            border: activeGenre.id === genre.id ? 'none' : `1px solid ${T.border}`,
            transition: 'all 0.15s',
          }}>
            <span>{genre.emoji}</span>
            <span>{genre.label}</span>
          </button>
        ))}
      </div>

      {/* Now playing bar */}
      {currentStation && (
        <div style={{
          padding: '12px 16px',
          background: `rgba(${T.horizonRgb}, 0.06)`,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          {/* Station favicon — vinyl spin when playing */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: `radial-gradient(circle, ${isDark ? '#1a1a2a' : '#e8e8f0'} 30%, rgba(${T.horizonRgb},0.4) 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', border: `2px solid rgba(${T.horizonRgb},0.3)`,
            boxShadow: playing ? `0 0 12px rgba(${T.horizonRgb},0.4)` : 'none',
          }} className={playing ? 'owf-vinyl-spin' : ''}>
            {currentStation.favicon
              ? <img src={currentStation.favicon} alt="" style={{ width: '60%', height: '60%', objectFit: 'cover', borderRadius: '50%' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isDark ? '#08090f' : '#fff' }} />
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentStation.name}
            </p>
            <p style={{ fontSize: '10px', color: T.textMuted, marginTop: '1px' }}>
              {currentStation.countrycode} · {currentStation.bitrate}kbps · {currentStation.codec}
            </p>
          </div>
          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={togglePlay} disabled={loading} style={{
              width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
              background: h, color: isDark ? '#000' : '#fff',
              border: 'none', cursor: 'pointer', fontSize: '13px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 12px ${h}50`,
              opacity: loading ? 0.6 : 1,
            }}>
              {loading ? '⟳' : playing ? '⏸' : '▶'}
            </button>
            <button onClick={nextStation} style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              background: 'transparent', color: T.textMuted,
              border: `1px solid ${T.border}`, cursor: 'pointer', fontSize: '11px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>⏭</button>
          </div>
        </div>
      )}

      {/* Volume */}
      {currentStation && (
        <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: '11px', color: T.textMuted }}>{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
          <input type="range" min={0} max={1} step={0.05} value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: h, cursor: 'pointer', height: '3px' }}
          />
          <span style={{ fontSize: '10px', color: T.textMuted, width: '28px', textAlign: 'right' }}>
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '8px 16px', fontSize: '11px', color: '#EF4444', background: 'rgba(239,68,68,0.08)' }}>
          {error}
        </div>
      )}

      {/* Station list */}
      <div style={{ maxHeight: '260px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {stationsLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: T.textMuted }}>Loading {activeGenre.label} stations…</p>
          </div>
        ) : stations.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '24px', marginBottom: '6px' }}>📻</p>
            <p style={{ fontSize: '11px', color: T.textMuted }}>No stations found</p>
          </div>
        ) : (
          stations.map((station, i) => {
            const isActive = currentStation?.stationuuid === station.stationuuid;
            return (
              <button key={station.stationuuid} onClick={() => playStation(station)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: isActive ? `rgba(${T.horizonRgb}, 0.08)` : 'transparent',
                borderBottom: `1px solid ${T.border}`,
                transition: 'background 0.15s',
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, width: '16px', flexShrink: 0 }}>{i + 1}</span>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {station.favicon
                    ? <img src={station.favicon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    : <span style={{ fontSize: '12px' }}>📻</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '12px', fontWeight: isActive ? 700 : 500, color: isActive ? h : T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {station.name}
                  </p>
                  <p style={{ fontSize: '9px', color: T.textMuted, marginTop: '1px' }}>
                    {station.countrycode} · {station.bitrate}kbps
                  </p>
                </div>
                {isActive && playing && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '14px', flexShrink: 0 }}>
                    {[1,2,3,4,5].map((_, vi) => (
                      <div key={vi} className={`owf-viz-bar-${vi+1}`} style={{
                        width: '2.5px', borderRadius: '99px',
                        height: '14px',
                        background: T.horizon,
                      }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} onError={() => {
        setError(`Stream unavailable. Try another station.`);
        setPlaying(false);
        onNowPlayingChange?.(null);
      }} />
    </div>
  );
}
