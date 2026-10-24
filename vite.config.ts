import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) return 'charts';
          if (id.includes('node_modules/react-router')) return 'router';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor';
        },
      },
    },
  },
})
