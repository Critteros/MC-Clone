/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: 'CNAME',
          dest: '',
        },
      ],
    }),
  ],
  base: '/',
  test: {
    setupFiles: ['./src/setupTests.ts'],
    environment: 'jsdom',
    globals: true,
  },
});
