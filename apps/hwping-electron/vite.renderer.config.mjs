import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const studioPkg = JSON.parse(readFileSync(resolve(ROOT, 'rhwp-studio', 'package.json'), 'utf-8'));

export default defineConfig({
  root: resolve(ROOT, 'rhwp-studio'),
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(studioPkg.version),
  },
  resolve: {
    alias: {
      '@': resolve(ROOT, 'rhwp-studio', 'src'),
      '@wasm': resolve(ROOT, 'pkg'),
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist', 'renderer'),
    emptyOutDir: false,
    rollupOptions: {
      input: {
        index: resolve(ROOT, 'rhwp-studio', 'index.html'),
      },
    },
    assetsInlineLimit: 0,
  },
  server: {
    host: '0.0.0.0',
    port: 7703,
    fs: {
      allow: [ROOT],
    },
  },
});
