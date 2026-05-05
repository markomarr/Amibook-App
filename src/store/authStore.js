import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,

  // Set session awal dari Supabase
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),

  // Fetch profile user dari tabel profiles
  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      set({ profile: data })
    }
  },

  // Login dengan email & password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  // Register user baru
  signUp: async ({ email, password, fullName, nim }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, nim },
      },
    })
    if (error) throw error
    return data
  },

  // Logout
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },

  // Cek apakah user adalah admin
  isAdmin: () => get().profile?.role === 'admin',
}))
