'use client';
import { useState, useEffect, useRef } from 'react';
import { getMood, getMoodIntensity } from '@/lib/theme';
import { recordInteraction, toggleLike, GLOW_PULSE } from '@/lib/firebase/interactions';
import type { MoodId } from '@/lib/theme';

interface VideoCardProps {
  id: string;
  authorName: string;
  authorHandle: string;
  city: string;
  timeAgo: string;
  content: string;
  mood: MoodId;
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  likeCount?: number;
  commentCount?: number;
  safetyBadge?: 'clear' | 'notice' | 'rights';
  accolade?: string;
  trophy?: boolean;
  featured?: boolean;
  isOwner?: boolean;
}

const GUEST_ID = 'guest_preview';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoCard({
  id, authorName, authorHandle, city, timeAgo, content,
  mood, videoUrl, videoThumbnail, videoDuration = 0,
  likeCount = 0, commentCount = 0, safetyBadge,
  accolade, trophy = false, featured = false, isOwner = false,
}: VideoCardProps) {
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [pulse, setPulse] = useState<null | 'like' | 'save' | 'share'>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const moodData = getMood(mood);
  const intensity = mounted ? getMoodIntensity(mood) : 0.7;
  const moodColor = moodData?.color ?? '#D97706';
  const moodRgb = moodData?.glowRgb ?? '217,119,6';
  const moodLabel = moodData?.label ?? mood;

  const triggerPulse = (type: 'like' | 'save' | 'share') => {
    setPulse(type);
    setTimeout(() => setPulse(null), GLOW_PULSE[type].duration);
  };

  const handlePlay = () => {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
      setPlaying(true);
    }
  };

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikes(prev => prev + (next ? 1 : -1));
    triggerPulse('like');
    await toggleLike(id, GUEST_ID, liked, mood, city);
  };

  const handleSave = async () => {
    setSaved(!saved);
    triggerPulse('save');
    await recordInteraction(id, GUEST_ID, 'save', mood, city);
  };

  const handleShare = async () => {
    triggerPulse('share');
    await recordInteraction(id, GUEST_ID, 'share', mood, city);
  };

  // Prevent right-click on video
  const preventContext = (e: React.MouseEvent) => e.preventDefault();

  return (
    <article
      className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        backgroundColor: 'var(--owf-surface)',
        border: `1px solid ${moodColor}55`,
        boxShadow: `0 2px 16px rgba(${moodRgb}, ${intensity * 0.15})`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Mood top bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-10"
        style={{ background: `linear-gradient(90deg, ${moodColor}, ${moodColor}00)`, opacity: intensity }} />

      {trophy && <div className="absolute top-3 right-3 z-10 text-lg">👑</div>}

      {/* Video area — wider rectangle */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: featured ? '240px' : '200px',
          backgroundColor: '#000',
        }}
        onContextMenu={preventContext}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={videoThumbnail}
            className="w-full h-full object-cover"
            style={{ pointerEvents: 'none' }}
            onContextMenu={preventContext}
            onEnded={() => setPlaying(false)}
          />
        ) : videoThumbnail ? (
          <img
            src={videoThumbnail}
            alt=""
            className="w-full h-full object-cover"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
            onContextMenu={preventContext}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${moodColor}22, ${moodColor}44)` }}>
            <span className="text-4xl opacity-40">▶</span>
          </div>
        )}

        {/* Play button overlay */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center transition-all"
          style={{ backgroundColor: playing ? 'transparent' : 'rgba(0,0,0,0.35)' }}
        >
          {!playing && (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{ backgroundColor: `${moodColor}cc`, boxShadow: `0 0 20px ${moodColor}88` }}
            >
              <span className="text-white text-xl ml-1">▶</span>
            </div>
          )}
        </button>

        {/* Duration badge */}
        {videoDuration > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-white px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
            {formatDuration(videoDuration)}
          </div>
        )}

        {/* 90s max badge */}
        {videoDuration > 0 && (
          <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: `${moodColor}cc`, color: '#fff' }}>
            ≤ 90s
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-shrink-0"
            style={{ filter: `drop-shadow(0 0 6px ${moodColor}66)` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm"
              style={{ background: `linear-gradient(135deg, ${moodColor}, ${moodColor}bb)` }}>
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{ backgroundColor: moodColor, borderColor: 'var(--owf-surface)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm" style={{ color: 'var(--owf-text-primary)' }}>
                {authorName}
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{ color: moodColor, backgroundColor: `${moodColor}18` }}>
                {moodLabel}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.68rem' }}>{authorHandle}</span>
              <span style={{ color: 'var(--owf-border)', fontSize: '0.68rem' }}>·</span>
              <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.68rem' }}>{city}</span>
              <span style={{ color: 'var(--owf-border)', fontSize: '0.68rem' }}>·</span>
              <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.68rem' }}>{timeAgo}</span>
            </div>
          </div>
          {safetyBadge === 'clear' && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
              style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>
              ✦ Clear
            </span>
          )}
        </div>

        {accolade && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
            style={{ backgroundColor: `${moodColor}15`, color: moodColor, border: `1px solid ${moodColor}33` }}>
            ✦ {accolade}
          </div>
        )}

        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--owf-text-primary)' }}>
          {content.split(' ').map((word, i) =>
            word.startsWith('+') ? (
              <span key={i} className="font-semibold cursor-pointer hover:underline" style={{ color: moodColor }}>
                {word}{' '}
              </span>
            ) : <span key={i}>{word} </span>
          )}
        </p>

        {/* Engagement */}
        <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid var(--owf-border)' }}>
          <button onClick={handleLike}
            className="flex items-center gap-1.5 text-xs transition-all"
            style={{
              color: liked ? moodColor : 'var(--owf-text-secondary)',
              transform: pulse === 'like' ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
            }}>
            <span>{liked ? '♥' : '♡'}</span><span>{likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--owf-text-secondary)' }}>
            <span>◇</span><span>{commentCount}</span>
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-1.5 text-xs transition-all"
            style={{
              color: saved ? moodColor : 'var(--owf-text-secondary)',
              transform: pulse === 'save' ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform 400ms cubic-bezier(0.34,1.56,0.64,1)',
            }}>
            <span>{saved ? '★' : '☆'}</span>
          </button>
          {isOwner && (
            
              href={videoUrl}
              download
              className="flex items-center gap-1.5 text-xs ml-auto"
              style={{ color: moodColor }}
              title="Download your video"
            >
              ↓ Save
            </a>
          )}
          {!isOwner && (
            <button onClick={handleShare}
              className="flex items-center gap-1.5 text-xs ml-auto"
              style={{ color: 'var(--owf-text-secondary)' }}>
              <span>↗</span><span>Share</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom mood line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${moodColor}44, transparent)` }} />
    </article>
  );
}
