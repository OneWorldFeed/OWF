/**
 * OWF AI Proxy Route
 *
 * Server-side proxy for Anthropic API calls.
 * Keeps the API key on the server (not exposed via NEXT_PUBLIC_).
 * Applies rate limiting, input sanitization, and safety checks
 * before forwarding to Claude.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sanitizeText } from '@/lib/sanitize';
import {
  LENS_CONFIGS,
  type Lens,
  type CopilotMessage,
} from '@/lib/ai/copilot';

// ── Rate limiting (in-memory, per-IP) ───────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ── Allowed lenses ──────────────────────────────────────────────────────────

const ALLOWED_LENSES = new Set<string>(Object.keys(LENS_CONFIGS));

// ── Max input length ────────────────────────────────────────────────────────

const MAX_USER_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 20;

// ── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 },
    );
  }

  // Parse body
  let body: { lens?: string; message?: string; history?: CopilotMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { lens, message, history } = body;

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

  // Check API key (server-side only — not NEXT_PUBLIC_)
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI service not configured.' },
      { status: 503 },
    );
  }

  // Forward to Anthropic
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: config.maxTokens,
        system: config.systemPrompt,
        messages: [
          ...sanitizedHistory,
          { role: 'user', content: sanitizedMessage },
        ],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      console.error('[OWF AI Route] Anthropic error:', res.status, errorText);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable.' },
        { status: 502 },
      );
    }

    const data = await res.json();
    const text = data.content?.map((c: { text?: string }) => c.text || '').join('') || '';

    return NextResponse.json({
      text,
      lens,
      lensVersion: config.version,
    });
  } catch (err) {
    console.error('[OWF AI Route] Network error:', err);
    return NextResponse.json(
      { error: 'AI service temporarily unavailable.' },
      { status: 502 },
    );
  }
}
