module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
      extend: {
          colors: {
              background: '#FEFEFF',
              primary: '#00B9FA',
              tertiary: '#D9D8D8',
              text: '#2C2C2C',  // Assuming a soft black.
              border: '#0082AD'
          },
          borderRadius: {
              DEFAULT: '0.375rem'  // Adjust rounded border as needed.
          }
      }
  },
  variants: {
      extend: {}
  },
  plugins: []
};
