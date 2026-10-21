import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFBF2',
        surface: '#FFFFFF',
        borderWarm: '#F0E7D3',
        charcoal: '#1F2937',
        muted: '#6B7280',
        amber: {
          primary: '#F59E0B',
          secondary: '#FBBF24',
        },
        savings: {
          bg: '#16A34A',
          text: '#15803D',
        },
        coral: {
          bg: '#EF4444',
          text: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
