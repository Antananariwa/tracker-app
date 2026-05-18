import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const cookieStorage = {
  getItem: (key: string): string | null => {
    const prefix = encodeURIComponent(key) + '='
    const match = document.cookie
      .split('; ')
      .find(row => row.startsWith(prefix))
    if (!match) return null
    const value = match.substring(prefix.length)
    return decodeURIComponent(value)
  },
  setItem: (key: string, value: string): void => {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie =
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}` +
      `; path=/; SameSite=Lax${secure}`
  },
  removeItem: (key: string): void => {
    document.cookie =
      `${encodeURIComponent(key)}=; path=/; max-age=0; SameSite=Lax`
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})