import type { CSSProperties } from 'react';
import moodsData from '@/data/moods.json';

export type MoodId =
  | 'electric' | 'reflective' | 'joyful' | 'melancholic'
  | 'curious'  | 'ambitious'  | 'calm'   | 'resilient'
  | 'ancient'  | 'hopeful'    | 'fragile' | 'silent';

export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night';

export type ThemeId =
  | 'void'      // AI page: deep space black + teal horizon   ← signature
  | 'obsidian'  // Pure black, no blue — absolute dark
  | 'midnight'  // Deep navy, classic dark premium
  | 'cosmos'    // Dark purple-indigo space
  | 'aurora'    // Dark teal-green northern lights
  | 'ember'     // Dark warm — fire in darkness
  | 'dusk'      // Transitional: dark warm purple
  | 'slate'     // Neutral dark grey, no color cast
  | 'parchment' // Warm off-white, editorial
  | 'chalk'     // Cool clean white, minimal
  | 'sand'      // Warm beige, earthy
  | 'fog';      // Soft cool grey, muted

// ─── Spatial theme definitions ──────────────────────────────────────────────
// Each theme carries: the AI page DNA — void bg, glass surfaces, glow horizon

export interface OWFTheme {
  id: ThemeId;
  label: string;
  emoji: string;
  isDark: boolean;
  // Page layers
  void: string;           // deepest bg — the "space"
  bg: string;             // page background
  surface: string;        // card / panel (glass)
  surfaceHover: string;   // card hover state
  raised: string;         // inputs, elevated cards
  border: string;         // dividers, outlines
  borderStrong: string;   // selected states
  // Typography
  text: string;
  textSub: string;
  textMuted: string;
  // Accent / horizon system (from AI page)
  horizon: string;        // the teal horizon line, recolored per theme
  horizonRgb: string;     // for rgba() usage
  aurora: string;         // radial bloom behind content
  glow: string;           // active/selected glow
  // Interaction
  gold: string;           // OWF brand orange (#F97316 always)
  // Swatch for theme picker
  swatch: string;         // CSS gradient for the picker circle
}

export const THEMES: Record<ThemeId, OWFTheme> = {

  // ── DARK THEMES ──────────────────────────────────────────────────────────

  void: {
    id: 'void', label: 'Void', emoji: '◈', isDark: true,
    void:         '#030608',
    bg:           '#060E1A',
    surface:      'rgba(255,255,255,0.05)',
    surfaceHover: 'rgba(255,255,255,0.08)',
    raised:       'rgba(255,255,255,0.09)',
    border:       'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(0,220,190,0.4)',
    text:         '#F0F8FF',
    textSub:      'rgba(200,230,255,0.55)',
    textMuted:    'rgba(200,230,255,0.30)',
    horizon:      'rgba(0,220,190,1)',
    horizonRgb:   '0,220,190',
    aurora:       'rgba(0,210,180,0.18)',
    glow:         'rgba(0,220,190,0.25)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #060E1A 0%, #0A2535 50%, #00DCBE22 100%)',
  },

  obsidian: {
    id: 'obsidian', label: 'Obsidian', emoji: '⬛', isDark: true,
    void:         '#000000',
    bg:           '#0A0A0A',
    surface:      'rgba(255,255,255,0.04)',
    surfaceHover: 'rgba(255,255,255,0.07)',
    raised:       'rgba(255,255,255,0.08)',
    border:       'rgba(255,255,255,0.07)',
    borderStrong: 'rgba(249,115,22,0.5)',
    text:         '#FAFAFA',
    textSub:      'rgba(250,250,250,0.5)',
    textMuted:    'rgba(250,250,250,0.28)',
    horizon:      'rgba(249,115,22,0.9)',
    horizonRgb:   '249,115,22',
    aurora:       'rgba(249,115,22,0.10)',
    glow:         'rgba(249,115,22,0.20)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #0A0A0A 0%, #1A1A1A 60%, #F9731622 100%)',
  },

  midnight: {
    id: 'midnight', label: 'Midnight', emoji: '🌊', isDark: true,
    void:         '#020812',
    bg:           '#060F1E',
    surface:      'rgba(255,255,255,0.055)',
    surfaceHover: 'rgba(255,255,255,0.09)',
    raised:       'rgba(255,255,255,0.10)',
    border:       'rgba(100,150,255,0.10)',
    borderStrong: 'rgba(96,165,250,0.45)',
    text:         '#E8F0FF',
    textSub:      'rgba(200,218,255,0.55)',
    textMuted:    'rgba(200,218,255,0.30)',
    horizon:      'rgba(96,165,250,1)',
    horizonRgb:   '96,165,250',
    aurora:       'rgba(37,99,235,0.18)',
    glow:         'rgba(96,165,250,0.22)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #060F1E 0%, #0D1F3C 55%, #60A5FA22 100%)',
  },

  cosmos: {
    id: 'cosmos', label: 'Cosmos', emoji: '🔮', isDark: true,
    void:         '#05020F',
    bg:           '#0D0818',
    surface:      'rgba(200,150,255,0.055)',
    surfaceHover: 'rgba(200,150,255,0.09)',
    raised:       'rgba(200,150,255,0.10)',
    border:       'rgba(150,100,255,0.10)',
    borderStrong: 'rgba(167,139,250,0.45)',
    text:         '#EDE8FF',
    textSub:      'rgba(210,195,255,0.55)',
    textMuted:    'rgba(210,195,255,0.30)',
    horizon:      'rgba(167,139,250,1)',
    horizonRgb:   '167,139,250',
    aurora:       'rgba(124,58,237,0.20)',
    glow:         'rgba(167,139,250,0.22)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #0D0818 0%, #1A0E2E 55%, #A78BFA22 100%)',
  },

  aurora: {
    id: 'aurora', label: 'Aurora', emoji: '🌌', isDark: true,
    void:         '#020E0A',
    bg:           '#071510',
    surface:      'rgba(100,255,180,0.05)',
    surfaceHover: 'rgba(100,255,180,0.08)',
    raised:       'rgba(100,255,180,0.09)',
    border:       'rgba(52,211,153,0.10)',
    borderStrong: 'rgba(52,211,153,0.45)',
    text:         '#E0FFF0',
    textSub:      'rgba(180,255,220,0.55)',
    textMuted:    'rgba(180,255,220,0.30)',
    horizon:      'rgba(52,211,153,1)',
    horizonRgb:   '52,211,153',
    aurora:       'rgba(16,185,129,0.18)',
    glow:         'rgba(52,211,153,0.22)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #071510 0%, #0F2A1E 55%, #34D39922 100%)',
  },

  ember: {
    id: 'ember', label: 'Ember', emoji: '🔥', isDark: true,
    void:         '#0F0500',
    bg:           '#150800',
    surface:      'rgba(255,140,50,0.05)',
    surfaceHover: 'rgba(255,140,50,0.08)',
    raised:       'rgba(255,140,50,0.09)',
    border:       'rgba(234,88,12,0.10)',
    borderStrong: 'rgba(251,146,60,0.45)',
    text:         '#FFF4ED',
    textSub:      'rgba(255,220,180,0.55)',
    textMuted:    'rgba(255,220,180,0.30)',
    horizon:      'rgba(251,146,60,1)',
    horizonRgb:   '251,146,60',
    aurora:       'rgba(234,88,12,0.20)',
    glow:         'rgba(251,146,60,0.22)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #150800 0%, #2A1000 55%, #FB923C22 100%)',
  },

  dusk: {
    id: 'dusk', label: 'Dusk', emoji: '🌅', isDark: true,
    void:         '#0F080F',
    bg:           '#160E1A',
    surface:      'rgba(220,150,255,0.05)',
    surfaceHover: 'rgba(220,150,255,0.08)',
    raised:       'rgba(220,150,255,0.09)',
    border:       'rgba(192,132,252,0.10)',
    borderStrong: 'rgba(244,114,182,0.45)',
    text:         '#FFF0FF',
    textSub:      'rgba(255,200,240,0.55)',
    textMuted:    'rgba(255,200,240,0.30)',
    horizon:      'rgba(244,114,182,1)',
    horizonRgb:   '244,114,182',
    aurora:       'rgba(190,24,93,0.18)',
    glow:         'rgba(244,114,182,0.22)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #160E1A 0%, #2A1530 55%, #F472B622 100%)',
  },

  slate: {
    id: 'slate', label: 'Slate', emoji: '🩶', isDark: true,
    void:         '#080A0C',
    bg:           '#0F1115',
    surface:      'rgba(255,255,255,0.05)',
    surfaceHover: 'rgba(255,255,255,0.08)',
    raised:       'rgba(255,255,255,0.09)',
    border:       'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(148,163,184,0.5)',
    text:         '#E2E8F0',
    textSub:      'rgba(200,212,225,0.55)',
    textMuted:    'rgba(200,212,225,0.30)',
    horizon:      'rgba(148,163,184,1)',
    horizonRgb:   '148,163,184',
    aurora:       'rgba(100,116,139,0.18)',
    glow:         'rgba(148,163,184,0.20)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #0F1115 0%, #1A1E24 60%, #94A3B822 100%)',
  },

  // ── LIGHT THEMES ─────────────────────────────────────────────────────────

  parchment: {
    id: 'parchment', label: 'Parchment', emoji: '📜', isDark: false,
    void:         '#EDE6D8',
    bg:           '#F5EFE4',
    surface:      'rgba(255,255,255,0.78)',
    surfaceHover: 'rgba(255,255,255,0.92)',
    raised:       'rgba(255,255,255,0.95)',
    border:       'rgba(0,0,0,0.07)',
    borderStrong: 'rgba(180,83,9,0.4)',
    text:         '#1C140A',
    textSub:      '#7A6655',
    textMuted:    '#B8A898',
    horizon:      'rgba(180,83,9,0.8)',
    horizonRgb:   '180,83,9',
    aurora:       'rgba(217,119,6,0.10)',
    glow:         'rgba(180,83,9,0.12)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #F5EFE4 0%, #EDE6D8 60%, #B4530918 100%)',
  },

  chalk: {
    id: 'chalk', label: 'Chalk', emoji: '🤍', isDark: false,
    void:         '#E8EDF2',
    bg:           '#F2F5F8',
    surface:      'rgba(255,255,255,0.82)',
    surfaceHover: 'rgba(255,255,255,0.95)',
    raised:       'rgba(255,255,255,0.98)',
    border:       'rgba(0,0,0,0.06)',
    borderStrong: 'rgba(0,210,190,0.45)',
    text:         '#0F1924',
    textSub:      '#5A6E80',
    textMuted:    '#9AAFBE',
    horizon:      'rgba(0,210,190,0.8)',
    horizonRgb:   '0,210,190',
    aurora:       'rgba(0,200,180,0.08)',
    glow:         'rgba(0,210,190,0.12)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #F2F5F8 0%, #E8EDF2 60%, #00D2BE18 100%)',
  },

  sand: {
    id: 'sand', label: 'Sand', emoji: '🏜️', isDark: false,
    void:         '#E8DFD0',
    bg:           '#F0E8D8',
    surface:      'rgba(255,255,255,0.75)',
    surfaceHover: 'rgba(255,255,255,0.90)',
    raised:       'rgba(255,255,255,0.94)',
    border:       'rgba(0,0,0,0.07)',
    borderStrong: 'rgba(16,163,74,0.4)',
    text:         '#1A1208',
    textSub:      '#706050',
    textMuted:    '#B0A090',
    horizon:      'rgba(16,163,74,0.8)',
    horizonRgb:   '16,163,74',
    aurora:       'rgba(16,163,74,0.08)',
    glow:         'rgba(16,163,74,0.12)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #F0E8D8 0%, #E8DFD0 60%, #10A34A18 100%)',
  },

  fog: {
    id: 'fog', label: 'Fog', emoji: '🌫️', isDark: false,
    void:         '#D8DCE2',
    bg:           '#E8EBF0',
    surface:      'rgba(255,255,255,0.80)',
    surfaceHover: 'rgba(255,255,255,0.93)',
    raised:       'rgba(255,255,255,0.96)',
    border:       'rgba(0,0,0,0.06)',
    borderStrong: 'rgba(79,70,229,0.4)',
    text:         '#141620',
    textSub:      '#5A5E72',
    textMuted:    '#9A9EB2',
    horizon:      'rgba(79,70,229,0.8)',
    horizonRgb:   '79,70,229',
    aurora:       'rgba(79,70,229,0.08)',
    glow:         'rgba(79,70,229,0.12)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #E8EBF0 0%, #D8DCE2 60%, #4F46E518 100%)',
  },
};

export const THEME_ORDER: ThemeId[] = [
  'void', 'obsidian', 'midnight', 'cosmos', 'aurora', 'ember', 'dusk', 'slate',
  'parchment', 'chalk', 'sand', 'fog',
];

// ─── CSS custom properties output ────────────────────────────────────────────
// Call this to get a style object you can spread onto <html> or a wrapper div

export function themeToVars(t: OWFTheme): Record<string, string> {
  return {
    '--owf-void':          t.void,
    '--owf-bg':            t.bg,
    '--owf-surface':       t.surface,
    '--owf-surface-hover': t.surfaceHover,
    '--owf-raised':        t.raised,
    '--owf-border':        t.border,
    '--owf-border-strong': t.borderStrong,
    '--owf-text':          t.text,
    '--owf-text-sub':      t.textSub,
    '--owf-text-muted':    t.textMuted,
    '--owf-horizon':       t.horizon,
    '--owf-horizon-rgb':   t.horizonRgb,
    '--owf-aurora':        t.aurora,
    '--owf-glow':          t.glow,
    '--owf-gold':          t.gold,
    // Feed cards — always white regardless of theme
    '--owf-card':           '#ffffff',
    '--owf-card-border':    t.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
    '--owf-card-glow':      t.horizon,
    // Legacy aliases so existing components don't break
    '--owf-text-primary':   t.text,
    '--owf-text-secondary': t.textSub,
    '--owf-navy':           t.void,
  };
}

export function applyTheme(id: ThemeId) {
  const t = THEMES[id];
  if (!t) return;
  const vars = themeToVars(t);
  Object.entries(vars).forEach(([k, v]) =>
    document.documentElement.style.setProperty(k, v)
  );
  document.documentElement.setAttribute('data-owf-theme', id);
  document.documentElement.setAttribute('data-owf-dark', String(t.isDark));
  localStorage.setItem('owf-theme', id);
}

export function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'void';
  return (localStorage.getItem('owf-theme') as ThemeId) || 'chalk';
}

// ─── Mood system (unchanged, preserved fully) ────────────────────────────────

const moods = moodsData as any[];

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 8)  return 'dawn';
  if (hour >= 8  && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'dusk';
  return 'night';
}

export function getMood(moodId: MoodId) {
  return moods.find((m) => m.id === moodId) ?? moods[0];
}

export function getMoodIntensity(moodId: MoodId): number {
  const mood = getMood(moodId);
  const time = getTimeOfDay();
  return mood?.timeOfDay?.[time]?.intensity ?? 0.7;
}

export function getHaloStyle(moodId: MoodId): CSSProperties {
  const mood = getMood(moodId);
  const intensity = getMoodIntensity(moodId);
  const alpha = Math.round(intensity * 255).toString(16).padStart(2, '0');
  return { borderLeft: `3px solid ${mood.color}${alpha}` };
}

export function getGlowStyle(moodId: MoodId): CSSProperties {
  const mood = getMood(moodId);
  const intensity = getMoodIntensity(moodId);
  return {
    boxShadow: `0 0 ${Math.round(intensity * 20)}px rgba(${mood.glowRgb}, ${intensity * 0.4})`,
  };
}
