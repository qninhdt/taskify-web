/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        wawe: {
          '0%': { transform: '', opacity: 1 },
          '100%': {
            transform: 'translateX(-10%) translateY(10%)',
            opacity: 0,
          },
        },
      },
      animation: {
        wawe: 'wawe 1s ease-in-out infinite',
        xwave: 'wawe 1s ease-in-out -0.5s infinite',
      },
    },
  },
  plugins: [],
}
