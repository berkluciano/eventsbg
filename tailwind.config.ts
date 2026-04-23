import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/emails/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#022E66",
          50: "#e6edf7",
          100: "#c0d3ec",
          200: "#96b6e0",
          300: "#6b98d3",
          400: "#4a82ca",
          500: "#2a6cc0",
          600: "#1e5aaa",
          700: "#144690",
          800: "#0b3374",
          900: "#022E66",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
