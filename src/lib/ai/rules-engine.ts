/* OWF RULES ENGINE v1 - Zero API key AI baseline */

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

export function suggestTags(text: string, city?: string): string[] {
  const lower = text.toLowerCase();
  const tags = new Set<string>();
  const cityMap: Record<string, string[]> = {
    'lagos': ['+lagos', '+nigeria'], 'tokyo': ['+tokyo', '+japan'],
    'cairo': ['+cairo', '+egypt'], 'nairobi': ['+nairobi', '+kenya'],
    'london': ['+london', '+uk'], 'paris': ['+paris', '+france'],
    'new york': ['+newyork', '+nyc'], 'los angeles': ['+losangeles', '+la'],
    'seoul': ['+seoul', '+korea'], 'dubai': ['+dubai', '+uae'],
    'mumbai': ['+mumbai', '+india'], 'berlin': ['+berlin', '+germany'],
  };
  if (city) {
    for (const [key, val] of Object.entries(cityMap)) {
      if (city.toLowerCase().includes(key)) val.forEach(t => tags.add(t));
    }
  }
  if (/music|song|concert|festival|beat/.test(lower)) tags.add('+music');
  if (/art|paint|gallery|design|mural/.test(lower)) tags.add('+art');
  if (/food|eat|cook|restaurant|cuisine/.test(lower)) tags.add('+food');
  if (/travel|journey|explore|wander/.test(lower)) tags.add('+travel');
  if (/tech|code|startup|app|digital/.test(lower)) tags.add('+tech');
  if (/nature|forest|ocean|mountain/.test(lower)) tags.add('+nature');
  if (/community|together|local|volunteer/.test(lower)) tags.add('+community');
  return Array.from(tags).slice(0, 5);
}

const GREETINGS = [
  'The world is alive with stories today. What would you like to explore?',
  'Voices from every timezone are active right now. Ask me anything about the feed.',
  'Global moments are unfolding as we speak. How can I help?',
];

const UNKNOWNS = [
  'Ask me about the feed, cities, moods, or what is trending right now.',
  'I can help you explore the feed, understand moods, or suggest +tags for your posts.',
  'Try asking about what is happening in a specific city, or what mood the feed is in today.',
];

function getRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface RulesResponse {
  text: string;
  source: 'rules';
  suggestedTags?: string[];
  detectedMood?: string;
  needsProTier?: boolean;
}

export function rulesEngineCall(input: string, context?: { city?: string; feedCities?: string[] }): RulesResponse {
  const lower = input.toLowerCase().trim();

  if (/^(hi|hello|hey|sup|good morning|good evening)/.test(lower)) {
    return { text: getRandom(GREETINGS), source: 'rules' };
  }

  if (/\b(time|clock|hour)\b/.test(lower)) {
    return { text: 'Check the World Clocks panel on the right for live times across all major cities.', source: 'rules' };
  }

  if (/\b(weather|temperature|rain|snow|forecast)\b/.test(lower)) {
    return { text: 'Live weather is a Pro tier feature. Check the World Clocks panel for city context in the meantime.', source: 'rules', needsProTier: true };
  }

  if (/\b(mood|feel|vibe|energy|emotion)\b/.test(lower)) {
    const mood = detectMoodFromText(lower);
    const city = context?.city || 'the world';
    return { text: `The energy from ${city} reads as ${mood} right now — a feeling rippling across the feed today.`, source: 'rules', detectedMood: mood };
  }

  if (/\b(feed|happening|summary|world|global|cities|moments)\b/.test(lower)) {
    const cities = context?.feedCities || ['Lagos', 'Tokyo', 'Cairo', 'Berlin', 'Seoul'];
    return { text: `Right now the feed is alive with voices from ${cities.slice(0, 3).join(', ')} and beyond. Energy, reflection, and quiet ambition are all present.`, source: 'rules' };
  }

  if (/\b(tag|suggest|hashtag|help me post)\b/.test(lower)) {
    const tags = suggestTags(lower, context?.city);
    const msg = tags.length > 0 ? `Based on your post, try adding: ${tags.join(' ')}` : 'Add +tags to help your post reach the right people.';
    return { text: msg, source: 'rules', suggestedTags: tags };
  }

  if (/\b(news|headline|breaking|latest|current events)\b/.test(lower)) {
    return { text: 'Live news is a Pro tier feature. Explore the Global Moments strip at the top of the feed for what is happening worldwide.', source: 'rules', needsProTier: true };
  }

  return { text: getRandom(UNKNOWNS), source: 'rules' };
}
