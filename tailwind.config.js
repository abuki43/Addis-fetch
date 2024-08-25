/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        Primary: "#EA9050",
        Secondary: "#f69f3d",
        Accent: "#35424a",
        Background: "#FFF3EA",
      },
    },
  },
  plugins: [],
};
