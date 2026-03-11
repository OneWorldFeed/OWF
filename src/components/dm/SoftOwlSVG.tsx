"use client";
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
