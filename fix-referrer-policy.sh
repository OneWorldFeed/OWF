#!/bin/bash
# ── Fix YouTube Error 153 — Referrer Policy ──────────────────
# YouTube started enforcing HTTP Referer headers in late 2025.
# Two fixes needed:
#   1. Add referrerpolicy attribute to the iframe
#   2. Set the header in Next.js config

if [ ! -f "next.config.js" ] && [ ! -f "next.config.ts" ] && [ ! -f "next.config.mjs" ]; then
  echo "❌ Run from your project root"
  exit 1
fi

# ── Fix 1: Add referrerpolicy to the iframe in live page ─────
python3 - <<'PYEOF'
import re

path = 'src/app/live/page.tsx'
with open(path, 'r') as f:
    content = f.read()

# Add referrerpolicy to iframe
content = content.replace(
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"\n          allowFullScreen\n          className="absolute inset-0 w-full h-full"\n          style={{ border: \'none\' }}\n        />',
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"\n          allowFullScreen\n          referrerPolicy="strict-origin-when-cross-origin"\n          className="absolute inset-0 w-full h-full"\n          style={{ border: \'none\' }}\n        />'
)

with open(path, 'w') as f:
    f.write(content)

print("✓ Added referrerpolicy to Live page iframe")
PYEOF

# ── Fix 2: Add Referrer-Policy header to Next.js config ──────
# Detect which config file exists
CONFIG_FILE=""
if [ -f "next.config.js" ]; then CONFIG_FILE="next.config.js"
elif [ -f "next.config.ts" ]; then CONFIG_FILE="next.config.ts"
elif [ -f "next.config.mjs" ]; then CONFIG_FILE="next.config.mjs"
fi

echo ""
echo "Found config: $CONFIG_FILE"
echo ""

python3 - "$CONFIG_FILE" <<'PYEOF'
import sys, re

config_file = sys.argv[1]
with open(config_file, 'r') as f:
    content = f.read()

# Check if headers already configured
if 'Referrer-Policy' in content:
    print("✓ Referrer-Policy header already set in Next.js config")
else:
    # Add headers config — works for both module.exports and export default patterns
    headers_block = """
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
"""
    # Insert before the closing of the config object
    # Works for: const nextConfig = { ... }
    if 'const nextConfig' in content:
        content = re.sub(
            r'(const nextConfig\s*[=:]\s*\{)',
            r'\1' + headers_block,
            content,
            count=1
        )
        with open(config_file, 'w') as f:
            f.write(content)
        print(f"✓ Added Referrer-Policy header to {config_file}")
    else:
        print(f"⚠ Could not auto-patch {config_file}")
        print("  Manually add this inside your Next.js config object:")
        print("""
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
""")
PYEOF

echo ""
echo "✅ Done! Restart your dev server:"
echo "   Ctrl+C to stop, then: npm run dev"
echo ""
echo "   YouTube embeds should now work on the Live page."
