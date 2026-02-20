/**
 * OWF | One World Feed
 * modules/profile/profile.js — Profile page module.
 */

// ── Default profile data ──────────────────────────────────────────────────────

const DEFAULT_PROFILE = {
  displayName: 'World Citizen',
  handle:      'worldcitizen',
  bio:         'Exploring One World Feed from every corner of the globe. 🌍',
  followers:   1_204,
  following:   348,
  posts:       92,
  joined:      '2024-01-01',
  location:    'Earth',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function _formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function _formatJoined(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  } catch {
    return '';
  }
}

// ── Render ────────────────────────────────────────────────────────────────────

/**
 * Populate the profile view with user data.
 * All text is set via textContent — no innerHTML interpolation.
 * @param {object} profile
 */
function _renderProfile(profile) {
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  // Avatar initials
  const avatarEl = document.getElementById('profile-avatar');
  if (avatarEl) {
    const initials = (profile.displayName || 'WC')
      .split(' ')
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2);
    avatarEl.textContent = initials;
    avatarEl.setAttribute('aria-label', `${profile.displayName} avatar`);
  }

  // Name and handle
  const nameEl = document.querySelector('.profile-name');
  if (nameEl) nameEl.textContent = profile.displayName ?? '';

  const handleEl = document.querySelector('.profile-handle');
  if (handleEl) handleEl.textContent = `@${profile.handle ?? ''}`;

  // Bio
  const bioEl = document.querySelector('.profile-bio');
  if (bioEl) bioEl.textContent = profile.bio ?? '';

  // Stats
  const statsMap = {
    'profile-stat-posts':     _formatNumber(profile.posts     ?? 0),
    'profile-stat-followers': _formatNumber(profile.followers ?? 0),
    'profile-stat-following': _formatNumber(profile.following ?? 0),
  };
  for (const [id, val] of Object.entries(statsMap)) {
    set(id, val);
  }

  // Meta
  const locationEl = document.querySelector('.profile-location');
  if (locationEl) locationEl.textContent = profile.location ?? '';

  const joinedEl = document.querySelector('.profile-joined');
  if (joinedEl) joinedEl.textContent = `Joined ${_formatJoined(profile.joined)}`;
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

function _setupProfileTabs() {
  const tabList = document.querySelector('.profile-tabs');
  if (!tabList) return;

  tabList.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;

    tabList.querySelectorAll('[role="tab"]').forEach((t) => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('profile-tab--active');
    });
    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('profile-tab--active');

    // Show the corresponding panel
    const panelId = tab.getAttribute('aria-controls');
    document.querySelectorAll('.profile-tab-panel').forEach((p) => {
      p.hidden = p.id !== panelId;
    });
  });
}

// ── init ──────────────────────────────────────────────────────────────────────

/**
 * Initialise the profile page.
 */
export async function init() {
  // Load stored or default profile data
  let profile = DEFAULT_PROFILE;
  try {
    const stored = localStorage.getItem('owf-profile');
    if (stored) {
      const parsed = JSON.parse(stored);
      profile = { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch { /* use defaults */ }

  _renderProfile(profile);
  _setupProfileTabs();
  console.info('[OWF:profile] Initialised.');
}

export default { init };
