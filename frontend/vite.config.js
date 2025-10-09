import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/admin/login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/admin/statistics': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/admin/events': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/api/events': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/admin/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/admin/attendances': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/admin/participants': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/admin/registrations': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/admin/events/*': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    }
  }
})
