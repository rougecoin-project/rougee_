import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const {resolve} = require('path');

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  publicDir: 'assets',
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    outDir: 'dist-umd',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'pixie.umd.tsx'),
      name: 'Pixie',
      formats: ['umd'],
      fileName: () => 'pixie.umd.js',
    },
  },
  plugins: [react()],
});
