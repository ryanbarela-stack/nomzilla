/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kaiju: {
          bg: "#0b1020",
          panel: "#121a33",
          panel2: "#1a2444",
          border: "#2b3868",
          green: "#5df27a",
          teal: "#39e6c8",
          purple: "#a374ff",
          gold: "#ffcf5c",
          red: "#ff5c6c",
        },
      },
      fontFamily: {
        display: ["'Kanit'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(93, 242, 122, 0.35)",
        glowGold: "0 0 30px rgba(255, 207, 92, 0.45)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-6px) scale(1.02)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.55 },
          "50%": { opacity: 1 },
        },
        auraGlow: {
          "0%, 100%": { opacity: 0.08, transform: "scale(1)" },
          "50%": { opacity: 0.2, transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        breathe: "breathe 4s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
        auraGlow: "auraGlow 3.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
