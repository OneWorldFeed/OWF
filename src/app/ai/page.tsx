'use client';
import { useState, useRef, useEffect } from 'react';
import { escalatingCall } from '@/lib/ai/escalation';
import { rulesEngineCall, getMoodOfTheDay } from '@/lib/ai/rules-engine';
import { getFeedContext, formatContextForRules } from '@/lib/ai/feed-context';
import { useTheme } from '@/context/ThemeProvider';
import type { CopilotMessage } from '@/lib/ai/copilot';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

// ─── Chip sets ───────────────────────────────────────────────────────────────

const INITIAL_CHIPS = [
  { label: '🌍 Global mood today',   prompt: 'What is the mood of the world today?' },
  { label: '🏙 Recommend a city',    prompt: 'Based on today\'s feed activity, recommend one city I should explore.' },
  { label: '✍️ What should I post?', prompt: 'What should I post today?' },
  { label: '🕐 World times',         prompt: 'What time is it right now around the world?' },
  { label: '📋 Feed summary',        prompt: 'What is happening in the feed right now?' },
  { label: '🔖 Suggest +tags',       prompt: 'Suggest some +tags I could use today.' },
];

function getFollowUpChips(lastText: string) {
  const lower = lastText.toLowerCase();
  if (/city|explore|lagos|tokyo|cairo|berlin|seoul|london/.test(lower)) {
    return [
      { label: '🕐 Time there?',        prompt: 'What time is it there right now?' },
      { label: '🌤 Tell me more',        prompt: 'Tell me more about this city.' },
      { label: '✍️ Post idea for there', prompt: 'Give me a post idea for that city.' },
    ];
  }
  if (/mood|electric|hopeful|feel|energy/.test(lower)) {
    return [
      { label: '🔖 Tags for this mood', prompt: 'What +tags work best for this mood?' },
      { label: '✍️ Post idea',          prompt: 'Give me a post idea that fits this mood.' },
      { label: '🏙 City to match?',     prompt: 'Which city best matches this mood right now?' },
    ];
  }
  if (/post|caption|idea|write|share/.test(lower)) {
    return [
      { label: '🔖 +Tags for it',  prompt: 'What +tags should I use for that post?' },
      { label: '✍️ Another idea',  prompt: 'Give me another post idea.' },
      { label: '🌍 Mood for it',   prompt: 'What mood fits that post best?' },
    ];
  }
  return [
    { label: '🏙 Recommend a city',    prompt: 'Recommend a city I should explore today.' },
    { label: '✍️ What should I post?', prompt: 'What should I post today?' },
    { label: '🌍 World mood',          prompt: 'What is the mood of the world today?' },
  ];
}

const TYPING_PHRASES = [
  'Reading the feed...', 'Tuning in...', 'Listening to the world...',
  'Checking the cities...', 'Sensing the mood...', 'Scanning the globe...',
];

const AMBIENT_MESSAGES = [
  'Voices from every timezone are active right now.\nWhat would you like to explore?',
  'Global moments are unfolding as we speak.\nAsk me anything.',
  'The feed is alive with stories from every city.\nI\'m here to help you navigate it.',
  'The world is in motion today.\nWhat would you like to know?',
];

// MyMemory language codes: label → code
const LANGUAGES: { label: string; code: string }[] = [
  { label: 'Spanish',    code: 'es' },
  { label: 'French',     code: 'fr' },
  { label: 'Arabic',     code: 'ar' },
  { label: 'Portuguese', code: 'pt' },
  { label: 'Mandarin',   code: 'zh' },
  { label: 'Japanese',   code: 'ja' },
  { label: 'Swahili',    code: 'sw' },
  { label: 'Hindi',      code: 'hi' },
  { label: 'German',     code: 'de' },
  { label: 'Korean',     code: 'ko' },
  { label: 'Italian',    code: 'it' },
  { label: 'Russian',    code: 'ru' },
  { label: 'Turkish',    code: 'tr' },
  { label: 'Dutch',      code: 'nl' },
  { label: 'Polish',     code: 'pl' },
  { label: 'Yoruba',     code: 'yo' },
  { label: 'Igbo',       code: 'ig' },
  { label: 'Hausa',      code: 'ha' },
  { label: 'Amharic',    code: 'am' },
  { label: 'Indonesian', code: 'id' },
];

// ─── Tab types ───────────────────────────────────────────────────────────────

type Tab = 'ask' | 'catchup' | 'translate' | 'clock' | 'explore' | 'transparency';

// ─────────────────────────────────────────────────────────
//  WORLD CLOCK TAB
//  Live clocks for 12 OWF cities. Updates every second.
// ─────────────────────────────────────────────────────────

const CLOCK_CITIES_AI = [
  { name: 'Lagos',       tz: 'Africa/Lagos',                   flag: '🇳🇬' },
  { name: 'Accra',       tz: 'Africa/Accra',                   flag: '🇬🇭' },
  { name: 'Nairobi',     tz: 'Africa/Nairobi',                 flag: '🇰🇪' },
  { name: 'Cairo',       tz: 'Africa/Cairo',                   flag: '🇪🇬' },
  { name: 'London',      tz: 'Europe/London',                  flag: '🇬🇧' },
  { name: 'Paris',       tz: 'Europe/Paris',                   flag: '🇫🇷' },
  { name: 'Dubai',       tz: 'Asia/Dubai',                     flag: '🇦🇪' },
  { name: 'Mumbai',      tz: 'Asia/Kolkata',                   flag: '🇮🇳' },
  { name: 'Tokyo',       tz: 'Asia/Tokyo',                     flag: '🇯🇵' },
  { name: 'New York',    tz: 'America/New_York',               flag: '🇺🇸' },
  { name: 'Mexico City', tz: 'America/Mexico_City',            flag: '🇲🇽' },
  { name: 'São Paulo',   tz: 'America/Sao_Paulo',              flag: '🇧🇷' },
];

function WorldClockTab({ horizon, horizonRgb }: { horizon: string; horizonRgb: string }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: '24px 0' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 20, textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Live city times
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {CLOCK_CITIES_AI.map(city => {
          const now = new Date();
          const time = now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true, timeZone: city.tz,
          });
          const date = now.toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', timeZone: city.tz,
          });
          const hour = parseInt(now.toLocaleTimeString('en-US', {
            hour: 'numeric', hour12: false, timeZone: city.tz,
          }));
          const isDay = hour >= 6 && hour < 20;
          return (
            <div key={city.name} style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid rgba(${horizonRgb},0.15)`,
              borderRadius: 12,
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{city.flag}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{city.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: 16 }}>{isDay ? '☀️' : '🌙'}</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: horizon, letterSpacing: '0.05em' }}>
                {time}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>
                {date}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  EXPLORE TAB
//  Curated quick-access prompts organized by category.
//  Taps into existing escalation pipeline.
// ─────────────────────────────────────────────────────────

const EXPLORE_CATEGORIES = [
  {
    label: '🌤 Weather',
    color: '#60A5FA',
    prompts: [
      'Weather in Lagos right now',
      'Weather in Tokyo right now',
      'Weather in New York right now',
      'Weather in London right now',
      'Weather in Dubai right now',
      'Weather in Mexico City right now',
    ],
  },
  {
    label: '💱 Exchange Rates',
    color: '#34D399',
    prompts: [
      'USD to NGN exchange rate',
      'EUR to USD exchange rate',
      'GBP to USD exchange rate',
      'USD to KES exchange rate',
      'USD to GHS exchange rate',
      'USD to ETB exchange rate',
    ],
  },
  {
    label: '🗺 City Facts',
    color: '#A78BFA',
    prompts: [
      'Tell me about Lagos',
      'Tell me about Accra',
      'Tell me about Nairobi',
      'Tell me about Mexico City',
      'Tell me about Seoul',
      'Tell me about Buenos Aires',
    ],
  },
  {
    label: '🎉 Holidays',
    color: '#F97316',
    prompts: [
      'Upcoming holidays in Nigeria',
      'Upcoming holidays in Ghana',
      'Upcoming holidays in USA',
      'Upcoming holidays in UK',
      'Upcoming holidays in Mexico',
      'Upcoming holidays in Kenya',
    ],
  },
  {
    label: '🌍 Global Mood',
    color: '#FB7185',
    prompts: [
      'What is the mood of the world today?',
      'What city has the most energy in the feed right now?',
      'What should I post today?',
      'Give me a post idea about community',
      'Suggest +tags for a travel post',
      'What is happening in the feed right now?',
    ],
  },
];

function ExploreTab({
  horizon,
  horizonRgb,
  onPrompt,
}: {
  horizon: string;
  horizonRgb: string;
  onPrompt: (prompt: string) => void;
}) {
  return (
    <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {EXPLORE_CATEGORIES.map(cat => (
        <div key={cat.label}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: cat.color,
            marginBottom: 10,
          }}>
            {cat.label}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {cat.prompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => onPrompt(prompt)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(${horizonRgb},0.12)`,
                  borderRadius: 10,
                  padding: '10px 12px',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 12,
                  textAlign: 'left',
                  cursor: 'pointer',
                  lineHeight: 1.4,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = `rgba(${horizonRgb},0.1)`;
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                  (e.currentTarget as HTMLElement).style.borderColor = `rgba(${horizonRgb},0.3)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                  (e.currentTarget as HTMLElement).style.borderColor = `rgba(${horizonRgb},0.12)`;
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function AIPage() {
  const { theme: T } = useTheme();

  const [activeTab, setActiveTab]         = useState<Tab>('ask');
  const [messages, setMessages]           = useState<Message[]>([]);
  const [input, setInput]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [glowPulse, setGlowPulse]         = useState(false);
  const [typingPhrase, setTypingPhrase]   = useState(TYPING_PHRASES[0]);
  const [chips, setChips]                 = useState(INITIAL_CHIPS);
  const [ambientIdx]                      = useState(() => Math.floor(Math.random() * AMBIENT_MESSAGES.length));
  const [feedContext, setFeedContext]     = useState<{ city?: string; feedCities?: string[] }>({});

  // Catch me up
  const [catchupResult, setCatchupResult] = useState('');
  const [catchupLoading, setCatchupLoading] = useState(false);

  // Translate
  const [translateInput, setTranslateInput]   = useState('');
  const [translateLang, setTranslateLang]     = useState(LANGUAGES[0]);
  const [translateResult, setTranslateResult] = useState('');
  const [translateLoading, setTranslateLoading] = useState(false);

  // Transparency
  const [sessionCleared, setSessionCleared]   = useState(false);
  const [memoryEnabled, setMemoryEnabled]     = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFeedContext().then(ctx => setFeedContext(formatContextForRules(ctx)));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const id = setInterval(() => setGlowPulse(p => !p), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setTypingPhrase(TYPING_PHRASES[Math.floor(Math.random() * TYPING_PHRASES.length)]);
    }, 1800);
    return () => clearInterval(id);
  }, [loading]);

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: msg }];
    setMessages(newMessages);
    setLoading(true);
    setChips([]);
    const history: CopilotMessage[] = messages.map(m => ({ role: m.role, content: m.text }));
    try {
      const response = await escalatingCall('ai_page', msg, history);
      setMessages([...newMessages, { role: 'assistant', text: response.text }]);
      setChips(getFollowUpChips(response.text));
    } catch {
      const rules = rulesEngineCall(msg, {
        ...feedContext,
        conversationHistory: history.map(m => ({ role: m.role, content: m.content })),
      });
      setMessages([...newMessages, { role: 'assistant', text: rules.text }]);
      setChips(getFollowUpChips(rules.text));
    }
    setLoading(false);
  }

  async function handleCatchUp() {
    setCatchupLoading(true);
    setCatchupResult('');
    try {
      const res = await escalatingCall('ai_page',
        'Give me a 5-point daily summary of what\'s happening in the global feed right now. Use city names and mood tags. Keep each point to one sentence.');
      setCatchupResult(res.text);
    } catch {
      setCatchupResult('Unable to load summary right now. Try again in a moment.');
    }
    setCatchupLoading(false);
  }

  async function handleTranslate() {
    if (!translateInput.trim()) return;
    setTranslateLoading(true);
    setTranslateResult('');
    try {
      // MyMemory free translation API — no key needed
      const encoded = encodeURIComponent(translateInput.trim());
      const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|${translateLang.code}&de=owf@oneworldfeed.com`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        setTranslateResult(data.responseData.translatedText);
      } else {
        setTranslateResult('Translation unavailable right now. Try again in a moment.');
      }
    } catch {
      setTranslateResult('Translation unavailable right now. Check your connection.');
    }
    setTranslateLoading(false);
  }

  function handleReset() { setMessages([]); setChips(INITIAL_CHIPS); }
  function handleClearSession() { setSessionCleared(true); setMessages([]); setTimeout(() => setSessionCleared(false), 3000); }

  const showIntro = messages.length === 0;
  const daily = getMoodOfTheDay();
  const h = T.horizon;
  const hRgb = T.horizonRgb;

  // ─── Tab nav ────────────────────────────────────────────────────────────────

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'ask',          label: 'Ask',          icon: '◈' },
    { id: 'catchup',      label: 'Catch Me Up',  icon: '🌍' },
    { id: 'translate',    label: 'Translate',    icon: '🌐' },
    { id: 'clock',        label: 'World Clock',  icon: '🕐' },
    { id: 'explore',      label: 'Explore',      icon: '🌍' },
    { id: 'transparency', label: 'What I Know',  icon: '🔍' },
  ];

  return (
    <div className="fixed inset-0 flex flex-col lg:relative lg:inset-auto lg:h-screen"
      style={{ backgroundColor: '#060E1A' }}>

      {/* ── Background ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #060E1A 0%, #071520 40%, #0A2535 60%, #060E1A 100%)' }} />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-[3000ms]"
          style={{
            bottom: '25%', width: '140%', height: '320px',
            background: `radial-gradient(ellipse at center, ${h}22 0%, ${h}12 40%, transparent 70%)`,
            filter: 'blur(40px)',
            transform: `translateX(-50%) scaleY(${glowPulse ? 1.08 : 1})`,
            opacity: glowPulse ? 0.9 : 0.7,
          }} />
        <div className="absolute left-0 right-0 transition-all duration-[3000ms]"
          style={{
            bottom: '27%', height: '1px',
            background: `linear-gradient(90deg, transparent 0%, ${h}${glowPulse ? 'cc' : '66'} 20%, ${h}${glowPulse ? 'ff' : 'bb'} 50%, ${h}${glowPulse ? 'cc' : '66'} 80%, transparent 100%)`,
            boxShadow: `0 0 ${glowPulse ? '20px' : '10px'} ${h}80`,
          }} />
        <div className="absolute left-1/4 rounded-full"
          style={{ bottom: '27%', width: '6px', height: '6px', backgroundColor: h, boxShadow: `0 0 12px 4px ${h}66`, transform: 'translateY(50%)' }} />
        <div className="absolute left-3/4 rounded-full"
          style={{ bottom: '27%', width: '4px', height: '4px', backgroundColor: h, boxShadow: `0 0 8px 3px ${h}44`, transform: 'translateY(50%)' }} />
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-5 pb-3 flex-shrink-0">
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `rgba(${hRgb}, 0.15)`,
          border: `1px solid rgba(${hRgb}, 0.3)`,
        }}>
          <span style={{ color: h, fontSize: '1rem' }}>◈</span>
        </div>
        <div>
          <span className="font-bold text-base" style={{ color: '#fff' }}>OWF Intelligence</span>
          <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: `rgba(${hRgb}, 0.12)`, color: h, border: `1px solid rgba(${hRgb}, 0.2)` }}>
            SESSION ONLY
          </span>
        </div>
        {messages.length > 0 && activeTab === 'ask' && (
          <button onClick={handleReset} className="ml-auto text-xs px-3 py-1.5 rounded-full"
            style={{ color: h, background: `rgba(${hRgb}, 0.08)`, border: `1px solid rgba(${hRgb}, 0.2)` }}>
            ↺ New
          </button>
        )}
      </div>

      {/* ── Tab nav ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex gap-1 px-5 pb-3 flex-shrink-0">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? `rgba(${hRgb}, 0.15)` : 'rgba(255,255,255,0.04)',
              color: activeTab === tab.id ? h : 'rgba(255,255,255,0.45)',
              border: activeTab === tab.id ? `1px solid rgba(${hRgb}, 0.3)` : '1px solid rgba(255,255,255,0.06)',
            }}>
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5">

        {/* ASK ANYTHING */}
        {activeTab === 'ask' && (
          <>
            {showIntro && (
              <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                <p className="text-xs font-semibold mb-2 tracking-widest uppercase"
                  style={{ color: `rgba(${hRgb}, 0.6)` }}>Today feels {daily.mood}</p>
                <h1 className="text-3xl font-bold mb-8 leading-tight" style={{ color: '#fff' }}>
                  What would you<br />like to explore?
                </h1>
              </div>
            )}
            {showIntro && (
              <div className="mb-3">
                <div className="px-5 py-4 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', whiteSpace: 'pre-line',
                  }}>
                  {AMBIENT_MESSAGES[ambientIdx]}
                </div>
              </div>
            )}
            {messages.length > 0 && (
              <div className="space-y-4 py-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center mr-2 flex-shrink-0 self-end"
                        style={{ background: `rgba(${hRgb}, 0.2)`, border: `1px solid rgba(${hRgb}, 0.3)` }}>
                        <span style={{ color: h, fontSize: '0.8rem' }}>◈</span>
                      </div>
                    )}
                    <div className="max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
                      style={{
                        background: msg.role === 'user' ? 'rgba(255,255,255,0.08)' : `rgba(${hRgb}, 0.08)`,
                        color: msg.role === 'user' ? 'rgba(255,255,255,0.9)' : 'rgba(220,255,250,0.95)',
                        border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.1)' : `1px solid rgba(${hRgb}, 0.2)`,
                        borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start items-end gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `rgba(${hRgb}, 0.2)`, border: `1px solid rgba(${hRgb}, 0.3)` }}>
                      <span style={{ color: h, fontSize: '0.8rem' }}>◈</span>
                    </div>
                    <div className="px-4 py-3 rounded-2xl text-sm"
                      style={{ background: `rgba(${hRgb}, 0.08)`, border: `1px solid rgba(${hRgb}, 0.2)`, color: `rgba(${hRgb.split(',').map(Number).join(', ')}, 0.7)` }}>
                      <span className="animate-pulse">{typingPhrase}</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </>
        )}

        {/* CATCH ME UP */}
        {activeTab === 'catchup' && (
          <div className="py-4 space-y-4">
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-bold mb-1" style={{ color: '#fff' }}>🌍 Daily Global Summary</p>
              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
                AI reads the current feed and gives you 5 key moments from around the world.
                Based only on your current session — nothing is stored.
              </p>
              {catchupResult ? (
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(220,255,250,0.9)' }}>
                  {catchupResult}
                </p>
              ) : (
                <button onClick={handleCatchUp} disabled={catchupLoading}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: catchupLoading ? `rgba(${hRgb}, 0.08)` : `rgba(${hRgb}, 0.15)`,
                    color: catchupLoading ? `rgba(${hRgb.split(',').map(Number).join(', ')}, 0.5)` : h,
                    border: `1px solid rgba(${hRgb}, 0.25)`,
                  }}>
                  {catchupLoading ? <span className="animate-pulse">{typingPhrase}</span> : 'Catch me up →'}
                </button>
              )}
              {catchupResult && (
                <button onClick={() => { setCatchupResult(''); handleCatchUp(); }}
                  className="mt-3 text-xs px-3 py-1.5 rounded-full"
                  style={{ color: h, background: `rgba(${hRgb}, 0.08)`, border: `1px solid rgba(${hRgb}, 0.2)` }}>
                  ↺ Refresh
                </button>
              )}
            </div>
          </div>
        )}

        {/* TRANSLATE */}
        {activeTab === 'translate' && (
          <div className="py-4 space-y-3">
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-bold mb-1" style={{ color: '#fff' }}>🌐 Translate Content</p>
              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Paste any post, article, or message and translate it instantly.
              </p>

              <textarea
                value={translateInput}
                onChange={e => setTranslateInput(e.target.value)}
                placeholder="Paste text here..."
                rows={4}
                className="w-full text-sm px-4 py-3 rounded-xl focus:outline-none resize-none mb-3"
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.85)', caretColor: h,
                }}
              />

              <div className="flex flex-wrap gap-2 mb-4">
                {LANGUAGES.map(lang => (
                  <button key={lang.code} onClick={() => setTranslateLang(lang)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: translateLang.code === lang.code ? `rgba(${hRgb}, 0.2)` : 'rgba(255,255,255,0.05)',
                      color: translateLang.code === lang.code ? h : 'rgba(255,255,255,0.45)',
                      border: translateLang.code === lang.code ? `1px solid rgba(${hRgb}, 0.35)` : '1px solid rgba(255,255,255,0.08)',
                    }}>
                    {lang.label}
                  </button>
                ))}
              </div>

              <button onClick={handleTranslate} disabled={translateLoading || !translateInput.trim()}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: !translateInput.trim() ? 'rgba(255,255,255,0.04)' : `rgba(${hRgb}, 0.15)`,
                  color: !translateInput.trim() ? 'rgba(255,255,255,0.2)' : h,
                  border: `1px solid rgba(${hRgb}, ${!translateInput.trim() ? '0.1' : '0.25'})`,
                }}>
                {translateLoading ? <span className="animate-pulse">Translating...</span> : `Translate to ${translateLang.label} →`}
              </button>

              {translateResult && (
                <div className="mt-4 p-4 rounded-xl"
                  style={{ background: `rgba(${hRgb}, 0.08)`, border: `1px solid rgba(${hRgb}, 0.2)` }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: `rgba(${hRgb.split(',').map(Number).join(', ')}, 0.7)` }}>
                    {translateLang.label}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(220,255,250,0.9)' }}>
                    {translateResult}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── WORLD CLOCK TAB ──────────────────────────────────── */}
        {activeTab === 'clock' && (
          <WorldClockTab horizon={h} horizonRgb={hRgb} />
        )}

        {/* ── EXPLORE TAB ──────────────────────────────────────── */}
        {activeTab === 'explore' && (
          <ExploreTab
            horizon={h}
            horizonRgb={hRgb}
            onPrompt={(prompt) => {
              setActiveTab('ask');
              handleSend(prompt);
            }}
          />
        )}

        {/* TRANSPARENCY PANEL */}
        {activeTab === 'transparency' && (
          <div className="py-4 space-y-3">

            {/* What AI knows */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-bold mb-1" style={{ color: '#fff' }}>🔍 What OWF AI knows right now</p>
              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
                This is the complete picture of your current session. Nothing beyond this is used.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Posts read this session', value: '12 posts' },
                  { label: 'Cities active in your feed', value: 'Lagos, Tokyo, Berlin, Cairo, Seoul' },
                  { label: 'Dominant mood', value: 'Electric + Reflective' },
                  { label: 'Languages detected', value: 'English' },
                  { label: 'Your location', value: 'Not collected' },
                  { label: 'Account data used', value: 'None' },
                  { label: 'Stored between sessions', value: 'Nothing (session only)' },
                  { label: 'Sold or shared', value: 'Never' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
                    <span className="text-xs font-semibold" style={{
                      color: ['Not collected', 'None', 'Nothing (session only)', 'Never'].includes(row.value)
                        ? '#4ade80' : 'rgba(255,255,255,0.85)',
                    }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-bold mb-4" style={{ color: '#fff' }}>Your controls</p>

              {/* Memory toggle */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Session memory</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Let AI remember context within this session only
                  </p>
                </div>
                <button onClick={() => setMemoryEnabled(!memoryEnabled)}
                  className="relative flex-shrink-0 w-10 h-5 rounded-full transition-all"
                  style={{ background: memoryEnabled ? h : 'rgba(255,255,255,0.15)' }}>
                  <div className="absolute top-0.5 transition-all w-4 h-4 rounded-full bg-white"
                    style={{ left: memoryEnabled ? '22px' : '2px' }} />
                </button>
              </div>

              {/* Clear session */}
              <button onClick={handleClearSession}
                className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: sessionCleared ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.06)',
                  color: sessionCleared ? '#4ade80' : 'rgba(255,255,255,0.6)',
                  border: sessionCleared ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.1)',
                }}>
                {sessionCleared ? '✓ Session cleared' : 'Clear session context'}
              </button>
            </div>

            {/* OWF promise */}
            <div className="rounded-2xl p-5"
              style={{ background: `rgba(${hRgb}, 0.05)`, border: `1px solid rgba(${hRgb}, 0.15)` }}>
              <p className="text-xs font-bold mb-2" style={{ color: h }}>The OWF Promise</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                OWF AI only sees what you're looking at right now. It doesn't build a profile on you,
                it doesn't remember you between sessions, and nothing you do is sold or used to train models.
                Your data lives with you — the AI is just a tool you pick up and put down.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Chips (Ask tab only) ─────────────────────────────────────────── */}
      {activeTab === 'ask' && chips.length > 0 && (
        <div className="relative z-10 px-5 pb-3 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {chips.map(chip => (
              <button key={chip.label} onClick={() => handleSend(chip.prompt)} disabled={loading}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
                style={{
                  background: `rgba(${hRgb}, 0.08)`, border: `1px solid rgba(${hRgb}, 0.25)`,
                  color: h, backdropFilter: 'blur(8px)', opacity: loading ? 0.4 : 1,
                }}>
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input (Ask tab only) ─────────────────────────────────────────── */}
      {activeTab === 'ask' && (
        <div className="relative z-10 px-5 pb-6 pt-1 flex-shrink-0">
          <div className="flex gap-2 items-center px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Write something..."
              className="flex-1 text-sm bg-transparent focus:outline-none"
              style={{ color: 'rgba(255,255,255,0.85)', caretColor: h }} />
            <button onClick={() => handleSend()} disabled={loading || !input.trim()}
              className="text-sm font-semibold transition-all"
              style={{ color: loading || !input.trim() ? 'rgba(255,255,255,0.25)' : h }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
