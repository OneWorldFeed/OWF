// ─────────────────────────────────────────────────────────────
//  OWF Input Sanitization
//  Every string from user input passes through here before
//  being written to Firestore or rendered as HTML.
//
//  Rules:
//  - Strip all HTML tags and script injection
//  - Enforce field-specific length limits
//  - Normalize whitespace
//  - Block known spam/attack patterns
// ─────────────────────────────────────────────────────────────

// Field length limits — matches Firestore security rules exactly
export const LIMITS = {
  displayName:  60,
  handle:       40,
  bio:          300,
  postText:     2000,
  commentText:  500,
  city:         80,
  mood:         40,
  circleName:   40,
  reportReason: 500,
  dmText:       1000,
  searchQuery:  100,
  collectionName: 60,
} as const;

// Patterns to block regardless of content
const BLOCKED_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,        // onclick=, onload=, etc.
  /data:text\/html/i,
  /vbscript:/i,
  /<iframe/i,
  /<object/i,
  /<embed/i,
  /document\.cookie/i,
  /window\.location/i,
  /eval\(/i,
  /atob\(/i,
];

// Strip HTML tags and dangerous content
function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')           // remove all HTML tags
    .replace(/&lt;/g, '<')             // decode entities before re-check
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>/g, '');          // strip again after decode
}

// Check for injection patterns
function hasAttackPattern(input: string): boolean {
  return BLOCKED_PATTERNS.some(p => p.test(input));
}

// Normalize whitespace — collapse multiple spaces/newlines
function normalizeWhitespace(input: string, multiline = false): string {
  if (multiline) {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
      .join('\n')
      .trim();
  }
  return input.replace(/\s+/g, ' ').trim();
}

// ── Core sanitizer ────────────────────────────────────────────
export interface SanitizeResult {
  value:   string;
  safe:    boolean;
  reason?: string;
}

export function sanitize(
  input: unknown,
  field: keyof typeof LIMITS,
  options: { multiline?: boolean } = {},
): SanitizeResult {
  // Type guard
  if (typeof input !== 'string') {
    return { value: '', safe: false, reason: 'not_string' };
  }

  // Attack pattern check (pre-strip)
  if (hasAttackPattern(input)) {
    return { value: '', safe: false, reason: 'attack_pattern' };
  }

  // Strip HTML
  let clean = stripHtml(input);

  // Normalize whitespace
  clean = normalizeWhitespace(clean, options.multiline);

  // Length check
  const limit = LIMITS[field];
  if (clean.length > limit) {
    clean = clean.slice(0, limit);
  }

  return { value: clean, safe: true };
}

// ── Convenience wrappers ──────────────────────────────────────

export function sanitizePostText(text: unknown): string {
  const result = sanitize(text, 'postText', { multiline: true });
  return result.value;
}

export function sanitizeBio(bio: unknown): string {
  const result = sanitize(bio, 'bio', { multiline: true });
  return result.value;
}

export function sanitizeDisplayName(name: unknown): string {
  const result = sanitize(name, 'displayName');
  return result.value;
}

export function sanitizeHandle(handle: unknown): string {
  if (typeof handle !== 'string') return '';
  // Handles: lowercase alphanumeric + dots only
  return handle
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '')
    .slice(0, LIMITS.handle);
}

export function sanitizeCity(city: unknown): string {
  const result = sanitize(city, 'city');
  return result.value;
}

export function sanitizeDmText(text: unknown): string {
  const result = sanitize(text, 'dmText', { multiline: true });
  return result.value;
}

export function sanitizeSearchQuery(query: unknown): string {
  const result = sanitize(query, 'searchQuery');
  // Extra: only allow safe search characters
  return result.value.replace(/[<>{}[\]\\]/g, '');
}

// ── Profile sanitizer — sanitizes all fields at once ─────────
export interface RawProfile {
  displayName?: unknown;
  handle?:      unknown;
  bio?:         unknown;
  city?:        unknown;
  country?:     unknown;
  website?:     unknown;
  pronouns?:    unknown;
}

export function sanitizeProfile(raw: RawProfile) {
  return {
    displayName: sanitizeDisplayName(raw.displayName),
    handle:      sanitizeHandle(raw.handle),
    bio:         sanitizeBio(raw.bio),
    city:        sanitizeCity(raw.city),
    country:     sanitize(raw.country, 'city').value,
    website:     sanitizeWebsite(raw.website),
    pronouns:    sanitize(raw.pronouns, 'mood').value,
  };
}

// ── URL sanitizer ─────────────────────────────────────────────
export function sanitizeWebsite(url: unknown): string {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim().slice(0, 200);
  // Only allow https:// or empty
  if (trimmed === '') return '';
  if (!/^https:\/\//i.test(trimmed)) return '';
  // Block data: and javascript: URIs
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
  return trimmed;
}

// ── Rate limiter (client-side soft limit) ─────────────────────
// Real rate limiting is enforced server-side, but this prevents
// accidental rapid-fire submissions in the UI.

const ACTION_COUNTS: Record<string, { count: number; resetAt: number }> = {};

export function checkRateLimit(
  action: string,
  maxPerMinute: number,
): boolean {
  const now = Date.now();
  const key  = action;

  if (!ACTION_COUNTS[key] || now > ACTION_COUNTS[key].resetAt) {
    ACTION_COUNTS[key] = { count: 0, resetAt: now + 60_000 };
  }

  ACTION_COUNTS[key].count++;
  return ACTION_COUNTS[key].count <= maxPerMinute;
}

// Limits per action type
export const RATE_LIMITS = {
  post:        5,   // 5 posts per minute
  comment:     10,  // 10 comments per minute
  like:        30,  // 30 likes per minute
  dm:          20,  // 20 DMs per minute
  search:      15,  // 15 searches per minute
  aiRequest:   3,   // 3 AI calls per minute
} as const;
