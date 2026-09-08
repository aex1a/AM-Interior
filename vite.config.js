import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves project repos at https://<user>.github.io/<repo>/,
  // so every built asset path needs this prefix. If you ever move to a
  // custom domain or a user/org page (username.github.io), change this back to '/'.
  base: '/AM-Interior/',
  plugins: [react(), tailwindcss()],
})
