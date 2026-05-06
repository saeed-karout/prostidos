// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // أو 'media' حسب تفضيلاتك
  theme: {
    extend: {
      colors: {
        'primary': '#BB936A',
        'secondary': '#324654',
        'white': "#ffffff",
        "pink": "#EB2952",
        "navyBlue":"#0D1438",
        "navyBlueLight":"#293056"
      },
      fontFamily: {
        'league': ['"League Spartan"', 'sans-serif'],
      },
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundSize: {
        '200%': '200%',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      animation: {
        'gradient': 'gradient 5s ease infinite',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.white'),
            a: {
              color: theme('colors.pink'),
              '&:hover': {
                color: theme('colors.white'),
              },
            },
            h1: {
              color: theme('colors.white'),
            },
            h2: {
              color: theme('colors.white'),
            },
            h3: {
              color: theme('colors.white'),
            },
            h4: {
              color: theme('colors.white'),
            },
            h5: {
              color: theme('colors.white'),
            },
            h6: {
              color: theme('colors.white'),
            },
            strong: {
              color: theme('colors.white'),
            },
            em: {
              color: theme('colors.white'),
            },
            u: {
              color: theme('colors.white'),
            },
            p: {
              color: theme('colors.white'),
            },
            li: {
              color: theme('colors.white'),
            },
            blockquote: {
              color: theme('colors.white'),
              borderLeftColor: theme('colors.pink'),
            },
            code: {
              color: theme('colors.white'),
            },
            pre: {
              color: theme('colors.white'),
              backgroundColor: theme('colors.secondary'),
            },
            // يمكنك إضافة المزيد من الأنماط حسب الحاجة
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
