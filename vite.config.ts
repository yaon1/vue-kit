import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  root: process.env.VITEST ? '.' : 'playground',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['es'], fileName: 'vue-kit' },
    rollupOptions: { external: ['vue'] },
  },
  test: { environment: 'jsdom', globals: true },
})
