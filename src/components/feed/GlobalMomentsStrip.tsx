'use client';
import { useRef } from 'react';
import momentsData from '@/data/global-moments.json';

const moments = momentsData as any[];

function formatCount(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export default function GlobalMomentsStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollLeft  = () => scrollRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left:  280, behavior: 'smooth' });

  return (
    <div className="mb-4 pt-2 owf-fade-up" style={{ borderBottom: '1px solid var(--owf-border)' }}>

      {/* Header row */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest" style={{ color: 'var(--owf-text-secondary)' }}>
            GLOBAL MOMENTS
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
          >
            {moments.filter((m: any) => m.live).length} LIVE
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={scrollLeft}
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs owf-card-lift"
            style={{ backgroundColor: 'var(--owf-surface)', border: '1px solid var(--owf-border)', color: 'var(--owf-text-secondary)' }}
          >‹</button>
          <button
            onClick={scrollRight}
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs owf-card-lift"
            style={{ backgroundColor: 'var(--owf-surface)', border: '1px solid var(--owf-border)', color: 'var(--owf-text-secondary)' }}
          >›</button>
        </div>
      </div>

      {/* Strip */}
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
        {moments.map((moment: any, i: number) => (
          <button
            key={moment.id}
            className="flex-shrink-0 snap-start flex items-center gap-2.5 px-3 py-2 rounded-xl owf-card-lift owf-mood-transition"
            style={{
              backgroundColor: moment.color + '12',
              border: '1px solid ' + moment.color + '33',
              minWidth: '180px',
              animationDelay: `${i * 0.04}s`,
            }}
          >
            {/* Emoji with subtle glow */}
            <span
              className="text-xl flex-shrink-0"
              style={{ filter: `drop-shadow(0 0 6px ${moment.color}60)` }}
            >
              {moment.emoji}
            </span>

            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold truncate" style={{ color: 'var(--owf-text-primary)' }}>
                  {moment.title}
                </span>
                {moment.live && (
                  <span
                    className="text-[10px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 animate-pulse"
                    style={{ backgroundColor: '#EF4444', color: '#fff' }}
                  >
                    LIVE
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ color: moment.color, fontSize: '0.65rem', fontWeight: 600 }}>{moment.tag}</span>
                <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.65rem' }}>·</span>
                <span style={{ color: 'var(--owf-text-secondary)', fontSize: '0.65rem' }}>
                  {formatCount(moment.participants)} joining
                </span>
              </div>
            </div>

            {/* Left accent line */}
            <div style={{
              position: 'absolute', left: 0, top: '20%', bottom: '20%',
              width: '2px', borderRadius: '99px',
              background: moment.color,
              opacity: 0.6,
            }} />
          </button>
        ))}
      </div>
    </div>
  );
}
