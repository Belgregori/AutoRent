import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://localhost:50255',
=======
        target: 'http://localhost:58696',
>>>>>>> 8566807dbf0ab35bed2f27f644bc3c2e309ed07f
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
