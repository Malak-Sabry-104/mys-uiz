import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

console.log('✅ Vite config loaded');


export default defineConfig({
  base: '/mys-uiz/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})