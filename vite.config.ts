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
    build: {
      rollupOptions: {
        output: {
          // - bibliotecas que quase nunca mudam ficam em ficheiros próprios: uma alteração ao código
          //   do site não obriga a descarregar outra vez o React, o router ou o motion
          manualChunks: (id: string) => {
            const lib = /node_modules\/((?:@[^/]+\/)?[^/]+)/.exec(id)?.[1];
            if (!lib) return undefined;
            if (/^(react|react-dom|scheduler|react-router|react-router-dom)$/.test(lib)) return 'vendor-react';
            if (/^(motion|motion-dom|motion-utils|framer-motion)$/.test(lib)) return 'vendor-motion';
            if (/^(@tanstack\/(react-query|query-core)|axios|zod|i18next|react-i18next|i18next-browser-languagedetector)$/.test(lib)) return 'vendor-data';
            return undefined;
          },
        },
      },
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
