/**
 * Vite configuration for Transformers.js
 * Ensures proper WASM and model loading
 */

import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@xenova/transformers']
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  }
});
