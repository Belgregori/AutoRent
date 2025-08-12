import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:56621',
        changeOrigin: true,
        secure: false,
      },
      '/imagenes': {
        target: 'http://localhost:56621',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
