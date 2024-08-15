/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        Primary: "#35424a",
        Secondary: "#647780",
        Accent: "#F2A365",
        Background: "#F5F5F5 ",
      },
    },
  },
  plugins: [],
};
