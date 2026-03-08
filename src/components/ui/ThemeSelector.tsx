'use client';

import { useTheme, THEMES, ThemeId } from '@/context/ThemeProvider';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ width: '100%' }}>
      <p style={{
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--owf-text-muted)',
        marginBottom: '12px',
      }}>
        Theme
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
      }}>
        {THEMES.map((t) => {
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as ThemeId)}
              title={t.description}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 6px',
                borderRadius: '10px',
                border: isActive
                  ? '1.5px solid var(--owf-horizon)'
                  : '1.5px solid var(--owf-border)',
                background: isActive ? 'var(--owf-aurora)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                outline: 'none',
              }}
            >
              {/* Swatch */}
              <div style={{
                width: '36px',
                height: '22px',
                borderRadius: '6px',
                overflow: 'hidden',
                display: 'flex',
                boxShadow: isActive
                  ? `0 0 8px ${t.preview[1]}66`
                  : '0 1px 3px rgba(0,0,0,0.15)',
              }}>
                {t.preview.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>

              {/* Label */}
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--owf-text)' : 'var(--owf-text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                textAlign: 'center',
              }}>
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
