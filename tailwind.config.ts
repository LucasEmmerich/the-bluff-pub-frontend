import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./components/**/*.{vue,js,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
    ],
    theme: {
        extend: {
            colors: {
                pub: {
                    bg: "#0a0603",
                    wood: "#1a0a04",
                    "wood-mid": "#2a1208",
                    "wood-light": "#3d2415",
                    felt: "#082618",
                    "felt-mid": "#0f3d22",
                    "felt-light": "#1f5c3a",
                    gold: "#b8860b",
                    "gold-light": "#d4a820",
                    "gold-bright": "#f0c040",
                    cream: "#f0e0c0",
                    "cream-dark": "#c4a882",
                    "cream-dim": "#8a7055",
                },
            },
            fontFamily: {
                pub: ["Cinzel", "serif"],
                body: ["Lora", "serif"],
            },
            keyframes: {
                "card-land": {
                    "0%": { transform: "translateY(-35px) rotate(var(--rot,0deg)) scale(0.82)", opacity: "0" },
                    "65%": { transform: "translateY(5px)   rotate(var(--rot,0deg)) scale(1.04)", opacity: "1" },
                    "100%": { transform: "translateY(0px)   rotate(var(--rot,0deg)) scale(1)", opacity: "1" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "pulse-gold": {
                    "0%, 100%": { boxShadow: "0 0 8px 2px rgba(212,168,32,0.3)" },
                    "50%": { boxShadow: "0 0 24px 8px rgba(212,168,32,0.7)" },
                },
                flicker: {
                    "0%, 100%": { opacity: "1" },
                    "45%": { opacity: "0.9" },
                    "50%": { opacity: "0.75" },
                    "55%": { opacity: "0.9" },
                },
            },
            animation: {
                "card-land": "card-land 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
                "fade-in": "fade-in 0.5s ease-in",
                "pulse-gold": "pulse-gold 2s ease-in-out infinite",
                flicker: "flicker 4s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};

export default config;
