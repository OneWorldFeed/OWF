"use client";
import { getStreakLabel, cycleFromDays } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import { type OwlMood } from "./OWFOwl";
import type { OwlCycle } from "@/lib/streak";
import OwlImage from "./OwlImage";

function owlProps(c: Conversation): { cycle: OwlCycle; mood: OwlMood } {
  if (c.broken) return { cycle: "city", mood: "broken" };
  if (c.atRisk) return { cycle: cycleFromDays(c.streak ?? 0), mood: "atRisk" };
  return { cycle: cycleFromDays(c.streak ?? 0), mood: (c.streak ?? 0) > 0 ? "happy" : "calm" };
}

interface Props { convo: Conversation; onClick?: () => void; }

export default function OwlBadge({ convo, onClick }: Props) {
  if (!convo.streak && !convo.broken) return null;
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  if (!label) return null;
  const { cycle, mood } = owlProps(convo);
  const col = convo.broken ? "#3D5268" : convo.atRisk ? "#F59E0B" : "#E8B84B";
  return (
    <div
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      title={label.long}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        cursor: "pointer", padding: "2px 5px", borderRadius: 6,
        transition: "background 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <OwlImage size={28} cycle={cycle} mood={mood}
        animate={convo.atRisk} streakDays={convo.streak ?? 0}/>
      <span style={{ fontSize: 11, fontWeight: 700, color: col, whiteSpace: "nowrap" }}>
        {label.short}
      </span>
    </div>
  );
}
