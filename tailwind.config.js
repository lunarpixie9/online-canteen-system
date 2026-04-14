/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["DM Sans", "sans-serif"],
        display: ["Fraunces", "serif"],
      },
      colors: {
        bg:      "#F7F4EF",
        card:    "#FFFFFF",
        sunken:  "#F0EDE7",
        border:  "#E8E4DC",
        muted:   "#A89F99",
        strong:  "#1C1917",
        amber: {
          DEFAULT: "#F5A623",
          light:   "#FEF3D7",
          dark:    "#D4891A",
        },
        chart: {
          happy:   "#F5A623",
          sad:     "#7C5C4E",
          calm:    "#7A8C5E",
          anxious: "#7D8A88",
        },
      },
      borderRadius: {
        sm:   "10px",
        md:   "16px",
        lg:   "24px",
        xl:   "32px",
        pill: "9999px",
      },
      boxShadow: {
        card:  "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        float: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        amber: "0 4px 16px rgba(245,166,35,0.35)",
      },
      maxWidth: {
        app: "480px",
      },
    },
  },
  plugins: [],
};