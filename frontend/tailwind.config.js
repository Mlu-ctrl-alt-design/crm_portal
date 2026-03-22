// Tailwind CSS v4 configuration.
//
// In Tailwind v4 most configuration is done via CSS @theme directives in your
// global.css file rather than here. This file is kept for plugin registration
// and content-path overrides.
//
// For design tokens (colors, spacing, typography) see:
//   src/assets/global.css → @theme block
//
// When Untitled UI React is installed, import its token preset here:
//   import untitledUiPreset from "@untitled-ui/react/tailwind";
//   See: https://www.untitledui.com/react/docs

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
