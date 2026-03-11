export type StreakTier = "none" | "low" | "mid" | "high" | "fire" | "legendary";

export function getStreakTier(days?: number): StreakTier {
  if (!days || days <= 0) return "none";
  if (days < 4)   return "low";
  if (days < 10)  return "mid";
  if (days < 30)  return "high";
  if (days < 100) return "fire";
  return "legendary";
}

export function getOwlColors(
  tier: StreakTier,
  atRisk?: boolean,
  broken?: boolean,
): { halo: string; haloStrong: string; text: string } {
  if (broken)  return { halo: "rgba(61,82,104,0.15)",  haloStrong: "rgba(61,82,104,0.25)",  text: "#3D5268" };
  if (atRisk)  return { halo: "rgba(245,158,11,0.12)", haloStrong: "rgba(245,158,11,0.22)", text: "#F59E0B" };
  switch (tier) {
    case "legendary": return { halo: "rgba(0,194,199,0.14)",  haloStrong: "rgba(0,194,199,0.24)",  text: "#00C2C7" };
    case "fire":      return { halo: "rgba(255,106,0,0.14)",  haloStrong: "rgba(255,106,0,0.24)",  text: "#FF6A00" };
    case "high":      return { halo: "rgba(232,184,75,0.12)", haloStrong: "rgba(232,184,75,0.22)", text: "#E8B84B" };
    case "mid":       return { halo: "rgba(106,157,255,0.1)", haloStrong: "rgba(106,157,255,0.2)", text: "#6A9DFF" };
    default:          return { halo: "rgba(0,212,170,0.08)",  haloStrong: "rgba(0,212,170,0.14)",  text: "#00D4AA" };
  }
}

export function getStreakLabel(
  streak?: number,
  atRisk?: boolean,
  broken?: boolean,
  lastStreak?: number,
): { short: string; long: string } | null {
  if (broken && lastStreak) return {
    short: `${lastStreak}d ended`,
    long:  `Your ${lastStreak}-day streak ended.`,
  };
  if (!streak || streak <= 0) return null;
  if (atRisk) return {
    short: `${streak}d ⚠`,
    long:  `${streak}-day streak — ends today!`,
  };
  return {
    short: `${streak}d 🔥`,
    long:  `${streak} days of daily conversation.`,
  };
}
