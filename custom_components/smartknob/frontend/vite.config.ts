import { defineConfig } from 'vite';

export default defineConfig({
  //add @ for src folder in vite config file

  build: {
    outDir: './dist',
    rollupOptions: {
      input: 'src/smartknob-panel.ts',
      output: {
        dir: 'dist',
        format: 'iife',
        sourcemap: false,
        entryFileNames: 'smartknob-panel.js',
      },
    },
  },
});
