'use client';
import { useState, useRef, useEffect } from 'react';
import { escalatingCall } from '@/lib/ai/escalation';
import { rulesEngineCall, getMoodOfTheDay } from '@/lib/ai/rules-engine';
import { getFeedContext, formatContextForRules } from '@/lib/ai/feed-context';
import type { CopilotMessage } from '@/lib/ai/copilot';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

/* ── QUICK REPLY CHIPS ───────────────────────────────────── */
const INITIAL_CHIPS = [
  { label: '🌍 Global mood today',      prompt: 'What is the mood of the world today?' },
  { label: '🏙 Recommend a city',        prompt: 'Based on today\'s feed activity, recommend one city I should explore.' },
  { label: '✍️ What should I post?',     prompt: 'What should I post today?' },
  { label: '🕐 World times',             prompt: 'What time is it right now around the world?' },
  { label: '📋 Feed summary',            prompt: 'What is happening in the feed right now?' },
  { label: '🔖 Suggest +tags',           prompt: 'Suggest some +tags I could use today.' },
];

/* Contextual follow-up chips based on last topic */
function getFollowUpChips(lastText: string): { label: string; prompt: string }[] {
  const lower = lastText.toLowerCase();
  if (/city|explore|lagos|tokyo|cairo|berlin|seoul|london/.test(lower)) {
    return [
      { label: '🕐 Time there?',         prompt: 'What time is it there right now?' },
      { label: '🌤 Tell me more',         prompt: 'Tell me more about this city.' },
      { label: '✍️ Post idea for there',  prompt: 'Give me a post idea for that city.' },
    ];
  }
  if (/mood|electric|hopeful|ambient|feel|energy/.test(lower)) {
    return [
      { label: '🔖 Tags for this mood',   prompt: 'What +tags work best for this mood?' },
      { label: '✍️ Post idea',            prompt: 'Give me a post idea that fits this mood.' },
      { label: '🏙 City to match?',       prompt: 'Which city best matches this mood right now?' },
    ];
  }
  if (/post|caption|idea|write|share/.test(lower)) {
    return [
      { label: '🔖 +Tags for it',         prompt: 'What +tags should I use for that post?' },
      { label: '✍️ Another idea',         prompt: 'Give me another post idea.' },
      { label: '🌍 Mood for it',          prompt: 'What mood fits that post best?' },
    ];
  }
  if (/tag|\+/.test(lower)) {
    return [
      { label: '✍️ Post idea',            prompt: 'Give me a post idea using those tags.' },
      { label: '🏙 City to match?',       prompt: 'Which city do those tags connect to most?' },
    ];
  }
  // Default follow-ups
  return [
    { label: '🏙 Recommend a city',      prompt: 'Recommend a city I should explore today.' },
    { label: '✍️ What should I post?',   prompt: 'What should I post today?' },
    { label: '🌍 World mood',            prompt: 'What is the mood of the world today?' },
  ];
}

/* ── TYPING PHRASES ──────────────────────────────────────── */
const TYPING_PHRASES = [
  'Reading the feed...',
  'Tuning in...',
  'Listening to the world...',
  'Checking the cities...',
  'Sensing the mood...',
  'Scanning the globe...',
];

/* ── AMBIENT MESSAGES ────────────────────────────────────── */
const AMBIENT_MESSAGES = [
  'Voices from every timezone are active right now.\nWhat would you like to explore?',
  'Global moments are unfolding as we speak.\nAsk me anything.',
  'The feed is alive with stories from every city.\nI\'m here to help you navigate it.',
  'The world is in motion today.\nWhat would you like to know?',
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const [typingPhrase, setTypingPhrase] = useState(TYPING_PHRASES[0]);
  const [chips, setChips] = useState(INITIAL_CHIPS);
  const [ambientIdx] = useState(() => Math.floor(Math.random() * AMBIENT_MESSAGES.length));
  const [feedContext, setFeedContext] = useState<{ city?: string; feedCities?: string[] }>({});
  const [contextLoaded, setContextLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load Firestore feed context on mount
  useEffect(() => {
    getFeedContext().then(ctx => {
      setFeedContext(formatContextForRules(ctx));
      setContextLoaded(true);
    });
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Aurora glow pulse
  useEffect(() => {
    const id = setInterval(() => setGlowPulse(p => !p), 3000);
    return () => clearInterval(id);
  }, []);

  // Rotate typing phrase while loading
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
    setChips([]); // hide chips while loading

    const history: CopilotMessage[] = messages.map(m => ({ role: m.role, content: m.text }));

    try {
      const response = await escalatingCall('ai_page', msg, history);
      const replyText = response.text;
      setMessages([...newMessages, { role: 'assistant', text: replyText }]);
      // Show contextual follow-up chips
      setChips(getFollowUpChips(replyText));
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

  function handleReset() {
    setMessages([]);
    setChips(INITIAL_CHIPS);
  }

  const showIntro = messages.length === 0;
  const daily = getMoodOfTheDay();

  return (
    <div
      className="fixed inset-0 flex flex-col lg:relative lg:inset-auto lg:h-screen"
      style={{ backgroundColor: '#060E1A' }}
    >
      {/* ── AURORA BACKGROUND ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #060E1A 0%, #071520 40%, #0A2535 60%, #060E1A 100%)' }} />
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-[3000ms]"
          style={{
            bottom: showIntro ? '30%' : '20%',
            width: '140%', height: '320px',
            background: 'radial-gradient(ellipse at center, rgba(0,210,180,0.18) 0%, rgba(0,160,200,0.10) 40%, transparent 70%)',
            filter: 'blur(40px)',
            transform: `translateX(-50%) scaleY(${glowPulse ? 1.08 : 1})`,
            opacity: glowPulse ? 0.9 : 0.7,
          }}
        />
        <div
          className="absolute left-0 right-0 transition-all duration-[3000ms]"
          style={{
            bottom: showIntro ? '32%' : '22%',
            height: '1px',
            background: `linear-gradient(90deg, transparent 0%, rgba(0,220,190,${glowPulse ? '0.8' : '0.4'}) 20%, rgba(0,240,210,${glowPulse ? '1' : '0.7'}) 50%, rgba(0,220,190,${glowPulse ? '0.8' : '0.4'}) 80%, transparent 100%)`,
            boxShadow: `0 0 ${glowPulse ? '20px' : '10px'} rgba(0,220,190,0.5)`,
          }}
        />
        <div className="absolute left-1/4 rounded-full transition-all duration-[3000ms]"
          style={{ bottom: showIntro ? '32%' : '22%', width: '6px', height: '6px', backgroundColor: 'rgba(0,240,210,0.9)', boxShadow: '0 0 12px 4px rgba(0,240,210,0.4)', transform: 'translateY(50%)' }} />
        <div className="absolute left-3/4 rounded-full transition-all duration-[3000ms]"
          style={{ bottom: showIntro ? '32%' : '22%', width: '4px', height: '4px', backgroundColor: 'rgba(0,220,190,0.7)', boxShadow: '0 0 8px 3px rgba(0,220,190,0.3)', transform: 'translateY(50%)' }} />
      </div>

      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-5 pb-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,180,160,0.2)', border: '1px solid rgba(0,220,190,0.3)' }}>
          <span style={{ color: 'rgba(0,220,190,1)', fontSize: '1.1rem' }}>◈</span>
        </div>
        <div>
          <span className="font-bold text-base" style={{ color: '#fff' }}>OWF AI</span>
          <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(0,220,190,0.12)', color: 'rgba(0,220,190,0.8)', border: '1px solid rgba(0,220,190,0.2)' }}>
            AI PAGE LENS
          </span>
        </div>
        {messages.length > 0 && (
          <button onClick={handleReset}
            className="ml-auto text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
            style={{ color: 'rgba(0,220,190,0.8)', backgroundColor: 'rgba(0,220,190,0.08)', border: '1px solid rgba(0,220,190,0.2)' }}>
            ↺ New
          </button>
        )}
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5">

        {/* Intro state */}
        {showIntro && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-xs font-semibold mb-2 tracking-widest uppercase"
              style={{ color: 'rgba(0,220,190,0.6)' }}>
              Today feels {daily.mood}
            </p>
            <h1 className="text-3xl font-bold mb-8 leading-tight" style={{ color: '#fff' }}>
              What would you<br />like to explore?
            </h1>
          </div>
        )}

        {/* Chat messages */}
        {messages.length > 0 && (
          <div className="space-y-4 py-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mr-2 flex-shrink-0 self-end"
                    style={{ backgroundColor: 'rgba(0,180,160,0.2)', border: '1px solid rgba(0,220,190,0.3)' }}>
                    <span style={{ color: 'rgba(0,220,190,1)', fontSize: '0.8rem' }}>◈</span>
                  </div>
                )}
                <div className="max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
                  style={{
                    backgroundColor: msg.role === 'user' ? 'rgba(255,255,255,0.08)' : 'rgba(0,180,160,0.08)',
                    color: msg.role === 'user' ? 'rgba(255,255,255,0.9)' : 'rgba(220,255,250,0.95)',
                    border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,220,190,0.2)',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(0,180,160,0.2)', border: '1px solid rgba(0,220,190,0.3)' }}>
                  <span style={{ color: 'rgba(0,220,190,1)', fontSize: '0.8rem' }}>◈</span>
                </div>
                <div className="px-4 py-3 rounded-2xl text-sm"
                  style={{ backgroundColor: 'rgba(0,180,160,0.08)', border: '1px solid rgba(0,220,190,0.2)', color: 'rgba(0,220,190,0.7)' }}>
                  <span className="animate-pulse">{typingPhrase}</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── AMBIENT MESSAGE (intro only) ──────────────────── */}
      {showIntro && (
        <div className="relative z-10 mx-5 mb-3 flex-shrink-0">
          <div className="px-5 py-4 rounded-2xl text-sm leading-relaxed"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', whiteSpace: 'pre-line' }}>
            {AMBIENT_MESSAGES[ambientIdx]}
          </div>
        </div>
      )}

      {/* ── QUICK REPLY CHIPS ─────────────────────────────── */}
      {chips.length > 0 && (
        <div className="relative z-10 px-5 pb-3 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {chips.map(chip => (
              <button
                key={chip.label}
                onClick={() => handleSend(chip.prompt)}
                disabled={loading}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: 'rgba(0,220,190,0.08)',
                  border: '1px solid rgba(0,220,190,0.25)',
                  color: 'rgba(0,220,190,0.9)',
                  backdropFilter: 'blur(8px)',
                  opacity: loading ? 0.4 : 1,
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── INPUT BAR ─────────────────────────────────────── */}
      <div className="relative z-10 px-5 pb-6 pt-1 flex-shrink-0">
        <div className="flex gap-2 items-center px-4 py-3 rounded-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Write something..."
            className="flex-1 text-sm bg-transparent focus:outline-none"
            style={{ color: 'rgba(255,255,255,0.85)', caretColor: 'rgba(0,220,190,1)' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="text-sm font-semibold transition-all"
            style={{ color: loading || !input.trim() ? 'rgba(255,255,255,0.25)' : 'rgba(0,220,190,1)' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
