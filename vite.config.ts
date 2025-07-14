import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Configuramos un alias para importar desde la carpeta src más fácilmente
      // Ejemplo: import Component from '@/components/MyComponent'
      "@": path.resolve(__dirname, "./src"),
    },
  },
})