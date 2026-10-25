/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vcc: '#dc2626',
        gnd: '#16a34a',
        clk: '#d97706',
        zif: {
          light: '#2d8a68',
          dark: '#1b5b44',
        }
      }
    },
  },
  plugins: [],
}
