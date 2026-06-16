import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './utils/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        // Основная палитра — Российская империя
        gold: {
          DEFAULT: '#D4A017',
          light:   '#E8B830',
          dark:    '#B8860B',
          muted:   '#8A7A5A',
          faint:   '#2A2218',
        },
        noir: {
          DEFAULT: '#0A0A0A',
          surface: '#111008',
          card:    '#161410',
          border:  '#2A2218',
        },
        ivory: {
          DEFAULT: '#F5F0E8',
          muted:   '#C4B898',
          faint:   '#5A4E3A',
        },
        // Акценты тем игры
        theme: {
          football: '#1E6B2E',
          hockey:   '#1A237E',
          empire:   '#7B1FA2',
          politics: '#B71C1C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans:  ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'imperial': ['32px', { lineHeight: '1.2', letterSpacing: '4px' }],
        'heading':  ['24px', { lineHeight: '1.3', letterSpacing: '1px' }],
        'label':    ['11px', { lineHeight: '1.4', letterSpacing: '3px' }],
      },
      borderRadius: {
        'imperial': '2px',
        'card':     '8px',
      },
      backgroundImage: {
        'gold-gradient':     'linear-gradient(135deg, #D4A017, #B8860B)',
        'dark-surface':      'linear-gradient(180deg, #111008 0%, #0A0A0A 100%)',
        'gold-divider':      'linear-gradient(90deg, transparent, #D4A017, transparent)',
        'gold-full':         'linear-gradient(135deg, #D4A017 0%, #B8860B 50%, #8A7A5A 100%)',
        'theme-football-g':  'linear-gradient(135deg, #1E6B2E, #0A3D18)',
        'theme-hockey-g':    'linear-gradient(135deg, #1A237E, #0D1257)',
        'theme-empire-g':    'linear-gradient(135deg, #7B1FA2, #4A0072)',
        'theme-politics-g':  'linear-gradient(135deg, #B71C1C, #7F0000)',
      },
      boxShadow: {
        'gold':    '0 0 20px rgba(212, 160, 23, 0.15)',
        'gold-sm': '0 0 8px rgba(212, 160, 23, 0.1)',
      },
      screens: {
        'xs': '375px',
      }
    }
  }
} satisfies Config
