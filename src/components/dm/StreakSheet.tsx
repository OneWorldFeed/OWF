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
