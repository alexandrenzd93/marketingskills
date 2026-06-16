import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A96E',
        cream: '#FAF8F5',
        'bbc-dark': '#0a0806',
        marble: '#EDE5D0',
        wall: '#F2ECE0',
      },
      fontFamily: {
        display: ['var(--font-bodoni)', 'serif'],
        sans: ['var(--font-raleway)', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.3em',
      },
    },
  },
  plugins: [],
};

export default config;
