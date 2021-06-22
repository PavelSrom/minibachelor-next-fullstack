module.exports = {
  purge: ['./**/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'theme-primary': '#5AA9E6',
        'theme-secondary': '#FF6392',
        'theme-lightgray': '#F9F9F9',
        'theme-yellow': '#FFE45E',
        'theme-lightblue': '#7FC8F8',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
