/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dt-primary': '#0e1b3d',
        'dt-secondary': '#1360d2',
        'dt-bg': '#f8fafd',
        'dt-text': '#060c28',
        'dt-text-secondary': '#697498',
        'dt-border': '#ddd',
      },
      fontFamily: {
        dubai: ['Dubai', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
