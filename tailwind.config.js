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
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          yellow: '#eb9a07',
          gold: '#818000',
          green: '#10b981',
        },
        dark: {
          100: '#2E2E42',
          200: '#16245b',
          300: '#0F1622',
          400: '#150505',
        }
      },
      fontFamily: {
        sans: ['var(--font-open-sans)', 'system-ui', 'sans-serif'],
        beauty: ['var(--font-beauty)', 'cursive'],
        crimson: ['var(--font-crimson)', 'serif'],
      },
      animation: {
        'bounce-in-right': 'bounceInRight 2s cubic-bezier(0.215, 0.61, 0.355, 1)',
        'bounce-in-left': 'bounceInLeft 2s cubic-bezier(0.215, 0.61, 0.355, 1)',
        'slide-up': 'slideUp 1s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        bounceInRight: {
          '0%': { 
            opacity: '0', 
            transform: 'translate3d(20%, 0, 0)' 
          },
          '60%': { 
            opacity: '1', 
            transform: 'translate3d(-25px, 0, 0)' 
          },
          '75%': { 
            transform: 'translate3d(10px, 0, 0)' 
          },
          '90%': { 
            transform: 'translate3d(-5px, 0, 0)' 
          },
          '100%': { 
            transform: 'translate3d(0, 0, 0)' 
          },
        },
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
        },
        slideUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translate3d(0, 100px, 0)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translate3d(0, 0, 0)' 
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/nature-2608274_12835.jpg')",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
}
