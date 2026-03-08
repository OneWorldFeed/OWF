const THEMES = [
  // ── SKY THEMES ──────────────────────────────────────────
  {
    id: 'dawn',
    label: 'Dawn',
    gradient: 'linear-gradient(135deg, #FBEAFF, #FFD6E0, #FFB347)',
    vars: {
      '--owf-bg': '#FDF6FF',
      '--owf-surface': '#FFF0FA',
      '--owf-border': '#F0D6E8',
      '--owf-text-primary': '#2D1B3D',
      '--owf-text-secondary': '#8B5A7A',
      '--owf-navy': '#2D1B3D',
      '--owf-accent': '#C0527A',
      '--owf-gold': '#C0527A',
      '--owf-glow': 'rgba(192,82,122,0.28)',
      '--owf-card-glow': 'rgba(192,82,122,0.07)',
    },
  },
  {
    id: 'noon',
    label: 'Noon',
    gradient: 'linear-gradient(135deg, #E0F4FF, #FFFFFF, #F0F9FF)',
    vars: {
      '--owf-bg': '#F5F7FA',
      '--owf-surface': '#FFFFFF',
      '--owf-border': '#E2E8F0',
      '--owf-text-primary': '#0F172A',
      '--owf-text-secondary': '#64748B',
      '--owf-navy': '#0D1F35',
      '--owf-accent': '#0284C7',
      '--owf-gold': '#0284C7',
      '--owf-glow': 'rgba(2,132,199,0.25)',
      '--owf-card-glow': 'rgba(2,132,199,0.06)',
    },
  },
  {
    id: 'golden',
    label: 'Golden',
    gradient: 'linear-gradient(135deg, #FFF3CD, #FFB347, #FF6B35)',
    vars: {
      '--owf-bg': '#FFFBF0',
      '--owf-surface': '#FFFDF5',
      '--owf-border': '#F0E0B0',
      '--owf-text-primary': '#1A0F00',
      '--owf-text-secondary': '#7A5C20',
      '--owf-navy': '#1A0F00',
      '--owf-accent': '#D97706',
      '--owf-gold': '#D97706',
      '--owf-glow': 'rgba(217,119,6,0.30)',
      '--owf-card-glow': 'rgba(217,119,6,0.08)',
    },
  },
  {
    id: 'dusk',
    label: 'Dusk',
    gradient: 'linear-gradient(135deg, #2D1B69, #C2185B, #FF6E40)',
    vars: {
      '--owf-bg': '#1A0F2E',
      '--owf-surface': '#251540',
      '--owf-border': '#3D2060',
      '--owf-text-primary': '#F5E6FF',
      '--owf-text-secondary': '#9B7EC8',
      '--owf-navy': '#3D2060',
      '--owf-accent': '#E040FB',
      '--owf-gold': '#E040FB',
      '--owf-glow': 'rgba(224,64,251,0.30)',
      '--owf-card-glow': 'rgba(224,64,251,0.08)',
    },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    gradient: 'linear-gradient(135deg, #060E1A, #0D1F35)',
    vars: {
      '--owf-bg': '#060E1A',
      '--owf-surface': '#0D1F35',
      '--owf-border': '#1E3A5F',
      '--owf-text-primary': '#F0F6FF',
      '--owf-text-secondary': '#7A9EC0',
      '--owf-navy': '#1E3A5F',
      '--owf-accent': '#00DCBE',
      '--owf-gold': '#00DCBE',
      '--owf-glow': 'rgba(0,220,190,0.28)',
      '--owf-card-glow': 'rgba(0,220,190,0.07)',
    },
  },
  {
    id: 'cosmos',
    label: 'Cosmos',
    gradient: 'linear-gradient(135deg, #05020F, #120830, #1A0530)',
    vars: {
      '--owf-bg': '#05020F',
      '--owf-surface': '#0E0720',
      '--owf-border': '#1E1040',
      '--owf-text-primary': '#E8DFFF',
      '--owf-text-secondary': '#6B5B8A',
      '--owf-navy': '#1E1040',
      '--owf-accent': '#9D4EDD',
      '--owf-gold': '#9D4EDD',
      '--owf-glow': 'rgba(157,78,221,0.30)',
      '--owf-card-glow': 'rgba(157,78,221,0.08)',
    },
  },
  // ── PRIMARY COLOR THEMES ─────────────────────────────────
  {
    id: 'crimson',
    label: 'Crimson',
    gradient: 'linear-gradient(135deg, #7F0000, #DC143C, #FF6B6B)',
    vars: {
      '--owf-bg': '#0F0205',
      '--owf-surface': '#1A050A',
      '--owf-border': '#3D0A14',
      '--owf-text-primary': '#FFE8EC',
      '--owf-text-secondary': '#C07080',
      '--owf-navy': '#3D0A14',
      '--owf-accent': '#FF2D55',
      '--owf-gold': '#FF2D55',
      '--owf-glow': 'rgba(255,45,85,0.30)',
      '--owf-card-glow': 'rgba(255,45,85,0.08)',
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    gradient: 'linear-gradient(135deg, #003366, #006994, #00B4D8)',
    vars: {
      '--owf-bg': '#020C1B',
      '--owf-surface': '#051828',
      '--owf-border': '#0A3050',
      '--owf-text-primary': '#E0F4FF',
      '--owf-text-secondary': '#4A8FA8',
      '--owf-navy': '#0A3050',
      '--owf-accent': '#00B4D8',
      '--owf-gold': '#00B4D8',
      '--owf-glow': 'rgba(0,180,216,0.30)',
      '--owf-card-glow': 'rgba(0,180,216,0.08)',
    },
  },
  {
    id: 'forest',
    label: 'Forest',
    gradient: 'linear-gradient(135deg, #0A2E0A, #1B5E20, #4CAF50)',
    vars: {
      '--owf-bg': '#020F02',
      '--owf-surface': '#071407',
      '--owf-border': '#102810',
      '--owf-text-primary': '#E8FFE8',
      '--owf-text-secondary': '#4A8A4A',
      '--owf-navy': '#102810',
      '--owf-accent': '#4CAF50',
      '--owf-gold': '#4CAF50',
      '--owf-glow': 'rgba(76,175,80,0.28)',
      '--owf-card-glow': 'rgba(76,175,80,0.07)',
    },
  },
  {
    id: 'violet',
    label: 'Violet',
    gradient: 'linear-gradient(135deg, #1A0038, #4A0080, #9C27B0)',
    vars: {
      '--owf-bg': '#0A0015',
      '--owf-surface': '#130025',
      '--owf-border': '#2A0050',
      '--owf-text-primary': '#F0E0FF',
      '--owf-text-secondary': '#8050A0',
      '--owf-navy': '#2A0050',
      '--owf-accent': '#AA00FF',
      '--owf-gold': '#AA00FF',
      '--owf-glow': 'rgba(170,0,255,0.28)',
      '--owf-card-glow': 'rgba(170,0,255,0.07)',
    },
  },
  {
    id: 'obsidian',
    label: 'Obsidian',
    gradient: 'linear-gradient(135deg, #000000, #1A1A1A, #2D2D2D)',
    vars: {
      '--owf-bg': '#000000',
      '--owf-surface': '#111111',
      '--owf-border': '#222222',
      '--owf-text-primary': '#F5F5F5',
      '--owf-text-secondary': '#666666',
      '--owf-navy': '#222222',
      '--owf-accent': '#FFFFFF',
      '--owf-gold': '#E0E0E0',
      '--owf-glow': 'rgba(255,255,255,0.15)',
      '--owf-card-glow': 'rgba(255,255,255,0.04)',
    },
  },
  {
    id: 'pearl',
    label: 'Pearl',
    gradient: 'linear-gradient(135deg, #FDFCFB, #F5F0E8, #EDE8DF)',
    vars: {
      '--owf-bg': '#FDFCFB',
      '--owf-surface': '#FFFFFF',
      '--owf-border': '#E8E0D5',
      '--owf-text-primary': '#1A1410',
      '--owf-text-secondary': '#7A6E65',
      '--owf-navy': '#1A1410',
      '--owf-accent': '#B8860B',
      '--owf-gold': '#B8860B',
      '--owf-glow': 'rgba(184,134,11,0.22)',
      '--owf-card-glow': 'rgba(184,134,11,0.06)',
    },
  },
];


const TRENDING = [
  { tag: '+lagos',          count: '12.4k', color: '#D97706' },
  { tag: '+cherryblossoms', count: '8.1k',  color: '#2563EB' },
  { tag: '+ramadan',        count: '89.2k', color: '#7C3AED' },
  { tag: '+community',      count: '4.3k',  color: '#16A34A' },
  { tag: '+nightlife',      count: '6.7k',  color: '#D97706' },
  { tag: '+afrobeats',      count: '11.2k', color: '#059669' },
  { tag: '+startups',       count: '3.8k',  color: '#EA580C' },
];

const SPOTLIGHT = [
  { title: 'Sunrise in Tokyo',       subtitle: 'A new day begins',              image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
  { title: 'Voices of Nairobi',      subtitle: 'Street stories at golden hour', image: 'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=600' },
];

const WHO_TO_FOLLOW = [
  { name: 'Yaw Darko',    handle: 'yawdarko.feed',    color: '#059669' },
  { name: 'Priya Sharma', handle: 'priyasharma.feed', color: '#EA580C' },
  { name: 'Lena Müller',  handle: 'lenamuller.feed',  color: '#B45309' },
];

const ALL_CITIES = [
  { name: 'Lagos',         timezone: 'Africa/Lagos',                        temp: 88, region: 'Africa'   },
  { name: 'Cairo',         timezone: 'Africa/Cairo',                        temp: 82, region: 'Africa'   },
  { name: 'Nairobi',       timezone: 'Africa/Nairobi',                      temp: 70, region: 'Africa'   },
  { name: 'Accra',         timezone: 'Africa/Accra',                        temp: 85, region: 'Africa'   },
  { name: 'Johannesburg',  timezone: 'Africa/Johannesburg',                 temp: 68, region: 'Africa'   },
  { name: 'Casablanca',    timezone: 'Africa/Casablanca',                   temp: 72, region: 'Africa'   },
  { name: 'Addis Ababa',   timezone: 'Africa/Addis_Ababa',                  temp: 65, region: 'Africa'   },
  { name: 'Dar es Salaam', timezone: 'Africa/Dar_es_Salaam',                temp: 82, region: 'Africa'   },
  { name: 'Tokyo',         timezone: 'Asia/Tokyo',                          temp: 72, region: 'Asia'     },
  { name: 'Mumbai',        timezone: 'Asia/Kolkata',                        temp: 91, region: 'Asia'     },
  { name: 'Shanghai',      timezone: 'Asia/Shanghai',                       temp: 68, region: 'Asia'     },
  { name: 'Beijing',       timezone: 'Asia/Shanghai',                       temp: 62, region: 'Asia'     },
  { name: 'Seoul',         timezone: 'Asia/Seoul',                          temp: 58, region: 'Asia'     },
  { name: 'Singapore',     timezone: 'Asia/Singapore',                      temp: 86, region: 'Asia'     },
  { name: 'Bangkok',       timezone: 'Asia/Bangkok',                        temp: 92, region: 'Asia'     },
  { name: 'Dubai',         timezone: 'Asia/Dubai',                          temp: 95, region: 'Asia'     },
  { name: 'Jakarta',       timezone: 'Asia/Jakarta',                        temp: 88, region: 'Asia'     },
  { name: 'Osaka',         timezone: 'Asia/Tokyo',                          temp: 70, region: 'Asia'     },
  { name: 'Taipei',        timezone: 'Asia/Taipei',                         temp: 75, region: 'Asia'     },
  { name: 'Kuala Lumpur',  timezone: 'Asia/Kuala_Lumpur',                   temp: 88, region: 'Asia'     },
  { name: 'Manila',        timezone: 'Asia/Manila',                         temp: 90, region: 'Asia'     },
  { name: 'Tehran',        timezone: 'Asia/Tehran',                         temp: 74, region: 'Asia'     },
  { name: 'Riyadh',        timezone: 'Asia/Riyadh',                         temp: 98, region: 'Asia'     },
  { name: 'Istanbul',      timezone: 'Europe/Istanbul',                     temp: 65, region: 'Asia'     },
  { name: 'London',        timezone: 'Europe/London',                       temp: 58, region: 'Europe'   },
  { name: 'Paris',         timezone: 'Europe/Paris',                        temp: 60, region: 'Europe'   },
  { name: 'Berlin',        timezone: 'Europe/Berlin',                       temp: 52, region: 'Europe'   },
  { name: 'Madrid',        timezone: 'Europe/Madrid',                       temp: 66, region: 'Europe'   },
  { name: 'Rome',          timezone: 'Europe/Rome',                         temp: 64, region: 'Europe'   },
  { name: 'Amsterdam',     timezone: 'Europe/Amsterdam',                    temp: 55, region: 'Europe'   },
  { name: 'Moscow',        timezone: 'Europe/Moscow',                       temp: 38, region: 'Europe'   },
  { name: 'Stockholm',     timezone: 'Europe/Stockholm',                    temp: 44, region: 'Europe'   },
  { name: 'Zurich',        timezone: 'Europe/Zurich',                       temp: 50, region: 'Europe'   },
  { name: 'Vienna',        timezone: 'Europe/Vienna',                       temp: 54, region: 'Europe'   },
  { name: 'New York',      timezone: 'America/New_York',                    temp: 65, region: 'Americas' },
  { name: 'Los Angeles',   timezone: 'America/Los_Angeles',                 temp: 72, region: 'Americas' },
  { name: 'Chicago',       timezone: 'America/Chicago',                     temp: 58, region: 'Americas' },
  { name: 'São Paulo',     timezone: 'America/Sao_Paulo',                   temp: 75, region: 'Americas' },
  { name: 'Mexico City',   timezone: 'America/Mexico_City',                 temp: 70, region: 'Americas' },
  { name: 'Buenos Aires',  timezone: 'America/Argentina/Buenos_Aires',      temp: 68, region: 'Americas' },
  { name: 'Toronto',       timezone: 'America/Toronto',                     temp: 55, region: 'Americas' },
  { name: 'Miami',         timezone: 'America/New_York',                    temp: 80, region: 'Americas' },
  { name: 'Bogotá',        timezone: 'America/Bogota',                      temp: 64, region: 'Americas' },
  { name: 'Lima',          timezone: 'America/Lima',                        temp: 68, region: 'Americas' },
  { name: 'Santiago',      timezone: 'America/Santiago',                    temp: 62, region: 'Americas' },
  { name: 'Sydney',        timezone: 'Australia/Sydney',                    temp: 74, region: 'Oceania'  },
  { name: 'Melbourne',     timezone: 'Australia/Melbourne',                 temp: 68, region: 'Oceania'  },
  { name: 'Auckland',      timezone: 'Pacific/Auckland',                    temp: 62, region: 'Oceania'  },
];

const MAX_PINNED = 3;
const REGIONS = ['All', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania'];

function getLocalTime(timezone: string) {
  try {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone });
  } catch {
    return '--';
  }
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--owf-surface)', border: '1px solid var(--owf-border)' }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black tracking-widest mb-3" style={{ color: 'var(--owf-text-secondary)' }}>
      {children}
    </p>
  );
}

export default function RightPanel() {
  const [theme, setTheme] = useState('light');
  const [times, setTimes] = useState<Record<string, string>>({});
  const [aiOpen, setAiOpen] = useState(false);
  const [moodResult, setMoodResult] = useState('');
  const [moodLoading, setMoodLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [spotIdx, setSpotIdx] = useState(0);
  const [homeCity, setHomeCity] = useState('Los Angeles');
  const [pinned, setPinned] = useState<string[]>(['Tokyo', 'London', 'New York']);
  const [showPicker, setShowPicker] = useState(false);
  const [settingHome, setSettingHome] = useState(false);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');

  useEffect(() => {
    const t = localStorage.getItem('owf-theme') || 'light';
    const c = localStorage.getItem('owf-cities');
    const h = localStorage.getItem('owf-home-city');
    setTheme(t);
    applyTheme(t);
    if (c) setPinned(JSON.parse(c));
    if (h) setHomeCity(h);
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  function tick() {
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
    setTheme(id);
    applyTheme(id);
    if (typeof window !== 'undefined') localStorage.setItem('owf-theme', id);
  }

  function toggleCity(name: string) {
    if (name === homeCity) return;
    if (pinned.includes(name)) {
      const next = pinned.filter(c => c !== name);
      setPinned(next);
      if (typeof window !== 'undefined') localStorage.setItem('owf-cities', JSON.stringify(next));
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
    // remove new home from pinned if it was there, add old home to pinned
    const next = pinned.filter(c => c !== name && c !== oldHome).slice(0, MAX_PINNED - 1);
    setPinned(next);
    localStorage.setItem('owf-cities', JSON.stringify(next));
    setSettingHome(false);
  }

  const FEED_CONTEXT = `Lagos: "The energy in Lagos tonight is something else. The music never stops." +lagos +nightlife
Tokyo: "Cherry blossom season begins today. Every year I forget how quickly it goes." +tokyo +cherryblossoms
Mexico City: "Three years building this community garden. Today we harvested our first crop." +mexicocity +community
Mumbai: "Just presented to 400 people. Hands were shaking but the idea landed." +mumbai +startups
Cairo: "The Nile at sunrise never gets old. Thousands of years of history in one view." +cairo +egypt
Buenos Aires: "Tango in the street at midnight. A stranger asked me to dance and now we are friends." +buenosaires +tango
Osaka: "Found a 100 year old ramen shop hidden in an alley. The owner is 87. Still cooking every day." +osaka +japan
Berlin: "Berlin winter is brutal but the studio is warm. Three months of work about to become something real." +berlin +art
Accra: "Accra is buzzing. New art, new music, new energy. The world needs to pay attention." +accra +ghana +afrobeats
Seoul: "Seoul at night from the rooftop. The city never sleeps and neither do we." +seoul +korea`;

  async function callAI(prompt: string): Promise<string> {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content?.map((c: any) => c.text || '').join('') || 'No response.';
  }

  async function handleMoodOfDay() {
    setMoodLoading(true);
    setMoodResult('');
    const res = await escalatingCall('right_panel', 'In 2 sentences, describe the overall emotional mood of the world today based on the feed. Be poetic. Start with an emoji.');
    setMoodResult(res.text);
    setMoodLoading(false);
  }

  async function handleFeedSummary() {
    setSummaryLoading(true);
    setSummaryResult('');
    const res = await escalatingCall('right_panel', 'Give a TL;DR of what people around the world are talking about on the feed right now. 3 bullet points, one sentence each. Use city names.');
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

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0 sticky top-16 self-start max-h-[calc(100vh-5rem)] overflow-y-auto">

      {/* Spotlight */}
      <Card>
        <Label>SPOTLIGHT</Label>
        <div
          className="relative rounded-xl overflow-hidden cursor-pointer"
          style={{ height: '140px' }}
          onClick={() => setSpotIdx((spotIdx + 1) % SPOTLIGHT.length)}
        >
          <img
            src={spot.image} alt={spot.title}
            className="w-full h-full object-cover"
            draggable={false}
            onContextMenu={e => e.preventDefault()}
            style={{ pointerEvents: 'none' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }} />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-bold">{spot.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>{spot.subtitle}</p>
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            {SPOTLIGHT.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: i === spotIdx ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </div>
      </Card>

      {/* AI */}
      <Card>
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setAiOpen(!aiOpen)}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, var(--owf-gold), #F97316)' }}>
              ✦
            </div>
            <p className="text-xs font-black tracking-widest" style={{ color: 'var(--owf-text-secondary)' }}>OWF AI</p>
          </div>
          <span className="text-xs" style={{ color: 'var(--owf-text-secondary)' }}>{aiOpen ? '▲' : '▼'}</span>
        </button>

        {aiOpen && (
          <div className="mt-4 space-y-3">

            {/* Mood of the Day */}
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--owf-bg)', border: '1px solid var(--owf-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--owf-text-primary)' }}>🌍 Mood of the Day</p>
                  <p className="text-[10px]" style={{ color: 'var(--owf-text-secondary)' }}>AI reads the global feed</p>
                </div>
                <button
                  onClick={handleMoodOfDay}
                  disabled={moodLoading}
                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                  style={{ backgroundColor: 'var(--owf-gold)', color: '#fff', opacity: moodLoading ? 0.6 : 1 }}
                >
                  {moodLoading ? '...' : moodResult ? '↺' : 'Read'}
                </button>
              </div>
              {moodResult && (
                <div className="text-xs leading-relaxed mt-2 p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--owf-surface)', color: 'var(--owf-text-primary)', borderLeft: '3px solid var(--owf-gold)' }}>
                  {moodResult}
                </div>
              )}
            </div>

            {/* Feed Summary */}
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--owf-bg)', border: '1px solid var(--owf-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--owf-text-primary)' }}>📋 Feed Summary</p>
                  <p className="text-[10px]" style={{ color: 'var(--owf-text-secondary)' }}>TL;DR of what's happening</p>
                </div>
                <button
                  onClick={handleFeedSummary}
                  disabled={summaryLoading}
                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                  style={{ backgroundColor: '#2563EB', color: '#fff', opacity: summaryLoading ? 0.6 : 1 }}
                >
                  {summaryLoading ? '...' : summaryResult ? '↺' : 'Read'}
                </button>
              </div>
              {summaryResult && (
                <div className="text-xs leading-relaxed mt-2 p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--owf-surface)', color: 'var(--owf-text-primary)', borderLeft: '3px solid #2563EB' }}>
                  {summaryResult}
                </div>
              )}
            </div>

          </div>
        )}
      </Card>

      {/* Trending */}
      <Card>
        <Label>TRENDING</Label>
        <div className="space-y-1.5">
          {TRENDING.map((item, i) => (
            <button key={item.tag}
              className="w-full flex items-center justify-between py-1.5 px-2 rounded-xl"
              style={{ backgroundColor: item.color + '0A' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold w-4 text-right" style={{ color: 'var(--owf-text-secondary)' }}>{i + 1}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.tag}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--owf-text-secondary)' }}>{item.count}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* World Clocks */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black tracking-widest" style={{ color: 'var(--owf-text-secondary)' }}>WORLD CLOCKS</p>
          <div className="flex gap-1">
            <button
              onClick={() => { setSettingHome(!settingHome); setShowPicker(false); setSearch(''); setRegion('All'); }}
              className="text-xs font-bold px-2 py-1 rounded-lg"
              style={{ color: settingHome ? '#fff' : 'var(--owf-gold)', backgroundColor: settingHome ? 'var(--owf-gold)' : '#D9770618', border: '1px solid #D9770633' }}
            >
              {settingHome ? 'Cancel' : '🏠'}
            </button>
            <button
              onClick={() => { setShowPicker(!showPicker); setSettingHome(false); setSearch(''); setRegion('All'); }}
              className="text-xs font-bold px-2 py-1 rounded-lg"
              style={{ color: showPicker ? '#fff' : 'var(--owf-gold)', backgroundColor: showPicker ? 'var(--owf-gold)' : '#D9770618', border: '1px solid #D9770633' }}
            >
              {showPicker ? 'Done' : '+ Cities'}
            </button>
          </div>
        </div>

        {!showPicker && (
          <div className="space-y-2">
            {displayCities.map((city, i) => (
              <div key={city.name}
                className="flex items-center justify-between py-1.5 px-2 rounded-xl"
                style={{ backgroundColor: i === 0 ? '#D9770610' : 'transparent', border: i === 0 ? '1px solid #D9770622' : 'none' }}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold" style={{ color: 'var(--owf-text-primary)' }}>{city.name}</p>
                    {city.name === homeCity && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--owf-gold)', color: '#fff' }}>HOME</span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--owf-text-secondary)' }}>{times[city.name] || '--'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--owf-text-secondary)' }}>{city.temp}°F</span>
                  {city.name !== homeCity && (
                    <button onClick={() => toggleCity(city.name)} className="text-xs opacity-40 hover:opacity-100" style={{ color: 'var(--owf-text-secondary)' }}>✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {settingHome && (
          <div>
            <p className="text-xs mb-2 font-semibold" style={{ color: 'var(--owf-text-secondary)' }}>
              Tap a city to set as your home
            </p>
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search cities..."
              className="w-full text-xs px-3 py-2 rounded-xl mb-2 focus:outline-none"
              style={{ backgroundColor: 'var(--owf-bg)', border: '1px solid var(--owf-border)', color: 'var(--owf-text-primary)' }}
            />
            <div className="flex gap-1 flex-wrap mb-2">
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegion(r)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{ backgroundColor: region === r ? 'var(--owf-gold)' : 'var(--owf-bg)', color: region === r ? '#fff' : 'var(--owf-text-secondary)', border: '1px solid var(--owf-border)' }}>
                  {r}
                </button>
              ))}
            </div>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {filteredCities.map(city => (
                <button key={city.name} onClick={() => setAsHome(city.name)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded-xl transition-all"
                  style={{ backgroundColor: city.name === homeCity ? 'var(--owf-gold)18' : 'transparent' }}>
                  <div className="flex items-center gap-2">
                    {city.name === homeCity && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--owf-gold)', color: '#fff' }}>HOME</span>}
                    <span className="text-xs font-semibold" style={{ color: 'var(--owf-text-primary)' }}>{city.name}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--owf-text-secondary)' }}>{city.region}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showPicker && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--owf-text-secondary)' }}>Select up to 3 cities</span>
              <span className="text-xs font-black" style={{ color: nonHomePinned >= MAX_PINNED ? '#EF4444' : 'var(--owf-gold)' }}>
                {nonHomePinned}/{MAX_PINNED}
              </span>
            </div>
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search cities..."
              className="w-full text-xs px-3 py-2 rounded-xl mb-2 focus:outline-none"
              style={{ backgroundColor: 'var(--owf-bg)', border: '1px solid var(--owf-border)', color: 'var(--owf-text-primary)' }}
            />
            <div className="flex gap-1 flex-wrap mb-2">
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegion(r)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{ backgroundColor: region === r ? 'var(--owf-gold)' : 'var(--owf-bg)', color: region === r ? '#fff' : 'var(--owf-text-secondary)', border: '1px solid var(--owf-border)' }}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {filteredCities.map(city => {
                const isPinned = pinned.includes(city.name);
                const isHome = city.name === homeCity;
                const atMax = !isPinned && !isHome && nonHomePinned >= MAX_PINNED;
                return (
                  <button
                    key={city.name}
                    onClick={() => toggleCity(city.name)}
                    disabled={isHome || atMax}
                    className="w-full flex items-center justify-between py-1.5 px-2 rounded-xl"
                    style={{ backgroundColor: isPinned ? '#D9770612' : 'transparent', opacity: atMax ? 0.3 : 1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded flex items-center justify-center text-xs"
                        style={{ backgroundColor: isPinned ? 'var(--owf-gold)' : 'var(--owf-border)', color: isPinned ? '#fff' : 'transparent' }}>
                        ✓
                      </div>
                      <span className="text-xs font-semibold" style={{ color: 'var(--owf-text-primary)' }}>{city.name}</span>
                      {isHome && (
                        <span className="text-[9px] font-black px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--owf-gold)', color: '#fff' }}>HOME</span>
                      )}
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--owf-text-secondary)' }}>{city.region}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Who to Follow */}
      <Card>
        <Label>WHO TO FOLLOW</Label>
        <div className="space-y-3">
          {WHO_TO_FOLLOW.map(person => (
            <div key={person.handle} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, ' + person.color + ', ' + person.color + 'bb)', boxShadow: '0 0 8px ' + person.color + '44' }}>
                  {person.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--owf-text-primary)' }}>{person.name}</p>
                  <p className="text-xs" style={{ color: 'var(--owf-text-secondary)' }}>{person.handle}</p>
                </div>
              </div>
              <button className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: person.color + '18', color: person.color, border: '1px solid ' + person.color + '33' }}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Theme */}
      <Card>
        <Label>THEME</Label>
        <div className="flex items-center gap-2 flex-wrap">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => handleTheme(t.id)}
              className="flex flex-col items-center gap-1" title={t.label}>
              <div className="w-10 h-10 rounded-xl border-2"
                style={{ background: t.gradient, borderColor: theme === t.id ? 'var(--owf-gold)' : 'var(--owf-border)', boxShadow: theme === t.id ? '0 0 0 3px #D9770633' : 'none' }} />
              <span className="text-[10px] font-semibold"
                style={{ color: theme === t.id ? 'var(--owf-gold)' : 'var(--owf-text-secondary)' }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

    </aside>
  );
}
