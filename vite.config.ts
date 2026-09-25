import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** The admin page lives in public/admin. Serve it at /admin/ in dev, as the production host does. */
const adminPage = (): Plugin => ({
  name: 'admin-page',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      // The project has no Node typings, so `req` is typed without `url`.
      const request = req as unknown as { url?: string }
      if (request.url === '/admin' || request.url === '/admin/') request.url = '/admin/index.html'
      next()
    })
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), adminPage()],
})
