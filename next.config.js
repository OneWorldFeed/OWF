/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Stops user URLs leaking to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Blocks ALL third-party trackers, Google scripts,
          // Facebook Pixel, ad networks platform-wide.
          // explore.org and NASA streams are explicitly allowed.
          {
            key: 'Content-Security-Policy',
            value: [
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              // Images: YouTube thumbnails (img only), NASA, Wikipedia
              "img-src 'self' data: blob: https://img.youtube.com https://upload.wikimedia.org https://apod.nasa.gov https://images.unsplash.com",
              // Fonts: self-hosted only — no Google Fonts
              "font-src 'self'",
              // Frames: explore.org + NASA only — NO YouTube embeds
              "frame-src https://explore.org https://www.nasa.gov https://plus.nasa.gov",
              // APIs: Anthropic, NASA, Wikipedia, MyMemory, Podcast Index
              "connect-src 'self' https://api.anthropic.com https://api.nasa.gov https://en.wikipedia.org https://api.mymemory.translated.net https://api.podcastindex.org https://newsapi.org",
              "media-src 'self' https:",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
          // Disables Google FLoC, Topics API, location, camera, mic
          {
            key: 'Permissions-Policy',
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()",
          },
          // Clickjacking protection
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
};

module.exports = nextConfig;
