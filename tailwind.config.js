/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "#08090d",
          900: "#0f1117",
          850: "#13161f",
          800: "#171a25",
          700: "#212534",
          600: "#2c3144",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          glow: "rgba(99, 102, 241, 0.25)",
        },
        accent: {
          DEFAULT: "#6366f1",
          soft: "#818cf8",
          purple: "#a855f7",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
      },
      boxShadow: {
        card: "0 25px 60px -15px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)",
        "card-hover": "0 35px 80px -20px rgba(99,102,241,0.18), 0 0 0 1px rgba(255,255,255,0.15)",
        glow: "0 0 30px -5px rgba(99,102,241,0.3)",
      },
    },
  },
  plugins: [],
};
