/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#e10600",
          redDark: "#b80500",
          bg: "#0b0b0e",
          card: "#14141e",
          gold: "#d4a857",
          muted: "#a1a1aa",
          border: "rgba(255, 255, 255, 0.12)",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(225, 6, 0, 0.35)",
        gold: "0 0 25px rgba(212, 168, 87, 0.25)",
        glass: "0 10px 30px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
