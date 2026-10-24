/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#287C76',
          light: '#55AAA1',
          dark: '#1F5E5A',
          50: '#F0F7F6',
          100: '#E0EFEE',
        },
        accent: {
          yellow: '#FFF5AE',
        },
        brand: {
          bg: '#F8FAF9',
          text: '#263238',
          muted: '#607D8B',
          border: '#E0E7E6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(40,124,118,0.08)',
        'card-hover': '0 8px 24px rgba(40,124,118,0.12)',
        modal: '0 20px 60px rgba(0,0,0,0.15)',
        navbar: '0 1px 4px rgba(0,0,0,0.08)',
      },
      width: {
        sidebar: '240px',
        'sidebar-collapsed': '72px',
      },
      height: {
        navbar: '64px',
      },
    },
  },
  plugins: [],
}
