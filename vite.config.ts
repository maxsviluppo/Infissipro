import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' ensures we load all env vars, not just VITE_*
  // Fix: Cast process to any because the Process type definition might be missing cwd() in this context
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // On Vercel, system env vars are in process.env. We merge them to be safe.
  const apiKey = env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // This injects the value of API_KEY into the code at build time.
      // NOTE: You must add API_KEY in Vercel Project Settings > Environment Variables
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});