'use client';
import { useState, useRef } from 'react';
import type { MoodId } from '@/lib/theme';

const MOODS: { id: MoodId; label: string; emoji: string; color: string }[] = [
  { id: 'electric',   label: 'Electric',   emoji: '⚡', color: '#D97706' },
  { id: 'joyful',     label: 'Joyful',     emoji: '✨', color: '#059669' },
  { id: 'hopeful',    label: 'Hopeful',    emoji: '🌱', color: '#16A34A' },
  { id: 'reflective', label: 'Reflective', emoji: '🌊', color: '#2563EB' },
  { id: 'ambitious',  label: 'Ambitious',  emoji: '🔥', color: '#EA580C' },
  { id: 'curious',    label: 'Curious',    emoji: '🔭', color: '#7C3AED' },
  { id: 'calm',       label: 'Calm',       emoji: '🍃', color: '#0891B2' },
  { id: 'resilient',  label: 'Resilient',  emoji: '🏔', color: '#B45309' },
  { id: 'melancholic',label: 'Melancholic',emoji: '🌧', color: '#6B7280' },
  { id: 'ancient',    label: 'Ancient',    emoji: '🏛', color: '#92400E' },
  { id: 'fragile',    label: 'Fragile',    emoji: '🕊', color: '#BE185D' },
  { id: 'silent',     label: 'Silent',     emoji: '🌙', color: '#4338CA' },
];

const SUGGESTED_TAGS = [
  '+community', '+nightlife', '+food', '+art', '+music',
  '+travel', '+nature', '+startups', '+culture', '+moment',
];

const MAX_CHARS = 280;
const MAX_VIDEO_SECONDS = 90;

interface ComposerProps {
  onClose: () => void;
}

export default function Composer({ onClose }: ComposerProps) {
  const [text, setText] = useState('');
  const [mood, setMood] = useState<MoodId | null>(null);
  const [city, setCity] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [videoError, setVideoError] = useState('');
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const charsLeft = MAX_CHARS - text.length;
  const activeMood = MOODS.find(m => m.id === mood);

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
  }

  function insertTag(tag: string) {
    if (text.includes(tag)) return;
    setText(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + tag + ' ');
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoError('');
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) return;

    if (isVideo) {
      const url = URL.createObjectURL(file);
      const vid = document.createElement('video');
      vid.src = url;
      vid.onloadedmetadata = () => {
        if (vid.duration > MAX_VIDEO_SECONDS) {
          setVideoError(`Videos must be ${MAX_VIDEO_SECONDS}s or less (yours is ${Math.round(vid.duration)}s)`);
          URL.revokeObjectURL(url);
          return;
        }
        setMediaFile(file);
        setMediaPreview(url);
        setMediaType('video');
      };
    } else {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      setMediaType('image');
    }
  }

  function removeMedia() {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setVideoError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handlePost() {
    if (!text.trim() || !mood || posting) return;
    setPosting(true);
    // Simulate post — replace with Firestore write when Auth is added
    await new Promise(r => setTimeout(r, 900));
    setPosted(true);
    setTimeout(() => { onClose(); }, 1200);
  }

  const canPost = text.trim().length > 0 && mood !== null && !videoError;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="w-full md:max-w-lg md:mx-4 rounded-t-3xl md:rounded-3xl overflow-hidden"
        style={{ backgroundColor: 'var(--owf-surface)', border: '1px solid var(--owf-border)', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--owf-border)' }}>
          <h2 className="text-base font-black" style={{ color: 'var(--owf-text-primary)' }}>New Post</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
            style={{ color: 'var(--owf-text-secondary)', backgroundColor: 'var(--owf-bg)' }}>✕</button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* Text area */}
          <div className="relative">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="What's happening in your world?"
              rows={4}
              className="w-full text-sm leading-relaxed resize-none focus:outline-none rounded-2xl px-4 py-3"
              style={{ backgroundColor: 'var(--owf-bg)', border: '1px solid var(--owf-border)', color: 'var(--owf-text-primary)' }}
              autoFocus
            />
            <span className="absolute bottom-4 right-4 text-xs"
              style={{ color: charsLeft < 50 ? '#EF4444' : 'var(--owf-text-secondary)' }}>
              {charsLeft}
            </span>
          </div>

          {/* Mood selector */}
          <div>
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: 'var(--owf-text-secondary)' }}>MOOD</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => {
                const active = mood === m.id;
                return (
                  <button key={m.id} onClick={() => setMood(m.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      backgroundColor: active ? m.color + '22' : 'var(--owf-bg)',
                      border: `1px solid ${active ? m.color : 'var(--owf-border)'}`,
                      color: active ? m.color : 'var(--owf-text-secondary)',
                      boxShadow: active ? `0 0 8px ${m.color}33` : 'none',
                    }}>
                    <span>{m.emoji}</span>{m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tag suggestions */}
          <div>
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: 'var(--owf-text-secondary)' }}>ADD +TAGS</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map(tag => {
                const used = text.includes(tag);
                return (
                  <button key={tag} onClick={() => insertTag(tag)}
                    className="text-xs px-2.5 py-1 rounded-full transition-all hover:scale-105"
                    style={{
                      backgroundColor: used ? 'var(--owf-gold)' + '18' : 'var(--owf-bg)',
                      border: `1px solid ${used ? 'var(--owf-gold)' : 'var(--owf-border)'}`,
                      color: used ? 'var(--owf-gold)' : 'var(--owf-text-secondary)',
                    }}>
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* City */}
          <div>
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: 'var(--owf-text-secondary)' }}>CITY</p>
            <input type="text" value={city} onChange={e => setCity(e.target.value)}
              placeholder="Your city (e.g. Lagos)"
              className="w-full text-sm px-4 py-2.5 rounded-xl focus:outline-none"
              style={{ backgroundColor: 'var(--owf-bg)', border: '1px solid var(--owf-border)', color: 'var(--owf-text-primary)' }} />
          </div>

          {/* Media upload */}
          <div>
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: 'var(--owf-text-secondary)' }}>MEDIA</p>
            {!mediaPreview ? (
              <button onClick={() => fileRef.current?.click()}
                className="w-full py-4 rounded-2xl text-sm font-medium transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--owf-bg)', border: '2px dashed var(--owf-border)', color: 'var(--owf-text-secondary)' }}>
                <span className="text-lg">📎</span> Add photo or video (max 90s)
              </button>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="preview" className="w-full object-cover rounded-2xl" style={{ maxHeight: '200px' }} />
                ) : (
                  <video ref={videoRef} src={mediaPreview} className="w-full rounded-2xl" style={{ maxHeight: '200px' }} controls />
                )}
                <button onClick={removeMedia}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' }}>✕</button>
              </div>
            )}
            {videoError && <p className="text-xs mt-1.5" style={{ color: '#EF4444' }}>{videoError}</p>}
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex-shrink-0 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--owf-border)' }}>
          <div className="flex items-center gap-2">
            {activeMood && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: activeMood.color + '18', color: activeMood.color, border: `1px solid ${activeMood.color}33` }}>
                {activeMood.emoji} {activeMood.label}
              </span>
            )}
            {city && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'var(--owf-bg)', color: 'var(--owf-text-secondary)', border: '1px solid var(--owf-border)' }}>
                📍 {city}
              </span>
            )}
          </div>
          <button onClick={handlePost} disabled={!canPost || posting}
            className="text-sm font-black px-6 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: canPost && !posting ? 'var(--owf-gold)' : 'var(--owf-border)',
              color: canPost && !posting ? '#fff' : 'var(--owf-text-secondary)',
            }}>
            {posted ? '✓ Posted!' : posting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
