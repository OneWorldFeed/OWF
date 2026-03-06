/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'owf-navy': '#0D1F35',
        'owf-gold': '#D97706',
        'owf-teal': '#007A6E',
        'owf-purple': '#5B54D6',
        'owf-blue': '#1D4ED8',
        'owf-bg': '#060E1A',
      },
    },
  },
  plugins: [],
};
