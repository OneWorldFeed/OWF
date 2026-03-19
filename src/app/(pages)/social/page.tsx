'use client';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeProvider';
const POSTS = [
  { id: '1',  name: 'Amara Diallo',   handle: 'amaradiallo',  city: 'Lagos',        timeAgo: '2m',   mood: '⚡', moodLabel: 'Electric',   content: 'The energy in Lagos tonight is something else. The music never stops and neither do we.', tags: ['lagos','nightlife'], likes: 24,  comments: 7,  avatar: '#D97706' },
  { id: '2',  name: 'Mei Tanaka',     handle: 'meitanaka',    city: 'Tokyo',        timeAgo: '8m',   mood: '🌙', moodLabel: 'Reflective', content: 'Cherry blossom season begins today. Every year I forget how quickly it goes.',             tags: ['tokyo','cherryblossoms'], likes: 41, comments: 12, avatar: '#60A5FA' },
  { id: '3',  name: 'Carlos Mendez',  handle: 'carlosmendez', city: 'Mexico City',  timeAgo: '15m',  mood: '🌱', moodLabel: 'Hopeful',    content: 'Three years building this community garden. Today we harvested our first crop.',          tags: ['mexicocity','community'], likes: 18, comments: 3,  avatar: '#34D399' },
  { id: '4',  name: 'Priya Sharma',   handle: 'priyasharma',  city: 'Mumbai',       timeAgo: '22m',  mood: '🚀', moodLabel: 'Ambitious',  content: 'Just presented to 400 people. Hands were shaking but the idea landed.',                  tags: ['mumbai','startups'], likes: 56, comments: 19, avatar: '#FB923C' },
  { id: '5',  name: 'Omar Hassan',    handle: 'omarhassan',   city: 'Cairo',        timeAgo: '34m',  mood: '🌙', moodLabel: 'Reflective', content: 'The Nile at sunrise never gets old. Thousands of years of history in one view.',           tags: ['cairo','nile'], likes: 33, comments: 8, avatar: '#A78BFA' },
  { id: '6',  name: 'Sofia Reyes',    handle: 'sofiareyes',   city: 'Buenos Aires', timeAgo: '41m',  mood: '✨', moodLabel: 'Joyful',     content: 'Tango in the street at midnight. A stranger asked me to dance and now we are friends.',    tags: ['buenosaires','tango'], likes: 72, comments: 24, avatar: '#F472B6' },
  { id: '7',  name: 'Yaw Darko',      handle: 'yawdarko',     city: 'Accra',        timeAgo: '1h',   mood: '✨', moodLabel: 'Joyful',     content: 'Accra is buzzing. New art, new music, new energy. The world needs to pay attention.',      tags: ['accra','afrobeats'], likes: 61, comments: 20, avatar: '#10B981' },
  { id: '8',  name: 'Jin Park',       handle: 'jinpark',      city: 'Seoul',        timeAgo: '1h',   mood: '⚡', moodLabel: 'Electric',   content: 'Seoul at night from the rooftop. The city never sleeps and neither do we.',               tags: ['seoul','nightlife'], likes: 88, comments: 31, avatar: '#6366F1' },
  { id: '9',  name: 'Lena Müller',    handle: 'lenamuller',   city: 'Berlin',       timeAgo: '2h',   mood: '💪', moodLabel: 'Resilient',  content: 'Berlin winter is brutal but the studio is warm. Three months of work about to become something real.', tags: ['berlin','art'], likes: 44, comments: 15, avatar: '#8B5CF6' },
  { id: '10', name: 'Kenji Mori',     handle: 'kenjimori',    city: 'Osaka',        timeAgo: '2h',   mood: '🔍', moodLabel: 'Curious',    content: 'Found a 100 year old ramen shop hidden in an alley. The owner is 87. Still cooking every day.', tags: ['osaka','food'], likes: 55, comments: 18, avatar: '#EC4899' },
];
const TABS = ['For You', 'Following', 'Global', 'Trending'];
export default function SocialPage() {
  const { theme: T } = useTheme();
  const [tab, setTab] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const h = T.horizon;
  const hRgb = T.horizonRgb;
  function toggleLike(id: string) {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  return (
    <div style={{ padding: '20px 0 80px', maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 300, color: 'var(--owf-text)', letterSpacing: '-0.02em' }}>
          Social
        </h1>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--owf-text-muted)', letterSpacing: '0.04em' }}>
          Real moments from real people around the world
        </p>
      </div>
      {/* Tab strip */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--owf-border)', paddingBottom: 0 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', fontSize: 13, fontWeight: tab === i ? 500 : 400,
            color: tab === i ? h : 'var(--owf-text-muted)',
            borderBottom: tab === i ? `2px solid ${h}` : '2px solid transparent',
            marginBottom: -1, transition: 'all 0.15s', letterSpacing: '0.02em',
          }}>{t}</button>
        ))}
      </div>
      {/* Post composer */}
      <div style={{
        background: 'var(--owf-surface)', border: '1px solid var(--owf-border)',
        borderRadius: 16, padding: '16px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${h}, rgba(${hRgb},0.5))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: '#fff', fontWeight: 600,
          }}>Y</div>
          <div style={{ flex: 1 }}>
            <div style={{
              width: '100%', background: 'var(--owf-raised)',
              border: '1px solid var(--owf-border)', borderRadius: 12,
              padding: '11px 14px', fontSize: 14, color: 'var(--owf-text-muted)',
              cursor: 'text', minHeight: 44, display: 'flex', alignItems: 'center',
            }}>
              What&apos;s happening in your city?
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button style={{
                background: h, border: 'none', color: '#fff',
                padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.02em',
              }}>Post</button>
            </div>
          </div>
        </div>
      </div>
      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {POSTS.map((post, i) => {
          const isLiked = liked.has(post.id);
          return (
            <div key={post.id} style={{
              background: 'var(--owf-surface)',
              borderBottom: '1px solid var(--owf-border)',
              padding: '18px 0',
              animation: 'owfCardReveal 0.4s ease both',
              animationDelay: `${i * 40}ms`,
            }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {/* Avatar */}
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: post.avatar,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, color: '#fff', fontWeight: 700,
                }}>
                  {post.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Author row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--owf-text)' }}>
                      {post.name}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--owf-text-muted)' }}>
                      @{post.handle}
                    </span>
                    <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--owf-text-muted)' }}>
                      · {post.city} · {post.timeAgo}
                    </span>
                    <span style={{ fontSize: 11, marginLeft: 'auto' }} title={post.moodLabel}>
                      {post.mood}
                    </span>
                  </div>
                  {/* Content */}
                  <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--owf-text)', lineHeight: 1.6, fontWeight: 300 }}>
                    {post.content}
                  </p>
                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 12, color: h, letterSpacing: '0.03em', cursor: 'pointer',
                      }}>
                        +{tag}
                      </span>
                    ))}
                  </div>
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 20 }}>
                    <button onClick={() => toggleLike(post.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 12, color: isLiked ? h : 'var(--owf-text-muted)',
                      transition: 'color 0.15s',
                    }}>
                      <span style={{ fontSize: 14 }}>{isLiked ? '♥' : '♡'}</span>
                      {post.likes + (isLiked ? 1 : 0)}
                    </button>
                    <button style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 12, color: 'var(--owf-text-muted)',
                    }}>
                      <span style={{ fontSize: 14 }}>💬</span>
                      {post.comments}
                    </button>
                    <button style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 12, color: 'var(--owf-text-muted)',
                    }}>
                      <span style={{ fontSize: 13 }}>↗</span> Share
                    </button>
                    <button style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 12, color: 'var(--owf-text-muted)',
                    }}>
                      <span>📌</span> Pin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
