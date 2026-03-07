/* ============================================================
   OWF FEED CONTEXT SERVICE v1
   Queries Firestore for real post data and aggregates it
   into a context object for the Rules Engine and Copilot.

   No API key required — pure Firestore queries.
   Called once on AI page load, refreshed every 5 minutes.
============================================================ */

import { db } from '@/lib/firebase/config';
import {
  collection, query, orderBy, limit, getDocs,
  where, Timestamp,
} from 'firebase/firestore';

export interface FeedContextData {
  topCities: string[];
  topTags: string[];
  topMoods: string[];
  recentPosts: Array<{
    city: string;
    mood: string;
    tags: string[];
    content: string;
    likeCount: number;
  }>;
  totalPostsToday: number;
  mostLikedPost: { city: string; content: string; likeCount: number } | null;
  lastUpdated: Date;
}

const FALLBACK_CONTEXT: FeedContextData = {
  topCities: ['Lagos', 'Tokyo', 'Cairo', 'Berlin', 'Seoul'],
  topTags: ['+music', '+community', '+travel', '+art', '+startup'],
  topMoods: ['electric', 'hopeful', 'reflective'],
  recentPosts: [],
  totalPostsToday: 0,
  mostLikedPost: null,
  lastUpdated: new Date(),
};

export async function getFeedContext(): Promise<FeedContextData> {
  try {
    const postsRef = collection(db, 'posts');

    // Get last 50 posts
    const recentQuery = query(
      postsRef,
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const snapshot = await getDocs(recentQuery);

    if (snapshot.empty) return FALLBACK_CONTEXT;

    const posts = snapshot.docs.map(doc => doc.data());

    // Aggregate cities
    const cityCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    const moodCounts: Record<string, number> = {};
    let mostLiked = { city: '', content: '', likeCount: 0 };

    const recentPosts: FeedContextData['recentPosts'] = [];

    for (const post of posts) {
      // Cities
      if (post.city) {
        cityCounts[post.city] = (cityCounts[post.city] || 0) + 1;
      }

      // Tags
      if (post.tags && Array.isArray(post.tags)) {
        for (const tag of post.tags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }

      // Moods
      if (post.mood) {
        moodCounts[post.mood] = (moodCounts[post.mood] || 0) + 1;
      }

      // Most liked
      if ((post.likeCount || 0) > mostLiked.likeCount) {
        mostLiked = {
          city: post.city || 'Unknown',
          content: (post.content || '').substring(0, 100),
          likeCount: post.likeCount || 0,
        };
      }

      // Recent posts for context
      if (recentPosts.length < 10) {
        recentPosts.push({
          city: post.city || 'Unknown',
          mood: post.mood || 'electric',
          tags: post.tags || [],
          content: (post.content || '').substring(0, 120),
          likeCount: post.likeCount || 0,
        });
      }
    }

    // Sort by count
    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city]) => city);

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);

    const topMoods = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([mood]) => mood);

    return {
      topCities: topCities.length > 0 ? topCities : FALLBACK_CONTEXT.topCities,
      topTags: topTags.length > 0 ? topTags : FALLBACK_CONTEXT.topTags,
      topMoods: topMoods.length > 0 ? topMoods : FALLBACK_CONTEXT.topMoods,
      recentPosts,
      totalPostsToday: posts.length,
      mostLikedPost: mostLiked.likeCount > 0 ? mostLiked : null,
      lastUpdated: new Date(),
    };

  } catch (err) {
    console.warn('[OWF Feed Context] Firestore query failed, using fallback', err);
    return FALLBACK_CONTEXT;
  }
}

/* ── FORMAT FOR RULES ENGINE ─────────────────────────────── */
export function formatContextForRules(ctx: FeedContextData) {
  return {
    city: ctx.topCities[0] || 'the world',
    feedCities: ctx.topCities,
  };
}

/* ── FORMAT FOR AI PROMPT ────────────────────────────────── */
export function formatContextForPrompt(ctx: FeedContextData): string {
  const lines: string[] = [];

  if (ctx.topCities.length > 0) {
    lines.push(`Most active cities: ${ctx.topCities.join(', ')}`);
  }

  if (ctx.topMoods.length > 0) {
    lines.push(`Dominant moods: ${ctx.topMoods.join(', ')}`);
  }

  if (ctx.topTags.length > 0) {
    lines.push(`Trending tags: ${ctx.topTags.join(' ')}`);
  }

  if (ctx.totalPostsToday > 0) {
    lines.push(`Posts in feed: ${ctx.totalPostsToday}`);
  }

  if (ctx.mostLikedPost) {
    lines.push(`Most liked post: "${ctx.mostLikedPost.content}" from ${ctx.mostLikedPost.city} (${ctx.mostLikedPost.likeCount} likes)`);
  }

  if (ctx.recentPosts.length > 0) {
    lines.push('\nRecent posts:');
    for (const post of ctx.recentPosts.slice(0, 6)) {
      lines.push(`• ${post.city} [${post.mood}]: "${post.content}" ${post.tags.join(' ')}`);
    }
  }

  return lines.join('\n');
}
