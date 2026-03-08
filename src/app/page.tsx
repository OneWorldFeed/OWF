import FeedTabs from '@/components/feed/FeedTabs';
import GlobalMomentsStrip from '@/components/feed/GlobalMomentsStrip';
import RightPanel from '@/components/panels/RightPanel';

const posts = [
  { id: '1', authorName: 'Amara Diallo', authorHandle: 'amaradiallo.feed', city: 'Lagos', timeAgo: '2m ago', mood: 'electric' as const, safetyBadge: 'clear' as const, likeCount: 24, commentCount: 7, accolade: 'Community Favorite', content: 'The energy in Lagos tonight is something else. The music never stops and neither do we. +lagos +nightlife' },
  { id: '2', authorName: 'Mei Tanaka', authorHandle: 'meitanaka.feed', city: 'Tokyo', timeAgo: '8m ago', mood: 'reflective' as const, likeCount: 41, commentCount: 12, imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800', content: 'Cherry blossom season begins today. Every year I forget how quickly it goes. +tokyo +cherryblossoms' },
  { id: '3', authorName: 'Carlos Mendez', authorHandle: 'carlosmendez.feed', city: 'Mexico City', timeAgo: '15m ago', mood: 'hopeful' as const, safetyBadge: 'clear' as const, likeCount: 18, commentCount: 3, content: 'Three years building this community garden. Today we harvested our first crop. +mexicocity +community' },
  { id: '4', authorName: 'Priya Sharma', authorHandle: 'priyasharma.feed', city: 'Mumbai', timeAgo: '22m ago', mood: 'ambitious' as const, likeCount: 56, commentCount: 19, content: 'Just presented to 400 people. Hands were shaking but the idea landed. +mumbai +startups' },
  { id: '5', authorName: 'Omar Hassan', authorHandle: 'omarhassan.feed', city: 'Cairo', timeAgo: '34m ago', mood: 'reflective' as const, likeCount: 33, commentCount: 8, imageUrl: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800', content: 'The Nile at sunrise never gets old. Thousands of years of history in one view. +cairo +egypt +nile' },
  { id: '6', authorName: 'Sofia Reyes', authorHandle: 'sofiareyes.feed', city: 'Buenos Aires', timeAgo: '41m ago', mood: 'joyful' as const, safetyBadge: 'clear' as const, likeCount: 72, commentCount: 24, content: 'Tango in the street at midnight. A stranger asked me to dance and now we are friends. +buenosaires +tango' },
  { id: '7', authorName: 'Kenji Mori', authorHandle: 'kenjimori.feed', city: 'Osaka', timeAgo: '55m ago', mood: 'curious' as const, likeCount: 29, commentCount: 11, trophy: true, imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800', content: 'Found a 100 year old ramen shop hidden in an alley. The owner is 87. Still cooking every day. +osaka +japan +food' },
  { id: '8', authorName: 'Lena Müller', authorHandle: 'lenamuller.feed', city: 'Berlin', timeAgo: '1h ago', mood: 'resilient' as const, likeCount: 44, commentCount: 15, content: 'Berlin winter is brutal but the studio is warm. Three months of work about to become something real. +berlin +art +design' },
  { id: '9', authorName: 'Yaw Darko', authorHandle: 'yawdarko.feed', city: 'Accra', timeAgo: '1h ago', mood: 'joyful' as const, safetyBadge: 'clear' as const, likeCount: 61, commentCount: 20, content: 'Accra is buzzing. New art, new music, new energy. The world needs to pay attention. +accra +ghana +afrobeats' },
  { id: '10', authorName: 'Jin Park', authorHandle: 'jinpark.feed', city: 'Seoul', timeAgo: '1h ago', mood: 'electric' as const, likeCount: 88, commentCount: 31, imageUrl: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=800', content: 'Seoul at night from the rooftop. The city never sleeps and neither do we. +seoul +korea +nightlife' },
  { id: '11', authorName: 'Amara Diallo', authorHandle: 'amaradiallo.feed', city: 'Lagos', timeAgo: '3h ago', mood: 'electric' as const, likeCount: 103, commentCount: 44, videoThumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', videoUrl: '', videoDuration: 67, content: 'Live performance from last night. The crowd was everything. +lagos +music +live' },
  { id: '12', authorName: 'Kenji Mori', authorHandle: 'kenjimori.feed', city: 'Osaka', timeAgo: '4h ago', mood: 'curious' as const, likeCount: 55, commentCount: 18, videoThumbnail: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800', videoUrl: '', videoDuration: 45, content: 'A walk through the alley where time stopped. +osaka +japan +documentary' },
];

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      width: '100%',
    }}>

      {/* Feed — has its own scroll AND scrolls with page */}
      <div style={{
        flex: 1,
        minWidth: 0,
        padding: '8px 24px 32px 20px',
        borderRight: '1px solid var(--owf-border)',
        maxHeight: 'calc(100vh - 56px)',
        overflowY: 'auto',
        position: 'sticky',
        top: '56px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(128,128,128,0.2) transparent',
      }}>
        <GlobalMomentsStrip />
        <FeedTabs posts={posts} />
      </div>

      {/* Right panel — all cards fully displayed, scrolls with main page only */}
      <div style={{
        width: '300px',
        minWidth: '300px',
        flexShrink: 0,
        padding: '12px 12px 32px 12px',
      }}>
        <RightPanel />
      </div>

    </div>
  );
}
