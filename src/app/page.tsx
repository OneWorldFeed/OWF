import FeedTabs from '@/components/feed/FeedTabs';
import { GlobalMomentsStrip } from '@/components/feed/GlobalMomentsStrip';
import RightPanel from '@/components/panels/RightPanel';
import { SIGNALS } from '@/data/signals';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      width: '100%',
    }}>

      {/* Feed — natural flow, scrolls with page */}
      <div
        className="feed-center"
        style={{
          flex: 1,
          minWidth: 0,
          padding: '8px 24px 32px 20px',
          borderRight: '1px solid var(--owf-border)',
        }}
      >
        <GlobalMomentsStrip />
        <FeedTabs signals={SIGNALS} />
      </div>

      {/* Right panel — natural flow, scrolls with page, never clipped */}
      <div style={{
        width: '300px',
        flexShrink: 0,
        padding: '12px 12px 32px 12px',
        minWidth: 0,
      }}>
        <RightPanel />
      </div>

    </div>
  );
}
