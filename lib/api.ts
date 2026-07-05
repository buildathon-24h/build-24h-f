import { createClient } from './client'

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Error thrown when the gateway responds with a non-2xx status.
 * Carries the HTTP status so callers can branch on it (e.g. 401).
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Pull the freshest access token from the active Supabase session.
 * `getSession()` returns the auto-refreshed token, so headers never go stale.
 */
async function getAccessToken(): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

/**
 * On 401 the session is no longer accepted by the gateway: clear it and
 * bounce the user back to the auth entry point.
 */
async function handleUnauthorized(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
  if (typeof window !== 'undefined') {
    window.location.href = '/auth'
  }
}

/**
 * Thin fetch wrapper against the NestJS gateway. Attaches the Supabase
 * Bearer token to every request and centralizes 401 handling.
 */
export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  if (!API_URL) {
    throw new ApiError(0, 'NEXT_PUBLIC_API_URL is not configured')
  }

  const token = await getAccessToken()
  const headers = new Headers(init.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })

  if (response.status === 401) {
    await handleUnauthorized()
    throw new ApiError(401, 'Session expired, please sign in again')
  }

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof payload === 'string' ? payload : (payload?.message ?? 'Request failed')
    throw new ApiError(response.status, message, payload)
  }

  return payload as T
}

/** POST /chat — sends a prompt to the gateway (proxied to n8n). */
export function sendChat<T = unknown>(prompt: string): Promise<T> {
  return apiFetch<T>('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
}

/** POST /documents — uploads a single file (multipart). */
export function uploadDocument<T = unknown>(file: File): Promise<T> {
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch<T>('/documents', { method: 'POST', body: formData })
}
