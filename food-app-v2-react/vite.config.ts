import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
  port: 6970,
  strictPort: true,
 },
 server: {
    watch: {
      usePolling: true,
    },
    fs: {
      cachedChecks: false
    },
    port: 6970,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8080",
 },
 
})
