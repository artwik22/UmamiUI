import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        m3: {
          background: "var(--m3-background)",
          surface: "var(--m3-surface)",
          surfaceVariant: "var(--m3-surface-variant)",
          primary: "var(--m3-primary)",
          primaryContainer: "var(--m3-primary-container)",
          onPrimary: "var(--m3-on-primary)",
          onPrimaryContainer: "var(--m3-on-primary-container)",
          secondary: "var(--m3-secondary)",
          secondaryContainer: "var(--m3-secondary-container)",
          tertiary: "var(--m3-tertiary)",
          tertiaryContainer: "var(--m3-tertiary-container)",
          onSurface: "var(--m3-on-surface)",
          onSurfaceVariant: "var(--m3-on-surface-variant)",
          outline: "var(--m3-outline)",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      borderRadius: {
        'xl': '8px',
        '2xl': '12px',
      },
      boxShadow: {
        'm3-elevated': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'm3-floating': '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;
