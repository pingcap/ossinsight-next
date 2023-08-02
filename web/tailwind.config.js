const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../packages/*/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../widgets/*/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-reverse': 'var(--color-primary-reverse)',
        'primary-highlighted': 'var(--color-primary-highlighted)',
        disabled: 'var(--color-disabled)',
      },
      backgroundColor: {
        body: 'var(--background-color-body)',
        toolbar: 'var(--background-color-toolbar)',
        popover: 'var(--background-color-popover)',
        control: 'var(--background-color-control)',
      },
      textColor: {
        title: 'var(--text-color-title)',
        subtitle: 'var(--text-color-subtitle)',
        content: 'var(--text-color-content)',
        active: 'var(--text-color-active)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderColor: {
        DEFAULT: 'var(--border-color-default)',
      },
      boxShadow: {
        control: '0 0 0 2px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [],
}
