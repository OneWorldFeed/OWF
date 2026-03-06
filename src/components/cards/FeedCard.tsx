'use client';
import { useState, useEffect } from 'react';
import { getMood, getMoodIntensity } from '@/lib/theme';
import type { MoodId } from '@/lib/theme';

export interface FeedCardProps {
  id: string;
  authorName: string;
  authorHandle: string;
  city: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  mood: MoodId;
  safetyBadge?: 'clear' | 'notice' | 'rights';
  likeCount?: number;
  commentCount?: number;
}

export default function FeedCard({
  authorName,
  authorHandle,
  city,
  timeAgo,
  content,
  imageUrl,
  mood,
  safetyBadge,
  likeCount = 0,
  commentCount = 0,
}: FeedCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const moodData = getMood(mood);
  const intensity = mounted ? getMoodIntensity(mood) : 0.7;
  const moodColor = moodData?.color ?? '#D97706';
  const moodRgb = moodData?.glowRgb ?? '217,119,6';
  const moodLabel = moodData?.label ?? mood;

  return (
    <article
      className="relative rounded-2xl overflow-hidden mb-4 cursor-pointer transition-all duration-300"
      style={{
        backgroundColor: 'var(--owf-surface)',
        border: '1px solid var(--owf-border)',
        boxShadow: mounted
          ? `0 2px 12px rgba(${moodRgb}, ${intensity * 0.12})`
          : '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Mood top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${moodColor}, ${moodColor}00)`,
          opacity: intensity,
        }}
      />

      <div className="p-5">

        {/* Row 1 — Author */}
        <div className="flex items-center gap-3 mb-4">

          {/* Avatar with mood glow */}
          <div
            className="relative flex-shrink-0"
            style={{
              filter: mounted ? `drop-shadow(0 0 6px ${moodColor}66)` : 'none',
            }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black text-white"
              style={{
                background: `linear-gradient(135deg, ${moodColor}, ${moodColor}99)`,
              }}
            >
              {authorName.charAt(0).toUpperCase()}
            </div>
            {/* Mood pulse dot */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{
                backgroundColor: moodColor,
                borderColor: 'var(--owf-surface)',
              }}
            />
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="font-bold text-sm"
                style={{ color: 'var(--owf-text-primary)' }}
              >
                {authorName}
              </span>
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{
                  color: moodColor,
                  backgroundColor: `${moodColor}18`,
                }}
              >
                {moodLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.72rem' }}>
                {authorHandle}
              </span>
              <span style={{ color: 'var(--owf-border)', fontSize: '0.72rem' }}>·</span>
              <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.72rem' }}>
                {city}
              </span>
              <span style={{ color: 'var(--owf-border)', fontSize: '0.72rem' }}>·</span>
              <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.72rem' }}>
                {timeAgo}
              </span>
            </div>
          </div>

          {/* Safety badge */}
          {safetyBadge === 'clear' && (
            <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-medium"
              style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
              ✦ Clear
            </span>
          )}
          {safetyBadge === 'notice' && (
            <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-medium"
              style={{ backgroundColor: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' }}>
              ⚠ Notice
            </span>
          )}
        </div>

        {/* Row 2 — Content */}
        <p
          className="leading-relaxed mb-4"
          style={{
            fontSize: '0.975rem',
            color: 'var(--owf-text-primary)',
            letterSpacing: '0.01em',
          }}
        >
          {content.split(' ').map((word, i) =>
            word.startsWith('+') ? (
              <span
                key={i}
                className="font-semibold hover:underline cursor-pointer"
                style={{ color: moodColor }}
              >
                {word}{' '}
              </span>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </p>

        {/* Row 3 — Image */}
        {imageUrl && (
          <div className="rounded-xl overflow-hidden mb-4 aspect-video"
            style={{ backgroundColor: 'var(--owf-bg)' }}>
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Row 4 — Engagement */}
        <div
          className="flex items-center gap-6 pt-3"
          style={{ borderTop: '1px solid var(--owf-border)' }}
        >
          <button
            className="flex items-center gap-2 text-xs transition-colors group/btn"
            style={{ color: 'var(--owf-text-secondary)' }}
          >
            <span className="text-base">♡</span>
            <span>{likeCount}</span>
          </button>
          <button
            className="flex items-center gap-2 text-xs transition-colors group/btn"
            style={{ color: 'var(--owf-text-secondary)' }}
          >
            <span className="text-base">◇</span>
            <span>{commentCount}</span>
          </button>
          <button
            className="flex items-center gap-2 text-xs transition-colors ml-auto"
            style={{ color: 'var(--owf-text-secondary)' }}
          >
            <span className="text-base">↗</span>
            <span>Share</span>
          </button>
        </div>

      </div>

      {/* Bottom mood line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${moodColor}33, transparent)`,
        }}
      />
    </article>
  );
}
