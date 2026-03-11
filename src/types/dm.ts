// src/types/dm.ts
export type StreakTier = "none" | "low" | "mid" | "high";

export interface Conversation {
  id: string;
  name: string;
  handle: string;
  emoji: string;
  streak: number | null;
  atRisk: boolean;
  broken: boolean;
  lastStreak: number | null;
  last: string;
  time: string;
  unread: number;
  online: boolean;
  started: string | null;
  longest: number | null;
  milestone: boolean;
}

export interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  reactions: Reaction[];
}

export interface Reaction {
  emoji: string;
  count: number;
  mine: boolean;
}

export interface OwlColors {
  body: string;
  eye: string;
  halo: string;
  haloStrong: string;
}

export interface StreakLabel {
  short: string;
  long: string;
}

// Streak Badge Cycle types
export type BadgeId =
  | "new_moon" | "lunar_glow" | "solar_owl"
  | "forest_owl" | "cosmic_owl" | "mythic_owl";

export interface BadgePalette {
  bg: string; card: string; body: string; face: string;
  eye: string; halo: string; haloBright: string;
  ring: string; accent: string; text: string;
}

export interface CycleBadge {
  id: BadgeId;
  cycle: number;
  name: string;
  meaning: string;
  story: string;
  palette: BadgePalette;
  stars: boolean;
  crescent: boolean;
  rays: boolean;
  leaves: boolean;
  tealGlow: boolean;
  horns?: boolean;
  cosmicRing?: boolean;
}
