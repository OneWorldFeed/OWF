/* ============================================================
   OWF COPILOT — AI GOVERNANCE LAYER v1.0
   Central intelligence that routes all AI calls through
   the correct lens with the correct constraints.

   GOVERNANCE RITUALS — Founder-grade review required when:
   • Adding a new page or surface
   • Changing lens capabilities or maxTokens
   • Updating safety or editorial rules
   • Promoting a lens version (e.g. social-v1 → social-v2)

   VERSIONING:
   • Lens configs versioned — e.g. ai_page-v1, social-v1
   • Safety policy versioned independently
   • All version changes logged in GOVERNANCE_LOG
   ============================================================ */

export type Lens =
  | 'ai_page'
  | 'social'
  | 'news'
  | 'dm'
  | 'creator'
  | 'right_panel';

export type ModeRing = 'creative' | 'civic' | 'support';

/* ============================================================
   GOVERNANCE LOG
   Every change to a lens or safety policy must be recorded here.
   Format: { date, author, change, lensVersion, safetyVersion }
============================================================ */
export const GOVERNANCE_LOG = [
  {
    date: '2026-03-06',
    author: 'Founder',
    change: 'Initial lens system created. All 6 lenses defined. Safety policy v1 established.',
    lensVersions: {
      ai_page: 'v1', social: 'v1', news: 'v1',
      dm: 'v1', creator: 'v1', right_panel: 'v1',
    },
    safetyVersion: 'v1',
  },
] as const;

/* ============================================================
   LENS VERSION MANIFEST
   Current active version for each lens.
   Bump version here + add GOVERNANCE_LOG entry for every change.
============================================================ */
export const LENS_VERSIONS: Record<Lens, string> = {
  ai_page:     'v1',
  social:      'v1',
  news:        'v1',
  dm:          'v1',
  creator:     'v1',
  right_panel: 'v1',
};

/* ============================================================
   SAFETY POLICY — v1
   Version this independently from lens configs.
   Any change requires founder-grade review + GOVERNANCE_LOG entry.
============================================================ */
export const SAFETY_POLICY_VERSION = 'v1';

const SAFETY_BLOCKED_PATTERNS = [
  /\b(medical advice|legal advice|diagnos|prescri)\b/i,
  /\b(suicide|self.harm|self harm|kill myself|end my life)\b/i,
  /how to (make|build|create|synthesize) (a )?(bomb|weapon|gun|explosive|drug|poison)/i,
  /\b(child abuse|csam|grooming)\b/i,
  /\b(hack|exploit|malware|ransomware|phishing)\b/i,
];

const SAFETY_REDIRECT: Record<Lens, string> = {
  ai_page:     'That request falls outside what OWF AI can help with. Try asking about the feed, cities, or global culture.',
  social:      'I can\'t help with that. Ask me about the feed!',
  news:        'I\'m not able to cover that topic. Try a different question.',
  dm:          'I\'m not able to help with that, but I\'m here if you want to talk about something else.',
  creator:     'I can\'t generate that content. Describe what you\'d like to post instead.',
  right_panel: 'The world is full of stories. Ask me about the feed.',
};

function safetyCheck(input: string, lens: Lens): { safe: boolean; redirect?: string } {
  for (const pattern of SAFETY_BLOCKED_PATTERNS) {
    if (pattern.test(input)) {
      return { safe: false, redirect: SAFETY_REDIRECT[lens] };
    }
  }
  return { safe: true };
}

/* ============================================================
   PLATFORM IDENTITY — shared across all lenses
============================================================ */
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

/* ============================================================
   LENS CONFIGS — versioned
   To upgrade a lens:
   1. Change the config below
   2. Bump LENS_VERSIONS[lens]
   3. Add entry to GOVERNANCE_LOG
============================================================ */
interface LensConfig {
  version: string;
  ring: ModeRing;
  maxTokens: number;
  allowLongReasoning: boolean;
  allowSpeculation: boolean;
  allowPolitical: boolean;
  emotionalTone: 'warm' | 'neutral' | 'empathetic' | 'poetic';
  systemPrompt: string;
}

export const LENS_CONFIGS: Record<Lens, LensConfig> = {

  /* ── AI PAGE — v1 ────────────────────────────────────────── */
  ai_page: {
    version: 'v1',
    ring: 'creative',
    maxTokens: 600,
    allowLongReasoning: true,
    allowSpeculation: true,
    allowPolitical: false,
    emotionalTone: 'poetic',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: AI Page (${LENS_VERSIONS.ai_page}) — Full Power Mode
You have access to the full platform context and can engage in long-form reasoning, creative analysis, and structured content generation. You are the command center of OWF's intelligence layer.

${FEED_CONTEXT}

Guidelines:
- Be poetic, vivid, and culturally intelligent
- Reason deeply when asked
- Suggest +tags, cities, and cultural connections where relevant
- Never speculate about real people's private lives
- Never generate political persuasion content`,
  },

  /* ── SOCIAL — v1 ─────────────────────────────────────────── */
  social: {
    version: 'v1',
    ring: 'creative',
    maxTokens: 150,
    allowLongReasoning: false,
    allowSpeculation: false,
    allowPolitical: false,
    emotionalTone: 'warm',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: Social Feed (${LENS_VERSIONS.social}) — Short-Form Mode
Keep responses short, warm, and conversational. 1-2 sentences only. No heavy analysis.

${FEED_CONTEXT}`,
  },

  /* ── NEWS — v1 ───────────────────────────────────────────── */
  news: {
    version: 'v1',
    ring: 'civic',
    maxTokens: 300,
    allowLongReasoning: false,
    allowSpeculation: false,
    allowPolitical: false,
    emotionalTone: 'neutral',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: News (${LENS_VERSIONS.news}) — Fact-Anchored Mode
Factual summaries and neutral context only. No speculation. No political persuasion. No opinion. If uncertain about a fact, say so clearly.`,
  },

  /* ── DM — v1 ─────────────────────────────────────────────── */
  dm: {
    version: 'v1',
    ring: 'support',
    maxTokens: 200,
    allowLongReasoning: false,
    allowSpeculation: false,
    allowPolitical: false,
    emotionalTone: 'empathetic',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: Direct Message (${LENS_VERSIONS.dm}) — Support Mode
Warm, supportive, emotionally intelligent. Never give medical or legal advice. Never act as a therapist. Keep responses brief and human. If someone seems in distress, gently suggest they speak to someone they trust.`,
  },

  /* ── CREATOR — v1 ────────────────────────────────────────── */
  creator: {
    version: 'v1',
    ring: 'creative',
    maxTokens: 400,
    allowLongReasoning: true,
    allowSpeculation: false,
    allowPolitical: false,
    emotionalTone: 'warm',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: Creator Tools (${LENS_VERSIONS.creator}) — Drafting Mode
Help creators write, edit, structure, and caption posts. Suggest +tags relevant to their content and city. Never hallucinate facts. Match the creator's tone. Keep outputs ready to post — clean, vivid, culturally aware.

${FEED_CONTEXT}`,
  },

  /* ── RIGHT PANEL — v1 ────────────────────────────────────── */
  right_panel: {
    version: 'v1',
    ring: 'civic',
    maxTokens: 150,
    allowLongReasoning: false,
    allowSpeculation: false,
    allowPolitical: false,
    emotionalTone: 'poetic',
    systemPrompt: `${PLATFORM_IDENTITY}

LENS: Right Panel (${LENS_VERSIONS.right_panel}) — Micro-Insight Mode
Deliver brief, poetic insights in 2-3 sentences maximum. No lists. No long reasoning. Vivid, warm, intelligent observations about the global feed.

${FEED_CONTEXT}`,
  },
};

/* ============================================================
   TELEMETRY SERVICE — v1
   Logs every AI call for auditability.
   In production: ship to Firestore /telemetry collection.
============================================================ */
export interface TelemetryEvent {
  timestamp: string;
  lens: Lens;
  lensVersion: string;
  safetyVersion: string;
  ring: ModeRing;
  blocked: boolean;
  blockReason?: string;
  inputLength: number;
  outputLength: number;
  durationMs: number;
}

const telemetryBuffer: TelemetryEvent[] = [];

function recordTelemetry(event: TelemetryEvent) {
  telemetryBuffer.push(event);
  if (process.env.NODE_ENV === 'development') {
    console.log(`[OWF Copilot] ${event.lens}@${event.lensVersion} | blocked:${event.blocked} | ${event.durationMs}ms`);
  }
  // TODO: flush to Firestore in production
  // if (telemetryBuffer.length >= 10) flushTelemetry();
}

export function getTelemetryBuffer(): TelemetryEvent[] {
  return [...telemetryBuffer];
}

/* ============================================================
   MAIN COPILOT CALL
   All AI surfaces must call this function.
   Direct fetch() calls to Anthropic are not permitted.
============================================================ */
export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CopilotResponse {
  text: string;
  lens: Lens;
  lensVersion: string;
  ring: ModeRing;
  blocked: boolean;
  telemetry: TelemetryEvent;
}

export async function copilotCall(
  lens: Lens,
  userMessage: string,
  history: CopilotMessage[] = [],
  pageContext?: string,
): Promise<CopilotResponse> {
  const config = LENS_CONFIGS[lens];
  const startTime = Date.now();

  // Safety check — runs before any model call
  const safety = safetyCheck(userMessage, lens);
  if (!safety.safe) {
    const telemetry: TelemetryEvent = {
      timestamp: new Date().toISOString(),
      lens,
      lensVersion: config.version,
      safetyVersion: SAFETY_POLICY_VERSION,
      ring: config.ring,
      blocked: true,
      blockReason: 'safety_filter',
      inputLength: userMessage.length,
      outputLength: 0,
      durationMs: Date.now() - startTime,
    };
    recordTelemetry(telemetry);
    return { text: safety.redirect!, lens, lensVersion: config.version, ring: config.ring, blocked: true, telemetry };
  }

  // Build system prompt
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
    const text = data.content?.map((c: any) => c.text || '').join('') || SAFETY_REDIRECT[lens];

    const telemetry: TelemetryEvent = {
      timestamp: new Date().toISOString(),
      lens,
      lensVersion: config.version,
      safetyVersion: SAFETY_POLICY_VERSION,
      ring: config.ring,
      blocked: false,
      inputLength: userMessage.length,
      outputLength: text.length,
      durationMs: Date.now() - startTime,
    };
    recordTelemetry(telemetry);

    return { text, lens, lensVersion: config.version, ring: config.ring, blocked: false, telemetry };

  } catch {
    const telemetry: TelemetryEvent = {
      timestamp: new Date().toISOString(),
      lens,
      lensVersion: config.version,
      safetyVersion: SAFETY_POLICY_VERSION,
      ring: config.ring,
      blocked: false,
      blockReason: 'network_error',
      inputLength: userMessage.length,
      outputLength: 0,
      durationMs: Date.now() - startTime,
    };
    recordTelemetry(telemetry);
    return { text: SAFETY_REDIRECT[lens], lens, lensVersion: config.version, ring: config.ring, blocked: false, telemetry };
  }
}
