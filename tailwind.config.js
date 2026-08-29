/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cc: {
          bg: '#0d1117',
          panel: '#11161d',
          panel2: '#161b22',
          border: '#232a34',
          accent: '#22c55e',
          accent2: '#38bdf8',
          text: '#e6edf3',
          muted: '#8b96a5',
        },
      },
      fontFamily: {
        mono: ['"Fira Code"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        cc: '10px',
      },
    },
  },
  plugins: [],
};
