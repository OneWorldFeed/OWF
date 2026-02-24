/**
 * OWF | One World Feed
 * modules/cards/card.js
 *
 * Canonical hybrid-style card factory.
 * Returns a DOM <article> element for any feed item.
 */

import { sanitize } from '../global/global.js';

export function createCard(item) {
  const card = document.createElement('article');
  card.className = 'feed-card';
  card.dataset.type = item.type || 'story';
  card.dataset.id = item.id || '';

  /* -----------------------------
     HEADER
  ------------------------------ */
  const header = document.createElement('header');
  header.className = 'feed-card__header';

  const avatar = document.createElement('img');
  avatar.className = 'feed-card__avatar';
  avatar.src = sanitize(item.avatar || '/assets/icons/default-avatar.svg');
  avatar.alt = '';

  const meta = document.createElement('div');
  meta.className = 'feed-card__meta';

  const source = document.createElement('span');
  source.className = 'feed-card__source';
  source.textContent = sanitize(item.source || 'Global Source');

  const timestamp = document.createElement('time');
  timestamp.className = 'feed-card__timestamp';
  timestamp.textContent = sanitize(item.time || 'Just now');

  meta.appendChild(source);
  meta.appendChild(timestamp);

  header.appendChild(avatar);
  header.appendChild(meta);

  /* -----------------------------
     BODY
  ------------------------------ */
  const body = document.createElement('div');
  body.className = 'feed-card__body';

  const title = document.createElement('h3');
  title.className = 'feed-card__title';
  title.textContent = sanitize(item.title || '');

  const summary = document.createElement('p');
  summary.className = 'feed-card__summary';
  summary.textContent = sanitize(item.summary || '');

  body.appendChild(title);
  body.appendChild(summary);

  /* -----------------------------
     MEDIA (optional)
  ------------------------------ */
  const media = document.createElement('div');
  media.className = 'feed-card__media';

  if (item.image) {
    const img = document.createElement('img');
    img.src = sanitize(item.image);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    media.appendChild(img);
  }

  /* -----------------------------
     FOOTER
  ------------------------------ */
  const footer = document.createElement('footer');
  footer.className = 'feed-card__footer';

  ['React', 'Share', 'Save'].forEach((label) => {
    const btn = document.createElement('button');
    btn.className = 'feed-card__action';
    btn.textContent = label;
    footer.appendChild(btn);
  });

  /* -----------------------------
     ASSEMBLE CARD
  ------------------------------ */
  card.appendChild(header);
  card.appendChild(body);
  if (item.image) card.appendChild(media);
  card.appendChild(footer);

  return card;
}
