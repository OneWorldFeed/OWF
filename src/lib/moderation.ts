// ─────────────────────────────────────────────────────────────
//  OWF Multi-Layer Content Moderation
//
//  Three layers, fail-open on network errors (Firestore is final gate):
//    1. Local regex fast-pass — self-harm, CSAM, weapons, spam
//    2. Google Perspective API — toxicity, identity attack, threats
//    3. Hugging Face free inference — hate speech + toxic-bert (parallel)
//
//  Every surface (post, dm, comment, bio, displayName) has its own
//  threshold profile so DMs can be stricter than posts, etc.
// ─────────────────────────────────────────────────────────────

/* ── Types ──────────────────────────────────────────────────── */

export type ModerationSurface = 'post' | 'dm' | 'comment' | 'bio' | 'displayName';

export interface LocalMatch {
  category: 'self_harm' | 'csam' | 'weapons' | 'spam';
  pattern: string;
}

export interface PerspectiveScores {
  toxicity: number;
  identityAttack: number;
  threat: number;
}

export interface HuggingFaceScores {
  hateRoberta: number;
  toxicBert: number;
}

export interface ModerationResult {
  /** true = content should be blocked */
  blocked: boolean;
  /** Which layer triggered the block (or null if allowed) */
  blockedBy: 'local' | 'perspective' | 'huggingface' | null;
  /** Crisis content that may need urgent intervention */
  crisis: boolean;
  surface: ModerationSurface;
  localMatches: LocalMatch[];
  perspective: PerspectiveScores | null;
  huggingface: HuggingFaceScores | null;
  /** ISO timestamp */
  ts: string;
}

export interface ProfileModerationResult {
  displayName: ModerationResult | null;
  bio: ModerationResult | null;
  /** Overall: blocked if any field is blocked */
  blocked: boolean;
  crisis: boolean;
}

/* ── Layer 1: Local Regex Fast-Pass ─────────────────────────── */

const LOCAL_PATTERNS: { category: LocalMatch['category']; re: RegExp }[] = [
  // Self-harm / suicide
  { category: 'self_harm', re: /\b(kill\s*(my|your)?self|sui[cs]ide|end\s+my\s+life|self[- ]?harm|cut\s+my\s*(wrists?|arms?))\b/i },
  { category: 'self_harm', re: /\b(hang\s+myself|jump\s+off|overdose\s+on|want\s+to\s+die|don'?t\s+want\s+to\s+live)\b/i },

  // CSAM / grooming
  { category: 'csam', re: /\b(child\s*(porn|sex|abuse|exploitation)|csam|groom(ing)?\s+(a\s+)?(child|minor|kid))\b/i },
  { category: 'csam', re: /\b(underage\s*(sex|nude|porn)|pedo(phile|philia)?)\b/i },

  // Weapon / explosive instructions
  { category: 'weapons', re: /how\s+to\s+(make|build|create|assemble|synthesize)\s+(a\s+)?(bomb|explosive|weapon|gun|firearm|poison|nerve\s*agent|ricin|sarin)/i },
  { category: 'weapons', re: /\b(3d[- ]?print(ed)?\s+(gun|weapon|firearm)|ghost\s+gun\s+build)\b/i },

  // Spam / scam
  { category: 'spam', re: /\b(buy\s+followers|free\s+iphone|click\s+(here|now)\s+to\s+win|nigerian\s+prince)\b/i },
  { category: 'spam', re: /\b(earn\s+\$?\d+k?\s*(daily|weekly|monthly)|work\s+from\s+home\s+\$)\b/i },
  { category: 'spam', re: /(https?:\/\/[^\s]+){5,}/i }, // 5+ URLs in one text = spam
];

/** Synchronous local regex check — always runs first. */
export function quickLocalCheck(text: string): LocalMatch[] {
  const matches: LocalMatch[] = [];
  for (const { category, re } of LOCAL_PATTERNS) {
    if (re.test(text)) {
      matches.push({ category, pattern: re.source });
    }
  }
  return matches;
}

/* ── Layer 2: Google Perspective API ────────────────────────── */

/** Per-surface thresholds for Perspective attributes. */
const PERSPECTIVE_THRESHOLDS: Record<ModerationSurface, PerspectiveScores> = {
  post:        { toxicity: 0.85, identityAttack: 0.80, threat: 0.80 },
  comment:     { toxicity: 0.80, identityAttack: 0.75, threat: 0.75 },
  dm:          { toxicity: 0.90, identityAttack: 0.80, threat: 0.70 },
  bio:         { toxicity: 0.80, identityAttack: 0.75, threat: 0.75 },
  displayName: { toxicity: 0.70, identityAttack: 0.65, threat: 0.70 },
};

async function callPerspective(text: string): Promise<PerspectiveScores | null> {
  const apiKey = process.env.PERSPECTIVE_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3_000);

  try {
    const res = await fetch(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          comment: { text },
          requestedAttributes: {
            TOXICITY: {},
            IDENTITY_ATTACK: {},
            THREAT: {},
          },
          doNotStore: true,
        }),
      },
    );

    if (!res.ok) return null;

    const data = await res.json();
    const scores = data.attributeScores;
    return {
      toxicity:       scores?.TOXICITY?.summaryScore?.value ?? 0,
      identityAttack: scores?.IDENTITY_ATTACK?.summaryScore?.value ?? 0,
      threat:         scores?.THREAT?.summaryScore?.value ?? 0,
    };
  } catch {
    // Fail open — network error or timeout
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function perspectiveExceedsThreshold(
  scores: PerspectiveScores,
  surface: ModerationSurface,
): boolean {
  const t = PERSPECTIVE_THRESHOLDS[surface];
  return (
    scores.toxicity >= t.toxicity ||
    scores.identityAttack >= t.identityAttack ||
    scores.threat >= t.threat
  );
}

/* ── Layer 3: Hugging Face Free Inference (no API key) ──────── */

const HF_INFERENCE_BASE = 'https://api-inference.huggingface.co/models';

async function callHuggingFaceModel(
  model: string,
  text: string,
): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const res = await fetch(`${HF_INFERENCE_BASE}/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ inputs: text }),
    });

    if (!res.ok) return 0;

    const data = await res.json();
    // HF text-classification returns [[{label, score}, ...]]
    // Find the toxic/hate label's score
    const flat: { label: string; score: number }[] = Array.isArray(data?.[0]) ? data[0] : data;
    if (!Array.isArray(flat)) return 0;

    const toxic = flat.find(
      (d) =>
        d.label?.toLowerCase() === 'hate' ||
        d.label?.toLowerCase() === 'toxic' ||
        d.label?.toLowerCase() === 'label_1', // toxic-bert uses LABEL_1 for toxic
    );
    return toxic?.score ?? 0;
  } catch {
    // Fail open
    return 0;
  } finally {
    clearTimeout(timeout);
  }
}

const HF_ROBERTA_MODEL = 'facebook/roberta-hate-speech-dynabench-r4-target';
const HF_TOXIC_BERT_MODEL = 'unitary/toxic-bert';

const HF_THRESHOLDS: Record<ModerationSurface, { hateRoberta: number; toxicBert: number }> = {
  post:        { hateRoberta: 0.85, toxicBert: 0.85 },
  comment:     { hateRoberta: 0.80, toxicBert: 0.80 },
  dm:          { hateRoberta: 0.90, toxicBert: 0.90 },
  bio:         { hateRoberta: 0.80, toxicBert: 0.80 },
  displayName: { hateRoberta: 0.70, toxicBert: 0.70 },
};

async function callHuggingFace(text: string): Promise<HuggingFaceScores | null> {
  const [hateRoberta, toxicBert] = await Promise.all([
    callHuggingFaceModel(HF_ROBERTA_MODEL, text),
    callHuggingFaceModel(HF_TOXIC_BERT_MODEL, text),
  ]);

  // Both returned 0 likely means both failed — treat as null
  if (hateRoberta === 0 && toxicBert === 0) return null;

  return { hateRoberta, toxicBert };
}

function hfExceedsThreshold(
  scores: HuggingFaceScores,
  surface: ModerationSurface,
): boolean {
  const t = HF_THRESHOLDS[surface];
  return scores.hateRoberta >= t.hateRoberta || scores.toxicBert >= t.toxicBert;
}

/* ── Core: moderateText ─────────────────────────────────────── */

export async function moderateText(
  text: string,
  surface: ModerationSurface,
): Promise<ModerationResult> {
  const ts = new Date().toISOString();
  const base: ModerationResult = {
    blocked: false,
    blockedBy: null,
    crisis: false,
    surface,
    localMatches: [],
    perspective: null,
    huggingface: null,
    ts,
  };

  if (!text || text.trim().length === 0) return base;

  // Layer 1 — local regex (synchronous, instant)
  const localMatches = quickLocalCheck(text);
  base.localMatches = localMatches;
  base.crisis = localMatches.some((m) => m.category === 'self_harm');

  if (localMatches.some((m) => m.category === 'csam' || m.category === 'weapons')) {
    return { ...base, blocked: true, blockedBy: 'local' };
  }
  // Spam blocks everywhere except DMs
  if (localMatches.some((m) => m.category === 'spam') && surface !== 'dm') {
    return { ...base, blocked: true, blockedBy: 'local' };
  }

  // Layers 2 & 3 — run in parallel, fail open on errors
  const [perspective, huggingface] = await Promise.all([
    callPerspective(text),
    callHuggingFace(text),
  ]);

  base.perspective = perspective;
  base.huggingface = huggingface;

  // Layer 2 — Perspective
  if (perspective && perspectiveExceedsThreshold(perspective, surface)) {
    return { ...base, blocked: true, blockedBy: 'perspective' };
  }

  // Layer 3 — Hugging Face
  if (huggingface && hfExceedsThreshold(huggingface, surface)) {
    return { ...base, blocked: true, blockedBy: 'huggingface' };
  }

  return base;
}

/* ── moderateProfile ────────────────────────────────────────── */

export async function moderateProfile(profile: {
  displayName?: string;
  bio?: string;
}): Promise<ProfileModerationResult> {
  const [displayName, bio] = await Promise.all([
    profile.displayName ? moderateText(profile.displayName, 'displayName') : null,
    profile.bio ? moderateText(profile.bio, 'bio') : null,
  ]);

  return {
    displayName,
    bio,
    blocked: (displayName?.blocked ?? false) || (bio?.blocked ?? false),
    crisis: (displayName?.crisis ?? false) || (bio?.crisis ?? false),
  };
}

/* ── isCrisisContent ────────────────────────────────────────── */

/** Check if a moderation result indicates crisis content (self-harm). */
export function isCrisisContent(result: ModerationResult): boolean {
  return result.crisis;
}

/* ── buildModerateResponse ──────────────────────────────────── */

const BLOCK_MESSAGES: Record<ModerationSurface, string> = {
  post:        'This post can\'t be published — it was flagged by our content safety system.',
  comment:     'This comment was flagged and can\'t be posted.',
  dm:          'This message was flagged by our safety system.',
  bio:         'This bio contains content that isn\'t allowed.',
  displayName: 'This display name isn\'t allowed.',
};

const CRISIS_MESSAGE =
  'If you or someone you know is in crisis, please reach out to a crisis helpline. ' +
  'In the US, call or text 988 (Suicide & Crisis Lifeline). ' +
  'Internationally, visit https://findahelpline.com for local resources.';

export function buildModerateResponse(result: ModerationResult): {
  allowed: boolean;
  message: string | null;
  crisisResources: string | null;
} {
  const crisisResources = result.crisis ? CRISIS_MESSAGE : null;

  if (!result.blocked) {
    return { allowed: true, message: null, crisisResources };
  }

  return {
    allowed: false,
    message: BLOCK_MESSAGES[result.surface],
    crisisResources,
  };
}
