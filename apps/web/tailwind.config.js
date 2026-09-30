/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F62FE",
          dark: "#0043CE",
          light: "#D0E2FF",
        },
        success: {
          DEFAULT: "#24A148",
          bg: "#DEFBE6",
        },
        warning: {
          DEFAULT: "#F1C21B",
          bg: "#FCF4D6",
        },
        danger: {
          DEFAULT: "#DA1E28",
          bg: "#FFF1F1",
        },
        gray: {
          100: "#F4F4F4",
          200: "#E0E0E0",
          300: "#C6C6C6",
          400: "#8D8D8D",
          500: "#525252",
          600: "#161616",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
