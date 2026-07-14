import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes built asset paths relative, so the app works whether it's
// served from a domain root or a GitHub Pages project subpath like
// username.github.io/repo-name/ without needing to hardcode the repo name.
export default defineConfig({
  base: './',
  plugins: [react()],
})
