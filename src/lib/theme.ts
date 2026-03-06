import moods from '@/data/moods.json';

export type MoodId = 'electric' | 'reflective' | 'joyful' | 'melancholic' |
  'curious' | 'ambitious' | 'calm' | 'resilient' | 'ancient' | 'hopeful' |
  'fragile' | 'silent';

export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night';

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8)   return 'dawn';
  if (hour >= 8 && hour < 12)  return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'dusk';
  return 'night';
}

export function getMood(moodId: MoodId) {
  return moods.find((m: any) => m.id === moodId) ?? moods[0];
}

export function getMoodIntensity(moodId: MoodId): number {
  const mood = getMood(moodId);
  const time = getTimeOfDay();
  return mood?.timeOfDay?.[time]?.intensity ?? 0.7;
}

export function getHaloStyle(moodId: MoodId): React.CSSProperties {
  const mood = getMood(moodId);
  const intensity = getMoodIntensity(moodId);
  const alpha = Math.round(intensity * 255).toString(16).padStart(2, '0');
  return {
    borderLeft: `3px solid ${mood.color}${alpha}`,
  };
}

export function getGlowStyle(moodId: MoodId): React.CSSProperties {
  const mood = getMood(moodId);
  const intensity = getMoodIntensity(moodId);
  return {
    boxShadow: `0 0 ${Math.round(intensity * 20)}px rgba(${mood.glowRgb}, ${intensity * 0.4})`,
  };
}
