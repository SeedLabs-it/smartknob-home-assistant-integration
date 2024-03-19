import { defineConfig } from 'vite';
import daisyUiThemes from 'daisyui/src/theming/themes';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react';

const daisyUiFormattedThemes = Object.entries(daisyUiThemes).map(([k, v]) => ({
  theme: k.match(/theme=([-\w]+)/)[1],
  scheme: v['color-scheme'],
}));

daisyUiFormattedThemes.sort((a, b) =>
  `${a.scheme}${a.theme}`.localeCompare(`${b.scheme}${b.theme}`),
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    checker({
      typescript: true,
    }),
  ],
  define: {
    CARD_VERSION: JSON.stringify(process.env.npm_package_version),
    DAISYUI_CDN_URL:
      '"https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css"',
    DAISYUI_THEMES: daisyUiFormattedThemes,
  },
  build: {
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        dir: 'dist',
        entryFileNames: 'smartknob-integration.js',
        manualChunks: undefined,
      },
    },
  },
});
