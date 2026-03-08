'use client';
import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GUEST_ID = 'guest_preview';

const LANGUAGES = ['English','French','Arabic','Spanish','Portuguese','Swahili','Yoruba','Mandarin','Hindi','Japanese'];
const PRONOUNS = ['he/him','she/her','they/them','he/they','she/they','any/all'];
const ACCENT_COLORS = ['#D97706','#E8650A','#CC0022','#0284C7','#1B5E20','#7C3AED','#00DCBE','#DB2777'];

const COVER_STYLES = [
  { id:'dawn',     gradient:'linear-gradient(135deg,#FEF3C7,#FDE68A,#FCA5A5)' },
  { id:'noon',     gradient:'linear-gradient(135deg,#E0F2FE,#BAE6FD,#A5F3FC)' },
  { id:'golden',   gradient:'linear-gradient(135deg,#FFF7ED,#FED7AA,#FDBA74)' },
  { id:'dusk',     gradient:'linear-gradient(135deg,#EDE9FE,#DDD6FE,#C4B5FD)' },
  { id:'blush',    gradient:'linear-gradient(135deg,#FFF1F2,#FFE4E6,#FECDD3)' },
  { id:'sage',     gradient:'linear-gradient(135deg,#F0FDF4,#DCFCE7,#BBF7D0)' },
  { id:'slate',    gradient:'linear-gradient(135deg,#F8FAFC,#F1F5F9,#E2E8F0)' },
  { id:'sand',     gradient:'linear-gradient(135deg,#FDFAF6,#F5EFE0,#EDE3CC)' },
];

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
  coverStyle: 'sand',
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || '?';
}
function formatJoinDate(d: string) {
  try { return new Date(d).toLocaleDateString('en-US',{month:'long',year:'numeric'}); } catch { return ''; }
}

const TABS = ['Posts','Notebook','Badges','Collections','Circles'];

const BADGES = [
  { emoji:'🌍', label:'Pioneer',         color:'#D97706', rarity:'Legendary', desc:'Early OWF member'          },
  { emoji:'✨', label:'First Post',      color:'#059669', rarity:'Common',    desc:'Published your first post'  },
  { emoji:'🔥', label:'Streak ×7',      color:'#EA580C', rarity:'Rare',      desc:'7-day posting streak'       },
  { emoji:'💬', label:'Conversationalist',color:'#2563EB',rarity:'Uncommon',  desc:'50 comments made'           },
  { emoji:'🏆', label:'Community Fav',  color:'#7C3AED', rarity:'Rare',      desc:'Post liked by 100+ people'  },
  { emoji:'🗺️', label:'Globe Trotter',  color:'#0891B2', rarity:'Epic',      desc:'Posted from 3+ cities'      },
];

const LOCKED_BADGES = [
  { emoji:'📖', label:'Storyteller',  desc:'Complete first Notebook chapter' },
  { emoji:'🌐', label:'Global Voice', desc:'Followers from 5+ countries'     },
  { emoji:'🎯', label:'Streak ×30',   desc:'30-day posting streak'           },
];

const BOOKMARKS = ['Hope','Wanderlust','Gratitude','Curiosity','Pride'];

export default function ProfilePage() {
  const [profile, setProfile]   = useState<Profile>(DEFAULT_PROFILE);
  const [draft, setDraft]       = useState<Profile>(DEFAULT_PROFILE);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadProfile(); }, []);

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    if (panelOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [panelOpen]);

  async function loadProfile() {
    try {
      const snap = await getDoc(doc(db,'users',GUEST_ID));
      if (snap.exists()) setProfile({ ...DEFAULT_PROFILE, ...snap.data() as Profile });
    } catch {}
    setLoading(false);
  }

  function startEdit() { setDraft({...profile}); setEditing(true); setSaved(false); }

  async function saveProfile() {
    setSaving(true);
    try {
      await setDoc(doc(db,'users',GUEST_ID), draft, { merge:true });
      setProfile({...draft});
      setSaved(true);
      setTimeout(() => { setEditing(false); setSaved(false); }, 900);
    } catch {}
    setSaving(false);
  }

  function toggleLanguage(lang: string) {
    setDraft(p => ({
      ...p,
      languages: p.languages.includes(lang)
        ? p.languages.filter(l => l !== lang)
        : [...p.languages, lang],
    }));
  }

  const cover = COVER_STYLES.find(c => c.id === (editing ? draft.coverStyle : profile.coverStyle)) || COVER_STYLES[7];
  const accent = editing ? draft.accentColor : profile.accentColor;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background:'#FDFAF6' }}>
      <div className="text-sm animate-pulse" style={{ color:'#A89880' }}>Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 relative" style={{ background:'#FDFAF6', fontFamily:'Georgia, serif' }}>

      {/* ── COVER BAND ─────────────────────────────────────── */}
      <div className="h-36 md:h-44 w-full relative transition-all duration-500" style={{ background: cover.gradient }}>
        {editing && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {COVER_STYLES.map(cs => (
              <button key={cs.id} onClick={() => setDraft(p => ({...p, coverStyle:cs.id}))}
                className="w-6 h-6 rounded-full border-2 transition-all hover:scale-125"
                style={{ background:cs.gradient, borderColor: draft.coverStyle===cs.id ? '#1A1410':'rgba(255,255,255,0.4)' }}/>
            ))}
          </div>
        )}
      </div>

      {/* ── MAIN LAYOUT ────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-6">

        {/* ── IDENTITY ROW ───────────────────────────────────── */}
        <div className="flex items-start gap-5 -mt-10 mb-6 relative">

          {/* Avatar */}
          <div className="flex-shrink-0 relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-white shadow-lg
                            flex items-center justify-center text-white font-black text-xl transition-all"
              style={{ backgroundColor: accent, boxShadow:`0 8px 32px ${accent}40` }}>
              {getInitials(editing ? draft.displayName : profile.displayName)}
            </div>
            {editing && (
              <div className="absolute -bottom-3 left-0 flex gap-1 flex-wrap" style={{width:'96px'}}>
                {ACCENT_COLORS.map(c => (
                  <button key={c} onClick={() => setDraft(p => ({...p, accentColor:c}))}
                    className="w-4 h-4 rounded-full transition-all hover:scale-125"
                    style={{ backgroundColor:c, border: draft.accentColor===c ? '2px solid #1A1410':'2px solid transparent' }}/>
                ))}
              </div>
            )}
          </div>

          {/* Name + handle + meta */}
          <div className="flex-1 min-w-0 pt-10 md:pt-12">
            {editing ? (
              <div className="space-y-2">
                <input value={draft.displayName}
                  onChange={e => setDraft(p => ({...p, displayName:e.target.value}))}
                  className="text-2xl font-black bg-transparent border-b-2 focus:outline-none w-full pb-1"
                  style={{ borderColor:accent, color:'#1A1410', fontFamily:'Georgia,serif' }}
                  placeholder="Your name"/>
                <div className="flex items-center gap-1">
                  <input value={draft.handle.replace('.feed','')}
                    onChange={e => setDraft(p => ({...p, handle:e.target.value.replace(/[\s.]/g,'').toLowerCase()+'.feed'}))}
                    className="text-sm bg-transparent border-b focus:outline-none"
                    style={{ borderColor:'#E8E0D5', color: accent, width:'150px' }}/>
                  <span className="text-sm font-semibold" style={{ color:accent }}>.feed</span>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl md:text-3xl font-black leading-tight" style={{ color:'#1A1410', fontFamily:'Georgia,serif' }}>
                  {profile.displayName}
                </h1>
                <p className="text-sm font-semibold mt-0.5" style={{ color: accent }}>{profile.handle}</p>
                {(profile.city||profile.country) && (
                  <p className="text-sm mt-1" style={{ color:'#7A6E65' }}>
                    📍 {[profile.city,profile.country].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Edit / Save */}
          <div className="flex gap-2 pt-11 flex-shrink-0">
            {!editing ? (
              <button onClick={startEdit}
                className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
                style={{ backgroundColor:accent+'18', border:`1px solid ${accent}40`, color:accent }}>
                ✏️ Edit
              </button>
            ) : (
              <>
                <button onClick={() => setEditing(false)}
                  className="text-xs font-bold px-3 py-2 rounded-full"
                  style={{ backgroundColor:'#F5F0E8', color:'#7A6E65', border:'1px solid #E8E0D5' }}>
                  Cancel
                </button>
                <button onClick={saveProfile} disabled={saving}
                  className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
                  style={{ backgroundColor: saved ? '#16A34A' : accent, color:'#fff' }}>
                  {saved ? '✓ Saved' : saving ? '...' : 'Save'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── BIO + META ──────────────────────────────────── */}
        {editing ? (
          <div className="space-y-3 mb-6 p-4 rounded-2xl" style={{ backgroundColor:'#F5F0E8', border:'1px solid #E8E0D5' }}>
            <div className="relative">
              <textarea value={draft.bio}
                onChange={e => e.target.value.length<=160 && setDraft(p => ({...p,bio:e.target.value}))}
                placeholder="Write a short bio..."
                rows={3}
                className="w-full text-sm bg-white rounded-xl px-3 py-2 resize-none focus:outline-none"
                style={{ border:'1px solid #E8E0D5', color:'#1A1410', fontFamily:'Georgia,serif' }}/>
              <span className="absolute bottom-3 right-3 text-[10px]" style={{ color:'#C8BAA8' }}>{160-draft.bio.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[['city','City'],['country','Country'],['website','Website (optional)'],['pronouns','']].map(([field,placeholder]) =>
                field === 'pronouns' ? (
                  <select key={field} value={draft.pronouns}
                    onChange={e => setDraft(p => ({...p,pronouns:e.target.value}))}
                    className="text-xs px-3 py-2 rounded-xl focus:outline-none bg-white"
                    style={{ border:'1px solid #E8E0D5', color:'#1A1410' }}>
                    <option value="">Pronouns (optional)</option>
                    {PRONOUNS.map(pr => <option key={pr} value={pr}>{pr}</option>)}
                  </select>
                ) : (
                  <input key={field} value={(draft as Record<string,unknown>)[field] as string}
                    onChange={e => setDraft(p => ({...p,[field]:e.target.value}))}
                    placeholder={placeholder}
                    className="text-xs px-3 py-2 rounded-xl focus:outline-none bg-white"
                    style={{ border:'1px solid #E8E0D5', color:'#1A1410' }}/>
                )
              )}
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest mb-2" style={{ color:'#A89880' }}>LANGUAGES</p>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map(lang => (
                  <button key={lang} onClick={() => toggleLanguage(lang)}
                    className="text-xs px-2.5 py-1 rounded-full transition-all hover:scale-105"
                    style={{
                      backgroundColor: draft.languages.includes(lang) ? accent+'20' : '#fff',
                      border:`1px solid ${draft.languages.includes(lang) ? accent : '#E8E0D5'}`,
                      color: draft.languages.includes(lang) ? accent : '#7A6E65',
                    }}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-5 space-y-2">
            {profile.bio && (
              <p className="text-sm leading-relaxed" style={{ color:'#3D3530', fontFamily:'Georgia,serif', maxWidth:'560px' }}>
                {profile.bio}
              </p>
            )}
            <div className="flex flex-wrap gap-3 text-xs" style={{ color:'#7A6E65' }}>
              {profile.pronouns && (
                <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor:'#F5F0E8', border:'1px solid #E8E0D5' }}>{profile.pronouns}</span>
              )}
              {profile.languages.length > 0 && <span>🌐 {profile.languages.join(' · ')}</span>}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer"
                  className="font-semibold hover:underline" style={{ color:accent }}>
                  🔗 {profile.website.replace(/^https?:\/\//,'')}
                </a>
              )}
              <span style={{ color:'#C8BAA8' }}>Joined {formatJoinDate(profile.joinDate)}</span>
            </div>
          </div>
        )}

        {/* ── STATS ROW ──────────────────────────────────── */}
        {!editing && (
          <div className="flex gap-6 mb-6 pb-4" style={{ borderBottom:'1px solid #E8E0D5' }}>
            {[['12','Posts'],['0','Followers'],['0','Following'],['0','Notebooks']].map(([n,l]) => (
              <div key={l}>
                <span className="text-lg font-black" style={{ color:'#1A1410', fontFamily:'Georgia,serif' }}>{n}</span>
                <span className="text-xs font-semibold ml-1.5" style={{ color:'#A89880' }}>{l}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── TABS + CONTENT + FLOATING PANEL ─────────────── */}
        {!editing && (
          <div className="flex gap-6 relative">

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Tab bar */}
              <div className="flex gap-0 mb-6 overflow-x-auto scrollbar-hide"
                style={{ borderBottom:'1px solid #E8E0D5' }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
                    className="px-4 py-2.5 text-sm whitespace-nowrap flex-shrink-0 transition-all"
                    style={{
                      fontFamily:'Georgia,serif',
                      fontWeight: activeTab===tab.toLowerCase() ? 700 : 400,
                      color: activeTab===tab.toLowerCase() ? accent : '#A89880',
                      borderBottom: activeTab===tab.toLowerCase() ? `2px solid ${accent}` : '2px solid transparent',
                    }}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Posts */}
              {activeTab==='posts' && (
                <div className="text-center py-16 rounded-3xl" style={{ border:'2px dashed #E8E0D5' }}>
                  <span className="text-4xl block mb-3">✍️</span>
                  <p className="font-black mb-1" style={{ color:'#1A1410', fontFamily:'Georgia,serif' }}>No posts yet</p>
                  <p className="text-sm" style={{ color:'#A89880' }}>Your published posts will appear here</p>
                </div>
              )}

              {/* Notebook */}
              {activeTab==='notebook' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-black tracking-widest" style={{ color:'#A89880' }}>YOUR CHAPTERS</p>
                    <button className="text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition-all"
                      style={{ backgroundColor:accent, color:'#fff' }}>+ New Chapter</button>
                  </div>
                  <div className="rounded-3xl py-16 flex flex-col items-center text-center"
                    style={{ background:'linear-gradient(135deg,#FFFBF0,#FFF3CD)', border:'2px dashed #E8E0D5' }}>
                    <span className="text-5xl mb-4">📖</span>
                    <p className="text-base font-black mb-2" style={{ color:'#1A1410', fontFamily:'Georgia,serif' }}>Your story begins here</p>
                    <p className="text-sm mb-6 max-w-xs" style={{ color:'#7A6E65' }}>
                      A chapter is a curated story — up to 10 photos + 1 video, with a title, mood, and your words.
                    </p>
                    <button className="text-sm font-bold px-6 py-3 rounded-full hover:scale-105 transition-all"
                      style={{ backgroundColor:accent, color:'#fff' }}>Create First Chapter</button>
                  </div>
                </div>
              )}

              {/* Badges */}
              {activeTab==='badges' && (
                <div>
                  <p className="text-xs font-black tracking-widest mb-4" style={{ color:'#A89880' }}>EARNED</p>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {BADGES.map(b => (
                      <div key={b.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl cursor-pointer hover:scale-105 transition-all"
                        style={{ backgroundColor:b.color+'10', border:`1px solid ${b.color}25`, boxShadow:`0 4px 16px ${b.color}12` }}>
                        <span className="text-3xl">{b.emoji}</span>
                        <span className="text-xs font-black text-center leading-tight" style={{ color:b.color }}>{b.label}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor:b.color+'20', color:b.color }}>{b.rarity}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-black tracking-widest mb-3" style={{ color:'#C8BAA8' }}>LOCKED</p>
                  <div className="grid grid-cols-3 gap-3">
                    {LOCKED_BADGES.map(b => (
                      <div key={b.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl"
                        style={{ backgroundColor:'#F5F0E8', border:'1px dashed #E8E0D5', opacity:0.6 }}>
                        <span className="text-3xl grayscale">{b.emoji}</span>
                        <span className="text-xs font-black text-center" style={{ color:'#C8BAA8' }}>{b.label}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor:'#E8E0D5', color:'#C8BAA8' }}>Locked</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collections */}
              {activeTab==='collections' && (
                <div className="text-center py-16 rounded-3xl" style={{ border:'2px dashed #E8E0D5' }}>
                  <span className="text-4xl block mb-3">📚</span>
                  <p className="font-black mb-1" style={{ color:'#1A1410', fontFamily:'Georgia,serif' }}>No collections yet</p>
                  <p className="text-sm" style={{ color:'#A89880' }}>Save posts and moments to build your library</p>
                </div>
              )}

              {/* Circles */}
              {activeTab==='circles' && (
                <div className="text-center py-16 rounded-3xl" style={{ border:'2px dashed #E8E0D5' }}>
                  <span className="text-4xl block mb-3">👥</span>
                  <p className="font-black mb-1" style={{ color:'#1A1410', fontFamily:'Georgia,serif' }}>Your circles are empty</p>
                  <p className="text-sm" style={{ color:'#A89880' }}>Follow people to build your circles</p>
                </div>
              )}
            </div>

            {/* ── FLOATING COLLAPSIBLE PANEL ──────────────── */}
            <div ref={panelRef} className="flex-shrink-0 hidden md:block" style={{ width:'220px' }}>
              <div className="sticky top-6">
                {/* Toggle pill */}
                <button onClick={() => setPanelOpen(p => !p)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl mb-2 transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: panelOpen ? accent : '#F5F0E8', border:`1px solid ${panelOpen ? accent+'40' : '#E8E0D5'}`, color: panelOpen ? '#fff' : '#7A6E65' }}>
                  <span className="text-xs font-bold">📌 Profile Info</span>
                  <span className="text-xs">{panelOpen ? '▲' : '▼'}</span>
                </button>

                {/* Expandable content */}
                {panelOpen && (
                  <div className="rounded-2xl overflow-hidden transition-all"
                    style={{ backgroundColor:'#fff', border:'1px solid #E8E0D5', boxShadow:'0 8px 32px rgba(0,0,0,0.06)' }}>

                    {/* Emotional Bookmarks */}
                    <div className="px-4 pt-4 pb-3" style={{ borderBottom:'1px solid #F5F0E8' }}>
                      <p className="text-[10px] font-black tracking-widest mb-3" style={{ color:'#A89880' }}>🔖 EMOTIONAL BOOKMARKS</p>
                      <div className="space-y-1.5">
                        {BOOKMARKS.map(bm => (
                          <div key={bm} className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer hover:scale-[1.02] transition-all"
                            style={{ backgroundColor:'#F5F0E8', color:'#3D3530', border:'1px solid #E8E0D5' }}>
                            {bm}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top badges */}
                    <div className="px-4 pt-3 pb-3" style={{ borderBottom:'1px solid #F5F0E8' }}>
                      <p className="text-[10px] font-black tracking-widest mb-3" style={{ color:'#A89880' }}>🏅 TOP BADGES</p>
                      <div className="flex gap-2">
                        {BADGES.slice(0,3).map(b => (
                          <div key={b.label} title={b.label}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl cursor-pointer hover:scale-110 transition-all"
                            style={{ backgroundColor:b.color+'15', border:`1px solid ${b.color}25` }}>
                            {b.emoji}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* City / time */}
                    {profile.city && (
                      <div className="px-4 pt-3 pb-4">
                        <p className="text-[10px] font-black tracking-widest mb-2" style={{ color:'#A89880' }}>📍 LOCATION</p>
                        <p className="text-sm font-bold" style={{ color:'#1A1410' }}>{profile.city}</p>
                        {profile.country && <p className="text-xs" style={{ color:'#A89880' }}>{profile.country}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
