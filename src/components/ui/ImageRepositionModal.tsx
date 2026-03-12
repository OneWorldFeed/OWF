'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

interface Props {
  src: string;
  variant: 'banner' | 'avatar';
  onApply: (position: { x: number; y: number }) => void;
  onCancel: () => void;
  accent?: string;
}

// Logical frame dimensions (used for computation, rendered at min(X, 92vw))
const FRAMES = {
  banner: { w: 560, h: 140 },
  avatar: { w: 280, h: 280 },
};

export default function ImageRepositionModal({ src, variant, onApply, onCancel, accent = '#D97706' }: Props) {
  const { w: FW, h: FH } = FRAMES[variant];

  // imgSize: scaled image dimensions in "frame units" (FW×FH coordinate space)
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  // pos: top-left offset of image in frame units (always ≤ 0)
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  // Load image and compute scaled size to cover the frame
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.max(FW / img.naturalWidth, FH / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      setImgSize({ w, h });
      // Start centered
      setPos({ x: -(w - FW) / 2, y: -(h - FH) / 2 });
    };
    img.src = src;
  }, [src, FW, FH]);

  const constrain = useCallback(
    (p: { x: number; y: number }) => ({
      x: Math.min(0, Math.max(p.x, -(imgSize.w - FW))),
      y: Math.min(0, Math.max(p.y, -(imgSize.h - FH))),
    }),
    [imgSize, FW, FH],
  );

  // Convert screen-pixel delta → frame-unit delta (accounts for responsive scaling)
  const applyDelta = useCallback(
    (screenDx: number, screenDy: number) => {
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const scaleX = FW / rect.width;
      const scaleY = FH / rect.height;
      setPos(p => constrain({ x: p.x + screenDx * scaleX, y: p.y + screenDy * scaleY }));
    },
    [constrain, FW, FH],
  );

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onTouchStart = (e: React.TouchEvent) => {
    lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const dx = e.touches[0].clientX - lastPointer.current.x;
    const dy = e.touches[0].clientY - lastPointer.current.y;
    lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    applyDelta(dx, dy);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      applyDelta(dx, dy);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [applyDelta]);

  const apply = () => {
    const maxX = imgSize.w - FW;
    const maxY = imgSize.h - FH;
    onApply({
      x: maxX > 0 ? (-pos.x / maxX) * 100 : 50,
      y: maxY > 0 ? (-pos.y / maxY) * 100 : 50,
    });
  };

  // Percentage positions for CSS rendering inside the frame
  const imgCssPct = imgSize.w > 0
    ? {
        left: `${(pos.x / FW) * 100}%`,
        top: `${(pos.y / FH) * 100}%`,
        width: `${(imgSize.w / FW) * 100}%`,
        height: `${(imgSize.h / FH) * 100}%`,
      }
    : null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '18px',
      }}
    >
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Drag to reposition
      </p>

      {/* Frame */}
      <div
        ref={frameRef}
        style={{
          width: `min(${FW}px, 92vw)`,
          aspectRatio: `${FW} / ${FH}`,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: variant === 'avatar' ? '22px' : '14px',
          border: '2px solid rgba(255,255,255,0.3)',
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {imgCssPct && (
          <img
            src={src}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              ...imgCssPct,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        )}

        {/* Grid guide lines */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18 }}>
          <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', background: '#fff' }} />
          <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', background: '#fff' }} />
          <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: '1px', background: '#fff' }} />
          <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: '1px', background: '#fff' }} />
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>
        {variant === 'avatar' ? 'Square · rounded corners' : 'Banner frame'}
      </p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 26px', borderRadius: '99px',
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer', fontSize: '13px', fontWeight: 600,
          }}
        >
          Cancel
        </button>
        <button
          onClick={apply}
          style={{
            padding: '10px 26px', borderRadius: '99px',
            background: accent, color: '#fff',
            border: 'none',
            cursor: 'pointer', fontSize: '13px', fontWeight: 700,
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
