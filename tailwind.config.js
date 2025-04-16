/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6',
        'primary-dark': '#2563eb',
        'secondary': '#60a5fa',
        'dark-bg': '#0f172a', // slate-900
        'dark-text': '#94a3b8', // slate-400
        'dark-heading': '#ffffff', // white
      },
      backgroundImage: {
        'wave-pattern': "url('/src/assets/wave-pattern.svg')",
      },
      borderRadius: {
        'md': '0.375rem',
      },
    },
  },
  plugins: [],
} 