'use client';
import { THEMES, THEME_ORDER } from '@/lib/theme';
import { useTheme } from '@/context/ThemeProvider';
import type { ThemeId } from '@/lib/theme';
import type { OwlCycle } from '@/lib/streak';
import OwlImage from '@/components/dm/OwlImage';

const OWL_IDS = THEME_ORDER.filter((id: ThemeId) => id.startsWith('owl-'));

export default function ThemeSelector() {
  const { themeId, theme: T, setTheme } = useTheme();

  const standardIds = THEME_ORDER.filter((id: ThemeId) => !id.startsWith('owl-'));
  const darkIds     = standardIds.filter((id: ThemeId) => THEMES[id].isDark);
  const lightIds    = standardIds.filter((id: ThemeId) => !THEMES[id].isDark);

  function renderGrid(ids: ThemeId[], isDarkGroup: boolean) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {ids.map((id: ThemeId) => {
          const t = THEMES[id];
          const active = themeId === id;
          return (
            <button key={id} onClick={() => setTheme(id)} title={t.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
              minWidth: 0,
            }}>
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: '14px',
                background: t.swatch,
                border: active
                  ? `2px solid ${t.horizon}`
                  : isDarkGroup ? '2px solid rgba(255,255,255,0.08)' : '2px solid rgba(0,0,0,0.10)',
                boxShadow: active
                  ? `0 0 0 3px ${t.horizon}35, 0 0 18px ${t.aurora}`
                  : isDarkGroup ? '0 2px 8px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.10)',
                position: 'relative', overflow: 'hidden', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                transform: active ? 'scale(1.08)' : 'scale(1)',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 'inherit',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 50%, transparent)',
                  backgroundSize: '200% auto',
                  animation: active ? 'themeShimmer 2.4s linear infinite' : undefined,
                  opacity: active ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                  background: t.horizon, opacity: active ? 1 : 0.45,
                  boxShadow: active ? `0 0 8px ${t.horizon}` : undefined,
                  transition: 'opacity 0.2s',
                }} />
                {active && (
                  <div style={{
                    position: 'absolute', top: '5px', right: '5px',
                    width: '9px', height: '9px', borderRadius: '50%',
                    background: t.horizon, boxShadow: `0 0 6px ${t.horizon}`,
                  }} />
                )}
              </div>
              <span style={{
                fontSize: '8px', fontWeight: active ? 800 : 500,
                color: active ? t.horizon : 'var(--owf-text-muted)',
                letterSpacing: '0.02em', transition: 'color 0.2s',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                width: '100%', textAlign: 'center',
              }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  function renderOwlGrid() {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {OWL_IDS.map((id: ThemeId) => {
          const t      = THEMES[id];
          const active = themeId === id;
          const cycle  = id.replace('owl-', '') as OwlCycle;
          return (
            <button key={id} onClick={() => setTheme(id)} title={t.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
              minWidth: 0,
            }}>
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: '14px',
                background: t.swatch,
                border: active
                  ? `2px solid ${t.horizon}`
                  : '2px solid rgba(255,255,255,0.08)',
                boxShadow: active
                  ? `0 0 0 3px ${t.horizon}35, 0 0 18px ${t.aurora}`
                  : '0 2px 8px rgba(0,0,0,0.35)',
                position: 'relative', overflow: 'hidden', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                transform: active ? 'scale(1.08)' : 'scale(1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 'inherit',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 50%, transparent)',
                  backgroundSize: '200% auto',
                  animation: active ? 'themeShimmer 2.4s linear infinite' : undefined,
                  opacity: active ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                  background: t.horizon, opacity: active ? 1 : 0.45,
                  boxShadow: active ? `0 0 8px ${t.horizon}` : undefined,
                  transition: 'opacity 0.2s',
                }} />
                {active && (
                  <div style={{
                    position: 'absolute', top: '5px', right: '5px',
                    width: '9px', height: '9px', borderRadius: '50%',
                    background: t.horizon, boxShadow: `0 0 6px ${t.horizon}`,
                  }} />
                )}
                <OwlImage
                  cycle={cycle}
                  size={28}
                  mood="calm"
                  style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
                />
              </div>
              <span style={{
                fontSize: '8px', fontWeight: active ? 800 : 500,
                color: active ? t.horizon : 'var(--owf-text-muted)',
                letterSpacing: '0.02em', transition: 'color 0.2s',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                width: '100%', textAlign: 'center',
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
    <div>
      <style>{`
        @keyframes themeShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      {/* Active theme header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
        <div style={{
          width: '22px', height: '22px', borderRadius: '7px', flexShrink: 0,
          background: T.swatch, border: `1.5px solid ${T.horizon}60`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4) 50%, transparent)',
            backgroundSize: '200% auto', animation: 'themeShimmer 2.4s linear infinite',
          }} />
        </div>
        <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.12em', color: 'var(--owf-text-muted)', lineHeight: 1 }}>
          THEME — <span style={{ color: T.horizon }}>{T.emoji} {T.label}</span>
        </p>
      </div>

      <p style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--owf-text-muted)', marginBottom: '8px' }}>
        DARK
      </p>
      {renderGrid(darkIds, true)}

      <div style={{ height: '1px', background: 'var(--owf-border)', margin: '16px 0' }} />

      <p style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--owf-text-muted)', marginBottom: '8px' }}>
        LIGHT
      </p>
      {renderGrid(lightIds, false)}

      <div style={{ height: '1px', background: 'var(--owf-border)', margin: '16px 0' }} />

      <p style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--owf-text-muted)', marginBottom: '8px' }}>
        OWL CYCLES
      </p>
      {renderOwlGrid()}
    </div>
  );
}
