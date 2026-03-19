'use client';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeProvider';
import ThemeSelector from '@/components/ui/ThemeSelector';
const LANGUAGES = ['English', 'French', 'Arabic', 'Spanish', 'Portuguese', 'Swahili', 'Yoruba', 'Mandarin', 'Hindi', 'Japanese'];
const FONT_SIZES = ['Small', 'Default', 'Large'];
const SECTIONS = ['Appearance', 'Content', 'Privacy', 'Notifications', 'About'];
export default function SettingsPage() {
  const { theme: T } = useTheme();
  const [section, setSection] = useState('Appearance');
  const [lang, setLang] = useState('English');
  const [fontSize, setFontSize] = useState('Default');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showCity, setShowCity] = useState(true);
  const [showMood, setShowMood] = useState(true);
  const [notifyLikes, setNotifyLikes] = useState(true);
  const [notifyDMs, setNotifyDMs] = useState(true);
  const [notifySignals, setNotifySignals] = useState(false);
  const h = T.horizon;
  const hRgb = T.horizonRgb;
  function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
    return (
      <button onClick={onChange} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: value ? h : 'var(--owf-raised)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        boxShadow: value ? `0 0 8px rgba(${hRgb},0.4)` : 'none',
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3, left: value ? 23 : 3,
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    );
  }
  function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--owf-border)' }}>
        <div>
          <div style={{ fontSize: 14, color: 'var(--owf-text)', fontWeight: 400 }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: 'var(--owf-text-muted)', marginTop: 2 }}>{sub}</div>}
        </div>
        {children}
      </div>
    );
  }
  return (
    <div style={{ padding: '20px 0 80px', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 300, color: 'var(--owf-text)', letterSpacing: '-0.02em' }}>
          Settings
        </h1>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--owf-text-muted)', letterSpacing: '0.04em' }}>
          Customize your OWF experience
        </p>
      </div>
      {/* Section nav */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, overflowX: 'auto', borderBottom: '1px solid var(--owf-border)', paddingBottom: 0 }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setSection(s)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px', fontSize: 13, fontWeight: section === s ? 500 : 400,
            color: section === s ? h : 'var(--owf-text-muted)',
            borderBottom: section === s ? `2px solid ${h}` : '2px solid transparent',
            marginBottom: -1, whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}>{s}</button>
        ))}
      </div>
      {/* Appearance */}
      {section === 'Appearance' && (
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: `rgba(${hRgb},0.5)`, marginBottom: 16 }}>
            Theme
          </div>
          <div style={{ background: 'var(--owf-surface)', border: '1px solid var(--owf-border)', borderRadius: 16, padding: '18px' , marginBottom: 24 }}>
            <ThemeSelector />
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: `rgba(${hRgb},0.5)`, marginBottom: 16 }}>
            Display
          </div>
          <div style={{ background: 'var(--owf-surface)', border: '1px solid var(--owf-border)', borderRadius: 16, padding: '0 18px' }}>
            <SettingRow label="Font size" sub="Affects all text across OWF">
              <div style={{ display: 'flex', gap: 4 }}>
                {FONT_SIZES.map(f => (
                  <button key={f} onClick={() => setFontSize(f)} style={{
                    padding: '4px 10px', borderRadius: 8, border: `1px solid ${fontSize === f ? h : 'var(--owf-border)'}`,
                    background: fontSize === f ? `rgba(${hRgb},0.10)` : 'transparent',
                    color: fontSize === f ? h : 'var(--owf-text-muted)',
                    fontSize: 11, cursor: 'pointer', transition: 'all 0.15s',
                  }}>{f}</button>
                ))}
              </div>
            </SettingRow>
            <SettingRow label="Reduce motion" sub="Disable animations across the platform">
              <Toggle value={reduceMotion} onChange={() => setReduceMotion(v => !v)} />
            </SettingRow>
          </div>
        </div>
      )}
      {/* Content */}
      {section === 'Content' && (
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: `rgba(${hRgb},0.5)`, marginBottom: 16 }}>
            Language
          </div>
          <div style={{ background: 'var(--owf-surface)', border: '1px solid var(--owf-border)', borderRadius: 16, padding: '18px', marginBottom: 24 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {LANGUAGES.map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: '6px 14px', borderRadius: 20,
                  border: `1px solid ${lang === l ? h : 'var(--owf-border)'}`,
                  background: lang === l ? `rgba(${hRgb},0.10)` : 'transparent',
                  color: lang === l ? h : 'var(--owf-text-muted)',
                  fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                  fontWeight: lang === l ? 600 : 400,
                }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Privacy */}
      {section === 'Privacy' && (
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: `rgba(${hRgb},0.5)`, marginBottom: 16 }}>
            Profile visibility
          </div>
          <div style={{ background: 'var(--owf-surface)', border: '1px solid var(--owf-border)', borderRadius: 16, padding: '0 18px', marginBottom: 24 }}>
            <SettingRow label="Private profile" sub="Only approved followers can see your posts">
              <Toggle value={privateProfile} onChange={() => setPrivateProfile(v => !v)} />
            </SettingRow>
            <SettingRow label="Show city" sub="Display your city on posts and profile">
              <Toggle value={showCity} onChange={() => setShowCity(v => !v)} />
            </SettingRow>
            <SettingRow label="Show mood" sub="Let others see your current mood signal">
              <Toggle value={showMood} onChange={() => setShowMood(v => !v)} />
            </SettingRow>
          </div>
          <div style={{ background: 'var(--owf-surface)', border: `1px solid rgba(${hRgb},0.15)`, borderRadius: 16, padding: '16px 18px' }}>
            <div style={{ fontSize: 12, color: 'var(--owf-text-muted)', lineHeight: 1.7 }}>
              OWF does not sell your data, run ads, or share your information with third parties.
              AI conversations are session-only and never stored or used for training.
            </div>
          </div>
        </div>
      )}
      {/* Notifications */}
      {section === 'Notifications' && (
        <div>
          <div style={{ background: 'var(--owf-surface)', border: '1px solid var(--owf-border)', borderRadius: 16, padding: '0 18px' }}>
            <SettingRow label="Likes and reactions" sub="When someone reacts to your post">
              <Toggle value={notifyLikes} onChange={() => setNotifyLikes(v => !v)} />
            </SettingRow>
            <SettingRow label="Direct messages" sub="New messages in your DMs">
              <Toggle value={notifyDMs} onChange={() => setNotifyDMs(v => !v)} />
            </SettingRow>
            <SettingRow label="Live signals" sub="When a city you follow goes live">
              <Toggle value={notifySignals} onChange={() => setNotifySignals(v => !v)} />
            </SettingRow>
          </div>
        </div>
      )}
      {/* About */}
      {section === 'About' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'OneWorldFeed', value: 'v0.1.0 — Early Preview' },
            { label: 'Platform', value: 'Next.js 14 · Firebase · TypeScript' },
            { label: 'AI', value: 'Claude (Anthropic) — Session only, never stored' },
            { label: 'Privacy', value: 'No ads · No tracking · No third-party data sharing' },
            { label: 'Mission', value: 'Connecting real people from real cities around the world' },
          ].map(row => (
            <div key={row.label} style={{ background: 'var(--owf-surface)', border: '1px solid var(--owf-border)', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: `rgba(${hRgb},0.45)`, marginBottom: 4 }}>{row.label}</div>
              <div style={{ fontSize: 13, color: 'var(--owf-text)', fontWeight: 300 }}>{row.value}</div>
            </div>
          ))}
          <div style={{
            marginTop: 8, padding: '20px', borderRadius: 16, textAlign: 'center',
            background: `linear-gradient(135deg, rgba(${hRgb},0.06), rgba(${hRgb},0.02))`,
            border: `1px solid rgba(${hRgb},0.12)`,
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>🌍</div>
            <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--owf-text)', marginBottom: 4 }}>
              One World. One Feed.
            </div>
            <div style={{ fontSize: 11, color: 'var(--owf-text-muted)' }}>
              Built with care for every city on Earth.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
