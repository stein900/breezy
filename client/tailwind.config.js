/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'x-black': '#000000',
        'x-dim': '#16181c',
        'x-border': '#2f3336',
        'x-border-light': '#536471',
        'x-gray': '#71767b',
        'x-white': '#e7e9ea',
        'x-blue': '#1d9bf0',
        'x-blue-hover': '#1a8cd8',
        'x-green': '#00ba7c',
        'x-pink': '#f91880',
        'x-banner': '#333639',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'x-nav': ['20px', { lineHeight: '24px', fontWeight: '400' }],
        'x-body': ['15px', { lineHeight: '20px' }],
        'x-title': ['20px', { lineHeight: '24px', fontWeight: '700' }],
      },
      maxWidth: {
        feed: '600px',
        sidebar: '275px',
        aside: '350px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(29, 155, 240, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
