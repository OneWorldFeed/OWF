"use client";

import { CSSProperties, useState } from "react";
import OWFOwl from "./OWFOwl";
import type { OwlMood } from "./OWFOwl";
import type { OwlCycle } from "@/lib/streak";

interface Props {
  cycle:       OwlCycle;
  size:        number;
  mood?:       OwlMood;
  animate?:    boolean;
  streakDays?: number;
  style?:      CSSProperties;
}

export default function OwlImage({ cycle, size, mood, animate, streakDays, style }: Props) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <OWFOwl
        size={size}
        cycle={cycle}
        mood={mood}
        animate={animate}
        streakDays={streakDays}
      />
    );
  }

  const img = (
    <img
      src={`/assets/owls/${cycle}.png`}
      width={size}
      height={size}
      onError={() => setImgError(true)}
      style={{ display: "block", objectFit: "contain" }}
      alt={`${cycle} owl`}
    />
  );

  if (size >= 40) {
    return (
      <div style={{
        width: size, height: size,
        borderRadius: "50%", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}>
        {img}
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 8, overflow: "hidden", display: "inline-flex", flexShrink: 0, ...style }}>
      {img}
    </div>
  );
}
