/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Mørk antrasitt – "bygg"-følelse
        antrasitt: {
          DEFAULT: "#1B1E24",
          900: "#15171C",
          800: "#1B1E24",
          700: "#23272F",
          600: "#2D323B",
          500: "#3A404B",
        },
        // Kraftig varm aksent – "bygg/varsel"-oransje
        bygg: {
          DEFAULT: "#FF7A1A",
          mork: "#E8650A",
          lys: "#FFB066",
        },
        gul: "#FBBF24",
        // Bakgrunn for resultatskjerm
        lerret: "#F3F4F6",
        // Alvorlighet
        kritisk: "#DC2626",
        viktig: "#EA580C",
        info: "#6B7280",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        // Litt større basis enn standard – tydelig for håndverkere
        base: ["1.0625rem", { lineHeight: "1.6" }],
        lg: ["1.1875rem", { lineHeight: "1.6" }],
        xl: ["1.375rem", { lineHeight: "1.5" }],
        "2xl": ["1.75rem", { lineHeight: "1.3" }],
        "3xl": ["2.125rem", { lineHeight: "1.2" }],
        "4xl": ["2.75rem", { lineHeight: "1.1" }],
        "5xl": ["3.5rem", { lineHeight: "1.05" }],
      },
      boxShadow: {
        kort: "0 4px 20px rgba(20, 23, 28, 0.08)",
        kortHover: "0 10px 32px rgba(20, 23, 28, 0.14)",
        aksent: "0 6px 20px rgba(255, 122, 26, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
