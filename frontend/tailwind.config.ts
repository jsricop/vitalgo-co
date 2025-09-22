import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',      // Next.js App Router pages and layouts
    './src/slices/**/*.{js,ts,jsx,tsx,mdx}',   // All slice components and pages
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',   // Shared components across slices
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Additional components directory
  ],
  theme: {
    extend: {
      colors: {
        'vitalgo': {
          'green': '#01EF7F',
          'green-light': '#5AF4AC',
          'green-lighter': '#99F9CC',
          'green-lightest': '#CCFCE5',
          'dark': '#002C41',
          'dark-light': '#406171',
          'dark-lighter': '#99ABB3',
          'dark-lightest': '#CCD5D9',
        },
      },
    },
  },
  plugins: [],
}

export default config