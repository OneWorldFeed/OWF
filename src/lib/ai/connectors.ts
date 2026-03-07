/* ============================================================
   OWF COPILOT — EXTERNAL API CONNECTORS v1
============================================================ */

const CITY_TIMEZONE: Record<string, { tz: string; lat: number; lon: number }> = {
  'lagos':         { tz: 'Africa/Lagos',                   lat: 6.52,   lon: 3.38   },
  'cairo':         { tz: 'Africa/Cairo',                   lat: 30.06,  lon: 31.25  },
  'nairobi':       { tz: 'Africa/Nairobi',                 lat: -1.29,  lon: 36.82  },
  'accra':         { tz: 'Africa/Accra',                   lat: 5.56,   lon: -0.20  },
  'johannesburg':  { tz: 'Africa/Johannesburg',            lat: -26.20, lon: 28.04  },
  'tokyo':         { tz: 'Asia/Tokyo',                     lat: 35.68,  lon: 139.69 },
  'mumbai':        { tz: 'Asia/Kolkata',                   lat: 19.08,  lon: 72.88  },
  'shanghai':      { tz: 'Asia/Shanghai',                  lat: 31.23,  lon: 121.47 },
  'beijing':       { tz: 'Asia/Shanghai',                  lat: 39.91,  lon: 116.39 },
  'seoul':         { tz: 'Asia/Seoul',                     lat: 37.57,  lon: 126.98 },
  'singapore':     { tz: 'Asia/Singapore',                 lat: 1.35,   lon: 103.82 },
  'bangkok':       { tz: 'Asia/Bangkok',                   lat: 13.75,  lon: 100.52 },
  'dubai':         { tz: 'Asia/Dubai',                     lat: 25.20,  lon: 55.27  },
  'istanbul':      { tz: 'Europe/Istanbul',                lat: 41.01,  lon: 28.95  },
  'london':        { tz: 'Europe/London',                  lat: 51.51,  lon: -0.13  },
  'paris':         { tz: 'Europe/Paris',                   lat: 48.85,  lon: 2.35   },
  'berlin':        { tz: 'Europe/Berlin',                  lat: 52.52,  lon: 13.40  },
  'madrid':        { tz: 'Europe/Madrid',                  lat: 40.42,  lon: -3.70  },
  'rome':          { tz: 'Europe/Rome',                    lat: 41.90,  lon: 12.50  },
  'moscow':        { tz: 'Europe/Moscow',                  lat: 55.75,  lon: 37.62  },
  'new york':      { tz: 'America/New_York',               lat: 40.71,  lon: -74.01 },
  'los angeles':   { tz: 'America/Los_Angeles',            lat: 34.05,  lon: -118.24},
  'chicago':       { tz: 'America/Chicago',                lat: 41.88,  lon: -87.63 },
  'miami':         { tz: 'America/New_York',               lat: 25.77,  lon: -80.19 },
  'toronto':       { tz: 'America/Toronto',                lat: 43.65,  lon: -79.38 },
  'sao paulo':     { tz: 'America/Sao_Paulo',              lat: -23.55, lon: -46.63 },
  'buenos aires':  { tz: 'America/Argentina/Buenos_Aires', lat: -34.60, lon: -58.38 },
  'mexico city':   { tz: 'America/Mexico_City',            lat: 19.43,  lon: -99.13 },
  'sydney':        { tz: 'Australia/Sydney',               lat: -33.87, lon: 151.21 },
  'melbourne':     { tz: 'Australia/Melbourne',            lat: -37.81, lon: 144.96 },
  'osaka':         { tz: 'Asia/Tokyo',                     lat: 34.69,  lon: 135.50 },
  'kuala lumpur':  { tz: 'Asia/Kuala_Lumpur',              lat: 3.14,   lon: 101.69 },
  'jakarta':       { tz: 'Asia/Jakarta',                   lat: -6.21,  lon: 106.85 },
  'manila':        { tz: 'Asia/Manila',                    lat: 14.60,  lon: 120.98 },
  'riyadh':        { tz: 'Asia/Riyadh',                    lat: 24.69,  lon: 46.72  },
  'amsterdam':     { tz: 'Europe/Amsterdam',               lat: 52.37,  lon: 4.90   },
  'zurich':        { tz: 'Europe/Zurich',                  lat: 47.38,  lon: 8.54   },
  'stockholm':     { tz: 'Europe/Stockholm',               lat: 59.33,  lon: 18.07  },
};

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Slight showers', 81: 'Showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail',
};

function findCity(query: string) {
  const q = query.toLowerCase().trim();
  for (const [key, val] of Object.entries(CITY_TIMEZONE)) {
    if (q.includes(key)) return { name: key, ...val };
  }
  return null;
}

export async function getWeather(query: string): Promise<string> {
  const city = findCity(query);
  if (!city) return `I couldn't find weather data for "${query}". Try a major city name.`;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=${encodeURIComponent(city.tz)}`;
    const res = await fetch(url);
    const data = await res.json();
    const c = data.current;
    const condition = WMO_CODES[c.weathercode] ?? 'Unknown';
    const name = city.name.charAt(0).toUpperCase() + city.name.slice(1);
    return `Weather in ${name}: ${condition}, ${Math.round(c.temperature_2m)}°F. Wind ${Math.round(c.windspeed_10m)} mph, humidity ${c.relative_humidity_2m}%.`;
  } catch {
    return `Unable to fetch live weather right now. Try again in a moment.`;
  }
}

export function getTime(query: string): string {
  const city = findCity(query);
  if (!city) return `I couldn't find the timezone for "${query}". Try a major city name.`;
  try {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true, timeZone: city.tz });
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: city.tz });
    const name = city.name.charAt(0).toUpperCase() + city.name.slice(1);
    return `It's currently ${time} in ${name} (${date}).`;
  } catch {
    return `Unable to get the current time for "${query}".`;
  }
}

export async function getNews(query: string): Promise<string> {
  try {
    const q = encodeURIComponent(query || 'world news');
    const res = await fetch(`https://api.duckduckgo.com/?q=${q}+news&format=json&no_html=1&skip_disambig=1`);
    const data = await res.json();
    const parts: string[] = [];
    if (data.AbstractText) parts.push(data.AbstractText);
    if (data.RelatedTopics?.length) {
      const topics = data.RelatedTopics.slice(0, 3).filter((t: any) => t.Text).map((t: any) => `• ${t.Text}`).join('\n');
      if (topics) parts.push(topics);
    }
    return parts.length ? parts.join('\n\n') : `I couldn't find live news for "${query}" right now.`;
  } catch {
    return `Unable to fetch news right now. Try again in a moment.`;
  }
}

export async function getSearch(query: string): Promise<string> {
  try {
    const q = encodeURIComponent(query);
    const res = await fetch(`https://api.duckduckgo.com/?q=${q}&format=json&no_html=1&skip_disambig=1`);
    const data = await res.json();
    const parts: string[] = [];
    if (data.Answer) parts.push(data.Answer);
    if (data.AbstractText) parts.push(data.AbstractText);
    if (data.Definition) parts.push(data.Definition);
    if (!parts.length && data.RelatedTopics?.length) {
      const topics = data.RelatedTopics.slice(0, 3).filter((t: any) => t.Text).map((t: any) => t.Text).join('\n\n');
      if (topics) parts.push(topics);
    }
    return parts.length ? parts.join('\n\n') : `I searched for "${query}" but couldn't find a direct answer. Try rephrasing.`;
  } catch {
    return `Unable to search right now. Try again in a moment.`;
  }
}
