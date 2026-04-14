import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#8b5cf6',
          700: '#6d28d9'
        }
      }
    }
  },
  plugins: []
};

export default config;
