/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      white: '#FFFFFF',
      blue: {
        0: '#0069E4',
        1: '#64AEC6',
        4: '#CCE1FA',
      },
      gray: {
        0: '#FFFFFF',
        1: '#F9FAFB',
        2: '#F3F4F6',
        3: '#E5E7EB',
        4: '#D1D5DB',
        5: '#DADDE0',
        6: '#6B7280',
        7: '#374151',
        8: '#111827',
        9: '#D6D9DF',
        10: '#BCC0C5',
        11: '#77848D',
        12: '#455764',
        13: '#F5F5F5',
      },
      'blue-gray': '#64748B',
      dark: {
        primary: 'rgba(17, 24, 39, 0.96)',
        secondary: 'rgba(17, 24, 39, 0.64)',
        tertiary: 'rgba(17, 24, 39, 0.42)',
      },
      light: {
        primary: 'rgba(255, 255, 255, 0.96)',
        secondary: 'rgba(255, 255, 255, 0.64)',
        tertiary: 'rgba(255, 255, 255, 0.42)',
      },
      primary: {
        1: '#FFFAF3',
        2: '#FEE7C3',
        3: '#FCD396',
        4: '#F7BF6A',
        5: '#F1AB40',
        6: '#615A50',
        7: '#64AEC6',
      },
      yellow: {
        1: '#EBAB2E',
        2: '#ECB347',
        3: '#D39A2A',
        4: '#F3C572',
      },
      green: {
        1: '#F0F8F6',
        2: '#B4DED4',
        3: '#78C2B0',
        4: '#3DA58C',
        5: '#63BE96',
        6: '#024E3C',
      },
      red: {
        1: '#FEF2F1',
        2: '#F9BEB9',
        3: '#F38C84',
        4: '#EA5C51',
        5: '#DF2D20',
        6: '#811A13',
      },
      transparent: 'transparent',
    },
    fontFamily: {
      heading: ['Circular', 'sans-serif'],
      body: ['Circular', 'sans-serif'],
    },
    fontWeight: {
      regular: 450,
      bold: 700,
      medium: 500,
    },
    fontSize: {
      // body font sizes
      xs: [
        '12px',
        {
          lineHeight: '16px',
          letterSpacing: '0.01em',
        },
      ],
      sm: [
        '14px',
        {
          lineHeight: '18px',
          letterSpacing: '0.005em',
          fontWeight: '450',
        },
      ],
      md: [
        '16px',
        {
          lineHeight: '20px',
          letterSpacing: '0em',
        },
      ],
      lg: [
        '18px',
        {
          lineHeight: '24px',
          letterSpacing: '0em',
        },
      ],
      // heading font sizes
      'h-xs': [
        '16px',
        {
          lineHeight: '20px',
          fontWeight: '700',
          letterSpacing: '0.01em',
        },
      ],
      'h-sm': [
        '20px',
        {
          lineHeight: '24px',
          fontWeight: '700',
          letterSpacing: '0.01em',
        },
      ],
      'h-md': [
        '24px',
        {
          lineHeight: '28px',
          fontWeight: '700',
          letterSpacing: '0em',
        },
      ],
      'h-lg': [
        '34px',
        {
          lineHeight: '36px',
          fontWeight: '700',
          letterSpacing: '-0.005em',
        },
      ],
    },
    extend: {
      animation: {
        'fade-in': 'fade-in 0.25s ease',
      },
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
            transform: 'scale(0.9) translate(-0.5em, -0.5em)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1) translate(0, 0)',
          },
        },
      },
    },
  },
  plugins: [],
}
