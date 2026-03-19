"use client";
import { getOwlColors } from "@/lib/streak";
import type { StreakTier } from "@/lib/streak";

interface Props {
  size?: number;
  tier: StreakTier;
  atRisk?: boolean;
  broken?: boolean;
  pulse?: boolean;
}

export default function OwlSVG({ size = 48, tier, atRisk = false, broken = false, pulse = false }: Props) {
  const oc = getOwlColors(tier, atRisk, broken);
  const eyeGlow = !broken && tier !== "none";

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none"
      style={{ animation: atRisk && pulse ? "owfOwlPulse 2s ease-in-out infinite" : "none", display: "block", flexShrink: 0 }}>
      {/* Halo */}
      <circle cx="24" cy="26" r="22" fill={oc.halo} />
      <circle cx="24" cy="26" r="16" fill={oc.haloStrong} />
      {/* Body */}
      <ellipse cx="24" cy="30" rx="13" ry="11" fill={oc.body} />
      {/* Wings */}
      <ellipse cx="13" cy="31" rx="5" ry="7" fill={oc.body} style={{ filter:"brightness(0.8)" }} transform="rotate(-12 13 31)" />
      <ellipse cx="35" cy="31" rx="5" ry="7" fill={oc.body} style={{ filter:"brightness(0.8)" }} transform="rotate(12 35 31)" />
      {/* Head */}
      <circle cx="24" cy="20" r="11" fill={oc.body} />
      {/* Ear tufts */}
      <polygon points="17,11 14,6 20,10" fill={oc.body} />
      <polygon points="31,11 34,6 28,10" fill={oc.body} />
      {/* Eye whites */}
      <circle cx="19.5" cy="20" r="5" fill={broken ? "#1A2535" : "#F5F0E8"} />
      <circle cx="28.5" cy="20" r="5" fill={broken ? "#1A2535" : "#F5F0E8"} />
      {/* Pupils */}
      <circle cx="20" cy="20.5" r="3" fill={oc.eye} />
      <circle cx="29" cy="20.5" r="3" fill={oc.eye} />
      {/* Eye shine */}
      {eyeGlow && <>
        <circle cx="21" cy="19.5" r="1" fill="rgba(255,255,255,0.8)" />
        <circle cx="30" cy="19.5" r="1" fill="rgba(255,255,255,0.8)" />
      </>}
      {/* Beak */}
      <polygon points="24,23 21.5,26 26.5,26" fill={broken ? "#2A3040" : "#D4913A"} />
      {/* Belly */}
      {!broken && <ellipse cx="24" cy="33" rx="6" ry="5" fill="rgba(255,255,255,0.06)" />}
      {/* Cracks */}
      {broken && <>
        <line x1="22" y1="16" x2="20" y2="22" stroke="#3D5268" strokeWidth="0.8" strokeDasharray="1.5,1" />
        <line x1="26" y1="15" x2="28" y2="21" stroke="#3D5268" strokeWidth="0.8" strokeDasharray="1.5,1" />
      </>}
      {/* Milestone star */}
      {tier === "high" && !broken && !atRisk && (
        <text x="36" y="10" fontSize="9" textAnchor="middle" fill="#E8B84B">★</text>
      )}
      {/* Perch */}
      <rect x="15" y="40" width="18" height="2" rx="1" fill={oc.body} style={{ filter:"brightness(0.7)" }} />
    </svg>
  );
}
