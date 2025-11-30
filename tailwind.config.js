import fs from "fs";

/** @type {import('tailwindcss').Config} */

let theme = {};
try {
  const themePath = "./theme.json";

  if (fs.existsSync(themePath)) {
    theme = JSON.parse(fs.readFileSync(themePath, "utf-8"));
  }
} catch (err) {
  console.error('failed to parse custom styles', err)
}

const defaultTheme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  extend: {
    // Colors using CSS variables defined in index.css
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      card: {
        DEFAULT: "var(--card)",
        foreground: "var(--card-foreground)",
      },
      popover: {
        DEFAULT: "var(--popover)",
        foreground: "var(--popover-foreground)",
      },
      primary: {
        DEFAULT: "var(--primary)",
        foreground: "var(--primary-foreground)",
      },
      secondary: {
        DEFAULT: "var(--secondary)",
        foreground: "var(--secondary-foreground)",
      },
      muted: {
        DEFAULT: "var(--muted)",
        foreground: "var(--muted-foreground)",
      },
      accent: {
        DEFAULT: "var(--accent)",
        foreground: "var(--accent-foreground)",
      },
      destructive: {
        DEFAULT: "var(--destructive)",
        foreground: "var(--destructive-foreground)",
      },
      border: "var(--border)",
      input: "var(--input)",
      ring: "var(--ring)",
      chart: {
        1: "var(--chart-1)",
        2: "var(--chart-2)",
        3: "var(--chart-3)",
        4: "var(--chart-4)",
        5: "var(--chart-5)",
      },
    },
    borderRadius: {
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      "2xl": "var(--radius-2xl)",
      full: "var(--radius-full)",
    },
  },
  darkMode: ["selector", ".dark"],
}

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { ...defaultTheme, ...theme },
};