/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Rolig "Sørlandshus"-palett
        krem: "#F7F4EC",
        koks: "#2B2B2B",
        salvie: "#6E7F6A",
        "salvie-mork": "#566150",
        "salvie-lys": "#E7ECE3",
      },
      fontFamily: {
        sans: ['"Segoe UI"', "system-ui", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        kort: "0 6px 24px rgba(43, 43, 43, 0.08)",
      },
    },
  },
  plugins: [],
};
