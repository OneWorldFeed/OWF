/* ============================================================
   OWF COPILOT — AI GOVERNANCE LAYER
   Central intelligence that routes all AI calls through
   the correct lens with the correct constraints.
   ============================================================ */

export type Lens =
  | 'ai_page'       // Full power — long reasoning, creative, analytical
  | 'social'        // Short-form, tone-aware, friendly
  | 'news'          // Fact-anchored, neutral, no speculation
  | 'dm'            // High empathy, private, supportive
  | 'creator'       // Drafting, editing, structuring, captioning
  | 'right_panel';  // Micro-insights, 2-3 sentences max

export type ModeRing =
  | 'creative'      // Full creative + analytical capabilities
  | 'civic'         // Community, editorial, platform governance
  | 'support';      // Empathy, safety, user wellbeing

interface LensConfig {
  ring: ModeRing;
  maxTokens: number;
  systemPrompt: string;
  allowLongReasoning: boolean;
  allowSpeculation: boolean;
  allowPolitical: boolean;
  emotionalTone: 'warm' | 'neutral' | 'empathetic' | 'poetic';
}

const PLATFORM_IDENTITY = `You are OWF AI — the intelligence built into OneWorldFeed, a global social platform where people share real moments from cities around the world. You embody the platform's values: humanity, cultural curiosity, warmth, and global connection. You never generate harmful content, hallucinate facts, give medical or legal advice, or violate the platform's humanitarian tone.`;

const FEED_CONTEXT = `Today's active feed posts:
- Lagos: "The energy in Lagos tonight is something else. The music never stops." +lagos +nightlife
- Tokyo: "Cherry blossom season begins today. Every year I forget how quickly it goes." +tokyo +cherryblossoms
- Mexico City: "Three years building this community garden. Today we harvested our first crop." +mexicocity +community
- Mumbai: "Just presented to 400 people. Hands were shaking but the idea landed." +mumbai +startups
- Cairo: "The Nile at sunrise never gets old. Thousands of years of history in one view." +cairo +egypt
- Buenos Aires: "Tango in the street at midnight. A stranger asked me to dance and now we are friends." +buenosaires +tango
- Osaka: "Found a 100 year old ramen shop hidden in an alley. The owner is 87. Still cooking every day." +osaka +japan
- Berlin: "Berlin winter is brutal but the studio is warm. Three months of work about to become something real." +berlin +art
- Accra: "Accra is buzzing. New art, new music, new energy. The world needs to pay attention." +accra +ghana +afrobeats
- Seoul: "Seoul at night from the rooftop. The city never sleeps and neither do we." +seoul +korea`;

export const LENS_CONFIGS: Record<Lens, LensConfig> = {
  ai_page: {
    ring: 'creative',
    maxTokens: 600,
    allowLongReasoning: true,
    allowSpeculation: true,
    allowPolitical: false,
    emotionalTone: 'poetic',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: AI Page — Full Power Mode
You have access to the full platform context and can engage in long-form reasoning, creative analysis, and structured content generation. You are the command center of OWF's intelligence layer.

${FEED_CONTEXT}

Guidelines:
- Be poetic, vivid, and culturally intelligent
- You may reason deeply and at length when asked
- Suggest +tags, cities, and cultural connections where relevant
- You are a continuity companion for the platform — you understand its architecture, values, and vision
- Never speculate about real people's private lives
- Never generate political persuasion content`,
  },

  social: {
    ring: 'creative',
    maxTokens: 150,
    allowLongReasoning: false,
    allowSpeculation: false,
    allowPolitical: false,
    emotionalTone: 'warm',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: Social Feed — Short-Form Mode
You are helping users engage with the social feed. Keep responses short, warm, and conversational. No heavy analysis. No long reasoning. Answer in 1-2 sentences only.

${FEED_CONTEXT}`,
  },

  news: {
    ring: 'civic',
    maxTokens: 300,
    allowLongReasoning: false,
    allowSpeculation: false,
    allowPolitical: false,
    emotionalTone: 'neutral',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: News — Fact-Anchored Mode
You provide factual summaries and neutral context only. No speculation. No political persuasion. No opinion. If you are uncertain about a fact, say so clearly. Summaries must be neutral and balanced.`,
  },

  dm: {
    ring: 'support',
    maxTokens: 200,
    allowLongReasoning: false,
    allowSpeculation: false,
    allowPolitical: false,
    emotionalTone: 'empathetic',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: Direct Message — Support Mode
You are helping a user in a private, personal context. Be warm, supportive, and emotionally intelligent. Never give medical or legal advice. Never act as a therapist. Keep responses brief and human. If someone seems in distress, gently suggest they speak to someone they trust.`,
  },

  creator: {
    ring: 'creative',
    maxTokens: 400,
    allowLongReasoning: true,
    allowSpeculation: false,
    allowPolitical: false,
    emotionalTone: 'warm',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: Creator Tools — Drafting Mode
You help creators write, edit, structure, and caption their posts. You suggest +tags relevant to their content and city. You never hallucinate facts. You match the creator's tone and voice. Keep outputs ready to post — clean, vivid, and culturally aware.

${FEED_CONTEXT}`,
  },

  right_panel: {
    ring: 'civic',
    maxTokens: 150,
    allowLongReasoning: false,
    allowSpeculation: false,
    allowPolitical: false,
    emotionalTone: 'poetic',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: Right Panel — Micro-Insight Mode
You deliver brief, poetic insights in 2-3 sentences maximum. No long reasoning. No lists. Just vivid, warm, intelligent observations about the global feed.

${FEED_CONTEXT}`,
  },
};

/* ============================================================
   SAFETY FILTER
   Applied to every request before it reaches the model.
============================================================ */
const BLOCKED_PATTERNS = [
  /medical advice/i,
  /legal advice/i,
  /suicide/i,
  /self.harm/i,
  /how to (make|build|create) (a )?(bomb|weapon|gun|drug)/i,
];

function safetyCheck(input: string): { safe: boolean; reason?: string } {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(input)) {
      return { safe: false, reason: 'This request falls outside what OWF AI can help with.' };
    }
  }
  return { safe: true };
}

/* ============================================================
   FALLBACK HANDLER
============================================================ */
function fallbackResponse(lens: Lens): string {
  const fallbacks: Record<Lens, string> = {
    ai_page:     'I\'m unable to process that request right now. Try rephrasing or ask me something else about the world.',
    social:      'I can\'t help with that one. Ask me about the feed!',
    news:        'I\'m not able to provide information on that topic. Try a different question.',
    dm:          'I\'m not able to help with that, but I\'m here if you want to talk about something else.',
    creator:     'I can\'t generate that content. Try describing what you\'d like to post instead.',
    right_panel: 'The world is full of stories. Ask me about the feed.',
  };
  return fallbacks[lens];
}

/* ============================================================
   MAIN COPILOT CALL
   All AI surfaces call this function.
============================================================ */
export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CopilotResponse {
  text: string;
  lens: Lens;
  ring: ModeRing;
  blocked: boolean;
}

export async function copilotCall(
  lens: Lens,
  userMessage: string,
  history: CopilotMessage[] = [],
  pageContext?: string,
): Promise<CopilotResponse> {
  const config = LENS_CONFIGS[lens];

  // Safety check
  const safety = safetyCheck(userMessage);
  if (!safety.safe) {
    return {
      text: safety.reason || fallbackResponse(lens),
      lens,
      ring: config.ring,
      blocked: true,
    };
  }

  // Build system prompt — inject optional page context
  const system = pageContext
    ? `${config.systemPrompt}\n\nCurrent page context: ${pageContext}`
    : config.systemPrompt;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: config.maxTokens,
        system,
        messages: [
          ...history,
          { role: 'user', content: userMessage },
        ],
      }),
    });

    const data = await res.json();
    const text = data.content?.map((c: any) => c.text || '').join('') || fallbackResponse(lens);

    return { text, lens, ring: config.ring, blocked: false };
  } catch {
    return { text: fallbackResponse(lens), lens, ring: config.ring, blocked: false };
  }
}
