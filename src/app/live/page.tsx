'use client';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeProvider';

// ─── Channel data ─────────────────────────────────────────────────────────────
// All video IDs below are from channels that historically allow embedding.
// Individual video IDs are more reliable than channel live streams.
// directUrl = where to send user if embed is blocked.

interface Channel {
  id: string;
  name: string;
  org: string;
  category: 'space' | 'science' | 'history' | 'culture' | 'news' | 'stem' | 'math' | 'nature';
  description: string;
  tags: string[];
  videoId: string;
  directUrl: string;
  isLive: boolean;
  badge: string;
  badgeColor?: string;
}

const CHANNELS: Channel[] = [
  // ── SPACE ──────────────────────────────────────────────────
  {
    id: 'kurzgesagt-universe',
    name: 'The Last Star in the Universe',
    org: 'Kurzgesagt',
    category: 'space',
    description: 'A beautiful meditation on the far future of the cosmos — what happens after the last star burns out.',
    tags: ['+space', '+cosmos', '+science'],
    videoId: 'qsN1LglrX9s',
    directUrl: 'https://www.youtube.com/watch?v=qsN1LglrX9s',
    isLive: false,
    badge: '🌌 SPACE',
  },
  {
    id: 'kurzgesagt-blackhole',
    name: 'Black Holes Explained',
    org: 'Kurzgesagt',
    category: 'space',
    description: 'From birth to death of a black hole — one of the most watched science videos ever made.',
    tags: ['+blackhole', '+space', '+physics'],
    videoId: 'e-P5IFTqB98',
    directUrl: 'https://www.youtube.com/watch?v=e-P5IFTqB98',
    isLive: false,
    badge: '⚫ BLACK HOLES',
  },
  {
    id: 'veritasium-blackhole',
    name: 'How to Understand the Image of a Black Hole',
    org: 'Veritasium',
    category: 'space',
    description: 'Derek Muller explains how the Event Horizon Telescope actually captured the first image of a black hole.',
    tags: ['+blackhole', '+astronomy', '+stem'],
    videoId: 'zUyH3XhpLTo',
    directUrl: 'https://www.youtube.com/watch?v=zUyH3XhpLTo',
    isLive: false,
    badge: '🔭 ASTRONOMY',
  },

  // ── SCIENCE ────────────────────────────────────────────────
  {
    id: 'kurzgesagt-immune',
    name: 'The Immune System Explained',
    org: 'Kurzgesagt',
    category: 'science',
    description: 'A stunning animated breakdown of how your immune system defends your body — one of their most shared videos.',
    tags: ['+biology', '+health', '+science'],
    videoId: 'zQGOcOUBi6s',
    directUrl: 'https://www.youtube.com/watch?v=zQGOcOUBi6s',
    isLive: false,
    badge: '🧬 BIOLOGY',
  },
  {
    id: 'veritasium-dna',
    name: 'DNA — The Code of Life',
    org: 'Veritasium',
    category: 'science',
    description: 'How DNA actually works — the molecule that stores the instructions for every living thing on Earth.',
    tags: ['+dna', '+biology', '+science'],
    videoId: 'zwibgNGe4aY',
    directUrl: 'https://www.youtube.com/watch?v=zwibgNGe4aY',
    isLive: false,
    badge: '🔬 SCIENCE',
  },
  {
    id: 'scishow-ocean',
    name: 'The Ocean Is Deeper Than You Think',
    org: 'SciShow',
    category: 'science',
    description: 'A journey from the surface to the deepest point in the ocean — what lives there and what we still don\'t know.',
    tags: ['+ocean', '+nature', '+science'],
    videoId: 'af8PO7CbMkY',
    directUrl: 'https://www.youtube.com/watch?v=af8PO7CbMkY',
    isLive: false,
    badge: '🌊 OCEAN',
  },

  // ── STEM ───────────────────────────────────────────────────
  {
    id: 'crashcourse-cs',
    name: 'How Computers Work — Computer Science',
    org: 'Crash Course',
    category: 'stem',
    description: 'From transistors to the internet — Crash Course explains the foundations of computer science clearly.',
    tags: ['+computers', '+coding', '+stem'],
    videoId: 'tpIctyqH29Q',
    directUrl: 'https://www.youtube.com/watch?v=tpIctyqH29Q',
    isLive: false,
    badge: '💻 COMPUTER SCIENCE',
  },
  {
    id: 'ted-ai',
    name: 'How AI Could Save (Not Destroy) Education',
    org: 'TED',
    category: 'stem',
    description: 'Sal Khan (Khan Academy) on how AI tutors could give every child on Earth a world-class education.',
    tags: ['+ai', '+education', '+stem'],
    videoId: 'hJP5GqnTrNo',
    directUrl: 'https://www.youtube.com/watch?v=hJP5GqnTrNo',
    isLive: false,
    badge: '💡 TED · AI',
  },
  {
    id: 'mit-ocw-intro',
    name: 'MIT — Introduction to Computer Science',
    org: 'MIT OpenCourseWare',
    category: 'stem',
    description: 'The legendary MIT 6.0001 intro lecture — free, world-class computer science education from MIT.',
    tags: ['+mit', '+coding', '+stem'],
    videoId: 'nykOeWgQcHM',
    directUrl: 'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/',
    isLive: false,
    badge: '🎓 MIT · FREE',
  },

  // ── MATH ───────────────────────────────────────────────────
  {
    id: '3b1b-neural',
    name: 'But What Is a Neural Network?',
    org: '3Blue1Brown',
    category: 'math',
    description: 'The most beautiful introduction to machine learning ever made — pure visual mathematics.',
    tags: ['+math', '+ai', '+neural-networks'],
    videoId: 'aircAruvnKk',
    directUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
    isLive: false,
    badge: '∞ MATHEMATICS',
  },
  {
    id: 'numberphile-pi',
    name: 'What Is Pi — And Why Is It Infinite?',
    org: 'Numberphile',
    category: 'math',
    description: 'Real mathematicians explain pi — why it never repeats, and what that means for reality.',
    tags: ['+pi', '+math', '+infinity'],
    videoId: 'RdHQ08kxXwE',
    directUrl: 'https://www.youtube.com/watch?v=RdHQ08kxXwE',
    isLive: false,
    badge: 'π MATH',
  },

  // ── HISTORY ────────────────────────────────────────────────
  {
    id: 'crashcourse-history-world',
    name: 'The Agricultural Revolution',
    org: 'Crash Course',
    category: 'history',
    description: 'How farming changed everything — the agricultural revolution that shaped all of human civilization.',
    tags: ['+history', '+civilization', '+world'],
    videoId: 'Yocja_N5s1I',
    directUrl: 'https://www.youtube.com/watch?v=Yocja_N5s1I',
    isLive: false,
    badge: '📜 WORLD HISTORY',
  },
  {
    id: 'ted-africa',
    name: 'The Africa the Media Never Shows You',
    org: 'TED',
    category: 'history',
    description: 'Journalist Remi Adekoya on the stories about Africa that never make it into western media.',
    tags: ['+africa', '+media', '+culture'],
    videoId: '8Xjpn9xYoJo',
    directUrl: 'https://www.youtube.com/watch?v=8Xjpn9xYoJo',
    isLive: false,
    badge: '🌍 AFRICA',
  },
  {
    id: 'simple-history-ww2',
    name: 'World War II in 7 Minutes',
    org: 'Simple History',
    category: 'history',
    description: 'A clean animated overview of the Second World War — causes, major events, and the aftermath.',
    tags: ['+ww2', '+history', '+world'],
    videoId: 'HyxnMER0b4c',
    directUrl: 'https://www.youtube.com/watch?v=HyxnMER0b4c',
    isLive: false,
    badge: '🏛 HISTORY',
  },

  // ── CULTURE & ART ──────────────────────────────────────────
  {
    id: 'ted-single-story',
    name: 'The Danger of a Single Story',
    org: 'TED',
    category: 'culture',
    description: 'Chimamanda Adichie\'s iconic talk on why hearing only one story about a person or place creates harmful stereotypes.',
    tags: ['+culture', '+identity', '+humanity'],
    videoId: 'D9Ihs241zeg',
    directUrl: 'https://www.youtube.com/watch?v=D9Ihs241zeg',
    isLive: false,
    badge: '🎨 CULTURE · TED',
    badgeColor: '#f472b6',
  },
  {
    id: 'ted-music-brain',
    name: 'Music and the Brain',
    org: 'TED',
    category: 'culture',
    description: 'What happens in your brain when you listen to music — and why every culture on Earth has developed it.',
    tags: ['+music', '+brain', '+culture'],
    videoId: 'R0JKCYZ8hng',
    directUrl: 'https://www.youtube.com/watch?v=R0JKCYZ8hng',
    isLive: false,
    badge: '🎵 MUSIC & BRAIN',
    badgeColor: '#f472b6',
  },
  {
    id: 'dw-documentary-culture',
    name: 'The Silk Road — An Ancient Global Network',
    org: 'DW Documentary',
    category: 'culture',
    description: 'Deutsche Welle\'s documentary on the Silk Road — the ancient trade network that connected civilizations.',
    tags: ['+history', '+culture', '+trade'],
    videoId: 'voXd3EHW-XQ',
    directUrl: 'https://www.youtube.com/watch?v=voXd3EHW-XQ',
    isLive: false,
    badge: '🏮 SILK ROAD',
    badgeColor: '#f472b6',
  },

  // ── NATURE ─────────────────────────────────────────────────
  {
    id: 'kurzgesagt-nature',
    name: 'Overpopulation — The Human Explosion Explained',
    org: 'Kurzgesagt',
    category: 'nature',
    description: 'A balanced, evidence-based look at human population growth and what it means for the planet.',
    tags: ['+population', '+earth', '+nature'],
    videoId: 'QsBT5EQt348',
    directUrl: 'https://www.youtube.com/watch?v=QsBT5EQt348',
    isLive: false,
    badge: '🌱 NATURE',
    badgeColor: '#34d399',
  },
  {
    id: 'ted-ocean-clean',
    name: 'How We Can Clean the Ocean',
    org: 'TED',
    category: 'nature',
    description: 'Boyan Slat at 20 years old explains his plan to remove plastic from the ocean using its own currents.',
    tags: ['+ocean', '+climate', '+nature'],
    videoId: 'ROW9F-c0kIQ',
    directUrl: 'https://www.youtube.com/watch?v=ROW9F-c0kIQ',
    isLive: false,
    badge: '🌊 OCEAN',
    badgeColor: '#34d399',
  },

  // ── NEWS & JOURNALISM ──────────────────────────────────────
  {
    id: 'dw-news-africa',
    name: 'DW Africa — Stories Untold',
    org: 'DW Documentary',
    category: 'news',
    description: 'Deutsche Welle\'s coverage of African development, politics, and culture — from a global perspective.',
    tags: ['+africa', '+news', '+documentary'],
    videoId: 'XdW9OkVZxMg',
    directUrl: 'https://www.youtube.com/c/dwdocumentary',
    isLive: false,
    badge: '📡 DW AFRICA',
  },
  {
    id: 'ted-journalism',
    name: 'Why Local News Matters More Than Ever',
    org: 'TED',
    category: 'news',
    description: 'A journalist explains why the collapse of local news is one of the most dangerous trends in democracy.',
    tags: ['+journalism', '+news', '+democracy'],
    videoId: 'H-x6pDAnNYo',
    directUrl: 'https://www.youtube.com/watch?v=H-x6pDAnNYo',
    isLive: false,
    badge: '📰 JOURNALISM',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  space: '🌌 Space',
  science: '🔬 Science',
  stem: '💡 STEM',
  math: '∞ Math',
  history: '📜 History',
  culture: '🎨 Culture',
  nature: '🌱 Nature',
  news: '📡 News',
};

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';

function getTodayWikiDate() {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

interface NasaApod {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  date: string;
  copyright?: string;
}

interface WikiFeatured {
  title: string;
  extract: string;
  thumbnail?: { source: string };
  content_urls?: { desktop?: { page?: string } };
}

// ─── Smart embed player ────────────────────────────────────────────────────────
// YouTube errors can't be caught via onError on iframes.
// We use window.postMessage to listen for YouTube's own error events.
function EmbedPlayer({ channel, hRgb, h }: { channel: Channel; hRgb: string; h: string }) {
  const [failed, setFailed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const channelIdRef = useRef(channel.id);

  // Reset when channel changes
  useEffect(() => {
    if (channelIdRef.current !== channel.id) {
      setFailed(false);
      channelIdRef.current = channel.id;
    }
  }, [channel.id]);

  // Listen for YouTube player errors via postMessage
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        // YouTube sends error events with these codes:
        // 2 = invalid video ID, 5 = HTML5 error, 100 = not found/private
        // 101 / 150 = embed not allowed (Error 153 maps here)
        if (data?.event === 'onError' &&
            [2, 5, 100, 101, 150].includes(data?.info)) {
          setFailed(true);
        }
      } catch {}
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const embedSrc = `https://www.youtube.com/embed/${channel.videoId}?enablejsapi=1&rel=0&modestbranding=1&color=white`;

  if (failed) {
    return (
      <div className="w-full rounded-2xl flex flex-col items-center justify-center py-14 px-6 text-center mb-4"
        style={{ background: `rgba(${hRgb}, 0.05)`, border: `1px solid rgba(${hRgb}, 0.2)`, minHeight: '280px' }}>
        <div className="text-5xl mb-4">📺</div>
        <h3 className="text-sm font-bold mb-2" style={{ color: '#fff' }}>{channel.name}</h3>
        <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '340px' }}>
          This video can't be embedded here — but you can watch it directly on {channel.org}'s channel.
          Same great content, opens in a new tab.
        </p>
        <a href={channel.directUrl} target="_blank" rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: `rgba(${hRgb}, 0.15)`, color: h, border: `1px solid rgba(${hRgb}, 0.3)` }}>
          Watch on {channel.org} →
        </a>
        <p className="text-[10px] mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Content verified ✓ · Free to watch ✓ · No OWF ads ✓
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-4"
      style={{ paddingTop: '56.25%', background: '#000', border: `1px solid rgba(${hRgb}, 0.2)`, boxShadow: `0 0 40px rgba(${hRgb}, 0.1)` }}>
      <iframe
        ref={iframeRef}
        key={channel.id}
        src={embedSrc}
        title={channel.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        style={{ border: 'none' }}
      />
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function LivePage() {
  const { theme: T } = useTheme();
  const h = T.horizon;
  const hRgb = T.horizonRgb;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeChannel, setActiveChannel] = useState<Channel>(CHANNELS[0]);
  const [glowPulse, setGlowPulse] = useState(false);
  const [apod, setApod] = useState<NasaApod | null>(null);
  const [wiki, setWiki] = useState<WikiFeatured | null>(null);
  const [apodLoading, setApodLoading] = useState(true);
  const [wikiLoading, setWikiLoading] = useState(true);
  const [sideTab, setSideTab] = useState<'knowledge' | 'apod' | 'factcheck'>('knowledge');

  useEffect(() => {
    const id = setInterval(() => setGlowPulse(p => !p), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch(NASA_APOD_URL)
      .then(r => r.json())
      .then(data => { setApod(data); setApodLoading(false); })
      .catch(() => setApodLoading(false));
  }, []);

  useEffect(() => {
    const dateStr = getTodayWikiDate();
    fetch(`https://en.wikipedia.org/api/rest_v1/feed/featured/${dateStr}`, {
      headers: { 'User-Agent': 'OneWorldFeed/1.0 (contact@oneworldfeed.com)' }
    })
      .then(r => r.json())
      .then(data => { if (data?.tfa) setWiki(data.tfa); setWikiLoading(false); })
      .catch(() => setWikiLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? CHANNELS
    : CHANNELS.filter(c => c.category === activeCategory);

  return (
    <div className="relative min-h-screen flex flex-col" style={{ backgroundColor: '#060E1A', color: '#fff' }}>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #060E1A 0%, #071825 50%, #060E1A 100%)' }} />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-[4000ms]"
          style={{ top: '30%', width: '80%', height: '300px', background: `radial-gradient(ellipse, ${h}18 0%, transparent 70%)`, filter: 'blur(60px)', opacity: glowPulse ? 0.8 : 0.5 }} />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-0 max-w-[1400px] mx-auto w-full px-4 py-6">

        {/* ── LEFT: Channel list ── */}
        <div className="w-full lg:w-72 flex-shrink-0 lg:pr-4 mb-6 lg:mb-0">
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `rgba(${hRgb}, 0.15)`, border: `1px solid rgba(${hRgb}, 0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: h, fontSize: '0.85rem' }}>◉</span>
            </div>
            <div>
              <div className="text-sm font-bold">OWF Live</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{CHANNELS.length} free educational channels</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button key={key} onClick={() => setActiveCategory(key)}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
                style={{ background: activeCategory === key ? `rgba(${hRgb}, 0.2)` : 'rgba(255,255,255,0.05)', color: activeCategory === key ? h : 'rgba(255,255,255,0.45)', border: activeCategory === key ? `1px solid rgba(${hRgb}, 0.35)` : '1px solid rgba(255,255,255,0.07)' }}>
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {filtered.map(ch => (
              <button key={ch.id} onClick={() => setActiveChannel(ch)}
                className="w-full text-left px-3 py-3 rounded-xl transition-all"
                style={{ background: activeChannel.id === ch.id ? `rgba(${hRgb}, 0.12)` : 'rgba(255,255,255,0.03)', border: activeChannel.id === ch.id ? `1px solid rgba(${hRgb}, 0.3)` : '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: activeChannel.id === ch.id ? h : '#fff' }}>{ch.name}</span>
                  {ch.isLive && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>● LIVE</span>}
                </div>
                <div className="text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{ch.org}</div>
                <div className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{ch.description.slice(0, 72)}...</div>
              </button>
            ))}
          </div>

          <div className="mt-4 px-3 py-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)' }}>
            <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
              🛡 All content is from verified public institutions and nonprofit educators. Free to watch. No OWF ads or tracking.
            </p>
          </div>
        </div>

        {/* ── CENTER: Player ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: `rgba(${hRgb}, 0.15)`, color: activeChannel.badgeColor || h, border: `1px solid rgba(${hRgb}, 0.25)` }}>
              {activeChannel.badge}
            </span>
            <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>{activeChannel.org}</span>
          </div>

          <EmbedPlayer channel={activeChannel} hRgb={hRgb} h={h} />

          <div className="px-1 mb-4">
            <h1 className="text-lg font-bold mb-1">{activeChannel.name}</h1>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>{activeChannel.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {activeChannel.tags.map(t => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{ background: `rgba(${hRgb}, 0.08)`, color: h, border: `1px solid rgba(${hRgb}, 0.15)` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="px-4 py-3 rounded-xl flex flex-wrap items-center gap-x-6 gap-y-2"
            style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)' }}>
            {['Verified public source', 'No ads or tracking', 'Free to watch', 'Educational content'].map(label => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-xs font-bold" style={{ color: '#4ade80' }}>✓</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Knowledge panel ── */}
        <div className="w-full lg:w-80 flex-shrink-0 lg:pl-4 mt-6 lg:mt-0">
          <div className="flex gap-1 mb-4">
            {[{ id: 'knowledge', label: '📚 Today' }, { id: 'apod', label: '🔭 NASA' }, { id: 'factcheck', label: '🛡 Safety' }].map(tab => (
              <button key={tab.id} onClick={() => setSideTab(tab.id as typeof sideTab)}
                className="flex-1 py-2 text-[11px] font-semibold rounded-xl transition-all"
                style={{ background: sideTab === tab.id ? `rgba(${hRgb}, 0.15)` : 'rgba(255,255,255,0.04)', color: sideTab === tab.id ? h : 'rgba(255,255,255,0.4)', border: sideTab === tab.id ? `1px solid rgba(${hRgb}, 0.3)` : '1px solid rgba(255,255,255,0.06)' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {sideTab === 'knowledge' && (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-4 pt-4 pb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: `rgba(${hRgb}, 0.7)` }}>Wikipedia · Today's Featured Article</p>
                  {wikiLoading ? (
                    <div className="space-y-2">{[100, 100, 60].map((w, i) => <div key={i} className="h-3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)', width: `${w}%` }} />)}</div>
                  ) : wiki ? (
                    <>
                      {wiki.thumbnail && <img src={wiki.thumbnail.source} alt={wiki.title} className="w-full rounded-xl mb-3 object-cover" style={{ height: '140px' }} />}
                      <h3 className="text-sm font-bold mb-2">{wiki.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{wiki.extract?.slice(0, 220)}...</p>
                      {wiki.content_urls?.desktop?.page && <a href={wiki.content_urls.desktop.page} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[11px] font-semibold" style={{ color: h }}>Read full article →</a>}
                    </>
                  ) : <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Unable to load today's article.</p>}
                </div>
              </div>
              <div className="px-4 py-4 rounded-2xl" style={{ background: `rgba(${hRgb}, 0.06)`, border: `1px solid rgba(${hRgb}, 0.15)` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: h }}>Did You Know?</p>
                <div className="space-y-3">
                  {[{ icon: '🧬', fact: 'Human DNA is 99.9% identical to every other human on Earth.' }, { icon: '🌊', fact: "The ocean produces over 50% of the world's oxygen." }, { icon: '⚡', fact: 'Lightning strikes the Earth about 100 times per second.' }].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {sideTab === 'apod' && (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-4 pt-4 pb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: `rgba(${hRgb}, 0.7)` }}>🔭 NASA · Astronomy Picture of the Day</p>
                  {apodLoading ? (
                    <div className="space-y-2"><div className="h-40 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} /><div className="h-3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} /></div>
                  ) : apod ? (
                    <>
                      {apod.media_type === 'image' ? <img src={apod.url} alt={apod.title} className="w-full rounded-xl mb-3 object-cover" style={{ maxHeight: '200px' }} /> : <div className="w-full rounded-xl mb-3 overflow-hidden" style={{ height: '160px' }}><iframe src={apod.url} className="w-full h-full" title={apod.title} style={{ border: 'none' }} /></div>}
                      <h3 className="text-sm font-bold mb-2">{apod.title}</h3>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{apod.explanation?.slice(0, 250)}...</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{apod.date}{apod.copyright ? ` · © ${apod.copyright}` : ' · Public Domain'}</span>
                        {apod.hdurl && <a href={apod.hdurl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold" style={{ color: h }}>HD →</a>}
                      </div>
                    </>
                  ) : <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Get a free NASA API key at api.nasa.gov</p>}
                </div>
              </div>
            </div>
          )}

          {sideTab === 'factcheck' && (
            <div className="space-y-3">
              <div className="px-4 py-4 rounded-2xl" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#4ade80' }}>🛡 OWF Safety Standards</p>
                <div className="space-y-2.5">
                  {['Verified sources only', 'No hate speech or harassment', 'No political manipulation', 'Science consensus respected', 'User data never sold', 'AI transparency always on'].map(label => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.4)' }}>
                        <span style={{ color: '#4ade80', fontSize: '8px' }}>✓</span>
                      </div>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-4 py-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>🔍 Trusted Fact-Check Sources</p>
                <div className="space-y-2">
                  {[{ name: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check/' }, { name: 'AP Fact Check', url: 'https://apnews.com/hub/ap-fact-check' }, { name: 'Snopes', url: 'https://www.snopes.com/' }, { name: 'PolitiFact', url: 'https://www.politifact.com/' }, { name: 'Wikipedia', url: 'https://en.wikipedia.org/' }].map(source => (
                    <a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-1.5 group">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{source.name}</span>
                      <span className="text-[10px] transition-all group-hover:translate-x-0.5" style={{ color: h }}>→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
