'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Composer from '@/components/composer/Composer';

export default function GlobalHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: scrolled ? 'color-mix(in srgb, var(--owf-bg) 95%, transparent)' : 'color-mix(in srgb, var(--owf-bg) 75%, transparent)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid var(--owf-border)',
        transition: 'background-color 0.35s ease, box-shadow 0.35s ease',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.35)' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Animated horizon sweep line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, var(--owf-horizon) 35%, var(--owf-gold) 55%, transparent 100%)',
        opacity: scrolled ? 0.7 : 0.25,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
      }} />

      <div
        className="flex items-center justify-between px-4"
        style={{ height: scrolled ? '52px' : '56px', transition: 'height 0.35s ease' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/owf-logo.png"
            alt="OneWorldFeed"
            width={36}
            height={36}
            className="rounded-full"
            style={{ boxShadow: '0 0 12px var(--owf-glow)' }}
          />
          <span className="font-black text-lg leading-none">
            <span style={{ color: 'var(--owf-text)' }}>ONEWORLD</span>
            <span style={{ color: 'var(--owf-gold)' }}>FEED</span>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--owf-text-muted)' }}>
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search people, +tags, cities..."
              className="w-full text-sm pl-8 pr-4 py-2 rounded-full focus:outline-none"
              style={{
                backgroundColor: 'var(--owf-surface)',
                border: '1px solid var(--owf-border)',
                color: 'var(--owf-text)',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
              }}
              onFocus={e => { e.target.style.backgroundColor = 'var(--owf-surface-hover)'; e.target.style.borderColor = 'var(--owf-horizon)'; }}
              onBlur={e => { e.target.style.backgroundColor = 'var(--owf-surface)'; e.target.style.borderColor = 'var(--owf-border)'; }}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setIsComposerOpen(true)}
            className="text-white text-sm font-semibold px-4 py-1.5 rounded-full owf-card-lift"
            style={{ backgroundColor: 'var(--owf-gold)', boxShadow: '0 0 14px var(--owf-glow)' }}
          >
            + Post
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer owf-avatar-pulse"
            style={{ backgroundColor: 'var(--owf-surface)', border: '1px solid var(--owf-border)' }}
          >
            U
          </div>
        </div>
      </div>
    </header>

      {isComposerOpen && (
        <Composer onClose={() => setIsComposerOpen(false)} />
      )}
    </>
  );
}
