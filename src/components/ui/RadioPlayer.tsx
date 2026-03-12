'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { useAudio } from '@/context/AudioProvider';
import type { RadioStation } from '@/context/AudioProvider';

type Station = RadioStation;

const GENRE_PRESETS = [
  { id: 'pop',        label: 'Pop',        emoji: '✨', query: 'pop' },
  { id: 'hiphop',     label: 'Hip-Hop',    emoji: '🎤', query: 'hip hop' },
  { id: 'jazz',       label: 'Jazz',       emoji: '🎷', query: 'jazz' },
  { id: 'rnb',        label: 'R&B',        emoji: '🎶', query: 'rnb' },
  { id: 'lofi',       label: 'Lo-Fi',      emoji: '☕', query: 'lofi' },
  { id: 'electronic', label: 'Electronic', emoji: '⚡', query: 'electronic' },
  { id: 'latin',      label: 'Latin',      emoji: '💃', query: 'latin' },
  { id: 'classical',  label: 'Classical',  emoji: '🎻', query: 'classical' },
  { id: 'reggae',     label: 'Reggae',     emoji: '🇯🇲', query: 'reggae' },
  { id: 'afrobeats',  label: 'Afrobeats',  emoji: '🌍', query: 'afrobeats' },
];

const SLEEP_OPTIONS = [
  { label: '15 min', seconds: 15 * 60 },
  { label: '30 min', seconds: 30 * 60 },
  { label: '60 min', seconds: 60 * 60 },
];

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

function fmtSleep(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface RadioPlayerProps {
  onNowPlayingChange?: (update: { track: string; artist: string; playing: boolean } | null) => void;
}

export default function RadioPlayer({ onNowPlayingChange }: RadioPlayerProps = {}) {
  const { theme: T } = useTheme();
  const {
    currentStation, isPlaying, isLoading, volume, error,
    playStation: ctxPlay, togglePlay, setVolume, stop,
  } = useAudio();

  // ── Genre / station list state ────────────────────────────────────────────
  const [activeGenre,     setActiveGenre]     = useState(GENRE_PRESETS[0]);
  const [stations,        setStations]        = useState<Station[]>([]);
  const [stationsLoading, setStationsLoading] = useState(false);

  // ── List tab: genres vs favorites ─────────────────────────────────────────
  const [listTab, setListTab] = useState<'genres' | 'favorites'>('genres');

  // ── Favorites — stored as Record<uuid, Station> in localStorage ───────────
  const [favorites, setFavorites] = useState<Record<string, Station>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem('owf-radio-favorites');
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  function toggleFavorite(station: Station, e: React.MouseEvent) {
    e.stopPropagation();
    setFavorites(prev => {
      const next = { ...prev };
      if (next[station.stationuuid]) delete next[station.stationuuid];
      else next[station.stationuuid] = station;
      try { localStorage.setItem('owf-radio-favorites', JSON.stringify(next)); } catch {}
      return next;
    });
  }

  // ── Search ────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');

  // ── Sleep timer ───────────────────────────────────────────────────────────
  const [sleepMenu,      setSleepMenu]      = useState(false);
  const [sleepRemaining, setSleepRemaining] = useState<number | null>(null);
  const sleepTimeoutRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const sleepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startSleepTimer(seconds: number) {
    if (sleepTimeoutRef.current)  clearTimeout(sleepTimeoutRef.current);
    if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);

    const end = Date.now() + seconds * 1000;
    setSleepRemaining(seconds);
    setSleepMenu(false);

    sleepIntervalRef.current = setInterval(() => {
      const rem = Math.round((end - Date.now()) / 1000);
      if (rem <= 0) { clearInterval(sleepIntervalRef.current!); setSleepRemaining(null); }
      else setSleepRemaining(rem);
    }, 1000);

    sleepTimeoutRef.current = setTimeout(() => {
      stop();
      clearInterval(sleepIntervalRef.current!);
      setSleepRemaining(null);
    }, seconds * 1000);
  }

  function cancelSleepTimer() {
    if (sleepTimeoutRef.current)  clearTimeout(sleepTimeoutRef.current);
    if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
    setSleepRemaining(null);
    setSleepMenu(false);
  }

  useEffect(() => () => {
    if (sleepTimeoutRef.current)  clearTimeout(sleepTimeoutRef.current);
    if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
  }, []);

  // ── Notify parent ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPlaying && currentStation) {
      onNowPlayingChange?.({ track: '📻 Live Radio', artist: currentStation.name, playing: true });
    } else {
      onNowPlayingChange?.(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentStation]);

  // ── Load + sort stations when genre changes ───────────────────────────────
  useEffect(() => {
    if (listTab === 'favorites') return;
    setStationsLoading(true);
    fetchStations(activeGenre.query).then(data => {
      setStations([...data].sort((a, b) => a.name.localeCompare(b.name)));
      setStationsLoading(false);
    });
  }, [activeGenre, listTab]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const visibleList = listTab === 'favorites'
    ? Object.values(favorites).sort((a, b) => a.name.localeCompare(b.name))
    : stations;

  const filteredList = searchQuery.trim()
    ? visibleList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : visibleList;

  function prevStation() {
    if (!filteredList.length) return;
    const idx = currentStation ? filteredList.findIndex(s => s.stationuuid === currentStation.stationuuid) : 0;
    ctxPlay(filteredList[(idx - 1 + filteredList.length) % filteredList.length]);
  }

  function nextStation() {
    if (!filteredList.length) return;
    const idx = currentStation ? filteredList.findIndex(s => s.stationuuid === currentStation.stationuuid) : -1;
    ctxPlay(filteredList[(idx + 1) % filteredList.length]);
  }

  const h       = T.horizon;
  const isDark  = T.isDark;
  const favCount = Object.keys(favorites).length;
  const activeIdx = currentStation
    ? filteredList.findIndex(s => s.stationuuid === currentStation.stationuuid)
    : -1;

  // ── Genre scroll ref (for ‹ › arrow nav) ─────────────────────────────────
  const genreScrollRef = useRef<HTMLDivElement>(null);
  const scrollGenres = useCallback((dir: 'left' | 'right') => {
    genreScrollRef.current?.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' });
  }, []);

  // ── Btn shared styles ─────────────────────────────────────────────────────
  const navBtn = (extra?: React.CSSProperties): React.CSSProperties => ({
    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
    background: 'transparent', color: T.text,
    border: `1px solid ${T.border}`, cursor: 'pointer', fontSize: '11px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    ...extra,
  });

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', overflow: 'hidden' }}>

      {/* ── Inline CSS for 3-bar equalizer animation ── */}
      <style>{`
        @keyframes owf-eq {
          0%, 100% { transform: scaleY(0.35); }
          50%      { transform: scaleY(1);    }
        }
        .owf-eq-1 { animation: owf-eq 0.75s ease-in-out 0s    infinite; transform-origin: bottom; }
        .owf-eq-2 { animation: owf-eq 0.75s ease-in-out 0.18s infinite; transform-origin: bottom; }
        .owf-eq-3 { animation: owf-eq 0.75s ease-in-out 0.36s infinite; transform-origin: bottom; }
      `}</style>

      {/* ════════ HEADER ════════ */}
      <div style={{
        padding: '12px 16px 10px',
        borderBottom: `1px solid ${T.border}`,
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Logo */}
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: `rgba(${T.horizonRgb}, 0.15)`,
            border: `1px solid rgba(${T.horizonRgb}, 0.3)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
          }}>📻</div>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.12em', color: T.textMuted }}>OWF RADIO</p>
            <p style={{ fontSize: '9px', color: T.textMuted, marginTop: '1px' }}>Live global stations</p>
          </div>

          {/* Sleep timer button / countdown */}
          <div style={{ position: 'relative' }}>
            {sleepRemaining !== null ? (
              <button
                onClick={cancelSleepTimer}
                title="Cancel sleep timer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '3px 8px', borderRadius: '99px', cursor: 'pointer',
                  background: `rgba(${T.horizonRgb}, 0.12)`,
                  border: `1px solid rgba(${T.horizonRgb}, 0.3)`,
                  color: h, fontSize: '10px', fontWeight: 700,
                }}
              >
                🌙 {fmtSleep(sleepRemaining)}
              </button>
            ) : (
              <button
                onClick={() => setSleepMenu(m => !m)}
                title="Sleep timer"
                style={{
                  ...navBtn(),
                  fontSize: '13px',
                  color: sleepMenu ? h : T.textMuted,
                  borderColor: sleepMenu ? h : T.border,
                }}
              >🌙</button>
            )}

            {/* Sleep dropdown */}
            {sleepMenu && sleepRemaining === null && (
              <div style={{
                position: 'absolute', top: '34px', right: 0, zIndex: 50,
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: '12px', padding: '6px', minWidth: '110px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}>
                <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.1em', color: T.textMuted, padding: '2px 6px 5px' }}>SLEEP TIMER</p>
                {SLEEP_OPTIONS.map(opt => (
                  <button key={opt.seconds} onClick={() => startSleepTimer(opt.seconds)} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '6px 8px', borderRadius: '8px', border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 600, color: T.text,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >{opt.label}</button>
                ))}
              </div>
            )}
          </div>

          {/* Live visualizer */}
          {isPlaying && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '20px' }}>
              {[1,2,3,4,5].map((_, i) => (
                <div key={i} className={`owf-viz-bar-${i+1}`} style={{
                  width: '3px', borderRadius: '99px', height: '20px',
                  background: T.horizon, opacity: 0.7 + (i % 3) * 0.1,
                }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════════ LIST TAB SWITCHER ════════ */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${T.border}`,
        background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
      }}>
        {(['genres', 'favorites'] as const).map(tab => {
          const active = listTab === tab;
          return (
            <button key={tab} onClick={() => setListTab(tab)} style={{
              flex: 1, padding: '8px 0', border: 'none', cursor: 'pointer',
              background: 'transparent', fontSize: '11px', fontWeight: 700,
              color: active ? h : T.textMuted,
              borderBottom: active ? `2px solid ${h}` : '2px solid transparent',
              transition: 'color 0.15s, border-color 0.15s',
            }}>
              {tab === 'genres' ? '🎵 Genres' : `★ Favorites${favCount > 0 ? ` (${favCount})` : ''}`}
            </button>
          );
        })}
      </div>

      {/* ════════ GENRE PILLS — only on genres tab ════════ */}
      {listTab === 'genres' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '8px 10px', borderBottom: `1px solid ${T.border}`,
        }}>
          {/* Left arrow */}
          <button
            onClick={() => scrollGenres('left')}
            aria-label="Scroll genres left"
            style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              background: 'transparent', border: `1px solid ${T.border}`,
              color: T.textMuted, cursor: 'pointer', fontSize: '11px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >‹</button>

          {/* Scrollable genre pills */}
          <div
            ref={genreScrollRef}
            style={{
              flex: 1, display: 'flex', gap: '6px', overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
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
                <span>{genre.emoji}</span><span>{genre.label}</span>
              </button>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollGenres('right')}
            aria-label="Scroll genres right"
            style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              background: 'transparent', border: `1px solid ${T.border}`,
              color: T.textMuted, cursor: 'pointer', fontSize: '11px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >›</button>
        </div>
      )}

      {/* ════════ NOW PLAYING BAR ════════ */}
      {currentStation && (
        <div style={{
          padding: '10px 16px',
          background: `rgba(${T.horizonRgb}, 0.06)`,
          borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          {/* Vinyl disc */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: `radial-gradient(circle, ${isDark ? '#1a1a2a' : '#e8e8f0'} 30%, rgba(${T.horizonRgb},0.4) 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', border: `2px solid rgba(${T.horizonRgb},0.3)`,
            boxShadow: isPlaying ? `0 0 12px rgba(${T.horizonRgb},0.4)` : 'none',
          }} className={isPlaying ? 'owf-vinyl-spin' : ''}>
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
            <button onClick={prevStation} style={navBtn()}>⏮</button>
            <button onClick={togglePlay} disabled={isLoading} style={{
              width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
              background: h, color: isDark ? '#000' : '#fff',
              border: 'none', cursor: 'pointer', fontSize: '13px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 12px ${h}50`, opacity: isLoading ? 0.6 : 1,
            }}>
              {isLoading ? '⟳' : isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={nextStation} style={navBtn()}>⏭</button>
          </div>
        </div>
      )}

      {/* ════════ VOLUME ════════ */}
      {currentStation && (
        <div style={{ padding: '7px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${T.border}` }}>
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

      {/* ════════ ERROR ════════ */}
      {error && (
        <div style={{ padding: '7px 16px', fontSize: '11px', color: '#EF4444', background: 'rgba(239,68,68,0.08)' }}>
          {error}
        </div>
      )}

      {/* ════════ SEARCH ════════ */}
      <div style={{ padding: '8px 16px', borderBottom: `1px solid ${T.border}` }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search stations…"
          style={{
            width: '100%', fontSize: '11px', padding: '6px 10px',
            borderRadius: '8px', border: `1px solid ${T.border}`,
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            color: T.text, outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = h; e.currentTarget.style.boxShadow = `0 0 0 2px ${h}22`; }}
          onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = 'none'; }}
        />
      </div>

      {/* ════════ STATION COUNT HEADER ════════ */}
      {(() => {
        const loading = listTab === 'genres' && stationsLoading;
        if (loading || filteredList.length === 0) return null;
        return (
          <div style={{
            padding: '5px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: `1px solid ${T.border}`,
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          }}>
            <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.1em', color: T.textMuted }}>
              {listTab === 'favorites' ? '★ SAVED' : 'STATIONS · A–Z'}
              {searchQuery.trim() ? ` · filtered` : ''}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: activeIdx >= 0 ? h : T.textMuted }}>
              {activeIdx >= 0 ? `${activeIdx + 1} of ${filteredList.length}` : `${filteredList.length} stations`}
            </span>
          </div>
        );
      })()}

      {/* ════════ STATION LIST ════════ */}
      <div style={{ maxHeight: '260px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {listTab === 'genres' && stationsLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: T.textMuted }}>Loading {activeGenre.label} stations…</p>
          </div>
        ) : listTab === 'favorites' && favCount === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: '22px', marginBottom: '6px' }}>★</p>
            <p style={{ fontSize: '11px', color: T.textMuted }}>No favorites yet.<br />Tap ★ on any station to save it.</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: T.textMuted }}>No stations match "{searchQuery}"</p>
          </div>
        ) : (
          filteredList.map((station, i) => {
            const isActive  = currentStation?.stationuuid === station.stationuuid;
            const isFav     = !!favorites[station.stationuuid];
            return (
              /* Outer row is a div, not a button, so the ★ button inside is valid HTML */
              <div
                key={station.stationuuid}
                role="button"
                tabIndex={0}
                onClick={() => ctxPlay(station)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') ctxPlay(station); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 12px 9px 16px', cursor: 'pointer', textAlign: 'left',
                  background: isActive ? `rgba(${T.horizonRgb}, 0.08)` : 'transparent',
                  borderBottom: `1px solid ${T.border}`, transition: 'background 0.15s',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                {/* Index */}
                <span style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, width: '16px', flexShrink: 0 }}>{i + 1}</span>

                {/* Favicon */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {station.favicon
                    ? <img src={station.favicon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    : <span style={{ fontSize: '12px' }}>📻</span>
                  }
                </div>

                {/* Name + subtext */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Name row with inline 3-bar eq badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <p style={{
                      fontSize: '12px', fontWeight: isActive ? 700 : 500,
                      color: isActive ? h : T.text,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      flex: 1, margin: 0,
                    }}>
                      {station.name}
                    </p>
                    {/* 3-bar animated equalizer badge — inline, next to name */}
                    {isActive && isPlaying && (
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '11px', flexShrink: 0 }}>
                        {(['owf-eq-1', 'owf-eq-2', 'owf-eq-3'] as const).map((cls) => (
                          <div key={cls} className={cls} style={{
                            width: '2.5px', height: '11px', borderRadius: '1.5px', background: h,
                          }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '9px', color: T.textMuted, marginTop: '1px' }}>
                    {station.countrycode} · {station.bitrate}kbps
                  </p>
                </div>

                {/* Favorite star — standalone button, valid because parent is a div not a button */}
                <button
                  onClick={e => toggleFavorite(station, e)}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                    fontSize: '14px', flexShrink: 0, lineHeight: 1,
                    color: isFav ? h : T.textMuted,
                    opacity: isFav ? 1 : 0.45,
                    transition: 'color 0.15s, opacity 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = isFav ? '1' : '0.45'; }}
                >★</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
