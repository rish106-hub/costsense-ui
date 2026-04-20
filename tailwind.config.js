/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:     '#070d1a',
        card:   '#0c1525',
        border: '#1a2540',
        'cs-green':  '#22c55e',
        'cs-orange': '#f59e0b',
        'cs-red':    '#ef4444',
        'cs-blue':   '#3b82f6',
        'cs-purple': '#a78bfa',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

