/* ============================================================
   OWF RULES ENGINE v2 — Zero API Key Intelligence Layer
   Full capability set for free tier users.

   Capabilities:
   1. Time — live time in any major city
   2. Mood detection — from text signals
   3. Mood of the day — poetic, date/season aware
   4. Feed summary — cities and energy
   5. Tag suggestions — from content + city
   6. City facts — culture, known for, population
   7. Post writing help — captions and ideas
   8. OWF platform help — features explained
   9. What to post — ideas by city or mood
   10. Conversation memory — context from earlier in chat
   11. Tone detection — respond to emotional register
   12. Encouragement — when user shares something personal
   13. Weather/News — nudge to Pro tier
============================================================ */

/* ── MOOD SIGNALS ─────────────────────────────────────────── */
const MOOD_SIGNALS: Record<string, string[]> = {
  electric:    ['energy', 'electric', 'alive', 'fire', 'buzz', 'hype', 'lit', 'festival', 'music', 'dance', 'night', 'crowd'],
  joyful:      ['joy', 'happy', 'laugh', 'smile', 'celebrate', 'fun', 'love', 'wonderful', 'amazing', 'beautiful', 'grateful'],
  reflective:  ['reflect', 'memory', 'remember', 'think', 'quiet', 'still', 'season', 'years', 'past', 'moment', 'blossom'],
  hopeful:     ['hope', 'future', 'dream', 'build', 'grow', 'start', 'begin', 'harvest', 'seed', 'community', 'together'],
  ambitious:   ['present', 'pitch', 'launch', 'startup', 'goal', 'hustle', 'grind', 'work', 'success', 'achieve', 'push'],
  curious:     ['discover', 'found', 'explore', 'hidden', 'wonder', 'strange', 'interesting', 'learn', 'ancient', 'secret'],
  resilient:   ['brutal', 'hard', 'struggle', 'survive', 'persist', 'winter', 'cold', 'tough', 'challenge', 'overcome'],
  melancholic: ['miss', 'gone', 'lost', 'alone', 'sad', 'grey', 'rain', 'empty', 'longing', 'ache', 'distance'],
  calm:        ['calm', 'peace', 'serene', 'slow', 'breathe', 'rest', 'gentle', 'flow', 'ease', 'morning', 'sunrise'],
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
  { mood: 'electric',    text: 'The world is buzzing today — a current of restless energy running from city to city, like a song no one can get out of their head.' },
  { mood: 'reflective',  text: 'Something quiet is moving through the feed today. People are looking back, sitting with memories, turning things over slowly.' },
  { mood: 'hopeful',     text: 'There is a thread of hope running through the voices today — seeds being planted, futures being imagined, communities reaching toward something.' },
  { mood: 'ambitious',   text: 'The feed is in motion today. Launches, pitches, new beginnings — the world is building something and everyone seems to know it.' },
  { mood: 'curious',     text: 'A spirit of discovery is alive in the feed today. Hidden streets, unfamiliar cities, unexpected finds — the world is full of questions.' },
  { mood: 'joyful',      text: 'The feed is warm today. Laughter, colour, gratitude — small beautiful moments accumulating like light through a window.' },
  { mood: 'resilient',   text: 'Something steady and strong is moving through the feed today — people holding on, showing up, choosing to continue.' },
];

export function getMoodOfTheDay(): { mood: string; text: string } {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_MOODS[dayOfYear % DAILY_MOODS.length];
}

/* ── CITY FACTS ───────────────────────────────────────────── */
const CITY_FACTS: Record<string, { known: string; culture: string; population: string; tz: string; feel: string }> = {
  'lagos':        { known: 'Afrobeats, Nollywood, and one of Africas most electric economies', culture: 'vibrant, entrepreneurial, loud with music and ambition', population: '15 million+', tz: 'WAT (UTC+1)', feel: 'electric' },
  'tokyo':        { known: 'precision, street food, cherry blossoms, and neon-lit silence', culture: 'deeply ceremonial, quietly innovative, layered with beauty', population: '14 million+', tz: 'JST (UTC+9)', feel: 'curious' },
  'cairo':        { known: 'the pyramids, the Nile, and five thousand years of continuous civilization', culture: 'ancient and modern at once — merchants, scholars, and storytellers', population: '21 million+', tz: 'EET (UTC+2)', feel: 'ancient' },
  'nairobi':      { known: 'tech innovation, safari culture, and a young, fast-moving population', culture: 'entrepreneurial, community-driven, globally connected', population: '5 million+', tz: 'EAT (UTC+3)', feel: 'hopeful' },
  'accra':        { known: 'Afrobeats, year of return, and a growing creative economy', culture: 'warm, celebratory, proud of its heritage and future', population: '3 million+', tz: 'GMT (UTC+0)', feel: 'joyful' },
  'london':       { known: 'reinvention — always absorbing new cultures, sounds, and ideas', culture: 'layered, multicultural, quietly proud and perpetually curious', population: '9 million+', tz: 'GMT/BST', feel: 'reflective' },
  'paris':        { known: 'art, philosophy, food, and the most copied aesthetic in the world', culture: 'intellectual, sensual, obsessed with beauty and argument', population: '11 million+', tz: 'CET (UTC+1)', feel: 'calm' },
  'berlin':       { known: 'techno, tech startups, raw creativity, and a city still becoming itself', culture: 'open, experimental, scarred by history and alive with art', population: '3.7 million+', tz: 'CET (UTC+1)', feel: 'resilient' },
  'new york':     { known: 'the skyline, the pace, and the feeling that anything is possible', culture: 'relentless, diverse, loud and soft in equal measure', population: '8 million+', tz: 'EST (UTC-5)', feel: 'ambitious' },
  'los angeles':  { known: 'film, music, sun, and the dream factory of the world', culture: 'creative, sprawling, optimistic — always building a new version of itself', population: '4 million+', tz: 'PST (UTC-8)', feel: 'hopeful' },
  'seoul':        { known: 'K-pop, K-drama, skincare, and one of the most wired cities on earth', culture: 'intense, stylish, deeply communal, and quietly poetic', population: '9.7 million+', tz: 'KST (UTC+9)', feel: 'electric' },
  'mumbai':       { known: 'Bollywood, the sea, resilience, and a city that never sleeps', culture: 'chaotic and tender — a million stories happening at once', population: '20 million+', tz: 'IST (UTC+5:30)', feel: 'resilient' },
  'dubai':        { known: 'ambition made physical — towers, trade routes, and reinvention', culture: 'future-facing, cosmopolitan, a crossroads of the world', population: '3.5 million+', tz: 'GST (UTC+4)', feel: 'ambitious' },
  'sao paulo':    { known: 'Brazilian music, street art, food culture, and relentless creativity', culture: 'loud, layered, intensely alive — the heartbeat of South America', population: '12 million+', tz: 'BRT (UTC-3)', feel: 'electric' },
  'istanbul':     { known: 'straddling two continents, ten centuries of empire, and incredible food', culture: 'complex, hospitable, caught beautifully between east and west', population: '15 million+', tz: 'TRT (UTC+3)', feel: 'curious' },
  'singapore':    { known: 'efficiency, diversity, food hawker culture, and tropical modernism', culture: 'meticulous, multicultural, a city-state that works', population: '5.9 million+', tz: 'SGT (UTC+8)', feel: 'calm' },
  'sydney':       { known: 'the Opera House, the harbour, surf culture, and easy warmth', culture: 'relaxed but driven — sun-soaked ambition', population: '5.3 million+', tz: 'AEDT (UTC+11)', feel: 'joyful' },
};

/* ── CITY TIMEZONES ───────────────────────────────────────── */
const CITY_TZ: Record<string, { tz: string; name: string }> = {
  'la': { tz: 'America/Los_Angeles', name: 'Los Angeles' },
  'los angeles': { tz: 'America/Los_Angeles', name: 'Los Angeles' },
  'new york': { tz: 'America/New_York', name: 'New York' },
  'nyc': { tz: 'America/New_York', name: 'New York' },
  'london': { tz: 'Europe/London', name: 'London' },
  'paris': { tz: 'Europe/Paris', name: 'Paris' },
  'tokyo': { tz: 'Asia/Tokyo', name: 'Tokyo' },
  'lagos': { tz: 'Africa/Lagos', name: 'Lagos' },
  'dubai': { tz: 'Asia/Dubai', name: 'Dubai' },
  'nairobi': { tz: 'Africa/Nairobi', name: 'Nairobi' },
  'berlin': { tz: 'Europe/Berlin', name: 'Berlin' },
  'seoul': { tz: 'Asia/Seoul', name: 'Seoul' },
  'cairo': { tz: 'Africa/Cairo', name: 'Cairo' },
  'sydney': { tz: 'Australia/Sydney', name: 'Sydney' },
  'singapore': { tz: 'Asia/Singapore', name: 'Singapore' },
  'mumbai': { tz: 'Asia/Kolkata', name: 'Mumbai' },
  'chicago': { tz: 'America/Chicago', name: 'Chicago' },
  'toronto': { tz: 'America/Toronto', name: 'Toronto' },
  'accra': { tz: 'Africa/Accra', name: 'Accra' },
  'istanbul': { tz: 'Europe/Istanbul', name: 'Istanbul' },
  'sao paulo': { tz: 'America/Sao_Paulo', name: 'São Paulo' },
  'mexico city': { tz: 'America/Mexico_City', name: 'Mexico City' },
  'amsterdam': { tz: 'Europe/Amsterdam', name: 'Amsterdam' },
  'johannesburg': { tz: 'Africa/Johannesburg', name: 'Johannesburg' },
  'bangkok': { tz: 'Asia/Bangkok', name: 'Bangkok' },
};

/* ── TAG SUGGESTIONS ──────────────────────────────────────── */
export function suggestTags(text: string, city?: string): string[] {
  const lower = text.toLowerCase();
  const tags = new Set<string>();
  if (city) {
    for (const [key, facts] of Object.entries(CITY_FACTS)) {
      if (city.toLowerCase().includes(key)) { tags.add('+' + key.replace(' ', '')); break; }
    }
  }
  if (/music|song|concert|festival|beat|album/.test(lower)) tags.add('+music');
  if (/art|paint|gallery|design|mural|creative/.test(lower)) tags.add('+art');
  if (/food|eat|cook|restaurant|cuisine|meal/.test(lower)) tags.add('+food');
  if (/travel|journey|explore|wander|trip/.test(lower)) tags.add('+travel');
  if (/tech|code|startup|app|digital|software/.test(lower)) tags.add('+tech');
  if (/nature|forest|ocean|mountain|earth/.test(lower)) tags.add('+nature');
  if (/community|together|local|volunteer|people/.test(lower)) tags.add('+community');
  if (/fashion|style|outfit|wear|clothes/.test(lower)) tags.add('+fashion');
  if (/sport|football|run|athlete|fitness/.test(lower)) tags.add('+sport');
  if (/film|movie|cinema|documentary/.test(lower)) tags.add('+film');
  return Array.from(tags).slice(0, 5);
}

/* ── POST IDEAS ───────────────────────────────────────────── */
const POST_IDEAS: Record<string, string[]> = {
  electric:   ['Share the sound that defined your night', 'Post the moment the energy shifted', 'What song is the city playing right now?'],
  joyful:     ['Share one small thing that made you smile today', 'Post the colour of your morning', 'What are you grateful for in your city?'],
  reflective: ['Write about a place that changed you', 'Share a memory tied to a city', 'What does your city feel like at this hour?'],
  hopeful:    ['What are you building right now?', 'Share the seed of an idea you have', 'What does progress look like in your community?'],
  ambitious:  ['Post your current goal in one sentence', 'Share what you launched or shipped this week', 'What does hustle look like where you are?'],
  curious:    ['Share a hidden spot in your city', 'Post something you discovered recently', 'What surprised you about where you live?'],
  resilient:  ['Share how you kept going when it was hard', 'Post what strength looks like in your city', 'What does your community do when things get tough?'],
  melancholic:['Share something beautiful that is gone', 'Write about the city you miss', 'What do you wish you had said?'],
  calm:       ['Post the quietest moment of your day', 'Share your morning ritual', 'What does peace look like where you are?'],
};

const CITY_POST_IDEAS: Record<string, string[]> = {
  'lagos':   ['Share the sound of Lagos right now', 'Post an Afrobeats moment', 'What is the hustle looking like on the mainland today?'],
  'tokyo':   ['Share a quiet Tokyo moment', 'Post something from a neighbourhood most tourists miss', 'What does precision look like in everyday Tokyo life?'],
  'cairo':   ['Share the Nile at a specific hour', 'Post something ancient next to something modern', 'What does Cairo sound like right now?'],
  'london':  ['Post a rainy London moment', 'Share something from your corner of the city', 'What neighbourhood energy are you feeling today?'],
  'paris':   ['Share a Parisian small pleasure', 'Post the light in Paris right now', 'What are people talking about in your arrondissement?'],
  'nairobi': ['Share something from the Nairobi tech scene', 'Post a safari or nature moment', 'What is the energy of young Nairobi right now?'],
  'seoul':   ['Share a late-night Seoul moment', 'Post something from a pojangmacha or street stall', 'What K-culture moment are you living right now?'],
  'berlin':  ['Share a Berlin wall art find', 'Post something from the underground scene', 'What does creative Berlin look like today?'],
};

/* ── CAPTION TEMPLATES ────────────────────────────────────── */
const CAPTION_TEMPLATES = [
  (city: string, mood: string) => `${city} at this hour. The ${mood} is unmistakable.`,
  (city: string, mood: string) => `Something ${mood} in the air over ${city} today.`,
  (city: string, _mood: string) => `${city} never looks the same twice.`,
  (_city: string, mood: string) => `This is what ${mood} feels like from here.`,
  (city: string, _mood: string) => `A moment from ${city} that needed to be shared.`,
];

/* ── OWF PLATFORM HELP ────────────────────────────────────── */
const PLATFORM_HELP: Record<string, string> = {
  'handle|.feed':   'On OWF, handles end in .feed — like amaradiallo.feed. No @ symbol. It is your identity on the platform.',
  'tag|\+':        'OWF uses +tags instead of hashtags. Always start with a + sign — like +lagos or +music. They connect your post to global conversations.',
  'mood':           'Every post has a mood — electric, joyful, reflective, hopeful, ambitious, curious, resilient, melancholic, or calm. It sets the tone for how your post feels in the feed.',
  'global moment':  'Global Moments are live events happening across the world — festivals, cultural moments, movements. Find them in the strip at the top of the feed.',
  'accolade|trophy':'Accolades and trophies are earned on OWF. Accolades recognise contributions. Trophies mark milestones. They appear on your profile.',
  'feed|how':       'The feed has four views — All, Text, Media, and Video. Use the tabs to filter by what you want to see.',
  'post|create':    'Hit the +Post button at the top right to create a post. You can add text, images, or video up to 90 seconds. Choose a mood and add +tags.',
  'world clock':    'The World Clocks panel shows live times for cities around the globe. Pin cities you care about and set your home city.',
  'pro|paid':       'OWF Pro unlocks live AI features — real-time weather, news search, and full Copilot conversations. Coming soon.',
  'copilot':        'The OWF Copilot is the AI layer that powers smart features across the platform — mood detection, tag suggestions, feed insights, and more.',
};

/* ── ENCOURAGEMENT RESPONSES ──────────────────────────────── */
const ENCOURAGEMENT = [
  'That sounds like a real moment. The feed is better with voices like yours in it.',
  'Thank you for sharing that. The world needs more of this kind of honesty.',
  'There is something powerful in what you just said. Post it — someone else needs to read it.',
  'That is the kind of thing that makes OWF worth building. Keep going.',
  'The feed carries things like this across cities and timezones. What you feel here, someone else is feeling on the other side of the world.',
];

const PERSONAL_SIGNALS = ['i feel', 'i am', 'i am', 'i lost', 'i miss', 'struggling', 'hard day', 'difficult', 'not okay', 'overwhelmed', 'proud', 'excited about', 'cannot believe', 'finally'];

/* ── HELPERS ──────────────────────────────────────────────── */
function getRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isPersonalShare(text: string): boolean {
  return PERSONAL_SIGNALS.some(s => text.toLowerCase().includes(s));
}

/* ── MAIN INTERFACE ───────────────────────────────────────── */
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
  conversationHistory?: string[];
}

/* ── MAIN RULES ENGINE CALL ───────────────────────────────── */
export function rulesEngineCall(input: string, context?: RulesContext): RulesResponse {
  const lower = input.toLowerCase().trim();

  // 1. GREETING
  if (/^(hi|hello|hey|sup|good morning|good evening|good night|hola|salut|ciao)/.test(lower)) {
    const daily = getMoodOfTheDay();
    return { text: `Hello. Today the feed feels ${daily.mood} — ${daily.text.split('—')[1]?.trim() || 'full of life'}. What would you like to explore?`, source: 'rules' };
  }

  // 2. PERSONAL SHARE — respond with encouragement first
  if (isPersonalShare(lower) && lower.length > 20) {
    const tags = suggestTags(lower, context?.city);
    return {
      text: getRandom(ENCOURAGEMENT),
      source: 'rules',
      suggestedTags: tags.length > 0 ? tags : undefined,
    };
  }

  // 3. TIME
  if (/\b(time|clock|hour|current time)\b/.test(lower) || lower.trim() === 'current time ?' || lower.trim() === 'current time') {
    for (const [key, val] of Object.entries(CITY_TZ)) {
      if (lower.includes(key)) {
        try {
          const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: val.tz });
          const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: val.tz });
          return { text: `It is currently ${time} in ${val.name} (${date}).`, source: 'rules' };
        } catch { break; }
      }
    }
    return { text: 'Check the World Clocks panel on the right — it shows live times for all major cities.', source: 'rules' };
  }

  // 4. WEATHER — Pro tier nudge
  if (/\b(weather|temperature|rain|snow|forecast|hot|cold)\b/.test(lower)) {
    return { text: 'Live weather is a Pro tier feature. Coming soon — for now, the World Clocks panel gives you city context across timezones.', source: 'rules', needsProTier: true };
  }

  // 5. CITY FACTS
  if (/\b(tell me about|what is|facts about|describe|where is|known for)\b/.test(lower)) {
    for (const [key, facts] of Object.entries(CITY_FACTS)) {
      if (lower.includes(key)) {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        return { text: `${name} is known for ${facts.known}. The culture is ${facts.culture}. Population: ${facts.population}. Timezone: ${facts.tz}. On the feed, ${name} usually feels ${facts.feel}.`, source: 'rules', detectedMood: facts.feel };
      }
    }
  }

  // 6. MOOD OF THE DAY
  if (/\b(mood today|today.s mood|daily mood|mood of the day|what mood|how.s the world)\b/.test(lower)) {
    const daily = getMoodOfTheDay();
    return { text: daily.text, source: 'rules', detectedMood: daily.mood };
  }

  // 7. MOOD DETECTION
  if (/\b(mood|feel|vibe|energy|emotion|tone)\b/.test(lower)) {
    const mood = detectMoodFromText(lower);
    const city = context?.city || 'the world';
    return { text: `The energy from ${city} reads as ${mood} right now — a feeling rippling quietly across the feed.`, source: 'rules', detectedMood: mood };
  }

  // 8. WHAT TO POST / POST IDEAS
  if (/\b(what (should|can) i post|post idea|inspiration|what to (share|write)|caption|help me (write|create|post))\b/.test(lower)) {
    const mood = detectMoodFromText(lower);
    const city = context?.city?.toLowerCase() || '';
    let ideas: string[] = [];
    for (const [key, cityIdeas] of Object.entries(CITY_POST_IDEAS)) {
      if (city.includes(key)) { ideas = cityIdeas; break; }
    }
    if (ideas.length === 0) ideas = POST_IDEAS[mood] || POST_IDEAS.electric;
    const tags = suggestTags(lower, context?.city);
    const caption = CAPTION_TEMPLATES[Math.floor(Math.random() * CAPTION_TEMPLATES.length)](context?.city || 'your city', mood);
    return {
      text: `Here are some post ideas for a ${mood} mood:

• ${ideas.join('\n• ')}\n\nCaption idea: "${caption}"`,
      source: 'rules',
      postIdeas: ideas,
      suggestedTags: tags,
      detectedMood: mood,
    };
  }

  // 9. TAG SUGGESTIONS
  if (/\b(tag|suggest|hashtag|\+tag|which tag)\b/.test(lower)) {
    const tags = suggestTags(lower, context?.city);
    const msg = tags.length > 0 ? `Based on your content, try these +tags: ${tags.join(' ')}` : 'Add +tags to help your post reach the right people. Start with your city — like +lagos or +tokyo.';
    return { text: msg, source: 'rules', suggestedTags: tags };
  }

  // 10. PLATFORM HELP
  if (/\b(how (do|does|to)|what is|what are|explain|help|how (it|owf)|what.s the)\b/.test(lower)) {
    for (const [pattern, answer] of Object.entries(PLATFORM_HELP)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(lower)) return { text: answer, source: 'rules' };
    }
  }

  // 11. FEED / GLOBAL SUMMARY
  if (/\b(feed|happening|summary|world|global|cities|moments|right now|today)\b/.test(lower)) {
    const cities = context?.feedCities || ['Lagos', 'Tokyo', 'Cairo', 'Berlin', 'Seoul'];
    const daily = getMoodOfTheDay();
    return { text: `Right now the feed is alive with voices from ${cities.slice(0, 3).join(', ')} and beyond. Today feels ${daily.mood} — ${daily.text.split('—')[0].trim().toLowerCase()}.`, source: 'rules', detectedMood: daily.mood };
  }

  // 12. NEWS — Pro tier nudge
  if (/\b(news|headline|breaking|latest|current events)\b/.test(lower)) {
    return { text: 'Live news search is a Pro tier feature. For now, the Global Moments strip at the top of the feed shows what is happening across the world.', source: 'rules', needsProTier: true };
  }

  // 13. THANKS / APPRECIATION
  if (/\b(thank|thanks|thank you|appreciate|great|awesome|love this)\b/.test(lower)) {
    return { text: 'The world is more connected with you in it. Keep posting, keep exploring.', source: 'rules' };
  }

  // DEFAULT — contextual fallback
  const daily = getMoodOfTheDay();
  const defaults = [
    `Ask me about the feed, a city, moods, or what to post. Today feels ${daily.mood}.`,
    'I can help with city facts, post ideas, +tag suggestions, time zones, or how OWF works.',
    'Try asking — what is the mood today? What should I post? Tell me about Tokyo. What time is it in Lagos?',
  ];
  return { text: getRandom(defaults), source: 'rules' };
}
