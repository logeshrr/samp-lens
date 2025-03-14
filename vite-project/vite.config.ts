import { defineConfig } from 'vite';

export default defineConfig({
  base: 'samp-lens', // Keep your GitHub repo name if needed
  server: {
    host: true,  // This exposes the Vite server on your local network
  },
});