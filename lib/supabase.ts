import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!url) throw new Error('EXPO_PUBLIC_SUPABASE_URL is not set')
if (!anonKey) throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY is not set')

export const supabase: SupabaseClient<Database> = createClient<Database>(url, anonKey, {
  auth: {
    // Supabase Auth is not used for login — dive-link handles identity.
    // We pass the dive-link access token as a custom JWT so RLS can verify
    // auth.uid() === dive-link user UUID. autoRefreshToken must be false
    // because token refresh is handled by the dive-link API, not Supabase.
    autoRefreshToken: false,
    persistSession: false,
    detectSessionFromUrl: false,
  },
  global: {
    headers: {
      'X-Client': 'divelink-mobile',
    },
  },
})

/**
 * Set (or clear) the dive-link access token on the Supabase client so all
 * subsequent requests include it in the Authorization header and RLS policies
 * can resolve `auth.uid()` to the correct dive-link user UUID.
 */
export function setSupabaseToken(accessToken: string | null): void {
  if (accessToken) {
    supabase.realtime.setAuth(accessToken)
    // Override the global Authorization header for REST calls
    ;(supabase as unknown as { rest: { headers: Record<string, string> } }).rest.headers[
      'Authorization'
    ] = `Bearer ${accessToken}`
  } else {
    supabase.realtime.setAuth(null)
    delete (supabase as unknown as { rest: { headers: Record<string, string> } }).rest.headers[
      'Authorization'
    ]
  }
}

export type { SupabaseClient }
