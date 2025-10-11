import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: false
  },
  preview: {
    port: 4173
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
}) 