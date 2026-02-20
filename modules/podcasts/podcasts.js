/**
 * OWF | One World Feed
 * modules/podcasts/podcasts.js — Podcasts page module.
 */

import { loadFeed } from '../feed-loader/feed-loader.js';
import { safeUrl } from '../global/global.js';

// ── Player state ──────────────────────────────────────────────────────────────

const _playerState = {
  currentEpisode: null,
  isPlaying:      false,
  progress:       0,
};

// ── Player controls ───────────────────────────────────────────────────────────

function _setupPlayerControls() {
  const playBtn  = document.getElementById('podcast-play-btn');
  const prevBtn  = document.getElementById('podcast-prev-btn');
  const nextBtn  = document.getElementById('podcast-next-btn');
  const progress = document.getElementById('podcast-progress');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      _playerState.isPlaying = !_playerState.isPlaying;
      playBtn.setAttribute('aria-label', _playerState.isPlaying ? 'Pause' : 'Play');
      playBtn.dataset.playing = String(_playerState.isPlaying);
      _updatePlayIcon(playBtn);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      console.info('[podcasts] Previous episode');
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      console.info('[podcasts] Next episode');
    });
  }

  if (progress) {
    progress.addEventListener('input', (e) => {
      _playerState.progress = Number(e.target.value);
    });
  }
}

function _updatePlayIcon(btn) {
  btn.textContent = _playerState.isPlaying ? '⏸' : '▶';
}

// ── Now Playing banner ────────────────────────────────────────────────────────

function _renderNowPlaying(episode) {
  const banner = document.getElementById('podcast-now-playing');
  if (!banner || !episode) return;

  banner.hidden = false;

  const titleEl = banner.querySelector('.now-playing__title');
  if (titleEl) titleEl.textContent = episode.title ?? '';

  const sourceEl = banner.querySelector('.now-playing__source');
  if (sourceEl) sourceEl.textContent = episode.source ?? '';
}

// ── Episode list ──────────────────────────────────────────────────────────────

function _renderEpisodeList(items) {
  const list = document.getElementById('podcast-episode-list')
    ?? document.getElementById('feed-list');
  if (!list) return;

  list.innerHTML = '';
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'podcast-episode';

    const titleEl = document.createElement('h3');
    titleEl.className = 'podcast-episode__title';
    titleEl.textContent = item.title ?? '';

    const sourceMeta = document.createElement('div');
    sourceMeta.className = 'podcast-episode__meta';

    const sourceEl = document.createElement('span');
    sourceEl.textContent = item.source ?? '';

    const durEl = document.createElement('span');
    durEl.className = 'podcast-episode__duration';
    durEl.textContent = item.duration ?? '';

    sourceMeta.appendChild(sourceEl);
    if (item.duration) sourceMeta.appendChild(durEl);

    const summaryEl = document.createElement('p');
    summaryEl.className = 'podcast-episode__summary';
    summaryEl.textContent = item.summary ?? '';

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'podcast-episode__play-btn btn btn-ghost';
    playBtn.textContent = '▶ Play';
    playBtn.setAttribute('aria-label', `Play: ${item.title ?? 'episode'}`);

    playBtn.addEventListener('click', () => {
      _playerState.currentEpisode = item;
      _playerState.isPlaying = true;
      _renderNowPlaying(item);
    });

    li.appendChild(titleEl);
    li.appendChild(sourceMeta);
    li.appendChild(summaryEl);
    li.appendChild(playBtn);
    fragment.appendChild(li);
  });

  list.appendChild(fragment);
}

// ── init ──────────────────────────────────────────────────────────────────────

export async function init() {
  // Load feed filtered to podcast type
  await loadFeed('podcast');

  _setupPlayerControls();

  console.info('[OWF:podcasts] Initialised.');
}

export default { init };
