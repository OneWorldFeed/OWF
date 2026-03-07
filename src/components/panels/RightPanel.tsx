'use client';
import { useState, useEffect } from 'react';

const THEMES = [
  { id: 'light',    label: 'Light',    vars: { '--owf-bg': '#F9FAFB', '--owf-surface': '#FFFFFF', '--owf-border': '#E5E7EB', '--owf-text-primary': '#111827', '--owf-text-secondary': '#6B7280', '--owf-navy': '#0D1F35' } },
  { id: 'dark',     label: 'Dark',     vars: { '--owf-bg': '#060E1A', '--owf-surface': '#0D1F35', '--owf-border': '#1E3A5F', '--owf-text-primary': '#F9FAFB', '--owf-text-secondary': '#9CA3AF', '--owf-navy': '#1E3A5F' } },
  { id: 'midnight', label: 'Midnight', vars: { '--owf-bg': '#0A0A0F', '--owf-surface': '#13131A', '--owf-border': '#1F1F2E', '--owf-text-primary': '#E2E8F0', '--owf-text-secondary': '#718096', '--owf-navy': '#1F1F2E' } },
  { id: 'warm',     label: 'Warm',     vars: { '--owf-bg': '#FDFAF6', '--owf-surface': '#FFFBF5', '--owf-border': '#E8DDD0', '--owf-text-primary': '#2D1B0E', '--owf-text-secondary': '#7C6555', '--owf-navy': '#2D1B0E' } },
  { id: 'forest',   label: 'Forest',   vars: { '--owf-bg': '#F0F4F0', '--owf-surface': '#E8F0E8', '--owf-border': '#C8D8C8', '--owf-text-primary': '#1A2E1A', '--owf-text-secondary': '#4A6A4A', '--owf-navy': '#1A2E1A' } },
];

const THEME_GRADIENTS: Record<string, string> = {
  light:    'linear-gradient(135deg, #F9FAFB, #FFFFFF)',
  dark:     'linear-gradient(135deg, #060E1A, #0D1F35)',
  midnight: 'linear-gradient(135deg, #0A0A0F, #13131A)',
  warm:     'linear-gradient(135deg, #ffb36b, #ff6f91)',
  forest:   'linear-gradient(135deg, #2d6a2d, #4a9e4a)',
};

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

// All major world cities
const ALL_CITIES = [
  // Africa
  { name: 'Lagos',         timezone: 'Africa/Lagos',         temp: 88,  region: 'Africa' },
  { name: 'Cairo',         timezone: 'Africa/Cairo',         temp: 82,  region: 'Africa' },
  { name: 'Nairobi',       timezone: 'Africa/Nairobi',       temp: 70,  region: 'Africa' },
  { name: 'Accra',         timezone: 'Africa/Accra',         temp: 85,  region: 'Africa' },
  { name: 'Johannesburg',  timezone: 'Africa/Johannesburg',  temp: 68,  region: 'Africa' },
  { name: 'Casablanca',    timezone: 'Africa/Casablanca',    temp: 72,  region: 'Africa' },
  { name: 'Addis Ababa',   timezone: 'Africa/Addis_Ababa',   temp: 65,  region: 'Africa' },
  // Asia
  { name: 'Tokyo',         timezone: 'Asia/Tokyo',           temp: 72,  region: 'Asia' },
  { name: 'Mumbai',        timezone: 'Asia/Kolkata',         temp: 91,  region: 'Asia' },
  { name: 'Shanghai',      timezone: 'Asia/Shanghai',        temp: 68,  region: 'Asia' },
  { name: 'Beijing',       timezone: 'Asia/Shanghai',        temp: 62,  region: 'Asia' },
  { name: 'Seoul',         timezone: 'Asia/Seoul',           temp: 58,  region: 'Asia' },
  { name: 'Singapore',     timezone: 'Asia/Singapore',       temp: 86,  region: 'Asia' },
  { name: 'Bangkok',       timezone: 'Asia/Bangkok',         temp: 92,  region: 'Asia' },
  { name: 'Dubai',         timezone: 'Asia/Dubai',           temp: 95,  region: 'Asia' },
  { name: 'Karachi',       timezone: 'Asia/Karachi',         temp: 89,  region: 'Asia' },
  { name: 'Jakarta',       timezone: 'Asia/Jakarta',         temp: 88,  region: 'Asia' },
  { name: 'Dhaka',         timezone: 'Asia/Dhaka',           temp: 87,  region: 'Asia' },
  { name: 'Osaka',         timezone: 'Asia/Tokyo',           temp: 70,  region: 'Asia' },
  { name: 'Taipei',        timezone: 'Asia/Taipei',          temp: 75,  region: 'Asia' },
  { name: 'Kuala Lumpur',  timezone: 'Asia/Kuala_Lumpur',    temp: 88,  region: 'Asia' },
  { name: 'Manila',        timezone: 'Asia/Manila',          temp: 90,  region: 'Asia' },
  { name: 'Ho Chi Minh',   timezone: 'Asia/Ho_Chi_Minh',     temp: 91,  region: 'Asia' },
  { name: 'Tehran',        timezone: 'Asia/Tehran',          temp: 74,  region: 'Asia' },
  { name: 'Riyadh',        timezone: 'Asia/Riyadh',          temp: 98,  region: 'Asia' },
  { name: 'Istanbul',      timezone: 'Europe/Istanbul',      temp: 65,  region: 'Asia' },
  // Europe
  { name: 'London',        timezone: 'Europe/London',        temp: 58,  region: 'Europe' },
  { name: 'Paris',         timezone: 'Europe/Paris',         temp: 60,  region: 'Europe' },
  { name: 'Berlin',        timezone: 'Europe/Berlin',        temp: 52,  region: 'Europe' },
  { name: 'Madrid',        timezone: 'Europe/Madrid',        temp: 66,  region: 'Europe' },
  { name: 'Rome',          timezone: 'Europe/Rome',          temp: 64,  region: 'Europe' },
  { name: 'Amsterdam',     timezone: 'Europe/Amsterdam',     temp: 55,  region: 'Europe' },
  { name: 'Moscow',        timezone: 'Europe/Moscow',        temp: 38,  region: 'Europe' },
  { name: 'Stockholm',     timezone: 'Europe/Stockholm',     temp: 44,  region: 'Europe' },
  { name: 'Zurich',        timezone: 'Europe/Zurich',        temp: 50,  region: 'Europe' },
  { name: 'Vienna',        timezone: 'Europe/Vienna',        temp: 54,  region: 'Europe' },
  { name: 'Warsaw',        timezone: 'Europe/Warsaw',        temp: 48,  region: 'Europe' },
  { name: 'Kyiv',          timezone: 'Europe/Kiev',          temp: 46,  region: 'Europe' },
  // Americas
  { name: 'New York',      timezone: 'America/New_York',     temp: 65,  region: 'Americas' },
  { name: 'Los Angeles',   timezone: 'America/Los_Angeles',  temp: 72,  region: 'Americas' },
  { name: 'Chicago',       timezone: 'America/Chicago',      temp: 58,  region: 'Americas' },
  { name: 'São Paulo',     timezone: 'America/Sao_Paulo',    temp: 75,  region: 'Americas' },
  { name: 'Mexico City',   timezone: 'America/Mexico_City',  temp: 70,  region: 'Americas' },
  { name: 'Buenos Aires',  timezone: 'America/Argentina/Buenos_Aires', temp: 68, region: 'Americas' },
  { name: 'Toronto',       timezone: 'America/Toronto',      temp: 55,  region: 'Americas' },
  { name: 'Miami',         timezone: 'America/New_York',     temp: 80,  region: 'Americas' },
  { name: 'Bogotá',        timezone: 'America/Bogota',       temp: 64,  region: 'Americas' },
  { name: 'Lima',          timezone: 'America/Lima',         temp: 68,  region: 'Americas' },
  { name: 'Santiago',      timezone: 'America/Santiago',     temp: 62,  region: 'Americas' },
  { name: 'Havana',        timezone: 'America/Havana',       temp: 82,  region: 'Americas' },
  // Oceania
  { name: 'Sydney',        timezone: 'Australia/Sydney',     temp: 74,  region: 'Oceania' },
  { name: 'Melbourne',     timezone: 'Australia/Melbourne',  temp: 68,  region: 'Oceania' },
  { name: 'Auckland',      timezone: 'Pacific/Auckland',     temp: 62,  region: 'Oceania' },
];

const DEFAULT_PINNED = ['Lagos', 'Tokyo', 'London', 'New York', 'São Paulo'];
const USER_HOME_CITY = 'Lagos'; // TODO: pull from user profile

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
  const [activeTheme, setActiveTheme] = useState('light');
  const [times, setTimes] = useState<Record<string, string>>({});
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const [pinnedCities, setPinnedCities] = useState<string[]>(DEFAULT_PINNED);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');

  useEffect(() => {
    const saved = localStorage.getItem('owf-theme') || 'light';
    const savedCities = localStorage.getItem('owf-cities');
    if (savedCities) setPinnedCities(JSON.parse(savedCities));
    setActiveTheme(saved);
    applyTheme(saved);
    updateTimes();
    const interval = setInterval(updateTimes, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateTimes = () => {
    const t: Record<string, string> = {};
    ALL_CITIES.forEach(c => { t[c.name] = getLocalTime(c.timezone); });
    setTimes(t);
  };

  const applyTheme = (id: string) => {
    const theme = THEMES.find(t => t.id === id);
    if (!theme) return;
    Object.entries(theme.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  };

  const handleTheme = (id: string) => {
    setActiveTheme(id);
    applyTheme(id);
    localStorage.setItem('owf-theme', id);
  };

  const toggleCity = (cityName: string) => {
    if (cityName === USER_HOME_CITY) return; // home city always pinned
    const next = pinnedCities.includes(cityName)
      ? pinnedCities.filter(c => c !== cityName)
      : [...pinnedCities, cityName];
    setPinnedCities(next);
    localStorage.setItem('owf-cities', JSON.stringify(next));
  };

  const handleAI = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: 'You are OWF AI — a helpful, concise assistant embedded in OneWorldFeed, a global social platform. Answer questions briefly and warmly in 2-3 sentences max.',
          messages: [{ role: 'user', content: aiInput }],
        }),
      });
      const data = await res.json();
      setAiResponse(data.content?.map((c: any) => c.text || '').join('') || 'No response.');
    } catch {
      setAiResponse('Unable to reach OWF AI right now.');
    }
    setAiLoading(false);
    setAiInput('');
  };

  const regions = ['All', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania'];
  const filteredCities = ALL_CITIES.filter(c => {
    const matchRegion = activeRegion === 'All' || c.region === activeRegion;
    const matchSearch = c.name.toLowerCase().includes(citySearch.toLowerCase());
    return matchRegion && matchSearch;
  });

  // Home city always first, rest in pinned order
  const displayCities = [
    ALL_CITIES.find(c => c.name === USER_HOME_CITY)!,
    ...pinnedCities.filter(n => n !== USER_HOME_CITY).map(n => ALL_CITIES.find(c => c.name === n)!).filter(Boolean),
  ];

  const spotlight = SPOTLIGHT[spotlightIdx];

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">

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

      {/* AI Assistant */}
      <SectionCard>
        <SectionTitle>OWF AI</SectionTitle>
        <p className="text-xs mb-3" style={{ color: 'var(--owf-text-secondary)' }}>Ask anything about the world.</p>
        <div className="flex gap-2 mb-2">
          <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAI()}
            placeholder="Ask a question..."
            className="flex-1 text-xs px-3 py-2 rounded-xl focus:outline-none"
            style={{ backgroundColor: 'var(--owf-bg)', border: '1px solid var(--owf-border)', color: 'var(--owf-text-primary)' }} />
          <button onClick={handleAI} disabled={aiLoading}
            className="text-xs font-bold px-3 py-2 rounded-xl transition-all"
            style={{ backgroundColor: 'var(--owf-gold)', color: '#fff', opacity: aiLoading ? 0.6 : 1 }}>
            {aiLoading ? '...' : '→'}
          </button>
        </div>
        {aiResponse && (
          <div className="text-xs leading-relaxed p-3 rounded-xl" style={{ backgroundColor: 'var(--owf-bg)', color: 'var(--owf-text-primary)', border: '1px solid var(--owf-border)' }}>
            {aiResponse}
          </div>
        )}
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
            style={{ color: 'var(--owf-gold)', backgroundColor: 'var(--owf-gold)' + '18', border: '1px solid var(--owf-gold)33' }}>
            {showCityPicker ? 'Done' : '+ Cities'}
          </button>
        </div>

        {/* Pinned cities list */}
        {!showCityPicker && (
          <div className="space-y-2">
            {displayCities.map((city, i) => (
              <div key={city.name} className="flex items-center justify-between py-1.5 px-2 rounded-xl"
                style={{ backgroundColor: i === 0 ? 'var(--owf-gold)' + '10' : 'transparent', border: i === 0 ? '1px solid var(--owf-gold)22' : 'none' }}>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold" style={{ color: 'var(--owf-text-primary)' }}>{city.name}</p>
                    {i === 0 && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--owf-gold)', color: '#fff' }}>HOME</span>}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--owf-text-secondary)' }}>{times[city.name] || '--'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--owf-text-secondary)' }}>{city.temp}°F</span>
                  {i > 0 && (
                    <button onClick={() => toggleCity(city.name)} className="text-xs opacity-40 hover:opacity-100 transition-all" style={{ color: 'var(--owf-text-secondary)' }}>✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* City picker */}
        {showCityPicker && (
          <div>
            <input type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)}
              placeholder="Search cities..."
              className="w-full text-xs px-3 py-2 rounded-xl mb-3 focus:outline-none"
              style={{ backgroundColor: 'var(--owf-bg)', border: '1px solid var(--owf-border)', color: 'var(--owf-text-primary)' }} />
            {/* Region tabs */}
            <div className="flex gap-1 flex-wrap mb-3">
              {regions.map(r => (
                <button key={r} onClick={() => setActiveRegion(r)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                  style={{ backgroundColor: activeRegion === r ? 'var(--owf-gold)' : 'var(--owf-bg)', color: activeRegion === r ? '#fff' : 'var(--owf-text-secondary)', border: '1px solid var(--owf-border)' }}>
                  {r}
                </button>
              ))}
            </div>
            {/* City list */}
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filteredCities.map(city => {
                const pinned = pinnedCities.includes(city.name);
                const isHome = city.name === USER_HOME_CITY;
                return (
                  <button key={city.name} onClick={() => toggleCity(city.name)}
                    className="w-full flex items-center justify-between py-1.5 px-2 rounded-xl transition-all"
                    style={{ backgroundColor: pinned ? 'var(--owf-gold)' + '12' : 'transparent' }}
                    disabled={isHome}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded flex items-center justify-center text-xs"
                        style={{ backgroundColor: pinned ? 'var(--owf-gold)' : 'var(--owf-border)', color: pinned ? '#fff' : 'transparent' }}>
                        ✓
                      </div>
                      <span className="text-xs font-semibold" style={{ color: 'var(--owf-text-primary)' }}>{city.name}</span>
                      {isHome && <span className="text-[9px] font-black px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--owf-gold)', color: '#fff' }}>HOME</span>}
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
                  style={{ background: 'linear-gradient(135deg, ' + person.color + ', ' + person.color + 'bb)', boxShadow: '0 0 8px ' + person.color + '44' }}>
                  {person.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--owf-text-primary)' }}>{person.name}</p>
                  <p className="text-xs" style={{ color: 'var(--owf-text-secondary)' }}>{person.handle}</p>
                </div>
              </div>
              <button className="text-xs font-bold px-3 py-1 rounded-full transition-all hover:scale-105"
                style={{ backgroundColor: person.color + '18', color: person.color, border: '1px solid ' + person.color + '33' }}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Theme */}
      <SectionCard>
        <SectionTitle>THEME</SectionTitle>
        <div className="flex items-center gap-2 flex-wrap">
          {THEMES.map(theme => {
            const active = activeTheme === theme.id;
            return (
              <button key={theme.id} onClick={() => handleTheme(theme.id)}
                className="flex flex-col items-center gap-1 transition-all hover:scale-105" title={theme.label}>
                <div className="w-10 h-10 rounded-xl border-2 transition-all"
                  style={{ background: THEME_GRADIENTS[theme.id], borderColor: active ? 'var(--owf-gold)' : 'var(--owf-border)', boxShadow: active ? '0 0 0 3px #D9770633' : 'none' }} />
                <span className="text-[10px] font-semibold" style={{ color: active ? 'var(--owf-gold)' : 'var(--owf-text-secondary)' }}>{theme.label}</span>
              </button>
            );
          })}
        </div>
      </SectionCard>

    </aside>
  );
}
