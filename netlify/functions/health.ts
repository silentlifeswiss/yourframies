import type { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status: 'healthy',
      service: 'yourframies-api',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }),
  }
}
