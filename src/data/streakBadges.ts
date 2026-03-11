// src/data/streakBadges.ts
import type { CycleBadge } from "@/types/dm";

export const CYCLE_BADGES: CycleBadge[] = [
  {
    id: "new_moon", cycle: 1, name: "New Moon Owl",
    meaning: "First streak cycle completed.",
    story: "You kept showing up.",
    palette: {
      bg: "#0A0E1A", card: "#0D1428", body: "#2A2050", face: "#3D3080",
      eye: "#6050B0", halo: "#4030A0", haloBright: "rgba(100,80,200,0.5)",
      ring: "#5040B0", accent: "#FFD060", text: "#C8C0F0",
    },
    stars: true, crescent: false, rays: false, leaves: false, tealGlow: false,
  },
  {
    id: "lunar_glow", cycle: 2, name: "Lunar Glow",
    meaning: "The moon remembers everything.",
    story: "Multiple streaks built.",
    palette: {
      bg: "#F0F4F8", card: "#FFFFFF", body: "#4A7FA8", face: "#7AAAC8",
      eye: "#3A6A90", halo: "#2A5A80", haloBright: "rgba(100,160,200,0.25)",
      ring: "#3A6A90", accent: "#B0D0E8", text: "#2A4A60",
    },
    stars: true, crescent: true, rays: false, leaves: false, tealGlow: false,
  },
  {
    id: "solar_owl", cycle: 3, name: "Solar Owl",
    meaning: "Consistent streak behavior.",
    story: "Three cycles of daily conversation.",
    palette: {
      bg: "#FFFBF0", card: "#FFFFFF", body: "#F09020", face: "#FFD060",
      eye: "#C07010", halo: "#F0A020", haloBright: "rgba(255,180,40,0.4)",
      ring: "#E08010", accent: "#FF6020", text: "#804010",
    },
    stars: false, crescent: false, rays: true, leaves: false, tealGlow: false,
  },
  {
    id: "forest_owl", cycle: 4, name: "Forest Owl",
    meaning: "Rooted. Returning. Growing.",
    story: "Long-term ritualist.",
    palette: {
      bg: "#F0F8F0", card: "#FFFFFF", body: "#2A7A30", face: "#80D040",
      eye: "#206020", halo: "#206820", haloBright: "rgba(80,180,60,0.2)",
      ring: "#206820", accent: "#80D040", text: "#184018",
    },
    stars: false, crescent: false, rays: false, leaves: true, tealGlow: false,
  },
  {
    id: "cosmic_owl", cycle: 5, name: "Cosmic Owl",
    meaning: "Long-term ritualist.",
    story: "You and the cosmos are on a streak.",
    palette: {
      bg: "#F2F4FF", card: "#FFFFFF", body: "#1A2080", face: "#4050C0",
      eye: "#3040A0", halo: "#1A2080", haloBright: "rgba(60,80,200,0.15)",
      ring: "#1A2080", accent: "#8090E0", text: "#0A1040",
    },
    stars: true, crescent: false, rays: false, leaves: false,
    tealGlow: false, cosmicRing: true,
  },
  {
    id: "mythic_owl", cycle: 6, name: "Mythic Owl",
    meaning: "A hundred days of presence.",
    story: "Some connections become mythic.",
    palette: {
      bg: "#000000", card: "#060A0F", body: "#0A4A50", face: "#10808A",
      eye: "#08C0D0", halo: "#08C0D0", haloBright: "rgba(8,192,208,0.5)",
      ring: "#06A0B0", accent: "#00E8F8", text: "#80E8F0",
    },
    stars: true, crescent: false, rays: false, leaves: false,
    tealGlow: true, horns: true,
  },
];

export const MEMORY_ENTRIES = [
  { day: 7,   side: "left",  title: "Day 7",   body: "Los Angeles,\n11:18 PM" },
  { day: 12,  side: "right", title: "Day 12",  body: "You first mentioned\nNatidal here." },
  { day: 30,  side: "left",  title: "Day 30",  body: "Glow mode\nused 7 times." },
  { day: 50,  side: "right", title: "Day 50",  body: "First voice note\nsent together." },
  { day: 100, side: "left",  title: "Day 100", body: "Archive of trust." },
] as const;
