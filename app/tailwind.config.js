/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        secondary: '#ffffff',
        accent: '#003366',
        'light-blue': '#e6f3ff',
      }
    },
  },
  plugins: [],
}
