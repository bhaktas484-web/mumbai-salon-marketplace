import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — warm gold meets deep charcoal (Mumbai luxury feel)
        brand: {
          50:  "#FFF9F0",
          100: "#FFF0D6",
          200: "#FFD999",
          300: "#FFC15E",
          400: "#FFAA2C",
          500: "#F59500", // Primary gold
          600: "#CC7A00",
          700: "#A36000",
          800: "#7A4700",
          900: "#522F00",
        },
        surface: {
          DEFAULT: "#0F0E0D", // Near-black bg
          card:    "#1A1916",
          raised:  "#252320",
          border:  "#2E2C28",
          muted:   "#3D3A34",
        },
        ink: {
          primary:   "#F5F2EC",
          secondary: "#B8B3A8",
          muted:     "#7A7570",
          disabled:  "#4A4742",
        },
        accent: {
          rose:  "#F43F5E", // Bandra vibe
          teal:  "#14B8A6", // South Mumbai cool
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body:    ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-dm-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "glow-gold": "0 0 24px rgba(245, 149, 0, 0.25)",
        "glow-rose": "0 0 24px rgba(244, 63, 94, 0.2)",
        card: "0 2px 16px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #F59500 0%, #FF6B35 100%)",
        "gradient-dark":  "linear-gradient(180deg, #0F0E0D 0%, #1A1916 100%)",
        "gradient-card":  "linear-gradient(145deg, #1A1916 0%, #252320 100%)",
        "mesh-gold":
          "radial-gradient(ellipse at 20% 50%, rgba(245,149,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,107,53,0.06) 0%, transparent 50%)",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-up":   "slideUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
        "slide-down": "slideDown 0.3s ease forwards",
        shimmer:      "shimmer 1.8s infinite linear",
        "spin-slow":  "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      spacing: {
        "18":  "4.5rem",
        "88":  "22rem",
        "112": "28rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
};

export default config;