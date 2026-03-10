'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeProvider';

interface KnowledgeCard {
  id: string;
  type: 'space' | 'history' | 'science' | 'culture' | 'stem';
  title: string;
  body: string;
  imageUrl?: string;
  linkUrl?: string;
  source: string;
  icon: string;
}

function getTodayMD() {
  const d = new Date();
  return { month: d.getMonth() + 1, day: d.getDate() };
}

const STATIC_STEM_CARDS: KnowledgeCard[] = [
  { id: 'stem-1', type: 'science', title: 'The Speed of Light', body: 'Light travels at 299,792,458 metres per second in a vacuum — fast enough to circle the Earth 7.5 times in one second.', source: 'Physics', icon: '⚡' },
  { id: 'stem-2', type: 'stem', title: 'How DNA Works', body: 'Your DNA contains about 3 billion base pairs and if uncoiled, would stretch roughly 2 metres — packed into a nucleus 6 micrometres wide.', source: 'Biology', icon: '🧬' },
  { id: 'stem-3', type: 'space', title: 'The Milky Way', body: 'Our galaxy contains 100-400 billion stars. At light speed it would take 100,000 years to cross from edge to edge.', source: 'Astronomy', icon: '🌌' },
  { id: 'stem-4', type: 'history', title: 'The Library of Alexandria', body: 'At its peak the Library held an estimated 400,000–700,000 scrolls — the largest collection of knowledge in the ancient world.', source: 'Ancient History', icon: '📜' },
  { id: 'stem-5', type: 'culture', title: 'The Printing Press', body: "Gutenberg's press (c. 1440) made books affordable for the first time. Within 50 years it had produced over 20 million volumes.", source: 'World History', icon: '📚' },
  { id: 'stem-6', type: 'science', title: "The Ocean's Oxygen", body: "More than 50% of the world's oxygen is produced by the ocean — primarily by tiny phytoplankton, not rainforests.", source: 'Marine Biology', icon: '🌊' },
  { id: 'stem-7', type: 'stem', title: 'Mathematics of Pi', body: 'Pi has been calculated to over 100 trillion digits. For most engineering applications only 15 decimal places are ever needed.', source: 'Mathematics', icon: '∞' },
  { id: 'stem-8', type: 'history', title: 'Ancient Astronomy', body: 'Ancient Egyptians aligned the pyramids at Giza with the stars of Orion\'s Belt with precision that modern GPS cannot improve upon.', source: 'Archaeoastronomy', icon: '🏛' },
];

const TYPE_COLORS: Record<KnowledgeCard['type'], string> = {
  space: '#818cf8', history: '#f59e0b', science: '#34d399', culture: '#f472b6', stem: '#60a5fa',
};

export default function KnowledgeStrip() {
  const { theme: T } = useTheme();
  const h = T.horizon;
  const hRgb = T.horizonRgb;
  const [cards, setCards] = useState<KnowledgeCard[]>(STATIC_STEM_CARDS);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      .then(r => r.json())
      .then(data => {
        if (data?.title && data?.explanation) {
          setCards(prev => [{ id: 'nasa-apod', type: 'space', title: `🔭 ${data.title}`, body: data.explanation.slice(0, 160) + '...', imageUrl: data.media_type === 'image' ? data.url : undefined, linkUrl: 'https://apod.nasa.gov', source: 'NASA · APOD', icon: '🚀' }, ...prev]);
        }
      }).catch(() => {});
  }, []);

  useEffect(() => {
    const { month, day } = getTodayMD();
    fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`, { headers: { 'User-Agent': 'OneWorldFeed/1.0' } })
      .then(r => r.json())
      .then(data => {
        const event = data?.events?.find((e: { year?: number; text?: string }) => e.year && e.year > 1000 && e.text && e.text.length > 40) || data?.events?.[0];
        if (event?.text) {
          setCards(prev => { if (prev.find(c => c.id === 'wiki-otd')) return prev; return [prev[0], { id: 'wiki-otd', type: 'history', title: `📅 On This Day (${event.year})`, body: event.text, linkUrl: 'https://en.wikipedia.org/wiki/Wikipedia:On_this_day', source: 'Wikipedia · On This Day', icon: '📜' }, ...prev.slice(1)]; });
        }
      }).catch(() => {});
  }, []);

  const card = cards[activeIdx % cards.length];
  const typeColor = TYPE_COLORS[card.type];

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span style={{ color: h, fontSize: '0.8rem' }}>◈</span>
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Knowledge Feed</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setActiveIdx(i => (i - 1 + cards.length) % cards.length)} className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>‹</button>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{(activeIdx % cards.length) + 1}/{cards.length}</span>
          <button onClick={() => setActiveIdx(i => (i + 1) % cards.length)} className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>›</button>
        </div>
      </div>
      <div className="relative rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
        <div className="h-0.5 w-full" style={{ background: typeColor }} />
        <div className="flex gap-3 p-4">
          {card.imageUrl ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"><img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" /></div>
          ) : (
            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${typeColor}18`, border: `1px solid ${typeColor}30` }}><span style={{ fontSize: '1.5rem' }}>{card.icon}</span></div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full" style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30` }}>{card.type}</span>
              <span className="text-[9px]" style={{ color: 'rgba(15,25,36,0.4)' }}>{card.source}</span>
            </div>
            <h3 className="text-xs font-bold mb-1 leading-snug" style={{ color: '#0F1924' }}>{card.title}</h3>
            <p className="text-[11px] leading-relaxed" style={{ color: '#5A6E80' }}>{card.body.slice(0, 120)}{card.body.length > 120 ? '...' : ''}</p>
            {card.linkUrl && <a href={card.linkUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold mt-1 inline-block" style={{ color: typeColor }}>Learn more →</a>}
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 pb-2.5">
          {cards.slice(0, Math.min(cards.length, 8)).map((_, i) => (
            <button key={i} onClick={() => setActiveIdx(i)} className="rounded-full transition-all" style={{ width: i === activeIdx % cards.length ? '16px' : '5px', height: '5px', background: i === activeIdx % cards.length ? typeColor : 'rgba(15,25,36,0.15)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
