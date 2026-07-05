import { createBrowserClient } from '@supabase/ssr'

import { getSupabaseEnv } from './supabase-config'

export function createClient() {
  const env = getSupabaseEnv()

  if (!env) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
    )
  }

  return createBrowserClient(env.url, env.key)
}
