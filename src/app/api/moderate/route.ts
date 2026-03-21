/**
 * OWF Content Moderation Route
 *
 * POST /api/moderate — accepts { text, surface } and runs the
 * multi-layer moderation pipeline. Rate limited to 30 req/min per IP.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  moderateText,
  buildModerateResponse,
  type ModerationSurface,
} from '@/lib/moderation';

// ── Valid surfaces ──────────────────────────────────────────────
const VALID_SURFACES = new Set<ModerationSurface>([
  'post',
  'dm',
  'comment',
  'bio',
  'displayName',
]);

// ── IP rate limiting (in-memory, resets on cold start) ──────────
const IP_REQUESTS = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_MINUTE = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = IP_REQUESTS.get(ip);
  if (!entry || now > entry.resetAt) {
    IP_REQUESTS.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > MAX_PER_MINUTE;
}

// ── POST handler ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 },
    );
  }

  // Parse body
  let body: { text?: unknown; surface?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Validate text
  if (!body.text || typeof body.text !== 'string') {
    return NextResponse.json({ error: 'text is required and must be a string.' }, { status: 400 });
  }

  // Validate surface
  if (!body.surface || !VALID_SURFACES.has(body.surface as ModerationSurface)) {
    return NextResponse.json(
      { error: `surface must be one of: ${[...VALID_SURFACES].join(', ')}` },
      { status: 400 },
    );
  }

  const surface = body.surface as ModerationSurface;

  // Run moderation pipeline
  const result = await moderateText(body.text, surface);

  return NextResponse.json(buildModerateResponse(result));
}

// ── Block other methods ─────────────────────────────────────────

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
