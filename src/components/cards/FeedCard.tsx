'use client';
import { useState, useEffect, useCallback } from 'react';
import { getMood, getMoodIntensity } from '@/lib/theme';
import { toggleLike, recordInteraction, GLOW_PULSE } from '@/lib/firebase/interactions';
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
  accolade?: string;
  trophy?: boolean;
}

// Temporary guest userId until auth is wired
const GUEST_ID = 'guest_preview';

export default function FeedCard({
  id,
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
  accolade,
  trophy = false,
}: FeedCardProps) {
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [pulse, setPulse] = useState<null | 'like' | 'comment' | 'share' | 'save'>(null);
  const [glowIntensity, setGlowIntensity] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  const moodData = getMood(mood);
  const baseIntensity = mounted ? getMoodIntensity(mood) : 0.7;
  const moodColor = moodData?.color ?? '#D97706';
  const moodRgb = moodData?.glowRgb ?? '217,119,6';
  const moodLabel = moodData?.label ?? mood;

  // Trigger glow pulse animation
  const triggerPulse = useCallback((type: 'like' | 'comment' | 'share' | 'save') => {
    const cfg = GLOW_PULSE[type];
    setPulse(type);
    setGlowIntensity(1);
    setTimeout(() => {
      setPulse(null);
      setGlowIntensity(0);
    }, cfg.duration);
  }, []);

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikes(prev => prev + (next ? 1 : -1));
    triggerPulse('like');
    await toggleLike(id, GUEST_ID, liked, mood, city);
  };

  const handleShare = async () => {
    triggerPulse('share');
    await recordInteraction(id, GUEST_ID, 'share', mood, city);
  };

  const handleSave = async () => {
    const next = !saved;
    setSaved(next);
    if (next) triggerPulse('save');
    await recordInteraction(id, GUEST_ID, 'save', mood, city);
  };

  const currentIntensity = baseIntensity + glowIntensity * 0.6;
  const pulseScale = pulse ? GLOW_PULSE[pulse].scale : 1;
  const pulseDuration = pulse ? GLOW_PULSE[pulse].duration : 300;

  return (
    <article
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        backgroundColor: 'var(--owf-surface)',
        border: `1px solid ${moodColor}55`,
        boxShadow: mounted
          ? `0 2px 16px rgba(${moodRgb}, ${currentIntensity * 0.2}),
             0 0 0 ${glowIntensity * 3}px ${moodColor}22`
          : '0 1px 3px rgba(0,0,0,0.06)',
        transform: `scale(${pulseScale})`,
        transition: `transform ${pulseDuration}ms cubic-bezier(0.34,1.56,0.64,1),
                     box-shadow ${pulseDuration}ms ease,
                     border-color 300ms ease`,
        ...(featured && {
          background: `linear-gradient(135deg, var(--owf-surface) 0%, ${moodColor}08 100%)`,
        }),
      }}
    >
      {/* Mood top bar */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: featured ? '4px' : '3px',
          background: `linear-gradient(90deg, ${moodColor}, ${moodColor}00)`,
          opacity: currentIntensity,
          transition: 'opacity 400ms ease',
        }}
      />

      {/* Trophy crown */}
      {trophy && (
        <div className="absolute top-3 right-3 text-lg" title="Trophy">👑</div>
      )}

      <div className={featured ? 'p-6' : compact ? 'p-3' : 'p-5'}>

        {/* Author row */}
        <div className={`flex items-center gap-3 ${featured ? 'mb-5' : compact ? 'mb-2' : 'mb-4'}`}>
          <div
            className="relative flex-shrink-0"
            style={{
              filter: mounted
                ? `drop-shadow(0 0 ${6 + glowIntensity * 8}px ${moodColor}${Math.round((0.4 + glowIntensity * 0.4) * 255).toString(16).padStart(2,'0')})`
                : 'none',
              transition: 'filter 400ms ease',
            }}
          >
            <div
              className="rounded-full flex items-center justify-center font-black text-white"
              style={{
                width: featured ? '48px' : compact ? '36px' : '44px',
                height: featured ? '48px' : compact ? '36px' : '44px',
                fontSize: featured ? '1rem' : compact ? '0.7rem' : '0.875rem',
                background: `linear-gradient(135deg, ${moodColor}, ${moodColor}bb)`,
              }}
            >
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 rounded-full border-2"
              style={{
                width: compact ? '8px' : '12px',
                height: compact ? '8px' : '12px',
                backgroundColor: moodColor,
                borderColor: 'var(--owf-surface)',
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="font-bold"
                style={{
                  fontSize: featured ? '1rem' : compact ? '0.78rem' : '0.875rem',
                  color: 'var(--owf-text-primary)',
                }}
              >
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

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {safetyBadge === 'clear' && !compact && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
                ✦ Clear
              </span>
            )}
            {safetyBadge === 'notice' && !compact && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' }}>
                ⚠ Notice
              </span>
            )}
          </div>
        </div>

        {/* Accolade badge */}
        {accolade && !compact && (
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
            style={{
              backgroundColor: `${moodColor}15`,
              color: moodColor,
              border: `1px solid ${moodColor}33`,
            }}
          >
            ✦ {accolade}
          </div>
        )}

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
              <span key={i} className="font-semibold hover:underline cursor-pointer"
                style={{ color: moodColor }}>
                {word}{' '}
              </span>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </p>

        {imageUrl && (
          <div className="rounded-xl overflow-hidden mb-4 aspect-video"
            style={{ backgroundColor: 'var(--owf-bg)' }}>
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Engagement row */}
        <div
          className={`flex items-center gap-4 ${compact ? 'pt-2' : 'pt-3'}`}
          style={{ borderTop: '1px solid var(--owf-border)' }}
        >
          {/* Like */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-xs transition-all"
            style={{
              color: liked ? moodColor : 'var(--owf-text-secondary)',
              transform: pulse === 'like' ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1), color 200ms ease',
            }}
          >
            <span className="text-base">{liked ? '♥' : '♡'}</span>
            <span>{likes}</span>
          </button>

          {/* Comment */}
          <button
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--owf-text-secondary)' }}
          >
            <span className="text-base">◇</span>
            <span>{commentCount}</span>
          </button>

          {/* Save */}
          {!compact && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs transition-all"
              style={{
                color: saved ? moodColor : 'var(--owf-text-secondary)',
                transform: pulse === 'save' ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 400ms cubic-bezier(0.34,1.56,0.64,1), color 200ms ease',
              }}
            >
              <span className="text-base">{saved ? '★' : '☆'}</span>
            </button>
          )}

          {/* Share */}
          {!compact && (
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs ml-auto transition-all"
              style={{
                color: 'var(--owf-text-secondary)',
                transform: pulse === 'share' ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <span className="text-base">↗</span>
              <span>Share</span>
            </button>
          )}
        </div>

      </div>

      {/* Bottom mood line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${moodColor}${Math.round(currentIntensity * 100).toString(16).padStart(2,'0')}, transparent)`,
          transition: 'opacity 400ms ease',
        }}
      />
    </article>
  );
}
