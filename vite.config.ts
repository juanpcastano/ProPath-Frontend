import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', 
  },
  test: {
    environment: 'jsdom', // Configura el entorno de pruebas para simular un navegador
    globals: true, // Permite usar expect, describe, test, etc. sin importarlos en cada archivo
    setupFiles: ['./src/setupTests.ts'],
    css: true
  }
});
