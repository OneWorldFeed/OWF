/* ============================================================
   OWF FREE APIs — no keys required (except Last.fm)
   restcountries · ip-api · Last.fm · nominatim · exchangerate
============================================================ */

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface CountryInfo {
  name: string;
  flag: string;        // emoji flag
  flagUrl: string;     // svg url
  capital: string;
  region: string;
  population: number;
  currency: { code: string; symbol: string; name: string };
  languages: string[];
  callingCode: string;
}

export interface UserLocation {
  city: string;
  country: string;
  countryCode: string;
  timezone: string;
  lat: number;
  lon: number;
}

export interface NowPlayingInfo {
  track: string;
  artist: string;
  album: string;
  albumArt: string;
  url: string;
  playing: boolean;
}

export interface ExchangeRate {
  base: string;
  rates: Record<string, number>;
  date: string;
}

// ─── CACHE ────────────────────────────────────────────────────────────────────
// Simple in-memory cache to avoid hammering free APIs

const cache = new Map<string, { data: unknown; expires: number }>();

function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) { cache.delete(key); return null; }
  return entry.data as T;
}

function setCache(key: string, data: unknown, ttlMs: number) {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}

// ─── RESTCOUNTRIES ────────────────────────────────────────────────────────────
// Free, no key, no rate limit — https://restcountries.com

export async function getCountryInfo(countryNameOrCode: string): Promise<CountryInfo | null> {
  const key = `country:${countryNameOrCode.toLowerCase()}`;
  const cached = getCache<CountryInfo>(key);
  if (cached) return cached;

  try {
    const isCode = countryNameOrCode.length === 2;
    const url = isCode
      ? `https://restcountries.com/v3.1/alpha/${countryNameOrCode}`
      : `https://restcountries.com/v3.1/name/${encodeURIComponent(countryNameOrCode)}?fullText=true`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const c = Array.isArray(data) ? data[0] : data;
    if (!c) return null;

    const currencyKey = Object.keys(c.currencies || {})[0];
    const currency = c.currencies?.[currencyKey] || { name: '', symbol: '' };
    const languages = Object.values(c.languages || {}) as string[];
    const callingCode = c.idd?.root
      ? `${c.idd.root}${(c.idd.suffixes || [''])[0]}`
      : '';

    const result: CountryInfo = {
      name: c.name?.common || countryNameOrCode,
      flag: c.flag || '',
      flagUrl: c.flags?.svg || c.flags?.png || '',
      capital: c.capital?.[0] || '',
      region: c.region || '',
      population: c.population || 0,
      currency: { code: currencyKey || '', symbol: currency.symbol || '', name: currency.name || '' },
      languages,
      callingCode,
    };

    setCache(key, result, 24 * 60 * 60 * 1000); // cache 24h
    return result;
  } catch {
    return null;
  }
}

// ─── IP-API ───────────────────────────────────────────────────────────────────
// Free, no key, 45 req/min — https://ip-api.com

export async function detectUserLocation(): Promise<UserLocation | null> {
  const key = 'user:location';
  const cached = getCache<UserLocation>(key);
  if (cached) return cached;

  try {
    const res = await fetch('http://ip-api.com/json/?fields=city,country,countryCode,timezone,lat,lon,status');
    const data = await res.json();
    if (data.status !== 'success') return null;

    const result: UserLocation = {
      city: data.city,
      country: data.country,
      countryCode: data.countryCode,
      timezone: data.timezone,
      lat: data.lat,
      lon: data.lon,
    };

    setCache(key, result, 60 * 60 * 1000); // cache 1h
    return result;
  } catch {
    return null;
  }
}

// ─── LAST.FM ──────────────────────────────────────────────────────────────────
// Free key — https://last.fm/api

const LASTFM_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY || '';

export async function searchTrack(track: string, artist?: string): Promise<NowPlayingInfo | null> {
  if (!LASTFM_KEY) return null;
  const key = `lastfm:${track}:${artist}`;
  const cached = getCache<NowPlayingInfo>(key);
  if (cached) return cached;

  try {
    const query = artist ? `${track} ${artist}` : track;
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${LASTFM_KEY}&format=json&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    const match = data.results?.trackmatches?.track?.[0];
    if (!match) return null;

    // Get album art via track.getInfo
    const infoUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&track=${encodeURIComponent(match.name)}&artist=${encodeURIComponent(match.artist)}&api_key=${LASTFM_KEY}&format=json`;
    const infoRes = await fetch(infoUrl);
    const infoData = await infoRes.json();
    const albumArt = infoData.track?.album?.image?.find((img: {size:string;'#text':string}) => img.size === 'large')?.['#text'] || '';

    const result: NowPlayingInfo = {
      track: match.name,
      artist: match.artist,
      album: infoData.track?.album?.title || '',
      albumArt,
      url: match.url,
      playing: true,
    };

    setCache(key, result, 60 * 60 * 1000); // cache 1h
    return result;
  } catch {
    return null;
  }
}

export async function getArtistInfo(artist: string): Promise<{ bio: string; image: string; tags: string[] } | null> {
  if (!LASTFM_KEY) return null;
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(artist)}&api_key=${LASTFM_KEY}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    const a = data.artist;
    if (!a) return null;
    return {
      bio: a.bio?.summary?.replace(/<[^>]*>/g, '').split(' Read more')[0] || '',
      image: a.image?.find((img: {size:string;'#text':string}) => img.size === 'large')?.['#text'] || '',
      tags: a.tags?.tag?.slice(0, 5).map((t: {name:string}) => t.name) || [],
    };
  } catch {
    return null;
  }
}

// ─── EXCHANGE RATES ───────────────────────────────────────────────────────────
// Free, no key — https://frankfurter.app

export async function getExchangeRates(base = 'USD'): Promise<ExchangeRate | null> {
  const key = `fx:${base}`;
  const cached = getCache<ExchangeRate>(key);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
    const data = await res.json();
    const result: ExchangeRate = {
      base: data.base,
      rates: data.rates,
      date: data.date,
    };
    setCache(key, result, 6 * 60 * 60 * 1000); // cache 6h — rates update once daily
    return result;
  } catch {
    return null;
  }
}

// ─── HOLIDAYS ─────────────────────────────────────────────────────────────────
// Free, no key — https://date.nager.at

export interface Holiday {
  date: string;
  name: string;
  localName: string;
  countryCode: string;
}

export async function getUpcomingHolidays(countryCode: string): Promise<Holiday[]> {
  const year = new Date().getFullYear();
  const key = `holidays:${countryCode}:${year}`;
  const cached = getCache<Holiday[]>(key);
  if (cached) return cached;

  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode.toUpperCase()}`);
    if (!res.ok) return [];
    const data: Holiday[] = await res.json();
    const today = new Date().toISOString().split('T')[0];
    const upcoming = data.filter(h => h.date >= today).slice(0, 3);
    setCache(key, upcoming, 24 * 60 * 60 * 1000);
    return upcoming;
  } catch {
    return [];
  }
}

// ─── HELPER — format population ───────────────────────────────────────────────

export function formatPopulation(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// ─── TRANSLATION (MyMemory — free, no key) ──────────────────────────────────

export async function translateText(
  text: string,
  targetLang: string,
): Promise<string> {
  const cacheKey = `translate:${targetLang}:${text.slice(0, 80)}`;
  const cached = getCache<string>(cacheKey);
  if (cached) return cached;

  try {
    const q = encodeURIComponent(text.slice(0, 500));
    const langpair = `|${targetLang}`;
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${q}&langpair=${encodeURIComponent(langpair)}`,
    );
    if (!res.ok) return text;
    const data = await res.json();
    const translated: string | undefined = data?.responseData?.translatedText;
    if (!translated) return text;
    setCache(cacheKey, translated, 60 * 60 * 1000); // 1h
    return translated;
  } catch {
    return text;
  }
}
