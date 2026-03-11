"use client";
import { useState, useRef, useEffect } from "react";
import { CONVOS, MESSAGES } from "@/data/dm";
import type { Message } from "@/types/dm";
import ConvoRow          from "@/components/dm/ConvoRow";
import MessageBubble     from "@/components/dm/MessageBubble";
import OwlSVG            from "@/components/dm/OwlSVG";
import ThreadStreakBar    from "@/components/dm/ThreadStreakBar";
import AtRiskBanner      from "@/components/dm/AtRiskBanner";
import StreakSheet        from "@/components/dm/StreakSheet";
import BadgeUnlockCard   from "@/components/dm/BadgeUnlockCard";
import OwlMemoryTimeline from "@/components/dm/OwlMemoryTimeline";
import { getStreakTier } from "@/lib/streak";
import { CYCLE_BADGES }  from "@/data/streakBadges";

const C = {
  bg:"#07090D", surface:"#0D1219", raised:"#111827",
  border:"#1A2535", bdHigh:"#243040",
  text:"#E2EAF2", sub:"#7A95AE", muted:"#3D5268",
  horizon:"#1A6EFF", aurora:"#00D4AA", gold:"#E8B84B",
  violet:"#8B5CF6", rose:"#F43F5E", green:"#22C55E",
};

export default function MessagesPage() {
  const [activeId, setActiveId]        = useState("c1");
  const [messages, setMessages]        = useState<Record<string,Message[]>>(MESSAGES);
  const [input, setInput]              = useState("");
  const [picker, setPicker]            = useState<string|null>(null);
  const [sheetConvo, setSheetConvo]    = useState<typeof CONVOS[0]|null>(null);
  const [bannerDismissed, setBanner]   = useState<Record<string,boolean>>({});
  const [activeBadge, setActiveBadge]  = useState<typeof CYCLE_BADGES[0]|null>(null);
  const [showMemory, setShowMemory]    = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const convo = CONVOS.find(c => c.id === activeId)!;
  const msgs  = messages[activeId] || [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [activeId, messages]);

  const sendMsg = () => {
    if (!input.trim()) return;
    setMessages(m => ({
      ...m,
      [activeId]: [...(m[activeId]||[]), {
        id:`m${Date.now()}`, from:"me", text:input.trim(), time:"now", reactions:[],
      }],
    }));
    setInput("");
  };

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:C.bg, fontFamily:"'Inter', -apple-system, sans-serif", overflow:"hidden" }}>

      <style>{`
        @keyframes owfOwlPulse  { 0%,100%{filter:drop-shadow(0 0 0px rgba(232,184,75,0))} 50%{filter:drop-shadow(0 0 8px rgba(232,184,75,0.6))} }
        @keyframes owfFadeIn    { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        @keyframes owfSlideUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes owfSlideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes owfOwlFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes owfTwinkle   { 0%,100%{opacity:0.15} 50%{opacity:0.9} }
        * { box-sizing:border-box }
        button { font-family:inherit }
        ::-webkit-scrollbar { width:3px }
        ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px }
      `}</style>

      {/* ── Global Header ── */}
      <div style={{ height:54, background:C.surface, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:14, flexShrink:0 }}>
        <span style={{ fontSize:17, fontWeight:900, letterSpacing:"-0.025em", color:C.text }}>
          One<span style={{color:C.horizon}}>World</span>Feed
        </span>
        <div style={{ flex:1 }}/>
        <div style={{ fontSize:13, fontWeight:700, color:C.horizon, background:"rgba(26,110,255,0.1)", border:"1px solid rgba(26,110,255,0.25)", borderRadius:8, padding:"5px 12px" }}>
          ✉ Messages
        </div>
        {/* Quick access: badge shelf + memory */}
        <button onClick={() => setActiveBadge(CYCLE_BADGES[0])} style={{ background:"rgba(232,184,75,0.08)", border:"1px solid rgba(232,184,75,0.2)", borderRadius:8, padding:"5px 10px", color:C.gold, fontSize:12, fontWeight:700, cursor:"pointer" }}>🦉 Badges</button>
        <button onClick={() => setShowMemory(true)} style={{ background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.2)", borderRadius:8, padding:"5px 10px", color:C.violet, fontSize:12, fontWeight:700, cursor:"pointer" }}>📜 Memory</button>
        <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.horizon},${C.aurora})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:"#fff" }}>J</div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ── LEFT: Conversation list ── */}
        <div style={{ width:296, flexShrink:0, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"16px 12px 10px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:17, fontWeight:800, color:C.text }}>Messages</span>
              <button style={{ background:"none", border:"none", color:C.muted, fontSize:20, cursor:"pointer" }}>⋯</button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:C.raised, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 12px" }}>
              <span style={{ color:C.muted, fontSize:13 }}>◎</span>
              <span style={{ fontSize:13, color:C.muted }}>Search conversations</span>
            </div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"0 6px" }}>
            {CONVOS.map(c => (
              <ConvoRow key={c.id} convo={c} active={activeId===c.id}
                onClick={() => setActiveId(c.id)}
                onOwlClick={() => setSheetConvo(c)}
              />
            ))}
          </div>

          {/* Storyboard footer */}
          <div style={{ padding:"10px 12px 14px", borderTop:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 8px", cursor:"pointer", borderRadius:10, transition:"background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.raised)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{fontSize:14}}>🎬</span>
              <span style={{fontSize:13,fontWeight:600,color:C.sub}}>Storyboard</span>
              <span style={{fontSize:11,color:C.muted,marginLeft:"auto"}}>3 Shows · Now</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Thread view ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Thread header */}
          <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0, background:C.surface }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${C.violet},${C.horizon})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{convo?.emoji}</div>
              {convo?.online && <div style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%", background:C.green, border:`2px solid ${C.surface}` }}/>}
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:C.text }}>{convo?.name}</div>
              <div style={{ fontSize:11, color:convo?.online?C.aurora:C.muted }}>
                {convo?.online ? "● Active now" : "Last seen recently"}
              </div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
              {["📞","📹","⋯"].map((ic,i) => (
                <button key={i} style={{ background:C.raised, border:`1px solid ${C.border}`, borderRadius:8, width:34, height:34, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", color:C.sub, transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=C.bdHigh; e.currentTarget.style.color=C.text; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.sub; }}
                >{ic}</button>
              ))}
            </div>
          </div>

          {/* Streak bar */}
          <ThreadStreakBar convo={convo} onOwlClick={() => setSheetConvo(convo)} />

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"16px 18px 8px" }} onClick={() => setPicker(null)}>
            {msgs.map(msg => (
              <MessageBubble key={msg.id} msg={msg} pickerOpen={picker} setPicker={setPicker} />
            ))}
            {convo?.atRisk && !bannerDismissed[activeId] && (
              <AtRiskBanner convo={convo} onDismiss={() => setBanner(b => ({...b,[activeId]:true}))} />
            )}
            <div ref={endRef}/>
          </div>

          {/* Quick reactions strip */}
          <div style={{ padding:"8px 18px 0", display:"flex", gap:7, alignItems:"center", flexShrink:0 }}>
            {[{e:"💜",l:"Warm"},{e:"🔥",l:"Glow"},{e:"🌍",l:"World"}].map(r => (
              <button key={r.l} style={{ background:C.raised, border:`1px solid ${C.border}`, borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:600, color:C.sub, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.violet+"50"; e.currentTarget.style.color=C.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.sub; }}
              >{r.e} {r.l}</button>
            ))}
            {convo?.streak && convo.streak >= 10 && (
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, opacity:0.7 }}>
                <OwlSVG size={18} tier={getStreakTier(convo.streak)} />
                <span style={{ fontSize:10, color:C.gold }}>{convo.streak}d</span>
              </div>
            )}
          </div>

          {/* Voice Note bar */}
          <div style={{ padding:"10px 18px 0", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:C.raised, border:`1px solid ${C.border}`, borderRadius:12, padding:"9px 14px", cursor:"pointer" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.violet+"50")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.violet},${C.rose})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>✦</div>
              <span style={{ fontSize:13, fontWeight:700, color:C.gold }}>Voice Note</span>
              <span style={{ fontSize:13, color:C.muted }}>· Tap to record</span>
              <span style={{ marginLeft:"auto", fontSize:11, color:C.muted }}>0:00</span>
            </div>
          </div>

          {/* OWF AI Glow line */}
          <div style={{ padding:"6px 18px 0", flexShrink:0 }}>
            <p style={{ margin:0, fontSize:11, color:C.muted, textAlign:"center" }}>
              ✦ <span style={{color:C.gold,fontWeight:600}}>Glow</span> powered by <span style={{color:C.violet,fontWeight:600}}>OWF AI</span>
            </p>
          </div>

          {/* Input bar */}
          <div style={{ padding:"10px 18px 18px", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, background:C.raised, border:`1px solid ${C.border}`, borderRadius:14, padding:"9px 12px" }}>
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:19, color:C.muted }}>＋</button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                placeholder="Message…"
                style={{ flex:1, background:"none", border:"none", outline:"none", color:C.text, fontSize:14, fontFamily:"inherit" }}
              />
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.muted }}>🎙</button>
              <button onClick={sendMsg} style={{
                width:32, height:32, borderRadius:"50%", border:"none",
                background:input.trim() ? C.horizon : C.border,
                cursor:input.trim() ? "pointer" : "default",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, color:"#fff", flexShrink:0, transition:"background 0.15s",
              }}>↑</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {sheetConvo  && <StreakSheet convo={sheetConvo} onClose={() => setSheetConvo(null)} />}
      {activeBadge && <BadgeUnlockCard badge={activeBadge} onClose={() => setActiveBadge(null)} />}
      {showMemory  && <OwlMemoryTimeline onClose={() => setShowMemory(false)} />}
    </div>
  );
}
