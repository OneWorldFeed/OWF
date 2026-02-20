/**
 * OWF | One World Feed
 * modules/music/music.js — Music page module.
 */

import { loadFeed } from '../feed-loader/feed-loader.js';

// ── Player state ──────────────────────────────────────────────────────────────

const _player = {
  currentTrack: null,
  isPlaying:    false,
  volume:       1.0,
};

// ── Now Playing bar ───────────────────────────────────────────────────────────

function _updateNowPlaying(track) {
  const bar = document.getElementById('music-now-playing');
  if (!bar) return;

  bar.hidden = !track;
  if (!track) return;

  const titleEl = bar.querySelector('.now-playing__title');
  const artistEl = bar.querySelector('.now-playing__artist');

  if (titleEl)  titleEl.textContent  = track.title  ?? '';
  if (artistEl) artistEl.textContent = track.source ?? '';
}

// ── Player controls ───────────────────────────────────────────────────────────

function _setupPlayerControls() {
  const playBtn = document.getElementById('music-play-btn');
  const prevBtn = document.getElementById('music-prev-btn');
  const nextBtn = document.getElementById('music-next-btn');
  const volSlider = document.getElementById('music-volume');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      _player.isPlaying = !_player.isPlaying;
      playBtn.textContent = _player.isPlaying ? '⏸' : '▶';
      playBtn.setAttribute('aria-label', _player.isPlaying ? 'Pause' : 'Play');
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      console.info('[music] Previous track');
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      console.info('[music] Next track');
    });
  }

  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      _player.volume = Number(e.target.value) / 100;
    });
  }
}

// ── Genre filter ──────────────────────────────────────────────────────────────

const GENRES = ['All', 'Afrobeats', 'Pop', 'Hip-Hop', 'Electronic', 'Classical', 'Jazz', 'Rock'];

function _renderGenreFilter() {
  const container = document.getElementById('music-genre-filter')
    ?? document.querySelector('.music-genre-filter');
  if (!container) return;

  container.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'sr-only';
  label.id = 'genre-filter-label';
  label.textContent = 'Filter by genre:';
  container.appendChild(label);

  GENRES.forEach((genre, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'genre-filter-btn';
    btn.textContent = genre;
    btn.dataset.genre = genre.toLowerCase();
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    if (i === 0) btn.classList.add('genre-filter-btn--active');

    btn.addEventListener('click', () => {
      container.querySelectorAll('.genre-filter-btn').forEach((b) => {
        b.setAttribute('aria-pressed', 'false');
        b.classList.remove('genre-filter-btn--active');
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('genre-filter-btn--active');
    });

    container.appendChild(btn);
  });
}

// ── init ──────────────────────────────────────────────────────────────────────

export async function init() {
  _renderGenreFilter();
  await loadFeed('music');
  _setupPlayerControls();
  console.info('[OWF:music] Initialised.');
}

export default { init };
