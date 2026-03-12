export type StreakTier = "none" | "low" | "mid" | "high" | "fire" | "legendary";

export type OwlCycle = "city" | "lunar" | "frost" | "forest" | "fire" | "solar" | "storm" | "aurora" | "cosmic" | "mythic";

export const CYCLE_THRESHOLDS: Record<OwlCycle, number> = {
  city:        0,
  lunar:       4,
  frost:      10,
  forest:     20,
  fire:       30,
  solar:      50,
  storm:      70,
  aurora:    100,
  cosmic:    200,
  mythic:    365,
};

export const CYCLE_ORDER: OwlCycle[] = [
  "city", "lunar", "frost", "forest", "fire", "solar", "storm", "aurora", "cosmic", "mythic",
];

export const CYCLE_INFO: Record<OwlCycle, {
  name: string;
  daysRequired: number;
  rarity: string;
  auraColor: string;
  tagline: string;
}> = {
  city:    { name: "City Owl",        daysRequired:   0, rarity: "Common",    auraColor: "#00D4AA", tagline: "Every journey begins at dusk."         },
  lunar:   { name: "Lunar Owl",       daysRequired:   4, rarity: "Common",    auraColor: "#6A9DFF", tagline: "The moon marks your rhythm."            },
  frost:   { name: "Frost Owl",       daysRequired:  10, rarity: "Uncommon",  auraColor: "#A8D8EA", tagline: "Cold nights sharpen the mind."          },
  forest:  { name: "Forest Owl",      daysRequired:  20, rarity: "Uncommon",  auraColor: "#4CAF82", tagline: "Roots run deep in the quiet dark."      },
  fire:    { name: "Fire Owl",        daysRequired:  30, rarity: "Rare",      auraColor: "#FF6A00", tagline: "Thirty days forged in flame."            },
  solar:   { name: "Solar Owl",       daysRequired:  50, rarity: "Rare",      auraColor: "#E8B84B", tagline: "You orbit with purpose."                },
  storm:   { name: "Storm Owl",       daysRequired:  70, rarity: "Epic",      auraColor: "#7B68EE", tagline: "Wind and thunder cannot break you."     },
  aurora:  { name: "Aurora Owl",      daysRequired: 100, rarity: "Epic",      auraColor: "#00C2C7", tagline: "A hundred nights painted in light."     },
  cosmic:  { name: "Cosmic Owl",      daysRequired: 200, rarity: "Legendary", auraColor: "#C084FC", tagline: "You have touched the edge of the sky."  },
  mythic:  { name: "Mythic Owl",      daysRequired: 365, rarity: "Mythic",    auraColor: "#FFD700", tagline: "A full year. You are legend."            },
};

export function cycleFromDays(days: number): OwlCycle {
  let current: OwlCycle = "city";
  for (const cycle of CYCLE_ORDER) {
    if (days >= CYCLE_THRESHOLDS[cycle]) current = cycle;
  }
  return current;
}

export function earnedCycles(days: number): OwlCycle[] {
  return CYCLE_ORDER.filter(cycle => days >= CYCLE_THRESHOLDS[cycle]);
}

export function justUnlockedCycle(prevDays: number, newDays: number): OwlCycle | null {
  const prev = earnedCycles(prevDays);
  const next = earnedCycles(newDays);
  const unlocked = next.filter(c => !prev.includes(c));
  return unlocked.length === 1 ? unlocked[0] : null;
}

export function nextCycle(days: number): { cycle: OwlCycle; daysLeft: number } | null {
  for (const cycle of CYCLE_ORDER) {
    const threshold = CYCLE_THRESHOLDS[cycle];
    if (days < threshold) return { cycle, daysLeft: threshold - days };
  }
  return null;
}


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
