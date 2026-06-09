import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 경로 추가용
import tsconfigPaths from 'vite-tsconfig-paths' // 경로 추가용
import tailwindcss from '@tailwindcss/vite'  // tailwind 용

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tsconfigPaths(),tailwindcss()], // tailwindcss() 추가!
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 경로 추가용
    },
  },
})