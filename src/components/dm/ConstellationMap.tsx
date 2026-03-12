"use client";
import { useState } from "react";
import OwlImage from "./OwlImage";
import {
  CYCLE_INFO, CYCLE_ORDER, CYCLE_THRESHOLDS,
  cycleFromDays, earnedCycles,
} from "@/lib/streak";
import type { OwlCycle } from "@/lib/streak";

interface Props {
  streakDays:    number;
  onBadgeClick?: (cycle: OwlCycle) => void;
}

// S-curve positions in SVG viewBox 0 0 100 100
const NODE_POS: Record<OwlCycle, { x: number; y: number }> = {
  city:    { x: 10, y: 88 },
  lunar:   { x: 25, y: 72 },
  frost:   { x: 42, y: 60 },
  forest:  { x: 60, y: 48 },
  fire:    { x: 75, y: 35 },
  solar:   { x: 62, y: 22 },
  storm:   { x: 45, y: 14 },
  aurora:  { x: 30, y:  8 },
  cosmic:  { x: 55, y:  4 },
  mythic:  { x: 78, y:  2 },
};

// Build SVG path string through a list of cycles
function buildPath(cycles: OwlCycle[]): string {
  if (cycles.length === 0) return "";
  return cycles.map((c, i) => {
    const { x, y } = NODE_POS[c];
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
}

export default function ConstellationMap({ streakDays, onBadgeClick }: Props) {
  const [bgError,   setBgError]   = useState(false);
  const [nodeErrors, setNodeErrors] = useState<Partial<Record<OwlCycle, boolean>>>({});
  const [hovered,   setHovered]   = useState<OwlCycle | null>(null);

  const current = cycleFromDays(streakDays);
  const earned  = earnedCycles(streakDays);

  const fullPath    = buildPath(CYCLE_ORDER);
  const earnedPath  = buildPath(earned);

  function nodeStatus(c: OwlCycle): "current" | "unlocked" | "locked" {
    if (c === current) return "current";
    if (earned.includes(c)) return "unlocked";
    return "locked";
  }

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "60%" }}>
      {/* Inner absolute container */}
      <div style={{ position: "absolute", inset: 0 }}>

        {/* Background image */}
        {!bgError && (
          <img
            src="/assets/constellation/map-bg.png"
            onError={() => setBgError(true)}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", borderRadius: 16,
              pointerEvents: "none",
            }}
            alt=""
          />
        )}

        {/* SVG path overlay */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {/* Full dim path */}
          <path
            d={fullPath}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.6"
            strokeDasharray="2 2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Earned glowing teal path */}
          {earnedPath && (
            <>
              <path
                d={earnedPath}
                stroke="rgba(0,212,170,0.2)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={earnedPath}
                stroke="#00D4AA"
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>

        {/* Nodes */}
        {CYCLE_ORDER.map(c => {
          const { x, y }  = NODE_POS[c];
          const status     = nodeStatus(c);
          const info       = CYCLE_INFO[c];
          const isEarned   = status !== "locked";
          const isCurrent  = status === "current";
          const owlSize    = isCurrent ? 44 : 28;
          const nodeSize   = isCurrent ? 20 : 14;
          const hasErr     = nodeErrors[c];

          return (
            <div
              key={c}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: isEarned ? "pointer" : "default",
                zIndex: isCurrent ? 10 : isEarned ? 5 : 2,
              }}
              onClick={() => isEarned && onBadgeClick?.(c)}
              onMouseEnter={() => setHovered(c)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* OwlImage above earned nodes */}
              {isEarned && (
                <div style={{
                  marginBottom: 4,
                  filter: isCurrent
                    ? `drop-shadow(0 0 8px ${info.auraColor})`
                    : "none",
                  animation: isCurrent ? "owfOwlFloat 3.5s ease-in-out infinite" : "none",
                }}>
                  <OwlImage size={owlSize} cycle={c} mood={isCurrent ? "happy" : "calm"}/>
                </div>
              )}

              {/* Node marker */}
              {!hasErr ? (
                <img
                  src={`/assets/constellation/node-${status}.png`}
                  width={nodeSize}
                  height={nodeSize}
                  onError={() => setNodeErrors(prev => ({ ...prev, [c]: true }))}
                  style={{ display: "block", flexShrink: 0 }}
                  alt={c}
                />
              ) : (
                /* CSS circle fallback */
                <div style={{
                  width: nodeSize,
                  height: nodeSize,
                  borderRadius: "50%",
                  background: isCurrent
                    ? info.auraColor
                    : isEarned
                      ? "rgba(0,212,170,0.6)"
                      : "rgba(255,255,255,0.12)",
                  border: isCurrent
                    ? `2px solid ${info.auraColor}`
                    : isEarned
                      ? "1.5px solid rgba(0,212,170,0.5)"
                      : "1.5px solid rgba(255,255,255,0.15)",
                  boxShadow: isCurrent ? `0 0 10px ${info.auraColor}` : "none",
                  flexShrink: 0,
                }}/>
              )}

              {/* Hover tooltip */}
              {hovered === c && (
                <div style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(10,16,24,0.92)",
                  border: `1px solid ${info.auraColor}44`,
                  borderRadius: 8,
                  padding: "5px 9px",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  zIndex: 20,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{info.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>
                    {info.daysRequired === 0 ? "Starting cycle" : `Day ${info.daysRequired}`}
                  </div>
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}
