"use client";
import { useState } from "react";
import type { Message } from "@/types/dm";

const REACTIONS = ["❤️","😂","🔥","👏","😮","😢"];

interface Props { msg: Message; isMe: boolean; }

export default function MessageBubble({ msg, isMe }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [reactions,  setReactions]  = useState<string[]>(msg.reactions ?? []);

  const addReaction = (emoji: string) => {
    setReactions(r => r.includes(emoji) ? r.filter(e => e !== emoji) : [...r, emoji]);
    setShowPicker(false);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: isMe ? "row-reverse" : "row",
      gap: 6, marginBottom: 8, position: "relative",
      alignItems: "flex-end",
    }}>
      <div style={{ position: "relative" }}>
        {/* Bubble */}
        <div
          onClick={() => setShowPicker(s => !s)}
          style={{
            maxWidth: 260, padding: "9px 13px",
            borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isMe
              ? "linear-gradient(135deg,#1A65FF,#1040C0)"
              : "#0D1219",
            border: isMe ? "none" : "1px solid #1A2535",
            fontSize: 13.5, color: "#E2EAF2", lineHeight: 1.55,
            cursor: "pointer",
            boxShadow: isMe ? "0 2px 12px rgba(26,101,255,0.25)" : "none",
          }}
        >
          {msg.text}
        </div>

        {/* Reactions */}
        {reactions.length > 0 && (
          <div style={{
            marginTop: 3, display: "flex", gap: 4,
            justifyContent: isMe ? "flex-end" : "flex-start",
          }}>
            {reactions.map((r, i) => (
              <span key={i} style={{ fontSize: 14, cursor: "pointer" }}
                onClick={() => addReaction(r)}>{r}</span>
            ))}
          </div>
        )}

        {/* Reaction picker */}
        {showPicker && (
          <div style={{
            position: "absolute", bottom: "110%",
            [isMe ? "right" : "left"]: 0,
            background: "#0D1219", border: "1px solid #1A2535",
            borderRadius: 24, padding: "6px 10px",
            display: "flex", gap: 6, zIndex: 100,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            animation: "owfFadeIn 0.15s ease",
          }}>
            {REACTIONS.map(e => (
              <span key={e} style={{ fontSize: 18, cursor: "pointer", padding: "2px 1px" }}
                onClick={() => addReaction(e)}>{e}</span>
            ))}
          </div>
        )}
      </div>

      <span style={{ fontSize: 10, color: "#3D5268", paddingBottom: 2, whiteSpace: "nowrap" }}>
        {msg.ts}
      </span>
    </div>
  );
}
