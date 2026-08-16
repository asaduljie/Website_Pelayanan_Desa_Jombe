import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jombe: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f7f3e8',
          200: '#efe6d0',
          300: '#e4d3af',
          400: '#d6bb8a',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(22, 101, 52, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-hover': '0 10px 30px -4px rgba(22, 101, 52, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
export default config
