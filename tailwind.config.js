/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#f6f4f0",
          100: "#e9e2d8",
          200: "#d5c4b3",
          300: "#bda187",
          400: "#aa8365",
          500: "#9b7157",
          600: "#7b5544",
          700: "#6b473d",
          800: "#5b3e38",
          900: "#503633",
          950: "#2d1c1b",
        },
        hover: "#0000000B",
      },
      fontFamily: {
        koruri: ["Koruri"],
        oxanium: ["var(--font-oxanium)"],
      },
      keyframes: {
        slideDownAndFadeIn: {
          from: { opacity: 0, transform: "translateY(-2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideDownAndFadeOut: {
          from: { opacity: 1, transform: "translateY(0)" },
          to: { opacity: 0, transform: "translateY(-2px)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
      },
      animation: {
        slideDownAndFadeIn: "slideDownAndFadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFadeOut: "slideDownAndFadeOut 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        fadeIn: "fadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        fadeOut: "fadeOut 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      height: {
        "1px": "1px",
      },
    },
  },
  plugins: [require("tailwindcss-radix")],
};
