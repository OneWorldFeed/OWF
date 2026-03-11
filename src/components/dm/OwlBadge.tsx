"use client";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OwlSVG from "./OwlSVG";

interface Props {
  convo: Conversation;
  onClick?: () => void;
}

export default function OwlBadge({ convo, onClick }: Props) {
  if (!convo.streak && !convo.broken) return null;
  const tier  = getStreakTier(convo.streak);
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  if (!label) return null;

  const labelColor = convo.broken ? "#3D5268" : convo.atRisk ? "#F59E0B" : "#E8B84B";

  return (
    <div
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      title={label.long}
      style={{ display:"flex", alignItems:"center", gap:4, cursor:"pointer", padding:"2px 4px", borderRadius:6, transition:"background 0.15s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <OwlSVG size={22} tier={tier} atRisk={convo.atRisk} broken={convo.broken} pulse />
      <span style={{ fontSize:11, fontWeight:700, color:labelColor, whiteSpace:"nowrap" }}>
        {label.short}
      </span>
    </div>
  );
}
