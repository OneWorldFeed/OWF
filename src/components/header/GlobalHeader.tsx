'use client';
import Image from 'next/image';

export default function GlobalHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--owf-surface)',
        borderBottom: '1px solid var(--owf-border)',
      }}
    >
      <div className="flex items-center justify-between px-4 h-14">

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/owf-logo.png"
            alt="OneWorldFeed"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-black text-lg leading-none">
            <span style={{ color: 'var(--owf-navy)' }}>ONEWORLD</span>
            <span style={{ color: 'var(--owf-orange)' }}>FEED</span>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: 'var(--owf-text-secondary)' }}
            >
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search people, +tags, cities..."
              className="w-full text-sm pl-8 pr-4 py-2 rounded-full focus:outline-none transition-colors"
              style={{
                backgroundColor: 'var(--owf-bg)',
                border: '1px solid var(--owf-border)',
                color: 'var(--owf-text-primary)',
              }}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
            style={{ backgroundColor: 'var(--owf-gold)' }}
          >
            + Post
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer"
            style={{ backgroundColor: 'var(--owf-navy)' }}
          >
            U
          </div>
        </div>

      </div>
    </header>
  );
}
