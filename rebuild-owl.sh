#!/usr/bin/env bash
# ============================================================
#  OWF — Canonical Owl (matches reference images exactly)
#  Run from project root:  bash rebuild-owl.sh
# ============================================================
set -e
GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✔ WROTE${NC}  $1"; }
info() { echo -e "${CYAN}▸${NC} $1"; }

echo ""; info "Building canonical OWF Owl from reference images..."; echo ""

cat > src/components/dm/OWFOwl.tsx << 'OWLEOF'
"use client";

// ─────────────────────────────────────────────────────────────────────────────
// OWF OWL — Canonical SVG (pixel-matched to reference images)
//
// Structure (from image 1 — base owl):
//   • Soft atmospheric halo circle (outermost)
//   • Two small pointed ear tufts on top of head
//   • Round chubby body (ellipse, slightly taller than wide)
//   • One visible wing on right — layered darker feather shape
//   • Very large face disc (~60% of body width) — lighter color, overlaps body top
//   • Two subtle cheek blush ellipses
//   • Two CLOSED eye arcs — elegant curved lines, calm expression
//   • Small teardrop beak centered below eyes
//   • 3 small curved chest tick marks on belly
//   • Two rounded feet at bottom with toe dividers
//
// Cycles match the badge images:
//   default → warm peach/tan (image 1, image 11)
//   solar   → orange/gold    (image 8 - Solar Owl)
//   lunar   → steel blue     (image 2/9 - Lunar Glow)
//   forest  → green          (image 6 - Forest Owl)
//   cosmic  → deep blue      (image 7 - Cosmic Owl)
//   mythic  → teal glow      (image 4 - Mythic Owl)
//   purple  → purple/violet  (image 3/5 - constellation)
// ─────────────────────────────────────────────────────────────────────────────

export type OwlCycle   = "default" | "solar" | "lunar" | "forest" | "cosmic" | "mythic" | "purple"
export type OwlMood    = "calm" | "happy" | "atRisk" | "broken"
export type OwlSizeKey = "mini" | "sm" | "md" | "lg" | "xl"

const SIZE_MAP: Record<OwlSizeKey, number> = {
  mini: 22, sm: 32, md: 56, lg: 90, xl: 130,
};

interface Palette {
  halo:      string;
  body:      string;
  bodyLight: string;
  face:      string;
  faceLight: string;
  eye:       string;
  beak:      string;
  wing:      string;
  wingLight: string;
  feet:      string;
  chest:     string;
  blush:     string;
}

const PALETTES: Record<OwlCycle, Palette> = {
  default: {
    halo:      "rgba(255,200,160,0.35)",
    body:      "#D4956A",   bodyLight: "#E8B48A",
    face:      "#F5DEC8",   faceLight: "#FFF5EE",
    eye:       "#7A4A28",
    beak:      "#F0821A",
    wing:      "#A0623A",   wingLight: "#C07848",
    feet:      "#F0821A",
    chest:     "#C07848",
    blush:     "rgba(220,140,100,0.2)",
  },
  solar: {
    halo:      "rgba(255,180,0,0.4)",
    body:      "#E8960A",   bodyLight: "#F5B828",
    face:      "#FFE070",   faceLight: "#FFFAC0",
    eye:       "#A05010",
    beak:      "#E86010",
    wing:      "#C07208",   wingLight: "#E09018",
    feet:      "#E86010",
    chest:     "#B06008",
    blush:     "rgba(240,150,20,0.22)",
  },
  lunar: {
    halo:      "rgba(70,110,190,0.38)",
    body:      "#2A5A8A",   bodyLight: "#4080B8",
    face:      "#90C0E0",   faceLight: "#D8EEFA",
    eye:       "#183A5C",
    beak:      "#3A6A90",
    wing:      "#1E4068",   wingLight: "#30609A",
    feet:      "#3A6A90",
    chest:     "#1E4068",
    blush:     "rgba(80,140,200,0.2)",
  },
  forest: {
    halo:      "rgba(50,160,50,0.32)",
    body:      "#1A6828",   bodyLight: "#2A9040",
    face:      "#80D048",   faceLight: "#C8F07A",
    eye:       "#0E4018",
    beak:      "#1A6028",
    wing:      "#0E4818",   wingLight: "#1E6830",
    feet:      "#1A6028",
    chest:     "#0E4818",
    blush:     "rgba(80,200,60,0.2)",
  },
  cosmic: {
    halo:      "rgba(40,60,180,0.42)",
    body:      "#1C1C6A",   bodyLight: "#2C2CA0",
    face:      "#5858C0",   faceLight: "#9090E0",
    eye:       "#0C0C3A",
    beak:      "#3030A0",
    wing:      "#121258",   wingLight: "#222290",
    feet:      "#2828A0",
    chest:     "#121258",
    blush:     "rgba(80,80,220,0.2)",
  },
  mythic: {
    halo:      "rgba(0,220,220,0.5)",
    body:      "#0A5858",   bodyLight: "#0A9898",
    face:      "#20D8D8",   faceLight: "#88F4F4",
    eye:       "#003838",
    beak:      "#10A0A0",
    wing:      "#064848",   wingLight: "#0A7878",
    feet:      "#10A0A0",
    chest:     "#064848",
    blush:     "rgba(0,200,200,0.22)",
  },
  purple: {
    halo:      "rgba(120,60,200,0.42)",
    body:      "#4A1A8A",   bodyLight: "#7030C0",
    face:      "#9858D8",   faceLight: "#C898F8",
    eye:       "#200840",
    beak:      "#E8C840",
    wing:      "#380E6A",   wingLight: "#5A20A0",
    feet:      "#6828B0",
    chest:     "#380E6A",
    blush:     "rgba(140,80,220,0.22)",
  },
};

function cycleFromDays(days: number): OwlCycle {
  if (days >= 100) return "mythic";
  if (days >= 50)  return "cosmic";
  if (days >= 30)  return "lunar";
  if (days >= 10)  return "solar";
  return "default";
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
  cycle = "default",
  mood = "calm",
  animate = false,
  streakDays,
}: Props) {
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const activeCycle = streakDays != null ? cycleFromDays(streakDays) : cycle;
  const p = PALETTES[activeCycle] ?? PALETTES.default;

  const cx  = px / 2;
  const cy  = px / 2;

  // Body — round chubby oval, slightly taller
  const bRx = px * 0.365;
  const bRy = px * 0.345;
  const bCY = cy + px * 0.09;

  // Face disc — very large, overlapping top of body
  const fR  = px * 0.285;
  const fCY = cy - px * 0.02;

  // Eyes — closed arcs, calm
  const eOff = px * 0.088;  // horizontal offset from center
  const eY   = fCY - fR * 0.05;
  const eArcW = fR * 0.36;
  const eArcH = fR * 0.2;

  // Beak — small teardrop
  const beakCY = fCY + fR * 0.28;
  const beakW  = px * 0.048;
  const beakH  = px * 0.065;

  // Ear tufts
  const tuffY  = fCY - fR - px * 0.01;

  // Wing (right, visible)
  const wCX = cx + bRx * 0.76;
  const wCY = bCY - px * 0.02;

  // Feet
  const feetY = bCY + bRy - px * 0.005;
  const fW    = px * 0.062;
  const fH    = px * 0.042;

  // Chest ticks
  const tY  = bCY + px * 0.01;
  const tL  = px * 0.042;

  const isBroken = mood === "broken";
  const isAtRisk = mood === "atRisk";
  const uid = `owl_${px}_${activeCycle}`;

  const anim = animate
    ? isAtRisk ? "owfOwlPulse 2s ease-in-out infinite"
    : "owfOwlFloat 3.5s ease-in-out infinite"
    : "none";

  return (
    <svg
      width={px} height={px}
      viewBox={`0 0 ${px} ${px}`}
      fill="none"
      role="img"
      aria-label={`OWF Owl — ${mood} ${activeCycle}`}
      style={{ display:"block", flexShrink:0, animation: anim }}
    >
      <defs>
        <radialGradient id={`${uid}_halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={p.halo.replace(/[\d.]+\)$/, "0.6)")} />
          <stop offset="50%"  stopColor={p.halo} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={`${uid}_body`} cx="40%" cy="28%" r="72%">
          <stop offset="0%"   stopColor={p.bodyLight} />
          <stop offset="100%" stopColor={p.body} />
        </radialGradient>
        <radialGradient id={`${uid}_face`} cx="50%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={p.faceLight} />
          <stop offset="60%"  stopColor={p.face} />
          <stop offset="100%" stopColor={p.body} stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id={`${uid}_wing`} cx="35%" cy="25%" r="70%">
          <stop offset="0%"   stopColor={p.wingLight} />
          <stop offset="100%" stopColor={p.wing} />
        </radialGradient>
        {isBroken && (
          <filter id={`${uid}_desat`}>
            <feColorMatrix type="saturate" values="0.18" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.65" />
              <feFuncG type="linear" slope="0.65" />
              <feFuncB type="linear" slope="0.65" />
            </feComponentTransfer>
          </filter>
        )}
      </defs>

      <g filter={isBroken ? `url(#${uid}_desat)` : undefined}>

        {/* ── HALO ── */}
        <circle cx={cx} cy={cy} r={px * 0.46} fill={`url(#${uid}_halo)`} />

        {/* ── EAR TUFTS ── */}
        <path d={`M ${cx-px*0.155} ${tuffY} L ${cx-px*0.115} ${tuffY-px*0.1} L ${cx-px*0.065} ${tuffY}`} fill={p.body} />
        <path d={`M ${cx+px*0.065} ${tuffY} L ${cx+px*0.115} ${tuffY-px*0.1} L ${cx+px*0.155} ${tuffY}`} fill={p.body} />

        {/* ── BODY ── */}
        <ellipse cx={cx} cy={bCY} rx={bRx} ry={bRy} fill={`url(#${uid}_body)`} />

        {/* ── WING (right, visible) ── */}
        <ellipse cx={wCX+px*0.01} cy={wCY+px*0.025} rx={px*0.11} ry={px*0.17}
          fill={p.wing} transform={`rotate(16 ${wCX} ${wCY})`} />
        <ellipse cx={wCX} cy={wCY} rx={px*0.082} ry={px*0.13}
          fill={`url(#${uid}_wing)`} transform={`rotate(16 ${wCX} ${wCY})`} />
        {/* Feather edge lines */}
        {[0,1,2].map(i => (
          <path key={i}
            d={`M ${wCX-px*0.062+i*px*0.018} ${wCY+px*0.032+i*px*0.036}
                Q ${wCX+px*0.008}              ${wCY+px*0.058+i*px*0.036}
                  ${wCX+px*0.062-i*px*0.01}   ${wCY+px*0.032+i*px*0.036}`}
            stroke={p.wing} strokeWidth={px*0.011}
            fill="none" strokeLinecap="round" opacity={0.55}
          />
        ))}

        {/* ── FACE DISC ── */}
        <circle cx={cx} cy={fCY} r={fR} fill={`url(#${uid}_face)`} />

        {/* ── BLUSH ── */}
        <ellipse cx={cx-fR*0.54} cy={fCY+fR*0.3} rx={fR*0.17} ry={fR*0.1} fill={p.blush} />
        <ellipse cx={cx+fR*0.54} cy={fCY+fR*0.3} rx={fR*0.17} ry={fR*0.1} fill={p.blush} />

        {/* ── CLOSED EYES ── */}
        <path
          d={`M ${cx-eOff-eArcW} ${eY+eArcH*0.25}
              Q ${cx-eOff}        ${eY-eArcH}
                ${cx-eOff+eArcW}  ${eY+eArcH*0.25}`}
          stroke={isBroken ? p.chest : p.eye}
          strokeWidth={px*0.027} fill="none" strokeLinecap="round"
          opacity={isBroken ? 0.45 : 1}
        />
        <path
          d={`M ${cx+eOff-eArcW} ${eY+eArcH*0.25}
              Q ${cx+eOff}        ${eY-eArcH}
                ${cx+eOff+eArcW}  ${eY+eArcH*0.25}`}
          stroke={isBroken ? p.chest : p.eye}
          strokeWidth={px*0.027} fill="none" strokeLinecap="round"
          opacity={isBroken ? 0.45 : 1}
        />

        {/* ── BEAK — teardrop ── */}
        <path
          d={`M ${cx} ${beakCY}
              Q ${cx-beakW} ${beakCY+beakH*0.5} ${cx} ${beakCY+beakH}
              Q ${cx+beakW} ${beakCY+beakH*0.5} ${cx} ${beakCY}`}
          fill={p.beak}
        />

        {/* ── CHEST TICKS ── */}
        {[{x:cx-px*0.065,y:tY},{x:cx,y:tY+px*0.055},{x:cx+px*0.065,y:tY}].map((t,i)=>(
          <path key={i}
            d={`M ${t.x-tL*0.55} ${t.y} Q ${t.x} ${t.y+tL*0.75} ${t.x+tL*0.55} ${t.y}`}
            stroke={p.chest} strokeWidth={px*0.021}
            fill="none" strokeLinecap="round" opacity={0.55}
          />
        ))}

        {/* ── FEET ── */}
        <ellipse cx={cx-px*0.09} cy={feetY} rx={fW} ry={fH} fill={p.feet} />
        <line x1={cx-px*0.108} y1={feetY-fH*0.3} x2={cx-px*0.108} y2={feetY+fH*0.6}
          stroke={p.wing} strokeWidth={px*0.011} opacity={0.5} />
        <line x1={cx-px*0.072} y1={feetY-fH*0.3} x2={cx-px*0.072} y2={feetY+fH*0.6}
          stroke={p.wing} strokeWidth={px*0.011} opacity={0.5} />
        <ellipse cx={cx+px*0.09} cy={feetY} rx={fW} ry={fH} fill={p.feet} />
        <line x1={cx+px*0.072} y1={feetY-fH*0.3} x2={cx+px*0.072} y2={feetY+fH*0.6}
          stroke={p.wing} strokeWidth={px*0.011} opacity={0.5} />
        <line x1={cx+px*0.108} y1={feetY-fH*0.3} x2={cx+px*0.108} y2={feetY+fH*0.6}
          stroke={p.wing} strokeWidth={px*0.011} opacity={0.5} />

        {/* ── BROKEN CRACKS ── */}
        {isBroken && <>
          <line x1={cx-px*0.03} y1={fCY-fR*0.55} x2={cx-px*0.08} y2={fCY+fR*0.18}
            stroke="rgba(180,160,140,0.4)" strokeWidth={px*0.013} strokeDasharray="3,2" strokeLinecap="round"/>
          <line x1={cx+px*0.02} y1={fCY-fR*0.45} x2={cx+px*0.065} y2={fCY+fR*0.12}
            stroke="rgba(180,160,140,0.25)" strokeWidth={px*0.009} strokeDasharray="2.5,2" strokeLinecap="round"/>
        </>}

        {/* ── AT-RISK AMBER RING ── */}
        {isAtRisk && (
          <circle cx={cx} cy={cy} r={px*0.44}
            stroke="rgba(245,158,11,0.6)"
            strokeWidth={px*0.017} fill="none"
            strokeDasharray={`${px*0.065} ${px*0.032}`}
          />
        )}

      </g>
    </svg>
  );
}
OWLEOF
ok "src/components/dm/OWFOwl.tsx"

# ── OwlBadge ─────────────────────────────────────────────────
cat > src/components/dm/OwlBadge.tsx << 'EOF'
"use client";
import { getStreakTier, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OWFOwl, { type OwlCycle, type OwlMood } from "./OWFOwl";

function getProps(c: Conversation): { cycle: OwlCycle; mood: OwlMood } {
  if (c.broken)                         return { cycle:"default", mood:"broken"  };
  if (c.atRisk)                         return { cycle:"solar",   mood:"atRisk"  };
  const t = getStreakTier(c.streak);
  if (t === "high")                     return { cycle:"solar",   mood:"happy"   };
  if (t === "mid")                      return { cycle:"default", mood:"happy"   };
  return                                       { cycle:"default", mood:"calm"    };
}

interface Props { convo: Conversation; onClick?: () => void; }

export default function OwlBadge({ convo, onClick }: Props) {
  if (!convo.streak && !convo.broken) return null;
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  if (!label) return null;
  const { cycle, mood } = getProps(convo);
  const col = convo.broken ? "#3D5268" : convo.atRisk ? "#F59E0B" : "#E8B84B";
  return (
    <div onClick={e=>{e.stopPropagation();onClick?.();}} title={label.long}
      style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",padding:"2px 4px",borderRadius:6,transition:"background 0.15s"}}
      onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.05)")}
      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
    >
      <OWFOwl size={26} cycle={cycle} mood={mood} animate={convo.atRisk} streakDays={convo.streak??0} />
      <span style={{fontSize:11,fontWeight:700,color:col,whiteSpace:"nowrap"}}>{label.short}</span>
    </div>
  );
}
EOF
ok "src/components/dm/OwlBadge.tsx"

# ── ThreadStreakBar ───────────────────────────────────────────
cat > src/components/dm/ThreadStreakBar.tsx << 'EOF'
"use client";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OWFOwl, { type OwlCycle, type OwlMood } from "./OWFOwl";

const C = { border:"#1A2535", muted:"#3D5268", gold:"#E8B84B" };

function getProps(c: Conversation): { cycle: OwlCycle; mood: OwlMood } {
  if (c.broken)                       return { cycle:"default", mood:"broken" };
  if (c.atRisk)                       return { cycle:"solar",   mood:"atRisk" };
  const t = getStreakTier(c.streak);
  if (t === "high")                   return { cycle:"solar",   mood:"happy"  };
  if (t === "mid")                    return { cycle:"default", mood:"happy"  };
  return                                     { cycle:"default", mood:"calm"   };
}

interface Props { convo: Conversation; onOwlClick: () => void; }

export default function ThreadStreakBar({ convo, onOwlClick }: Props) {
  if (!convo.streak && !convo.broken) return null;
  const tier  = getStreakTier(convo.streak);
  const oc    = getOwlColors(tier, convo.atRisk, convo.broken);
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  if (!label) return null;
  const { cycle, mood } = getProps(convo);
  const col = convo.broken ? C.muted : convo.atRisk ? "#F59E0B" : C.gold;
  return (
    <div onClick={onOwlClick} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"8px 20px",background:`radial-gradient(ellipse at 50% 100%, ${oc.haloStrong} 0%, transparent 80%)`,borderBottom:`1px solid ${C.border}`,cursor:"pointer",transition:"background 0.2s"}}
      onMouseEnter={e=>(e.currentTarget.style.background=`radial-gradient(ellipse at 50% 100%, ${oc.halo} 0%, transparent 80%)`)}
      onMouseLeave={e=>(e.currentTarget.style.background=`radial-gradient(ellipse at 50% 100%, ${oc.haloStrong} 0%, transparent 80%)`)}
    >
      <OWFOwl size={42} cycle={cycle} mood={mood} animate streakDays={convo.streak??0} />
      <div>
        <span style={{fontSize:13,fontWeight:700,color:col}}>{label.short}</span>
        {convo.atRisk  && <span style={{fontSize:11,color:"#F59E0B",marginLeft:8}}>· Ends today</span>}
        {convo.broken  && <span style={{fontSize:11,color:C.muted,marginLeft:8}}>· Tap to see history</span>}
        {!convo.atRisk && !convo.broken && <span style={{fontSize:11,color:C.muted,marginLeft:8}}>· Tap to see details</span>}
      </div>
    </div>
  );
}
EOF
ok "src/components/dm/ThreadStreakBar.tsx"

# ── AtRiskBanner ─────────────────────────────────────────────
cat > src/components/dm/AtRiskBanner.tsx << 'EOF'
"use client";
import type { Conversation } from "@/types/dm";
import OWFOwl from "./OWFOwl";
interface Props { convo: Conversation; onDismiss: () => void; }
export default function AtRiskBanner({ convo, onDismiss }: Props) {
  if (!convo.atRisk) return null;
  return (
    <div style={{margin:"0 16px 12px",background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10,padding:"9px 14px",display:"flex",alignItems:"center",gap:10,animation:"owfFadeIn 0.3s ease"}}>
      <OWFOwl size={32} cycle="solar" mood="atRisk" animate />
      <span style={{fontSize:12.5,color:"#F59E0B",flex:1,lineHeight:1.5}}>Your streak ends today if you both don't send a message.</span>
      <button onClick={onDismiss} style={{background:"none",border:"none",color:"#3D5268",cursor:"pointer",fontSize:16,padding:2,fontFamily:"inherit"}}>×</button>
    </div>
  );
}
EOF
ok "src/components/dm/AtRiskBanner.tsx"

# ── StreakSheet ───────────────────────────────────────────────
cat > src/components/dm/StreakSheet.tsx << 'EOF'
"use client";
import { useEffect } from "react";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import OWFOwl, { type OwlCycle, type OwlMood } from "./OWFOwl";
const C = {surface:"#0D1219",border:"#1A2535",text:"#E2EAF2",sub:"#7A95AE",muted:"#3D5268",gold:"#E8B84B",aurora:"#00D4AA"};
function getProps(c: Conversation): { cycle: OwlCycle; mood: OwlMood } {
  if (c.broken)                       return { cycle:"default", mood:"broken" };
  if (c.atRisk)                       return { cycle:"solar",   mood:"atRisk" };
  const t = getStreakTier(c.streak);
  if (t === "high")                   return { cycle:"solar",   mood:"happy"  };
  if (t === "mid")                    return { cycle:"default", mood:"happy"  };
  return                                     { cycle:"default", mood:"calm"   };
}
interface Props { convo: Conversation; onClose: () => void; }
export default function StreakSheet({ convo, onClose }: Props) {
  const tier  = getStreakTier(convo.streak);
  const oc    = getOwlColors(tier, convo.atRisk, convo.broken);
  const label = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  const days  = convo.streak || 0;
  const { cycle, mood } = getProps(convo);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow=""; window.removeEventListener("keydown", esc); };
  }, [onClose]);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:3000,background:"rgba(4,7,11,0.9)",backdropFilter:"blur(16px)",display:"flex",alignItems:"flex-end",justifyContent:"center",padding:20,animation:"owfFadeIn 0.2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,marginBottom:20,background:C.surface,border:`1px solid ${C.border}`,borderRadius:28,overflow:"hidden",boxShadow:`0 0 80px ${oc.halo}, 0 24px 48px rgba(0,0,0,0.8)`,animation:"owfSlideUp 0.35s cubic-bezier(0.34,1.4,0.64,1)"}}>
        <div style={{padding:"40px 0 24px",background:`radial-gradient(ellipse at 50% 60%, ${oc.halo} 0%, transparent 65%)`,display:"flex",flexDirection:"column",alignItems:"center",gap:12,position:"relative"}}>
          <OWFOwl size={124} cycle={cycle} mood={mood} animate streakDays={convo.streak??0} />
          <div style={{textAlign:"center",padding:"0 32px"}}>
            {convo.broken ? (
              <><div style={{fontSize:22,fontWeight:900,color:C.muted}}>Streak ended</div><div style={{fontSize:14,color:C.muted,marginTop:4}}>You reached a {convo.lastStreak}-day streak together.</div></>
            ) : convo.atRisk ? (
              <><div style={{fontSize:24,fontWeight:900,color:"#F59E0B"}}>{days}-day streak</div><div style={{fontSize:14,color:C.sub,marginTop:4}}>⚠ Your streak ends today if you both don't send a message.</div></>
            ) : (
              <><div style={{fontSize:36,fontWeight:900,color:C.gold,letterSpacing:"-0.03em"}}>{days} days</div><div style={{fontSize:14,color:C.sub,marginTop:6,lineHeight:1.6}}>{label?.long}</div></>
            )}
          </div>
          <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border}`,borderRadius:"50%",width:30,height:30,cursor:"pointer",color:C.muted,fontSize:17,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"0 24px 28px"}}>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:18,display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:13,color:C.sub}}>Both send at least one message daily</span>
              <span style={{fontSize:13,fontWeight:700,color:convo.broken?C.muted:C.aurora}}>{convo.broken?"—":"✓ Active"}</span>
            </div>
            {convo.started && <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:C.sub}}>Streak started</span><span style={{fontSize:13,fontWeight:600,color:C.text}}>{convo.started}</span></div>}
            {convo.longest && <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:C.sub}}>Longest streak together</span><span style={{fontSize:13,fontWeight:600,color:C.gold}}>{convo.longest} days</span></div>}
          </div>
          {convo.atRisk && <div style={{marginTop:18,background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10,padding:"11px 14px"}}><p style={{margin:0,fontSize:12.5,color:"#F59E0B",lineHeight:1.55}}>To keep this streak, you both need to send at least one message today.</p></div>}
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
echo -e "${GREEN}  OWF Owl rebuilt — matches your reference images${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Owl shape: chubby round body, large face disc,"
echo "  closed calm eyes, teardrop beak, right-side wing,"
echo "  orange feet, 3 chest ticks, soft halo"
echo ""
echo "  Cycles: default(peach) solar(gold) lunar(blue)"
echo "          forest(green) cosmic(indigo) mythic(teal) purple"
echo ""
echo "  Now run:  npm run dev"
echo ""