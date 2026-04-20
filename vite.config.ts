import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('recharts')) return 'recharts'
          if (id.includes('framer-motion')) return 'framer'
          if (id.includes('xlsx')) return 'xlsx'
          if (id.includes('@tanstack/react-query')) return 'query'
        },
      },
    },
  },
})
