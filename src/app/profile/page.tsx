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
function isDarkAccent(hex:string){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return (0.299*r+0.587*g+0.114*b)<100;
}
function deriveTheme(accent:string){
  const dark=isDarkAccent(accent);
  return {
    bg:          dark?'#080B14':'#FAFAF7',
    surface:     dark?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.82)',
    border:      dark?'rgba(255,255,255,0.10)':'rgba(0,0,0,0.07)',
    text:        dark?'#F0F4FF':'#18120A',
    textSub:     dark?'rgba(240,244,255,0.55)':'#7A6E65',
    textMuted:   dark?'rgba(240,244,255,0.30)':'#B8A898',
    isDark:      dark,
  };
}
function clockStyle(h:number,dark:boolean){
  if(h>=5&&h<8)   return {bg:'linear-gradient(160deg,#92400E,#D97706,#F59E0B)',sub:'rgba(255,255,255,0.8)'};
  if(h>=8&&h<12)  return {bg:dark?'linear-gradient(160deg,#1E3A5F,#0EA5E9,#38BDF8)':'linear-gradient(160deg,#0EA5E9,#38BDF8,#BAE6FD)',sub:'rgba(255,255,255,0.85)'};
  if(h>=12&&h<16) return {bg:'linear-gradient(160deg,#92400E,#F59E0B,#FCD34D)',sub:'rgba(255,255,255,0.9)'};
  if(h>=16&&h<19) return {bg:'linear-gradient(160deg,#7C2D12,#EA580C,#F97316)',sub:'rgba(255,255,255,0.85)'};
  if(h>=19&&h<21) return {bg:'linear-gradient(160deg,#3B0764,#7C3AED,#A78BFA)',sub:'rgba(255,255,255,0.8)'};
  return {bg:'linear-gradient(160deg,#020617,#0F172A,#1E3A5F)',sub:'rgba(255,255,255,0.55)'};
}
function clockIcon(h:number){ return h>=5&&h<8?'🌅':h>=8&&h<18?'☀️':h>=18&&h<21?'🌇':'🌙'; }
const CLOCK_CITIES=[{name:'New York',tz:'America/New_York'},{name:'Tokyo',tz:'Asia/Tokyo'},{name:'Nairobi',tz:'Africa/Nairobi'}];
const CIRCLES=[{name:'Family',color:'#34D399',icon:'😊'},{name:'Friends',color:'#60A5FA',icon:'😄'},{name:'Creative',color:'#A78BFA',icon:'🎨'},{name:'Work',color:'#64748B',icon:'💼'}];
const COLLECTIONS=['Amsterdam','City Views','🎵 NHK','Street Food','Portraits'];
const BADGES=[
  {emoji:'🌍',label:'Pioneer',          color:'#D97706',rarity:'Legendary',shimmer:true},
  {emoji:'✨',label:'First Post',       color:'#059669',rarity:'Common',   shimmer:false},
  {emoji:'🔥',label:'Streak ×7',       color:'#EA580C',rarity:'Rare',     shimmer:true},
  {emoji:'💬',label:'Conversationalist',color:'#2563EB',rarity:'Uncommon', shimmer:false},
  {emoji:'🏆',label:'Community Fav',   color:'#7C3AED',rarity:'Rare',     shimmer:true},
  {emoji:'🗺️',label:'Globe Trotter',   color:'#0891B2',rarity:'Epic',     shimmer:true},
];
const LOCKED=[{emoji:'📖',label:'Storyteller'},{emoji:'🌐',label:'Global Voice'},{emoji:'🎯',label:'Streak ×30'}];
const SAMPLE_POSTS=[
  {id:'1',mood:'Electric',  city:'Lagos', time:'2h ago',text:'The energy in Lagos tonight is something else. The music never stops and neither do we. +lagos +nightlife',         likes:24,comments:7, hasImage:false},
  {id:'2',mood:'Reflective',city:'Tokyo', time:'5h ago',text:'Cherry blossom season begins today. Every year I forget how quickly it goes. +tokyo +cherryblossoms',              likes:41,comments:12,hasImage:true},
  {id:'3',mood:'Hopeful',   city:'Berlin',time:'1d ago',text:'New chapter, new city. Berlin in spring hits different. +berlin +newbeginnings',                                    likes:88,comments:31,hasImage:false},
];
const MOOD_COLORS:Record<string,string>={Electric:'#F59E0B',Reflective:'#6366F1',Hopeful:'#10B981',Curious:'#8B5CF6',Joyful:'#EF4444',Calm:'#06B6D4'};
interface Profile{displayName:string;handle:string;bio:string;city:string;country:string;pronouns:string;languages:string[];website:string;joinDate:string;accentColor:string;coverStyle:string;coverImage:string;handleChangedAt:string;}
const DEFAULT:Profile={displayName:'Your Name',handle:'yourhandle.feed',bio:'',city:'',country:'',pronouns:'',languages:[],website:'',joinDate:new Date().toISOString().split('T')[0],accentColor:'#D97706',coverStyle:'sand',coverImage:'',handleChangedAt:''};
function ini(n:string){return n.split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2)||'?';}
function fmtDate(d:string){try{return new Date(d).toLocaleDateString('en-US',{month:'long',year:'numeric'});}catch{return '';}}
function canChangeHandle(at:string){return !at||Date.now()-new Date(at).getTime()>365*24*60*60*1000;}
const TABS=['Posts','Notebook','Badges','Collections','Circles'];

export default function ProfilePage(){
  const [profile,setProfile]=useState<Profile>(DEFAULT);
  const [draft,setDraft]=useState<Profile>(DEFAULT);
  const [editing,setEditing]=useState(false);
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState('posts');
  const [clocks,setClocks]=useState<{name:string;time:string;hour:number}[]>([]);
  const [coverPrev,setCoverPrev]=useState('');
  const fileRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{load();},[]);
  useEffect(()=>{
    function tick(){
      const now=new Date();
      setClocks(CLOCK_CITIES.map(c=>{
        try{
          const t=now.toLocaleTimeString('en-US',{timeZone:c.tz,hour:'2-digit',minute:'2-digit',hour12:true});
          const h=parseInt(now.toLocaleTimeString('en-US',{timeZone:c.tz,hour:'numeric',hour12:false}));
          return {name:c.name,time:t,hour:isNaN(h)?0:h%24};
        }catch{return {name:c.name,time:'--:--',hour:0};}
      }));
    }
    tick();const id=setInterval(tick,10000);return ()=>clearInterval(id);
  },[]);

  async function load(){
    try{const s=await getDoc(doc(db,'users',GUEST_ID));if(s.exists())setProfile({...DEFAULT,...s.data() as Profile});}catch{}
    setLoading(false);
  }
  function startEdit(){setDraft({...profile});setCoverPrev(profile.coverImage||'');setEditing(true);setSaved(false);}
  async function save(){
    setSaving(true);
    try{
      const d={...draft,coverImage:coverPrev};
      if(draft.handle!==profile.handle)d.handleChangedAt=new Date().toISOString();
      await setDoc(doc(db,'users',GUEST_ID),d,{merge:true});
      setProfile(d);setSaved(true);
      setTimeout(()=>{setEditing(false);setSaved(false);},900);
    }catch{}
    setSaving(false);
  }
  function onCoverFile(e:React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{if(ev.target?.result)setCoverPrev(ev.target.result as string);};
    r.readAsDataURL(f);
  }
  function toggleLang(l:string){setDraft(p=>({...p,languages:p.languages.includes(l)?p.languages.filter(x=>x!==l):[...p.languages,l]}));}

  const accent=editing?draft.accentColor:profile.accentColor;
  const T=deriveTheme(accent);
  const coverGrad=COVER_GRADIENTS.find(c=>c.id===(editing?draft.coverStyle:profile.coverStyle))||COVER_GRADIENTS[6];
  const coverBg=(editing?coverPrev:profile.coverImage)||coverGrad.g;
  const isCoverImg=!!(editing?coverPrev:profile.coverImage);

  if(loading)return(<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:T.bg}}><div style={{fontSize:'14px',color:accent}}>Loading...</div></div>);

  const PC={background:T.surface,backdropFilter:'blur(28px) saturate(180%)',WebkitBackdropFilter:'blur(28px) saturate(180%)',border:`1px solid ${T.border}`,borderRadius:'24px',padding:'20px',boxShadow:T.isDark?`0 8px 40px rgba(0,0,0,0.4),0 0 0 1px ${accent}18,inset 0 1px 0 rgba(255,255,255,0.06)`:`0 8px 40px rgba(0,0,0,0.06),0 0 0 1px ${accent}12,inset 0 1px 0 rgba(255,255,255,0.95)`} as React.CSSProperties;
  const LS={color:T.textMuted,fontSize:'10px',fontWeight:900,letterSpacing:'0.12em'};

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .pr{font-family:'DM Sans',sans-serif;}
        .sf{font-family:'Playfair Display',Georgia,serif;}
        @keyframes aura{0%,100%{transform:scale(1) translate(0,0);opacity:0.55;}50%{transform:scale(1.15) translate(2%,-2%);opacity:0.70;}}
        .aura{animation:aura 9s ease-in-out infinite;}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .shim{position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.5) 50%,transparent 100%);background-size:200% auto;animation:shimmer 2.8s linear infinite;}
        @keyframes bglow{0%,100%{filter:brightness(1) drop-shadow(0 0 4px currentColor);}50%{filter:brightness(1.2) drop-shadow(0 0 12px currentColor);}}
        .bglow{animation:bglow 3s ease-in-out infinite;}
        @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .fl{animation:fl 4s ease-in-out infinite;}
        .lift{transition:transform .2s ease,box-shadow .2s ease;}
        .lift:hover{transform:translateY(-2px) scale(1.015);}
        .cc{transition:transform .2s ease;}
        .cc:hover{transform:scale(1.025);}
        .ns::-webkit-scrollbar{display:none;}.ns{-ms-overflow-style:none;scrollbar-width:none;}
        .grain::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:999;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity:0.45;mix-blend-mode:overlay;}
        @media(min-width:1024px){.rp{display:block !important;}}
      `}</style>

      <div className="pr grain" style={{minHeight:'100vh',paddingBottom:'96px',background:T.bg,color:T.text,transition:'background 0.6s ease',overflowX:'hidden',position:'relative'}}>

        {/* AURORA */}
        <div style={{position:'fixed',inset:0,overflow:'hidden',zIndex:0,pointerEvents:'none'}}>
          <div className="aura" style={{position:'absolute',top:'-20%',left:'25%',width:'70vw',height:'70vw',borderRadius:'50%',background:`radial-gradient(ellipse,${accent}28 0%,transparent 70%)`,filter:'blur(70px)'}}/>
          <div className="aura" style={{position:'absolute',bottom:'-15%',right:'5%',width:'55vw',height:'55vw',borderRadius:'50%',background:`radial-gradient(ellipse,${accent}18 0%,transparent 70%)`,filter:'blur(80px)',animationDelay:'-4.5s'}}/>
          <div className="aura" style={{position:'absolute',top:'45%',left:'-15%',width:'45vw',height:'45vw',borderRadius:'50%',background:`radial-gradient(ellipse,${accent}12 0%,transparent 70%)`,filter:'blur(60px)',animationDelay:'-7s'}}/>
        </div>

        {/* COVER */}
        <div style={{position:'relative',zIndex:1,height:'200px',overflow:'hidden',background:isCoverImg?`url(${coverBg}) center/cover no-repeat`:coverBg}}>
          <div style={{position:'absolute',inset:0,background:T.isDark?'linear-gradient(to bottom,transparent 30%,rgba(8,11,20,0.96) 100%)':'linear-gradient(to bottom,transparent 30%,rgba(250,250,247,0.96) 100%)',zIndex:1}}/>
          <div className="fl" style={{position:'absolute',top:'20px',left:'20px',zIndex:3}}>
            <div style={{width:'52px',height:'52px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px',background:T.isDark?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.88)',backdropFilter:'blur(12px)',border:`1.5px solid ${T.border}`,boxShadow:`0 4px 20px ${accent}35`}}>🌍</div>
          </div>
          {editing&&(
            <div style={{position:'absolute',bottom:'36px',right:'16px',zIndex:4,display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'flex-end'}}>
              {COVER_GRADIENTS.map(cg=><button key={cg.id} onClick={()=>{setDraft(p=>({...p,coverStyle:cg.id}));setCoverPrev('');}} style={{width:'24px',height:'24px',borderRadius:'50%',background:cg.g,cursor:'pointer',border:!coverPrev&&draft.coverStyle===cg.id?'2.5px solid white':'2.5px solid transparent',boxShadow:'0 2px 8px rgba(0,0,0,0.2)'}}/>)}
              <button onClick={()=>fileRef.current?.click()} style={{fontSize:'11px',fontWeight:700,padding:'5px 12px',borderRadius:'99px',cursor:'pointer',background:'rgba(255,255,255,0.92)',color:'#3D3530',border:'none',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>📷 Upload</button>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={onCoverFile}/>
            </div>
          )}
        </div>

        {/* BODY */}
        <div style={{position:'relative',zIndex:2,maxWidth:'1080px',margin:'0 auto',padding:'0 20px'}}>
          <div style={{display:'flex',gap:'20px',alignItems:'flex-start'}}>

            {/* MAIN */}
            <div style={{flex:1,minWidth:0}}>

              {/* IDENTITY CARD */}
              <div style={{...PC,marginTop:'-28px',marginBottom:'20px',position:'relative',overflow:'visible'}}>
                <div style={{position:'absolute',inset:'-1px',borderRadius:'25px',pointerEvents:'none',background:`linear-gradient(135deg,${accent}45,transparent 55%,${accent}20)`,zIndex:-1,filter:'blur(1px)'}}/>
                <div style={{display:'flex',alignItems:'flex-start',gap:'20px'}}>
                  <div style={{flexShrink:0}}>
                    <div style={{width:'80px',height:'80px',borderRadius:'24px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:'22px',fontFamily:"'Playfair Display',serif",backgroundColor:accent,boxShadow:`0 0 0 3px ${T.bg},0 0 0 5px ${accent}65,0 16px 40px ${accent}55`}}>
                      {ini(editing?draft.displayName:profile.displayName)}
                    </div>
                    {editing&&<div style={{display:'flex',gap:'5px',flexWrap:'wrap',marginTop:'10px',width:'80px'}}>{ACCENT_COLORS.map(c=><button key={c} onClick={()=>setDraft(p=>({...p,accentColor:c}))} style={{width:'20px',height:'20px',borderRadius:'50%',backgroundColor:c,cursor:'pointer',border:'none',outline:draft.accentColor===c?`3px solid ${c}`:'3px solid transparent',outlineOffset:'2px'}}/>)}</div>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    {editing?(
                      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                        <input value={draft.displayName} onChange={e=>setDraft(p=>({...p,displayName:e.target.value}))} style={{fontFamily:"'Playfair Display',serif",fontSize:'26px',fontWeight:900,background:'transparent',border:'none',borderBottom:`2px solid ${accent}`,outline:'none',color:T.text,width:'100%',paddingBottom:'4px'}} placeholder="Your name"/>
                        <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                          {canChangeHandle(profile.handleChangedAt)?(<><input value={draft.handle.replace('.feed','')} onChange={e=>setDraft(p=>({...p,handle:e.target.value.replace(/[\s.]/g,'').toLowerCase()+'.feed'}))} style={{fontSize:'13px',background:'transparent',border:'none',borderBottom:`1px solid ${T.border}`,outline:'none',color:accent,width:'140px'}}/><span style={{fontSize:'13px',fontWeight:600,color:accent}}>.feed</span></>):(<div style={{display:'flex',alignItems:'center',gap:'8px'}}><span style={{fontSize:'13px',fontWeight:600,color:accent}}>{profile.handle}</span><span style={{fontSize:'10px',padding:'2px 8px',borderRadius:'99px',background:T.isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.05)',color:T.textMuted}}>Locked · once/year</span></div>)}
                        </div>
                      </div>
                    ):(
                      <div>
                        <h1 className="sf" style={{fontSize:'clamp(20px,2.8vw,28px)',fontWeight:900,color:T.text,lineHeight:1.15,margin:0}}>{profile.displayName}</h1>
                        <div style={{display:'flex',alignItems:'center',gap:'12px',marginTop:'5px',flexWrap:'wrap'}}>
                          {clocks[0]&&<span suppressHydrationWarning style={{fontSize:'13px',color:T.textSub}}>{clocks[0].time}</span>}
                          {(profile.city||profile.country)&&<span style={{fontSize:'13px',color:T.textSub}}>📍 {[profile.city,profile.country].filter(Boolean).join(', ')}</span>}
                        </div>
                        <p style={{fontSize:'13px',fontWeight:600,color:accent,marginTop:'4px'}}>{profile.handle}</p>
                        {profile.bio&&<p style={{fontSize:'14px',lineHeight:1.6,color:T.textSub,marginTop:'8px',maxWidth:'480px'}}>{profile.bio}</p>}
                        <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginTop:'8px'}}>
                          {profile.pronouns&&<span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'99px',background:T.isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)',color:T.textSub}}>{profile.pronouns}</span>}
                          {profile.languages.length>0&&<span style={{fontSize:'12px',color:T.textSub}}>🌐 {profile.languages.join(' · ')}</span>}
                          {profile.website&&<a href={profile.website} target="_blank" rel="noopener noreferrer" style={{fontSize:'12px',fontWeight:600,color:accent,textDecoration:'none'}}>🔗 {profile.website.replace(/^https?:\/\//,'')}</a>}
                          <span style={{fontSize:'12px',color:T.textMuted}}>Joined {fmtDate(profile.joinDate)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{flexShrink:0}}>
                    {!editing?(
                      <button onClick={startEdit} className="lift" style={{fontSize:'13px',fontWeight:600,padding:'9px 20px',borderRadius:'99px',cursor:'pointer',background:T.surface,border:`1.5px solid ${T.border}`,color:T.text,boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>Edit Profile</button>
                    ):(
                      <div style={{display:'flex',gap:'8px'}}>
                        <button onClick={()=>setEditing(false)} style={{fontSize:'13px',fontWeight:600,padding:'9px 16px',borderRadius:'99px',cursor:'pointer',background:T.isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)',border:`1px solid ${T.border}`,color:T.textSub}}>Cancel</button>
                        <button onClick={save} disabled={saving} style={{fontSize:'13px',fontWeight:700,padding:'9px 20px',borderRadius:'99px',cursor:'pointer',background:saved?'#16A34A':accent,color:'#fff',border:'none',boxShadow:`0 4px 20px ${accent}55`}}>{saved?'✓ Saved':saving?'...':'Save'}</button>
                      </div>
                    )}
                  </div>
                </div>
                {editing&&(
                  <div style={{marginTop:'20px',paddingTop:'20px',borderTop:`1px solid ${T.border}`,display:'flex',flexDirection:'column',gap:'14px'}}>
                    <div style={{position:'relative'}}>
                      <textarea value={draft.bio} onChange={e=>e.target.value.length<=160&&setDraft(p=>({...p,bio:e.target.value}))} placeholder="Write a short bio..." rows={3} style={{width:'100%',fontSize:'14px',padding:'12px 16px',borderRadius:'16px',resize:'none',outline:'none',background:T.isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',border:`1.5px solid ${T.border}`,color:T.text,fontFamily:"'DM Sans',sans-serif"}}/>
                      <span style={{position:'absolute',bottom:'12px',right:'14px',fontSize:'11px',color:T.textMuted}}>{160-draft.bio.length}</span>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                      {(['city','country','website'] as const).map(f=><input key={f} value={draft[f]} onChange={e=>setDraft(p=>({...p,[f]:e.target.value}))} placeholder={f.charAt(0).toUpperCase()+f.slice(1)} style={{fontSize:'13px',padding:'10px 14px',borderRadius:'14px',outline:'none',background:T.isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',border:`1.5px solid ${T.border}`,color:T.text}}/>)}
                      <select value={draft.pronouns} onChange={e=>setDraft(p=>({...p,pronouns:e.target.value}))} style={{fontSize:'13px',padding:'10px 14px',borderRadius:'14px',outline:'none',background:T.isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',border:`1.5px solid ${T.border}`,color:T.text}}>
                        <option value="">Pronouns (optional)</option>
                        {PRONOUNS.map(pr=><option key={pr} value={pr}>{pr}</option>)}
                      </select>
                    </div>
                    <div>
                      <p style={{...LS,marginBottom:'10px'}}>LANGUAGES</p>
                      <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                        {LANGUAGES.map(l=><button key={l} onClick={()=>toggleLang(l)} style={{fontSize:'12px',padding:'6px 14px',borderRadius:'99px',cursor:'pointer',background:draft.languages.includes(l)?`${accent}20`:T.isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.04)',border:`1.5px solid ${draft.languages.includes(l)?accent:T.border}`,color:draft.languages.includes(l)?accent:T.textSub,fontWeight:draft.languages.includes(l)?600:400}}>{l}</button>)}
                      </div>
                    </div>
                  </div>
                )}
                {!editing&&(
                  <div style={{display:'flex',gap:'24px',marginTop:'16px',paddingTop:'16px',borderTop:`1px solid ${T.border}`}}>
                    {[['12','Posts'],['0','Followers'],['0','Following'],['0','Chapters']].map(([n,l])=>(
                      <div key={l} className="lift" style={{cursor:'pointer'}}>
                        <span className="sf" style={{fontSize:'20px',fontWeight:900,color:T.text}}>{n}</span>
                        <span style={{fontSize:'11px',fontWeight:600,marginLeft:'5px',letterSpacing:'0.08em',color:T.textMuted}}>{l.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TABS */}
              {!editing&&<>
                <div className="ns" style={{display:'flex',marginBottom:'20px',borderBottom:`1.5px solid ${T.border}`,overflowX:'auto'}}>
                  {TABS.map(t=><button key={t} onClick={()=>setTab(t.toLowerCase())} style={{padding:'12px 20px',fontSize:'14px',whiteSpace:'nowrap',flexShrink:0,fontWeight:tab===t.toLowerCase()?700:400,color:tab===t.toLowerCase()?accent:T.textMuted,background:'none',border:'none',cursor:'pointer',borderBottom:tab===t.toLowerCase()?`2.5px solid ${accent}`:'2.5px solid transparent',marginBottom:'-1.5px',transition:'color .2s'}}>{t}</button>)}
                </div>

                {/* POSTS */}
                {tab==='posts'&&<div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  {SAMPLE_POSTS.map(post=>{
                    const mc=MOOD_COLORS[post.mood]||accent;
                    return(
                      <div key={post.id} className="lift" style={{background:T.surface,backdropFilter:'blur(24px) saturate(180%)',WebkitBackdropFilter:'blur(24px) saturate(180%)',border:`1px solid ${T.border}`,borderRadius:'24px',padding:'20px',position:'relative',overflow:'hidden',boxShadow:T.isDark?`0 4px 24px rgba(0,0,0,0.3),0 0 0 1px ${mc}15`:`0 2px 20px rgba(0,0,0,0.05),0 0 0 1px ${mc}12`}}>
                        <div style={{position:'absolute',top:'-30%',right:'-10%',width:'200px',height:'200px',borderRadius:'50%',background:`radial-gradient(ellipse,${mc}22 0%,transparent 70%)`,filter:'blur(30px)',pointerEvents:'none'}}/>
                        <div style={{height:'2px',borderRadius:'99px',background:`linear-gradient(90deg,${mc},${mc}00)`,marginBottom:'14px'}}/>
                        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                          <div style={{width:'36px',height:'36px',borderRadius:'12px',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:'14px',fontFamily:"'Playfair Display',serif",background:accent,boxShadow:`0 4px 12px ${accent}45`}}>{ini(profile.displayName)}</div>
                          <div>
                            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                              <span style={{fontSize:'14px',fontWeight:700,color:T.text}}>{profile.displayName}</span>
                              <span style={{fontSize:'11px',fontWeight:600,padding:'2px 8px',borderRadius:'99px',background:`${mc}18`,color:mc}}>{post.mood}</span>
                            </div>
                            <div style={{display:'flex',gap:'6px',fontSize:'12px',color:T.textMuted}}>
                              <span>{profile.handle}</span><span>·</span><span>{post.city}</span><span>·</span><span>{post.time}</span>
                            </div>
                          </div>
                        </div>
                        {post.hasImage&&<div style={{borderRadius:'16px',marginBottom:'12px',height:'160px',background:'linear-gradient(135deg,#BAE6FD,#60A5FA,#818CF8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'48px'}}>🌸</div>}
                        <p style={{fontSize:'14px',lineHeight:1.65,color:T.text,position:'relative',zIndex:1}}>
                          {post.text.split(' ').map((w,i)=>w.startsWith('+')?<span key={i} style={{fontWeight:600,color:mc}}>{w} </span>:w+' ')}
                        </p>
                        <div style={{display:'flex',alignItems:'center',gap:'20px',marginTop:'14px',paddingTop:'12px',borderTop:`1px solid ${T.border}`,fontSize:'13px',color:T.textMuted}}>
                          <button className="lift" style={{display:'flex',alignItems:'center',gap:'5px',background:'none',border:'none',cursor:'pointer',color:T.textMuted,fontSize:'13px'}}>♡ <span>{post.likes}</span></button>
                          <button className="lift" style={{display:'flex',alignItems:'center',gap:'5px',background:'none',border:'none',cursor:'pointer',color:T.textMuted,fontSize:'13px'}}>◇ <span>{post.comments}</span></button>
                          <button className="lift" style={{background:'none',border:'none',cursor:'pointer',color:T.textMuted,fontSize:'13px'}}>⟳</button>
                          <button className="lift" style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',color:T.textMuted,fontSize:'14px'}}>☆</button>
                        </div>
                      </div>
                    );
                  })}
                </div>}

                {/* NOTEBOOK */}
                {tab==='notebook'&&<div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                    <p style={LS}>YOUR CHAPTERS</p>
                    <button style={{fontSize:'13px',fontWeight:700,padding:'10px 20px',borderRadius:'99px',cursor:'pointer',background:accent,color:'#fff',border:'none',boxShadow:`0 4px 16px ${accent}50`}}>+ New Chapter</button>
                  </div>
                  <div style={{borderRadius:'28px',padding:'64px 32px',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',background:T.isDark?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.6)',backdropFilter:'blur(16px)',border:`2px dashed ${T.border}`}}>
                    <div style={{fontSize:'56px',marginBottom:'16px',filter:`drop-shadow(0 0 20px ${accent}50)`}}>📖</div>
                    <h2 className="sf" style={{fontSize:'22px',fontWeight:900,color:T.text,margin:'0 0 8px'}}>Your story begins here</h2>
                    <p style={{fontSize:'14px',color:T.textSub,maxWidth:'320px',marginBottom:'24px',lineHeight:1.6}}>A chapter is a curated story — up to 10 photos + 1 video, with a title, mood, and your words.</p>
                    <button style={{fontSize:'14px',fontWeight:700,padding:'12px 28px',borderRadius:'99px',background:accent,color:'#fff',border:'none',cursor:'pointer',boxShadow:`0 6px 24px ${accent}55`}}>Create First Chapter</button>
                  </div>
                </div>}

                {/* BADGES */}
                {tab==='badges'&&<div>
                  <p style={{...LS,marginBottom:'16px'}}>EARNED</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'24px'}}>
                    {BADGES.map(b=><div key={b.label} className="lift" style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',padding:'20px',borderRadius:'24px',cursor:'pointer',overflow:'hidden',background:T.isDark?`${b.color}12`:`${b.color}10`,border:`1.5px solid ${b.color}30`,boxShadow:`0 6px 24px ${b.color}20`}}>
                      {b.shimmer&&<div className="shim"/>}
                      <span className="bglow" style={{fontSize:'40px',position:'relative',zIndex:1,color:b.color}}>{b.emoji}</span>
                      <span style={{fontSize:'12px',fontWeight:900,textAlign:'center',lineHeight:1.3,position:'relative',zIndex:1,color:b.color}}>{b.label}</span>
                      <span style={{fontSize:'10px',fontWeight:700,padding:'3px 10px',borderRadius:'99px',position:'relative',zIndex:1,background:`${b.color}22`,color:b.color}}>{b.rarity}</span>
                    </div>)}
                  </div>
                  <p style={{...LS,marginBottom:'12px',color:T.textMuted}}>LOCKED</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
                    {LOCKED.map(b=><div key={b.label} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',padding:'20px',borderRadius:'24px',background:T.isDark?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)',border:`1.5px dashed ${T.border}`,opacity:0.6}}>
                      <span style={{fontSize:'40px',filter:'grayscale(1)'}}>{b.emoji}</span>
                      <span style={{fontSize:'12px',fontWeight:900,textAlign:'center',color:T.textMuted}}>{b.label}</span>
                      <span style={{fontSize:'10px',padding:'3px 10px',borderRadius:'99px',background:T.isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)',color:T.textMuted}}>Locked</span>
                    </div>)}
                  </div>
                </div>}

                {/* COLLECTIONS */}
                {tab==='collections'&&<div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                    <p style={LS}>MY COLLECTIONS</p>
                    <button style={{fontSize:'13px',fontWeight:700,padding:'8px 16px',borderRadius:'99px',cursor:'pointer',background:`${accent}18`,border:`1.5px dashed ${accent}60`,color:accent}}>+ New</button>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px'}}>
                    {COLLECTIONS.map(c=><div key={c} className="lift" style={{padding:'16px',borderRadius:'20px',cursor:'pointer',display:'flex',alignItems:'center',gap:'12px',background:T.surface,backdropFilter:'blur(16px)',border:`1px solid ${T.border}`,boxShadow:T.isDark?'0 4px 20px rgba(0,0,0,0.25)':'0 4px 16px rgba(0,0,0,0.05)'}}>
                      <div style={{width:'40px',height:'40px',borderRadius:'14px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',background:`${accent}18`}}>📁</div>
                      <span style={{fontSize:'14px',fontWeight:600,color:T.text}}>{c}</span>
                    </div>)}
                  </div>
                </div>}

                {/* CIRCLES */}
                {tab==='circles'&&<div>
                  <p style={{...LS,marginBottom:'16px'}}>MY CIRCLES</p>
                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                    {CIRCLES.map(c=><div key={c.name} className="lift" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderRadius:'20px',cursor:'pointer',background:T.surface,backdropFilter:'blur(16px)',border:`1px solid ${T.border}`,boxShadow:T.isDark?'0 4px 20px rgba(0,0,0,0.25)':'0 4px 16px rgba(0,0,0,0.04)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                        <div style={{width:'44px',height:'44px',borderRadius:'16px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',background:`${c.color}20`,border:`1px solid ${c.color}30`}}>{c.icon}</div>
                        <span style={{fontSize:'14px',fontWeight:600,color:T.text}}>{c.name}</span>
                      </div>
                      <span style={{fontSize:'12px',color:T.textMuted}}>0 members →</span>
                    </div>)}
                  </div>
                </div>}
              </>}
            </div>

            {/* RIGHT PANEL */}
            {!editing&&<div className="rp" style={{flexShrink:0,width:'240px',display:'none'}}>
              <div style={{position:'sticky',top:'24px',display:'flex',flexDirection:'column',gap:'14px'}}>

                {/* Moments */}
                <div style={PC}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                    <p style={LS}>MY MOMENTS</p>
                    <button style={{fontSize:'11px',fontWeight:600,color:accent,background:'none',border:'none',cursor:'pointer'}}>See all</button>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                    <div className="lift" style={{borderRadius:'16px',height:'80px',overflow:'hidden',cursor:'pointer',background:'linear-gradient(135deg,#3B82F6,#6366F1)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',boxShadow:'0 4px 16px rgba(59,130,246,0.35)'}}>
                      <span style={{fontSize:'24px'}}>🏙️</span>
                      <div style={{position:'absolute',bottom:'6px',left:'8px',fontSize:'10px',fontWeight:900,color:'rgba(255,255,255,0.9)'}}>7:15 AM</div>
                    </div>
                    <div className="lift" style={{borderRadius:'16px',height:'80px',cursor:'pointer',background:'linear-gradient(135deg,#F59E0B,#EF4444)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(245,158,11,0.35)'}}>
                      <span style={{fontSize:'24px'}}>😄</span>
                    </div>
                    <div className="lift" style={{gridColumn:'span 2',borderRadius:'16px',padding:'12px',cursor:'pointer',background:T.isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.04)',border:`1px solid ${T.border}`}}>
                      <p style={{fontSize:'12px',fontWeight:600,color:T.text,lineHeight:1.4}}>Just read something inspiring! ✨</p>
                      <p style={{fontSize:'10px',fontWeight:900,letterSpacing:'0.1em',color:T.textMuted,marginTop:'4px'}}>THU</p>
                    </div>
                  </div>
                </div>

                {/* Collections */}
                <div style={PC}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                    <p style={LS}>MY COLLECTIONS</p>
                    <button style={{fontSize:'11px',fontWeight:600,color:accent,background:'none',border:'none',cursor:'pointer'}}>See all</button>
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {COLLECTIONS.slice(0,4).map(c=><span key={c} className="lift" style={{fontSize:'11px',fontWeight:500,padding:'5px 10px',borderRadius:'99px',cursor:'pointer',background:T.isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)',border:`1px solid ${T.border}`,color:T.text}}>{c}</span>)}
                  </div>
                </div>

                {/* Badges */}
                <div style={PC}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                    <p style={LS}>BADGES</p>
                    <button onClick={()=>setTab('badges')} style={{fontSize:'11px',fontWeight:600,color:accent,background:'none',border:'none',cursor:'pointer'}}>See all</button>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}}>
                    {BADGES.slice(0,3).map(b=><div key={b.label} className="lift" style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',padding:'10px 6px',borderRadius:'16px',cursor:'pointer',overflow:'hidden',background:`${b.color}12`,border:`1px solid ${b.color}25`}}>
                      {b.shimmer&&<div className="shim"/>}
                      <span className="bglow" style={{fontSize:'24px',position:'relative',zIndex:1,color:b.color}}>{b.emoji}</span>
                      <span style={{fontSize:'9px',fontWeight:900,textAlign:'center',lineHeight:1.2,position:'relative',zIndex:1,color:b.color}}>{b.label}</span>
                    </div>)}
                  </div>
                </div>

                {/* Circles */}
                <div style={PC}>
                  <p style={{...LS,marginBottom:'12px'}}>MY CIRCLES</p>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    {CIRCLES.map(c=><div key={c.name} className="lift" style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'14px',cursor:'pointer',background:T.isDark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.03)'}}>
                      <div style={{width:'32px',height:'32px',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',background:`${c.color}22`}}>{c.icon}</div>
                      <span style={{fontSize:'13px',fontWeight:600,color:T.text}}>{c.name}</span>
                    </div>)}
                  </div>
                </div>

                {/* World Clock */}
                <div style={PC}>
                  <p style={{...LS,marginBottom:'12px'}}>MY WORLD CLOCK</p>
                  <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    {clocks.map(city=>{
                      const {bg,sub}=clockStyle(city.hour,T.isDark);
                      return(<div key={city.name} className="cc" style={{borderRadius:'18px',padding:'14px',cursor:'pointer',background:bg,boxShadow:'0 6px 20px rgba(0,0,0,0.18)'}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <div>
                            <p suppressHydrationWarning style={{fontSize:'22px',fontWeight:900,color:'#fff',lineHeight:1,fontFamily:"'DM Sans',sans-serif",letterSpacing:'-0.02em'}}>{city.time}</p>
                            <p style={{fontSize:'11px',fontWeight:600,marginTop:'3px',color:sub}}>{city.name}</p>
                          </div>
                          <span style={{fontSize:'22px'}}>{clockIcon(city.hour)}</span>
                        </div>
                      </div>);
                    })}
                  </div>
                </div>

                {/* Themes */}
                <div style={PC}>
                  <p style={{...LS,marginBottom:'12px'}}>MY THEMES</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px'}}>
                    {[{bg:'#DBEAFE',dot:'#3B82F6'},{bg:'#FEF3C7',dot:'#F97316'},{bg:'#EDE9FE',dot:'#7C3AED'},{bg:'#DCFCE7',dot:'#16A34A'}].map((sw,i)=>(
                      <div key={i} className="lift" style={{borderRadius:'16px',display:'flex',alignItems:'center',justifyContent:'center',height:'50px',cursor:'pointer',background:sw.bg,border:'1px solid rgba(0,0,0,0.04)'}}>
                        <div style={{width:'24px',height:'24px',borderRadius:'50%',background:sw.dot,boxShadow:`0 2px 8px ${sw.dot}55`}}/>
                      </div>
                    ))}
                    <div className="lift" style={{gridColumn:'span 2',borderRadius:'16px',height:'40px',cursor:'pointer',background:`linear-gradient(135deg,${accent}30,${accent}65)`,border:`1px solid ${accent}30`,boxShadow:`0 4px 16px ${accent}25`}}/>
                  </div>
                </div>

              </div>
            </div>}
          </div>
        </div>
      </div>
    </>
  );
}
