'use client';
import Image from 'next/image';

export default function GlobalHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'rgba(6,14,26,0.75)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center justify-between px-4 h-14">

        {/* Logo — ONEWORLD always white, FEED always orange, never changes */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/owf-logo.png"
            alt="OneWorldFeed"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-black text-lg leading-none">
            <span style={{ color: '#ffffff' }}>ONEWORLD</span>
            <span style={{ color: '#F97316' }}>FEED</span>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: 'rgba(255,255,255,0.40)' }}
            >
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search people, +tags, cities..."
              className="w-full text-sm pl-8 pr-4 py-2 rounded-full focus:outline-none transition-colors"
              style={{
                backgroundColor: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'rgba(255,255,255,0.85)',
              }}
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
            style={{ backgroundColor: '#F97316' }}
          >
            + Post
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            U
          </div>
        </div>

      </div>
    </header>
  );
}
