'use client';
import { useState, useRef, useEffect } from 'react';
import { escalatingCall } from '@/lib/ai/escalation';
import type { CopilotMessage } from '@/lib/ai/copilot';

const QUICK_ACTIONS = [
  { label: 'Global Moments Today',  prompt: 'What are the most significant global moments happening on OneWorldFeed right now? Be vivid and specific.' },
  { label: 'Your Ritual Pattern',   prompt: 'Based on the feed, describe the daily rituals and patterns of life across different cities today. What rhythms emerge?' },
  { label: 'Quiet Reflection',      prompt: 'Find the quieter, more contemplative moments people are sharing on OneWorldFeed. What stillness exists amid the noise?' },
  { label: 'Explore a New City',    prompt: 'Based on today\'s feed activity, recommend one city I should explore and tell me what makes it feel alive right now.' },
];

const AMBIENT_MESSAGES = [
  'The world is moving with a rising energy today.\nHere\'s something unfolding across cities.',
  'Voices from 6 continents are active right now.\nWhat would you like to explore?',
  'Global moments are being captured as we speak.\nAsk me anything.',
  'The feed is alive with stories from every timezone.\nI\'m here to help you navigate it.',
];

interface Message { role: 'user' | 'assistant'; text: string; }

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const [ambientIdx] = useState(() => Math.floor(Math.random() * AMBIENT_MESSAGES.length));
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => {
    const id = setInterval(() => setGlowPulse(p => !p), 3000);
    return () => clearInterval(id);
  }, []);

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: msg }];
    setMessages(newMessages);
    setLoading(true);
    const history: CopilotMessage[] = messages.map(m => ({ role: m.role, content: m.text }));
    const response = await escalatingCall('ai_page', msg, history);
    setMessages([...newMessages, { role: 'assistant', text: response.text }]);
    setLoading(false);
  }

  const showIntro = messages.length === 0;

  return (
    <div className="fixed inset-0 flex flex-col lg:relative lg:inset-auto lg:h-screen"
      style={{ backgroundColor: '#060E1A' }}>

      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #060E1A 0%, #071520 40%, #0A2535 60%, #060E1A 100%)' }} />
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-[3000ms]"
          style={{ bottom: showIntro ? '30%' : '20%', width: '140%', height: '320px', background: 'radial-gradient(ellipse at center, rgba(0,210,180,0.18) 0%, rgba(0,160,200,0.10) 40%, transparent 70%)', filter: 'blur(40px)', transform: `translateX(-50%) scaleY(${glowPulse ? 1.08 : 1})`, opacity: glowPulse ? 0.9 : 0.7 }} />
        <div className="absolute left-0 right-0 transition-all duration-[3000ms]"
          style={{ bottom: showIntro ? '32%' : '22%', height: '1px', background: `linear-gradient(90deg, transparent 0%, rgba(0,220,190,${glowPulse ? '0.8' : '0.4'}) 20%, rgba(0,240,210,${glowPulse ? '1' : '0.7'}) 50%, rgba(0,220,190,${glowPulse ? '0.8' : '0.4'}) 80%, transparent 100%)`, boxShadow: `0 0 ${glowPulse ? '20px' : '10px'} rgba(0,220,190,0.5)` }} />
        <div className="absolute left-1/4 rounded-full transition-all duration-[3000ms]"
          style={{ bottom: showIntro ? '32%' : '22%', width: '6px', height: '6px', backgroundColor: 'rgba(0,240,210,0.9)', boxShadow: '0 0 12px 4px rgba(0,240,210,0.4)', transform: 'translateY(50%)' }} />
        <div className="absolute left-3/4 rounded-full transition-all duration-[3000ms]"
          style={{ bottom: showIntro ? '32%' : '22%', width: '4px', height: '4px', backgroundColor: 'rgba(0,220,190,0.7)', boxShadow: '0 0 8px 3px rgba(0,220,190,0.3)', transform: 'translateY(50%)' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-5 pb-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,180,160,0.2)', border: '1px solid rgba(0,220,190,0.3)' }}>
          <span style={{ color: 'rgba(0,220,190,1)', fontSize: '1.1rem' }}>◈</span>
        </div>
        <div>
          <span className="font-bold text-base" style={{ color: '#fff' }}>OWF AI</span>
          <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,220,190,0.12)', color: 'rgba(0,220,190,0.8)', border: '1px solid rgba(0,220,190,0.2)' }}>AI PAGE LENS</span>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="ml-auto text-xs px-3 py-1.5 rounded-full"
            style={{ color: 'rgba(0,220,190,0.8)', backgroundColor: 'rgba(0,220,190,0.08)', border: '1px solid rgba(0,220,190,0.2)' }}>
            ↺ New
          </button>
        )}
      </div>

      {/* Main area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5">
        {showIntro && (
          <div className="flex flex-col items-center justify-center min-h-[55vh] text-center">
            <h1 className="text-3xl font-bold mb-8 leading-tight" style={{ color: '#fff' }}>
              What would you<br />like to explore?
            </h1>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_ACTIONS.map(a => (
                <button key={a.label} onClick={() => handleSend(a.prompt)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}

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
                <div className="max-w-[80%] px-4 py-3 text-sm leading-relaxed"
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
            {loading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(0,180,160,0.2)', border: '1px solid rgba(0,220,190,0.3)' }}>
                  <span style={{ color: 'rgba(0,220,190,1)', fontSize: '0.8rem' }}>◈</span>
                </div>
                <div className="px-4 py-3 rounded-2xl text-sm"
                  style={{ backgroundColor: 'rgba(0,180,160,0.08)', border: '1px solid rgba(0,220,190,0.2)', color: 'rgba(0,220,190,0.7)' }}>
                  <span className="animate-pulse">thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Ambient message */}
      {showIntro && (
        <div className="relative z-10 mx-5 mb-4 flex-shrink-0">
          <div className="px-5 py-4 rounded-2xl text-sm leading-relaxed"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', whiteSpace: 'pre-line' }}>
            {AMBIENT_MESSAGES[ambientIdx]}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 px-5 pb-6 pt-2 flex-shrink-0">
        <div className="flex gap-2 items-center px-4 py-3 rounded-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <input type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Write something..."
            className="flex-1 text-sm bg-transparent focus:outline-none"
            style={{ color: 'rgba(255,255,255,0.85)', caretColor: 'rgba(0,220,190,1)' }} />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()}
            className="text-sm font-semibold transition-all"
            style={{ color: loading || !input.trim() ? 'rgba(255,255,255,0.25)' : 'rgba(0,220,190,1)' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
