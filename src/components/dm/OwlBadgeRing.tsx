'use client';

// Animated ring that wraps a user avatar based on their owl cycle.
// Visible on their profile and in DM conversation headers.
// The ring style escalates with rarity — common rotates slowly,
// legendary pulses and draws, mythic glows with gradient.

import { cycleFromDays } from '@/lib/streak';

interface OwlBadgeRingProps {
  streakDays: number;
  size?: number;         // outer ring diameter (default 56)
  children: React.ReactNode;
}

const RING_CONFIGS: Record<string, {
  color: string;
  color2?: string;
  strokeWidth: number;
  dashArray?: string;
  animation: string;
  duration: string;
  glowOpacity: number;
}> = {
  city:   { color: '#FFC8A0', strokeWidth: 1.5, dashArray: '4 3',    animation: 'rotate', duration: '10s', glowOpacity: 0.4 },
  lunar:  { color: '#6A9DFF', strokeWidth: 1.5, dashArray: '6 2',    animation: 'rotate', duration: '7s',  glowOpacity: 0.5 },
  frost:  { color: '#A9D6FF', strokeWidth: 1.5, dashArray: '8 2',    animation: 'rotate', duration: '6s',  glowOpacity: 0.5 },
  forest: { color: '#4CAF50', strokeWidth: 1.5, dashArray: '5 3',    animation: 'rotate', duration: '8s',  glowOpacity: 0.5 },
  fire:   { color: '#FF6A00', strokeWidth: 2,   dashArray: '3 2',    animation: 'rotate', duration: '4s',  glowOpacity: 0.6 },
  solar:  { color: '#FFC107', strokeWidth: 2,   dashArray: undefined, animation: 'pulse',  duration: '2s',  glowOpacity: 0.6 },
  storm:  { color: '#3A86FF', strokeWidth: 2,   dashArray: undefined, animation: 'draw',   duration: '3s',  glowOpacity: 0.65 },
  aurora: { color: '#2AFFC6', strokeWidth: 2.5, dashArray: undefined, animation: 'draw',   duration: '4s',  glowOpacity: 0.75 },
  cosmic: { color: '#5B6CFF', color2: '#2AFFC6', strokeWidth: 2.5, dashArray: undefined, animation: 'pulse', duration: '2.5s', glowOpacity: 0.8 },
  mythic: { color: '#00C2C7', color2: '#5B6CFF', strokeWidth: 3,   dashArray: undefined, animation: 'pulse', duration: '2s',   glowOpacity: 0.9 },
};

export function OwlBadgeRing({ streakDays, size = 56, children }: OwlBadgeRingProps) {
  const cycle = cycleFromDays(streakDays);

  // No ring below city threshold
  if (streakDays < 4) {
    return <div style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>;
  }

  const cfg = RING_CONFIGS[cycle] ?? RING_CONFIGS['city'];
  const r   = (size / 2) - 2;
  const cx  = size / 2;
  const circumference = 2 * Math.PI * r;
  const gradientId = `ring-grad-${cycle}`;

  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        {cfg.color2 && (
          <defs>
            <linearGradient id={gradientId} gradientTransform="rotate(90)">
              <stop offset="0%"   stopColor={cfg.color} />
              <stop offset="50%"  stopColor={cfg.color2} />
              <stop offset="100%" stopColor={cfg.color} />
            </linearGradient>
          </defs>
        )}
        {/* Ambient glow ring (static) */}
        <circle
          cx={cx} cy={cx} r={r + 2}
          fill="none"
          stroke={cfg.color}
          strokeWidth={cfg.strokeWidth + 2}
          opacity={0.08}
        />
        {/* Main ring */}
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={cfg.color2 ? `url(#${gradientId})` : cfg.color}
          strokeWidth={cfg.strokeWidth}
          strokeDasharray={cfg.dashArray ?? `${circumference} ${circumference}`}
          strokeLinecap="round"
          style={{
            transformOrigin: `${cx}px ${cx}px`,
            animation: cfg.animation === 'rotate'
              ? `owfRingRotate ${cfg.duration} linear infinite`
              : cfg.animation === 'pulse'
                ? `owfRingPulse ${cfg.duration} ease-in-out infinite`
                : `owfRingDraw ${cfg.duration} ease-in-out infinite`,
          }}
        />
      </svg>
      {/* Avatar / content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
