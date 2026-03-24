import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  root: process.env.VITEST ? '.' : 'playground',
  build: process.env.PLAYGROUND
    ? { outDir: resolve(__dirname, 'site'), emptyOutDir: true }
    : {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['es'], fileName: 'vue-kit' },
        rollupOptions: { external: ['vue'] },
      },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.test.ts', 'src/index.ts'],
      thresholds: { lines: 85, functions: 80, branches: 75 },
    },
  },
})
