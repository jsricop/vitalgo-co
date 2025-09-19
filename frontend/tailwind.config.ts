import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/slices/**/*.{js,ts,jsx,tsx,mdx}',  // All slice components and pages
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',  // Shared components across slices
  ],
}

export default config