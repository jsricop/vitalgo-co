import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/slices/**/*.{js,ts,jsx,tsx,mdx}',  // All slice components and pages
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',  // Shared components across slices
  ],
  theme: {
    extend: {
      colors: {
        'green-500': '#10b981',
        'green-600': '#059669',
        'blue-600': '#2563eb',
        'blue-700': '#1d4ed8',
        'gray-50': '#f9fafb',
        'gray-100': '#f3f4f6',
        'gray-200': '#e5e7eb',
        'gray-300': '#d1d5db',
        'gray-600': '#4b5563',
        'gray-700': '#374151',
        'gray-800': '#1f2937',
        'gray-900': '#111827',
        'yellow-400': '#fbbf24',
      }
    },
  },
  plugins: [],
}

export default config