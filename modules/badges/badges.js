/**
 * OWF | One World Feed
 * modules/badges/badges.js — Badge definitions, criteria checking, and awarding.
 */

// ── Badge definitions ─────────────────────────────────────────────────────────

export const BADGE_TYPES = {
  EARLY_ADOPTER: {
    id:          'early-adopter',
    name:        'Early Adopter',
    description: 'One of the first to join One World Feed.',
    icon:        '🌱',
    tier:        'bronze',
  },
  GLOBE_TROTTER: {
    id:          'globe-trotter',
    name:        'Globe Trotter',
    description: 'Read stories from 5 or more different regions.',
    icon:        '🌍',
    tier:        'silver',
    requirement: { type: 'regions_read', count: 5 },
  },
  NEWS_HOUND: {
    id:          'news-hound',
    name:        'News Hound',
    description: 'Read 50 news articles.',
    icon:        '📰',
    tier:        'bronze',
    requirement: { type: 'items_read', contentType: 'news', count: 50 },
  },
  MUSIC_FAN: {
    id:          'music-fan',
    name:        'Music Fan',
    description: 'Explored 20 music stories.',
    icon:        '🎵',
    tier:        'bronze',
    requirement: { type: 'items_read', contentType: 'music', count: 20 },
  },
  PODCAST_LISTENER: {
    id:          'podcast-listener',
    name:        'Podcast Listener',
    description: 'Listened to 10 podcast episodes.',
    icon:        '🎙️',
    tier:        'bronze',
    requirement: { type: 'items_read', contentType: 'podcast', count: 10 },
  },
  AI_CURIOUS: {
    id:          'ai-curious',
    name:        'AI Curious',
    description: 'Sent 5 messages to the OWF AI assistant.',
    icon:        '🤖',
    tier:        'silver',
    requirement: { type: 'chat_messages', count: 5 },
  },
  STREAK_7: {
    id:          'streak-7',
    name:        '7-Day Streak',
    description: 'Visited OWF 7 days in a row.',
    icon:        '🔥',
    tier:        'gold',
    requirement: { type: 'streak_days', count: 7 },
  },
  WORLD_EXPLORER: {
    id:          'world-explorer',
    name:        'World Explorer',
    description: 'Read content from every region.',
    icon:        '🗺️',
    tier:        'gold',
    requirement: { type: 'regions_read', count: 10 },
  },
};

// ── Storage helpers ───────────────────────────────────────────────────────────

const STORAGE_KEY = 'owf-badges';
const STATS_KEY   = 'owf-badge-stats';

/**
 * Load awarded badges from storage.
 * @returns {Set<string>} Set of awarded badge IDs
 */
export function loadAwardedBadges() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Persist awarded badges to storage.
 * @param {Set<string>} badges
 */
function _saveAwardedBadges(badges) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...badges]));
  } catch { /* storage unavailable */ }
}

/**
 * Load badge progress stats from storage.
 * @returns {Record<string, number>}
 */
export function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Persist badge progress stats.
 * @param {Record<string, number>} stats
 */
function _saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch { /* storage unavailable */ }
}

// ── Criteria checking ─────────────────────────────────────────────────────────

/**
 * Check if the criteria for a badge are satisfied.
 * @param {object} badge
 * @param {Record<string, number>} stats
 * @returns {boolean}
 */
export function checkCriteria(badge, stats) {
  const req = badge.requirement;
  if (!req) return true; // Manually awarded (e.g. early-adopter)

  switch (req.type) {
    case 'items_read': {
      const key = `read_${req.contentType}`;
      return (stats[key] ?? 0) >= req.count;
    }
    case 'regions_read':
      return (stats['regions_visited'] ?? 0) >= req.count;
    case 'chat_messages':
      return (stats['chat_messages'] ?? 0) >= req.count;
    case 'streak_days':
      return (stats['streak'] ?? 0) >= req.count;
    default:
      return false;
  }
}

// ── Award a badge ─────────────────────────────────────────────────────────────

/**
 * Award a badge if criteria are met and it hasn't been awarded already.
 * Dispatches a custom DOM event on award.
 * @param {string} badgeKey - Key of BADGE_TYPES
 * @returns {boolean} true if newly awarded
 */
export function awardBadge(badgeKey) {
  const badge = BADGE_TYPES[badgeKey];
  if (!badge) return false;

  const awarded = loadAwardedBadges();
  if (awarded.has(badge.id)) return false;

  const stats = loadStats();
  if (!checkCriteria(badge, stats)) return false;

  awarded.add(badge.id);
  _saveAwardedBadges(awarded);

  // Dispatch a custom event for UI to react
  document.dispatchEvent(new CustomEvent('owf:badge-awarded', {
    bubbles: true,
    detail:  { badge },
  }));

  console.info(`[badges] Awarded: ${badge.name}`);
  return true;
}

// ── Increment a stat and check all badges ─────────────────────────────────────

/**
 * Increment a numeric stat and run badge checks.
 * @param {string} statKey
 * @param {number} [amount=1]
 */
export function incrementStat(statKey, amount = 1) {
  const stats = loadStats();
  stats[statKey] = (stats[statKey] ?? 0) + amount;
  _saveStats(stats);

  // Check all badges whenever a stat changes
  for (const key of Object.keys(BADGE_TYPES)) {
    awardBadge(key);
  }
}

// ── Get all badges with earned status ────────────────────────────────────────

/**
 * Return all badge definitions annotated with earned status and progress.
 * @returns {Array<object>}
 */
export function getAllBadges() {
  const awarded = loadAwardedBadges();
  const stats   = loadStats();

  return Object.values(BADGE_TYPES).map((badge) => {
    const earned = awarded.has(badge.id);
    const req    = badge.requirement;
    let progress = null;

    if (req && !earned) {
      let current = 0;
      switch (req.type) {
        case 'items_read':
          current = stats[`read_${req.contentType}`] ?? 0;
          break;
        case 'regions_read':
          current = stats['regions_visited'] ?? 0;
          break;
        case 'chat_messages':
          current = stats['chat_messages'] ?? 0;
          break;
        case 'streak_days':
          current = stats['streak'] ?? 0;
          break;
      }
      progress = { current, total: req.count };
    }

    return { ...badge, earned, progress };
  });
}

// ── init ──────────────────────────────────────────────────────────────────────

/**
 * Initialise the badges module: award the early-adopter badge on first visit
 * and run a full badge check.
 */
export function init() {
  // Award early-adopter on first load (no criteria required)
  const awarded = loadAwardedBadges();
  if (!awarded.has(BADGE_TYPES.EARLY_ADOPTER.id)) {
    awarded.add(BADGE_TYPES.EARLY_ADOPTER.id);
    _saveAwardedBadges(awarded);
    document.dispatchEvent(new CustomEvent('owf:badge-awarded', {
      bubbles: true,
      detail:  { badge: BADGE_TYPES.EARLY_ADOPTER },
    }));
  }

  // Run a full check in case stats were updated offline
  for (const key of Object.keys(BADGE_TYPES)) {
    awardBadge(key);
  }

  console.info('[OWF:badges] Initialised.');
}

export default {
  init,
  BADGE_TYPES,
  getAllBadges,
  awardBadge,
  checkCriteria,
  incrementStat,
  loadAwardedBadges,
  loadStats,
};
