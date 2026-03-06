import FeedCard from '@/components/cards/FeedCard';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <FeedCard
        id="1"
        authorName="Amara Diallo"
        authorHandle="amaradiallo.feed"
        city="Lagos"
        timeAgo="2m ago"
        mood="electric"
        safetyBadge="clear"
        likeCount={24}
        commentCount={7}
        content="The energy in Lagos tonight is something else. The music never stops and neither do we. +lagos +nightlife"
      />
      <FeedCard
        id="2"
        authorName="Mei Tanaka"
        authorHandle="meitanaka.feed"
        city="Tokyo"
        timeAgo="8m ago"
        mood="reflective"
        likeCount={41}
        commentCount={12}
        content="Cherry blossom season begins today. Every year I forget how quickly it goes. Sitting in Shinjuku Gyoen watching petals fall. +tokyo +cherryblossoms"
      />
      <FeedCard
        id="3"
        authorName="Carlos Mendez"
        authorHandle="carlosmendez.feed"
        city="Mexico City"
        timeAgo="15m ago"
        mood="hopeful"
        safetyBadge="clear"
        likeCount={18}
        commentCount={3}
        content="Three years building this community garden. Today we harvested our first crop. The neighbourhood came out. This is what cities can be. +mexicocity +community"
      />
    </div>
  );
}
