// src/lib/streak.ts
import type { StreakTier, OwlColors, StreakLabel } from "@/types/dm";

export function getStreakTier(days: number | null): StreakTier {
  if (!days || days === 0) return "none";
  if (days >= 10) return "high";
  if (days >= 4)  return "mid";
  return "low";
}

export function getOwlColors(tier: StreakTier, atRisk: boolean, broken: boolean): OwlColors {
  if (broken)  return { body:"#2A3040", eye:"#3D5268", halo:"rgba(61,82,104,0.15)",   haloStrong:"rgba(61,82,104,0.08)"   };
  if (atRisk)  return { body:"#6B5020", eye:"#E8B84B", halo:"rgba(232,184,75,0.22)",  haloStrong:"rgba(232,184,75,0.12)"  };
  switch (tier) {
    case "high": return { body:"#7C5C2A", eye:"#FFD97A", halo:"rgba(232,184,75,0.35)", haloStrong:"rgba(232,184,75,0.18)" };
    case "mid":  return { body:"#5C4420", eye:"#E8B84B", halo:"rgba(232,184,75,0.25)", haloStrong:"rgba(232,184,75,0.12)" };
    case "low":  return { body:"#3D3020", eye:"#B89040", halo:"rgba(184,144,64,0.15)", haloStrong:"rgba(184,144,64,0.07)" };
    default:     return { body:"#1E2535", eye:"#3D5268", halo:"rgba(0,0,0,0)",          haloStrong:"rgba(0,0,0,0)"          };
  }
}

export function getStreakLabel(
  days: number | null, atRisk: boolean, broken: boolean, lastStreak: number | null
): StreakLabel | null {
  if (broken)    return { short:`Ended at ${lastStreak}d`, long:`Your streak ended at ${lastStreak} days.` };
  if (!days)     return null;
  if (atRisk)    return { short:"Ends today", long:"Your streak ends today if you both don't send a message." };
  if (days>=100) return { short:`${days} days`, long:`100 days in a row. That's an archive of trust.` };
  if (days>=30)  return { short:`${days} days`, long:`30 days of daily conversation. This owl remembers.` };
  if (days>=10)  return { short:`${days} days`, long:`You've kept a ${days}-day streak. The owl's getting brighter.` };
  return           { short:`${days} days`, long:`You've been talking every day for ${days} days.` };
}
