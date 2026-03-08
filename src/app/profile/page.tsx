'use client';
import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GUEST_ID = 'guest_preview';
const LANGUAGES = ['English','French','Arabic','Spanish','Portuguese','Swahili','Yoruba','Mandarin','Hindi','Japanese'];
const PRONOUNS = ['he/him','she/her','they/them','he/they','she/they','any/all'];
const ACCENT_COLORS = ['#D97706','#E8650A','#CC0022','#0284C7','#1B5E20','#7C3AED','#00DCBE','#DB2777'];

const COVER_GRADIENTS = [
  { id:'dawn',     g:'linear-gradient(160deg,#FEE4C0,#FEC89A,#C9B8FF)' },
  { id:'noon',     g:'linear-gradient(160deg,#BAE6FD,#E0F2FE,#FEF9C3)' },
  { id:'golden',   g:'linear-gradient(160deg,#FEF3C7,#FDE68A,#FDBA74)' },
  { id:'dusk',     g:'linear-gradient(160deg,#DDD6FE,#C4B5FD,#FCA5A5)' },
  { id:'blush',    g:'linear-gradient(160deg,#FFE4E6,#FECDD3,#FED7AA)' },
  { id:'sage',     g:'linear-gradient(160deg,#DCFCE7,#BBF7D0,#BAE6FD)' },
  { id:'sand',     g:'linear-gradient(160deg,#FDF6EC,#F5EFE0,#EDE3CC)' },
  { id:'twilight', g:'linear-gradient(160deg,#E0E7FF,#C7D2FE,#FDE68A)' },
];

function clockStyle(h:number){ 
  if(h>=5&&h<8)   return {bg:'linear-gradient(160deg,#F97316,#FB923C,#FCD34D)',sub:'rgba(255,255,255,0.85)'};
  if(h>=8&&h<12)  return {bg:'linear-gradient(160deg,#0EA5E9,#38BDF8,#7DD3FC)',sub:'rgba(255,255,255,0.85)'};
  if(h>=12&&h<16) return {bg:'linear-gradient(160deg,#F59E0B,#FBBF24,#FDE68A)',sub:'rgba(255,255,255,0.9)'};
  if(h>=16&&h<19) return {bg:'linear-gradient(160deg,#EA580C,#F97316,#FB923C)',sub:'rgba(255,255,255,0.85)'};
  if(h>=19&&h<21) return {bg:'linear-gradient(160deg,#6D28D9,#7C3AED,#A78BFA)',sub:'rgba(255,255,255,0.75)'};
  return {bg:'linear-gradient(160deg,#0F172A,#1E3A5F,#1E293B)',sub:'rgba(255,255,255,0.6)'};
}
function clockIcon(h:number){ return h>=5&&h<8?'🌅':h>=8&&h<18?'☀️':h>=18&&h<21?'🌇':'🌙'; }

const CLOCK_CITIES = [
  {name:'New York',tz:'America/New_York'},
  {name:'Tokyo',   tz:'Asia/Tokyo'},
  {name:'Nairobi', tz:'Africa/Nairobi'},
];
const CIRCLES = [
  {name:'Family',  color:'#34D399',icon:'😊'},
  {name:'Friends', color:'#60A5FA',icon:'😄'},
  {name:'Creative',color:'#A78BFA',icon:'🎨'},
  {name:'Work',    color:'#64748B',icon:'💼'},
];
const COLLECTIONS = ['Amsterdam','City Views','🎵 NHK','Street Food','Portraits'];
const BADGES = [
  {emoji:'🌍',label:'Pioneer',          color:'#D97706',rarity:'Legendary',shimmer:true },
  {emoji:'✨',label:'First Post',       color:'#059669',rarity:'Common',   shimmer:false},
  {emoji:'🔥',label:'Streak ×7',       color:'#EA580C',rarity:'Rare',     shimmer:true },
  {emoji:'💬',label:'Conversationalist',color:'#2563EB',rarity:'Uncommon', shimmer:false},
  {emoji:'🏆',label:'Community Fav',   color:'#7C3AED',rarity:'Rare',     shimmer:true },
  {emoji:'🗺️',label:'Globe Trotter',   color:'#0891B2',rarity:'Epic',     shimmer:true },
];
const LOCKED = [
  {emoji:'📖',label:'Storyteller'},{emoji:'🌐',label:'Global Voice'},{emoji:'🎯',label:'Streak ×30'},
];

// Sample posts for public feed
const SAMPLE_POSTS = [
  {id:'1',mood:'Electric',  city:'Lagos',  time:'2h ago', text:'The energy in Lagos tonight is something else. The music never stops and neither do we. +lagos +nightlife', likes:24, comments:7},
  {id:'2',mood:'Reflective',city:'Tokyo',  time:'5h ago', text:'Cherry blossom season begins today. Every year I forget how quickly it goes. +tokyo +cherryblossoms', likes:41, comments:12, image:true},
  {id:'3',mood:'Hopeful',   city:'Berlin', time:'1d ago', text:'New chapter, new city. Berlin in spring hits different. +berlin +newbeginnings', likes:88, comments:31},
];

const MOOD_COLORS: Record<string,string> = {
  Electric:'#F59E0B', Reflective:'#6366F1', Hopeful:'#10B981',
  Curious:'#8B5CF6', Joyful:'#EF4444', Calm:'#06B6D4',
};

interface Profile {
  displayName:string; handle:string; bio:string; city:string; country:string;
  pronouns:string; languages:string[]; website:string; joinDate:string;
  accentColor:string; coverStyle:string; coverImage:string; handleChangedAt:string;
}
const DEFAULT:Profile = {
  displayName:'Your Name', handle:'yourhandle.feed', bio:'', city:'', country:'',
  pronouns:'', languages:[], website:'', joinDate:new Date().toISOString().split('T')[0],
  accentColor:'#D97706', coverStyle:'sand', coverImage:'', handleChangedAt:'',
};

function ini(n:string){ return n.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2)||'?'; }
function fmtDate(d:string){ try{ return new Date(d).toLocaleDateString('en-US',{month:'long',year:'numeric'}); }catch{ return ''; } }
function canChangeHandle(at:string){ return !at || Date.now()-new Date(at).getTime()>365*24*60*60*1000; }

const TABS = ['Posts','Notebook','Badges','Collections','Circles'];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT);
  const [draft,   setDraft]   = useState<Profile>(DEFAULT);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('posts');
  const [clocks,  setClocks]  = useState<{name:string;time:string;hour:number}[]>([]);
  const [coverPrev, setCoverPrev] = useState('');
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
  function startEdit(){ setDraft({...profile}); setCoverPrev(profile.coverImage||''); setEditing(true); setSaved(false); }
  async function save(){
    setSaving(true);
    try{
      const d={...draft,coverImage:coverPrev};
      if(draft.handle!==profile.handle) d.handleChangedAt=new Date().toISOString();
      await setDoc(doc(db,'users',GUEST_ID),d,{merge:true});
      setProfile(d); setSaved(true);
      setTimeout(()=>{ setEditing(false); setSaved(false); },900);
    }catch{}
    setSaving(false);
  }
  function onCoverFile(e:React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{ if(ev.target?.result) setCoverPrev(ev.target.result as string); };
    r.readAsDataURL(f);
  }
  function toggleLang(l:string){ setDraft(p=>({...p,languages:p.languages.includes(l)?p.languages.filter(x=>x!==l):[...p.languages,l]})); }

  const accent   = editing?draft.accentColor:profile.accentColor;
  const coverGrad= COVER_GRADIENTS.find(c=>c.id===(editing?draft.coverStyle:profile.coverStyle))||COVER_GRADIENTS[6];
  const coverBg  = (editing?coverPrev:profile.coverImage)||coverGrad.g;
  const isCoverImg = !!(editing?coverPrev:profile.coverImage);

  if(loading) return <div className="flex items-center justify-center min-h-screen" style={{background:'#F2EBE0'}}><div className="text-sm animate-pulse" style={{color:'#A89880'}}>Loading...</div></div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');
        .pr { font-family:'DM Sans',sans-serif; }
        .sf { font-family:'Playfair Display',Georgia,serif; }
        .glass { background:rgba(255,255,255,0.78); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.72); }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .shim { position:absolute;inset:0;border-radius:inherit;pointer-events:none;
          background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.45) 50%,transparent 100%);
          background-size:200% auto; animation:shimmer 2.5s linear infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .fl { animation:float 3.5s ease-in-out infinite; }
        .cc { transition:transform .2s ease,box-shadow .2s ease; }
        .cc:hover { transform:scale(1.03); }
      `}</style>

      <div className="pr min-h-screen pb-24" style={{background:'linear-gradient(170deg,#F2EBE0 0%,#EAE2D5 100%)'}}>

        {/* ── COVER BAND — pure background, no overlap ── */}
        <div className="w-full h-48 md:h-56"
          style={{
            background: isCoverImg?`url(${coverBg}) center/cover no-repeat`:coverBg,
            position:'relative',
          }}>
          {/* bottom fade so it blends into page bg */}
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'80px',
            background:'linear-gradient(to bottom, transparent, #F2EBE0)',zIndex:1}}/>
          {/* OWF mascot top-left */}
          <div className="fl absolute top-5 left-5 z-10">
            <div className="w-13 h-13 rounded-full flex items-center justify-center text-2xl shadow-lg select-none"
              style={{width:'52px',height:'52px',background:'rgba(255,255,255,0.82)',backdropFilter:'blur(12px)',border:'2px solid rgba(255,255,255,0.9)'}}>
              🌍
            </div>
          </div>
          {/* Cover controls */}
          {editing && (
            <div className="absolute bottom-10 right-4 z-20 flex gap-2 flex-wrap justify-end">
              {COVER_GRADIENTS.map(cg=>(
                <button key={cg.id} onClick={()=>{ setDraft(p=>({...p,coverStyle:cg.id})); setCoverPrev(''); }}
                  className="w-6 h-6 rounded-full border-2 transition-all hover:scale-125 shadow"
                  style={{background:cg.g,borderColor:!coverPrev&&draft.coverStyle===cg.id?'#fff':'rgba(255,255,255,0.4)'}}/>
              ))}
              <button onClick={()=>fileRef.current?.click()}
                className="text-xs font-bold px-3 py-1 rounded-full shadow"
                style={{background:'rgba(255,255,255,0.92)',color:'#3D3530'}}>
                📷 Upload photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onCoverFile}/>
            </div>
          )}
        </div>

        {/* ── PAGE BODY ─────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-2">
          <div className="flex gap-5 items-start">

            {/* ── MAIN LEFT ──────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* IDENTITY CARD — sits on page bg, no cover overlap */}
              <div className="rounded-3xl p-6 mb-5 shadow-lg"
                style={{background:'rgba(255,255,255,0.82)',backdropFilter:'blur(24px) saturate(180%)',
                  WebkitBackdropFilter:'blur(24px) saturate(180%)',
                  border:'1px solid rgba(255,255,255,0.75)',
                  boxShadow:'0 4px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)'}}>

                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-xl sf shadow-xl"
                      style={{backgroundColor:accent,boxShadow:`0 8px 32px ${accent}55,0 0 0 3px white`}}>
                      {ini(editing?draft.displayName:profile.displayName)}
                    </div>
                    {editing && (
                      <div className="flex gap-1 flex-wrap mt-2.5" style={{width:'80px'}}>
                        {ACCENT_COLORS.map(c=>(
                          <button key={c} onClick={()=>setDraft(p=>({...p,accentColor:c}))}
                            className="w-5 h-5 rounded-full transition-all hover:scale-125"
                            style={{backgroundColor:c,outline:draft.accentColor===c?`3px solid ${c}`:'3px solid transparent',outlineOffset:'2px'}}/>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Name block */}
                  <div className="flex-1 min-w-0">
                    {editing ? (
                      <div className="space-y-2">
                        <input value={draft.displayName} onChange={e=>setDraft(p=>({...p,displayName:e.target.value}))}
                          className="sf text-2xl font-black bg-transparent border-b-2 focus:outline-none w-full pb-1"
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
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold" style={{color:accent}}>{profile.handle}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{backgroundColor:'#F5F0E8',color:'#A89880'}}>Locked · changes once/year</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h1 className="sf text-2xl md:text-3xl font-black leading-tight" style={{color:'#1A1410'}}>{profile.displayName}</h1>
                        <div className="flex items-center gap-3 mt-1 flex-wrap text-sm" style={{color:'#7A6E65'}}>
                          {clocks[0] && <span suppressHydrationWarning>{clocks[0].time}</span>}
                          {(profile.city||profile.country) && <span>📍 {[profile.city,profile.country].filter(Boolean).join(', ')}</span>}
                        </div>
                        <p className="text-sm font-semibold mt-1" style={{color:accent}}>{profile.handle}</p>
                        {profile.bio && <p className="text-sm leading-relaxed mt-2 max-w-md" style={{color:'#3D3530'}}>{profile.bio}</p>}
                        <div className="flex flex-wrap gap-2 mt-2 text-xs" style={{color:'#7A6E65'}}>
                          {profile.pronouns && <span className="px-2 py-0.5 rounded-full" style={{backgroundColor:'rgba(0,0,0,0.05)'}}>{profile.pronouns}</span>}
                          {profile.languages.length>0 && <span>🌐 {profile.languages.join(' · ')}</span>}
                          {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{color:accent}}>🔗 {profile.website.replace(/^https?:\/\//,'')}</a>}
                          <span style={{color:'#C8BAA8'}}>Joined {fmtDate(profile.joinDate)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit/Save */}
                  <div className="flex-shrink-0">
                    {!editing ? (
                      <button onClick={startEdit} className="text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105"
                        style={{backgroundColor:'#fff',border:'1.5px solid #E8E0D5',color:'#3D3530',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={()=>setEditing(false)} className="text-sm font-semibold px-4 py-2 rounded-full"
                          style={{backgroundColor:'#F5F0E8',color:'#7A6E65'}}>Cancel</button>
                        <button onClick={save} disabled={saving} className="text-sm font-bold px-5 py-2 rounded-full transition-all hover:scale-105"
                          style={{backgroundColor:saved?'#16A34A':accent,color:'#fff',boxShadow:`0 4px 16px ${accent}50`}}>
                          {saved?'✓ Saved':saving?'...':'Save'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit form */}
                {editing && (
                  <div className="mt-5 pt-5 space-y-4" style={{borderTop:'1px solid rgba(0,0,0,0.07)'}}>
                    <div className="relative">
                      <textarea value={draft.bio} onChange={e=>e.target.value.length<=160&&setDraft(p=>({...p,bio:e.target.value}))}
                        placeholder="Write a short bio..." rows={3}
                        className="w-full text-sm rounded-2xl px-4 py-3 resize-none focus:outline-none"
                        style={{backgroundColor:'#F9F6F0',border:'1.5px solid #E8E0D5',color:'#1A1410'}}/>
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

                {/* Stats */}
                {!editing && (
                  <div className="flex gap-6 mt-4 pt-4" style={{borderTop:'1px solid rgba(0,0,0,0.06)'}}>
                    {[['12','Posts'],['0','Followers'],['0','Following'],['0','Chapters']].map(([n,l])=>(
                      <div key={l} className="cursor-pointer hover:scale-105 transition-all">
                        <span className="sf text-xl font-black" style={{color:'#1A1410'}}>{n}</span>
                        <span className="text-xs font-semibold ml-1.5 tracking-wide" style={{color:'#B8A898'}}>{l.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── TABS ─────────────────────────────────── */}
              {!editing && <>
                <div className="flex gap-0 mb-6 overflow-x-auto scrollbar-hide" style={{borderBottom:'1.5px solid rgba(0,0,0,0.08)'}}>
                  {TABS.map(t=>(
                    <button key={t} onClick={()=>setTab(t.toLowerCase())}
                      className="px-5 py-3 text-sm whitespace-nowrap flex-shrink-0 transition-all"
                      style={{fontWeight:tab===t.toLowerCase()?700:400,color:tab===t.toLowerCase()?accent:'#B8A898',borderBottom:tab===t.toLowerCase()?`2.5px solid ${accent}`:'2.5px solid transparent'}}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* POSTS — public profile feed */}
                {tab==='posts' && (
                  <div className="space-y-4">
                    {SAMPLE_POSTS.map(post=>{
                      const mc = MOOD_COLORS[post.mood]||accent;
                      return (
                        <div key={post.id} className="rounded-3xl p-5 shadow-sm transition-all hover:shadow-md"
                          style={{background:'rgba(255,255,255,0.82)',backdropFilter:'blur(16px)',border:`1px solid ${mc}30`,
                            boxShadow:`0 2px 16px rgba(0,0,0,0.05), 0 0 0 1px ${mc}18`}}>
                          {/* top bar */}
                          <div style={{height:'3px',borderRadius:'99px',background:`linear-gradient(90deg,${mc},${mc}00)`,marginBottom:'12px'}}/>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-sm font-black sf"
                              style={{backgroundColor:accent,boxShadow:`0 4px 12px ${accent}40`}}>
                              {ini(profile.displayName)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold" style={{color:'#1A1410'}}>{profile.displayName}</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{backgroundColor:mc+'18',color:mc}}>{post.mood}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs" style={{color:'#A89880'}}>
                                <span>{profile.handle}</span><span>·</span><span>{post.city}</span><span>·</span><span>{post.time}</span>
                              </div>
                            </div>
                          </div>
                          {post.image && (
                            <div className="rounded-2xl mb-3 overflow-hidden" style={{height:'180px',background:'linear-gradient(135deg,#BAE6FD,#7DD3FC)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                              <span className="text-5xl">🌸</span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed" style={{color:'#3D3530'}}>
                            {post.text.split(' ').map((w,i)=>
                              w.startsWith('+') ? <span key={i} className="font-semibold" style={{color:mc}}>{w} </span> : w+' '
                            )}
                          </p>
                          <div className="flex items-center gap-5 mt-4 pt-3 text-xs" style={{borderTop:`1px solid ${mc}18`,color:'#A89880'}}>
                            <button className="flex items-center gap-1.5 hover:scale-110 transition-all">♡ <span>{post.likes}</span></button>
                            <button className="flex items-center gap-1.5 hover:scale-110 transition-all">◇ <span>{post.comments}</span></button>
                            <button className="flex items-center gap-1.5 hover:scale-110 transition-all">⟳</button>
                            <button className="ml-auto hover:scale-110 transition-all">☆</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* NOTEBOOK */}
                {tab==='notebook' && (
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <p className="text-[11px] font-black tracking-widest" style={{color:'#B8A898'}}>YOUR CHAPTERS</p>
                      <button className="text-sm font-bold px-5 py-2.5 rounded-full hover:scale-105 transition-all"
                        style={{backgroundColor:accent,color:'#fff',boxShadow:`0 4px 16px ${accent}50`}}>+ New Chapter</button>
                    </div>
                    <div className="rounded-3xl py-20 flex flex-col items-center text-center"
                      style={{background:'linear-gradient(160deg,rgba(255,251,240,0.9),rgba(255,243,205,0.8))',border:'2px dashed rgba(0,0,0,0.08)'}}>
                      <span className="text-6xl mb-5">📖</span>
                      <p className="sf text-xl font-black mb-2" style={{color:'#1A1410'}}>Your story begins here</p>
                      <p className="text-sm mb-7 max-w-xs" style={{color:'#7A6E65'}}>A chapter is a curated story — up to 10 photos + 1 video, with a title, mood, and your words.</p>
                      <button className="text-sm font-bold px-7 py-3 rounded-full hover:scale-105 transition-all"
                        style={{backgroundColor:accent,color:'#fff',boxShadow:`0 6px 24px ${accent}55`}}>Create First Chapter</button>
                    </div>
                  </div>
                )}

                {/* BADGES */}
                {tab==='badges' && (
                  <div>
                    <p className="text-[11px] font-black tracking-widest mb-5" style={{color:'#B8A898'}}>EARNED</p>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {BADGES.map(b=>(
                        <div key={b.label} className="relative flex flex-col items-center gap-2.5 p-5 rounded-3xl cursor-pointer hover:scale-105 transition-all overflow-hidden"
                          style={{backgroundColor:b.color+'10',border:`1.5px solid ${b.color}28`,boxShadow:`0 6px 24px ${b.color}18`}}>
                          {b.shimmer && <div className="shim"/>}
                          <span className="text-4xl relative z-10">{b.emoji}</span>
                          <span className="text-xs font-black text-center leading-tight relative z-10" style={{color:b.color}}>{b.label}</span>
                          <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full relative z-10" style={{backgroundColor:b.color+'22',color:b.color}}>{b.rarity}</span>
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
                  </div>
                )}

                {/* COLLECTIONS */}
                {tab==='collections' && (
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <p className="text-[11px] font-black tracking-widest" style={{color:'#B8A898'}}>MY COLLECTIONS</p>
                      <button className="text-sm font-bold px-4 py-2 rounded-full hover:scale-105 transition-all"
                        style={{backgroundColor:accent+'18',border:`1.5px dashed ${accent}60`,color:accent}}>+ New</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {COLLECTIONS.map(c=>(
                        <div key={c} className="p-4 rounded-3xl cursor-pointer hover:scale-[1.02] transition-all shadow-sm flex items-center gap-3"
                          style={{background:'rgba(255,255,255,0.82)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.7)'}}>
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg" style={{backgroundColor:accent+'15'}}>📁</div>
                          <span className="font-semibold text-sm" style={{color:'#1A1410'}}>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CIRCLES */}
                {tab==='circles' && (
                  <div>
                    <p className="text-[11px] font-black tracking-widest mb-5" style={{color:'#B8A898'}}>MY CIRCLES</p>
                    <div className="space-y-3">
                      {CIRCLES.map(c=>(
                        <div key={c.name} className="flex items-center justify-between p-4 rounded-3xl cursor-pointer hover:scale-[1.01] transition-all shadow-sm"
                          style={{background:'rgba(255,255,255,0.82)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.7)'}}>
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{backgroundColor:c.color+'22',border:`1px solid ${c.color}30`}}>{c.icon}</div>
                            <span className="font-semibold text-sm" style={{color:'#1A1410'}}>{c.name}</span>
                          </div>
                          <span className="text-xs" style={{color:'#C8BAA8'}}>0 members →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>}
            </div>

            {/* ── STICKY RIGHT PANEL ─────────────────────── */}
            {!editing && (
              <div className="flex-shrink-0 hidden lg:block" style={{width:'236px'}}>
                <div className="sticky top-6 space-y-4">

                  {/* My Moments */}
                  <div className="rounded-3xl p-5 shadow-lg" style={{background:'rgba(255,255,255,0.78)',backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.7)',boxShadow:'0 8px 32px rgba(0,0,0,0.07)'}}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black tracking-widest" style={{color:'#B8A898'}}>MY MOMENTS</p>
                      <button className="text-[10px] font-semibold" style={{color:accent}}>See all</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-2xl overflow-hidden relative cursor-pointer hover:scale-105 transition-all" style={{height:'80px',background:'linear-gradient(135deg,#60A5FA,#3B82F6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <span className="text-2xl">🏙️</span>
                        <div className="absolute bottom-1.5 left-2"><span className="text-[9px] font-black text-white/90">7:15 AM</span></div>
                      </div>
                      <div className="rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all" style={{height:'80px',background:'linear-gradient(135deg,#FDE68A,#F59E0B)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <span className="text-2xl">😄</span>
                      </div>
                      <div className="col-span-2 rounded-2xl p-3 cursor-pointer hover:scale-[1.02] transition-all" style={{background:'rgba(0,0,0,0.03)',border:'1px solid rgba(0,0,0,0.06)'}}>
                        <p className="text-xs font-semibold" style={{color:'#1A1410'}}>Just read something inspiring! ✨</p>
                        <p className="text-[10px] mt-1 font-black tracking-wide" style={{color:'#C8BAA8'}}>THU</p>
                      </div>
                    </div>
                  </div>

                  {/* My Collections */}
                  <div className="rounded-3xl p-5 shadow-lg" style={{background:'rgba(255,255,255,0.78)',backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.7)',boxShadow:'0 8px 32px rgba(0,0,0,0.07)'}}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black tracking-widest" style={{color:'#B8A898'}}>MY COLLECTIONS</p>
                      <button className="text-[10px] font-semibold" style={{color:accent}}>See all</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {COLLECTIONS.slice(0,4).map(c=>(
                        <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer hover:scale-105 transition-all"
                          style={{backgroundColor:'rgba(0,0,0,0.05)',color:'#3D3530',border:'1px solid rgba(0,0,0,0.07)'}}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Badges preview */}
                  <div className="rounded-3xl p-5 shadow-lg" style={{background:'rgba(255,255,255,0.78)',backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.7)',boxShadow:'0 8px 32px rgba(0,0,0,0.07)'}}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black tracking-widest" style={{color:'#B8A898'}}>BADGES</p>
                      <button onClick={()=>setTab('badges')} className="text-[10px] font-semibold" style={{color:accent}}>See all</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {BADGES.slice(0,3).map(b=>(
                        <div key={b.label} className="relative flex flex-col items-center gap-1 p-2.5 rounded-2xl overflow-hidden cursor-pointer hover:scale-110 transition-all"
                          style={{backgroundColor:b.color+'12',border:`1px solid ${b.color}25`}}>
                          {b.shimmer && <div className="shim"/>}
                          <span className="text-2xl relative z-10">{b.emoji}</span>
                          <span className="text-[9px] font-black text-center leading-none relative z-10" style={{color:b.color}}>{b.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* My Circles */}
                  <div className="rounded-3xl p-5 shadow-lg" style={{background:'rgba(255,255,255,0.78)',backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.7)',boxShadow:'0 8px 32px rgba(0,0,0,0.07)'}}>
                    <p className="text-[10px] font-black tracking-widest mb-3" style={{color:'#B8A898'}}>MY CIRCLES</p>
                    <div className="space-y-1.5">
                      {CIRCLES.map(c=>(
                        <div key={c.name} className="flex items-center gap-3 p-2 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all"
                          style={{backgroundColor:'rgba(0,0,0,0.03)'}}>
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{backgroundColor:c.color+'22'}}>{c.icon}</div>
                          <span className="text-sm font-semibold" style={{color:'#1A1410'}}>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* World Clock */}
                  <div className="rounded-3xl p-5 shadow-lg" style={{background:'rgba(255,255,255,0.78)',backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.7)',boxShadow:'0 8px 32px rgba(0,0,0,0.07)'}}>
                    <p className="text-[10px] font-black tracking-widest mb-3" style={{color:'#B8A898'}}>MY WORLD CLOCK</p>
                    <div className="space-y-2">
                      {clocks.map(city=>{
                        const {bg,sub}=clockStyle(city.hour);
                        return (
                          <div key={city.name} className="cc rounded-2xl p-3.5 cursor-pointer shadow-sm" style={{background:bg}}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xl font-black text-white leading-none tracking-tight" suppressHydrationWarning>{city.time}</p>
                                <p className="text-xs font-semibold mt-0.5" style={{color:sub}}>{city.name}</p>
                              </div>
                              <span className="text-xl">{clockIcon(city.hour)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* My Themes */}
                  <div className="rounded-3xl p-5 shadow-lg" style={{background:'rgba(255,255,255,0.78)',backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.7)',boxShadow:'0 8px 32px rgba(0,0,0,0.07)'}}>
                    <p className="text-[10px] font-black tracking-widest mb-3" style={{color:'#B8A898'}}>MY THEMES</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[{bg:'#DBEAFE',dot:'#3B82F6'},{bg:'#FEF3C7',dot:'#F97316'},{bg:'#EDE9FE',dot:'#7C3AED'},{bg:'#DCFCE7',dot:'#16A34A'}].map((sw,i)=>(
                        <div key={i} className="rounded-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
                          style={{backgroundColor:sw.bg,height:'50px',border:'1px solid rgba(255,255,255,0.8)'}}>
                          <div className="w-6 h-6 rounded-full shadow-sm" style={{backgroundColor:sw.dot}}/>
                        </div>
                      ))}
                      <div className="col-span-2 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all"
                        style={{background:`linear-gradient(135deg,#EDE9FE,${accent}35)`,height:'40px',border:'1px solid rgba(255,255,255,0.7)'}}/>
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
