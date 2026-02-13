import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9f5",
          100: "#d5f0e3",
          200: "#95c5b3",
          300: "#61a88e",
          400: "#355c4e",
          500: "#29473c",
          600: "#1e352d",
          700: "#16271f",
          800: "#0e1a14",
          900: "#070d0a",
        },
        purple: {
          50: "#f3eefb",
          100: "#e4d8f5",
          200: "#c9b1eb",
          300: "#a87de0",
          400: "#8250d7",
          500: "#37225a",
          600: "#2a1a45",
          700: "#1d1230",
          800: "#100a1b",
          900: "#080510",
        },
        accent: {
          DEFAULT: "#e5951a",
          light: "#f0b85a",
          dark: "#c47a0e",
        },
        surface: {
          DEFAULT: "#ffffff",
          secondary: "#f8faf9",
          tertiary: "#f0f4f2",
          dark: "#0a1612",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["DM Serif Display", "Georgia", "serif"],
        mono: ["Fragment Mono", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
      spacing: {
        section: "80px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-in": "slideIn 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
