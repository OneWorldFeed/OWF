/* ============================================================
   OWF COPILOT — INTENT ROUTER v1
   Silently detects when a request needs escalation from
   local micro-AI to Full Copilot Mode with external APIs.

   GOVERNANCE: Any change to escalation patterns requires
   a GOVERNANCE_LOG entry in copilot.ts
============================================================ */

export type Intent =
  | 'local'      // Feed, culture, tags, summaries — handled by lens
  | 'weather'    // Real-time weather for any city
  | 'time'       // Current time in any city/timezone
  | 'news'       // Live headlines and current events
  | 'search'     // General web search

interface IntentMatch {
  intent: Intent;
  confidence: 'high' | 'medium';
  extractedQuery?: string;
}

const INTENT_PATTERNS: { intent: Intent; patterns: RegExp[] }[] = [
  {
    intent: 'weather',
    patterns: [
      /weather\s+(in|at|for)\s+(.+)/i,
      /what('s| is) (the )?weather\s*(in|at|for)?\s*(.+)?/i,
      /is it (raining|sunny|cold|hot|warm|snowing)\s*(in|at)?\s*(.+)?/i,
      /temperature\s*(in|at|for)?\s*(.+)?/i,
      /how (hot|cold|warm)\s*(is it)?\s*(in|at)?\s*(.+)?/i,
    ],
  },
  {
    intent: 'time',
    patterns: [
      /what (time|hour) is it\s*(in|at)?\s*(.+)?/i,
      /current time\s*(in|at|for)?\s*(.+)?/i,
      /time (in|at|for)\s+(.+)/i,
      /what('s| is) (the )?time\s*(in|at|for)?\s*(.+)?/i,
      /clock\s*(in|at)?\s*(.+)?/i,
    ],
  },
  {
    intent: 'news',
    patterns: [
      /latest news/i,
      /what('s| is) (happening|going on|new|the news)/i,
      /news (in|about|from|on)\s*(.+)?/i,
      /current events/i,
      /headlines/i,
      /breaking news/i,
      /what happened (today|recently|this week)/i,
      /tell me about .*(today|recently|this week|latest)/i,
    ],
  },
  {
    intent: 'search',
    patterns: [
      /search (for |about |on )?(.+)/i,
      /look up (.+)/i,
      /find (information|info|details) (about|on) (.+)/i,
      /who is (.+)/i,
      /what is (.+) (company|organization|country|city|person)/i,
      /how (do|does|did|can|to) (.+)/i,
      /why (is|are|did|does) (.+)/i,
      /when (did|was|is) (.+)/i,
      /where (is|was|are) (.+)/i,
      /explain (.+)/i,
      /tell me (about|more about) (.+)/i,
    ],
  },
];

export function detectIntent(input: string): IntentMatch {
  const lower = input.toLowerCase().trim();

  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        // Try to extract the key query term
        const match = lower.match(pattern);
        const extractedQuery = match?.slice(-1)[0]?.trim();
        return {
          intent,
          confidence: 'high',
          extractedQuery: extractedQuery || input,
        };
      }
    }
  }

  return { intent: 'local', confidence: 'high' };
}
