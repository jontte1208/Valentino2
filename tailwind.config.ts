import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        charcoal: '#1C1C1C',
        cream: '#FAF4EB',
        terracotta: {
          DEFAULT: '#C0623A',
          light: '#D4795A',
          dark: '#9E4E2E',
        },
      },
    },
  },
  plugins: [],
}
export default config
