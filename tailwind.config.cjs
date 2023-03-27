/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'archivo': ['Archivo Black', 'sans-serif'],
        'paytone': ['Paytone One', 'sans-serif'],
      },
      colors: {
        'secondary': '#3D86B1',
        'tertiary': '#FECA1F',
        'secondary-active': '#549FB9',
        'tertiary-active': '#FED936'
      },
      dropShadow: {
        'primary': '3px 3px 0px rgba(0,0,0,1)',
        'primary-xl': '8px 8px 0px rgba(0,0,0,1)',
        'secondary': '3px 3px 0px rgba(61,134,177,1)',
        'tertiary': '3px 3px 0px rgba(254,202,31,1)',
        'text': [
          '-1px -1px 0px rgba(0,0,0,1)',
          '3px 3px 0px rgba(0,0,0,1)',
        ]
      }
    },
  },
  plugins: [],
}