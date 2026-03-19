/**
 * OWF AI Proxy Route
 *
 * Server-side proxy for Anthropic API calls.
 * Keeps the API key on the server (not exposed via NEXT_PUBLIC_).
 * Applies rate limiting, input sanitization, and safety checks
 * before forwarding to Claude.
 *
 * Supports two request formats:
 * 1. Direct:     { model, max_tokens, system, messages } — used by copilot.ts
 * 2. Lens-based: { lens, message, history } — used by lens UI
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { sanitize, sanitizeText } from '@/lib/sanitize';
import {
  LENS_CONFIGS,
  type Lens,
  type CopilotMessage,
} from '@/lib/ai/copilot';

// ── Per-user rate limit tracking (in-memory, resets on cold start) ──
const USER_REQUESTS: Map<string, { count: number; resetAt: number }> = new Map();

const MAX_REQUESTS_PER_HOUR = 20;
const MAX_REQUESTS_PER_MINUTE = 3;
const MAX_USER_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 20;

function checkUserRateLimit(uid: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const hourKey = `${uid}_hour`;
  const minKey  = `${uid}_min`;

  // Per-hour check
  const hourData = USER_REQUESTS.get(hourKey);
  if (!hourData || now > hourData.resetAt) {
    USER_REQUESTS.set(hourKey, { count: 1, resetAt: now + 3_600_000 });
  } else {
    if (hourData.count >= MAX_REQUESTS_PER_HOUR) {
      return { allowed: false, reason: 'hourly_limit' };
    }
    hourData.count++;
  }

  // Per-minute check
  const minData = USER_REQUESTS.get(minKey);
  if (!minData || now > minData.resetAt) {
    USER_REQUESTS.set(minKey, { count: 1, resetAt: now + 60_000 });
  } else {
    if (minData.count >= MAX_REQUESTS_PER_MINUTE) {
      return { allowed: false, reason: 'minute_limit' };
    }
    minData.count++;
  }

  return { allowed: true };
}

// ── IP-based rate limiting (fallback for unauthenticated lens requests) ──
const IP_REQUESTS = new Map<string, { count: number; resetAt: number }>();
const IP_RATE_LIMIT_MAX = 20;

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = IP_REQUESTS.get(ip);
  if (!entry || now > entry.resetAt) {
    IP_REQUESTS.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > IP_RATE_LIMIT_MAX;
}

// ── Allowed lenses ──────────────────────────────────────────────────────────
const ALLOWED_LENSES = new Set<string>(Object.keys(LENS_CONFIGS));

// ── Anthropic call helper ───────────────────────────────────────────────────
async function callAnthropic(apiKey: string, payload: {
  model: string;
  max_tokens: number;
  system?: string;
  messages: Array<{ role: string; content: string }>;
}) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('[OWF AI Route] Anthropic error:', res.status, errorText);
    return null;
  }

  return res.json();
}

// ── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Parse body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Check API key (server-side only)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  // ── Format 1: Direct passthrough from copilot.ts ────────────────────────
  // Body shape: { model, max_tokens, system, messages }
  // Requires Firebase auth
  if (body.messages && Array.isArray(body.messages) && !body.lens) {
    // Verify Firebase auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
      uid = decoded.uid;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Rate limit by user
    const rateCheck = checkUserRateLimit(uid);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.reason === 'hourly_limit'
            ? 'You have reached your hourly AI limit. Try again later.'
            : 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    // Sanitize messages
    const safeMessages = body.messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: sanitize(msg.content, 'postText', { multiline: true }).value,
    })).filter((m: any) => m.content.length > 0);

    if (safeMessages.length === 0) {
      return NextResponse.json({ error: 'Empty message' }, { status: 400 });
    }

    try {
      const data = await callAnthropic(apiKey, {
        model: body.model ?? 'claude-sonnet-4-20250514',
        max_tokens: Math.min(body.max_tokens ?? 1000, 2000),
        system: body.system ? sanitize(body.system, 'postText').value : undefined,
        messages: safeMessages,
      });

      if (!data) {
        return NextResponse.json({ error: 'AI service temporarily unavailable.' }, { status: 502 });
      }

      // Return in Anthropic format so copilot.ts can parse data.content
      return NextResponse.json(data);
    } catch (err) {
      console.error('[OWF AI Route] Network error:', err);
      return NextResponse.json({ error: 'AI service temporarily unavailable.' }, { status: 502 });
    }
  }

  // ── Format 2: Lens-based ────────────────────────────────────────────────
  const { lens, message, history } = body;

  // IP-based rate limit for lens requests
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
  if (isIpRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  // Validate lens
  if (!lens || !ALLOWED_LENSES.has(lens)) {
    return NextResponse.json({ error: 'Invalid lens.' }, { status: 400 });
  }

  // Validate message
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  // Sanitize message
  const sanitizedMessage = sanitizeText(message, MAX_USER_MESSAGE_LENGTH);
  if (!sanitizedMessage) {
    return NextResponse.json({ error: 'Message is empty after sanitization.' }, { status: 400 });
  }

  // Sanitize history
  const sanitizedHistory: CopilotMessage[] = [];
  if (Array.isArray(history)) {
    for (const msg of history.slice(-MAX_HISTORY_LENGTH)) {
      if (
        msg &&
        typeof msg.role === 'string' &&
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string'
      ) {
        sanitizedHistory.push({
          role: msg.role,
          content: sanitizeText(msg.content, MAX_USER_MESSAGE_LENGTH),
        });
      }
    }
  }

  // Get lens config
  const config = LENS_CONFIGS[lens as Lens];

  // Forward to Anthropic
  try {
    const data = await callAnthropic(apiKey, {
      model: 'claude-sonnet-4-20250514',
      max_tokens: config.maxTokens,
      system: config.systemPrompt,
      messages: [
        ...sanitizedHistory,
        { role: 'user', content: sanitizedMessage },
      ],
    });

    if (!data) {
      return NextResponse.json({ error: 'AI service temporarily unavailable.' }, { status: 502 });
    }

    const text = data.content?.map((c: { text?: string }) => c.text || '').join('') || '';

    return NextResponse.json({
      text,
      lens,
      lensVersion: config.version,
    });
  } catch (err) {
    console.error('[OWF AI Route] Network error:', err);
    return NextResponse.json({ error: 'AI service temporarily unavailable.' }, { status: 502 });
  }
}

// Block non-POST methods
export async function GET()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
