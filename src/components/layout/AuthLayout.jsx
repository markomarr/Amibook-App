import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function AuthLayout() {
  const { user } = useAuthStore()

  // Jika sudah login, redirect ke beranda
  if (user) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-body selection:bg-primary-dim/20 selection:text-primary-dim bg-background text-on-background">
      {/* Ambient Background Depth (Organic Intentionality) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-purple-200/40 opacity-60 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-100/40 opacity-40 blur-[120px]"></div>
      </div>

      {/* Top Corner Language Toggle */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <span className="font-label text-sm font-bold text-primary-800 cursor-pointer hover:text-primary-600 transition-colors">ID</span>
          <div className="w-[1px] h-4 bg-slate-200"></div>
          <span className="font-label text-sm font-medium text-slate-500 cursor-pointer hover:text-primary-800 transition-colors">EN</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 w-full max-w-7xl mx-auto">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Branding / Context Column */}
          <div className="flex flex-col space-y-6 md:pr-8 text-center md:text-left">
            <div className="inline-flex items-center justify-center md:justify-start space-x-3 mb-2">
              <span className="material-symbols-outlined text-primary-800 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_library</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary-900 to-primary-600 leading-tight">
              AMIBOOK
            </h1>
            
            <p className="font-body text-slate-600 text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
              Akses kurasi literatur akademis eksklusif. Temukan wawasan mendalam untuk mendukung perjalanan riset dan studi Anda.
            </p>
            
            {/* Decorative Scholarly Element */}
            <div className="hidden md:block mt-8 w-24 h-1 bg-gradient-to-r from-primary-600 to-transparent rounded-full"></div>
          </div>

          {/* Login Form Card Container */}
          <div className="relative w-full max-w-md mx-auto md:mx-0">
            {/* Ghost Border Layer */}
            <div className="absolute inset-0 bg-primary-100 rounded-2xl translate-y-3 translate-x-3"></div>
            
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_32px_rgba(64,36,69,0.04)] border border-slate-50 relative z-10 flex flex-col space-y-8">
              <Outlet />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}
