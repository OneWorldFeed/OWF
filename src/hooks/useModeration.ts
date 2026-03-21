'use client';

import { useState, useCallback, useRef } from 'react';
import {
  quickLocalCheck,
  type ModerationSurface,
  type LocalMatch,
} from '@/lib/moderation';

/* ── Types ──────────────────────────────────────────────────── */

interface ModerateApiResponse {
  allowed: boolean;
  message: string | null;
  crisisResources: string | null;
}

export interface ModerationCheckResult {
  allowed: boolean;
  message: string | null;
  crisisResources: string | null;
  localMatches: LocalMatch[];
}

/* ── Hook ───────────────────────────────────────────────────── */

export function useModeration() {
  const [result, setResult] = useState<ModerationCheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  /** Instant synchronous regex check — safe for keystroke handlers. */
  const localCheck = useCallback((text: string): LocalMatch[] => {
    return quickLocalCheck(text);
  }, []);

  /**
   * Full moderation check: local regex first, then /api/moderate.
   * Returns true if content is allowed.
   * Fails open on network errors (console.warn, returns true).
   */
  const check = useCallback(
    async (text: string, surface: ModerationSurface): Promise<boolean> => {
      // Cancel any in-flight request
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setChecking(true);

      // Layer 1 — instant local check
      const localMatches = quickLocalCheck(text);
      const hasHardBlock = localMatches.some(
        (m) => m.category === 'csam' || m.category === 'weapons',
      );
      const hasSpam = localMatches.some((m) => m.category === 'spam') && surface !== 'dm';

      if (hasHardBlock || hasSpam) {
        const blocked: ModerationCheckResult = {
          allowed: false,
          message: 'This content was flagged by our safety system.',
          crisisResources: localMatches.some((m) => m.category === 'self_harm')
            ? 'If you or someone you know is in crisis, please reach out to a crisis helpline. In the US, call or text 988.'
            : null,
          localMatches,
        };
        setResult(blocked);
        setChecking(false);
        return false;
      }

      // Layer 2+3 — call API for Perspective + HuggingFace
      try {
        const res = await fetch('/api/moderate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, surface }),
          signal: controller.signal,
        });

        if (!res.ok) {
          // Fail open — treat API errors as allowed
          console.warn(`[useModeration] API returned ${res.status}, failing open`);
          const open: ModerationCheckResult = {
            allowed: true,
            message: null,
            crisisResources: null,
            localMatches,
          };
          setResult(open);
          setChecking(false);
          return true;
        }

        const data: ModerateApiResponse = await res.json();
        const checkResult: ModerationCheckResult = {
          allowed: data.allowed,
          message: data.message,
          crisisResources: data.crisisResources,
          localMatches,
        };
        setResult(checkResult);
        setChecking(false);
        return data.allowed;
      } catch (err: unknown) {
        // Aborted requests are not errors — just bail silently
        if (err instanceof DOMException && err.name === 'AbortError') {
          return true;
        }

        // Fail open on network errors
        console.warn('[useModeration] Network error, failing open:', err);
        const open: ModerationCheckResult = {
          allowed: true,
          message: null,
          crisisResources: null,
          localMatches,
        };
        setResult(open);
        setChecking(false);
        return true;
      }
    },
    [],
  );

  /** Clear state and cancel in-flight requests. */
  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setResult(null);
    setChecking(false);
  }, []);

  return { check, localCheck, result, checking, reset };
}
