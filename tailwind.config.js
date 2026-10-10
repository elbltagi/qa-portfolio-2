/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FAF9F6',
          surface: '#FFFFFF',
          muted: '#E9E9E5',
          border: 'rgba(24, 24, 24, 0.08)',
        },
        ink: {
          DEFAULT: '#181818',
          muted: '#525252',
          subtle: '#7E7E7E',
          ghost: '#A8A8A8',
        },
        accent: {
          DEFAULT: '#315BFA',
          hover: '#2047E0',
          subtle: '#EEF2FF',
          dark: '#1A3AB8',
        },
        cream: {
          50: '#FAF9F6',
          100: '#F5F4EF',
          200: '#E9E9E5',
          300: '#DEDEC9',
          400: '#C7C7B0',
        },
        charcoal: {
          950: '#111111',
          900: '#181818',
          800: '#2A2A2A',
          700: '#3D3D3D',
          600: '#525252',
          500: '#6E6E6E',
          400: '#8E8E8E',
          300: '#B0B0B0',
          200: '#D4D4D4',
          100: '#ECECEC',
        },
        cobalt: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#6366F1',
          500: '#315BFA',
          600: '#254EDB',
          700: '#1D3EB0',
          800: '#16308A',
          900: '#0E1F5A',
        },
      },
      fontFamily: {
        editorial: ['"Syne"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', '"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.15em',
        ultra: '0.25em',
      },
    },
  },
  plugins: [],
}
