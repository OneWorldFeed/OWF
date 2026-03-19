"use client";
import type { Conversation } from "@/types/dm";
import OwlBadge from "./OwlBadge";

const C = {
  border: "#1A2535", text: "#E2EAF2", sub: "#7A95AE",
  muted: "#3D5268", surface: "#0D1219",
};

interface Props {
  convo:    Conversation;
  active:   boolean;
  onSelect: (id: string) => void;
  onOwlClick: (id: string) => void;
}

export default function ConvoRow({ convo, active, onSelect, onOwlClick }: Props) {
  return (
    <div
      onClick={() => onSelect(convo.id)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 16px",
        background: active ? "rgba(26,101,255,0.08)" : "transparent",
        borderLeft: active ? "2px solid #1A65FF" : "2px solid transparent",
        cursor: "pointer", transition: "background 0.15s",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "linear-gradient(135deg,#1A2535,#0D1219)",
          border: `1.5px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: C.sub,
        }}>{convo.avatar}</div>
        {convo.online && (
          <div style={{
            position: "absolute", bottom: 1, right: 1,
            width: 9, height: 9, borderRadius: "50%",
            background: "#00D4AA", border: "1.5px solid #07090D",
          }}/>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {convo.name}
          </span>
          <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap", flexShrink: 0 }}>{convo.ts}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
          <span style={{
            fontSize: 12, color: C.muted,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            maxWidth: 140,
          }}>{convo.lastMsg}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <OwlBadge convo={convo} onClick={() => onOwlClick(convo.id)}/>
            {convo.unread ? (
              <div style={{
                minWidth: 18, height: 18, borderRadius: 9,
                background: "#1A65FF", color: "#fff",
                fontSize: 10, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 4px",
              }}>{convo.unread}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
