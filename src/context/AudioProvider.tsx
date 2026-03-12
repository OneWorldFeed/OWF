'use client';
import {
  createContext, useContext, useRef, useState,
  useCallback, useEffect, type ReactNode,
} from 'react';

// ─── Shared station shape ─────────────────────────────────────────────────────
export interface RadioStation {
  stationuuid: string;
  name: string;
  url_resolved: string;
  country: string;
  countrycode: string;
  tags: string;
  favicon: string;
  votes: number;
  codec: string;
  bitrate: number;
  language: string;
}

// ─── Context value ────────────────────────────────────────────────────────────
interface AudioContextValue {
  currentStation: RadioStation | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  error: string;
  playStation: (station: RadioStation) => Promise<void>;
  togglePlay: () => void;
  stop: () => void;
  setVolume: (v: number) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const volumeRef  = useRef(0.8); // kept in sync with volume state; avoids stale closures

  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [isLoading,  setIsLoading]  = useState(false);
  const [volume,     setVolumeState] = useState(0.8);
  const [error,      setError]      = useState('');

  // Create the single persistent audio element once on mount
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volumeRef.current;
    audioRef.current = audio;

    const onError = () => {
      setError('Stream unavailable. Try another station.');
      setIsPlaying(false);
      setIsLoading(false);
    };
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, []);

  const playStation = useCallback(async (station: RadioStation) => {
    const audio = audioRef.current;
    if (!audio) return;

    setError('');
    setIsLoading(true);
    setIsPlaying(false);
    setCurrentStation(station);

    audio.pause();
    audio.src = station.url_resolved;
    audio.volume = volumeRef.current;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setError(`Can't play ${station.name}. Try another station.`);
      setIsPlaying(false);
    }
    setIsLoading(false);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setError('Playback failed.'));
    }
  }, [isPlaying, currentStation]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setCurrentStation(null);
  }, []);

  const setVolume = useCallback((v: number) => {
    volumeRef.current = v;
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  return (
    <AudioCtx.Provider value={{
      currentStation, isPlaying, isLoading, volume, error,
      playStation, togglePlay, stop, setVolume,
    }}>
      {children}
    </AudioCtx.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within <AudioProvider>');
  return ctx;
}
