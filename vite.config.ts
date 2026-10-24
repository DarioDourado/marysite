import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // Dependências só usadas em rotas lazy (admin): pré-otimizadas para o Vite não recarregar a meio
    optimizeDeps: {
      include: ['react-hook-form', '@hookform/resolvers/zod', '@tiptap/react', '@tiptap/starter-kit', 'dompurify', 'axios'],
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      // API e media no mesmo domínio em desenvolvimento: sem CORS e o cookie de refresh funciona
      proxy: {
        '/api/v1': process.env.API_PROXY_TARGET ?? 'http://localhost:8000',
        '/media': process.env.API_PROXY_TARGET ?? 'http://localhost:8000',
      },
    },
  };
});
