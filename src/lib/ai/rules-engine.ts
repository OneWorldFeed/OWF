/* ============================================================
   OWF RULES ENGINE v3 — Zero API Key Intelligence Layer

   18 capabilities, no API key required:
   1.  Greeting — season + mood aware
   2.  Time — live city time or full world grid
   3.  Date — current date in any city
   4.  Season awareness — adapts by hemisphere
   5.  Mood detection — from text signals
   6.  Mood of the day — poetic daily rotation
   7.  City facts — culture, population, timezone, season
   8.  City comparison — compare two cities
   9.  Post ideas — by city and mood
   10. Caption writing — templated
   11. Tag suggestions — content + mood aware
   12. Mood-to-tag mapping
   13. OWF platform help
   14. OWF glossary
   15. Feed summary
   16. Encouragement
   17. Conversation continuity
   18. Weather/News Pro nudge
============================================================ */

/* ── SEASON ───────────────────────────────────────────────── */
function getSeason(hemisphere: 'north' | 'south' = 'north'): string {
  const m = new Date().getMonth();
  const seasons = hemisphere === 'north'
    ? ['winter','winter','spring','spring','spring','summer','summer','summer','autumn','autumn','autumn','winter']
    : ['summer','summer','autumn','autumn','autumn','winter','winter','winter','spring','spring','spring','summer'];
  return seasons[m];
}

const SEASON_PHRASES: Record<string, string> = {
  spring: 'The world is waking up — something new is in the air.',
  summer: 'Energy is high and the days are long.',
  autumn: 'A quieter, more reflective mood is settling in.',
  winter: 'The world is turning inward — stillness and warmth.',
};

/* ── MOOD SIGNALS ─────────────────────────────────────────── */
const MOOD_SIGNALS: Record<string, string[]> = {
  electric:    ['energy','electric','alive','fire','buzz','hype','lit','festival','music','dance','night','crowd'],
  joyful:      ['joy','happy','laugh','smile','celebrate','fun','love','wonderful','amazing','beautiful','grateful'],
  reflective:  ['reflect','memory','remember','think','quiet','still','season','years','past','moment','blossom'],
  hopeful:     ['hope','future','dream','build','grow','start','begin','harvest','seed','community','together'],
  ambitious:   ['pitch','launch','startup','goal','hustle','grind','work','success','achieve','push','rise'],
  curious:     ['discover','found','explore','hidden','wonder','strange','interesting','learn','ancient','secret'],
  resilient:   ['brutal','hard','struggle','survive','persist','winter','cold','tough','challenge','overcome'],
  melancholic: ['miss','gone','lost','alone','sad','grey','rain','empty','longing','ache','distance'],
  calm:        ['calm','peace','serene','slow','breathe','rest','gentle','flow','ease','morning','sunrise'],
};

export function detectMoodFromText(text: string): string {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};
  for (const [mood, signals] of Object.entries(MOOD_SIGNALS)) {
    scores[mood] = signals.filter(s => lower.includes(s)).length;
  }
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return top[1] > 0 ? top[0] : 'electric';
}

/* ── MOOD OF THE DAY ──────────────────────────────────────── */
const DAILY_MOODS = [
  { mood: 'electric',   text: 'The world is buzzing today — a current of restless energy running from city to city, like a song no one can get out of their head.' },
  { mood: 'reflective', text: 'Something quiet is moving through the feed today. People are looking back, sitting with memories, turning things over slowly.' },
  { mood: 'hopeful',    text: 'There is a thread of hope running through the voices today — seeds being planted, futures being imagined, communities reaching toward something.' },
  { mood: 'ambitious',  text: 'The feed is in motion today. Launches, pitches, new beginnings — the world is building something and everyone seems to know it.' },
  { mood: 'curious',    text: 'A spirit of discovery is alive in the feed today. Hidden streets, unfamiliar cities, unexpected finds — the world is full of questions.' },
  { mood: 'joyful',     text: 'The feed is warm today. Laughter, colour, gratitude — small beautiful moments accumulating like light through a window.' },
  { mood: 'resilient',  text: 'Something steady and strong is moving through the feed today — people holding on, showing up, choosing to continue.' },
];

export function getMoodOfTheDay(): { mood: string; text: string } {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_MOODS[day % DAILY_MOODS.length];
}

/* ── CITY DATA ────────────────────────────────────────────── */
const CITY_FACTS: Record<string, { known: string; culture: string; population: string; tz: string; feel: string; hemisphere: 'north'|'south' }> = {
  'lagos':        { known: 'Afrobeats, Nollywood, and one of Africa most electric economies', culture: 'vibrant, entrepreneurial, loud with music and ambition', population: '15 million+', tz: 'WAT (UTC+1)', feel: 'electric', hemisphere: 'north' },
  'tokyo':        { known: 'precision, street food, cherry blossoms, and neon-lit silence', culture: 'deeply ceremonial, quietly innovative, layered with beauty', population: '14 million+', tz: 'JST (UTC+9)', feel: 'curious', hemisphere: 'north' },
  'cairo':        { known: 'the pyramids, the Nile, and five thousand years of continuous civilization', culture: 'ancient and modern at once — merchants, scholars, and storytellers', population: '21 million+', tz: 'EET (UTC+2)', feel: 'reflective', hemisphere: 'north' },
  'nairobi':      { known: 'tech innovation, safari culture, and a young fast-moving population', culture: 'entrepreneurial, community-driven, globally connected', population: '5 million+', tz: 'EAT (UTC+3)', feel: 'hopeful', hemisphere: 'south' },
  'accra':        { known: 'Afrobeats, Year of Return, and a growing creative economy', culture: 'warm, celebratory, proud of its heritage and future', population: '3 million+', tz: 'GMT (UTC+0)', feel: 'joyful', hemisphere: 'north' },
  'london':       { known: 'reinvention — always absorbing new cultures, sounds, and ideas', culture: 'layered, multicultural, quietly proud and perpetually curious', population: '9 million+', tz: 'GMT/BST', feel: 'reflective', hemisphere: 'north' },
  'paris':        { known: 'art, philosophy, food, and the most copied aesthetic in the world', culture: 'intellectual, sensual, obsessed with beauty and argument', population: '11 million+', tz: 'CET (UTC+1)', feel: 'calm', hemisphere: 'north' },
  'berlin':       { known: 'techno, tech startups, raw creativity, and a city still becoming itself', culture: 'open, experimental, scarred by history and alive with art', population: '3.7 million+', tz: 'CET (UTC+1)', feel: 'resilient', hemisphere: 'north' },
  'new york':     { known: 'the skyline, the pace, and the feeling that anything is possible', culture: 'relentless, diverse, loud and soft in equal measure', population: '8 million+', tz: 'EST (UTC-5)', feel: 'ambitious', hemisphere: 'north' },
  'los angeles':  { known: 'film, music, sun, and the dream factory of the world', culture: 'creative, sprawling, optimistic — always building a new version of itself', population: '4 million+', tz: 'PST (UTC-8)', feel: 'hopeful', hemisphere: 'north' },
  'seoul':        { known: 'K-pop, K-drama, skincare, and one of the most wired cities on earth', culture: 'intense, stylish, deeply communal, and quietly poetic', population: '9.7 million+', tz: 'KST (UTC+9)', feel: 'electric', hemisphere: 'north' },
  'mumbai':       { known: 'Bollywood, the sea, resilience, and a city that never sleeps', culture: 'chaotic and tender — a million stories happening at once', population: '20 million+', tz: 'IST (UTC+5:30)', feel: 'resilient', hemisphere: 'north' },
  'dubai':        { known: 'ambition made physical — towers, trade routes, and reinvention', culture: 'future-facing, cosmopolitan, a crossroads of the world', population: '3.5 million+', tz: 'GST (UTC+4)', feel: 'ambitious', hemisphere: 'north' },
  'sao paulo':    { known: 'Brazilian music, street art, food culture, and relentless creativity', culture: 'loud, layered, intensely alive — the heartbeat of South America', population: '12 million+', tz: 'BRT (UTC-3)', feel: 'electric', hemisphere: 'south' },
  'istanbul':     { known: 'straddling two continents, ten centuries of empire, and incredible food', culture: 'complex, hospitable, caught beautifully between east and west', population: '15 million+', tz: 'TRT (UTC+3)', feel: 'curious', hemisphere: 'north' },
  'singapore':    { known: 'efficiency, diversity, hawker food culture, and tropical modernism', culture: 'meticulous, multicultural, a city-state that works', population: '5.9 million+', tz: 'SGT (UTC+8)', feel: 'calm', hemisphere: 'north' },
  'sydney':       { known: 'the Opera House, the harbour, surf culture, and easy warmth', culture: 'relaxed but driven — sun-soaked ambition', population: '5.3 million+', tz: 'AEDT (UTC+11)', feel: 'joyful', hemisphere: 'south' },
  'amsterdam':    { known: 'canals, cycling culture, world-class museums, and liberal spirit', culture: 'open, tolerant, quietly creative', population: '900k+', tz: 'CET (UTC+1)', feel: 'calm', hemisphere: 'north' },
  'johannesburg': { known: 'gold, the struggle, and a post-apartheid city in constant reinvention', culture: 'complex, resilient, culturally rich and politically alive', population: '6 million+', tz: 'SAST (UTC+2)', feel: 'resilient', hemisphere: 'south' },
  'bangkok':      { known: 'temples, street food, nightlife, and a city of beautiful contradictions', culture: 'warm, chaotic, deeply spiritual and intensely modern', population: '10 million+', tz: 'ICT (UTC+7)', feel: 'curious', hemisphere: 'north' },
  'mexico city':  { known: 'muralism, mezcal, ancient ruins under a modern city, and incredible food', culture: 'proud, creative, politically charged, deeply alive', population: '9 million+', tz: 'CST (UTC-6)', feel: 'electric', hemisphere: 'north' },
  'buenos aires': { known: 'tango, steak, European architecture, and passionate politics', culture: 'intense, romantic, melancholic and joyful at once', population: '3 million+', tz: 'ART (UTC-3)', feel: 'melancholic', hemisphere: 'south' },
  'casablanca':   { known: 'commerce, coastal life, and the gateway between Africa and Europe', culture: 'modern and traditional in constant conversation', population: '4 million+', tz: 'WET (UTC+1)', feel: 'curious', hemisphere: 'north' },
};

const CITY_TZ: Record<string, { tz: string; name: string }> = {
  'la':            { tz: 'America/Los_Angeles',            name: 'Los Angeles'   },
  'los angeles':   { tz: 'America/Los_Angeles',            name: 'Los Angeles'   },
  'new york':      { tz: 'America/New_York',               name: 'New York'      },
  'nyc':           { tz: 'America/New_York',               name: 'New York'      },
  'london':        { tz: 'Europe/London',                  name: 'London'        },
  'paris':         { tz: 'Europe/Paris',                   name: 'Paris'         },
  'tokyo':         { tz: 'Asia/Tokyo',                     name: 'Tokyo'         },
  'lagos':         { tz: 'Africa/Lagos',                   name: 'Lagos'         },
  'dubai':         { tz: 'Asia/Dubai',                     name: 'Dubai'         },
  'nairobi':       { tz: 'Africa/Nairobi',                 name: 'Nairobi'       },
  'berlin':        { tz: 'Europe/Berlin',                  name: 'Berlin'        },
  'seoul':         { tz: 'Asia/Seoul',                     name: 'Seoul'         },
  'cairo':         { tz: 'Africa/Cairo',                   name: 'Cairo'         },
  'sydney':        { tz: 'Australia/Sydney',               name: 'Sydney'        },
  'singapore':     { tz: 'Asia/Singapore',                 name: 'Singapore'     },
  'mumbai':        { tz: 'Asia/Kolkata',                   name: 'Mumbai'        },
  'chicago':       { tz: 'America/Chicago',                name: 'Chicago'       },
  'toronto':       { tz: 'America/Toronto',                name: 'Toronto'       },
  'accra':         { tz: 'Africa/Accra',                   name: 'Accra'         },
  'istanbul':      { tz: 'Europe/Istanbul',                name: 'Istanbul'      },
  'amsterdam':     { tz: 'Europe/Amsterdam',               name: 'Amsterdam'     },
  'sao paulo':     { tz: 'America/Sao_Paulo',              name: 'Sao Paulo'     },
  'mexico city':   { tz: 'America/Mexico_City',            name: 'Mexico City'   },
  'johannesburg':  { tz: 'Africa/Johannesburg',            name: 'Johannesburg'  },
  'bangkok':       { tz: 'Asia/Bangkok',                   name: 'Bangkok'       },
  'buenos aires':  { tz: 'America/Argentina/Buenos_Aires', name: 'Buenos Aires'  },
  'casablanca':    { tz: 'Africa/Casablanca',              name: 'Casablanca'    },
  'moscow':        { tz: 'Europe/Moscow',                  name: 'Moscow'        },
  'beijing':       { tz: 'Asia/Shanghai',                  name: 'Beijing'       },
  'shanghai':      { tz: 'Asia/Shanghai',                  name: 'Shanghai'      },
  'manila':        { tz: 'Asia/Manila',                    name: 'Manila'        },
  'miami':         { tz: 'America/New_York',               name: 'Miami'         },
  'miami beach':   { tz: 'America/New_York',               name: 'Miami'         },
  'san francisco': { tz: 'America/Los_Angeles',            name: 'San Francisco' },
  'sf':            { tz: 'America/Los_Angeles',            name: 'San Francisco' },
  'riyadh':        { tz: 'Asia/Riyadh',                    name: 'Riyadh'        },
  'kuala lumpur':  { tz: 'Asia/Kuala_Lumpur',              name: 'Kuala Lumpur'  },
  'jakarta':       { tz: 'Asia/Jakarta',                   name: 'Jakarta'       },
};

function getCityTime(key: string): string | null {
  const val = CITY_TZ[key];
  if (!val) return null;
  try {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: val.tz });
  } catch { return null; }
}

function getWorldTimeGrid(): string {
  const cols = [
    { key: 'los angeles', label: 'LA' },
    { key: 'new york',    label: 'New York' },
    { key: 'london',      label: 'London' },
    { key: 'lagos',       label: 'Lagos' },
    { key: 'cairo',       label: 'Cairo' },
    { key: 'dubai',       label: 'Dubai' },
    { key: 'mumbai',      label: 'Mumbai' },
    { key: 'singapore',   label: 'Singapore' },
    { key: 'tokyo',       label: 'Tokyo' },
    { key: 'sydney',      label: 'Sydney' },
  ];
  return cols.map(c => `${c.label}: ${getCityTime(c.key) || '—'}`).join('  ·  ');
}

/* ── TAG SUGGESTIONS ──────────────────────────────────────── */
export function suggestTags(text: string, city?: string): string[] {
  const lower = text.toLowerCase();
  const tags = new Set<string>();
  if (city) {
    for (const key of Object.keys(CITY_FACTS)) {
      if (city.toLowerCase().includes(key)) { tags.add('+' + key.replace(/ /g, '')); break; }
    }
  }
  if (/music|song|concert|festival|beat/.test(lower))  tags.add('+music');
  if (/art|paint|gallery|design|mural/.test(lower))    tags.add('+art');
  if (/food|eat|cook|restaurant|cuisine/.test(lower))  tags.add('+food');
  if (/travel|journey|explore|wander/.test(lower))     tags.add('+travel');
  if (/tech|code|startup|app|digital/.test(lower))     tags.add('+tech');
  if (/nature|forest|ocean|mountain/.test(lower))      tags.add('+nature');
  if (/community|together|local/.test(lower))          tags.add('+community');
  if (/fashion|style|outfit/.test(lower))              tags.add('+fashion');
  if (/sport|football|run|fitness/.test(lower))        tags.add('+sport');
  if (/film|movie|cinema/.test(lower))                 tags.add('+film');
  if (/coffee|cafe|tea|brunch/.test(lower))            tags.add('+coffee');
  if (/poetry|poem|write|writing/.test(lower))         tags.add('+writing');
  return Array.from(tags).slice(0, 5);
}

const MOOD_TAGS: Record<string, string[]> = {
  electric:    ['+music', '+nightlife', '+energy', '+festival'],
  joyful:      ['+joy', '+gratitude', '+community', '+celebration'],
  reflective:  ['+writing', '+memory', '+quiet', '+art'],
  hopeful:     ['+community', '+growth', '+future', '+together'],
  ambitious:   ['+startup', '+hustle', '+tech', '+goals'],
  curious:     ['+travel', '+discover', '+urban', '+explore'],
  resilient:   ['+community', '+strength', '+together', '+real'],
  melancholic: ['+writing', '+art', '+memory', '+quiet'],
  calm:        ['+morning', '+nature', '+peace', '+slow'],
};

/* ── POST IDEAS ───────────────────────────────────────────── */
const POST_IDEAS_BY_MOOD: Record<string, string[]> = {
  electric:    ['Share the sound that defined your night', 'Post the moment the energy shifted', 'What song is the city playing right now?'],
  joyful:      ['Share one small thing that made you smile today', 'Post the colour of your morning', 'What are you grateful for in your city?'],
  reflective:  ['Write about a place that changed you', 'Share a memory tied to a city', 'What does your city feel like at this hour?'],
  hopeful:     ['What are you building right now?', 'Share the seed of an idea', 'What does progress look like in your community?'],
  ambitious:   ['Post your current goal in one sentence', 'Share what you shipped this week', 'What does hustle look like where you are?'],
  curious:     ['Share a hidden spot in your city', 'Post something you discovered recently', 'What surprised you about where you live?'],
  resilient:   ['Share how you kept going when it was hard', 'Post what strength looks like in your city', 'What does your community do when things are tough?'],
  melancholic: ['Share something beautiful that is gone', 'Write about the city you miss', 'What do you wish you had said?'],
  calm:        ['Post the quietest moment of your day', 'Share your morning ritual', 'What does peace look like where you are?'],
};

const POST_IDEAS_BY_CITY: Record<string, string[]> = {
  'lagos':       ['Share the sound of Lagos right now', 'Post an Afrobeats moment', 'What is the hustle looking like today?'],
  'tokyo':       ['Share a quiet Tokyo moment', 'Post something from a neighbourhood tourists miss', 'What does precision look like in everyday life?'],
  'cairo':       ['Share the Nile at a specific hour', 'Post something ancient next to something modern', 'What does Cairo sound like right now?'],
  'london':      ['Post a rainy London moment', 'Share something from your corner of the city', 'What neighbourhood energy are you feeling?'],
  'paris':       ['Share a small Parisian pleasure', 'Post the light in Paris right now', 'What are people talking about in your neighbourhood?'],
  'nairobi':     ['Share something from the tech scene', 'Post a nature or safari moment', 'What is the energy of young Nairobi?'],
  'seoul':       ['Share a late-night Seoul moment', 'Post something from a street stall', 'What cultural moment are you living right now?'],
  'berlin':      ['Share a street art find', 'Post something from the underground scene', 'What does creative Berlin look like today?'],
  'new york':    ['Post what the city looks like at this hour', 'Share something only locals know', 'What neighbourhood are you in right now?'],
  'los angeles': ['Share the LA sky right now', 'Post a moment from a creative project', 'What does the city feel like today?'],
  'accra':       ['Share the Accra heat and beauty', 'Post something from the creative economy', 'What does joy look like in Accra today?'],
  'mumbai':      ['Share a monsoon moment', 'Post the energy of the city at this hour', 'What story is Mumbai telling today?'],
};

const CAPTION_TEMPLATES = [
  (city: string, mood: string) => `${city} at this hour. The ${mood} is unmistakable.`,
  (city: string, mood: string) => `Something ${mood} in the air over ${city} today.`,
  (city: string, _mood: string) => `${city} never looks the same twice.`,
  (_city: string, mood: string) => `This is what ${mood} feels like from here.`,
  (city: string, _mood: string) => `A moment from ${city} that needed to be shared.`,
  (city: string, mood: string) => `${city}. ${mood.charAt(0).toUpperCase() + mood.slice(1)}.`,
];

/* ── PLATFORM HELP ────────────────────────────────────────── */
const PLATFORM_HELP: Array<{ pattern: RegExp; answer: string }> = [
  { pattern: /handle|\.feed/,               answer: 'On OWF, handles end in .feed — like amaradiallo.feed. No @ symbol anywhere. It is your global identity.' },
  { pattern: /\+tag|plus tag|hashtag/,       answer: 'OWF uses +tags instead of hashtags. Always start with + — like +lagos or +music. They connect your post to global conversations.' },
  { pattern: /global moment/,               answer: 'Global Moments are live cultural events across the world — festivals, movements, seasonal moments. Find them in the strip at the top of the feed.' },
  { pattern: /accolade/,                    answer: 'Accolades are earned by contributing meaningfully to the OWF community — great posts, engagement, and presence. They appear on your profile.' },
  { pattern: /trophy/,                      answer: 'Trophies mark personal milestones on OWF. Earned automatically as you use the platform. They appear on your profile.' },
  { pattern: /how.*feed|feed.*work/,        answer: 'The feed has four views — All, Text, Media, and Video. The All tab shows photos in a horizontal strip, videos in their own strip, and text posts in between.' },
  { pattern: /post|create|upload|publish/,  answer: 'Hit the +Post button at the top right. Add text, images, or video up to 90 seconds. Choose a mood, add +tags, and share.' },
  { pattern: /world clock|time zone/,       answer: 'The World Clocks panel on the right shows live times for 50+ cities. Pin cities and set your home city. Updates in real time.' },
  { pattern: /pro|paid|subscribe|upgrade/,  answer: 'OWF Pro unlocks full AI Copilot — live weather, real-time news, and natural language conversation. Coming soon.' },
  { pattern: /copilot|ai.*work/,            answer: 'The OWF Copilot is the AI layer across the platform. It handles mood detection, +tag suggestions, city facts, post ideas, and more — all without an API key.' },
  { pattern: /discover/,                    answer: 'The Discover page surfaces trending +tags, new voices, and cities worth exploring.' },
  { pattern: /social/,                      answer: 'The Social page shows your connections, mentions, and community activity. Coming soon.' },
  { pattern: /profile/,                     answer: 'Your profile shows your posts, accolades, trophies, and your .feed handle.' },
  { pattern: /mood.*work|how.*mood/,        answer: 'Every post has a mood — electric, joyful, reflective, hopeful, ambitious, curious, resilient, melancholic, or calm. You pick it when you post.' },
  { pattern: /safe|block|report/,           answer: 'OWF has a built-in safety layer. Harmful content is blocked before it reaches the feed. The platform is designed to be a safe, global space.' },
];

/* ── GLOSSARY ─────────────────────────────────────────────── */
const GLOSSARY: Record<string, string> = {
  'handle':        'Your OWF identity. Ends in .feed — like yourname.feed. No @ symbol.',
  'lens':          'An AI mode that defines how the Copilot responds on a given page. Different pages use different lenses.',
  'ring':          'An AI operating mode — creative, civic, or support. Controls the tone of AI responses.',
  'glow':          'The animated pulse effect on interactions — likes, saves, and shares each have their own glow timing.',
  'spotlight':     'The cinematic image card at the top of the right panel. Cycles through featured global moments.',
  'accolade':      'A recognition earned for meaningful contributions to the OWF community.',
  'trophy':        'A milestone marker on your profile. Earned automatically as you use OWF.',
  'copilot':       'The OWF AI layer. Handles moods, tags, city facts, post ideas, and more.',
};

/* ── ENCOURAGEMENT ────────────────────────────────────────── */
const ENCOURAGEMENT = [
  'That sounds like a real moment. The feed is better with voices like yours in it.',
  'Thank you for sharing that. The world needs more of this kind of honesty.',
  'There is something powerful in what you just said. Post it — someone else needs to read it.',
  'That is the kind of thing that makes OWF worth building. Keep going.',
  'What you feel here, someone else is feeling on the other side of the world right now.',
];

const PERSONAL_SIGNALS = [
  'i feel', 'i am ', "i'm ", 'i lost', 'i miss', 'struggling', 'hard day',
  'not okay', 'overwhelmed', 'so proud', 'excited about', 'finally did',
  'just finished', 'really happy', 'really sad', 'so tired', 'grateful for',
];

function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isPersonalShare(text: string): boolean {
  return PERSONAL_SIGNALS.some(s => text.toLowerCase().includes(s)) && text.length > 20;
}

/* ── INTERFACES ───────────────────────────────────────────── */
export interface RulesResponse {
  text: string;
  source: 'rules';
  suggestedTags?: string[];
  detectedMood?: string;
  needsProTier?: boolean;
  postIdeas?: string[];
}

export interface RulesContext {
  city?: string;
  feedCities?: string[];
  conversationHistory?: Array<{ role: string; content: string }>;
}

/* ── MAIN ─────────────────────────────────────────────────── */
export function rulesEngineCall(input: string, context?: RulesContext): RulesResponse {
  const lower = input.toLowerCase().trim();
  const history = context?.conversationHistory || [];
  const lastBot = history.filter(m => m.role === 'assistant').slice(-1)[0]?.content || '';

  // 1. GREETING
  if (/^(hi|hello|hey|sup|good morning|good evening|good night|hola|salut|ciao|yo|greetings)/.test(lower)) {
    const daily = getMoodOfTheDay();
    const season = getSeason('north');
    return {
      text: `Hello. ${SEASON_PHRASES[season]} Today on the feed it feels ${daily.mood}. Ask me about a city, the time, post ideas, or how OWF works.`,
      source: 'rules',
      detectedMood: daily.mood,
    };
  }

  // 2. PERSONAL SHARE
  if (isPersonalShare(lower)) {
    const tags = suggestTags(lower, context?.city);
    return { text: getRandom(ENCOURAGEMENT), source: 'rules', suggestedTags: tags.length > 0 ? tags : undefined };
  }

  // 3. CONVERSATION CONTINUITY
  if (/^(tell me more|what else|go on|more|continue|elaborate|explain more)/.test(lower) && lastBot) {
    const daily = getMoodOfTheDay();
    return { text: `To go deeper — ask about a specific city, the mood of the day, or what to post. Today feels ${daily.mood}. What angle interests you?`, source: 'rules', detectedMood: daily.mood };
  }

  // 4. TIME — specific city or world grid
  if (/\b(time|clock|what time|current time|time is it|time now)\b/.test(lower)) {
    for (const [key, val] of Object.entries(CITY_TZ)) {
      if (lower.includes(key)) {
        try {
          const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: val.tz });
          const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: val.tz });
          return { text: `It is currently ${time} in ${val.name} (${date}).`, source: 'rules' };
        } catch { break; }
      }
    }
    // No city found — show world grid
    return { text: `Right now across the world:\n\n${getWorldTimeGrid()}\n\nAsk me about any specific city for the full date too.`, source: 'rules' };
  }

  // 5. DATE
  if (/\b(what day|what date|today.s date|current date|what is today)\b/.test(lower)) {
    for (const [key, val] of Object.entries(CITY_TZ)) {
      if (lower.includes(key)) {
        try {
          const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: val.tz });
          return { text: `Today in ${val.name} is ${date}.`, source: 'rules' };
        } catch { break; }
      }
    }
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return { text: `Today is ${date}.`, source: 'rules' };
  }

  // 6. WEATHER — Pro nudge
  if (/\b(weather|temperature|rain|snow|forecast|humid)\b/.test(lower)) {
    return { text: 'Live weather is a Pro tier feature coming soon. For now, the World Clocks panel gives you timezone context across all major cities.', source: 'rules', needsProTier: true };
  }

  // 7. CITY COMPARISON
  if (/\b(compare|vs|versus|difference between|which is better)\b/.test(lower)) {
    const found: string[] = [];
    for (const key of Object.keys(CITY_FACTS)) {
      if (lower.includes(key)) found.push(key);
      if (found.length === 2) break;
    }
    if (found.length === 2) {
      const a = CITY_FACTS[found[0]];
      const b = CITY_FACTS[found[1]];
      const nA = toTitleCase(found[0]);
      const nB = toTitleCase(found[1]);
      return {
        text: `${nA} vs ${nB}:\n\n${nA} feels ${a.feel} — ${a.culture}.\n\n${nB} feels ${b.feel} — ${b.culture}.\n\nBoth are alive on OWF. The feed carries voices from both every day.`,
        source: 'rules',
        detectedMood: a.feel,
      };
    }
  }

  // 8. CITY FACTS
  if (/\b(tell me about|facts about|describe|known for|what is|about)\b/.test(lower)) {
    for (const [key, facts] of Object.entries(CITY_FACTS)) {
      if (lower.includes(key)) {
        const name = toTitleCase(key);
        const season = getSeason(facts.hemisphere);
        return {
          text: `${name} is known for ${facts.known}. The culture is ${facts.culture}. Population: ${facts.population}. Timezone: ${facts.tz}. It is ${season} there right now. On the feed, ${name} usually feels ${facts.feel}.`,
          source: 'rules',
          detectedMood: facts.feel,
        };
      }
    }
  }

  // 9. GLOSSARY
  if (/\b(what is a|what does|define|meaning of)\b/.test(lower)) {
    for (const [term, def] of Object.entries(GLOSSARY)) {
      if (lower.includes(term)) return { text: def, source: 'rules' };
    }
  }

  // 10. MOOD OF THE DAY
  if (/\b(mood today|today.s mood|daily mood|mood of the day|world mood|how.s the world)\b/.test(lower)) {
    const daily = getMoodOfTheDay();
    return { text: daily.text, source: 'rules', detectedMood: daily.mood };
  }

  // 11. MOOD DETECTION
  if (/\b(mood|vibe|energy|emotion|atmosphere)\b/.test(lower)) {
    const mood = detectMoodFromText(lower);
    const city = context?.city || 'the world';
    const tags = MOOD_TAGS[mood] || [];
    return {
      text: `The energy from ${city} reads as ${mood} right now. Posts tagged ${tags.slice(0, 2).join(' or ')} tend to carry this feeling well.`,
      source: 'rules',
      detectedMood: mood,
      suggestedTags: tags,
    };
  }

  // 12. POST IDEAS / CAPTION
  if (/\b(what (should|can) i post|post idea|post inspiration|what to (share|write|post)|caption|help me (write|create|post)|give me ideas)\b/.test(lower)) {
    const mood = detectMoodFromText(lower);
    const city = context?.city?.toLowerCase() || '';
    let ideas: string[] = [];
    for (const [key, val] of Object.entries(POST_IDEAS_BY_CITY)) {
      if (city.includes(key)) { ideas = val; break; }
    }
    if (ideas.length === 0) ideas = POST_IDEAS_BY_MOOD[mood] || POST_IDEAS_BY_MOOD.electric;
    const tags = suggestTags(lower, context?.city);
    const caption = CAPTION_TEMPLATES[Math.floor(Math.random() * CAPTION_TEMPLATES.length)](context?.city || 'your city', mood);
    return {
      text: `Here are some post ideas:\n\n• ${ideas.join('\n• ')}\n\nCaption idea: "${caption}"`,
      source: 'rules',
      postIdeas: ideas,
      suggestedTags: tags.length > 0 ? tags : MOOD_TAGS[mood],
      detectedMood: mood,
    };
  }

  // 13. TAG SUGGESTIONS
  if (/\b(tag|suggest tags|best tags|which tag|what tag)\b/.test(lower)) {
    const mood = detectMoodFromText(lower);
    const tags = [...suggestTags(lower, context?.city), ...(MOOD_TAGS[mood] || [])].filter((v,i,a) => a.indexOf(v)===i).slice(0,5);
    return { text: `For a ${mood} mood, try: ${tags.join(' ')}`, source: 'rules', suggestedTags: tags };
  }

  // 14. PLATFORM HELP
  if (/\b(how|what is|explain|help|owf|feature|work|does|use)\b/.test(lower)) {
    for (const { pattern, answer } of PLATFORM_HELP) {
      if (pattern.test(lower)) return { text: answer, source: 'rules' };
    }
  }

  // 15. CITY RECOMMENDATION
  if (/\b(recommend.*city|suggest.*city|which city|what city|city.*explore|city.*visit|city.*should|explore.*city|discover.*city)\b/.test(lower)) {
    const daily = getMoodOfTheDay();
    const season = getSeason('north');
    const CITY_PICKS: Record<string, { city: string; reason: string }> = {
      electric:   { city: 'Lagos',         reason: 'The energy there is unmistakable — Afrobeats, Nollywood, and a generation building something loud and new.' },
      reflective: { city: 'Kyoto',         reason: 'Quiet temples, slow seasons, and a city that holds its history with great care.' },
      hopeful:    { city: 'Nairobi',       reason: 'Young, fast-moving, and full of people building the future of the continent.' },
      ambitious:  { city: 'Dubai',         reason: 'Ambition made physical — towers, trade routes, and a city that refused to stay small.' },
      curious:    { city: 'Istanbul',      reason: 'Two continents, ten centuries of empire, and a city where east and west are still in conversation.' },
      joyful:     { city: 'Accra',         reason: 'Warm, celebratory, and alive with music — a city that knows how to be grateful and joyful at once.' },
      resilient:  { city: 'Johannesburg',  reason: 'Scarred by history and alive with art — a city in constant, determined reinvention.' },
      melancholic:{ city: 'Buenos Aires',  reason: 'Tango, steak, and a city that holds loss and beauty in the same breath.' },
      calm:       { city: 'Singapore',     reason: 'Efficient, multicultural, and quietly extraordinary — a city that works and still finds time for beauty.' },
    };
    const pick = CITY_PICKS[daily.mood] || CITY_PICKS.electric;
    return {
      text: `Based on today's feed energy — which feels ${daily.mood} — I would explore ${pick.city}. ${pick.reason} It is ${season} there right now. Search +${pick.city.toLowerCase().replace(/ /g, '')} in the feed to hear from people who are there.`,
      source: 'rules',
      detectedMood: daily.mood,
      suggestedTags: ['+' + pick.city.toLowerCase().replace(/ /g, ''), '+travel', '+explore'],
    };
  }

  // 15b. TRENDING / TOP POSTS
  if (/\b(top post|trending post|most liked|popular|trending|top content|top feed|best post)\b/.test(lower) || lower === 'top post' || lower === 'top feed') {
    const daily = getMoodOfTheDay();
    const cities = context?.feedCities || ['Lagos', 'Tokyo', 'Cairo'];
    return { text: `Top posts right now are coming from ${cities[0]} and ${cities[1]} — voices that feel ${daily.mood}. Check the Trending panel on the right for the hottest +tags.`, source: 'rules', detectedMood: daily.mood };
  }

  // 16. FEED SUMMARY
  if (/\b(feed|happening|summary|global|cities|moments|right now|going on)\b/.test(lower)) {
    const cities = context?.feedCities || ['Lagos', 'Tokyo', 'Cairo', 'Berlin', 'Seoul'];
    const daily = getMoodOfTheDay();
    const season = getSeason('north');
    return {
      text: `Right now the feed is alive with voices from ${cities.slice(0,3).join(', ')} and beyond. It is ${season} in the northern hemisphere. Today feels ${daily.mood}.`,
      source: 'rules',
      detectedMood: daily.mood,
    };
  }

  // 17. NEWS — Pro nudge
  if (/\b(news|headline|breaking|latest news|current events)\b/.test(lower)) {
    return { text: 'Live news is a Pro tier feature. The Global Moments strip at the top of the feed shows what is culturally alive across the world right now.', source: 'rules', needsProTier: true };
  }

  // 18. THANKS
  if (/\b(thank|thanks|appreciate|great job|awesome|love this)\b/.test(lower)) {
    return { text: 'The world is more connected with you in it. Keep posting, keep exploring.', source: 'rules' };
  }

  // DEFAULT
  const daily = getMoodOfTheDay();
  const defaults = [
    `Ask me about the feed, a city, moods, or what to post. Today feels ${daily.mood}.`,
    'I can help with city facts, post ideas, +tags, time zones, city comparisons, or how OWF works.',
    'Try — what time is it in Lagos? Tell me about Tokyo. Compare Seoul and Berlin. What should I post?',
  ];
  return { text: getRandom(defaults), source: 'rules' };
}
