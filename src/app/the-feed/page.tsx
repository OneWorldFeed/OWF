'use client';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeProvider';

interface LiveCam {
  id: string; name: string; org: string; location: string;
  description: string; embedUrl: string; fallbackUrl: string;
  category: 'wildlife' | 'nature' | 'ocean' | 'space';
  badge: string; badgeColor: string; fact: string; emoji: string;
}

interface ContentCard {
  id: string; name: string; org: string; orgIcon: string;
  category: string; description: string; watchUrl: string;
  thumbnailId: string; duration?: string;
  badge: string; badgeColor: string;
}

interface NasaApod {
  title: string; explanation: string;
  url: string; hdurl?: string; media_type: string;
}

const LIVE_CAMS: LiveCam[] = [
  { id: 'explore-bears', name: 'Brooks Falls', org: 'explore.org', location: 'Katmai, Alaska', description: 'Brown bears catching sockeye salmon at the famous Brooks Falls waterfall. Hundreds gather here during peak season.', embedUrl: 'https://explore.org/livecams/brown-bears/brown-bear-salmon-cam-Brooks-falls', fallbackUrl: 'https://explore.org/livecams/brown-bears', category: 'wildlife', badge: 'ALASKA', badgeColor: '#f59e0b', fact: 'Brown bears can gain up to 30 lbs per day eating salmon — fuelling 6 months of hibernation.', emoji: '🐻' },
  { id: 'explore-africa', name: 'African Watering Hole', org: 'explore.org', location: 'Tembe, South Africa', description: 'Elephants, lions, leopards and hundreds of species visit this watering hole 24 hours a day.', embedUrl: 'https://explore.org/livecams/african-wildlife/african-animal-watering-hole-camera', fallbackUrl: 'https://explore.org/livecams/african-wildlife', category: 'wildlife', badge: 'AFRICA', badgeColor: '#f59e0b', fact: 'Tembe is home to some of the largest-tusked elephants left on Earth — a critically endangered population.', emoji: '🐘' },
  { id: 'explore-aurora', name: 'Northern Lights', org: 'explore.org', location: 'Churchill, Canada', description: 'Live HD camera pointed at the sky in Churchill — one of the best aurora viewing spots on the planet.', embedUrl: 'https://explore.org/livecams/aurora-borealis/northern-lights-cam', fallbackUrl: 'https://explore.org/livecams/aurora-borealis', category: 'nature', badge: 'AURORA', badgeColor: '#818cf8', fact: 'The Aurora Borealis is caused by charged solar particles colliding with Earth\'s atmosphere — the same physics as neon signs.', emoji: '🌌' },
  { id: 'explore-eagles', name: 'Decorah Bald Eagles', org: 'explore.org', location: 'Decorah, Iowa', description: 'A family of bald eagles in their nest. One of the most watched live cams in the world during nesting season.', embedUrl: 'https://explore.org/livecams/raptor-resource-project/decorah-eagles-eaglet-cam', fallbackUrl: 'https://explore.org/livecams/raptor-resource-project', category: 'wildlife', badge: 'EAGLES', badgeColor: '#34d399', fact: 'Bald eagles mate for life and return to the same nest every year — adding to it each season. Some nests weigh over a ton.', emoji: '🦅' },
  { id: 'explore-manatee', name: 'Manatee Cam', org: 'explore.org', location: 'Blue Spring, Florida', description: 'Underwater live camera at Blue Spring State Park where manatees gather in winter. Crystal clear water.', embedUrl: 'https://explore.org/livecams/manatees/blue-spring-state-park-manatees-cam', fallbackUrl: 'https://explore.org/livecams/manatees', category: 'ocean', badge: 'OCEAN', badgeColor: '#60a5fa', fact: 'Manatees are the only fully herbivorous marine mammals — they eat seagrass and can consume 10% of their body weight daily.', emoji: '🌊' },
  { id: 'nasa-live', name: 'NASA TV', org: 'NASA', location: 'Earth Orbit & Beyond', description: 'Live mission coverage, spacewalks, rocket launches and science programming. US government public domain.', embedUrl: 'https://www.nasa.gov/wp-content/plugins/nasa-hls-player/build/index.html', fallbackUrl: 'https://plus.nasa.gov', category: 'space', badge: 'NASA', badgeColor: '#818cf8', fact: 'The ISS travels at 17,500 mph — completing one full orbit every 90 minutes. Astronauts see 16 sunrises daily.', emoji: '🚀' },
  { id: 'explore-gorillas', name: 'Gorilla Forest', org: 'explore.org', location: 'Congo Basin, DRC', description: 'Live camera monitoring critically endangered mountain gorillas in the Congolese rainforest.', embedUrl: 'https://explore.org/livecams/african-wildlife/gorilla-forest-corridor-camera', fallbackUrl: 'https://explore.org/livecams/african-wildlife', category: 'wildlife', badge: 'CONGO', badgeColor: '#34d399', fact: 'Only ~1,000 mountain gorillas remain in the wild. Their DNA is 98.3% identical to ours.', emoji: '🦍' },
  { id: 'explore-ocean', name: 'Open Ocean', org: 'explore.org', location: 'Monterey Bay, CA', description: 'Live underwater camera in Monterey Bay — one of the most biodiverse marine environments on Earth.', embedUrl: 'https://explore.org/livecams/oceans/live-ocean-cam', fallbackUrl: 'https://explore.org/livecams/oceans', category: 'ocean', badge: 'OCEAN', badgeColor: '#60a5fa', fact: 'Monterey Bay hosts 525+ species of fish and 180 species of seabirds — more diversity than the Galápagos.', emoji: '🌊' },
];

const CONTENT_CARDS: ContentCard[] = [
  { id: 'kurzgesagt-universe', name: 'The Last Star in the Universe', org: 'Kurzgesagt', orgIcon: '🪐', category: 'space', description: 'A meditation on the far future of the cosmos.', watchUrl: 'https://www.youtube.com/watch?v=qsN1LglrX9s', thumbnailId: 'qsN1LglrX9s', duration: '9:22', badge: '🌌 SPACE', badgeColor: '#818cf8' },
  { id: 'kurzgesagt-blackhole', name: 'Black Holes Explained', org: 'Kurzgesagt', orgIcon: '🪐', category: 'space', description: 'From birth to death — the most extreme objects in the universe.', watchUrl: 'https://www.youtube.com/watch?v=e-P5IFTqB98', thumbnailId: 'e-P5IFTqB98', duration: '6:51', badge: '⚫ PHYSICS', badgeColor: '#818cf8' },
  { id: 'kurzgesagt-immune', name: 'The Immune System', org: 'Kurzgesagt', orgIcon: '🪐', category: 'science', description: 'How your body fights invaders, animated beautifully.', watchUrl: 'https://www.youtube.com/watch?v=zQGOcOUBi6s', thumbnailId: 'zQGOcOUBi6s', duration: '6:14', badge: '🧬 BIOLOGY', badgeColor: '#34d399' },
  { id: '3b1b-neural', name: 'What Is a Neural Network?', org: '3Blue1Brown', orgIcon: '∞', category: 'math', description: 'The most beautiful intro to machine learning ever made.', watchUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', thumbnailId: 'aircAruvnKk', duration: '19:13', badge: '∞ MATH', badgeColor: '#a78bfa' },
  { id: 'ted-single-story', name: 'The Danger of a Single Story', org: 'TED', orgIcon: '💡', category: 'culture', description: "Chimamanda Adichie's iconic talk on identity.", watchUrl: 'https://www.youtube.com/watch?v=D9Ihs241zeg', thumbnailId: 'D9Ihs241zeg', duration: '18:33', badge: '🎨 CULTURE', badgeColor: '#f472b6' },
  { id: 'crashcourse-cs', name: 'How Computers Work', org: 'Crash Course', orgIcon: '🎓', category: 'stem', description: 'From transistors to the internet, explained clearly.', watchUrl: 'https://www.youtube.com/watch?v=tpIctyqH29Q', thumbnailId: 'tpIctyqH29Q', duration: '11:49', badge: '💻 CS', badgeColor: '#60a5fa' },
  { id: 'ted-ai-education', name: 'How AI Could Save Education', org: 'TED', orgIcon: '💡', category: 'stem', description: 'Sal Khan on world-class education for every child.', watchUrl: 'https://www.youtube.com/watch?v=hJP5GqnTrNo', thumbnailId: 'hJP5GqnTrNo', duration: '15:12', badge: '💡 AI', badgeColor: '#60a5fa' },
  { id: 'crashcourse-history', name: 'The Agricultural Revolution', org: 'Crash Course', orgIcon: '🎓', category: 'history', description: 'How farming reshaped all of human civilization.', watchUrl: 'https://www.youtube.com/watch?v=Yocja_N5s1I', thumbnailId: 'Yocja_N5s1I', duration: '12:28', badge: '📜 HISTORY', badgeColor: '#f59e0b' },
  { id: 'ted-africa', name: 'The Africa Media Never Shows', org: 'TED', orgIcon: '💡', category: 'history', description: 'Stories about Africa that never make western headlines.', watchUrl: 'https://www.youtube.com/watch?v=8Xjpn9xYoJo', thumbnailId: '8Xjpn9xYoJo', duration: '14:02', badge: '🌍 AFRICA', badgeColor: '#f59e0b' },
  { id: 'dw-silk-road', name: 'The Silk Road', org: 'DW Documentary', orgIcon: '📡', category: 'culture', description: 'The ancient route that connected civilizations.', watchUrl: 'https://www.youtube.com/watch?v=voXd3EHW-XQ', thumbnailId: 'voXd3EHW-XQ', duration: '42:16', badge: '🏮 CULTURE', badgeColor: '#f472b6' },
  { id: 'ted-ocean', name: 'How to Clean the Ocean', org: 'TED', orgIcon: '💡', category: 'nature', description: "Boyan Slat's plan using the ocean's own currents.", watchUrl: 'https://www.youtube.com/watch?v=ROW9F-c0kIQ', thumbnailId: 'ROW9F-c0kIQ', duration: '11:56', badge: '🌊 NATURE', badgeColor: '#34d399' },
  { id: 'mit-cs', name: 'MIT Intro to CS', org: 'MIT OpenCourseWare', orgIcon: '🎓', category: 'stem', description: 'The legendary MIT 6.001 lecture. Free. World class.', watchUrl: 'https://www.youtube.com/watch?v=nykOeWgQcHM', thumbnailId: 'nykOeWgQcHM', duration: '52:08', badge: '🎓 MIT', badgeColor: '#60a5fa' },
];

// ── OWF Offline Fallback ───────────────────────────────────────
function OfflineFallback({ cam, h, hRgb }: { cam: LiveCam; h: string; hRgb: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
      style={{ background: 'linear-gradient(135deg, #060E1A 0%, #0B1A2E 100%)' }}>
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: `rgba(${hRgb},0.1)`, border: `1px solid rgba(${hRgb},0.2)` }}>
          {cam.emoji}
        </div>
        <div className="absolute inset-0 rounded-full animate-ping"
          style={{ background: `rgba(${hRgb},0.06)`, animationDuration: '2.5s' }} />
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <span style={{ color: h, fontSize: '0.6rem' }}>◈</span>
        <span className="text-[9px] font-bold uppercase tracking-widest"
          style={{ color: `rgba(${hRgb},0.55)` }}>OWF Stream Status</span>
      </div>
      <h3 className="text-sm font-bold mb-0.5" style={{ color: '#fff' }}>{cam.name}</h3>
      <p className="text-[10px] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>{cam.location}</p>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
        style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)' }}>
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        <span className="text-[10px] font-semibold text-yellow-400">Stream temporarily offline</span>
      </div>
      <div className="w-full max-w-xs px-4 py-3 rounded-2xl mb-5"
        style={{ background: `rgba(${hRgb},0.07)`, border: `1px solid rgba(${hRgb},0.14)` }}>
        <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: h }}>
          Did You Know?
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {cam.fact}
        </p>
      </div>
      <a href={cam.fallbackUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
        style={{ background: `rgba(${hRgb},0.14)`, color: h, border: `1px solid rgba(${hRgb},0.28)` }}>
        Watch on {cam.org} →
      </a>
      <p className="text-[9px] mt-4" style={{ color: 'rgba(255,255,255,0.15)' }}>
        Refreshes automatically when stream is back online
      </p>
    </div>
  );
}

// ── Cam player ────────────────────────────────────────────────
function CamPlayer({ cam, h, hRgb }: { cam: LiveCam; h: string; hRgb: string }) {
  const [status, setStatus] = useState<'loading' | 'live' | 'offline'>('loading');
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setStatus('loading');
    timeout.current = setTimeout(
      () => setStatus(s => s === 'loading' ? 'offline' : s),
      9000
    );
    return () => clearTimeout(timeout.current);
  }, [cam.id]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{ background: '#000', border: `1px solid rgba(${hRgb},0.18)`, boxShadow: `0 0 60px rgba(${hRgb},0.08), 0 24px 48px rgba(0,0,0,0.5)` }}>

      {/* Loading */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
          style={{ background: '#060E1A' }}>
          <div className="w-8 h-8 rounded-full mb-3 animate-spin"
            style={{ border: `2px solid rgba(${hRgb},0.12)`, borderTopColor: h }} />
          <p className="text-xs font-semibold" style={{ color: `rgba(${hRgb},0.7)` }}>
            Connecting to {cam.org}...
          </p>
          <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {cam.location}
          </p>
        </div>
      )}

      {/* Offline */}
      {status === 'offline' && (
        <div className="absolute inset-0 z-20">
          <OfflineFallback cam={cam} h={h} hRgb={hRgb} />
        </div>
      )}

      {/* iframe */}
      <iframe
        key={cam.id}
        src={cam.embedUrl}
        title={cam.name}
        allow="autoplay; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full"
        style={{ border: 'none', opacity: status === 'live' ? 1 : 0, zIndex: 0 }}
        onLoad={() => { clearTimeout(timeout.current); setStatus('live'); }}
        onError={() => setStatus('offline')}
      />

      {/* Live badge overlay — top left */}
      {status === 'live' && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
          <span className="flex items-center gap-1.5 text-[9px] font-bold px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
            LIVE
          </span>
          <span className="text-[9px] font-bold px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', color: cam.badgeColor, border: `1px solid ${cam.badgeColor}44` }}>
            {cam.badge}
          </span>
        </div>
      )}

      {/* Location — bottom left */}
      {status === 'live' && (
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <p className="text-[10px] font-semibold px-2 py-1 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.7)' }}>
            📍 {cam.location}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Watch Free card ───────────────────────────────────────────
function WatchCard({ card, h, hRgb }: { card: ContentCard; h: string; hRgb: string }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <a href={card.watchUrl} target="_blank" rel="noopener noreferrer"
      className="flex gap-2.5 p-2 rounded-xl transition-all hover:scale-[1.02] group"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 rounded-lg overflow-hidden"
        style={{ width: 72, height: 48 }}>
        {!imgErr ? (
          <img src={`https://img.youtube.com/vi/${card.thumbnailId}/mqdefault.jpg`}
            alt={card.name} onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl"
            style={{ background: `${card.badgeColor}15` }}>{card.orgIcon}</div>
        )}
        {/* Play hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          <span className="text-white text-xs">▶</span>
        </div>
        {card.duration && (
          <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold px-1 rounded"
            style={{ background: 'rgba(0,0,0,0.75)', color: '#fff' }}>{card.duration}</span>
        )}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-[8px] font-bold" style={{ color: card.badgeColor }}>{card.badge}</span>
        <p className="text-[10px] font-semibold leading-snug mt-0.5 line-clamp-2"
          style={{ color: 'rgba(255,255,255,0.8)' }}>{card.name}</p>
        <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{card.org}</p>
      </div>
    </a>
  );
}

// ── NASA APOD mini ────────────────────────────────────────────
function ApodMini({ apod, h, hRgb }: { apod: NasaApod; h: string; hRgb: string }) {
  if (apod.media_type !== 'image') return null;
  return (
    <div className="rounded-xl overflow-hidden flex-shrink-0"
      style={{ border: `1px solid rgba(${hRgb},0.15)` }}>
      <div className="relative" style={{ height: 80 }}>
        <img src={apod.url} alt={apod.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,14,26,0.85) 0%, rgba(6,14,26,0.2) 100%)' }} />
        <div className="absolute inset-0 flex items-center px-3">
          <div className="flex-1">
            <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: h }}>🔭 NASA · Today</p>
            <p className="text-[10px] font-bold leading-tight mt-0.5 line-clamp-2">{apod.title}</p>
          </div>
          {apod.hdurl && (
            <a href={apod.hdurl} target="_blank" rel="noopener noreferrer"
              className="text-[9px] font-bold ml-2 flex-shrink-0" style={{ color: h }}>
              View →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function TheFeedPage() {
  const { theme: T } = useTheme();
  const h = T.horizon;
  const hRgb = T.horizonRgb;

  const [activeCam, setActiveCam] = useState(LIVE_CAMS[0]);
  const [apod, setApod] = useState<NasaApod | null>(null);
  const [cardFilter, setCardFilter] = useState('all');
  const [showCards, setShowCards] = useState(false); // mobile toggle
  const [glowPulse, setGlowPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setGlowPulse(p => !p), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      .then(r => r.json()).then(setApod).catch(() => {});
  }, []);

  const camGroups = [
    { label: '🦁 Wildlife', cams: LIVE_CAMS.filter(c => c.category === 'wildlife') },
    { label: '🌿 Nature',   cams: LIVE_CAMS.filter(c => c.category === 'nature') },
    { label: '🌊 Ocean',    cams: LIVE_CAMS.filter(c => c.category === 'ocean') },
    { label: '🚀 Space',    cams: LIVE_CAMS.filter(c => c.category === 'space') },
  ];

  const cardCategories = ['all', 'space', 'science', 'stem', 'math', 'history', 'culture', 'nature'];
  const filteredCards = cardFilter === 'all'
    ? CONTENT_CARDS
    : CONTENT_CARDS.filter(c => c.category === cardFilter);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#060E1A', color: '#fff' }}>

      {/* Ambient bg glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute left-1/3 top-1/4 rounded-full transition-all duration-[4000ms]"
          style={{ width: '40%', height: '300px', background: `radial-gradient(ellipse, ${h}0c 0%, transparent 70%)`, filter: 'blur(80px)', opacity: glowPulse ? 0.8 : 0.3 }} />
      </div>

      <div className="relative z-10 h-screen flex flex-col" style={{ maxHeight: '100vh' }}>

        {/* ── Page header — compact ── */}
        <div className="flex items-center justify-between px-4 py-2 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse"
              style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.22)' }}>
              ● LIVE
            </span>
            <h1 className="text-sm font-bold">The Feed</h1>
            <span className="text-[10px] hidden sm:block" style={{ color: 'rgba(255,255,255,0.3)' }}>
              explore.org · NASA · No tracking
            </span>
          </div>

          {/* Mobile: toggle between cams and watch free */}
          <div className="flex xl:hidden gap-1 p-0.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setShowCards(false)}
              className="px-2.5 py-1 rounded-md text-[10px] font-bold transition-all"
              style={{ background: !showCards ? `rgba(${hRgb},0.2)` : 'transparent', color: !showCards ? h : 'rgba(255,255,255,0.4)' }}>
              ◉ Live
            </button>
            <button onClick={() => setShowCards(true)}
              className="px-2.5 py-1 rounded-md text-[10px] font-bold transition-all"
              style={{ background: showCards ? `rgba(${hRgb},0.2)` : 'transparent', color: showCards ? h : 'rgba(255,255,255,0.4)' }}>
              ▶ Watch
            </button>
          </div>
        </div>

        {/* ── Main layout — fills remaining height ── */}
        <div className="flex flex-1 min-h-0 gap-0">

          {/* ══ LEFT: 70% — Video player ══ */}
          <div className={`flex flex-col flex-1 min-w-0 p-3 gap-3 ${showCards ? 'hidden xl:flex' : 'flex'}`}>

            {/* Video — fills available height */}
            <div className="flex-1 min-h-0">
              <CamPlayer cam={activeCam} h={h} hRgb={hRgb} />
            </div>

            {/* Cam info strip — below video, compact */}
            <div className="flex-shrink-0 flex items-start justify-between gap-4 px-1">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold truncate">{activeCam.name}</h2>
                <p className="text-[11px] leading-relaxed mt-0.5 line-clamp-2"
                  style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {activeCam.description}
                </p>
              </div>
              {/* Did You Know — inline, right of title */}
              <div className="flex-shrink-0 max-w-xs px-3 py-2 rounded-xl hidden lg:block"
                style={{ background: `rgba(${hRgb},0.07)`, border: `1px solid rgba(${hRgb},0.13)` }}>
                <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: h }}>
                  Did You Know?
                </p>
                <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {activeCam.fact}
                </p>
              </div>
            </div>
          </div>

          {/* Vertical divider */}
          <div className="hidden xl:block w-px flex-shrink-0"
            style={{ background: `linear-gradient(180deg, transparent, rgba(${hRgb},0.2), transparent)` }} />

          {/* ══ RIGHT: 30% — Two panels stacked ══ */}
          <div className={`xl:w-72 2xl:w-80 flex-shrink-0 flex flex-col min-h-0 ${showCards ? 'flex w-full' : 'hidden xl:flex'}`}>

            {/* ─ Top: Cam selector ─ */}
            <div className="flex-shrink-0 p-3 overflow-y-auto"
              style={{ maxHeight: '55%', borderBottom: `1px solid rgba(${hRgb},0.12)` }}>

              {/* NASA APOD */}
              {apod && <div className="mb-3"><ApodMini apod={apod} h={h} hRgb={hRgb} /></div>}

              {/* Cam groups */}
              {camGroups.map(group => group.cams.length > 0 && (
                <div key={group.label} className="mb-3">
                  <p className="text-[8px] font-bold uppercase tracking-widest mb-1.5 px-0.5"
                    style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.cams.map(cam => (
                      <button key={cam.id} onClick={() => setActiveCam(cam)}
                        className="w-full text-left px-2.5 py-2 rounded-xl transition-all flex items-center gap-2.5"
                        style={{
                          background: activeCam.id === cam.id ? `rgba(${hRgb},0.12)` : 'rgba(255,255,255,0.02)',
                          border: activeCam.id === cam.id ? `1px solid rgba(${hRgb},0.28)` : '1px solid rgba(255,255,255,0.04)',
                        }}>
                        <span className="text-base flex-shrink-0">{cam.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold truncate"
                            style={{ color: activeCam.id === cam.id ? h : 'rgba(255,255,255,0.75)' }}>
                            {cam.name}
                          </p>
                          <p className="text-[9px] truncate" style={{ color: 'rgba(255,255,255,0.28)' }}>
                            {cam.location}
                          </p>
                        </div>
                        <span className="text-[8px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                          ● LIVE
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ─ Bottom: Watch Free ─ */}
            <div className="flex-1 min-h-0 flex flex-col p-3">
              {/* Header + filter */}
              <div className="flex-shrink-0 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    ▶ Watch Free
                  </p>
                  <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    opens at source
                  </span>
                </div>
                {/* Filter pills — horizontal scroll */}
                <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {cardCategories.map(cat => (
                    <button key={cat} onClick={() => setCardFilter(cat)}
                      className="px-2 py-0.5 rounded-full text-[9px] font-semibold capitalize flex-shrink-0 transition-all"
                      style={{
                        background: cardFilter === cat ? `rgba(${hRgb},0.18)` : 'rgba(255,255,255,0.04)',
                        color: cardFilter === cat ? h : 'rgba(255,255,255,0.4)',
                        border: cardFilter === cat ? `1px solid rgba(${hRgb},0.32)` : '1px solid rgba(255,255,255,0.06)',
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards — scrollable */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5"
                style={{ scrollbarWidth: 'thin', scrollbarColor: `rgba(${hRgb},0.2) transparent` }}>
                {filteredCards.map(card => (
                  <WatchCard key={card.id} card={card} h={h} hRgb={hRgb} />
                ))}
                {/* Privacy note */}
                <div className="pt-2 pb-1">
                  <p className="text-[9px] text-center" style={{ color: 'rgba(255,255,255,0.15)' }}>
                    🛡 No Google scripts · No tracking · We curate, you watch free
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
