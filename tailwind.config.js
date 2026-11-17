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
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          850: '#1E5642', // Figma Primary Emerald Green
          900: '#14532d',
          950: '#052e16',
        },
        verity: {
          dark: '#0F172A',
          muted: '#64748B',
          lightMuted: '#94A3B8',
          border: '#E2E8F0',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          accent: '#1E5642',
          accentHover: '#164E3B',
          amberBg: '#FEF3C7',
          amberText: '#B45309',
          amberBorder: '#FCD34D',
          greenBg: '#DEF7EC',
          greenText: '#03543F',
          redBg: '#FEE2E2',
          redText: '#991B1B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
