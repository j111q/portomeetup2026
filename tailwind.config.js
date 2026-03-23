/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F0E4D4',
        'cream-light': '#F5EDE0',
        porto: {
          red: '#E53312',
          blue: '#6B7BFF',
          black: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
}
