import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  server: {
    host: true,
  },
  root: './src',
  publicDir: '../public',
});
