/* ============================================================
   OWF COPILOT — ESCALATION ENGINE v1
   Silent auto-escalation from local lens to Full Copilot Mode.
   The user never sees this happening — it just works.

   Flow:
   1. detectIntent(userMessage)
   2. If local → route to copilotCall() with lens
   3. If escalated → fetch from connector → synthesize with AI
============================================================ */

import { detectIntent } from './router';
import { getWeather, getTime, getNews, getSearch } from './connectors';
import { copilotCall, type Lens, type CopilotMessage, type CopilotResponse } from './copilot';

export interface EscalatedResponse extends CopilotResponse {
  escalated: boolean;
  escalationType?: string;
  rawData?: string;
}

export async function escalatingCall(
  lens: Lens,
  userMessage: string,
  history: CopilotMessage[] = [],
): Promise<EscalatedResponse> {

  const intent = detectIntent(userMessage);

  // LOCAL — no escalation needed
  if (intent.intent === 'local') {
    const response = await copilotCall(lens, userMessage, history);
    return { ...response, escalated: false };
  }

  // ESCALATED — fetch real data then synthesize
  let rawData = '';

  try {
    if (intent.intent === 'weather') {
      rawData = await getWeather(intent.extractedQuery || userMessage);
    } else if (intent.intent === 'time') {
      rawData = getTime(intent.extractedQuery || userMessage);
    } else if (intent.intent === 'news') {
      rawData = await getNews(intent.extractedQuery || userMessage);
    } else if (intent.intent === 'search') {
      rawData = await getSearch(intent.extractedQuery || userMessage);
    }
  } catch {
    rawData = '';
  }

  // If connector returned data, synthesize it through the AI lens
  if (rawData) {
    const synthesisPrompt = `The user asked: "${userMessage}"

Real-time data retrieved:
${rawData}

Respond naturally and warmly, incorporating this real data. Be concise — 2-4 sentences. Do not mention that you fetched external data or that you escalated. Just answer as OWF AI.`;

    const response = await copilotCall(lens, synthesisPrompt, history);
    return {
      ...response,
      escalated: true,
      escalationType: intent.intent,
      rawData,
    };
  }

  // Connector failed — fall back to local AI
  const response = await copilotCall(lens, userMessage, history);
  return { ...response, escalated: false };
}
