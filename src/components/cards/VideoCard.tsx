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
  return m + ':' + s.toString().padStart(2, '0');
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
  const [reposted, setReposted] = useState(false);
  const [reposts, setReposts] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<{handle: string; text: string; time: string; color: string}[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentCount2, setCommentCount2] = useState(commentCount);
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

  const preventContext = (e: React.MouseEvent) => e.preventDefault();

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid ' + moodColor + '55',
    boxShadow: '0 2px 16px rgba(' + moodRgb + ', ' + intensity * 0.15 + ')',
    userSelect: 'none',
    WebkitUserSelect: 'none' as any,
  };

  const topBarStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, ' + moodColor + ', ' + moodColor + '00)',
    opacity: intensity,
  };

  const videoAreaStyle: React.CSSProperties = {
    height: featured ? '240px' : '200px',
    backgroundColor: '#000',
  };

  const playBtnStyle: React.CSSProperties = {
    backgroundColor: moodColor + 'cc',
    boxShadow: '0 0 20px ' + moodColor + '88',
  };

  const avatarStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, ' + moodColor + ', ' + moodColor + 'bb)',
  };

  const moodPipStyle: React.CSSProperties = {
    backgroundColor: moodColor,
    borderColor: 'var(--owf-surface)',
  };

  const moodLabelStyle: React.CSSProperties = {
    color: moodColor,
    backgroundColor: moodColor + '18',
  };

  const bottomLineStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, transparent, ' + moodColor + '44, transparent)',
  };

  const handleRepost = () => {
    const next = !reposted;
    setReposted(next);
    setReposts(prev => prev + (next ? 1 : -1));
  };

  const handleCommentToggle = () => setCommentsOpen(prev => !prev);

  const handleCommentSubmit = () => {
    const text = commentText.trim();
    if (!text) return;
    setComments(prev => [...prev, { handle: 'you.feed', text, time: 'just now', color: moodColor }]);
    setCommentText('');
    setCommentCount2(prev => prev + 1);
  };

  return (
    <article className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300" style={cardStyle}>
      <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={topBarStyle} />
      {trophy && <div className="absolute top-3 right-3 z-10 text-lg">crown</div>}

      {/* Video area */}
      <div className="relative w-full overflow-hidden" style={videoAreaStyle} onContextMenu={preventContext}>
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
            style={{ background: 'linear-gradient(135deg, ' + moodColor + '22, ' + moodColor + '44)' }}>
            <span className="text-4xl opacity-40">play</span>
          </div>
        )}

        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center transition-all"
          style={{ backgroundColor: playing ? 'transparent' : 'rgba(0,0,0,0.35)' }}
        >
          {!playing && (
            <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm" style={playBtnStyle}>
              <span className="text-white text-xl ml-1">&#9654;</span>
            </div>
          )}
        </button>

        {videoDuration > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-white px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
            {formatDuration(videoDuration)}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-shrink-0" style={{ filter: 'drop-shadow(0 0 6px ' + moodColor + '66)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm" style={avatarStyle}>
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={moodPipStyle} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm" style={{ color: 'var(--owf-text-primary)' }}>{authorName}</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={moodLabelStyle}>{moodLabel}</span>
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
              Clear
            </span>
          )}
        </div>

        {accolade && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
            style={{ backgroundColor: moodColor + '15', color: moodColor, border: '1px solid ' + moodColor + '33' }}>
            {accolade}
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

        <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid var(--owf-border)' }}>
          <button onClick={handleLike} className="flex items-center gap-1.5 text-xs transition-all"
            style={{ color: liked ? moodColor : 'var(--owf-text-secondary)', transform: pulse === 'like' ? 'scale(1.3)' : 'scale(1)', transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1)' }}>
            <span>{liked ? '♥' : '♡'}</span><span>{likes}</span>
          </button>
          <button onClick={handleCommentToggle}
            className="flex items-center gap-1.5 text-xs transition-all hover:scale-110"
            style={{ color: commentsOpen ? moodColor : 'var(--owf-text-secondary)' }}>
            <span>{commentsOpen ? '◆' : '◇'}</span><span>{commentCount2}</span>
          </button>
          <button onClick={handleRepost}
            className="flex items-center gap-1.5 text-xs transition-all hover:scale-110"
            style={{ color: reposted ? moodColor : 'var(--owf-text-secondary)' }}>
            <span>⟳</span>{reposts > 0 && <span>{reposts}</span>}
          </button>
          <button onClick={handleSave} className="flex items-center gap-1.5 text-xs transition-all"
            style={{ color: saved ? moodColor : 'var(--owf-text-secondary)', transform: pulse === 'save' ? 'scale(1.3)' : 'scale(1)', transition: 'transform 400ms cubic-bezier(0.34,1.56,0.64,1)' }}>
            <span>{saved ? '★' : '☆'}</span>
          </button>
          {isOwner ? (
            <a href={videoUrl} download className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: moodColor }}>
              ↓ Save
            </a>
          ) : (
            <button onClick={handleShare} className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: 'var(--owf-text-secondary)' }}>
              <span>↗</span><span>Share</span>
            </button>
          )}
        </div>
      </div>

      {commentsOpen && (
        <div className="px-4 pb-4 pt-2" style={{ borderTop: `1px solid ${moodColor}22` }}>
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
          <div className="flex gap-2 items-center">
            <input type="text" value={commentText}
              onChange={e => e.target.value.length <= 280 && setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()}
              placeholder="Add a comment..."
              className="flex-1 text-xs px-3 py-2 rounded-xl focus:outline-none"
              style={{ backgroundColor: 'var(--owf-bg)', border: `1px solid ${moodColor}33`, color: 'var(--owf-text-primary)' }} />
            <span className="text-[10px] flex-shrink-0"
              style={{ color: commentText.length > 250 ? '#EF4444' : 'var(--owf-text-secondary)' }}>
              {280 - commentText.length}
            </span>
            <button onClick={handleCommentSubmit} disabled={!commentText.trim()}
              className="text-xs font-bold px-3 py-2 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: commentText.trim() ? moodColor : 'var(--owf-border)', color: '#fff' }}>
              Post
            </button>
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={bottomLineStyle} />
    </article>
  );
}
