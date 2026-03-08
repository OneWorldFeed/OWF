'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GUEST_ID = 'guest_preview';
const LANGUAGES = ['English','French','Arabic','Spanish','Portuguese','Swahili','Yoruba','Mandarin','Hindi','Japanese'];
const PRONOUNS = ['he/him','she/her','they/them','he/they','she/they','any/all'];
const ACCENT_COLORS = ['#D97706','#E8650A','#CC0022','#0284C7','#1B5E20','#7C3AED','#00DCBE','#DB2777'];
const COVER_STYLES = [
  { id:'dawn',     gradient:'linear-gradient(160deg,#FEE4C0 0%,#FEC89A 40%,#C9B8FF 100%)' },
  { id:'noon',     gradient:'linear-gradient(160deg,#BAE6FD 0%,#E0F2FE 50%,#FEF9C3 100%)' },
  { id:'golden',   gradient:'linear-gradient(160deg,#FEF3C7 0%,#FDE68A 40%,#FDBA74 100%)' },
  { id:'dusk',     gradient:'linear-gradient(160deg,#DDD6FE 0%,#C4B5FD 40%,#FCA5A5 100%)' },
  { id:'blush',    gradient:'linear-gradient(160deg,#FFE4E6 0%,#FECDD3 50%,#FED7AA 100%)' },
  { id:'sage',     gradient:'linear-gradient(160deg,#DCFCE7 0%,#BBF7D0 40%,#BAE6FD 100%)' },
  { id:'sand',     gradient:'linear-gradient(160deg,#FDF6EC 0%,#F5EFE0 50%,#EDE3CC 100%)' },
  { id:'twilight', gradient:'linear-gradient(160deg,#E0E7FF 0%,#C7D2FE 40%,#FDE68A 100%)' },
];
function getClockGradient(hour: number): string {
  if (hour>=5&&hour<8)   return 'linear-gradient(160deg,#F97316,#FB923C,#FCD34D)';
  if (hour>=8&&hour<12)  return 'linear-gradient(160deg,#38BDF8,#7DD3FC,#BAE6FD)';
  if (hour>=12&&hour<16) return 'linear-gradient(160deg,#F59E0B,#FBBF24,#FDE68A)';
  if (hour>=16&&hour<19) return 'linear-gradient(160deg,#F97316,#FB923C,#FCA5A5)';
  if (hour>=19&&hour<21) return 'linear-gradient(160deg,#7C3AED,#A78BFA,#F9A8D4)';
  return 'linear-gradient(160deg,#1E3A5F,#1E293B,#0F172A)';
}
function getClockIcon(hour: number): string {
  if (hour>=5&&hour<8)  return '🌅';
  if (hour>=8&&hour<18) return '☀️';
  if (hour>=18&&hour<21) return '🌇';
  return '🌙';
}
const WORLD_CLOCK_CITIES = [
  { name:'New York', tz:'America/New_York' },
  { name:'Tokyo',    tz:'Asia/Tokyo'        },
  { name:'Nairobi',  tz:'Africa/Nairobi'    },
];
const CIRCLES = [
  { name:'Family',   color:'#34D399', icon:'😊' },
  { name:'Friends',  color:'#60A5FA', icon:'😄' },
  { name:'Creative', color:'#A78BFA', icon:'🎨' },
  { name:'Work',     color:'#64748B', icon:'💼' },
];
const THEME_SWATCHES = [
  { bg:'#DBEAFE', dot:'#3B82F6' },
  { bg:'#FEF3C7', dot:'#F97316' },
  { bg:'#EDE9FE', dot:'#7C3AED' },
  { bg:'#DCFCE7', dot:'#16A34A' },
];
const COLLECTIONS = ['Amsterdam','City Views','🎵 NHK','Street Food','Portraits'];
const BADGES = [
  { emoji:'🌍', label:'Pioneer',           color:'#D97706', rarity:'Legendary' },
  { emoji:'✨', label:'First Post',        color:'#059669', rarity:'Common'    },
  { emoji:'🔥', label:'Streak ×7',        color:'#EA580C', rarity:'Rare'      },
  { emoji:'💬', label:'Conversationalist', color:'#2563EB', rarity:'Uncommon'  },
  { emoji:'🏆', label:'Community Fav',    color:'#7C3AED', rarity:'Rare'      },
  { emoji:'🗺️', label:'Globe Trotter',    color:'#0891B2', rarity:'Epic'      },
];
const LOCKED_BADGES = [
  { emoji:'📖', label:'Storyteller',  desc:'Complete first Notebook chapter' },
  { emoji:'🌐', label:'Global Voice', desc:'Followers from 5+ countries'     },
  { emoji:'🎯', label:'Streak ×30',   desc:'30-day posting streak'           },
];
interface Profile {
  displayName:string; handle:string; bio:string; city:string; country:string;
  pronouns:string; languages:string[]; website:string; joinDate:string;
  accentColor:string; coverStyle:string;
}
const DEFAULT_PROFILE: Profile = {
  displayName:'Your Name', handle:'yourhandle.feed', bio:'', city:'', country:'',
  pronouns:'', languages:[], website:'', joinDate:new Date().toISOString().split('T')[0],
  accentColor:'#D97706', coverStyle:'sand',
};
function getInitials(name:string){ return name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)||'?'; }
function formatJoinDate(d:string){ try{ return new Date(d).toLocaleDateString('en-US',{month:'long',year:'numeric'}); }catch{ return ''; } }
const TABS = ['Overview','Posts','Notebook','Badges','Collections','Circles'];

export default function ProfilePage() {
  const [profile, setProfile]     = useState<Profile>(DEFAULT_PROFILE);
  const [draft, setDraft]         = useState<Profile>(DEFAULT_PROFILE);
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [clockTimes, setClockTimes] = useState<{name:string;time:string;hour:number}[]>([]);
  useEffect(()=>{ loadProfile(); },[]);
  useEffect(()=>{
    function tick(){
      const now = new Date();
      setClockTimes(WORLD_CLOCK_CITIES.map(city=>{
        try{
          const t = now.toLocaleTimeString('en-US',{timeZone:city.tz,hour:'2-digit',minute:'2-digit',hour12:true});
          const h = parseInt(now.toLocaleTimeString('en-US',{timeZone:city.tz,hour:'numeric',hour12:false}));
          return {name:city.name,time:t,hour:isNaN(h)?0:h};
        }catch{ return {name:city.name,time:'--:--',hour:0}; }
      }));
    }
    tick(); const id=setInterval(tick,10000); return ()=>clearInterval(id);
  },[]);
  async function loadProfile(){
    try{ const snap=await getDoc(doc(db,'users',GUEST_ID)); if(snap.exists()) setProfile({...DEFAULT_PROFILE,...snap.data() as Profile}); }catch{}
    setLoading(false);
  }
  function startEdit(){ setDraft({...profile}); setEditing(true); setSaved(false); }
  async function saveProfile(){
    setSaving(true);
    try{ await setDoc(doc(db,'users',GUEST_ID),draft,{merge:true}); setProfile({...draft}); setSaved(true); setTimeout(()=>{setEditing(false);setSaved(false);},900); }catch{}
    setSaving(false);
  }
  function toggleLanguage(lang:string){ setDraft(p=>({...p,languages:p.languages.includes(lang)?p.languages.filter(l=>l!==lang):[...p.languages,lang]})); }
  const cover  = COVER_STYLES.find(c=>c.id===(editing?draft.coverStyle:profile.coverStyle))||COVER_STYLES[6];
  const accent = editing?draft.accentColor:profile.accentColor;
  if(loading) return <div className="flex items-center justify-center min-h-screen" style={{background:'#F8F4EF'}}><div className="text-sm animate-pulse" style={{color:'#A89880'}}>Loading...</div></div>;
  return (
    <div className="min-h-screen pb-24" style={{background:'#F8F4EF'}}>
      {/* COVER */}
      <div className="relative h-44 md:h-52 transition-all duration-500" style={{background:cover.gradient}}>
        <div className="absolute top-4 left-4 w-14 h-14 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-2xl select-none" style={{backgroundColor:'rgba(255,255,255,0.85)',backdropFilter:'blur(8px)'}}>🌍</div>
        {editing&&<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">{COVER_STYLES.map(cs=><button key={cs.id} onClick={()=>setDraft(p=>({...p,coverStyle:cs.id}))} className="w-6 h-6 rounded-full border-2 transition-all hover:scale-125" style={{background:cs.gradient,borderColor:draft.coverStyle===cs.id?'#fff':'rgba(255,255,255,0.3)'}}/>)}</div>}
      </div>
      {/* BODY */}
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex gap-6 items-start">
          {/* MAIN */}
          <div className="flex-1 min-w-0">
            {/* IDENTITY CARD */}
            <div className="relative -mt-6 mb-5">
              <div className="rounded-3xl p-5 shadow-sm" style={{backgroundColor:'#fff',border:'1px solid #EDE8E0'}}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 -mt-10">
                    <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-xl" style={{backgroundColor:accent,boxShadow:`0 8px 24px ${accent}45`}}>{getInitials(editing?draft.displayName:profile.displayName)}</div>
                    {editing&&<div className="flex gap-1 flex-wrap mt-2" style={{width:'80px'}}>{ACCENT_COLORS.map(c=><button key={c} onClick={()=>setDraft(p=>({...p,accentColor:c}))} className="w-4 h-4 rounded-full transition-all hover:scale-125" style={{backgroundColor:c,border:draft.accentColor===c?'2px solid #1A1410':'2px solid transparent'}}/>)}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editing?(
                      <div className="space-y-2">
                        <input value={draft.displayName} onChange={e=>setDraft(p=>({...p,displayName:e.target.value}))} className="text-2xl font-black bg-transparent border-b-2 focus:outline-none w-full pb-0.5" style={{borderColor:accent,color:'#1A1410',fontFamily:'Georgia,serif'}} placeholder="Your name"/>
                        <div className="flex items-center gap-1">
                          <input value={draft.handle.replace('.feed','')} onChange={e=>setDraft(p=>({...p,handle:e.target.value.replace(/[\s.]/g,'').toLowerCase()+'.feed'}))} className="text-sm bg-transparent border-b focus:outline-none" style={{borderColor:'#E8E0D5',color:accent,width:'140px'}}/>
                          <span className="text-sm font-semibold" style={{color:accent}}>.feed</span>
                        </div>
                      </div>
                    ):(
                      <div>
                        <h1 className="text-2xl font-black leading-tight" style={{color:'#1A1410',fontFamily:'Georgia,serif'}}>{profile.displayName}</h1>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          {clockTimes[0]&&<span className="text-sm" style={{color:'#7A6E65'}} suppressHydrationWarning>{clockTimes[0].time}</span>}
                          {(profile.city||profile.country)&&<span className="text-sm" style={{color:'#7A6E65'}}>{[profile.city,profile.country].filter(Boolean).join(', ')}</span>}
                        </div>
                        <p className="text-sm font-medium mt-0.5" style={{color:accent}}>{profile.handle}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {!editing?(
                      <button onClick={startEdit} className="text-xs font-bold px-4 py-2 rounded-full border transition-all hover:scale-105" style={{borderColor:'#E8E0D5',color:'#3D3530',backgroundColor:'#fff'}}>Edit Profile</button>
                    ):(
                      <div className="flex gap-2">
                        <button onClick={()=>setEditing(false)} className="text-xs font-bold px-3 py-2 rounded-full" style={{backgroundColor:'#F5F0E8',color:'#7A6E65'}}>Cancel</button>
                        <button onClick={saveProfile} disabled={saving} className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105" style={{backgroundColor:saved?'#16A34A':accent,color:'#fff'}}>{saved?'✓ Saved':saving?'...':'Save'}</button>
                      </div>
                    )}
                  </div>
                </div>
                {editing&&(
                  <div className="mt-4 space-y-3 pt-4" style={{borderTop:'1px solid #EDE8E0'}}>
                    <div className="relative"><textarea value={draft.bio} onChange={e=>e.target.value.length<=160&&setDraft(p=>({...p,bio:e.target.value}))} placeholder="Write a short bio..." rows={2} className="w-full text-sm bg-transparent rounded-xl px-3 py-2 resize-none focus:outline-none" style={{border:'1px solid #E8E0D5',color:'#1A1410',fontFamily:'Georgia,serif'}}/><span className="absolute bottom-3 right-3 text-[10px]" style={{color:'#C8BAA8'}}>{160-draft.bio.length}</span></div>
                    <div className="grid grid-cols-2 gap-2">
                      {(['city','country','website'] as const).map(field=><input key={field} value={draft[field]} onChange={e=>setDraft(p=>({...p,[field]:e.target.value}))} placeholder={field.charAt(0).toUpperCase()+field.slice(1)} className="text-xs px-3 py-2 rounded-xl focus:outline-none" style={{backgroundColor:'#F5F0E8',border:'1px solid #E8E0D5',color:'#1A1410'}}/>)}
                      <select value={draft.pronouns} onChange={e=>setDraft(p=>({...p,pronouns:e.target.value}))} className="text-xs px-3 py-2 rounded-xl focus:outline-none" style={{backgroundColor:'#F5F0E8',border:'1px solid #E8E0D5',color:'#1A1410'}}><option value="">Pronouns</option>{PRONOUNS.map(pr=><option key={pr} value={pr}>{pr}</option>)}</select>
                    </div>
                    <div><p className="text-[10px] font-black tracking-widest mb-2" style={{color:'#A89880'}}>LANGUAGES</p><div className="flex flex-wrap gap-1.5">{LANGUAGES.map(lang=><button key={lang} onClick={()=>toggleLanguage(lang)} className="text-xs px-2.5 py-1 rounded-full transition-all" style={{backgroundColor:draft.languages.includes(lang)?accent+'20':'#F5F0E8',border:`1px solid ${draft.languages.includes(lang)?accent:'#E8E0D5'}`,color:draft.languages.includes(lang)?accent:'#7A6E65'}}>{lang}</button>)}</div></div>
                  </div>
                )}
                {!editing&&profile.bio&&<div className="mt-3 pt-3" style={{borderTop:'1px solid #F5F0E8'}}><p className="text-sm leading-relaxed" style={{color:'#3D3530',fontFamily:'Georgia,serif'}}>{profile.bio}</p><div className="flex flex-wrap gap-3 mt-2 text-xs" style={{color:'#7A6E65'}}>{profile.pronouns&&<span className="px-2 py-0.5 rounded-full" style={{backgroundColor:'#F5F0E8'}}>{profile.pronouns}</span>}{profile.languages.length>0&&<span>🌐 {profile.languages.join(' · ')}</span>}{profile.website&&<a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{color:accent}}>🔗 {profile.website.replace(/^https?:\/\//,'')}</a>}<span style={{color:'#C8BAA8'}}>Joined {formatJoinDate(profile.joinDate)}</span></div></div>}
                {!editing&&<div className="flex gap-5 mt-3 pt-3" style={{borderTop:'1px solid #F5F0E8'}}>{[['12','Posts'],['0','Followers'],['0','Following'],['0','Chapters']].map(([n,l])=><div key={l} className="text-center cursor-pointer hover:scale-105 transition-all"><p className="text-base font-black" style={{color:'#1A1410',fontFamily:'Georgia,serif'}}>{n}</p><p className="text-[10px] font-bold tracking-wide" style={{color:'#A89880'}}>{l.toUpperCase()}</p></div>)}</div>}
              </div>
            </div>
            {/* TABS */}
            {!editing&&<>
              <div className="flex gap-0 mb-5 overflow-x-auto scrollbar-hide" style={{borderBottom:'1px solid #EDE8E0'}}>
                {TABS.map(tab=><button key={tab} onClick={()=>setActiveTab(tab.toLowerCase())} className="px-4 py-2.5 text-sm whitespace-nowrap flex-shrink-0 transition-all" style={{fontFamily:'Georgia,serif',fontWeight:activeTab===tab.toLowerCase()?700:400,color:activeTab===tab.toLowerCase()?accent:'#A89880',borderBottom:activeTab===tab.toLowerCase()?`2px solid ${accent}`:'2px solid transparent'}}>{tab}</button>)}
              </div>
              {activeTab==='overview'&&<div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-black" style={{color:'#1A1410',fontFamily:'Georgia,serif'}}>My Moments</h2><button className="text-xs font-semibold" style={{color:accent}}>See all →</button></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative rounded-2xl overflow-hidden cursor-pointer" style={{height:'200px'}}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"/>
                      <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center"><span className="text-5xl">🏙️</span></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 z-20"><span className="text-[10px] font-black px-2 py-0.5 rounded-full mb-1 inline-block" style={{backgroundColor:'rgba(100,160,255,0.85)',color:'#fff'}}>MOMENT</span><p className="text-white font-black text-sm">7:15 AM</p></div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="relative rounded-2xl overflow-hidden cursor-pointer" style={{height:'94px'}}><div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center"><span className="text-3xl">😄</span></div><div className="absolute bottom-2 left-3"><p className="text-[10px] font-black" style={{color:'rgba(255,255,255,0.85)'}}>YESTERDAY</p></div></div>
                      <div className="rounded-2xl p-3 cursor-pointer hover:scale-[1.02] transition-all" style={{backgroundColor:'#fff',border:'1px solid #EDE8E0',height:'94px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}><p className="text-sm font-semibold leading-snug" style={{color:'#1A1410',fontFamily:'Georgia,serif'}}>Just read something inspiring! ✨</p><p className="text-[10px] font-black tracking-wide" style={{color:'#C8BAA8'}}>THU</p></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-black" style={{color:'#1A1410',fontFamily:'Georgia,serif'}}>My Collections</h2><button className="text-xs font-semibold" style={{color:accent}}>See all →</button></div>
                  <div className="flex gap-2 flex-wrap">{COLLECTIONS.map(col=><button key={col} className="text-xs font-bold px-4 py-2 rounded-full border transition-all hover:scale-105" style={{backgroundColor:'#fff',border:'1px solid #EDE8E0',color:'#3D3530'}}>{col}</button>)}<button className="text-xs font-bold px-4 py-2 rounded-full border transition-all hover:scale-105" style={{backgroundColor:accent+'15',border:`1px dashed ${accent}`,color:accent}}>+ New</button></div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-black" style={{color:'#1A1410',fontFamily:'Georgia,serif'}}>Badges</h2><button onClick={()=>setActiveTab('badges')} className="text-xs font-semibold" style={{color:accent}}>See all →</button></div>
                  <div className="flex gap-3">{BADGES.slice(0,4).map(b=><div key={b.label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl cursor-pointer hover:scale-105 transition-all" style={{backgroundColor:b.color+'12',border:`1px solid ${b.color}25`,minWidth:'70px'}}><span className="text-2xl">{b.emoji}</span><span className="text-[10px] font-black text-center leading-tight" style={{color:b.color}}>{b.label}</span></div>)}</div>
                </div>
              </div>}
              {activeTab==='posts'&&<div className="text-center py-16 rounded-3xl" style={{border:'2px dashed #EDE8E0'}}><span className="text-4xl block mb-3">✍️</span><p className="font-black mb-1" style={{color:'#1A1410',fontFamily:'Georgia,serif'}}>No posts yet</p><p className="text-sm" style={{color:'#A89880'}}>Your published posts will appear here</p></div>}
              {activeTab==='notebook'&&<div><div className="flex justify-between items-center mb-4"><p className="text-xs font-black tracking-widest" style={{color:'#A89880'}}>YOUR CHAPTERS</p><button className="text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition-all" style={{backgroundColor:accent,color:'#fff'}}>+ New Chapter</button></div><div className="rounded-3xl py-16 flex flex-col items-center text-center" style={{background:'linear-gradient(135deg,#FFFBF0,#FFF3CD)',border:'2px dashed #EDE8E0'}}><span className="text-5xl mb-4">📖</span><p className="text-base font-black mb-2" style={{color:'#1A1410',fontFamily:'Georgia,serif'}}>Your story begins here</p><p className="text-sm mb-6 max-w-xs" style={{color:'#7A6E65'}}>A chapter is a curated story — up to 10 photos + 1 video, with a title, mood, and your words.</p><button className="text-sm font-bold px-6 py-3 rounded-full hover:scale-105 transition-all" style={{backgroundColor:accent,color:'#fff'}}>Create First Chapter</button></div></div>}
              {activeTab==='badges'&&<div><p className="text-xs font-black tracking-widest mb-4" style={{color:'#A89880'}}>EARNED</p><div className="grid grid-cols-3 gap-3 mb-6">{BADGES.map(b=><div key={b.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl cursor-pointer hover:scale-105 transition-all" style={{backgroundColor:b.color+'10',border:`1px solid ${b.color}25`,boxShadow:`0 4px 16px ${b.color}12`}}><span className="text-3xl">{b.emoji}</span><span className="text-xs font-black text-center leading-tight" style={{color:b.color}}>{b.label}</span><span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{backgroundColor:b.color+'20',color:b.color}}>{b.rarity}</span></div>)}</div><p className="text-xs font-black tracking-widest mb-3" style={{color:'#C8BAA8'}}>LOCKED</p><div className="grid grid-cols-3 gap-3">{LOCKED_BADGES.map(b=><div key={b.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl" style={{backgroundColor:'#F5F0E8',border:'1px dashed #EDE8E0',opacity:0.6}}><span className="text-3xl grayscale">{b.emoji}</span><span className="text-xs font-black text-center" style={{color:'#C8BAA8'}}>{b.label}</span><span className="text-[9px] px-2 py-0.5 rounded-full" style={{backgroundColor:'#EDE8E0',color:'#C8BAA8'}}>Locked</span></div>)}</div></div>}
              {activeTab==='collections'&&<div className="text-center py-16 rounded-3xl" style={{border:'2px dashed #EDE8E0'}}><span className="text-4xl block mb-3">📚</span><p className="font-black mb-1" style={{color:'#1A1410',fontFamily:'Georgia,serif'}}>No collections yet</p><p className="text-sm" style={{color:'#A89880'}}>Save posts and moments to build your library</p></div>}
              {activeTab==='circles'&&<div><p className="text-xs font-black tracking-widest mb-4" style={{color:'#A89880'}}>MY CIRCLES</p><div className="space-y-2">{CIRCLES.map(circle=><div key={circle.name} className="flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all" style={{backgroundColor:'#fff',border:'1px solid #EDE8E0'}}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{backgroundColor:circle.color+'20'}}>{circle.icon}</div><span className="font-semibold text-sm" style={{color:'#1A1410'}}>{circle.name}</span></div><span className="text-xs" style={{color:'#C8BAA8'}}>0 members →</span></div>)}</div></div>}
            </>}
          </div>

          {/* STICKY RIGHT PANEL */}
          {!editing&&(
            <div className="flex-shrink-0 hidden lg:block" style={{width:'230px'}}>
              <div className="sticky top-6 space-y-4 -mt-6">
                {/* My Circles */}
                <div className="rounded-3xl p-4 shadow-sm" style={{backgroundColor:'#fff',border:'1px solid #EDE8E0'}}>
                  <p className="text-xs font-black tracking-widest mb-3" style={{color:'#A89880'}}>MY CIRCLES</p>
                  <div className="space-y-1.5">{CIRCLES.map(c=><div key={c.name} className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:scale-[1.02] transition-all" style={{backgroundColor:'#F8F4EF'}}><div className="w-8 h-8 rounded-full flex items-center justify-center text-base" style={{backgroundColor:c.color+'25'}}>{c.icon}</div><span className="text-sm font-semibold" style={{color:'#1A1410'}}>{c.name}</span></div>)}</div>
                </div>
                {/* My World Clock */}
                <div className="rounded-3xl p-4 shadow-sm" style={{backgroundColor:'#fff',border:'1px solid #EDE8E0'}}>
                  <p className="text-xs font-black tracking-widest mb-3" style={{color:'#A89880'}}>MY WORLD CLOCK</p>
                  <div className="space-y-2">{clockTimes.map(city=><div key={city.name} className="rounded-2xl p-3 cursor-pointer hover:scale-[1.02] transition-all" style={{background:getClockGradient(city.hour)}}><div className="flex items-start justify-between"><div><p className="text-xl font-black leading-none text-white" suppressHydrationWarning>{city.time}</p><p className="text-white/80 text-xs font-semibold mt-1">{city.name}</p></div><span className="text-lg">{getClockIcon(city.hour)}</span></div></div>)}</div>
                </div>
                {/* My Themes */}
                <div className="rounded-3xl p-4 shadow-sm" style={{backgroundColor:'#fff',border:'1px solid #EDE8E0'}}>
                  <p className="text-xs font-black tracking-widest mb-3" style={{color:'#A89880'}}>MY THEMES</p>
                  <div className="grid grid-cols-2 gap-2">
                    {THEME_SWATCHES.map((sw,i)=><div key={i} className="rounded-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all" style={{backgroundColor:sw.bg,height:'48px',border:'1px solid rgba(0,0,0,0.04)'}}><div className="w-6 h-6 rounded-full" style={{backgroundColor:sw.dot}}/></div>)}
                    <div className="col-span-2 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all" style={{background:`linear-gradient(135deg,#EDE9FE,${accent}30)`,height:'40px',border:'1px solid rgba(0,0,0,0.04)'}}/>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
