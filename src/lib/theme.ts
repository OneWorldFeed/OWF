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
  | 'owl-city'   | 'owl-city-light'
  | 'owl-lunar'  | 'owl-lunar-light'
  | 'owl-frost'  | 'owl-frost-light'
  | 'owl-forest' | 'owl-forest-light'
  | 'owl-fire'   | 'owl-fire-light'
  | 'owl-solar'  | 'owl-solar-light'
  | 'owl-storm'  | 'owl-storm-light'
  | 'owl-aurora' | 'owl-aurora-light'
  | 'owl-cosmic' | 'owl-cosmic-light'
  | 'owl-mythic' | 'owl-mythic-light';

// ─── Spatial theme definitions ──────────────────────────────────────────────
// Each theme carries: the AI page DNA — void bg, glass surfaces, glow horizon

export interface OWFTheme {
  id: ThemeId;
  label: string;
  emoji: string;
  isDark: boolean;
  isOwlTheme?: boolean;
  owlCycle?: string;
  owlUnlockDays?: number;
  owlAnimation?: 'noise' | 'horizon-shift' | 'particles' | 'full';
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
    bg:           '#060A12',
    surface:      'rgba(255,255,255,0.045)',
    surfaceHover: 'rgba(255,255,255,0.075)',
    raised:       'rgba(255,255,255,0.09)',
    border:       'rgba(255,255,255,0.07)',
    borderStrong: 'rgba(0,220,190,0.4)',
    text:         '#EEF6FF',
    textSub:      'rgba(200,230,255,0.5)',
    textMuted:    'rgba(200,230,255,0.28)',
    horizon:      '#00DCBE',
    horizonRgb:   '0,220,190',
    aurora:       'rgba(0,210,180,0.12)',
    glow:         'rgba(0,220,190,0.2)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #060A12 0%, #0A1E2E 50%, #00DCBE18 100%)',
  },

  obsidian: {
    id: 'obsidian', label: 'Obsidian', emoji: '⬛', isDark: true,
    void:         '#000000',
    bg:           '#080808',
    surface:      'rgba(255,255,255,0.038)',
    surfaceHover: 'rgba(255,255,255,0.065)',
    raised:       'rgba(255,255,255,0.075)',
    border:       'rgba(255,255,255,0.065)',
    borderStrong: 'rgba(139,124,246,0.45)',
    text:         '#F8F8F8',
    textSub:      'rgba(248,248,248,0.48)',
    textMuted:    'rgba(248,248,248,0.26)',
    horizon:      '#8B7CF6',
    horizonRgb:   '139,124,246',
    aurora:       'rgba(139,124,246,0.09)',
    glow:         'rgba(139,124,246,0.18)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #080808 0%, #131318 60%, #8B7CF618 100%)',
  },

  midnight: {
    id: 'midnight', label: 'Midnight', emoji: '🌊', isDark: true,
    void:         '#020810',
    bg:           '#050D1C',
    surface:      'rgba(255,255,255,0.05)',
    surfaceHover: 'rgba(255,255,255,0.08)',
    raised:       'rgba(255,255,255,0.095)',
    border:       'rgba(96,165,250,0.10)',
    borderStrong: 'rgba(59,130,246,0.45)',
    text:         '#E4EEFF',
    textSub:      'rgba(196,214,255,0.52)',
    textMuted:    'rgba(196,214,255,0.28)',
    horizon:      '#3B82F6',
    horizonRgb:   '59,130,246',
    aurora:       'rgba(37,99,235,0.12)',
    glow:         'rgba(59,130,246,0.2)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #050D1C 0%, #0C1E3A 55%, #3B82F618 100%)',
  },

  cosmos: {
    id: 'cosmos', label: 'Cosmos', emoji: '🪐', isDark: true,
    void:         '#08051C',
    bg:           '#0D0A22',
    surface:      'rgba(255,255,255,0.048)',
    surfaceHover: 'rgba(255,255,255,0.078)',
    raised:       'rgba(255,255,255,0.09)',
    border:       'rgba(168,85,247,0.10)',
    borderStrong: 'rgba(168,85,247,0.45)',
    text:         '#EEE8FF',
    textSub:      'rgba(220,210,255,0.5)',
    textMuted:    'rgba(220,210,255,0.27)',
    horizon:      '#A855F7',
    horizonRgb:   '168,85,247',
    aurora:       'rgba(139,92,246,0.12)',
    glow:         'rgba(168,85,247,0.2)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #0D0A22 0%, #18103C 55%, #A855F718 100%)',
  },

  aurora: {
    id: 'aurora', label: 'Aurora', emoji: '🌌', isDark: true,
    void:         '#030F0A',
    bg:           '#071510',
    surface:      'rgba(255,255,255,0.045)',
    surfaceHover: 'rgba(255,255,255,0.075)',
    raised:       'rgba(255,255,255,0.085)',
    border:       'rgba(42,255,198,0.09)',
    borderStrong: 'rgba(42,255,198,0.4)',
    text:         '#E0FFF6',
    textSub:      'rgba(200,255,235,0.5)',
    textMuted:    'rgba(200,255,235,0.27)',
    horizon:      '#2AFFC6',
    horizonRgb:   '42,255,198',
    aurora:       'rgba(42,255,198,0.10)',
    glow:         'rgba(42,255,198,0.18)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #071510 0%, #0D2A1E 55%, #2AFFC618 100%)',
  },

  ember: {
    id: 'ember', label: 'Ember', emoji: '🔥', isDark: true,
    void:         '#0F0500',
    bg:           '#180800',
    surface:      'rgba(255,255,255,0.045)',
    surfaceHover: 'rgba(255,255,255,0.075)',
    raised:       'rgba(255,255,255,0.085)',
    border:       'rgba(255,106,0,0.09)',
    borderStrong: 'rgba(255,106,0,0.45)',
    text:         '#FFF4EE',
    textSub:      'rgba(255,230,210,0.52)',
    textMuted:    'rgba(255,230,210,0.28)',
    horizon:      '#FF6A00',
    horizonRgb:   '255,106,0',
    aurora:       'rgba(255,106,0,0.10)',
    glow:         'rgba(255,106,0,0.2)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #180800 0%, #2E1000 55%, #FF6A0018 100%)',
  },

  dusk: {
    id: 'dusk', label: 'Dusk', emoji: '🌆', isDark: true,
    void:         '#0E0818',
    bg:           '#150E20',
    surface:      'rgba(255,255,255,0.045)',
    surfaceHover: 'rgba(255,255,255,0.075)',
    raised:       'rgba(255,255,255,0.085)',
    border:       'rgba(232,121,160,0.09)',
    borderStrong: 'rgba(232,121,160,0.4)',
    text:         '#FEF0F6',
    textSub:      'rgba(255,215,235,0.5)',
    textMuted:    'rgba(255,215,235,0.27)',
    horizon:      '#E879A0',
    horizonRgb:   '232,121,160',
    aurora:       'rgba(232,121,160,0.10)',
    glow:         'rgba(232,121,160,0.18)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #150E20 0%, #261530 55%, #E879A018 100%)',
  },

  slate: {
    id: 'slate', label: 'Slate', emoji: '🪨', isDark: true,
    void:         '#080C12',
    bg:           '#0E1318',
    surface:      'rgba(255,255,255,0.042)',
    surfaceHover: 'rgba(255,255,255,0.07)',
    raised:       'rgba(255,255,255,0.08)',
    border:       'rgba(100,116,139,0.10)',
    borderStrong: 'rgba(100,116,139,0.4)',
    text:         '#E8EDF4',
    textSub:      'rgba(200,212,228,0.5)',
    textMuted:    'rgba(200,212,228,0.27)',
    horizon:      '#64748B',
    horizonRgb:   '100,116,139',
    aurora:       'rgba(100,116,139,0.09)',
    glow:         'rgba(100,116,139,0.16)',
    gold:         '#F97316',
    swatch:       'linear-gradient(160deg, #0E1318 0%, #192028 55%, #64748B18 100%)',
  },

  // ── LIGHT THEMES ─────────────────────────────────────────────────────────

  parchment: {
    id: 'parchment', label: 'Parchment', emoji: '📜', isDark: false,
    void:         '#E8DFC4',
    bg:           '#F2ECD8',
    surface:      '#FAF6EA',
    surfaceHover: '#FFFEF8',
    raised:       '#FFFEF8',
    border:       'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(139,105,20,0.45)',
    text:         '#2C1F08',
    textSub:      'rgba(44,31,8,0.55)',
    textMuted:    'rgba(44,31,8,0.35)',
    horizon:      '#8B6914',
    horizonRgb:   '139,105,20',
    aurora:       'rgba(139,105,20,0.08)',
    glow:         'rgba(139,105,20,0.16)',
    gold:         '#8B6914',
    swatch:       'linear-gradient(160deg, #F2ECD8 0%, #E8DFC4 60%, #8B691422 100%)',
  },

  chalk: {
    id: 'chalk', label: 'Chalk', emoji: '◻', isDark: false,
    void:         '#EDE9E0',
    bg:           '#F5F3EE',
    surface:      '#FDFCFA',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(0,0,0,0.07)',
    borderStrong: 'rgba(194,120,58,0.45)',
    text:         '#1A1410',
    textSub:      'rgba(26,20,16,0.55)',
    textMuted:    'rgba(26,20,16,0.35)',
    horizon:      '#C2783A',
    horizonRgb:   '194,120,58',
    aurora:       'rgba(194,120,58,0.08)',
    glow:         'rgba(194,120,58,0.18)',
    gold:         '#C2783A',
    swatch:       'linear-gradient(160deg, #F5F3EE 0%, #EDE9E0 60%, #C2783A22 100%)',
  },

  sand: {
    id: 'sand', label: 'Sand', emoji: '🏜', isDark: false,
    void:         '#E0D4B8',
    bg:           '#EDE5D0',
    surface:      '#F7F2E4',
    surfaceHover: '#FDFAF0',
    raised:       '#FDFAF0',
    border:       'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(176,128,64,0.45)',
    text:         '#281A08',
    textSub:      'rgba(40,26,8,0.55)',
    textMuted:    'rgba(40,26,8,0.35)',
    horizon:      '#B08040',
    horizonRgb:   '176,128,64',
    aurora:       'rgba(176,128,64,0.08)',
    glow:         'rgba(176,128,64,0.16)',
    gold:         '#B08040',
    swatch:       'linear-gradient(160deg, #EDE5D0 0%, #E0D4B8 60%, #B0804022 100%)',
  },

  fog: {
    id: 'fog', label: 'Fog', emoji: '🌫', isDark: false,
    void:         '#DDE0EA',
    bg:           '#E8EAF0',
    surface:      '#F2F4F8',
    surfaceHover: '#FAFBFD',
    raised:       '#FAFBFD',
    border:       'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(107,122,160,0.45)',
    text:         '#1A2040',
    textSub:      'rgba(26,32,64,0.55)',
    textMuted:    'rgba(26,32,64,0.35)',
    horizon:      '#6B7AA0',
    horizonRgb:   '107,122,160',
    aurora:       'rgba(107,122,160,0.08)',
    glow:         'rgba(107,122,160,0.16)',
    gold:         '#6B7AA0',
    swatch:       'linear-gradient(160deg, #E8EAF0 0%, #DDE0EA 60%, #6B7AA022 100%)',
  },

  // ── OWL CYCLE THEMES (dark + light pairs) ────────────────────────────────

  'owl-city': {
    id: 'owl-city', label: 'City Night', emoji: '🦉', isDark: true,
    isOwlTheme: true, owlCycle: 'city', owlUnlockDays: 4,
    owlAnimation: 'noise',
    void:         '#0A0A08',
    bg:           '#151510',
    surface:      'rgba(255,200,160,0.055)',
    surfaceHover: 'rgba(255,200,160,0.085)',
    raised:       'rgba(255,200,160,0.10)',
    border:       'rgba(255,200,160,0.09)',
    borderStrong: 'rgba(255,200,160,0.45)',
    text:         '#FFF5EE',
    textSub:      'rgba(255,230,200,0.52)',
    textMuted:    'rgba(255,230,200,0.28)',
    horizon:      '#FFC8A0',
    horizonRgb:   '255,200,160',
    aurora:       'rgba(255,200,160,0.10)',
    glow:         'rgba(255,200,160,0.20)',
    gold:         '#FFC8A0',
    swatch:       'linear-gradient(160deg, #151510 0%, #201E14 55%, #FFC8A018 100%)',
  },
  'owl-city-light': {
    id: 'owl-city-light', label: 'City Dawn', emoji: '🦉', isDark: false,
    isOwlTheme: true, owlCycle: 'city', owlUnlockDays: 4,
    owlAnimation: 'noise',
    void:         '#FFE8D0',
    bg:           '#FFF5EC',
    surface:      '#FFFAF5',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(194,120,58,0.10)',
    borderStrong: 'rgba(194,120,58,0.45)',
    text:         '#3A1A08',
    textSub:      'rgba(58,26,8,0.55)',
    textMuted:    'rgba(58,26,8,0.35)',
    horizon:      '#C2783A',
    horizonRgb:   '194,120,58',
    aurora:       'rgba(194,120,58,0.08)',
    glow:         'rgba(194,120,58,0.18)',
    gold:         '#C2783A',
    swatch:       'linear-gradient(160deg, #FFF5EC 0%, #FFE8D0 60%, #C2783A22 100%)',
  },

  'owl-lunar': {
    id: 'owl-lunar', label: 'Lunar Dark', emoji: '🦉', isDark: true,
    isOwlTheme: true, owlCycle: 'lunar', owlUnlockDays: 10,
    owlAnimation: 'noise',
    void:         '#060A14',
    bg:           '#0D1220',
    surface:      'rgba(106,157,255,0.055)',
    surfaceHover: 'rgba(106,157,255,0.085)',
    raised:       'rgba(106,157,255,0.10)',
    border:       'rgba(106,157,255,0.09)',
    borderStrong: 'rgba(106,157,255,0.45)',
    text:         '#EEF4FF',
    textSub:      'rgba(200,218,255,0.52)',
    textMuted:    'rgba(200,218,255,0.28)',
    horizon:      '#6A9DFF',
    horizonRgb:   '106,157,255',
    aurora:       'rgba(106,157,255,0.10)',
    glow:         'rgba(106,157,255,0.20)',
    gold:         '#6A9DFF',
    swatch:       'linear-gradient(160deg, #0D1220 0%, #161E38 55%, #6A9DFF18 100%)',
  },
  'owl-lunar-light': {
    id: 'owl-lunar-light', label: 'Lunar Mist', emoji: '🦉', isDark: false,
    isOwlTheme: true, owlCycle: 'lunar', owlUnlockDays: 10,
    owlAnimation: 'noise',
    void:         '#D6E6FF',
    bg:           '#EEF2FF',
    surface:      '#F6F9FF',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(59,95,192,0.10)',
    borderStrong: 'rgba(59,95,192,0.45)',
    text:         '#0A1840',
    textSub:      'rgba(10,24,64,0.55)',
    textMuted:    'rgba(10,24,64,0.35)',
    horizon:      '#3B5FC0',
    horizonRgb:   '59,95,192',
    aurora:       'rgba(59,95,192,0.08)',
    glow:         'rgba(59,95,192,0.18)',
    gold:         '#3B5FC0',
    swatch:       'linear-gradient(160deg, #EEF2FF 0%, #D6E6FF 60%, #3B5FC022 100%)',
  },

  'owl-frost': {
    id: 'owl-frost', label: 'Frost Dark', emoji: '🦉', isDark: true,
    isOwlTheme: true, owlCycle: 'frost', owlUnlockDays: 20,
    owlAnimation: 'noise',
    void:         '#050C16',
    bg:           '#0A1520',
    surface:      'rgba(169,214,255,0.05)',
    surfaceHover: 'rgba(169,214,255,0.08)',
    raised:       'rgba(169,214,255,0.09)',
    border:       'rgba(169,214,255,0.09)',
    borderStrong: 'rgba(169,214,255,0.40)',
    text:         '#EAF5FF',
    textSub:      'rgba(195,230,255,0.50)',
    textMuted:    'rgba(195,230,255,0.27)',
    horizon:      '#A9D6FF',
    horizonRgb:   '169,214,255',
    aurora:       'rgba(169,214,255,0.09)',
    glow:         'rgba(169,214,255,0.18)',
    gold:         '#A9D6FF',
    swatch:       'linear-gradient(160deg, #0A1520 0%, #142030 55%, #A9D6FF16 100%)',
  },
  'owl-frost-light': {
    id: 'owl-frost-light', label: 'Frost Light', emoji: '🦉', isDark: false,
    isOwlTheme: true, owlCycle: 'frost', owlUnlockDays: 20,
    owlAnimation: 'noise',
    void:         '#C8E8FF',
    bg:           '#EBF5FF',
    surface:      '#F4FAFF',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(43,127,191,0.10)',
    borderStrong: 'rgba(43,127,191,0.45)',
    text:         '#082040',
    textSub:      'rgba(8,32,64,0.55)',
    textMuted:    'rgba(8,32,64,0.35)',
    horizon:      '#2B7FBF',
    horizonRgb:   '43,127,191',
    aurora:       'rgba(43,127,191,0.08)',
    glow:         'rgba(43,127,191,0.18)',
    gold:         '#2B7FBF',
    swatch:       'linear-gradient(160deg, #EBF5FF 0%, #C8E8FF 60%, #2B7FBF22 100%)',
  },

  'owl-forest': {
    id: 'owl-forest', label: 'Forest Dark', emoji: '🦉', isDark: true,
    isOwlTheme: true, owlCycle: 'forest', owlUnlockDays: 30,
    owlAnimation: 'noise',
    void:         '#030C05',
    bg:           '#081408',
    surface:      'rgba(76,175,80,0.05)',
    surfaceHover: 'rgba(76,175,80,0.08)',
    raised:       'rgba(76,175,80,0.09)',
    border:       'rgba(76,175,80,0.09)',
    borderStrong: 'rgba(76,175,80,0.40)',
    text:         '#E8FFE8',
    textSub:      'rgba(185,235,185,0.50)',
    textMuted:    'rgba(185,235,185,0.27)',
    horizon:      '#4CAF50',
    horizonRgb:   '76,175,80',
    aurora:       'rgba(76,175,80,0.09)',
    glow:         'rgba(76,175,80,0.18)',
    gold:         '#4CAF50',
    swatch:       'linear-gradient(160deg, #081408 0%, #0F2010 55%, #4CAF5016 100%)',
  },
  'owl-forest-light': {
    id: 'owl-forest-light', label: 'Forest Light', emoji: '🦉', isDark: false,
    isOwlTheme: true, owlCycle: 'forest', owlUnlockDays: 30,
    owlAnimation: 'noise',
    void:         '#C8EFC8',
    bg:           '#EDFAF0',
    surface:      '#F5FDF6',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(34,130,40,0.10)',
    borderStrong: 'rgba(34,130,40,0.45)',
    text:         '#082010',
    textSub:      'rgba(8,32,16,0.55)',
    textMuted:    'rgba(8,32,16,0.35)',
    horizon:      '#228228',
    horizonRgb:   '34,130,40',
    aurora:       'rgba(34,130,40,0.08)',
    glow:         'rgba(34,130,40,0.18)',
    gold:         '#228228',
    swatch:       'linear-gradient(160deg, #EDFAF0 0%, #C8EFC8 60%, #22822822 100%)',
  },

  'owl-fire': {
    id: 'owl-fire', label: 'Fire Dark', emoji: '🦉', isDark: true,
    isOwlTheme: true, owlCycle: 'fire', owlUnlockDays: 50,
    owlAnimation: 'horizon-shift',
    void:         '#100300',
    bg:           '#1C0600',
    surface:      'rgba(255,106,0,0.055)',
    surfaceHover: 'rgba(255,106,0,0.085)',
    raised:       'rgba(255,106,0,0.10)',
    border:       'rgba(255,106,0,0.09)',
    borderStrong: 'rgba(255,106,0,0.45)',
    text:         '#FFF2EE',
    textSub:      'rgba(255,225,200,0.52)',
    textMuted:    'rgba(255,225,200,0.28)',
    horizon:      '#FF6A00',
    horizonRgb:   '255,106,0',
    aurora:       'rgba(255,106,0,0.10)',
    glow:         'rgba(255,106,0,0.22)',
    gold:         '#FF6A00',
    swatch:       'linear-gradient(160deg, #1C0600 0%, #2E0E00 55%, #FF6A0020 100%)',
  },
  'owl-fire-light': {
    id: 'owl-fire-light', label: 'Fire Dawn', emoji: '🦉', isDark: false,
    isOwlTheme: true, owlCycle: 'fire', owlUnlockDays: 50,
    owlAnimation: 'horizon-shift',
    void:         '#FFCCA0',
    bg:           '#FFF2E8',
    surface:      '#FFF8F2',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(200,80,0,0.10)',
    borderStrong: 'rgba(200,80,0,0.45)',
    text:         '#3A1000',
    textSub:      'rgba(58,16,0,0.55)',
    textMuted:    'rgba(58,16,0,0.35)',
    horizon:      '#C85000',
    horizonRgb:   '200,80,0',
    aurora:       'rgba(200,80,0,0.08)',
    glow:         'rgba(200,80,0,0.18)',
    gold:         '#C85000',
    swatch:       'linear-gradient(160deg, #FFF2E8 0%, #FFCCA0 60%, #C8500022 100%)',
  },

  'owl-solar': {
    id: 'owl-solar', label: 'Solar Dark', emoji: '🦉', isDark: true,
    isOwlTheme: true, owlCycle: 'solar', owlUnlockDays: 70,
    owlAnimation: 'horizon-shift',
    void:         '#0C0800',
    bg:           '#181200',
    surface:      'rgba(255,193,7,0.05)',
    surfaceHover: 'rgba(255,193,7,0.08)',
    raised:       'rgba(255,193,7,0.09)',
    border:       'rgba(255,193,7,0.09)',
    borderStrong: 'rgba(255,193,7,0.40)',
    text:         '#FFFBE8',
    textSub:      'rgba(255,240,180,0.50)',
    textMuted:    'rgba(255,240,180,0.27)',
    horizon:      '#FFC107',
    horizonRgb:   '255,193,7',
    aurora:       'rgba(255,193,7,0.09)',
    glow:         'rgba(255,193,7,0.20)',
    gold:         '#FFC107',
    swatch:       'linear-gradient(160deg, #181200 0%, #261E00 55%, #FFC10716 100%)',
  },
  'owl-solar-light': {
    id: 'owl-solar-light', label: 'Solar Light', emoji: '🦉', isDark: false,
    isOwlTheme: true, owlCycle: 'solar', owlUnlockDays: 70,
    owlAnimation: 'horizon-shift',
    void:         '#FFE880',
    bg:           '#FFFBEA',
    surface:      '#FFFDF4',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(160,120,0,0.10)',
    borderStrong: 'rgba(160,120,0,0.45)',
    text:         '#302000',
    textSub:      'rgba(48,32,0,0.55)',
    textMuted:    'rgba(48,32,0,0.35)',
    horizon:      '#A07800',
    horizonRgb:   '160,120,0',
    aurora:       'rgba(160,120,0,0.08)',
    glow:         'rgba(160,120,0,0.18)',
    gold:         '#A07800',
    swatch:       'linear-gradient(160deg, #FFFBEA 0%, #FFE880 60%, #A0780022 100%)',
  },

  'owl-storm': {
    id: 'owl-storm', label: 'Storm Dark', emoji: '🦉', isDark: true,
    isOwlTheme: true, owlCycle: 'storm', owlUnlockDays: 100,
    owlAnimation: 'particles',
    void:         '#040818',
    bg:           '#080E28',
    surface:      'rgba(58,134,255,0.055)',
    surfaceHover: 'rgba(58,134,255,0.085)',
    raised:       'rgba(58,134,255,0.10)',
    border:       'rgba(58,134,255,0.09)',
    borderStrong: 'rgba(58,134,255,0.45)',
    text:         '#EEF4FF',
    textSub:      'rgba(195,215,255,0.52)',
    textMuted:    'rgba(195,215,255,0.28)',
    horizon:      '#3A86FF',
    horizonRgb:   '58,134,255',
    aurora:       'rgba(58,134,255,0.10)',
    glow:         'rgba(58,134,255,0.22)',
    gold:         '#3A86FF',
    swatch:       'linear-gradient(160deg, #080E28 0%, #101840 55%, #3A86FF18 100%)',
  },
  'owl-storm-light': {
    id: 'owl-storm-light', label: 'Storm Light', emoji: '🦉', isDark: false,
    isOwlTheme: true, owlCycle: 'storm', owlUnlockDays: 100,
    owlAnimation: 'particles',
    void:         '#B8D0FF',
    bg:           '#EBF0FF',
    surface:      '#F4F6FF',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(30,80,200,0.10)',
    borderStrong: 'rgba(30,80,200,0.45)',
    text:         '#081040',
    textSub:      'rgba(8,16,64,0.55)',
    textMuted:    'rgba(8,16,64,0.35)',
    horizon:      '#1E50C8',
    horizonRgb:   '30,80,200',
    aurora:       'rgba(30,80,200,0.08)',
    glow:         'rgba(30,80,200,0.18)',
    gold:         '#1E50C8',
    swatch:       'linear-gradient(160deg, #EBF0FF 0%, #B8D0FF 60%, #1E50C822 100%)',
  },

  'owl-aurora': {
    id: 'owl-aurora', label: 'Aurora Dark', emoji: '🦉', isDark: true,
    isOwlTheme: true, owlCycle: 'aurora', owlUnlockDays: 200,
    owlAnimation: 'full',
    void:         '#020E0A',
    bg:           '#061410',
    surface:      'rgba(42,255,198,0.05)',
    surfaceHover: 'rgba(42,255,198,0.08)',
    raised:       'rgba(42,255,198,0.09)',
    border:       'rgba(42,255,198,0.09)',
    borderStrong: 'rgba(42,255,198,0.40)',
    text:         '#E0FFF8',
    textSub:      'rgba(180,255,230,0.50)',
    textMuted:    'rgba(180,255,230,0.27)',
    horizon:      '#2AFFC6',
    horizonRgb:   '42,255,198',
    aurora:       'rgba(42,255,198,0.10)',
    glow:         'rgba(42,255,198,0.20)',
    gold:         '#2AFFC6',
    swatch:       'linear-gradient(160deg, #061410 0%, #0E2820 55%, #2AFFC616 100%)',
  },
  'owl-aurora-light': {
    id: 'owl-aurora-light', label: 'Aurora Light', emoji: '🦉', isDark: false,
    isOwlTheme: true, owlCycle: 'aurora', owlUnlockDays: 200,
    owlAnimation: 'full',
    void:         '#A0FFE8',
    bg:           '#E8FFF8',
    surface:      '#F2FFFC',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(0,160,120,0.10)',
    borderStrong: 'rgba(0,160,120,0.45)',
    text:         '#002820',
    textSub:      'rgba(0,40,32,0.55)',
    textMuted:    'rgba(0,40,32,0.35)',
    horizon:      '#00A078',
    horizonRgb:   '0,160,120',
    aurora:       'rgba(0,160,120,0.08)',
    glow:         'rgba(0,160,120,0.18)',
    gold:         '#00A078',
    swatch:       'linear-gradient(160deg, #E8FFF8 0%, #A0FFE8 60%, #00A07822 100%)',
  },

  'owl-cosmic': {
    id: 'owl-cosmic', label: 'Cosmic Dark', emoji: '🦉', isDark: true,
    isOwlTheme: true, owlCycle: 'cosmic', owlUnlockDays: 365,
    owlAnimation: 'full',
    void:         '#030310',
    bg:           '#07071E',
    surface:      'rgba(91,108,255,0.055)',
    surfaceHover: 'rgba(91,108,255,0.085)',
    raised:       'rgba(91,108,255,0.10)',
    border:       'rgba(91,108,255,0.09)',
    borderStrong: 'rgba(91,108,255,0.45)',
    text:         '#EEEEFF',
    textSub:      'rgba(210,210,255,0.52)',
    textMuted:    'rgba(210,210,255,0.28)',
    horizon:      '#5B6CFF',
    horizonRgb:   '91,108,255',
    aurora:       'rgba(91,108,255,0.10)',
    glow:         'rgba(91,108,255,0.22)',
    gold:         '#5B6CFF',
    swatch:       'linear-gradient(160deg, #07071E 0%, #100E30 55%, #5B6CFF18 100%)',
  },
  'owl-cosmic-light': {
    id: 'owl-cosmic-light', label: 'Cosmic Light', emoji: '🦉', isDark: false,
    isOwlTheme: true, owlCycle: 'cosmic', owlUnlockDays: 365,
    owlAnimation: 'full',
    void:         '#C0C8FF',
    bg:           '#EEEEFF',
    surface:      '#F5F6FF',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(60,70,200,0.10)',
    borderStrong: 'rgba(60,70,200,0.45)',
    text:         '#100A40',
    textSub:      'rgba(16,10,64,0.55)',
    textMuted:    'rgba(16,10,64,0.35)',
    horizon:      '#3C46C8',
    horizonRgb:   '60,70,200',
    aurora:       'rgba(60,70,200,0.08)',
    glow:         'rgba(60,70,200,0.18)',
    gold:         '#3C46C8',
    swatch:       'linear-gradient(160deg, #EEEEFF 0%, #C0C8FF 60%, #3C46C822 100%)',
  },

  'owl-mythic': {
    id: 'owl-mythic', label: 'Mythic Dark', emoji: '🦉', isDark: true,
    isOwlTheme: true, owlCycle: 'mythic', owlUnlockDays: 999999,
    owlAnimation: 'full',
    void:         '#020208',
    bg:           '#05050F',
    surface:      'rgba(0,194,199,0.055)',
    surfaceHover: 'rgba(0,194,199,0.085)',
    raised:       'rgba(0,194,199,0.10)',
    border:       'rgba(0,194,199,0.09)',
    borderStrong: 'rgba(0,194,199,0.40)',
    text:         '#E8FFFE',
    textSub:      'rgba(180,255,252,0.50)',
    textMuted:    'rgba(180,255,252,0.27)',
    horizon:      '#00C2C7',
    horizonRgb:   '0,194,199',
    aurora:       'rgba(0,194,199,0.10)',
    glow:         'rgba(0,194,199,0.22)',
    gold:         '#00C2C7',
    swatch:       'linear-gradient(160deg, #05050F 0%, #0A1020 55%, #00C2C716 100%)',
  },
  'owl-mythic-light': {
    id: 'owl-mythic-light', label: 'Mythic Light', emoji: '🦉', isDark: false,
    isOwlTheme: true, owlCycle: 'mythic', owlUnlockDays: 999999,
    owlAnimation: 'full',
    void:         '#A0F8FF',
    bg:           '#EAFEFF',
    surface:      '#F4FEFF',
    surfaceHover: '#FFFFFF',
    raised:       '#FFFFFF',
    border:       'rgba(0,140,145,0.10)',
    borderStrong: 'rgba(0,140,145,0.45)',
    text:         '#002830',
    textSub:      'rgba(0,40,48,0.55)',
    textMuted:    'rgba(0,40,48,0.35)',
    horizon:      '#008C91',
    horizonRgb:   '0,140,145',
    aurora:       'rgba(0,140,145,0.08)',
    glow:         'rgba(0,140,145,0.18)',
    gold:         '#008C91',
    swatch:       'linear-gradient(160deg, #EAFEFF 0%, #A0F8FF 60%, #008C9122 100%)',
  },
};

export const THEME_ORDER: ThemeId[] = [
  'void', 'obsidian', 'midnight', 'cosmos', 'aurora', 'ember', 'dusk', 'slate',
  'parchment', 'chalk', 'sand', 'fog',
  'owl-city', 'owl-city-light',
  'owl-lunar', 'owl-lunar-light',
  'owl-frost', 'owl-frost-light',
  'owl-forest', 'owl-forest-light',
  'owl-fire', 'owl-fire-light',
  'owl-solar', 'owl-solar-light',
  'owl-storm', 'owl-storm-light',
  'owl-aurora', 'owl-aurora-light',
  'owl-cosmic', 'owl-cosmic-light',
  'owl-mythic', 'owl-mythic-light',
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
    // Feed cards
    '--owf-card':           t.isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
    '--owf-card-border':    t.isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)',
    '--owf-card-glow':      t.horizon,
    '--owf-card-text':      t.isDark ? '#FFFFFF' : '#1A1410',
    '--owf-card-text-sub':  t.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(26,20,16,0.55)',
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
