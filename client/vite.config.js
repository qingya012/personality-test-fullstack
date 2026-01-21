import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: '/scent-personality-quiz/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: 'index.html' // 显式指定入口
    }
  },

  server: {
    proxy: {
      "/api": "http://localhost:3001"
    }
  }
});