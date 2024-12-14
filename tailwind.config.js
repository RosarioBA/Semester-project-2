/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js}', './src/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f6f52', // Sage Green
          light: '#739072', // Lighter Sage
        },
        cta: '#D66853', // Terracotta
        neutral: {
          100: '#FFFFFF',
          200: '#F8FAF5',
          300: '#E5E7E4',
          900: '#2C3532',
        },
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
};
