/**
 * OWF | One World Feed
 * modules/social/social.js — Social feed page module.
 */

import { loadFeed } from '../feed-loader/feed-loader.js';

// ── Compose area ──────────────────────────────────────────────────────────────

function _setupCompose() {
  const form    = document.getElementById('social-compose-form');
  const textarea = document.getElementById('social-compose-input');
  const submitBtn = document.getElementById('social-compose-submit');
  const charCount = document.getElementById('social-char-count');
  const MAX_CHARS = 280;

  if (!form && !submitBtn) return;

  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      const remaining = MAX_CHARS - textarea.value.length;
      charCount.textContent = String(remaining);
      charCount.dataset.warn = remaining < 20 ? 'true' : 'false';
      if (submitBtn) submitBtn.disabled = textarea.value.trim().length === 0;
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!textarea) return;
    const text = textarea.value.trim();
    if (!text || text.length > MAX_CHARS) return;

    // Prepend the new post to the feed list
    _prependPost(text);

    textarea.value = '';
    if (charCount) charCount.textContent = String(MAX_CHARS);
    if (submitBtn) submitBtn.disabled = true;
  };

  if (form) {
    form.addEventListener('submit', handleSubmit);
  } else if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }
}

/**
 * Prepend a new social post to the feed list (optimistic UI).
 * All text set via textContent.
 * @param {string} text
 */
function _prependPost(text) {
  const list = document.getElementById('feed-list');
  if (!list) return;

  const li = document.createElement('li');
  li.className = 'feed-list__item social-post social-post--new';

  const header = document.createElement('div');
  header.className = 'social-post__header';

  const avatar = document.createElement('div');
  avatar.className = 'social-post__avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = 'WC';

  const meta = document.createElement('div');
  meta.className = 'social-post__meta';

  const name = document.createElement('span');
  name.className = 'social-post__name';
  name.textContent = 'World Citizen';

  const time = document.createElement('time');
  time.className = 'social-post__time';
  time.textContent = 'Just now';
  time.setAttribute('datetime', new Date().toISOString());

  meta.appendChild(name);
  meta.appendChild(time);
  header.appendChild(avatar);
  header.appendChild(meta);

  const body = document.createElement('p');
  body.className = 'social-post__body';
  body.textContent = text;

  li.appendChild(header);
  li.appendChild(body);

  list.prepend(li);
  li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── init ──────────────────────────────────────────────────────────────────────

export async function init() {
  _setupCompose();
  await loadFeed('social');
  console.info('[OWF:social] Initialised.');
}

export default { init };
