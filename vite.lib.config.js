import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'js/index.ts'),
      name: 'NanoVgZig',
      fileName: (format) => `nanovg.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: (assetInfo) => {
          // Keep WASM files with their original name for easier debugging
          if (assetInfo.name?.endsWith('.wasm')) {
            return 'nanovg.wasm'
          }
          return assetInfo.name || 'assets/[name].[ext]'
        }
      }
    },
    outDir: 'dist',
    // Don't inline WASM files - keep them as separate assets
    assetsInlineLimit: 0
  }
}) 