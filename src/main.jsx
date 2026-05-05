import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { router } from '@/router'
import { isSupabaseConfigured, supabaseConfigMessage } from '@/lib/supabase'
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {isSupabaseConfigured ? <RouterProvider router={router} /> : <EnvConfigScreen />}
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
