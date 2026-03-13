/**
 * OWF Input Sanitization Layer
 *
 * Sanitizes all user-generated content before storage and display.
 * No external dependencies — uses built-in string operations.
 */

// ── Length limits ────────────────────────────────────────────────────────────

export const LIMITS = {
  displayName: 50,
  handle: 30,
  bio: 300,
  city: 60,
  country: 60,
  website: 200,
  postText: 280,
  commentText: 280,
  messageText: 2000,
  tagLength: 40,
} as const;

// ── Core sanitizers ─────────────────────────────────────────────────────────

/**
 * Strip HTML tags from a string. Prevents XSS via stored HTML injection.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML entities so user text renders as text, never as markup.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Remove null bytes, control characters (except newline/tab),
 * and zero-width characters that can be used for homograph attacks.
 */
export function stripControlChars(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\u200B-\u200F\u2028-\u202F\uFEFF]/g, '');
}

/**
 * Collapse consecutive whitespace into single spaces and trim.
 */
export function normalizeWhitespace(input: string): string {
  return input.replace(/[^\S\n]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

// ── Validators ──────────────────────────────────────────────────────────────

/** Handle must be alphanumeric, dots, or underscores (e.g. yourname.feed) */
const HANDLE_RE = /^[a-zA-Z0-9_.]+$/;

export function isValidHandle(handle: string): boolean {
  return handle.length >= 3
    && handle.length <= LIMITS.handle
    && HANDLE_RE.test(handle);
}

/** Very basic URL validation — must start with https:// */
const URL_RE = /^https:\/\/[^\s<>"']+$/;

export function isValidUrl(url: string): boolean {
  if (!url) return true; // empty is allowed (optional field)
  return url.length <= LIMITS.website && URL_RE.test(url);
}

// ── Composite sanitizer ─────────────────────────────────────────────────────

/**
 * Standard text sanitization pipeline used for all user-generated content.
 * Strips HTML, control chars, normalizes whitespace, enforces length.
 */
export function sanitizeText(input: string, maxLength: number): string {
  let s = input;
  s = stripHtml(s);
  s = stripControlChars(s);
  s = normalizeWhitespace(s);
  if (s.length > maxLength) s = s.slice(0, maxLength);
  return s;
}

/**
 * Sanitize a handle — lowercase, strip invalid chars, enforce length.
 */
export function sanitizeHandle(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, '')
    .slice(0, LIMITS.handle);
}

/**
 * Sanitize a URL — must be https, strip dangerous chars.
 */
export function sanitizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  // Only allow https URLs
  if (!/^https?:\/\//i.test(trimmed)) return '';
  // Force https
  const url = trimmed.replace(/^http:\/\//i, 'https://');
  // Strip any script: or data: fragments
  if (/javascript:|data:|vbscript:/i.test(url)) return '';
  return url.slice(0, LIMITS.website);
}

// ── Profile-specific sanitizer ──────────────────────────────────────────────

export interface SanitizedProfile {
  displayName: string;
  handle: string;
  bio: string;
  city: string;
  country: string;
  website: string;
}

/**
 * Sanitize all editable text fields of a profile before saving.
 * Returns the sanitized fields — merge into the full profile object.
 */
export function sanitizeProfileFields(fields: {
  displayName?: string;
  handle?: string;
  bio?: string;
  city?: string;
  country?: string;
  website?: string;
}): SanitizedProfile {
  return {
    displayName: sanitizeText(fields.displayName ?? '', LIMITS.displayName),
    handle: sanitizeHandle(fields.handle ?? ''),
    bio: sanitizeText(fields.bio ?? '', LIMITS.bio),
    city: sanitizeText(fields.city ?? '', LIMITS.city),
    country: sanitizeText(fields.country ?? '', LIMITS.country),
    website: sanitizeUrl(fields.website ?? ''),
  };
}

/**
 * Sanitize post/comment text (280 char limit).
 */
export function sanitizePostText(input: string): string {
  return sanitizeText(input, LIMITS.postText);
}

/**
 * Sanitize DM message text (2000 char limit).
 */
export function sanitizeMessageText(input: string): string {
  return sanitizeText(input, LIMITS.messageText);
}

/**
 * Sanitize comment text (280 char limit).
 */
export function sanitizeCommentText(input: string): string {
  return sanitizeText(input, LIMITS.commentText);
}
