/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cc: {
          bg: '#f7f5f0',
          panel: '#fffdf9',
          panel2: '#f0ede6',
          border: '#e1dbd0',
          accent: '#16a34a',
          accent2: '#0284c7',
          text: '#172033',
          muted: '#667085',
        },
      },
      fontFamily: {
        mono: ['"Fira Code"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        cc: '16px',
      },
      boxShadow: {
        soft: '0 12px 32px rgba(15, 23, 42, 0.08)',
        glow: '0 14px 40px rgba(22, 163, 74, 0.18)',
      },
    },
  },
  plugins: [],
};
