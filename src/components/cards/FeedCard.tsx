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
  const [reposted, setReposted] = useState(false);
  const [reposts, setReposts] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<{handle: string; text: string; time: string; color: string}[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentCount2, setCommentCount2] = useState(commentCount);

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

  const handleRepost = () => {
    const next = !reposted;
    setReposted(next);
    setReposts(prev => prev + (next ? 1 : -1));
  };

  const handleCommentToggle = () => {
    setCommentsOpen(prev => !prev);
  };

  const handleCommentSubmit = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments(prev => [...prev, {
      handle: 'you.feed',
      text,
      time: 'just now',
      color: moodColor,
    }]);
    setCommentText('');
    setCommentCount2(prev => prev + 1);
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
          <div
            className="rounded-xl overflow-hidden mb-3"
            style={{
              backgroundColor: 'var(--owf-bg)',
              height: featured ? '200px' : '160px',
            }}
          >
            <img
              src={imageUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
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
            onClick={handleCommentToggle}
            className="flex items-center gap-1.5 text-xs transition-all hover:scale-110"
            style={{ color: commentsOpen ? moodColor : 'var(--owf-text-secondary)' }}
          >
            <span className="text-base">{commentsOpen ? '◆' : '◇'}</span>
            <span>{commentCount2}</span>
          </button>

          {/* Repost */}
          <button
            onClick={handleRepost}
            className="flex items-center gap-1.5 text-xs transition-all hover:scale-110"
            style={{
              color: reposted ? moodColor : 'var(--owf-text-secondary)',
              transition: 'color 200ms ease, transform 200ms ease',
            }}
          >
            <span className="text-base">⟳</span>
            {reposts > 0 && <span>{reposts}</span>}
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

      {/* Comments section */}
      {commentsOpen && (
        <div className="px-4 pb-4 pt-2" style={{ borderTop: `1px solid ${moodColor}22` }}>
          {/* Existing comments */}
          {comments.length > 0 && (
            <div className="space-y-3 mb-3">
              {comments.map((c, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                    style={{ backgroundColor: c.color }}>
                    {c.handle.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold" style={{ color: 'var(--owf-text-primary)' }}>{c.handle}</span>
                      <span className="text-[10px]" style={{ color: 'var(--owf-text-secondary)' }}>{c.time}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--owf-text-primary)' }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {comments.length === 0 && (
            <p className="text-xs mb-3 text-center" style={{ color: 'var(--owf-text-secondary)' }}>Be the first to comment</p>
          )}
          {/* Comment input */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={commentText}
              onChange={e => e.target.value.length <= 280 && setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()}
              placeholder="Add a comment..."
              className="flex-1 text-xs px-3 py-2 rounded-xl focus:outline-none"
              style={{ backgroundColor: 'var(--owf-bg)', border: `1px solid ${moodColor}33`, color: 'var(--owf-text-primary)' }}
            />
            <span className="text-[10px] flex-shrink-0" style={{ color: commentText.length > 250 ? '#EF4444' : 'var(--owf-text-secondary)' }}>
              {280 - commentText.length}
            </span>
            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
              className="text-xs font-bold px-3 py-2 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: commentText.trim() ? moodColor : 'var(--owf-border)', color: '#fff' }}>
              Post
            </button>
          </div>
        </div>
      )}

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
