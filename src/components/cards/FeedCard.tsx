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
  featured?: boolean;
  compact?: boolean;
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
  featured = false,
  compact = false,
}: FeedCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const moodData = getMood(mood);
  const intensity = mounted ? getMoodIntensity(mood) : 0.7;
  const moodColor = moodData?.color ?? '#D97706';
  const moodRgb = moodData?.glowRgb ?? '217,119,6';
  const moodLabel = moodData?.label ?? mood;

  const avatarSize = featured ? 'w-13 h-13' : compact ? 'w-9 h-9' : 'w-11 h-11';
  const nameSize = featured ? 'text-base' : compact ? 'text-xs' : 'text-sm';
  const contentSize = featured ? 'text-base' : compact ? 'text-xs' : 'text-sm';
  const padding = featured ? 'p-6' : compact ? 'p-3' : 'p-5';

  return (
    <article
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01] ${featured ? 'mb-0' : 'mb-0'}`}
      style={{
        backgroundColor: 'var(--owf-surface)',
        border: `1px solid ${moodColor}44`,
        boxShadow: mounted
          ? `0 2px 16px rgba(${moodRgb}, ${intensity * 0.15})`
          : '0 1px 3px rgba(0,0,0,0.06)',
        ...(featured && {
          background: `linear-gradient(135deg, var(--owf-surface) 0%, ${moodColor}08 100%)`,
        }),
      }}
    >
      {/* Mood top bar */}
      <div
        className={`absolute top-0 left-0 right-0 ${featured ? 'h-[4px]' : 'h-[3px]'}`}
        style={{
          background: `linear-gradient(90deg, ${moodColor}, ${moodColor}00)`,
          opacity: intensity,
        }}
      />

      <div className={padding}>

        {/* Author row */}
        <div className={`flex items-center gap-3 ${featured ? 'mb-5' : compact ? 'mb-2' : 'mb-4'}`}>
          <div
            className="relative flex-shrink-0"
            style={{ filter: mounted ? `drop-shadow(0 0 6px ${moodColor}66)` : 'none' }}
          >
            <div
              className={`${featured ? 'w-12 h-12' : compact ? 'w-9 h-9' : 'w-11 h-11'} rounded-full flex items-center justify-center font-black text-white`}
              style={{
                fontSize: featured ? '1rem' : compact ? '0.7rem' : '0.875rem',
                background: `linear-gradient(135deg, ${moodColor}, ${moodColor}99)`,
              }}
            >
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 ${compact ? 'w-2 h-2' : 'w-3 h-3'} rounded-full border-2`}
              style={{ backgroundColor: moodColor, borderColor: 'var(--owf-surface)' }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`font-bold ${nameSize}`} style={{ color: 'var(--owf-text-primary)' }}>
                {authorName}
              </span>
              {!compact && (
                <span
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ color: moodColor, backgroundColor: `${moodColor}18` }}
                >
                  {moodLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.68rem' }}>{authorHandle}</span>
              <span style={{ color: 'var(--owf-border)', fontSize: '0.68rem' }}>·</span>
              <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.68rem' }}>{city}</span>
              <span style={{ color: 'var(--owf-border)', fontSize: '0.68rem' }}>·</span>
              <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.68rem' }}>{timeAgo}</span>
            </div>
          </div>

          {safetyBadge === 'clear' && !compact && (
            <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
              style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
              ✦ Clear
            </span>
          )}
          {safetyBadge === 'notice' && !compact && (
            <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
              style={{ backgroundColor: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' }}>
              ⚠ Notice
            </span>
          )}
        </div>

        {/* Content */}
        <p
          className={`leading-relaxed ${compact ? 'mb-2 line-clamp-3' : 'mb-4'}`}
          style={{
            fontSize: featured ? '1rem' : compact ? '0.78rem' : '0.95rem',
            color: 'var(--owf-text-primary)',
            letterSpacing: '0.01em',
          }}
        >
          {content.split(' ').map((word, i) =>
            word.startsWith('+') ? (
              <span key={i} className="font-semibold hover:underline cursor-pointer" style={{ color: moodColor }}>
                {word}{' '}
              </span>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </p>

        {imageUrl && (
          <div className="rounded-xl overflow-hidden mb-4 aspect-video" style={{ backgroundColor: 'var(--owf-bg)' }}>
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Engagement */}
        <div
          className={`flex items-center gap-4 ${compact ? 'pt-2' : 'pt-3'}`}
          style={{ borderTop: '1px solid var(--owf-border)' }}
        >
          <button className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: 'var(--owf-text-secondary)' }}>
            <span>♡</span><span>{likeCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: 'var(--owf-text-secondary)' }}>
            <span>◇</span><span>{commentCount}</span>
          </button>
          {!compact && (
            <button className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: 'var(--owf-text-secondary)' }}>
              <span>↗</span><span>Share</span>
            </button>
          )}
        </div>

      </div>

      {/* Bottom mood line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${moodColor}44, transparent)` }}
      />
    </article>
  );
}
