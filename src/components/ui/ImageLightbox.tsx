'use client';
import { useState, useEffect, useRef } from 'react';

interface Comment {
  handle: string;
  text: string;
  time: string;
  color: string;
}

interface ImageLightboxProps {
  src: string;
  alt?: string;
  authorName: string;
  authorHandle: string;
  city?: string;
  timeAgo?: string;
  moodColor: string;
  moodLabel?: string;
  content?: string;
  initialComments?: Comment[];
  initialCommentCount?: number;
  onClose: () => void;
  onCommentAdd?: (text: string) => void;
  accentColor?: string;
}

export default function ImageLightbox({
  src,
  alt = '',
  authorName,
  authorHandle,
  city,
  timeAgo,
  moodColor,
  moodLabel,
  content,
  initialComments = [],
  initialCommentCount = 0,
  onClose,
  onCommentAdd,
  accentColor,
}: ImageLightboxProps) {
  const [comments, setComments]     = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked]           = useState(false);
  const [imgLoaded, setImgLoaded]   = useState(false);
  const [panelOpen, setPanelOpen]   = useState(true);

  const inputRef  = useRef<HTMLInputElement>(null);
  const orb1Ref   = useRef<HTMLDivElement>(null);
  const orb2Ref   = useRef<HTMLDivElement>(null);
  const orb3Ref   = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);

  const color = accentColor || moodColor;

  // ── Close on Escape + lock body scroll ───────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // ── Aurora orbs + horizon line — RAF sine animation ───────────────────────
  useEffect(() => {
    let t = 0;
    function tick() {
      t += 0.006;

      if (orb1Ref.current) {
        const x  = Math.sin(t * 0.55) * 9;
        const y  = Math.cos(t * 0.38) * 11;
        const sc = 1 + Math.sin(t * 0.32) * 0.13;
        const op = 0.38 + Math.sin(t * 0.42) * 0.12;
        orb1Ref.current.style.transform = `translate(${x}%, ${y}%) scale(${sc})`;
        orb1Ref.current.style.opacity   = String(op);
      }
      if (orb2Ref.current) {
        const x  = Math.sin(t * 0.95 + 2.1) * 13;
        const y  = Math.cos(t * 0.70 + 1.3) * 10;
        const sc = 1 + Math.cos(t * 0.48) * 0.15;
        const op = 0.26 + Math.cos(t * 0.58) * 0.10;
        orb2Ref.current.style.transform = `translate(${x}%, ${y}%) scale(${sc})`;
        orb2Ref.current.style.opacity   = String(op);
      }
      if (orb3Ref.current) {
        const x  = Math.sin(t * 1.35 + 4.2) * 16;
        const y  = Math.cos(t * 0.98 + 3.1) * 13;
        const sc = 1 + Math.sin(t * 0.62) * 0.18;
        const op = 0.20 + Math.sin(t * 0.78) * 0.09;
        orb3Ref.current.style.transform = `translate(${x}%, ${y}%) scale(${sc})`;
        orb3Ref.current.style.opacity   = String(op);
      }
      if (horizonRef.current) {
        horizonRef.current.style.opacity = String(0.45 + Math.sin(t * 1.28) * 0.30);
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Comment submit ────────────────────────────────────────────────────────
  const handleCommentSubmit = () => {
    const text = commentText.trim();
    if (!text) return;
    const newComment: Comment = { handle: 'you.feed', text, time: 'just now', color };
    setComments(prev => [...prev, newComment]);
    setCommentText('');
    onCommentAdd?.(text);
  };

  const ini = (name: string) =>
    name.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2) || '?';

  // ── Corner bracket helper ─────────────────────────────────────────────────
  const bracket = (pos: 'tl' | 'tr' | 'bl' | 'br') => {
    const base: React.CSSProperties = {
      position: 'absolute', width: 18, height: 18, zIndex: 5,
    };
    const corners: Record<string, React.CSSProperties> = {
      tl: { top: -10, left: -10, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
      tr: { top: -10, right: -10, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` },
      bl: { bottom: -10, left: -10, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
      br: { bottom: -10, right: -10, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` },
    };
    return <div style={{ ...base, ...corners[pos] }} />;
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        // Void backdrop — mood-reactive deep space tint via radial gradients
        background: `
          radial-gradient(ellipse 80% 60% at 28% 52%, ${color}1c 0%, transparent 58%),
          radial-gradient(ellipse 55% 65% at 76% 28%, ${color}0f 0%, transparent 52%),
          linear-gradient(180deg, #020408 0%, #030711 55%, #010308 100%)
        `,
        animation: 'owf-lb-bg-in 220ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <style>{`
        @keyframes owf-lb-bg-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes owf-lb-slide {
          from { opacity: 0; transform: translateY(18px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes owf-lb-panel {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0);   }
        }
        @keyframes owf-ring-expand {
          0%   { transform: scale(1);   opacity: 0.75; }
          70%  { transform: scale(2.6); opacity: 0;    }
          100% { transform: scale(2.6); opacity: 0;    }
        }
        @keyframes owf-signal-blink {
          0%, 100% { opacity: 1;    }
          50%       { opacity: 0.3; }
        }
        @keyframes owf-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .owf-lb-scroll::-webkit-scrollbar       { width: 3px; }
        .owf-lb-scroll::-webkit-scrollbar-track { background: transparent; }
        .owf-lb-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 99px; }
      `}</style>

      {/* ── MAIN WRAPPER ──────────────────────────────────────────────────── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex',
          width: '95vw',     maxWidth: '1100px',
          height: '90vh',    maxHeight: '800px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: `
            0 0 0 1px ${color}22,
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 40px 100px rgba(0,0,0,0.80),
            0 0 80px  ${color}12
          `,
          animation: 'owf-lb-slide 300ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >

        {/* ════════════════════════════════════════════════════════════════
            LEFT — IMAGE PANEL
        ════════════════════════════════════════════════════════════════ */}
        <div style={{
          flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden',
          background: 'radial-gradient(ellipse 140% 110% at 50% 50%, #07091e 0%, #020408 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>

          {/* ── AURORA ORBS (DOM-mutated via RAF, no re-renders) ── */}
          <div ref={orb1Ref} style={{
            position: 'absolute',
            width: 560, height: 560,
            left: '-80px', top: '-130px',
            borderRadius: '50%',
            background: `radial-gradient(ellipse at 42% 38%, ${color}44 0%, ${color}1c 38%, transparent 68%)`,
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }} />
          <div ref={orb2Ref} style={{
            position: 'absolute',
            width: 480, height: 480,
            right: '-90px', top: '-60px',
            borderRadius: '50%',
            background: `radial-gradient(ellipse at 55% 35%, ${color}30 0%, ${color}12 42%, transparent 68%)`,
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }} />
          <div ref={orb3Ref} style={{
            position: 'absolute',
            width: 420, height: 420,
            left: '15%', bottom: '-110px',
            borderRadius: '50%',
            background: `radial-gradient(ellipse at 50% 58%, ${color}24 0%, ${color}0d 48%, transparent 72%)`,
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }} />

          {/* ── SCANLINE TEXTURE ── */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: `repeating-linear-gradient(
              0deg,
              transparent          0px,
              transparent          2px,
              rgba(0, 0, 0, 0.055) 2px,
              rgba(0, 0, 0, 0.055) 3px
            )`,
          }} />

          {/* ── IMAGE + CORNER BRACKET RETICLE ── */}
          <div style={{
            position: 'relative', zIndex: 3,
            maxWidth: '82%', maxHeight: '75%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {bracket('tl')}
            {bracket('tr')}
            {bracket('bl')}
            {bracket('br')}

            <img
              src={src}
              alt={alt}
              onLoad={() => setImgLoaded(true)}
              style={{
                maxWidth: '100%', maxHeight: '100%',
                objectFit: 'contain', display: 'block',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 500ms ease',
                borderRadius: '3px',
              }}
            />

            {/* Loading shimmer */}
            {!imgLoaded && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '3px',
                background: `linear-gradient(90deg, ${color}06 25%, ${color}18 50%, ${color}06 75%)`,
                backgroundSize: '200% 100%',
                animation: 'owf-shimmer 1.6s ease-in-out infinite',
              }} />
            )}
          </div>

          {/* ── LOCATION INDICATOR ── */}
          {(city || timeAgo) && (
            <div style={{
              position: 'absolute', bottom: 20, left: 20, zIndex: 8,
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 13px 5px 9px',
              background: 'rgba(2,4,10,0.62)',
              backdropFilter: 'blur(14px)',
              border: `1px solid ${color}28`,
              borderRadius: 99,
            }}>
              {/* Pulsing dot + expanding ring */}
              <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: `1.5px solid ${color}`,
                  animation: 'owf-ring-expand 2.2s ease-out infinite',
                }} />
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: color,
                  boxShadow: `0 0 6px ${color}, 0 0 14px ${color}88`,
                }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.05em' }}>
                {[city, timeAgo].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}

          {/* ── HORIZON LINE ── */}
          <div
            ref={horizonRef}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, zIndex: 8,
              background: `linear-gradient(90deg, transparent 0%, ${color} 25%, ${color} 75%, transparent 100%)`,
              boxShadow: `0 0 10px ${color}88, 0 0 28px ${color}44`,
              willChange: 'opacity',
              pointerEvents: 'none',
            }}
          />

          {/* ── CLOSE BUTTON ── */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, left: 16, zIndex: 10,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.62)',
              border: `1px solid ${color}32`,
              color: 'rgba(255,255,255,0.82)', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(14px)',
              transition: 'background 0.2s, transform 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background   = `${color}2a`;
              e.currentTarget.style.transform    = 'scale(1.1)';
              e.currentTarget.style.borderColor  = `${color}70`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background   = 'rgba(0,0,0,0.62)';
              e.currentTarget.style.transform    = 'scale(1)';
              e.currentTarget.style.borderColor  = `${color}32`;
            }}
          >×</button>

          {/* ── TOGGLE PANEL BUTTON ── */}
          <button
            onClick={() => setPanelOpen(p => !p)}
            style={{
              position: 'absolute', top: 16, right: 16, zIndex: 10,
              width: 36, height: 36, borderRadius: '50%',
              background: panelOpen ? `${color}24` : 'rgba(0,0,0,0.62)',
              border: `1px solid ${panelOpen ? color + '55' : color + '32'}`,
              color: panelOpen ? color : 'rgba(255,255,255,0.55)', fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(14px)',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s',
            }}
          >💬</button>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT — INFO + COMMENTS PANEL
        ════════════════════════════════════════════════════════════════ */}
        {panelOpen && (
          <div
            style={{
              width: 340, flexShrink: 0,
              background: '#ffffff',
              display: 'flex', flexDirection: 'column',
              position: 'relative', overflow: 'hidden',
              animation: 'owf-lb-panel 300ms cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {/* Aurora wash behind the light panel */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
              background: `radial-gradient(ellipse 130% 90% at 65% 15%, ${color}0c 0%, transparent 62%)`,
            }} />

            {/* Top mood bar */}
            <div style={{
              height: 3, flexShrink: 0, position: 'relative', zIndex: 1,
              background: `linear-gradient(90deg, ${color}, ${color}55)`,
            }} />

            {/* ── AUTHOR HEADER ── */}
            <div style={{
              padding: '15px 16px 13px',
              borderBottom: `1px solid ${color}12`,
              position: 'relative', zIndex: 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 13, flexShrink: 0,
                  background: `linear-gradient(135deg, ${color}, ${color}99)`,
                  boxShadow: `0 3px 14px ${color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 900, fontSize: 14,
                }}>{ini(authorName)}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F1924' }}>{authorName}</span>
                    {moodLabel && (
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: `${color}14`, color }}>{moodLabel}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#5A6E80', display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
                    <span>{authorHandle}</span>
                    {city    && <><span>·</span><span>{city}</span></>}
                    {timeAgo && <><span>·</span><span>{timeAgo}</span></>}
                  </div>
                </div>
              </div>

              {content && (
                <p style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.65, color: '#0F1924' }}>
                  {content.split(' ').map((w, i) =>
                    w.startsWith('+')
                      ? <span key={i} style={{ fontWeight: 600, color }}>{w} </span>
                      : w + ' '
                  )}
                </p>
              )}

              {/* ── QUICK ACTIONS ── */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                marginTop: 12, paddingTop: 10,
                borderTop: '1px solid rgba(0,0,0,0.06)',
              }}>
                {/* Like */}
                <button
                  onClick={() => setLiked(l => !l)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: liked ? '#EF4444' : '#5A6E80', fontSize: 12,
                    fontWeight: liked ? 700 : 400,
                    transform: liked ? 'scale(1.15)' : 'scale(1)',
                    transition: 'color .15s, transform .2s',
                  }}
                >
                  {liked ? '♥' : '♡'}{' '}{initialCommentCount + (liked ? 1 : 0)}
                </button>

                {/* Signal badge */}
                <button
                  onClick={() => inputRef.current?.focus()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: color,
                    boxShadow: `0 0 5px ${color}`,
                    animation: 'owf-signal-blink 2.4s ease-in-out infinite',
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.06em' }}>
                    SIGNAL
                  </span>
                  <span style={{ fontSize: 11, color: '#5A6E80' }}>
                    {comments.length}
                  </span>
                </button>
              </div>
            </div>

            {/* ── COMMENTS SCROLL ── */}
            <div
              className="owf-lb-scroll"
              style={{
                flex: 1, overflowY: 'auto',
                padding: '12px 16px',
                display: 'flex', flexDirection: 'column', gap: 12,
                position: 'relative', zIndex: 1,
              }}
            >
              {comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '34px 0' }}>
                  <div style={{ fontSize: 30, marginBottom: 10, color, opacity: 0.45 }}>◇</div>
                  <p style={{ fontSize: 12, color: '#9AAFBE', lineHeight: 1.8, margin: 0 }}>
                    No signals yet.<br />
                    <span
                      style={{ color, fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => inputRef.current?.focus()}
                    >Start the conversation.</span>
                  </p>
                </div>
              ) : (
                comments.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                      background: c.color, color: '#fff', fontWeight: 900, fontSize: 11,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{c.handle.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0F1924' }}>{c.handle}</span>
                        <span style={{ fontSize: 10, color: '#9AAFBE' }}>{c.time}</span>
                      </div>
                      <p style={{ fontSize: 12, lineHeight: 1.55, color: '#0F1924', margin: 0 }}>{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ── COMMENT INPUT ── */}
            <div style={{
              padding: '12px 16px',
              borderTop: `1px solid ${color}12`,
              background: '#fff',
              position: 'relative', zIndex: 1,
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={commentText}
                  onChange={e => e.target.value.length <= 280 && setCommentText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()}
                  placeholder="Add a signal…"
                  style={{
                    flex: 1, fontSize: 12, padding: '8px 12px', borderRadius: 12,
                    border: `1px solid ${color}24`, outline: 'none',
                    background: '#f6f7fa', color: '#0F1924',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor  = color;
                    e.currentTarget.style.boxShadow    = `0 0 0 3px ${color}1a`;
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor  = `${color}24`;
                    e.currentTarget.style.boxShadow    = 'none';
                  }}
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                  style={{
                    fontSize: 12, fontWeight: 700, padding: '8px 14px',
                    borderRadius: 12, border: 'none',
                    cursor: commentText.trim() ? 'pointer' : 'default',
                    background: commentText.trim()
                      ? `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`
                      : '#e8eaed',
                    color: commentText.trim() ? '#fff' : '#b0b5be',
                    boxShadow: commentText.trim() ? `0 2px 14px ${color}44` : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
                    transform: 'scale(1)',
                  }}
                  onMouseEnter={e => { if (commentText.trim()) e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >Post</button>
              </div>
              <div style={{
                textAlign: 'right', marginTop: 4, fontSize: 10,
                color: commentText.length > 250 ? '#EF4444' : '#9AAFBE',
              }}>
                {280 - commentText.length}
              </div>
            </div>

            {/* Bottom mood bar */}
            <div style={{
              height: 3, flexShrink: 0, position: 'relative', zIndex: 1,
              background: `linear-gradient(90deg, ${color}55, ${color})`,
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
