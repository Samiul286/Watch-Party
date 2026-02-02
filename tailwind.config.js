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
        neo: {
          yellow: '#FFD700',
          pink: '#FF2D55',
          cyan: '#00D4FF',
          green: '#00FF41',
          black: '#000000',
          white: '#FFFFFF',
          purple: '#A855F7',
          orange: '#F97316',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        'display': ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        'neo': '24px',
        'neo-lg': '32px',
        'neo-xl': '40px',
      },
      boxShadow: {
        'neo': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        'neo-hover': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'neo-sm': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'neo-lg': '12px 12px 0px 0px rgba(0, 0, 0, 1)',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '8': '8px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'wiggle': 'wiggle 0.3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'fade-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        }
      },
    },
  },
  plugins: [],
}
