"use client";
import type { Conversation } from "@/types/dm";
import OwlBadge from "./OwlBadge";

const C = { bg:"#07090D", raised:"#111827", border:"#1A2535", text:"#E2EAF2", muted:"#3D5268", horizon:"#1A6EFF", violet:"#8B5CF6", green:"#22C55E" };

interface Props {
  convo: Conversation;
  active: boolean;
  onClick: () => void;
  onOwlClick: () => void;
}

export default function ConvoRow({ convo: c, active, onClick, onOwlClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        display:"flex", alignItems:"center", gap:10,
        padding:"10px 12px", cursor:"pointer", borderRadius:12,
        background: active ? "rgba(26,110,255,0.09)" : "transparent",
        border: active ? "1px solid rgba(26,110,255,0.22)" : "1px solid transparent",
        transition:"all 0.15s", marginBottom:2,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.raised; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {/* Avatar */}
      <div style={{ position:"relative", flexShrink:0 }}>
        <div style={{
          width:44, height:44, borderRadius:"50%",
          background:`linear-gradient(135deg,${C.violet},${C.horizon})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:21, border:`2px solid ${active ? C.horizon+"50" : C.border}`,
        }}>{c.emoji}</div>
        {c.online && <div style={{ position:"absolute", bottom:1, right:1, width:11, height:11, borderRadius:"50%", background:C.green, border:`2px solid ${C.bg}` }}/>}
      </div>

      {/* Text */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
          <span style={{ fontSize:13.5, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:140 }}>{c.name}</span>
          <span style={{ fontSize:10, color:C.muted, flexShrink:0, marginLeft:6 }}>{c.time}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>
          <span style={{ fontSize:12, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{c.last}</span>
          <OwlBadge convo={c} onClick={onOwlClick} />
        </div>
      </div>

      {c.unread > 0 && (
        <div style={{ width:20, height:20, borderRadius:"50%", background:C.horizon, color:"#fff", fontSize:11, fontWeight:700, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", marginLeft:4 }}>
          {c.unread}
        </div>
      )}
    </div>
  );
}
