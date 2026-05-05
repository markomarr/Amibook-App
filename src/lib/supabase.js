import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabaseConfigMessage =
  'Supabase URL dan Anon Key belum diisi. ' +
  'Salin file .env.example ke .env lalu isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.'

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
  : null

export function assertSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(supabaseConfigMessage)
  }
}
