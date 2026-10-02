/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Apunta a todos los componentes de React
  ],
  theme: {
    extend: {},
  },
  plugins: [require("prettier-plugin-tailwindcss")],
};
