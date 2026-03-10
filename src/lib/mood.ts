import { SignalMood } from "@/types/signal"

export type MoodTokens = {
  accent: string
  glow:   string
  soft:   string
  dot:    string
  label:  string
}

export const MOOD_MAP: Record<SignalMood, MoodTokens> = {
  wonder: {
    accent: "#8B5CF6",
    glow:   "rgba(139,92,246,0.22)",
    soft:   "rgba(139,92,246,0.06)",
    dot:    "#C4B5FD",
    label:  "Wonder",
  },
  cosmos: {
    accent: "#1A6EFF",
    glow:   "rgba(26,110,255,0.22)",
    soft:   "rgba(26,110,255,0.06)",
    dot:    "#93C5FD",
    label:  "Cosmos",
  },
  earth: {
    accent: "#D97706",
    glow:   "rgba(217,119,6,0.22)",
    soft:   "rgba(217,119,6,0.06)",
    dot:    "#FDE68A",
    label:  "Earth",
  },
  aurora: {
    accent: "#00D4AA",
    glow:   "rgba(0,212,170,0.22)",
    soft:   "rgba(0,212,170,0.06)",
    dot:    "#6EE7D0",
    label:  "Aurora",
  },
  fire: {
    accent: "#F05040",
    glow:   "rgba(240,80,64,0.22)",
    soft:   "rgba(240,80,64,0.06)",
    dot:    "#FCA5A5",
    label:  "Fire",
  },
}

export const getMood = (mood: SignalMood): MoodTokens =>
  MOOD_MAP[mood] ?? MOOD_MAP.cosmos
