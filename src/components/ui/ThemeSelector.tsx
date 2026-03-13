'use client';

import { THEMES, THEME_ORDER } from '@/lib/theme';
import { useTheme } from '@/context/ThemeProvider';
import { getUnlockedOwlThemes } from '@/lib/streak';
import type { ThemeId } from '@/lib/theme';

// In production this comes from the user's real streak data
// For now default to 0 so everything is locked except what they earned
const DEMO_STREAK_DAYS = 0;

const OWL_CYCLE_ORDER = [
  'city', 'lunar', 'frost', 'forest', 'fire',
  'solar', 'storm', 'aurora', 'cosmic', 'mythic',
];

const OWL_UNLOCK_DAYS: Record<string, number> = {
  city: 4, lunar: 10, frost: 20, forest: 30, fire: 50,
  solar: 70, storm: 100, aurora: 200, cosmic: 365, mythic: 999999,
};

export default function ThemeSelector({ streakDays = DEMO_STREAK_DAYS }: { streakDays?: number }) {
  const { themeId, theme: T, setTheme } = useTheme();
  const unlockedOwl = getUnlockedOwlThemes(streakDays);
  const standardThemes = THEME_ORDER.filter(id => !THEMES[id].isOwlTheme);
  const darkStandard   = standardThemes.filter(id => THEMES[id].isDark);
  const lightStandard  = standardThemes.filter(id => !THEMES[id].isDark);

  const hRgb = T.horizonRgb;
  const isDark = T.isDark;

  function renderStandardGrid(ids: ThemeId[]) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {ids.map(id => {
          const t = THEMES[id];
          const active = themeId === id;
          return (
            <button key={id} onClick={() => setTheme(id)} title={t.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', minWidth: 0,
            }}>
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: 12,
                background: t.swatch,
                border: active ? `2px solid ${t.horizon}` : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)'}`,
                boxShadow: active ? `0 0 0 3px ${t.horizon}30, 0 0 16px ${t.aurora}` : '0 2px 6px rgba(0,0,0,0.12)',
                position: 'relative', overflow: 'hidden',
                transform: active ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.2s ease',
              }}>
                {active && (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 'inherit',
                    background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3) 50%,transparent)',
                    animation: 'themeShimmer 2.4s linear infinite',
                  }} />
                )}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                  background: t.horizon, opacity: active ? 1 : 0.4,
                  boxShadow: active ? `0 0 6px ${t.horizon}` : 'none',
                }} />
                {active && (
                  <div style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 7, height: 7, borderRadius: '50%',
                    background: t.horizon, boxShadow: `0 0 5px ${t.horizon}`,
                  }} />
                )}
              </div>
              <span style={{
                fontSize: 8, fontWeight: active ? 700 : 400,
                color: active ? t.horizon : `rgba(${hRgb},0.5)`,
                letterSpacing: '0.04em', width: '100%', textAlign: 'center',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                transition: 'color 0.2s',
              }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Standard dark themes */}
      <div>
        <div style={{
          fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: `rgba(${hRgb},0.5)`, marginBottom: 10,
        }}>
          Dark
        </div>
        {renderStandardGrid(darkStandard)}
      </div>

      {/* Standard light themes */}
      <div>
        <div style={{
          fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: `rgba(${hRgb},0.5)`, marginBottom: 10,
        }}>
          Light
        </div>
        {renderStandardGrid(lightStandard)}
      </div>

      {/* Divider */}
      <div style={{
        height: 0.5,
        background: `linear-gradient(90deg, transparent, rgba(${hRgb},0.3), transparent)`,
      }} />

      {/* Owl themes */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: `rgba(${hRgb},0.5)`, marginBottom: 2,
          }}>
            Owl Cycles — Streak Rewards
          </div>
          <div style={{ fontSize: 10, color: `rgba(${hRgb},0.35)` }}>
            {streakDays === 0
              ? 'Build a streak to unlock these themes'
              : `${streakDays} day streak — keep going`}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {OWL_CYCLE_ORDER.map(cycle => {
            const darkId   = `owl-${cycle}` as ThemeId;
            const lightId  = `owl-${cycle}-light` as ThemeId;
            const darkTheme  = THEMES[darkId];
            const lightTheme = THEMES[lightId];
            const unlocked   = unlockedOwl.includes(darkId);
            const required   = OWL_UNLOCK_DAYS[cycle];
            const activeDark  = themeId === darkId;
            const activeLight = themeId === lightId;

            return (
              <div key={cycle} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Dark variant */}
                <button
                  onClick={() => unlocked && setTheme(darkId)}
                  disabled={!unlocked}
                  title={unlocked ? darkTheme.label : `Unlock at day ${required}`}
                  style={{
                    flex: 1, position: 'relative', borderRadius: 10,
                    aspectRatio: '1.6', overflow: 'hidden', cursor: unlocked ? 'pointer' : 'default',
                    background: unlocked ? darkTheme.swatch : 'rgba(255,255,255,0.04)',
                    border: activeDark
                      ? `2px solid ${darkTheme.horizon}`
                      : unlocked
                        ? `1px solid rgba(255,255,255,0.10)`
                        : `1px solid rgba(255,255,255,0.05)`,
                    transform: activeDark ? 'scale(1.06)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    filter: unlocked ? 'none' : 'grayscale(1)',
                    opacity: unlocked ? 1 : 0.35,
                  }}
                >
                  {unlocked && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5,
                      background: darkTheme.horizon, opacity: activeDark ? 1 : 0.5,
                      boxShadow: activeDark ? `0 0 5px ${darkTheme.horizon}` : 'none',
                    }} />
                  )}
                  {!unlocked && (
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const, gap: 1,
                    }}>
                      <div style={{ fontSize: 10, opacity: 0.4 }}>🦉</div>
                    </div>
                  )}
                </button>

                {/* Light variant */}
                <button
                  onClick={() => unlocked && setTheme(lightId)}
                  disabled={!unlocked}
                  title={unlocked ? lightTheme.label : `Unlock at day ${required}`}
                  style={{
                    flex: 1, position: 'relative', borderRadius: 10,
                    aspectRatio: '1.6', overflow: 'hidden', cursor: unlocked ? 'pointer' : 'default',
                    background: unlocked ? lightTheme.swatch : 'rgba(255,255,255,0.03)',
                    border: activeLight
                      ? `2px solid ${lightTheme.horizon}`
                      : unlocked
                        ? `1px solid rgba(0,0,0,0.09)`
                        : `1px solid rgba(255,255,255,0.04)`,
                    transform: activeLight ? 'scale(1.06)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    filter: unlocked ? 'none' : 'grayscale(1)',
                    opacity: unlocked ? 1 : 0.3,
                  }}
                >
                  {unlocked && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5,
                      background: lightTheme.horizon, opacity: activeLight ? 1 : 0.5,
                      boxShadow: activeLight ? `0 0 5px ${lightTheme.horizon}` : 'none',
                    }} />
                  )}
                  {!unlocked && (
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ fontSize: 10, opacity: 0.3 }}>🦉</div>
                    </div>
                  )}
                </button>

                {/* Cycle label + progress */}
                <div style={{ width: 56, flexShrink: 0 }}>
                  <div style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: unlocked ? darkTheme.horizon : `rgba(${hRgb},0.3)`,
                    marginBottom: 2,
                  }}>
                    {cycle}
                  </div>
                  <div style={{ fontSize: 8, color: `rgba(${hRgb},0.3)` }}>
                    {unlocked ? '✓ Unlocked' : `Day ${required}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
