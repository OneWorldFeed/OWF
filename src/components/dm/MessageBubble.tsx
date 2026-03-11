"use client";
import { useState } from "react";
import type { Message } from "@/types/dm";

const C = { raised:"#111827", border:"#1A2535", text:"#E2EAF2", muted:"#3D5268", sub:"#7A95AE", violet:"#8B5CF6" };
const QUICK_REACTIONS = ["💜","🔥","🌟","🌍","😂","👏"];

interface Props {
  msg: Message;
  pickerOpen: string | null;
  setPicker: (id: string | null) => void;
}

export default function MessageBubble({ msg, pickerOpen, setPicker }: Props) {
  const isMe = msg.from === "me";
  const [reactions, setReactions] = useState(msg.reactions);
  const [hov, setHov] = useState(false);

  const addReaction = (emoji: string) => {
    setReactions(r => {
      const ex = r.find(x => x.emoji === emoji);
      if (ex) return r.map(x => x.emoji===emoji ? {...x, count:x.count+1, mine:true} : x);
      return [...r, { emoji, count:1, mine:true }];
    });
    setPicker(null);
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display:"flex", flexDirection:"column", alignItems:isMe?"flex-end":"flex-start", marginBottom:14, position:"relative" }}
    >
      <div style={{ position:"relative" }}>
        {hov && (
          <button
            onClick={() => setPicker(pickerOpen===msg.id ? null : msg.id)}
            style={{
              position:"absolute", top:-10, [isMe?"left":"right"]:-34,
              background:C.raised, border:`1px solid ${C.border}`,
              borderRadius:"50%", width:26, height:26, cursor:"pointer",
              fontSize:13, color:C.muted, display:"flex", alignItems:"center",
              justifyContent:"center", zIndex:5, fontFamily:"inherit",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=C.violet+"60"; e.currentTarget.style.color=C.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.muted; }}
          >☺</button>
        )}

        {pickerOpen===msg.id && (
          <div style={{
            position:"absolute", top:-46, [isMe?"right":"left"]:0,
            background:"#0D1219", border:`1px solid ${C.border}`,
            borderRadius:28, padding:"6px 10px",
            display:"flex", gap:4, zIndex:20,
            boxShadow:"0 8px 24px rgba(0,0,0,0.5)",
            animation:"owfFadeIn 0.15s ease",
          }}>
            {QUICK_REACTIONS.map(e => (
              <button key={e} onClick={() => addReaction(e)}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, padding:"2px 3px", borderRadius:6, fontFamily:"inherit" }}
                onMouseEnter={el => el.currentTarget.style.transform="scale(1.35)"}
                onMouseLeave={el => el.currentTarget.style.transform="scale(1)"}
              >{e}</button>
            ))}
          </div>
        )}

        <div style={{
          maxWidth:300, padding:"10px 14px",
          background: isMe ? "linear-gradient(135deg,rgba(26,110,255,0.2),rgba(26,110,255,0.1))" : C.raised,
          border:`1px solid ${isMe?"rgba(26,110,255,0.3)":C.border}`,
          borderRadius: isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",
          color:C.text, fontSize:14, lineHeight:1.55,
        }}>{msg.text}</div>
        <div style={{ fontSize:10, color:C.muted, marginTop:3, textAlign:isMe?"right":"left" }}>{msg.time}</div>
      </div>

      {reactions.length > 0 && (
        <div style={{ display:"flex", gap:5, marginTop:5 }}>
          {reactions.map(r => (
            <button key={r.emoji} onClick={() => addReaction(r.emoji)} style={{
              background:r.mine?"rgba(139,92,246,0.12)":C.raised,
              border:`1px solid ${r.mine?C.violet+"40":C.border}`,
              borderRadius:20, padding:"2px 8px", fontSize:13, cursor:"pointer",
              display:"flex", alignItems:"center", gap:4,
              color:r.mine?C.violet:C.sub, fontWeight:r.mine?700:500, fontFamily:"inherit",
            }}>{r.emoji} <span style={{fontSize:11}}>{r.count}</span></button>
          ))}
        </div>
      )}
    </div>
  );
}
