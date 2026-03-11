#!/usr/bin/env bash
# ============================================================
#  OWF — Definitive Owl System
#  10 cycles from canonical PDF spec
#  Proportions matched to Fire Owl reference image
#  Run from project root:  bash rebuild-owl.sh
# ============================================================
set -e
GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✔ WROTE${NC}  $1"; }
info() { echo -e "${CYAN}▸${NC} $1"; }
echo ""; info "Building definitive OWF Owl system (10 cycles)..."; echo ""

# ─────────────────────────────────────────────────────────────
# OWFOwl.tsx — The canonical owl SVG component
# ─────────────────────────────────────────────────────────────
cat > src/components/dm/OWFOwl.tsx << 'OWLEOF'
"use client";

// ═══════════════════════════════════════════════════════════════════
//  OWF OWL — Definitive SVG Component
//
//  10 Cycles (from canonical PDF spec):
//    1  City    — warm peach/tan, soft city glow
//    2  Lunar   — soft blue (#6A9DFF), moon badge, stars
//    3  Frost   — icy blue (#A9D6FF), frozen white (#EAF6FF)
//    4  Forest  — forest green (#4CAF50), floating leaves
//    5  Fire    — burning orange (#FF6A00), ember red (#B22222)
//    6  Solar   — golden sun, orange/amber
//    7  Storm   — electric blue (#3A86FF), storm gray (#2F3E46)
//    8  Aurora  — aurora green (#2AFFC6), violet (#8A2BE2)
//    9  Cosmic  — deep blue/purple (#5B6CFF), galaxy texture
//   10  Mythic  — teal (#00C2C7), mythic horns, arcane mist
//
//  Shape (from Fire Owl + base owl reference images):
//    • Very round chubby body — wide oval
//    • Wide face disc (~65% of body width) — lighter, overlaps top
//    • CLOSED eyes — two elegant curved arcs, calm expression
//    • Small triangular beak
//    • Rounded ear tufts (wider, softer than pointy)
//    • Feather scale rows on chest (3 rows of 3 arcs)
//    • Short wide feet with toe bumps
//    • Soft atmospheric glow halo
//    • Cycle-specific aura effects
// ═══════════════════════════════════════════════════════════════════

export type OwlCycle =
  | "city"    // Cycle 1
  | "lunar"   // Cycle 2
  | "frost"   // Cycle 3
  | "forest"  // Cycle 4
  | "fire"    // Cycle 5
  | "solar"   // Cycle 6
  | "storm"   // Cycle 7
  | "aurora"  // Cycle 8
  | "cosmic"  // Cycle 9
  | "mythic"  // Cycle 10

export type OwlMood    = "calm" | "happy" | "atRisk" | "broken"
export type OwlSizeKey = "mini" | "sm" | "md" | "lg" | "xl"

const SIZE_MAP: Record<OwlSizeKey, number> = {
  mini:22, sm:34, md:60, lg:96, xl:140,
};

interface Palette {
  // Aura / glow
  aura:       string;   // outer atmospheric glow
  aura2:      string;   // inner glow ring
  // Body
  bodyDark:   string;
  bodyMid:    string;
  bodyLight:  string;
  // Face disc
  faceDark:   string;
  faceMid:    string;
  faceLight:  string;
  // Details
  eye:        string;   // closed eye arc stroke
  beak:       string;
  feet:       string;
  feather:    string;   // chest feather scale stroke
  // Effects
  hasMythicHorns: boolean;
  hasFireAura:    boolean;
  hasStars:       boolean;
}

const PALETTES: Record<OwlCycle, Palette> = {
  city: {
    aura:"rgba(255,210,180,0.4)", aura2:"rgba(255,180,140,0.2)",
    bodyDark:"#B8724A", bodyMid:"#D4956A", bodyLight:"#E8B48A",
    faceDark:"#E8C8A8", faceMid:"#F5DEC8", faceLight:"#FFF5EE",
    eye:"#7A4A28", beak:"#F0821A", feet:"#F0821A", feather:"#C07848",
    hasMythicHorns:false, hasFireAura:false, hasStars:false,
  },
  lunar: {
    aura:"rgba(106,157,255,0.45)", aura2:"rgba(80,130,240,0.25)",
    bodyDark:"#1A4A7A", bodyMid:"#2A6AAA", bodyLight:"#4090C8",
    faceDark:"#70A8D8", faceMid:"#90C0E8", faceLight:"#D0E8FA",
    eye:"#123050", beak:"#3A70A0", feet:"#3A70A0", feather:"#2050808",
    hasMythicHorns:false, hasFireAura:false, hasStars:true,
  },
  frost: {
    aura:"rgba(169,214,255,0.5)", aura2:"rgba(200,235,255,0.3)",
    bodyDark:"#5A9AC0", bodyMid:"#80B8D8", bodyLight:"#B0D8F0",
    faceDark:"#C0E0F4", faceMid:"#D8EEF8", faceLight:"#EAF6FF",
    eye:"#2A6090", beak:"#7ABCE0", feet:"#7ABCE0", feather:"#5A9AC0",
    hasMythicHorns:false, hasFireAura:false, hasStars:true,
  },
  forest: {
    aura:"rgba(76,175,80,0.42)", aura2:"rgba(56,142,60,0.25)",
    bodyDark:"#1B5E20", bodyMid:"#2E7D32", bodyLight:"#4CAF50",
    faceDark:"#66BB6A", faceMid:"#81C784", faceLight:"#C8E6C9",
    eye:"#0D3B0F", beak:"#2E7D32", feet:"#2E7D32", feather:"#1B5E20",
    hasMythicHorns:false, hasFireAura:false, hasStars:false,
  },
  fire: {
    aura:"rgba(255,106,0,0.55)", aura2:"rgba(255,180,0,0.35)",
    bodyDark:"#7A1800", bodyMid:"#B22222", bodyLight:"#CC3300",
    faceDark:"#E85000", faceMid:"#FF6A00", faceLight:"#FFC300",
    eye:"#4A0800", beak:"#CC2000", feet:"#1A0A00", feather:"#8B1A00",
    hasMythicHorns:false, hasFireAura:true, hasStars:false,
  },
  solar: {
    aura:"rgba(255,193,7,0.5)", aura2:"rgba(255,160,0,0.3)",
    bodyDark:"#C07800", bodyMid:"#E89A00", bodyLight:"#F5B800",
    faceDark:"#FFD040", faceMid:"#FFE070", faceLight:"#FFF8C0",
    eye:"#804A00", beak:"#E06000", feet:"#E06000", feather:"#B07000",
    hasMythicHorns:false, hasFireAura:false, hasStars:false,
  },
  storm: {
    aura:"rgba(58,134,255,0.5)", aura2:"rgba(100,160,255,0.3)",
    bodyDark:"#1A2530", bodyMid:"#2F3E46", bodyLight:"#3D5060",
    faceDark:"#3060A0", faceMid:"#3A86FF", faceLight:"#80B4FF",
    eye:"#0A1520", beak:"#3A86FF", feet:"#3A86FF", feather:"#2F3E46",
    hasMythicHorns:false, hasFireAura:false, hasStars:true,
  },
  aurora: {
    aura:"rgba(42,255,198,0.48)", aura2:"rgba(138,43,226,0.3)",
    bodyDark:"#0B132B", bodyMid:"#1A2A60", bodyLight:"#2A4090",
    faceDark:"#2AFFC6", faceMid:"#60FFD8", faceLight:"#C0FFF0",
    eye:"#06402A", beak:"#2AFFC6", feet:"#8A2BE2", feather:"#1A2A60",
    hasMythicHorns:false, hasFireAura:false, hasStars:true,
  },
  cosmic: {
    aura:"rgba(91,108,255,0.5)", aura2:"rgba(120,80,220,0.3)",
    bodyDark:"#0A0A2A", bodyMid:"#1A1A5A", bodyLight:"#2A2A8A",
    faceDark:"#4040A0", faceMid:"#5B6CFF", faceLight:"#9090F0",
    eye:"#060618", beak:"#4040C0", feet:"#3030A0", feather:"#1A1A5A",
    hasMythicHorns:false, hasFireAura:false, hasStars:true,
  },
  mythic: {
    aura:"rgba(0,194,199,0.55)", aura2:"rgba(0,240,240,0.35)",
    bodyDark:"#003838", bodyMid:"#006868", bodyLight:"#00A8A8",
    faceDark:"#00C2C7", faceMid:"#00D8D8", faceLight:"#80F4F4",
    eye:"#001E1E", beak:"#00A0A0", feet:"#004848", feather:"#005858",
    hasMythicHorns:true, hasFireAura:false, hasStars:true,
  },
};

// Auto-pick cycle from streak days
function cycleFromDays(days: number): OwlCycle {
  if (days >= 365) return "mythic";
  if (days >= 200) return "cosmic";
  if (days >= 100) return "aurora";
  if (days >= 70)  return "storm";
  if (days >= 50)  return "solar";
  if (days >= 30)  return "fire";
  if (days >= 20)  return "forest";
  if (days >= 10)  return "frost";
  if (days >= 4)   return "lunar";
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
  size = "md",
  cycle = "city",
  mood = "calm",
  animate = false,
  streakDays,
}: Props) {
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const C = streakDays != null ? cycleFromDays(streakDays) : cycle;
  const p = PALETTES[C] ?? PALETTES.city;

  const cx = px / 2;
  const cy = px / 2;

  // ── Core proportions (from Fire Owl image) ──
  // Body: very wide and round
  const bRx = px * 0.355;       // body x-radius
  const bRy = px * 0.32;        // body y-radius  
  const bCY = cy + px * 0.1;    // body center Y (lower)

  // Face disc: very large, dominates upper body
  const fR  = px * 0.275;       // face radius
  const fCY = cy - px * 0.01;   // face center

  // Eyes: closed calm arcs
  const eOff = px * 0.083;      // from center
  const eY   = fCY - fR * 0.04;
  const eW   = fR * 0.34;       // arc half-width
  const eH   = fR * 0.19;       // arc height

  // Beak: small triangle
  const bkY = fCY + fR * 0.3;
  const bkW = px * 0.042;
  const bkH = px * 0.052;

  // Ear tufts: rounder/wider (like Fire Owl)
  const tY = fCY - fR * 0.9;

  // Chest feather scales
  const fsY1 = bCY - bRy * 0.3;  // row 1
  const fsY2 = bCY - bRy * 0.0;  // row 2
  const fsY3 = bCY + bRy * 0.28; // row 3
  const fsR  = px * 0.072;       // scale arc radius

  // Feet: short wide
  const ftY = bCY + bRy - px * 0.01;
  const ftW = px * 0.07;
  const ftH = px * 0.04;

  const isBroken = mood === "broken";
  const isAtRisk = mood === "atRisk";
  const uid = `owl_${px}_${C}_${mood}`;

  const anim = animate
    ? isAtRisk
      ? "owfOwlPulse 2s ease-in-out infinite"
      : "owfOwlFloat 3.5s ease-in-out infinite"
    : "none";

  // ── Fire aura paths (for fire cycle) ──
  const fireAura = p.hasFireAura ? [
    `M ${cx-bRx*0.9} ${bCY+bRy*0.3} Q ${cx-bRx*1.3} ${bCY-bRy*0.5} ${cx-bRx*0.85} ${bCY-bRy*1.1} Q ${cx-bRx*0.6} ${bCY-bRy*1.5} ${cx-bRx*0.3} ${bCY-bRy*1.8}`,
    `M ${cx+bRx*0.9} ${bCY+bRy*0.3} Q ${cx+bRx*1.3} ${bCY-bRy*0.5} ${cx+bRx*0.85} ${bCY-bRy*1.1} Q ${cx+bRx*0.6} ${bCY-bRy*1.5} ${cx+bRx*0.3} ${bCY-bRy*1.8}`,
    `M ${cx-bRx*0.4} ${bCY+bRy*0.1} Q ${cx-bRx*0.7} ${bCY-bRy*0.8} ${cx-bRx*0.35} ${bCY-bRy*1.6}`,
    `M ${cx+bRx*0.4} ${bCY+bRy*0.1} Q ${cx+bRx*0.7} ${bCY-bRy*0.8} ${cx+bRx*0.35} ${bCY-bRy*1.6}`,
    `M ${cx} ${bCY-bRy*0.6} Q ${cx-px*0.08} ${bCY-bRy*1.4} ${cx+px*0.04} ${bCY-bRy*1.85}`,
  ] : [];

  return (
    <svg
      width={px} height={px}
      viewBox={`0 0 ${px} ${px}`}
      fill="none"
      role="img"
      aria-label={`OWF Owl — Cycle ${C}, ${mood}`}
      style={{ display:"block", flexShrink:0, animation: anim }}
    >
      <defs>
        {/* Outer atmospheric halo */}
        <radialGradient id={`${uid}_aura`} cx="50%" cy="55%" r="50%">
          <stop offset="0%"   stopColor={p.aura2} />
          <stop offset="45%"  stopColor={p.aura}  />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Body — 3-stop gradient, lighter top */}
        <radialGradient id={`${uid}_body`} cx="42%" cy="25%" r="75%">
          <stop offset="0%"   stopColor={p.bodyLight} />
          <stop offset="55%"  stopColor={p.bodyMid}   />
          <stop offset="100%" stopColor={p.bodyDark}  />
        </radialGradient>

        {/* Face disc — bright center */}
        <radialGradient id={`${uid}_face`} cx="50%" cy="38%" r="62%">
          <stop offset="0%"   stopColor={p.faceLight} />
          <stop offset="55%"  stopColor={p.faceMid}   />
          <stop offset="100%" stopColor={p.faceDark}  />
        </radialGradient>

        {/* Fire inner glow */}
        {p.hasFireAura && (
          <radialGradient id={`${uid}_fire`} cx="50%" cy="60%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,200,0,0.6)"  />
            <stop offset="50%"  stopColor="rgba(255,100,0,0.4)"  />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        )}

        {/* Broken desaturate */}
        {isBroken && (
          <filter id={`${uid}_desat`}>
            <feColorMatrix type="saturate" values="0.15"/>
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.6"/>
              <feFuncG type="linear" slope="0.6"/>
              <feFuncB type="linear" slope="0.6"/>
            </feComponentTransfer>
          </filter>
        )}
      </defs>

      <g filter={isBroken ? `url(#${uid}_desat)` : undefined}>

        {/* ── 1. OUTER AURA HALO ── */}
        <ellipse cx={cx} cy={cy+px*0.02} rx={px*0.46} ry={px*0.45}
          fill={`url(#${uid}_aura)`}
        />

        {/* ── 2. FIRE AURA (fire cycle only) ── */}
        {p.hasFireAura && <>
          <ellipse cx={cx} cy={cy} rx={px*0.44} ry={px*0.44}
            fill={`url(#${uid}_fire)`}
          />
          {fireAura.map((d, i) => (
            <path key={i} d={d}
              stroke={i < 2 ? "#FF6A00" : "#FFC300"}
              strokeWidth={i < 2 ? px*0.032 : px*0.022}
              fill="none" strokeLinecap="round"
              opacity={0.85}
            />
          ))}
          {/* Ember sparks */}
          {[[cx-bRx*0.6, bCY-bRy*1.2], [cx+bRx*0.55, bCY-bRy*0.9],
            [cx-bRx*0.2, bCY-bRy*1.7], [cx+bRx*0.45, bCY-bRy*1.5],
            [cx-bRx*0.75, bCY-bRy*0.6], [cx+bRx*0.8, bCY-bRy*1.3],
          ].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={px*0.012}
              fill={i%2===0 ? "#FFC300" : "#FF6A00"} opacity={0.7}
            />
          ))}
        </>}

        {/* ── 3. STARS (lunar, frost, storm, aurora, cosmic, mythic) ── */}
        {p.hasStars && [
          [cx-bRx*0.55, cy-bRy*0.9], [cx+bRx*0.6, cy-bRy*0.7],
          [cx-bRx*0.2,  cy-bRy*1.1], [cx+bRx*0.25, cy-bRy*1.0],
          [cx+bRx*0.8,  cy-bRy*0.3], [cx-bRx*0.85, cy-bRy*0.2],
        ].map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy}
            r={i%3===0 ? px*0.018 : px*0.011}
            fill="rgba(255,255,255,0.65)"
          />
        ))}

        {/* ── 4. MYTHIC HORNS ── */}
        {p.hasMythicHorns && <>
          {/* Left horn */}
          <path
            d={`M ${cx-px*0.14} ${tY+px*0.02}
                Q ${cx-px*0.22} ${tY-px*0.12}
                  ${cx-px*0.13} ${tY-px*0.08}`}
            stroke={p.faceMid} strokeWidth={px*0.038}
            fill="none" strokeLinecap="round"
          />
          {/* Right horn */}
          <path
            d={`M ${cx+px*0.14} ${tY+px*0.02}
                Q ${cx+px*0.22} ${tY-px*0.12}
                  ${cx+px*0.13} ${tY-px*0.08}`}
            stroke={p.faceMid} strokeWidth={px*0.038}
            fill="none" strokeLinecap="round"
          />
        </>}

        {/* ── 5. EAR TUFTS (rounded, wider — like Fire Owl) ── */}
        {!p.hasMythicHorns && <>
          {/* Left tuft */}
          <path
            d={`M ${cx-px*0.175} ${tY+px*0.04}
                Q ${cx-px*0.175} ${tY-px*0.09}
                  ${cx-px*0.095} ${tY+px*0.01}`}
            fill={p.bodyMid}
          />
          {/* Right tuft */}
          <path
            d={`M ${cx+px*0.175} ${tY+px*0.04}
                Q ${cx+px*0.175} ${tY-px*0.09}
                  ${cx+px*0.095} ${tY+px*0.01}`}
            fill={p.bodyMid}
          />
        </>}

        {/* ── 6. BODY ── */}
        <ellipse cx={cx} cy={bCY} rx={bRx} ry={bRy}
          fill={`url(#${uid}_body)`}
        />

        {/* ── 7. FACE DISC ── */}
        <circle cx={cx} cy={fCY} r={fR}
          fill={`url(#${uid}_face)`}
        />

        {/* ── 8. FEATHER SCALE ROWS (3 rows × 3 arcs, like Fire Owl) ── */}
        {[
          { y: fsY1, count: 3, w: fsR * 1.1 },
          { y: fsY2, count: 3, w: fsR * 1.0 },
          { y: fsY3, count: 3, w: fsR * 0.85 },
        ].map((row, ri) => {
          const cols = [-1, 0, 1];
          return cols.map((col, ci) => {
            const sx = cx + col * row.w * 0.95;
            const hw = row.w * 0.52;
            const hh = row.w * 0.38;
            return (
              <path key={`${ri}_${ci}`}
                d={`M ${sx-hw} ${row.y} Q ${sx} ${row.y+hh} ${sx+hw} ${row.y}`}
                stroke={p.feather} strokeWidth={px*0.018}
                fill={p.bodyDark} fillOpacity={0.3}
                strokeLinecap="round"
              />
            );
          });
        })}

        {/* ── 9. CLOSED EYES — calm curved arcs ── */}
        {/* Left */}
        <path
          d={`M ${cx-eOff-eW} ${eY+eH*0.2}
              Q ${cx-eOff}     ${eY-eH}
                ${cx-eOff+eW}  ${eY+eH*0.2}`}
          stroke={isBroken ? p.feather : p.eye}
          strokeWidth={px*0.03} fill="none"
          strokeLinecap="round"
          opacity={isBroken ? 0.4 : 1}
        />
        {/* Right */}
        <path
          d={`M ${cx+eOff-eW} ${eY+eH*0.2}
              Q ${cx+eOff}     ${eY-eH}
                ${cx+eOff+eW}  ${eY+eH*0.2}`}
          stroke={isBroken ? p.feather : p.eye}
          strokeWidth={px*0.03} fill="none"
          strokeLinecap="round"
          opacity={isBroken ? 0.4 : 1}
        />

        {/* ── 10. BEAK — small downward triangle ── */}
        <polygon
          points={`${cx},${bkY+bkH} ${cx-bkW},${bkY} ${cx+bkW},${bkY}`}
          fill={p.beak}
        />

        {/* ── 11. FEET — wide with toe bumps ── */}
        {/* Left foot */}
        <ellipse cx={cx-px*0.1} cy={ftY} rx={ftW} ry={ftH} fill={p.feet} />
        {/* Toe bumps left */}
        {[-0.115,-0.085,-0.06].map((ox,i) => (
          <circle key={i} cx={cx+ox*px} cy={ftY-ftH*0.1} r={ftH*0.5} fill={p.feet} />
        ))}
        {/* Right foot */}
        <ellipse cx={cx+px*0.1} cy={ftY} rx={ftW} ry={ftH} fill={p.feet} />
        {/* Toe bumps right */}
        {[0.06,0.085,0.115].map((ox,i) => (
          <circle key={i} cx={cx+ox*px} cy={ftY-ftH*0.1} r={ftH*0.5} fill={p.feet} />
        ))}

        {/* ── 12. BROKEN CRACKS ── */}
        {isBroken && <>
          <line x1={cx-px*0.035} y1={fCY-fR*0.6}
                x2={cx-px*0.09}  y2={fCY+fR*0.15}
            stroke="rgba(200,180,160,0.4)" strokeWidth={px*0.014}
            strokeDasharray="3,2.5" strokeLinecap="round"
          />
          <line x1={cx+px*0.02} y1={fCY-fR*0.5}
                x2={cx+px*0.07} y2={fCY+fR*0.1}
            stroke="rgba(200,180,160,0.25)" strokeWidth={px*0.01}
            strokeDasharray="2.5,2" strokeLinecap="round"
          />
        </>}

        {/* ── 13. AT-RISK AMBER DASHED RING ── */}
        {isAtRisk && (
          <ellipse cx={cx} cy={cy+px*0.02} rx={px*0.44} ry={px*0.44}
            stroke="rgba(245,158,11,0.65)"
            strokeWidth={px*0.018} fill="none"
            strokeDasharray={`${px*0.065} ${px*0.032}`}
          />
        )}

      </g>
    </svg>
  );
}
OWLEOF
ok "src/components/dm/OWFOwl.tsx"

# ─────────────────────────────────────────────────────────────
# Update all DM components
# ─────────────────────────────────────────────────────────────

cat > src/components/dm/OwlBadge.tsx << 'EOF'
"use client";
import { getStreakTier, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OWFOwl, { type OwlCycle, type OwlMood } from "./OWFOwl";

function props(c: Conversation): { cycle: OwlCycle; mood: OwlMood } {
  if (c.broken) return { cycle:"city",  mood:"broken"  };
  if (c.atRisk) return { cycle:"fire",  mood:"atRisk"  };
  const t = getStreakTier(c.streak);
  if (t==="high") return { cycle:"solar", mood:"happy" };
  if (t==="mid")  return { cycle:"lunar", mood:"happy" };
  return           { cycle:"city",  mood:"calm"   };
}

interface P { convo: Conversation; onClick?: () => void; }

export default function OwlBadge({ convo, onClick }: P) {
  if (!convo.streak && !convo.broken) return null;
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  if (!label) return null;
  const { cycle, mood } = props(convo);
  const col = convo.broken ? "#3D5268" : convo.atRisk ? "#F59E0B" : "#E8B84B";
  return (
    <div onClick={e=>{e.stopPropagation();onClick?.();}} title={label.long}
      style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",padding:"2px 4px",borderRadius:6,transition:"background 0.15s"}}
      onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}
      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
    >
      <OWFOwl size={28} cycle={cycle} mood={mood} animate={convo.atRisk} streakDays={convo.streak??0} />
      <span style={{fontSize:11,fontWeight:700,color:col,whiteSpace:"nowrap"}}>{label.short}</span>
    </div>
  );
}
EOF
ok "src/components/dm/OwlBadge.tsx"

cat > src/components/dm/ThreadStreakBar.tsx << 'EOF'
"use client";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OWFOwl, { type OwlCycle, type OwlMood } from "./OWFOwl";

const C = { border:"#1A2535", muted:"#3D5268", gold:"#E8B84B" };

function props(c: Conversation): { cycle: OwlCycle; mood: OwlMood } {
  if (c.broken) return { cycle:"city",  mood:"broken" };
  if (c.atRisk) return { cycle:"fire",  mood:"atRisk" };
  const t = getStreakTier(c.streak);
  if (t==="high") return { cycle:"solar", mood:"happy" };
  if (t==="mid")  return { cycle:"lunar", mood:"happy" };
  return           { cycle:"city",  mood:"calm"  };
}

interface P { convo: Conversation; onOwlClick: () => void; }

export default function ThreadStreakBar({ convo, onOwlClick }: P) {
  if (!convo.streak && !convo.broken) return null;
  const tier  = getStreakTier(convo.streak);
  const oc    = getOwlColors(tier, convo.atRisk, convo.broken);
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  if (!label) return null;
  const { cycle, mood } = props(convo);
  const col = convo.broken ? C.muted : convo.atRisk ? "#F59E0B" : C.gold;
  return (
    <div onClick={onOwlClick}
      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"8px 20px",background:`radial-gradient(ellipse at 50% 100%, ${oc.haloStrong} 0%, transparent 80%)`,borderBottom:`1px solid ${C.border}`,cursor:"pointer",transition:"background 0.2s"}}
      onMouseEnter={e=>(e.currentTarget.style.background=`radial-gradient(ellipse at 50% 100%, ${oc.halo} 0%, transparent 80%)`)}
      onMouseLeave={e=>(e.currentTarget.style.background=`radial-gradient(ellipse at 50% 100%, ${oc.haloStrong} 0%, transparent 80%)`)}
    >
      <OWFOwl size={44} cycle={cycle} mood={mood} animate streakDays={convo.streak??0} />
      <div>
        <span style={{fontSize:13,fontWeight:700,color:col}}>{label.short}</span>
        {convo.atRisk && <span style={{fontSize:11,color:"#F59E0B",marginLeft:8}}>· Ends today</span>}
        {convo.broken && <span style={{fontSize:11,color:C.muted,marginLeft:8}}>· Tap to see history</span>}
        {!convo.atRisk && !convo.broken && <span style={{fontSize:11,color:C.muted,marginLeft:8}}>· Tap to see details</span>}
      </div>
    </div>
  );
}
EOF
ok "src/components/dm/ThreadStreakBar.tsx"

cat > src/components/dm/AtRiskBanner.tsx << 'EOF'
"use client";
import type { Conversation } from "@/types/dm";
import OWFOwl from "./OWFOwl";
interface P { convo: Conversation; onDismiss: () => void; }
export default function AtRiskBanner({ convo, onDismiss }: P) {
  if (!convo.atRisk) return null;
  return (
    <div style={{margin:"0 16px 12px",background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10,padding:"9px 14px",display:"flex",alignItems:"center",gap:10,animation:"owfFadeIn 0.3s ease"}}>
      <OWFOwl size={34} cycle="fire" mood="atRisk" animate />
      <span style={{fontSize:12.5,color:"#F59E0B",flex:1,lineHeight:1.5}}>Your streak ends today if you both don't send a message.</span>
      <button onClick={onDismiss} style={{background:"none",border:"none",color:"#3D5268",cursor:"pointer",fontSize:16,padding:2,fontFamily:"inherit"}}>×</button>
    </div>
  );
}
EOF
ok "src/components/dm/AtRiskBanner.tsx"

cat > src/components/dm/StreakSheet.tsx << 'EOF'
"use client";
import { useEffect } from "react";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OWFOwl, { type OwlCycle, type OwlMood } from "./OWFOwl";

const C = {surface:"#0D1219",border:"#1A2535",text:"#E2EAF2",sub:"#7A95AE",muted:"#3D5268",gold:"#E8B84B",aurora:"#00D4AA"};

function props(c: Conversation): { cycle: OwlCycle; mood: OwlMood } {
  if (c.broken) return { cycle:"city",  mood:"broken" };
  if (c.atRisk) return { cycle:"fire",  mood:"atRisk" };
  const t = getStreakTier(c.streak);
  if (t==="high") return { cycle:"solar", mood:"happy" };
  if (t==="mid")  return { cycle:"lunar", mood:"happy" };
  return           { cycle:"city",  mood:"calm"  };
}

interface P { convo: Conversation; onClose: () => void; }

export default function StreakSheet({ convo, onClose }: P) {
  const tier  = getStreakTier(convo.streak);
  const oc    = getOwlColors(tier, convo.atRisk, convo.broken);
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  const days  = convo.streak || 0;
  const { cycle, mood } = props(convo);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    document.body.style.overflow="hidden";
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow=""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:3000,background:"rgba(4,7,11,0.9)",backdropFilter:"blur(16px)",display:"flex",alignItems:"flex-end",justifyContent:"center",padding:20,animation:"owfFadeIn 0.2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,marginBottom:20,background:C.surface,border:`1px solid ${C.border}`,borderRadius:28,overflow:"hidden",boxShadow:`0 0 80px ${oc.halo}, 0 24px 48px rgba(0,0,0,0.8)`,animation:"owfSlideUp 0.35s cubic-bezier(0.34,1.4,0.64,1)"}}>
        <div style={{padding:"40px 0 24px",background:`radial-gradient(ellipse at 50% 55%, ${oc.halo} 0%, transparent 65%)`,display:"flex",flexDirection:"column",alignItems:"center",gap:14,position:"relative"}}>
          <OWFOwl size={130} cycle={cycle} mood={mood} animate streakDays={convo.streak??0} />
          <div style={{textAlign:"center",padding:"0 32px"}}>
            {convo.broken ? (<><div style={{fontSize:22,fontWeight:900,color:C.muted}}>Streak ended</div><div style={{fontSize:14,color:C.muted,marginTop:4}}>You reached a {convo.lastStreak}-day streak together.</div></>)
            : convo.atRisk ? (<><div style={{fontSize:24,fontWeight:900,color:"#F59E0B"}}>{days}-day streak</div><div style={{fontSize:14,color:C.sub,marginTop:4}}>⚠ Your streak ends today if you both don't send a message.</div></>)
            : (<><div style={{fontSize:36,fontWeight:900,color:C.gold,letterSpacing:"-0.03em"}}>{days} days</div><div style={{fontSize:14,color:C.sub,marginTop:6,lineHeight:1.6}}>{label?.long}</div></>)}
          </div>
          <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border}`,borderRadius:"50%",width:30,height:30,cursor:"pointer",color:C.muted,fontSize:17,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"0 24px 28px"}}>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:18,display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:13,color:C.sub}}>Both send at least one message daily</span>
              <span style={{fontSize:13,fontWeight:700,color:convo.broken?C.muted:C.aurora}}>{convo.broken?"—":"✓ Active"}</span>
            </div>
            {convo.started&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:C.sub}}>Streak started</span><span style={{fontSize:13,fontWeight:600,color:C.text}}>{convo.started}</span></div>}
            {convo.longest&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:C.sub}}>Longest streak together</span><span style={{fontSize:13,fontWeight:600,color:C.gold}}>{convo.longest} days</span></div>}
          </div>
          {convo.atRisk&&<div style={{marginTop:18,background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10,padding:"11px 14px"}}><p style={{margin:0,fontSize:12.5,color:"#F59E0B",lineHeight:1.55}}>To keep this streak, you both need to send at least one message today.</p></div>}
          <p style={{margin:"18px 0 0",textAlign:"center",fontSize:11,color:C.muted,lineHeight:1.6}}>This owl lights up when you keep the conversation going daily.<br/>Streaks are visible only to the two of you.</p>
        </div>
      </div>
    </div>
  );
}
EOF
ok "src/components/dm/StreakSheet.tsx"

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  OWF Owl — Definitive 10-cycle system installed${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Cycle Ladder:"
echo "   1  City   → 4d+   2  Lunar  → 10d+"
echo "   3  Frost  → 20d+  4  Forest → 30d+"
echo "   5  Fire   → 50d+  6  Solar  → 70d+"
echo "   7  Storm  → 100d+ 8  Aurora → 200d+"
echo "   9  Cosmic → 365d+ 10 Mythic"
echo ""
echo "  Shape: chubby body, large face disc, calm closed eyes,"
echo "  feather scale rows, wide feet with toe bumps,"
echo "  fire aura on Fire Owl, mythic horns on Mythic Owl"
echo ""
echo "  Run:  npm run dev"
echo ""