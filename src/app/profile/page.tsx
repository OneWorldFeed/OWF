'use client';
import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GUEST_ID = 'guest_preview';
const LANGUAGES = ['English','French','Arabic','Spanish','Portuguese','Swahili','Yoruba','Mandarin','Hindi','Japanese'];
const PRONOUNS = ['he/him','she/her','they/them','he/they','she/they','any/all'];
const ACCENT_COLORS = ['#D97706','#E8650A','#CC0022','#0284C7','#1B5E20','#7C3AED','#00DCBE','#DB2777'];

const COVER_GRADIENTS = [
  { id:'dawn',     gradient:'linear-gradient(160deg,#FEE4C0,#FEC89A,#C9B8FF)' },
  { id:'noon',     gradient:'linear-gradient(160deg,#BAE6FD,#E0F2FE,#FEF9C3)' },
  { id:'golden',   gradient:'linear-gradient(160deg,#FEF3C7,#FDE68A,#FDBA74)' },
  { id:'dusk',     gradient:'linear-gradient(160deg,#DDD6FE,#C4B5FD,#FCA5A5)' },
  { id:'blush',    gradient:'linear-gradient(160deg,#FFE4E6,#FECDD3,#FED7AA)' },
  { id:'sage',     gradient:'linear-gradient(160deg,#DCFCE7,#BBF7D0,#BAE6FD)' },
  { id:'sand',     gradient:'linear-gradient(160deg,#FDF6EC,#F5EFE0,#EDE3CC)' },
  { id:'twilight', gradient:'linear-gradient(160deg,#E0E7FF,#C7D2FE,#FDE68A)' },
];

function getClockGradient(h:number){
  if(h>=5&&h<8)   return {bg:'linear-gradient(160deg,#F97316,#FB923C,#FCD34D)',text:'#fff',sub:'rgba(255,255,255,0.8)'};
  if(h>=8&&h<12)  return {bg:'linear-gradient(160deg,#0EA5E9,#38BDF8,#7DD3FC)',text:'#fff',sub:'rgba(255,255,255,0.8)'};
  if(h>=12&&h<16) return {bg:'linear-gradient(160deg,#F59E0B,#FBBF24,#FDE68A)',text:'#fff',sub:'rgba(255,255,255,0.85)'};
  if(h>=16&&h<19) return {bg:'linear-gradient(160deg,#EA580C,#F97316,#FB923C)',text:'#fff',sub:'rgba(255,255,255,0.8)'};
  if(h>=19&&h<21) return {bg:'linear-gradient(160deg,#6D28D9,#7C3AED,#A78BFA)',text:'#fff',sub:'rgba(255,255,255,0.75)'};
  return {bg:'linear-gradient(160deg,#0F172A,#1E3A5F,#1E293B)',text:'#fff',sub:'rgba(255,255,255,0.6)'};
}
function getClockIcon(h:number){ return h>=5&&h<8?'🌅':h>=8&&h<18?'☀️':h>=18&&h<21?'🌇':'🌙'; }

const CLOCK_CITIES = [
  {name:'New York', tz:'America/New_York'},
  {name:'Tokyo',    tz:'Asia/Tokyo'},
  {name:'Nairobi',  tz:'Africa/Nairobi'},
];

const CIRCLES = [
  {name:'Family',   color:'#34D399', icon:'😊'},
  {name:'Friends',  color:'#60A5FA', icon:'😄'},
  {name:'Creative', color:'#A78BFA', icon:'🎨'},
  {name:'Work',     color:'#64748B', icon:'💼'},
];

const COLLECTIONS = ['Amsterdam','City Views','🎵 NHK','Street Food','Portraits'];

const BADGES = [
  {emoji:'🌍', label:'Pioneer',          color:'#D97706', rarity:'Legendary', shimmer:true },
  {emoji:'✨', label:'First Post',       color:'#059669', rarity:'Common',    shimmer:false},
  {emoji:'🔥', label:'Streak ×7',       color:'#EA580C', rarity:'Rare',      shimmer:true },
  {emoji:'💬', label:'Conversationalist',color:'#2563EB', rarity:'Uncommon',  shimmer:false},
  {emoji:'🏆', label:'Community Fav',   color:'#7C3AED', rarity:'Rare',      shimmer:true },
  {emoji:'🗺️', label:'Globe Trotter',   color:'#0891B2', rarity:'Epic',      shimmer:true },
];
const LOCKED = [
  {emoji:'📖', label:'Storyteller'},
  {emoji:'🌐', label:'Global Voice'},
  {emoji:'🎯', label:'Streak ×30'},
];

interface Profile {
  displayName:string; handle:string; bio:string; city:string; country:string;
  pronouns:string; languages:string[]; website:string; joinDate:string;
  accentColor:string; coverStyle:string; coverImage:string;
  handleChangedAt:string;
}
const DEFAULT:Profile = {
  displayName:'Your Name', handle:'yourhandle.feed', bio:'', city:'', country:'',
  pronouns:'', languages:[], website:'', joinDate:new Date().toISOString().split('T')[0],
  accentColor:'#D97706', coverStyle:'sand', coverImage:'', handleChangedAt:'',
};

function initials(n:string){ return n.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2)||'?'; }
function joinedStr(d:string){ try{ return new Date(d).toLocaleDateString('en-US',{month:'long',year:'numeric'}); }catch{ return ''; } }
function canChangeHandle(changedAt:string):boolean {
  if(!changedAt) return true;
  const diff = Date.now() - new Date(changedAt).getTime();
  return diff > 365*24*60*60*1000;
}

const TABS = ['Overview','Posts','Notebook','Badges','Collections','Circles'];

export default function ProfilePage() {
  const [profile, setProfile]     = useState<Profile>(DEFAULT);
  const [draft,   setDraft]       = useState<Profile>(DEFAULT);
  const [editing, setEditing]     = useState(false);
  const [saving,  setSaving]      = useState(false);
  const [saved,   setSaved]       = useState(false);
  const [loading, setLoading]     = useState(true);
  const [tab,     setTab]         = useState('overview');
  const [clocks,  setClocks]      = useState<{name:string;time:string;hour:number}[]>([]);
  const [coverPreview, setCoverPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{ load(); },[]);
  useEffect(()=>{
    function tick(){
      const now=new Date();
      setClocks(CLOCK_CITIES.map(c=>{
        try{
          const t=now.toLocaleTimeString('en-US',{timeZone:c.tz,hour:'2-digit',minute:'2-digit',hour12:true});
          const h=parseInt(now.toLocaleTimeString('en-US',{timeZone:c.tz,hour:'numeric',hour12:false}));
          return {name:c.name,time:t,hour:isNaN(h)?0:h%24};
        }catch{ return {name:c.name,time:'--:--',hour:0}; }
      }));
    }
    tick(); const id=setInterval(tick,10000); return ()=>clearInterval(id);
  },[]);

  async function load(){
    try{ const s=await getDoc(doc(db,'users',GUEST_ID)); if(s.exists()) setProfile({...DEFAULT,...s.data() as Profile}); }catch{}
    setLoading(false);
  }
  function startEdit(){ setDraft({...profile}); setCoverPreview(profile.coverImage||''); setEditing(true); setSaved(false); }
  async function save(){
    setSaving(true);
    try{
      const toSave = {...draft, coverImage: coverPreview};
      if(draft.handle !== profile.handle) toSave.handleChangedAt = new Date().toISOString();
      await setDoc(doc(db,'users',GUEST_ID),toSave,{merge:true});
      setProfile(toSave); setSaved(true);
      setTimeout(()=>{ setEditing(false); setSaved(false); },900);
    }catch{}
    setSaving(false);
  }
  function handleCoverFile(e:React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{ if(ev.target?.result) setCoverPreview(ev.target.result as string); };
    r.readAsDataURL(f);
  }
  function toggleLang(l:string){ setDraft(p=>({...p,languages:p.languages.includes(l)?p.languages.filter(x=>x!==l):[...p.languages,l]})); }

  const accent = editing ? draft.accentColor : profile.accentColor;
  const coverGrad = COVER_GRADIENTS.find(c=>c.id===(editing?draft.coverStyle:profile.coverStyle))||COVER_GRADIENTS[6];
  const coverBg = (editing ? coverPreview : profile.coverImage) || coverGrad.gradient;
  const isCoverImage = !!(editing ? coverPreview : profile.coverImage);

  if(loading) return <div className="flex items-center justify-center min-h-screen" style={{background:'#F5EFE6'}}><div className="text-sm animate-pulse" style={{color:'#A89880'}}>Loading...</div></div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .profile-root { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-badge {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
          position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .float { animation: float 3s ease-in-out infinite; }
        .glass {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.6);
        }
        .glass-dark {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.45);
        }
        .cover-overlay {
          background: linear-gradient(to bottom, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.35) 100%);
        }
        .clock-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .clock-card:hover { transform: scale(1.03); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
      `}</style>

      <div className="profile-root min-h-screen pb-24" style={{background:'linear-gradient(160deg,#F5EFE6 0%,#EDE8DE 100%)'}}>

        {/* ── COVER ──────────────────────────────────────── */}
        <div className="relative h-52 md:h-64 overflow-hidden"
          style={{
            background: isCoverImage ? `url(${coverBg}) center/cover no-repeat` : coverBg,
          }}>
          {/* cinematic overlay */}
          <div className="cover-overlay absolute inset-0 z-10"/>
          {/* OWF Earth mascot */}
          <div className="absolute top-5 left-5 z-20 float">
            <div className="w-14 h-14 rounded-full glass flex items-center justify-center text-2xl shadow-lg select-none">🌍</div>
          </div>
          {/* cover controls in edit mode */}
          {editing && (
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              {COVER_GRADIENTS.map(cg=>(
                <button key={cg.id} onClick={()=>{ setDraft(p=>({...p,coverStyle:cg.id})); setCoverPreview(''); }}
                  className="w-7 h-7 rounded-full border-2 transition-all hover:scale-125 shadow"
                  style={{background:cg.gradient, borderColor: !coverPreview && draft.coverStyle===cg.id?'#fff':'rgba(255,255,255,0.3)'}}/>
              ))}
              <button onClick={()=>fileRef.current?.click()}
                className="text-xs font-bold px-3 py-1.5 rounded-full shadow transition-all hover:scale-105"
                style={{backgroundColor:'rgba(255,255,255,0.9)',color:'#3D3530'}}>
                📷 Upload
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFile}/>
            </div>
          )}
        </div>

        {/* ── PAGE BODY ──────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex gap-5 items-start">

            {/* ── LEFT MAIN ─────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* IDENTITY CARD */}
              <div className="relative -mt-8 mb-6">
                <div className="rounded-3xl p-6 shadow-xl" style={{background:'rgba(255,255,255,0.82)',backdropFilter:'blur(24px) saturate(180%)',WebkitBackdropFilter:'blur(24px) saturate(180%)',border:'1px solid rgba(255,255,255,0.7)',boxShadow:'0 8px 40px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset'}}>
                  <div className="flex items-start gap-5">

                    {/* Avatar */}
                    <div className="flex-shrink-0 -mt-14">
                      <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center text-white font-black text-2xl serif transition-all"
                        style={{backgroundColor:accent,boxShadow:`0 12px 40px ${accent}60, 0 0 0 4px white`}}>
                        {initials(editing?draft.displayName:profile.displayName)}
                      </div>
                      {editing && (
                        <div className="flex gap-1 flex-wrap mt-2.5" style={{width:'96px'}}>
                          {ACCENT_COLORS.map(c=>(
                            <button key={c} onClick={()=>setDraft(p=>({...p,accentColor:c}))}
                              className="w-5 h-5 rounded-full transition-all hover:scale-125 shadow-sm"
                              style={{backgroundColor:c, outline: draft.accentColor===c?`3px solid ${c}`:'3px solid transparent', outlineOffset:'2px'}}/>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      {editing ? (
                        <div className="space-y-2">
                          <input value={draft.displayName} onChange={e=>setDraft(p=>({...p,displayName:e.target.value}))}
                            className="serif text-3xl font-black bg-transparent border-b-2 focus:outline-none w-full pb-1"
                            style={{borderColor:accent,color:'#1A1410'}} placeholder="Your name"/>
                          <div className="flex items-center gap-1.5">
                            {canChangeHandle(profile.handleChangedAt) ? (
                              <>
                                <input value={draft.handle.replace('.feed','')}
                                  onChange={e=>setDraft(p=>({...p,handle:e.target.value.replace(/[\s.]/g,'').toLowerCase()+'.feed'}))}
                                  className="text-sm bg-transparent border-b focus:outline-none"
                                  style={{borderColor:'#E8E0D5',color:accent,width:'140px'}}/>
                                <span className="text-sm font-semibold" style={{color:accent}}>.feed</span>
                              </>
                            ) : (
                              <div>
                                <span className="text-sm font-semibold" style={{color:accent}}>{profile.handle}</span>
                                <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full" style={{backgroundColor:'#F5F0E8',color:'#A89880'}}>Handle locked — changes once/year</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h1 className="serif text-3xl font-black leading-tight" style={{color:'#1A1410'}}>{profile.displayName}</h1>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {clocks[0] && <span className="text-sm font-medium" style={{color:'#7A6E65'}} suppressHydrationWarning>{clocks[0].time}</span>}
                            {(profile.city||profile.country) && <span className="text-sm" style={{color:'#7A6E65'}}>📍 {[profile.city,profile.country].filter(Boolean).join(', ')}</span>}
                          </div>
                          <p className="text-sm font-semibold mt-1" style={{color:accent}}>{profile.handle}</p>
                          {profile.bio && <p className="text-sm leading-relaxed mt-2 max-w-lg" style={{color:'#3D3530',fontFamily:"'DM Sans',sans-serif"}}>{profile.bio}</p>}
                          <div className="flex flex-wrap gap-2 mt-2 text-xs" style={{color:'#7A6E65'}}>
                            {profile.pronouns && <span className="px-2.5 py-0.5 rounded-full" style={{backgroundColor:'rgba(0,0,0,0.05)',border:'1px solid rgba(0,0,0,0.08)'}}>{profile.pronouns}</span>}
                            {profile.languages.length>0 && <span>🌐 {profile.languages.join(' · ')}</span>}
                            {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{color:accent}}>🔗 {profile.website.replace(/^https?:\/\//, '')}</a>}
                            <span style={{color:'#C8BAA8'}}>Joined {joinedStr(profile.joinDate)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Edit / Save */}
                    <div className="flex-shrink-0">
                      {!editing ? (
                        <button onClick={startEdit} className="text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105 shadow-sm"
                          style={{backgroundColor:'#fff',border:'1.5px solid #E8E0D5',color:'#3D3530',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={()=>setEditing(false)} className="text-sm font-semibold px-4 py-2 rounded-full"
                            style={{backgroundColor:'#F5F0E8',color:'#7A6E65'}}>Cancel</button>
                          <button onClick={save} disabled={saving} className="text-sm font-bold px-5 py-2 rounded-full transition-all hover:scale-105 shadow"
                            style={{backgroundColor:saved?'#16A34A':accent,color:'#fff',boxShadow:`0 4px 16px ${accent}50`}}>
                            {saved?'✓ Saved':saving?'...':'Save'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EDIT FORM */}
                  {editing && (
                    <div className="mt-5 pt-5 space-y-4" style={{borderTop:'1px solid rgba(0,0,0,0.07)'}}>
                      <div className="relative">
                        <textarea value={draft.bio} onChange={e=>e.target.value.length<=160&&setDraft(p=>({...p,bio:e.target.value}))}
                          placeholder="Write a short bio..." rows={3}
                          className="w-full text-sm rounded-2xl px-4 py-3 resize-none focus:outline-none transition-all"
                          style={{backgroundColor:'#F9F6F0',border:'1.5px solid #E8E0D5',color:'#1A1410',fontFamily:"'DM Sans',sans-serif"}}/>
                        <span className="absolute bottom-3.5 right-4 text-[11px]" style={{color:'#C8BAA8'}}>{160-draft.bio.length}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(['city','country','website'] as const).map(f=>(
                          <input key={f} value={draft[f]} onChange={e=>setDraft(p=>({...p,[f]:e.target.value}))}
                            placeholder={f.charAt(0).toUpperCase()+f.slice(1)}
                            className="text-sm px-4 py-2.5 rounded-2xl focus:outline-none"
                            style={{backgroundColor:'#F9F6F0',border:'1.5px solid #E8E0D5',color:'#1A1410'}}/>
                        ))}
                        <select value={draft.pronouns} onChange={e=>setDraft(p=>({...p,pronouns:e.target.value}))}
                          className="text-sm px-4 py-2.5 rounded-2xl focus:outline-none"
                          style={{backgroundColor:'#F9F6F0',border:'1.5px solid #E8E0D5',color:'#1A1410'}}>
                          <option value="">Pronouns (optional)</option>
                          {PRONOUNS.map(pr=><option key={pr} value={pr}>{pr}</option>)}
                        </select>
                      </div>
                      <div>
                        <p className="text-[11px] font-black tracking-widest mb-2.5" style={{color:'#B8A898'}}>LANGUAGES</p>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map(l=>(
                            <button key={l} onClick={()=>toggleLang(l)}
                              className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
                              style={{backgroundColor:draft.languages.includes(l)?accent+'18':'#F9F6F0',border:`1.5px solid ${draft.languages.includes(l)?accent:'#E8E0D5'}`,color:draft.languages.includes(l)?accent:'#7A6E65',fontWeight:draft.languages.includes(l)?600:400}}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STATS */}
                  {!editing && (
                    <div className="flex gap-6 mt-4 pt-4" style={{borderTop:'1px solid rgba(0,0,0,0.06)'}}>
                      {[['12','Posts'],['0','Followers'],['0','Following'],['0','Chapters']].map(([n,l])=>(
                        <div key={l} className="cursor-pointer hover:scale-105 transition-all">
                          <span className="serif text-xl font-black" style={{color:'#1A1410'}}>{n}</span>
                          <span className="text-xs font-semibold ml-1.5 tracking-wide" style={{color:'#B8A898'}}>{l.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* TABS */}
              {!editing && <>
                <div className="flex gap-0 mb-6 overflow-x-auto scrollbar-hide" style={{borderBottom:'1.5px solid rgba(0,0,0,0.08)'}}>
                  {TABS.map(t=>(
                    <button key={t} onClick={()=>setTab(t.toLowerCase())}
                      className="px-5 py-3 text-sm whitespace-nowrap flex-shrink-0 transition-all"
                      style={{fontFamily:"'DM Sans',sans-serif",fontWeight:tab===t.toLowerCase()?700:400,color:tab===t.toLowerCase()?accent:'#B8A898',borderBottom:tab===t.toLowerCase()?`2.5px solid ${accent}`:'2.5px solid transparent',letterSpacing:'0.01em'}}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* OVERVIEW */}
                {tab==='overview' && <div className="space-y-8">

                  {/* My Moments */}
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <h2 className="serif text-2xl font-black" style={{color:'#1A1410'}}>My Moments</h2>
                      <button className="text-sm font-semibold hover:underline" style={{color:accent}}>See all →</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4" style={{height:'220px'}}>
                      <div className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-lg" style={{height:'220px'}}>
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-6xl opacity-80">🏙️</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"/>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full inline-block mb-1.5"
                            style={{backgroundColor:'rgba(99,150,255,0.9)',color:'#fff',backdropFilter:'blur(8px)'}}>MOMENT</span>
                          <p className="text-white font-black text-base" style={{fontFamily:"'DM Sans',sans-serif"}}>7:15 AM</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4" style={{height:'220px'}}>
                        <div className="relative rounded-3xl overflow-hidden cursor-pointer flex-1 shadow-md">
                          <div className="w-full h-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center">
                            <span className="text-4xl">😄</span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                          <div className="absolute bottom-2.5 left-3.5">
                            <p className="text-[10px] font-black tracking-wide" style={{color:'rgba(255,255,255,0.9)'}}>YESTERDAY</p>
                          </div>
                        </div>
                        <div className="rounded-3xl p-4 cursor-pointer hover:scale-[1.02] transition-all flex-1 shadow-md flex flex-col justify-between"
                          style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.7)'}}>
                          <p className="text-sm font-semibold leading-snug" style={{color:'#1A1410',fontFamily:"'DM Sans',sans-serif"}}>Just read something inspiring! ✨</p>
                          <p className="text-[10px] font-black tracking-widest" style={{color:'#C8BAA8'}}>THU</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* My Collections */}
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <h2 className="serif text-2xl font-black" style={{color:'#1A1410'}}>My Collections</h2>
                      <button className="text-sm font-semibold hover:underline" style={{color:accent}}>See all →</button>
                    </div>
                    <div className="flex gap-2.5 flex-wrap">
                      {COLLECTIONS.map(c=>(
                        <button key={c} className="text-sm font-medium px-5 py-2 rounded-full transition-all hover:scale-105 shadow-sm"
                          style={{backgroundColor:'rgba(255,255,255,0.85)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,0.7)',color:'#3D3530',boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
                          {c}
                        </button>
                      ))}
                      <button className="text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105"
                        style={{backgroundColor:accent+'18',border:`1.5px dashed ${accent}60`,color:accent}}>
                        + New
                      </button>
                    </div>
                  </div>

                  {/* Badges preview */}
                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <h2 className="serif text-2xl font-black" style={{color:'#1A1410'}}>Badges</h2>
                      <button onClick={()=>setTab('badges')} className="text-sm font-semibold hover:underline" style={{color:accent}}>See all →</button>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {BADGES.slice(0,4).map(b=>(
                        <div key={b.label} className="relative flex flex-col items-center gap-2 p-4 rounded-3xl cursor-pointer hover:scale-105 transition-all overflow-hidden"
                          style={{backgroundColor:b.color+'14',border:`1.5px solid ${b.color}30`,boxShadow:`0 4px 20px ${b.color}20`,minWidth:'78px'}}>
                          {b.shimmer && <div className="shimmer-badge"/>}
                          <span className="text-2xl relative z-10">{b.emoji}</span>
                          <span className="text-[10px] font-black text-center leading-tight relative z-10" style={{color:b.color}}>{b.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>}

                {/* POSTS */}
                {tab==='posts' && <div className="text-center py-20 rounded-3xl glass-dark"><span className="text-5xl block mb-4">✍️</span><p className="serif text-xl font-black mb-2" style={{color:'#1A1410'}}>No posts yet</p><p className="text-sm" style={{color:'#A89880'}}>Your published posts will appear here</p></div>}

                {/* NOTEBOOK */}
                {tab==='notebook' && <div>
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-[11px] font-black tracking-widest" style={{color:'#B8A898'}}>YOUR CHAPTERS</p>
                    <button className="text-sm font-bold px-5 py-2.5 rounded-full hover:scale-105 transition-all shadow"
                      style={{backgroundColor:accent,color:'#fff',boxShadow:`0 4px 16px ${accent}50`}}>+ New Chapter</button>
                  </div>
                  <div className="rounded-3xl py-20 flex flex-col items-center text-center shadow-inner"
                    style={{background:'linear-gradient(160deg,rgba(255,251,240,0.9),rgba(255,243,205,0.8))',backdropFilter:'blur(12px)',border:'2px dashed rgba(0,0,0,0.08)'}}>
                    <span className="text-6xl mb-5">📖</span>
                    <p className="serif text-xl font-black mb-2" style={{color:'#1A1410'}}>Your story begins here</p>
                    <p className="text-sm mb-7 max-w-xs" style={{color:'#7A6E65',fontFamily:"'DM Sans',sans-serif"}}>A chapter is a curated story — up to 10 photos + 1 video, with a title, mood, and your words.</p>
                    <button className="text-sm font-bold px-7 py-3 rounded-full hover:scale-105 transition-all shadow-lg"
                      style={{backgroundColor:accent,color:'#fff',boxShadow:`0 6px 24px ${accent}55`}}>Create First Chapter</button>
                  </div>
                </div>}

                {/* BADGES */}
                {tab==='badges' && <div>
                  <p className="text-[11px] font-black tracking-widest mb-5" style={{color:'#B8A898'}}>EARNED</p>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {BADGES.map(b=>(
                      <div key={b.label} className="relative flex flex-col items-center gap-2.5 p-5 rounded-3xl cursor-pointer hover:scale-105 transition-all overflow-hidden"
                        style={{backgroundColor:b.color+'10',border:`1.5px solid ${b.color}28`,boxShadow:`0 6px 24px ${b.color}18`}}>
                        {b.shimmer && <div className="shimmer-badge"/>}
                        <span className="text-4xl relative z-10">{b.emoji}</span>
                        <span className="text-xs font-black text-center leading-tight relative z-10" style={{color:b.color}}>{b.label}</span>
                        <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full relative z-10"
                          style={{backgroundColor:b.color+'22',color:b.color}}>{b.rarity}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] font-black tracking-widest mb-4" style={{color:'#C8BAA8'}}>LOCKED</p>
                  <div className="grid grid-cols-3 gap-4">
                    {LOCKED.map(b=>(
                      <div key={b.label} className="flex flex-col items-center gap-2.5 p-5 rounded-3xl"
                        style={{backgroundColor:'rgba(255,255,255,0.5)',border:'1.5px dashed rgba(0,0,0,0.08)',opacity:0.65}}>
                        <span className="text-4xl grayscale">{b.emoji}</span>
                        <span className="text-xs font-black text-center" style={{color:'#C8BAA8'}}>{b.label}</span>
                        <span className="text-[9px] px-2.5 py-0.5 rounded-full" style={{backgroundColor:'rgba(0,0,0,0.06)',color:'#C8BAA8'}}>Locked</span>
                      </div>
                    ))}
                  </div>
                </div>}

                {/* COLLECTIONS */}
                {tab==='collections' && <div className="text-center py-20 rounded-3xl glass-dark"><span className="text-5xl block mb-4">📚</span><p className="serif text-xl font-black mb-2" style={{color:'#1A1410'}}>No collections yet</p><p className="text-sm" style={{color:'#A89880'}}>Save posts and moments to build your library</p></div>}

                {/* CIRCLES */}
                {tab==='circles' && <div>
                  <p className="text-[11px] font-black tracking-widest mb-5" style={{color:'#B8A898'}}>MY CIRCLES</p>
                  <div className="space-y-3">
                    {CIRCLES.map(c=>(
                      <div key={c.name} className="flex items-center justify-between p-4 rounded-3xl cursor-pointer hover:scale-[1.01] transition-all shadow-sm"
                        style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.7)'}}>
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                            style={{backgroundColor:c.color+'22',border:`1px solid ${c.color}30`}}>{c.icon}</div>
                          <span className="font-semibold text-sm" style={{color:'#1A1410',fontFamily:"'DM Sans',sans-serif"}}>{c.name}</span>
                        </div>
                        <span className="text-xs" style={{color:'#C8BAA8'}}>0 members →</span>
                      </div>
                    ))}
                  </div>
                </div>}
              </>}
            </div>

            {/* ── STICKY RIGHT PANEL ─────────────────────── */}
            {!editing && (
              <div className="flex-shrink-0 hidden lg:block" style={{width:'236px'}}>
                <div className="sticky top-6 space-y-4 -mt-8">

                  {/* My Circles */}
                  <div className="rounded-3xl p-5 shadow-xl" style={{background:'rgba(255,255,255,0.78)',backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.65)',boxShadow:'0 8px 32px rgba(0,0,0,0.07)'}}>
                    <p className="text-[10px] font-black tracking-widest mb-4" style={{color:'#B8A898'}}>MY CIRCLES</p>
                    <div className="space-y-2">
                      {CIRCLES.map(c=>(
                        <div key={c.name} className="flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all"
                          style={{backgroundColor:'rgba(0,0,0,0.03)'}}>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm"
                            style={{backgroundColor:c.color+'22',border:`1px solid ${c.color}25`}}>{c.icon}</div>
                          <span className="text-sm font-semibold" style={{color:'#1A1410',fontFamily:"'DM Sans',sans-serif"}}>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* My World Clock */}
                  <div className="rounded-3xl p-5 shadow-xl" style={{background:'rgba(255,255,255,0.78)',backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.65)',boxShadow:'0 8px 32px rgba(0,0,0,0.07)'}}>
                    <p className="text-[10px] font-black tracking-widest mb-4" style={{color:'#B8A898'}}>MY WORLD CLOCK</p>
                    <div className="space-y-2.5">
                      {clocks.map(city=>{
                        const {bg,sub} = getClockGradient(city.hour);
                        return (
                          <div key={city.name} className="clock-card rounded-2xl p-4 cursor-pointer shadow-md"
                            style={{background:bg,boxShadow:`0 6px 20px rgba(0,0,0,0.12)`}}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-2xl font-black text-white leading-none tracking-tight" suppressHydrationWarning
                                  style={{fontFamily:"'DM Sans',sans-serif"}}>{city.time}</p>
                                <p className="text-xs font-semibold mt-1" style={{color:sub}}>{city.name}</p>
                              </div>
                              <span className="text-2xl">{getClockIcon(city.hour)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* My Themes */}
                  <div className="rounded-3xl p-5 shadow-xl" style={{background:'rgba(255,255,255,0.78)',backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.65)',boxShadow:'0 8px 32px rgba(0,0,0,0.07)'}}>
                    <p className="text-[10px] font-black tracking-widest mb-4" style={{color:'#B8A898'}}>MY THEMES</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        {bg:'#DBEAFE',dot:'#3B82F6'},{bg:'#FEF3C7',dot:'#F97316'},
                        {bg:'#EDE9FE',dot:'#7C3AED'},{bg:'#DCFCE7',dot:'#16A34A'},
                      ].map((sw,i)=>(
                        <div key={i} className="rounded-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all shadow-sm"
                          style={{backgroundColor:sw.bg,height:'52px',border:'1px solid rgba(255,255,255,0.8)'}}>
                          <div className="w-7 h-7 rounded-full shadow-md" style={{backgroundColor:sw.dot}}/>
                        </div>
                      ))}
                      <div className="col-span-2 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all shadow-sm"
                        style={{background:`linear-gradient(135deg,#EDE9FE,${accent}35)`,height:'44px',border:'1px solid rgba(255,255,255,0.7)'}}/>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
