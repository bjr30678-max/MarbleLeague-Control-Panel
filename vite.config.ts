import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [react()],
    server: {
      port: 5174,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'https://api.bjr8888.com',
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: env.VITE_WS_URL || 'https://api.bjr8888.com',
          changeOrigin: true,
          ws: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-core': ['react', 'react-dom'],
            'antd-core': ['antd'],
            'utils': ['axios', 'socket.io-client'],
          },
        },
      },
      minify: 'esbuild',
      target: 'es2015',
    },
  };
});
