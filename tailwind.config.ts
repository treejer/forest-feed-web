/** @type {import('tailwindcss').Config} */
const {colors} = require('./colors');

module.exports = {
  plugins: [require('daisyui')],
  daisyui: {
    themes: [{theme: colors}],
    base: false,
  },
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: colors,
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    fontSize: {
      sm: '13px',
      lg: '16px',
      xl: '18px',
      '4xl': '28px',
    },
    gridTemplateRows: {
      appLayout: 'auto 1fr',
    },
  },
};
