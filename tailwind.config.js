/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFF3FB',
        surface: {
          DEFAULT: '#FFF3FB',
          container: '#FFDEFF',
          low: '#FFEBFC',
          high: '#FCDCFF',
          highest: '#FCCEFF',
        },
        ink: {
          DEFAULT: '#402445',
          muted: '#715075',
          soft: '#9B7A9F',
        },
        outline: {
          DEFAULT: '#C7A1CA',
          ghost: 'rgba(199, 161, 202, 0.18)',
        },
        primary: {
          50: '#F7EEFF',
          100: '#EFDFFF',
          200: '#DFC5FF',
          300: '#C9A6FF',
          400: '#B286FF',
          500: '#8F62E2',
          600: '#6C40BD',
          700: '#5A33A2',
          800: '#4A2A84',
          900: '#3B226A',
          dim: '#8A5ED8',
          container: '#B38BFF',
        },
        brand: {
          DEFAULT: '#6C40BD',
          light: '#8F62E2',
          dark: '#4A2A84',
        },
        tertiary: {
          100: '#FDEAAA',
          300: '#FDD34D',
          500: '#D9A624',
        },
        status: {
          info: '#6C40BD',
          success: '#2F8F5B',
          warning: '#B9771F',
          danger: '#C44662',
          neutral: '#715075',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px rgba(64, 36, 69, 0.08)',
        'card-hover': '0 14px 30px rgba(64, 36, 69, 0.12)',
        glass: '0 12px 28px rgba(64, 36, 69, 0.1)',
      }
    },
  },
  plugins: [],
}
