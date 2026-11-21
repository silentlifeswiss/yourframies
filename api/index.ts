import type { IncomingMessage, ServerResponse } from 'http'
import { handler } from '../netlify/functions/api.ts'

export default async function vercelHandler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  const protocol = (req.headers['x-forwarded-proto'] as string) || 'https'
  const host = req.headers.host || 'localhost'
  const fullUrl = new URL(req.url || '/', `${protocol}://${host}`)

  // Extract query parameters
  const queryStringParameters: Record<string, string> = {}
  fullUrl.searchParams.forEach((val, key) => {
    queryStringParameters[key] = val
  })

  // Normalize request body
  let bodyStr: string | null = null
  if (req.body !== undefined && req.body !== null) {
    bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
  } else if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      const chunks: Buffer[] = []
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
      }
      if (chunks.length > 0) {
        bodyStr = Buffer.concat(chunks).toString('utf-8')
      }
    } catch {
      // Ignore body read errors
    }
  }

  const event = {
    path: fullUrl.pathname,
    httpMethod: (req.method || 'GET').toUpperCase(),
    headers: req.headers as Record<string, string>,
    queryStringParameters,
    body: bodyStr,
  }

  try {
    const result = await handler(event as any, {} as any)

    if (result.headers) {
      Object.entries(result.headers).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          res.setHeader(k, v)
        }
      })
    }

    res.statusCode = result.statusCode || 200
    res.end(result.body || '')
  } catch (err: any) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }))
  }
}
