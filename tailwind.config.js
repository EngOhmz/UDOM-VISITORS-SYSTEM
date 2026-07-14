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
        // Official UDOM logo palette (blue + orange accent)
        udom: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#7db8f5',
          400: '#4a95e8',
          500: '#0673cd',
          600: '#0066cc',
          700: '#02569d',
          800: '#014578',
          900: '#01345a',
          950: '#001f38',
        },
        gold: {
          300: '#f6c453',
          400: '#f2a900',
          500: '#e89500',
          600: '#d44027',
          700: '#b83820',
        },
      },
      fontFamily: {
        sans: ['"Ropa Sans"', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['"Ropa Sans"', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'udom': '0 4px 24px -4px rgba(0, 96, 204, 0.15)',
        'udom-lg': '0 8px 32px -8px rgba(0, 96, 204, 0.22)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
