'use client';
import { useState, useRef, useEffect } from 'react';
import type { Signal } from '@/types/signal';
import { SignalCard } from '@/components/feed/SignalCard';

const TABS = ['All', 'Text', 'Images', 'Video'] as const;
type Tab = typeof TABS[number];

function filterByTab(signals: Signal[], tab: Tab): Signal[] {
  if (tab === 'All') return signals;
  if (tab === 'Text') return signals.filter(s => !s.mediaType || s.mediaType === 'text');
  if (tab === 'Images') return signals.filter(s => s.mediaType === 'image' || s.mediaType === 'image-vertical');
  if (tab === 'Video') return signals.filter(s => s.mediaType === 'video-horizontal' || s.mediaType === 'video-vertical');
  return signals;
}

export default function FeedTabs({
  signals,
  onWatch,
}: {
  signals: Signal[];
  onWatch?: (signal: Signal) => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const filtered = filterByTab(signals, activeTab);

  // Sliding pill
  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  useEffect(() => {
    const el = tabRefs.current['All'];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, []);

  const counts: Record<Tab, number> = {
    All:    signals.length,
    Text:   filterByTab(signals, 'Text').length,
    Images: filterByTab(signals, 'Images').length,
    Video:  filterByTab(signals, 'Video').length,
  };

  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        padding: '8px 0 12px', position: 'relative',
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              ref={(el: HTMLButtonElement | null) => { tabRefs.current[tab] = el; }}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 14px', borderRadius: '99px',
                fontSize: '12px', fontWeight: active ? 700 : 500,
                background: active ? 'var(--owf-navy)' : 'transparent',
                color: active ? '#fff' : 'var(--owf-text-muted)',
                border: active ? 'none' : '1px solid var(--owf-border)',
                boxShadow: active ? '0 0 12px var(--owf-glow)' : 'none',
                cursor: 'pointer', position: 'relative', zIndex: 1,
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {tab}
              {counts[tab] > 0 && (
                <span style={{
                  fontSize: '10px', fontWeight: 700,
                  padding: '1px 6px', borderRadius: '99px',
                  background: active ? 'rgba(255,255,255,0.25)' : 'var(--owf-border)',
                  color: active ? '#fff' : 'var(--owf-text-muted)',
                }}>
                  {counts[tab]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Signal list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length > 0 ? (
          filtered.map((signal, i) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              index={i}
              onWatch={onWatch ?? (() => {})}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--owf-text-muted)' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>◎</p>
            <p style={{ fontSize: '13px' }}>
              No {activeTab === 'All' ? '' : activeTab.toLowerCase() + ' '}posts yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
