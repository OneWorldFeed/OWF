'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GUEST_ID = 'guest_preview';

const LANGUAGES = ['English', 'French', 'Arabic', 'Spanish', 'Portuguese', 'Swahili', 'Yoruba', 'Mandarin', 'Hindi', 'Japanese'];
const PRONOUNS = ['he/him', 'she/her', 'they/them', 'he/they', 'she/they', 'any'];

interface Profile {
  displayName: string;
  handle: string;
  bio: string;
  city: string;
  country: string;
  pronouns: string;
  languages: string[];
  website: string;
  joinDate: string;
  accentColor: string;
  coverStyle: string;
}

const DEFAULT_PROFILE: Profile = {
  displayName: 'Your Name',
  handle: 'yourhandle.feed',
  bio: '',
  city: '',
  country: '',
  pronouns: '',
  languages: [],
  website: '',
  joinDate: new Date().toISOString().split('T')[0],
  accentColor: '#D97706',
  coverStyle: 'dawn',
};

const COVER_STYLES: { id: string; label: string; gradient: string }[] = [
  { id: 'dawn',     label: 'Dawn',     gradient: 'linear-gradient(135deg, #F5A623, #E8650A, #C94A00)' },
  { id: 'noon',     label: 'Noon',     gradient: 'linear-gradient(135deg, #E0F4FF, #90CDF4, #63B3ED)' },
  { id: 'golden',   label: 'Golden',   gradient: 'linear-gradient(135deg, #FFF3CD, #FFB347, #FF6B35)' },
  { id: 'dusk',     label: 'Dusk',     gradient: 'linear-gradient(135deg, #2D1B69, #C2185B, #FF6E40)' },
  { id: 'midnight', label: 'Midnight', gradient: 'linear-gradient(135deg, #060E1A, #0D1F35, #1E3A5F)' },
  { id: 'cosmos',   label: 'Cosmos',   gradient: 'linear-gradient(135deg, #05020F, #120830, #9D4EDD)' },
  { id: 'forest',   label: 'Forest',   gradient: 'linear-gradient(135deg, #1B5E20, #2E7D32, #4CAF50)' },
  { id: 'ocean',    label: 'Ocean',    gradient: 'linear-gradient(135deg, #003366, #006994, #00B4D8)' },
];

const ACCENT_COLORS = [
  '#D97706', '#E8650A', '#CC0022', '#0284C7',
  '#1B5E20', '#7C3AED', '#00DCBE', '#9D4EDD',
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatJoinDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch { return ''; }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(DEFAULT_PROFILE);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const ref = doc(db, 'users', GUEST_ID);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile({ ...DEFAULT_PROFILE, ...snap.data() as Profile });
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    }
    setLoading(false);
  }

  function startEdit() {
    setDraft({ ...profile });
    setEditing(true);
    setSaved(false);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', GUEST_ID), draft, { merge: true });
      setProfile({ ...draft });
      setSaved(true);
      setTimeout(() => { setEditing(false); setSaved(false); }, 800);
    } catch (e) {
      console.error('Save failed', e);
    }
    setSaving(false);
  }

  function toggleLanguage(lang: string) {
    setDraft(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  }

  const coverStyle = COVER_STYLES.find(c => c.id === profile.coverStyle) || COVER_STYLES[0];
  const draftCoverStyle = COVER_STYLES.find(c => c.id === draft.coverStyle) || COVER_STYLES[0];

  const TABS = ['Overview', 'Posts', 'Notebook', 'Badges', 'Collections', 'Circles'];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FDFCFB' }}>
      <div className="text-sm animate-pulse" style={{ color: '#9CA3AF' }}>Loading profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#FDFCFB', color: '#1A1410' }}>

      {/* ── COVER ─────────────────────────────────────────── */}
      <div className="relative h-48 md:h-64 w-full"
        style={{ background: editing ? draftCoverStyle.gradient : coverStyle.gradient }}>
        {/* Cover style picker in edit mode */}
        {editing && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {COVER_STYLES.map(cs => (
              <button key={cs.id} onClick={() => setDraft(p => ({ ...p, coverStyle: cs.id }))}
                className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                style={{ background: cs.gradient, borderColor: draft.coverStyle === cs.id ? '#fff' : 'transparent', boxShadow: draft.coverStyle === cs.id ? '0 0 0 2px rgba(0,0,0,0.3)' : 'none' }}
                title={cs.label} />
            ))}
          </div>
        )}
        {/* Edit / Save buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {!editing ? (
            <button onClick={startEdit}
              className="text-xs font-bold px-4 py-2 rounded-full backdrop-blur-sm transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}>
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button onClick={() => setEditing(false)}
                className="text-xs font-bold px-3 py-2 rounded-full"
                style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                Cancel
              </button>
              <button onClick={saveProfile} disabled={saving}
                className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
                style={{ backgroundColor: saved ? '#16A34A' : '#fff', color: saved ? '#fff' : profile.accentColor }}>
                {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── IDENTITY BLOCK ────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative -mt-14 mb-6">
          <div className="flex items-end justify-between">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-white text-2xl font-black"
                style={{ backgroundColor: editing ? draft.accentColor : profile.accentColor }}>
                {getInitials(editing ? draft.displayName : profile.displayName)}
              </div>
              {/* Accent color picker in edit mode */}
              {editing && (
                <div className="absolute -bottom-2 left-0 flex gap-1 flex-wrap w-32">
                  {ACCENT_COLORS.map(color => (
                    <button key={color} onClick={() => setDraft(p => ({ ...p, accentColor: color }))}
                      className="w-5 h-5 rounded-full border-2 transition-all hover:scale-110"
                      style={{ backgroundColor: color, borderColor: draft.accentColor === color ? '#1A1410' : 'transparent' }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Name + handle */}
          <div className="mt-4">
            {editing ? (
              <div className="space-y-3">
                <input value={draft.displayName} onChange={e => setDraft(p => ({ ...p, displayName: e.target.value }))}
                  placeholder="Display name"
                  className="text-xl font-black bg-transparent border-b-2 focus:outline-none w-full pb-1"
                  style={{ borderColor: draft.accentColor, color: '#1A1410' }} />
                <div className="flex items-center gap-1">
                  <input value={draft.handle.replace('.feed', '')} onChange={e => setDraft(p => ({ ...p, handle: e.target.value.replace(/\s/g, '').toLowerCase() + '.feed' }))}
                    placeholder="handle"
                    className="text-sm bg-transparent border-b focus:outline-none"
                    style={{ borderColor: '#E8E0D5', color: '#7A6E65', width: '160px' }} />
                  <span className="text-sm" style={{ color: '#7A6E65' }}>.feed</span>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-black" style={{ color: '#1A1410' }}>{profile.displayName}</h1>
                <p className="text-sm font-medium mt-0.5" style={{ color: profile.accentColor }}>{profile.handle}</p>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="mt-3">
            {editing ? (
              <div className="relative">
                <textarea value={draft.bio} onChange={e => e.target.value.length <= 160 && setDraft(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Write a short bio..."
                  rows={3}
                  className="w-full text-sm bg-transparent rounded-xl px-3 py-2 resize-none focus:outline-none"
                  style={{ border: '1px solid #E8E0D5', color: '#1A1410' }} />
                <span className="absolute bottom-3 right-3 text-[10px]" style={{ color: '#9CA3AF' }}>{160 - draft.bio.length}</span>
              </div>
            ) : (
              profile.bio && <p className="text-sm leading-relaxed mt-1" style={{ color: '#3D3530' }}>{profile.bio}</p>
            )}
          </div>

          {/* Meta row — city, pronouns, joined, website */}
          <div className="flex flex-wrap gap-3 mt-3">
            {editing ? (
              <div className="w-full space-y-3">
                <div className="flex gap-3">
                  <input value={draft.city} onChange={e => setDraft(p => ({ ...p, city: e.target.value }))}
                    placeholder="City"
                    className="flex-1 text-xs px-3 py-2 rounded-xl focus:outline-none"
                    style={{ backgroundColor: '#F5F0E8', border: '1px solid #E8E0D5', color: '#1A1410' }} />
                  <input value={draft.country} onChange={e => setDraft(p => ({ ...p, country: e.target.value }))}
                    placeholder="Country"
                    className="flex-1 text-xs px-3 py-2 rounded-xl focus:outline-none"
                    style={{ backgroundColor: '#F5F0E8', border: '1px solid #E8E0D5', color: '#1A1410' }} />
                </div>
                <div className="flex gap-3">
                  <select value={draft.pronouns} onChange={e => setDraft(p => ({ ...p, pronouns: e.target.value }))}
                    className="flex-1 text-xs px-3 py-2 rounded-xl focus:outline-none"
                    style={{ backgroundColor: '#F5F0E8', border: '1px solid #E8E0D5', color: '#1A1410' }}>
                    <option value="">Pronouns (optional)</option>
                    {PRONOUNS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input value={draft.website} onChange={e => setDraft(p => ({ ...p, website: e.target.value }))}
                    placeholder="Website (optional)"
                    className="flex-1 text-xs px-3 py-2 rounded-xl focus:outline-none"
                    style={{ backgroundColor: '#F5F0E8', border: '1px solid #E8E0D5', color: '#1A1410' }} />
                </div>
                {/* Languages */}
                <div>
                  <p className="text-[10px] font-black tracking-widest mb-2" style={{ color: '#9CA3AF' }}>LANGUAGES</p>
                  <div className="flex flex-wrap gap-1.5">
                    {LANGUAGES.map(lang => (
                      <button key={lang} onClick={() => toggleLanguage(lang)}
                        className="text-xs px-2.5 py-1 rounded-full transition-all hover:scale-105"
                        style={{
                          backgroundColor: draft.languages.includes(lang) ? draft.accentColor + '20' : '#F5F0E8',
                          border: `1px solid ${draft.languages.includes(lang) ? draft.accentColor : '#E8E0D5'}`,
                          color: draft.languages.includes(lang) ? draft.accentColor : '#7A6E65',
                        }}>
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {(profile.city || profile.country) && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#7A6E65' }}>
                    📍 {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </span>
                )}
                {profile.pronouns && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F0E8', color: '#7A6E65' }}>{profile.pronouns}</span>
                )}
                {profile.languages.length > 0 && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#7A6E65' }}>
                    🌐 {profile.languages.join(' · ')}
                  </span>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium hover:underline"
                    style={{ color: profile.accentColor }}>
                    🔗 {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <span className="text-xs" style={{ color: '#9CA3AF' }}>
                  Joined {formatJoinDate(profile.joinDate)}
                </span>
              </>
            )}
          </div>

          {/* Stats row */}
          {!editing && (
            <div className="flex gap-6 mt-4 pt-4" style={{ borderTop: '1px solid #E8E0D5' }}>
              {[['Posts', '12'], ['Followers', '0'], ['Following', '0'], ['Notebooks', '0']].map(([label, count]) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-black" style={{ color: '#1A1410' }}>{count}</p>
                  <p className="text-[10px] font-bold tracking-wide" style={{ color: '#9CA3AF' }}>{label.toUpperCase()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── TABS ──────────────────────────────────────────── */}
        {!editing && (
          <>
            <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide"
              style={{ borderBottom: '1px solid #E8E0D5' }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
                  className="px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    color: activeTab === tab.toLowerCase() ? profile.accentColor : '#9CA3AF',
                    borderBottom: activeTab === tab.toLowerCase() ? `2px solid ${profile.accentColor}` : '2px solid transparent',
                  }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ──────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Badges preview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black tracking-widest" style={{ color: '#9CA3AF' }}>BADGES</p>
                    <button onClick={() => setActiveTab('badges')} className="text-xs font-semibold" style={{ color: profile.accentColor }}>See all →</button>
                  </div>
                  <div className="flex gap-3">
                    {[
                      { emoji: '🌍', label: 'Pioneer',       color: '#D97706', desc: 'Early OWF member'      },
                      { emoji: '✨', label: 'First Post',    color: '#059669', desc: 'Published your first post' },
                      { emoji: '🔥', label: 'Streak ×7',    color: '#EA580C', desc: '7-day posting streak'  },
                    ].map(badge => (
                      <div key={badge.label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: badge.color + '10', border: `1px solid ${badge.color}25`, width: '80px' }}>
                        <span className="text-2xl">{badge.emoji}</span>
                        <span className="text-[10px] font-black text-center leading-tight" style={{ color: badge.color }}>{badge.label}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl cursor-pointer transition-all hover:scale-105"
                      style={{ backgroundColor: '#F5F0E8', border: '1px dashed #E8E0D5', width: '80px' }}
                      onClick={() => setActiveTab('badges')}>
                      <span className="text-xl" style={{ color: '#C8BAA8' }}>+</span>
                      <span className="text-[10px] font-bold text-center" style={{ color: '#C8BAA8' }}>MORE</span>
                    </div>
                  </div>
                </div>

                {/* Notebook preview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-black tracking-widest" style={{ color: '#9CA3AF' }}>NOTEBOOK</p>
                    <button onClick={() => setActiveTab('notebook')} className="text-xs font-semibold" style={{ color: profile.accentColor }}>See all →</button>
                  </div>
                  <div className="rounded-2xl overflow-hidden relative cursor-pointer group"
                    style={{ height: '140px', background: 'linear-gradient(135deg, #F5A623, #E8650A)', border: '1px solid #E8E0D5' }}
                    onClick={() => setActiveTab('notebook')}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                      <span className="text-3xl mb-2">📖</span>
                      <p className="text-white font-black text-sm">Start Your First Chapter</p>
                      <p className="text-white/70 text-xs mt-1">Tell your story — 10 photos + 1 video per chapter</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── BADGES TAB ────────────────────────────────── */}
            {activeTab === 'badges' && (
              <div>
                <p className="text-xs font-black tracking-widest mb-4" style={{ color: '#9CA3AF' }}>EARNED BADGES</p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {[
                    { emoji: '🌍', label: 'Pioneer',          color: '#D97706', desc: 'Early OWF member',            rarity: 'Legendary' },
                    { emoji: '✨', label: 'First Post',       color: '#059669', desc: 'Published your first post',   rarity: 'Common'    },
                    { emoji: '🔥', label: 'Streak ×7',       color: '#EA580C', desc: '7-day posting streak',        rarity: 'Rare'      },
                    { emoji: '💬', label: 'Conversationalist',color: '#2563EB', desc: '50 comments made',            rarity: 'Uncommon'  },
                    { emoji: '🏆', label: 'Community Fav',   color: '#7C3AED', desc: 'Post liked by 100+ people',   rarity: 'Rare'      },
                    { emoji: '🗺️', label: 'Globe Trotter',   color: '#0891B2', desc: 'Posted from 3+ cities',       rarity: 'Epic'      },
                  ].map(badge => (
                    <div key={badge.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: badge.color + '10', border: `1px solid ${badge.color}30`, boxShadow: `0 4px 16px ${badge.color}15` }}>
                      <span className="text-3xl">{badge.emoji}</span>
                      <span className="text-xs font-black text-center leading-tight" style={{ color: badge.color }}>{badge.label}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: badge.color + '20', color: badge.color }}>{badge.rarity}</span>
                    </div>
                  ))}
                  {/* Locked badges */}
                  {[
                    { emoji: '📖', label: 'Storyteller', desc: 'Complete your first Notebook chapter' },
                    { emoji: '🌐', label: 'Global Voice', desc: 'Get followers from 5+ countries'      },
                    { emoji: '🎯', label: 'Streak ×30',  desc: '30-day posting streak'                 },
                  ].map(badge => (
                    <div key={badge.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl cursor-pointer"
                      style={{ backgroundColor: '#F5F0E8', border: '1px dashed #E8E0D5', opacity: 0.6 }}>
                      <span className="text-3xl grayscale">{badge.emoji}</span>
                      <span className="text-xs font-black text-center leading-tight" style={{ color: '#C8BAA8' }}>{badge.label}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8E0D5', color: '#C8BAA8' }}>Locked</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── NOTEBOOK TAB ──────────────────────────────── */}
            {activeTab === 'notebook' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-black tracking-widest" style={{ color: '#9CA3AF' }}>YOUR CHAPTERS</p>
                  <button className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
                    style={{ backgroundColor: profile.accentColor, color: '#fff' }}>
                    + New Chapter
                  </button>
                </div>
                <div className="rounded-3xl overflow-hidden flex flex-col items-center justify-center py-16 text-center"
                  style={{ background: 'linear-gradient(135deg, #FFFBF0, #FFF3CD)', border: '2px dashed #E8E0D5' }}>
                  <span className="text-5xl mb-4">📖</span>
                  <p className="text-base font-black mb-2" style={{ color: '#1A1410' }}>Your story begins here</p>
                  <p className="text-sm mb-6 max-w-xs" style={{ color: '#7A6E65' }}>
                    A Notebook chapter is a curated story — up to 10 photos and 1 video, with a title, mood, and your own words.
                  </p>
                  <button className="text-sm font-bold px-6 py-3 rounded-full transition-all hover:scale-105"
                    style={{ backgroundColor: profile.accentColor, color: '#fff' }}>
                    Create First Chapter
                  </button>
                </div>
              </div>
            )}

            {/* ── POSTS TAB ─────────────────────────────────── */}
            {activeTab === 'posts' && (
              <div className="text-center py-16">
                <span className="text-4xl mb-4 block">✍️</span>
                <p className="font-black mb-2" style={{ color: '#1A1410' }}>No posts yet</p>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>Your published posts will appear here</p>
              </div>
            )}

            {/* ── COLLECTIONS TAB ───────────────────────────── */}
            {activeTab === 'collections' && (
              <div className="text-center py-16">
                <span className="text-4xl mb-4 block">📚</span>
                <p className="font-black mb-2" style={{ color: '#1A1410' }}>No collections yet</p>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>Save posts, moments, and media to build your collections</p>
              </div>
            )}

            {/* ── CIRCLES TAB ───────────────────────────────── */}
            {activeTab === 'circles' && (
              <div className="text-center py-16">
                <span className="text-4xl mb-4 block">👥</span>
                <p className="font-black mb-2" style={{ color: '#1A1410' }}>Your circles are empty</p>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>Follow people to build your circles</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
