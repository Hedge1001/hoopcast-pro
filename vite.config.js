import { defineConfig } from sb-2w8b360mtstd.vercel.r
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
