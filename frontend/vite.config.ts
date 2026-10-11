import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      types: path.resolve(__dirname, './src/types'),
      contexts: path.resolve(__dirname, './src/contexts'),
      components: path.resolve(__dirname, './src/components'),
      utils: path.resolve(__dirname, './src/utils'),
      reducers: path.resolve(__dirname, './src/reducers'),
      hooks: path.resolve(__dirname, './src/hooks'),
    },
  },
})