import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#01cf81',
          secondary: '#fdd989',
          dark: '#00b990',
          muted: '#707b75'
        }
      },
      boxShadow: {
        card: '0 10px 40px rgba(0,0,0,0.08)'
      }
    }
  },
  plugins: []
};

export default config;
