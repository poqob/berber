/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        primary: '#FFB300',
        success: '#4CAF50',
        destructive: '#CF6679',
        'text-main': 'var(--color-text-main)',
        'text-muted': 'var(--color-text-muted)',
        'border-color': 'var(--color-border)',
        'chip-border': 'var(--color-chip-border)',
        overlay: 'var(--color-overlay)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'card-gap': '12px',
      },
      minWidth: {
        'touch': '48px',
      },
      minHeight: {
        'touch': '48px',
      },
    },
  },
  plugins: [],
}
