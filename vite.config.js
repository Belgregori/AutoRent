import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:53781',
        changeOrigin: true,
        secure: false,
      },
      '/imagenes': {
        target: 'http://localhost:53781',
        changeOrigin: true,
        secure: false,
      },
      '/usuarios': {                     
        target: 'http://localhost:53781',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:53781',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
