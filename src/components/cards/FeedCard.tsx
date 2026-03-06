'use client';
import { useState, useEffect } from 'react';
import { getHaloStyle, getGlowStyle, getMoodIntensity } from '@/lib/theme';
import type { MoodId } from '@/lib/theme';

export interface FeedCardProps {
  id: string;
  authorName: string;
  authorHandle: string;
  city: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  mood: MoodId;
  safetyBadge?: 'clear' | 'notice' | 'rights';
  likeCount?: number;
  commentCount?: number;
}

export default function FeedCard({
  authorName,
  authorHandle,
  city,
  timeAgo,
  content,
  imageUrl,
  mood,
  safetyBadge,
  likeCount = 0,
  commentCount = 0,
}: FeedCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const halo = mounted ? getHaloStyle(mood) : { borderLeft: '3px solid #1E3A5F' };
  const glow = mounted ? getGlowStyle(mood) : {};

  return (
    <article
      className="relative bg-[#0D1F35] rounded-xl overflow-hidden mb-3 transition-all duration-300"
      style={{ ...glow, borderLeft: halo.borderLeft }}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#1E3A5F] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white text-sm">{authorName}</span>
              <span className="text-[#6B7280] text-xs">@{authorHandle}</span>
              <span className="text-[#6B7280] text-xs">·</span>
              <span className="text-[#6B7280] text-xs">{city}</span>
              <span className="text-[#6B7280] text-xs">·</span>
              <span className="text-[#6B7280] text-xs">{timeAgo}</span>
            </div>
          </div>
          {safetyBadge === 'clear' && (
            <span className="text-xs bg-[#14532D] text-[#86EFAC] px-2 py-0.5 rounded-full">✦ Clear</span>
          )}
          {safetyBadge === 'notice' && (
            <span className="text-xs bg-[#92400E] text-[#FCD34D] px-2 py-0.5 rounded-full">⚠ Notice</span>
          )}
        </div>

        <p className="text-[#E5E7EB] text-sm leading-relaxed mb-3">{content}</p>

        {imageUrl && (
          <div className="rounded-lg overflow-hidden mb-3 aspect-video bg-[#1E3A5F]">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-5 text-[#6B7280]">
          <button className="flex items-center gap-1.5 text-xs hover:text-[#D97706] transition-colors">
            <span>♡</span><span>{likeCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs hover:text-[#007A6E] transition-colors">
            <span>◇</span><span>{commentCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs hover:text-[#5B54D6] transition-colors ml-auto">
            <span>↗</span><span>Share</span>
          </button>
        </div>
      </div>
    </article>
  );
}
