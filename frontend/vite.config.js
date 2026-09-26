import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

const target = process.env.API_TARGET || 'http://backend:8000'

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    proxy: { '/api': target },
  },
})