import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      'yjs',
      'y-monaco',
      'y-protocols/awareness', //  Forces Vite to discover and compile this hidden path
      'monaco-editor' // Forces Vite to optimize monaco properly
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Points y-monaco's deep import directly to the main monaco entry point
      'monaco-editor/esm/vs/editor/editor.api.js': 'monaco-editor',
      'monaco-editor/esm/vs/editor/editor.api': 'monaco-editor'
    },
  },
})
