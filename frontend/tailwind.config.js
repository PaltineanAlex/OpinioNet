// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a5b4fc',
          DEFAULT: '#6366f1',
          dark: '#4338ca',
        },
        secondary: {
          light: '#fca5a5',
          DEFAULT: '#f87171',
          dark: '#dc2626',
        },
        accent: {
          light: '#d8b4fe',
          DEFAULT: '#c084fc',
          dark: '#9333ea',
        },
        neutral: {
          light: '#f3f4f6',
          DEFAULT: '#e5e7eb',
          dark: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
