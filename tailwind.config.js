/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // ✅ Includes App Router components
    './components/**/*.{js,ts,jsx,tsx}', // ✅ Optional if you're using a components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
