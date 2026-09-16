import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/costa-rica-app/',
  plugins: [react(), tailwindcss()],
})
