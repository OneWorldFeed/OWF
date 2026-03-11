"use client";
import { getStreakTier } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OwlSVG from "./OwlSVG";

interface Props {
  convo: Conversation;
  onDismiss: () => void;
}

export default function AtRiskBanner({ convo, onDismiss }: Props) {
  if (!convo.atRisk) return null;
  return (
    <div style={{
      margin:"0 16px 12px",
      background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)",
      borderRadius:10, padding:"9px 14px",
      display:"flex", alignItems:"center", gap:10,
      animation:"owfFadeIn 0.3s ease",
    }}>
      <OwlSVG size={24} tier={getStreakTier(convo.streak)} atRisk broken={false} pulse />
      <span style={{ fontSize:12.5, color:"#F59E0B", flex:1, lineHeight:1.5 }}>
        Your streak ends today if you both don't send a message.
      </span>
      <button onClick={onDismiss} style={{ background:"none", border:"none", color:"#3D5268", cursor:"pointer", fontSize:16, padding:2, fontFamily:"inherit" }}>×</button>
    </div>
  );
}
