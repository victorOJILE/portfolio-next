/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          400: '#60a5fa'
        },
        accent: {
          gold: '#818000'
        },
        dark: {
          300: '#0F1622'
        }
      },
      fontFamily: {
        sans: ['var(--font-open-sans)', 'system-ui', 'sans-serif'],
        beauty: ['var(--font-beauty)', 'cursive'],
        crimson: ['var(--font-crimson)', 'serif'],
      },
      animation: {
        'bounce-in-left': 'bounceInLeft 2s cubic-bezier(0.215, 0.61, 0.355, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        bounceInLeft: {
          '0%': { 
            opacity: '0', 
            transform: 'translate3d(-500px, 0, 0)' 
          },
          '60%': { 
            opacity: '1', 
            transform: 'translate3d(25px, 0, 0)' 
          },
          '75%': { 
            transform: 'translate3d(-10px, 0, 0)' 
          },
          '90%': { 
            transform: 'translate3d(5px, 0, 0)' 
          },
          '100%': { 
            transform: 'translate3d(0, 0, 0)' 
          },
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(239, 68, 68, 0.5)'
      }
    }
  },
  plugins: []
}
