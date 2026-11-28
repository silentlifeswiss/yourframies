import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function netlifyFunctionsPlugin(): Plugin {
  return {
    name: 'netlify-functions-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url.startsWith('/api') || req.url.startsWith('/.netlify/functions'))) {
          try {
            // Dynamically import the handler
            const { handler } = await import('./netlify/functions/api.ts')

            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })

            req.on('end', async () => {
              const host = req.headers.host || 'localhost:5173'
              const urlObj = new URL(req.url!, `http://${host}`)
              const queryStringParameters: Record<string, string> = {}
              urlObj.searchParams.forEach((val, key) => {
                queryStringParameters[key] = val
              })

              const event = {
                path: urlObj.pathname,
                httpMethod: req.method || 'GET',
                headers: req.headers as Record<string, string>,
                queryStringParameters,
                body: body || null,
                isBase64Encoded: false,
              }

              const result: any = await handler(event as any, {} as any)
              if (result) {
                res.statusCode = result.statusCode || 200
                if (result.headers) {
                  for (const [k, v] of Object.entries(result.headers)) {
                    res.setHeader(k, v as string)
                  }
                }
                res.end(result.body || '')
                return
              }
              next()
            })
            return
          } catch (err: any) {
            console.error('Local Function Execution Error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: err.message }))
            return
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), netlifyFunctionsPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor-charts'
            if (id.includes('lucide-react')) return 'vendor-icons'
            if (id.includes('react-router')) return 'vendor-router'
          }
        },
      },
    },
  },
})
