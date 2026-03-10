'use client';
import React, { useState, useRef, useEffect } from 'react';
import FeedCard from '@/components/cards/FeedCard';
import VideoCard from '@/components/cards/VideoCard';
import type { MoodId } from '@/lib/theme';

export interface Post {
  id: string;
  authorName: string;
  authorHandle: string;
  city: string;
  timeAgo: string;
  content: string;
  mood: MoodId;
  imageUrl?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  safetyBadge?: 'clear' | 'notice' | 'rights';
  likeCount?: number;
  commentCount?: number;
  accolade?: string;
  trophy?: boolean;
  featured?: boolean;
  isOwner?: boolean;
}

const TABS = ['All', 'Text', 'Media', 'Video'] as const;
type Tab = typeof TABS[number];

export default function FeedTabs({ posts }: { posts: Post[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const scrollRef  = useRef<HTMLDivElement>(null);
  const tabRefs    = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const textPosts  = posts.filter(p => !p.imageUrl && !p.videoUrl);
  const mediaPosts = posts.filter(p => p.imageUrl && !p.videoUrl);
  const videoPosts = posts.filter(p => p.videoUrl !== undefined);

  // Sliding pill — update on tab change
  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  // Init pill on mount
  useEffect(() => {
    const el = tabRefs.current['All'];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, []);

  const scrollLeft  = () => scrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left:  340, behavior: 'smooth' });

  return (
    <div className="owf-fade-up-1">

      {/* Tab bar with sliding pill */}
      <div
        className="flex items-center gap-1 mb-4 px-1 py-3"
        style={{ backgroundColor: 'var(--owf-bg)', position: 'relative' }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab;
          const count  = tab === 'Media' ? mediaPosts.length
                       : tab === 'Video' ? videoPosts.length
                       : null;
          return (
            <button
              key={tab}
              ref={(el: HTMLButtonElement | null) => { tabRefs.current[tab] = el; }}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold owf-mood-transition"
              style={{
                backgroundColor: active ? 'var(--owf-navy)' : 'transparent',
                color: active ? '#fff' : 'var(--owf-text-secondary)',
                border: active ? 'none' : '1px solid var(--owf-border)',
                boxShadow: active ? '0 0 12px var(--owf-glow)' : 'none',
                position: 'relative', zIndex: 1,
              }}
            >
              {tab}
              {count !== null && count > 0 && (
                <span
                  className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: active ? '#ffffff33' : 'var(--owf-border)',
                    color: active ? '#fff' : 'var(--owf-text-secondary)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ALL tab */}
      {activeTab === 'All' && (
        <div>
          {mediaPosts.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-bold tracking-widest" style={{ color: 'var(--owf-text-secondary)' }}>PHOTOS</p>
                <div className="hidden md:flex items-center gap-1">
                  <ScrollBtn direction="left"  onClick={scrollLeft}  />
                  <ScrollBtn direction="right" onClick={scrollRight} />
                </div>
              </div>
              <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                {mediaPosts.map(post => (
                  <div key={post.id} className="flex-shrink-0 w-72 snap-start">
                    <FeedCard {...post} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {videoPosts.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold tracking-widest mb-2 px-1" style={{ color: 'var(--owf-text-secondary)' }}>VIDEOS</p>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                {videoPosts.map(post => (
                  <div key={post.id} className="flex-shrink-0 w-80 snap-start">
                    <VideoCard {...post} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <MixedGrid posts={textPosts} />
        </div>
      )}

      {activeTab === 'Text'  && <MixedGrid posts={textPosts} />}

      {activeTab === 'Media' && (
        <div>
          {mediaPosts.length === 0 ? <EmptyState icon="◎" label="No photos yet" /> : (
            <>
              <div className="hidden md:grid grid-cols-2 gap-4">
                {mediaPosts.map(post => <FeedCard key={post.id} {...post} />)}
              </div>
              <div className="grid md:hidden grid-cols-2 gap-3">
                {mediaPosts.map(post => <FeedCard key={post.id} {...post} compact />)}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'Video' && (
        <div>
          {videoPosts.length === 0 ? <EmptyState icon="▶" label="No videos yet" /> : (
            <div className="space-y-4">
              {videoPosts.map(post => <VideoCard key={post.id} {...post} featured />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScrollBtn({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full flex items-center justify-center owf-card-lift"
      style={{
        backgroundColor: 'var(--owf-surface)',
        border: '1px solid var(--owf-border)',
        color: 'var(--owf-text-primary)',
        fontSize: '1.2rem',
      }}
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  );
}

function EmptyState({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="text-center py-20" style={{ color: 'var(--owf-text-secondary)' }}>
      <p className="text-4xl mb-3">{icon}</p>
      <p className="text-sm">{label}</p>
    </div>
  );
}

function MixedGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return <EmptyState icon="◎" label="No posts here yet" />;
  const rows: React.ReactElement[] = [];
  let i = 0, rowIndex = 0;
  const patterns = ['featured', 'two', 'three', 'featured', 'two'] as const;
  while (i < posts.length) {
    const pattern = patterns[rowIndex % patterns.length];
    if (pattern === 'featured' && posts[i]) {
      rows.push(
        <div key={i} className="mb-4 owf-fade-up" style={{ animationDelay: `${rowIndex * 0.06}s` }}>
          <FeedCard {...posts[i]} featured />
        </div>
      );
      i++;
    } else if (pattern === 'two' && posts[i]) {
      rows.push(
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 owf-fade-up" style={{ animationDelay: `${rowIndex * 0.06}s` }}>
          {posts[i]   && <FeedCard {...posts[i]} />}
          {posts[i+1] && <FeedCard {...posts[i+1]} />}
        </div>
      );
      i += 2;
    } else if (pattern === 'three' && posts[i]) {
      rows.push(
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 owf-fade-up" style={{ animationDelay: `${rowIndex * 0.06}s` }}>
          {posts[i]   && <FeedCard {...posts[i]}   compact />}
          {posts[i+1] && <FeedCard {...posts[i+1]} compact />}
          {posts[i+2] && <FeedCard {...posts[i+2]} compact />}
        </div>
      );
      i += 3;
    } else {
      rows.push(
        <div key={i} className="mb-4 owf-fade-up" style={{ animationDelay: `${rowIndex * 0.06}s` }}>
          <FeedCard {...posts[i]} />
        </div>
      );
      i++;
    }
    rowIndex++;
  }
  return <div>{rows}</div>;
}
