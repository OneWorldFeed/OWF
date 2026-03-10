'use client';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeProvider';

export type SafetyLevel = 'verified' | 'community' | 'disputed' | 'misinformation';
export type ContentWarning = 'graphic' | 'sensitive' | 'satire' | 'opinion' | 'unverified_claim' | 'developing_story';

export interface SafetyMeta {
  level: SafetyLevel;
  warnings?: ContentWarning[];
  factCheckUrl?: string;
  sourceLabel?: string;
  verifiedBy?: string;
  claimDisputed?: string;
}

const LEVEL_CONFIG: Record<SafetyLevel, { color: string; bg: string; border: string; icon: string; label: string; description: string }> = {
  verified:        { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.25)',  icon: '✓', label: 'Verified Source',     description: 'This content is from a verified, credible institution.' },
  community:       { color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', icon: '◎', label: 'Community Post', description: 'Posted by a community member. Apply your own judgment.' },
  disputed:        { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)',  icon: '⚠', label: 'Disputed Claim',      description: 'This post contains claims that are disputed by fact-checkers.' },
  misinformation:  { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)', icon: '✕', label: 'Flagged: Misleading', description: 'This content has been identified as containing false information.' },
};

const WARNING_LABELS: Record<ContentWarning, string> = {
  graphic: '⚠ Graphic content', sensitive: '🤍 Sensitive topic', satire: '😄 Satire',
  opinion: '💬 Opinion', unverified_claim: '❓ Unverified claim', developing_story: '📡 Developing story',
};

export function SafetyBadge({ meta, compact = true }: { meta: SafetyMeta; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = LEVEL_CONFIG[meta.level];

  if (compact) {
    return (
      <div className="relative inline-block">
        <button onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition-all hover:scale-105"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
          <span>{cfg.icon}</span>
          <span className="hidden sm:inline">{cfg.label}</span>
        </button>
        {expanded && (
          <div className="absolute bottom-full left-0 mb-2 w-64 px-4 py-3 rounded-2xl z-50"
            style={{ background: '#0D1F2D', border: `1px solid ${cfg.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{cfg.icon}</span>
              <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>{cfg.description}</p>
            {meta.sourceLabel && <div className="flex items-center gap-1.5 mb-2"><span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Source:</span><span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>{meta.sourceLabel}</span></div>}
            {meta.claimDisputed && <div className="px-3 py-2 rounded-xl mb-2" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}><p className="text-[10px] leading-relaxed" style={{ color: '#fbbf24' }}>{meta.claimDisputed}</p></div>}
            {meta.warnings && meta.warnings.length > 0 && <div className="flex flex-wrap gap-1 mb-2">{meta.warnings.map(w => <span key={w} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>{WARNING_LABELS[w]}</span>)}</div>}
            {meta.factCheckUrl && <a href={meta.factCheckUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold" style={{ color: '#4ade80' }}>View fact-check →</a>}
            {meta.verifiedBy && <p className="text-[9px] mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Verified by {meta.verifiedBy}</p>}
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>OWF labels content for transparency. We don't remove posts — we help you decide.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 py-4 rounded-2xl" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <div className="flex items-center gap-2 mb-2"><span className="text-lg">{cfg.icon}</span><span className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</span></div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>{cfg.description}</p>
      {meta.claimDisputed && <p className="text-xs mb-3" style={{ color: '#fbbf24' }}>{meta.claimDisputed}</p>}
      {meta.factCheckUrl && <a href={meta.factCheckUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: '#4ade80' }}>Read the fact-check →</a>}
    </div>
  );
}

export function FactCheckStrip({ meta }: { meta: SafetyMeta }) {
  if (meta.level === 'community' || meta.level === 'verified') return null;
  const isDisputed = meta.level === 'disputed';
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-2"
      style={{ background: isDisputed ? 'rgba(251,191,36,0.07)' : 'rgba(248,113,113,0.07)', border: `1px solid ${isDisputed ? 'rgba(251,191,36,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
      <span style={{ fontSize: '1rem' }}>{isDisputed ? '⚠' : '✕'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold mb-0.5" style={{ color: isDisputed ? '#fbbf24' : '#f87171' }}>
          {isDisputed ? 'This post contains disputed claims' : 'This post contains misleading information'}
        </p>
        {meta.claimDisputed && <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{meta.claimDisputed}</p>}
        {meta.factCheckUrl && <a href={meta.factCheckUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold mt-1 inline-block" style={{ color: isDisputed ? '#fbbf24' : '#f87171' }}>See fact-check →</a>}
      </div>
    </div>
  );
}

export function CommunityGuidelinesBanner({ onDismiss }: { onDismiss: () => void }) {
  const { theme: T } = useTheme();
  const h = T.horizon;
  const hRgb = T.horizonRgb;
  return (
    <div className="px-5 py-5 rounded-2xl" style={{ background: `rgba(${hRgb}, 0.06)`, border: `1px solid rgba(${hRgb}, 0.2)` }}>
      <div className="flex items-center gap-2 mb-3"><span style={{ color: h, fontSize: '1.1rem' }}>🌍</span><h3 className="text-sm font-bold" style={{ color: '#fff' }}>OWF Community Standards</h3></div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[{ icon: '✓', label: 'Be kind and respectful', color: '#4ade80' }, { icon: '✓', label: 'Share verified information', color: '#4ade80' }, { icon: '✓', label: 'Celebrate all cultures', color: '#4ade80' }, { icon: '✓', label: 'Support learning & growth', color: '#4ade80' }, { icon: '✕', label: 'No hate speech or slurs', color: '#f87171' }, { icon: '✕', label: 'No harassment or threats', color: '#f87171' }, { icon: '✕', label: 'No health misinformation', color: '#f87171' }, { icon: '✕', label: 'No bullying or targeting', color: '#f87171' }].map(item => (
          <div key={item.label} className="flex items-center gap-1.5"><span className="text-xs font-bold flex-shrink-0" style={{ color: item.color }}>{item.icon}</span><span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.label}</span></div>
        ))}
      </div>
      <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>OWF is a fresh start. We promote STEM, history, art, and culture — and we protect every person's right to feel safe here.</p>
      <button onClick={onDismiss} className="w-full py-2.5 rounded-xl text-xs font-bold transition-all" style={{ background: `rgba(${hRgb}, 0.15)`, color: h, border: `1px solid rgba(${hRgb}, 0.3)` }}>I understand — take me in ✓</button>
    </div>
  );
}
