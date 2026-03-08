'use client';
import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GUEST_ID = 'guest_preview';
const LANGUAGES = ['English','French','Arabic','Spanish','Portuguese','Swahili','Yoruba','Mandarin','Hindi','Japanese'];
const PRONOUNS = ['he/him','she/her','they/them','he/they','she/they','any/all'];
const ACCENT_COLORS = ['#D97706','#E8650A','#CC0022','#0284C7','#1B5E20','#7C3AED','#00DCBE','#DB2777'];
const COVER_GRADIENTS = [
  { id:'dawn',g:'linear-gradient(160deg,#FEE4C0,#FEC89A,#C9B8FF)' },
  { id:'noon',g:'linear-gradient(160deg,#BAE6FD,#E0F2FE,#FEF9C3)' },
  { id:'golden',g:'linear-gradient(160deg,#FEF3C7,#FDE68A,#FDBA74)' },
  { id:'dusk',g:'linear-gradient(160deg,#DDD6FE,#C4B5FD,#FCA5A5)' },
  { id:'blush',g:'linear-gradient(160deg,#FFE4E6,#FECDD3,#FED7AA)' },
  { id:'sage',g:'linear-gradient(160deg,#DCFCE7,#BBF7D0,#BAE6FD)' },
  { id:'sand',g:'linear-gradient(160deg,#FDF6EC,#F5EFE0,#EDE3CC)' },
  { id:'twilight',g:'linear-gradient(160deg,#E0E7FF,#C7D2FE,#FDE68A)' },
];

function isDarkAccent(hex:string){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return(0.299*r+0.587*g+0.114*b)<100;}
function deriveTheme(accent:string){const dark=isDarkAccent(accent);return{bg:dark?'#080B14':'#FAFAF7',surface:dark?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.82)',border:dark?'rgba(255,255,255,0.10)':'rgba(0,0,0,0.07)',text:dark?'#F0F4FF':'#18120A',textSub:dark?'rgba(240,244,255,0.55)':'#7A6E65',textMuted:dark?'rgba(240,244,255,0.30)':'#B8A898',isDark:dark};}
function clockStyle(h:number,dark:boolean){if(h>=5&&h<8)return{bg:'linear-gradient(160deg,#92400E,#D97706,#F59E0B)',sub:'rgba(255,255,255,0.8)'};if(h>=8&&h<12)return{bg:dark?'linear-gradient(160deg,#1E3A5F,#0EA5E9,#38BDF8)':'linear-gradient(160deg,#0EA5E9,#38BDF8,#BAE6FD)',sub:'rgba(255,255,255,0.85)'};if(h>=12&&h<16)return{bg:'linear-gradient(160deg,#92400E,#F59E0B,#FCD34D)',sub:'rgba(255,255,255,0.9)'};if(h>=16&&h<19)return{bg:'linear-gradient(160deg,#7C2D12,#EA580C,#F97316)',sub:'rgba(255,255,255,0.85)'};if(h>=19&&h<21)return{bg:'linear-gradient(160deg,#3B0764,#7C3AED,#A78BFA)',sub:'rgba(255,255,255,0.8)'};return{bg:'linear-gradient(160deg,#020617,#0F172A,#1E3A5F)',sub:'rgba(255,255,255,0.55)'};}
function clockIcon(h:number){return h>=5&&h<8?'🌅':h>=8&&h<18?'☀️':h>=18&&h<21?'🌇':'🌙';}

const CLOCK_CITIES=[{name:'New York',tz:'America/New_York'},{name:'Tokyo',tz:'Asia/Tokyo'},{name:'Nairobi',tz:'Africa/Nairobi'}];
const CIRCLES=[{name:'Family',color:'#34D399',icon:'😊'},{name:'Friends',color:'#60A5FA',icon:'😄'},{name:'Creative',color:'#A78BFA',icon:'🎨'},{name:'Work',color:'#64748B',icon:'💼'}];
const COLLECTIONS=['Amsterdam','City Views','🎵 NHK','Street Food','Portraits'];
const BADGES=[
  {emoji:'🌍',label:'Pioneer',color:'#D97706',rarity:'Legendary',shimmer:true},
  {emoji:'✨',label:'First Post',color:'#059669',rarity:'Common',shimmer:false},
  {emoji:'🔥',label:'Streak ×7',color:'#EA580C',rarity:'Rare',shimmer:true},
  {emoji:'💬',label:'Convo',color:'#2563EB',rarity:'Uncommon',shimmer:false},
  {emoji:'🏆',label:'Fav',color:'#7C3AED',rarity:'Rare',shimmer:true},
  {emoji:'🗺️',label:'Globe',color:'#0891B2',rarity:'Epic',shimmer:true},
];
const LOCKED=[{emoji:'📖',label:'Storyteller'},{emoji:'🌐',label:'Global Voice'},{emoji:'🎯',label:'Streak ×30'}];
const SAMPLE_POSTS=[
  {id:'1',mood:'Electric',city:'Lagos',time:'2h ago',text:'The energy in Lagos tonight is something else. The music never stops and neither do we. +lagos +nightlife',likes:24,comments:7,hasImage:false},
  {id:'2',mood:'Reflective',city:'Tokyo',time:'5h ago',text:'Cherry blossom season begins today. Every year I forget how quickly it goes. +tokyo +cherryblossoms',likes:41,comments:12,hasImage:true},
  {id:'3',mood:'Hopeful',city:'Berlin',time:'1d ago',text:'New chapter, new city. Berlin in spring hits different. +berlin +newbeginnings',likes:88,comments:31,hasImage:false},
  {id:'4',mood:'Curious',city:'Paris',time:'2d ago',text:'The Louvre at midnight during a private event. Some spaces only reveal themselves in silence. +paris +art +curious',likes:132,comments:44,hasImage:false},
  {id:'5',mood:'Calm',city:'Nairobi',time:'3d ago',text:'Early morning run through Karura Forest. The mist, the birds, the absolute stillness. Worth every alarm. +nairobi +calm',likes:67,comments:18,hasImage:true},
];
const MOOD_COLORS:Record<string,string>={Electric:'#F59E0B',Reflective:'#6366F1',Hopeful:'#10B981',Curious:'#8B5CF6',Joyful:'#EF4444',Calm:'#06B6D4'};
const MOOD_WEEK=[{day:'Mon',mood:'Calm',val:3},{day:'Tue',mood:'Hopeful',val:5},{day:'Wed',mood:'Electric',val:8},{day:'Thu',mood:'Reflective',val:4},{day:'Fri',mood:'Joyful',val:9},{day:'Sat',mood:'Curious',val:6},{day:'Sun',mood:'Hopeful',val:7}];
const COUNTRY_REGIONS:Record<string,{label:string;x:number;y:number}>={US:{label:'🇺🇸',x:18,y:36},NG:{label:'🇳🇬',x:48,y:52},JP:{label:'🇯🇵',x:80,y:34},DE:{label:'🇩🇪',x:50,y:26},BR:{label:'🇧🇷',x:28,y:62},IN:{label:'🇮🇳',x:67,y:44},FR:{label:'🇫🇷',x:48,y:27},ZA:{label:'🇿🇦',x:52,y:68},CN:{label:'🇨🇳',x:74,y:36},GB:{label:'🇬🇧',x:47,y:23},AU:{label:'🇦🇺',x:78,y:68},MX:{label:'🇲🇽',x:17,y:44},EG:{label:'🇪🇬',x:54,y:40},KE:{label:'🇰🇪',x:56,y:54},AR:{label:'🇦🇷',x:26,y:72},TH:{label:'🇹🇭',x:73,y:46},GH:{label:'🇬🇭',x:46,y:52},IT:{label:'🇮🇹',x:51,y:30},CA:{label:'🇨🇦',x:16,y:24},MA:{label:'🇲🇦',x:45,y:36}};
const WMO_ICONS:Record<number,string>={0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',51:'🌦',53:'🌧',61:'🌧',71:'🌨',80:'🌦',95:'⛈'};
const CITY_COORDS:Record<string,{lat:number;lon:number}>={Lagos:{lat:6.5244,lon:3.3792},London:{lat:51.5074,lon:-0.1278},'New York':{lat:40.7128,lon:-74.006},Tokyo:{lat:35.6762,lon:139.6503},Nairobi:{lat:-1.2921,lon:36.8219},Paris:{lat:48.8566,lon:2.3522},Berlin:{lat:52.52,lon:13.405},Dubai:{lat:25.2048,lon:55.2708},Mumbai:{lat:19.076,lon:72.8777},Sydney:{lat:-33.8688,lon:151.2093}};

interface NowPlaying{track:string;artist:string;playing:boolean;}
interface Profile{displayName:string;handle:string;bio:string;city:string;country:string;pronouns:string;languages:string[];website:string;joinDate:string;accentColor:string;coverStyle:string;coverImage:string;handleChangedAt:string;visitedCountries:string[];nowPlaying:NowPlaying;}
interface Weather{temp:number;condition:string;city:string;}
const DEFAULT:Profile={displayName:'Your Name',handle:'yourhandle.feed',bio:'',city:'Lagos',country:'Nigeria',pronouns:'',languages:[],website:'',joinDate:new Date().toISOString().split('T')[0],accentColor:'#D97706',coverStyle:'sand',coverImage:'',handleChangedAt:'',visitedCountries:['NG','JP','DE','FR','GB'],nowPlaying:{track:'Essence',artist:'Wizkid ft. Tems',playing:true}};
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
  const [weather,setWeather]=useState<Weather|null>(null);
  const [editNP,setEditNP]=useState(false);
  const [npDraft,setNpDraft]=useState({track:'',artist:''});
  const fileRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{load();},[]);
  useEffect(()=>{
    function tick(){const now=new Date();setClocks(CLOCK_CITIES.map(c=>{try{const t=now.toLocaleTimeString('en-US',{timeZone:c.tz,hour:'2-digit',minute:'2-digit',hour12:true});const h=parseInt(now.toLocaleTimeString('en-US',{timeZone:c.tz,hour:'numeric',hour12:false}));return{name:c.name,time:t,hour:isNaN(h)?0:h%24};}catch{return{name:c.name,time:'--:--',hour:0};}}));}
    tick();const id=setInterval(tick,10000);return()=>clearInterval(id);
  },[]);
  useEffect(()=>{
    const city=profile.city||'Lagos';const coords=CITY_COORDS[city]||CITY_COORDS['Lagos'];
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weathercode&temperature_unit=celsius`)
      .then(r=>r.json()).then(d=>{const temp=Math.round(d.current?.temperature_2m??0);const code=d.current?.weathercode??0;setWeather({temp,condition:WMO_ICONS[code]||'🌡',city});}).catch(()=>{});
  },[profile.city]);

  async function load(){try{const s=await getDoc(doc(db,'users',GUEST_ID));if(s.exists())setProfile({...DEFAULT,...s.data() as Profile});}catch{}setLoading(false);}
  function startEdit(){setDraft({...profile});setCoverPrev(profile.coverImage||'');setEditing(true);setSaved(false);}
  async function save(){setSaving(true);try{const d={...draft,coverImage:coverPrev};if(draft.handle!==profile.handle)d.handleChangedAt=new Date().toISOString();await setDoc(doc(db,'users',GUEST_ID),d,{merge:true});setProfile(d);setSaved(true);setTimeout(()=>{setEditing(false);setSaved(false);},900);}catch{}setSaving(false);}
  function onCoverFile(e:React.ChangeEvent<HTMLInputElement>){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>{if(ev.target?.result)setCoverPrev(ev.target.result as string);};r.readAsDataURL(f);}
  function toggleLang(l:string){setDraft(p=>({...p,languages:p.languages.includes(l)?p.languages.filter(x=>x!==l):[...p.languages,l]}));}
  function toggleCountry(code:string){setProfile(p=>({...p,visitedCountries:p.visitedCountries.includes(code)?p.visitedCountries.filter(x=>x!==code):[...p.visitedCountries,code]}));}
  function saveNowPlaying(){setProfile(p=>({...p,nowPlaying:{track:npDraft.track,artist:npDraft.artist,playing:true}}));setEditNP(false);}

  const accent=editing?draft.accentColor:profile.accentColor;
  const T=deriveTheme(accent);
  const coverGrad=COVER_GRADIENTS.find(c=>c.id===(editing?draft.coverStyle:profile.coverStyle))||COVER_GRADIENTS[6];
  const coverBg=(editing?coverPrev:profile.coverImage)||coverGrad.g;
  const isCoverImg=!!(editing?coverPrev:profile.coverImage);
  if(loading)return(<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:T.bg}}><div style={{fontSize:'14px',color:accent}}>Loading…</div></div>);

  const PC={background:T.surface,backdropFilter:'blur(28px) saturate(180%)',WebkitBackdropFilter:'blur(28px) saturate(180%)',border:`1px solid ${T.border}`,borderRadius:'20px',padding:'16px',boxShadow:T.isDark?`0 8px 32px rgba(0,0,0,0.4),0 0 0 1px ${accent}15`:`0 6px 24px rgba(0,0,0,0.05),0 0 0 1px ${accent}10`} as React.CSSProperties;
  const LS={color:T.textMuted,fontSize:'10px',fontWeight:900,letterSpacing:'0.12em'} as React.CSSProperties;
  const maxMood=Math.max(...MOOD_WEEK.map(m=>m.val));

  return(<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      *{box-sizing:border-box;} .pr{font-family:'DM Sans',sans-serif;} .sf{font-family:'Playfair Display',Georgia,serif;}
      @keyframes aura{0%,100%{transform:scale(1);opacity:0.5;}50%{transform:scale(1.15);opacity:0.7;}} .aura{animation:aura 9s ease-in-out infinite;}
      @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      .shim{position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5) 50%,transparent);background-size:200% auto;animation:shimmer 2.8s linear infinite;}
      @keyframes bglow{0%,100%{filter:brightness(1) drop-shadow(0 0 4px currentColor);}50%{filter:brightness(1.2) drop-shadow(0 0 12px currentColor);}} .bglow{animation:bglow 3s ease-in-out infinite;}
      @keyframes wave{0%,100%{transform:scaleY(0.35);}50%{transform:scaleY(1);}}
      .w1{animation:wave .8s ease-in-out infinite;} .w2{animation:wave .8s ease-in-out .15s infinite;} .w3{animation:wave .8s ease-in-out .3s infinite;} .w4{animation:wave .8s ease-in-out .45s infinite;} .w5{animation:wave .8s ease-in-out .6s infinite;}
      .lift{transition:transform .2s,box-shadow .2s;} .lift:hover{transform:translateY(-2px) scale(1.015);}
      .cc{transition:transform .2s;} .cc:hover{transform:scale(1.025);}
      .ns::-webkit-scrollbar{display:none;} .ns{-ms-overflow-style:none;scrollbar-width:none;}
      .grain::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:999;opacity:0.4;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");}
      /* Feed scroll container */
      .feed-scroll{height:calc(100vh - 200px);overflow-y:auto;padding-right:4px;}
      .feed-scroll::-webkit-scrollbar{width:3px;} .feed-scroll::-webkit-scrollbar-track{background:transparent;} .feed-scroll::-webkit-scrollbar-thumb{background:ACCENTVAR;border-radius:99px;}
    `}</style>

    <div className="pr grain" style={{minHeight:'100vh',background:T.bg,color:T.text,transition:'background 0.6s ease',overflowX:'hidden',position:'relative'}}>

      {/* AURORA */}
      <div style={{position:'fixed',inset:0,overflow:'hidden',zIndex:0,pointerEvents:'none'}}>
        <div className="aura" style={{position:'absolute',top:'-20%',left:'20%',width:'65vw',height:'65vw',borderRadius:'50%',background:`radial-gradient(ellipse,${accent}25 0%,transparent 70%)`,filter:'blur(80px)'}}/>
        <div className="aura" style={{position:'absolute',bottom:'-15%',right:'5%',width:'50vw',height:'50vw',borderRadius:'50%',background:`radial-gradient(ellipse,${accent}15 0%,transparent 70%)`,filter:'blur(80px)',animationDelay:'-4s'}}/>
      </div>

      {/* COVER */}
      <div style={{position:'relative',zIndex:1,height:'170px',overflow:'hidden',background:isCoverImg?`url(${coverBg}) center/cover no-repeat`:coverBg}}>
        <div style={{position:'absolute',inset:0,background:T.isDark?'linear-gradient(to bottom,transparent 25%,rgba(8,11,20,0.97) 100%)':'linear-gradient(to bottom,transparent 25%,rgba(250,250,247,0.97) 100%)',zIndex:1}}/>
        {editing&&(<div style={{position:'absolute',bottom:'28px',right:'16px',zIndex:4,display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'flex-end'}}>
          {COVER_GRADIENTS.map(cg=><button key={cg.id} onClick={()=>{setDraft(p=>({...p,coverStyle:cg.id}));setCoverPrev('');}} style={{width:'22px',height:'22px',borderRadius:'50%',background:cg.g,cursor:'pointer',border:!coverPrev&&draft.coverStyle===cg.id?'2px solid white':'2px solid transparent'}}/>)}
          <button onClick={()=>fileRef.current?.click()} style={{fontSize:'11px',fontWeight:700,padding:'4px 10px',borderRadius:'99px',cursor:'pointer',background:'rgba(255,255,255,0.92)',color:'#3D3530',border:'none'}}>📷</button>
          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={onCoverFile}/>
        </div>)}
      </div>

      {/* BODY — full width sticky layout */}
      <div style={{position:'relative',zIndex:2,maxWidth:'1280px',margin:'0 auto',padding:'0 16px',display:'flex',gap:'16px',alignItems:'flex-start'}}>

        {/* ── LEFT PANEL (sticky) ── */}
        <div style={{flexShrink:0,width:'200px',position:'sticky',top:'16px',maxHeight:'calc(100vh - 32px)',overflowY:'auto',display:'flex',flexDirection:'column',gap:'12px',marginTop:'-20px',paddingBottom:'24px'}} className="ns">

          {/* CIRCLES */}
          <div style={PC}>
            <p style={{...LS,marginBottom:'10px'}}>MY CIRCLES</p>
            <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
              {CIRCLES.map(c=><div key={c.name} className="lift" style={{display:'flex',alignItems:'center',gap:'9px',padding:'7px 9px',borderRadius:'12px',cursor:'pointer',background:T.isDark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.03)'}}>
                <div style={{width:'30px',height:'30px',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',background:`${c.color}22`,flexShrink:0}}>{c.icon}</div>
                <span style={{fontSize:'12px',fontWeight:600,color:T.text}}>{c.name}</span>
              </div>)}
            </div>
          </div>

          {/* COLLECTIONS */}
          <div style={PC}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
              <p style={LS}>COLLECTIONS</p>
              <button style={{fontSize:'10px',fontWeight:600,color:accent,background:'none',border:'none',cursor:'pointer'}}>See all</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
              {COLLECTIONS.map(c=><div key={c} className="lift" style={{display:'flex',alignItems:'center',gap:'8px',padding:'6px 9px',borderRadius:'11px',cursor:'pointer',background:T.isDark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.03)'}}>
                <span style={{fontSize:'13px'}}>📁</span>
                <span style={{fontSize:'12px',fontWeight:500,color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c}</span>
              </div>)}
              <button style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 9px',borderRadius:'11px',cursor:'pointer',background:'none',border:`1.5px dashed ${accent}50`,color:accent,fontSize:'11px',fontWeight:600,width:'100%'}}>+ New</button>
            </div>
          </div>

          {/* BADGES */}
          <div style={PC}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
              <p style={LS}>BADGES</p>
              <button onClick={()=>setTab('badges')} style={{fontSize:'10px',fontWeight:600,color:accent,background:'none',border:'none',cursor:'pointer'}}>See all</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px'}}>
              {BADGES.slice(0,6).map(b=><div key={b.label} className="lift" style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',padding:'8px 4px',borderRadius:'12px',cursor:'pointer',overflow:'hidden',background:`${b.color}12`,border:`1px solid ${b.color}22`}}>
                {b.shimmer&&<div className="shim"/>}
                <span className="bglow" style={{fontSize:'20px',position:'relative',zIndex:1,color:b.color}}>{b.emoji}</span>
                <span style={{fontSize:'8px',fontWeight:900,textAlign:'center',lineHeight:1.2,position:'relative',zIndex:1,color:b.color,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',width:'100%',paddingInline:'2px'}}>{b.label}</span>
              </div>)}
            </div>
          </div>

        </div>

        {/* ── CENTER: IDENTITY + TABS + FEED SCROLL ── */}
        <div style={{flex:1,minWidth:0,marginTop:'-20px'}}>

          {/* IDENTITY CARD */}
          <div style={{...PC,marginBottom:'16px',position:'relative',overflow:'visible',borderRadius:'22px',boxShadow:T.isDark?`0 8px 40px rgba(0,0,0,0.4),0 0 0 1px ${accent}20,inset 0 1px 0 rgba(255,255,255,0.06)`:`0 8px 40px rgba(0,0,0,0.06),0 0 0 1px ${accent}15,inset 0 1px 0 rgba(255,255,255,0.95)`}}>
            <div style={{position:'absolute',inset:'-1px',borderRadius:'23px',pointerEvents:'none',background:`linear-gradient(135deg,${accent}40,transparent 50%,${accent}18)`,zIndex:-1,filter:'blur(1px)'}}/>
            <div style={{display:'flex',alignItems:'flex-start',gap:'16px'}}>
              <div style={{flexShrink:0}}>
                <div style={{width:'72px',height:'72px',borderRadius:'20px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:'20px',fontFamily:"'Playfair Display',serif",backgroundColor:accent,boxShadow:`0 0 0 3px ${T.bg},0 0 0 5px ${accent}60,0 12px 32px ${accent}50`}}>{ini(editing?draft.displayName:profile.displayName)}</div>
                {editing&&<div style={{display:'flex',gap:'4px',flexWrap:'wrap',marginTop:'8px',width:'72px'}}>{ACCENT_COLORS.map(c=><button key={c} onClick={()=>setDraft(p=>({...p,accentColor:c}))} style={{width:'18px',height:'18px',borderRadius:'50%',backgroundColor:c,cursor:'pointer',border:'none',outline:draft.accentColor===c?`3px solid ${c}`:'3px solid transparent',outlineOffset:'2px'}}/>)}</div>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                {editing?(<div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
                  <input value={draft.displayName} onChange={e=>setDraft(p=>({...p,displayName:e.target.value}))} style={{fontFamily:"'Playfair Display',serif",fontSize:'22px',fontWeight:900,background:'transparent',border:'none',borderBottom:`2px solid ${accent}`,outline:'none',color:T.text,width:'100%'}} placeholder="Your name"/>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    {canChangeHandle(profile.handleChangedAt)?(<><input value={draft.handle.replace('.feed','')} onChange={e=>setDraft(p=>({...p,handle:e.target.value.replace(/[\s.]/g,'').toLowerCase()+'.feed'}))} style={{fontSize:'13px',background:'transparent',border:'none',borderBottom:`1px solid ${T.border}`,outline:'none',color:accent,width:'120px'}}/><span style={{fontSize:'13px',fontWeight:600,color:accent}}>.feed</span></>):(<span style={{fontSize:'13px',fontWeight:600,color:accent}}>{profile.handle}</span>)}
                  </div>
                </div>):(<div>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                    <h1 className="sf" style={{fontSize:'clamp(18px,2.5vw,26px)',fontWeight:900,color:T.text,lineHeight:1.15,margin:0}}>{profile.displayName}</h1>
                    {weather&&<div style={{display:'flex',alignItems:'center',gap:'4px',padding:'3px 9px',borderRadius:'99px',background:T.isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.05)',border:`1px solid ${T.border}`}}><span style={{fontSize:'13px'}}>{weather.condition}</span><span style={{fontSize:'12px',fontWeight:700,color:T.text}}>{weather.temp}°C</span></div>}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginTop:'4px',flexWrap:'wrap',fontSize:'12px',color:T.textSub}}>
                    {clocks[0]&&<span suppressHydrationWarning>{clocks[0].time}</span>}
                    {(profile.city||profile.country)&&<span>📍 {[profile.city,profile.country].filter(Boolean).join(', ')}</span>}
                  </div>
                  <p style={{fontSize:'12px',fontWeight:600,color:accent,marginTop:'3px'}}>{profile.handle}</p>
                  {profile.bio&&<p style={{fontSize:'13px',lineHeight:1.6,color:T.textSub,marginTop:'6px',maxWidth:'500px'}}>{profile.bio}</p>}
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'6px'}}>
                    {profile.pronouns&&<span style={{fontSize:'11px',padding:'2px 9px',borderRadius:'99px',background:T.isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)',color:T.textSub}}>{profile.pronouns}</span>}
                    {profile.languages.length>0&&<span style={{fontSize:'11px',color:T.textSub}}>🌐 {profile.languages.join(' · ')}</span>}
                    {profile.website&&<a href={profile.website} target="_blank" rel="noopener noreferrer" style={{fontSize:'11px',fontWeight:600,color:accent,textDecoration:'none'}}>🔗 {profile.website.replace(/^https?:\/\//,'')}</a>}
                    <span style={{fontSize:'11px',color:T.textMuted}}>Joined {fmtDate(profile.joinDate)}</span>
                  </div>
                </div>)}
              </div>
              <div style={{flexShrink:0}}>
                {!editing?(<button onClick={startEdit} className="lift" style={{fontSize:'12px',fontWeight:600,padding:'8px 18px',borderRadius:'99px',cursor:'pointer',background:T.surface,border:`1.5px solid ${T.border}`,color:T.text}}>Edit Profile</button>):(<div style={{display:'flex',gap:'6px'}}><button onClick={()=>setEditing(false)} style={{fontSize:'12px',fontWeight:600,padding:'8px 14px',borderRadius:'99px',cursor:'pointer',background:T.isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)',border:`1px solid ${T.border}`,color:T.textSub}}>Cancel</button><button onClick={save} disabled={saving} style={{fontSize:'12px',fontWeight:700,padding:'8px 18px',borderRadius:'99px',cursor:'pointer',background:saved?'#16A34A':accent,color:'#fff',border:'none',boxShadow:`0 4px 16px ${accent}50`}}>{saved?'✓':saving?'…':'Save'}</button></div>)}
              </div>
            </div>

            {editing&&(<div style={{marginTop:'16px',paddingTop:'16px',borderTop:`1px solid ${T.border}`,display:'flex',flexDirection:'column',gap:'12px'}}>
              <div style={{position:'relative'}}><textarea value={draft.bio} onChange={e=>e.target.value.length<=160&&setDraft(p=>({...p,bio:e.target.value}))} placeholder="Short bio…" rows={2} style={{width:'100%',fontSize:'13px',padding:'10px 14px',borderRadius:'14px',resize:'none',outline:'none',background:T.isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',border:`1.5px solid ${T.border}`,color:T.text,fontFamily:"'DM Sans',sans-serif"}}/><span style={{position:'absolute',bottom:'10px',right:'12px',fontSize:'10px',color:T.textMuted}}>{160-draft.bio.length}</span></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>{(['city','country','website'] as const).map(f=><input key={f} value={draft[f]} onChange={e=>setDraft(p=>({...p,[f]:e.target.value}))} placeholder={f.charAt(0).toUpperCase()+f.slice(1)} style={{fontSize:'12px',padding:'9px 12px',borderRadius:'12px',outline:'none',background:T.isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',border:`1.5px solid ${T.border}`,color:T.text}}/>)}<select value={draft.pronouns} onChange={e=>setDraft(p=>({...p,pronouns:e.target.value}))} style={{fontSize:'12px',padding:'9px 12px',borderRadius:'12px',outline:'none',background:T.isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)',border:`1.5px solid ${T.border}`,color:T.text}}><option value="">Pronouns</option>{PRONOUNS.map(pr=><option key={pr} value={pr}>{pr}</option>)}</select></div>
              <div><p style={{...LS,marginBottom:'8px'}}>LANGUAGES</p><div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>{LANGUAGES.map(l=><button key={l} onClick={()=>toggleLang(l)} style={{fontSize:'11px',padding:'5px 12px',borderRadius:'99px',cursor:'pointer',background:draft.languages.includes(l)?`${accent}20`:T.isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.04)',border:`1.5px solid ${draft.languages.includes(l)?accent:T.border}`,color:draft.languages.includes(l)?accent:T.textSub,fontWeight:draft.languages.includes(l)?600:400}}>{l}</button>)}</div></div>
            </div>)}

            {!editing&&(<div style={{display:'flex',gap:'20px',marginTop:'14px',paddingTop:'14px',borderTop:`1px solid ${T.border}`}}>{[['12','Posts'],['0','Followers'],['0','Following'],['0','Chapters']].map(([n,l])=>(<div key={l} className="lift" style={{cursor:'pointer'}}><span className="sf" style={{fontSize:'18px',fontWeight:900,color:T.text}}>{n}</span><span style={{fontSize:'10px',fontWeight:600,marginLeft:'4px',letterSpacing:'0.08em',color:T.textMuted}}>{l.toUpperCase()}</span></div>))}</div>)}
          </div>

          {/* TABS */}
          {!editing&&<>
            <div className="ns" style={{display:'flex',marginBottom:'14px',borderBottom:`1.5px solid ${T.border}`,overflowX:'auto'}}>
              {TABS.map(t=><button key={t} onClick={()=>setTab(t.toLowerCase())} style={{padding:'10px 18px',fontSize:'13px',whiteSpace:'nowrap',flexShrink:0,fontWeight:tab===t.toLowerCase()?700:400,color:tab===t.toLowerCase()?accent:T.textMuted,background:'none',border:'none',cursor:'pointer',borderBottom:tab===t.toLowerCase()?`2.5px solid ${accent}`:'2.5px solid transparent',marginBottom:'-1.5px',transition:'color .2s'}}>{t}</button>)}
            </div>

            {/* FEED SCROLL — only posts tab scrolls */}
            <div className={tab==='posts'?'feed-scroll ns':''} style={tab==='posts'?{}:{paddingBottom:'80px'}}>

              {tab==='posts'&&<div style={{display:'flex',flexDirection:'column',gap:'12px',paddingBottom:'32px'}}>
                {SAMPLE_POSTS.map(post=>{const mc=MOOD_COLORS[post.mood]||accent;return(
                  <div key={post.id} className="lift" style={{background:T.surface,backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px) saturate(180%)',border:`1px solid ${T.border}`,borderRadius:'20px',padding:'18px',position:'relative',overflow:'hidden',boxShadow:T.isDark?`0 4px 20px rgba(0,0,0,0.25),0 0 0 1px ${mc}12`:`0 2px 16px rgba(0,0,0,0.04),0 0 0 1px ${mc}10`}}>
                    <div style={{position:'absolute',top:'-40%',right:'-5%',width:'180px',height:'180px',borderRadius:'50%',background:`radial-gradient(ellipse,${mc}18 0%,transparent 70%)`,filter:'blur(25px)',pointerEvents:'none'}}/>
                    <div style={{height:'2px',borderRadius:'99px',background:`linear-gradient(90deg,${mc},${mc}00)`,marginBottom:'12px'}}/>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                      <div style={{width:'34px',height:'34px',borderRadius:'11px',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:'13px',fontFamily:"'Playfair Display',serif",background:accent,boxShadow:`0 3px 10px ${accent}40`}}>{ini(profile.displayName)}</div>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                          <span style={{fontSize:'13px',fontWeight:700,color:T.text}}>{profile.displayName}</span>
                          <span style={{fontSize:'10px',fontWeight:600,padding:'2px 7px',borderRadius:'99px',background:`${mc}18`,color:mc}}>{post.mood}</span>
                        </div>
                        <div style={{display:'flex',gap:'5px',fontSize:'11px',color:T.textMuted}}><span>{profile.handle}</span><span>·</span><span>{post.city}</span><span>·</span><span>{post.time}</span></div>
                      </div>
                    </div>
                    {post.hasImage&&<div style={{borderRadius:'14px',marginBottom:'10px',height:'150px',background:'linear-gradient(135deg,#BAE6FD,#60A5FA,#818CF8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'44px'}}>🌸</div>}
                    <p style={{fontSize:'13px',lineHeight:1.65,color:T.text,position:'relative',zIndex:1}}>{post.text.split(' ').map((w,i)=>w.startsWith('+')?<span key={i} style={{fontWeight:600,color:mc}}>{w} </span>:w+' ')}</p>
                    <div style={{display:'flex',alignItems:'center',gap:'16px',marginTop:'12px',paddingTop:'10px',borderTop:`1px solid ${T.border}`,fontSize:'12px',color:T.textMuted}}>
                      <button className="lift" style={{display:'flex',alignItems:'center',gap:'4px',background:'none',border:'none',cursor:'pointer',color:T.textMuted,fontSize:'12px'}}>♡ {post.likes}</button>
                      <button className="lift" style={{display:'flex',alignItems:'center',gap:'4px',background:'none',border:'none',cursor:'pointer',color:T.textMuted,fontSize:'12px'}}>◇ {post.comments}</button>
                      <button className="lift" style={{background:'none',border:'none',cursor:'pointer',color:T.textMuted,fontSize:'12px'}}>⟳</button>
                      <button className="lift" style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',color:T.textMuted,fontSize:'13px'}}>☆</button>
                    </div>
                  </div>
                );})}
              </div>}

              {tab==='notebook'&&<div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}><p style={LS}>YOUR CHAPTERS</p><button style={{fontSize:'12px',fontWeight:700,padding:'9px 18px',borderRadius:'99px',cursor:'pointer',background:accent,color:'#fff',border:'none',boxShadow:`0 4px 14px ${accent}50`}}>+ New Chapter</button></div><div style={{borderRadius:'24px',padding:'56px 28px',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',background:T.isDark?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.6)',backdropFilter:'blur(16px)',border:`2px dashed ${T.border}`}}><div style={{fontSize:'52px',marginBottom:'14px',filter:`drop-shadow(0 0 18px ${accent}50)`}}>📖</div><h2 className="sf" style={{fontSize:'20px',fontWeight:900,color:T.text,margin:'0 0 8px'}}>Your story begins here</h2><p style={{fontSize:'13px',color:T.textSub,maxWidth:'300px',marginBottom:'20px',lineHeight:1.6}}>A chapter is a curated story — up to 10 photos + 1 video, with a title, mood, and your words.</p><button style={{fontSize:'13px',fontWeight:700,padding:'11px 24px',borderRadius:'99px',background:accent,color:'#fff',border:'none',cursor:'pointer',boxShadow:`0 5px 20px ${accent}55`}}>Create First Chapter</button></div></div>}

              {tab==='badges'&&<div><p style={{...LS,marginBottom:'14px'}}>EARNED</p><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'20px'}}>{BADGES.map(b=><div key={b.label} className="lift" style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:'9px',padding:'18px',borderRadius:'20px',cursor:'pointer',overflow:'hidden',background:T.isDark?`${b.color}12`:`${b.color}10`,border:`1.5px solid ${b.color}28`,boxShadow:`0 5px 20px ${b.color}18`}}>{b.shimmer&&<div className="shim"/>}<span className="bglow" style={{fontSize:'36px',position:'relative',zIndex:1,color:b.color}}>{b.emoji}</span><span style={{fontSize:'11px',fontWeight:900,textAlign:'center',lineHeight:1.3,position:'relative',zIndex:1,color:b.color}}>{b.label}</span><span style={{fontSize:'9px',fontWeight:700,padding:'2px 9px',borderRadius:'99px',position:'relative',zIndex:1,background:`${b.color}22`,color:b.color}}>{b.rarity}</span></div>)}</div><p style={{...LS,marginBottom:'10px'}}>LOCKED</p><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>{LOCKED.map(b=><div key={b.label} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'9px',padding:'18px',borderRadius:'20px',background:T.isDark?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)',border:`1.5px dashed ${T.border}`,opacity:0.55}}><span style={{fontSize:'36px',filter:'grayscale(1)'}}>{b.emoji}</span><span style={{fontSize:'11px',fontWeight:900,textAlign:'center',color:T.textMuted}}>{b.label}</span><span style={{fontSize:'9px',padding:'2px 9px',borderRadius:'99px',background:T.isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)',color:T.textMuted}}>Locked</span></div>)}</div></div>}

              {tab==='collections'&&<div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}><p style={LS}>MY COLLECTIONS</p><button style={{fontSize:'12px',fontWeight:700,padding:'7px 14px',borderRadius:'99px',cursor:'pointer',background:`${accent}18`,border:`1.5px dashed ${accent}55`,color:accent}}>+ New</button></div><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'10px'}}>{COLLECTIONS.map(c=><div key={c} className="lift" style={{padding:'14px',borderRadius:'16px',cursor:'pointer',display:'flex',alignItems:'center',gap:'10px',background:T.surface,backdropFilter:'blur(16px)',border:`1px solid ${T.border}`}}><div style={{width:'36px',height:'36px',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',background:`${accent}18`}}>📁</div><span style={{fontSize:'13px',fontWeight:600,color:T.text}}>{c}</span></div>)}</div></div>}

              {tab==='circles'&&<div><p style={{...LS,marginBottom:'14px'}}>MY CIRCLES</p><div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{CIRCLES.map(c=><div key={c.name} className="lift" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderRadius:'16px',cursor:'pointer',background:T.surface,backdropFilter:'blur(16px)',border:`1px solid ${T.border}`}}><div style={{display:'flex',alignItems:'center',gap:'12px'}}><div style={{width:'40px',height:'40px',borderRadius:'14px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',background:`${c.color}20`,border:`1px solid ${c.color}28`}}>{c.icon}</div><span style={{fontSize:'13px',fontWeight:600,color:T.text}}>{c.name}</span></div><span style={{fontSize:'11px',color:T.textMuted}}>0 members →</span></div>)}</div></div>}

            </div>
          </>}
        </div>

        {/* ── RIGHT PANEL (sticky) ── */}
        {!editing&&<div style={{flexShrink:0,width:'220px',position:'sticky',top:'16px',maxHeight:'calc(100vh - 32px)',overflowY:'auto',display:'flex',flexDirection:'column',gap:'12px',marginTop:'-20px',paddingBottom:'24px'}} className="ns">

          {/* WORLD CLOCK */}
          <div style={PC}><p style={{...LS,marginBottom:'10px'}}>MY WORLD CLOCK</p><div style={{display:'flex',flexDirection:'column',gap:'7px'}}>{clocks.map(city=>{const {bg,sub}=clockStyle(city.hour,T.isDark);return(<div key={city.name} className="cc" style={{borderRadius:'14px',padding:'12px',cursor:'pointer',background:bg,boxShadow:'0 4px 14px rgba(0,0,0,0.16)'}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><p suppressHydrationWarning style={{fontSize:'18px',fontWeight:900,color:'#fff',lineHeight:1,letterSpacing:'-0.02em'}}>{city.time}</p><p style={{fontSize:'10px',fontWeight:600,marginTop:'2px',color:sub}}>{city.name}</p></div><span style={{fontSize:'18px'}}>{clockIcon(city.hour)}</span></div></div>);})}</div></div>

          {/* NOW PLAYING */}
          <div style={PC}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}><p style={LS}>NOW PLAYING</p><button onClick={()=>{setNpDraft({track:profile.nowPlaying.track,artist:profile.nowPlaying.artist});setEditNP(true);}} style={{fontSize:'10px',fontWeight:600,color:accent,background:'none',border:'none',cursor:'pointer'}}>Edit</button></div>
            {editNP?(<div style={{display:'flex',flexDirection:'column',gap:'7px'}}><input value={npDraft.track} onChange={e=>setNpDraft(p=>({...p,track:e.target.value}))} placeholder="Track" style={{fontSize:'11px',padding:'7px 9px',borderRadius:'9px',outline:'none',background:T.isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.04)',border:`1px solid ${T.border}`,color:T.text}}/><input value={npDraft.artist} onChange={e=>setNpDraft(p=>({...p,artist:e.target.value}))} placeholder="Artist" style={{fontSize:'11px',padding:'7px 9px',borderRadius:'9px',outline:'none',background:T.isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.04)',border:`1px solid ${T.border}`,color:T.text}}/><div style={{display:'flex',gap:'5px'}}><button onClick={()=>setEditNP(false)} style={{flex:1,fontSize:'10px',fontWeight:600,padding:'6px',borderRadius:'8px',cursor:'pointer',background:T.isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)',border:`1px solid ${T.border}`,color:T.textSub}}>Cancel</button><button onClick={saveNowPlaying} style={{flex:1,fontSize:'10px',fontWeight:700,padding:'6px',borderRadius:'8px',cursor:'pointer',background:accent,color:'#fff',border:'none'}}>Save</button></div></div>):(
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px',borderRadius:'13px',background:T.isDark?`${accent}15`:`${accent}10`,border:`1px solid ${accent}22`}}><div style={{width:'36px',height:'36px',borderRadius:'10px',background:`linear-gradient(135deg,${accent},${accent}90)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',flexShrink:0}}>🎵</div><div style={{flex:1,minWidth:0}}><p style={{fontSize:'11px',fontWeight:700,color:T.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{profile.nowPlaying.track}</p><p style={{fontSize:'10px',color:T.textSub,marginTop:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{profile.nowPlaying.artist}</p></div>{profile.nowPlaying.playing&&<div style={{display:'flex',alignItems:'center',gap:'2px',flexShrink:0}}>{['w1','w2','w3','w4','w5'].map(w=><div key={w} className={w} style={{width:'2.5px',height:'14px',borderRadius:'99px',background:accent,transformOrigin:'bottom'}}/>)}</div>}</div>)}
          </div>

          {/* MOOD GRAPH */}
          <div style={PC}><p style={{...LS,marginBottom:'12px'}}>MOOD THIS WEEK</p><div style={{display:'flex',alignItems:'flex-end',gap:'4px',height:'52px'}}>{MOOD_WEEK.map(m=>{const mc=MOOD_COLORS[m.mood]||accent;const h=Math.round((m.val/maxMood)*100);return(<div key={m.day} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}><div className="lift" title={`${m.day}: ${m.mood}`} style={{width:'100%',height:`${h}%`,minHeight:'5px',borderRadius:'5px',background:`linear-gradient(to top,${mc},${mc}90)`,boxShadow:`0 2px 6px ${mc}35`,cursor:'pointer'}}/><span style={{fontSize:'8px',fontWeight:700,color:T.textMuted}}>{m.day.slice(0,1)}</span></div>);})}</div><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'8px'}}><span style={{fontSize:'10px',color:T.textSub}}>Best: <span style={{fontWeight:700,color:MOOD_COLORS['Joyful']}}>Joyful 😄</span></span><span style={{fontSize:'9px',color:T.textMuted}}>7 days</span></div></div>

          {/* COUNTRIES */}
          <div style={PC}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'9px'}}><p style={LS}>COUNTRIES</p><span style={{fontSize:'10px',fontWeight:700,color:accent}}>{profile.visitedCountries.length}</span></div>
            <div style={{position:'relative',width:'100%',paddingBottom:'50%',borderRadius:'10px',overflow:'hidden',background:T.isDark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)',border:`1px solid ${T.border}`}}>
              <div style={{position:'absolute',inset:0}}>
                <svg viewBox="0 0 100 50" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.14}}>
                  <path d="M8,18 Q15,14 22,18 Q24,25 20,30 Q13,32 8,28 Z" fill={T.isDark?'#fff':'#888'} opacity="0.6"/>
                  <path d="M26,14 Q38,11 45,16 Q47,24 44,32 Q36,36 28,30 Q24,22 26,14 Z" fill={T.isDark?'#fff':'#888'} opacity="0.6"/>
                  <path d="M44,14 Q58,12 64,20 Q65,28 60,34 Q52,36 46,28 Q42,22 44,14 Z" fill={T.isDark?'#fff':'#888'} opacity="0.6"/>
                  <path d="M65,14 Q78,12 84,18 Q86,26 82,32 Q75,34 68,28 Q63,22 65,14 Z" fill={T.isDark?'#fff':'#888'} opacity="0.6"/>
                  <path d="M76,32 Q82,30 86,36 Q84,42 78,42 Q73,40 76,32 Z" fill={T.isDark?'#fff':'#888'} opacity="0.6"/>
                  <path d="M24,34 Q32,32 36,38 Q34,44 28,44 Q22,42 24,34 Z" fill={T.isDark?'#fff':'#888'} opacity="0.6"/>
                </svg>
                {Object.entries(COUNTRY_REGIONS).map(([code,info])=>{const visited=profile.visitedCountries.includes(code);return(<button key={code} onClick={()=>toggleCountry(code)} title={code} style={{position:'absolute',left:`${info.x}%`,top:`${info.y}%`,transform:'translate(-50%,-50%)',background:'none',border:'none',padding:0,fontSize:visited?'10px':'7px',opacity:visited?1:0.28,filter:visited?`drop-shadow(0 0 4px ${accent})`:'none',cursor:'pointer',transition:'all .2s'}}>{visited?info.label:'●'}</button>);})}
              </div>
            </div>
            <p style={{fontSize:'9px',color:T.textMuted,marginTop:'6px',textAlign:'center'}}>Tap to add · {profile.visitedCountries.length}/{Object.keys(COUNTRY_REGIONS).length}</p>
          </div>

          {/* MOMENTS */}
          <div style={PC}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}><p style={LS}>MY MOMENTS</p><button style={{fontSize:'10px',fontWeight:600,color:accent,background:'none',border:'none',cursor:'pointer'}}>See all</button></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'7px'}}><div className="lift" style={{borderRadius:'13px',height:'72px',overflow:'hidden',cursor:'pointer',background:'linear-gradient(135deg,#3B82F6,#6366F1)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',boxShadow:'0 3px 12px rgba(59,130,246,0.32)'}}><span style={{fontSize:'22px'}}>🏙️</span><div style={{position:'absolute',bottom:'5px',left:'7px',fontSize:'9px',fontWeight:900,color:'rgba(255,255,255,0.9)'}}>7:15 AM</div></div><div className="lift" style={{borderRadius:'13px',height:'72px',cursor:'pointer',background:'linear-gradient(135deg,#F59E0B,#EF4444)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 12px rgba(245,158,11,0.32)'}}><span style={{fontSize:'22px'}}>😄</span></div><div className="lift" style={{gridColumn:'span 2',borderRadius:'13px',padding:'10px',cursor:'pointer',background:T.isDark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.04)',border:`1px solid ${T.border}`}}><p style={{fontSize:'11px',fontWeight:600,color:T.text,lineHeight:1.4}}>Just read something inspiring! ✨</p><p style={{fontSize:'9px',fontWeight:900,letterSpacing:'0.1em',color:T.textMuted,marginTop:'3px'}}>THU</p></div></div></div>

          {/* THEMES */}
          <div style={PC}><p style={{...LS,marginBottom:'10px'}}>MY THEMES</p><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'7px'}}>{[{bg:'#DBEAFE',dot:'#3B82F6'},{bg:'#FEF3C7',dot:'#F97316'},{bg:'#EDE9FE',dot:'#7C3AED'},{bg:'#DCFCE7',dot:'#16A34A'}].map((sw,i)=><div key={i} className="lift" style={{borderRadius:'13px',display:'flex',alignItems:'center',justifyContent:'center',height:'44px',cursor:'pointer',background:sw.bg,border:'1px solid rgba(0,0,0,0.04)'}}><div style={{width:'20px',height:'20px',borderRadius:'50%',background:sw.dot,boxShadow:`0 2px 6px ${sw.dot}50`}}/></div>)}<div className="lift" style={{gridColumn:'span 2',borderRadius:'13px',height:'34px',cursor:'pointer',background:`linear-gradient(135deg,${accent}28,${accent}60)`,border:`1px solid ${accent}28`,boxShadow:`0 3px 12px ${accent}22`}}/></div></div>

        </div>}
      </div>
    </div>
  </>);
}
