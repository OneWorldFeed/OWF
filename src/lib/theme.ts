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
  | 'fog'       // Soft cool grey, muted
  // ── Owl Cycle themes ──────────────────────────────────────────────────────
  | 'owl-city' | 'owl-lunar' | 'owl-frost' | 'owl-forest' | 'owl-fire'
  | 'owl-solar' | 'owl-storm' | 'owl-aurora' | 'owl-cosmic' | 'owl-mythic';

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

  // ── OWL CYCLE THEMES ─────────────────────────────────────────────────────

  'owl-city': {
    id: 'owl-city', label: 'City Owl', emoji: '🦉', isDark: true,
    void: '#0A0602', bg: '#120A04',
    surface: 'rgba(255,200,140,0.06)', surfaceHover: 'rgba(255,200,140,0.10)',
    raised: 'rgba(255,200,140,0.09)', border: 'rgba(255,180,100,0.12)',
    borderStrong: 'rgba(240,130,26,0.5)',
    text: '#FFE8CC', textSub: 'rgba(255,220,180,0.55)', textMuted: 'rgba(255,200,160,0.30)',
    horizon: 'rgba(240,130,26,1)', horizonRgb: '240,130,26',
    aurora: 'rgba(240,130,26,0.15)', glow: 'rgba(240,130,26,0.25)',
    gold: '#F0821A',
    swatch: 'linear-gradient(160deg, #120A04 0%, #1E1008 55%, #F0821A22 100%)',
  },

  'owl-lunar': {
    id: 'owl-lunar', label: 'Lunar Owl', emoji: '🌙', isDark: true,
    void: '#020408', bg: '#060E1A',
    surface: 'rgba(106,157,255,0.06)', surfaceHover: 'rgba(106,157,255,0.10)',
    raised: 'rgba(106,157,255,0.09)', border: 'rgba(106,157,255,0.12)',
    borderStrong: 'rgba(106,157,255,0.5)',
    text: '#D0E8FF', textSub: 'rgba(180,210,255,0.55)', textMuted: 'rgba(160,190,255,0.30)',
    horizon: 'rgba(106,157,255,1)', horizonRgb: '106,157,255',
    aurora: 'rgba(106,157,255,0.15)', glow: 'rgba(106,157,255,0.25)',
    gold: '#6A9DFF',
    swatch: 'linear-gradient(160deg, #060E1A 0%, #0A1828 55%, #6A9DFF22 100%)',
  },

  'owl-frost': {
    id: 'owl-frost', label: 'Frost Owl', emoji: '❄️', isDark: true,
    void: '#020608', bg: '#06101A',
    surface: 'rgba(169,214,255,0.06)', surfaceHover: 'rgba(169,214,255,0.10)',
    raised: 'rgba(169,214,255,0.09)', border: 'rgba(169,214,255,0.12)',
    borderStrong: 'rgba(169,214,255,0.5)',
    text: '#D8F0FF', textSub: 'rgba(200,235,255,0.55)', textMuted: 'rgba(180,220,255,0.30)',
    horizon: 'rgba(169,214,255,1)', horizonRgb: '169,214,255',
    aurora: 'rgba(169,214,255,0.12)', glow: 'rgba(169,214,255,0.22)',
    gold: '#7ABCE0',
    swatch: 'linear-gradient(160deg, #06101A 0%, #0A1C2E 55%, #A9D6FF22 100%)',
  },

  'owl-forest': {
    id: 'owl-forest', label: 'Forest Owl', emoji: '🌿', isDark: true,
    void: '#020802', bg: '#061006',
    surface: 'rgba(76,175,80,0.06)', surfaceHover: 'rgba(76,175,80,0.10)',
    raised: 'rgba(76,175,80,0.09)', border: 'rgba(76,175,80,0.12)',
    borderStrong: 'rgba(76,175,80,0.5)',
    text: '#D0F0D0', textSub: 'rgba(180,230,180,0.55)', textMuted: 'rgba(150,210,150,0.30)',
    horizon: 'rgba(76,175,80,1)', horizonRgb: '76,175,80',
    aurora: 'rgba(76,175,80,0.14)', glow: 'rgba(76,175,80,0.24)',
    gold: '#4CAF50',
    swatch: 'linear-gradient(160deg, #061006 0%, #0A1E0A 55%, #4CAF5022 100%)',
  },

  'owl-fire': {
    id: 'owl-fire', label: 'Fire Owl', emoji: '🔥', isDark: true,
    void: '#080200', bg: '#120400',
    surface: 'rgba(255,106,0,0.07)', surfaceHover: 'rgba(255,106,0,0.12)',
    raised: 'rgba(255,106,0,0.10)', border: 'rgba(255,106,0,0.15)',
    borderStrong: 'rgba(255,106,0,0.55)',
    text: '#FFE0CC', textSub: 'rgba(255,200,160,0.55)', textMuted: 'rgba(255,160,100,0.30)',
    horizon: 'rgba(255,106,0,1)', horizonRgb: '255,106,0',
    aurora: 'rgba(255,106,0,0.18)', glow: 'rgba(255,106,0,0.28)',
    gold: '#FF6A00',
    swatch: 'linear-gradient(160deg, #120400 0%, #200600 55%, #FF6A0022 100%)',
  },

  'owl-solar': {
    id: 'owl-solar', label: 'Solar Owl', emoji: '☀️', isDark: true,
    void: '#080600', bg: '#120C00',
    surface: 'rgba(255,193,7,0.06)', surfaceHover: 'rgba(255,193,7,0.10)',
    raised: 'rgba(255,193,7,0.09)', border: 'rgba(255,193,7,0.12)',
    borderStrong: 'rgba(255,193,7,0.5)',
    text: '#FFF5CC', textSub: 'rgba(255,235,150,0.55)', textMuted: 'rgba(255,210,100,0.30)',
    horizon: 'rgba(255,193,7,1)', horizonRgb: '255,193,7',
    aurora: 'rgba(255,193,7,0.15)', glow: 'rgba(255,193,7,0.25)',
    gold: '#FFC107',
    swatch: 'linear-gradient(160deg, #120C00 0%, #1E1400 55%, #FFC10722 100%)',
  },

  'owl-storm': {
    id: 'owl-storm', label: 'Storm Owl', emoji: '⚡', isDark: true,
    void: '#020408', bg: '#060C18',
    surface: 'rgba(58,134,255,0.06)', surfaceHover: 'rgba(58,134,255,0.10)',
    raised: 'rgba(58,134,255,0.09)', border: 'rgba(58,134,255,0.12)',
    borderStrong: 'rgba(58,134,255,0.5)',
    text: '#CCE0FF', textSub: 'rgba(160,200,255,0.55)', textMuted: 'rgba(120,170,255,0.30)',
    horizon: 'rgba(58,134,255,1)', horizonRgb: '58,134,255',
    aurora: 'rgba(58,134,255,0.15)', glow: 'rgba(58,134,255,0.25)',
    gold: '#3A86FF',
    swatch: 'linear-gradient(160deg, #060C18 0%, #0A1428 55%, #3A86FF22 100%)',
  },

  'owl-aurora': {
    id: 'owl-aurora', label: 'Aurora Owl', emoji: '🌌', isDark: true,
    void: '#020808', bg: '#041210',
    surface: 'rgba(42,255,198,0.06)', surfaceHover: 'rgba(42,255,198,0.10)',
    raised: 'rgba(42,255,198,0.09)', border: 'rgba(42,255,198,0.10)',
    borderStrong: 'rgba(42,255,198,0.45)',
    text: '#C8FFF0', textSub: 'rgba(160,255,230,0.55)', textMuted: 'rgba(100,220,190,0.30)',
    horizon: 'rgba(42,255,198,1)', horizonRgb: '42,255,198',
    aurora: 'rgba(42,255,198,0.14)', glow: 'rgba(42,255,198,0.22)',
    gold: '#2AFFC6',
    swatch: 'linear-gradient(160deg, #041210 0%, #082420 55%, #2AFFC622 100%)',
  },

  'owl-cosmic': {
    id: 'owl-cosmic', label: 'Cosmic Owl', emoji: '🪐', isDark: true,
    void: '#020208', bg: '#060618',
    surface: 'rgba(91,108,255,0.06)', surfaceHover: 'rgba(91,108,255,0.10)',
    raised: 'rgba(91,108,255,0.09)', border: 'rgba(91,108,255,0.12)',
    borderStrong: 'rgba(91,108,255,0.5)',
    text: '#D0D4FF', textSub: 'rgba(180,190,255,0.55)', textMuted: 'rgba(140,155,255,0.30)',
    horizon: 'rgba(91,108,255,1)', horizonRgb: '91,108,255',
    aurora: 'rgba(91,108,255,0.16)', glow: 'rgba(91,108,255,0.26)',
    gold: '#5B6CFF',
    swatch: 'linear-gradient(160deg, #060618 0%, #0C0C28 55%, #5B6CFF22 100%)',
  },

  'owl-mythic': {
    id: 'owl-mythic', label: 'Mythic Owl', emoji: '✨', isDark: true,
    void: '#000808', bg: '#001414',
    surface: 'rgba(0,194,199,0.07)', surfaceHover: 'rgba(0,194,199,0.12)',
    raised: 'rgba(0,194,199,0.10)', border: 'rgba(0,194,199,0.14)',
    borderStrong: 'rgba(0,194,199,0.55)',
    text: '#C0F8F8', textSub: 'rgba(150,240,240,0.55)', textMuted: 'rgba(80,200,200,0.30)',
    horizon: 'rgba(0,194,199,1)', horizonRgb: '0,194,199',
    aurora: 'rgba(0,194,199,0.18)', glow: 'rgba(0,194,199,0.28)',
    gold: '#00C2C7',
    swatch: 'linear-gradient(160deg, #001414 0%, #002828 55%, #00C2C722 100%)',
  },
};

export const THEME_ORDER: ThemeId[] = [
  'void', 'obsidian', 'midnight', 'cosmos', 'aurora', 'ember', 'dusk', 'slate',
  'parchment', 'chalk', 'sand', 'fog',
  'owl-city', 'owl-lunar', 'owl-frost', 'owl-forest', 'owl-fire',
  'owl-solar', 'owl-storm', 'owl-aurora', 'owl-cosmic', 'owl-mythic',
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
