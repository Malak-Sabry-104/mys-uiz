import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

console.log('✅ Vite config loaded');


export default defineConfig({
  base: '/mys-uiz/',
  plugins: [
    tailwindcss(),
  ],
})