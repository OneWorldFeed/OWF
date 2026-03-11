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
