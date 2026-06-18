module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        udom: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#0d7a4e',
          700: '#0a5c3c',
          800: '#084a31',
          900: '#063d28',
          950: '#032818',
        },
        gold: {
          400: '#e8c547',
          500: '#d4af37',
          600: '#b8941f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'udom': '0 4px 24px -4px rgba(10, 92, 60, 0.15)',
        'udom-lg': '0 8px 32px -8px rgba(10, 92, 60, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
