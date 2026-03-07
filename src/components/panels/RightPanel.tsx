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

const CITIES = [
  { name: 'Tokyo',     timezone: 'Asia/Tokyo',          temp: 72 },
  { name: 'London',    timezone: 'Europe/London',        temp: 58 },
  { name: 'New York',  timezone: 'America/New_York',     temp: 65 },
  { name: 'Lagos',     timezone: 'Africa/Lagos',         temp: 88 },
  { name: 'Mumbai',    timezone: 'Asia/Kolkata',         temp: 91 },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo',    temp: 75 },
];

function getLocalTime(timezone: string) {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: timezone,
  });
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--owf-surface)', border: '1px solid var(--owf-border)' }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black tracking-widest mb-3" style={{ color: 'var(--owf-text-secondary)' }}>
      {children}
    </p>
  );
}

export default function RightPanel() {
  const [activeTheme, setActiveTheme] = useState('light');
  const [times, setTimes] = useState<Record<string, string>>({});
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [spotlightIdx, setSpotlightIdx] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('owf-theme') || 'light';
    setActiveTheme(saved);
    applyTheme(saved);
    updateTimes();
    const interval = setInterval(updateTimes, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateTimes = () => {
    const t: Record<string, string> = {};
    CITIES.forEach(c => { t[c.name] = getLocalTime(c.timezone); });
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
          system: 'You are OWF AI — a helpful, concise assistant embedded in OneWorldFeed, a global social platform. Answer questions briefly and warmly. You understand global culture, news, and community.',
          messages: [{ role: 'user', content: aiInput }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((c: any) => c.text || '').join('') || 'No response.';
      setAiResponse(text);
    } catch {
      setAiResponse('Unable to reach OWF AI right now. Try again shortly.');
    }
    setAiLoading(false);
    setAiInput('');
  };

  const spotlight = SPOTLIGHT[spotlightIdx];

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0">

      {/* Spotlight */}
      <SectionCard>
        <SectionTitle>SPOTLIGHT</SectionTitle>
        <div className="relative rounded-xl overflow-hidden mb-3 cursor-pointer" style={{ height: '140px' }}
          onClick={() => setSpotlightIdx((spotlightIdx + 1) % SPOTLIGHT.length)}>
          <img src={spotlight.image} alt={spotlight.title}
            className="w-full h-full object-cover"
            draggable={false}
            onContextMenu={e => e.preventDefault()}
            style={{ pointerEvents: 'none' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
          <div className="absolute bottom-3 left-3">
            <p className="text-white text-sm font-bold">{spotlight.title}</p>
            <p className="text-white/70 text-xs">{spotlight.subtitle}</p>
          </div>
        </div>
      </SectionCard>

      {/* AI Assistant */}
      <SectionCard>
        <SectionTitle>OWF AI</SectionTitle>
        <p className="text-xs mb-3" style={{ color: 'var(--owf-text-secondary)' }}>Ask anything about the world.</p>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAI()}
            placeholder="Ask a question..."
            className="flex-1 text-xs px-3 py-2 rounded-xl focus:outline-none"
            style={{ backgroundColor: 'var(--owf-bg)', border: '1px solid var(--owf-border)', color: 'var(--owf-text-primary)' }}
          />
          <button
            onClick={handleAI}
            disabled={aiLoading}
            className="text-xs font-bold px-3 py-2 rounded-xl transition-all"
            style={{ backgroundColor: 'var(--owf-gold)', color: '#fff', opacity: aiLoading ? 0.6 : 1 }}
          >
            {aiLoading ? '...' : '→'}
          </button>
        </div>
        {aiResponse && (
          <div className="text-xs leading-relaxed p-3 rounded-xl" style={{ backgroundColor: 'var(--owf-bg)', color: 'var(--owf-text-primary)', border: '1px solid var(--owf-border)' }}>
            {aiResponse}
          </div>
        )}
      </SectionCard>

      {/* Trending +tags */}
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

      {/* City Clocks */}
      <SectionCard>
        <SectionTitle>WORLD CLOCKS</SectionTitle>
        <div className="space-y-2">
          {CITIES.map(city => (
            <div key={city.name} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--owf-text-primary)' }}>{city.name}</p>
                <p className="text-xs" style={{ color: 'var(--owf-text-secondary)' }}>{times[city.name] || '--'}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--owf-text-secondary)' }}>{city.temp}°</span>
            </div>
          ))}
        </div>
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

      {/* Theme selector */}
      <SectionCard>
        <SectionTitle>THEME</SectionTitle>
        <div className="flex items-center gap-2 flex-wrap">
          {THEMES.map(theme => {
            const active = activeTheme === theme.id;
            return (
              <button key={theme.id} onClick={() => handleTheme(theme.id)}
                className="flex flex-col items-center gap-1 transition-all hover:scale-105" title={theme.label}>
                <div className="w-10 h-10 rounded-xl border-2 transition-all"
                  style={{ background: THEME_GRADIENTS[theme.id], borderColor: active ? 'var(--owf-gold)' : 'var(--owf-border)', boxShadow: active ? '0 0 0 2px #D9770633' : 'none' }} />
                <span className="text-[10px] font-semibold" style={{ color: active ? 'var(--owf-gold)' : 'var(--owf-text-secondary)' }}>
                  {theme.label}
                </span>
              </button>
            );
          })}
        </div>
      </SectionCard>

    </aside>
  );
}
