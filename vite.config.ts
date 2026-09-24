import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Bibliotecas em arquivos próprios: mudam raramente, então o navegador reaproveita
        // o cache delas quando só o conteúdo das trilhas muda entre deploys.
        codeSplitting: {
          groups: [
            { name: 'three', test: /node_modules[\/]three[\/]/ },
            { name: 'r3f', test: /node_modules[\/](@react-three|three-stdlib|@monogrid|its-fine|suspend-react|zustand)[\/]/ },
            { name: 'react', test: /node_modules[\/](react|react-dom|scheduler)[\/]/ },
          ],
        },
      },
    },
  },
})
