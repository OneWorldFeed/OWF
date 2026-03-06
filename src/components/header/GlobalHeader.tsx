'use client';
import Image from 'next/image';

export default function GlobalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060E1A]/95 backdrop-blur-sm border-b border-[#0D1F35]">
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
            <span className="text-white">ONEWORLD</span>
            <span className="text-[#F97316]">FEED</span>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">⌕</span>
            <input
              type="text"
              placeholder="Search people, +tags, cities..."
              className="w-full bg-[#0D1F35] text-white text-sm pl-8 pr-4 py-2 rounded-full border border-[#1E3A5F] focus:outline-none focus:border-[#D97706] placeholder-[#4B5563] transition-colors"
            />
          </div>
        </div>

        {/* Right — avatar + compose */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors">
            + Post
          </button>
          <div className="w-8 h-8 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold cursor-pointer">
            U
          </div>
        </div>

      </div>
    </header>
  );
}
