import { detectIntent } from './router';
import { rulesEngineCall } from './rules-engine';
import { copilotCall, type Lens, type CopilotMessage, type CopilotResponse } from './copilot';
import { getWeather, getTime, getNews, getSearch, getWikiSummary, getExchangeRate, getHolidays } from './connectors';

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

  const hasApiKey = true; // Always try /api/ai — key is server-side now

  if (!hasApiKey) {
    const rules = rulesEngineCall(userMessage);
    return {
      text: rules.text,
      lens,
      lensVersion: 'rules-v1',
      ring: 'civic',
      blocked: false,
      escalated: false,
      telemetry: {
        timestamp: new Date().toISOString(),
        lens,
        lensVersion: 'rules-v1',
        safetyVersion: 'v1',
        ring: 'civic',
        blocked: false,
        inputLength: userMessage.length,
        outputLength: rules.text.length,
        durationMs: 0,
      },
    };
  }

  const intent = detectIntent(userMessage);

  if (intent.intent === 'local') {
    const response = await copilotCall(lens, userMessage, history);
    return { ...response, escalated: false };
  }

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
    } else if (intent.intent === 'wiki') {
      rawData = await getWikiSummary(intent.extractedQuery || userMessage);
    } else if (intent.intent === 'currency') {
      rawData = await getExchangeRate(intent.extractedQuery || userMessage);
    } else if (intent.intent === 'holiday') {
      rawData = await getHolidays(intent.extractedQuery || userMessage);
    }
  } catch {
    rawData = '';
  }

  if (rawData) {
    const synthesisPrompt = `The user asked: "${userMessage}"\n\nReal-time data retrieved:\n${rawData}\n\nRespond naturally and warmly, incorporating this real data. Be concise — 2-4 sentences. Do not mention that you fetched external data. Just answer as OWF AI.`;
    const response = await copilotCall(lens, synthesisPrompt, history, undefined, true);
    return { ...response, escalated: true, escalationType: intent.intent, rawData };
  }

  const response = await copilotCall(lens, userMessage, history);
  return { ...response, escalated: false };
}
