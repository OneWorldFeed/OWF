"use client";
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
