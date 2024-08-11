import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd());

  const targetUrl = env.VITE_SERVER_URL || 'http://localhost:4000';

  return {
    plugins: [react()],
    server: {
      host: true,
      proxy: {
        '/api': {
          target: targetUrl,
          secure: false,
          changeOrigin: true,
        }
      }
    }
  };
});