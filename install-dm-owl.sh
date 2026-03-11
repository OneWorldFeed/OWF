#!/usr/bin/env bash
# ================================================================
#  OWF — Complete DM + Owl System Installer
#  Run from project root: bash install-dm-owl.sh
#
#  Writes:
#    src/types/dm.ts
#    src/data/dm.ts
#    src/lib/streak.ts
#    src/components/dm/OWFOwl.tsx         ← canonical owl
#    src/components/dm/OwlBadge.tsx
#    src/components/dm/ThreadStreakBar.tsx
#    src/components/dm/AtRiskBanner.tsx
#    src/components/dm/StreakSheet.tsx
#    src/components/dm/ConvoRow.tsx
#    src/components/dm/MessageBubble.tsx
#    src/app/(pages)/dm/page.tsx
# ================================================================
set -e
GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✔${NC} $1"; }
info() { echo -e "${CYAN}▸${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }

echo ""
info "Installing OWF DM + Owl system..."
echo ""

mkdir -p src/types src/data src/lib \
         src/components/dm \
         "src/app/(pages)/dm"

# ────────────────────────────────────────────────────────────────
# src/types/dm.ts
# ────────────────────────────────────────────────────────────────
cat > src/types/dm.ts << 'EOF'
export interface Message {
  id:        string;
  senderId:  string;
  text:      string;
  ts:        string;          // display time e.g. "2:41 PM"
  reactions?: string[];
}

export interface Conversation {
  id:          string;
  name:        string;
  avatar:      string;        // emoji or initials
  lastMsg:     string;
  ts:          string;
  unread?:     number;
  online?:     boolean;
  group?:      boolean;

  // Streak fields
  streak?:     number;        // current streak days
  milestone?:  boolean;       // streak just hit a major tier
  atRisk?:     boolean;       // streak expires today
  broken?:     boolean;       // streak was broken
  lastStreak?: number;        // last streak before broken
  started?:    string;        // "Jan 9, 2025"
  longest?:    number;        // all-time longest
}
EOF
ok "src/types/dm.ts"

# ────────────────────────────────────────────────────────────────
# src/data/dm.ts
# ────────────────────────────────────────────────────────────────
cat > src/data/dm.ts << 'EOF'
import type { Conversation, Message } from "@/types/dm";

export const CONVOS: Conversation[] = [
  {
    id: "c1", name: "Maya Thompson", avatar: "MT",
    lastMsg: "That sunset photo is incredible 🌅", ts: "2:41 PM",
    unread: 2, online: true,
    streak: 31, milestone: true,
    started: "Jan 9, 2025", longest: 31,
  },
  {
    id: "c2", name: "Leo Toronto", avatar: "LT",
    lastMsg: "Are you coming to the meetup?", ts: "11:22 AM",
    online: false,
    streak: 8, atRisk: true,
    started: "Mar 3, 2025", longest: 14,
  },
  {
    id: "c3", name: "Sofia Nairobi", avatar: "SN",
    lastMsg: "Miss our chats 💙", ts: "Yesterday",
    streak: 0, broken: true, lastStreak: 9,
  },
  {
    id: "c4", name: "Alex Tokyo", avatar: "AT",
    lastMsg: "Check out this track!", ts: "Mon",
    online: true,
    streak: 3,
    started: "Mar 8, 2025", longest: 3,
  },
  {
    id: "c5", name: "Global Creators", avatar: "🌍",
    lastMsg: "Priya: New issue is live!", ts: "Sun",
    group: true, unread: 5,
  },
];

export const MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: "m1", senderId: "other", text: "Hey! Did you see the aurora last night?", ts: "2:38 PM" },
    { id: "m2", senderId: "me",    text: "YES. I was outside for like an hour", ts: "2:39 PM" },
    { id: "m3", senderId: "other", text: "That sunset photo is incredible 🌅", ts: "2:41 PM", reactions: ["❤️", "🔥"] },
  ],
  c2: [
    { id: "m1", senderId: "other", text: "Are you coming to the meetup?", ts: "11:22 AM" },
    { id: "m2", senderId: "me",    text: "I'm planning to! What time?", ts: "11:24 AM" },
  ],
  c3: [
    { id: "m1", senderId: "me",    text: "Hey! Long time 👋", ts: "Yesterday" },
    { id: "m2", senderId: "other", text: "Miss our chats 💙", ts: "Yesterday" },
  ],
  c4: [
    { id: "m1", senderId: "other", text: "Check out this track!", ts: "Mon" },
    { id: "m2", senderId: "me",    text: "This is fire 🔥", ts: "Mon" },
  ],
  c5: [
    { id: "m1", senderId: "priya", text: "New issue is live!", ts: "Sun" },
    { id: "m2", senderId: "other", text: "Amazing work everyone 🙌", ts: "Sun" },
  ],
};
EOF
ok "src/data/dm.ts"

# ────────────────────────────────────────────────────────────────
# src/lib/streak.ts
# ────────────────────────────────────────────────────────────────
cat > src/lib/streak.ts << 'EOF'
export type StreakTier = "none" | "low" | "mid" | "high" | "fire" | "legendary";

export function getStreakTier(days?: number): StreakTier {
  if (!days || days <= 0) return "none";
  if (days < 4)   return "low";
  if (days < 10)  return "mid";
  if (days < 30)  return "high";
  if (days < 100) return "fire";
  return "legendary";
}

export function getOwlColors(
  tier: StreakTier,
  atRisk?: boolean,
  broken?: boolean,
): { halo: string; haloStrong: string; text: string } {
  if (broken)  return { halo: "rgba(61,82,104,0.15)",  haloStrong: "rgba(61,82,104,0.25)",  text: "#3D5268" };
  if (atRisk)  return { halo: "rgba(245,158,11,0.12)", haloStrong: "rgba(245,158,11,0.22)", text: "#F59E0B" };
  switch (tier) {
    case "legendary": return { halo: "rgba(0,194,199,0.14)",  haloStrong: "rgba(0,194,199,0.24)",  text: "#00C2C7" };
    case "fire":      return { halo: "rgba(255,106,0,0.14)",  haloStrong: "rgba(255,106,0,0.24)",  text: "#FF6A00" };
    case "high":      return { halo: "rgba(232,184,75,0.12)", haloStrong: "rgba(232,184,75,0.22)", text: "#E8B84B" };
    case "mid":       return { halo: "rgba(106,157,255,0.1)", haloStrong: "rgba(106,157,255,0.2)", text: "#6A9DFF" };
    default:          return { halo: "rgba(0,212,170,0.08)",  haloStrong: "rgba(0,212,170,0.14)",  text: "#00D4AA" };
  }
}

export function getStreakLabel(
  streak?: number,
  atRisk?: boolean,
  broken?: boolean,
  lastStreak?: number,
): { short: string; long: string } | null {
  if (broken && lastStreak) return {
    short: `${lastStreak}d ended`,
    long:  `Your ${lastStreak}-day streak ended.`,
  };
  if (!streak || streak <= 0) return null;
  if (atRisk) return {
    short: `${streak}d ⚠`,
    long:  `${streak}-day streak — ends today!`,
  };
  return {
    short: `${streak}d 🔥`,
    long:  `${streak} days of daily conversation.`,
  };
}
EOF
ok "src/lib/streak.ts"

# ────────────────────────────────────────────────────────────────
# src/components/dm/OWFOwl.tsx
# Exact SVG coordinates from base_owl.svg (ChatGPT zip):
#   viewBox 500×500
#   Body:    ellipse cx=250 cy=300 rx=140 ry=150
#   Face:    ellipse cx=250 cy=260 rx=100 ry=85
#   L-Eye:   M210 260 Q230 280 250 260
#   R-Eye:   M250 260 Q270 280 290 260
#   Beak:    points 250,270 238,292 262,292
#   Feathers: Q-lens paths rows at 325,355,385
#   Ear-L:   M170 150 L210 110 L220 170 Z
#   Ear-R:   M330 150 L290 110 L280 170 Z
#   Feet:    ellipse cx=220/280 cy=430
# ────────────────────────────────────────────────────────────────
cat > src/components/dm/OWFOwl.tsx << 'OWLEOF'
"use client";

// ══════════════════════════════════════════════════════════════
//  OWFOwl — Canonical OWF Owl mascot
//
//  SVG base from base_owl.svg (ChatGPT system, 500×500 viewBox):
//    Body ellipse cx=250 cy=300 rx=140 ry=150
//    Face disc   cx=250 cy=260 rx=100 ry=85
//    Eyes        Q bezier downward arcs (closed/calm)
//    Beak        triangle polygon
//    Chest       3 lens-shaped feather rows
//    Ear tufts   triangular paths
//    Feet        small ellipses
//
//  10 Cycles auto-selected from streakDays:
//    city(0) → lunar(4) → frost(10) → forest(20)
//    fire(30) → solar(50) → storm(70) → aurora(100)
//    cosmic(200) → mythic(365)
//
//  Moods: calm | happy | atRisk | broken
// ══════════════════════════════════════════════════════════════

export type OwlCycle =
  | "city" | "lunar" | "frost" | "forest" | "fire"
  | "solar" | "storm" | "aurora" | "cosmic" | "mythic";

export type OwlMood    = "calm" | "happy" | "atRisk" | "broken";
export type OwlSizeKey = "mini" | "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<OwlSizeKey, number> = {
  mini: 24, sm: 36, md: 64, lg: 100, xl: 140,
};

interface Palette {
  body:      string;
  bodyShade: string;
  face:      string;
  eye:       string;
  beak:      string;
  feet:      string;
  feather:   string;
  aura:      string;
  aura2:     string;
  // optional overlays
  flame?: string;
  leaf?:  string;
  halo?:  string;
  star?:  string;
  magic?: string;
  frost?: string;
}

const PALETTES: Record<OwlCycle, Palette> = {
  city: {
    body:"#D4956A", bodyShade:"#A06040",
    face:"#F5DEC8", eye:"#7A4A28",
    beak:"#F0821A", feet:"#F0821A", feather:"#B07040",
    aura:"rgba(255,200,160,0.4)", aura2:"rgba(240,160,80,0.2)",
  },
  lunar: {
    body:"#2A6AAA", bodyShade:"#1A4070",
    face:"#90C0E8", eye:"#0E2840",
    beak:"#3A70A0", feet:"#3A70A0", feather:"#1A4878",
    aura:"rgba(106,157,255,0.45)", aura2:"rgba(60,100,200,0.2)",
    halo:"#6A9DFF", star:"rgba(255,255,255,0.8)",
  },
  frost: {
    body:"#80B8D8", bodyShade:"#5090B0",
    face:"#D8EEF8", eye:"#2A6090",
    beak:"#7ABCE0", feet:"#7ABCE0", feather:"#5A9AC0",
    aura:"rgba(169,214,255,0.45)", aura2:"rgba(200,235,255,0.2)",
    frost:"rgba(200,240,255,0.3)", star:"rgba(255,255,255,0.7)",
  },
  forest: {
    body:"#2E7D32", bodyShade:"#1B5E20",
    face:"#81C784", eye:"#0D3B0F",
    beak:"#388E3C", feet:"#388E3C", feather:"#1B5E20",
    aura:"rgba(76,175,80,0.4)", aura2:"rgba(46,125,50,0.2)",
    leaf:"#4CAF50",
  },
  fire: {
    body:"#9B1800", bodyShade:"#5C0800",
    face:"#FFB300", eye:"#4A0800",
    beak:"#CC2800", feet:"#2A0500", feather:"#6B0E00",
    aura:"rgba(255,106,0,0.55)", aura2:"rgba(255,180,0,0.3)",
    flame:"#FF6A00",
  },
  solar: {
    body:"#E89A00", bodyShade:"#A06000",
    face:"#FFE070", eye:"#804A00",
    beak:"#E06000", feet:"#E06000", feather:"#B07000",
    aura:"rgba(255,193,7,0.5)", aura2:"rgba(255,150,0,0.25)",
    star:"rgba(255,240,100,0.7)",
  },
  storm: {
    body:"#2F3E46", bodyShade:"#1A2530",
    face:"#3A86FF", eye:"#0A1520",
    beak:"#3A86FF", feet:"#1A2530", feather:"#1F2E36",
    aura:"rgba(58,134,255,0.45)", aura2:"rgba(100,160,255,0.2)",
    star:"rgba(255,255,255,0.85)",
  },
  aurora: {
    body:"#1A2A60", bodyShade:"#0B132B",
    face:"#2AFFC6", eye:"#06402A",
    beak:"#2AFFC6", feet:"#8A2BE2", feather:"#0F1E48",
    aura:"rgba(42,255,198,0.45)", aura2:"rgba(138,43,226,0.25)",
    star:"rgba(255,255,255,0.8)",
  },
  cosmic: {
    body:"#1A1A5A", bodyShade:"#0A0A2A",
    face:"#5B6CFF", eye:"#060618",
    beak:"#4040C0", feet:"#2A2A8A", feather:"#10105A",
    aura:"rgba(91,108,255,0.5)", aura2:"rgba(120,80,220,0.25)",
    star:"rgba(255,255,255,0.85)",
  },
  mythic: {
    body:"#006868", bodyShade:"#003838",
    face:"#00D8D8", eye:"#001E1E",
    beak:"#00A0A0", feet:"#004848", feather:"#004A4A",
    aura:"rgba(0,194,199,0.55)", aura2:"rgba(0,240,240,0.25)",
    magic:"#00C2C7", star:"rgba(200,255,252,0.8)",
  },
};

function cycleFromDays(d: number): OwlCycle {
  if (d >= 365) return "mythic";
  if (d >= 200) return "cosmic";
  if (d >= 100) return "aurora";
  if (d >= 70)  return "storm";
  if (d >= 50)  return "solar";
  if (d >= 30)  return "fire";
  if (d >= 20)  return "forest";
  if (d >= 10)  return "frost";
  if (d >= 4)   return "lunar";
  return "city";
}

interface Props {
  size?:       number | OwlSizeKey;
  cycle?:      OwlCycle;
  mood?:       OwlMood;
  animate?:    boolean;
  streakDays?: number;
}

export default function OWFOwl({
  size      = "md",
  cycle     = "city",
  mood      = "calm",
  animate   = false,
  streakDays,
}: Props) {
  const px  = typeof size === "number" ? size : SIZE_MAP[size];
  const cyc = streakDays != null ? cycleFromDays(streakDays) : cycle;
  const p   = PALETTES[cyc] ?? PALETTES.city;

  const isBroken = mood === "broken";
  const isAtRisk = mood === "atRisk";
  const uid = `owf_${cyc}_${px}`;

  const animation = animate
    ? isAtRisk
      ? "owfOwlPulse 2s ease-in-out infinite"
      : "owfOwlFloat 3.5s ease-in-out infinite"
    : "none";

  return (
    <svg
      width={px} height={px}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`OWF Owl — ${cyc}`}
      style={{ display: "block", flexShrink: 0, animation, overflow: "visible" }}
    >
      <defs>
        <radialGradient id={`${uid}_aura`} cx="50%" cy="56%" r="50%">
          <stop offset="0%"   stopColor={p.aura2}/>
          <stop offset="45%"  stopColor={p.aura}/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id={`${uid}_body`} cx="42%" cy="28%" r="72%">
          <stop offset="0%"   stopColor={p.body}/>
          <stop offset="100%" stopColor={p.bodyShade}/>
        </radialGradient>
        <radialGradient id={`${uid}_face`} cx="50%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={p.face} stopOpacity="1"/>
          <stop offset="70%"  stopColor={p.face} stopOpacity="0.85"/>
          <stop offset="100%" stopColor={p.body}  stopOpacity="0.5"/>
        </radialGradient>
        {isBroken && (
          <filter id={`${uid}_desat`}>
            <feColorMatrix type="saturate" values="0.12"/>
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.55"/>
              <feFuncG type="linear" slope="0.55"/>
              <feFuncB type="linear" slope="0.55"/>
            </feComponentTransfer>
          </filter>
        )}
        {p.flame && (
          <linearGradient id={`${uid}_flame`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor="#FF8C00"/>
            <stop offset="50%"  stopColor={p.flame}/>
            <stop offset="100%" stopColor="#FFEE44"/>
          </linearGradient>
        )}
      </defs>

      <g filter={isBroken ? `url(#${uid}_desat)` : undefined}>

        {/* ── AURA GLOW ── */}
        <circle cx="250" cy="270" r="200" fill={`url(#${uid}_aura)`}/>

        {/* ── CYCLE OVERLAYS (behind body) ── */}

        {/* FIRE — outer flame curtains + crown flames + embers */}
        {p.flame && <>
          <path d="M140 380 C95 300 75 210 118 140 C138 195 128 265 148 318 Z"
            fill={`url(#${uid}_flame)`} opacity={0.82}/>
          <path d="M360 380 C405 300 425 210 382 140 C362 195 372 265 352 318 Z"
            fill={`url(#${uid}_flame)`} opacity={0.82}/>
          {/* crown flames */}
          <path d="M250 55 C218 128 302 148 250 208 C198 148 282 128 250 55"
            fill={`url(#${uid}_flame)`} opacity={0.9}/>
          <path d="M198 86 C172 152 234 164 198 208 C166 164 218 152 198 86"
            fill={`url(#${uid}_flame)`} opacity={0.72}/>
          <path d="M302 86 C328 152 266 164 302 208 C334 164 282 152 302 86"
            fill={`url(#${uid}_flame)`} opacity={0.72}/>
          {/* ember sparks */}
          {[[138,205],[362,190],[172,132],[328,142],[250,52],[132,318],[368,295],[250,22]].map(([ex,ey],i)=>(
            <circle key={i} cx={ex} cy={ey} r={i%2===0?5:3.5}
              fill={i%3===0?"#FFEE44":"#FF8C00"} opacity={0.82}/>
          ))}
        </>}

        {/* LUNAR — halo rings */}
        {p.halo && <>
          <circle cx="250" cy="250" r="215"
            stroke={p.halo} strokeWidth="3" fill="none" opacity={0.42}/>
          <circle cx="250" cy="250" r="198"
            stroke={p.halo} strokeWidth="1" fill="none" opacity={0.18}/>
        </>}

        {/* FOREST — leaf shapes */}
        {p.leaf && <>
          <ellipse cx="78"  cy="282" rx="16" ry="38" fill={p.leaf} opacity={0.85}
            transform="rotate(-20 78 282)"/>
          <ellipse cx="422" cy="282" rx="16" ry="38" fill={p.leaf} opacity={0.85}
            transform="rotate(20 422 282)"/>
          <ellipse cx="108" cy="198" rx="12" ry="28" fill={p.leaf} opacity={0.55}
            transform="rotate(-36 108 198)"/>
          <ellipse cx="392" cy="198" rx="12" ry="28" fill={p.leaf} opacity={0.55}
            transform="rotate(36 392 198)"/>
        </>}

        {/* FROST — ice crystals */}
        {p.frost && [[138,158],[362,168],[198,98],[302,93],[128,302],[372,312]].map(([fx,fy],i)=>(
          <g key={i} transform={`translate(${fx},${fy}) rotate(${i*30})`}>
            <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(180,230,255,0.6)" strokeWidth="1.5"/>
            <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(180,230,255,0.6)" strokeWidth="1.5"/>
            <line x1="-8" y1="-8" x2="8" y2="8" stroke="rgba(180,230,255,0.38)" strokeWidth="1"/>
            <line x1="8" y1="-8" x2="-8" y2="8" stroke="rgba(180,230,255,0.38)" strokeWidth="1"/>
          </g>
        ))}

        {/* STARS (lunar / frost / storm / aurora / cosmic / mythic) */}
        {p.star && [
          [98,158,4],[392,178,3],[162,98,5],[338,103,3.5],
          [72,332,3],[428,302,4],[250,72,3],[442,202,3.5],
        ].map(([sx,sy,sr],i)=>(
          <circle key={i} cx={sx} cy={sy} r={sr} fill={p.star}/>
        ))}

        {/* MYTHIC — magic arc + curved horns */}
        {p.magic && <>
          <path d="M58 292 A202 202 0 1 0 442 292"
            stroke={p.magic} strokeWidth="3" fill="none" opacity={0.48}
            strokeDasharray="12 8"/>
          <path d="M182 168 Q162 112 192 152"
            stroke={p.magic} strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M318 168 Q338 112 308 152"
            stroke={p.magic} strokeWidth="8" fill="none" strokeLinecap="round"/>
        </>}

        {/* ── EAR TUFTS — from base_owl.svg ── */}
        {/* Left:  M170 150 L210 110 L220 170 Z */}
        <path d="M170 150 L210 110 L220 170 Z" fill={p.body}/>
        {/* Right: M330 150 L290 110 L280 170 Z */}
        <path d="M330 150 L290 110 L280 170 Z" fill={p.body}/>

        {/* ── BODY — cx=250 cy=300 rx=140 ry=150 ── */}
        <ellipse cx="250" cy="300" rx="140" ry="150" fill={`url(#${uid}_body)`}/>

        {/* ── WINGS ── */}
        <ellipse cx="152" cy="308" rx="46" ry="88" fill={p.bodyShade}/>
        <ellipse cx="348" cy="308" rx="46" ry="88" fill={p.bodyShade}/>

        {/* ── FACE DISC — cx=250 cy=260 rx=100 ry=85 ── */}
        <ellipse cx="250" cy="260" rx="100" ry="85" fill={`url(#${uid}_face)`}/>

        {/* ── CLOSED EYES (downward Q arcs) — from base_owl.svg ──
              Left:  M210 260 Q230 280 250 260
              Right: M250 260 Q270 280 290 260            */}
        <path d="M210 260 Q230 280 250 260"
          stroke={isBroken ? p.bodyShade : p.eye}
          strokeWidth="8" fill="none" strokeLinecap="round"
          opacity={isBroken ? 0.4 : 1}/>
        <path d="M250 260 Q270 280 290 260"
          stroke={isBroken ? p.bodyShade : p.eye}
          strokeWidth="8" fill="none" strokeLinecap="round"
          opacity={isBroken ? 0.4 : 1}/>

        {/* ── BEAK — points="250,270 238,292 262,292" ── */}
        <polygon points="250,270 238,292 262,292" fill={p.beak}/>

        {/* ── CHEST FEATHERS — 3 lens-shaped rows ──
              Row 1: M220 325 Q250 305 280 325 Q250 345 220 325
              Row 2: M220 355 Q250 335 280 355 Q250 375 220 355
              Row 3: M220 385 Q250 365 280 385 Q250 405 220 385  */}
        <path d="M220 325 Q250 305 280 325 Q250 345 220 325" fill={p.feather}/>
        <path d="M220 355 Q250 335 280 355 Q250 375 220 355" fill={p.feather}/>
        <path d="M220 385 Q250 365 280 385 Q250 405 220 385" fill={p.feather}/>

        {/* ── FEET ── */}
        <ellipse cx="220" cy="430" rx="18" ry="11" fill={p.feet}/>
        <ellipse cx="280" cy="430" rx="18" ry="11" fill={p.feet}/>

        {/* ── BROKEN CRACKS ── */}
        {isBroken && <>
          <line x1="232" y1="198" x2="218" y2="285"
            stroke="rgba(200,180,160,0.38)" strokeWidth="6"
            strokeDasharray="12,8" strokeLinecap="round"/>
          <line x1="264" y1="202" x2="276" y2="278"
            stroke="rgba(200,180,160,0.22)" strokeWidth="4"
            strokeDasharray="10,7" strokeLinecap="round"/>
        </>}

        {/* ── AT-RISK AMBER DASHED RING ── */}
        {isAtRisk && (
          <circle cx="250" cy="270" r="232"
            stroke="rgba(245,158,11,0.58)"
            strokeWidth="8" fill="none"
            strokeDasharray="28 14"/>
        )}

      </g>
    </svg>
  );
}
OWLEOF
ok "src/components/dm/OWFOwl.tsx"

# ────────────────────────────────────────────────────────────────
# src/components/dm/OwlBadge.tsx
# ────────────────────────────────────────────────────────────────
cat > src/components/dm/OwlBadge.tsx << 'EOF'
"use client";
import { getStreakTier, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OWFOwl, { type OwlCycle, type OwlMood } from "./OWFOwl";

function owlProps(c: Conversation): { cycle: OwlCycle; mood: OwlMood } {
  if (c.broken) return { cycle: "city",  mood: "broken" };
  if (c.atRisk) return { cycle: "fire",  mood: "atRisk" };
  const t = getStreakTier(c.streak);
  if (t === "legendary") return { cycle: "mythic", mood: "happy" };
  if (t === "fire")      return { cycle: "fire",   mood: "happy" };
  if (t === "high")      return { cycle: "solar",  mood: "happy" };
  if (t === "mid")       return { cycle: "lunar",  mood: "happy" };
  return { cycle: "city", mood: "calm" };
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
      <OWFOwl size={28} cycle={cycle} mood={mood}
        animate={convo.atRisk} streakDays={convo.streak ?? 0}/>
      <span style={{ fontSize: 11, fontWeight: 700, color: col, whiteSpace: "nowrap" }}>
        {label.short}
      </span>
    </div>
  );
}
EOF
ok "src/components/dm/OwlBadge.tsx"

# ────────────────────────────────────────────────────────────────
# src/components/dm/ThreadStreakBar.tsx
# ────────────────────────────────────────────────────────────────
cat > src/components/dm/ThreadStreakBar.tsx << 'EOF'
"use client";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OWFOwl, { type OwlCycle, type OwlMood } from "./OWFOwl";

const C = { border: "#1A2535", muted: "#3D5268", gold: "#E8B84B" };

function owlProps(c: Conversation): { cycle: OwlCycle; mood: OwlMood } {
  if (c.broken) return { cycle: "city",  mood: "broken" };
  if (c.atRisk) return { cycle: "fire",  mood: "atRisk" };
  const t = getStreakTier(c.streak);
  if (t === "legendary") return { cycle: "mythic", mood: "happy" };
  if (t === "fire")      return { cycle: "fire",   mood: "happy" };
  if (t === "high")      return { cycle: "solar",  mood: "happy" };
  if (t === "mid")       return { cycle: "lunar",  mood: "happy" };
  return { cycle: "city", mood: "calm" };
}

interface Props { convo: Conversation; onOwlClick: () => void; }

export default function ThreadStreakBar({ convo, onOwlClick }: Props) {
  if (!convo.streak && !convo.broken) return null;
  const tier  = getStreakTier(convo.streak);
  const oc    = getOwlColors(tier, convo.atRisk, convo.broken);
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  if (!label) return null;
  const { cycle, mood } = owlProps(convo);
  const col = convo.broken ? C.muted : convo.atRisk ? "#F59E0B" : C.gold;
  return (
    <div
      onClick={onOwlClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        padding: "8px 20px",
        background: `radial-gradient(ellipse at 50% 100%, ${oc.haloStrong} 0%, transparent 80%)`,
        borderBottom: `1px solid ${C.border}`,
        cursor: "pointer", transition: "background 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background =
        `radial-gradient(ellipse at 50% 100%, ${oc.halo} 0%, transparent 80%)`)}
      onMouseLeave={e => (e.currentTarget.style.background =
        `radial-gradient(ellipse at 50% 100%, ${oc.haloStrong} 0%, transparent 80%)`)}
    >
      <OWFOwl size={44} cycle={cycle} mood={mood} animate streakDays={convo.streak ?? 0}/>
      <div>
        <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{label.short}</span>
        {convo.atRisk  && <span style={{ fontSize: 11, color: "#F59E0B", marginLeft: 8 }}>· Ends today</span>}
        {convo.broken  && <span style={{ fontSize: 11, color: C.muted,   marginLeft: 8 }}>· Tap to see history</span>}
        {!convo.atRisk && !convo.broken &&
          <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>· Tap to see details</span>}
      </div>
    </div>
  );
}
EOF
ok "src/components/dm/ThreadStreakBar.tsx"

# ────────────────────────────────────────────────────────────────
# src/components/dm/AtRiskBanner.tsx
# ────────────────────────────────────────────────────────────────
cat > src/components/dm/AtRiskBanner.tsx << 'EOF'
"use client";
import type { Conversation } from "@/types/dm";
import OWFOwl from "./OWFOwl";

interface Props { convo: Conversation; onDismiss: () => void; }

export default function AtRiskBanner({ convo, onDismiss }: Props) {
  if (!convo.atRisk) return null;
  return (
    <div style={{
      margin: "0 16px 12px",
      background: "rgba(245,158,11,0.07)",
      border: "1px solid rgba(245,158,11,0.2)",
      borderRadius: 10,
      padding: "9px 14px",
      display: "flex", alignItems: "center", gap: 10,
      animation: "owfFadeIn 0.3s ease",
    }}>
      <OWFOwl size={34} cycle="fire" mood="atRisk" animate/>
      <span style={{ fontSize: 12.5, color: "#F59E0B", flex: 1, lineHeight: 1.5 }}>
        Your streak ends today if you both don't send a message.
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: "none", border: "none", color: "#3D5268",
          cursor: "pointer", fontSize: 16, padding: 2, fontFamily: "inherit",
        }}
      >×</button>
    </div>
  );
}
EOF
ok "src/components/dm/AtRiskBanner.tsx"

# ────────────────────────────────────────────────────────────────
# src/components/dm/StreakSheet.tsx
# ────────────────────────────────────────────────────────────────
cat > src/components/dm/StreakSheet.tsx << 'EOF'
"use client";
import { useEffect } from "react";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OWFOwl, { type OwlCycle, type OwlMood } from "./OWFOwl";

const C = {
  surface: "#0D1219", border: "#1A2535", text: "#E2EAF2",
  sub: "#7A95AE", muted: "#3D5268", gold: "#E8B84B", aurora: "#00D4AA",
};

function owlProps(c: Conversation): { cycle: OwlCycle; mood: OwlMood } {
  if (c.broken) return { cycle: "city",  mood: "broken" };
  if (c.atRisk) return { cycle: "fire",  mood: "atRisk" };
  const t = getStreakTier(c.streak);
  if (t === "legendary") return { cycle: "mythic", mood: "happy" };
  if (t === "fire")      return { cycle: "fire",   mood: "happy" };
  if (t === "high")      return { cycle: "solar",  mood: "happy" };
  if (t === "mid")       return { cycle: "lunar",  mood: "happy" };
  return { cycle: "city", mood: "calm" };
}

interface Props { convo: Conversation; onClose: () => void; }

export default function StreakSheet({ convo, onClose }: Props) {
  const tier  = getStreakTier(convo.streak);
  const oc    = getOwlColors(tier, convo.atRisk, convo.broken);
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  const days  = convo.streak ?? 0;
  const { cycle, mood } = owlProps(convo);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 3000,
        background: "rgba(4,7,11,0.9)", backdropFilter: "blur(16px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: 20, animation: "owfFadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 420, marginBottom: 20,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 28, overflow: "hidden",
          boxShadow: `0 0 80px ${oc.halo}, 0 24px 48px rgba(0,0,0,0.8)`,
          animation: "owfSlideUp 0.35s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      >
        {/* Hero */}
        <div style={{
          padding: "36px 0 20px",
          background: `radial-gradient(ellipse at 50% 55%, ${oc.halo} 0%, transparent 65%)`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          position: "relative",
        }}>
          <OWFOwl size={130} cycle={cycle} mood={mood} animate streakDays={convo.streak ?? 0}/>

          <div style={{ textAlign: "center", padding: "0 32px" }}>
            {convo.broken ? (
              <>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.muted }}>Streak ended</div>
                <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
                  You reached a {convo.lastStreak}-day streak together.
                </div>
              </>
            ) : convo.atRisk ? (
              <>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#F59E0B" }}>{days}-day streak</div>
                <div style={{ fontSize: 14, color: C.sub, marginTop: 4 }}>
                  ⚠ Your streak ends today if you both don't send a message.
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 36, fontWeight: 900, color: C.gold, letterSpacing: "-0.03em" }}>
                  {days} days
                </div>
                <div style={{ fontSize: 14, color: C.sub, marginTop: 6, lineHeight: 1.6 }}>
                  {label?.long}
                </div>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 16,
              background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`,
              borderRadius: "50%", width: 30, height: 30,
              cursor: "pointer", color: C.muted, fontSize: 17,
              fontFamily: "inherit", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >×</button>
        </div>

        {/* Stats */}
        <div style={{ padding: "0 24px 28px" }}>
          <div style={{
            borderTop: `1px solid ${C.border}`, paddingTop: 18,
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            {[
              {
                label: "Both send at least one message daily",
                value: convo.broken ? "—" : "✓ Active",
                color: convo.broken ? C.muted : C.aurora,
              },
              convo.started ? { label: "Streak started", value: convo.started, color: C.text } : null,
              convo.longest ? { label: "Longest streak together", value: `${convo.longest} days`, color: C.gold } : null,
            ].filter(Boolean).map((row: any, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 13, color: C.sub, flex: 1 }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: row.color, whiteSpace: "nowrap" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {convo.atRisk && (
            <div style={{
              marginTop: 18, background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "11px 14px",
            }}>
              <p style={{ margin: 0, fontSize: 12.5, color: "#F59E0B", lineHeight: 1.55 }}>
                To keep this streak, you both need to send at least one message today.
              </p>
            </div>
          )}

          <p style={{
            margin: "20px 0 0", textAlign: "center",
            fontSize: 11, color: C.muted, lineHeight: 1.65,
          }}>
            This owl lights up when you keep the conversation going daily.<br/>
            Streaks are visible only to the two of you.
          </p>
        </div>
      </div>
    </div>
  );
}
EOF
ok "src/components/dm/StreakSheet.tsx"

# ────────────────────────────────────────────────────────────────
# src/components/dm/ConvoRow.tsx
# ────────────────────────────────────────────────────────────────
cat > src/components/dm/ConvoRow.tsx << 'EOF'
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
          <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text, truncate: "ellipsis" }}>
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
EOF
ok "src/components/dm/ConvoRow.tsx"

# ────────────────────────────────────────────────────────────────
# src/components/dm/MessageBubble.tsx
# ────────────────────────────────────────────────────────────────
cat > src/components/dm/MessageBubble.tsx << 'EOF'
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
EOF
ok "src/components/dm/MessageBubble.tsx"

# ────────────────────────────────────────────────────────────────
# src/app/(pages)/dm/page.tsx
# ────────────────────────────────────────────────────────────────
cat > "src/app/(pages)/dm/page.tsx" << 'EOF'
"use client";
import { useState, useRef, useEffect } from "react";
import { CONVOS, MESSAGES } from "@/data/dm";
import type { Conversation, Message } from "@/types/dm";
import ConvoRow from "@/components/dm/ConvoRow";
import MessageBubble from "@/components/dm/MessageBubble";
import ThreadStreakBar from "@/components/dm/ThreadStreakBar";
import AtRiskBanner from "@/components/dm/AtRiskBanner";
import StreakSheet from "@/components/dm/StreakSheet";

const C = {
  bg: "#07090D", surface: "#0D1219", raised: "#121A24",
  border: "#1A2535", text: "#E2EAF2", sub: "#7A95AE", muted: "#3D5268",
};

export default function DMPage() {
  const [convos,      setConvos]      = useState<Conversation[]>(CONVOS);
  const [activeId,    setActiveId]    = useState<string>("c1");
  const [messages,    setMessages]    = useState<Record<string, Message[]>>(MESSAGES);
  const [input,       setInput]       = useState("");
  const [streakSheet, setStreakSheet] = useState<Conversation | null>(null);
  const [dismissed,   setDismissed]   = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = convos.find(c => c.id === activeId)!;
  const thread = messages[activeId] ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, thread.length]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: `msg_${Date.now()}`,
      senderId: "me",
      text: input.trim(),
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }));
    setConvos(prev => prev.map(c => c.id === activeId ? { ...c, lastMsg: msg.text, ts: "Now" } : c));
    setInput("");
  };

  const showStreak = (id: string) => {
    const c = convos.find(cv => cv.id === id);
    if (c) setStreakSheet(c);
  };

  return (
    <div style={{
      display: "flex", height: "100vh", background: C.bg,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      color: C.text, overflow: "hidden",
    }}>
      <style>{`
        @keyframes owfFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes owfSlideUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes owfOwlFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes owfOwlPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1A2535; border-radius: 2px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 300, flexShrink: 0,
        borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        background: C.surface,
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 16px 12px",
          borderBottom: `1px solid ${C.border}`,
        }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>Messages</h2>
          <div style={{ marginTop: 8, position: "relative" }}>
            <input
              placeholder="Search…"
              style={{
                width: "100%", background: C.raised,
                border: `1px solid ${C.border}`, borderRadius: 8,
                padding: "7px 12px", fontSize: 13, color: C.text,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {convos.map(convo => (
            <ConvoRow
              key={convo.id}
              convo={convo}
              active={convo.id === activeId}
              onSelect={setActiveId}
              onOwlClick={showStreak}
            />
          ))}
        </div>
      </div>

      {/* ── THREAD ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Thread header */}
        <div style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 12,
          background: C.surface,
          flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg,#1A2535,#0D1219)",
            border: `1.5px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: C.sub,
          }}>{active.avatar}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{active.name}</div>
            {active.online && (
              <div style={{ fontSize: 11, color: "#00D4AA", marginTop: 1 }}>● Active now</div>
            )}
          </div>
        </div>

        {/* Streak bar */}
        <ThreadStreakBar convo={active} onOwlClick={() => showStreak(activeId)}/>

        {/* At-risk banner */}
        {!dismissed.has(activeId) && (
          <AtRiskBanner
            convo={active}
            onDismiss={() => setDismissed(prev => new Set([...prev, activeId]))}
          />
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {thread.map(msg => (
            <MessageBubble key={msg.id} msg={msg} isMe={msg.senderId === "me"}/>
          ))}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{
          padding: "12px 16px",
          borderTop: `1px solid ${C.border}`,
          background: C.surface,
          display: "flex", gap: 10, alignItems: "flex-end",
          flexShrink: 0,
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={`Message ${active.name}…`}
            rows={1}
            style={{
              flex: 1, background: C.raised,
              border: `1px solid ${C.border}`, borderRadius: 20,
              padding: "9px 14px", fontSize: 13.5, color: C.text,
              outline: "none", resize: "none", fontFamily: "inherit",
              lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: input.trim() ? "#1A65FF" : C.raised,
              border: `1px solid ${input.trim() ? "#1A65FF" : C.border}`,
              cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.15s",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                stroke={input.trim() ? "#fff" : C.muted}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── STREAK SHEET MODAL ── */}
      {streakSheet && (
        <StreakSheet convo={streakSheet} onClose={() => setStreakSheet(null)}/>
      )}
    </div>
  );
}
EOF
ok "src/app/(pages)/dm/page.tsx"

# ────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✔ OWF DM + Owl system installed — 11 files${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Files written:"
echo "    src/types/dm.ts"
echo "    src/data/dm.ts"
echo "    src/lib/streak.ts"
echo "    src/components/dm/OWFOwl.tsx      ← canonical owl SVG"
echo "    src/components/dm/OwlBadge.tsx"
echo "    src/components/dm/ThreadStreakBar.tsx"
echo "    src/components/dm/AtRiskBanner.tsx"
echo "    src/components/dm/StreakSheet.tsx"
echo "    src/components/dm/ConvoRow.tsx"
echo "    src/components/dm/MessageBubble.tsx"
echo "    src/app/(pages)/dm/page.tsx"
echo ""
echo "  OWFOwl SVG base (500×500 viewBox):"
echo "    Ear tufts, body ellipse, face disc, wings,"
echo "    closed Q-arc eyes, beak polygon,"
echo "    3 lens feather rows, feet ellipses"
echo ""
echo "  10 cycles auto from streakDays:"
echo "    city→lunar→frost→forest→fire"
echo "    →solar→storm→aurora→cosmic→mythic"
echo ""
echo "  Run: npm run dev  →  http://localhost:3000/dm"
echo ""