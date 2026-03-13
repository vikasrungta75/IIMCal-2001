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
        'iimc': {
          'navy': '#003366',
          'gold': '#C8A951',
          'cream': '#F5F0E8',
          'dark': '#1a1a2e',
          'accent': '#8B0000',
        }
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'body': ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'serif'],
      }
    },
  },
  plugins: [],
}
export default config
