#!/usr/bin/env bash
# ============================================================
#  OWF — DM System Installer
#  Run from your project root:  bash install-dm.sh
#  Use --force to overwrite existing files
# ============================================================
set -e
FORCE=false
[[ "$1" == "--force" ]] && FORCE=true

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✔ WROTE${NC}   $1"; }
skip() { echo -e "${YELLOW}⟳ SKIP${NC}    $1 (exists — use --force)"; }
info() { echo -e "${CYAN}▸${NC} $1"; }

write_file() {
  local path="$1"; local content="$2"
  mkdir -p "$(dirname "$path")"
  if [[ -f "$path" && "$FORCE" == false ]]; then skip "$path"; return; fi
  printf '%s' "$content" > "$path"; ok "$path"
}

echo ""
info "OWF DM System — installing files..."
echo ""

# ─────────────────────────────────────────────────────────────
# 1. TYPES
# ─────────────────────────────────────────────────────────────
write_file "src/types/dm.ts" \
'// src/types/dm.ts
export type StreakTier = "none" | "low" | "mid" | "high";

export interface Conversation {
  id: string;
  name: string;
  handle: string;
  emoji: string;
  streak: number | null;
  atRisk: boolean;
  broken: boolean;
  lastStreak: number | null;
  last: string;
  time: string;
  unread: number;
  online: boolean;
  started: string | null;
  longest: number | null;
  milestone: boolean;
}

export interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  reactions: Reaction[];
}

export interface Reaction {
  emoji: string;
  count: number;
  mine: boolean;
}

export interface OwlColors {
  body: string;
  eye: string;
  halo: string;
  haloStrong: string;
}

export interface StreakLabel {
  short: string;
  long: string;
}

// Streak Badge Cycle types
export type BadgeId =
  | "new_moon" | "lunar_glow" | "solar_owl"
  | "forest_owl" | "cosmic_owl" | "mythic_owl";

export interface BadgePalette {
  bg: string; card: string; body: string; face: string;
  eye: string; halo: string; haloBright: string;
  ring: string; accent: string; text: string;
}

export interface CycleBadge {
  id: BadgeId;
  cycle: number;
  name: string;
  meaning: string;
  story: string;
  palette: BadgePalette;
  stars: boolean;
  crescent: boolean;
  rays: boolean;
  leaves: boolean;
  tealGlow: boolean;
  horns?: boolean;
  cosmicRing?: boolean;
}
'

# ─────────────────────────────────────────────────────────────
# 2. DATA — conversations + messages
# ─────────────────────────────────────────────────────────────
write_file "src/data/dm.ts" \
'// src/data/dm.ts
// TODO: replace with Firestore real-time listeners when Firebase is connected
import type { Conversation, Message } from "@/types/dm";

export const CONVOS: Conversation[] = [
  {
    id: "c1", name: "Maya Thompson", handle: "@maya", emoji: "🌅",
    streak: 31, atRisk: false, broken: false, lastStreak: null,
    last: "Did you see the aurora signal?", time: "now", unread: 2, online: true,
    started: "Jan 9, 2025", longest: 31, milestone: true,
  },
  {
    id: "c2", name: "Leo (Toronto)", handle: "@leo_t", emoji: "🏔️",
    streak: 8, atRisk: true, broken: false, lastStreak: null,
    last: "Perfect, on my way there", time: "2m", unread: 0, online: true,
    started: "Mar 2, 2025", longest: 12, milestone: false,
  },
  {
    id: "c3", name: "Sofia (Nairobi)", handle: "@sofia_k", emoji: "🌍",
    streak: 0, atRisk: false, broken: true, lastStreak: 9,
    last: "A cheetah sighting at dawn 🐆", time: "8m", unread: 1, online: false,
    started: "Feb 14, 2025", longest: 9, milestone: false,
  },
  {
    id: "c4", name: "Alex (Tokyo)", handle: "@alex_k", emoji: "🗼",
    streak: 3, atRisk: false, broken: false, lastStreak: null,
    last: "100km from the summit now", time: "10m", unread: 0, online: false,
    started: "Mar 7, 2025", longest: 3, milestone: false,
  },
  {
    id: "c5", name: "Global Creators", handle: "@owf_all", emoji: "✦",
    streak: null, atRisk: false, broken: false, lastStreak: null,
    last: "Voice of the program is live", time: "3h", unread: 4, online: true,
    started: null, longest: null, milestone: false,
  },
];

export const MESSAGES: Record<string, Message[]> = {
  c1: [
    { id:"m1", from:"them", text:"Hey! Did you see the new aurora signal? 🌌", time:"4:50 PM", reactions:[] },
    { id:"m2", from:"them", text:"It'\''s a G4 storm — strongest since 2003.", time:"4:51 PM", reactions:[{emoji:"🔥",count:1,mine:false}] },
    { id:"m3", from:"me",   text:"Not yet, I'\''m about to check it out", time:"4:53 PM", reactions:[] },
    { id:"m4", from:"me",   text:"That Tromsø feed is unreal right now 😭", time:"4:53 PM", reactions:[{emoji:"💜",count:1,mine:true}] },
    { id:"m5", from:"them", text:"Right?! I'\''ve been watching for 20 mins. The owl is wide awake tonight 🦉", time:"4:54 PM", reactions:[] },
  ],
  c2: [
    { id:"m1", from:"them", text:"You joining the hike stream tomorrow?", time:"2:10 PM", reactions:[] },
    { id:"m2", from:"me",   text:"Perfect, on my way there", time:"2:11 PM", reactions:[] },
  ],
  c3: [
    { id:"m1", from:"them", text:"A cheetah sighting at dawn 🐆", time:"9:20 AM", reactions:[{emoji:"🌟",count:3,mine:false}] },
    { id:"m2", from:"me",   text:"That'\''s incredible. How close were you?", time:"9:22 AM", reactions:[] },
  ],
  c4: [
    { id:"m1", from:"them", text:"100km from the summit now", time:"Yesterday", reactions:[] },
    { id:"m2", from:"me",   text:"Stay warm up there 🏔️", time:"Yesterday", reactions:[] },
  ],
  c5: [
    { id:"m1", from:"them", text:"Voice of the program is live — check #announcements", time:"3h ago", reactions:[] },
  ],
};

export const QUICK_REACTIONS = ["💜", "🔥", "🌟", "🌍", "😂", "👏"];
'

# ─────────────────────────────────────────────────────────────
# 3. DATA — streak badge definitions
# ─────────────────────────────────────────────────────────────
write_file "src/data/streakBadges.ts" \
'// src/data/streakBadges.ts
import type { CycleBadge } from "@/types/dm";

export const CYCLE_BADGES: CycleBadge[] = [
  {
    id: "new_moon", cycle: 1, name: "New Moon Owl",
    meaning: "First streak cycle completed.",
    story: "You kept showing up.",
    palette: {
      bg: "#0A0E1A", card: "#0D1428", body: "#2A2050", face: "#3D3080",
      eye: "#6050B0", halo: "#4030A0", haloBright: "rgba(100,80,200,0.5)",
      ring: "#5040B0", accent: "#FFD060", text: "#C8C0F0",
    },
    stars: true, crescent: false, rays: false, leaves: false, tealGlow: false,
  },
  {
    id: "lunar_glow", cycle: 2, name: "Lunar Glow",
    meaning: "The moon remembers everything.",
    story: "Multiple streaks built.",
    palette: {
      bg: "#F0F4F8", card: "#FFFFFF", body: "#4A7FA8", face: "#7AAAC8",
      eye: "#3A6A90", halo: "#2A5A80", haloBright: "rgba(100,160,200,0.25)",
      ring: "#3A6A90", accent: "#B0D0E8", text: "#2A4A60",
    },
    stars: true, crescent: true, rays: false, leaves: false, tealGlow: false,
  },
  {
    id: "solar_owl", cycle: 3, name: "Solar Owl",
    meaning: "Consistent streak behavior.",
    story: "Three cycles of daily conversation.",
    palette: {
      bg: "#FFFBF0", card: "#FFFFFF", body: "#F09020", face: "#FFD060",
      eye: "#C07010", halo: "#F0A020", haloBright: "rgba(255,180,40,0.4)",
      ring: "#E08010", accent: "#FF6020", text: "#804010",
    },
    stars: false, crescent: false, rays: true, leaves: false, tealGlow: false,
  },
  {
    id: "forest_owl", cycle: 4, name: "Forest Owl",
    meaning: "Rooted. Returning. Growing.",
    story: "Long-term ritualist.",
    palette: {
      bg: "#F0F8F0", card: "#FFFFFF", body: "#2A7A30", face: "#80D040",
      eye: "#206020", halo: "#206820", haloBright: "rgba(80,180,60,0.2)",
      ring: "#206820", accent: "#80D040", text: "#184018",
    },
    stars: false, crescent: false, rays: false, leaves: true, tealGlow: false,
  },
  {
    id: "cosmic_owl", cycle: 5, name: "Cosmic Owl",
    meaning: "Long-term ritualist.",
    story: "You and the cosmos are on a streak.",
    palette: {
      bg: "#F2F4FF", card: "#FFFFFF", body: "#1A2080", face: "#4050C0",
      eye: "#3040A0", halo: "#1A2080", haloBright: "rgba(60,80,200,0.15)",
      ring: "#1A2080", accent: "#8090E0", text: "#0A1040",
    },
    stars: true, crescent: false, rays: false, leaves: false,
    tealGlow: false, cosmicRing: true,
  },
  {
    id: "mythic_owl", cycle: 6, name: "Mythic Owl",
    meaning: "A hundred days of presence.",
    story: "Some connections become mythic.",
    palette: {
      bg: "#000000", card: "#060A0F", body: "#0A4A50", face: "#10808A",
      eye: "#08C0D0", halo: "#08C0D0", haloBright: "rgba(8,192,208,0.5)",
      ring: "#06A0B0", accent: "#00E8F8", text: "#80E8F0",
    },
    stars: true, crescent: false, rays: false, leaves: false,
    tealGlow: true, horns: true,
  },
];

export const MEMORY_ENTRIES = [
  { day: 7,   side: "left",  title: "Day 7",   body: "Los Angeles,\n11:18 PM" },
  { day: 12,  side: "right", title: "Day 12",  body: "You first mentioned\nNatidal here." },
  { day: 30,  side: "left",  title: "Day 30",  body: "Glow mode\nused 7 times." },
  { day: 50,  side: "right", title: "Day 50",  body: "First voice note\nsent together." },
  { day: 100, side: "left",  title: "Day 100", body: "Archive of trust." },
] as const;
'

# ─────────────────────────────────────────────────────────────
# 4. LIB — streak helpers
# ─────────────────────────────────────────────────────────────
write_file "src/lib/streak.ts" \
'// src/lib/streak.ts
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
  if (atRisk)    return { short:"Ends today", long:"Your streak ends today if you both don'\''t send a message." };
  if (days>=100) return { short:`${days} days`, long:`100 days in a row. That'\''s an archive of trust.` };
  if (days>=30)  return { short:`${days} days`, long:`30 days of daily conversation. This owl remembers.` };
  if (days>=10)  return { short:`${days} days`, long:`You'\''ve kept a ${days}-day streak. The owl'\''s getting brighter.` };
  return           { short:`${days} days`, long:`You'\''ve been talking every day for ${days} days.` };
}
'

# ─────────────────────────────────────────────────────────────
# 5. COMPONENTS — OwlSVG (geometric, dark-theme)
# ─────────────────────────────────────────────────────────────
write_file "src/components/dm/OwlSVG.tsx" \
'"use client";
import { getOwlColors } from "@/lib/streak";
import type { StreakTier } from "@/types/dm";

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
'

# ─────────────────────────────────────────────────────────────
# 6. COMPONENTS — SoftOwlSVG (illustrated, for badge cards)
# ─────────────────────────────────────────────────────────────
write_file "src/components/dm/SoftOwlSVG.tsx" \
'"use client";
import type { BadgePalette } from "@/types/dm";

interface Props {
  size?: number;
  palette: BadgePalette;
  variant?: "normal" | "cosmic";
  animate?: boolean;
  horns?: boolean;
}

export default function SoftOwlSVG({ size = 120, palette: p, variant = "normal", animate = false, horns = false }: Props) {
  const s = size;
  const cx = s / 2, cy = s / 2;
  const R  = s * 0.38;
  const FR = s * 0.32;
  const uid = `${size}_${p.body.replace("#","")}`;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"
      style={{ display:"block", animation: animate ? "owfOwlFloat 3.5s ease-in-out infinite" : "none" }}>
      <defs>
        <radialGradient id={`haloG_${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.haloBright} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={`bodyG_${uid}`} cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor={p.face} />
          <stop offset="100%" stopColor={p.body} />
        </radialGradient>
        <radialGradient id={`faceG_${uid}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={p.face} />
          <stop offset="100%" stopColor={p.face} stopOpacity="0.7" />
        </radialGradient>
      </defs>

      {/* Outer halo */}
      <circle cx={cx} cy={cy} r={s*0.48} fill={`url(#haloG_${uid})`} />

      {/* Horns (Mythic) */}
      {horns && <>
        <path d={`M ${cx-s*0.14} ${cy-R*0.6} Q ${cx-s*0.22} ${cy-R*1.1} ${cx-s*0.12} ${cy-R*0.85}`} stroke={p.face} strokeWidth={s*0.04} fill="none" strokeLinecap="round" />
        <path d={`M ${cx+s*0.14} ${cy-R*0.6} Q ${cx+s*0.22} ${cy-R*1.1} ${cx+s*0.12} ${cy-R*0.85}`} stroke={p.face} strokeWidth={s*0.04} fill="none" strokeLinecap="round" />
      </>}

      {/* Ear tufts */}
      {!horns && <>
        <ellipse cx={cx-s*0.13} cy={cy-R*0.72} rx={s*0.07} ry={s*0.1} fill={p.body} transform={`rotate(-15 ${cx-s*0.13} ${cy-R*0.72})`} />
        <ellipse cx={cx+s*0.13} cy={cy-R*0.72} rx={s*0.07} ry={s*0.1} fill={p.body} transform={`rotate(15 ${cx+s*0.13} ${cy-R*0.72})`} />
      </>}

      {/* Body */}
      <ellipse cx={cx} cy={cy+s*0.04} rx={R} ry={R*1.05} fill={`url(#bodyG_${uid})`} />

      {/* Wings */}
      <ellipse cx={cx-R*0.82} cy={cy+s*0.08} rx={R*0.32} ry={R*0.55} fill={p.body} style={{filter:"brightness(0.8)"}} transform={`rotate(-8 ${cx-R*0.82} ${cy+s*0.08})`} />
      <ellipse cx={cx+R*0.82} cy={cy+s*0.08} rx={R*0.32} ry={R*0.55} fill={p.body} style={{filter:"brightness(0.8)"}} transform={`rotate(8 ${cx+R*0.82} ${cy+s*0.08})`} />

      {/* Belly feather lines */}
      {[cy+s*0.1, cy+s*0.16, cy+s*0.22].map((y, i) => (
        <path key={i} d={`M ${cx-s*0.1+i*s*0.01} ${y} Q ${cx} ${y+s*0.015} ${cx+s*0.1-i*s*0.01} ${y}`}
          stroke={p.body} strokeWidth={s*0.012} strokeOpacity={0.4} fill="none" />
      ))}

      {/* Face disc */}
      <circle cx={cx} cy={cy-s*0.04} r={FR} fill={`url(#faceG_${uid})`} />

      {/* Cheek blush */}
      <ellipse cx={cx-FR*0.55} cy={cy+FR*0.2} rx={FR*0.2} ry={FR*0.12} fill={p.body} fillOpacity={0.35} />
      <ellipse cx={cx+FR*0.55} cy={cy+FR*0.2} rx={FR*0.2} ry={FR*0.12} fill={p.body} fillOpacity={0.35} />

      {/* Closed eyes */}
      <path d={`M ${cx-FR*0.42} ${cy-FR*0.12} Q ${cx-FR*0.22} ${cy-FR*0.28} ${cx-FR*0.02} ${cy-FR*0.12}`}
        stroke={p.eye} strokeWidth={s*0.025} fill="none" strokeLinecap="round" />
      <path d={`M ${cx+FR*0.02} ${cy-FR*0.12} Q ${cx+FR*0.22} ${cy-FR*0.28} ${cx+FR*0.42} ${cy-FR*0.12}`}
        stroke={p.eye} strokeWidth={s*0.025} fill="none" strokeLinecap="round" />

      {/* Beak */}
      <polygon points={`${cx},${cy+FR*0.08} ${cx-FR*0.14},${cy+FR*0.26} ${cx+FR*0.14},${cy+FR*0.26}`} fill={p.accent || "#F0A030"} />

      {/* Talons */}
      {[cx-s*0.12, cx, cx+s*0.12].map((tx, i) => (
        <ellipse key={i} cx={tx} cy={cy+R*0.95} rx={s*0.035} ry={s*0.025} fill={p.accent || "#F0A030"} />
      ))}

      {/* Cosmic body specks */}
      {variant === "cosmic" && [[cx-s*0.08,cy+s*0.06],[cx+s*0.1,cy+s*0.12],[cx-s*0.04,cy+s*0.2],[cx+s*0.02,cy-s*0.02]].map(([sx,sy],i) => (
        <circle key={i} cx={sx} cy={sy} r={s*0.015} fill="rgba(255,255,255,0.7)" />
      ))}
    </svg>
  );
}
'

# ─────────────────────────────────────────────────────────────
# 7. COMPONENTS — OwlBadge (inline list row badge)
# ─────────────────────────────────────────────────────────────
write_file "src/components/dm/OwlBadge.tsx" \
'"use client";
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
'

# ─────────────────────────────────────────────────────────────
# 8. COMPONENTS — ThreadStreakBar
# ─────────────────────────────────────────────────────────────
write_file "src/components/dm/ThreadStreakBar.tsx" \
'"use client";
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
'

# ─────────────────────────────────────────────────────────────
# 9. COMPONENTS — AtRiskBanner
# ─────────────────────────────────────────────────────────────
write_file "src/components/dm/AtRiskBanner.tsx" \
'"use client";
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
        Your streak ends today if you both don'\''t send a message.
      </span>
      <button onClick={onDismiss} style={{ background:"none", border:"none", color:"#3D5268", cursor:"pointer", fontSize:16, padding:2, fontFamily:"inherit" }}>×</button>
    </div>
  );
}
'

# ─────────────────────────────────────────────────────────────
# 10. COMPONENTS — StreakSheet (bottom sheet detail)
# ─────────────────────────────────────────────────────────────
write_file "src/components/dm/StreakSheet.tsx" \
'"use client";
import { useEffect } from "react";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OwlSVG from "./OwlSVG";

const C = {
  surface:"#0D1219", border:"#1A2535", text:"#E2EAF2",
  sub:"#7A95AE", muted:"#3D5268", gold:"#E8B84B", aurora:"#00D4AA",
};

interface Props {
  convo: Conversation;
  onClose: () => void;
}

export default function StreakSheet({ convo, onClose }: Props) {
  const tier  = getStreakTier(convo.streak);
  const oc    = getOwlColors(tier, convo.atRisk, convo.broken);
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  const days  = convo.streak || 0;

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:3000,
      background:"rgba(4,7,11,0.88)", backdropFilter:"blur(16px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
      padding:20, animation:"owfFadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:"100%", maxWidth:420, marginBottom:20,
        background:C.surface, border:`1px solid ${C.border}`,
        borderRadius:24, overflow:"hidden",
        boxShadow:`0 0 60px ${oc.halo}, 0 24px 48px rgba(0,0,0,0.8)`,
        animation:"owfSlideUp 0.3s cubic-bezier(0.34,1.4,0.64,1)",
      }}>
        {/* Hero */}
        <div style={{
          padding:"36px 0 24px",
          background:`radial-gradient(ellipse at 50% 60%, ${oc.halo} 0%, transparent 70%)`,
          display:"flex", flexDirection:"column", alignItems:"center", gap:12,
          position:"relative",
        }}>
          <OwlSVG size={96} tier={tier} atRisk={convo.atRisk} broken={convo.broken} pulse />
          <div style={{ textAlign:"center" }}>
            {convo.broken ? (
              <>
                <div style={{ fontSize:22, fontWeight:900, color:C.muted }}>Streak ended</div>
                <div style={{ fontSize:14, color:C.muted, marginTop:4 }}>You reached a {convo.lastStreak}-day streak together.</div>
              </>
            ) : convo.atRisk ? (
              <>
                <div style={{ fontSize:22, fontWeight:900, color:"#F59E0B" }}>{days}-day streak</div>
                <div style={{ fontSize:14, color:C.sub, marginTop:4 }}>⚠ Your streak ends today if you both don'\''t send a message.</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:32, fontWeight:900, color:C.gold }}>{days} days</div>
                <div style={{ fontSize:14, color:C.sub, marginTop:4, maxWidth:280, textAlign:"center", lineHeight:1.5 }}>{label?.long}</div>
              </>
            )}
          </div>
          <button onClick={onClose} style={{
            position:"absolute", top:14, right:16,
            background:"rgba(255,255,255,0.06)", border:`1px solid ${C.border}`,
            borderRadius:"50%", width:30, height:30,
            cursor:"pointer", color:C.muted, fontSize:17, fontFamily:"inherit",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>×</button>
        </div>

        {/* Details */}
        <div style={{ padding:"0 24px 28px" }}>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:18, display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:13, color:C.sub }}>Both send at least one message daily</span>
              <span style={{ fontSize:13, fontWeight:700, color:convo.broken?C.muted:C.aurora }}>
                {convo.broken ? "—" : "✓ Active"}
              </span>
            </div>
            {convo.started && (
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:13, color:C.sub }}>Streak started</span>
                <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{convo.started}</span>
              </div>
            )}
            {convo.longest && (
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:13, color:C.sub }}>Longest streak together</span>
                <span style={{ fontSize:13, fontWeight:600, color:C.gold }}>{convo.longest} days</span>
              </div>
            )}
          </div>

          {convo.atRisk && (
            <div style={{ marginTop:18, background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:10, padding:"11px 14px" }}>
              <p style={{ margin:0, fontSize:12.5, color:"#F59E0B", lineHeight:1.55 }}>
                To keep this streak, you both need to send at least one message today.
              </p>
            </div>
          )}

          <p style={{ margin:"18px 0 0", textAlign:"center", fontSize:11, color:C.muted, lineHeight:1.6 }}>
            This owl lights up when you keep the conversation going daily.<br/>
            Streaks are visible only to the two of you.
          </p>
        </div>
      </div>
    </div>
  );
}
'

# ─────────────────────────────────────────────────────────────
# 11. COMPONENTS — BadgeUnlockCard (cycle badge modal)
# ─────────────────────────────────────────────────────────────
write_file "src/components/dm/BadgeUnlockCard.tsx" \
'"use client";
import { useState, useEffect } from "react";
import type { CycleBadge } from "@/types/dm";
import SoftOwlSVG from "./SoftOwlSVG";

interface Props {
  badge: CycleBadge;
  onClose: () => void;
}

export default function BadgeUnlockCard({ badge, onClose }: Props) {
  const p = badge.palette;
  const [revealed, setRevealed] = useState(false);
  const isDark = badge.id === "mythic_owl" || badge.id === "new_moon";

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 150);
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { clearTimeout(t); document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:5000,
      background:"rgba(0,0,0,0.85)", backdropFilter:"blur(20px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:20, animation:"owfFadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:"100%", maxWidth:380,
        background:p.card, borderRadius:32, overflow:"hidden",
        boxShadow:`0 0 80px ${p.haloBright}, 0 40px 80px rgba(0,0,0,0.6)`,
        animation:"owfSlideUp 0.4s cubic-bezier(0.34,1.4,0.64,1)",
      }}>
        {/* Hero */}
        <div style={{
          padding:"52px 0 40px",
          background: badge.id === "mythic_owl" ? "#000" : badge.id === "new_moon" ? p.bg : "white",
          display:"flex", flexDirection:"column", alignItems:"center",
          position:"relative", overflow:"hidden",
        }}>
          {isDark && <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 50%, ${p.haloBright} 0%, transparent 70%)` }}/>}

          {/* Sun rays */}
          {badge.rays && [0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i) => (
            <div key={i} style={{ position:"absolute", top:"50%", left:"50%", width:2, height:"35%", background:`linear-gradient(${p.halo}, transparent)`, transformOrigin:"top center", transform:`translateX(-50%) rotate(${deg}deg)`, opacity:0.35 }} />
          ))}

          {/* Leaves */}
          {badge.leaves && (["8%,45%","88%,42%"] as string[]).map((pos,i) => (
            <div key={i} style={{ position:"absolute", left:pos.split(",")[0], top:pos.split(",")[1], fontSize:18, transform:`rotate(${[-20,20][i]}deg)` }}>🍃</div>
          ))}

          {/* Stars */}
          {badge.stars && [...Array(12)].map((_,i) => (
            <div key={i} style={{ position:"absolute", width:2, height:2, borderRadius:"50%", background:"white", left:`${10+Math.random()*80}%`, top:`${10+Math.random()*70}%`, opacity:0.3+Math.random()*0.5, animation:`owfTwinkle ${1.5+Math.random()*2}s ease-in-out ${Math.random()*2}s infinite` }}/>
          ))}

          {/* Crescent */}
          {badge.crescent && <div style={{ position:"absolute", top:"12%", right:"14%", fontSize:36, color:"#D0D8E0" }}>🌙</div>}

          {/* Sun icon */}
          {badge.rays && <div style={{ position:"absolute", top:"14%", right:"14%", fontSize:36 }}>☀️</div>}

          {/* Ring frame */}
          {(badge.id === "lunar_glow" || badge.id === "cosmic_owl") && (
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:200, height:200, borderRadius:"50%", border:`4px solid ${p.ring}`, boxShadow:`inset 0 0 30px ${p.haloBright}, 0 0 30px ${p.haloBright}`, pointerEvents:"none" }}/>
          )}

          {/* Owl */}
          <div style={{
            transform: revealed ? "scale(1)" : "scale(0.6)",
            opacity: revealed ? 1 : 0,
            transition:"all 0.6s cubic-bezier(0.34,1.4,0.64,1)",
            filter: badge.tealGlow ? `drop-shadow(0 0 24px ${p.halo})` : badge.rays ? `drop-shadow(0 0 20px ${p.halo})` : "none",
            position:"relative", zIndex:2,
          }}>
            <SoftOwlSVG
              size={160} palette={p}
              variant={(badge.id === "cosmic_owl" || badge.id === "new_moon") ? "cosmic" : "normal"}
              animate={revealed}
              horns={badge.horns}
            />
          </div>
        </div>

        {/* Text */}
        <div style={{ padding:"28px 32px 36px", background:p.card, textAlign:"center" }}>
          <div style={{ fontSize:13, fontWeight:800, color:p.text, opacity:0.5, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:8 }}>
            Cycle {badge.cycle}
          </div>
          <h2 style={{ margin:"0 0 24px", fontSize:32, fontWeight:900, color:p.text, lineHeight:1.1 }}>
            {badge.name}
          </h2>
          <div style={{ fontSize:13, fontWeight:800, color:p.eye, letterSpacing:"0.22em", textTransform:"uppercase" }}>
            BADGE UNLOCKED
          </div>
          <p style={{ margin:"10px 0 0", fontSize:12, color:p.text, opacity:0.5, fontStyle:"italic" }}>{badge.story}</p>
        </div>
      </div>
    </div>
  );
}
'

# ─────────────────────────────────────────────────────────────
# 12. COMPONENTS — OwlMemoryTimeline
# ─────────────────────────────────────────────────────────────
write_file "src/components/dm/OwlMemoryTimeline.tsx" \
'"use client";
import { useState, useEffect } from "react";
import { MEMORY_ENTRIES } from "@/data/streakBadges";
import SoftOwlSVG from "./SoftOwlSVG";

const WARM_OWL = {
  body:"#C07820", face:"#F0C060", eye:"#804010",
  halo:"rgba(232,184,75,0.4)", haloBright:"rgba(232,184,75,0.25)",
  accent:"#E8802A", text:"#E8B84B", bg:"", card:"", ring:"",
};

interface Props { onClose: () => void; }

export default function OwlMemoryTimeline({ onClose }: Props) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { clearTimeout(t); document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:5000,
      background:"radial-gradient(ellipse at 50% 0%, #0A1428 0%, #050810 100%)",
      overflowY:"auto", animation:"owfFadeIn 0.3s ease",
    }}>
      {/* Stars */}
      {[...Array(28)].map((_,i) => (
        <div key={i} style={{
          position:"fixed", borderRadius:"50%",
          width:i%6===0?2:1.5, height:i%6===0?2:1.5,
          background:"white", opacity:0.1+Math.random()*0.25,
          left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
          animation:`owfTwinkle ${2+Math.random()*3}s ease-in-out ${Math.random()*3}s infinite`,
          pointerEvents:"none",
        }}/>
      ))}

      <div style={{ maxWidth:400, margin:"0 auto", padding:"48px 24px 60px", position:"relative" }}>
        <button onClick={onClose} style={{
          position:"absolute", top:16, right:16,
          background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"50%", width:32, height:32,
          color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:17, fontFamily:"inherit",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>×</button>

        <h1 style={{
          textAlign:"center", margin:"0 0 32px",
          fontSize:38, fontWeight:900, color:"#E8B84B",
          textShadow:"0 2px 20px rgba(232,184,75,0.4)",
          animation: revealed ? "owfSlideDown 0.4s ease both" : "none",
          fontFamily:"Georgia, serif",
        }}>Owl Memory</h1>

        {/* Owl */}
        <div style={{
          display:"flex", justifyContent:"center", marginBottom:8,
          transform: revealed ? "scale(1)" : "scale(0.7)",
          opacity: revealed ? 1 : 0,
          transition:"all 0.5s cubic-bezier(0.34,1.4,0.64,1) 0.1s",
          position:"relative", zIndex:2,
        }}>
          <div style={{ position:"absolute", top:-8, right:"30%", fontSize:28, color:"rgba(180,160,100,0.6)" }}>🌙</div>
          <SoftOwlSVG size={130} palette={WARM_OWL} animate={revealed} />
        </div>

        {/* Timeline */}
        <div style={{ position:"relative", paddingTop:8 }}>
          <div style={{
            position:"absolute", left:"50%", top:0, bottom:0, width:2,
            borderLeft:"2px dashed rgba(232,184,75,0.25)",
          }}/>

          {MEMORY_ENTRIES.map((entry, i) => (
            <div key={i} style={{
              display:"flex",
              justifyContent: entry.side === "left" ? "flex-start" : "flex-end",
              marginBottom:16, paddingBottom:4,
              animation: revealed ? `owfFadeIn 0.4s ease ${0.3+i*0.12}s both` : "none",
            }}>
              <div style={{
                width:"44%",
                background:"rgba(10,20,50,0.8)",
                border:"1px solid rgba(100,120,180,0.2)",
                borderRadius:16, padding:"14px 16px",
                backdropFilter:"blur(8px)",
              }}>
                <div style={{ fontSize:11, fontWeight:900, color:"#E8B84B", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6 }}>
                  {entry.title}
                </div>
                <div style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.8)", lineHeight:1.5, whiteSpace:"pre-line" }}>
                  {entry.body}
                </div>
              </div>

              <div style={{
                position:"absolute", left:"calc(50% - 5px)",
                top:`${i * 88 + 32}px`,
                width:10, height:10, borderRadius:"50%",
                background:"#E8B84B", boxShadow:"0 0 8px #E8B84B",
              }}/>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:24 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:i===1?"rgba(232,184,75,0.6)":"rgba(232,184,75,0.2)" }}/>
          ))}
        </div>
      </div>
    </div>
  );
}
'

# ─────────────────────────────────────────────────────────────
# 13. COMPONENTS — ConvoRow
# ─────────────────────────────────────────────────────────────
write_file "src/components/dm/ConvoRow.tsx" \
'"use client";
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
'

# ─────────────────────────────────────────────────────────────
# 14. COMPONENTS — MessageBubble
# ─────────────────────────────────────────────────────────────
write_file "src/components/dm/MessageBubble.tsx" \
'"use client";
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
'

# ─────────────────────────────────────────────────────────────
# 15. PAGE — /messages/page.tsx  (backs up existing)
# ─────────────────────────────────────────────────────────────
DM_PAGE_PATH="src/app/(pages)/messages/page.tsx"
if [[ -f "$DM_PAGE_PATH" && "$FORCE" == false ]]; then
  cp "$DM_PAGE_PATH" "${DM_PAGE_PATH}.bak"
  echo -e "${YELLOW}⟳ BACKUP${NC}  ${DM_PAGE_PATH} → .bak"
fi

write_file "$DM_PAGE_PATH" \
'"use client";
import { useState, useRef, useEffect } from "react";
import { CONVOS, MESSAGES } from "@/data/dm";
import type { Message } from "@/types/dm";
import ConvoRow          from "@/components/dm/ConvoRow";
import MessageBubble     from "@/components/dm/MessageBubble";
import OwlSVG            from "@/components/dm/OwlSVG";
import ThreadStreakBar    from "@/components/dm/ThreadStreakBar";
import AtRiskBanner      from "@/components/dm/AtRiskBanner";
import StreakSheet        from "@/components/dm/StreakSheet";
import BadgeUnlockCard   from "@/components/dm/BadgeUnlockCard";
import OwlMemoryTimeline from "@/components/dm/OwlMemoryTimeline";
import { getStreakTier } from "@/lib/streak";
import { CYCLE_BADGES }  from "@/data/streakBadges";

const C = {
  bg:"#07090D", surface:"#0D1219", raised:"#111827",
  border:"#1A2535", bdHigh:"#243040",
  text:"#E2EAF2", sub:"#7A95AE", muted:"#3D5268",
  horizon:"#1A6EFF", aurora:"#00D4AA", gold:"#E8B84B",
  violet:"#8B5CF6", rose:"#F43F5E", green:"#22C55E",
};

export default function MessagesPage() {
  const [activeId, setActiveId]        = useState("c1");
  const [messages, setMessages]        = useState<Record<string,Message[]>>(MESSAGES);
  const [input, setInput]              = useState("");
  const [picker, setPicker]            = useState<string|null>(null);
  const [sheetConvo, setSheetConvo]    = useState<typeof CONVOS[0]|null>(null);
  const [bannerDismissed, setBanner]   = useState<Record<string,boolean>>({});
  const [activeBadge, setActiveBadge]  = useState<typeof CYCLE_BADGES[0]|null>(null);
  const [showMemory, setShowMemory]    = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const convo = CONVOS.find(c => c.id === activeId)!;
  const msgs  = messages[activeId] || [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [activeId, messages]);

  const sendMsg = () => {
    if (!input.trim()) return;
    setMessages(m => ({
      ...m,
      [activeId]: [...(m[activeId]||[]), {
        id:`m${Date.now()}`, from:"me", text:input.trim(), time:"now", reactions:[],
      }],
    }));
    setInput("");
  };

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:C.bg, fontFamily:"'\''Inter'\'', -apple-system, sans-serif", overflow:"hidden" }}>

      <style>{`
        @keyframes owfOwlPulse  { 0%,100%{filter:drop-shadow(0 0 0px rgba(232,184,75,0))} 50%{filter:drop-shadow(0 0 8px rgba(232,184,75,0.6))} }
        @keyframes owfFadeIn    { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        @keyframes owfSlideUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes owfSlideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes owfOwlFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes owfTwinkle   { 0%,100%{opacity:0.15} 50%{opacity:0.9} }
        * { box-sizing:border-box }
        button { font-family:inherit }
        ::-webkit-scrollbar { width:3px }
        ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px }
      `}</style>

      {/* ── Global Header ── */}
      <div style={{ height:54, background:C.surface, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:14, flexShrink:0 }}>
        <span style={{ fontSize:17, fontWeight:900, letterSpacing:"-0.025em", color:C.text }}>
          One<span style={{color:C.horizon}}>World</span>Feed
        </span>
        <div style={{ flex:1 }}/>
        <div style={{ fontSize:13, fontWeight:700, color:C.horizon, background:"rgba(26,110,255,0.1)", border:"1px solid rgba(26,110,255,0.25)", borderRadius:8, padding:"5px 12px" }}>
          ✉ Messages
        </div>
        {/* Quick access: badge shelf + memory */}
        <button onClick={() => setActiveBadge(CYCLE_BADGES[0])} style={{ background:"rgba(232,184,75,0.08)", border:"1px solid rgba(232,184,75,0.2)", borderRadius:8, padding:"5px 10px", color:C.gold, fontSize:12, fontWeight:700, cursor:"pointer" }}>🦉 Badges</button>
        <button onClick={() => setShowMemory(true)} style={{ background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.2)", borderRadius:8, padding:"5px 10px", color:C.violet, fontSize:12, fontWeight:700, cursor:"pointer" }}>📜 Memory</button>
        <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.horizon},${C.aurora})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:"#fff" }}>J</div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ── LEFT: Conversation list ── */}
        <div style={{ width:296, flexShrink:0, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"16px 12px 10px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:17, fontWeight:800, color:C.text }}>Messages</span>
              <button style={{ background:"none", border:"none", color:C.muted, fontSize:20, cursor:"pointer" }}>⋯</button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:C.raised, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 12px" }}>
              <span style={{ color:C.muted, fontSize:13 }}>◎</span>
              <span style={{ fontSize:13, color:C.muted }}>Search conversations</span>
            </div>
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"0 6px" }}>
            {CONVOS.map(c => (
              <ConvoRow key={c.id} convo={c} active={activeId===c.id}
                onClick={() => setActiveId(c.id)}
                onOwlClick={() => setSheetConvo(c)}
              />
            ))}
          </div>

          {/* Storyboard footer */}
          <div style={{ padding:"10px 12px 14px", borderTop:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 8px", cursor:"pointer", borderRadius:10, transition:"background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.raised)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{fontSize:14}}>🎬</span>
              <span style={{fontSize:13,fontWeight:600,color:C.sub}}>Storyboard</span>
              <span style={{fontSize:11,color:C.muted,marginLeft:"auto"}}>3 Shows · Now</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Thread view ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Thread header */}
          <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0, background:C.surface }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${C.violet},${C.horizon})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{convo?.emoji}</div>
              {convo?.online && <div style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%", background:C.green, border:`2px solid ${C.surface}` }}/>}
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:C.text }}>{convo?.name}</div>
              <div style={{ fontSize:11, color:convo?.online?C.aurora:C.muted }}>
                {convo?.online ? "● Active now" : "Last seen recently"}
              </div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
              {["📞","📹","⋯"].map((ic,i) => (
                <button key={i} style={{ background:C.raised, border:`1px solid ${C.border}`, borderRadius:8, width:34, height:34, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", color:C.sub, transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=C.bdHigh; e.currentTarget.style.color=C.text; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.sub; }}
                >{ic}</button>
              ))}
            </div>
          </div>

          {/* Streak bar */}
          <ThreadStreakBar convo={convo} onOwlClick={() => setSheetConvo(convo)} />

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"16px 18px 8px" }} onClick={() => setPicker(null)}>
            {msgs.map(msg => (
              <MessageBubble key={msg.id} msg={msg} pickerOpen={picker} setPicker={setPicker} />
            ))}
            {convo?.atRisk && !bannerDismissed[activeId] && (
              <AtRiskBanner convo={convo} onDismiss={() => setBanner(b => ({...b,[activeId]:true}))} />
            )}
            <div ref={endRef}/>
          </div>

          {/* Quick reactions strip */}
          <div style={{ padding:"8px 18px 0", display:"flex", gap:7, alignItems:"center", flexShrink:0 }}>
            {[{e:"💜",l:"Warm"},{e:"🔥",l:"Glow"},{e:"🌍",l:"World"}].map(r => (
              <button key={r.l} style={{ background:C.raised, border:`1px solid ${C.border}`, borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:600, color:C.sub, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.violet+"50"; e.currentTarget.style.color=C.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.sub; }}
              >{r.e} {r.l}</button>
            ))}
            {convo?.streak && convo.streak >= 10 && (
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, opacity:0.7 }}>
                <OwlSVG size={18} tier={getStreakTier(convo.streak)} />
                <span style={{ fontSize:10, color:C.gold }}>{convo.streak}d</span>
              </div>
            )}
          </div>

          {/* Voice Note bar */}
          <div style={{ padding:"10px 18px 0", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:C.raised, border:`1px solid ${C.border}`, borderRadius:12, padding:"9px 14px", cursor:"pointer" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.violet+"50")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.violet},${C.rose})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>✦</div>
              <span style={{ fontSize:13, fontWeight:700, color:C.gold }}>Voice Note</span>
              <span style={{ fontSize:13, color:C.muted }}>· Tap to record</span>
              <span style={{ marginLeft:"auto", fontSize:11, color:C.muted }}>0:00</span>
            </div>
          </div>

          {/* OWF AI Glow line */}
          <div style={{ padding:"6px 18px 0", flexShrink:0 }}>
            <p style={{ margin:0, fontSize:11, color:C.muted, textAlign:"center" }}>
              ✦ <span style={{color:C.gold,fontWeight:600}}>Glow</span> powered by <span style={{color:C.violet,fontWeight:600}}>OWF AI</span>
            </p>
          </div>

          {/* Input bar */}
          <div style={{ padding:"10px 18px 18px", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, background:C.raised, border:`1px solid ${C.border}`, borderRadius:14, padding:"9px 12px" }}>
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:19, color:C.muted }}>＋</button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                placeholder="Message…"
                style={{ flex:1, background:"none", border:"none", outline:"none", color:C.text, fontSize:14, fontFamily:"inherit" }}
              />
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.muted }}>🎙</button>
              <button onClick={sendMsg} style={{
                width:32, height:32, borderRadius:"50%", border:"none",
                background:input.trim() ? C.horizon : C.border,
                cursor:input.trim() ? "pointer" : "default",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, color:"#fff", flexShrink:0, transition:"background 0.15s",
              }}>↑</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {sheetConvo  && <StreakSheet convo={sheetConvo} onClose={() => setSheetConvo(null)} />}
      {activeBadge && <BadgeUnlockCard badge={activeBadge} onClose={() => setActiveBadge(null)} />}
      {showMemory  && <OwlMemoryTimeline onClose={() => setShowMemory(false)} />}
    </div>
  );
}
'

# ─────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  OWF DM System — install complete${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${CYAN}Files written:${NC}"
echo "   src/types/dm.ts"
echo "   src/data/dm.ts"
echo "   src/data/streakBadges.ts"
echo "   src/lib/streak.ts"
echo "   src/components/dm/OwlSVG.tsx"
echo "   src/components/dm/SoftOwlSVG.tsx"
echo "   src/components/dm/OwlBadge.tsx"
echo "   src/components/dm/ThreadStreakBar.tsx"
echo "   src/components/dm/AtRiskBanner.tsx"
echo "   src/components/dm/StreakSheet.tsx"
echo "   src/components/dm/BadgeUnlockCard.tsx"
echo "   src/components/dm/OwlMemoryTimeline.tsx"
echo "   src/components/dm/ConvoRow.tsx"
echo "   src/components/dm/MessageBubble.tsx"
echo "   src/app/(pages)/messages/page.tsx"
echo ""
echo -e "  ${YELLOW}Next steps:${NC}"
echo "   1. Add route link in LeftNav.tsx  →  /messages"
echo "   2. Add route link in BottomNav.tsx (mobile)"
echo "   3. When Firebase ready: replace CONVOS/MESSAGES"
echo "      imports in data/dm.ts with Firestore listeners"
echo ""