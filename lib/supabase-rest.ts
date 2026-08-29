const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const publicSupabaseUrl = 'https://ygbzwrlvcenydolzelol.supabase.co'
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_0-bsRSr4kWrmqRYWiGB15A_3pFymfJE'

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey)
}

export async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase environment variables are not configured')
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Supabase request failed (${response.status}): ${details}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export async function supabasePublicRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${publicSupabaseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Supabase public request failed (${response.status})`)
  }

  return response.json() as Promise<T>
}
