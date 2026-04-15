/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#050505',
        'glass-bg': 'rgba(255, 255, 255, 0.03)',
        'accent-green': '#10b981',
        'accent-blue': '#3b82f6',
        'accent-purple': '#8b5cf6',
        'accent-red': '#ef4444',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
