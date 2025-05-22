import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths(), tsconfigPaths()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
      }
    }
  },
  build: {
         chunkSizeWarningLimit: 1000,
  }
})
