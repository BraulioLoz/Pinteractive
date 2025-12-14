import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Base path for GitHub Pages deployment
  // Default to /Pinteractive/ for production, / for development
  const base = mode === 'production' 
    ? (process.env.VITE_BASE_PATH || '/Pinteractive/')
    : '/';
  
  return {
    plugins: [react()],
    base: base,
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
