import FeedCard from '@/components/cards/FeedCard';

const posts = [
  {
    id: '1', authorName: 'Amara Diallo', authorHandle: 'amaradiallo.feed',
    city: 'Lagos', timeAgo: '2m ago', mood: 'electric' as const,
    safetyBadge: 'clear' as const, likeCount: 24, commentCount: 7,
    content: 'The energy in Lagos tonight is something else. The music never stops and neither do we. +lagos +nightlife',
  },
  {
    id: '2', authorName: 'Mei Tanaka', authorHandle: 'meitanaka.feed',
    city: 'Tokyo', timeAgo: '8m ago', mood: 'reflective' as const,
    likeCount: 41, commentCount: 12,
    content: 'Cherry blossom season begins today. Every year I forget how quickly it goes. Sitting in Shinjuku Gyoen watching petals fall. +tokyo +cherryblossoms',
  },
  {
    id: '3', authorName: 'Carlos Mendez', authorHandle: 'carlosmendez.feed',
    city: 'Mexico City', timeAgo: '15m ago', mood: 'hopeful' as const,
    safetyBadge: 'clear' as const, likeCount: 18, commentCount: 3,
    content: 'Three years building this community garden. Today we harvested our first crop. The neighbourhood came out. +mexicocity +community',
  },
  {
    id: '4', authorName: 'Priya Sharma', authorHandle: 'priyasharma.feed',
    city: 'Mumbai', timeAgo: '22m ago', mood: 'ambitious' as const,
    likeCount: 56, commentCount: 19,
    content: 'Just presented to 400 people. Hands were shaking but the idea landed. This is what we have been building toward. +mumbai +startups',
  },
  {
    id: '5', authorName: 'Omar Hassan', authorHandle: 'omarhassan.feed',
    city: 'Cairo', timeAgo: '34m ago', mood: 'ancient' as const,
    likeCount: 33, commentCount: 8,
    content: 'The Nile at sunrise never gets old. Thousands of years of history in one view. +cairo +egypt +nile',
  },
  {
    id: '6', authorName: 'Sofia Reyes', authorHandle: 'sofiareyes.feed',
    city: 'Buenos Aires', timeAgo: '41m ago', mood: 'joyful' as const,
    safetyBadge: 'clear' as const, likeCount: 72, commentCount: 24,
    content: 'Tango in the street at midnight. A stranger asked me to dance and now we are friends. +buenosaires +tango',
  },
  {
    id: '7', authorName: 'Kenji Mori', authorHandle: 'kenjimori.feed',
    city: 'Osaka', timeAgo: '55m ago', mood: 'curious' as const,
    likeCount: 29, commentCount: 11,
    content: 'Found a 100 year old ramen shop hidden in an alley. The owner is 87. Still cooking every day. +osaka +japan +food',
  },
  {
    id: '8', authorName: 'Lena Müller', authorHandle: 'lenamuller.feed',
    city: 'Berlin', timeAgo: '1h ago', mood: 'resilient' as const,
    likeCount: 44, commentCount: 15,
    content: 'Berlin winter is brutal but the studio is warm. Three months of work about to become something real. +berlin +art +design',
  },
  {
    id: '9', authorName: 'Yaw Darko', authorHandle: 'yawdarko.feed',
    city: 'Accra', timeAgo: '1h ago', mood: 'joyful' as const,
    safetyBadge: 'clear' as const, likeCount: 61, commentCount: 20,
    content: 'Accra is buzzing. New art, new music, new energy. The world needs to pay attention. +accra +ghana +afrobeats',
  },
];

export default function Home() {
  return (
    <div className="px-3 md:px-6 py-4 max-w-5xl mx-auto">

      {/* DESKTOP layout — hidden on mobile */}
      <div className="hidden md:block">
        {/* Row 1 — Featured */}
        <div className="mb-4">
          <FeedCard {...posts[0]} featured />
        </div>
        {/* Row 2 — Two col */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FeedCard {...posts[1]} />
          <FeedCard {...posts[2]} />
        </div>
        {/* Row 3 — Three col */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <FeedCard {...posts[3]} compact />
          <FeedCard {...posts[4]} compact />
          <FeedCard {...posts[5]} compact />
        </div>
        {/* Row 4 — Featured */}
        <div className="mb-4">
          <FeedCard {...posts[6]} featured />
        </div>
        {/* Row 5 — Two col */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FeedCard {...posts[7]} />
          <FeedCard {...posts[8]} />
        </div>
      </div>

      {/* MOBILE layout — hidden on desktop */}
      <div className="block md:hidden">
        {/* Row 1 — Horizontal scroll strip */}
        <div className="mb-3">
          <p className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--owf-text-secondary)' }}>
            TRENDING NOW
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {posts.slice(0, 4).map((post) => (
              <div key={post.id} className="flex-shrink-0 w-64 snap-start">
                <FeedCard {...post} compact />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — Two col grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FeedCard {...posts[4]} compact />
          <FeedCard {...posts[5]} compact />
        </div>

        {/* Row 3 — Full width featured */}
        <div className="mb-3">
          <FeedCard {...posts[6]} featured />
        </div>

        {/* Row 4 — Two col grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FeedCard {...posts[7]} compact />
          <FeedCard {...posts[8]} compact />
        </div>

        {/* Row 5 — Horizontal scroll strip */}
        <div className="mb-3">
          <p className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--owf-text-secondary)' }}>
            FROM AROUND THE WORLD
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex-shrink-0 w-64 snap-start">
                <FeedCard {...post} compact />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
