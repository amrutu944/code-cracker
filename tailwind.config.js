/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cc: {
          bg: 'rgb(var(--cc-bg) / <alpha-value>)',
          panel: 'rgb(var(--cc-panel) / <alpha-value>)',
          panel2: 'rgb(var(--cc-panel2) / <alpha-value>)',
          border: 'rgb(var(--cc-border) / <alpha-value>)',
          accent: 'rgb(var(--cc-accent) / <alpha-value>)',
          accent2: 'rgb(var(--cc-accent2) / <alpha-value>)',
          text: 'rgb(var(--cc-text) / <alpha-value>)',
          muted: 'rgb(var(--cc-muted) / <alpha-value>)',
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
