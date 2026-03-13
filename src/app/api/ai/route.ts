import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { sanitize, checkRateLimit } from '@/lib/sanitize';

// ── Per-user rate limit tracking (in-memory, resets on cold start) ──
const USER_REQUESTS: Map<string, { count: number; resetAt: number }> = new Map();

const MAX_REQUESTS_PER_HOUR = 20;
const MAX_REQUESTS_PER_MINUTE = 3;

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

export async function POST(req: NextRequest) {
  try {
    // ── 1. Verify Firebase auth token ──────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.slice(7);
    let uid: string;

    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      uid = decoded.uid;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // ── 2. Rate limit ──────────────────────────────────────
    const rateCheck = checkUserRateLimit(uid);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.reason === 'hourly_limit'
            ? 'You have reached your hourly AI limit. Try again later.'
            : 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    // ── 3. Validate + sanitize request body ───────────────
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Sanitize each message
    const safeMessages = body.messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: sanitize(msg.content, 'postText', { multiline: true }).value,
    })).filter((m: any) => m.content.length > 0);

    if (safeMessages.length === 0) {
      return NextResponse.json({ error: 'Empty message' }, { status: 400 });
    }

    // ── 4. Call Anthropic API (server-side, key never exposed) ──
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      body.model ?? 'claude-sonnet-4-20250514',
        max_tokens: Math.min(body.max_tokens ?? 1000, 2000), // cap at 2000
        system:     body.system ? sanitize(body.system, 'postText').value : undefined,
        messages:   safeMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return NextResponse.json({ error: 'AI request failed' }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error('AI route error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Block non-POST methods
export async function GET()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
