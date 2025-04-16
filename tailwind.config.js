/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6',
        'primary-dark': '#2563eb',
        'secondary': '#60a5fa',
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