import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { router } from '@/router'
import { isSupabaseConfigured, supabaseConfigMessage, supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 menit
      retry: 1,
    },
  },
})

function EnvConfigScreen() {
  return (
    <div className="min-h-screen app-shell flex items-center justify-center p-6">
      <div className="card p-8 max-w-xl w-full">
        <h1 className="text-2xl font-display font-bold text-ink">Konfigurasi Dibutuhkan</h1>
        <p className="text-sm text-ink-muted mt-2">{supabaseConfigMessage}</p>
        <pre className="mt-4 panel-soft p-4 text-xs text-ink-muted overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key`}
        </pre>
      </div>
    </div>
  )
}

// Global auth listener — ensures auth state is tracked everywhere
function AuthProvider({ children }) {
  const { setUser, setLoading, fetchProfile } = useAuthStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) fetchProfile(currentUser.id)
      setLoading(false)
      setReady(true)
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) fetchProfile(currentUser.id)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-700 border-t-transparent"></div>
      </div>
    )
  }

  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {isSupabaseConfigured ? (
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      ) : (
        <EnvConfigScreen />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '14px',
            borderRadius: '10px',
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)
