/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      lightGreen: '#D3E4D0',
      yellow: '#F0E5C8',
      border: '#BDBDBD',
      primaryGreen: '#0CC863',
      primary: '#FEC703',
      activeGray: '#2626260d',
      secondary: '#262626',
      red: '#D78A76',
      secondaryGreen: '#4C9F70',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
