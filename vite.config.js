import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar node_modules en diferentes chunks
          if (id.includes('node_modules')) {
            // React y librerías relacionadas
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            
            // Material-UI y Emotion
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui-vendor';
            }
            
            // React Query y otras librerías de estado/data
            if (id.includes('@tanstack') || id.includes('react-hot-toast') || id.includes('react-magic-motion')) {
              return 'react-libs';
            }
            
            // Recharts (librería de gráficos pesada)
            if (id.includes('recharts')) {
              return 'charts';
            }
            
            // Axios y utilidades
            if (id.includes('axios') || id.includes('date-fns') || id.includes('jwt-decode')) {
              return 'utils';
            }
            
            // Resto de dependencias
            return 'vendor';
          }
        },
      },
    },
    // Aumentar el límite de advertencia a 1MB
    chunkSizeWarningLimit: 1000,
  },
})
