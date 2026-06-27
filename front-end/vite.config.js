import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
    "/api": {
      target: "http://blog_backend:5000", // ✅ correct
      changeOrigin: true,
      secure: false
    }
  }
}
})