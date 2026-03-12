"use client";
import { useEffect, useState } from "react";
import OwlImage from "@/components/dm/OwlImage";
import { CYCLE_INFO, CYCLE_ORDER } from "@/lib/streak";
import type { OwlCycle } from "@/lib/streak";

interface Props {
  cycle:   OwlCycle;
  onClose: () => void;
}

export default function BadgeUnlockModal({ cycle, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [bgError, setBgError]  = useState(false);

  const info        = CYCLE_INFO[cycle];
  const cycleNumber = CYCLE_ORDER.indexOf(cycle) + 1;

  function close() {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 350);
  }

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        opacity: closing ? 0 : 1,
        transition: closing ? "opacity 0.35s ease" : "none",
      }}
    >
      {/* Background image */}
      {!bgError && (
        <img
          src="/assets/owls/badge-bg.png"
          onError={() => setBgError(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.18,
            pointerEvents: "none",
          }}
          alt=""
        />
      )}

      {/* Ambient aura */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 52%, ${info.auraColor}55 0%, ${info.auraColor}18 38%, transparent 70%)`,
        animation: "badgeAuraPulse 3s ease-in-out infinite",
        pointerEvents: "none",
      }}/>

      {/* Content */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 10,
          padding: "0 32px",
          animation: "badgeTextFadeUp 0.5s ease both",
        }}
      >
        {/* Cycle number */}
        <div style={{
          fontSize: 13, fontWeight: 500, letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.38)", textTransform: "uppercase",
          animation: "badgeTextFadeUp 0.45s 0.05s ease both",
        }}>
          Cycle {cycleNumber}
        </div>

        {/* Cycle name */}
        <div style={{
          fontSize: 32, fontWeight: 900, color: "#fff",
          letterSpacing: "-0.02em", textAlign: "center",
          animation: "badgeTextFadeUp 0.45s 0.1s ease both",
        }}>
          {info.name}
        </div>

        {/* Owl */}
        <div style={{
          margin: "18px 0 14px",
          animation: "badgeOwlBounce 0.65s 0.15s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          <OwlImage size={200} cycle={cycle} mood="happy" animate/>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 15, fontStyle: "italic",
          color: "rgba(255,255,255,0.45)", textAlign: "center",
          maxWidth: 260, lineHeight: 1.6,
          animation: "badgeTextFadeUp 0.45s 0.3s ease both",
        }}>
          {info.tagline}
        </div>

        {/* Badge unlocked label */}
        <div style={{
          marginTop: 24,
          fontSize: 13, fontWeight: 800, letterSpacing: "0.22em",
          color: "#fff", textTransform: "uppercase",
          animation: "badgeTextFadeUp 0.45s 0.4s ease both",
        }}>
          Badge Unlocked
        </div>
      </div>

      {/* Tap to continue */}
      <div style={{
        position: "absolute", bottom: 36,
        fontSize: 12, color: "rgba(255,255,255,0.22)",
        letterSpacing: "0.06em", animation: "badgeTextFadeUp 0.5s 0.6s ease both",
        pointerEvents: "none",
      }}>
        Tap anywhere to continue
      </div>

      <style>{`
        @keyframes badgeAuraPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.06); }
        }
        @keyframes badgeOwlBounce {
          from { opacity: 0; transform: scale(0.4) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes badgeTextFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
