/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        paper: {
          light: '#F6F7F4',
          dark: '#0E1A17',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#132420',
        },
        pharma: {
          50: '#EAF6F1',
          100: '#CDEBDE',
          300: '#6DBFA1',
          500: '#0E6E5D',
          600: '#0B5A4C',
          700: '#08453B',
          900: '#052A24',
        },
        rx: {
          amber: '#C9752B',
          amberSoft: '#F6E3CE',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(8, 40, 34, 0.06), 0 8px 24px -12px rgba(8, 40, 34, 0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
