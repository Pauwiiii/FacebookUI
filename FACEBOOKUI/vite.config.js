import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy requests starting with /api to the Spring Boot backend at localhost:8080
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
});