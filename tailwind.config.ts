import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F2937',
        primary: '#1D4ED8',
        'success-text': '#166534',
        'danger-text': '#B91C1C',
        'warning-text': '#92400E',
        focus: '#000000',
      },
    },
  },
  plugins: [],
} satisfies Config
