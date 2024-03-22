import { defineConfig } from 'vite';

export default defineConfig({
  //output FILE NAME

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
