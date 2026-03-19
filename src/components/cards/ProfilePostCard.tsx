'use client';
import { useState } from 'react';
import ImageLightbox from '@/components/ui/ImageLightbox';
import { sanitizeCommentText } from '@/lib/sanitize';

// Mood color map — mirrors profile page
const MOOD_COLORS: Record<string, string> = {
  Electric: '#F59E0B', Reflective: '#60A5FA', Hopeful: '#34D399',
  Ambitious: '#A78BFA', Joyful: '#FB923C', Curious: '#06B6D4',
  Resilient: '#EF4444', Calm: '#10B981',
};

interface Comment {
  handle: string;
  text: string;
  time: string;
  color: string;
}

interface ProfilePost {
  id: string;
  mood: string;
  city: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
  hasImage: boolean;
  hasVideo: boolean;
  imageUrl?: string;
}

interface Props {
  post: ProfilePost;
  index?: number;
  accent: string;
  displayName: string;
  handle: string;
  ini: (name: string) => string;
}

export default function ProfilePostCard({ post, index = 0, accent, displayName, handle, ini }: Props) {
  const mc = MOOD_COLORS[post.mood] || accent;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [reposted, setReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(post.comments);
  const [savedPost, setSavedPost] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentCount, setCommentCount] = useState(post.comments);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleToggleLike = () => { setLiked(l => !l); setLikeCount(c => liked ? c - 1 : c + 1); };
  const handleToggleRepost = () => { setReposted(r => !r); setRepostCount(c => reposted ? c - 1 : c + 1); };

  const handleCommentSubmit = () => {
    const text = sanitizeCommentText(commentText);
    if (!text) return;
    setComments(prev => [...prev, { handle: 'you.feed', text, time: 'just now', color: mc }]);
    setCommentText('');
    setCommentCount(c => c + 1);
  };

  const imageUrl = post.imageUrl;

  return (
    <>
      <div
        className="owf-fade-up owf-card-lift"
        style={{
          background: '#ffffff',
          border: `1px solid ${mc}22`,
          borderLeft: `3px solid ${mc}`,
          borderRadius: '20px',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '12px',
          boxShadow: `0 0 0 1px ${mc}10, 0 4px 20px rgba(0,0,0,0.06), 0 0 12px ${mc}18`,
          animationDelay: `${index * 0.07}s`,
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-40%', right: '-5%',
          width: '160px', height: '160px', borderRadius: '50%',
          background: `radial-gradient(ellipse,${mc}12 0%,transparent 70%)`,
          filter: 'blur(24px)', pointerEvents: 'none',
        }} />

        {/* Top mood bar */}
        <div style={{ height: '2px', borderRadius: '99px', background: `linear-gradient(90deg,${mc},${mc}00)`, marginBottom: '12px' }} />

        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '11px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: '13px',
            background: accent, boxShadow: `0 3px 10px ${accent}40`,
          }}>{ini(displayName)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F1924' }}>{displayName}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '99px', background: `${mc}18`, color: mc }}>{post.mood}</span>
            </div>
            <div style={{ display: 'flex', gap: '5px', fontSize: '11px', color: '#5A6E80' }}>
              <span>{handle}</span><span>·</span><span>{post.city}</span><span>·</span><span>{post.time}</span>
            </div>
          </div>
        </div>

        {/* Image — click to open lightbox */}
        {post.hasImage && (
          <div
            onClick={() => setLightboxOpen(true)}
            style={{
              borderRadius: '14px', marginBottom: '10px', height: '180px',
              background: imageUrl ? '#f0f0f0' : 'linear-gradient(135deg,#BAE6FD,#60A5FA,#818CF8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '48px', cursor: 'zoom-in', overflow: 'hidden',
              position: 'relative',
            }}
          >
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} draggable={false} />
                <div
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.2)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)'; }}
                />
              </>
            ) : (
              <span>🌸</span>
            )}
          </div>
        )}

        {/* Video placeholder */}
        {post.hasVideo && (
          <div style={{ borderRadius: '14px', marginBottom: '10px', height: '180px', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.3)' }}>▶</div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Video</span>
          </div>
        )}

        {/* Content */}
        <p style={{ fontSize: '13px', lineHeight: 1.65, color: '#0F1924', position: 'relative', zIndex: 1 }}>
          {post.text.split(' ').map((w, i) =>
            w.startsWith('+')
              ? <span key={i} style={{ fontWeight: 600, color: mc }}>{w} </span>
              : w + ' '
          )}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '12px' }}>
          <button onClick={handleToggleLike} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#EF4444' : '#5A6E80', fontSize: '12px', fontWeight: liked ? 700 : 400, transition: 'color .15s, transform .15s', transform: liked ? 'scale(1.15)' : 'scale(1)' }}>
            {liked ? '♥' : '♡'} {likeCount}
          </button>
          <button onClick={() => setCommentsOpen(c => !c)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: commentsOpen ? mc : '#5A6E80', fontSize: '12px', transition: 'color .15s' }}>
            {commentsOpen ? '◆' : '◇'} {commentCount}
          </button>
          <button onClick={handleToggleRepost} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: reposted ? mc : '#5A6E80', fontSize: '12px', fontWeight: reposted ? 700 : 400, transition: 'color .15s, transform .15s', transform: reposted ? 'scale(1.15)' : 'scale(1)' }}>
            ◇ {repostCount}
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A6E80', fontSize: '12px', transition: 'transform .3s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(180deg)')} onMouseLeave={e => (e.currentTarget.style.transform = 'rotate(0deg)')}>⟳</button>
          <button onClick={() => setSavedPost(s => !s)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: savedPost ? '#F59E0B' : '#5A6E80', fontSize: '13px', transition: 'color .15s, transform .15s', transform: savedPost ? 'scale(1.2)' : 'scale(1)' }}>
            {savedPost ? '★' : '☆'}
          </button>
        </div>

        {/* Inline comments */}
        {commentsOpen && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${mc}22` }}>
            {comments.length === 0 ? (
              <p style={{ fontSize: '11px', color: '#9AAFBE', textAlign: 'center', marginBottom: '10px' }}>Be the first to comment</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                {comments.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0, background: c.color, color: '#fff', fontWeight: 900, fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.handle.charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F1924' }}>{c.handle}</span>
                        <span style={{ fontSize: '10px', color: '#9AAFBE' }}>{c.time}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#0F1924', margin: 0, lineHeight: 1.5 }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text" value={commentText}
                onChange={e => e.target.value.length <= 280 && setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()}
                placeholder="Add a comment…"
                style={{ flex: 1, fontSize: '12px', padding: '7px 12px', borderRadius: '10px', border: `1px solid ${mc}33`, outline: 'none', background: '#f7f7f7', color: '#0F1924' }}
                onFocus={e => { e.currentTarget.style.borderColor = mc; e.currentTarget.style.boxShadow = `0 0 0 3px ${mc}18`; }}
                onBlur={e => { e.currentTarget.style.borderColor = `${mc}33`; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <span style={{ fontSize: '10px', color: commentText.length > 250 ? '#EF4444' : '#9AAFBE' }}>{280 - commentText.length}</span>
              <button onClick={handleCommentSubmit} disabled={!commentText.trim()} style={{ fontSize: '12px', fontWeight: 700, padding: '7px 12px', borderRadius: '10px', border: 'none', cursor: commentText.trim() ? 'pointer' : 'default', background: commentText.trim() ? mc : '#e0e0e0', color: '#fff', transition: 'background 0.2s' }}>Post</button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox — outside card so it isn't clipped by overflow:hidden */}
      {lightboxOpen && post.hasImage && (
        <ImageLightbox
          src={imageUrl || ''}
          authorName={displayName}
          authorHandle={handle}
          city={post.city}
          timeAgo={post.time}
          moodColor={mc}
          moodLabel={post.mood}
          content={post.text}
          initialComments={comments}
          initialCommentCount={likeCount}
          accentColor={accent}
          onClose={() => setLightboxOpen(false)}
          onCommentAdd={(text) => {
            const cleanText = sanitizeCommentText(text);
            if (!cleanText) return;
            setComments(prev => [...prev, { handle: 'you.feed', text: cleanText, time: 'just now', color: mc }]);
            setCommentCount(c => c + 1);
          }}
        />
      )}
    </>
  );
}
