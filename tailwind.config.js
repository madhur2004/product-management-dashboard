export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // ← CRITICAL for `.dark` class-based theming
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        dark: '#1f2937',
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  plugins: [],
};