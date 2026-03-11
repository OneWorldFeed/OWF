"use client";
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
