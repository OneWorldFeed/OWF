"use client";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OwlSVG from "./OwlSVG";

const C = { border:"#1A2535", muted:"#3D5268", gold:"#E8B84B", sub:"#7A95AE" };

interface Props {
  convo: Conversation;
  onOwlClick: () => void;
}

export default function ThreadStreakBar({ convo, onOwlClick }: Props) {
  if (!convo.streak && !convo.broken) return null;
  const tier  = getStreakTier(convo.streak);
  const oc    = getOwlColors(tier, convo.atRisk, convo.broken);
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  if (!label) return null;

  const labelColor = convo.broken ? C.muted : convo.atRisk ? "#F59E0B" : C.gold;

  return (
    <div
      onClick={onOwlClick}
      style={{
        display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        padding:"10px 20px",
        background:`radial-gradient(ellipse at 50% 100%, ${oc.haloStrong} 0%, transparent 80%)`,
        borderBottom:`1px solid ${C.border}`,
        cursor:"pointer", transition:"background 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = `radial-gradient(ellipse at 50% 100%, ${oc.halo} 0%, transparent 80%)`)}
      onMouseLeave={e => (e.currentTarget.style.background = `radial-gradient(ellipse at 50% 100%, ${oc.haloStrong} 0%, transparent 80%)`)}
    >
      <OwlSVG size={32} tier={tier} atRisk={convo.atRisk} broken={convo.broken} pulse />
      <div>
        <span style={{ fontSize:13, fontWeight:700, color:labelColor }}>{label.short}</span>
        {convo.atRisk  && <span style={{ fontSize:11, color:"#F59E0B", marginLeft:8 }}>· Ends today</span>}
        {convo.broken  && <span style={{ fontSize:11, color:C.muted, marginLeft:8 }}>· Tap to see history</span>}
        {!convo.atRisk && !convo.broken && <span style={{ fontSize:11, color:C.muted, marginLeft:8 }}>· Tap to see details</span>}
      </div>
    </div>
  );
}
