import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        // ARTIST BRANDING (The "CUBs" Gear)
        background: '#3E2723',      // Dark Brown (The Den)
        foreground: '#EFEBE9',      // Soft White Text
        primary: {
          DEFAULT: '#CCFF00',       // NEON LIME (The Energy)
          glow: '#CCFF00',
        },
        secondary: '#D7CCC8',       // Light Brown (Accent)
        muted: '#8D6E63',           // Muted Earth Tone
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;