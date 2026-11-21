/**
 * Centralized API client for communicating with Netlify Serverless Functions
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('/') ? endpoint : `/api/${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorBody.message || `API Error: ${response.status}`)
  }

  return response.json()
}
