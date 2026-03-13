"use client";
import { useState, useRef, useEffect } from "react";
import { CONVOS, MESSAGES } from "@/data/dm";
import type { Conversation, Message } from "@/types/dm";
import ConvoRow from "@/components/dm/ConvoRow";
import MessageBubble from "@/components/dm/MessageBubble";
import ThreadStreakBar from "@/components/dm/ThreadStreakBar";
import AtRiskBanner from "@/components/dm/AtRiskBanner";
import StreakSheet from "@/components/dm/StreakSheet";
import BadgeUnlockModal from "@/components/ui/BadgeUnlockModal";
import { justUnlockedCycle, type OwlCycle } from "@/lib/streak";
import { sanitizeMessageText } from "@/lib/sanitize";

const C = {
  bg: "#07090D", surface: "#0D1219", raised: "#121A24",
  border: "#1A2535", text: "#E2EAF2", sub: "#7A95AE", muted: "#3D5268",
};

export default function DMPage() {
  const [convos,      setConvos]      = useState<Conversation[]>(CONVOS);
  const [activeId,    setActiveId]    = useState<string>("c1");
  const [messages,    setMessages]    = useState<Record<string, Message[]>>(MESSAGES);
  const [input,       setInput]       = useState("");
  const [streakSheet,  setStreakSheet]  = useState<Conversation | null>(null);
  const [unlockCycle,  setUnlockCycle]  = useState<OwlCycle | null>(null);
  const [dismissed,   setDismissed]   = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = convos.find(c => c.id === activeId)!;
  const thread = messages[activeId] ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, thread.length]);

  const sendMessage = () => {
    const sanitized = sanitizeMessageText(input);
    if (!sanitized) return;
    const msg: Message = {
      id: `msg_${Date.now()}`,
      senderId: "me",
      text: sanitized,
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }));
    setConvos(prev => prev.map(c => {
      if (c.id !== activeId) return c;
      const prevStreak = c.streak ?? 0;
      const newStreak  = c.streak ?? 0; // streak is server-driven; detect crossing on update
      const newCycle   = justUnlockedCycle(prevStreak, newStreak);
      if (newCycle) setUnlockCycle(newCycle);
      return { ...c, lastMsg: msg.text, ts: "Now" };
    }));
    setInput("");
  };

  const showStreak = (id: string) => {
    const c = convos.find(cv => cv.id === id);
    if (c) setStreakSheet(c);
  };

  return (
    <div style={{
      display: "flex", height: "100vh", background: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      color: C.text, overflow: "hidden",
    }}>
      <style>{`
        @keyframes owfFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes owfSlideUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes owfOwlFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes owfOwlPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1A2535; border-radius: 2px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 300, flexShrink: 0,
        borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        background: C.surface,
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 16px 12px",
          borderBottom: `1px solid ${C.border}`,
        }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>Messages</h2>
          <div style={{ marginTop: 8, position: "relative" }}>
            <input
              placeholder="Search…"
              style={{
                width: "100%", background: C.raised,
                border: `1px solid ${C.border}`, borderRadius: 8,
                padding: "7px 12px", fontSize: 13, color: C.text,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {convos.map(convo => (
            <ConvoRow
              key={convo.id}
              convo={convo}
              active={convo.id === activeId}
              onSelect={setActiveId}
              onOwlClick={showStreak}
            />
          ))}
        </div>
      </div>

      {/* ── THREAD ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Thread header */}
        <div style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 12,
          background: C.surface,
          flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg,#1A2535,#0D1219)",
            border: `1.5px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: C.sub,
          }}>{active.avatar}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{active.name}</div>
            {active.online && (
              <div style={{ fontSize: 11, color: "#00D4AA", marginTop: 1 }}>● Active now</div>
            )}
          </div>
        </div>

        {/* Streak bar */}
        <ThreadStreakBar convo={active} onOwlClick={() => showStreak(activeId)}/>

        {/* At-risk banner */}
        {!dismissed.has(activeId) && (
          <AtRiskBanner
            convo={active}
            onDismiss={() => setDismissed(prev => new Set([...prev, activeId]))}
          />
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {thread.map(msg => (
            <MessageBubble key={msg.id} msg={msg} isMe={msg.senderId === "me"}/>
          ))}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{
          padding: "12px 16px",
          borderTop: `1px solid ${C.border}`,
          background: C.surface,
          display: "flex", gap: 10, alignItems: "flex-end",
          flexShrink: 0,
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={`Message ${active.name}…`}
            rows={1}
            style={{
              flex: 1, background: C.raised,
              border: `1px solid ${C.border}`, borderRadius: 20,
              padding: "9px 14px", fontSize: 13.5, color: C.text,
              outline: "none", resize: "none", fontFamily: "inherit",
              lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: input.trim() ? "#1A65FF" : C.raised,
              border: `1px solid ${input.trim() ? "#1A65FF" : C.border}`,
              cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.15s",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                stroke={input.trim() ? "#fff" : C.muted}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── STREAK SHEET MODAL ── */}
      {streakSheet && (
        <StreakSheet convo={streakSheet} onClose={() => setStreakSheet(null)}/>
      )}

      {/* ── BADGE UNLOCK MODAL ── */}
      {unlockCycle && (
        <BadgeUnlockModal cycle={unlockCycle} onClose={() => setUnlockCycle(null)}/>
      )}
    </div>
  );
}
